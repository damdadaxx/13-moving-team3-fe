'use client';

import { useId } from 'react';
import { Controller } from 'react-hook-form';

import type { CustomerProfileFormValues } from '@/types/customerProfile';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useCustomerProfileForm } from '@/hooks/customer/useCustomerProfileForm';

import Button from '@/components/ui/Button/Button';
import RegionChipGroup from '@/components/ui/Chip/RegionChipGroup';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import ProfileUpload from '@/components/ui/ProfileUpload/ProfileUpload';

type CustomerProfileFormMode = 'create' | 'edit';

interface CustomerProfileFormProps {
  mode: CustomerProfileFormMode;
  defaultValues?: Partial<CustomerProfileFormValues>;
  imageUrl?: string;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  onSubmit?: (values: CustomerProfileFormValues) => void | Promise<void>;
}

const FORM_COPY = {
  create: {
    title: '프로필 등록',
    description: '추가 정보를 입력하여 회원가입을 완료해주세요.',
    submitLabel: '시작하기',
  },
  /*
  @ TODO(수정 화면 Figma 확정 시 확인·수정)
  - 현재 전달받은 Figma node는 등록 화면이므로 수정 화면 전용 문구는 임시로 작성했다.
  - 수정 화면 node가 확정되면 제목, 설명, 버튼 문구를 디자인 원문과 비교해 교체한다.
  - 레이아웃과 입력 항목은 등록 화면과 동일한 공용 폼을 계속 재사용한다.
  */
  edit: {
    title: '프로필 수정',
    description: '프로필 정보를 수정해주세요.',
    submitLabel: '수정하기',
  },
} as const;

/*=================================================
고객 프로필 등록·수정 공용 폼
=================================================*/

