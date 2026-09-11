// Button과 ButtonLink의 내부는 똑같이 생겼다. 스피너/아이콘 마크업이 두 벌로
// 갈라져서 따로 놀지 않도록 여기 한 군데만 둔다.
'use client';

import { TailSpin } from 'react-loader-spinner';

interface ButtonContentProps {
  children?: React.ReactNode;
  /** 텍스트 오른쪽에 붙는 24x24 아이콘 (Figma의 solid-icon 변형) */
  icon?: React.ReactNode;
  /** 로딩 중이면 스피너만 남는다 */
  isLoading?: boolean;
}

export default function ButtonContent({
  children,
  icon,
  isLoading = false,
}: ButtonContentProps) {
  if (isLoading) {
    return (
      <TailSpin
        visible
        height={24}
        width={24}
        color="currentColor"
        ariaLabel="로딩 중"
        radius={1}
      />
    );
  }

  return (
    <>
      {children}
      {/* 아이콘은 텍스트 옆 장식이라 보조기기에서는 숨긴다 */}
      {icon && (
        <span
          aria-hidden="true"
          className="flex size-6 shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      )}
    </>
  );
}
