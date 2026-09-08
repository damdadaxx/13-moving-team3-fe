// root layout 에러 최후 보루
// app/layout.tsx 자체가 에러났을 때만 동작

'use client';

import { pretendard } from '@/lib/constants/fonts';

import { cn } from '@/utils/cn';

import './globals.css';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ko" className={cn(pretendard.variable, 'h-full antialiased')}>
      <body>
        <p>앱에 심각한 오류가 발생했습니다.</p>
        {/* TODO: 버튼 컴포넌트 작업 후 변경 */}
        <button onClick={reset}>새로고침</button>
      </body>
    </html>
  );
}
