import type { NextRequest } from 'next/server';

/** API 프록시 엔드포인트 */
const API_BASE_URL = process.env.API_BASE_URL;

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

/** 백엔드로 요청을 프록시하는 함수 */
async function proxy(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  const pathname = path.join('/');
  /** 실제 백엔드 URL 생성 */
  const targetUrl = new URL(`${API_BASE_URL}/${pathname}`);
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

  /*
  @ GET /auth/me 401 정규화
  - "나 누구야?"에 대한 게스트의 답은 401(접근 금지)이 아니라 "아무도 아님"이다
  - 모든 페이지에 걸린 AuthProvider가 게스트/public 페이지에서도 이 요청을 보내므로,
    401을 그대로 흘리면 브라우저 콘솔에 매번 에러가 찍힌다
  - 여기(BFF)에서 200 { data: null }로 각색해 프론트가 비로그인 상태로 처리하게 한다
  - 다른 보호 라우트의 401은 그대로 둔다
  */
  if (
    request.method === 'GET' &&
    pathname === 'auth/me' &&
    response.status === 401
  ) {
    return Response.json({ success: true, data: null }, { status: 200 });
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
