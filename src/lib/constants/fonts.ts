// 전역 폰트 정의
import localFont from 'next/font/local';

/*
@ Pretendard (전역 기본 폰트)
- next/font/local로 self-host → preload와 CLS 보정용 폴백을 Next가 자동 생성
- weight '45 920'은 Pretendard Variable이 지원하는 가변 weight 전 구간
- CSS 변수명을 --font-pretendard-local로 둔 이유:
  globals.css의 @theme 토큰(--font-pretendard)과 이름이 겹치면
  둘 다 <html>에 선언되어 서로 덮어쓰고 폰트가 조용히 깨짐
- layout.tsx와 global-error.tsx가 이 인스턴스를 공유해야
  @font-face가 중복 생성되지 않음
*/
export const pretendard = localFont({
  src: '../../assets/fonts/PretendardVariable.woff2',
  weight: '45 920',
  style: 'normal',
  display: 'swap',
  variable: '--font-pretendard-local',
});
