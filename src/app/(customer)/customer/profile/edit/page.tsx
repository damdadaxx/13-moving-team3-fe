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
  @ 수정 계획에 포함된 영역만 저장
  - 폼 버튼과 페이지가 동일한 CustomerProfileEditPlan을 사용해 변경 판단 불일치를 막는다.
  - account/password/profile 중 값이 있는 영역의 API만 호출한다.
  - 서로 다른 API는 한 트랜잭션이 아니므로 allSettled로 모든 결과를 확인한다.
    하나라도 실패하면 화면에 남고, 성공한 요청의 Query 캐시는 mutation이 이미 갱신한다.
  - 요청이 0개면 성공 토스트와 페이지 이동을 실행하지 않는다.
  */
  const handleSubmit = async (plan: CustomerProfileEditPlan) => {
    const requests: Promise<unknown>[] = [];

    if (plan.account) {
      requests.push(updateMeMutation.mutateAsync(plan.account));
    }

    if (plan.password) {
      requests.push(updatePasswordMutation.mutateAsync(plan.password));
    }

    if (plan.profile) {
      requests.push(updateProfileMutation.mutateAsync(plan.profile));
    }

    if (requests.length === 0) {
      throw new Error('변경된 정보가 없어 수정 요청을 보내지 않았습니다.');
    }

    const results = await Promise.allSettled(requests);
    const failedResult = results.find((result) => result.status === 'rejected');

    if (failedResult?.status === 'rejected') {
      throw failedResult.reason;
    }

    /*
    @ 성공 후 서버 상태 재확인
    - mutation 응답으로 캐시는 이미 갱신되지만 실제 저장값을 다시 조회해 다음 진입의 초기값을 확정한다.
    - 이름·전화번호가 바뀌면 Customer Profile 응답에도 같은 사용자 정보가 포함되므로 두 캐시를 동기화한다.
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

    await Promise.all(refetches);

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
