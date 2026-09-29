'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { isUnauthorizedHttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { authKeys } from '@/hooks/queries/auth/keys';
import { useMoverProfileQuery } from '@/hooks/queries/moverProfile/queries';

import Button from '@/components/ui/Button/Button';
import LoadingDisplay from '@/components/ui/LoadingDisplay';

interface MoverProfileGuardProps {
  children: React.ReactNode;
}

/*=================================================
기사님 프로필 등록 여부 가드
=================================================*/

export default function MoverProfileGuard({
  children,
}: MoverProfileGuardProps) {
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
  } = useMoverProfileQuery();

  const isProfileNewPage = pathname === ROUTES.moverProfileNew;
  const hasUnauthorizedError = isUnauthorizedHttpError(error);
  const shouldShowProfileError =
    isError && profile === undefined && !hasUnauthorizedError;
  const shouldMoveToProfileNew = profile === null && !isProfileNewPage;
  const shouldMoveToMoverHome =
    profile !== null && profile !== undefined && isProfileNewPage;

  useEffect(() => {
    /*
    @ 인증 만료
    - Auth 캐시를 먼저 비로그인 상태로 바꿔 AuthGuard와 로그인 페이지 사이의 반복 이동을 막는다.
    - 로그인 완료 후 현재 페이지로 돌아오도록 callbackUrl을 전달한다.
    */
    if (hasUnauthorizedError) {
      queryClient.setQueryData(authKeys.me(), null);
      const callbackUrl = encodeURIComponent(pathname);
      router.replace(`${ROUTES.moverSignin}?callbackUrl=${callbackUrl}`);
      return;
    }

    if (isPending || shouldShowProfileError) return;

    if (shouldMoveToProfileNew) {
      router.replace(ROUTES.moverProfileNew);
      return;
    }

    if (shouldMoveToMoverHome) {
      router.replace(ROUTES.moverHome);
    }
  }, [
    hasUnauthorizedError,
    isPending,
    pathname,
    queryClient,
    router,
    shouldMoveToMoverHome,
    shouldMoveToProfileNew,
    shouldShowProfileError,
  ]);

  if (
    hasUnauthorizedError ||
    isPending ||
    shouldMoveToProfileNew ||
    shouldMoveToMoverHome
  ) {
    return <LoadingDisplay />;
  }

  /*
  @ 조회 실패
  - 사용할 수 있는 캐시가 없는 최초 실패에서만 재시도 화면을 보여준다.
  - 캐시된 null 또는 객체가 있으면 백그라운드 재조회 실패에도 기존 화면을 유지한다.
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
