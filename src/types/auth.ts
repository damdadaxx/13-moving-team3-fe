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

/*=================================================
회원정보 수정 요청 타입
=================================================*/

/*
@ 이름·전화번호 수정
- PATCH /auth/me는 두 값 중 실제로 변경된 값만 받을 수 있다.
- 빈 객체 요청은 백엔드 validation에서 거절되므로 호출부에서 변경 여부를 먼저 확인한다.
*/
export interface UpdateMeInput {
  name?: string;
  phoneNumber?: string;
}

/*
@ 비밀번호 수정
- LOCAL 계정만 호출한다.
- 새 비밀번호 확인값은 프론트 검증용이므로 API 요청에는 포함하지 않는다.
*/
export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordResult {
  message: string;
}
