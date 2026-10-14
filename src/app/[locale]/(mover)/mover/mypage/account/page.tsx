// [메뉴] 헤더 모달 메뉴 > 기본 정보 수정
// [페이지] 기본 정보 수정
'use client';

import { useMemo } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { MoverAccountFormValues } from '@/types/moverAccount';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { isUnauthorizedHttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useToast } from '@/hooks/common/useToast';
import { authKeys } from '@/hooks/features/auth/queries/keys';
import {
  useUpdateMeMutation,
  useUpdatePasswordMutation,
} from '@/hooks/features/auth/queries/mutations';
import { useAuth } from '@/hooks/features/auth/useAuth';
import type { MoverAccountEditPlan } from '@/hooks/features/mover/moverAccountEditPlan';

import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

import MoverAccountForm from '@/components/features/mover/MoverMypage/MoverAccountForm';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

export default function MoverInfoPage() {
  const t = useTranslations('MoverAccount');
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { user } = useAuth();
  const updateMeMutation = useUpdateMeMutation();
  const updatePasswordMutation = useUpdatePasswordMutation();

  /*
  @ 기존 전화번호 초기 표시
  - 소셜·로컬 계정 모두 입력 전부터 회원가입·최초 등록과 같은 하이픈 형식으로 보여준다.
  - 전화번호가 없으면 빈 문자열을 유지하며, 계정별 필수 검증은 기존 폼 훅에서 처리한다.
  - 화면 표시만 포맷하고, 변경 여부 비교와 API 전송은 기존 EditPlan을 유지한다.
  */
  const defaultValues = useMemo<MoverAccountFormValues | undefined>(
    () =>
      user
        ? {
            name: user.name,
            email: user.email,
            phoneNumber: formatPhoneNumber(user.phoneNumber ?? ''),
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
          }
        : undefined,
    [user],
  );

  if (!user || !defaultValues) {
    return <LoadingDisplay />;
  }

  /*
  @ 기본정보 수정 순서
  - 이름·전화번호를 먼저 저장하고 비밀번호는 항상 마지막에 요청한다.
  - 비밀번호가 변경되면 기존 currentPassword를 다시 쓸 수 없으므로 뒤에 다른 요청을 두지 않는다.
  */
  const handleSubmit = async (plan: MoverAccountEditPlan) => {
    let hasUpdatedAccount = false;

    try {
      if (plan.account) {
        await updateMeMutation.mutateAsync(plan.account);
        hasUpdatedAccount = true;
      }

      if (plan.password) {
        await updatePasswordMutation.mutateAsync(plan.password);
      }
    } catch (error) {
      if (hasUpdatedAccount && plan.password) {
        showToast(t('partialSaved'));
      }

      if (isUnauthorizedHttpError(error)) {
        queryClient.setQueryData(authKeys.me(), null);
        const callbackUrl = encodeURIComponent(pathname);
        router.replace(`${ROUTES.moverSignin}?callbackUrl=${callbackUrl}`);
      }

      throw error;
    }

    const refetches: Promise<unknown>[] = [];

    if (plan.account) {
      refetches.push(
        queryClient.invalidateQueries({
          queryKey: authKeys.me(),
        }),
      );
    }

    await Promise.allSettled(refetches);

    showToast(t('updated'));
    router.replace(ROUTES.moverMypage);
  };

  return (
    <MoverAccountForm
      defaultValues={defaultValues}
      provider={user.provider}
      cancelHref={ROUTES.moverMypage}
      isSubmitting={
        updateMeMutation.isPending || updatePasswordMutation.isPending
      }
      onSubmit={handleSubmit}
    />
  );
}
