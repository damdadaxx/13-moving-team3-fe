// [메뉴] 헤더 모달 메뉴 > 프로필 수정
// [페이지] 프로필 수정
'use client';

import { useMemo } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import type { MoverProfileFormValues } from '@/types/moverProfile';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { isUnauthorizedHttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useToast } from '@/hooks/common/useToast';
import { authKeys } from '@/hooks/features/auth/queries/keys';
import {
  toCareerFormValues,
  type MoverProfileEditPlan,
} from '@/hooks/features/mover/moverProfileEditPlan';
import { moverProfileKeys } from '@/hooks/features/mover/queries/keys';
import { useUpdateMoverProfileMutation } from '@/hooks/features/mover/queries/mutations';
import { useMoverProfileQuery } from '@/hooks/features/mover/queries/queries';

import MoverProfileForm from '@/components/features/mover/MoverMypage/MoverProfileForm';
import MoverProfileSkeleton from '@/components/features/mover/MoverMypage/MoverProfileSkeleton';

export default function MoverProfileEditPage() {
  const t = useTranslations('MoverProfile');
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { data: profile, isPending } = useMoverProfileQuery();
  const updateProfileMutation = useUpdateMoverProfileMutation();

  const defaultValues = useMemo<MoverProfileFormValues | undefined>(
    () =>
      profile
        ? {
            profileImage: undefined,
            phoneNumber: '',
            nickname: profile.nickname,
            ...toCareerFormValues(profile.careerMonths),
            shortIntro: profile.shortIntro,
            description: profile.description,
            serviceTypes: profile.serviceTypes,
            serviceRegions: profile.serviceRegions,
            removeImage: false,
          }
        : undefined,
    [profile],
  );

  if (isPending || !profile || !defaultValues) {
    return <MoverProfileSkeleton mode="edit" />;
  }

  const handleSubmit = async (plan: MoverProfileEditPlan) => {
    if (!plan.profile) {
      throw new Error(t('noChanges'));
    }

    try {
      await updateProfileMutation.mutateAsync(plan.profile);
    } catch (error) {
      if (isUnauthorizedHttpError(error)) {
        queryClient.setQueryData(authKeys.me(), null);
        const callbackUrl = encodeURIComponent(pathname);
        router.replace(`${ROUTES.moverSignin}?callbackUrl=${callbackUrl}`);
      }

      throw error;
    }

    await Promise.allSettled([
      queryClient.invalidateQueries({
        queryKey: moverProfileKeys.detail(),
      }),
    ]);

    showToast(t('updated'));
    router.replace(ROUTES.moverMypage);
  };

  return (
    <MoverProfileForm
      mode="edit"
      defaultValues={defaultValues}
      imageUrl={profile.imgUrl ?? undefined}
      cancelHref={ROUTES.moverMypage}
      isSubmitting={updateProfileMutation.isPending}
      onEditSubmit={handleSubmit}
    />
  );
}
