'use client';

import type { EstimateDetail } from '@/types/estimate';
import type { MoverDetail } from '@/types/mover';
import { SERVICE_TYPE_LABELS } from '@/types/serviceType';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import CustomerEstimateIntro from '@/components/common/Estimate/CustomerEstimateIntro';
import EstimateConfirmButton from '@/components/common/Estimate/EstimateConfirmButton';
import EstimateNotSelectedNotice from '@/components/common/Estimate/EstimateNotSelectedNotice';
import EstimatePriceSection from '@/components/common/Estimate/EstimatePriceSection';
import MoverEstimateIntro from '@/components/common/Estimate/MoverEstimateIntro';
import MoverEstimateProfile from '@/components/common/Estimate/MoverEstimateProfile';
import MoverDetailTopSection from '@/components/common/MoverDetail/MoverDetailTopSection';
import MoverStickyActionBar from '@/components/common/MoverDetail/MoverStickyActionBar';
import ShareMoverInfo from '@/components/common/MoverDetail/ShareMoverInfo';
import ServiceTypeTagList from '@/components/common/ServiceType/ServiceTypeTagList';
import SectionTitle from '@/components/ui/SectionTitle';

/*
@ 견적 상세 화면 variant
- customerPending: 고객 - 내 견적 관리 - 대기중인 견적 - 견적 상세
- customerReceived: 고객 - 내 견적 관리 - 받았던 견적 - 견적 상세
- moverConfirmed: 기사님 - 내 견적 관리 - 확정견적 - 견적 상세
*/
export type EstimateDetailVariant =
  'customerPending' | 'customerReceived' | 'moverConfirmed';

/**
 * @ 견적 상세 화면 공용 컴포넌트
 * - 대기중인 견적/받았던 견적/기사님 확정견적 3곳에서 variant로 구분해 쓴다
 * - 데이터(estimate/mover)는 사용처에서 미리 조회해 props로 내려준다
 * - 화면 구조는 그대로 두고 variant에 안 맞는 섹션만 hidden 처리한다
 */
