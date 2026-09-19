import { cn } from '@/utils/cn';

import ButtonLikeMover from '@/components/common/MoverDetail/ButtonLikeMover';
import Button from '@/components/ui/Button/Button';

export default function MoverActionButtonGroup({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn('w-full', className)}>
      <p className="mb-[16px] text-2lg-semibold text-black-400">
        김코드 기사님에게
        <br />
        지정 견적을 요청해보세요!
      </p>
      <div className="flex w-full flex-col gap-[16px]">
        <Button variant="solid" size="lg">
          지정 견적 요청하기
        </Button>
        <ButtonLikeMover />
      </div>
    </div>
  );
}
