'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

import { Skeleton } from '@/components/ui/Skeleton';

interface CustomerProfileSkeletonProps {
  mode: 'create' | 'edit';
  /** 소셜 최초 등록일 때만 전화번호 입력이 보인다. */
  showPhoneNumber?: boolean;
}

function Divider({ mobileOnly = false }: { mobileOnly?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn('h-px w-full bg-line-100', mobileOnly && 'desktop:hidden')}
    />
  );
}

function FieldSkeleton({ isSmall = false }: { isSmall?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <Skeleton width={88} height={20} />
      <Skeleton
        height={54}
        borderRadius={16}
        className={isSmall ? undefined : 'desktop:h-[64px]!'}
      />
    </div>
  );
}

function ProfileImageSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <Skeleton width={96} height={22} />
      <Skeleton
        width={100}
        height={100}
        borderRadius={6}
        className="desktop:size-[160px]!"
      />
      <Skeleton width="82%" height={16} />
      <Skeleton width="72%" height={16} />
    </div>
  );
}

function SelectionSkeleton({ isRegion = false }: { isRegion?: boolean }) {
  const widths = isRegion ? [72, 84, 64, 76] : [88, 104, 92];

  return (
    <div className="flex min-w-0 flex-col gap-[8px]">
      <Skeleton width={108} height={22} />
      <Skeleton width="76%" height={16} />
      <div className="mt-[16px] flex flex-wrap gap-[8px]">
        {widths.map((width, index) => (
          <Skeleton
            key={index}
            width={width}
            height={36}
            borderRadius={100}
            className="desktop:h-[46px]!"
          />
        ))}
      </div>
    </div>
  );
}

/*
@ 고객 프로필 등록·수정 첫 조회 화면
- 실제 폼의 폭·열 배치와 입력 순서를 따라 로딩 중 화면 이동을 줄인다.
- 입력처럼 보이지만 조작할 수 있는 컨트롤은 만들지 않는다.
- 서버 데이터가 없는 최초 조회에서만 페이지가 이 컴포넌트를 사용한다.
*/
export default function CustomerProfileSkeleton({
  mode,
  showPhoneNumber = false,
}: CustomerProfileSkeletonProps) {
  const t = useTranslations('Common');
  const isEditMode = mode === 'edit';

  return (
    <main className="w-full bg-gray-50" aria-busy="true">
      <span className="sr-only" role="status">
        {t('loading')}
      </span>

      {isEditMode ? (
        <div
          aria-hidden="true"
          className="flex w-full flex-col gap-[32px] px-[24px] pt-[16px] pb-[24px] desktop:mt-[38px] desktop:gap-[64px] desktop:px-[72px] desktop:pt-[32px] desktop:pb-[40px]"
        >
          <div className="mx-auto flex w-full flex-col gap-[32px] desktop:max-w-[1200px] desktop:gap-[40px]">
            <Skeleton width={140} height={26} className="desktop:h-[46px]!" />
            <div className="flex flex-col gap-[20px] desktop:gap-[40px]">
              <Divider />
              <div className="grid grid-cols-1 items-start gap-[20px] desktop:grid-cols-2 desktop:gap-x-[clamp(40px,6.25vw,120px)]">
                <div className="flex min-w-0 flex-col gap-[20px] desktop:gap-[32px]">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-[20px] desktop:gap-[32px]"
                    >
                      <FieldSkeleton isSmall={index === 1 || index >= 3} />
                      {index < 5 && (
                        <Divider
                          mobileOnly={index === 0 || index === 1 || index === 4}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex min-w-0 flex-col gap-[20px] desktop:gap-[32px]">
                  <ProfileImageSkeleton />
                  <Divider />
                  <SelectionSkeleton />
                  <Divider />
                  <SelectionSkeleton isRegion />
                </div>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col gap-[8px] desktop:ml-auto desktop:max-w-[500px] desktop:flex-row desktop:gap-[20px]">
            <Skeleton
              height={54}
              borderRadius={12}
              className="desktop:h-[60px]! desktop:flex-1"
            />
            <Skeleton
              height={54}
              borderRadius={12}
              className="desktop:h-[60px]! desktop:flex-1"
            />
          </div>
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="mx-auto flex w-full max-w-[327px] flex-col gap-[32px] px-[24px] pt-[16px] pb-[40px] tablet:pt-[40px] desktop:max-w-[640px] desktop:gap-[56px] desktop:pt-[56px]"
        >
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[16px] desktop:gap-[28px]">
              <Skeleton width={140} height={26} className="desktop:h-[46px]!" />
              <Skeleton width="80%" height={18} className="desktop:h-[28px]!" />
              <Divider />
            </div>
            <div className="flex flex-col gap-[20px] desktop:gap-[32px]">
              {showPhoneNumber && (
                <>
                  <FieldSkeleton />
                  <Divider />
                </>
              )}
              <ProfileImageSkeleton />
              <Divider />
              <SelectionSkeleton />
              <Divider />
              <SelectionSkeleton isRegion />
            </div>
          </div>
          <Skeleton
            height={54}
            borderRadius={12}
            className="desktop:h-[64px]!"
          />
        </div>
      )}
    </main>
  );
}
