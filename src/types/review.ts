export interface RatingDistributionItem {
  rating: number;
  count: number;
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
  customerName?: string;
}

/*
@ 기사님 리뷰 목록 (GET /reviews/mover/{moverId})
*/
export interface MoverReviewListData {
  list: ReviewSummary[];
  ratingDistribution: RatingDistributionItem[];
  ratingAvg: number;
  reviewCount: number;
  totalPages: number;
}

export interface MoverReviewListQuery {
  page?: number;
  pageSize?: number;
}
