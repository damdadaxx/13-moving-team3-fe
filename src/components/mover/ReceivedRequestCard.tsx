// [메뉴] 받은 요청 메뉴
// Figma: Card-list/받은 요청 Desktop(1:10456)·Mobile(1:10533)
//
// 지정 견적 요청: 견적 보내기 + 반려하기 둘 다 보인다
// 지정이 아닌 요청: 견적 보내기만 보인다 (반려 API 자체가 없다)
// mobile·tablet: 버튼이 세로로 쌓이고 각각 전체 너비 (견적 보내기가 위, 반려하기가 아래)
// desktop: 버튼이 가로로 나란히 절반씩 (반려하기가 왼쪽, 견적 보내기가 오른쪽)
// DOM 순서는 mobile 기준(견적 보내기 먼저)으로 두고 desktop만 order로 시각 순서를 뒤집는다
'use client';

import { useState } from 'react';

import type { ReceivedRequestItem } from '@/types/estimate';

import IcWriting from '@/assets/icons/ic_writing.svg';

import formatDate from '@/utils/formatDate';

import Button from '@/components/ui/Button/Button';
import EstimateCard from '@/components/ui/EstimateCard';

import EstimateRequestSummary from './EstimateRequestSummary';
import RejectRequestModal from './RejectRequestModal';
import SendEstimateModal from './SendEstimateModal';

interface ReceivedRequestCardProps {
  request: ReceivedRequestItem;
  /** 지정 건일 때만 있다. PATCH /estimates/{estimateId}에 필요하다 */
  estimateId?: string;
  /** 반려 성공 후 호출된다. 목록에서 로컬로만 숨긴다(서버 재조회는 별도) */
  onRejectSuccess: (estimateRequestId: string) => void;
  /** 견적 발송 성공 후 호출된다. 목록에서 로컬로만 숨긴다(서버 재조회는 별도) */
  onSendSuccess: (estimateRequestId: string) => void;
}

export default function ReceivedRequestCard({
  request,
  estimateId,
  onRejectSuccess,
  onSendSuccess,
}: ReceivedRequestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const moveDateLabel = formatDate(request.moveDate, 'korean');
  const requestedAtLabel = formatDate(request.requestedAt, 'relative');

  return (
    <>
      <EstimateCard>
        <EstimateRequestSummary
          variant="card"
          serviceType={request.serviceType}
          isDesignated={request.isDesignated}
          customerName={request.customer.name}
          fromRegion={request.departureAddress}
          toRegion={request.arrivalAddress}
          moveDate={moveDateLabel}
          topRightSlot={
            <span className="text-md-regular text-gray-500">
              {requestedAtLabel}
            </span>
          }
        />

        <div className="flex w-full flex-col gap-[11px] tablet:flex-row desktop:flex-row">
          <Button
            variant="solid"
            size="sm"
            className={
              request.isDesignated ? 'desktop:order-2 desktop:flex-1' : 'w-full'
            }
            icon={<IcWriting className="size-[24px]" />}
            onClick={() => setIsModalOpen(true)}
          >
            견적 보내기
          </Button>
          {request.isDesignated && (
            <Button
              variant="outlined"
              size="sm"
              className="desktop:order-1 desktop:flex-1"
              onClick={() => setIsRejectModalOpen(true)}
            >
              반려하기
            </Button>
          )}
        </div>
      </EstimateCard>

      <SendEstimateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        estimateRequestId={request.estimateRequestId}
        estimateId={estimateId}
        isDesignated={request.isDesignated}
        serviceType={request.serviceType}
        customerName={request.customer.name}
        fromRegion={request.departureAddress}
        toRegion={request.arrivalAddress}
        moveDate={moveDateLabel}
        onSuccess={() => onSendSuccess(request.estimateRequestId)}
      />

      {request.isDesignated && (
        <RejectRequestModal
          isOpen={isRejectModalOpen}
          onClose={() => setIsRejectModalOpen(false)}
          estimateId={estimateId}
          serviceType={request.serviceType}
          isDesignated={request.isDesignated}
          customerName={request.customer.name}
          fromRegion={request.departureAddress}
          toRegion={request.arrivalAddress}
          moveDate={moveDateLabel}
          onSuccess={() => onRejectSuccess(request.estimateRequestId)}
        />
      )}
    </>
  );
}
