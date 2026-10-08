'use client';

import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';

import IcCornerDownLeft from '@/assets/icons/ic_corner_down_left.svg';
import IcPaperclip from '@/assets/icons/ic_paperclip.svg';

import { HttpError } from '@/lib/api/errors';
import { uploadChatImage } from '@/lib/supabase/chatImage';

import { useToast } from '@/hooks/common/useToast';
import {
  useChatImageUploadUrlMutation,
  useSendChatMessageMutation,
} from '@/hooks/features/chat/queries/mutations';

import { cn } from '@/utils/cn';

interface MessageInputProps {
  estimateId: string;
  /** 전송을 시작한 직후(서버 응답 전) 호출 - 스크롤을 바로 맨 아래로 내리는 용도 */
  onSend?: () => void;
}

/** 백엔드 HttpError는 사용자가 읽을 수 있는 한국어 메시지를 그대로 들고 있어 보여준다.
 * 그 외(Supabase Storage 에러 등)는 원인 파악용 영문 메시지라도 fallback보다 정보가 많으면 보여준다
 */
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/*
@ 채팅 입력창
- 텍스트: Enter(IME 조합 중 제외)·전송 버튼으로 보낸다
- 이미지: 파일 버튼으로 이미지 파일을 고르면 presigned URL 발급 → Storage 업로드 → 공개 URL로 즉시 전송한다
  (텍스트와 별도 메시지로 바로 나간다. 미리보기 없이 탭 한 번으로 보내는 흐름)
*/
export default function MessageInput({
  estimateId,
  onSend,
}: MessageInputProps) {
  const t = useTranslations('Chat');
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useSendChatMessageMutation(estimateId);
  const issueUploadUrl = useChatImageUploadUrlMutation(estimateId);

  const handleSendText = () => {
    const content = text.trim();
    if (!content || sendMessage.isPending) return;

    setText('');
    sendMessage.mutate(
      { content },
      {
        onError: (error) => showToast(getErrorMessage(error, t('sendFailed'))),
      },
    );
    onSend?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter' || isComposing) return;
    e.preventDefault();
    handleSendText();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    // accept="image/*"는 피커 UI 힌트일 뿐 강제가 아니라, 실제 타입을 한 번 더 검증한다
    if (!file.type.startsWith('image/')) {
      showToast(t('invalidImageType'));
      return;
    }

    try {
      const { path, token } = await issueUploadUrl.mutateAsync(file.name);
      await uploadChatImage(path, token, file);
      sendMessage.mutate(
        { imagePath: path },
        {
          onError: (error) =>
            showToast(getErrorMessage(error, t('sendFailed'))),
        },
      );
      onSend?.();
    } catch (error) {
      showToast(getErrorMessage(error, t('imageUploadFailed')));
    }
  };

  const isUploading = issueUploadUrl.isPending;

  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-[8px] border-t border-line-200 bg-background-200 px-[16px] py-[12px]',
        'tablet:px-[24px]',
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => void handleFileChange(e)}
      />
      <button
        type="button"
        aria-label={t('addImage')}
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-400',
          'hover:bg-background-200 disabled:cursor-default disabled:opacity-40',
        )}
      >
        <IcPaperclip aria-hidden className={cn('size-[20px]')} />
      </button>
      <input
        type="text"
        value={text}
        placeholder={t('inputPlaceholder')}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        className={cn(
          'min-w-0 flex-1 rounded-full border border-line-200 bg-gray-50 px-[16px] py-[10px]',
          'text-md-medium text-black-400 placeholder:text-gray-300 focus:outline-none',
        )}
      />
      <button
        type="button"
        aria-label={t('send')}
        disabled={!text.trim() || sendMessage.isPending}
        onClick={handleSendText}
        className={cn(
          'flex size-[36px] shrink-0 cursor-pointer items-center justify-center rounded-full',
          'bg-orange-400 text-gray-50 disabled:cursor-default disabled:opacity-40',
        )}
      >
        <IcCornerDownLeft aria-hidden className={cn('size-[20px]')} />
      </button>
    </div>
  );
}
