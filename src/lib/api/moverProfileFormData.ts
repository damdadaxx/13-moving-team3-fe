import type {
  CreateMoverProfileInput,
  UpdateMoverProfileInput,
} from '@/types/moverProfile';

/*=================================================
기사님 프로필 FormData 생성
=================================================*/

function appendProfileFields(
  formData: FormData,
  input: CreateMoverProfileInput | UpdateMoverProfileInput,
) {
  if (input.nickname !== undefined) {
    formData.append('nickname', input.nickname);
  }

  if (input.careerMonths !== undefined) {
    formData.append('careerMonths', String(input.careerMonths));
  }

  if (input.shortIntro !== undefined) {
    formData.append('shortIntro', input.shortIntro);
  }

  if (input.description !== undefined) {
    formData.append('description', input.description);
  }

  if (input.serviceTypes !== undefined) {
    formData.append('serviceTypes', JSON.stringify(input.serviceTypes));
  }

  if (input.serviceRegions !== undefined) {
    formData.append('serviceRegions', JSON.stringify(input.serviceRegions));
  }

  if (input.profileImage) {
    formData.append('profileImage', input.profileImage);
  }
}

/*
@ 최초 등록
- POST /mover/profile은 이미지 유무와 관계없이 multipart/form-data를 사용한다.
- Content-Type은 브라우저가 boundary와 함께 만들도록 호출부에서 직접 설정하지 않는다.
*/
export function createMoverProfileFormData(
  input: CreateMoverProfileInput,
): FormData {
  const formData = new FormData();
  appendProfileFields(formData, input);
  return formData;
}

/*
@ 이미지 교체 PATCH
- 이미지를 포함한 PATCH에서 변경된 필드만 FormData에 추가한다.
- profileImage와 removeImage=true는 동시에 전송할 수 없다.
*/
export function createMoverProfileUpdateFormData(
  input: UpdateMoverProfileInput,
): FormData {
  if (input.profileImage && input.removeImage) {
    throw new Error('프로필 이미지 교체와 삭제를 동시에 요청할 수 없습니다.');
  }

  const formData = new FormData();
  appendProfileFields(formData, input);

  if (input.removeImage) {
    formData.append('removeImage', 'true');
  }

  return formData;
}
