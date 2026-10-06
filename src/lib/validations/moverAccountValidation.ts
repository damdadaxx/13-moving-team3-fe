import type { AuthProviderName } from '@/types/auth';
import { z } from 'zod';

import { signupSchema } from '@/lib/validations/authValidation';
import { validationKey } from '@/lib/validations/validationMessage';

/*=================================================
기사님 기본정보 수정 폼 검증
=================================================*/

/*
@ 기본정보 검증
- 이름과 전화번호 조건은 백엔드 PATCH /auth/me 계약을 기준으로 한다.
- Figma의 기존 전화번호는 하이픈을 포함하므로 하이픈 포함/미포함 형식을 모두 허용한다.
- 이메일은 읽기 전용이지만 잘못된 초기 데이터가 화면에 들어오는 것을 막기 위해 형식을 검증한다.
*/
const moverNameSchema = z
  .string()
  .trim()
  .min(2, validationKey('nameMin'))
  .max(20, validationKey('nameMax'));

const moverPhoneNumberSchema = z
  .string()
  .trim()
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, validationKey('phoneInvalid'));

/*
@ 공용 비밀번호 규칙 재사용
- Mover 전용 비밀번호 정규식을 별도로 작성하지 않는다.
- 현재 회원가입 signupSchema의 password 규칙과 64자 상한을 사용해 Customer와 기준을 맞춘다.
- TODO(QA): 백엔드는 이미 ASCII 특수문자 1개 이상을 요구한다. 프론트 공용
  authValidation.ts에 같은 규칙을 추가하면 Customer와 Mover가 함께 반영된다.
*/
const moverNewPasswordSchema = signupSchema.shape.password.max(
  64,
  validationKey('newPasswordMax'),
);

interface CreateMoverAccountSchemaOptions {
  provider: AuthProviderName;
  isPhoneNumberRequired: boolean;
}

/*
@ 선택적 비밀번호 변경 검증
- 현재 비밀번호만 입력한 경우에는 비밀번호 변경 모드로 판단하지 않는다.
- LOCAL 계정에서 새 비밀번호 또는 확인값을 입력한 경우에만 세 값을 검증한다.
- 소셜 계정의 기존 전화번호가 null이면 빈 전화번호가 이름 수정을 막지 않는다.
*/
export function createMoverAccountSchema({
  provider,
  isPhoneNumberRequired,
}: CreateMoverAccountSchemaOptions) {
  return z
    .object({
      name: moverNameSchema,
      email: z.email(validationKey('emailInvalid')),
      phoneNumber: z.string(),
      currentPassword: z.string(),
      newPassword: z.string(),
      newPasswordConfirm: z.string(),
    })
    .superRefine((values, context) => {
      if (values.phoneNumber || isPhoneNumberRequired) {
        const phoneNumberResult = moverPhoneNumberSchema.safeParse(
          values.phoneNumber,
        );

        if (!phoneNumberResult.success) {
          context.addIssue({
            code: 'custom',
            path: ['phoneNumber'],
            message:
              phoneNumberResult.error.issues[0]?.message ??
              validationKey('phoneRequired'),
          });
        }
      }

      const hasPasswordIntent =
        provider === 'LOCAL' &&
        Boolean(values.newPassword || values.newPasswordConfirm);

      if (!hasPasswordIntent) return;

      if (!values.currentPassword) {
        context.addIssue({
          code: 'custom',
          path: ['currentPassword'],
          message: validationKey('currentPasswordRequired'),
        });
      }

      const newPasswordResult = moverNewPasswordSchema.safeParse(
        values.newPassword,
      );

      if (!newPasswordResult.success) {
        context.addIssue({
          code: 'custom',
          path: ['newPassword'],
          message:
            newPasswordResult.error.issues[0]?.message ??
            validationKey('newPasswordInvalid'),
        });
      }

      if (!values.newPasswordConfirm) {
        context.addIssue({
          code: 'custom',
          path: ['newPasswordConfirm'],
          message: validationKey('newPasswordConfirmRequired'),
        });
      } else if (values.newPassword !== values.newPasswordConfirm) {
        context.addIssue({
          code: 'custom',
          path: ['newPasswordConfirm'],
          message: validationKey('newPasswordMismatch'),
        });
      }
    });
}

export type MoverAccountSchema = ReturnType<typeof createMoverAccountSchema>;
