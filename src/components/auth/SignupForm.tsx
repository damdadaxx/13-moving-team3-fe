'use client';

import { useState } from 'react';

import type { Role } from '@/types/role';
import { useRouter } from 'next/navigation';

import { HttpError } from '@/lib/api/errors';
import { getSigninPath } from '@/lib/constants/routes';
import { getProfileNewPath } from '@/lib/constants/routes';
import type { SignupFormValues } from '@/lib/validations/authValidation';

import { useAuth } from '@/hooks/auth/useAuth';
import { useSignupForm } from '@/hooks/auth/useSignupForm';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useCheckEmailMutation } from '@/hooks/queries/auth/mutations';

import { cn } from '@/utils/cn';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

import AuthLinkText from '@/components/auth/AuthLinkText';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import Input from '@/components/ui/Form/Input';

interface SignupFormProps {
  role: Role;
}

export default function SignupForm({ role }: SignupFormProps) {
  const router = useRouter();
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

  /*
  @ 이메일 중복 확인
  - 버튼을 누른 이메일과 결과를 함께 들고 있어야, 이메일을 고친 뒤 옛 결과가 남지 않는다.
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
      const isAvailable = await checkEmailMutation.mutateAsync({ email, role });
      setEmailCheck({ email, isAvailable });
    } catch {
      setEmailCheck(null);
    }
  }
  // 에러일 때만 커진다 (Figma: 모바일은 54px 유지, 태블릿부터 64px)
  const errorSize = useBreakpointValue('sm', 'md', 'md');

  /*
  @ 회원가입 성공 후 이동
  - 가입하면 바로 프로필 등록 화면으로 보낸다 (역할별 경로).
  - (auth) 그룹의 AuthGuard 도 로그인 상태가 되면 이동을 시도하므로,
    가드가 보는 callbackUrl 을 먼저 맞춰 두 경로가 같은 곳을 가리키게 한다.
  */
  async function onSubmit(data: SignupFormValues) {
    setSubmitError('');
    const profileNewPath = getProfileNewPath(role);

    try {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}?callbackUrl=${encodeURIComponent(profileNewPath)}`,
      );

      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
        role,
      });

      router.replace(profileNewPath);
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
                      : 'text-red-200',
                  )}
                >
                  {emailCheckResult
                    ? emailCheckResult.isAvailable
                      ? '사용할 수 있는 이메일입니다.'
                      : '이미 사용 중인 이메일입니다.'
                    : ''}
                </p>
                <button
                  type="button"
                  onClick={handleCheckEmail}
                  disabled={!emailValue || checkEmailMutation.isPending}
                  className={cn(
                    'shrink-0 cursor-pointer rounded-lg border border-orange-400 px-3 py-1.5 text-sm-medium text-orange-400',
                    'disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300',
                  )}
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
