// [메뉴] 기사님찾기 메뉴
// [페이지] 기사님 상세
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { createPageMetadata } from '@/lib/constants/site';

import MoverDetailPageContent from '@/components/features/common/MoverDetail/MoverDetailPageContent';

interface MoverDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: MoverDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  // locale 은 i18n/request.ts 가 [locale] 루트 파라미터에서 읽는다
  const t = await getTranslations('MoverDetail');

  return createPageMetadata(locale, {
    title: t('metaTitle'),
    path: `/mover/${id}`,
  });
}

export default async function MoverDetailPage({
  params,
}: MoverDetailPageProps) {
  const { id } = await params;

  return <MoverDetailPageContent moverId={id} />;
}
