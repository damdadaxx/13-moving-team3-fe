import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
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
