// [메뉴] 회원가입
// [페이지] 일반 유저 회원가입
import { pageMetadata } from '@/lib/constants/site';

import SignupForm from '@/components/features/auth/SignupForm';

export const generateMetadata = pageMetadata(
  'customerSignup',
  '/customer/signup',
);

export default function CustomerSignupPage() {
  return <SignupForm role="customer" />;
}
