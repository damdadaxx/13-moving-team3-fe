'use client';

import { useEffect } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { ROUTES } from '@/lib/constants/routes';

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
@ 가드의 책임
- 이 컴포넌트는 공용 AuthGuard 안쪽에서 렌더링되므로 로그인한 CUSTOMER만 검사한다.
- 프로필이 없는 고객은 최초 등록 페이지로 이동시킨다.
- 프로필이 이미 있는 고객이 등록 URL로 직접 접근하면 견적 요청 화면으로 이동시킨다.
- 서버 장애를 프로필 미등록으로 오해하지 않도록 404가 아닌 오류는 재시도 화면으로 보여준다.

@ 보안 범위
- 이 가드는 사용자가 올바른 화면으로 이동하도록 돕는 프론트엔드 흐름 제어다.
- 실제 권한 검사는 백엔드의 authenticate/requireCustomer가 계속 담당한다.
*/
export default function CustomerProfileGuard({
  children,
}: CustomerProfileGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    data: profile,
    error,
    isError,
    isFetching,
    isPending,
    refetch,
  } = useCustomerProfileQuery();

  const isProfileNewPage = pathname === ROUTES.customerProfileNew;

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
    if (isPending || isError) return;

    if (shouldMoveToProfileNew) {
      router.replace(ROUTES.customerProfileNew);
      return;
    }

    if (shouldMoveToCustomerHome) {
      router.replace(ROUTES.customerHome);
    }
  }, [
    isError,
    isPending,
    router,
    shouldMoveToCustomerHome,
    shouldMoveToProfileNew,
  ]);

  /*
  @ 조회 및 경로 이동 중 화면
  - 이동 대상 페이지의 children이 잠깐 보이는 깜빡임을 막기 위해 공용 로딩 UI를 유지한다.
  */
  if (isPending || shouldMoveToProfileNew || shouldMoveToCustomerHome) {
    return <LoadingDisplay />;
  }

  /*
  @ 프로필 확인 실패
  - 네트워크/서버 오류일 때 등록 페이지로 강제 이동하지 않는다.
  - 사용자가 현재 화면에서 안전하게 다시 조회할 수 있도록 재시도 버튼을 제공한다.
  */
  if (isError) {
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
