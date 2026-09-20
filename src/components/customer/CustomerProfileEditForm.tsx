'use client';

import { useId } from 'react';
import { Controller } from 'react-hook-form';

import type { AuthProviderName } from '@/types/auth';
import type { CustomerProfileEditFormValues } from '@/types/customerProfile';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import type { CustomerProfileEditPlan } from '@/hooks/customer/customerProfileEditPlan';
import { useCustomerProfileEditForm } from '@/hooks/customer/useCustomerProfileEditForm';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import RegionChipGroup from '@/components/ui/Chip/RegionChipGroup';
import ServiceTypeSelector from '@/components/ui/Chip/ServiceTypeSelector';
import Input from '@/components/ui/Form/Input';
import Label from '@/components/ui/Form/Label';
import ProfileUpload from '@/components/ui/ProfileUpload/ProfileUpload';

interface CustomerProfileEditFormProps {
  defaultValues?: Partial<CustomerProfileEditFormValues>;
  provider: AuthProviderName;
  imageUrl?: string;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  onSubmit?: (plan: CustomerProfileEditPlan) => void | Promise<void>;
  onCancel?: () => void;
}

interface DividerProps {
  className?: string;
}

const SOCIAL_PASSWORD_MASK = '••••••••';

/** Figma의 1px 구분선을 같은 의미로 반복 사용하기 위한 작은 화면 전용 요소입니다. */
function Divider({ className }: DividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-px w-full bg-line-100', className)}
    />
  );
}

/*=================================================
고객 프로필 수정 폼
=================================================*/

