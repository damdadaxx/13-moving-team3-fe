// 고객 프로필 타입
// 백엔드 customerService의 CustomerProfileResponse를 따른다.
import type { ServiceType } from '@/types/serviceType';

import type { Region } from '@/components/ui/Chip/RegionChipGroup';

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
