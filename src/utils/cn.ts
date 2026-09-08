// clsx + tailwind-merge 헬퍼
// 조건부 클래스 및 Tailwind 충돌 병합
import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** twMerge
 * - 같은 그룹의 Tailwind 클래스가 중복되면 나중 값만 남기고 앞의 값을 지워줌
 * - (예: cn('bg-primary-400', 'bg-primary-500') => 'bg-primary-500')
 * - 기본 twMerge는 globals.css의 커스텀 text-24-bold 같은 폰트 토큰을 모르고
 * text 컬러 클래스와 같은 그룹으로 잘못 인식해 지워버리므로, font-size 그룹을 직접 등록해줌
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            '3xl-bold',
            '3xl-semibold',
            '2xl-bold',
            '2xl-semibold',
            '2xl-medium',
            '2xl-regular',
            'xl-bold',
            'xl-semibold',
            'xl-medium',
            'xl-regular',
            '2lg-bold',
            '2lg-semibold',
            '2lg-medium',
            '2lg-regular',
            'lg-bold',
            'lg-semibold',
            'lg-medium',
            'lg-regular',
            'md-bold',
            'md-semibold',
            'md-medium',
            'md-regular',
            'sm-semibold',
            'sm-medium',
            'xs-semibold',
            'xs-medium',
            'xs-regular',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
