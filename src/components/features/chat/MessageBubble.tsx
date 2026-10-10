import type { ChatMessage } from '@/types/chat';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

interface MessageBubbleProps {
  message: ChatMessage;
  /** 내가 보낸 메시지인지 (senderId === 로그인 사용자 id) */
  isMine: boolean;
}

/*
@ 채팅 메시지 말풍선
- 내 메시지: 오른쪽 정렬·주황 배경, 왼쪽 바깥에 읽음/안읽음·시간 표시
- 상대 메시지: 왼쪽 정렬·회색 배경, 오른쪽 바깥에 시간만 표시
*/
export default function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const t = useTranslations('Chat');
  const time = formatDate(message.createdAt, 'relative');

  const meta = (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-[2px] pb-[2px] text-xs-medium whitespace-nowrap',
        isMine ? 'items-end text-right' : 'items-start',
      )}
    >
      {isMine ? (
        <span
          className={cn(message.isRead ? 'text-gray-300' : 'text-orange-400')}
        >
          {message.isRead ? t('messageRead') : t('messageUnread')}
        </span>
      ) : null}
      <span className={cn('text-gray-300')}>{time}</span>
    </div>
  );

  const bubble = message.imageUrl ? (
    <Image
      src={message.imageUrl}
      alt=""
      width={240}
      height={240}
      className={cn('h-auto w-full max-w-[240px] rounded-[12px] object-cover')}
    />
  ) : (
    <p
      className={cn(
        'max-w-[260px] rounded-[16px] px-[16px] py-[10px] text-md-medium whitespace-pre-wrap break-words',
        'tablet:max-w-[360px]',
        isMine
          ? 'rounded-br-[4px] bg-orange-400 text-gray-50'
          : 'rounded-bl-[4px] bg-background-200 text-black-400',
      )}
    >
      {message.content}
    </p>
  );

  return (
    <div
      className={cn(
        'flex items-end gap-[6px] px-[16px]',
        isMine ? 'justify-end' : 'justify-start',
        'tablet:px-[24px]',
      )}
    >
      {isMine ? meta : null}
      {bubble}
      {isMine ? null : meta}
    </div>
  );
}
