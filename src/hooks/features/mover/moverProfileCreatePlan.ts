import type { AuthProviderName, UpdateMeInput } from '@/types/auth';
import type {
  CreateMoverProfileInput,
  MoverProfileFormValues,
} from '@/types/moverProfile';

import { toCareerMonths } from '@/hooks/features/mover/moverProfileEditPlan';

/*=================================================
기사님 프로필 최초 등록 계획
=================================================*/

export interface MoverProfileCreatePlan {
  account: UpdateMeInput | null;
  profile: CreateMoverProfileInput;
}

function normalizePhoneNumber(value: string): string {
  return value.replaceAll('-', '').trim();
}

/*
@ 소셜 계정 전화번호와 프로필 요청 분리
- 전화번호는 Mover Profile 필드가 아니므로 PATCH /auth/me 요청으로 분리한다.
- 제공자가 전달한 전화번호와 사용자가 입력한 번호가 같으면 Auth 요청을 생략한다.
- 페이지는 account를 먼저 저장한 뒤 profile을 등록한다.
*/
export function createMoverProfileCreatePlan(
  values: MoverProfileFormValues,
  initialPhoneNumber: string | null,
  provider: AuthProviderName,
): MoverProfileCreatePlan {
  const normalizedPhoneNumber = normalizePhoneNumber(values.phoneNumber);
  const normalizedInitialPhoneNumber = normalizePhoneNumber(
    initialPhoneNumber ?? '',
  );
  const shouldUpdatePhoneNumber =
    provider !== 'LOCAL' &&
    normalizedPhoneNumber !== normalizedInitialPhoneNumber;

  return {
    account: shouldUpdatePhoneNumber
      ? { phoneNumber: normalizedPhoneNumber }
      : null,
    profile: {
      profileImage: values.profileImage?.[0],
      nickname: values.nickname.trim(),
      careerMonths: toCareerMonths(values),
      shortIntro: values.shortIntro.trim(),
      description: values.description.trim(),
      serviceTypes: values.serviceTypes,
      serviceRegions: values.serviceRegions,
    },
  };
}
