// 채팅방 뷰
'use client';

import { useEffect, useRef } from 'react';

import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import IcAlarmClose from '@/assets/icons/ic_alarm_close.svg';
import IcCalendar from '@/assets/icons/ic_calendar.svg';
import IcChevronLeft from '@/assets/icons/ic_chevron_left.svg';

import { getEstimateDetailPath } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/features/auth/useAuth';
import { useReadChatMessagesMutation } from '@/hooks/features/chat/queries/mutations';
import { useChatMessagesQuery } from '@/hooks/features/chat/queries/queries';
import { useEstimateDetailQuery } from '@/hooks/features/estimate/queries/queries';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';
import getShortAddress from '@/utils/getShortAddress';

import MessageBubble from '@/components/features/chat/MessageBubble';
import MessageInput from '@/components/features/chat/MessageInput';

/** 로컬 날짜 기준 그룹 키 (같은 날이면 같은 값) */
function getDateKey(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function DateDivider({ date }: { date: string }) {
  return (
    <div className={cn('flex justify-center px-[16px] py-[4px]')}>
      <span
        className={cn(
          'flex items-center gap-[4px] rounded-full bg-background-200 px-[12px] py-[6px] text-xs-medium text-gray-400',
        )}
      >
        <IcCalendar aria-hidden className={cn('size-[14px]')} />
        {formatDate(date, 'korean')}
      </span>
    </div>
  );
}

interface ChatRoomViewProps {
  estimateId: string;
  /** 뒤로가기 (목록으로 전환) */
  onBack: () => void;
  /** 팝오버 전체 닫기 */
  onClose: () => void;
  className?: string;
}

/*
@ 채팅방 본체 (헤더 + 메시지 목록 + 입력창/읽기전용 안내)
- 플로팅 버튼 팝오버 안에서만 쓴다. 바깥 높이(className)는 ChatFloatingButton이 정한다
*/
export default function ChatRoomView({
  estimateId,
  onBack,
  onClose,
  className,
}: ChatRoomViewProps) {
  const t = useTranslations('Chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, role } = useAuth();

  const estimateQuery = useEstimateDetailQuery(estimateId);
  const estimate = estimateQuery.data;
  // 채팅은 견적이 확정(ACCEPTED)된 건에만 있다. 이사(견적 요청)가 완료되면 기록만 조회한다
  const isAccessible = estimate?.status === 'ACCEPTED';
  const isReadOnly = estimate?.estimateRequest.status === 'COMPLETED';

  const messagesQuery = useChatMessagesQuery(estimateId, isAccessible);
  const messages = (messagesQuery.data?.pages ?? [])
    .flatMap((page) => page.list)
    .reverse();
  // 목록은 커서 페이지네이션(size 고정)이라, 10개 넘는 방에서는 새 메시지가 와도
  // 오래된 메시지 하나가 같이 빠져서 messages.length가 그대로일 수 있다.
  // 그래서 길이 대신 "가장 최근 메시지가 바뀌었는지"로 새 메시지 도착을 판단한다
  const lastMessageId = messages.at(-1)?.messageId;

  // 채팅방 읽음 처리
  const markRead = useReadChatMessagesMutation(estimateId);
  useEffect(() => {
    if (isAccessible && !isReadOnly) markRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estimateId, isAccessible, isReadOnly, lastMessageId]);

  // 채팅방 스크롤 처리
  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };
  useEffect(scrollToBottom, [lastMessageId]);

  const otherPartyName = estimate
    ? role === 'customer'
      ? estimate.mover.nickname
      : estimate.customer.name
    : '';

  const header = (title: string) => (
    <div
      className={cn(
        'flex w-full shrink-0 items-center justify-between border-b border-line-200 px-[20px] py-[14px] bg-background-200',
      )}
    >
      <div className={cn('flex min-w-0 items-center gap-[12px] ')}>
        <button
          type="button"
          aria-label={t('back')}
          onClick={onBack}
          className={cn(
            'flex size-[24px] shrink-0 cursor-pointer items-center justify-center',
          )}
        >
          <IcChevronLeft
            aria-hidden
            className={cn('size-[20px] text-black-400')}
          />
        </button>
        <p className={cn('truncate text-lg-bold text-black-400')}>{title}</p>
      </div>
      <button
        type="button"
        aria-label={t('close')}
        onClick={onClose}
        className={cn(
          'flex size-[24px] shrink-0 cursor-pointer items-center justify-center overflow-clip',
        )}
      >
        <IcAlarmClose aria-hidden className={cn('h-full w-full')} />
      </button>
    </div>
  );

  const handleDetailClick = () => {
    if (!role) return;
    onClose();
    router.push(getEstimateDetailPath(role, estimateId));
  };

  const summaryBar = estimate ? (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between gap-[12px] border-b border-line-200 px-[20px] py-[10px]',
      )}
    >
      <div className={cn('min-w-0')}>
        <p className={cn('truncate text-sm-medium text-black-400')}>
          {getShortAddress(estimate.estimateRequest.departureAddress)}
          {' → '}
          {getShortAddress(estimate.estimateRequest.arrivalAddress)}
        </p>
        <p className={cn('truncate text-xs-medium text-gray-400')}>
          {t('moveDate', {
            date: formatDate(estimate.estimateRequest.moveDate, 'usage'),
          })}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDetailClick}
        className={cn(
          'shrink-0 cursor-pointer rounded-full border border-orange-400 px-[12px] py-[6px] text-xs-medium text-orange-400',
          'hover:bg-orange-100',
        )}
      >
        {t('viewDetail')}
      </button>
    </div>
  ) : null;

  const notice = (message: string) => (
    <div
      className={cn(
        'flex flex-1 items-center justify-center px-[16px] text-center text-md-medium text-gray-400',
      )}
    >
      {message}
    </div>
  );

  // 로딩 중(견적 상세 또는 메시지 목록): 헤더 없이 패널 전체 정중앙에 문구만 띄운다
  if (estimateQuery.isPending || (isAccessible && messagesQuery.isPending)) {
    return (
      <div
        className={cn(
          'flex h-full items-center justify-center px-[16px] text-center text-md-medium text-gray-400',
          className,
        )}
      >
        {t('loading')}
      </div>
    );
  }

  // 견적 상세 조회 실패 또는 견적 없음
  if (estimateQuery.isError || !estimate) {
    return (
      <div className={cn('flex flex-col', className)}>
        {header(t('title'))}
        {notice(t('notFound'))}
      </div>
    );
  }

  if (!isAccessible) {
    return (
      <div className={cn('flex flex-col', className)}>
        {header(otherPartyName || t('title'))}
        {notice(t('accessDenied'))}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {header(otherPartyName)}
      {summaryBar}

      <div
        ref={scrollRef}
        className={cn(
          'flex min-h-0 flex-1 flex-col gap-[8px] overflow-y-auto py-[16px] scrollbar-gray-300',
        )}
      >
        <div className={cn('flex justify-center px-[16px] pb-[8px]')}>
          <span
            className={cn(
              'rounded-full bg-background-200 px-[12px] py-[6px] text-xs-medium text-gray-400',
            )}
          >
            {t('roomEntered', { name: otherPartyName })}
          </span>
        </div>

        {messagesQuery.isError ? (
          <p
            className={cn('px-[16px] text-center text-md-medium text-gray-400')}
          >
            {t('error')}
          </p>
        ) : null}

        {messages.map((message, index) => {
          const dateKey = getDateKey(message.createdAt);
          const isNewDay =
            index === 0 ||
            getDateKey(messages[index - 1].createdAt) !== dateKey;

          return (
            <div key={message.messageId}>
              {isNewDay ? <DateDivider date={message.createdAt} /> : null}
              <MessageBubble
                message={message}
                isMine={message.senderId === user?.id}
              />
            </div>
          );
        })}
      </div>

      {isReadOnly ? (
        <p
          className={cn(
            'shrink-0 border-t border-line-200 bg-gray-50 px-[16px] py-[14px] text-center text-sm-medium text-gray-400',
          )}
        >
          {t('readOnlyNotice')}
        </p>
      ) : (
        <MessageInput estimateId={estimateId} onSend={scrollToBottom} />
      )}
    </div>
  );
}
