/*
@ 프로필 이미지 업로드 공용 컴포넌트
- 프로필 등록/수정 화면에서 이미지 파일을 선택하고 즉시 미리보는 용도로 사용한다.
- 업로드 API 호출과 파일 용량 같은 업무 검증은 페이지 또는 폼에서 담당하고,
  이 컴포넌트는 native file input의 동작과 미리보기만 담당한다.
- imageUrl이 있으면 서버에 저장된 이미지를 먼저 보여주고, 새 파일을 선택하면
  브라우저가 만든 임시 URL을 사용해 선택한 이미지로 미리보기를 교체한다.

@ 최소 사용 예시
<Label htmlFor="profileImage" variant="profile">
  프로필 이미지
</Label>
<ProfileUpload
  id="profileImage"
  imageUrl={profileImageUrl}
  {...register('profileImage')}
/>
*/

'use client';

import { useEffect, useId, useState } from 'react';

import { cva } from 'class-variance-authority';
import Image from 'next/image';

import IcGallery from '@/assets/icons/ic_gallery.svg';

import { cn } from '@/utils/cn';

/*
@ Figma 상태별 스타일
- default: background-200 배경과 Gallery 아이콘을 표시한다.
- filled: black-400 배경 위에 선택한 파일 또는 서버 이미지를 표시한다.
- 상태는 외부 문자열 prop이 아니라 실제 표시할 이미지의 존재 여부로 결정한다.
*/
const profileUploadVariants = cva(
  'relative flex size-full items-center justify-center overflow-hidden rounded-[6px]',
  {
    variants: {
      hasImage: {
        true: 'bg-black-400',
        false: 'bg-background-200',
      },
    },
    defaultVariants: {
      hasImage: false,
    },
  },
);

interface ProfileUploadProps extends Omit<
  React.ComponentPropsWithRef<'input'>,
  'className' | 'defaultValue' | 'multiple' | 'type' | 'value'
> {
  /** 서버 또는 S3에서 불러온 기존 프로필 이미지 URL */
  imageUrl?: string;
  /** 미리보기 이미지의 대체 텍스트. 장식 이미지라면 기본값인 빈 문자열을 사용한다. */
  previewAlt?: string;
  /** 업로드 영역의 크기나 배치를 확장할 때 사용하는 클래스 */
  className?: string;
}

export default function ProfileUpload({
  imageUrl,
  previewAlt = '',
  className,
  id,
  accept = 'image/*',
  disabled,
  onChange,
  ref,
  'aria-label': ariaLabel = '프로필 이미지 선택',
  ...inputProps
}: ProfileUploadProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string>();
  const previewUrl = localPreviewUrl ?? imageUrl;
  const hasImage = Boolean(previewUrl);

  /*
  @ Object URL 정리
  - 새 파일을 선택하면 이전 URL을 해제하고, 컴포넌트가 사라질 때도 마지막 URL을 해제한다.
  - 브라우저 메모리에 임시 파일 데이터가 계속 남는 것을 방지한다.
  */
  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.currentTarget.files?.[0];

    setLocalPreviewUrl(
      selectedFile ? URL.createObjectURL(selectedFile) : undefined,
    );

    // react-hook-form의 register가 전달한 onChange를 막지 않고 그대로 실행한다.
    onChange?.(event);
  };

  return (
    <div className={cn('relative size-[100px] tablet:size-[160px]', className)}>
      <input
        {...inputProps}
        ref={ref}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={handleChange}
        className="peer sr-only"
      />

      <label
        htmlFor={inputId}
        aria-disabled={disabled || undefined}
        className={cn(
          profileUploadVariants({ hasImage }),
          'peer-focus-visible:ring-2 peer-focus-visible:ring-orange-400 peer-focus-visible:ring-offset-2',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        )}
      >
        {previewUrl ? (
          <Image
            fill
            unoptimized
            src={previewUrl}
            alt={previewAlt}
            sizes="(min-width: 744px) 160px, 100px"
            className="pointer-events-none object-cover"
          />
        ) : (
          <IcGallery
            aria-hidden="true"
            focusable="false"
            className="size-[32px] shrink-0 tablet:size-[40px]"
          />
        )}
      </label>
    </div>
  );
}