/*
@ 웹 퍼블리싱 단계의 책임
- 등록과 수정 페이지가 같은 레이아웃과 입력 컴포넌트를 재사용하도록 구성한다.
- API 호출은 페이지에서 전달받은 onSubmit이 담당하고 폼은 로딩과 오류 상태를 표현한다.
- 서비스 종류와 지역은 React Hook Form이 값을 보관하고, 공용 Chip은 그 값을 화면에 표현한다.

@ 수정 화면 API 연동 시 확인
- 조회 API가 늦게 도착하는 수정 화면에서는 폼 훅의 reset()으로 응답 값을 초기값에 반영한다.
- 등록과 수정이 이 폼을 함께 사용하므로 onSubmit은 각 페이지가 자신의 mutation을 전달한다.
*/
export default function CustomerProfileForm({
  mode,
  defaultValues,
  imageUrl,
  isSubmitting = false,
  isDisabled = false,
  onSubmit,
}: CustomerProfileFormProps) {
  const formId = useId();
  const copy = FORM_COPY[mode];
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');
  const {
    control,
    register,
    formState: { errors, isSubmitting: isFormSubmitting },
    isFormComplete,
    submitError,
    handleFormSubmit,
  } = useCustomerProfileForm({
    defaultValues,
    onSubmit,
  });
  const isLoading = isSubmitting || isFormSubmitting;
  const areFieldsDisabled = isDisabled || isLoading;

  const serviceError = errors.serviceTypes?.message;
  const regionError = errors.region?.message;
  const serviceDescriptionId = `${formId}-service-description`;
  const serviceErrorId = serviceError ? `${formId}-service-error` : undefined;
  const regionDescriptionId = `${formId}-region-description`;
  const regionErrorId = regionError ? `${formId}-region-error` : undefined;

  return (
    <main className="w-full bg-gray-50">
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className="mx-auto flex w-full max-w-[327px] flex-col gap-[32px] pt-[16px] pb-[40px] tablet:mt-[24px] tablet:min-h-[1050px] tablet:justify-between desktop:mt-[32px] desktop:min-h-0 desktop:max-w-[1200px] desktop:gap-[56px] desktop:rounded-[32px] desktop:px-[40px] desktop:pt-[24px]"
      >
        <div className="mx-auto flex w-full flex-col gap-[20px] desktop:max-w-[640px] desktop:gap-[40px]">
          {/*
          @ 페이지 안내 영역
          - 모바일/태블릿은 18px 제목, 데스크톱은 Figma의 32px/46px 제목을 사용한다.
          - 구분선까지 header에 포함해 제목 영역과 실제 입력 영역을 명확히 나눈다.
          */}
          <header className="flex flex-col gap-[16px] desktop:gap-[28px]">
            <h1 className="text-2lg-bold text-black-400 desktop:text-3xl-semibold desktop:leading-[46px]">
              {copy.title}
            </h1>
            <p className="text-xs-regular text-black-100 desktop:text-xl-regular desktop:text-black-200">
              {copy.description}
            </p>
            <div aria-hidden="true" className="h-px w-full bg-line-100" />
          </header>

          {/*
          @ 프로필 입력 영역
          - 각 항목 사이의 구분선과 간격은 Figma의 mobile → desktop 값을 그대로 적용한다.
          - 공용 컴포넌트가 입력 동작과 선택 상태를 담당하므로 페이지에서 UI를 다시 만들지 않는다.
          */}
          <div className="flex flex-col gap-[20px] desktop:gap-[32px]">
            <ProfileUpload
              id={`${formId}-profile-image`}
              label="프로필 이미지"
              labelVariant="profile"
              imageUrl={imageUrl}
              disabled={areFieldsDisabled}
              error={errors.profileImage?.message}
              accept="image/jpeg,image/png,image/webp"
              className="tablet:size-[100px] tablet:[&_svg]:size-[32px] desktop:mt-[4px] desktop:size-[160px] desktop:[&_svg]:size-[40px]"
              {...register('profileImage')}
            />

            <div aria-hidden="true" className="h-px w-full bg-line-100" />

            {/*
            @ 이용 서비스
            - 여러 서비스를 선택할 수 있다.
            - fieldset의 disabled는 내부의 실제 button까지 함께 비활성화한다.
            */}
            <fieldset disabled={areFieldsDisabled} className="min-w-0">
              <legend className="text-lg-semibold text-black-300 desktop:text-xl-semibold">
                이용 서비스
              </legend>
              <p
                id={serviceDescriptionId}
                className="mt-[8px] text-xs-regular text-gray-400 desktop:mt-[4px] desktop:text-lg-regular"
              >
                * 이용 서비스는 중복 선택 가능하며, 언제든 수정 가능해요!
              </p>

              <Controller
                name="serviceTypes"
                control={control}
                render={({ field }) => (
                  <ServiceTypeSelector
                    selectedServiceTypes={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    size={controlSize}
                    aria-describedby={
                      [serviceDescriptionId, serviceErrorId]
                        .filter(Boolean)
                        .join(' ') || undefined
                    }
                    aria-invalid={Boolean(serviceError)}
                    className="mt-[24px] gap-[6px] desktop:gap-[12px]"
                  />
                )}
              />

              {serviceError && (
                <p
                  id={serviceErrorId}
                  role="alert"
                  className="mt-[8px] text-sm-medium text-red-200"
                >
                  {serviceError}
                </p>
              )}
            </fieldset>

            <div aria-hidden="true" className="h-px w-full bg-line-100" />

            {/*
            @ 거주 지역
            - 폼 값은 단일 Region이지만 RegionChipGroup API는 배열을 받는다.
            - 선택된 값이 있으면 [값], 없으면 []로 변환해 단일 선택 UI를 만든다.
            */}
            <fieldset disabled={areFieldsDisabled} className="min-w-0">
              <legend className="text-lg-semibold text-black-300 desktop:text-xl-semibold">
                내가 사는 지역
              </legend>
              <p
                id={regionDescriptionId}
                className="mt-[8px] text-xs-regular text-gray-400 desktop:mt-[4px] desktop:text-lg-regular"
              >
                *내가 사는 지역은 언제든 수정 가능해요!
              </p>

              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <RegionChipGroup
                    selectedRegions={field.value ? [field.value] : []}
                    onRegionClick={field.onChange}
                    onBlur={field.onBlur}
                    size={controlSize}
                    aria-describedby={
                      [regionDescriptionId, regionErrorId]
                        .filter(Boolean)
                        .join(' ') || undefined
                    }
                    aria-invalid={Boolean(regionError)}
                    className="mt-[24px] gap-x-[8px] gap-y-[12px] desktop:gap-x-[14px] desktop:gap-y-[18px]"
                  />
                )}
              />

              {regionError && (
                <p
                  id={regionErrorId}
                  role="alert"
                  className="mt-[8px] text-sm-medium text-red-200"
                >
                  {regionError}
                </p>
              )}
            </fieldset>
          </div>
        </div>

        <div className="mx-auto flex w-full flex-col gap-[12px] desktop:max-w-[640px]">
          {submitError && (
            <p
              role="alert"
              aria-live="polite"
              className="text-center text-sm-medium text-red-200"
            >
              {submitError}
            </p>
          )}

          <Button
            type="submit"
            size={buttonSize}
            disabled={isDisabled || !isFormComplete}
            isLoading={isLoading}
          >
            {copy.submitLabel}
          </Button>
        </div>
      </form>
    </main>
  );
}
