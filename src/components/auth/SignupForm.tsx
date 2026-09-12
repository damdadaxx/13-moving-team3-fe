'use client';

import { useState } from 'react';

import type { Role } from '@/types/role';
import Link from 'next/link';

import { HttpError } from '@/lib/api/errors';
import { getSigninPath, getSignupPath } from '@/lib/constants/routes';
import type { SignupFormValues } from '@/lib/validations/authValidation';

import { useAuth } from '@/hooks/auth/useAuth';
import { useSignupForm } from '@/hooks/auth/useSignupForm';

import InputBase from '@/components/ui/Form/InputBase';

interface SignupFormProps {
  role: Role;
}

const ROLE_LABEL: Record<Role, string> = {
  customer: '일반 유저',
  mover: '기사님',
};

export default function SignupForm({ role }: SignupFormProps) {
  const { signup } = useAuth();
  const otherRole: Role = role === 'customer' ? 'mover' : 'customer';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useSignupForm();
  const [submitError, setSubmitError] = useState('');

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
    <div className="mx-auto flex max-w-[400px] flex-col gap-6 p-6">
      <h1 className="text-xl-bold">{ROLE_LABEL[role]} 회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputBase
          label="이름"
          type="text"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
        />
        <InputBase
          label="이메일"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <InputBase
          label="전화번호"
          type="tel"
          autoComplete="tel"
          placeholder="01012345678"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
        <InputBase
          label="비밀번호"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <InputBase
          label="비밀번호 확인"
          type="password"
          autoComplete="new-password"
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
        {submitError && (
          <p className="text-xs-medium text-red-500">{submitError}</p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[8px] bg-black px-4 py-2 text-md-regular text-white disabled:opacity-50"
        >
          {isSubmitting ? '가입 중...' : '회원가입'}
        </button>
      </form>
      <p className="text-md-regular text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href={getSigninPath(role)} className="underline">
          로그인
        </Link>
      </p>
      <p className="text-md-regular text-gray-500">
        {role === 'customer' ? '기사님이신가요?' : '일반 유저이신가요?'}{' '}
        <Link href={getSignupPath(otherRole)} className="underline">
          {ROLE_LABEL[otherRole]} 회원가입
        </Link>
      </p>
    </div>
  );
}
