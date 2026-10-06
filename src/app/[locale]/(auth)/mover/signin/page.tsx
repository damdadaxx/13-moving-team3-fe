// [메뉴] 로그인
// [페이지] 기사님 로그인
import { pageMetadata } from '@/lib/constants/site';

import SigninForm from '@/components/features/auth/SigninForm';

export const generateMetadata = pageMetadata('moverSignin', '/mover/signin');

export default function MoverSigninPage() {
  return <SigninForm role="mover" />;
}
