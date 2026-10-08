'use client';

import { useId, useState } from 'react';
import { Controller } from 'react-hook-form';

import type { AuthProviderName } from '@/types/auth';
import type { MoverProfileFormValues } from '@/types/moverProfile';
import { useTranslations } from 'next-intl';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormErrorMessage } from '@/hooks/common/useFormErrorMessage';
import type { MoverProfileEditPlan } from '@/hooks/features/mover/moverProfileEditPlan';
import { useMoverProfileForm } from '@/hooks/features/mover/useMoverProfileForm';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import RegionChipGroup from '@/components/ui/Chip/RegionChipGroup';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import Input from '@/components/ui/Form/Input';
import Textarea from '@/components/ui/Form/Textarea';
import ProfileUpload from '@/components/ui/ProfileUpload';

type MoverProfileFormMode = 'create' | 'edit';

interface MoverProfileFormProps {
  mode?: MoverProfileFormMode;
  provider?: AuthProviderName;
  defaultValues?: Partial<MoverProfileFormValues>;
  imageUrl?: string;
  cancelHref?: string;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  onCreateSubmit?: (values: MoverProfileFormValues) => void | Promise<void>;
  onEditSubmit?: (plan: MoverProfileEditPlan) => void | Promise<void>;
}

/*=================================================
기사님 프로필 등록·수정 공용 폼
=================================================*/

