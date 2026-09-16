// 공용 폼 라벨 컴포넌트
// htmlFor로 input과 연결해서 라벨 클릭 시 포커스가 이동하도록 쓴다
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

/*
@ variant별 스타일 (mobile → tablet → desktop)
- auth: 로그인/회원가입 — black-400, md-regular / mb-8px → tablet부터 xl-regular / mb-16px (Figma 회원가입_일반유저)
- profile: 프로필 등록/수정, 기사님 기본정보 수정 — black-300, lg-semibold → desktop xl-semibold / mb-16px (Figma 마이페이지_기본정보 수정_기사님)
- modal: 받은 요청 모달 — black-300, lg-semibold → desktop 2lg-semibold / mb-16px (Figma 받은 요청_견적 보내기)
*/
export const labelVariants = cva('block', {
  variants: {
    variant: {
      auth: 'mb-[8px] text-md-regular text-black-400 tablet:mb-[16px] tablet:text-xl-regular',
      profile:
        'mb-[16px] text-lg-semibold text-black-300 desktop:text-xl-semibold',
      modal:
        'mb-[16px] text-lg-semibold text-black-300 desktop:text-2lg-semibold',
    },
  },
  defaultVariants: {
    variant: 'auth',
  },
});

export type LabelVariant = NonNullable<
  VariantProps<typeof labelVariants>['variant']
>;

interface LabelProps
  extends React.ComponentProps<'label'>, VariantProps<typeof labelVariants> {
  children: React.ReactNode;
  /** 필수 입력 항목 표시(*) — 시각적 표시만 하고 검증은 폼(zod)에서 처리한다 */
  required?: boolean;
}

export default function Label({
  children,
  variant,
  required = false,
  className,
  ...props
}: LabelProps) {
  return (
    <label className={cn(labelVariants({ variant }), className)} {...props}>
      {children}
      {required && (
        <span aria-hidden="true" className="ml-1 text-orange-400">
          *
        </span>
      )}
    </label>
  );
}
