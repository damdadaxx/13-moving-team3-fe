// 공용 검색바 (Figma: input/searchbar)
'use client';

import { useRef, useState } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import IcSearchMd from '@/assets/icons/ic_search_md.svg';
import IcSearchSm from '@/assets/icons/ic_search_sm.svg';
import IcXCircleMd from '@/assets/icons/ic_x_circle_md.svg';
import IcXCircleSm from '@/assets/icons/ic_x_circle_sm.svg';

import { cn } from '@/utils/cn';

/** searchbarVariants
 * - Figma의 state(default/filled/typing)는 prop이 아니라 포커스와 값에서 파생된다
 *   · default = 값 없음 + 포커스 없음 → placeholder(gray-400)
 *   · filled  = 값 있음 + 포커스 없음 → 본문색(black-400)
 *     이 둘은 input의 placeholder/value 색이라 JS 분기 없이 CSS로 끝난다
 *   · typing  = 포커스 → 검색 아이콘이 오른쪽으로 옮겨가고 왼쪽에 ⓧ가 붙는다
 * - 너비는 Figma가 sm 260 / md 560으로 고정돼 있지만 검색바는 헤더·목록 상단에서
 *   부모 폭을 따르는 쪽이 맞아 w-full로 두고, 필요하면 className으로 덮어쓴다
 * - 높이는 아이콘(sm 24 / md 36)에 상하 14px을 더한 값이라 고정으로 박는다.
 *   포커스 상태에선 왼쪽 아이콘이 빠져 텍스트 높이만 남으므로 안 박으면 줄어든다
 * - gap은 Figma 기준 기본 6/8, 포커스 시 오른쪽 아이콘 사이 12/16
 */
const searchbarVariants = cva(
  'flex w-full items-center overflow-hidden rounded-[16px] bg-background-100',
  {
    variants: {
      size: {
        sm: 'h-[52px] px-4 text-md-regular',
        md: 'h-[64px] px-6 text-2lg-regular',
        responsive:
          'h-[52px] px-4 text-md-regular desktop:h-[64px] desktop:px-6 desktop:text-2lg-regular',
      },
      isTyping: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { size: 'sm', isTyping: false, class: 'gap-[6px]' },
      { size: 'md', isTyping: false, class: 'gap-2' },
      { size: 'responsive', isTyping: false, class: 'gap-[6px] desktop:gap-2' },
      { size: 'sm', isTyping: true, class: 'gap-3' },
      { size: 'md', isTyping: true, class: 'gap-4' },
      { size: 'responsive', isTyping: true, class: 'gap-3 desktop:gap-4' },
    ],
    defaultVariants: {
      size: 'responsive',
      isTyping: false,
    },
  },
);

type InputSearchbarProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type'
> &
  Pick<VariantProps<typeof searchbarVariants>, 'size'> & {
    /** input이 아니라 바깥 컨테이너에 붙는다 (폭 조절용) */
    className?: string;
    /** ⓧ로 값을 지운 뒤 호출된다 */
    onClear?: () => void;
    /** 검색 아이콘 클릭 또는 Enter로 검색할 때 현재 값과 함께 호출된다.
     *  넘기지 않으면 아이콘은 장식으로만 남고 포커스도 받지 않는다 */
    onSearch?: (value: string) => void;
    ref?: React.Ref<HTMLInputElement>;
  };

