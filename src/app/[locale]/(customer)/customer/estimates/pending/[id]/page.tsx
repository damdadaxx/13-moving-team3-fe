// [메뉴] 내 견적 관리 메뉴 > 대기중인 견적 탭메뉴
// [페이지] 견적 상세 (대기중인 견적)
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { createPageMetadata } from '@/lib/constants/site';

import EstimatePendingDetailPageContent from '@/components/features/customer/EstimatePendingDetail/EstimatePendingDetailPageContent';

interface EstimatePendingDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: EstimatePendingDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  // locale 은 i18n/request.ts 가 [locale] 루트 파라미터에서 읽는다
  const t = await getTranslations('Estimate');

  return createPageMetadata(locale, {
    title: t('metaTitle'),
    path: `/customer/estimates/pending/${id}`,
  });
}

export default async function EstimatePendingDetailPage({
  params,
}: EstimatePendingDetailPageProps) {
  const { id } = await params;

  return <EstimatePendingDetailPageContent estimateId={id} />;
}
