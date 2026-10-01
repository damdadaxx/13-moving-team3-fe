// [페이지] 마이페이지 컨테츠 컴포넌트

'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import IcWriting from '@/assets/icons/ic_writing.svg';
import IcWritingGray from '@/assets/icons/ic_writing_gray.svg';
import ImgDefaultProfile from '@/assets/images/img_default_profile.png';

import { HttpError } from '@/lib/api/errors';
import { ROUTES } from '@/lib/constants/routes';

import { useAuth } from '@/hooks/auth/useAuth';
import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useMoverDetailQuery } from '@/hooks/queries/mover/queries';

import { cn } from '@/utils/cn';

import LikeButton from '@/components/common/MoverDetail/LikeButton';
import MoverNickname from '@/components/common/MoverProfile/MoverNickname';
import MoverReviewInfo from '@/components/common/MoverReview/MoverReviewInfo';
import MoverReviewList from '@/components/common/MoverReview/MoverReviewList';
import ServiceRegionList from '@/components/common/ServiceRegion/ServiceRegionList';
import ServiceTypeList from '@/components/common/ServiceType/ServiceTypeList';
import Button from '@/components/ui/Button/Button';
import EmptyState from '@/components/ui/EmptyState';
import LoadingDisplay from '@/components/ui/LoadingDisplay';
import Modal from '@/components/ui/Modal/Modal';
import PageBanner from '@/components/ui/PageBanner';

function ButtonGroup({ className }: { className?: string }) {
  const currentBreakpoint = useBreakpointValue('sm', 'lg', 'lg');

  return (
    <section
      className={cn(
        'flex flex-col gap-[12px]',
        'tablet:flex-row-reverse tablet:gap-[16px]',
        'desktop:flex-col desktop:gap-[16px]',
        className,
      )}
    >
      <Button
        href={ROUTES.moverProfileEdit}
        icon={<IcWriting />}
        size={currentBreakpoint}
      >
        내 프로필 수정
      </Button>
      <Button
        href={ROUTES.moverAccount}
        icon={<IcWritingGray />}
        size={currentBreakpoint}
        variant="outlined"
        color="gray"
      >
        기본 정보 수정
      </Button>
    </section>
  );
}

/**
 * @ 기사님 프로필 미등록 체크
 * - 404면 모달로 등록 안내, 등록/취소에 따라 이동, 다른 에러는 빈 화면 유지
 */
function isMoverProfileNotFound(error: unknown): boolean {
  return error instanceof HttpError && error.status === 404;
}

