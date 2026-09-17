// [메뉴] 예시
// [페이지] 공통 컴포넌트 리스트
import Button from '@/components/ui/Button/Button';

interface ExamplePageLink {
  href: string;
  label: string;
}

interface ExampleGroup {
  title: string;
  description: string;
  pages: readonly ExamplePageLink[];
}

const EXAMPLE_GROUPS: readonly ExampleGroup[] = [
  {
    title: '1. 컴포넌트가 안에서 반응형 처리',
    description:
      'size="responsive" 또는 tablet:/desktop: CSS로 컴포넌트가 크기를 바꿉니다. 사용처에서 useBreakpointValue를 넘기지 않습니다.',
    pages: [
      { href: '/examples/searchbar', label: 'InputSearchbar' },
      { href: '/examples/sort', label: 'Sort' },
      { href: '/examples/dropdown', label: 'Dropdown' },
      { href: '/examples/button-icon', label: 'ButtonIcon' },
      { href: '/examples/profile-upload', label: 'ProfileUpload' },
      { href: '/examples/textarea', label: 'Textarea' },
      { href: '/examples/modal', label: 'Modal' },
      { href: '/examples/toast', label: 'Toast' },
      { href: '/examples/tab', label: 'Tab' },
      // TODO: Pagination 예시 추가
      // { href: '/examples/pagination', label: 'Pagination' },
    ],
  },
  {
    title: '2. size는 고정, 사용처에서 useBreakpointValue',
    description:
      '컴포넌트는 sm/md(Button은 lg)만 그립니다. Button 기본값은 sm입니다. 페이지마다 크기가 다르므로 사용처에서 size를 넘깁니다.',
    pages: [
      { href: '/examples/button', label: 'Button' },
      { href: '/examples/input', label: 'Label / Input' },
      { href: '/examples/chips', label: 'Chips' },
      { href: '/examples/tag', label: 'Tag' },
    ],
  },
  {
    title: '3. size가 브레이크포인트가 아닌 것',
    description:
      'Calendar size는 팝업 카드(sm)와 모바일 인라인(md) 레이아웃입니다. DateDropdown은 size가 없고 안쪽 달력은 sm입니다.',
    pages: [{ href: '/examples/calendar', label: 'Calendar' }],
  },
  {
    title: '기타',
    description:
      '폼 검증·로딩처럼 브레이크포인트 size API와 무관한 예시입니다.',
    pages: [
      { href: '/examples/skeleton', label: 'Skeleton' },
      { href: '/examples/loading', label: 'Loading' },
      { href: '/examples/zod', label: 'Zod' },
    ],
  },
];

export default function ExamplesPage() {
  return (
    <section className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl-bold">컴포넌트 리스트</h1>
        <p className="text-md-regular text-gray-500">
          반응형을 누가 처리하는지에 따라 나눴습니다. 각 예시 페이지 상단에 같은
          기준이 적혀 있습니다.
        </p>
      </header>

      {EXAMPLE_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg-semibold">{group.title}</h2>
            <p className="text-md-regular text-gray-500">{group.description}</p>
          </div>
          <nav
            aria-label={group.title}
            className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3"
          >
            {group.pages.map((page) => (
              <Button
                key={page.href}
                href={page.href}
                size="sm"
                variant="outlined"
              >
                {page.label}
              </Button>
            ))}
          </nav>
        </div>
      ))}
    </section>
  );
}
