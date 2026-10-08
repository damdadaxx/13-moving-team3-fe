'use client';

import { useRef } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useLoginRequiredModal } from '@/hooks/common/useLoginRequiredModal';
import { useModal } from '@/hooks/common/useModal';
import { useToast } from '@/hooks/common/useToast';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { likeKeys } from '@/hooks/features/like/queries/keys';
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
} from '@/hooks/features/like/queries/mutations';
import { useLikeStatusQuery } from '@/hooks/features/like/queries/queries';

import Button from '@/components/ui/Button/Button';

/*
@ 기사님 찜하기
- pending 잠금으로 요청이 끝날 때까지 연속 클릭을 막는다
- UI는 likes/mutations의 낙관적 업데이트가 먼저 바꾸고, 서버 응답으로 확정한다
*/
/*
@ initialIsLiked
- 목록 응답에 찜 여부가 같이 오는 화면(받았던 견적)에서 넘긴다
- 찜 상태 조회가 끝나기 전에 빈 하트가 잠깐 보이지 않게 첫 값으로 쓴다
*/
export function useMoverLike(
  moverId: string,
  initialLikeCount: number,
  initialIsLiked = false,
) {
  const t = useTranslations('MoverLike');
  const tCommon = useTranslations('Common');
  const openLoginRequiredModal = useLoginRequiredModal();
  const queryClient = useQueryClient();
  const { isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');

  const { data } = useLikeStatusQuery(moverId, isLoggedIn);
  const createLikeMutation = useCreateLikeMutation();
  const deleteLikeMutation = useDeleteLikeMutation();

  const isLiked = data?.isLiked ?? initialIsLiked;
  const likeCount = data?.likeCount ?? initialLikeCount;
  const isPending =
    createLikeMutation.isPending || deleteLikeMutation.isPending;
  /*
  @ 즉시 잠금
  - isPending은 다시 그려진 뒤에 바뀌어서, 아주 빠른 연속 클릭은 둘 다 통과한다
  - ref는 바로 바뀌어서 요청이 끝날 때까지 두 번째 클릭을 확실히 막는다
  */
  const isTogglingRef = useRef(false);

  /*
  @ 고객 프로필 미등록
  - 찜 API가 프로필 없음으로 404를 주면, 없는 /customer/profile 로 보내지 않는다
  - 확인 모달에서만 /customer/profile/new 로 이동한다
  */
  function openProfileRequiredModal() {
    openModal(
      <p className="text-2lg-medium text-black-300">
        {t('profileRequiredLine1')}
        <br />
        {t('profileRequiredLine2')}
      </p>,
      {
        title: t('profileRequiredTitle'),
        variant: 'popup',
        buttons: (
          <>
            <Button
              variant="outlined"
              size={modalButtonSize}
              className="flex-1"
              onClick={closeModal}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              size={modalButtonSize}
              className="flex-1"
              href={ROUTES.customerProfileNew}
              onClick={closeModal}
            >
              {t('goProfile')}
            </Button>
          </>
        ),
      },
    );
  }

  async function toggleLike() {
    /* pending 잠금: 같은 요청이 끝나기 전에는 다시 토글하지 않는다 */
    if (isAuthLoading || isPending || isTogglingRef.current) return;

    if (!isLoggedIn) {
      openLoginRequiredModal();
      return;
    }

    /** 고객 계정이 아닌 경우 토스트 메시지 표시 */
    if (role !== 'customer') {
      showToast(tCommon('customerOnly'));
      return;
    }

    isTogglingRef.current = true;
    try {
      if (isLiked) {
        await deleteLikeMutation.mutateAsync(moverId); /** 좋아요 취소 */
        showToast(t('unliked'));
        return;
      }

      await createLikeMutation.mutateAsync(moverId); /** 좋아요 추가 */
      showToast(t('liked'));
    } catch (error) {
      if (error instanceof HttpError && error.code === 'BAD_REQUEST') {
        /** 좋아요 상태 무효화 */
        await queryClient.invalidateQueries({
          queryKey: likeKeys.byMover(moverId),
        });
        return;
      }

      if (error instanceof HttpError && error.status === 404) {
        openProfileRequiredModal();
        return;
      }

      /** 찜하기에 실패 시 토스트 메시지 표시 */
      showToast(error instanceof HttpError ? error.message : t('failed'));
    } finally {
      isTogglingRef.current = false;
    }
  }

  return { isLiked, likeCount, isPending, toggleLike };
}
