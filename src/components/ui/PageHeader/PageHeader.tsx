// 페이지 제목 바 (GNB 하단)
'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/utils/cn';
import getPageHeaderTitle from '@/utils/getPageHeaderTitle';

export default function PageHeader() {
  const pathname = usePathname();
  const title = getPageHeaderTitle(pathname);

  if (!title) return null;

  return (
    <div
      className={cn(
        'bg-gray-50 px-[30px]',
        'tablet:px-[72px]',
        'desktop:shadow-[0px_2px_10px_0px_rgba(248,248,248,0.1)]',
      )}
    >
      <div
        className={cn(
          'flex h-[54px] items-center',
          'desktop:mx-auto desktop:h-[96px] desktop:w-full desktop:max-w-[1200px]',
        )}
      >
        <p
          className={cn(
            'text-2lg-semibold whitespace-nowrap text-black-500',
            'desktop:text-2xl-semibold',
          )}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
