// 고객 프로필 API 호출 함수
import type { CustomerProfile } from '@/types/customer';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { HttpError } from '@/lib/api/errors';

/*
@ GET /customer/profile
- 등록 전에는 백엔드가 404("등록된 프로필이 없습니다.")를 준다.
  가입 직후에는 정상 상태라 에러로 다루지 않고 null로 바꾼다 (auth의 getMe와 같은 방식)
*/
export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  try {
    return await clientFetch<CustomerProfile>(ENDPOINTS.customer.profile);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) return null;
    throw error;
  }
}
