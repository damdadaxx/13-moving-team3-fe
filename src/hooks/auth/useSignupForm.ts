'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import {
  signupSchema,
  type SignupFormValues,
} from '@/lib/validations/authValidation';

// 회원가입 폼 훅
// 스키마는 lib/validations, 폼 상태는 이 훅, UI는 페이지/컴포넌트
export function useSignupForm() {
  return useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onBlur',
  });
}
