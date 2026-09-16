// [메뉴] 예시
// [페이지] 공통 컴포넌트 리스트
import Button from '@/components/ui/Button/Button';

const EXAMPLE_PAGES = [
  { href: '/examples/button', label: 'Button' },
  { href: '/examples/button-icon', label: 'ButtonIcon' },
  { href: '/examples/calendar', label: 'Calendar' },
  { href: '/examples/chips', label: 'Chips' },
  { href: '/examples/tag', label: 'Tag' },
  { href: '/examples/input', label: 'Input' },
  { href: '/examples/textarea', label: 'Textarea' },
  { href: '/examples/searchbar', label: 'Searchbar' },
  { href: '/examples/modal', label: 'Modal' },
  { href: '/examples/toast', label: 'Toast' },
  { href: '/examples/dropdown', label: 'Dropdown' },
  { href: '/examples/sort', label: 'Sort' },
  { href: '/examples/tab', label: 'Tab' },
  { href: '/examples/pagination', label: 'Pagination' },
  { href: '/examples/profile-upload', label: 'Profile Upload' },
  { href: '/examples/skeleton', label: 'Skeleton' },
  { href: '/examples/loading', label: 'Loading' },
  { href: '/examples/zod', label: 'Zod' },
] as const;

export default function ExamplesPage() {
  return (
    <section className="mx-auto flex max-w-[720px] flex-col gap-8 p-[24px]">
      <h1 className="text-xl-bold">컴포넌트 리스트</h1>
      <nav
        aria-label="컴포넌트 예시 페이지"
        className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3"
      >
        {EXAMPLE_PAGES.map((page) => (
          <Button key={page.href} href={page.href} size="sm" variant="outlined">
            {page.label}
          </Button>
        ))}
      </nav>
    </section>
  );
}
