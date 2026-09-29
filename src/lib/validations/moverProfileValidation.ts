import { REGIONS } from '@/types/region';
import { SERVICE_TYPES } from '@/types/serviceType';
import { z } from 'zod';

import { optionalProfileImageSchema } from '@/lib/validations/profileImageValidation';

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
  .min(1, '경력 연수를 입력해주세요.')
  .regex(/^\d+$/, '숫자만 입력해주세요.');

const careerRemainderMonthsSchema = z
  .string()
  .trim()
  .min(1, '경력 개월 수를 입력해주세요.')
  .regex(/^\d+$/, '숫자만 입력해주세요.')
  .refine(
    (value) => !/^\d+$/.test(value) || Number(value) <= 11,
    '개월은 0에서 11 사이로 입력해주세요.',
  );

const moverPhoneNumberSchema = z
  .string()
  .trim()
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다.');

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
    .min(2, '별명을 입력해주세요.')
    .max(10, '별명은 최대 10자까지 입력할 수 있습니다.'),
  careerYears: careerYearsSchema,
  careerRemainderMonths: careerRemainderMonthsSchema,
  shortIntro: z
    .string()
    .trim()
    .min(8, '한 줄 소개는 8자 이상 입력해주세요.')
    .max(50, '한 줄 소개는 최대 50자까지 입력할 수 있습니다.'),
  description: z
    .string()
    .trim()
    .min(10, '상세 설명은 10자 이상 입력해주세요.')
    .max(300, '상세 설명은 최대 300자까지 입력할 수 있습니다.'),
  serviceTypes: z
    .array(z.enum(SERVICE_TYPES))
    .min(1, '1개 이상 선택해주세요.')
    .refine(
      (serviceTypes) => new Set(serviceTypes).size === serviceTypes.length,
      '같은 서비스를 중복해서 선택할 수 없습니다.',
    ),
  serviceRegions: z
    .array(z.enum(REGIONS))
    .min(1, '1개 이상 선택해주세요.')
    .refine(
      (serviceRegions) =>
        new Set(serviceRegions).size === serviceRegions.length,
      '같은 지역을 중복해서 선택할 수 없습니다.',
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
        message: '프로필 이미지 교체와 삭제를 동시에 요청할 수 없습니다.',
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
          '전화번호를 입력해주세요.',
      });
    }
  });
}
