import { useLocale, useTranslations } from 'next-intl';

/*
@ 금액 표시 (현재 언어)
- 숫자 구분(천 단위 쉼표 등)은 언어 표준, 단위는 messages > Common.price
  예) ko: 180,000원 / en: ₩180,000 / zh: 180,000韩元 / ja: 180,000ウォン
@ 사용 예시
const formatPrice = useFormatPrice();
formatPrice(180000);
*/
export function useFormatPrice() {
  const t = useTranslations('Common');
  const locale = useLocale();

  return (price: number) =>
    t('price', { price: new Intl.NumberFormat(locale).format(price) });
}
