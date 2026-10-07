'use client';

import { useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';

import type { Role } from '@/types/role';
import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';
import { getSigninPath } from '@/lib/constants/routes';
import type { SignupFormValues } from '@/lib/validations/authValidation';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import {
  useConfirmEmailVerificationMutation,
  useSendEmailVerificationMutation,
} from '@/hooks/features/auth/queries/mutations';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { useSignupForm } from '@/hooks/features/auth/useSignupForm';

import { cn } from '@/utils/cn';
import { formatPhoneNumber } from '@/utils/formatPhoneNumber';

import AuthLinkText from '@/components/features/auth/AuthLinkText';
import AuthPageLayout from '@/components/features/auth/AuthPageLayout';
import AuthSubmitButton from '@/components/features/auth/AuthSubmitButton';
import Input from '@/components/ui/Form/Input';

interface SignupFormProps {
  role: Role;
}

/*
@ 재발송 대기시간
- 끝나는 즉시 다시 누를 수 있어서 누를 때마다 새 번호가 나가 이전 번호와 헷갈리기 쉬웠다.
- 30초 동안 버튼을 막고, 그동안은 방금 보낸 번호를 입력하라는 안내로 바꾼다.
*/
const RESEND_COOLDOWN_SECONDS = 30;

/** 초를 "3:05" 형태로 바꾼다 (인증번호 만료까지 남은 시간 표시용) */
function formatRemainingTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/*
@ 입력칸 옆 보조 버튼 (인증번호 받기/재발송, 인증 확인)
- h-[54px]: sm Input(54px)과 같은 높이로 맞춘다. 전에는 인증 확인 버튼에만
  h-[54px]를 따로 붙여서, 이메일 옆 상태 텍스트와 나란한 "받기/재발송" 버튼은
  패딩만으로 정해진 더 낮은 높이로 떠 있었다. 공통 클래스에 넣어 둘 다 같게 만든다
*/
const AUTH_SIDE_BUTTON_CLASS = cn(
  'flex h-[54px] shrink-0 cursor-pointer items-center justify-center rounded-lg border border-orange-400 px-3 text-sm-medium text-orange-400',
  'disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300',
);

export default function SignupForm({ role }: SignupFormProps) {
  const t = useTranslations('Auth');
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
  - sendError와 codeError를 나눈 이유: 둘 다 같은 state를 썼더니, 한 번 발송한 뒤
    (verificationState가 남아 있는 동안) 재발송이 실패해도 그 메시지가 인증번호
    Input의 error로 붙어서 "번호가 틀렸다"는 말처럼 보였다. 발송 실패는 버튼 옆에,
    확인 실패는 Input 밑에 각각 둔다.
  */
  const sendCodeMutation = useSendEmailVerificationMutation();
  const confirmCodeMutation = useConfirmEmailVerificationMutation();
  const [code, setCode] = useState('');
  const [sendError, setSendError] = useState('');
  const [codeError, setCodeError] = useState('');
  // React Compiler 에서는 watch() 가 리렌더를 일으키지 않아 useWatch 로 구독한다
  const emailValue = useWatch({ control, name: 'email' });
  const [verification, setVerification] = useState<{
    email: string;
    challengeToken: string;
    verifiedToken: string | null;
  } | null>(null);
  // 만료·재발송 쿨다운은 절대시각(ms)으로 들고, 1초 interval로 남은 시간만 다시 계산한다
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(
    null,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt && !resendAvailableAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt, resendAvailableAt]);

  const verificationState =
    verification && verification.email === emailValue ? verification : null;
  const isEmailVerified = Boolean(verificationState?.verifiedToken);
  const remainingSeconds = expiresAt
    ? Math.max(0, Math.ceil((expiresAt - now) / 1000))
    : null;
  const isCodeExpired = verificationState !== null && remainingSeconds === 0;
  const cooldownSeconds = resendAvailableAt
    ? Math.max(0, Math.ceil((resendAvailableAt - now) / 1000))
    : 0;
  const isResendCoolingDown = cooldownSeconds > 0;

  function resetEmailState() {
    setVerification(null);
    setCode('');
    setSendError('');
    setCodeError('');
    setExpiresAt(null);
    setResendAvailableAt(null);
  }

  async function handleSendCode() {
    const email = emailValue?.trim();
    if (!email || isResendCoolingDown) return;

    // 형식이 틀린 이메일로는 발송 요청을 보내지 않는다 (오류 문구는 trigger 가 띄운다)
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;

    setSendError('');
    setCodeError('');

    try {
      const { token, expiresInMinutes } = await sendCodeMutation.mutateAsync({
        email,
        role,
      });
      setVerification({ email, challengeToken: token, verifiedToken: null });
      setCode('');
      setExpiresAt(Date.now() + expiresInMinutes * 60_000);
      setResendAvailableAt(Date.now() + RESEND_COOLDOWN_SECONDS * 1000);
    } catch (error) {
      setSendError(
        error instanceof HttpError ? error.message : t('sendCodeFailed'),
      );
    }
  }

  async function handleConfirmCode() {
    const email = emailValue?.trim();
    if (!email || code.length === 0 || !verificationState || isCodeExpired) {
      return;
    }

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
        error instanceof HttpError ? error.message : t('confirmCodeFailed'),
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
      setSubmitError(t('verifyEmailFirst'));
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
        error instanceof HttpError ? error.message : t('signupFailed'),
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
              label={t('name')}
              type="text"
              autoComplete="name"
              placeholder={t('namePlaceholder')}
              size={errors.name ? errorSize : 'sm'}
              error={errors.name?.message}
              {...register('name')}
            />
            <div className="flex flex-col gap-2">
              <Input
                label={t('email')}
                type="email"
                autoComplete="email"
                placeholder={t('emailPlaceholder')}
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
                    ? t('emailVerified')
                    : isCodeExpired
                      ? t('codeExpired')
                      : isResendCoolingDown
                        ? t('justSentCodeHint')
                        : verificationState
                          ? t('enterCode')
                          : ''}
                </p>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={
                    !emailValue ||
                    sendCodeMutation.isPending ||
                    isEmailVerified ||
                    isResendCoolingDown
                  }
                  className={AUTH_SIDE_BUTTON_CLASS}
                >
                  {sendCodeMutation.isPending
                    ? t('sendingCode')
                    : isResendCoolingDown
                      ? t('resendCooldownButton', { seconds: cooldownSeconds })
                      : verificationState
                        ? t('resendCode')
                        : t('sendCode')}
                </button>
              </div>

              {/* 재발송 실패도 포함한다 — verificationState가 남아 있는 동안 재발송이
              실패해도 "번호가 틀렸다"는 뜻으로 보이지 않도록 Input과는 분리해 둔다 */}
              {sendError && (
                <p role="alert" className="text-sm-medium text-red-200">
                  {sendError}
                </p>
              )}

              {/* 인증번호 발송 후에만 입력칸을 보여준다 */}
              {verificationState && !isEmailVerified && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-start gap-2">
                    <Input
                      label=""
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder={t('codePlaceholder')}
                      value={code}
                      disabled={isCodeExpired}
                      onChange={(event) =>
                        setCode(event.target.value.replace(/\D/g, ''))
                      }
                      error={codeError}
                    />
                    <button
                      type="button"
                      onClick={handleConfirmCode}
                      disabled={
                        code.length < 6 ||
                        confirmCodeMutation.isPending ||
                        isCodeExpired
                      }
                      className={AUTH_SIDE_BUTTON_CLASS}
                    >
                      {confirmCodeMutation.isPending
                        ? t('confirmingCode')
                        : t('confirmCode')}
                    </button>
                  </div>

                  {/* 만료 전까지 남은 시간을 보여준다. 실제 만료 판정은 서버(challenge 토큰)가 한다 */}
                  {!isCodeExpired && remainingSeconds !== null && (
                    <p className="text-sm-medium text-gray-500">
                      {t('codeExpiresIn', {
                        time: formatRemainingTime(remainingSeconds),
                      })}
                    </p>
                  )}
                </div>
              )}
            </div>
            {/* 입력하는 동안 010-1234-5678 형태로 바꾸고 11자리까지만 받는다 */}
            <Input
              label={t('phone')}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder={t('phonePlaceholder')}
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
              label={t('password')}
              type="password"
              autoComplete="new-password"
              placeholder={t('passwordPlaceholder')}
              size={errors.password ? errorSize : 'sm'}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label={t('passwordConfirm')}
              type="password"
              autoComplete="new-password"
              placeholder={t('passwordConfirmPlaceholder')}
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
            {t('start')}
          </AuthSubmitButton>
        </div>
        <AuthLinkText
          text={t('hasAccount')}
          linkLabel={t('goLogin')}
          href={getSigninPath(role)}
        />
      </form>
    </AuthPageLayout>
  );
}
