// 헤더 알림 드롭다운
'use client';

import { useRef } from 'react';

import { useRouter } from '@/i18n/navigation';
import type { Notification } from '@/types/notification';
import { cva } from 'class-variance-authority';

import IcAlarmClose from '@/assets/icons/ic_alarm_close.svg';
import IcMarkAllRead from '@/assets/icons/ic_mark_all_read.svg';

import useInfiniteScroll from '@/hooks/common/useInfiniteScroll';
import { useAuth } from '@/hooks/features/auth/useAuth';
import {
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
} from '@/hooks/features/notification/queries/mutations';
import {
  useNotificationsQuery,
  useUnreadCountQuery,
} from '@/hooks/features/notification/queries/queries';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';
import getNotificationHref from '@/utils/getNotificationHref';
import splitNotificationContent from '@/utils/splitNotificationContent';

import { HEADER_PANEL_IDS } from '@/components/ui/Header/types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationStatusItemProps {
  message: string;
}

/** 알림 상태 아이템 컴포넌트 */
function NotificationStatusItem({ message }: NotificationStatusItemProps) {
  return (
    <li className={cn('px-[32px] py-[24px] text-md-medium text-gray-400')}>
      {message}
    </li>
  );
}

const notificationDropdownPanel = cva(
  cn(
    'absolute top-[40px] right-[-4px] z-dropdown origin-top-right pt-[10px]',
    'flex max-h-[314px] w-[312px] flex-col items-start overflow-hidden rounded-[24px] border border-line-200 bg-gray-50',
    'drop-shadow-[2px_2px_8px_rgba(0,0,0,0.06)]',
    'transition-[opacity,transform] duration-200 ease-out',
    'tablet:top-[43px] tablet:right-[36px]',
    'desktop:top-[62px] desktop:right-[103px] desktop:w-[359px] desktop:max-h-[352px]',
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
 * @returns 알림 드롭다운 컴포넌트
 */
export default function NotificationDropdown({
  isOpen,
  onClose,
}: NotificationDropdownProps) {
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);
  const { role } = useAuth();
  const { data: unread } = useUnreadCountQuery(true);
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotificationsQuery(isOpen);
  const readNotification = useReadNotificationMutation();
  const readAllNotifications = useReadAllNotificationsMutation();
  const notifications = data?.pages.flatMap((page) => page.list) ?? [];
  const sentinelRef = useInfiniteScroll<HTMLLIElement>({
    onIntersect: () => {
      void fetchNextPage();
    },
    enabled: isOpen && hasNextPage && !isFetchingNextPage,
    rootRef: listRef,
    rootMargin: '48px',
  });

  /** 알림 모두 읽음 처리 */
  const handleMarkAllRead = () => {
    if ((unread?.unreadCount ?? 0) === 0 || readAllNotifications.isPending) {
      return;
    }
    readAllNotifications.mutate();
  };

  /** 알림 클릭 처리 */
  const handleItemClick = (item: Notification) => {
    if (!item.isRead) {
      readNotification.mutate(item.id);
    }
    onClose();
    if (!role) return;

    // 알림 링크 이동
    router.push(getNotificationHref(role, item));
  };

  return (
    <div
      id={HEADER_PANEL_IDS.notification}
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
            disabled={(unread?.unreadCount ?? 0) === 0}
            className={cn(
              'h-[24px] w-[24px] cursor-pointer overflow-clip',
              'disabled:cursor-default disabled:opacity-40',
            )}
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
        <ul
          ref={listRef}
          className={cn('min-h-0 flex-1 overflow-y-auto scrollbar-gray-300')}
        >
          {isLoading ? (
            <NotificationStatusItem message="알림을 불러오는 중이에요." />
          ) : null}
          {isError ? (
            <NotificationStatusItem message="알림을 불러오지 못했어요." />
          ) : null}
          {!isLoading && !isError && notifications.length === 0 ? (
            <NotificationStatusItem message="알림이 없어요." />
          ) : null}

          {/* 알림 목록 렌더링 */}
          {notifications.map((item, index) => {
            const parts = splitNotificationContent(item.content);
            const isLast = index === notifications.length - 1;

            return (
              <li
                key={item.id}
                className={cn(
                  'border-b border-line-200 px-[16px]',
                  isLast && 'border-b-0 pb-[10px]',
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
                    {parts.map((part, index) => (
                      <span
                        key={`${item.id}-${index}`}
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
                    {formatDate(item.createdAt, 'relative')}
                  </p>
                </button>
              </li>
            );
          })}
          <li ref={sentinelRef} aria-hidden className={cn('h-px')} />
        </ul>
      </div>
    </div>
  );
}
