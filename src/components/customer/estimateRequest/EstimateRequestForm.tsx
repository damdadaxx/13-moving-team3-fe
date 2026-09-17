// 견적 요청 폼
// - 모바일: 3단계 위저드 (이사 유형 → 예정일 → 지역)
// - tablet~: 흰 카드 위에 전체 폼 한 번에 노출
'use client';

import { useMemo, useState } from 'react';

import { SERVICE_TYPE_LABELS, type ServiceType } from '@/types/serviceType';
import type { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';

import imgMovingHome from '@/assets/images/img_moving_home.png';
import imgMovingOffice from '@/assets/images/img_moving_office.png';
import imgMovingSmall from '@/assets/images/img_moving_small.png';

import { HttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useCreateEstimateRequestMutation } from '@/hooks/queries/estimate/mutations';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import Calendar from '@/components/ui/Calendar/Calendar';
import DateDropdown from '@/components/ui/Calendar/DateDropdown';

import AddressSearchModal, { type AddressResult } from './AddressSearchModal';
import MovingTypeCard from './MovingTypeCard';

/* value는 백엔드 Prisma ServiceType enum과 같은 값이어야 한다 (types/serviceType) */
const MOVING_TYPES = [
  {
    value: 'SMALL_MOVE',
    description: '원룸, 투룸, 20평대 미만',
    image: imgMovingSmall,
    imageClassName: 'p-[5px]',
  },
  {
    value: 'HOME_MOVE',
    description: '쓰리룸, 20평대 이상',
    image: imgMovingHome,
  },
  {
    value: 'OFFICE_MOVE',
    description: '사무실, 상업공간',
    image: imgMovingOffice,
  },
] as const satisfies readonly {
  value: ServiceType;
  description: string;
  image: StaticImageData;
  imageClassName?: string;
}[];

const STEP_TITLES: Record<number, string> = {
  1: '이사 유형을 선택해주세요',
  2: '이사 예정일을 선택해주세요',
  3: '이사 지역을 선택해주세요',
};

const SUB_TITLE = '견적을 요청하면 최대 5개의 견적을 받을 수 있어요 :)';

export default function EstimateRequestForm() {
  const [step, setStep] = useState(1); // 모바일 위저드 단계
  const [movingType, setMovingType] = useState<ServiceType | null>(null);
  const [moveDate, setMoveDate] = useState<Date | null>(null);
  /* 백엔드가 우편번호(5자리)를 따로 받아서 주소 문자열만으로는 부족하다 */
  const [fromAddress, setFromAddress] = useState<AddressResult | null>(null);
  const [toAddress, setToAddress] = useState<AddressResult | null>(null);
  const [submitError, setSubmitError] = useState('');

  const router = useRouter();
  const createEstimateRequest = useCreateEstimateRequestMutation();
  const isSubmitting = createEstimateRequest.isPending;

  /* 백엔드가 moveDate <= now 를 거부하므로 오늘은 고를 수 없다. 내일부터 허용한다 */
  const minMoveDate = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
    return date;
  }, []);

  const isComplete =
    movingType !== null &&
    moveDate !== null &&
    fromAddress !== null &&
    toAddress !== null;

  /* 주소 모달은 출발지/도착지가 같은 컴포넌트를 공유하고, 어느 쪽을 여는지만 들고 있는다 */
  const [addressTarget, setAddressTarget] = useState<'from' | 'to' | null>(
    null,
  );

  const handleSelectAddress = (target: 'from' | 'to') => {
    setAddressTarget(target);
  };

  const handleAddressSelected = (address: AddressResult) => {
    const setAddress = addressTarget === 'from' ? setFromAddress : setToAddress;
    setAddress(address);
  };

  const handleSubmit = async () => {
    /* isComplete와 같은 조건이지만, 개별로 확인해야 아래에서 타입이 좁혀진다 */
    if (!movingType || !moveDate || !fromAddress || !toAddress) return;

    setSubmitError('');

    try {
      await createEstimateRequest.mutateAsync({
        serviceType: movingType,
        moveDate,
        departureZipCode: fromAddress.zoneCode,
        departureAddress: fromAddress.roadAddress,
        arrivalZipCode: toAddress.zoneCode,
        arrivalAddress: toAddress.roadAddress,
      });
      /* 요청이 생기면 이 페이지는 "진행 중" 화면으로 바뀌므로, 받은 견적을 볼 수 있는
         대기 중인 견적으로 보낸다 */
      router.push(ROUTES.customerEstimatesPending);
    } catch (error) {
      /* 이미 진행 중인 요청이 있으면 409로 온다 */
      setSubmitError(
        error instanceof HttpError
          ? error.message
          : '견적 요청에 실패했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  const movingTypeCards = (
    <div className="flex flex-col gap-[16px] tablet:flex-row tablet:gap-[12px] desktop:gap-[16px]">
      {MOVING_TYPES.map((type) => (
        <MovingTypeCard
          key={type.value}
          label={SERVICE_TYPE_LABELS[type.value]}
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

  const submitErrorMessage = submitError ? (
    <p className="text-md-medium text-red-200">{submitError}</p>
  ) : null;

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
        'tablet:min-h-[calc(100dvh-108px)] tablet:bg-background-100 tablet:px-[22px] tablet:py-[37px]',
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
          <Calendar
            size="md"
            value={moveDate}
            onChange={setMoveDate}
            minDate={minMoveDate}
            /* 달력 336px은 페이지 좌우 패딩(24px)을 뺀 327px보다 넓다.
               Calendar 기본 max-w-full을 풀어 336을 지키고, self-center로 양쪽에
               고르게 넘치게 한다 (시안도 달력만 좌우 20px) */
            className="mt-[70px] max-w-none self-center"
          />
        )}
        {step === 3 && (
          <div className="mt-[62px] flex flex-col gap-[24px]">
            {addressFields}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-[12px] pt-[12px]">
          {step === 3 && submitErrorMessage}
          {/* 시안은 두 버튼이 정확히 반반이다. flex-1은 outlined/solid의
              패딩·테두리 차이만큼 폭이 갈려서 grid로 나눈다 */}
          <div
            className={cn(
              step === 1 ? 'flex' : 'grid grid-cols-2',
              'gap-[8px]',
            )}
          >
            {step > 1 && (
              <Button
                variant="outlined"
                size="sm"
                onClick={() => setStep(step - 1)}
              >
                이전
              </Button>
            )}
            {step === 1 && (
              <Button
                size="sm"
                className="ml-auto w-[158px]"
                disabled={movingType === null}
                onClick={() => setStep(2)}
              >
                다음
              </Button>
            )}
            {step === 2 && (
              <Button
                size="sm"
                disabled={moveDate === null}
                onClick={() => setStep(3)}
              >
                다음
              </Button>
            )}
            {step === 3 && (
              <Button
                size="sm"
                disabled={!isComplete || isSubmitting}
                onClick={handleSubmit}
              >
                견적 요청하기
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------- tablet~ : 전체 폼 카드 ---------------- */}
      <div
        className={cn(
          'mx-auto hidden w-full max-w-[894px] rounded-[40px] bg-gray-50 px-[40px] pt-[79px] pb-[49px] tablet:block',
          'desktop:px-[47px] desktop:pt-[89px] desktop:pb-[107px]',
        )}
      >
        <div className="flex flex-col items-center gap-[8px] whitespace-nowrap">
          <p className="text-2xl-bold text-black-500">
            이사 유형, 예정일과 지역을 선택해주세요
          </p>
          <p className="text-lg-regular text-gray-400">{SUB_TITLE}</p>
        </div>

        <div className="mt-[64px] flex flex-col gap-[48px] desktop:mt-[80px] desktop:gap-[64px]">
          <div className="flex flex-col gap-[16px]">
            <p className="text-2lg-bold text-black-300">이사 유형</p>
            {movingTypeCards}
          </div>

          <div className="flex flex-col gap-[32px]">
            <div className="flex items-start justify-between">
              <p className="text-2lg-bold text-black-300">이사 예정일</p>
              {/* 시안상 달력이 트리거와 같은 400px라 calendarClassName으로 넓힌다 */}
              <DateDropdown
                value={moveDate}
                onChange={setMoveDate}
                onConfirm={setMoveDate}
                placeholder="이사 예정일 선택하기"
                confirmLabel="이사일 선택완료"
                minDate={minMoveDate}
                aria-label="이사 예정일"
                className="w-[400px]"
                calendarClassName="w-[400px]"
              />
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
        <div className="mt-[57px] flex flex-col items-end gap-[12px] desktop:hidden">
          {submitErrorMessage}
          <Button
            size="lg"
            className="w-[200px]"
            disabled={!isComplete || isSubmitting}
            onClick={handleSubmit}
          >
            견적 요청하기
          </Button>
        </div>
      </div>

      <div className="fixed right-[84px] bottom-[50px] hidden w-[200px] flex-col gap-[12px] desktop:flex">
        {submitErrorMessage}
        <Button
          size="lg"
          disabled={!isComplete || isSubmitting}
          onClick={handleSubmit}
        >
          견적 요청하기
        </Button>
      </div>

      <AddressSearchModal
        isOpen={addressTarget !== null}
        onClose={() => setAddressTarget(null)}
        label={addressTarget === 'to' ? '도착지' : '출발지'}
        onSelect={handleAddressSelected}
      />
    </div>
  );
}

interface AddressFieldProps {
  label: string;
  address: AddressResult | null;
  onSelect: () => void;
}

function AddressField({ label, address, onSelect }: AddressFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-[12px] desktop:flex-1">
      <p className="text-lg-medium text-black-400">{label}</p>
      {/* 카카오가 건물명까지 붙여줘서 주소가 길다. 넘치면 말줄임하고 전체는 title로 보여준다.
          truncate는 버튼이 아니라 안쪽 span에 둔다 —
          flex 컨테이너의 텍스트는 익명 flex item이라 ellipsis가 적용되지 않는다 */}
      <button
        type="button"
        onClick={onSelect}
        title={address?.roadAddress}
        className="text-lg-semibold flex h-[54px] w-full cursor-pointer items-center rounded-[12px] border border-orange-400 px-[24px] text-left text-orange-400 shadow-[4px_4px_10px_0_rgba(195,217,242,0.2)] transition hover:bg-orange-100"
      >
        <span className="truncate">
          {address?.roadAddress ?? `${label} 선택하기`}
        </span>
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
