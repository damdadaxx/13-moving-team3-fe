// GNB 채팅 플로팅 버튼 (안 읽은 메시지 배지 + 채팅방 목록 팝오버)
'use client';

import { useRef, useState } from 'react';

import type { ChatRoomListItem } from '@/types/chat';
import { cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';

import IcAlarmClose from '@/assets/icons/ic_alarm_close.svg';
import IcChat from '@/assets/icons/ic_chat.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { useChatRoomsQuery } from '@/hooks/features/chat/queries/queries';
import { useChatRealtimeSync } from '@/hooks/features/chat/useChatRealtimeSync';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import ChatRoomView from '@/components/features/chat/ChatRoomView';
import ProfileImage from '@/components/ui/ProfileImage';

const CHAT_PANEL_ID = 'chat-room-list';

function formatBadgeCount(count: number) {
  if (count <= 0) return null;
  return count > 99 ? '99+' : String(count);
}

const panelStyle = cva(
  cn(
    'flex flex-col overflow-hidden bg-gray-50',
    'drop-shadow-[2px_2px_8px_rgba(0,0,0,0.06)]',
    'transition-[opacity,transform] duration-200 ease-out',
    // 모바일: 화면 전체를 쓴다. 헤더(z-header)보다 위에 떠야 해서 z-modal을 쓴다
    'fixed inset-0 z-modal h-full w-full rounded-none',
    // 태블릿 이상: 버튼 위에 뜨는 작은 팝오버. 목록 ↔ 채팅창 전환 시 크기가 바뀌지 않게 동일 크기
    'tablet:absolute tablet:inset-auto tablet:right-0 tablet:bottom-[calc(100%+12px)] tablet:z-dropdown tablet:origin-bottom-right',
    'tablet:h-[480px] tablet:w-[360px] tablet:rounded-[24px] tablet:border tablet:border-line-200',
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

interface ChatRoomItemProps {
  room: ChatRoomListItem;
  onClick: () => void;
}

function ChatRoomItem({ room, onClick }: ChatRoomItemProps) {
  const t = useTranslations('Chat');
  const { otherParty, lastMessage, unreadCount } = room;
  const preview = lastMessage
    ? (lastMessage.content ?? t('imagePreview'))
    : t('noMessageYet');
  const badge = formatBadgeCount(unreadCount);

  return (
    <li className={cn('border-b border-line-200 last:border-b-0')}>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full cursor-pointer items-center gap-[12px] py-[12px] px-[16px] text-left',
          'hover:bg-background-200 transition-colors duration-300',
        )}
      >
        {/* TODO: NoImage 컴포넌트 사용해서 예외 처리 하기 */}
        <ProfileImage
          imageUrl={otherParty.imgUrl ?? undefined}
          alt={otherParty.name}
          className={cn(
            'size-[40px] shrink-0 rounded-full tablet:size-[40px] desktop:size-[40px]',
          )}
        />
        <div className={cn('min-w-0 flex-1')}>
          <p className={cn('truncate text-md-medium text-black-400')}>
            {otherParty.name}
          </p>
          <p className={cn('truncate text-sm-medium text-gray-400')}>
            {preview}
          </p>
        </div>
        <div className={cn('flex shrink-0 flex-col items-end gap-[4px]')}>
          {lastMessage ? (
            <span className={cn('text-xs-medium text-gray-300')}>
              {formatDate(lastMessage.createdAt, 'relative')}
            </span>
          ) : null}
          {badge ? (
            <span
              className={cn(
                'flex h-[16px] min-w-[16px] items-center justify-center rounded-full',
                'bg-orange-400 px-[5px] text-xs-semibold leading-none text-gray-50',
              )}
            >
              {unreadCount > 999 ? '999+' : badge}
            </span>
          ) : null}
        </div>
      </button>
    </li>
  );
}

export default function ChatFloatingButton() {
  const t = useTranslations('Chat');
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useChatRealtimeSync(isLoggedIn);

  const { data, isLoading, isError } = useChatRoomsQuery(isLoggedIn);
  const rooms = data?.list ?? [];
  const totalUnreadCount = rooms.reduce(
    (sum, room) => sum + room.unreadCount,
    0,
  );
  const badgeLabel = formatBadgeCount(totalUnreadCount);

  const close = () => {
    setIsOpen(false);
    setActiveRoomId(null);
  };

  useOutsideClick(wrapperRef, close, {
    enabled: isOpen,
    closeOnEscape: true,
  });

  if (!isLoggedIn) return null;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        // 모바일에서 패널이 전체화면(z-modal)으로 뜨므로, 패널을 품은 이 래퍼도
        // 같은 스태킹 컨텍스트 상 z-modal이어야 헤더(z-header) 위로 뜬다
        'fixed right-[16px] bottom-[76px] z-modal',
        'tablet:right-[24px] tablet:bottom-[92px] tablet:z-dropdown',
        'desktop:right-[40px] desktop:bottom-[104px]',
      )}
    >
      {/*
      @ 패널 위치
      - 모바일: 패널이 fixed inset-0로 뷰포트 전체를 덮는다 (이 래퍼 크기와 무관)
      - 태블릿 이상: 이 래퍼(relative 없음)에 버튼과 패널을 같이 두고, 패널은 버튼 기준
        absolute(bottom-full)로 위쪽에 작게 뜬다
      */}
      <div className={cn('relative')}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={CHAT_PANEL_ID}
          aria-label={
            badgeLabel ? t('openWithCount', { count: badgeLabel }) : t('open')
          }
          onClick={() => (isOpen ? close() : setIsOpen(true))}
          className={cn(
            'relative flex size-[48px] cursor-pointer items-center justify-center rounded-full',
            'bg-orange-400 text-gray-50 shadow-[2px_2px_10px_0px_rgba(46,46,46,0.08)]',
            'desktop:size-[56px]',
          )}
        >
          <IcChat aria-hidden className={cn('size-[24px]')} />
          {badgeLabel ? (
            <span
              aria-hidden
              className={cn(
                'absolute top-[-6px] right-[-6px]',
                'flex h-[20px] min-w-[20px] items-center justify-center rounded-full',
                'bg-gray-50 px-[4px] text-xs-semibold leading-none text-orange-400 shadow-[1px_1px_4px_0px_rgba(46,46,46,0.16)]',
                'desktop:h-[22px] desktop:min-w-[22px]',
              )}
            >
              {badgeLabel}
            </span>
          ) : null}
        </button>

        <div
          id={CHAT_PANEL_ID}
          aria-hidden={!isOpen}
          inert={!isOpen}
          className={panelStyle({ open: isOpen })}
        >
          {activeRoomId ? (
            <ChatRoomView
              estimateId={activeRoomId}
              onBack={() => setActiveRoomId(null)}
              onClose={close}
              className={cn('h-full')}
            />
          ) : isLoading ? (
            // 목록 로딩 중: 헤더 없이 패널 전체 정중앙에 문구만 띄운다
            <div
              className={cn(
                'flex h-full items-center justify-center px-[16px] text-center text-md-medium text-gray-400',
              )}
            >
              {t('loading')}
            </div>
          ) : (
            <>
              <div
                className={cn(
                  'flex w-full shrink-0 items-center justify-between border-b border-line-200 px-[20px] py-[14px] bg-background-200',
                )}
              >
                <p className={cn('text-lg-bold text-black-300')}>
                  {t('title')}
                </p>
                <button
                  type="button"
                  aria-label={t('close')}
                  onClick={close}
                  className={cn(
                    'flex size-[24px] cursor-pointer items-center justify-center overflow-clip',
                  )}
                >
                  <IcAlarmClose aria-hidden className={cn('h-full w-full')} />
                </button>
              </div>
              <ul
                className={cn(
                  'min-h-0 flex-1 overflow-y-auto scrollbar-gray-300',
                )}
              >
                {isError ? (
                  <li
                    className={cn(
                      'px-[20px] py-[24px] text-md-medium text-gray-400',
                    )}
                  >
                    {t('error')}
                  </li>
                ) : null}
                {!isLoading && !isError && rooms.length === 0 ? (
                  <li
                    className={cn(
                      'px-[20px] py-[24px] text-md-medium text-gray-400',
                    )}
                  >
                    {t('empty')}
                  </li>
                ) : null}
                {rooms.map((room) => (
                  <ChatRoomItem
                    key={room.estimateId}
                    room={room}
                    onClick={() => setActiveRoomId(room.estimateId)}
                  />
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
