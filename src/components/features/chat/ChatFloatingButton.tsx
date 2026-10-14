// GNB 채팅 플로팅 버튼 (안 읽은 메시지 배지 + 채팅방 목록 팝오버)
'use client';

import { useEffect, useRef, useState } from 'react';

import type { ChatRoomListItem } from '@/types/chat';
import { cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';

import IcAlarmClose from '@/assets/icons/ic_alarm_close.svg';
import IcChat from '@/assets/icons/ic_chat.svg';

import { useOutsideClick } from '@/hooks/common/useOutsideClick';
import { useShowTopButton } from '@/hooks/common/useShowTopButton';
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
    // 모바일: 뷰포트 전체. 노치·홈 인디케이터에 헤더/입력창이 가리지 않게 safe area를 남긴다
    'fixed inset-0 z-modal h-dvh w-full rounded-none',
    'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]',
    // 태블릿 이상: 버튼 위에 뜨는 작은 팝오버. 목록 ↔ 채팅창 전환 시 크기가 바뀌지 않게 동일 크기
    'tablet:absolute tablet:inset-auto tablet:right-0 tablet:bottom-[calc(100%+12px)] tablet:z-dropdown tablet:origin-bottom-right',
    'tablet:h-[480px] tablet:w-[360px] tablet:rounded-[24px] tablet:border tablet:border-line-200',
    'tablet:pt-0 tablet:pb-0',
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
  const showTopButton = useShowTopButton();
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

  // 모바일 전체화면일 때 뒤 페이지가 같이 스크롤되면 패널이 밀려 보인다
  useEffect(() => {
    if (!isOpen) return;
    const media = window.matchMedia('(max-width: 743px)');
    if (!media.matches) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  if (!isLoggedIn) return null;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        // 모바일에서 패널이 전체화면(z-modal)으로 뜨므로, 패널을 품은 이 래퍼도
        // 같은 스태킹 컨텍스트 상 z-modal이어야 헤더(z-header) 위로 뜬다
        // transform은 태블릿부터만 준다. 모바일에서 translate가 있으면 fixed 패널의
        // 기준이 뷰포트가 아니라 이 작은 래퍼가 되어 전체화면이 깨진다
        'fixed right-[16px] bottom-[calc(24px+var(--cookie-banner-lift,0px))] z-modal',
        'tablet:right-[24px] tablet:bottom-[calc(32px+var(--cookie-banner-lift,0px))] tablet:z-dropdown',
        'tablet:transition-transform tablet:duration-300 tablet:ease-out',
        'desktop:right-[40px] desktop:bottom-[calc(40px+var(--cookie-banner-lift,0px))]',
        showTopButton &&
          'tablet:-translate-y-[60px] desktop:-translate-y-[68px]',
      )}
    >
      {/*
      @ 패널 위치
      - 모바일: 패널이 fixed inset-0로 뷰포트 전체를 덮는다. 맨 위로 버튼이 보이면
        채팅 버튼만 위로 올린다 (래퍼에 transform을 주면 전체화면이 깨짐)
      - 태블릿 이상: 버튼과 패널을 같이 올리고, 패널은 버튼 기준 absolute로 위쪽에 작게 뜬다
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
            'transition-transform duration-300 ease-out',
            'desktop:size-[56px]',
            // 태블릿부터는 래퍼가 같이 올라가서, 버튼만 옮기면 패널과 어긋난다
            showTopButton && 'max-tablet:-translate-y-[60px]',
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
                      'px-[20px] py-[24px] text-md-medium text-gray-400 text-center',
                    )}
                  >
                    {t('error')}
                  </li>
                ) : null}
                {!isLoading && !isError && rooms.length === 0 ? (
                  <li
                    className={cn(
                      'px-[20px] py-[24px] text-md-medium text-gray-400 text-center',
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