/*
@ 등록·수정 모드
- create 모드는 빈 폼과 회원가입 안내 문구, 시작하기 버튼을 표시한다.
- edit 모드는 기존 프로필 값과 수정하기/취소 버튼을 표시한다.
- 두 화면의 입력 구조와 검증 규칙이 같으므로 하나의 폼을 재사용하고,
  제목과 버튼처럼 실제로 다른 부분만 mode에 따라 분기한다.

@ 역할 분리
- 이 컴포넌트는 등록·수정 UI와 폼 상태를 담당한다.
- 등록 페이지는 전화번호 기본정보를 먼저 저장한 뒤 프로필을 등록한다.
- 수정 페이지는 EditPlan에 포함된 변경 필드만 PATCH한다.
- cancelHref는 화면 이동만 담당하며, 프로필 저장 요청과는 관계가 없다.

@ 반응형 기준
- mobile/tablet: 327px 단일 열, 공용 컨트롤 sm 크기
- desktop: 최대 1200px 안에서 최대 500px 두 열, 공용 컨트롤 md 크기
- 공용 컴포넌트는 수정하지 않고 이 컴포넌트의 부모 너비와 grid로만 크기를 조절한다.
*/
export default function MoverProfileForm({
  mode = 'create',
  provider,
  defaultValues,
  imageUrl,
  cancelHref,
  isSubmitting = false,
  isDisabled = false,
  onCreateSubmit,
  onEditSubmit,
}: MoverProfileFormProps) {
  const t = useTranslations('MoverProfile');
  /* 공통 라벨·버튼(전화번호, 프로필 이미지, 수정하기, 시작하기)은 고객 프로필과 같은 문구를 쓴다 */
  const tField = useTranslations('CustomerProfile');
  const tCommon = useTranslations('Common');
  const toErrorMessage = useFormErrorMessage();
  const formId = useId();
  const [profileUploadKey, setProfileUploadKey] = useState(0);
  const isEditMode = mode === 'edit';
  const controlSize = useBreakpointValue('sm', 'sm', 'md');
  const buttonSize = useBreakpointValue('sm', 'sm', 'md');
  const {
    control,
    register,
    setValue,
    formState: { errors, isSubmitting: isFormSubmitting },
    hasChanges,
    hasSelectedImage,
    isRemoveImageRequested,
    isFormComplete,
    isPhoneNumberRequired,
    submitError,
    setNormalizedCareerYears,
    setNormalizedCareerRemainderMonths,
    handleFormSubmit,
  } = useMoverProfileForm({
    mode,
    provider,
    defaultValues,
    initialImageUrl: imageUrl,
    onCreateSubmit,
    onEditSubmit,
  });

  const isLoading = isSubmitting || isFormSubmitting;
  const areFieldsDisabled = isDisabled || isLoading;
  const isSubmitDisabled =
    isDisabled || !isFormComplete || (isEditMode && !hasChanges);
  const profileImageRegistration = register('profileImage');
  const careerYearsRegistration = register('careerYears');
  const careerRemainderMonthsRegistration = register('careerRemainderMonths');
  const serviceTypeError = toErrorMessage(errors.serviceTypes?.message);
  const serviceRegionError = toErrorMessage(errors.serviceRegions?.message);
  const serviceTypeErrorId = serviceTypeError
    ? `${formId}-service-type-error`
    : undefined;
  const serviceRegionErrorId = serviceRegionError
    ? `${formId}-service-region-error`
    : undefined;

  return (
    <main className="w-full bg-gray-50">
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className="mx-auto flex w-full max-w-[327px] flex-col gap-[24px] pt-[16px] pb-[40px] desktop:max-w-[1200px] desktop:gap-[48px] desktop:px-[40px] desktop:pt-[32px]"
      >
        {/*
        @ 페이지 안내
        - 모바일과 태블릿은 18px 제목, 데스크톱은 32px 제목을 사용한다.
        - RootLayout이 공용 Header 높이만큼 body padding을 제공하므로 Header를 다시 만들지 않는다.
        */}
        <header className="flex flex-col gap-[16px] desktop:gap-[32px]">
          <h1 className="text-2lg-bold text-black-400 desktop:text-3xl-semibold desktop:leading-[46px]">
            {isEditMode ? t('editTitle') : t('createTitle')}
          </h1>
          {!isEditMode && (
            <p className="text-xs-regular text-black-100 desktop:text-xl-regular desktop:text-black-200">
              {t('createDescription')}
            </p>
          )}
        </header>

        <div aria-hidden="true" className="h-px w-full bg-line-100" />

        {/*
        @ 입력 영역
        - 모바일/태블릿은 왼쪽 묶음 다음에 오른쪽 묶음이 이어지는 한 열이다.
        - 데스크톱은 두 개의 동일한 grid track을 사용하고 각 열을 최대 500px로 제한한다.
          1024px 부근에서는 화면에 맞게 줄어들고 1200px에서는 Figma의 500px 너비가 된다.
        */}
        <div className="grid grid-cols-1 gap-[20px] desktop:grid-cols-2 desktop:gap-[40px]">
          <div className="flex min-w-0 flex-col gap-[20px] desktop:w-full desktop:max-w-[500px] desktop:gap-[32px]">
            {!isEditMode && isPhoneNumberRequired && (
              <>
                <Input
                  id={`${formId}-phone-number`}
                  label={tField('phoneNumber')}
                  labelVariant="profile"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  size={controlSize}
                  required
                  placeholder={t('phoneNumberPlaceholder')}
                  disabled={areFieldsDisabled}
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />

                <div aria-hidden="true" className="h-px w-full bg-line-100" />
              </>
            )}

            <div className="flex flex-col items-start gap-[8px]">
              <ProfileUpload
                key={profileUploadKey}
                id={`${formId}-profile-image`}
                label={tField('profileImage')}
                labelVariant="profile"
                imageUrl={isRemoveImageRequested ? undefined : imageUrl}
                previewAlt={t('previewAlt')}
                disabled={areFieldsDisabled}
                error={errors.profileImage?.message}
                hints={[
                  tCommon('profileImageFormatHint'),
                  tCommon('profileImageSizeHint'),
                ]}
                accept="image/jpeg,image/png,image/webp"
                className="tablet:size-[100px] tablet:[&_svg]:size-[32px] desktop:size-[160px] desktop:[&_svg]:size-[40px]"
                {...profileImageRegistration}
                onChange={(event) => {
                  void profileImageRegistration.onChange(event);
                  setValue('removeImage', false, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />

              {isEditMode &&
                (hasSelectedImage || imageUrl || isRemoveImageRequested) && (
                  <button
                    type="button"
                    disabled={areFieldsDisabled}
                    onClick={() => {
                      if (hasSelectedImage) {
                        setValue('profileImage', undefined, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        setValue('removeImage', false, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      } else {
                        setValue('removeImage', !isRemoveImageRequested, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }

                      setProfileUploadKey((currentKey) => currentKey + 1);
                    }}
                    className="cursor-pointer text-sm-medium text-gray-400 underline disabled:cursor-not-allowed disabled:opacity-50 desktop:text-lg-medium"
                  >
                    {hasSelectedImage
                      ? t('cancelSelection')
                      : isRemoveImageRequested
                        ? t('cancelRemoveImage')
                        : t('removeImage')}
                  </button>
                )}
            </div>

            <div aria-hidden="true" className="h-px w-full bg-line-100" />

            <Input
              id={`${formId}-nickname`}
              label={t('nickname')}
              labelVariant="profile"
              size={controlSize}
              required
              maxLength={10}
              placeholder={t('nicknamePlaceholder')}
              disabled={areFieldsDisabled}
              error={errors.nickname?.message}
              {...register('nickname')}
            />

            <div aria-hidden="true" className="h-px w-full bg-line-100" />

            {/*
            @ 경력 년/개월 입력
            - 공용 Input은 그대로 두고, 부모 grid를 2열로 나눠 두 Input의 너비만 조절한다.
            - type=number는 e, 음수, 소수 입력과 브라우저 증감 버튼 문제가 있어
              text + inputMode=numeric으로 숫자 키보드를 제공한다.
            - 입력 변경 시 숫자가 아닌 문자를 제거하고 앞자리 0을 정리한다.
            - 개월이 12 이상이면 12개월마다 1년으로 환산해 기존 연수에 더하고,
              12개월 미만만 입력했는데 연수가 비어 있으면 연수에 0을 채운다.
            - Zod는 직접 입력뿐 아니라 서버 기본값 등 모든 제출값을 마지막으로 검증한다.
            - 3년 6개월은 careerYears="3", careerRemainderMonths="6"으로 관리한다.
            */}
            <fieldset className="min-w-0" disabled={areFieldsDisabled}>
              <legend className="mb-[16px] text-lg-semibold text-black-300 desktop:text-xl-semibold">
                {t('career')}
                <span aria-hidden="true" className="ml-1 text-orange-400">
                  *
                </span>
              </legend>

              <div className="grid grid-cols-2 gap-[8px] desktop:gap-[12px]">
                <div className="flex min-w-0 items-start gap-[6px] desktop:gap-[8px]">
                  <div className="min-w-0 flex-1">
                    <Input
                      id={`${formId}-career-years`}
                      size={controlSize}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      aria-label={t('careerYearsAria')}
                      disabled={areFieldsDisabled}
                      error={errors.careerYears?.message}
                      {...careerYearsRegistration}
                      onChange={(event) => {
                        setNormalizedCareerYears(event.currentTarget.value);
                      }}
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="pt-[14px] text-lg-regular text-black-300 desktop:pt-[16px] desktop:text-2lg-regular"
                  >
                    {t('careerYearsUnit')}
                  </span>
                </div>

                <div className="flex min-w-0 items-start gap-[6px] desktop:gap-[8px]">
                  <div className="min-w-0 flex-1">
                    <Input
                      id={`${formId}-career-months`}
                      size={controlSize}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0"
                      aria-label={t('careerMonthsAria')}
                      disabled={areFieldsDisabled}
                      error={errors.careerRemainderMonths?.message}
                      {...careerRemainderMonthsRegistration}
                      onChange={(event) => {
                        setNormalizedCareerRemainderMonths(
                          event.currentTarget.value,
                        );
                      }}
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="pt-[14px] text-lg-regular text-black-300 desktop:pt-[16px] desktop:text-2lg-regular"
                  >
                    {t('careerMonthsUnit')}
                  </span>
                </div>
              </div>
            </fieldset>

            <div aria-hidden="true" className="h-px w-full bg-line-100" />

            <Input
              id={`${formId}-short-intro`}
              label={t('shortIntro')}
              labelVariant="profile"
              size={controlSize}
              required
              maxLength={50}
              placeholder={t('shortIntroPlaceholder')}
              disabled={areFieldsDisabled}
              error={errors.shortIntro?.message}
              {...register('shortIntro')}
            />
          </div>

          <div className="flex min-w-0 flex-col gap-[20px] desktop:w-full desktop:max-w-[500px] desktop:justify-self-end desktop:gap-[32px]">
            {/* 모바일과 태블릿에서 두 입력 묶음 사이에만 표시하는 구분선 */}
            <div
              aria-hidden="true"
              className="h-px w-full bg-line-100 desktop:hidden"
            />

            <Textarea
              id={`${formId}-description`}
              label={t('description')}
              labelVariant="profile"
              required
              maxLength={300}
              placeholder={t('descriptionPlaceholder')}
              disabled={areFieldsDisabled}
              error={errors.description?.message}
              className="tablet:text-lg-regular tablet:leading-[26px] desktop:text-2lg-regular desktop:leading-[32px]"
              {...register('description')}
            />

            <div aria-hidden="true" className="h-px w-full bg-line-100" />

            {/*
            @ 제공 서비스
            - 공용 ServiceTypeSelector의 복수 선택 결과를 RHF 배열 값으로 보관한다.
            - fieldset disabled를 사용해 제출 중 내부 Chip 버튼도 함께 비활성화한다.
            */}
            <fieldset className="min-w-0" disabled={areFieldsDisabled}>
              <legend className="text-lg-semibold text-black-300 desktop:text-xl-semibold">
                {t('serviceTypes')}
                <span aria-hidden="true" className="ml-1 text-orange-400">
                  *
                </span>
              </legend>

              {serviceTypeError && (
                <p
                  id={serviceTypeErrorId}
                  role="alert"
                  className="mt-[4px] text-sm-medium text-red-200 desktop:text-lg-medium"
                >
                  * {serviceTypeError}
                </p>
              )}

              <Controller
                name="serviceTypes"
                control={control}
                render={({ field }) => (
                  <ServiceTypeSelector
                    selectedServiceTypes={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    size={controlSize}
                    aria-describedby={serviceTypeErrorId}
                    aria-invalid={Boolean(serviceTypeError)}
                    className="mt-[16px] gap-[6px] desktop:gap-[12px]"
                  />
                )}
              />
            </fieldset>

            <div aria-hidden="true" className="h-px w-full bg-line-100" />

            {/*
            @ 서비스 가능 지역
            - 기사님은 여러 지역에서 서비스를 제공할 수 있으므로 선택/해제를 모두 허용한다.
            - RegionChipGroup은 클릭된 지역만 알려주므로 새 배열을 만들어 RHF에 전달한다.
            */}
            <fieldset className="min-w-0" disabled={areFieldsDisabled}>
              <legend className="text-lg-semibold text-black-300 desktop:text-xl-semibold">
                {t('serviceRegions')}
                <span aria-hidden="true" className="ml-1 text-orange-400">
                  *
                </span>
              </legend>

              {serviceRegionError && (
                <p
                  id={serviceRegionErrorId}
                  role="alert"
                  className="mt-[4px] text-sm-medium text-red-200 desktop:text-lg-medium"
                >
                  * {serviceRegionError}
                </p>
              )}

              <Controller
                name="serviceRegions"
                control={control}
                render={({ field }) => (
                  <RegionChipGroup
                    selectedRegions={field.value}
                    onRegionClick={(region) => {
                      const nextRegions = field.value.includes(region)
                        ? field.value.filter(
                            (selectedRegion) => selectedRegion !== region,
                          )
                        : [...field.value, region];

                      field.onChange(nextRegions);
                    }}
                    onBlur={field.onBlur}
                    size={controlSize}
                    aria-describedby={serviceRegionErrorId}
                    aria-invalid={Boolean(serviceRegionError)}
                    className="mt-[16px] gap-x-[8px] gap-y-[12px] desktop:gap-x-[14px] desktop:gap-y-[18px]"
                  />
                )}
              />
            </fieldset>
          </div>
        </div>

        <div className="flex w-full flex-col gap-[12px] desktop:ml-auto desktop:max-w-[500px]">
          {submitError && (
            <p
              role="alert"
              aria-live="polite"
              className="text-center text-sm-medium text-red-200 desktop:text-lg-medium"
            >
              {submitError}
            </p>
          )}

          <div
            className={cn(
              'flex w-full flex-col gap-[12px]',
              isEditMode && 'gap-[8px] desktop:flex-row desktop:gap-[20px]',
            )}
          >
            <Button
              type="submit"
              size={buttonSize}
              disabled={isSubmitDisabled}
              isLoading={isLoading}
              className={cn(isEditMode && 'desktop:order-2 desktop:flex-1')}
            >
              {isEditMode ? tField('edit') : tField('start')}
            </Button>

            {isEditMode && (
              <Button
                type="button"
                href={cancelHref}
                variant="outlined"
                size={buttonSize}
                disabled={areFieldsDisabled}
                className={cn(
                  'border-gray-200 text-gray-500 shadow-none',
                  'not-aria-disabled:hover:bg-background-200 not-aria-disabled:hover:shadow-none',
                  'desktop:order-1 desktop:flex-1',
                )}
              >
                {tCommon('cancel')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}
