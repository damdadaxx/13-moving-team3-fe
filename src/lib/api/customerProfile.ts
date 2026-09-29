import type {
  CustomerProfile,
  CustomerProfileFormValues,
} from '@/types/customerProfile';

import clientFetch from '@/lib/api/clientFetch';
import { createCustomerProfileFormData } from '@/lib/api/customerProfileFormData';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { HttpError } from '@/lib/api/errors';

/*=================================================
고객 프로필 API
=================================================*/

/*
@ 프로필 이미지 URL 정규화
- 로컬 저장 이미지는 백엔드가 /uploads/... 경로로 반환한다.
- 브라우저가 백엔드에 직접 접근하지 않고 Next 프록시를 사용하도록 /api를 붙인다.
- 이후 S3로 변경되어 절대 URL이 내려오면 값을 그대로 사용한다.
*/
function toCustomerProfile(profile: CustomerProfile): CustomerProfile {
  const { imgUrl } = profile;

  return {
    ...profile,
    imgUrl: imgUrl && imgUrl.startsWith('/uploads/') ? `/api${imgUrl}` : imgUrl,
  };
}

/*
@ 내 고객 프로필 조회
- 프로필이 등록된 고객이면 CustomerProfile을 반환한다.
- 백엔드가 404를 반환하면 장애가 아니라 "아직 프로필을 등록하지 않은 상태"이므로
  화면에서 분기할 수 있도록 null로 변환한다.
- 네트워크 오류와 500 계열 오류는 프로필 미등록 상태로 오해하지 않도록 그대로 던진다.
*/
export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  try {
    const profile = await clientFetch<CustomerProfile>(
      ENDPOINTS.customer.profile,
    );
    return toCustomerProfile(profile);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

/*
@ 고객 프로필 최초 등록
- 지역과 이용 서비스는 customerProfileSchema 검증을 통과한 값을 받는다.
- 이미지가 선택된 경우에만 FormData에 profileImage가 추가된다.
- Content-Type은 직접 지정하지 않는다. 브라우저가 multipart boundary를 포함한
  올바른 Content-Type을 생성해야 백엔드 Multer가 파일과 텍스트 필드를 읽을 수 있다.
*/
export async function createCustomerProfile(
  values: CustomerProfileFormValues,
): Promise<CustomerProfile> {
  const profile = await clientFetch<CustomerProfile>(
    ENDPOINTS.customer.profile,
    {
      method: 'POST',
      body: createCustomerProfileFormData(values),
    },
  );

  return toCustomerProfile(profile);
}

/*
@ 고객 프로필 수정
- 백엔드 계약상 region과 serviceTypes는 PATCH에서도 항상 필수다.
- 이미지·지역·서비스 중 하나만 바뀌어도 현재 지역과 서비스 전체를 함께 FormData로 보낸다.
- 새 이미지를 선택하지 않은 경우 profileImage를 보내지 않아 기존 이미지를 유지한다.
*/
export async function updateCustomerProfile(
  values: CustomerProfileFormValues,
): Promise<CustomerProfile> {
  const profile = await clientFetch<CustomerProfile>(
    ENDPOINTS.customer.profile,
    {
      method: 'PATCH',
      body: createCustomerProfileFormData(values),
    },
  );

  return toCustomerProfile(profile);
}
