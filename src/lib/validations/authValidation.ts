// zod - 인증(회원가입/로그인) 유효성 검사 스키마
// 스키마는 여기만 둔다. 컴포넌트에서 z.object를 직접 만들지 않는다.
// 에러 메시지는 번역 키(validationKey)로 둔다. 화면에서 현재 언어 문구로 바뀐다 (useFormErrorMessage)
import { z } from 'zod';

import { validationKey } from '@/lib/validations/validationMessage';

export const loginSchema = z.object({
  email: z.email(validationKey('emailInvalid')),
  password: z.string().min(8, validationKey('passwordMin')),
});

/*
@ 비밀번호 규칙 (백엔드 authValidation.ts 와 동일하게 유지)
- 8~64자, 숫자 1개 이상, 특수문자 1개 이상
- 특수문자: 키보드 ASCII 특수문자 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ (공백·한글 제외)
- 로그인은 기존 가입자도 들어와야 하므로 이 규칙을 적용하지 않는다
*/
const passwordSchema = z
  .string()
  .min(8, validationKey('passwordMin'))
  .max(64, validationKey('passwordMax'))
  .regex(/[0-9]/, validationKey('passwordNumber'))
  .regex(/[!-/:-@[-`{-~]/, validationKey('passwordSpecial'));

const nameSchema = z
  .string()
  .trim()
  .min(2, validationKey('nameMin'))
  .max(20, validationKey('nameMax'));

/*
@ 전화번호
- 화면에서는 010-1234-5678 처럼 하이픈이 붙은 값을 받는다 (formatPhoneNumber)
- 숫자만 남겼을 때 10~11자리 휴대폰 번호인지 확인한다
*/
const phoneNumberSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ''))
  .refine(
    (digits) => /^01[016789]\d{7,8}$/.test(digits),
    validationKey('phoneInvalid'),
  );

export const signupSchema = z
  .object({
    email: z.email(validationKey('emailInvalid')),
    password: passwordSchema,
    passwordConfirm: z
      .string()
      .min(1, validationKey('passwordConfirmRequired')),
    name: nameSchema,
    phoneNumber: phoneNumberSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: validationKey('passwordMismatch'),
    path: ['passwordConfirm'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
