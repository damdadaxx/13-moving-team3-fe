// 기사님 / 찜 / 프로필 API 호출 함수
import type {
  CursorPage,
  MoverDetail,
  MoverListData,
  MoverListItem,
  MoverListParams,
  MoverListQuery,
  MoverProfile,
  ServiceType,
} from '@/types/mover';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/** undefined / 빈 문자열은 빼고 쿼리스트링을 만든다 */
function toQueryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/*
@ GET /mover
- 비로그인 가능. 별명 검색(keyword), 지역·서비스 필터, 정렬, 커서 페이지네이션
- 검색어/필터/정렬이 바뀌면 cursor 없이 첫 페이지부터 다시 요청해야 한다 (쿼리 키로 처리)
*/
export function getMovers(
  params: MoverListParams,
): Promise<CursorPage<MoverListItem>> {
  return clientFetch<CursorPage<MoverListItem>>(
    `${ENDPOINTS.mover.list}${toQueryString({ ...params })}`,
  );
}

/** 기사님 목록 조회 쿼리 파라미터 변환 */
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
    serviceTypes: ServiceType[];
  };
  ratingCount: number;
  ratingAvg: number;
  acceptedEstimateCount: number;
  likeCount: number;
}

/** GET /likes/me - 고객 로그인 필요 */
export async function getLikedMovers(params: {
  cursor?: string;
  size?: number;
}): Promise<CursorPage<MoverListItem>> {
  const page = await clientFetch<CursorPage<LikedMoverResponse>>(
    `${ENDPOINTS.like.mine}${toQueryString(params)}`,
  );

  return {
    ...page,
    list: page.list.map((item) => ({
      id: item.moverId,
      imgUrl: item.mover.imgUrl,
      nickname: item.mover.nickname,
      careerMonths: item.mover.careerMonths,
      shortIntro: item.mover.shortIntro,
      serviceTypes: item.mover.serviceTypes,
      averageRating: item.ratingAvg,
      reviewCount: item.ratingCount,
      confirmedCount: item.acceptedEstimateCount,
      likeCount: item.likeCount,
    })),
  };
}

/*
@ GET /mover/profile - 내 기사님 프로필 조회
*/
export async function getMyMoverProfile(): Promise<MoverProfile> {
  return clientFetch<MoverProfile>(ENDPOINTS.mover.profile);
}

/*
@ 기사님 상세 조회 (GET /mover/{id})
- 비회원도 호출할 수 있는 공개 API
*/
export function fetchMoverDetail(id: string): Promise<MoverDetail> {
  return clientFetch<MoverDetail>(ENDPOINTS.mover.detail(id));
}
