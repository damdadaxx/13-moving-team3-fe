// 헤더 알림 드롭다운
'use client';

import { useState, type Ref } from 'react';

import { cva } from 'class-variance-authority';

import IcAlarmClose from '@/assets/icons/ic_alarm_close.svg';
import IcMarkAllRead from '@/assets/icons/ic_mark_all_read.svg';

import { cn } from '@/utils/cn';

import { HEADER_PANEL_IDS } from '@/components/ui/Header/types';

interface NotificationPart {
  text: string;
  isHighlight?: boolean;
}

interface NotificationItem {
  id: string;
  parts: NotificationPart[];
  timeLabel: string;
  isRead: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadChange?: (count: number) => void;
  ref?: Ref<HTMLDivElement>;
}

// TODO: 알림 API 연동 후 실제 목록으로 교체
const DUMMY_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    parts: [
      { text: '김코드 기사님의 ' },
      { text: '소형이사 견적', isHighlight: true },
      { text: '이 도착했어요.' },
    ],
    timeLabel: '2시간 전',
    isRead: false,
  },
  {
    id: '2',
    parts: [
      { text: '김코드 기사님의 견적이 ' },
      { text: '확정', isHighlight: true },
      { text: '되었어요.' },
    ],
    timeLabel: '3시간 전',
    isRead: false,
  },
  {
    id: '3',
    parts: [
      { text: '내일은 ' },
      { text: '경기(일산) → 서울(영등포) 이사 예정일', isHighlight: true },
      { text: '이에요.' },
    ],
    timeLabel: '5시간 전',
    isRead: false,
  },
  {
    id: '4',
    parts: [
      { text: '내일은 ' },
      { text: '경기(일산) → 서울(영등포) 이사 예정일', isHighlight: true },
      { text: '이에요.' },
    ],
    timeLabel: '5시간 전',
    isRead: true,
  },
];

export const DUMMY_UNREAD_COUNT = DUMMY_NOTIFICATIONS.filter(
  (item) => !item.isRead,
).length;

const notificationDropdownPanel = cva(
  cn(
    'absolute top-[48px] right-[20px] z-dropdown origin-center pt-[10px]',
    'flex max-h-[314px] w-[312px] flex-col items-start overflow-hidden rounded-[24px] border border-line-200 bg-gray-50',
    'drop-shadow-[2px_2px_8px_rgba(0,0,0,0.06)]',
    'transition-[opacity,transform] duration-200 ease-out',
    'tablet:top-[50px] tablet:right-[108px]',
    'desktop:top-[80px] desktop:right-[175px] desktop:w-[359px] desktop:max-h-[352px]',
  ),
  {
    variants: {
      open: {
        true: 'pointer-events-auto opacity-100',
        false: 'pointer-events-none opacity-0',
      },
    },
  },
);

const notificationDropdownItem = cva(
  cn(
    'flex w-full flex-col items-start justify-center gap-[2px] px-[16px] py-[12px] text-left',
    'desktop:px-[24px] desktop:py-[16px]',
  ),
);

/**
 * 알림 드롭다운
 * @param isOpen - 드롭다운 열림 여부
 * @param onClose - 드롭다운 닫기 핸들러
 * @param ref - 드롭다운 참조
 * @returns 알림 드롭다운 컴포넌트
 */
export default function NotificationDropdown({
  isOpen,
  onClose,
  onUnreadChange,
  ref,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  /** 알림 모두 읽음 처리 */
  const handleMarkAllRead = () => {
    setNotifications((prev) =>
      prev.map((item) => (item.isRead ? item : { ...item, isRead: true })),
    );
    onUnreadChange?.(0);
  };

  const handleItemClick = (item: NotificationItem) => {
    if (!item.isRead) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === item.id
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
      onUnreadChange?.(
        notifications.filter(
          (notification) => notification.id !== item.id && !notification.isRead,
        ).length,
      );
    }
    onClose();
  };

  return (
    <div
      id={HEADER_PANEL_IDS.notification}
      ref={ref}
      aria-hidden={!isOpen}
      inert={!isOpen}
      className={notificationDropdownPanel({ open: isOpen })}
    >
      <div
        className={cn(
          'flex w-full shrink-0 items-center justify-between py-[14px] pl-[32px] pr-[28px]',
        )}
      >
        <p
          className={cn('text-lg-bold text-black-300', 'desktop:text-2lg-bold')}
        >
          알림
        </p>
        <div className={cn('flex gap-[8px]')}>
          <button
            type="button"
            aria-label="알림 모두 읽음 처리"
            onClick={handleMarkAllRead}
            className={cn('h-[24px] w-[24px] cursor-pointer overflow-clip')}
          >
            <IcMarkAllRead aria-hidden className={cn('h-full w-full')} />
          </button>
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={onClose}
            className={cn('h-[24px] w-[24px] cursor-pointer overflow-clip')}
          >
            <IcAlarmClose aria-hidden className={cn('h-full w-full')} />
          </button>
        </div>
      </div>
      <div className={cn('flex min-h-0 w-full flex-1 flex-col')}>
        <ul className={cn('min-h-0 flex-1 overflow-y-auto scrollbar-gray-300')}>
          {notifications.map((item) => (
            <li
              key={item.id}
              className={cn(
                'border-b border-line-200 last:border-b-0 last:pb-[10px] px-[16px]',
                'hover:bg-background-200 transition-colors duration-300',
              )}
            >
              <button
                type="button"
                onClick={() => handleItemClick(item)}
                className={cn(notificationDropdownItem(), 'cursor-pointer')}
              >
                <p
                  className={cn(
                    'text-md-medium',
                    'desktop:text-lg-medium',
                    item.isRead ? 'text-gray-400' : 'text-black-400',
                  )}
                >
                  {item.parts.map((part) => (
                    <span
                      key={part.text}
                      className={cn(
                        !item.isRead && part.isHighlight
                          ? 'text-orange-400'
                          : undefined,
                      )}
                    >
                      {part.text}
                    </span>
                  ))}
                </p>
                <p
                  className={cn(
                    'text-sm-medium text-gray-400',
                    'desktop:text-md-medium',
                  )}
                >
                  {item.timeLabel}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
