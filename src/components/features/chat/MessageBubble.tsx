'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { ChatMessage } from '@/types/chat';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcX from '@/assets/icons/ic_x.svg';

import { useImageIsSmall } from '@/hooks/common/useImageIsSmall';
import { useOutsideClick } from '@/hooks/common/useOutsideClick';
import { usePortalRoot } from '@/hooks/common/usePortalRoot';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

interface MessageBubbleProps {
  message: ChatMessage;
  /** 내가 보낸 메시지인지 (senderId === 로그인 사용자 id) */
  isMine: boolean;
}

/*
@ 긴 텍스트 말풍선
- 6줄을 넘을 때만 더보기/접기 버튼이 생긴다
- 펼친 뒤에도 접기로 다시 줄일 수 있다
- 넘침 여부는 너비가 바뀌면 다시 계산한다
- 공백 없는 숫자·글자는 break-all로 말풍선 너비 안에서 끊는다
*/
function MessageText({
  content,
  isMine,
}: {
  content: string;
  isMine: boolean;
}) {
  const t = useTranslations('Chat');
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canToggle, setCanToggle] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element || isExpanded) return;

    const check = () =>
      setCanToggle(element.scrollHeight > element.clientHeight + 1);

    check();
    const observer = new ResizeObserver(check);
    observer.observe(element);
    return () => observer.disconnect();
  }, [content, isExpanded]);

  return (
    <div
      className={cn(
        'flex min-w-0 max-w-[260px] flex-col rounded-[16px] px-[16px] py-[10px]',
        'tablet:max-w-[360px]',
        isMine
          ? 'rounded-br-[4px] bg-orange-400 text-gray-50'
          : 'rounded-bl-[4px] bg-background-200 text-black-400',
      )}
    >
      <p
        ref={textRef}
        className={cn(
          'text-md-medium break-all whitespace-pre-wrap',
          !isExpanded && 'line-clamp-6',
        )}
      >
        {content}
      </p>
      {canToggle ? (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
          className={cn(
            'mt-[4px] w-fit cursor-pointer text-sm-medium underline',
            isMine ? 'text-gray-50' : 'text-gray-400',
          )}
        >
          {isExpanded ? t('showLess') : t('showMore')}
        </button>
      ) : null}
    </div>
  );
}

const IMAGE_LIGHTBOX_ROOT_ID = 'modal-root';
// 원본 짧은 변이 이보다 작으면 "작은 이미지"로 보고 최소 크기 박스를 적용한다
const SMALL_IMAGE_THRESHOLD_PX = 300;

/*
@ 이미지 원본 크게 보기
- Modal과 같은 #modal-root로 포탈한다. 제목·패딩 있는 카드가 아니라 사진이 화면을 꽉 채우고,
  닫기 버튼은 사진 모서리 위에 겹쳐 띄운다
- 원본이 충분히 크면(SMALL_IMAGE_THRESHOLD_PX 이상) 이전처럼 원본 비율 그대로, 화면 안에서만
  줄어들게 보여준다. 원본이 작으면 최소 크기 박스(object-contain)로 확대해서 보여준다
  (안 그러면 사진이 손바닥만 하게 보이고 닫기 버튼이 그 위에서 어색하게 겹친다)
- 크기를 판단하기 전(로딩 중)에는 "큰 이미지"로 기본 렌더링한다 — 대부분의 사진이 이 경우라
  깜빡임이 거의 없다
*/
function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const t = useTranslations('Common');
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalRoot = usePortalRoot(IMAGE_LIGHTBOX_ROOT_ID);
  const isSmall = useImageIsSmall(src, SMALL_IMAGE_THRESHOLD_PX) ?? false;

  useOutsideClick(dialogRef, onClose, { enabled: true, closeOnEscape: true });

  if (!portalRoot) return null;

  return createPortal(
    <div
      role="presentation"
      className={cn(
        'fixed inset-0 z-modal flex items-center justify-center bg-black-500/80 p-[24px]',
      )}
    >
      <div
        ref={dialogRef}
        className={cn(
          'relative',
          isSmall
            ? // 고정 박스 + object-contain: 원본이 작아도 이 크기까진 채워 보여준다 (최소 크기 보장)
              'h-[min(70vh,480px)] w-[min(85vw,480px)]'
            : 'max-h-[85vh] max-w-[90vw]',
        )}
      >
        {isSmall ? (
          <Image
            src={src}
            alt=""
            fill
            unoptimized
            sizes="480px"
            className={cn('rounded-[12px] object-contain')}
          />
        ) : (
          <Image
            src={src}
            alt=""
            width={960}
            height={960}
            unoptimized
            className={cn(
              'h-auto max-h-[85vh] w-auto max-w-[90vw] rounded-[12px] object-contain',
            )}
          />
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className={cn(
            'absolute top-[12px] right-[12px] flex size-[32px] cursor-pointer items-center justify-center rounded-full bg-black-500/60 text-gray-50',
          )}
        >
          <IcX aria-hidden className={cn('size-[16px]')} />
        </button>
      </div>
    </div>,
    portalRoot,
  );
}

/*
@ 채팅 메시지 말풍선
- 내 메시지: 오른쪽 정렬·주황 배경, 왼쪽 바깥에 읽음/안읽음·시간 표시
- 상대 메시지: 왼쪽 정렬·회색 배경, 오른쪽 바깥에 시간만 표시
- 이미지 메시지는 클릭하면 원본을 전체화면으로 크게 본다
*/
export default function MessageBubble({ message, isMine }: MessageBubbleProps) {
  const t = useTranslations('Chat');
  const time = formatDate(message.createdAt, 'relative');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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
    <button
      type="button"
      onClick={() => setIsLightboxOpen(true)}
      className={cn('block max-w-[240px] cursor-pointer')}
    >
      <Image
        src={message.imageUrl}
        alt=""
        width={240}
        height={240}
        className={cn('h-auto w-full rounded-[12px] object-cover')}
      />
    </button>
  ) : (
    <MessageText content={message.content ?? ''} isMine={isMine} />
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
      {message.imageUrl && isLightboxOpen ? (
        <ImageLightbox
          src={message.imageUrl}
          onClose={() => setIsLightboxOpen(false)}
        />
      ) : null}
    </div>
  );
}
