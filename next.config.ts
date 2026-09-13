import type { NextConfig } from 'next';

const svgrOptions = {
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
};

const nextConfig: NextConfig = {
  reactCompiler: true,
  // SVG를 React 컴포넌트로 import: import IcArrow from '@/assets/icons/ic_arrow.svg'
  // viewBox를 유지해야 className 크기(size-full 등)에 맞춰 아이콘이 스케일된다
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: svgrOptions,
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
