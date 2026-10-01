import type { NextRequest } from 'next/server';

/** API 프록시 엔드포인트 */
const API_BASE_URL = process.env.API_BASE_URL;
/** 백엔드와 공유하는 시크릿 (서버 전용, NEXT_PUBLIC_ 아님) */
const PROXY_SECRET = process.env.PROXY_SECRET;

/*
@ 사용자 실제 IP
- 공용 프록시(app/api/[...path]/route.ts)와 같은 규칙이다
- 백엔드는 X-Proxy-Secret 이 일치할 때만 X-Client-IP 를 믿는다
*/
function getClientIp(request: NextRequest): string | undefined {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',').at(-1)?.trim() || undefined;
}

/*
@ GET /api/notifications/stream
- 알림 SSE 전용 프록시. 공용 [...path] 는 응답을 arrayBuffer()로 끝까지 읽으므로 여기로 분리한다
- Next 는 이 정적 경로를 catch-all 보다 먼저 탄다
- 본문은 모으지 않고 백엔드 스트림을 그대로 넘긴다
- 브라우저가 끊으면 백엔드 연결도 닫는다
*/
export async function GET(request: NextRequest) {
  const targetUrl = new URL(`${API_BASE_URL}/notifications/stream`);
  const clientIp = getClientIp(request);

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
        cookie: request.headers.get('cookie') ?? '',
        ...(clientIp && { 'X-Client-IP': clientIp }),
        ...(PROXY_SECRET && { 'X-Proxy-Secret': PROXY_SECRET }),
      },
      cache: 'no-store',
      signal: request.signal,
    });

    if (!response.ok || !response.body) {
      return new Response(await response.arrayBuffer(), {
        status: response.status,
        headers: {
          'Content-Type':
            response.headers.get('Content-Type') ?? 'application/json',
        },
      });
    }

    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    if (
      request.signal.aborted ||
      (error instanceof Error && error.name === 'AbortError')
    ) {
      return new Response(null, { status: 204 });
    }

    return Response.json(
      {
        success: false,
        error: {
          code: 'BACKEND_UNREACHABLE',
          message: '백엔드 서버에 연결할 수 없습니다.',
        },
      },
      { status: 502 },
    );
  }
}
