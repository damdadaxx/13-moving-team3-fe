'use client';

import { useState } from 'react';

import type { Role } from '@/types/role';

import { HttpError } from '@/lib/api/errors';
import { getSigninPath, getSignupPath } from '@/lib/constants/routes';
import type { LoginFormValues } from '@/lib/validations/authValidation';

import { useAuth } from '@/hooks/auth/useAuth';
import { useLoginForm } from '@/hooks/auth/useLoginForm';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import { cn } from '@/utils/cn';

import AuthLinkText from '@/components/auth/AuthLinkText';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';
import InputBase from '@/components/ui/Form/InputBase';

interface SigninFormProps {
  role: Role;
}

export default function SigninForm({ role }: SigninFormProps) {
  const { login } = useAuth();
  const otherRole: Role = role === 'customer' ? 'mover' : 'customer';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useLoginForm();
  const [submitError, setSubmitError] = useState('');
  const inputSize = useBreakpointValue('sm', 'md', 'md');

  async function onSubmit(data: LoginFormValues) {
    setSubmitError('');

    try {
      await login({ ...data, role });
    } catch (error) {
      setSubmitError(
        error instanceof HttpError
          ? error.message
          : '로그인에 실패했습니다. 다시 시도해주세요.',
      );
    }
  }

  return (
    <AuthPageLayout role={role} mode="signin">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className={cn('flex w-full flex-col gap-4', 'tablet:gap-6')}
      >
        <div className={cn('flex flex-col gap-8', 'tablet:gap-14')}>
          <div className={cn('flex flex-col gap-4', 'tablet:gap-8')}>
            <InputBase
              label="이메일"
              type="email"
              autoComplete="email"
              placeholder="이메일을 입력해 주세요"
              error={errors.email?.message}
              {...register('email')}
            />
            <InputBase
              label="비밀번호"
              type="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <AuthSubmitButton
            disabled={!isValid}
            isLoading={isSubmitting}
            error={submitError}
          >
            로그인
          </AuthSubmitButton>
        </div>
        <AuthLinkText
          text="아직 무빙 회원이 아니신가요?"
          linkLabel="이메일로 회원가입하기"
          href={getSignupPath(role)}
        />
      </form>
    </AuthPageLayout>
  );
}
