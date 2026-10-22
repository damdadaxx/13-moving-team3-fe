'use client';

import { useEffect, useState } from 'react';

/*
@ 이미지가 "작은 이미지"인지
- 가로·세로 중 짧은 쪽이 thresholdPx보다 작으면 true. 로딩 전·src 없음은 null
- 원본 크기를 알아야 하므로 Image 객체로 먼저 받아서 naturalWidth/naturalHeight를 읽는다
  (화면에 보이는 img와 별개로 받아서, 판단 전에는 "큰 이미지" 기본값으로 그려 깜빡임을 줄인다)
- src가 바뀌어도 이전 판단값을 지우지 않는다 — 호출부는 이미지 하나당 새로 마운트되는
  구조(예: 라이트박스를 열 때마다)라 같은 마운트 안에서 src가 바뀌는 경우가 없다
*/
export function useImageIsSmall(
  src: string,
  thresholdPx: number,
): boolean | null {
  const [isSmall, setIsSmall] = useState<boolean | null>(null);

  useEffect(() => {
    if (!src) return;

    const image = new window.Image();
    image.onload = () => {
      setIsSmall(
        Math.min(image.naturalWidth, image.naturalHeight) < thresholdPx,
      );
    };
    image.src = src;
  }, [src, thresholdPx]);

  return isSmall;
}
