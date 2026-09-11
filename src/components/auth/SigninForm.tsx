'use client';

import { useState } from 'react';

import type { Role } from '@/types/role';
import Link from 'next/link';

import { HttpError } from '@/lib/api/errors';
import { getSignupPath } from '@/lib/constants/routes';
import type { LoginFormValues } from '@/lib/validations/authValidation';

import { useAuth } from '@/hooks/auth/useAuth';
import { useLoginForm } from '@/hooks/auth/useLoginForm';

import InputBase from '@/components/ui/Form/InputBase';

interface SigninFormProps {
  role: Role;
}

const ROLE_LABEL: Record<Role, string> = {
  customer: '일반 유저',
  mover: '기사님',
};

export default function SigninForm({ role }: SigninFormProps) {
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useLoginForm();
  const [submitError, setSubmitError] = useState('');

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
    <div className="mx-auto flex max-w-[400px] flex-col gap-6 p-6">
      <h1 className="text-xl-bold">{ROLE_LABEL[role]} 로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputBase
          label="이메일"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <InputBase
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        {submitError && (
          <p className="text-xs-medium text-red-500">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[8px] bg-black px-4 py-2 text-md-regular text-white disabled:opacity-50"
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
      <p className="text-md-regular text-gray-500">
        계정이 없으신가요?{' '}
        <Link href={getSignupPath(role)} className="underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}
