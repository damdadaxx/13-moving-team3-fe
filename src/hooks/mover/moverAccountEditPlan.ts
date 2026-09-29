import type {
  AuthProviderName,
  UpdateMeInput,
  UpdatePasswordInput,
} from '@/types/auth';
import type { MoverAccountFormValues } from '@/types/moverAccount';

/*=================================================
기사님 기본정보 수정 계획
=================================================*/

export interface MoverAccountEditPlan {
  account: UpdateMeInput | null;
  password: UpdatePasswordInput | null;
  hasChanges: boolean;
}

function normalizePhoneNumber(value: string): string {
  return value.replaceAll('-', '').trim();
}

/*
@ account/password 계획 분리
- 현재 비밀번호는 본인 확인값이므로 단독 입력만으로 변경 계획을 만들지 않는다.
- LOCAL 계정에서 새 비밀번호 또는 확인값을 입력한 경우에만 password 계획을 만든다.
*/
export function createMoverAccountEditPlan(
  values: MoverAccountFormValues,
  initialValues: MoverAccountFormValues,
  provider: AuthProviderName,
): MoverAccountEditPlan {
  const account: UpdateMeInput = {};
  const name = values.name.trim();
  const phoneNumber = normalizePhoneNumber(values.phoneNumber);

  if (name !== initialValues.name.trim()) {
    account.name = name;
  }

  if (phoneNumber !== normalizePhoneNumber(initialValues.phoneNumber)) {
    account.phoneNumber = phoneNumber;
  }

  const hasAccountChanges = Object.keys(account).length > 0;
  const hasPasswordIntent =
    provider === 'LOCAL' &&
    Boolean(values.newPassword || values.newPasswordConfirm);
  const password: UpdatePasswordInput | null = hasPasswordIntent
    ? {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }
    : null;

  return {
    account: hasAccountChanges ? account : null,
    password,
    hasChanges: hasAccountChanges || password !== null,
  };
}
