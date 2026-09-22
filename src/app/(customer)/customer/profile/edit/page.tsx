// [메뉴] 헤더 프로필 메뉴 > 프로필 수정
// [페이지] 프로필 수정
'use client';

import { useMemo } from 'react';

import type { CustomerProfileEditFormValues } from '@/types/customerProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/hooks/common/useToast';
import type { CustomerProfileEditPlan } from '@/hooks/customer/customerProfileEditPlan';
import { authKeys } from '@/hooks/queries/auth/keys';
import {
  useUpdateMeMutation,
  useUpdatePasswordMutation,
} from '@/hooks/queries/auth/mutations';
import { customerProfileKeys } from '@/hooks/queries/customerProfile/keys';
import { useUpdateCustomerProfileMutation } from '@/hooks/queries/customerProfile/mutations';
import { useCustomerProfileQuery } from '@/hooks/queries/customerProfile/queries';

import CustomerProfileEditForm from '@/components/customer/CustomerProfileEditForm';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function ProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { data: profile, isPending: isProfilePending } =
    useCustomerProfileQuery();
  const updateMeMutation = useUpdateMeMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();
  const updateProfileMutation = useUpdateCustomerProfileMutation();

  /*
  @ 수정 폼 초기값
  - 이름·이메일·전화번호·provider는 AuthProvider의 GET /auth/me 결과를 사용한다.
  - 이미지·지역·서비스는 GET /customer/profile 결과를 사용한다.
  - 비밀번호는 보안상 어떤 API에서도 조회하지 않고 항상 빈 문자열로 시작한다.
  - useMemo로 객체를 안정화해 조회된 초기값이 폼 최초 마운트에 그대로 사용되게 한다.
  */
  const defaultValues = useMemo<CustomerProfileEditFormValues | undefined>(
    () =>
      user && profile
        ? {
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber ?? '',
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
            profileImage: undefined,
            serviceTypes: profile.serviceTypes,
            region: profile.region,
          }
        : undefined,
    [profile, user],
  );

  if (isProfilePending || !user || !profile || !defaultValues) {
    return <LoadingDisplay />;
  }

  const isSubmitting =
    updateMeMutation.isPending ||
    updatePasswordMutation.isPending ||
    updateProfileMutation.isPending;

  /*
  @ 변경된 영역을 안전한 순서로 저장
  - 폼 버튼과 페이지가 동일한 CustomerProfileEditPlan을 사용해 변경 판단 불일치를 막는다.
  - account/profile/password 중 값이 있는 영역의 API만 호출한다.
  - 기본 정보 → 고객 프로필 → 비밀번호 순서로 하나씩 요청한다.
  - 비밀번호는 성공하면 기존 currentPassword가 더 이상 유효하지 않으므로
    뒤의 다른 요청이 실패한 후 이전 비밀번호를 다시 보내지 않도록 항상 마지막에 요청한다.
  - 요청이 0개면 성공 토스트와 페이지 이동을 실행하지 않는다.
  */
  const handleSubmit = async (plan: CustomerProfileEditPlan) => {
    const completedSections: string[] = [];

    if (!plan.account && !plan.profile && !plan.password) {
      throw new Error('변경된 정보가 없어 수정 요청을 보내지 않았습니다.');
    }

    try {
      /*
      @ 1. 기본 정보 수정
      - 이름 또는 전화번호가 변경된 경우에만 PATCH /auth/me를 요청한다.
      - 성공하면 mutation이 Auth Query 캐시도 최신 응답으로 갱신한다.
      */
      if (plan.account) {
        await updateMeMutation.mutateAsync(plan.account);
        completedSections.push('기본 정보');
      }

      /*
      @ 2. 고객 프로필 수정
      - 프로필 이미지·지역·서비스 중 변경된 값이 있을 때만 PATCH /customer/profile을 요청한다.
      - 비밀번호보다 먼저 실행해 비밀번호 변경 후 다른 요청이 실패하는 상황을 막는다.
      */
      if (plan.profile) {
        await updateProfileMutation.mutateAsync(plan.profile);
        completedSections.push('프로필');
      }

      /*
      @ 3. 비밀번호 수정
      - 비밀번호가 성공적으로 변경되면 기존 currentPassword를 다시 사용할 수 없다.
      - 따라서 더 이상 뒤에서 실패할 수정 요청이 없도록 항상 마지막에 실행한다.
      */
      if (plan.password) {
        await updatePasswordMutation.mutateAsync(plan.password);
        completedSections.push('비밀번호');
      }
    } catch (error) {
      /*
      @ 부분 성공 안내
      - 앞선 요청이 성공한 뒤 다음 요청이 실패할 수 있다.
      - 이미 저장된 영역을 사용자에게 알려 전체 수정이 모두 실패한 것으로 오해하지 않게 한다.
      - 원래 오류는 다시 throw해 폼 훅이 서버 validation 오류를 해당 입력란에 표시하게 한다.
      */
      if (completedSections.length > 0) {
        showToast(
          `${completedSections.join('·')} 수정은 저장되었지만 나머지 수정은 완료되지 않았습니다.`,
        );
      }

      throw error;
    }

    /*
    @ 성공 후 서버 상태 재확인
    - mutation 성공 응답으로 관련 Query 캐시는 이미 갱신된 상태다.
    - invalidateQueries는 서버에 저장된 최종 값을 다시 확인하기 위한 후속 작업이다.
    - 이 재조회만 실패해도 이미 성공한 저장을 실패로 처리하지 않도록 allSettled를 사용한다.
    - 특히 비밀번호 저장 후 재조회 실패 때문에 예전 currentPassword를 다시 전송하는 문제를 막는다.
    */
    const refetches: Promise<unknown>[] = [];

    if (plan.account) {
      refetches.push(
        queryClient.invalidateQueries({ queryKey: authKeys.me() }),
      );
    }

    if (plan.account || plan.profile) {
      refetches.push(
        queryClient.invalidateQueries({
          queryKey: customerProfileKeys.detail(),
        }),
      );
    }

    await Promise.allSettled(refetches);

    showToast('프로필 수정이 완료되었습니다.');
    router.replace(ROUTES.customerHome);
  };

  return (
    <CustomerProfileEditForm
      defaultValues={defaultValues}
      provider={user.provider}
      imageUrl={profile.imgUrl ?? undefined}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      onCancel={() => router.push(ROUTES.customerHome)}
    />
  );
}
