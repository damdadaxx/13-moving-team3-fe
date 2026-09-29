export {};

/*
@ 카카오 JavaScript SDK (v2)
- layout에서 스크립트를 로드한 뒤 window.Kakao 로 접근한다
- 공유는 Kakao.Share.sendDefault / createDefaultButton 을 사용한다
*/
declare global {
  interface KakaoShareLink {
    mobileWebUrl: string;
    webUrl: string;
  }

  interface KakaoShareDefaultSettings {
    objectType: 'feed';
    content: {
      title: string;
      description: string;
      imageUrl: string;
      imageWidth?: number;
      imageHeight?: number;
      link: KakaoShareLink;
    };
    buttons?: Array<{
      title: string;
      link: KakaoShareLink;
    }>;
  }

  interface KakaoSDK {
    init: (appKey: string) => void;
    isInitialized: () => boolean;
    Share: {
      sendDefault: (settings: KakaoShareDefaultSettings) => void;
      createDefaultButton: (
        settings: KakaoShareDefaultSettings & {
          container: string | HTMLElement;
        },
      ) => void;
    };
  }

  interface Window {
    Kakao?: KakaoSDK;
  }
}
