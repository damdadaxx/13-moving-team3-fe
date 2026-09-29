import type { CustomerProfileFormValues } from '@/types/customerProfile';

/*=================================================
고객 프로필 FormData 생성
=================================================*/

/*
@ 백엔드 multipart 계약
- region은 문자열 하나를 전송한다.
- serviceTypes는 배열을 JSON 문자열로 직렬화한다.
- profileImage는 사용자가 새 파일을 선택한 경우에만 추가한다.
- Content-Type은 이 함수와 호출부에서 직접 지정하지 않는다. 브라우저가 multipart boundary와 함께 만든다.
*/
export function createCustomerProfileFormData(
  values: CustomerProfileFormValues,
): FormData {
  if (!values.region || values.serviceTypes.length === 0) {
    throw new Error(
      '고객 프로필 FormData는 서비스와 지역 검증을 통과한 뒤 생성해야 합니다.',
    );
  }

  const formData = new FormData();
  formData.append('region', values.region);
  formData.append('serviceTypes', JSON.stringify(values.serviceTypes));

  const profileImage = values.profileImage?.[0];
  if (profileImage) {
    formData.append('profileImage', profileImage);
  }

  return formData;
}
