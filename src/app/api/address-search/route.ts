// 카카오 로컬 - 주소 검색 (GET /v2/local/search/address.json)
// 결과가 없으면 키워드(장소) 검색 (GET /v2/local/search/keyword.json)으로 한 번 더 찾는다
//
// REST 키는 브라우저에 노출되면 안 되므로 서버에서만 호출하고, 응답은 화면이 쓰는
// 모양으로 줄여서 내려준다.
// app/api/[...path]는 백엔드로 넘기는 catch-all인데, Next는 정적 경로를 먼저 매칭하므로
// 이 파일이 /api/address-search를 가져간다.
import { AddressSearchResult, KakaoAddressDocument } from '@/types/address';
import type { NextRequest } from 'next/server';

const KAKAO_ADDRESS_URL = 'https://dapi.kakao.com/v2/local/search/address.json';
const KAKAO_KEYWORD_URL = 'https://dapi.kakao.com/v2/local/search/keyword.json';
/** 시안의 결과 카드가 스크롤 없이 보여주는 양 + 여유 */
const PAGE_SIZE = '10';

function toAddressResult(
  document: KakaoAddressDocument,
): AddressSearchResult | null {
  const road = document.road_address;
  const jibun = document.address;

  /* 건물명이 있으면 "도로명 (건물명)"으로 합친다 (시안 표기) */
  const roadAddress = road?.address_name
    ? road.building_name
      ? `${road.address_name} (${road.building_name})`
      : road.address_name
    : '';
  const jibunAddress = jibun?.address_name ?? document.address_name ?? '';

  /* 견적 요청은 우편번호(5자리)가 필수다.
     건물번호 없이 도로명만 검색하면 카카오가 zone_no 없이 돌려주는데,
     그건 골라도 제출할 수 없으므로 목록에서 뺀다 */
  const zoneCode = road?.zone_no;
  if (!zoneCode || !roadAddress) return null;

  return {
    id: `${zoneCode}|${roadAddress}|${jibunAddress}`,
    zoneCode,
    roadAddress,
    jibunAddress,
  };
}

interface KakaoKeywordDocument {
  place_name?: string;
  road_address_name?: string;
  address_name?: string;
}

async function kakaoSearch<T>(
  url: string,
  query: string,
  restApiKey: string,
): Promise<T[]> {
  const targetUrl = new URL(url);
  targetUrl.searchParams.set('query', query);
  targetUrl.searchParams.set('size', PAGE_SIZE);

  const response = await fetch(targetUrl, {
    headers: { Authorization: `KakaoAK ${restApiKey}` },
  });
  if (!response.ok) throw new KakaoResponseError(response.status);

  const body = (await response.json()) as { documents?: T[] };
  return body.documents ?? [];
}

class KakaoResponseError extends Error {
  constructor(readonly status: number) {
    super('KAKAO_ERROR');
  }
}

/*
@ 키워드(장소) 검색으로 찾기
- 주소 검색은 정확한 주소용이라 "세종대로"처럼 건물번호 없이 치거나 "서울시청" 같은 장소 이름이면
  우편번호 있는 결과가 0건이다 (우편번호 없는 결과는 견적 요청에 못 쓴다)
- 키워드 검색은 장소의 도로명 주소를 주지만 우편번호가 없어서,
  각 도로명 주소로 주소 검색을 한 번 더 해 우편번호를 얻는다
- 같은 도로명 주소는 한 번만 조회한다 (같은 건물의 여러 장소)
- ponytail: 검색 1번에 카카오 호출이 최대 1 + 1 + 10번이다. 일일 한도가 문제되면 결과 수를 줄인다
*/
async function searchByKeyword(
  query: string,
  restApiKey: string,
): Promise<AddressSearchResult[]> {
  const places = await kakaoSearch<KakaoKeywordDocument>(
    KAKAO_KEYWORD_URL,
    query,
    restApiKey,
  );

  // 도로명 주소 → 장소 이름 (먼저 나온 장소 이름을 쓴다)
  const placeNameByRoad = new Map<string, string>();
  for (const place of places) {
    const road = place.road_address_name?.trim();
    if (road && !placeNameByRoad.has(road)) {
      placeNameByRoad.set(road, place.place_name ?? '');
    }
  }

  const results = await Promise.all(
    [...placeNameByRoad].map(async ([road, placeName]) => {
      const [document] = await kakaoSearch<KakaoAddressDocument>(
        KAKAO_ADDRESS_URL,
        road,
        restApiKey,
      );
      if (!document) return null;

      const result = toAddressResult(document);
      if (!result) return null;

      // 주소 검색에 건물명이 없으면 장소 이름을 붙여 어떤 곳인지 알 수 있게 한다
      if (placeName && !result.roadAddress.includes('(')) {
        const roadAddress = `${result.roadAddress} (${placeName})`;
        return {
          ...result,
          roadAddress,
          id: `${result.zoneCode}|${roadAddress}|${result.jibunAddress}`,
        };
      }
      return result;
    }),
  );

  // 장소 이름만 다르고 같은 주소인 결과는 하나만 남긴다
  const seen = new Set<string>();
  return results.filter((item): item is AddressSearchResult => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')?.trim();

  /* 빈 검색어는 에러가 아니라 "결과 없음"이다 */
  if (!query) {
    return Response.json({ success: true, data: [] });
  }

  const restApiKey = process.env.KAKAO_REST_API_KEY;
  if (!restApiKey) {
    return Response.json(
      {
        success: false,
        message: '주소 검색 키가 설정되지 않았습니다.',
        code: 'KAKAO_KEY_MISSING',
      },
      { status: 500 },
    );
  }

  try {
    // 1) 정확한 주소면 주소 검색 결과를 그대로 쓴다
    const addressDocuments = await kakaoSearch<KakaoAddressDocument>(
      KAKAO_ADDRESS_URL,
      query,
      restApiKey,
    );
    const data = addressDocuments
      .map(toAddressResult)
      .filter((item): item is AddressSearchResult => item !== null);

    // 2) 쓸 수 있는 결과가 없으면 키워드(장소) 검색으로 찾는다
    if (data.length > 0) return Response.json({ success: true, data });
    return Response.json({
      success: true,
      data: await searchByKeyword(query, restApiKey),
    });
  } catch (error) {
    if (error instanceof KakaoResponseError) {
      return Response.json(
        {
          success: false,
          message: '주소를 검색하지 못했습니다. 잠시 후 다시 시도해주세요.',
          code: 'KAKAO_ERROR',
        },
        { status: error.status },
      );
    }
    return Response.json(
      {
        success: false,
        message: '주소 검색 서버에 연결할 수 없습니다.',
        code: 'KAKAO_UNREACHABLE',
      },
      { status: 502 },
    );
  }
}
