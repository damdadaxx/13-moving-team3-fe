import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  // SVG를 React 컴포넌트로 import: import IcArrow from '@/assets/icons/ic_arrow.svg'
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              dimensions: false,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
