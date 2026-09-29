'use client';

import { useState } from 'react';
import {
  useForm,
  useWatch,
  type FieldPath,
  type SubmitHandler,
} from 'react-hook-form';

import type { AuthProviderName } from '@/types/auth';
import type { MoverProfileFormValues } from '@/types/moverProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { HttpError } from '@/lib/api/errors';
import {
  createMoverProfileSchema,
  moverProfileSchema,
} from '@/lib/validations/moverProfileValidation';

import {
  normalizeCareerNumberInput,
  normalizeCareerRemainderInput,
} from '@/hooks/mover/moverCareerInput';
import {
  createMoverProfileEditPlan,
  type MoverProfileEditPlan,
} from '@/hooks/mover/moverProfileEditPlan';

type MoverProfileSchemaInput = z.input<typeof moverProfileSchema>;
type MoverProfileSchemaOutput = z.output<typeof moverProfileSchema>;

type MoverProfileFormMode = 'create' | 'edit';

interface UseMoverProfileFormOptions {
  mode: MoverProfileFormMode;
  provider?: AuthProviderName;
  defaultValues?: Partial<MoverProfileFormValues>;
  initialImageUrl?: string;
  onCreateSubmit?: (values: MoverProfileFormValues) => void | Promise<void>;
  onEditSubmit?: (plan: MoverProfileEditPlan) => void | Promise<void>;
}

const EMPTY_MOVER_PROFILE_FORM_VALUES: MoverProfileFormValues = {
  profileImage: undefined,
  phoneNumber: '',
  nickname: '',
  careerYears: '',
  careerRemainderMonths: '',
  shortIntro: '',
  description: '',
  serviceTypes: [],
  serviceRegions: [],
  removeImage: false,
};

const MOVER_PROFILE_FIELD_NAMES = new Set<FieldPath<MoverProfileSchemaInput>>([
  'profileImage',
  'phoneNumber',
  'nickname',
  'careerYears',
  'careerRemainderMonths',
  'shortIntro',
  'description',
  'serviceTypes',
  'serviceRegions',
  'removeImage',
]);

function toMoverProfileFieldName(
  field: string,
): FieldPath<MoverProfileSchemaInput> | null {
  const rootField = field.split('.')[0];

  if (rootField === 'careerMonths') return 'careerYears';
  if (rootField === 'removeImage') return 'profileImage';

  return MOVER_PROFILE_FIELD_NAMES.has(
    rootField as FieldPath<MoverProfileSchemaInput>,
  )
    ? (rootField as FieldPath<MoverProfileSchemaInput>)
    : null;
}

function getMoverProfileSubmitErrorMessage(error: HttpError): string {
  if (error.status === 401) {
    return '로그인 정보가 만료되었습니다. 다시 로그인한 뒤 시도해주세요.';
  }

  if (error.status === 403) {
    return '기사님 계정만 프로필을 저장할 수 있습니다.';
  }

  if (error.status === 404) {
    return '등록된 기사님 프로필을 찾지 못했습니다.';
  }

  if (error.status === 409) {
    return '이미 등록된 프로필입니다. 프로필 정보를 다시 확인합니다.';
  }

  return error.message;
}

/*=================================================
기사님 프로필 폼 상태 훅
=================================================*/

