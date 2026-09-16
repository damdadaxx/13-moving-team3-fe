// 견적 요청 폼
// - 모바일: 3단계 위저드 (이사 유형 → 예정일 → 지역)
// - tablet~: 흰 카드 위에 전체 폼 한 번에 노출
'use client';

import { useRef, useState } from 'react';

import IcCalendar from '@/assets/icons/ic_calendar.svg';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';
import imgMovingHome from '@/assets/images/img_moving_home.png';
import imgMovingOffice from '@/assets/images/img_moving_office.png';
import imgMovingSmall from '@/assets/images/img_moving_small.png';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';

import DatePickerCalendar from './DatePickerCalendar';
import MovingTypeCard from './MovingTypeCard';

type MovingType = 'SMALL' | 'HOME' | 'OFFICE';

const MOVING_TYPES = [
  {
    value: 'SMALL',
    label: '소형이사',
    description: '원룸, 투룸, 20평대 미만',
    image: imgMovingSmall,
    imageClassName: 'p-[5px]',
  },
  {
    value: 'HOME',
    label: '가정이사',
    description: '쓰리룸, 20평대 이상',
    image: imgMovingHome,
  },
  {
    value: 'OFFICE',
    label: '사무실이사',
    description: '사무실, 상업공간',
    image: imgMovingOffice,
  },
] as const;

const STEP_TITLES: Record<number, string> = {
  1: '이사 유형을 선택해주세요',
  2: '이사 예정일을 선택해주세요',
  3: '이사 지역을 선택해주세요',
};

const SUB_TITLE = '견적을 요청하면 최대 5개의 견적을 받을 수 있어요 :)';

