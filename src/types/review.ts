import type { ServiceType } from '@/types/serviceType';

import formatRegion from '@/utils/formatRegion';

/*
@ 리뷰 도메인 타입
- GET /reviews/me, POST /reviews 응답을 따른다
- PendingReview는 카드/모달이 쓰는 화면 모델이다
*/

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

export function toPendingReview(item: MyReviewEstimateItem): PendingReview {
  return {
    id: item.id,
    moverId: item.mover.userId,
    moverName: item.mover.nickname,
    description: item.mover.shortIntro ?? '',
    imgUrl: item.mover.imgUrl,
    serviceType: item.estimateRequest.serviceType,
    isDesignated: item.isDesignated ?? false,
    fromRegion: formatRegion(item.estimateRequest.departureAddress),
    toRegion: formatRegion(item.estimateRequest.arrivalAddress),
    moveDate: item.estimateRequest.moveDate,
    price: item.price ?? 0,
  };
}
