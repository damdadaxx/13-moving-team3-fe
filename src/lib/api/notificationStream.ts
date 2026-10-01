import type { Notification } from '@/types/notification';

import { ENDPOINTS } from '@/lib/api/endpoints';

export type NotificationStreamEvent =
  | { event: 'unread-count'; unreadCount: number }
  | { event: 'notification'; notification: Notification };

interface SseFrame {
  event: string;
  data: string;
}

/** 객체 타입 확인 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** 프레임 파싱
 * - event: 라인을 파싱하여 이벤트 타입을 추출한다
 * - data: 라인을 모두 모아서 하나의 문자열로 만든다
 */
function parseFrame(raw: string): SseFrame | null {
  let event = 'message';
  const dataLines: string[] = [];

  for (const line of raw.split('\n')) {
    if (line.startsWith(':') || line.length === 0) continue;
    if (line.startsWith('event:')) {
      event = line.slice('event:'.length).trim();
      continue;
    }
    // data: 라인 추가
    if (line.startsWith('data:')) {
      dataLines.push(line.slice('data:'.length).trim());
    }
  }

  if (dataLines.length === 0) return null;
  return { event, data: dataLines.join('\n') };
}

/** 스트림 이벤트 변환
 * - frame.data를 JSON으로 파싱하여 이벤트 페이로드를 추출
 * - 파싱 실패 시 null 반환
 */
function toStreamEvent(frame: SseFrame): NotificationStreamEvent | null {
  let payload: unknown;
  try {
    payload = JSON.parse(frame.data) as unknown;
  } catch {
    return null;
  }

  // unread-count 이벤트 처리
  if (
    frame.event === 'unread-count' &&
    isRecord(payload) &&
    typeof payload.unreadCount === 'number'
  ) {
    return { event: 'unread-count', unreadCount: payload.unreadCount };
  }

  // notification 이벤트 처리
  if (frame.event === 'notification' && isRecord(payload)) {
    return {
      event: 'notification',
      notification: payload as unknown as Notification,
    };
  }

  // 그 외 이벤트 처리 실패
  return null;
}

/*
@ GET /notifications/stream
- clientFetch를 쓰지 않는다. JSON으로 끝나지 않는 응답이라 스트림을 직접 읽는다
- 같은 오리진 /api 라 쿠키는 same-origin으로 충분하다
- 반환값 unauthorized: accessToken 만료. 호출하는 쪽에서 refresh 후 다시 연다
*/
export async function readNotificationStream(
  signal: AbortSignal,
  onEvent: (event: NotificationStreamEvent) => void,
): Promise<'closed' | 'unauthorized'> {
  const response = await fetch(ENDPOINTS.notification.stream, {
    method: 'GET',
    credentials: 'same-origin',
    headers: { Accept: 'text/event-stream' },
    cache: 'no-store',
    signal,
  });

  if (response.status === 401) return 'unauthorized';
  if (!response.ok || !response.body) {
    throw new Error(`알림 스트림 연결에 실패했습니다. (${response.status})`);
  }

  const reader = response.body.getReader(); // 서버에서 들어오는 대로 즉시 데이터를 처리(스트리밍)
  const decoder = new TextDecoder(); // 문자열 디코딩
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read(); // 데이터 읽기
    if (done) return 'closed'; // 스트림 종료

    buffer += decoder.decode(value, { stream: true }); // 문자열 디코딩
    const chunks = buffer.split('\n\n'); // 라인 분리
    buffer = chunks.pop() ?? ''; // 마지막 라인 제거

    for (const chunk of chunks) {
      const frame = parseFrame(chunk); // 프레임 파싱
      if (!frame) continue;
      const event = toStreamEvent(frame); // 스트림 이벤트 변환
      if (event) onEvent(event); // 이벤트 처리
    }
  }
}
