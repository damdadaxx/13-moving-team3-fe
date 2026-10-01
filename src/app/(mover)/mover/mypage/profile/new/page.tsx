// [메뉴] 헤더 모달 메뉴 > 마이페이지
// [페이지] 프로필 최초 생성
'use client';

import { useMemo } from 'react';

import type { MoverProfileFormValues } from '@/types/moverProfile';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { isUnauthorizedHttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/hooks/common/useToast';
import { createMoverProfileCreatePlan } from '@/hooks/mover/moverProfileCreatePlan';
import { authKeys } from '@/hooks/queries/auth/keys';
import { useUpdateMeMutation } from '@/hooks/queries/auth/mutations';
import { moverProfileKeys } from '@/hooks/queries/moverProfile/keys';
import { useCreateMoverProfileMutation } from '@/hooks/queries/moverProfile/mutations';

import MoverProfileForm from '@/components/features/mover/MoverMypage/MoverProfileForm';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function MoverProfileNewPage() {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const updateMeMutation = useUpdateMeMutation();
  const createProfileMutation = useCreateMoverProfileMutation();

  const defaultValues = useMemo<Partial<MoverProfileFormValues> | undefined>(
    () =>
      user
        ? {
            phoneNumber: user.phoneNumber ?? '',
            removeImage: false,
          }
        : undefined,
    [user],
  );

  if (!user || !defaultValues) {
    return <LoadingDisplay />;
  }

  /*
  @ 프로필 최초 등록 순서
  - 소셜 전화번호가 없거나 변경된 경우 PATCH /auth/me를 먼저 호출한다.
  - 전화번호 저장 뒤 POST /mover/profile이 실패하면 부분 성공을 안내한다.
  - 프로필 등록 성공 응답으로 캐시가 갱신되므로 후속 재조회 실패는 저장 실패로 처리하지 않는다.
  */
  const handleSubmit = async (values: MoverProfileFormValues) => {
    const plan = createMoverProfileCreatePlan(
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
      if (hasUpdatedAccount) {
        showToast('전화번호는 저장되었지만 프로필 등록은 완료되지 않았습니다.');
      }

      if (isUnauthorizedHttpError(error)) {
        queryClient.setQueryData(authKeys.me(), null);
        const callbackUrl = encodeURIComponent(pathname);
        router.replace(`${ROUTES.moverSignin}?callbackUrl=${callbackUrl}`);
      }

      throw error;
    }

    const refetches: Promise<unknown>[] = [
      queryClient.invalidateQueries({
        queryKey: moverProfileKeys.detail(),
      }),
    ];

    if (plan.account) {
      refetches.push(
        queryClient.invalidateQueries({
          queryKey: authKeys.me(),
        }),
      );
    }

    await Promise.allSettled(refetches);

    showToast('기사님 프로필 등록이 완료되었습니다.');
    router.replace(ROUTES.moverHome);
  };

  return (
    <MoverProfileForm
      mode="create"
      provider={user.provider}
      defaultValues={defaultValues}
      isSubmitting={
        updateMeMutation.isPending || createProfileMutation.isPending
      }
      onCreateSubmit={handleSubmit}
    />
  );
}
