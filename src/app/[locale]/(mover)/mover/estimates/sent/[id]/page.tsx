// [메뉴] 내 견적 관리 메뉴 > 보낸 견적 조회 탭메뉴
// [페이지] 견적 상세
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { createPageMetadata } from '@/lib/constants/site';

import MoverEstimateConfirmedDetailPageContent from '@/components/features/mover/EstimateConfirmedDetail/MoverEstimateConfirmedDetailPageContent';

interface MoverEstimateSentDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: MoverEstimateSentDetailPageProps): Promise<Metadata> {
  const { id, locale } = await params;
  // locale 은 i18n/request.ts 가 [locale] 루트 파라미터에서 읽는다
  const t = await getTranslations('Estimate');

  return createPageMetadata(locale, {
    title: t('metaTitle'),
    path: `/mover/estimates/sent/${id}`,
  });
}

export default async function MoverEstimateSentDetailPage({
  params,
}: MoverEstimateSentDetailPageProps) {
  const { id } = await params;

  return <MoverEstimateConfirmedDetailPageContent estimateId={id} />;
}
