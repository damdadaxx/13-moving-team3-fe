export interface LikeSummary {
  id: string;
  customerId: string;
  moverId: string;
  createdAt: string;
}

/*
@ 내가 이 기사님을 찜했는지 (GET /likes/me/{moverId})
- 찜하지 않았으면 likeId는 생략된다
*/
export interface LikeStatus {
  isLiked: boolean;
  likeCount: number;
  likeId?: string;
}

export interface CreateLikeResult {
  like: LikeSummary;
  likeCount: number;
}

export interface DeleteLikeResult {
  likeCount: number;
}
