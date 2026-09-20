import type { ServiceType } from '@/types/serviceType';

/*
@ 찜한 기사님 API 응답
- GET /likes/me → { list, nextCursor, totalCount }
- POST /likes/bulk-delete → { result: [{ moverId, likeCount }] }
- 백엔드 likeService.getLikeMoverList / likeSwagger LikedMoverItem
*/

export interface LikedMoverProfile {
  userId: string;
  imgUrl: string | null;
  nickname: string;
  careerMonths: number;
  shortIntro: string;
  description: string;
  serviceTypes: ServiceType[];
}

export interface LikedMoverItem {
  id: string;
  customerId: string;
  moverId: string;
  createdAt: string;
  mover: LikedMoverProfile;
  ratingCount: number;
  ratingAvg: number;
  acceptedEstimateCount: number;
  likeCount: number;
}

export interface LikedMoverListData {
  list: LikedMoverItem[];
  nextCursor: string | null;
  totalCount: number;
}

export interface GetLikedMoversParams {
  cursor?: string;
  size?: number;
}

export interface BulkDeletedLikeCount {
  moverId: string;
  likeCount: number;
}

export interface BulkDeleteLikesData {
  result: BulkDeletedLikeCount[];
}

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
