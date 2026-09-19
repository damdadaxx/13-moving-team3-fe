'use client';

import Script from 'next/script';

import { KAKAO_JAVASCRIPT_KEY, KAKAO_SDK_SRC } from '@/lib/constants/kakao';

/*
@ 카카오 SDK 로드·초기화
- 공유 버튼 클릭 시 팝업이 막히지 않도록 페이지 진입 시 미리 로드한다
- integrity + crossOrigin 은 카카오 CDN CORS 때문에 스크립트 실행이 막혀 빼둔다
- JavaScript 키가 없으면 스크립트를 넣지 않는다
*/
export default function KakaoScript() {
  if (!KAKAO_JAVASCRIPT_KEY) return null;

  return (
    <Script
      src={KAKAO_SDK_SRC}
      strategy="afterInteractive"
      onReady={() => {
        if (!window.Kakao || window.Kakao.isInitialized()) return;
        window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
      }}
    />
  );
}
