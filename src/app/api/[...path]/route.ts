import type { NextRequest } from 'next/server';

/** API 프록시 엔드포인트 */
const API_BASE_URL = process.env.API_BASE_URL;

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

/** 백엔드로 요청을 프록시하는 함수 */
async function proxy(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  /** 실제 백엔드 URL 생성 */
  const targetUrl = new URL(`${API_BASE_URL}/${path.join('/')}`);
  targetUrl.search = request.nextUrl.searchParams.toString();

  /** GET 외 method면 body 전달 */
  const rawBody = request.method === 'GET' ? '' : await request.text();
  const body = rawBody || undefined;

  let response: Response;
  try {
    // 백엔드로 요청 전달
    response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
        cookie: request.headers.get('cookie') ?? '',
      },
      body,
    });
  } catch {
    // 백엔드 연결 실패 시 JSON 에러 응답
    return Response.json(
      {
        success: false,
        message: '백엔드 서버에 연결할 수 없습니다.',
        code: 'BACKEND_UNREACHABLE',
      },
      { status: 502 },
    );
  }

  /** 백엔드 응답 데이터 반환 */
  const data = await response.text();

  /** 프록시 응답 생성 */
  const proxyResponse = new Response(data, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('Content-Type') ?? 'application/json',
    },
  });

  /*
  @ Set-Cookie Path 보정
  - 백엔드는 refreshToken Path=/auth (BE 기준)
  - 브라우저는 프론트 오리진에 쿠키를 저장하므로 /api/auth 요청에 붙이려면 Path=/api/auth 여야 함
  */
  const setCookieHeaders = response.headers.getSetCookie?.() ?? [];
  setCookieHeaders.forEach((cookie) => {
    proxyResponse.headers.append(
      'Set-Cookie',
      cookie.replace(/;\s*Path=\/auth(?=;|$)/i, '; Path=/api/auth'),
    );
  });

  return proxyResponse;
}

// 각 HTTP 메서드 핸들러로 등록
export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
