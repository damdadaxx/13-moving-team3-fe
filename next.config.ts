import { withSentryConfig } from '@sentry/nextjs/config';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  reactCompiler: true,
  /*
  @ 이미지 원격 호스트
  - picsum은 기존 시드 프로필용이므로 계속 허용한다.
  - CloudFront는 백엔드 CLOUDFRONT_DOMAIN과 같은 배포 도메인의 /profiles 이미지에만 허용한다.
    hostname에는 https:// 없이 도메인만 넣고, AWS 인증 키는 프론트에 추가하지 않는다.
  - 배포 도메인을 변경하면 이 항목도 맞춘 뒤 개발 서버를 재시작하거나 다시 배포해야 한다.
  */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd188il1vqlvt2l.cloudfront.net',
        port: '',
        pathname: '/profiles/**',
        search: '',
      },
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
        // 채팅 이미지. 비공개 버킷이라 조회 시점마다 signed URL로 내려온다
        // (버킷/리전이 바뀌면 BE AWS_PRIVATE_BUCKET_NAME/AWS_REGION과 같이 맞춘다)
        protocol: 'https',
        hostname: 'private-team3-moving-buket.s3.ap-northeast-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  /*
  @ 서비스 워커 파일 헤더
  - sw.js는 브라우저가 캐시하지 않고 항상 새로 받아야 새 버전이 바로 반영된다
  */
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
        ],
      },
    ];
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