export default function MoverMypageContent() {
  const router = useRouter();
  const modalButtonSize = useBreakpointValue('sm', 'sm', 'md');
  const { user: moverUser } = useAuth();
  const {
    data: mover,
    error,
    isPending,
    isError,
  } = useMoverDetailQuery(moverUser?.id ?? '');

  const isProfileMissing = isMoverProfileNotFound(error);

  function leaveMypage() {
    router.replace(ROUTES.moverHome);
  }

  if (isPending) {
    return <LoadingDisplay />;
  }

  // 기사님 프로필 미등록 체크
  if (isProfileMissing) {
    return (
      <>
        <LoadingDisplay />
        <Modal
          isOpen
          onClose={leaveMypage}
          title="프로필 등록"
          variant="popup"
          buttons={
            <>
              <Button
                variant="outlined"
                size={modalButtonSize}
                className="flex-1"
                onClick={leaveMypage}
              >
                취소
              </Button>
              <Button
                size={modalButtonSize}
                className="flex-1"
                onClick={() => router.replace(ROUTES.moverProfileNew)}
              >
                프로필 등록하기
              </Button>
            </>
          }
        >
          <p className="text-2lg-medium text-black-300">
            마이페이지를 이용하려면 프로필 등록이 필요해요.
            <br />
            프로필 등록 페이지로 이동할까요?
          </p>
        </Modal>
      </>
    );
  }

  /*
  @ 기사님 정보 조회 실패
  - isError는 404가 아닌 조회 실패(네트워크, 500)
  - !mover는 프로필 유무가 아니라, 그릴 객체가 없어 mover를 좁히기 위한 조건
  */
  if (isError || !mover) {
    return <EmptyState message="기사님 정보를 찾을 수 없어요." />;
  }

  return (
    <main className={cn('bg-gray-50 pb-[28px]', 'desktop:pb-[126px]')}>
      {/* 배너 섹션 */}
      <PageBanner />

      {/* 정보 섹션 */}
      <section
        className={cn(
          'px-[20px] pt-[23px]',
          'tablet:px-[72px] tablet:pt-[46px]',
          'desktop:pt-[43px]',
        )}
      >
        <div
          className={cn(
            'desktop:flex desktop:gap-[96px] max-w-[1200px] mx-auto',
          )}
        >
          {/* 기사님 정보 섹션 */}
          <div className="flex-1">
            {/* 프로필 이미지 + 닉네임 + 찜하기 */}
            <div className={cn('flex items-end gap-[12px] mb-[16px]')}>
              {/* 프로필 이미지 */}
              <div
                className={cn(
                  'relative w-[60px] h-[64px] rounded-[12px] overflow-hidden',
                  'tablet:w-[80px] tablet:h-[85px] tablet:rounded-[20px]',
                )}
              >
                <Image
                  src={mover.imgUrl || ImgDefaultProfile.src}
                  alt={`${mover.nickname} 프로필 사진`}
                  fill
                  sizes="(min-width: 744px) 80px, 60px"
                  className={cn('object-cover')}
                />
              </div>
              <div className={cn('flex flex-col', 'tablet:gap-[8px]')}>
                {/* 기사님 닉네임 */}
                <MoverNickname nickname={mover.nickname} />
                {/* 찜하기 */}
                <LikeButton
                  variant="count"
                  iconFirst={true}
                  readOnly={true}
                  moverId={mover.id}
                  likeCount={mover.likeCount}
                />
              </div>
            </div>

            {/* 기사님 한줄 소개 + 소개글 */}
            <div
              className={cn(
                'pb-[28px]',
                'tablet:pb-[32px]',
                'desktop:mb-[32px] desktop:border-b desktop:border-line-100',
              )}
            >
              <h1
                className={cn(
                  'mb-[12px] text-2lg-semibold text-black-300',
                  'tablet:text-2lg-semibold',
                )}
              >
                {mover.shortIntro}
              </h1>
              <p
                className={cn(
                  'text-md-regular text-gray-500',
                  'tablet:text-lg-regular',
                )}
              >
                {mover.description}
              </p>
            </div>

            {/* 서비스 정보 + 리뷰 섹션 */}
            <div
              className={cn(
                'flex flex-col gap-[24px] min-w-0 ',
                'tablet:gap-[32px]',
                'desktop:flex-1 desktop:gap-[40px]',
              )}
            >
              {/* 모바일 버튼 그룹 섹션 */}
              <ButtonGroup
                className={cn(
                  'desktop:hidden pb-[24px] border-b border-line-100',
                  'tablet:pb-[32px] ',
                )}
              />

              {/* 진행/리뷰/경력 정보 */}
              <MoverReviewInfo
                label="활동 현황"
                variant="mypage"
                confirmedCount={mover.confirmedCount}
                averageRating={mover.averageRating}
                careerMonths={mover.careerMonths}
              />

              {/* 제공 서비스 */}
              <ServiceTypeList serviceTypes={mover.serviceTypes} />

              {/* 서비스 가능 지역 */}
              <ServiceRegionList
                serviceRegions={mover.serviceRegions}
                className={cn(
                  'pb-[24px] border-b border-line-100',
                  'tablet:pb-[32px]',
                  'desktop:pb-[40px]',
                )}
              />

              {/* 리뷰섹션 */}
              <MoverReviewList
                key={moverUser?.id}
                moverId={moverUser?.id ?? ''}
              />
            </div>
          </div>

          {/* 데스크탑 버튼 그룹 섹션 */}
          <ButtonGroup
            className={cn(
              'hidden',
              'desktop:flex desktop:w-[320px] desktop:min-w-[320px] desktop:px-0 desktop:pt-[70px]',
            )}
          />
        </div>
      </section>
    </main>
  );
}
