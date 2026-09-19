import {
  KAKAO_JAVASCRIPT_KEY,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
} from '@/lib/constants/kakao';

const FACEBOOK_SHARE_WINDOW_FEATURES = 'width=800,height=600';

interface KakaoFeedShareOptions {
  title?: string;
  description?: string;
  imageUrl?: string;
}

function getCurrentPageUrl() {
  return window.location.href;
}

function getShareImageUrl() {
  return new URL(OG_IMAGE_PATH, window.location.origin).href;
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

/*
@ 카카오톡 공유
- 공식 샘플의 Kakao.Share.createDefaultButton 과 같은 피드 페이로드다
- 공유 버튼이 페이지에 두 번 렌더되므로 container id 바인딩 대신 sendDefault 를 쓴다
- Kakao.Share 는 init 이후에만 생기므로, 클릭 핸들러에서 한 번 더 init 한다
*/
export function shareToKakao(options: KakaoFeedShareOptions = {}) {
  const Kakao = window.Kakao;
  if (!Kakao || !KAKAO_JAVASCRIPT_KEY) {
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
      title: options.title ?? '김코드 기사님',
      description:
        options.description ?? '고객님의 물품을 안전하게 운송해 드립니다.',
      imageUrl: options.imageUrl ?? getShareImageUrl(),
      imageWidth: OG_IMAGE_WIDTH,
      imageHeight: OG_IMAGE_HEIGHT,
      link,
    },
    buttons: [
      {
        title: '웹으로 보기',
        link,
      },
    ],
  });
}

/*
@ 페이스북 공유
- 현재 페이지 URL을 sharer.php 로 넘긴다 (로컬 주소도 가능)
- 팝업 이름·크기는 페이스북 공유 다이얼로그 샘플과 같다
*/
export function shareToFacebook() {
  const sendUrl = getCurrentPageUrl();
  const popup = window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sendUrl)}`,
    'facebook-share-dialog',
    FACEBOOK_SHARE_WINDOW_FEATURES,
  );
  if (popup) popup.opener = null;
}
