import type { AuthProviderName, UpdateMeInput } from '@/types/auth';
import type {
  CustomerProfileCreateFormValues,
  CustomerProfileFormValues,
} from '@/types/customerProfile';

/*
@ 고객 프로필 최초 등록 요청 분리
- 전화번호는 /customer/profile의 필드가 아니라 /auth/me의 필드다.
- 소셜 계정에 이미 같은 번호가 있으면 불필요한 PATCH를 보내지 않는다.
- 전화번호가 바뀌었다면 계정 저장을 먼저 끝내고 프로필을 등록한다.
*/
export interface CustomerProfileCreatePlan {
  account: UpdateMeInput | null;
  profile: CustomerProfileFormValues;
}

export function createCustomerProfileCreatePlan(
  values: CustomerProfileCreateFormValues,
  initialPhoneNumber: string | null,
  provider: AuthProviderName,
): CustomerProfileCreatePlan {
  const phoneNumber = values.phoneNumber.replaceAll('-', '').trim();
  const previousPhoneNumber = (initialPhoneNumber ?? '')
    .replaceAll('-', '')
    .trim();

  return {
    account:
      provider !== 'LOCAL' && phoneNumber !== previousPhoneNumber
        ? { phoneNumber }
        : null,
    profile: {
      profileImage: values.profileImage,
      serviceTypes: values.serviceTypes,
      region: values.region,
    },
  };
}
