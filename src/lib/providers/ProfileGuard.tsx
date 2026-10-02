'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useQueryClient, type UseQueryResult } from '@tanstack/react-query';

import { HttpError } from '@/lib/api/errors';

import { authKeys } from '@/hooks/features/auth/queries/keys';

import Button from '@/components/ui/Button/Button';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

/*=================================================
프로필 등록 여부 가드 (역할 공통)
=================================================*/

/*
@ 가드의 책임
- 공용 AuthGuard 안쪽에서 렌더링되므로 해당 역할로 로그인한 사용자만 검사한다.
- 프로필이 없는 사용자는 최초 등록 페이지로 이동시킨다.
  (기획: 로그인하면 프로필을 등록하게 한다 — 가입 직후든 나중에 다시 로그인하든 동일)
- 프로필이 이미 있는 사용자가 등록 URL로 직접 접근하면 역할 home으로 이동시킨다.
- 등록 페이지 자신은 이동 대상에서 제외한다. 그러지 않으면 등록 페이지 → 등록 페이지로
  리다이렉트가 반복된다.
- 사용할 수 있는 캐시가 없는 조회 오류에서만 재시도 화면을 보여준다.
- 인증이 만료된 401 오류는 역할별 로그인 페이지로 이동시킨다.

@ 보안 범위
- 이 가드는 사용자가 올바른 화면으로 이동하도록 돕는 프론트엔드 흐름 제어다.
- 실제 권한 검사는 백엔드의 authenticate/requireCustomer·requireMover가 계속 담당한다.

@ 역할별 사용
- 고객: components/customer/CustomerProfileGuard
- 기사님: components/mover/MoverProfileGuard
  (프로필 조회 훅만 다르고 흐름은 같아서 이 컴포넌트로 모았다)
*/
interface ProfileGuardProps<TProfile> {
  /** 프로필 조회 결과. 미등록이면 data가 null (API에서 404를 null로 변환) */
  query: UseQueryResult<TProfile | null, Error>;
  /** 프로필 최초 등록 경로 */
  profileNewPath: string;
  /** 프로필이 있는 사용자가 등록 페이지로 들어왔을 때 보낼 경로 */
  homePath: string;
  /** 인증 만료 시 보낼 로그인 경로 */
  signinPath: string;
  children: React.ReactNode;
}

/*
@ 인증 만료 오류 확인
- 프로필 API가 401을 반환하면 clientFetch가 토큰 갱신을 한 번 시도한다.
- 토큰 갱신 후에도 인증할 수 없으면 로그인 정보가 만료된 상태로 판단한다.
- status와 code를 함께 확인해 백엔드 또는 clientFetch에서 전달된 인증 오류를 모두 처리한다.
*/
function isUnauthorizedProfileError(error: unknown): boolean {
  if (!(error instanceof HttpError)) return false;

  return (
    error.status === 401 ||
    error.code === 'UNAUTHORIZED' ||
    error.code === 'TOKEN_EXPIRED' ||
    error.code === 'REFRESH_FAILED'
  );
}

export default function ProfileGuard<TProfile>({
  query,
  profileNewPath,
  homePath,
  signinPath,
  children,
}: ProfileGuardProps<TProfile>) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: profile,
    error,
    isError,
    isFetching,
    isPending,
    refetch,
  } = query;

  const isProfileNewPage = pathname === profileNewPath;
  const hasUnauthorizedError = isUnauthorizedProfileError(error);

  /*
  @ 프로필 상태 구분
  - undefined: 아직 프로필 정보를 한 번도 정상적으로 가져오지 못한 상태
  - null: 서버가 404를 반환해 프로필 미등록으로 확인된 상태
  - 객체: 등록된 프로필 정보를 사용할 수 있는 상태
  - 캐시된 null 또는 객체가 있으면 백그라운드 재조회가 실패해도 기존 정보를 계속 사용한다.
  */
  const shouldShowProfileError =
    isError && profile === undefined && !hasUnauthorizedError;

  /*
  @ 프로필 미등록 사용자
  - 등록 페이지에서는 children을 보여준다 (여기서 등록해야 하므로).
  - 그 외 페이지에서는 등록 페이지로 이동시킨다.
  */
  const shouldMoveToProfileNew = profile === null && !isProfileNewPage;

  /*
  @ 프로필 등록 완료 사용자
  - 등록 페이지에 직접 접근했을 때 중복 등록을 막고 역할 home으로 이동시킨다.
  */
  const shouldMoveToHome =
    profile !== null && profile !== undefined && isProfileNewPage;

  useEffect(() => {
    /*
    @ 인증 만료 처리
    - 프로필 요청에서 401이 확인되면 Auth Query 캐시를 비로그인 상태로 변경한다.
    - 캐시를 그대로 두고 로그인 페이지만 이동하면 AuthGuard가 다시 보호 페이지로 보내는
      리다이렉트 반복이 생길 수 있으므로 먼저 로그인 상태를 해제한다.
    - 로그인 완료 후 현재 페이지로 돌아올 수 있도록 callbackUrl을 함께 전달한다.
    */
    if (hasUnauthorizedError) {
      queryClient.setQueryData(authKeys.me(), null);

      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`${signinPath}?callbackUrl=${callbackUrl}`);
      return;
    }

    /*
    @ 아직 판단할 수 없는 상태
    - 최초 조회 중이거나 사용할 캐시 없이 조회가 실패했으면 경로를 이동하지 않는다.
    - 캐시된 프로필이 있는 백그라운드 재조회 오류는 여기서 중단하지 않고
      기존 캐시를 기준으로 정상적인 경로 판단을 계속한다.
    */
    if (isPending || shouldShowProfileError) return;

    if (shouldMoveToProfileNew) {
      router.replace(profileNewPath);
      return;
    }

    if (shouldMoveToHome) {
      router.replace(homePath);
    }
  }, [
    hasUnauthorizedError,
    homePath,
    isPending,
    pathname,
    profileNewPath,
    queryClient,
    router,
    shouldMoveToHome,
    shouldMoveToProfileNew,
    shouldShowProfileError,
    signinPath,
  ]);

  /*
  @ 조회·인증 처리·경로 이동 중 화면
  - 이동 대상 페이지의 children이 잠깐 보이는 깜빡임을 막기 위해 공용 로딩 UI를 유지한다.
  - 인증 만료 상태에서도 보호된 화면을 잠시 보여주지 않는다.
  */
  if (
    hasUnauthorizedError ||
    isPending ||
    shouldMoveToProfileNew ||
    shouldMoveToHome
  ) {
    return <LoadingDisplay />;
  }

  /*
  @ 사용할 수 있는 프로필 정보가 없는 조회 실패
  - profile이 undefined인 최초 조회 실패에서만 재시도 화면을 보여준다.
  - 캐시된 profile 또는 null이 있다면 백그라운드 재조회가 실패해도 기존 화면을 유지한다.
  */
  if (shouldShowProfileError) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : '프로필 정보를 확인하지 못했습니다. 다시 시도해주세요.';

    return (
      <main className="flex min-h-[350px] w-full items-center justify-center px-[24px]">
        <div
          role="alert"
          className="flex w-full max-w-[375px] flex-col items-center gap-[20px] text-center"
        >
          <p className="text-lg-medium text-black-300">{errorMessage}</p>

          <Button
            type="button"
            size="sm"
            isLoading={isFetching}
            onClick={() => {
              void refetch();
            }}
            className="w-full"
          >
            다시 시도
          </Button>
        </div>
      </main>
    );
  }

  return children;
}
