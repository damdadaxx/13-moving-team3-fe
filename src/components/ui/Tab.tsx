'use client';

import { cva } from 'class-variance-authority';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/utils/cn';

/**
 * 각 탭 항목의 정보를 담는 인터페이스입니다.
 * - label: 탭 고유 값(key 값)
 * - value: 탭 버튼에 시각적으로 표시되는 텍스트
 * - href: 탭 클릭 시 이동할 경로 (url)
 */
interface Tabs {
  label: string;
  value: string;
  href: string;
}

const tabItemClassName = cva(
  'relative flex h-full cursor-pointer items-center whitespace-nowrap',
  {
    variants: {
      isActive: {
        true: [
          "after:absolute after:inset-0 after:-bottom-px after:border-b-[2px] after:border-black-400 after:content-[''] desktop:after:border-black-500",
          'text-md-bold text-black-500 desktop:text-xl-semibold',
        ],
        false: 'text-md-semibold text-gray-400 desktop:text-xl-semibold',
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);

export default function Tab({ tabs }: { tabs: Tabs[] }) {
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
        'flex w-full items-stretch border-b border-line-100 bg-gray-50 h-[54px] px-[24px]',
        'tablet:px-[72px] tablet:shadow-[0px_2px_10px_rgba(248,248,248,0.2)]',
        'desktop:h-[80px] desktop:gap-[32px] desktop:shadow-[0px_2px_1px_rgba(248,248,248,0.1)]',
      )}
    >
      <div
        className={cn(
          'flex h-full w-full items-stretch gap-[24px]',
          'desktop:mx-auto desktop:max-w-[1600px] desktop:pl-[196px]',
        )}
      >
        {tabs.map((tab) => {
          const isActive = tab.href === currentPath;

          return (
            <Link
              key={tab.label}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              className={tabItemClassName({ isActive })}
            >
              {tab.value}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
