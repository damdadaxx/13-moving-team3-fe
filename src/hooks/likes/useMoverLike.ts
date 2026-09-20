import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { HttpError } from '@/lib/api/errors';
import { getGuestSigninPath, ROUTES } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';
import { useToast } from '@/hooks/common/useToast';
import { likeKeys } from '@/hooks/queries/likes/keys';
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
} from '@/hooks/queries/likes/mutations';
import { useLikeStatusQuery } from '@/hooks/queries/likes/queries';

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

  const { data } = useLikeStatusQuery(moverId, isLoggedIn);
  const createLikeMutation = useCreateLikeMutation();
  const deleteLikeMutation = useDeleteLikeMutation();

  const isLiked = data?.isLiked ?? false;
  const likeCount = data?.likeCount ?? initialLikeCount;
  const isPending =
    createLikeMutation.isPending || deleteLikeMutation.isPending;

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

      /** 고객 프로필 미등록시 토스트 메시지 표시 후 고객 프로필 페이지로 이동 */
      if (error instanceof HttpError && error.status === 404) {
        showToast('고객 프로필을 등록한 뒤 찜할 수 있어요.');
        router.push(ROUTES.customerProfileRoot);
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
