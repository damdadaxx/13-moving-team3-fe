/** 카카오 응답에서 화면에 쓰는 필드만 추린 것 */
export interface KakaoAddressDocument {
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
