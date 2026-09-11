'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  loginSchema,
  type LoginFormValues,
} from '@/lib/validations/authValidation';

// 로그인 폼 훅
// 스키마는 lib/validations, 폼 상태는 이 훅, UI는 페이지/컴포넌트
export function useLoginForm() {
  return useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });
}
