// SNS 간편 가입 버튼 (구글 / 카카오 / 네이버)
// Figma: img/login_01
import type { SocialProvider } from '@/types/auth';

import IcLoginGoogle from '@/assets/icons/ic_login_google.svg';
import IcLoginKakao from '@/assets/icons/ic_login_kakao.svg';
import IcLoginNaver from '@/assets/icons/ic_login_naver.svg';

const SOCIAL_BUTTONS = [
  { provider: 'google', Icon: IcLoginGoogle, label: '구글로 시작하기' },
  { provider: 'kakao', Icon: IcLoginKakao, label: '카카오로 시작하기' },
  { provider: 'naver', Icon: IcLoginNaver, label: '네이버로 시작하기' },
] as const satisfies ReadonlyArray<{
  provider: SocialProvider;
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
}>;

export default function SocialLoginButtons() {
  return (
    <section className="flex flex-col items-center gap-6 tablet:gap-8">
      <h2 className="text-xs-regular text-black-100 tablet:text-xl-regular tablet:text-black-200">
        SNS 계정으로 간편 가입하기
      </h2>
      <ul className="flex gap-6 tablet:gap-8">
        {SOCIAL_BUTTONS.map(({ provider, Icon, label }) => (
          <li key={provider}>
            {/* TODO: 소셜 로그인 연동 (OAuth 인가 요청 → 콜백에서 socialLogin 호출) */}
            <button
              type="button"
              aria-label={label}
              className="block size-[54px] cursor-pointer overflow-hidden rounded-full tablet:size-[72px]"
            >
              <Icon className="size-full" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
