'use client';

import { useState } from 'react';
import {
  useForm,
  useWatch,
  type FieldPath,
  type SubmitHandler,
} from 'react-hook-form';

import type { AuthProviderName } from '@/types/auth';
import type { CustomerProfileEditFormValues } from '@/types/customerProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { HttpError } from '@/lib/api/errors';
import { customerProfileEditSchema } from '@/lib/validations/customerProfileValidation';

import {
  createCustomerProfileEditPlan,
  type CustomerProfileEditPlan,
} from '@/hooks/customer/customerProfileEditPlan';

type CustomerProfileEditSchemaInput = z.input<typeof customerProfileEditSchema>;
type CustomerProfileEditSchemaOutput = z.output<
  typeof customerProfileEditSchema
>;

interface UseCustomerProfileEditFormOptions {
  defaultValues?: Partial<CustomerProfileEditFormValues>;
  provider: AuthProviderName;
  onSubmit?: (plan: CustomerProfileEditPlan) => void | Promise<void>;
}

const EMPTY_CUSTOMER_PROFILE_EDIT_VALUES: CustomerProfileEditFormValues = {
  name: '',
  email: '',
  phoneNumber: '',
  currentPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
  profileImage: undefined,
  serviceTypes: [],
  region: null,
};

const CUSTOMER_PROFILE_EDIT_FIELD_NAMES = new Set<
  FieldPath<CustomerProfileEditSchemaInput>
>([
  'name',
  'email',
  'phoneNumber',
  'currentPassword',
  'newPassword',
  'newPasswordConfirm',
  'profileImage',
  'serviceTypes',
  'region',
]);

/*
@ 백엔드 validation 필드 연결
- API의 fields.field 문자열이 실제 수정 폼 필드인지 확인한 뒤 setError에 전달한다.
- 알 수 없는 서버 필드는 잘못된 입력에 연결하지 않고 폼 전체 오류로 안내한다.
*/
function toCustomerProfileEditFieldName(
  field: string,
): FieldPath<CustomerProfileEditSchemaInput> | null {
  const rootField = field.split(
    '.',
  )[0] as FieldPath<CustomerProfileEditSchemaInput>;

  return CUSTOMER_PROFILE_EDIT_FIELD_NAMES.has(rootField) ? rootField : null;
}

/*
@ 필드 목록이 없는 비밀번호 오류 연결
- 현재 비밀번호 불일치와 새 비밀번호 중복은 백엔드가 일반 400 message로 반환한다.
- 사용자가 수정해야 할 위치를 바로 알 수 있도록 해당 비밀번호 입력에 연결한다.
*/
function getPasswordErrorField(
  error: HttpError,
): 'currentPassword' | 'newPassword' | null {
  if (error.message.includes('현재 비밀번호가 올바르지')) {
    return 'currentPassword';
  }

  if (error.message.includes('현재 비밀번호와 달라야')) {
    return 'newPassword';
  }

  return null;
}

function getEditSubmitErrorMessage(error: HttpError): string {
  if (error.status === 401) {
    return '로그인 정보가 만료되었습니다. 다시 로그인한 뒤 시도해주세요.';
  }

  if (error.status === 403) {
    return '현재 계정에서는 요청한 정보를 수정할 수 없습니다.';
  }

  if (error.status === 404) {
    return '등록된 고객 프로필을 찾지 못했습니다.';
  }

  return error.message;
}

/*=================================================
고객 프로필 수정 폼 상태 훅
=================================================*/

/*
@ 이 훅이 담당하는 일
- GET /auth/me와 GET /customer/profile을 합친 초기값을 React Hook Form에 반영한다.
- Zod 검증과 서버 필드 오류를 실제 입력에 연결한다.
- 현재 값과 API 초기값을 의미 기준으로 비교해 변경된 내용이 있을 때만 버튼을 활성화한다.
- 소셜 로그인 계정은 비밀번호 입력을 변경값과 검증 대상으로 사용하지 않는다.
*/
export function useCustomerProfileEditForm({
  defaultValues,
  provider,
  onSubmit,
}: UseCustomerProfileEditFormOptions) {
  const [submitError, setSubmitError] = useState('');
  const form = useForm<
    CustomerProfileEditSchemaInput,
    unknown,
    CustomerProfileEditSchemaOutput
  >({
    resolver: zodResolver(customerProfileEditSchema),
    defaultValues: {
      ...EMPTY_CUSTOMER_PROFILE_EDIT_VALUES,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const watchedValues = useWatch({ control: form.control });
  const initialValues: CustomerProfileEditFormValues = {
    ...EMPTY_CUSTOMER_PROFILE_EDIT_VALUES,
    ...defaultValues,
  };
  const currentValues: CustomerProfileEditFormValues = {
    name: watchedValues.name ?? initialValues.name,
    email: watchedValues.email ?? initialValues.email,
    phoneNumber: watchedValues.phoneNumber ?? initialValues.phoneNumber,
    currentPassword:
      watchedValues.currentPassword ?? initialValues.currentPassword,
    newPassword: watchedValues.newPassword ?? initialValues.newPassword,
    newPasswordConfirm:
      watchedValues.newPasswordConfirm ?? initialValues.newPasswordConfirm,
    profileImage: watchedValues.profileImage as FileList | undefined,
    serviceTypes: watchedValues.serviceTypes ?? initialValues.serviceTypes,
    region:
      watchedValues.region === undefined
        ? initialValues.region
        : watchedValues.region,
  };
  const updatePlan = createCustomerProfileEditPlan(
    currentValues,
    initialValues,
    provider,
  );
  const hasRequiredValues = Boolean(
    currentValues.name.trim() &&
    currentValues.email.trim() &&
    currentValues.phoneNumber.trim() &&
    currentValues.serviceTypes.length &&
    currentValues.region,
  );

  /*
  @ 단일 변경 판단 사용
  - 버튼 활성화와 실제 API 호출이 동일한 updatePlan을 사용한다.
  - 지역과 서비스는 선택된 기존 값이 유효하면 되고, 다시 클릭하거나 변경할 필요가 없다.
  - 현재 비밀번호만 입력된 경우에는 비밀번호 변경 계획을 만들지 않는다.
  */
  const handleValidSubmit: SubmitHandler<
    CustomerProfileEditSchemaOutput
  > = async (values) => {
    setSubmitError('');

    try {
      const plan = createCustomerProfileEditPlan(
        values,
        initialValues,
        provider,
      );

      if (!plan.hasChanges) {
        throw new Error('변경된 정보가 없습니다.');
      }

      await onSubmit?.(plan);
    } catch (error) {
      if (error instanceof HttpError) {
        let hasMappedFieldError = false;

        error.fields?.forEach(({ field, message }) => {
          const fieldName = toCustomerProfileEditFieldName(field);
          if (!fieldName) return;

          hasMappedFieldError = true;
          form.setError(fieldName, { type: 'server', message });
        });

        const passwordErrorField = getPasswordErrorField(error);
        if (!hasMappedFieldError && passwordErrorField) {
          form.setError(passwordErrorField, {
            type: 'server',
            message: error.message,
          });
          return;
        }

        if (!hasMappedFieldError) {
          setSubmitError(getEditSubmitErrorMessage(error));
        }
        return;
      }

      setSubmitError(
        error instanceof Error
          ? error.message
          : '프로필 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  return {
    ...form,
    hasChanges: updatePlan.hasChanges,
    isFormComplete: hasRequiredValues && form.formState.isValid,
    submitError,
    handleFormSubmit: form.handleSubmit(handleValidSubmit),
  };
}
