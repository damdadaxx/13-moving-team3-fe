'use client';

import { useState } from 'react';
import {
  useForm,
  useWatch,
  type FieldPath,
  type SubmitHandler,
} from 'react-hook-form';

import type { AuthProviderName } from '@/types/auth';
import type { MoverAccountFormValues } from '@/types/moverAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { HttpError } from '@/lib/api/errors';
import {
  createMoverAccountSchema,
  type MoverAccountSchema,
} from '@/lib/validations/moverAccountValidation';

import {
  createMoverAccountEditPlan,
  type MoverAccountEditPlan,
} from '@/hooks/features/moverProfile/moverAccountEditPlan';

type MoverAccountSchemaInput = z.input<MoverAccountSchema>;
type MoverAccountSchemaOutput = z.output<MoverAccountSchema>;

interface UseMoverAccountFormOptions {
  defaultValues?: Partial<MoverAccountFormValues>;
  provider: AuthProviderName;
  onSubmit?: (plan: MoverAccountEditPlan) => void | Promise<void>;
}

const EMPTY_MOVER_ACCOUNT_FORM_VALUES: MoverAccountFormValues = {
  name: '',
  email: '',
  phoneNumber: '',
  currentPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
};

const MOVER_ACCOUNT_FIELD_NAMES = new Set<FieldPath<MoverAccountSchemaInput>>([
  'name',
  'email',
  'phoneNumber',
  'currentPassword',
  'newPassword',
  'newPasswordConfirm',
]);

function toMoverAccountFieldName(
  field: string,
): FieldPath<MoverAccountSchemaInput> | null {
  const rootField = field.split('.')[0] as FieldPath<MoverAccountSchemaInput>;
  return MOVER_ACCOUNT_FIELD_NAMES.has(rootField) ? rootField : null;
}

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

function getMoverAccountSubmitErrorMessage(error: HttpError): string {
  if (error.status === 401) {
    return '로그인 정보가 만료되었습니다. 다시 로그인한 뒤 시도해주세요.';
  }

  if (error.status === 403) {
    return '현재 계정에서는 요청한 정보를 수정할 수 없습니다.';
  }

  return error.message;
}

/*=================================================
기사님 기본정보 수정 폼 상태 훅
=================================================*/

export function useMoverAccountForm({
  defaultValues,
  provider,
  onSubmit,
}: UseMoverAccountFormOptions) {
  const [submitError, setSubmitError] = useState('');
  const initialValues: MoverAccountFormValues = {
    ...EMPTY_MOVER_ACCOUNT_FORM_VALUES,
    ...defaultValues,
  };
  const isPhoneNumberRequired =
    provider === 'LOCAL' || Boolean(initialValues.phoneNumber.trim());
  const schema = createMoverAccountSchema({
    provider,
    isPhoneNumberRequired,
  });
  const form = useForm<
    MoverAccountSchemaInput,
    unknown,
    MoverAccountSchemaOutput
  >({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const watchedValues = useWatch({ control: form.control });
  const currentValues: MoverAccountFormValues = {
    name: watchedValues.name ?? initialValues.name,
    email: watchedValues.email ?? initialValues.email,
    phoneNumber: watchedValues.phoneNumber ?? initialValues.phoneNumber,
    currentPassword:
      watchedValues.currentPassword ?? initialValues.currentPassword,
    newPassword: watchedValues.newPassword ?? initialValues.newPassword,
    newPasswordConfirm:
      watchedValues.newPasswordConfirm ?? initialValues.newPasswordConfirm,
  };
  const updatePlan = createMoverAccountEditPlan(
    currentValues,
    initialValues,
    provider,
  );
  const hasRequiredValues = Boolean(
    currentValues.name.trim() &&
    currentValues.email.trim() &&
    (!isPhoneNumberRequired || currentValues.phoneNumber.trim()),
  );

  const handleValidSubmit: SubmitHandler<MoverAccountSchemaOutput> = async (
    values,
  ) => {
    setSubmitError('');

    try {
      const plan = createMoverAccountEditPlan(values, initialValues, provider);

      if (!plan.hasChanges) {
        throw new Error('변경된 정보가 없습니다.');
      }

      await onSubmit?.(plan);
    } catch (error) {
      if (error instanceof HttpError) {
        let hasMappedFieldError = false;

        error.fields?.forEach(({ field, message }) => {
          const fieldName = toMoverAccountFieldName(field);
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
          setSubmitError(getMoverAccountSubmitErrorMessage(error));
        }
        return;
      }

      setSubmitError(
        error instanceof Error
          ? error.message
          : '기본정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  return {
    ...form,
    hasChanges: updatePlan.hasChanges,
    isFormComplete: hasRequiredValues && form.formState.isValid,
    isPhoneNumberRequired,
    submitError,
    handleFormSubmit: form.handleSubmit(handleValidSubmit),
  };
}
