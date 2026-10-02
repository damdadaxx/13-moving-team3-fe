'use client';

import { useState } from 'react';

import type { Role } from '@/types/role';
import { useTranslations } from 'next-intl';

import { HttpError } from '@/lib/api/errors';
import { getSignupPath } from '@/lib/constants/routes';
import type { LoginFormValues } from '@/lib/validations/authValidation';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useAuth } from '@/hooks/features/auth/useAuth';
import { useLoginForm } from '@/hooks/features/auth/useLoginForm';

import { cn } from '@/utils/cn';

import AuthLinkText from '@/components/features/auth/AuthLinkText';
import AuthPageLayout from '@/components/features/auth/AuthPageLayout';
import AuthSubmitButton from '@/components/features/auth/AuthSubmitButton';
import Input from '@/components/ui/Form/Input';

interface SigninFormProps {
  role: Role;
}

export default function SigninForm({ role }: SigninFormProps) {
  const t = useTranslations('Auth');
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useLoginForm();
  const [submitError, setSubmitError] = useState('');
  // 에러일 때만 커진다 (Figma: 모바일은 54px 유지, 태블릿부터 64px)
  const errorSize = useBreakpointValue('sm', 'md', 'md');

  async function onSubmit(data: LoginFormValues) {
    setSubmitError('');

    try {
      await login({ ...data, role });
    } catch (error) {
      setSubmitError(
        error instanceof HttpError ? error.message : t('loginFailed'),
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
            <Input
              label={t('email')}
              type="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              size={errors.email ? errorSize : 'sm'}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label={t('password')}
              type="password"
              autoComplete="current-password"
              placeholder={t('passwordPlaceholder')}
              size={errors.password ? errorSize : 'sm'}
              error={errors.password?.message}
              {...register('password')}
            />
          </div>
          <AuthSubmitButton
            disabled={!isValid}
            isLoading={isSubmitting}
            error={submitError}
          >
            {t('login')}
          </AuthSubmitButton>
        </div>
        <AuthLinkText
          text={t('noAccount')}
          linkLabel={t('goSignup')}
          href={getSignupPath(role)}
        />
      </form>
    </AuthPageLayout>
  );
}
