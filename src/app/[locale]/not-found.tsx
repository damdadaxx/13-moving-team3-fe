'use client';

// 404 페이지
import EmptyState from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      message="페이지를 찾을 수 없어요!"
      buttonLabel="홈으로 가기"
      href="/"
    />
  );
}
