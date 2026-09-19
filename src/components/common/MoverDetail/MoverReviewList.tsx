import { cn } from '@/utils/cn';

import MoverReviewItem from '@/components/common/MoverDetail/MoverReviewItem';
import MoverReviewSummary from '@/components/common/MoverDetail/MoverReviewSummary';

const REVIEW_CONTENT = `듣던대로 정말 친절하시고 물건도 잘 옮겨주셨어요!
나중에 또 짐 옮길 일 있으면 김코드 기사님께 부탁드릴 예정입니다!!
비 오는데 꼼꼼히 잘 해주셔서 감사드립니다 :)`;

// TODO: 기사님 리뷰 목록 조회
const REVIEW_LIST = [
  {
    id: 1,
    nickname: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content: REVIEW_CONTENT,
  },
  {
    id: 2,
    nickname: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content: REVIEW_CONTENT,
  },
  {
    id: 3,
    nickname: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content: REVIEW_CONTENT,
  },
  {
    id: 4,
    nickname: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content: REVIEW_CONTENT,
  },
  {
    id: 5,
    nickname: 'kim****',
    createdAt: '2024-07-01',
    rating: 5,
    content: REVIEW_CONTENT,
  },
] as const;

const RATING_DISTRIBUTION = [
  { score: 5, count: 170 },
  { score: 4, count: 8 },
  { score: 3, count: 0 },
  { score: 2, count: 0 },
  { score: 1, count: 0 },
] as const;

export default function MoverReviewList() {
  return (
    <div className="flex w-full flex-col gap-[16px]">
      <div className="flex flex-col gap-[16px]">
        <h2
          className={cn(
            'text-lg-semibold text-black-400',
            'tablet:text-xl-semibold',
          )}
        >
          리뷰
        </h2>
        <MoverReviewSummary
          averageRating={5}
          reviewCount={178}
          distribution={RATING_DISTRIBUTION}
        />
      </div>
      <ul>
        {REVIEW_LIST.map((review, index) => (
          <li
            key={review.id}
            className={cn(
              index < REVIEW_LIST.length - 1 && 'border-b border-line-100',
            )}
          >
            <MoverReviewItem
              nickname={review.nickname}
              createdAt={review.createdAt}
              rating={review.rating}
              content={review.content}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
