// 기사님 배지 + 닉네임
import Image from 'next/image';

import IcMoverBadge from '@/assets/icons/ic_driver.png';

import { cn } from '@/utils/cn';

interface MoverNicknameProps {
  nickname: string;
  className?: string;
}

export default function MoverNickname({
  nickname,
  className,
}: MoverNicknameProps) {
  return (
    <div className={cn('flex items-center gap-[4px]', className)}>
      {/* TODO: 이미지 확인 - svg 이미지 파일 이슈로 png 이미지 파일 사용 */}
      <Image
        src={IcMoverBadge}
        alt="Mover Badge"
        className={cn('h-[23px] w-[20px]', 'tablet:w-[28px] tablet:h-[32px]')}
      />

      <p
        className={cn(
          'text-lg-semibold text-black-300',
          'tablet:text-2lg-semibold',
        )}
      >
        {nickname}
      </p>
    </div>
  );
}
