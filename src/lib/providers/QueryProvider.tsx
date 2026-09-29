'use client';

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { HttpError } from '@/lib/api/errors';

// TanStack Query meta에 name 필드를 추가해 에러 로그에 활용
declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: {
      name?: string;
    };
  }
}

function makeQueryClient(): QueryClient {
  const queryCache = new QueryCache({
    onError: (error, query) => {
      // 공유 HttpError 클래스로 타입 보장
      if (!(error instanceof HttpError)) return;

      // 404는 notFound()로 페이지 단에서 처리하므로 콘솔 에러 생략
      if (error.status === 404) return;

      console.error(
        `오류 발생: ${query.meta?.name ?? '알 수 없는 쿼리'} - ${error.message}`,
      );
    },
  });

  return new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        staleTime: 10 * 1000,
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // 서버에서는 항상 새로운 QueryClient 생성 (요청 간 상태 오염 방지)
    return makeQueryClient();
  }

  // 브라우저에서는 싱글톤으로 유지
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
