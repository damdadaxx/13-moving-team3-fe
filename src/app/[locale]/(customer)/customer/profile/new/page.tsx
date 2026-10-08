// [메뉴] 헤더 모달 메뉴 > 프로필
// [페이지] 프로필 최초 생성
'use client';

import { useMemo } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { CustomerProfileCreateFormValues } from '@/types/customerProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { isUnauthorizedHttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useToast } from '@/hooks/common/useToast';
import { authKeys } from '@/hooks/features/auth/queries/keys';
import { useUpdateMeMutation } from '@/hooks/features/auth/queries/mutations';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { createCustomerProfileCreatePlan } from '@/hooks/features/customer/customerProfileCreatePlan';
import { customerProfileKeys } from '@/hooks/features/customer/queries/keys';
import { useCreateCustomerProfileMutation } from '@/hooks/features/customer/queries/mutations';
import { useCustomerProfileQuery } from '@/hooks/features/customer/queries/queries';

import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

import CustomerProfileForm from '@/components/features/customer/CustomerProfile/CustomerProfileForm';
import CustomerProfileSkeleton from '@/components/features/customer/CustomerProfile/CustomerProfileSkeleton';

export default function ProfileNewPage() {
  const t = useTranslations('CustomerProfile');
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const updateMeMutation = useUpdateMeMutation();
  const createProfileMutation = useCreateCustomerProfileMutation();
  // Guard와 같은 Query key를 구독하므로 요청은 공유된다. 등록 여부 확인 전에는 빈 폼을 노출하지 않는다.
  const { isPending: isProfilePending } = useCustomerProfileQuery();
  const defaultValues = useMemo<
    Partial<CustomerProfileCreateFormValues> | undefined
  >(
    () =>
      user
        ? { phoneNumber: formatPhoneNumber(user.phoneNumber ?? '') }
        : undefined,
    [user],
  );

  if (!user || !defaultValues || isProfilePending) {
    return (
      <CustomerProfileSkeleton
        mode="create"
        showPhoneNumber={Boolean(user && user.provider !== 'LOCAL')}
      />
    );
  }

  /*
  @ 고객 프로필 등록 제출
  - 소셜 계정 전화번호가 없거나 바뀌었다면 PATCH /auth/me를 먼저 호출한다.
  - 계정 저장 후 프로필 등록에 실패하면 전화번호만 저장된 부분 성공을 안내한다.
  - mutation 성공 시 detail 캐시가 먼저 갱신되므로 CustomerProfileGuard가
    사용자를 다시 등록 페이지로 보내지 않는다.
  - 등록 화면이 브라우저 뒤로가기에 남지 않도록 push가 아니라 replace로 이동한다.
  - 오류는 다시 폼 훅으로 전달되어 필드 오류 또는 폼 전체 오류로 표시된다.
  */
  const handleSubmit = async (values: CustomerProfileCreateFormValues) => {
    const plan = createCustomerProfileCreatePlan(
      values,
      user.phoneNumber,
      user.provider,
    );
    let hasUpdatedAccount = false;

    try {
      if (plan.account) {
        await updateMeMutation.mutateAsync(plan.account);
        hasUpdatedAccount = true;
      }

      await createProfileMutation.mutateAsync(plan.profile);
    } catch (error) {
      if (hasUpdatedAccount) showToast(t('phoneSavedOnly'));

      if (isUnauthorizedHttpError(error)) {
        queryClient.setQueryData(authKeys.me(), null);
        const callbackUrl = encodeURIComponent(pathname);
        router.replace(`${ROUTES.customerSignin}?callbackUrl=${callbackUrl}`);
      }

      throw error;
    }

    const refetches: Promise<unknown>[] = [
      queryClient.invalidateQueries({
        queryKey: customerProfileKeys.detail(),
      }),
    ];

    if (plan.account) {
      refetches.push(
        queryClient.invalidateQueries({ queryKey: authKeys.me() }),
      );
    }

    // 저장 성공과 후속 재조회 실패는 서로 다른 결과로 취급한다.
    await Promise.allSettled(refetches);

    showToast(t('created'));
    router.replace(ROUTES.customerHome);
  };

  return (
    <CustomerProfileForm
      mode="create"
      provider={user.provider}
      defaultValues={defaultValues}
      isSubmitting={
        updateMeMutation.isPending || createProfileMutation.isPending
      }
      onSubmit={handleSubmit}
    />
  );
}
