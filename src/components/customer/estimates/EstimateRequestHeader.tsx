// [메뉴] 내 견적 관리 메뉴 > 대기 중인 견적
// 내가 보낸 견적 요청 요약 바 (Figma: Sub Header/요청 견적
//   Desktop 510:40241 · Tablet 510:40262 · Mobile 510:40283)
//
// mobile: 세로 스택, 라벨은 왼쪽 값은 오른쪽으로 밀어 정렬한다
// tablet: 제목 아래 출발지·도착지·이사일이 한 줄
// desktop: 제목은 왼쪽, 출발지·도착지·이사일은 오른쪽 끝으로 한 줄
import { SERVICE_TYPE_LABELS, type ServiceType } from '@/types/serviceType';

import IcArrowRight from '@/assets/icons/ic_arrow_right_sm.svg';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';
import formatRegion from '@/utils/formatRegion';

interface EstimateRequestHeaderProps {
  serviceType: ServiceType;
  /** 견적 신청일 (ISO 8601) */
  requestedAt: string;
  /** 출발지 도로명 주소 원문 (예: '서울 중구 세종대로 110') */
  departureAddress: string;
  /** 도착지 도로명 주소 원문 */
  arrivalAddress: string;
  /** 이사일 (ISO 8601) */
  moveDate: string;
}

interface FieldProps {
  label: string;
  value: string;
}

function Field({ label, value }: FieldProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between',
        'tablet:flex-col tablet:items-start tablet:justify-center',
      )}
    >
      <span className="text-md-regular text-gray-500">{label}</span>
      <span
        className={cn(
          'text-md-semibold whitespace-nowrap text-black-500',
          'tablet:text-2lg-semibold',
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function EstimateRequestHeader({
  serviceType,
  requestedAt,
  departureAddress,
  arrivalAddress,
  moveDate,
}: EstimateRequestHeaderProps) {
  return (
    <div
      className={cn(
        'bg-gray-50 p-[24px] shadow-[0_8px_10px_0_rgba(39,39,75,0.02)]',
        'tablet:px-[72px] tablet:py-[32px]',
      )}
    >
      {/* 위쪽 Tab과 같은 폭(max-w-1200)으로 맞춘다 — 좌우 패딩도 Tab과 동일하다 */}
      <div
        className={cn(
          'mx-auto flex w-full max-w-[1200px] flex-col gap-[20px]',
          'tablet:gap-[28px]',
          'desktop:flex-row desktop:items-end desktop:gap-[20px]',
        )}
      >
        <div
          className={cn('flex flex-col', 'tablet:gap-[4px]', 'desktop:flex-1')}
        >
          <p
            className={cn(
              'text-xl-bold text-black-500',
              'tablet:text-2xl-bold',
            )}
          >
            {SERVICE_TYPE_LABELS[serviceType]}
          </p>
          <p
            className={cn(
              'text-xs-regular text-gray-500',
              'tablet:text-md-regular',
            )}
          >
            견적 신청일: {formatDate(requestedAt, 'requested')}
          </p>
        </div>

        <div
          className={cn(
            'flex flex-col gap-[4px]',
            'tablet:flex-row tablet:items-start tablet:gap-[40px]',
          )}
        >
          <div
            className={cn(
              'flex flex-col gap-[4px]',
              'tablet:flex-row tablet:items-end tablet:gap-[12px]',
            )}
          >
            {/* 주소 원문은 도로명·건물명까지 길어서 시·군·구까지만 줄여 쓴다 */}
            <Field label="출발지" value={formatRegion(departureAddress)} />
            {/* 화살표는 출발지 → 도착지가 한 줄로 놓이는 tablet부터 보인다 */}
            <IcArrowRight
              aria-hidden="true"
              className="hidden h-[23px] w-[8.5px] shrink-0 tablet:block"
            />
            <Field label="도착지" value={formatRegion(arrivalAddress)} />
          </div>
          <Field label="이사일" value={formatDate(moveDate, 'korean')} />
        </div>
      </div>
    </div>
  );
}
