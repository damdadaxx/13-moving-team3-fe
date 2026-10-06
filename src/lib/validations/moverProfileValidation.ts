import { REGIONS } from '@/types/region';
import { SERVICE_TYPES } from '@/types/serviceType';
import { z } from 'zod';

import { optionalProfileImageSchema } from '@/lib/validations/profileImageValidation';
import { validationKey } from '@/lib/validations/validationMessage';

/*=================================================
기사님 프로필 등록·수정 폼 검증
=================================================*/

/*
@ 경력 입력 검증
- type="number" 대신 text + inputMode="numeric"을 사용하므로 문자열을 검증한다.
- 빈 문자열은 필수 오류, 문자·소수·음수는 숫자 형식 오류로 안내한다.
- 개월 입력은 한 해 안의 나머지 개월이므로 0~11만 허용한다.
*/
const careerYearsSchema = z
  .string()
  .trim()
  .min(1, validationKey('careerYearsRequired'))
  .regex(/^\d+$/, validationKey('numberOnly'));

const careerRemainderMonthsSchema = z
  .string()
  .trim()
  .min(1, validationKey('careerMonthsRequired'))
  .regex(/^\d+$/, validationKey('numberOnly'))
  .refine(
    (value) => !/^\d+$/.test(value) || Number(value) <= 11,
    validationKey('careerMonthsRange'),
  );

const moverPhoneNumberSchema = z
  .string()
  .trim()
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, validationKey('phoneInvalid'));

/*
@ 폼 스키마
- 글자 수와 배열 조건은 백엔드 POST /mover/profile 계약과 동일하게 맞춘다.
- 최초 화면에서는 오류를 표시하지 않고, 입력 또는 제출로 검증이 시작된 뒤
  각 공용 Form 컴포넌트의 error API에 메시지를 연결한다.
*/
const moverProfileFields = {
  profileImage: optionalProfileImageSchema,
  phoneNumber: z.string(),
  nickname: z
    .string()
    .trim()
    .min(2, validationKey('nicknameRequired'))
    .max(10, validationKey('nicknameMax')),
  careerYears: careerYearsSchema,
  careerRemainderMonths: careerRemainderMonthsSchema,
  shortIntro: z
    .string()
    .trim()
    .min(8, validationKey('shortIntroMin'))
    .max(50, validationKey('shortIntroMax')),
  description: z
    .string()
    .trim()
    .min(10, validationKey('descriptionMin'))
    .max(300, validationKey('descriptionMax')),
  serviceTypes: z
    .array(z.enum(SERVICE_TYPES))
    .min(1, validationKey('selectAtLeastOne'))
    .refine(
      (serviceTypes) => new Set(serviceTypes).size === serviceTypes.length,
      validationKey('serviceTypeDuplicate'),
    ),
  serviceRegions: z
    .array(z.enum(REGIONS))
    .min(1, validationKey('selectAtLeastOne'))
    .refine(
      (serviceRegions) =>
        new Set(serviceRegions).size === serviceRegions.length,
      validationKey('regionDuplicate'),
    ),
  removeImage: z.boolean(),
};

const moverProfileBaseSchema = z
  .object(moverProfileFields)
  .superRefine((values, context) => {
    if (values.profileImage?.[0] && values.removeImage) {
      context.addIssue({
        code: 'custom',
        path: ['profileImage'],
        message: validationKey('profileImageConflict'),
      });
    }
  });

export const moverProfileSchema = moverProfileBaseSchema;

/*
@ 최초 등록용 소셜 전화번호 검증
- LOCAL 계정은 회원가입에서 이미 전화번호를 받으므로 프로필 필드만 검증한다.
- 소셜 계정은 프로필 최초 등록 시 전화번호를 반드시 입력한다.
*/
export function createMoverProfileSchema(isPhoneNumberRequired: boolean) {
  return moverProfileBaseSchema.superRefine((values, context) => {
    if (!isPhoneNumberRequired) return;

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
  });
}