export default function EstimateDetailContent({
  variant,
  estimate,
  mover,
}: {
  variant: EstimateDetailVariant;
  estimate: EstimateDetail;
  mover: MoverDetail;
}) {
  const isMoverConfirmed = variant === 'moverConfirmed';
  const isCtaHidden = variant !== 'customerPending';
  const isNotSelected =
    variant === 'customerReceived' && estimate.status === 'NOT_SELECTED';

  /** 견적 정보 항목 */
  const estimateInfoItems = [
    {
      label: '견적 요청일',
      value: formatDate(estimate.estimateRequest.requestedAt, 'korean'),
    },
    {
      label: '서비스',
      value: SERVICE_TYPE_LABELS[estimate.estimateRequest.serviceType],
    },
    {
      label: '이용일',
      value: formatDate(estimate.estimateRequest.moveDate, 'usage'),
    },
    { label: '출발지', value: estimate.estimateRequest.departureAddress },
    { label: '도착지', value: estimate.estimateRequest.arrivalAddress },
  ];

  return (
    <main className={cn('bg-gray-50')}>
      {/* 상단 섹션 */}
      <MoverDetailTopSection
        imageUrl={mover.imgUrl}
        nickname={mover.nickname}
        hasProfileImage={!isMoverConfirmed}
        className={cn(isMoverConfirmed && 'pb-0!')}
      />

      {/* 정보 섹션 */}
      <section
        className={cn(
          'px-[20px] pb-[134px]',
          'tablet:pb-[126px] tablet:px-[72px]',
        )}
      >
        <div
          className={cn(
            'desktop:flex desktop:gap-[140px] max-w-[1200px] mx-auto',
          )}
        >
          <div className={cn('min-w-0 desktop:flex-1')}>
            {/* 기사님 정보 섹션 */}
            <div
              className={cn(
                'mt-[13px]',
                'tablet:mt-[23px]',
                'desktop:mt-[31px]',
              )}
            >
              {/* 서비스 타입 태그 */}
              <ServiceTypeTagList
                className={cn(
                  isMoverConfirmed &&
                    'mt-[36px] tablet:mt-[46px] desktop:mt-[40px]',
                  'mb-[12px]',
                )}
                serviceTypes={mover.serviceTypes}
                estimateStatus={estimate.status}
              />

              {/* 기사님 소개 섹션 */}
              {!isMoverConfirmed && (
                <MoverEstimateIntro
                  shortIntro={mover.shortIntro}
                  status={estimate.status}
                />
              )}

              {/* 기사님 닉네임, 별점 및 경력, 찜하기 */}
              {!isMoverConfirmed && (
                <MoverEstimateProfile
                  moverId={mover.id}
                  nickname={mover.nickname}
                  likeCount={mover.likeCount}
                  averageRating={mover.averageRating}
                  reviewCount={mover.reviewCount}
                  careerMonths={mover.careerMonths}
                  confirmedCount={mover.confirmedCount}
                />
              )}

              {/* 고객정보 섹션 */}
              {isMoverConfirmed && (
                <CustomerEstimateIntro
                  customerName={estimate.customer.name}
                  status={estimate.status}
                />
              )}

              {/* 견적가 */}
              <EstimatePriceSection price={estimate.price} layout="inline" />

              {/* 견적 정보 */}
              <div
                className={cn(
                  'py-[20px] border-b border-line-100',
                  'tablet:py-[32px]',
                  'desktop:py-[30px] desktop:border-b-0',
                )}
              >
                <SectionTitle
                  className={cn(
                    'mb-[20px]',
                    'tablet:mb-[32px]',
                    'desktop:mb-[28px]',
                  )}
                >
                  견적 정보
                </SectionTitle>
                <dl
                  className={cn(
                    'flex flex-col gap-[12px]',
                    'tablet:gap-[16px]',
                  )}
                >
                  {estimateInfoItems.map(({ label, value }) => (
                    <div
                      key={label}
                      className={cn(
                        'flex items-center justify-between',
                        'tablet:justify-start tablet:gap-[23px]',
                      )}
                    >
                      <dt
                        className={cn(
                          'w-[90px] shrink-0 text-lg-regular text-gray-300',
                          'tablet:text-lg-regular',
                        )}
                      >
                        {label}
                      </dt>
                      <dd
                        className={cn(
                          'text-lg-medium text-black-400 text-right',
                          'tablet:text-lg-semibold tablet:text-left',
                        )}
                      >
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* 확정하지 않은 견적 안내 */}
                {isNotSelected && (
                  <EstimateNotSelectedNotice
                    className={cn('mt-[28px]', 'tablet:mt-[32px]')}
                  />
                )}
              </div>
            </div>

            {/* 공유하기 */}
            <ShareMoverInfo className={cn('pt-[32px]', 'desktop:hidden')} />
          </div>

          {/* 데스크탑 버튼 그룹 */}
          <section
            className={cn(
              'hidden',
              'desktop:block desktop:w-[calc(320/1200*100%)] desktop:max-w-[320px] desktop:px-0',
            )}
          >
            <div
              className={cn(
                !isCtaHidden && 'pb-[40px] border-b border-line-100',
              )}
            >
              {/* 견적가 */}
              <EstimatePriceSection
                price={estimate.price}
                layout="sidebar"
                hidden={isCtaHidden}
              />

              {/* 확정하기 버튼 */}
              <EstimateConfirmButton
                estimateId={estimate.estimateId}
                canConfirm={estimate.canConfirm}
                size="lg"
                className={cn(isCtaHidden ? 'hidden' : 'mt-[29px]')}
              />
            </div>

            {/* 공유하기 */}
            <ShareMoverInfo
              className={cn('invisible', 'desktop:visible')}
              text="견적서 공유하기"
            />
          </section>

          {/* 모바일, 테스크탑 버튼 그룹 섹션 */}
          {!isCtaHidden && (
            <MoverStickyActionBar
              moverId={mover.id}
              likeCount={mover.likeCount}
              action={
                /** 견적 확정하기 버튼 */
                <EstimateConfirmButton
                  estimateId={estimate.estimateId}
                  canConfirm={estimate.canConfirm}
                  size="sm"
                  className="flex-1"
                />
              }
            />
          )}
        </div>
      </section>
    </main>
  );
}
