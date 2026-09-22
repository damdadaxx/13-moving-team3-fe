import type { Metadata } from 'next';

import {
  OG_IMAGE_HEIGHT,
  OG_IMAGE_PATH,
  OG_IMAGE_WIDTH,
} from '@/lib/constants/kakao';

/*
@ 사이트 URL / OG 기본값
- 페이스북은 공유한 주소를 서버가 직접 방문해 og 태그를 읽는다
- NEXT_PUBLIC_SITE_URL 이 공개 https 주소여야 미리보기에 이미지가 붙는다
*/

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:5173'
).replace(/\/$/, '');

export const SITE_NAME = '무빙';

export const SITE_TITLE = '무빙 : 이사 소비자와 이사 전문가 매칭 서비스';
export const SITE_DESCRIPTION = '이사 소비자와 이사 전문가 매칭 서비스';
export const OG_TITLE = '무빙 : 복잡한 이사 준비, 무빙 하나면 끝!';

export const OPEN_GRAPH_DEFAULT = {
  title: OG_TITLE,
  description: SITE_DESCRIPTION,
  locale: 'ko_KR',
  type: 'website',
  siteName: SITE_NAME,
  images: [
    {
      url: OG_IMAGE_PATH,
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      type: 'image/png',
    },
  ],
} satisfies Metadata['openGraph'];
