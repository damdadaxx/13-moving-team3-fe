'use client';

import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcCornerDownLeft from '@/assets/icons/ic_corner_down_left.svg';
import IcPaperclip from '@/assets/icons/ic_paperclip.svg';

import { uploadChatImage } from '@/lib/api/chatImageUpload';
import { HttpError } from '@/lib/api/errors';

import { useToast } from '@/hooks/common/useToast';
import {
  useChatImageUploadUrlMutation,
  useSendChatMessageMutation,
} from '@/hooks/features/chat/queries/mutations';
import { useEmitTyping } from '@/hooks/features/chat/useChatTyping';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import Modal from '@/components/ui/Modal';

interface MessageInputProps {
  estimateId: string;
  /** 전송을 시작한 직후(서버 응답 전) 호출 - 스크롤을 바로 맨 아래로 내리는 용도 */
  onSend?: () => void;
}

/** 백엔드 HttpError는 사용자가 읽을 수 있는 한국어 메시지를 그대로 들고 있어 보여준다.
 * 그 외(S3 업로드 에러 등)는 원인 파악용 영문 메시지라도 fallback보다 정보가 많으면 보여준다
 */
function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

/*
@ 채팅 입력창
- 텍스트: Enter(IME 조합 중 제외)·전송 버튼으로 보낸다
- 이미지: 파일 버튼으로 이미지 파일을 고르면 미리보기 모달이 뜬다. 전송을 눌러야 presigned
  POST URL 발급 → S3 업로드 → path를 메시지로 보낸다 (텍스트와 별도 메시지로 나간다)
*/
export default function MessageInput({
  estimateId,
  onSend,
}: MessageInputProps) {
  const t = useTranslations('Chat');
  const tCommon = useTranslations('Common');
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [pendingImage, setPendingImage] = useState<{
    file: File;
    previewUrl: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useSendChatMessageMutation(estimateId);
  const issueUploadUrl = useChatImageUploadUrlMutation(estimateId);
  const emitTyping = useEmitTyping(estimateId);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    // accept="image/*"는 피커 UI 힌트일 뿐 강제가 아니라, 실제 타입을 한 번 더 검증한다
    if (!file.type.startsWith('image/')) {
      showToast(t('invalidImageType'));
      return;
    }

    setPendingImage({ file, previewUrl: URL.createObjectURL(file) });
  };

  const closePendingImage = () => {
    if (pendingImage) URL.revokeObjectURL(pendingImage.previewUrl);
    setPendingImage(null);
  };

  const handleSendImage = async () => {
    if (!pendingImage) return;
    const { file } = pendingImage;
    // 업로드는 백그라운드로 두고 모달은 바로 닫는다 (텍스트 전송과 같은 낙관적 흐름)
    closePendingImage();

    try {
      const upload = await issueUploadUrl.mutateAsync(file.name);
      await uploadChatImage(file, upload);
      sendMessage.mutate(
        { imagePath: upload.path },
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
        onChange={handleFileChange}
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
        onChange={(e) => {
          setText(e.target.value);
          emitTyping();
        }}
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

      <Modal
        isOpen={pendingImage !== null}
        onClose={closePendingImage}
        title={t('sendImage')}
        buttons={
          <>
            <Button variant="outlined" color="gray" onClick={closePendingImage}>
              {tCommon('cancel')}
            </Button>
            <Button onClick={() => void handleSendImage()}>{t('send')}</Button>
          </>
        }
      >
        {pendingImage ? (
          // 고정 박스 + object-contain: 원본이 작아도 이 크기까진 채워 보여준다 (최소 크기 보장)
          <div className={cn('relative h-[240px] w-full')}>
            <Image
              src={pendingImage.previewUrl}
              alt=""
              fill
              unoptimized
              className={cn('rounded-[12px] object-contain')}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
