// SNS 간편 가입 버튼 (구글 / 카카오 / 네이버)
// Figma: img/login_01 — 원형 54px, tablet부터 72px
/*
@ 공통 버튼 컴포넌트를 쓰지 않는 이유
- Button: 가로로 긴 CTA 전용이라 모양이 다르다
- ButtonRoundedSquare: 둥근 '사각형'(8/16px) 40·54·64px 이고 아이콘이 찜·공유·카카오·페북로 고정이라
  원형 54·72px 에 구글·네이버 아이콘이 필요한 여기서는 쓸 수 없다 (공통 컴포넌트 수정 없이는 불가)
- 대신 공통 렌더러 ButtonElement 를 써서 로딩·비활성 처리와 클릭 규칙을 공유한다
- 아이콘 SVG 안에 이미 원형 배경색이 들어 있어 배경은 따로 주지 않는다
*/
'use client';

import type { SocialProvider } from '@/types/auth';
import type { Role } from '@/types/role';

import IcLoginGoogle from '@/assets/icons/ic_login_google.svg';
import IcLoginKakao from '@/assets/icons/ic_login_kakao.svg';
import IcLoginNaver from '@/assets/icons/ic_login_naver.svg';

import { getSocialLoginUrl } from '@/lib/api/auth';

import { cn } from '@/utils/cn';

import ButtonElement from '@/components/ui/Button/ButtonElement';

const SOCIAL_BUTTONS = [
  { provider: 'google', Icon: IcLoginGoogle, label: '구글로 시작하기' },
  { provider: 'kakao', Icon: IcLoginKakao, label: '카카오로 시작하기' },
  { provider: 'naver', Icon: IcLoginNaver, label: '네이버로 시작하기' },
] as const satisfies ReadonlyArray<{
  provider: SocialProvider;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
}>;

interface SocialLoginButtonsProps {
  role: Role;
}

export default function SocialLoginButtons({ role }: SocialLoginButtonsProps) {
  /*
  @ 소셜 로그인 시작
  - 가드가 붙여준 ?callbackUrl 을 프로바이더 왕복 뒤에도 쓰도록 넘긴다
  - 백엔드 302 를 따라가야 하므로 router.push 가 아닌 전체 페이지 이동으로 프록시(/api)에 요청한다
  */
  function handleClick(provider: SocialProvider) {
    const callbackUrl = new URLSearchParams(window.location.search).get(
      'callbackUrl',
    );
    const url = new URL(
      getSocialLoginUrl(provider, role, callbackUrl),
      window.location.origin,
    );
    window.location.assign(url);
  }

  return (
    <section className={cn('flex flex-col items-center gap-6', 'tablet:gap-8')}>
      <h2
        className={cn(
          'text-xs-regular text-black-100',
          'tablet:text-xl-regular tablet:text-black-200',
        )}
      >
        SNS 계정으로 간편 가입하기
      </h2>
      <ul className={cn('flex gap-6', 'tablet:gap-8')}>
        {SOCIAL_BUTTONS.map(({ provider, Icon, label }) => (
          <li key={provider}>
            <ButtonElement
              type="button"
              aria-label={label}
              onClick={() => handleClick(provider)}
              className={cn(
                'size-[54px] overflow-hidden rounded-full',
                'tablet:size-[72px]',
              )}
            >
              <Icon className="size-full" />
            </ButtonElement>
          </li>
        ))}
      </ul>
    </section>
  );
}
