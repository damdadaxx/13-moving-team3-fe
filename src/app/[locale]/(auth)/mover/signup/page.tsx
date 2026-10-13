// [메뉴] 회원가입
// [페이지] 기사님 회원가입
import { pageMetadata } from '@/lib/constants/site';

import SignupForm from '@/components/features/auth/SignupForm';

export const generateMetadata = pageMetadata('moverSignup', '/mover/signup');

export default function MoverSignupPage() {
  return <SignupForm role="mover" />;
}
