import { z } from 'zod';

import { validationKey } from '@/lib/validations/validationMessage';

/*=================================================
프로필 이미지 공용 검증
=================================================*/

// Vercel 함수의 요청 본문 제한(4.5MB)에 multipart 필드·헤더가 들어갈 여유를 둔다.
export const MAX_PROFILE_IMAGE_SIZE = 4 * 1024 * 1024;

export const PROFILE_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

const profileImageMimeTypeSet = new Set<string>(PROFILE_IMAGE_MIME_TYPES);

/*
@ 선택 이미지 검증
- Customer와 Mover 프로필에서 동일한 파일 규칙과 오류 메시지를 사용한다.
- FileList는 브라우저 전용 객체이므로 서버에서 모듈을 읽을 때 ReferenceError가
  발생하지 않도록 typeof FileList 검사를 먼저 수행한다.
- 프로필 이미지는 선택 항목이며 JPEG, PNG, WEBP와 최대 4MB만 허용한다.
*/
export const optionalProfileImageSchema = z
  .custom<FileList | undefined>(
    (value) =>
      value === undefined ||
      (typeof FileList !== 'undefined' && value instanceof FileList),
    validationKey('profileImageInvalid'),
  )
  .refine((files) => {
    const file = files?.[0];
    return !file || profileImageMimeTypeSet.has(file.type);
  }, validationKey('profileImageType'))
  .refine((files) => {
    const file = files?.[0];
    return !file || file.size <= MAX_PROFILE_IMAGE_SIZE;
  }, validationKey('profileImageSize'));
