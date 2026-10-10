/*
@ 프로필 이미지 URL
- '/uploads/...' 는 Next 프록시(/api)를 타도록 앞에 붙인다
- http(s) 절대 URL과 이미 /api가 붙은 경로는 그대로 둔다
- S3 절대 URL은 next.config images.remotePatterns에 도메인을 추가해야 next/image가 렌더한다
*/
export function resolveImageUrl(imgUrl: string | null): string | null {
  if (!imgUrl) return null;
  if (imgUrl.startsWith('http') || imgUrl.startsWith('/api/')) return imgUrl;

  return `/api${imgUrl.startsWith('/') ? '' : '/'}${imgUrl}`;
}
