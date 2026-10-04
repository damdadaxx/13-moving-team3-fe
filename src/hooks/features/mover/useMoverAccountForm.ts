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
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { HttpError } from '@/lib/api/errors';
import {
  createMoverAccountSchema,
  type MoverAccountSchema,
} from '@/lib/validations/moverAccountValidation';

import {
  createMoverAccountEditPlan,
  type MoverAccountEditPlan,
} from '@/hooks/features/mover/moverAccountEditPlan';

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

/* 정리한 문구는 messages > MoverAccount 번역 키로 돌려주고, 없으면 null(백엔드 message 사용) */
function getMoverAccountSubmitErrorKey(error: HttpError) {
  if (error.status === 401) return 'sessionExpired';
  if (error.status === 403) return 'editForbidden';
  return null;
}

/*=================================================
기사님 기본정보 수정 폼 상태 훅
=================================================*/

export function useMoverAccountForm({
  defaultValues,
  provider,
  onSubmit,
}: UseMoverAccountFormOptions) {
  const t = useTranslations('MoverAccount');
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
        throw new Error(t('noChanges'));
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
          const errorKey = getMoverAccountSubmitErrorKey(error);
          setSubmitError(errorKey ? t(errorKey) : error.message);
        }
        return;
      }

      setSubmitError(error instanceof Error ? error.message : t('editFailed'));
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
