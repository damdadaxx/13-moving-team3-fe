// root 레벨 공통 에러 UI

'use client';

interface ErrorProps {
  // Next.js App Router는 서버 에러 추적용 digest를 Error에 주입
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error: _error, reset }: ErrorProps) {
  return (
    <div>
      <p>오류가 발생했습니다.</p>
      {/* TODO: 버튼 컴포넌트 작업 후 변경 */}
      <button onClick={reset}>다시 시도</button>
    </div>
  );
}
