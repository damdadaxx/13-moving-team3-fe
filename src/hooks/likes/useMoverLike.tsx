'use client';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { HttpError } from '@/lib/api/errors';
import { getGuestSigninPath, ROUTES } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useToast } from '@/hooks/common/useToast';
import { useModal } from '@/hooks/modal/useModal';
import { likeKeys } from '@/hooks/queries/likes/keys';
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
} from '@/hooks/queries/likes/mutations';
import { useLikeStatusQuery } from '@/hooks/queries/likes/queries';

import Button from '@/components/ui/Button/Button';

/*
@ 기사님 찜하기
- pending 잠금으로 요청이 끝날 때까지 연속 클릭을 막는다
- UI는 likes/mutations의 낙관적 업데이트가 먼저 바꾸고, 서버 응답으로 확정한다
*/
export function useMoverLike(moverId: string, initialLikeCount: number) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');

  const { data } = useLikeStatusQuery(moverId, isLoggedIn);
  const createLikeMutation = useCreateLikeMutation();
  const deleteLikeMutation = useDeleteLikeMutation();

  const isLiked = data?.isLiked ?? false;
  const likeCount = data?.likeCount ?? initialLikeCount;
  const isPending =
    createLikeMutation.isPending || deleteLikeMutation.isPending;

  /*
  @ 고객 프로필 미등록
  - 찜 API가 프로필 없음으로 404를 주면, 없는 /customer/profile 로 보내지 않는다
  - 확인 모달에서만 /customer/profile/new 로 이동한다
  */
  function openProfileRequiredModal() {
    openModal(
      <p className="text-2lg-medium text-black-300">
        기사님을 찜하려면 프로필 등록이 필요해요.
        <br />
        프로필 등록 페이지로 이동할까요?
      </p>,
      {
        title: '프로필 등록',
        variant: 'popup',
        buttons: (
          <>
            <Button
              variant="outlined"
              size={modalButtonSize}
              className="flex-1"
              onClick={closeModal}
            >
              취소
            </Button>
            <Button
              size={modalButtonSize}
              className="flex-1"
              href={ROUTES.customerProfileNew}
              onClick={closeModal}
            >
              프로필 등록하기
            </Button>
          </>
        ),
      },
    );
  }

  async function toggleLike() {
    /* pending 잠금: 같은 요청이 끝나기 전에는 다시 토글하지 않는다 */
    if (isAuthLoading || isPending) return;

    if (!isLoggedIn) {
      /** 게스트 로그인 후 콜백 URL 설정 */
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`${getGuestSigninPath()}?callbackUrl=${callbackUrl}`);
      return;
    }

    /** 고객 계정이 아닌 경우 토스트 메시지 표시 */
    if (role !== 'customer') {
      showToast('고객 계정으로 로그인해주세요.');
      return;
    }

    try {
      if (isLiked) {
        await deleteLikeMutation.mutateAsync(moverId); /** 좋아요 취소 */
        return;
      }

      await createLikeMutation.mutateAsync(moverId); /** 좋아요 추가 */
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
      showToast(
        error instanceof HttpError ? error.message : '찜하기에 실패했어요.',
      );
    }
  }

  return { isLiked, likeCount, isPending, toggleLike };
}
