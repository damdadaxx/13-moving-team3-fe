import { useTranslations } from 'next-intl';

import {
  VALIDATION_MESSAGE_PREFIX,
  type ValidationMessageKey,
} from '@/lib/validations/validationMessage';

/*
@ 폼 에러 메시지를 현재 언어 문구로 바꾼다
- 'Validation.xxx' 번역 키면 messages > Validation 에서 찾아 번역한다
- 그 외(서버 에러 메시지, 아직 한국어로 작성된 스키마 메시지)는 그대로 돌려준다
  → 번역 전인 폼도 지금처럼 보이므로 화면 단위로 나눠서 옮길 수 있다
- 공용 Input / Textarea / ProfileUpload 의 error 표시에서 사용한다
*/
export function useFormErrorMessage() {
  const t = useTranslations('Validation');

  return (message?: string) => {
    if (!message?.startsWith(VALIDATION_MESSAGE_PREFIX)) return message;

    const key = message.slice(
      VALIDATION_MESSAGE_PREFIX.length,
    ) as ValidationMessageKey;
    return t.has(key) ? t(key) : message;
  };
}
