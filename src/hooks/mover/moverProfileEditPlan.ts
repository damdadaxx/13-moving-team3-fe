import type {
  MoverProfileFormValues,
  UpdateMoverProfileInput,
} from '@/types/moverProfile';
import type { ServiceType } from '@/types/serviceType';

/*=================================================
기사님 프로필 수정 계획
=================================================*/

export interface MoverProfileEditPlan {
  profile: UpdateMoverProfileInput | null;
  hasChanges: boolean;
}

type ComparableValue =
  ServiceType | MoverProfileFormValues['serviceRegions'][number];

function areArraysEqual<T extends ComparableValue>(left: T[], right: T[]) {
  return [...left].sort().join(',') === [...right].sort().join(',');
}

export function toCareerMonths(
  values: Pick<MoverProfileFormValues, 'careerYears' | 'careerRemainderMonths'>,
): number {
  return Number(values.careerYears) * 12 + Number(values.careerRemainderMonths);
}

export function toCareerFormValues(
  careerMonths: number,
): Pick<MoverProfileFormValues, 'careerYears' | 'careerRemainderMonths'> {
  return {
    careerYears: String(Math.floor(careerMonths / 12)),
    careerRemainderMonths: String(careerMonths % 12),
  };
}

/*
@ 단일 변경 판단
- 수정 버튼과 실제 PATCH 요청이 이 함수의 같은 결과를 사용한다.
- 배열은 선택 순서가 아니라 실제 선택값을 비교한다.
- 이미지 교체와 삭제는 동시에 계획하지 않는다.
*/
export function createMoverProfileEditPlan(
  values: MoverProfileFormValues,
  initialValues: MoverProfileFormValues,
  initialImageUrl?: string,
): MoverProfileEditPlan {
  const profile: UpdateMoverProfileInput = {};
  const selectedImage = values.profileImage?.[0];

  if (selectedImage) {
    profile.profileImage = selectedImage;
  } else if (values.removeImage && initialImageUrl) {
    profile.removeImage = true;
  }

  const nickname = values.nickname.trim();
  if (nickname !== initialValues.nickname.trim()) {
    profile.nickname = nickname;
  }

  const careerMonths = toCareerMonths(values);
  if (careerMonths !== toCareerMonths(initialValues)) {
    profile.careerMonths = careerMonths;
  }

  const shortIntro = values.shortIntro.trim();
  if (shortIntro !== initialValues.shortIntro.trim()) {
    profile.shortIntro = shortIntro;
  }

  const description = values.description.trim();
  if (description !== initialValues.description.trim()) {
    profile.description = description;
  }

  if (!areArraysEqual(values.serviceTypes, initialValues.serviceTypes)) {
    profile.serviceTypes = values.serviceTypes;
  }

  if (!areArraysEqual(values.serviceRegions, initialValues.serviceRegions)) {
    profile.serviceRegions = values.serviceRegions;
  }

  const hasChanges = Object.keys(profile).length > 0;

  return {
    profile: hasChanges ? profile : null,
    hasChanges,
  };
}
