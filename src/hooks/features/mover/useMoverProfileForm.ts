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
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { HttpError } from '@/lib/api/errors';
import {
  createMoverProfileSchema,
  moverProfileSchema,
} from '@/lib/validations/moverProfileValidation';

import {
  normalizeCareerNumberInput,
  normalizeCareerRemainderInput,
} from '@/hooks/features/mover/moverCareerInput';
import {
  createMoverProfileEditPlan,
  type MoverProfileEditPlan,
} from '@/hooks/features/mover/moverProfileEditPlan';

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

/* 정리한 문구는 messages > MoverProfile 번역 키로 돌려주고, 없으면 null(백엔드 message 사용) */
function getMoverProfileSubmitErrorKey(error: HttpError) {
  if (error.status === 401) return 'sessionExpired';
  if (error.status === 403) return 'moverOnly';
  if (error.status === 404) return 'profileNotFound';
  if (error.status === 409) return 'alreadyCreated';
  return null;
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
  const t = useTranslations('MoverProfile');
  const [submitError, setSubmitError] = useState('');
  const isPhoneNumberRequired = mode === 'create' && provider !== 'LOCAL';
  /*
  @ 최초 등록 경력 기본값
  - 년은 사용자가 직접 입력해야 하므로 기존 빈 초기값과 필수 검증을 유지한다.
  - 최초 등록의 개월만 실제 문자열 '0'으로 시작한다. placeholder와 달리 폼 값에 저장된다.
  - 전달된 개월 값이 있으면 유지하고, 수정 화면의 서버 초기값은 변경하지 않는다.
  */
  const initialValues: MoverProfileFormValues = {
    ...EMPTY_MOVER_PROFILE_FORM_VALUES,
    ...defaultValues,
    ...(mode === 'create'
      ? {
          careerRemainderMonths:
            defaultValues?.careerRemainderMonths?.trim() || '0',
        }
      : {}),
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
  - 최초 등록은 년 입력이 필수이므로 개월만 입력해도 빈 년을 자동으로 채우지 않는다.
  - 개월을 먼저 입력했다면 년을 입력하는 시점에 함께 환산해 12개월 이상의 값도 보존한다.
  - 입력 중 빈 개월은 허용하고, 최초 등록에서 포커스를 벗어날 때만 0으로 복원한다.
  - 수정 화면은 기존 경력 초기값과 입력 환산 동작을 유지한다.
  - setValue 옵션을 동일하게 적용해 자동 환산된 연수와 개월도 사용자 변경으로 기록하고,
    수정 버튼 활성화와 Zod 검증 결과가 실제 제출값과 항상 같도록 유지한다.
  */
  const setNormalizedCareerYears = (value: string) => {
    const normalizedYears = normalizeCareerNumberInput(value);
    const currentMonths = form.getValues('careerRemainderMonths');
    const shouldNormalizeCreateCareer =
      mode === 'create' && normalizedYears !== '' && currentMonths !== '';
    const normalizedCareer = shouldNormalizeCreateCareer
      ? normalizeCareerRemainderInput(currentMonths, normalizedYears)
      : {
          careerYears: normalizedYears,
          careerRemainderMonths: currentMonths,
        };

    form.setValue('careerYears', normalizedCareer.careerYears, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (shouldNormalizeCreateCareer) {
      form.setValue(
        'careerRemainderMonths',
        normalizedCareer.careerRemainderMonths,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    }
  };

  const setNormalizedCareerRemainderMonths = (value: string) => {
    const currentYears = form.getValues('careerYears');

    // 최초 등록은 년을 직접 입력해야 하므로, 빈 년을 0으로 자동 보완하지 않는다.
    if (mode === 'create' && !currentYears.trim()) {
      form.setValue(
        'careerRemainderMonths',
        normalizeCareerNumberInput(value),
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
      return;
    }

    const normalizedCareer = normalizeCareerRemainderInput(value, currentYears);

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

  /*
  @ 빈 개월의 blur 복원
  - 편집 중에는 빈 문자열을 허용해 삭제와 재입력을 방해하지 않는다.
  - 최초 등록에서만 빈 개월을 0으로 복원하고, 년을 자동으로 0으로 채우지는 않는다.
  - setValue로 실제 폼 값과 검증을 갱신하며, Input은 이어서 RHF의 onBlur도 호출한다.
  */
  const restoreEmptyCareerRemainderMonths = () => {
    if (
      mode !== 'create' ||
      form.getValues('careerRemainderMonths').trim() !== ''
    ) {
      return;
    }

    form.setValue('careerRemainderMonths', '0', {
      shouldDirty: true,
      shouldValidate: true,
    });
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
          throw new Error(t('noChanges'));
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
          const errorKey = getMoverProfileSubmitErrorKey(error);
          setSubmitError(errorKey ? t(errorKey) : error.message);
        }
        return;
      }

      setSubmitError(error instanceof Error ? error.message : t('saveFailed'));
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
    restoreEmptyCareerRemainderMonths,
    handleFormSubmit: form.handleSubmit(handleValidSubmit),
  };
}
