/*
@ 알 수 없는 경로 처리 (catch-all)
- 다른 라우트가 전부 매칭에 실패했을 때만 걸린다 (기존 라우트가 우선)
- notFound()로 [locale]/not-found.tsx를 보여준다
  예) /a/b/c, /en/a/b/c
*/
import { notFound } from 'next/navigation';

export default function CatchAllPage() {
  notFound();
}
