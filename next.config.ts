import type { NextConfig } from 'next';

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

export default nextConfig;
