/*
@ 채팅 Socket.IO 클라이언트 (싱글턴)
- BE(Express)에 Socket.IO 서버가 같은 포트로 붙어 있다. Next.js 프록시(app/api/[...path])는
  WebSocket 업그레이드를 못 받으므로, 이 클라이언트는 BE 도메인(NEXT_PUBLIC_SOCKET_URL)에 직접 붙는다
- 인증은 쿠키 기반이다 (auth 콜백 없음). BE가 핸드셰이크 요청의 accessToken 쿠키를 직접 읽어서
  검증하므로, withCredentials로 쿠키를 실어 보내야 한다. FE·BE가 같은 상위 도메인이고
  BE가 COOKIE_DOMAIN을 그 상위 도메인으로 설정해 둬야 쿠키가 실제로 전달된다
  (로컬은 둘 다 host가 'localhost'라 포트 달라도 쿠키가 자동으로 공유된다)
- autoConnect: false — 로그인 상태일 때만 연결한다. 연결 관리는 호출부(useChatRealtimeSync)가 한다
- 재연결은 socket.io-client 기본 동작(지수 백오프)에 맡긴다. 별도로 구현하지 않는다
*/
import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

if (!SOCKET_URL) {
  throw new Error('NEXT_PUBLIC_SOCKET_URL 환경변수가 없습니다.');
}

export const chatSocket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
});
