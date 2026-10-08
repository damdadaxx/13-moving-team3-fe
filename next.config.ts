import { withSentryConfig } from '@sentry/nextjs/config';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactCompiler: true,
  /*
  @ 이미지 원격 호스트
  - picsum은 시드 프로필용이다. 허용하지 않으면 next/image가 로드를 막는다
  - TODO: 실제 업로드 CDN/S3 호스트로 바꾸고 picsum 항목은 삭제한다
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.picsum.photos',
        pathname: '/**',
      },
      {
        // 채팅 이미지(Supabase Storage 공개 URL), 상대방 프로필 이미지 표시용
        protocol: 'https',
        hostname: 'riphxsdecygfvtadyixk.supabase.co',
        pathname: '/**',
      },
    ],
  },
  // SVG를 React 컴포넌트로 import: import IcArrow from '@/assets/icons/ic_arrow.svg'
  // dimensions:false로 width/height를 지우는 대신, viewBox는 남겨야
  // className(size-full 등)으로 지정한 크기에 아이콘이 맞게 스케일된다
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
              svgoConfig: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

// next-intl 플러그인: src/i18n/request.ts를 요청별 i18n 설정으로 연결한다
const withNextIntl = createNextIntlPlugin();

/*
@ Sentry 빌드 설정
- 빌드할 때 소스맵을 Sentry에 올려, 에러 위치가 압축 전 코드로 보이게 한다
- SENTRY_AUTH_TOKEN이 없으면(로컬 빌드 등) 업로드만 건너뛰고 빌드는 그대로 된다
*/
export default withSentryConfig(withNextIntl(nextConfig), {
  org: 'e538612af030',
  project: 'moving-fe',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // CI가 아닐 때는 업로드 로그를 숨긴다
  silent: !process.env.CI,
  // 클라이언트 소스맵을 더 넓게 올려 스택 트레이스를 더 읽기 좋게 한다 (공식 권장)
  widenClientFileUpload: true,
});
