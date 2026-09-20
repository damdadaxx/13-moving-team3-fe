import type {
  AuthProviderName,
  UpdateMeInput,
  UpdatePasswordInput,
} from '@/types/auth';
import type {
  CustomerProfileEditFormValues,
  CustomerProfileFormValues,
} from '@/types/customerProfile';
import type { ServiceType } from '@/types/serviceType';

/*=================================================
고객 프로필 수정 계획
=================================================*/

/*
@ 역할
- 수정 버튼과 실제 API 호출이 같은 변경 판단 결과를 사용하도록 한 곳에서 계산한다.
- 화면에서는 변경됐다고 판단했지만 API 요청은 0개가 되는 불일치를 방지한다.
- 각 API가 담당하는 데이터만 분리해 이름·전화번호·비밀번호·프로필을 독립적으로 수정한다.
*/
export interface CustomerProfileEditPlan {
  account: UpdateMeInput | null;
  password: UpdatePasswordInput | null;
  profile: CustomerProfileFormValues | null;
  hasChanges: boolean;
}

function normalizePhoneNumber(value: string): string {
  return value.replaceAll('-', '').trim();
}

function areServiceTypesEqual(
  left: ServiceType[],
  right: ServiceType[],
): boolean {
  return [...left].sort().join(',') === [...right].sort().join(',');
}

/*
@ 수정 요청 계획 생성
- 이름은 앞뒤 공백, 전화번호는 하이픈을 제거한 값으로 비교한다.
- 현재 비밀번호는 새 비밀번호 변경을 확인하기 위한 값이므로 단독 변경으로 보지 않는다.
- 새 비밀번호 또는 확인값을 작성한 경우에만 비밀번호 변경 계획을 만든다.
- 지역과 서비스는 유효한 기존 선택값이면 충분하며, 실제 값이 달라졌을 때만 프로필 PATCH를 만든다.
- 이미지 파일을 새로 선택하면 지역·서비스가 그대로여도 프로필 PATCH를 만든다.
*/
export function createCustomerProfileEditPlan(
  values: CustomerProfileEditFormValues,
  initialValues: CustomerProfileEditFormValues,
  provider: AuthProviderName,
): CustomerProfileEditPlan {
  const account: UpdateMeInput = {};
  const normalizedName = values.name.trim();
  const normalizedPhoneNumber = normalizePhoneNumber(values.phoneNumber);

  if (normalizedName !== initialValues.name.trim()) {
    account.name = normalizedName;
  }

  if (
    normalizedPhoneNumber !== normalizePhoneNumber(initialValues.phoneNumber)
  ) {
    account.phoneNumber = normalizedPhoneNumber;
  }

  const hasAccountChanges = Object.keys(account).length > 0;
  const hasPasswordIntent =
    provider === 'LOCAL' &&
    Boolean(values.newPassword || values.newPasswordConfirm);
  const hasProfileChanges =
    Boolean(values.profileImage?.[0]) ||
    values.region !== initialValues.region ||
    !areServiceTypesEqual(values.serviceTypes, initialValues.serviceTypes);

  const password: UpdatePasswordInput | null = hasPasswordIntent
    ? {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }
    : null;
  const profile: CustomerProfileFormValues | null = hasProfileChanges
    ? {
        profileImage: values.profileImage,
        serviceTypes: values.serviceTypes,
        region: values.region,
      }
    : null;

  return {
    account: hasAccountChanges ? account : null,
    password,
    profile,
    hasChanges: hasAccountChanges || password !== null || profile !== null,
  };
}
