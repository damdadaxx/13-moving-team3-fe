import type { ServiceType } from '@/types/serviceType';

/*=================================================
고객 프로필 도메인 타입
=================================================*/

/*
@ 고객이 선택할 수 있는 거주 지역
- 백엔드 Region enum과 공용 RegionChipGroup이 사용하는 값과 동일하게 유지한다.
- 타입 파일이 UI 컴포넌트를 import하면 도메인 계층이 화면 계층에 의존하게 되므로
  고객 프로필 도메인에서는 값 목록을 직접 소유한다.

@ TODO(공용 Region 타입 리팩터링 시 확인)
- 현재 RegionChipGroup에도 동일한 지역 목록이 있다.
- 공용 타입 통합이 결정되면 src/types/region.ts처럼 UI와 도메인이 함께 사용할
  단일 파일로 이동해야 하며, 공용 Chip 수정이 필요하므로 별도 승인을 받은 뒤 진행한다.
*/
export const CUSTOMER_PROFILE_REGIONS = [
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

export type CustomerProfileRegion = (typeof CUSTOMER_PROFILE_REGIONS)[number];

/** 고객 프로필 조회 API가 반환하는 데이터 형태 */
export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  imgUrl: string | null;
  region: CustomerProfileRegion;
  serviceTypes: ServiceType[];
  createdAt: string;
  updatedAt: string;
}

/** 등록과 수정 화면에서 React Hook Form이 관리하는 값 */
export interface CustomerProfileFormValues {
  /** native file input의 값이므로 File이 아니라 FileList로 관리한다. */
  profileImage?: FileList;
  serviceTypes: ServiceType[];
  /** 사용자가 선택하기 전의 빈 상태를 표현하기 위해 null을 허용한다. */
  region: CustomerProfileRegion | null;
}

/*=================================================
고객 프로필 수정 화면 타입
=================================================*/

/**
 * 고객 프로필 수정 화면에서만 사용하는 전체 폼 값입니다.
 *
 * 이름·이메일·전화번호는 회원가입 때 저장된 인증 기본정보이고,
 * 이미지·이용 서비스·지역은 고객 프로필 정보입니다. 화면에서는 한 폼으로
 * 보여주지만 API 연결 단계에서는 각각의 담당 API로 나누어 전송해야 합니다.
 *
 * 비밀번호 확인은 서버에 보내지 않고 새 비밀번호 일치 여부를 확인하는
 * 프론트엔드 전용 값입니다.
 */
export interface CustomerProfileEditFormValues extends CustomerProfileFormValues {
  name: string;
  email: string;
  phoneNumber: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
