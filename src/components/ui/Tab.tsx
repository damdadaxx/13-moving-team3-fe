'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/utils/cn';

interface Tabs {
  label: string;
  value: string;
  href: string;
}

export default function Tab({
  tabs,
  onClick,
}: {
  tabs: Tabs[];
  onClick?: (value: string) => void;
}) {
  const pathname = usePathname();
  //쿼리로 들어올 경우도 체크.
  const searchParams = useSearchParams();
  const currentPath = searchParams.toString()
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  return (
    <nav
      role="tablist"
      className={cn(
        'flex w-full items-stretch border-b-[1px] border-line-100 bg-gray-50 h-[54px] px-[24px]',
        'tablet:px-[72px] tablet:shadow-[0px_2px_10px_rgba(248,248,248,0.2)]',
        'desktop:h-[80px] desktop:gap-[32px] desktop:px-[360px] desktop:pt-[16px] desktop:shadow-[0px_2px_1px_rgba(248,248,248,0.1)]',
      )}
    >
      <div className="flex h-full flex-1 items-stretch gap-[24px] desktop:contents">
        {tabs.map((tab) => {
          const isActive = tab.href === currentPath;
          const tabItemClassName = cn(
            'flex h-full cursor-pointer items-center whitespace-nowrap',
            {
              'border-b-[2px] border-black-400 text-md-bold text-black-500 desktop:border-black-500 desktop:text-xl-semibold':
                isActive,
              'text-md-semibold text-gray-400 desktop:text-xl-semibold':
                !isActive,
            },
          );

          return (
            <Link
              key={tab.label}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={tabItemClassName}
              onClick={() => onClick?.(tab.value)}
            >
              {tab.value}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
