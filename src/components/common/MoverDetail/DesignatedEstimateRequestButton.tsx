// @ 지정 견적 요청 버튼 컴포넌트
'use client';

import type { EstimateRequestDetail } from '@/types/estimate';
import { usePathname, useRouter } from 'next/navigation';

import { HttpError } from '@/lib/api/errors';
import { getGuestSigninPath, ROUTES } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useToast } from '@/hooks/common/useToast';
import { useModal } from '@/hooks/modal/useModal';
import { useCreateDesignatedEstimateMutation } from '@/hooks/queries/estimates/mutations';
import { useActiveEstimateRequestQuery } from '@/hooks/queries/estimates/queries';

import type { ButtonSize } from '@/components/ui/Button/Button';
import Button from '@/components/ui/Button/Button';

function isMoverAlreadyDesignated(
  request: EstimateRequestDetail | null | undefined,
  moverId: string,
): boolean {
  if (!request) return false;

  return request.estimates.some((estimate) => {
    const estimateMoverId = estimate.mover.userId ?? estimate.mover.moverId;
    return estimateMoverId === moverId;
  });
}

interface DesignatedEstimateRequestButtonProps {
  moverId: string;
  size: ButtonSize;
  className?: string;
}

export default function DesignatedEstimateRequestButton({
  moverId,
  size,
  className,
}: DesignatedEstimateRequestButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, isLoading: isAuthLoading, role } = useAuth();
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');

  const canFetchActive = isLoggedIn && role === 'customer';
  const { data: activeRequest, refetch } =
    useActiveEstimateRequestQuery(canFetchActive);
  const { mutateAsync, isPending: isSubmitting } =
    useCreateDesignatedEstimateMutation();

  const isRequested = isMoverAlreadyDesignated(activeRequest, moverId);

  /** 일반 견적 요청 모달 열기 */
  function openNeedEstimateRequestModal() {
    openModal(
      <p className="text-2lg-medium whitespace-nowrap text-black-300">
        일반 견적 요청을 먼저 진행해 주세요.
      </p>,
      {
        title: '지정 견적 요청하기',
        variant: 'popup',
        buttons: (
          <Button
            size={modalButtonSize}
            href={ROUTES.customerHome}
            onClick={closeModal}
          >
            일반 견적 요청 하기
          </Button>
        ),
      },
    );
  }

  /** 지정 견적 요청 버튼 핸들러 */
  async function handleClick() {
    if (isAuthLoading || isSubmitting || isRequested) return;

    if (!isLoggedIn) {
      // 게스트 로그인 후 콜백 URL 설정
      const callbackUrl = encodeURIComponent(pathname);
      router.push(`${getGuestSigninPath()}?callbackUrl=${callbackUrl}`);
      return;
    }

    if (role !== 'customer') {
      showToast('고객 계정으로 로그인해주세요.');
      return;
    }

    const request =
      activeRequest !== undefined ? activeRequest : (await refetch()).data;

    if (!request || request.status !== 'PENDING') {
      // 이미 확정된 이사 견적이 있는 경우
      if (request?.status === 'CONFIRMED') {
        showToast('이미 확정된 이사 견적이 있어요.');
        return;
      }
      // 일반 견적 요청 모달 열기
      openNeedEstimateRequestModal();
      return;
    }

    // 이미 지정 견적 요청한 기사님이 있는 경우
    if (isMoverAlreadyDesignated(request, moverId)) {
      showToast('이미 지정 견적을 요청한 기사님이에요.');
      return;
    }

    try {
      await mutateAsync({
        estimateRequestId: request.id,
        moverId,
      });
      showToast('지정 견적 요청이 완료되었어요');
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        openNeedEstimateRequestModal();
        return;
      }

      // 지정 견적 요청 실패 토스트 메시지 표시
      showToast(
        error instanceof HttpError
          ? error.message
          : '지정 견적 요청에 실패했어요.',
      );
    }
  }

  return (
    <Button
      variant="solid"
      size={size}
      className={className}
      onClick={handleClick}
      disabled={isRequested}
      isLoading={isSubmitting}
    >
      {isRequested ? '지정 견적 요청 완료' : '지정 견적 요청하기'}
    </Button>
  );
}
