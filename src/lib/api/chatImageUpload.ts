import type { ChatImageUploadUrl } from '@/types/chat';

/*
@ 채팅 이미지 업로드 (S3 presigned POST)
- PUT이 아니라 POST다 — 4MB 제한을 content-length-range 조건으로 S3가 직접 강제하려면
  presigned POST 정책 방식이어야 한다 (SigV4 presigned PUT엔 그 기능이 없다)
- fields를 먼저 전부 append하고 실제 파일은 반드시 마지막에 'file' 필드로 append한다
  (S3 POST 정책이 필드 순서를 본다 — file이 먼저 오면 그 뒤 필드를 무시한다)
- 응답 바디 없음(204). 4MB 초과 등 정책 위반 시 S3가 주는 에러는 XML이라 메시지를 못 읽는다
*/
export async function uploadChatImage(
  file: File,
  upload: ChatImageUploadUrl,
): Promise<void> {
  const formData = new FormData();
  Object.entries(upload.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  formData.append('file', file);

  const response = await fetch(upload.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}
