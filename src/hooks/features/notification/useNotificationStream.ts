'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ENDPOINTS } from '@/lib/api/endpoints';
import { readNotificationStream } from '@/lib/api/notificationStream';
import { readJsonBody } from '@/lib/api/parseApi';
import { captureSupabaseAccessTokenFromBody } from '@/lib/supabase/accessToken';

import { notificationKeys } from '@/hooks/features/notification/queries/keys';

const RETRY_START_MS = 1_000;
const RETRY_MAX_MS = 30_000;

/** 재시도 대기
 * - 기다리는 중 abort 되면 즉시 종료
 * - 로그아웃 뒤에 남은 대기 시간만큼 연결이 남아있지 않음
 */
function sleep(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        resolve();
      },
      { once: true },
    );
  });
}

/*
@ 알림 SSE
- 로그인 중에만 /api/notifications/stream 을 연다
- unread-count 는 뱃지 캐시를 바로 바꾸고, notification 은 목록을 다시 받게 한다
- 연결이 끊기면 잠시 뒤 다시 연다. 401이면 refresh 한 번 후 재시도한다
*/
export default function useNotificationStream(enabled: boolean) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const abort = new AbortController();
    let stopped = false;

    const loop = async () => {
      let delay = RETRY_START_MS;
      let refreshed = false;

      while (!stopped) {
        try {
          // 알림 스트림 연결 (/api/notifications/stream)
          const outcome = await readNotificationStream(
            abort.signal,
            (event) => {
              if (event.event === 'unread-count') {
                // 알림 뱃지 캐시 업데이트
                queryClient.setQueryData(notificationKeys.unreadCount(), {
                  unreadCount: event.unreadCount,
                });
                return;
              }

              // 알림 목록 다시 받기
              // 드롭다운 열려 있으면 구독 중인 쿼리를 갱신, 닫혀있으면 다시 열 때 받음
              void queryClient.invalidateQueries({
                queryKey: notificationKeys.list(),
              });
            },
          );

          if (stopped || abort.signal.aborted) return;

          if (outcome === 'unauthorized') {
            if (refreshed) return;
            refreshed = true;

            // 토큰 갱신 (/api/auth/refresh)
            const refreshResponse = await fetch(ENDPOINTS.auth.refresh, {
              method: 'POST',
              credentials: 'same-origin',
              signal: abort.signal,
            });

            if (!refreshResponse.ok) return;
            captureSupabaseAccessTokenFromBody(
              await readJsonBody(refreshResponse),
            );
            continue;
          }

          refreshed = false;
          delay = RETRY_START_MS;
        } catch (error) {
          if (stopped || abort.signal.aborted) return;
          if (error instanceof Error && error.name === 'AbortError') return;
          console.error('알림 스트림 연결 실패', error);
        }

        await sleep(delay, abort.signal);
        delay = Math.min(delay * 2, RETRY_MAX_MS);
      }
    };

    void loop();

    return () => {
      stopped = true;
      abort.abort();
    };
  }, [enabled, queryClient]);
}
