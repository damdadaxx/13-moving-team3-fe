// 로그인 / 회원가입 페이지 공통 레이아웃
// Figma: 로그인_일반유저, 회원가입_일반유저, 로그인_기사님, 회원가입_기사님
import type { Role } from '@/types/role';
import Image from 'next/image';

import ImgAvatarBeaver from '@/assets/images/img_avatar_beaver.png';
import ImgAvatarTruck from '@/assets/images/img_avatar_truck.png';
import ImgLogoText from '@/assets/images/img_logo_text.svg';

import { getSigninPath, getSignupPath } from '@/lib/constants/routes';

import { cn } from '@/utils/cn';

import AuthLinkText from '@/components/auth/AuthLinkText';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';

type AuthMode = 'signin' | 'signup';

interface AuthPageLayoutProps {
  role: Role;
  mode: AuthMode;
  children: React.ReactNode;
}

/*
@ 역할별로 달라지는 부분
- 상단 문구: 다른 역할의 같은 페이지(로그인↔로그인, 회원가입↔회원가입)로 이동
- 일러스트: 일반 유저는 비버, 기사님은 트럭 (태블릿 이상에서만 노출)
- 일러스트 위치는 카드 오른쪽 아래 기준 (Figma 좌표에서 계산). 화면 밖으로 나가는 부분은 section에서 잘라낸다
*/
const ROLE_CONFIG = {
  customer: {
    switchText: '기사님이신가요?',
    switchLabel: '기사님 전용 페이지',
    switchRole: 'mover',
    illustration: ImgAvatarBeaver,
    illustrationClassName:
      'tablet:size-[240px] tablet:right-[-103px] tablet:bottom-[-58px] desktop:size-[382px] desktop:right-[-322px] desktop:bottom-[-25px]',
  },
  mover: {
    switchText: '일반 유저라면?',
    switchLabel: '일반 유저 전용 페이지',
    switchRole: 'customer',
    illustration: ImgAvatarTruck,
    illustrationClassName:
      'tablet:size-[240px] tablet:right-[-103px] tablet:bottom-[-68px] desktop:size-[392px] desktop:right-[-332px] desktop:bottom-[-52px]',
  },
} as const;

export default function AuthPageLayout({
  role,
  mode,
  children,
}: AuthPageLayoutProps) {
  const config = ROLE_CONFIG[role];
  const switchHref =
    mode === 'signin'
      ? getSigninPath(config.switchRole)
      : getSignupPath(config.switchRole);

  return (
    <section
      className={cn(
        'flex min-h-screen justify-center overflow-hidden bg-gray-50 px-6 pt-14 pb-[104px]',
        'tablet:bg-orange-400 tablet:px-[52px] tablet:pt-[75px] tablet:pb-[88px]',
        'desktop:pt-[45px] desktop:pb-[72px]',
      )}
    >
      <div
        className={cn(
          'relative flex h-fit w-full max-w-[327px] flex-col items-center',
          'tablet:max-w-[640px] tablet:rounded-[40px] tablet:bg-gray-50 tablet:px-10 tablet:py-[68px]',
          'desktop:max-w-[740px] desktop:px-[50px] desktop:py-12',
        )}
      >
        <div
          className={cn('flex w-full flex-col items-center', 'tablet:gap-2')}
        >
          <h1 className={cn('flex h-[84px] items-center', 'tablet:h-[100px]')}>
            <ImgLogoText
              role="img"
              aria-label="무빙"
              className={cn(
                'h-[44px] w-[85px]',
                'tablet:h-[55px] tablet:w-[107px]',
              )}
            />
          </h1>
          <AuthLinkText
            text={config.switchText}
            linkLabel={config.switchLabel}
            href={switchHref}
          />
        </div>

        <div className={cn('mt-10 w-full', 'tablet:mt-12')}>{children}</div>

        <div className="mt-12">
          <SocialLoginButtons role={role} />
        </div>

        <Image
          src={config.illustration}
          alt=""
          aria-hidden
          sizes="(min-width: 1024px) 392px, 240px"
          className={cn(
            'pointer-events-none absolute hidden object-contain tablet:block',
            config.illustrationClassName,
          )}
        />
      </div>
    </section>
  );
}
