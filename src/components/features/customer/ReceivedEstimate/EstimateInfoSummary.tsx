// [메뉴] 내 견적 관리 메뉴 > 받았던 견적 탭메뉴
// Figma: 받았던 견적 Desktop(1:11663) · Tablet(1:11365) · Mobile(1:11516)
//
// 과거에 보낸 견적 요청 1건의 요약 (이사 유형 / 출발지 / 도착지 / 이용일 + 요청일)
/*
@ 브레이크포인트별 차이
- 요청일: mobile은 목록 아래 오른쪽, tablet·desktop은 "견적 정보" 제목 줄 오른쪽
- 제목: mobile만 가운데 정렬
- 구분선: mobile·tablet만 (이사 유형 아래, 도착지 아래). desktop은 없다
*/
import type { ServiceType } from '@/types/serviceType';
import { useTranslations } from 'next-intl';

import { useFormatDate } from '@/hooks/common/useFormatDate';

interface EstimateInfoSummaryProps {
  serviceType: ServiceType;
  fromAddress: string;
  toAddress: string;
  /** 이용일 (ISO) */
  moveDate: string;
  /** 견적 요청일 (ISO) */
  requestedAt: string;
}

/*
@ 값은 한 줄로 유지한다
- 시안은 짧은 주소 기준이지만 실제 주소는 desktop 260px 컬럼을 넘긴다.
  줄바꿈되면 행 높이가 제각각이 되어 gap이 무너지므로 말줄임으로 자른다.
- min-w-0: flex 아이템 기본 min-width가 auto라 이게 없으면 truncate가 먹지 않는다
- 잘린 전체 값은 title로 볼 수 있게 남긴다
*/
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full justify-between gap-[16px]">
      <span className="shrink-0 text-md-semibold text-orange-400 tablet:text-lg-semibold">
        {label}
      </span>
      <span
        title={value}
        className="min-w-0 text-right text-md-semibold text-black-500 tablet:text-lg-semibold"
      >
        {value}
      </span>
    </div>
  );
}

/** 이사 유형 아래·도착지 아래에만 들어가고, desktop에서는 사라진다 */
function RowDivider() {
  return <div className="h-px w-full bg-line-100 desktop:hidden" />;
}

export default function EstimateInfoSummary({
  serviceType,
  fromAddress,
  toAddress,
  moveDate,
  requestedAt,
}: EstimateInfoSummaryProps) {
  const t = useTranslations('Estimate');
  const tServiceType = useTranslations('ServiceType');
  const formatDate = useFormatDate();
  const requestedAtLabel = formatDate(requestedAt, 'short');

  return (
    <div className="flex flex-col items-center gap-[16px] tablet:items-start tablet:gap-[28px] desktop:gap-[40px]">
      <div className="flex w-full items-center justify-center tablet:justify-between">
        <p className="text-2lg-semibold text-black-400 tablet:text-xl-semibold">
          {t('info')}
        </p>
        <p className="hidden text-md-regular text-gray-500 tablet:block">
          {requestedAtLabel}
        </p>
      </div>

      <div className="flex w-full flex-col gap-[8px] tablet:gap-[12px] desktop:gap-[16px]">
        <InfoRow label={t('moveType')} value={tServiceType(serviceType)} />
        <RowDivider />
        <InfoRow label={t('departure')} value={fromAddress} />
        <InfoRow label={t('arrival')} value={toAddress} />
        <RowDivider />
        <InfoRow
          label={t('usageDate')}
          value={formatDate(moveDate, 'korean')}
        />
      </div>

      <p className="w-full text-right text-md-regular text-gray-500 tablet:hidden">
        {requestedAtLabel}
      </p>
    </div>
  );
}
