// [메뉴] 예시
// [페이지] 공용 Calender 컴포넌트 사용법

'use client';

import { useRef, useState } from 'react';

import IcCalendar from '@/assets/icons/ic_calendar.svg';
import IcChevronDown from '@/assets/icons/ic_chevron_down.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';

import { cn } from '@/utils/cn';

import Calender from '@/components/ui/Calender/Calender';

const formatDot = (date: Date | null) =>
  date
    ? `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`
    : '-';

const formatKorean = (date: Date | null) =>
  date
    ? `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
    : '이사 예정일을 선택해 주세요';

/**
 * 견적 요청 화면의 "이사 예정일" 드롭다운 (Figma 견적요청_dropdown/Desktop, node 1:3784)
 * 트리거는 Dropdown2, 열리면 아래로 Calender가 붙는다.
 * 재사용이 필요해지면 이 컴포넌트만 그대로 들어내면 된다.
 */
function MovingDateDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  /* useOutsideClick이 RefObject<HTMLElement>를 받아서 null! 로 초기화한다 */
  const ref = useRef<HTMLDivElement>(null!);

  useOutsideClick(ref, () => setIsOpen(false), {
    enabled: isOpen,
    closeOnEscape: true,
  });

  return (
    <div ref={ref} className="relative w-[400px] max-w-full">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-[50px] w-full cursor-pointer items-center gap-2 rounded-[12px] border border-gray-300 bg-gray-50 pr-3 pl-5"
      >
        <IcCalendar className="size-6 shrink-0 text-orange-400" />
        <span
          className={cn(
            'flex-1 text-left text-lg-medium',
            date ? 'text-black-400' : 'text-gray-400',
          )}
        >
          {formatKorean(date)}
        </span>
        {/* 열림 상태 표시는 Figma에 없지만, 화살표가 안 움직이면 드롭다운으로 안 읽혀서 넣었다 */}
        <IcChevronDown
          className={cn(
            'size-9 shrink-0 text-black-400 transition-transform',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 z-dropdown mt-2">
          <Calender
            value={date}
            onChange={setDate}
            onConfirm={(next) => {
              setDate(next);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function CalenderExamplePage() {
  const [picked, setPicked] = useState<Date | null>(null);
  const [confirmed, setConfirmed] = useState<Date | null>(null);

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">Calender 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          Figma <code>DatePicker/calendar/sm</code>을 옮긴 컴포넌트입니다. 날짜
          선택 로직은 프로젝트에 이미 설치돼 있는 <code>react-calendar</code>를
          쓰고, 스타일만 Tailwind로 입혔습니다.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          1. 드롭다운 — 견적 요청 화면의 실제 사용 형태
        </h2>
        <p className="text-md-regular text-gray-500">
          Figma <code>견적요청_dropdown/Desktop</code>의 &ldquo;이사
          예정일&rdquo; 필드입니다. 트리거(<code>Dropdown2</code>)를 누르면
          아래로 달력이 열리고, 바깥 클릭 · ESC · 선택완료로 닫힙니다. 바깥 클릭
          감지는 기존 <code>useOutsideClick</code> 훅을 씁니다.
        </p>
        <div className="pb-[520px]">
          <MovingDateDropdown />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">2. 기본 (비제어)</h2>
        <p className="text-md-regular text-gray-500">
          <code>value</code>를 넘기지 않으면 컴포넌트가 선택 상태를 직접 들고
          있습니다. 아무것도 고르지 않은 상태에서는 선택완료 버튼이
          비활성(gray-300)입니다.
        </p>
        <Calender onConfirm={setConfirmed} />
        <p className="text-md-regular text-gray-500">
          선택완료로 확정한 날짜: <strong>{formatDot(confirmed)}</strong>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">3. 제어 컴포넌트</h2>
        <p className="text-md-regular text-gray-500">
          <code>value</code> + <code>onChange</code>로 부모가 상태를 들고 있는
          경우입니다.
        </p>
        <Calender value={picked} onChange={setPicked} />
        <p className="text-md-regular text-gray-500">
          현재 선택: <strong>{formatDot(picked)}</strong>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">4. 선택 가능 범위 제한</h2>
        <p className="text-md-regular text-gray-500">
          <code>minDate</code>를 오늘로 두면 지난 날짜는 비활성됩니다. 이사
          예정일처럼 과거를 못 고르게 할 때 씁니다.
        </p>
        <Calender minDate={new Date()} confirmLabel="이사일 선택완료" />
      </section>
    </div>
  );
}
