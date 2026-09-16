// [메뉴] 예시
// [페이지] 공용 Calendar / DateDropdown 컴포넌트 사용법

'use client';

import { useState } from 'react';

import Calendar from '@/components/ui/Calendar/Calendar';
import DateDropdown from '@/components/ui/Calendar/DateDropdown';

const formatDot = (date: Date | null) =>
  date
    ? `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`
    : '-';

export default function CalendarExamplePage() {
  const [picked, setPicked] = useState<Date | null>(null);
  const [confirmed, setConfirmed] = useState<Date | null>(null);
  const [movingDate, setMovingDate] = useState<Date | null>(null);

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">Calendar · DateDropdown 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          Figma <code>Date picker</code>를 옮긴 컴포넌트입니다. 날짜 선택 로직은
          프로젝트에 이미 설치돼 있는 <code>react-calendar</code>를 쓰고,
          스타일만 Tailwind로 입혔습니다. 트리거 + 팝업 형태가 필요하면{' '}
          <code>DateDropdown</code>을, 달력만 필요하면 <code>Calendar</code>를
          씁니다. <code>Calendar</code>는 팝업용 <code>sm</code>과 모바일
          인라인용 <code>md</code> 두 사이즈가 있습니다.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          1. DateDropdown — 견적 요청 화면의 실제 사용 형태
        </h2>
        <p className="text-md-regular text-gray-500">
          Figma <code>견적요청_dropdown/Desktop</code>의 &ldquo;이사
          예정일&rdquo; 필드입니다. 트리거(<code>Dropdown2</code>)를 누르면
          아래로 달력이 열리고, 바깥 클릭 · ESC · 선택완료로 닫힙니다.{' '}
          <code>value</code>를 넘기지 않으면 선택 상태를 컴포넌트가 직접 들고
          있어서 <code>onConfirm</code>만 받으면 됩니다. 열려 있는 동안 트리거
          테두리는 주황(<code>orange-400</code> 2px)으로 바뀝니다. 이 화면의
          달력은 시안상 트리거와 같은 400px라 <code>calendarClassName</code>으로
          넓혀 줍니다(기본값 343px).
        </p>
        <div className="pb-[520px]">
          <DateDropdown
            placeholder="이사 예정일을 선택해 주세요"
            aria-label="이사 예정일"
            confirmLabel="이사일 선택완료"
            minDate={new Date()}
            onConfirm={setMovingDate}
            className="w-[400px]"
            calendarClassName="w-[400px]"
          />
          <p className="mt-3 text-md-regular text-gray-500">
            확정한 이사 예정일: <strong>{formatDot(movingDate)}</strong>
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          2. DateDropdown — 제어 컴포넌트 · 오른쪽 정렬 · 비활성
        </h2>
        <p className="text-md-regular text-gray-500">
          부모가 상태를 들고 있으려면 <code>value</code>와 함께{' '}
          <code>onChange</code>도 넘겨야 합니다(달력에서 누른 날짜가 바로
          반영되는 경로라서, 빠뜨리면 하이라이트가 움직이지 않습니다). 달력이
          트리거보다 좁아서 <code>align=&quot;right&quot;</code>로 오른쪽 끝에
          맞출 수 있습니다.
        </p>
        <div className="flex items-start gap-4 pb-[520px]">
          <DateDropdown
            value={picked}
            onChange={setPicked}
            onConfirm={setPicked}
            align="right"
            aria-label="제어 컴포넌트 예시"
            className="w-[400px]"
          />
          <DateDropdown
            disabled
            aria-label="비활성 예시"
            className="w-[200px]"
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">3. Calendar 기본 (비제어)</h2>
        <p className="text-md-regular text-gray-500">
          <code>value</code>를 넘기지 않으면 컴포넌트가 선택 상태를 직접 들고
          있습니다. 아무것도 고르지 않은 상태에서는 선택완료 버튼이
          비활성(gray-300)입니다.
        </p>
        <Calendar onConfirm={setConfirmed} />
        <p className="text-md-regular text-gray-500">
          선택완료로 확정한 날짜: <strong>{formatDot(confirmed)}</strong>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">4. Calendar 제어 컴포넌트</h2>
        <p className="text-md-regular text-gray-500">
          <code>value</code> + <code>onChange</code>로 부모가 상태를 들고 있는
          경우입니다. 위 2번 드롭다운과 같은 상태를 공유합니다.
        </p>
        <Calendar value={picked} onChange={setPicked} />
        <p className="text-md-regular text-gray-500">
          현재 선택: <strong>{formatDot(picked)}</strong>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">5. Calendar 선택 가능 범위 제한</h2>
        <p className="text-md-regular text-gray-500">
          <code>minDate</code>를 오늘로 두면 지난 날짜는 비활성됩니다. 이사
          예정일처럼 과거를 못 고르게 할 때 씁니다.
        </p>
        <Calendar minDate={new Date()} confirmLabel="이사일 선택완료" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          6. Calendar size=&quot;md&quot; — 모바일 견적요청 인라인 형태
        </h2>
        <p className="text-md-regular text-gray-500">
          Figma <code>Date picker-Calendar/md</code>(336×352)입니다. 카드
          테두리·배경이 없고 날짜 칸이 48×48로 커집니다. 화면 하단의 &ldquo;이전
          / 다음&rdquo;이 확정을 맡기 때문에 선택완료 버튼도 기본으로 빠집니다(
          <code>showConfirm</code>으로 되돌릴 수 있습니다). 위 3~5번의{' '}
          <code>sm</code>과 칸 크기를 비교해 보세요.
        </p>
        <Calendar
          size="md"
          minDate={new Date()}
          onChange={setPicked}
          value={picked}
        />
      </section>
    </div>
  );
}
