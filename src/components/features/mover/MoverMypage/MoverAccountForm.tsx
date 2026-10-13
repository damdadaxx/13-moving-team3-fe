'use client';

import { useId } from 'react';

import type { AuthProviderName } from '@/types/auth';
import type { MoverAccountFormValues } from '@/types/moverAccount';
import { useTranslations } from 'next-intl';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import type { MoverAccountEditPlan } from '@/hooks/features/mover/moverAccountEditPlan';
import { useMoverAccountForm } from '@/hooks/features/mover/useMoverAccountForm';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Form/Input';

interface MoverAccountFormProps {
  defaultValues?: Partial<MoverAccountFormValues>;
  provider: AuthProviderName;
  cancelHref?: string;
  isSubmitting?: boolean;
  isDisabled?: boolean;
  onSubmit?: (plan: MoverAccountEditPlan) => void | Promise<void>;
}

interface DividerProps {
  className?: string;
}

const SOCIAL_PASSWORD_MASK = '••••••••';

/** Figma에서 반복되는 1px 구분선을 같은 의미와 스타일로 사용한다. */
function Divider({ className }: DividerProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-px w-full bg-line-100', className)}
    />
  );
}

/*=================================================
기사님 기본정보 수정 폼
=================================================*/

/*
@ 반응형 기준
- Mobile: 375px 화면에서 좌우 24px, 실제 입력 영역 327px를 사용한다.
- Tablet: Mobile과 같은 327px 폼을 화면 가운데 배치한다.
- Desktop: 최대 1200px 컨테이너 안에서 기본정보와 비밀번호를 500px 두 열로 배치한다.

@ 폼의 책임
- 이 컴포넌트는 Figma 레이아웃, 입력 동작, 검증 상태와 접근성을 담당한다.
- API 호출, 성공 토스트와 완료 이동은 페이지의 onSubmit에서 담당한다.
- 공용 Input과 Button은 수정하지 않고 size와 부모 레이아웃으로만 화면을 맞춘다.

@ 계정별 비밀번호 영역
- LOCAL 계정은 실제 비밀번호 입력을 React Hook Form에 등록한다.
- 소셜 계정은 비밀번호를 조회하거나 폼에 보관하지 않고 고정 마스킹 문자열만 표시한다.
*/
export default function MoverAccountForm({
  defaultValues,
  provider,
  cancelHref,
  isSubmitting = false,
  isDisabled = false,
  onSubmit,
}: MoverAccountFormProps) {
  const t = useTranslations('MoverAccount');
  /* 이름·비밀번호 등 입력 라벨은 고객 프로필 수정과 같은 문구를 쓴다 */
  const tField = useTranslations('CustomerProfile');
  const tCommon = useTranslations('Common');
  const formId = useId();
  const responsiveInputSize = useBreakpointValue('sm', 'sm', 'md');
  const responsiveButtonSize = useBreakpointValue('sm', 'sm', 'md');
  const {
    register,
    formState: { errors, isSubmitting: isFormSubmitting },
    hasChanges,
    isFormComplete,
    isPhoneNumberRequired,
    submitError,
    handleFormSubmit,
  } = useMoverAccountForm({ defaultValues, provider, onSubmit });

  const isLoading = isSubmitting || isFormSubmitting;
  const areFieldsDisabled = isDisabled || isLoading;
  const isLocalAccount = provider === 'LOCAL';
  const isSubmitDisabled = isDisabled || !hasChanges || !isFormComplete;

  return (
    <main className="w-full bg-gray-50">
      <form
        noValidate
        onSubmit={handleFormSubmit}
        className={cn(
          'mx-auto flex w-full max-w-[375px] flex-col gap-[32px] px-[24px] pt-[16px] pb-[40px]',
          'tablet:max-w-[375px]',
          'desktop:max-w-[1200px] desktop:gap-[64px] desktop:rounded-[32px] desktop:px-[40px] desktop:pt-[32px]',
        )}
      >
        <div className="flex flex-col gap-[16px] desktop:gap-[40px]">
          {/*
          @ 페이지 제목
          - 공용 RootLayout이 Header 높이와 본문 시작 위치를 담당하므로 Header를 다시 만들지 않는다.
          - 모바일/태블릿은 18px, 데스크톱은 32px로 Figma typography를 재사용한다.
          */}
          <header>
            <h1 className="text-2lg-bold leading-[26px] text-black-400 desktop:text-3xl-semibold desktop:leading-[46px]">
              {t('title')}
            </h1>
          </header>

          <Divider />

          <div className="grid grid-cols-1 items-start gap-[20px] desktop:grid-cols-2 desktop:gap-[120px]">
            {/*
            @ 이름·이메일·전화번호
            - 이름과 전화번호는 PATCH /auth/me에서 수정 가능한 값이다.
            - 이메일은 수정 API 계약이 없으므로 조회값을 읽기 전용으로 표시한다.
            - 전화번호는 모바일 숫자 키보드를 제공하되 하이픈 입력도 허용한다.
            */}
            <section
              aria-label={t('sectionBasic')}
              className="flex min-w-0 flex-col gap-[20px] desktop:max-w-[500px] desktop:gap-[32px]"
            >
              <Input
                id={formId + '-name'}
                label={tField('name')}
                labelVariant="profile"
                type="text"
                autoComplete="name"
                size={responsiveInputSize}
                maxLength={20}
                required
                disabled={areFieldsDisabled}
                error={errors.name?.message}
                {...register('name')}
              />

              <Divider />

              <Input
                id={formId + '-email'}
                label={tField('email')}
                labelVariant="profile"
                type="email"
                autoComplete="email"
                size="sm"
                readOnly
                disabled={areFieldsDisabled}
                aria-readonly="true"
                className="text-gray-400 desktop:text-2lg-regular"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                id={formId + '-phone-number'}
                label={tField('phoneNumber')}
                labelVariant="profile"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                size={responsiveInputSize}
                required={isPhoneNumberRequired}
                disabled={areFieldsDisabled}
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />

              {/* 작은 화면에서만 기본정보와 비밀번호 영역을 구분한다. */}
              <Divider className="desktop:hidden" />
            </section>

            <section
              aria-label={t('sectionPassword')}
              className="flex min-w-0 flex-col gap-[20px] desktop:max-w-[500px] desktop:gap-[32px]"
            >
              {isLocalAccount ? (
                <>
                  {/*
                  @ LOCAL 계정 비밀번호 입력
                  - 새 비밀번호 또는 확인값을 작성하면 Zod가 현재 비밀번호와 새 비밀번호 일치를 검증한다.
                  - 현재 비밀번호만 작성한 경우에는 비밀번호 변경 요청으로 판단하지 않는다.
                  - 새 비밀번호 확인은 브라우저 검증 전용이며 API 요청에는 포함하지 않는다.
                  */}
                  <Input
                    id={formId + '-current-password'}
                    label={tField('currentPassword')}
                    labelVariant="profile"
                    type="password"
                    autoComplete="current-password"
                    placeholder={tField('currentPasswordPlaceholder')}
                    size="sm"
                    disabled={areFieldsDisabled}
                    className="desktop:text-2lg-regular"
                    error={errors.currentPassword?.message}
                    {...register('currentPassword')}
                  />

                  <Divider />

                  <Input
                    id={formId + '-new-password'}
                    label={tField('newPassword')}
                    labelVariant="profile"
                    type="password"
                    autoComplete="new-password"
                    placeholder={tField('newPasswordPlaceholder')}
                    size="sm"
                    disabled={areFieldsDisabled}
                    className="desktop:text-2lg-regular"
                    error={errors.newPassword?.message}
                    {...register('newPassword')}
                  />

                  <Divider className="desktop:hidden" />

                  <Input
                    id={formId + '-new-password-confirm'}
                    label={tField('newPasswordConfirm')}
                    labelVariant="profile"
                    type="password"
                    autoComplete="new-password"
                    placeholder={tField('newPasswordConfirmPlaceholder')}
                    size="sm"
                    disabled={areFieldsDisabled}
                    className="desktop:text-2lg-regular"
                    error={errors.newPasswordConfirm?.message}
                    {...register('newPasswordConfirm')}
                  />
                </>
              ) : (
                <>
                  {/*
                  @ 소셜 계정 비밀번호 표시 접근성
                  - 실제 비밀번호는 폼과 API에서 다루지 않는다.
                  - 장식용 마스킹 입력은 비활성화하고 Tab·스크린 리더 탐색에서 제외한다.
                    변경 불가 안내만 보조 기술에 노출한다.
                  */}
                  <p className="text-sm-regular text-gray-400">
                    {tField('socialPasswordUnavailable')}
                  </p>
                  <div aria-hidden="true" className="contents">
                    {[
                      ['current-password', tField('currentPassword')],
                      ['new-password', tField('newPassword')],
                      ['new-password-confirm', tField('newPasswordConfirm')],
                    ].map(([idSuffix, label], index) => (
                      <div key={idSuffix} className="contents">
                        {index > 0 && (
                          <Divider
                            className={cn(index === 2 && 'desktop:hidden')}
                          />
                        )}
                        <Input
                          id={formId + '-' + idSuffix}
                          label={label}
                          labelVariant="profile"
                          type="text"
                          value={SOCIAL_PASSWORD_MASK}
                          autoComplete="off"
                          size="sm"
                          readOnly
                          disabled
                          tabIndex={-1}
                          className="text-gray-400 desktop:text-2lg-regular"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
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

          <div className="flex w-full flex-col gap-[8px] desktop:flex-row desktop:gap-[20px]">
            <Button
              type="submit"
              size={responsiveButtonSize}
              disabled={isSubmitDisabled}
              isLoading={isLoading}
              className="desktop:order-2 desktop:flex-1"
            >
              {tField('edit')}
            </Button>

            <Button
              type="button"
              href={cancelHref}
              variant="outlined"
              size={responsiveButtonSize}
              disabled={areFieldsDisabled}
              className={cn(
                'border-gray-200 text-gray-500 shadow-none',
                'not-aria-disabled:hover:bg-background-200 not-aria-disabled:hover:shadow-none',
                'desktop:order-1 desktop:flex-1',
              )}
            >
              {tCommon('cancel')}
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
}
