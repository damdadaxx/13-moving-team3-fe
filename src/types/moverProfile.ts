import type { ServiceType } from '@/types/serviceType';

/*=================================================
기사님 프로필 도메인 타입
=================================================*/

/*
@ 서비스 가능 지역
- 백엔드 Region enum과 공용 RegionChipGroup이 사용하는 값과 동일하게 유지한다.
- mover 도메인 타입이 UI 컴포넌트를 import하지 않도록 값 목록을 도메인에서 관리한다.

@ TODO(공용 Region 타입 정리 시 확인)
- Customer 프로필과 Mover 프로필이 같은 Region 값을 사용한다.
- 공용 타입 통합은 다른 도메인 파일도 함께 수정해야 하므로 별도 승인 후 진행한다.
*/
export const MOVER_PROFILE_REGIONS = [
  'SEOUL',
  'GYEONGGI',
  'INCHEON',
  'GANGWON',
  'CHUNGBUK',
  'CHUNGNAM',
  'SEJONG',
  'DAEJEON',
  'JEONBUK',
  'JEONNAM',
  'GWANGJU',
  'GYEONGBUK',
  'GYEONGNAM',
  'DAEGU',
  'ULSAN',
  'BUSAN',
  'JEJU',
] as const;

export type MoverProfileRegion = (typeof MOVER_PROFILE_REGIONS)[number];

/*
@ 등록·수정 폼 값
- 경력은 사용자가 이해하기 쉬운 년/개월 입력으로 각각 관리한다.
- 백엔드의 careerMonths는 전체 경력 개월 수이므로 API 연결 단계에서
  careerYears * 12 + careerRemainderMonths로 변환해야 한다.
- 문자열로 관리하면 사용자가 입력 중인 빈 값과 숫자 0을 구분할 수 있다.
*/
export interface MoverProfileFormValues {
  profileImage?: FileList;
  /** 소셜 계정의 최초 프로필 등록 화면에서만 사용한다. */
  phoneNumber: string;
  nickname: string;
  careerYears: string;
  careerRemainderMonths: string;
  shortIntro: string;
  description: string;
  serviceTypes: ServiceType[];
  serviceRegions: MoverProfileRegion[];
  /** 수정 화면에서 기존 이미지를 삭제할 때만 true로 설정한다. */
  removeImage: boolean;
}

/** GET/POST/PATCH /mover/profile 응답 */
export interface MoverProfile {
  id: string;
  imgUrl: string | null;
  nickname: string;
  careerMonths: number;
  shortIntro: string;
  description: string;
  serviceTypes: ServiceType[];
  serviceRegions: MoverProfileRegion[];
  createdAt: string;
  updatedAt: string;
}

/** POST /mover/profile 요청 */
export interface CreateMoverProfileInput {
  profileImage?: File;
  nickname: string;
  careerMonths: number;
  shortIntro: string;
  description: string;
  serviceTypes: ServiceType[];
  serviceRegions: MoverProfileRegion[];
}

/** PATCH /mover/profile 요청 */
export interface UpdateMoverProfileInput {
  profileImage?: File;
  nickname?: string;
  careerMonths?: number;
  shortIntro?: string;
  description?: string;
  serviceTypes?: ServiceType[];
  serviceRegions?: MoverProfileRegion[];
  removeImage?: true;
}