export default function InputSearchbar({
  size = 'responsive',
  className,
  onClear,
  onSearch,
  onKeyDown,
  placeholder = '텍스트를 입력해 주세요.',
  ref,
  ...props
}: InputSearchbarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const SearchIcon = size === 'sm' ? IcSearchSm : IcSearchMd;
  const XCircleIcon = size === 'sm' ? IcXCircleSm : IcXCircleMd;
  const iconSizeClass = size === 'sm' ? 'size-6' : 'size-9';

  /* 검색 아이콘 색이 Figma에서 sm은 gray-300, md는 gray-400으로 서로 다르다.
     의도인지 확인 전이라 원본을 그대로 따른다 */
  const searchIcon = (
    <SearchIcon
      className={cn(
        'size-full',
        size === 'sm' ? 'text-gray-300' : 'text-gray-400',
      )}
    />
  );

  /* 바깥에서 넘어온 ref(react-hook-form의 register 등)와 내부 ref를 같이 채운다 */
  const setRefs = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
  };

  /* 값을 비운 뒤 input 이벤트를 다시 쏜다. value를 그냥 ''로 넣으면 React가
     설정한 값 추적을 우회해서 onChange가 안 불린다. 네이티브 setter를 거쳐야
     제어 컴포넌트든 react-hook-form이든 변경을 감지한다 */
  const handleClear = () => {
    const input = inputRef.current;
    if (!input) return;

    const setValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )?.set;
    setValue?.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
    onClear?.();
  };

  const handleSearch = () => onSearch?.(inputRef.current?.value ?? '');

  /* 입력창에 포커스가 들어올 때만 배치를 바꾼다. 검색 버튼을 탭으로 짚은 것만으로
     좌우가 뒤집히면 포커스 링이 튀어 보인다 */
  const handleContainerFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.target === inputRef.current) setIsTyping(true);
  };

  /* 검색바 안에서 안으로 옮겨가는 중이면(input → ⓧ 탭 이동 등) 상태를 유지한다.
     input의 blur만 보면 ⓧ가 포커스를 받는 순간 사라져서 키보드로는 영영
     도달할 수 없다 */
  const handleContainerBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setIsTyping(false);
  };

  /* 포커스 시 검색 아이콘이 왼쪽에서 오른쪽으로 간다. 조건부 렌더로 자리를 옮기면
     DOM 노드가 새로 마운트되면서 포커스가 날아가므로, 같은 노드를 두고 order로
     시각 위치만 바꾼다. 탭 순서는 DOM 순서(검색 → 입력 → ⓧ)를 따른다 */
  const searchOrderClass = isTyping ? 'order-4' : 'order-1';

  return (
    <div
      className={cn(searchbarVariants({ size, isTyping }), className)}
      onFocus={handleContainerFocus}
      onBlur={handleContainerBlur}
    >
      {onSearch ? (
        <button
          type="button"
          aria-label="검색"
          onClick={handleSearch}
          className={cn(
            'flex shrink-0 cursor-pointer',
            iconSizeClass,
            searchOrderClass,
          )}
        >
          {searchIcon}
        </button>
      ) : (
        <span
          aria-hidden="true"
          className={cn('flex shrink-0', iconSizeClass, searchOrderClass)}
        >
          {searchIcon}
        </span>
      )}

      <input
        ref={setRefs}
        type="search"
        placeholder={placeholder}
        /* type=search가 브라우저 기본 X 버튼을 붙이는데 우리 ⓧ와 겹쳐서 지운다 */
        className="order-2 min-w-0 flex-1 bg-transparent text-black-400 outline-none placeholder:text-gray-400 [&::-webkit-search-cancel-button]:appearance-none"
        onKeyDown={(event) => {
          /* onSearch를 받은 경우에만 Enter를 가로챈다. 안 그러면 form 안에서
             기본 submit을 막아버린다 */
          if (event.key === 'Enter' && onSearch) {
            event.preventDefault();
            handleSearch();
          }
          onKeyDown?.(event);
        }}
        {...props}
      />

      {isTyping && (
        <button
          type="button"
          aria-label="검색어 지우기"
          /* mousedown에서 input이 포커스를 잃으면 캐럿이 튀므로 막아둔다 */
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleClear}
          className={cn('order-3 flex shrink-0 cursor-pointer', iconSizeClass)}
        >
          <XCircleIcon className="size-full" />
        </button>
      )}
    </div>
  );
}
