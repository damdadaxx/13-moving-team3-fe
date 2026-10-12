// [메뉴] 로그인
// [페이지] 일반 유저 로그인
import { pageMetadata } from '@/lib/constants/site';

import SigninForm from '@/components/features/auth/SigninForm';

export const generateMetadata = pageMetadata(
  'customerSignin',
  '/customer/signin',
);

export default function CustomerSigninPage() {
  return <SigninForm role="customer" />;
}
