import type { Role } from '@/types/role';

/*
@ 백엔드 Role / AuthProvider
- API는 CUSTOMER | MOVER, LOCAL | GOOGLE | KAKAO | NAVER 를 쓴다
- 프론트 Role('customer' | 'mover')과 혼동하지 않도록 API 경계에서만 사용
*/
export type BackendRole = 'CUSTOMER' | 'MOVER';
export type AuthProviderName = 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
export type SocialProvider = 'google' | 'kakao' | 'naver';

/*
@ 로그인 사용자 (GET /auth/me, login/signup/refresh 응답 data)
- 비밀번호·refreshToken은 백엔드 PublicUser에서 제외되어 내려온다
- createdAt / updatedAt 은 JSON 직렬화된 ISO 문자열
*/
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: Role;
  provider: AuthProviderName;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
  role: Role;
}

export interface SignupInput {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  role: Role;
}

export interface SocialLoginInput {
  code: string;
  redirectUri: string;
  state?: string;
  role: Role;
}
