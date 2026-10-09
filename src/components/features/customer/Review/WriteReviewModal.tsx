'use client';

import { useState } from 'react';

import type { PendingReview } from '@/types/review';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';
import IcDriverMark from '@/assets/icons/ic_driver.png';
import IcStar from '@/assets/icons/ic_star.svg';

import { HttpError } from '@/lib/api/errors';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useToast } from '@/hooks/common/useToast';
import { useCreateReviewMutation } from '@/hooks/features/review/queries/mutations';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import Textarea from '@/components/ui/Form/Textarea';
import Modal from '@/components/ui/Modal';
import ProfileImage from '@/components/ui/ProfileImage';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

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
  const t = useTranslations('CustomerReviews');
  const tReview = useTranslations('Review');
  const tCard = useTranslations('MoverCard');
  const tEstimate = useTranslations('Estimate');
  const formatDateLocale = useFormatDate();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const tagSize = useBreakpointValue('sm', 'sm', 'md');
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');
  const { showToast } = useToast();
  const createReviewMutation = useCreateReviewMutation();
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
          showToast(t('created'));
          handleClose();
        },
        onError: (error) => {
          const message =
            error instanceof HttpError ? error.message : t('createFailed');
          showToast(message);
        },
      },
    );
  }

  function handleClose() {
    setRating(0);
    setComment('');
    onClose();
  }

  if (!review) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={t('modalTitle')}
      variant="sheet"
      buttons={
        <Button
          size={buttonSize}
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
          onClick={handleSubmit}
        >
          {t('submit')}
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
                  <Image
                    src={IcDriverMark}
                    alt=""
                    aria-hidden="true"
                    fill
                    className="object-contain"
                  />
                </span>
                <p className="text-lg-semibold flex items-center gap-[4px] text-black-300 desktop:text-2lg-semibold">
                  <span>
                    {tCard('nickname', { nickname: review.moverName })}
                  </span>
                </p>
              </div>
              <ProfileImage
                imageUrl={review.imgUrl}
                className="size-[50px]"
                sizes="50px"
              />
            </div>

            <div className="h-px w-full bg-line-100" />

            <div className="flex items-start justify-between desktop:justify-start desktop:gap-[40px]">
              <div className="flex items-end gap-[12px]">
                <MetaItem
                  label={tEstimate('departure')}
                  value={review.fromRegion}
                />
                <IcArrowRight
                  aria-hidden="true"
                  className="h-[23px] w-[12px] shrink-0 desktop:w-[16px]"
                />
                <MetaItem
                  label={tEstimate('arrival')}
                  value={review.toRegion}
                />
              </div>
              <MetaItem
                label={tEstimate('moveDate')}
                value={formatDateLocale(review.moveDate, 'korean')}
              />
            </div>

            <div className="h-px w-full bg-line-100" />
          </div>
        </div>

        <div className="flex flex-col gap-[12px]">
          <p className="text-lg-semibold text-black-300 desktop:text-2lg-semibold">
            {t('ratingTitle')}
          </p>
          {/* 배열로 별점 컴포넌트 만들기 */}
          <div
            className="flex items-start"
            role="radiogroup"
            aria-label={t('ratingAria')}
          >
            {Array.from({ length: STAR_COUNT }, (_, index) => {
              const starValue = index + 1;
              const isActive = starValue <= rating;

              return (
                <button
                  key={starValue}
                  type="button"
                  role="radio"
                  aria-checked={rating === starValue}
                  aria-label={tReview('ratingAria', { value: starValue })}
                  onClick={() => setRating(starValue)}
                  className="size-[24px] cursor-pointer overflow-hidden desktop:size-[36px]"
                >
                  {/* 별점 아이콘 사이즈 조절 */}
                  <IcStar
                    aria-hidden="true"
                    className={cn(
                      'size-full scale-[1.2]',
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
          label={t('commentLabel')}
          labelVariant="modal"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={t('commentPlaceholder')}
        />
      </div>
    </Modal>
  );
}