/** "2025년 7월 1일" - 이사 예정일 드롭다운 표기 (Figma는 0 패딩 없음) */
function formatMoveDate(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

export default function EstimateRequestForm() {
  const [step, setStep] = useState(1); // 모바일 위저드 단계
  const [movingType, setMovingType] = useState<MovingType | null>(null);
  const [moveDate, setMoveDate] = useState<Date | null>(null);
  const [fromAddress, setFromAddress] = useState<string | null>(null);
  const [toAddress, setToAddress] = useState<string | null>(null);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  useOutsideClick(calendarRef, () => setIsCalendarOpen(false), {
    enabled: isCalendarOpen,
    closeOnEscape: true,
  });

  const isComplete =
    movingType !== null &&
    moveDate !== null &&
    fromAddress !== null &&
    toAddress !== null;

  const handleSelectAddress = (target: 'from' | 'to') => {
    // TODO: 주소 검색 모달 연동 (별도 작업) - 선택 결과를 아래 setter로 반영
    const setAddress = target === 'from' ? setFromAddress : setToAddress;
    void setAddress;
  };

  const handleSubmit = () => {
    if (!isComplete) return;
    // TODO: 견적 요청 API 연동 (별도 작업)
  };

  const movingTypeCards = (
    <div className="flex flex-col gap-[16px] tablet:flex-row">
      {MOVING_TYPES.map((type) => (
        <MovingTypeCard
          key={type.value}
          label={type.label}
          description={type.description}
          image={type.image}
          imageClassName={
            'imageClassName' in type ? type.imageClassName : undefined
          }
          selected={movingType === type.value}
          onSelect={() => setMovingType(type.value)}
        />
      ))}
    </div>
  );

  const addressFields = (
    <>
      <AddressField
        label="출발지"
        address={fromAddress}
        onSelect={() => handleSelectAddress('from')}
      />
      <AddressField
        label="도착지"
        address={toAddress}
        onSelect={() => handleSelectAddress('to')}
      />
    </>
  );

  return (
    <div
      className={cn(
        'tablet:min-h-[calc(100dvh-108px)] tablet:bg-background-100 tablet:px-[22px] tablet:py-[24px]',
        'desktop:min-h-[calc(100dvh-184px)] desktop:py-[40px]',
      )}
    >
      {/* ---------------- 모바일: 3단계 위저드 ---------------- */}
      <div className="flex min-h-[calc(100dvh-108px)] flex-col px-[24px] pb-[34px] tablet:hidden">
        <div className="mt-[36px] flex flex-col items-center gap-[8px]">
          <div className="flex items-center gap-[8px]">
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={cn(
                  'text-xs-semibold flex size-[20px] items-center justify-center rounded-full',
                  n === step
                    ? 'bg-orange-400 text-gray-50'
                    : 'bg-background-200 text-gray-300',
                )}
              >
                {n}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center whitespace-nowrap">
            <p className="text-xl-bold text-black-500">{STEP_TITLES[step]}</p>
            <p className="text-md-regular text-gray-400">{SUB_TITLE}</p>
          </div>
        </div>

        {step === 1 && <div className="mt-[26px]">{movingTypeCards}</div>}
        {step === 2 && (
          <DatePickerCalendar
            value={moveDate}
            onChange={setMoveDate}
            className="mt-[70px]"
          />
        )}
        {step === 3 && (
          <div className="mt-[62px] flex flex-col gap-[24px]">
            {addressFields}
          </div>
        )}

        <div className="mt-auto flex gap-[8px] pt-[24px]">
          {step > 1 && (
            <Button
              variant="outlined"
              size="xs"
              className="flex-1"
              onClick={() => setStep(step - 1)}
            >
              이전
            </Button>
          )}
          {step === 1 && (
            <Button
              size="xs"
              className="ml-auto w-[158px]"
              disabled={movingType === null}
              onClick={() => setStep(2)}
            >
              다음
            </Button>
          )}
          {step === 2 && (
            <Button
              size="xs"
              className="flex-1"
              disabled={moveDate === null}
              onClick={() => setStep(3)}
            >
              다음
            </Button>
          )}
          {step === 3 && (
            <Button
              size="xs"
              className="flex-1"
              disabled={!isComplete}
              onClick={handleSubmit}
            >
              견적 요청하기
            </Button>
          )}
        </div>
      </div>

      {/* ---------------- tablet~ : 전체 폼 카드 ---------------- */}
      <div
        className={cn(
          'mx-auto hidden w-full max-w-[894px] rounded-[40px] bg-gray-50 px-[40px] pt-[80px] pb-[40px] tablet:block',
          'desktop:px-[47px] desktop:pb-[100px]',
        )}
      >
        <div className="flex flex-col items-center gap-[8px] whitespace-nowrap">
          <p className="text-2xl-bold text-black-500">
            이사 유형, 예정일과 지역을 선택해주세요
          </p>
          <p className="text-lg-regular text-gray-400">{SUB_TITLE}</p>
        </div>

        <div className="mt-[80px] flex flex-col gap-[64px]">
          <div className="flex flex-col gap-[16px]">
            <p className="text-2lg-bold text-black-300">이사 유형</p>
            {movingTypeCards}
          </div>

          <div className="flex flex-col gap-[32px]">
            <div className="flex items-center justify-between">
              <p className="text-2lg-bold text-black-300">이사 예정일</p>
              <div ref={calendarRef} className="relative w-[400px]">
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className="flex h-[50px] w-full cursor-pointer items-center gap-[8px] rounded-[12px] border border-gray-100 bg-gray-50 py-[16px] pr-[12px] pl-[20px]"
                >
                  <IcCalendar className="size-[24px] shrink-0" />
                  <span
                    className={cn(
                      'text-lg-medium flex-1 text-left',
                      moveDate ? 'text-black-400' : 'text-gray-400',
                    )}
                  >
                    {moveDate
                      ? formatMoveDate(moveDate)
                      : '이사 예정일 선택하기'}
                  </span>
                  <IcChevronDown className="size-[36px] shrink-0" />
                </button>
                {isCalendarOpen && (
                  <div className="absolute top-[58px] right-0 z-dropdown rounded-[24px] border border-line-100 bg-gray-50 p-[16px] shadow-[4px_4px_10px_0_rgba(169,169,169,0.2)]">
                    <DatePickerCalendar
                      value={moveDate}
                      onChange={(date) => {
                        setMoveDate(date);
                        setIsCalendarOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mx-auto w-full max-w-[705px] border-t border-line-100" />

            <div className="flex items-start justify-between">
              <p className="text-2lg-bold text-black-300">이사 지역</p>
              <div className="flex w-[400px] flex-col gap-[16px] desktop:w-[520px] desktop:flex-row">
                {addressFields}
              </div>
            </div>
          </div>
        </div>

        {/* tablet에서는 카드 내부 우측 하단 CTA (desktop CTA는 화면 우측 하단 고정) */}
        <div className="mt-[56px] flex justify-end desktop:hidden">
          <Button
            size="md"
            className="w-[200px]"
            disabled={!isComplete}
            onClick={handleSubmit}
          >
            견적 요청하기
          </Button>
        </div>
      </div>

      <div className="fixed right-[84px] bottom-[50px] hidden w-[200px] desktop:block">
        <Button size="md" disabled={!isComplete} onClick={handleSubmit}>
          견적 요청하기
        </Button>
      </div>
    </div>
  );
}

interface AddressFieldProps {
  label: string;
  address: string | null;
  onSelect: () => void;
}

function AddressField({ label, address, onSelect }: AddressFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-[12px] desktop:flex-1">
      <p className="text-lg-medium text-black-400">{label}</p>
      <button
        type="button"
        onClick={onSelect}
        className="text-lg-semibold flex h-[54px] w-full cursor-pointer items-center truncate rounded-[12px] border border-orange-400 px-[24px] text-left text-orange-400 shadow-[4px_4px_10px_0_rgba(195,217,242,0.2)] transition hover:bg-orange-100"
      >
        {address ?? `${label} 선택하기`}
      </button>
      {address && (
        <button
          type="button"
          onClick={onSelect}
          className="text-md-medium -mt-[4px] cursor-pointer self-end text-gray-500 underline"
        >
          수정하기
        </button>
      )}
    </div>
  );
}
