'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import type { PendingReview } from '@/types/review';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { z } from 'zod';

import IcArrowRight from '@/assets/icons/ic_arrow_right.svg';
import IcDriverMark from '@/assets/icons/ic_driver.png';
import IcInfo from '@/assets/icons/ic_info.svg';
import IcStar from '@/assets/icons/ic_star.svg';

import { HttpError, isAbortError } from '@/lib/api/errors';
import {
  MESSAGE_TEXT_MIN_LENGTH,
  messageTextSchema,
} from '@/lib/validations/messageTextValidation';

import { useBreakpointValue } from '@/hooks/common/useBreakpointValue';
import { useFormatDate } from '@/hooks/common/useFormatDate';
import { useToast } from '@/hooks/common/useToast';
import {
  AI_DAILY_LIMIT_CODE,
  useAiUsageQuery,
} from '@/hooks/features/ai/queries/queries';
import {
  useCreateReviewDraftMutation,
  useCreateReviewMutation,
} from '@/hooks/features/review/queries/mutations';

import { cn } from '@/utils/cn';

import Button from '@/components/ui/Button/Button';
import FormTextarea from '@/components/ui/Form/FormTextarea';
import Label from '@/components/ui/Form/Label';
import Modal from '@/components/ui/Modal';
import ProfileImage from '@/components/ui/ProfileImage';
import ServiceTypeTag from '@/components/ui/ServiceTypeTag';

interface WriteReviewModalProps {
  review: PendingReview | null;
  isOpen: boolean;
  onClose: () => void;
}

