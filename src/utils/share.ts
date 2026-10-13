import { routing } from '@/i18n/routing';
import { hasLocale } from 'next-intl';

import {
  KAKAO_JAVASCRIPT_KEY,
  KAKAO_SDK_SRC,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  getOgImagePath,
} from '@/lib/constants/kakao';
import { splitLocalePrefix } from '@/lib/constants/routes';

const FACEBOOK_SHARE_WINDOW_FEATURES = 'width=800,height=600';

/* 문구는 화면(현재 언어)에서 번역해 넘긴다 */
interface KakaoFeedShareOptions {
  title: string;
  description: string;
  buttonTitle: string;
  imageUrl?: string;
}

function getCurrentPageUrl() {
  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}`;
}

export function isLocalShareUrl(url = getCurrentPageUrl()) {
  try {
    const { hostname } = new URL(url);
    return (
      hostname === 'localhost' ||
      hostname === '172.30.1.15' ||
      hostname.endsWith('.local')
    );
  } catch {
    return true;
  }
}

function getShareImageUrl() {
  const { locale } = splitLocalePrefix(window.location.pathname);
  const currentLocale =
    locale && hasLocale(routing.locales, locale)
      ? locale
      : routing.defaultLocale;

  return new URL(getOgImagePath(currentLocale), window.location.origin).href;
}

function copyWithTextarea(text: string) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();

  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error('링크 복사에 실패했습니다.');
  }
}

/*
@ 페이지 링크 공유
- clip: 현재 페이지 URL을 클립보드에 복사한다
- kakao: 카카오 JavaScript SDK로 카카오톡 피드 공유를 연다
- facebook: 페이스북 공유 창을 연다
*/
export async function copyPageUrl() {
  const url = getCurrentPageUrl();

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      return;
    } catch {
      copyWithTextarea(url);
      return;
    }
  }

  copyWithTextarea(url);
}

// 카카오 SDK 스크립트 로드 중복 방지용 싱글톤 프로미스 (clientFetch의 requestRefresh와 동일 패턴)
let kakaoSdkPromise: Promise<void> | null = null;

/*
@ 카카오 SDK 지연 로드
- 예전엔 레이아웃에서 모든 페이지 로드 시 바로 스크립트를 받았다 (약 27KB, 공유 버튼
  안 누르는 페이지에서도 낭비). 이제 카카오 공유 버튼을 처음 누를 때만 불러온다
- 로그인/회원가입은 이 SDK를 쓰지 않는다 — 소셜 로그인은 백엔드 OAuth 리다이렉트
  (getSocialLoginUrl, lib/api/auth.ts)라 이 SDK와 무관하다. 기사님 상세 페이지의
  "카카오톡 공유" 버튼(ShareMoverInfo)만 이 SDK를 쓴다
*/
function loadKakaoSdk(): Promise<void> {
  if (window.Kakao) return Promise.resolve();

  if (!kakaoSdkPromise) {
    kakaoSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = KAKAO_SDK_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        kakaoSdkPromise = null;
        reject(new Error('카카오 SDK를 불러오지 못했습니다.'));
      };
      document.head.appendChild(script);
    });
  }

  return kakaoSdkPromise;
}

/*
@ 카카오톡 공유
- 공식 샘플의 Kakao.Share.createDefaultButton 과 같은 피드 페이로드다
- 공유 버튼이 페이지에 두 번 렌더되므로 container id 바인딩 대신 sendDefault 를 쓴다
- 클릭 시점에 SDK를 불러오고(이미 있으면 바로 통과), init 이후에만 Kakao.Share가 생기므로
  매번 isInitialized를 확인해 한 번 더 init 한다
*/
export async function shareToKakao(options: KakaoFeedShareOptions) {
  if (!KAKAO_JAVASCRIPT_KEY) {
    throw new Error('카카오 공유를 실행할 수 없습니다.');
  }

  await loadKakaoSdk();

  const Kakao = window.Kakao;
  if (!Kakao) {
    throw new Error('카카오 공유를 실행할 수 없습니다.');
  }

  if (!Kakao.isInitialized()) {
    Kakao.init(KAKAO_JAVASCRIPT_KEY);
  }

  const url = getCurrentPageUrl();
  const link = {
    mobileWebUrl: url,
    webUrl: url,
  };

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: options.title,
      description: options.description,
      imageUrl: options.imageUrl ?? getShareImageUrl(),
      imageWidth: OG_IMAGE_WIDTH,
      imageHeight: OG_IMAGE_HEIGHT,
      link,
    },
    buttons: [
      {
        title: options.buttonTitle,
        link,
      },
    ],
  });
}

/*
@ 페이스북 공유
- sharer.php 는 페이스북 서버가 u 주소를 방문해 og 태그를 읽는다
- localhost / 사설망은 페이스북이 접근하지 못해 미리보기가 비어 있다
- quote 는 미리보기 실패 시 본문에 넣을 보조 문구다
*/
/** quote: 화면에서 번역해 넘기는 보조 문구 */
export function shareToFacebook(quote: string) {
  const sendUrl = getCurrentPageUrl();
  const shareUrl = new URL('https://www.facebook.com/sharer/sharer.php');
  shareUrl.searchParams.set('u', sendUrl);
  shareUrl.searchParams.set('quote', quote);

  const popup = window.open(
    shareUrl.toString(),
    'facebook-share-dialog',
    FACEBOOK_SHARE_WINDOW_FEATURES,
  );
  if (popup) popup.opener = null;
}
