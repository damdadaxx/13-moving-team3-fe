'use client';

import { HttpError } from '@/lib/api/errors';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useToast } from '@/hooks/common/useToast';
import { useModal } from '@/hooks/modal/useModal';
import { useConfirmEstimateMutation } from '@/hooks/queries/estimates/mutations';

import type { ButtonSize } from '@/components/ui/Button/Button';
import Button from '@/components/ui/Button/Button';

interface EstimateConfirmButtonProps {
  estimateId: string;
  /** 백엔드가 상태·역할 기준으로 판정해 내려주는 확정 가능 여부 */
  canConfirm: boolean;
  size: ButtonSize;
  className?: string;
}

/**
 * @ 견적 확정 버튼 컴포넌트
 * - 확정하면 같은 요청의 나머지 견적은 자동 미선택 처리되고 되돌릴 수 없어, 모달로 먼저 안내한다
 */
export default function EstimateConfirmButton({
  estimateId,
  canConfirm,
  size,
  className,
}: EstimateConfirmButtonProps) {
  const { showToast } = useToast();
  const { openModal, closeModal } = useModal();
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');
  const { mutateAsync, isPending } = useConfirmEstimateMutation();

  /** 견적 확정 */
  async function confirmEstimate() {
    try {
      await mutateAsync(estimateId);
      showToast('견적을 확정했어요.');
    } catch (error) {
      showToast(
        error instanceof HttpError ? error.message : '견적 확정에 실패했어요.',
      );
    }
  }

  /** 확정 모달 열기 */
  function openConfirmModal() {
    openModal(
      <p className="text-2lg-medium text-black-300">
        이 견적으로 확정하시겠습니까?
        <br />
        확정하면 나머지 견적은 자동으로 미선택 처리되고 되돌릴 수 없습니다.
      </p>,
      {
        title: '견적 확정하기',
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
                void confirmEstimate();
              }}
            >
              확정하기
            </Button>
          </>
        ),
      },
    );
  }

  return (
    <Button
      size={size}
      className={className}
      onClick={openConfirmModal}
      disabled={!canConfirm}
      isLoading={isPending}
    >
      견적 확정하기
    </Button>
  );
}
