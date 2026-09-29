// 기사님 프로필 API 호출 함수
import type { MoverDetail, MoverListData, MoverListQuery } from '@/types/mover';
import type { ServiceType } from '@/types/serviceType';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/** 기사님 목록 조회 쿼리 파라미터 변환
 * @param query 기사님 목록 조회 쿼리
 * @returns 기사님 목록 조회 쿼리 파라미터
 */
function toSearchParams(query: MoverListQuery): string {
  const params = new URLSearchParams();

  if (query.keyword) params.set('keyword', query.keyword);
  if (query.region) params.set('region', query.region);
  if (query.serviceType) params.set('serviceType', query.serviceType);
  if (query.sortBy) params.set('sortBy', query.sortBy);
  if (query.cursor) params.set('cursor', query.cursor);
  if (query.size) params.set('size', String(query.size));

  return params.toString() ? `?${params.toString()}` : '';
}

/*
@ 기사님 목록 조회 (GET /mover)
- 비회원도 호출할 수 있는 공개 API
- 커서가 있으면 다음 페이지, 없으면 첫 페이지
*/
export function fetchMoverList(
  query: MoverListQuery = {},
): Promise<MoverListData> {
  return clientFetch<MoverListData>(
    `${ENDPOINTS.mover.list}${toSearchParams(query)}`,
  );
}

/*
@ 기사님 상세 조회 (GET /mover/{id})
- 비회원도 호출할 수 있는 공개 API
*/
export function fetchMoverDetail(id: string): Promise<MoverDetail> {
  return clientFetch<MoverDetail>(ENDPOINTS.mover.detail(id));
}

/*=================================================
기사님 찾기 / 찜한 기사님
=================================================*/

/*
@ GET /likes/me 응답 항목
- 기사님 목록(GET /mover)과 필드 이름이 달라서 카드용 MoverListItem으로 변환한다
*/
interface LikedMoverResponse {
  moverId: string;
  mover: {
    userId: string;
    imgUrl: string | null;
    nickname: string;
    careerMonths: number;
    shortIntro: string;
    description: string;
    serviceTypes: ServiceType[];
  };
  ratingCount: number;
  ratingAvg: number;
  acceptedEstimateCount: number;
  likeCount: number;
}

interface LikedMoverPage {
  list: LikedMoverResponse[];
  nextCursor: string | null;
  totalCount: number;
}

/** GET /likes/me - 고객 로그인 필요 */
export async function getLikedMovers(params: {
  cursor?: string;
  size?: number;
}): Promise<MoverListData> {
  const page = await clientFetch<LikedMoverPage>(
    `${ENDPOINTS.like.mine}${toSearchParams(params)}`,
  );

  return {
    ...page,
    list: page.list.map((item) => ({
      id: item.moverId,
      imgUrl: item.mover.imgUrl,
      nickname: item.mover.nickname,
      careerMonths: item.mover.careerMonths,
      shortIntro: item.mover.shortIntro,
      description: item.mover.description,
      serviceTypes: item.mover.serviceTypes,
      // GET /likes/me는 서비스 가능 지역을 내려주지 않는다. 카드도 쓰지 않아 빈 배열로 둔다
      serviceRegions: [],
      averageRating: item.ratingAvg,
      reviewCount: item.ratingCount,
      confirmedCount: item.acceptedEstimateCount,
      likeCount: item.likeCount,
      isLiked: true,
    })),
  };
}
