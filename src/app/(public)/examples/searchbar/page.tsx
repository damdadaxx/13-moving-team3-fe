// [메뉴] 예시
// [페이지] 공용 검색바(InputSearchbar) 사용법

'use client';

import { useState } from 'react';

import InputSearchbar from '@/components/ui/Form/InputSearchbar';

export default function SearchbarExamplePage() {
  const [keyword, setKeyword] = useState('');
  const [clearCount, setClearCount] = useState(0);
  const [searched, setSearched] = useState<string[]>([]);

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-10 p-[24px]">
      <div>
        <h1 className="text-xl-bold">InputSearchbar 예시</h1>
        <p className="mt-2 text-md-regular text-gray-500">
          Figma <code>input/searchbar</code>를 옮긴 컴포넌트입니다.{' '}
          <code>size</code>는 <code>sm</code>(52px) / <code>md</code>(64px) /{' '}
          <code>responsive</code>입니다.{' '}
          <span className="font-bold text-orange-400">
            반응형은 컴포넌트가 처리합니다.
          </span>{' '}
          기본값 <code>responsive</code>는 모바일·태블릿 sm, 데스크톱 md입니다.
          데스크톱 첫 화면이 깜빡이지 않도록 CSS <code>desktop:</code>을 쓰고,{' '}
          <code>useBreakpointValue</code>는 넘기지 않습니다.
        </p>
        <p className="mt-2 text-md-regular text-gray-500">
          Figma의 <code>state</code>(default / filled / typing)는 prop이 아니라
          포커스와 값에서 파생됩니다. 포커스가 들어가면 검색 아이콘이 오른쪽으로
          옮겨가고 왼쪽에 ⓧ가 붙습니다 — <b>입력창을 클릭해 보세요.</b>
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">
          1. size — sm (52px) / md (64px) / responsive
        </h2>
        <p className="text-md-regular text-gray-500">
          sm은 14px 본문에 아이콘 24px, md는 18px에 아이콘 36px입니다. 기본값{' '}
          <code>responsive</code>는 모바일·태블릿 sm, 데스크톱 md입니다. 창
          너비를 바꿔 보면 아래 세 번째만 크기가 바뀝니다.
        </p>
        <p className="text-sm-medium text-gray-500">size=&quot;sm&quot;</p>
        <InputSearchbar size="sm" />
        <p className="text-sm-medium text-gray-500">size=&quot;md&quot;</p>
        <InputSearchbar size="md" />
        <p className="text-sm-medium text-gray-500">
          size=&quot;responsive&quot; (기본값)
        </p>
        <InputSearchbar />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">2. state — 값 유무에 따른 색</h2>
        <p className="text-md-regular text-gray-500">
          값이 없으면 placeholder가 gray-400, 값이 있으면 본문이
          black-400입니다. 별도 prop 없이 <code>placeholder:</code> 유틸로
          처리됩니다.
        </p>
        <InputSearchbar defaultValue="" />
        <InputSearchbar defaultValue="텍스트를 입력해 주세요." />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">3. 폭 조절</h2>
        <p className="text-md-regular text-gray-500">
          기본이 <code>w-full</code>이라 부모 폭을 따릅니다. Figma 원본 폭(md
          560px / sm 260px)으로 맞추려면 부모나 <code>className</code>으로
          덮어씁니다.
        </p>
        <div className="w-[560px] max-w-full">
          <InputSearchbar />
        </div>
        <InputSearchbar size="sm" className="w-[260px] max-w-full" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">4. 값 제어 · onClear</h2>
        <p className="text-md-regular text-gray-500">
          제어 컴포넌트로 쓸 수 있고, ⓧ를 누르면 값이 비워지면서{' '}
          <code>onChange</code>가 정상적으로 불립니다(
          <code>react-hook-form</code>의 <code>register</code>에 붙여도
          같습니다). 지운 뒤 추가 동작이 필요하면 <code>onClear</code>를 씁니다.
        </p>
        <InputSearchbar
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          onClear={() => setClearCount((count) => count + 1)}
        />
        <p className="text-md-medium text-gray-500">
          입력값: <span className="text-orange-400">{keyword || '(없음)'}</span>{' '}
          · 지운 횟수: <span className="text-orange-400">{clearCount}</span>
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">5. onSearch — 검색 실행</h2>
        <p className="text-md-regular text-gray-500">
          <code>onSearch</code>를 넘기면 검색 아이콘이 버튼이 되어 클릭·Enter로
          검색이 실행됩니다. 넘기지 않으면 아이콘은 장식으로만 남고 탭 포커스도
          받지 않습니다(위 1~4번이 그 경우입니다).{' '}
          <b>입력 후 Enter를 누르거나 돋보기를 클릭해 보세요.</b>
        </p>
        <InputSearchbar
          onSearch={(value) =>
            setSearched((list) => [value || '(빈 값)', ...list].slice(0, 5))
          }
        />
        <p className="text-md-medium text-gray-500">
          검색 기록:{' '}
          {searched.length ? (
            <span className="text-orange-400">{searched.join(' · ')}</span>
          ) : (
            '(없음)'
          )}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg-semibold">6. 키보드 조작</h2>
        <p className="text-md-regular text-gray-500">
          탭 순서는 <b>검색 버튼 → 입력창 → ⓧ</b>입니다. 입력창에서 Tab을 누르면
          ⓧ로 이동하고, 포커스가 검색바 안에 머무는 동안에는 ⓧ가 사라지지
          않습니다. Enter로 검색, ⓧ에서 Space/Enter로 값 지우기가 됩니다.
        </p>
        <InputSearchbar
          size="sm"
          onSearch={(value) =>
            setSearched((list) => [value || '(빈 값)', ...list].slice(0, 5))
          }
        />
      </section>
    </div>
  );
}
