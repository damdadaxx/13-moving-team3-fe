import type { NextRequest } from 'next/server';

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/lib/constants/auth';

/** API 프록시 엔드포인트 */
const API_BASE_URL = process.env.API_BASE_URL;
/** 백엔드와 공유하는 시크릿 (서버 전용, NEXT_PUBLIC_ 아님) */
const PROXY_SECRET = process.env.PROXY_SECRET;

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

/*
@ 사용자 실제 IP
- 백엔드는 이 프록시 서버 IP 만 보므로, 로그인 rate limit 을 사용자별로 걸 수 있게 IP 를 따로 넘긴다
- 백엔드는 X-Proxy-Secret 이 일치할 때만 X-Client-IP 를 믿는다 (BE utils/clientIp.ts)
@ 주의사항
- 어떤 헤더를 믿을지는 호스팅에 따라 다르다
  - Vercel: x-forwarded-for 를 플랫폼이 덮어써서 신뢰 가능
  - nginx 등 자체 호스팅: proxy_set_header X-Forwarded-For $remote_addr 로 덮어쓰도록 설정
- 로컬은 Next 가 소켓 주소(::1)로 채운다
*/
function getClientIp(request: NextRequest): string | undefined {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  // 여러 홉이면 가장 가까운(마지막) 항목이 인프라가 붙인 값이다
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',').at(-1)?.trim() || undefined;
}

/** 백엔드로 요청을 프록시하는 함수 */
async function proxy(request: NextRequest, { params }: RouteContext) {
  const { path } = await params;
  const pathname = path.join('/');
  /** 실제 백엔드 URL 생성 */
  const targetUrl = new URL(`${API_BASE_URL}/${pathname}`);
  targetUrl.search = request.nextUrl.searchParams.toString();

  /*
  @ body / Content-Type 전달
  - JSON: application/json 그대로 전달
  - FormData(이미지 업로드): multipart/form-data; boundary=... 와 바이너리 body 를 그대로 전달
    text()로 읽거나 Content-Type 을 json 으로 덮으면 파일이 깨진다
  */
  const contentType = request.headers.get('content-type');
  const canHaveBody = request.method !== 'GET' && request.method !== 'HEAD';
  const rawBody = canHaveBody ? await request.arrayBuffer() : undefined;
  const body = rawBody && rawBody.byteLength > 0 ? rawBody : undefined;
  const clientIp = getClientIp(request);

  let response: Response;
  try {
    // 백엔드로 요청 전달
    response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        ...(contentType && { 'Content-Type': contentType }),
        cookie: request.headers.get('cookie') ?? '',
        ...(clientIp && { 'X-Client-IP': clientIp }),
        ...(PROXY_SECRET && { 'X-Proxy-Secret': PROXY_SECRET }),
      },
      body,
      // 소셜 로그인 302 를 서버에서 따라가지 않고 브라우저에 그대로 넘긴다
      redirect: 'manual',
    });
  } catch {
    // 백엔드 연결 실패 시 JSON 에러 응답
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

  /*
  @ GET /auth/me 401 정규화 — accessToken·refreshToken 쿠키가 둘 다 없을 때만
  - "나 누구야?"에 대한 게스트(쿠키 없음)의 답은 401(접근 금지)이 아니라 "아무도 아님"이다
  - 모든 페이지에 걸린 AuthProvider가 게스트/public 페이지에서도 이 요청을 보내므로,
    401을 그대로 흘리면 브라우저 콘솔에 매번 에러가 찍힌다 → 여기서 200 { data: null }로 각색
  - 둘 중 하나라도 있으면 401을 그대로 흘려보낸다
    → clientFetch가 401을 보고 refresh를 시도할 수 있어야 하기 때문
  - refreshToken도 봐야 하는 이유: accessToken 쿠키는 maxAge가 토큰 수명(15분)과 같아서
    만료되면 브라우저가 쿠키 자체를 지운다. accessToken만 보면 15분 뒤에는 "게스트"로 판단해
    refresh 없이 로그아웃된다. refreshToken 쿠키(Path=/api/auth)는 이 요청에도 실린다
  - 쿠키명은 백엔드 authConstants.ts의 ACCESS_TOKEN_COOKIE / REFRESH_TOKEN_COOKIE와 동일해야 한다
  - 다른 보호 라우트의 401은 손대지 않는다
  */
  if (
    request.method === 'GET' &&
    pathname === 'auth/me' &&
    response.status === 401 &&
    !request.cookies.get(ACCESS_TOKEN_COOKIE) &&
    !request.cookies.get(REFRESH_TOKEN_COOKIE)
  ) {
    return Response.json({ success: true, data: null }, { status: 200 });
  }

  /*
  @ 프록시 응답 생성
  - 리다이렉트(소셜 로그인 시작·콜백): Location 만 넘겨 브라우저가 이동하게 한다
  - 그 외: 백엔드 응답 body 를 바이너리 그대로 반환
    text()로 읽으면 JSON은 되지만 이미지(JPEG/PNG)가 UTF-8 디코딩으로 깨진다
  */
  const location = response.headers.get('Location');
  const isRedirect =
    response.status >= 300 && response.status < 400 && location !== null;

  const proxyResponse = isRedirect
    ? new Response(null, {
        status: response.status,
        headers: { Location: location },
      })
    : new Response(await response.arrayBuffer(), {
        status: response.status,
        headers: {
          'Content-Type':
            response.headers.get('Content-Type') ?? 'application/json',
        },
      });

  /*
  @ Set-Cookie Path 보정
  - 백엔드는 refreshToken·oauthState(소셜 로그인 state) Path=/auth (BE 기준)
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
