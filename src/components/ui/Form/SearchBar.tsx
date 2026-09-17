// 검색 입력창
// Figma: 디자인 시스템 > Input > input/searchbar (모바일·태블릿 size=sm / 데스크톱 size=md)
import IcSearch24 from '@/assets/icons/ic_search_24.svg';
import IcSearch36 from '@/assets/icons/ic_search_36.svg';

import { cn } from '@/utils/cn';

type SearchBarProps = Omit<React.ComponentProps<'input'>, 'type'>;

export default function SearchBar({ className, ...props }: SearchBarProps) {
  return (
    <label
      className={cn(
        'flex w-full cursor-text items-center gap-1.5 rounded-2xl bg-background-200 px-4 py-3.5',
        'desktop:h-16 desktop:gap-2 desktop:px-6',
        className,
      )}
    >
      {/* 아이콘은 사이즈별 선 두께가 달라(1.5 / 2) 크기만 키우지 않고 따로 쓴다 */}
      <IcSearch24
        aria-hidden
        className={cn('size-6 shrink-0', 'desktop:hidden')}
      />
      <IcSearch36
        aria-hidden
        className={cn('hidden size-9 shrink-0', 'desktop:block')}
      />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        className={cn(
          'min-w-0 flex-1 bg-transparent text-md-regular text-black-400 outline-none placeholder:text-gray-400',
          'desktop:text-2lg-regular',
        )}
        {...props}
      />
    </label>
  );
}
