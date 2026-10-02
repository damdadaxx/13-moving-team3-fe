// zod 스키마용 다국어 에러 메시지 키
import type { Messages } from 'next-intl';

export type ValidationMessageKey = keyof Messages['Validation'];

export const VALIDATION_MESSAGE_PREFIX = 'Validation.';

/*
@ 스키마 에러 메시지를 번역 키로 만든다
- zod 스키마는 컴포넌트 밖(모듈)에서 만들어져 번역 훅을 쓸 수 없다
  → 문구 대신 'Validation.emailInvalid' 같은 키를 메시지로 넣는다
- 화면에서는 Input / Textarea / ProfileUpload 가 useFormErrorMessage 로 현재 언어 문구로 바꾼다
- 키는 messages > Validation 기준으로 타입 검사된다 (오타 시 컴파일 에러)
@ 사용 예시
z.email(validationKey('emailInvalid'))
*/
export function validationKey(key: ValidationMessageKey) {
  return `${VALIDATION_MESSAGE_PREFIX}${key}` as const;
}
