'use client';

import { useState } from 'react';

import type { Role } from '@/types/role';

import { HttpError } from '@/lib/api/errors';
import { getSigninPath } from '@/lib/constants/routes';
import type { SignupFormValues } from '@/lib/validations/authValidation';

import { useAuth } from '@/hooks/auth/useAuth';
import { useSignupForm } from '@/hooks/auth/useSignupForm';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useModal } from '@/hooks/modal/useModal';
import { useCheckEmailMutation } from '@/hooks/queries/auth/mutations';

import { cn } from '@/utils/cn';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

import AuthLinkText from '@/components/auth/AuthLinkText';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Form/Input';

interface SignupFormProps {
  role: Role;
}

/** 입력칸 옆 보조 버튼 (중복 확인) */
const AUTH_SIDE_BUTTON_CLASS = cn(
  'shrink-0 cursor-pointer rounded-lg border border-orange-400 px-3 py-1.5 text-sm-medium text-orange-400',
  'disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300',
);

export default function SignupForm({ role }: SignupFormProps) {
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useSignupForm();
  const [submitError, setSubmitError] = useState('');
  const phoneNumberField = register('phoneNumber');
  const emailField = register('email');
  const { openModal, closeModal } = useModal();
  // 에러일 때만 커진다 (Figma: 모바일은 54px 유지, 태블릿부터 64px)
  const errorSize = useBreakpointValue('sm', 'md', 'md');
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');

  /*
  @ 이메일 중복 확인
  - 버튼을 누른 이메일과 결과를 함께 들고 있어야, 이메일을 고친 뒤 옛 결과가 남지 않는다.
  - 중복이면 모달로 알리고, 사용 가능하면 입력칸 아래 문구로만 알린다.
  - 최종 판정은 회원가입 응답이다. 확인 이후 다른 사람이 먼저 가입할 수 있다.
  */
  const checkEmailMutation = useCheckEmailMutation();
  const [emailCheck, setEmailCheck] = useState<{
    email: string;
    isAvailable: boolean;
  } | null>(null);
  const emailValue = watch('email');
  const emailCheckResult =
    emailCheck && emailCheck.email === emailValue ? emailCheck : null;

  async function handleCheckEmail() {
    const email = emailValue?.trim();
    if (!email) return;

    // 형식이 틀린 이메일로는 확인 요청을 보내지 않는다 (오류 문구는 trigger 가 띄운다)
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    try {
      const isAvailable = await checkEmailMutation.mutateAsync({
        email,
        role,
      });
      setEmailCheck({ email, isAvailable });

      if (!isAvailable) {
        openModal(
          <p className="text-2lg-medium text-black-300">
            이미 가입되어 있는 이메일이에요.
          </p>,
          {
            title: '이메일 중복 확인',
            variant: 'popup',
            buttons: (
              <Button
                size={modalButtonSize}
                className="flex-1"
                onClick={closeModal}
              >
                확인
              </Button>
            ),
          },
        );
      }
    } catch {
      setEmailCheck(null);
    }
  }

  /*
  @ 회원가입 성공 후 이동
  - 이동은 가드가 처리한다. 폼은 가입 요청만 보낸다.
    1) 로그인 상태가 되면 (auth) 그룹의 AuthGuard 가 역할 home(또는 callbackUrl)으로 보내고
    2) 그 페이지의 ProfileGuard 가 프로필이 없으면 등록 화면으로 보낸다
  - "프로필이 있는지"가 기준이라 가입 직후든, 나중에 다시 로그인하든 같게 동작한다.
  */
  async function onSubmit(data: SignupFormValues) {
    setSubmitError('');

    try {
      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
        role,
      });
    } catch (error) {
      setSubmitError(
        error instanceof HttpError
          ? error.message
          : '회원가입에 실패했습니다. 다시 시도해주세요.',
      );
    }
  }

  return (
    <AuthPageLayout role={role} mode="signup">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={cn('flex w-full flex-col gap-4', 'tablet:gap-6')}
      >
        <div className={cn('flex flex-col gap-8', 'tablet:gap-14')}>
          <div className={cn('flex flex-col gap-4', 'tablet:gap-8')}>
            <Input
              label="이름"
              type="text"
              autoComplete="name"
              placeholder="성함을 입력해 주세요"
              size={errors.name ? errorSize : 'sm'}
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex flex-col gap-2">
              <Input
                label="이메일"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력해 주세요"
                size={errors.email ? errorSize : 'sm'}
                error={errors.email?.message}
                {...emailField}
                onChange={(event) => {
                  // 이메일을 고치면 이전 확인 결과는 더 이상 유효하지 않다
                  setEmailCheck(null);
                  return emailField.onChange(event);
                }}
              />
              <div className="flex items-center justify-between gap-2">
                <p
                  role="status"
                  className={cn(
                    'text-sm-medium',
                    emailCheckResult?.isAvailable
                      ? 'text-orange-400'
                      : 'text-black-200',
                  )}
                >
                  {emailCheckResult?.isAvailable
                    ? '사용할 수 있는 이메일이에요.'
                    : ''}
                </p>
                <button
                  type="button"
                  onClick={handleCheckEmail}
                  disabled={!emailValue || checkEmailMutation.isPending}
                  className={AUTH_SIDE_BUTTON_CLASS}
                >
                  {checkEmailMutation.isPending ? '확인 중' : '중복 확인'}
                </button>
              </div>
            </div>
            {/* 입력하는 동안 010-1234-5678 형태로 바꾸고 11자리까지만 받는다 */}
            <Input
              label="전화번호"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="숫자만 입력해 주세요"
              maxLength={13}
              size={errors.phoneNumber ? errorSize : 'sm'}
              error={errors.phoneNumber?.message}
              {...phoneNumberField}
              onChange={(event) => {
                event.target.value = formatPhoneNumber(event.target.value);
                return phoneNumberField.onChange(event);
              }}
            />
            <Input
              label="비밀번호"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 입력해 주세요"
              size={errors.password ? errorSize : 'sm'}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="비밀번호 확인"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호 다시 한번 입력해 주세요"
              size={errors.passwordConfirm ? errorSize : 'sm'}
              error={errors.passwordConfirm?.message}
              {...register('passwordConfirm')}
            />
          </div>
          <AuthSubmitButton
            disabled={!isValid}
            isLoading={isSubmitting}
            error={submitError}
          >
            시작하기
          </AuthSubmitButton>
        </div>
        <AuthLinkText
          text="이미 무빙 회원이신가요?"
          linkLabel="로그인"
          href={getSigninPath(role)}
        />
      </form>
    </AuthPageLayout>
  );
}
