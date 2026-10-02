import { useTranslations } from 'next-intl';

/*
@ 경력 표시 (현재 언어)
- 경력은 개월 수로 내려온다. 1년 미만은 개월, 그 이상은 년 단위로 내림
- 단위(년/개월, yrs/mos …)는 messages > Common.careerYears / careerMonths
@ 사용 예시
const formatCareer = useFormatCareer();
formatCareer(30); // ko: '2년' / en: '2 yrs'
*/
export function useFormatCareer() {
  const t = useTranslations('Common');

  return (careerMonths: number) =>
    careerMonths < 12
      ? t('careerMonths', { count: careerMonths })
      : t('careerYears', { count: Math.floor(careerMonths / 12) });
}
