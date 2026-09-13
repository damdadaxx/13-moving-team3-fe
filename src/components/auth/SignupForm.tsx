'use client';

import { useState } from 'react';

import type { Role } from '@/types/role';

import { HttpError } from '@/lib/api/errors';
import { getSigninPath, getSignupPath } from '@/lib/constants/routes';
import type { SignupFormValues } from '@/lib/validations/authValidation';

import { useAuth } from '@/hooks/auth/useAuth';
import { useSignupForm } from '@/hooks/auth/useSignupForm';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';

import AuthField from '@/components/auth/AuthField';
import AuthLinkText from '@/components/auth/AuthLinkText';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import AuthSubmitButton from '@/components/auth/AuthSubmitButton';

interface SignupFormProps {
  role: Role;
}

export default function SignupForm({ role }: SignupFormProps) {
  const { signup } = useAuth();
  const otherRole: Role = role === 'customer' ? 'mover' : 'customer';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useSignupForm();
  const [submitError, setSubmitError] = useState('');
  const inputSize = useBreakpointValue('sm', 'md', 'md');

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
        className="flex w-full flex-col gap-4 tablet:gap-6"
      >
        <div className="flex flex-col gap-8 tablet:gap-14">
          <div className="flex flex-col gap-4 tablet:gap-8">
            <AuthField
              label="이름"
              type="text"
              autoComplete="name"
              placeholder="성함을 입력해 주세요"
              error={errors.name?.message}
              {...register('name')}
            />
            <AuthField
              label="이메일"
              type="email"
              autoComplete="email"
              placeholder="이메일을 입력해 주세요"
              error={errors.email?.message}
              {...register('email')}
            />
            <AuthField
              label="전화번호"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="숫자만 입력해 주세요"
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
            <AuthField
              label="비밀번호"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 입력해 주세요"
              error={errors.password?.message}
              {...register('password')}
            />
            <AuthField
              label="비밀번호 확인"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호 다시 한번 입력해 주세요"
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
