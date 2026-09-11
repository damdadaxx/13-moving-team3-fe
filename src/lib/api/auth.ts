// 인증 API 호출 함수
// 브라우저는 프록시(/api)만 사용. 쿠키는 clientFetch credentials: same-origin 으로 전달
import type {
  AuthProviderName,
  AuthUser,
  BackendRole,
  LoginInput,
  SignupInput,
  SocialLoginInput,
  SocialProvider,
} from '@/types/auth';
import type { Role } from '@/types/role';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { HttpError } from '@/lib/api/errors';

interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  role: BackendRole;
  provider: AuthProviderName;
  createdAt: string;
  updatedAt: string;
}

export function toFrontendRole(role: BackendRole): Role {
  return role === 'CUSTOMER' ? 'customer' : 'mover';
}

export function toBackendRole(role: Role): BackendRole {
  return role === 'customer' ? 'CUSTOMER' : 'MOVER';
}

function toAuthUser(user: AuthUserResponse): AuthUser {
  return {
    ...user,
    role: toFrontendRole(user.role),
  };
}

function isUnauthenticatedError(error: unknown): boolean {
  if (!(error instanceof HttpError)) return false;

  return (
    error.status === 401 ||
    error.code === 'UNAUTHORIZED' ||
    error.code === 'TOKEN_EXPIRED' ||
    error.code === 'REFRESH_FAILED'
  );
}

/*
@ GET /auth/me
- 비로그인은 에러가 아니라 null. 게스트 페이지에서 콘솔 에러가 나지 않게 한다
  - 프록시(app/api/[...path]/route.ts)가 게스트의 /auth/me 401을 200 { data: null }로 정규화한다
  - 그 외 경로로 401이 새어 들어와도 isUnauthenticatedError로 흡수한다
- clientFetch가 401이면 refresh를 한 번 시도한 뒤 여기로 온다
*/
export async function getMe(): Promise<AuthUser | null> {
  try {
    const user = await clientFetch<AuthUserResponse | null>(ENDPOINTS.auth.me);
    return user ? toAuthUser(user) : null;
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      return null;
    }
    throw error;
  }
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const user = await clientFetch<AuthUserResponse>(ENDPOINTS.auth.login, {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      role: toBackendRole(input.role),
    }),
  });

  return toAuthUser(user);
}

export async function signup(input: SignupInput): Promise<AuthUser> {
  const user = await clientFetch<AuthUserResponse>(ENDPOINTS.auth.signUp, {
    method: 'POST',
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      name: input.name,
      phoneNumber: input.phoneNumber,
      role: toBackendRole(input.role),
    }),
  });

  return toAuthUser(user);
}

export async function logout(): Promise<void> {
  await clientFetch(ENDPOINTS.auth.logout, {
    method: 'POST',
  });
}

export async function socialLogin(
  provider: SocialProvider,
  input: SocialLoginInput,
): Promise<AuthUser> {
  const user = await clientFetch<AuthUserResponse>(
    ENDPOINTS.auth.social(provider),
    {
      method: 'POST',
      body: JSON.stringify({
        code: input.code,
        redirectUri: input.redirectUri,
        state: input.state,
        role: toBackendRole(input.role),
      }),
    },
  );

  return toAuthUser(user);
}
