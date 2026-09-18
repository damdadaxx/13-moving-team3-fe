// [메뉴] 받은 요청 메뉴
// Figma: Card-list/받은 요청 Desktop(1:10456)·Mobile(1:10533)
//
// mobile·tablet: 버튼이 세로로 쌓이고 각각 전체 너비 (견적 보내기가 위, 반려하기가 아래)
// desktop: 버튼이 가로로 나란히 절반씩 (반려하기가 왼쪽, 견적 보내기가 오른쪽)
// DOM 순서는 mobile 기준(견적 보내기 먼저)으로 두고 desktop만 order로 시각 순서를 뒤집는다
'use client';

import { useState } from 'react';

import IcWriting from '@/assets/icons/ic_writing.svg';

import type { ReceivedRequestMock } from '@/app/(mover)/mover/requests/mockData';

import Button from '@/components/ui/Button/Button';
import EstimateCard from '@/components/ui/EstimateCard';

import EstimateRequestSummary from './EstimateRequestSummary';
import RejectRequestModal from './RejectRequestModal';
import SendEstimateModal from './SendEstimateModal';

interface ReceivedRequestCardProps {
  request: ReceivedRequestMock;
  onRejectSuccess: (id: string) => void;
  onSendSuccess: (id: string) => void;
}

export default function ReceivedRequestCard({
  request,
  onRejectSuccess,
  onSendSuccess,
}: ReceivedRequestCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  return (
    <>
      <EstimateCard>
        <EstimateRequestSummary
          variant="card"
          serviceType={request.serviceType}
          isDesignated={request.isDesignated}
          customerName={request.customerName}
          fromRegion={request.fromRegion}
          toRegion={request.toRegion}
          moveDate={request.moveDateLabel}
          topRightSlot={
            <span className="text-md-regular text-gray-500">
              {request.requestedAtLabel}
            </span>
          }
        />

        <div className="flex w-full flex-col gap-[11px] tablet:flex-row desktop:flex-row">
          <Button
            variant="solid"
            size="sm"
            className="desktop:order-2 desktop:flex-1"
            icon={<IcWriting className="size-[24px]" />}
            onClick={() => setIsModalOpen(true)}
          >
            견적 보내기
          </Button>
          <Button
            variant="outlined"
            size="sm"
            className="desktop:order-1 desktop:flex-1"
            onClick={() => setIsRejectModalOpen(true)}
          >
            반려하기
          </Button>
        </div>
      </EstimateCard>

      <SendEstimateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isDesignated={request.isDesignated}
        serviceType={request.serviceType}
        customerName={request.customerName}
        fromRegion={request.fromRegion}
        toRegion={request.toRegion}
        moveDate={request.moveDateLabel}
        onSuccess={() => onSendSuccess(request.id)}
      />

      <RejectRequestModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        serviceType={request.serviceType}
        isDesignated={request.isDesignated}
        customerName={request.customerName}
        fromRegion={request.fromRegion}
        toRegion={request.toRegion}
        moveDate={request.moveDateLabel}
        onSuccess={() => onRejectSuccess(request.id)}
      />
    </>
  );
}
