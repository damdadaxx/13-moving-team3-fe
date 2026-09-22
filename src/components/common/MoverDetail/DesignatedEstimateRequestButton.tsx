// @ 지정 견적 요청 버튼 컴포넌트
'use client';

import type { EstimateRequestDetail, EstimateSummary } from '@/types/estimate';
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

function findMoverEstimate(
  request: EstimateRequestDetail | null | undefined,
  moverId: string,
): EstimateSummary | undefined {
  if (!request) return undefined;

  return request.estimates.find((estimate) => {
    const estimateMoverId = estimate.mover.userId ?? estimate.mover.moverId;
    return estimateMoverId === moverId;
  });
}

/*
@ 지정 견적 버튼 문구
- 잠그는 조건은 그대로다. 해당 기사님 견적이 하나라도 있으면 비활성화한다.
- 지정 견적(isDesignated: true): 지정 견적 요청 완료
- 일반 견적만 있는 기사님: 이미 견적을 받았어요
- 견적이 없음: 지정 견적 요청하기
*/
function getDesignatedButtonLabel(
  estimate: EstimateSummary | undefined,
): string {
  if (!estimate) return '지정 견적 요청하기';
  if (estimate.isDesignated) return '지정 견적 요청 완료';
  return '이미 견적을 받았어요';
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

  const moverEstimate = findMoverEstimate(activeRequest, moverId);
  const isRequested = Boolean(moverEstimate);

  async function submitDesignatedEstimate(estimateRequestId: string) {
    try {
      await mutateAsync({
        estimateRequestId,
        moverId,
      });
      showToast('지정 견적 요청이 완료되었어요');
    } catch (error) {
      if (error instanceof HttpError && error.status === 404) {
        openNeedEstimateRequestModal();
        return;
      }

      showToast(
        error instanceof HttpError
          ? error.message
          : '지정 견적 요청에 실패했어요.',
      );
    }
  }

  /*
  @ 지정 견적 요청 확인
  - 요청 후에는 취소할 수 없어서, 보내기 전에 모달로 안내한다.
  */
  function openIrreversibleRequestModal(estimateRequestId: string) {
    openModal(
      <p className="text-2lg-medium text-black-300">
        지정 견적 요청을 취소하시겠습니까? 취소한 요청은 다시 복구할 수
        없습니다.
      </p>,
      {
        title: '지정 견적 요청하기',
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
              onClick={() => {
                closeModal();
                void submitDesignatedEstimate(estimateRequestId);
              }}
            >
              지정 견적 요청하기
            </Button>
          </>
        ),
      },
    );
  }

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

    const existingEstimate = findMoverEstimate(request, moverId);
    if (existingEstimate) {
      showToast(
        existingEstimate.isDesignated
          ? '이미 지정 견적을 요청한 기사님이에요.'
          : '이미 견적을 받은 기사님이에요.',
      );
      return;
    }

    openIrreversibleRequestModal(request.id);
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
      {getDesignatedButtonLabel(moverEstimate)}
    </Button>
  );
}
