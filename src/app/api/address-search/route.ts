// 카카오 로컬 - 주소 검색 (GET /v2/local/search/address.json)
//
// REST 키는 브라우저에 노출되면 안 되므로 서버에서만 호출하고, 응답은 화면이 쓰는
// 모양으로 줄여서 내려준다.
// app/api/[...path]는 백엔드로 넘기는 catch-all인데, Next는 정적 경로를 먼저 매칭하므로
// 이 파일이 /api/address-search를 가져간다.
import type { NextRequest } from 'next/server';

const KAKAO_ADDRESS_URL = 'https://dapi.kakao.com/v2/local/search/address.json';
/** 시안의 결과 카드가 스크롤 없이 보여주는 양 + 여유 */
const PAGE_SIZE = '10';

/** 카카오 응답에서 화면에 쓰는 필드만 추린 것 */
interface KakaoAddressDocument {
  address_name?: string;
  road_address?: {
    address_name?: string;
    building_name?: string;
    zone_no?: string;
  } | null;
  address?: {
    address_name?: string;
  } | null;
}

export interface AddressSearchResult {
  /** 목록 key·선택 비교용. 같은 우편번호가 여러 건이라 주소를 합쳐 만든다 */
  id: string;
  zoneCode: string;
  roadAddress: string;
  jibunAddress: string;
}

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

  const targetUrl = new URL(KAKAO_ADDRESS_URL);
  targetUrl.searchParams.set('query', query);
  targetUrl.searchParams.set('size', PAGE_SIZE);

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      headers: { Authorization: `KakaoAK ${restApiKey}` },
    });
  } catch {
    return Response.json(
      {
        success: false,
        message: '주소 검색 서버에 연결할 수 없습니다.',
        code: 'KAKAO_UNREACHABLE',
      },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return Response.json(
      {
        success: false,
        message: '주소를 검색하지 못했습니다. 잠시 후 다시 시도해주세요.',
        code: 'KAKAO_ERROR',
      },
      { status: response.status },
    );
  }

  const body = (await response.json()) as {
    documents?: KakaoAddressDocument[];
  };
  const data = (body.documents ?? [])
    .map(toAddressResult)
    .filter((item): item is AddressSearchResult => item !== null);

  return Response.json({ success: true, data });
}
