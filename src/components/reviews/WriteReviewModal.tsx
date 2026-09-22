'use client';

import { useState } from 'react';

import type { PendingReview } from '@/types/review';
import Image from 'next/image';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';
import IcDriver from '@/assets/icons/ic_driver.svg';
import IcDriverMark from '@/assets/icons/ic_driver_mark.svg';
import IcStar from '@/assets/icons/ic_star.svg';
import ImgMoverCharacter from '@/assets/images/img_mover_character.png';

import { HttpError } from '@/lib/api/errors';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useToast } from '@/hooks/common/useToast';
import { useCreateReviewMutation } from '@/hooks/queries/reviews/mutations';

import { cn } from '@/utils/cn';
import formatDate from '@/utils/formatDate';

import Button from '@/components/ui/Button/Button';
import Textarea from '@/components/ui/Form/Textarea';
import Modal from '@/components/ui/Modal/Modal';
import ServiceTypeTag from '@/components/ui/Tag/ServiceTypeTag';

interface WriteReviewModalProps {
  review: PendingReview | null;
  isOpen: boolean;
  onClose: () => void;
}

const MIN_COMMENT_LENGTH = 10;
const STAR_COUNT = 5;

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-xs-regular text-gray-500 desktop:text-md-regular">
        {label}
      </span>
      <span className="text-sm-medium whitespace-nowrap text-black-500 desktop:text-lg-regular">
        {value}
      </span>
    </div>
  );
}

export default function WriteReviewModal({
  review,
  isOpen,
  onClose,
}: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const tagSize = useBreakpointValue('sm', 'sm', 'md');
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');
  const { showToast } = useToast();
  const createReviewMutation = useCreateReviewMutation();
  //이미지 없으면 기본 이미지.
  const profileImageSrc = review?.imgUrl ?? ImgMoverCharacter;
  const isValid = rating > 0 && comment.trim().length >= MIN_COMMENT_LENGTH;
  const isSubmitting = createReviewMutation.isPending;

  function handleSubmit() {
    if (!isValid || !review || isSubmitting) return;

    createReviewMutation.mutate(
      {
        estimateId: review.id,
        content: comment.trim(),
        rating,
      },
      {
        onSuccess: () => {
          showToast('리뷰가 등록되었어요.');
          onClose();
        },
        onError: (error) => {
          const message =
            error instanceof HttpError
              ? error.message
              : '리뷰 등록에 실패했어요. 다시 시도해주세요.';
          showToast(message);
        },
      },
    );
  }

  if (!review) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="리뷰 쓰기"
      variant="sheet"
      buttons={
        <Button
          size={buttonSize}
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          리뷰 등록
        </Button>
      }
    >
      <div className="flex w-full flex-col gap-[28px] desktop:gap-[32px]">
        <div className="flex flex-col gap-[14px] desktop:gap-[16px]">
          <div className="flex flex-wrap items-center gap-[8px] desktop:gap-[12px]">
            <ServiceTypeTag
              variant="service"
              serviceType={review.serviceType}
              size={tagSize}
            />
            {review.isDesignated ? (
              <ServiceTypeTag variant="designatedEstimate" size={tagSize} />
            ) : null}
          </div>

          <div className="flex flex-col gap-[12px] desktop:gap-[16px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-start justify-center gap-[4px]">
                <span className="relative flex h-[18.2px] w-[16px] shrink-0 items-center justify-center">
                  <IcDriver
                    aria-hidden="true"
                    className="h-[17.5px] w-[15.4px]"
                  />
                  <IcDriverMark
                    aria-hidden="true"
                    className="absolute top-[calc(50%-0.14px)] left-1/2 h-[5.8px] w-[11.1px] -translate-x-1/2 -translate-y-1/2"
                  />
                </span>
                <p className="text-lg-semibold flex items-center gap-[4px] text-black-300 desktop:text-2lg-semibold">
                  <span>{review.moverName}</span>
                  <span>기사님</span>
                </p>
              </div>
              <div className="relative size-[50px] shrink-0 overflow-hidden rounded-[12px] bg-black-300">
                <Image
                  src={profileImageSrc}
                  alt=""
                  fill
                  unoptimized={typeof profileImageSrc === 'string'}
                  className="object-cover object-[center_20%]"
                  sizes="50px"
                />
              </div>
            </div>

            <div className="h-px w-full bg-line-100" />

            <div className="flex items-start justify-between desktop:justify-start desktop:gap-[40px]">
              <div className="flex items-end gap-[12px]">
                <MetaItem label="출발지" value={review.fromRegion} />
                <IcArrowRight
                  aria-hidden="true"
                  className="h-[23px] w-[12px] shrink-0 desktop:w-[16px]"
                />
                <MetaItem label="도착지" value={review.toRegion} />
              </div>
              <MetaItem
                label="이사일"
                value={formatDate(review.moveDate, 'korean')}
              />
            </div>

            <div className="h-px w-full bg-line-100" />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <p className="text-lg-semibold text-black-300 desktop:text-2lg-semibold">
            평점을 선택해 주세요
          </p>
          {/* 배열로 별점 컴포넌트 만들기 */}
          <div className="flex items-start" role="radiogroup" aria-label="평점">
            {Array.from({ length: STAR_COUNT }, (_, index) => {
              const starValue = index + 1;
              const isActive = starValue <= rating;

              return (
                <button
                  key={starValue}
                  type="button"
                  role="radio"
                  aria-checked={rating === starValue}
                  aria-label={`${starValue}점`}
                  onClick={() => setRating(starValue)}
                  className="cursor-pointer size-[24px] desktop:size-[36px]"
                >
                  <IcStar
                    aria-hidden="true"
                    className={cn(
                      'size-[20px] desktop:size-[30px]',
                      isActive
                        ? '[&_path]:fill-yellow-100'
                        : '[&_path]:fill-gray-100',
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          id="write-review-comment"
          label="상세 후기를 작성해 주세요"
          labelVariant="modal"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="최소 10자 이상 입력해주세요"
        />
      </div>
    </Modal>
  );
}
