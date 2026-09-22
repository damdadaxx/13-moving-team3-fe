'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { HttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { authKeys } from '@/hooks/queries/auth/keys';
import { useCustomerProfileQuery } from '@/hooks/queries/customerProfile/queries';

import Button from '@/components/ui/Button/Button';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

interface CustomerProfileGuardProps {
  children: React.ReactNode;
}

/*=================================================
고객 프로필 등록 여부 가드
=================================================*/

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

/*
@ 가드의 책임
- 이 컴포넌트는 공용 AuthGuard 안쪽에서 렌더링되므로 로그인한 CUSTOMER만 검사한다.
- 프로필이 없는 고객은 최초 등록 페이지로 이동시킨다.
- 프로필이 이미 있는 고객이 등록 URL로 직접 접근하면 견적 요청 화면으로 이동시킨다.
- 사용할 수 있는 캐시가 없는 조회 오류에서만 재시도 화면을 보여준다.
- 인증이 만료된 401 오류는 고객 로그인 페이지로 이동시킨다.

@ 보안 범위
- 이 가드는 사용자가 올바른 화면으로 이동하도록 돕는 프론트엔드 흐름 제어다.
- 실제 권한 검사는 백엔드의 authenticate/requireCustomer가 계속 담당한다.
*/
export default function CustomerProfileGuard({
  children,
}: CustomerProfileGuardProps) {
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
  } = useCustomerProfileQuery();

  const isProfileNewPage = pathname === ROUTES.customerProfileNew;
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
  @ 프로필 미등록 고객
  - 등록 페이지에서는 children을 보여준다.
  - 견적 요청·프로필 수정 등 다른 고객 페이지에서는 등록 페이지로 이동시킨다.
  */
  const shouldMoveToProfileNew = profile === null && !isProfileNewPage;

  /*
  @ 프로필 등록 완료 고객
  - 등록 페이지에 직접 접근했을 때 중복 등록을 막고 견적 요청 화면으로 이동시킨다.
  */
  const shouldMoveToCustomerHome =
    profile !== null && profile !== undefined && isProfileNewPage;

  useEffect(() => {
    /*
    @ 인증 만료 처리
    - 프로필 요청에서 401이 확인되면 Auth Query 캐시를 비로그인 상태로 변경한다.
    - 캐시를 그대로 두고 로그인 페이지만 이동하면 AuthGuard가 다시 고객 페이지로 보내는
      리다이렉트 반복이 생길 수 있으므로 먼저 로그인 상태를 해제한다.
    - 로그인 완료 후 현재 페이지로 돌아올 수 있도록 callbackUrl을 함께 전달한다.
    */
    if (hasUnauthorizedError) {
      queryClient.setQueryData(authKeys.me(), null);

      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`${ROUTES.customerSignin}?callbackUrl=${callbackUrl}`);
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
      router.replace(ROUTES.customerProfileNew);
      return;
    }

    if (shouldMoveToCustomerHome) {
      router.replace(ROUTES.customerHome);
    }
  }, [
    hasUnauthorizedError,
    isPending,
    pathname,
    queryClient,
    router,
    shouldMoveToCustomerHome,
    shouldMoveToProfileNew,
    shouldShowProfileError,
  ]);

  /*
  @ 조회·인증 처리·경로 이동 중 화면
  - 이동 대상 페이지의 children이 잠깐 보이는 깜빡임을 막기 위해 공용 로딩 UI를 유지한다.
  - 인증 만료 상태에서도 보호된 고객 화면을 잠시 보여주지 않는다.
  */
  if (
    hasUnauthorizedError ||
    isPending ||
    shouldMoveToProfileNew ||
    shouldMoveToCustomerHome
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