export function useMoverProfileForm({
  mode,
  provider,
  defaultValues,
  initialImageUrl,
  onCreateSubmit,
  onEditSubmit,
}: UseMoverProfileFormOptions) {
  const [submitError, setSubmitError] = useState('');
  const isPhoneNumberRequired = mode === 'create' && provider !== 'LOCAL';
  const initialValues: MoverProfileFormValues = {
    ...EMPTY_MOVER_PROFILE_FORM_VALUES,
    ...defaultValues,
  };
  const schema =
    mode === 'create'
      ? createMoverProfileSchema(isPhoneNumberRequired)
      : moverProfileSchema;
  const form = useForm<
    MoverProfileSchemaInput,
    unknown,
    MoverProfileSchemaOutput
  >({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
    mode: 'onChange',
  });

  const watchedValues = useWatch({ control: form.control });
  const currentValues: MoverProfileFormValues = {
    profileImage: watchedValues.profileImage as FileList | undefined,
    phoneNumber: watchedValues.phoneNumber ?? initialValues.phoneNumber,
    nickname: watchedValues.nickname ?? initialValues.nickname,
    careerYears: watchedValues.careerYears ?? initialValues.careerYears,
    careerRemainderMonths:
      watchedValues.careerRemainderMonths ??
      initialValues.careerRemainderMonths,
    shortIntro: watchedValues.shortIntro ?? initialValues.shortIntro,
    description: watchedValues.description ?? initialValues.description,
    serviceTypes: watchedValues.serviceTypes ?? initialValues.serviceTypes,
    serviceRegions:
      watchedValues.serviceRegions ?? initialValues.serviceRegions,
    removeImage: watchedValues.removeImage ?? initialValues.removeImage,
  };
  const editPlan = createMoverProfileEditPlan(
    currentValues,
    initialValues,
    initialImageUrl,
  );

  /*
  @ 경력 입력 변경 처리
  - 화면 컴포넌트가 경력 계산 규칙을 직접 알지 않도록 폼 훅에서 값을 정리한다.
  - setValue 옵션을 동일하게 적용해 자동 환산된 연수와 개월도 사용자 변경으로 기록하고,
    수정 버튼 활성화와 Zod 검증 결과가 실제 제출값과 항상 같도록 유지한다.
  */
  const setNormalizedCareerYears = (value: string) => {
    form.setValue('careerYears', normalizeCareerNumberInput(value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setNormalizedCareerRemainderMonths = (value: string) => {
    const normalizedCareer = normalizeCareerRemainderInput(
      value,
      form.getValues('careerYears'),
    );

    form.setValue('careerYears', normalizedCareer.careerYears, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue(
      'careerRemainderMonths',
      normalizedCareer.careerRemainderMonths,
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const hasRequiredValues = Boolean(
    (!isPhoneNumberRequired || currentValues.phoneNumber.trim()) &&
    currentValues.nickname.trim() &&
    currentValues.careerYears.trim() &&
    currentValues.careerRemainderMonths.trim() &&
    currentValues.shortIntro.trim() &&
    currentValues.description.trim() &&
    currentValues.serviceTypes.length &&
    currentValues.serviceRegions.length,
  );

  const handleValidSubmit: SubmitHandler<MoverProfileSchemaOutput> = async (
    values,
  ) => {
    setSubmitError('');

    try {
      if (mode === 'edit') {
        const plan = createMoverProfileEditPlan(
          values,
          initialValues,
          initialImageUrl,
        );

        if (!plan.hasChanges) {
          throw new Error('변경된 프로필 정보가 없습니다.');
        }

        await onEditSubmit?.(plan);
        return;
      }

      await onCreateSubmit?.(values);
    } catch (error) {
      if (error instanceof HttpError) {
        let hasMappedFieldError = false;

        error.fields?.forEach(({ field, message }) => {
          const fieldName = toMoverProfileFieldName(field);
          if (!fieldName) return;

          hasMappedFieldError = true;
          form.setError(fieldName, { type: 'server', message });
        });

        if (!hasMappedFieldError) {
          setSubmitError(getMoverProfileSubmitErrorMessage(error));
        }
        return;
      }

      setSubmitError(
        error instanceof Error
          ? error.message
          : '프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  return {
    ...form,
    hasChanges: mode === 'create' || editPlan.hasChanges,
    hasSelectedImage: Boolean(currentValues.profileImage?.[0]),
    isRemoveImageRequested: currentValues.removeImage,
    isFormComplete: hasRequiredValues && form.formState.isValid,
    isPhoneNumberRequired,
    submitError,
    setNormalizedCareerYears,
    setNormalizedCareerRemainderMonths,
    handleFormSubmit: form.handleSubmit(handleValidSubmit),
  };
}
