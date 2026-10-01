'use client';

import { useState } from 'react';
import {
  useForm,
  useWatch,
  type FieldPath,
  type SubmitHandler,
} from 'react-hook-form';

import type { CustomerProfileFormValues } from '@/types/customerProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { HttpError } from '@/lib/api/errors';
import { customerProfileSchema } from '@/lib/validations/customerProfileValidation';

/*
@ Zod 입력·출력 타입 분리
- profileImage는 z.custom()으로 검사하므로 검증 전 입력 타입은 unknown이다.
- 검증 후에는 FileList | undefined로 좁혀진다.
- React Hook Form의 첫 번째 제네릭은 검증 전 입력, 세 번째 제네릭은 검증 후 값을 뜻한다.
*/
type CustomerProfileSchemaInput = z.input<typeof customerProfileSchema>;
type CustomerProfileSchemaOutput = z.output<typeof customerProfileSchema>;

interface UseCustomerProfileFormOptions {
  defaultValues?: Partial<CustomerProfileFormValues>;
  onSubmit?: (values: CustomerProfileFormValues) => void | Promise<void>;
}

const EMPTY_CUSTOMER_PROFILE_FORM_VALUES: CustomerProfileFormValues = {
  profileImage: undefined,
  serviceTypes: [],
  region: null,
};

const CUSTOMER_PROFILE_FIELD_NAMES = new Set<
  FieldPath<CustomerProfileSchemaInput>
>(['profileImage', 'serviceTypes', 'region']);

/*
@ 백엔드 필드 이름 변환
- 백엔드 validation error의 field는 문자열이므로 React Hook Form이 관리하는
  고객 프로필 필드인지 확인한 뒤에만 setError에 전달한다.
- 알 수 없는 필드를 억지로 연결하지 않고 폼 전체 오류 메시지로 안내한다.
*/
function toCustomerProfileFieldName(
  field: string,
): FieldPath<CustomerProfileSchemaInput> | null {
  const rootField = field.split(
    '.',
  )[0] as FieldPath<CustomerProfileSchemaInput>;
  return CUSTOMER_PROFILE_FIELD_NAMES.has(rootField) ? rootField : null;
}

/*
@ 폼 전체 오류 문구
- 백엔드 message를 기본으로 사용하되 인증·권한·중복 등록은 사용자가 다음 행동을
  바로 이해할 수 있도록 등록 화면 문맥에 맞는 문구로 정리한다.
- NETWORK_ERROR와 500 계열 오류는 clientFetch가 만든 안전한 안내 문구를 그대로 사용한다.
*/
function getCustomerProfileSubmitErrorMessage(error: HttpError): string {
  if (error.status === 401) {
    return '로그인 정보가 만료되었습니다. 다시 로그인한 뒤 시도해주세요.';
  }

  if (error.status === 403) {
    return '고객 계정만 프로필을 등록할 수 있습니다.';
  }

  if (error.status === 409) {
    return '이미 등록된 프로필입니다. 프로필 정보를 다시 확인합니다.';
  }

  return error.message;
}

/*=================================================
고객 프로필 폼 상태 훅
=================================================*/

/*
@ 역할 분리
- Zod 검증, React Hook Form 상태, 버튼 활성화 조건을 이 훅에서 관리한다.
- CustomerProfileForm 컴포넌트는 레이아웃과 오류 메시지 출력에 집중한다.
- API와 TanStack Query mutation은 페이지가 onSubmit으로 전달한다.
- 이 훅은 요청 과정에서 발생한 서버 필드 오류와 폼 전체 오류를 화면 상태로 변환한다.

@ 수정 화면 API 조회 연결 시 확인
- 수정 화면의 GET 응답은 첫 렌더 이후 도착하므로 reset()으로 초기값을 반영한다.
*/
export function useCustomerProfileForm({
  defaultValues,
  onSubmit,
}: UseCustomerProfileFormOptions) {
  const [submitError, setSubmitError] = useState('');
  const form = useForm<
    CustomerProfileSchemaInput,
    unknown,
    CustomerProfileSchemaOutput
  >({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      ...EMPTY_CUSTOMER_PROFILE_FORM_VALUES,
      ...defaultValues,
    },
    /*
    @ onChange 검증
    - Chip은 클릭으로 값이 바뀌므로 선택 직후 버튼 상태와 오류 상태가 갱신되어야 한다.
    - submit을 누르기 전에도 잘못된 이미지 파일을 즉시 안내할 수 있다.
    */
    mode: 'onChange',
  });

  const selectedServiceTypes =
    useWatch({ control: form.control, name: 'serviceTypes' }) ?? [];
  const selectedRegion =
    useWatch({ control: form.control, name: 'region' }) ?? null;

  /*
  @ 완료 상태
  - 프로필 이미지는 선택값이므로 완료 조건에 포함하지 않는다.
  - 필수값이 있고 현재 Zod 오류가 없을 때만 제출 버튼을 활성화한다.
  - handleSubmit도 다시 Zod 검증을 수행하므로 버튼 상태와 별개로 잘못된 값은 제출되지 않는다.
  */
  const hasRequiredValues =
    selectedServiceTypes.length > 0 && selectedRegion !== null;
  const hasValidationError = Object.keys(form.formState.errors).length > 0;
  const isFormComplete = hasRequiredValues && !hasValidationError;

  const handleValidSubmit: SubmitHandler<CustomerProfileSchemaOutput> = async (
    values,
  ) => {
    /*
    @ 등록/수정 요청 오류 처리
    - 새로운 제출을 시작할 때 이전의 폼 전체 오류를 지운다.
    - 서버가 fields를 반환하면 region/serviceTypes/profileImage 오류를 각 입력에 연결한다.
    - 401/403/409/네트워크 오류처럼 특정 입력에 연결할 수 없는 오류는
      제출 버튼 가까이에서 사용자가 바로 확인할 수 있도록 submitError로 보관한다.
    */
    setSubmitError('');

    try {
      await onSubmit?.(values);
    } catch (error) {
      if (error instanceof HttpError) {
        let hasMappedFieldError = false;

        error.fields?.forEach(({ field, message }) => {
          const fieldName = toCustomerProfileFieldName(field);
          if (!fieldName) return;

          hasMappedFieldError = true;
          form.setError(fieldName, { type: 'server', message });
        });

        if (!hasMappedFieldError) {
          setSubmitError(getCustomerProfileSubmitErrorMessage(error));
        }
        return;
      }

      setSubmitError(
        '프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      );
    }
  };

  return {
    ...form,
    isFormComplete,
    submitError,
    handleFormSubmit: form.handleSubmit(handleValidSubmit),
  };
}
