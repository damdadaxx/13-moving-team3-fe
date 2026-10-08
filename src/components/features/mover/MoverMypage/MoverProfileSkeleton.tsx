'use client';

import { useTranslations } from 'next-intl';

import { Skeleton } from '@/components/ui/Skeleton';

interface MoverProfileSkeletonProps {
  mode: 'create' | 'edit';
  /** 소셜 최초 등록일 때만 전화번호 입력이 보인다. */
  showPhoneNumber?: boolean;
}

function Divider() {
  return <div aria-hidden="true" className="h-px w-full bg-line-100" />;
}

function FieldSkeleton() {
  return (
    <div className="flex min-w-0 flex-col gap-[12px]">
      <Skeleton width={88} height={22} />
      <Skeleton height={54} borderRadius={16} className="desktop:h-[64px]!" />
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
      <Skeleton width="84%" height={16} />
      <Skeleton width="74%" height={16} />
    </div>
  );
}

function ChipSectionSkeleton({ isRegion = false }: { isRegion?: boolean }) {
  const widths = isRegion ? [68, 84, 76, 64] : [94, 102, 88];

  return (
    <div className="flex min-w-0 flex-col gap-[16px]">
      <Skeleton width={120} height={22} />
      <div className="flex flex-wrap gap-[8px]">
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
@ 기사님 프로필 등록·수정 첫 조회 화면
- 두 페이지가 MoverProfileForm을 공유하므로 같은 뼈대에서 제목·전화번호·버튼만 구분한다.
- 프로필 조회가 끝나기 전에는 입력 가능한 빈 폼 대신 이 자리표시를 보여준다.
- 저장 요청 중에는 사용하지 않고 기존 버튼 로딩 상태를 유지한다.
*/
export default function MoverProfileSkeleton({
  mode,
  showPhoneNumber = false,
}: MoverProfileSkeletonProps) {
  const t = useTranslations('Common');
  const isEditMode = mode === 'edit';

  return (
    <main className="w-full bg-gray-50" aria-busy="true">
      <span className="sr-only" role="status">
        {t('loading')}
      </span>

      <div
        aria-hidden="true"
        className="mx-auto flex w-full max-w-[327px] flex-col gap-[24px] pt-[16px] pb-[40px] desktop:max-w-[1200px] desktop:gap-[48px] desktop:px-[40px] desktop:pt-[32px]"
      >
        <div className="flex flex-col gap-[16px] desktop:gap-[32px]">
          <Skeleton width={180} height={26} className="desktop:h-[46px]!" />
          {!isEditMode && (
            <Skeleton width="82%" height={18} className="desktop:h-[28px]!" />
          )}
        </div>

        <Divider />

        <div className="grid grid-cols-1 gap-[20px] desktop:grid-cols-2 desktop:gap-[40px]">
          <div className="flex min-w-0 flex-col gap-[20px] desktop:w-full desktop:max-w-[500px] desktop:gap-[32px]">
            {!isEditMode && showPhoneNumber && (
              <>
                <FieldSkeleton />
                <Divider />
              </>
            )}
            <ProfileImageSkeleton />
            <Divider />
            <FieldSkeleton />
            <Divider />
            <div className="flex flex-col gap-[16px]">
              <Skeleton width={72} height={22} />
              <div className="grid grid-cols-2 gap-[8px] desktop:gap-[12px]">
                <Skeleton
                  height={54}
                  borderRadius={16}
                  className="desktop:h-[64px]!"
                />
                <Skeleton
                  height={54}
                  borderRadius={16}
                  className="desktop:h-[64px]!"
                />
              </div>
            </div>
            <Divider />
            <FieldSkeleton />
          </div>

          <div className="flex min-w-0 flex-col gap-[20px] desktop:w-full desktop:max-w-[500px] desktop:justify-self-end desktop:gap-[32px]">
            <div className="desktop:hidden">
              <Divider />
            </div>
            <div className="flex flex-col gap-[12px]">
              <Skeleton width={96} height={22} />
              <Skeleton height={150} borderRadius={16} />
            </div>
            <Divider />
            <ChipSectionSkeleton />
            <Divider />
            <ChipSectionSkeleton isRegion />
          </div>
        </div>

        <div className="flex w-full flex-col gap-[12px] desktop:ml-auto desktop:max-w-[500px]">
          <div
            className={
              isEditMode
                ? 'flex flex-col gap-[8px] desktop:flex-row desktop:gap-[20px]'
                : ''
            }
          >
            <Skeleton
              height={54}
              borderRadius={12}
              className="desktop:h-[60px]! desktop:flex-1"
            />
            {isEditMode && (
              <Skeleton
                height={54}
                borderRadius={12}
                className="desktop:h-[60px]! desktop:flex-1"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
