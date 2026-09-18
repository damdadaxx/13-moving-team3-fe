// 기사님 프로필 API 호출 함수
import type { MoverProfile } from '@/types/mover';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

/*
@ GET /mover/profile - 내 기사님 프로필 조회
*/
export async function getMyMoverProfile(): Promise<MoverProfile> {
  return clientFetch<MoverProfile>(ENDPOINTS.mover.profile);
}
