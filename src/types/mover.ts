// 기사님 프로필 관련 타입
import type { ServiceType } from '@/types/serviceType';

import type { Region } from '@/components/ui/Chip/RegionChipGroup';

/*
@ GET /mover/profile - 내 기사님 프로필 조회
*/
export interface MoverProfile {
  id: string;
  imgUrl: string | null;
  nickname: string;
  careerMonths: number;
  shortIntro: string;
  description: string;
  serviceTypes: ServiceType[];
  serviceRegions: Region[];
  createdAt: string;
  updatedAt: string;
}