const reviewFormSchema = z.object({ comment: messageTextSchema });
type ReviewFormValues = z.infer<typeof reviewFormSchema>;
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
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { isValid: isCommentValid },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    mode: 'onTouched',
    defaultValues: { comment: '' },
  });
  const tagSize = useBreakpointValue('sm', 'sm', 'md');
  const buttonSize = useBreakpointValue('sm', 'sm', 'lg');
  const { showToast } = useToast();
  const createReviewMutation = useCreateReviewMutation();
  const createReviewDraftMutation = useCreateReviewDraftMutation();
  const isValid = rating > 0 && isCommentValid;
  const isSubmitting = createReviewMutation.isPending;
  const isDrafting = createReviewDraftMutation.isPending;
  //오늘 남은 초안 생성 횟수 (하루 5회, 자정 초기화). 리뷰 모달은 로그인 고객만 연다.
  const { data: aiUsage } = useAiUsageQuery(isOpen);
  const draftUsage = aiUsage?.reviewDraft;
  const isDraftExhausted = draftUsage?.remaining === 0;
  //리뷰초안 작성 언어를 위해 현재 언어를 가져온다.
  const locale = useLocale();

  //리뷰 초안 생성 취소를 위한 AbortController 를 ref로 연결
  const draftAbortRef = useRef<AbortController | null>(null);

  //리뷰 초안 생성 취소
  function abortDraft() {
    draftAbortRef.current?.abort();
    draftAbortRef.current = null;
  }

  useEffect(() => {
    return () => {
      draftAbortRef.current?.abort();
    };
  }, []);

  function onSubmit({ comment }: ReviewFormValues) {
    if (rating <= 0 || !review || isSubmitting) return;

    createReviewMutation.mutate(
      {
        estimateId: review.id,
        content: comment,
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

  //리뷰 초안 생성
  function getDraftErrorMessage(error: unknown) {
    if (error instanceof HttpError) {
      if (error.code === AI_DAILY_LIMIT_CODE) return t('draftExhausted');
      if (error.code === 'TOO_MANY_REQUESTS') return t('draftTooMany');
      //남의 견적서·이미 리뷰가 있는 견적서 등 서버가 알려준 사유
      if (error.status === 400 || error.status === 403) return error.message;
    }
    return t('draftFailed');
  }

  function handleDraft() {
    if (rating <= 0 || !review || isDrafting) return;
    if (isDraftExhausted) {
      showToast(t('draftExhausted'));
      return;
    }

    //이전 요청이 있으면 끊는다.
    abortDraft();
    //새로운 요청을 위해 새로운 AbortController 생성
    const controller = new AbortController();
    //생성한 AbortController를 ref에 연결
    draftAbortRef.current = controller;

    createReviewDraftMutation.mutate(
      {
        estimateId: review.id,
        rating,
        locale: locale,
        signal: controller.signal,
      },
      {
        onSuccess: (data) => {
          setValue('comment', data.content, { shouldValidate: true });
        },
        onError: (error) => {
          //모달을 닫아서 끊은건 에러가 아니다.
          if (isAbortError(error)) return;
          showToast(getDraftErrorMessage(error));
        },
      },
    );
  }

  function handleClose() {
    abortDraft();
    createReviewDraftMutation.reset();
    setRating(0);
    reset();
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
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
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
                    sizes="16px"
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

        <div className="flex w-full flex-col">
          <div
            className={cn(
              'mb-[16px] flex w-full flex-wrap items-center justify-between gap-x-[12px] gap-y-[8px]',
            )}
          >
            <Label
              htmlFor="write-review-comment"
              variant="modal"
              className="mb-0"
            >
              {t('commentLabel')}
            </Label>
            <div className="flex shrink-0 items-center gap-[6px]">
              <button
                type="button"
                disabled={rating <= 0 || isDrafting || isDraftExhausted}
                aria-busy={isDrafting || undefined}
                title={isDraftExhausted ? t('draftExhausted') : undefined}
                onClick={handleDraft}
                className={cn(
                  'cursor-pointer rounded-full border border-orange-400 bg-transparent px-[12px] py-[6px] text-xs-medium whitespace-nowrap text-orange-400',
                  'desktop:px-[14px] desktop:text-sm-medium',
                  'hover:bg-orange-100',
                  'disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent',
                )}
              >
                {isDrafting ? t('draftPending') : t('draft')}
              </button>
              {draftUsage ? (
                <span className="text-xs-regular whitespace-nowrap text-gray-500">
                  {t('draftRemaining', {
                    remaining: draftUsage.remaining,
                    limit: draftUsage.limit,
                  })}
                </span>
              ) : null}
              <span className="group/hint relative inline-flex">
                <button
                  type="button"
                  aria-label={`${t('draftHintActivate')} ${t('draftHint')}`}
                  className="inline-flex size-[24px] cursor-help items-center justify-center"
                >
                  <IcInfo
                    aria-hidden
                    className="size-[20px] overflow-visible"
                  />
                </button>
                <span
                  role="tooltip"
                  className={cn(
                    'pointer-events-none invisible absolute top-[calc(100%+8px)] right-0 z-20 w-[240px]',
                    'rounded-[8px] bg-black-400 px-[12px] py-[10px] text-left text-xs-medium text-gray-50',
                    'shadow-[0_4px_12px_rgba(0,0,0,0.12)]',
                    'group-hover/hint:visible group-focus-within/hint:visible',
                  )}
                >
                  <ul className="flex flex-col gap-[6px]">
                    <li className="flex gap-[6px]">
                      <span aria-hidden="true">•</span>
                      <span>{t('draftHintActivate')}</span>
                    </li>
                    <li className="flex gap-[6px]">
                      <span aria-hidden="true">•</span>
                      <span>{t('draftHint')}</span>
                    </li>
                  </ul>
                </span>
              </span>
            </div>
          </div>
          <FormTextarea
            control={control}
            name="comment"
            id="write-review-comment"
            labelVariant="modal"
            disabled={isDrafting}
            placeholder={t('commentPlaceholder')}
            minLength={MESSAGE_TEXT_MIN_LENGTH}
          />
        </div>
      </div>
    </Modal>
  );
}
