import type { Region } from '@/types/region';
import type { ServiceType } from '@/types/serviceType';

/*=================================================
고객 프로필 도메인 타입
=================================================*/

/** 고객 프로필 조회 API가 반환하는 데이터 형태 */
export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  imgUrl: string | null;
  region: Region;
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
  region: Region | null;
}

/** 최초 등록 화면에서만 받는 전화번호는 프로필이 아닌 /auth/me의 필드다. */
export interface CustomerProfileCreateFormValues extends CustomerProfileFormValues {
  phoneNumber: string;
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
