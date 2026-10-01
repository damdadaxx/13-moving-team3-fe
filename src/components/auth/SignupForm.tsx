'use client';

import { useState } from 'react';
import { useWatch } from 'react-hook-form';

import type { Role } from '@/types/role';

import { HttpError } from '@/lib/api/errors';
import { getSigninPath } from '@/lib/constants/routes';
import type { SignupFormValues } from '@/lib/validations/authValidation';

import { useAuth } from '@/hooks/auth/useAuth';
import { useSignupForm } from '@/hooks/auth/useSignupForm';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import {
  useConfirmEmailVerificationMutation,
  useSendEmailVerificationMutation,
} from '@/hooks/queries/auth/mutations';

import { cn } from '@/utils/cn';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

import AuthLinkText from '@/components/auth/AuthLinkText';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import Input from '@/components/ui/Form/Input';

interface SignupFormProps {
  role: Role;
}

/** 입력칸 옆 보조 버튼 (인증번호) */
const AUTH_SIDE_BUTTON_CLASS = cn(
  'shrink-0 cursor-pointer rounded-lg border border-orange-400 px-3 py-1.5 text-sm-medium text-orange-400',
  'disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300',
);

export default function SignupForm({ role }: SignupFormProps) {
  const { signup } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useSignupForm();
  const [submitError, setSubmitError] = useState('');
  const phoneNumberField = register('phoneNumber');
  const emailField = register('email');
  // 에러일 때만 커진다 (Figma: 모바일은 54px 유지, 태블릿부터 64px)
  const errorSize = useBreakpointValue('sm', 'md', 'md');

  /*
  @ 이메일 인증번호
  - 인증을 마쳐야 회원가입이 된다 (서버도 같은 기준으로 막는다).
  - 이메일을 고치면 발송·인증 상태를 모두 비워 옛 인증이 남지 않게 한다.
  */
  const sendCodeMutation = useSendEmailVerificationMutation();
  const confirmCodeMutation = useConfirmEmailVerificationMutation();
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  // React Compiler 에서는 watch() 가 리렌더를 일으키지 않아 useWatch 로 구독한다
  const emailValue = useWatch({ control, name: 'email' });
  const [verification, setVerification] = useState<{
    email: string;
    challengeToken: string;
    verifiedToken: string | null;
  } | null>(null);
  const verificationState =
    verification && verification.email === emailValue ? verification : null;
  const isEmailVerified = Boolean(verificationState?.verifiedToken);

  function resetEmailState() {
    setVerification(null);
    setCode('');
    setCodeError('');
  }

  async function handleSendCode() {
    const email = emailValue?.trim();
    if (!email) return;

    // 형식이 틀린 이메일로는 발송 요청을 보내지 않는다 (오류 문구는 trigger 가 띄운다)
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    setCodeError('');

    try {
      const { token } = await sendCodeMutation.mutateAsync({ email, role });
      setVerification({ email, challengeToken: token, verifiedToken: null });
      setCode('');
    } catch (error) {
      setCodeError(
        error instanceof HttpError
          ? error.message
          : '인증번호 발송에 실패했습니다. 다시 시도해주세요.',
      );
    }
  }

  async function handleConfirmCode() {
    const email = emailValue?.trim();
    if (!email || code.length === 0 || !verificationState) return;

    setCodeError('');

    try {
      const { token } = await confirmCodeMutation.mutateAsync({
        email,
        role,
        code,
        token: verificationState.challengeToken,
      });
      setVerification({
        email,
        challengeToken: verificationState.challengeToken,
        verifiedToken: token,
      });
    } catch (error) {
      setCodeError(
        error instanceof HttpError
          ? error.message
          : '인증번호 확인에 실패했습니다. 다시 시도해주세요.',
      );
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
    const verifiedToken = verification?.verifiedToken;

    // 버튼이 막고 있지만, 상태가 어긋난 경우에도 잘못된 요청을 보내지 않는다
    if (!verifiedToken || verification?.email !== data.email) {
      setSubmitError('이메일 인증을 먼저 완료해주세요.');
      return;
    }

    try {
      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
        role,
        emailVerificationToken: verifiedToken,
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
                  // 이메일을 고치면 이전 발송·인증 결과는 더 이상 유효하지 않다
                  resetEmailState();
                  return emailField.onChange(event);
                }}
              />
              <div className="flex items-center justify-between gap-2">
                <p
                  role="status"
                  className={cn(
                    'text-sm-medium',
                    isEmailVerified ? 'text-orange-400' : 'text-black-200',
                  )}
                >
                  {isEmailVerified
                    ? '이메일 인증이 완료되었습니다.'
                    : verificationState
                      ? '메일로 받은 인증번호를 입력해 주세요.'
                      : ''}
                </p>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={
                    !emailValue || sendCodeMutation.isPending || isEmailVerified
                  }
                  className={AUTH_SIDE_BUTTON_CLASS}
                >
                  {sendCodeMutation.isPending
                    ? '발송 중'
                    : verificationState
                      ? '재발송'
                      : '인증번호 받기'}
                </button>
              </div>

              {/* 인증번호 발송 후에만 입력칸을 보여준다 */}
              {verificationState && !isEmailVerified && (
                <div className="flex items-start gap-2">
                  <Input
                    label=""
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="인증번호 6자리"
                    value={code}
                    onChange={(event) =>
                      setCode(event.target.value.replace(/\D/g, ''))
                    }
                    error={codeError}
                  />
                  <button
                    type="button"
                    onClick={handleConfirmCode}
                    disabled={code.length < 6 || confirmCodeMutation.isPending}
                    className={cn(AUTH_SIDE_BUTTON_CLASS, 'h-[54px] shrink-0')}
                  >
                    {confirmCodeMutation.isPending ? '확인 중' : '인증 확인'}
                  </button>
                </div>
              )}

              {codeError && !verificationState && (
                <p role="alert" className="text-sm-medium text-red-200">
                  {codeError}
                </p>
              )}
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
          {/* 이메일 인증을 마쳐야 가입할 수 있다 (서버도 같은 기준으로 막는다) */}
          <AuthSubmitButton
            disabled={!isValid || !isEmailVerified}
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