/*
@ 반응형 기준
- Mobile: 375px 안에서 좌우 24px, 실제 입력 영역 327px를 사용한다.
- Tablet: Mobile과 같은 375px 폼을 화면 가운데 배치한다.
- Desktop: 1200px 컨테이너 안에서 계정 정보와 프로필 정보를 2열로 배치한다.

@ 폼의 책임
- Figma 레이아웃, 입력 동작, 검증 상태와 접근성을 담당한다.
- API 호출과 완료 이동은 페이지에서 전달한 onSubmit/onCancel이 담당한다.
- 공용 Input/ProfileUpload/Chip/Button의 ref, name, onChange, onBlur를 유지한다.

@ 계정별 비밀번호 영역
- LOCAL 계정은 실제 비밀번호 입력을 React Hook Form에 등록한다.
- 소셜 계정은 실제 비밀번호를 보관하거나 조회하지 않고 고정 마스킹 문자열만 읽기 전용으로 표시한다.
*/
export default function CustomerProfileEditForm({
  defaultValues,
  provider,
  imageUrl,
  isSubmitting = false,
  isDisabled = false,
  onSubmit,
  onCancel,
}: CustomerProfileEditFormProps) {
  const formId = useId();
  const responsiveInputSize = useBreakpointValue('sm', 'sm', 'md');
  const responsiveControlSize = useBreakpointValue('sm', 'sm', 'md');
  const responsiveButtonSize = useBreakpointValue('sm', 'sm', 'md');
  const {
    control,
    register,
    formState: { errors, isSubmitting: isFormSubmitting },
    hasChanges,
    isFormComplete,
    submitError,
    handleFormSubmit,
  } = useCustomerProfileEditForm({ defaultValues, provider, onSubmit });

  const isLoading = isSubmitting || isFormSubmitting;
  const areFieldsDisabled = isDisabled || isLoading;
  const isLocalAccount = provider === 'LOCAL';
  const serviceError = errors.serviceTypes?.message;
  const regionError = errors.region?.message;
  const serviceDescriptionId = formId + '-service-description';
  const serviceErrorId = serviceError ? formId + '-service-error' : undefined;
  const regionDescriptionId = formId + '-region-description';
  const regionErrorId = regionError ? formId + '-region-error' : undefined;
  const profileImageId = formId + '-profile-image';

  return (
    <main className="w-full bg-gray-50">
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className={cn(
          'mx-auto flex w-full max-w-[375px] flex-col gap-[32px] px-[24px] pt-[16px] pb-[24px]',
          'tablet:max-w-[375px]',
          'desktop:mt-[38px] desktop:max-w-[1200px] desktop:gap-[64px] desktop:rounded-[32px] desktop:px-[40px] desktop:pt-[32px] desktop:pb-[40px]',
        )}
      >
        <div className="flex flex-col gap-[32px] desktop:gap-[40px]">
          <header className="flex items-center">
            <h1 className="text-2lg-bold leading-[26px] text-black-400 desktop:text-3xl-semibold desktop:leading-[46px]">
              프로필 수정
            </h1>
          </header>

          <section className="flex flex-col gap-[20px] desktop:gap-[40px]">
            <Divider />

            <div
              className={cn(
                'grid grid-cols-1 items-start gap-[20px]',
                'desktop:grid-cols-2 desktop:gap-x-[clamp(40px,6.25vw,120px)]',
              )}
            >
              {/*
              @ 계정 기본정보와 비밀번호
              - Mobile/Tablet은 모든 항목 사이에 구분선이 있다.
              - Desktop은 전화번호 뒤와 현재 비밀번호 뒤에만 구분선을 표시한다.
              - 이메일은 백엔드 수정 계약이 없으므로 읽기 전용으로 제공한다.
              */}
              <div className="flex min-w-0 flex-col gap-[20px] desktop:gap-[32px]">
                <Input
                  label="이름"
                  labelVariant="profile"
                  type="text"
                  autoComplete="name"
                  size={responsiveInputSize}
                  disabled={areFieldsDisabled}
                  aria-required="true"
                  error={errors.name?.message}
                  {...register('name')}
                />

                <Divider className="desktop:hidden" />

                <Input
                  label="이메일"
                  labelVariant="profile"
                  type="email"
                  autoComplete="email"
                  size="sm"
                  readOnly
                  disabled={areFieldsDisabled}
                  aria-readonly="true"
                  className="text-gray-400"
                  error={errors.email?.message}
                  {...register('email')}
                />

                <Divider className="desktop:hidden" />

                <Input
                  label="전화번호"
                  labelVariant="profile"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  size={responsiveInputSize}
                  disabled={areFieldsDisabled}
                  aria-required="true"
                  error={errors.phoneNumber?.message}
                  {...register('phoneNumber')}
                />

                <Divider />

                {isLocalAccount ? (
                  <>
                    {/*
                    @ LOCAL 계정 비밀번호 입력
                    - 세 입력 중 하나라도 작성하면 Zod가 나머지 필수값과 새 비밀번호 일치를 검증한다.
                    - 확인값은 프론트 검증 전용이며 API에는 전송하지 않는다.
                    */}
                    <Input
                      label="현재 비밀번호"
                      labelVariant="profile"
                      type="password"
                      autoComplete="current-password"
                      placeholder="현재 비밀번호를 입력해주세요"
                      size="sm"
                      disabled={areFieldsDisabled}
                      error={errors.currentPassword?.message}
                      {...register('currentPassword')}
                    />

                    <Divider />

                    <Input
                      label="새 비밀번호"
                      labelVariant="profile"
                      type="password"
                      autoComplete="new-password"
                      placeholder="새 비밀번호를 입력해주세요"
                      size="sm"
                      disabled={areFieldsDisabled}
                      error={errors.newPassword?.message}
                      {...register('newPassword')}
                    />

                    <Divider className="desktop:hidden" />

                    <Input
                      label="새 비밀번호 확인"
                      labelVariant="profile"
                      type="password"
                      autoComplete="new-password"
                      placeholder="새 비밀번호를 다시 한번 입력해주세요"
                      size="sm"
                      disabled={areFieldsDisabled}
                      error={errors.newPasswordConfirm?.message}
                      {...register('newPasswordConfirm')}
                    />
                  </>
                ) : (
                  <>
                    {/*
                    @ 소셜 계정 비밀번호 표시
                    - 실제 비밀번호를 API에서 조회하거나 폼 값으로 등록하지 않는다.
                    - 고정된 마스킹 문자열만 읽기 전용으로 보여주며 비밀번호 API도 호출하지 않는다.
                    */}
                    <Input
                      label="현재 비밀번호"
                      labelVariant="profile"
                      type="text"
                      value={SOCIAL_PASSWORD_MASK}
                      autoComplete="off"
                      size="sm"
                      readOnly
                      disabled={areFieldsDisabled}
                      aria-readonly="true"
                      className="text-gray-400"
                    />

                    <Divider />

                    <Input
                      label="새 비밀번호"
                      labelVariant="profile"
                      type="text"
                      value={SOCIAL_PASSWORD_MASK}
                      autoComplete="off"
                      size="sm"
                      readOnly
                      disabled={areFieldsDisabled}
                      aria-readonly="true"
                      className="text-gray-400"
                    />

                    <Divider className="desktop:hidden" />

                    <Input
                      label="새 비밀번호 확인"
                      labelVariant="profile"
                      type="text"
                      value={SOCIAL_PASSWORD_MASK}
                      autoComplete="off"
                      size="sm"
                      readOnly
                      disabled={areFieldsDisabled}
                      aria-readonly="true"
                      className="text-gray-400"
                    />
                  </>
                )}

                <Divider className="desktop:hidden" />
              </div>

              {/*
              @ 고객 프로필 정보
              - 등록 화면과 동일한 공용 ProfileUpload, ServiceTypeSelector,
                RegionChipGroup을 사용한다.
              - Tablet까지는 sm 크기를 유지하고 Desktop에서만 md 크기로 전환한다.
              */}
              <div className="flex min-w-0 flex-col gap-[20px] desktop:gap-[32px]">
                <div className="flex flex-col items-start gap-[16px] desktop:gap-[24px]">
                  <Label
                    htmlFor={profileImageId}
                    variant="profile"
                    className="mb-0"
                  >
                    프로필 이미지
                  </Label>
                  <ProfileUpload
                    id={profileImageId}
                    imageUrl={imageUrl}
                    previewAlt={imageUrl ? '현재 프로필 이미지' : ''}
                    disabled={areFieldsDisabled}
                    error={errors.profileImage?.message}
                    accept="image/jpeg,image/png,image/webp"
                    className="tablet:size-[100px] tablet:[&_svg]:size-[32px] desktop:size-[160px] desktop:[&_svg]:size-[40px]"
                    {...register('profileImage')}
                  />
                </div>

                <Divider />

                <fieldset disabled={areFieldsDisabled} className="min-w-0">
                  <legend className="text-lg-semibold text-black-300 desktop:text-xl-semibold">
                    이용 서비스
                  </legend>
                  <p
                    id={serviceDescriptionId}
                    className="mt-[8px] text-xs-regular text-gray-400 desktop:text-lg-regular"
                  >
                    *견적 요청 시 이용 서비스를 선택할 수 있어요.
                  </p>

                  <Controller
                    name="serviceTypes"
                    control={control}
                    render={({ field }) => (
                      <ServiceTypeSelector
                        selectedServiceTypes={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        size={responsiveControlSize}
                        aria-describedby={
                          [serviceDescriptionId, serviceErrorId]
                            .filter(Boolean)
                            .join(' ') || undefined
                        }
                        aria-invalid={Boolean(serviceError)}
                        className="mt-[24px] gap-[6px] desktop:mt-[32px] desktop:gap-[12px]"
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

                <Divider />

                <fieldset disabled={areFieldsDisabled} className="min-w-0">
                  <legend className="text-lg-semibold text-black-300 desktop:text-xl-semibold">
                    내가 사는 지역
                  </legend>
                  <p
                    id={regionDescriptionId}
                    className="mt-[8px] text-xs-regular text-gray-400 desktop:text-lg-regular"
                  >
                    *견적 요청 시 지역을 설정할 수 있어요.
                  </p>

                  <Controller
                    name="region"
                    control={control}
                    render={({ field }) => (
                      <RegionChipGroup
                        selectedRegions={field.value ? [field.value] : []}
                        onRegionClick={field.onChange}
                        onBlur={field.onBlur}
                        size={responsiveControlSize}
                        aria-describedby={
                          [regionDescriptionId, regionErrorId]
                            .filter(Boolean)
                            .join(' ') || undefined
                        }
                        aria-invalid={Boolean(regionError)}
                        className="mt-[24px] gap-x-[8px] gap-y-[12px] desktop:mt-[32px] desktop:gap-x-[14px] desktop:gap-y-[18px]"
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
          </section>
        </div>

        {submitError && (
          <p
            role="alert"
            aria-live="polite"
            className="text-center text-sm-medium text-red-200 desktop:text-lg-medium"
          >
            {submitError}
          </p>
        )}

        {/*
        @ 버튼의 반응형 순서와 키보드 접근성
        - Mobile/Tablet은 수정하기 → 취소, Desktop은 취소 → 수정하기 순서다.
        - CSS order만 바꾸면 화면 순서와 Tab 순서가 달라질 수 있으므로,
          각 breakpoint에서 하나의 버튼 그룹만 display 되도록 분리했다.
        */}
        <div className="flex w-full flex-col gap-[8px] desktop:hidden">
          <Button
            type="submit"
            size={responsiveButtonSize}
            disabled={isDisabled || !isFormComplete || !hasChanges}
            isLoading={isLoading}
          >
            수정하기
          </Button>
          <Button
            type="button"
            variant="outlined"
            size={responsiveButtonSize}
            disabled={areFieldsDisabled}
            onClick={onCancel}
            className="border-gray-200 text-gray-300"
          >
            취소
          </Button>
        </div>

        <div className="hidden w-full max-w-[500px] gap-[20px] self-end desktop:flex">
          <Button
            type="button"
            variant="outlined"
            size={responsiveButtonSize}
            disabled={areFieldsDisabled}
            onClick={onCancel}
            className="border-gray-200 text-gray-500"
          >
            취소
          </Button>
          <Button
            type="submit"
            size={responsiveButtonSize}
            disabled={isDisabled || !isFormComplete || !hasChanges}
            isLoading={isLoading}
          >
            수정하기
          </Button>
        </div>
      </form>
    </main>
  );
}
