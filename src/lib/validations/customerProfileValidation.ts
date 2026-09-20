import { CUSTOMER_PROFILE_REGIONS } from '@/types/customerProfile';
import { SERVICE_TYPES } from '@/types/serviceType';
import { z } from 'zod';

/*=================================================
고객 프로필 등록·수정 폼 검증
=================================================*/

export const MAX_CUSTOMER_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

export const CUSTOMER_PROFILE_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

const customerProfileImageMimeTypeSet = new Set<string>(
  CUSTOMER_PROFILE_IMAGE_MIME_TYPES,
);

/*
@ FileList 검증 시 주의사항
- FileList는 브라우저 전용 객체라 서버 렌더링 환경에는 존재하지 않을 수 있다.
- typeof FileList 검사를 먼저 하면 서버에서 모듈을 읽어도 ReferenceError가 발생하지 않는다.
- 파일이 없는 상태는 정상이다. 백엔드 계약상 프로필 이미지는 선택 항목이다.
*/
const optionalProfileImageSchema = z
  .custom<FileList | undefined>(
    (value) =>
      value === undefined ||
      (typeof FileList !== 'undefined' && value instanceof FileList),
    '프로필 이미지 값이 올바르지 않습니다.',
  )
  .refine((files) => {
    const file = files?.[0];
    return !file || customerProfileImageMimeTypeSet.has(file.type);
  }, 'JPEG, PNG, WEBP 이미지만 업로드할 수 있습니다.')
  .refine((files) => {
    const file = files?.[0];
    return !file || file.size <= MAX_CUSTOMER_PROFILE_IMAGE_SIZE;
  }, '프로필 이미지는 5MB 이하만 업로드할 수 있습니다.');

const customerProfileFields = {
  profileImage: optionalProfileImageSchema,
  serviceTypes: z
    .array(z.enum(SERVICE_TYPES))
    .min(1, '이용 서비스를 한 개 이상 선택해주세요.'),
  region: z
    .enum(CUSTOMER_PROFILE_REGIONS)
    .nullable()
    .refine((region) => region !== null, '지역을 선택해주세요.'),
};

export const customerProfileSchema = z.object(customerProfileFields);

/*=================================================
고객 프로필 수정 화면 검증
=================================================*/

/*
@ 계정 기본정보 검증
- 이름과 전화번호는 백엔드 PATCH /auth/me 계약과 같은 범위를 사용한다.
- 이메일은 수정할 수 없는 읽기 전용 값이지만, 잘못된 초기값을 화면에
  그대로 노출하지 않도록 이메일 형식을 확인한다.
- 전화번호는 Figma처럼 하이픈이 있는 값과 회원가입처럼 숫자만 있는 값을
  모두 허용한다.
*/
const customerNameSchema = z
  .string()
  .trim()
  .min(2, '이름은 2자 이상이어야 합니다.')
  .max(20, '이름은 20자 이하여야 합니다.');

const customerPhoneNumberSchema = z
  .string()
  .trim()
  .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 전화번호 형식이 아닙니다.');

/*
@ 비밀번호 선택 검증
- 비밀번호를 변경하지 않는 경우 세 입력값을 모두 비워둘 수 있다.
- 새 비밀번호 또는 확인값을 입력하면 현재 비밀번호, 새 비밀번호, 확인값이 모두 필요하다.
- 현재 비밀번호는 변경할 정보가 아니라 본인 확인값이므로 단독 입력만으로 변경 모드를 시작하지 않는다.
- 새 비밀번호 확인은 프론트엔드에서만 사용하며 서버에는 전송하지 않는다.
*/
export const customerProfileEditSchema = z
  .object({
    ...customerProfileFields,
    name: customerNameSchema,
    email: z.email('이메일 형식이 아닙니다.'),
    phoneNumber: customerPhoneNumberSchema,
    currentPassword: z.string(),
    newPassword: z.string(),
    newPasswordConfirm: z.string(),
  })
  .superRefine((values, context) => {
    const hasPasswordInput = Boolean(
      values.newPassword || values.newPasswordConfirm,
    );

    if (!hasPasswordInput) return;

    if (!values.currentPassword) {
      context.addIssue({
        code: 'custom',
        path: ['currentPassword'],
        message: '현재 비밀번호를 입력해주세요.',
      });
    }

    if (values.newPassword.length < 8) {
      context.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: '새 비밀번호는 8자 이상이어야 합니다.',
      });
    } else if (values.newPassword.length > 64) {
      context.addIssue({
        code: 'custom',
        path: ['newPassword'],
        message: '새 비밀번호는 64자 이하여야 합니다.',
      });
    }

    if (!values.newPasswordConfirm) {
      context.addIssue({
        code: 'custom',
        path: ['newPasswordConfirm'],
        message: '새 비밀번호 확인을 입력해주세요.',
      });
    } else if (values.newPassword !== values.newPasswordConfirm) {
      context.addIssue({
        code: 'custom',
        path: ['newPasswordConfirm'],
        message: '새 비밀번호가 일치하지 않습니다.',
      });
    }
  });
