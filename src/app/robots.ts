import type { MetadataRoute } from 'next';

// TODO: 최적화 작업 시 수정
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
  };
}
