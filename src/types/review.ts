import type { ServiceType } from '@/types/serviceType';

export interface RatingDistributionItem {
  rating: number;
  count: number;
}

export interface ReviewMoverSummary {
  userId: string;
  imgUrl: string | null;
  nickname: string;
  shortIntro: string | null;
}

export interface ReviewEstimateRequestSummary {
  customerId: string;
  serviceType: ServiceType;
  departureAddress: string;
  arrivalAddress: string;
  moveDate: string;
  status: string;
}

export interface ReviewSummary {
  id: string;
  estimateId: string;
  customerId: string;
  moverId: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/*
@ 기사님 리뷰 작성자
- GET /reviews/mover/{moverId} 의 list[].user
*/
export interface MoverReviewUser {
  name: string;
}

export interface MoverReviewListItem extends ReviewSummary {
  user: MoverReviewUser;
}

/*
@ 기사님 리뷰 목록 (GET /reviews/mover/{moverId})
*/
export interface MoverReviewListData {
  list: MoverReviewListItem[];
  ratingDistribution: RatingDistributionItem[];
  ratingAvg: number;
  reviewCount: number;
  totalPages: number;
}

export interface MoverReviewListQuery {
  page?: number;
  pageSize?: number;
}

/*
@ GET /reviews/me 한 행
- id는 견적 ID다. POST /reviews의 estimateId로 그대로 쓴다
- isDesignated는 스키마에 있지만 현재 목록 select에 없어 없을 수 있다
*/
export interface MyReviewEstimateItem {
  id: string;
  price: number | null;
  mover: ReviewMoverSummary;
  estimateRequest: ReviewEstimateRequestSummary;
  review: ReviewSummary | null;
  isDesignated?: boolean;
}

export interface MyReviewListData {
  list: MyReviewEstimateItem[];
  totalPages: number;
}

export interface GetMyReviewsParams {
  page: number;
  pageSize: number;
  hasReview: boolean;
}

export interface CreateReviewInput {
  estimateId: string;
  content: string;
  rating: number;
}

/*
@ 작성 가능한 리뷰 화면 모델
- GET /reviews/me?hasReview=false 응답을 카드/모달이 쓰기 쉽게 변환한다
*/
export interface PendingReview {
  id: string;
  moverId: string;
  moverName: string;
  description: string;
  imgUrl: string | null;
  serviceType: ServiceType;
  isDesignated: boolean;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  price: number;
}

/*
@ 내가 작성한 리뷰 화면 모델
- GET /reviews/me?hasReview=true 응답을 카드가 쓰기 쉽게 변환한다
*/
export interface CompletedReview {
  id: string;
  moverId: string;
  moverName: string;
  description: string;
  imgUrl: string | null;
  serviceType: ServiceType;
  isDesignated: boolean;
  fromRegion: string;
  toRegion: string;
  moveDate: string;
  rating: number;
  content: string;
  createdAt: string;
}
