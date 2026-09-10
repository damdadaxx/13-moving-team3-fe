// zod - 인증(회원가입/로그인) 유효성 검사 스키마
// 스키마는 여기만 둔다. 컴포넌트에서 z.object를 직접 만들지 않는다.
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.'),
});

const nameSchema = z
  .string()
  .trim()
  .min(2, '이름은 2자 이상이어야 합니다.')
  .max(20, '이름은 20자 이하여야 합니다.');

const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다.');

export const signupSchema = z
  .object({
    email: z.email('이메일 형식이 올바르지 않습니다.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .regex(/[0-9]/, '비밀번호에 숫자를 포함해주세요.'),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
    name: nameSchema,
    phoneNumber: phoneNumberSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
