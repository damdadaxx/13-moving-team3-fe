import type {
  CreateMoverProfileInput,
  MoverProfile,
  UpdateMoverProfileInput,
} from '@/types/moverProfile';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { HttpError } from '@/lib/api/errors';
import {
  createMoverProfileFormData,
  createMoverProfileUpdateFormData,
} from '@/lib/api/moverProfileFormData';

/*=================================================
기사님 프로필 API
=================================================*/

function toMoverProfile(profile: MoverProfile): MoverProfile {
  const { imgUrl } = profile;

  return {
    ...profile,
    imgUrl: imgUrl && imgUrl.startsWith('/uploads/') ? `/api${imgUrl}` : imgUrl,
  };
}

/*
@ 내 프로필 조회
- null은 서버가 404를 반환한 프로필 미등록 상태다.
- 네트워크/서버 오류를 미등록으로 오해하지 않도록 그 외 오류는 그대로 던진다.
*/
export async function getMoverProfile(): Promise<MoverProfile | null> {
  try {
    const profile = await clientFetch<MoverProfile>(ENDPOINTS.mover.profile);
    return toMoverProfile(profile);
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function createMoverProfile(
  input: CreateMoverProfileInput,
): Promise<MoverProfile> {
  const profile = await clientFetch<MoverProfile>(ENDPOINTS.mover.profile, {
    method: 'POST',
    body: createMoverProfileFormData(input),
  });

  return toMoverProfile(profile);
}

/*
@ 변경된 프로필 필드 수정
- 새 이미지가 있으면 multipart/form-data, 없으면 JSON을 사용한다.
- JSON 배열은 그대로 보내고 FormData 배열만 생성 함수에서 JSON 문자열로 직렬화한다.
*/
export async function updateMoverProfile(
  input: UpdateMoverProfileInput,
): Promise<MoverProfile> {
  const body = input.profileImage
    ? createMoverProfileUpdateFormData(input)
    : JSON.stringify(input);
  const profile = await clientFetch<MoverProfile>(ENDPOINTS.mover.profile, {
    method: 'PATCH',
    body,
  });

  return toMoverProfile(profile);
}
