// 인증 페이지 안내 문구 + 주황 밑줄 링크
// 예: "기사님이신가요? 기사님 전용 페이지", "아직 무빙 회원이 아니신가요? 이메일로 회원가입하기"
import Link from 'next/link';

import { cn } from '@/utils/cn';

interface AuthLinkTextProps {
  text: string;
  linkLabel: string;
  href: string;
  className?: string;
}

export default function AuthLinkText({
  text,
  linkLabel,
  href,
  className,
}: AuthLinkTextProps) {
  return (
    <p
      className={cn(
        'flex flex-wrap items-center justify-center gap-1 text-xs-regular text-black-100',
        'tablet:gap-2 tablet:text-xl-regular tablet:text-black-200',
        className,
      )}
    >
      {text}
      <Link
        href={href}
        className={cn(
          'text-xs-semibold text-orange-400 underline underline-offset-[3px]',
          'tablet:text-xl-semibold',
        )}
      >
        {linkLabel}
      </Link>
    </p>
  );
}
