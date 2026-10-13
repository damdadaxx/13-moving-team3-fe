import { supabase } from '@/lib/supabase/client';

const CHAT_IMAGE_BUCKET = 'chat-images';

/*
@ 채팅 이미지 업로드
- getChatImageUploadUrl(POST /chat/rooms/:estimateId/image)로 받은 path·token으로
  Supabase Storage에 직접 PUT 업로드한다
- 메시지 전송(POST .../messages)은 이 path를 imagePath로 받고, 응답의 imageUrl은
  서버가 발급한 signed URL이라 여기서는 공개 URL로 바꾸지 않는다
*/
export async function uploadChatImage(
  path: string,
  token: string,
  file: File,
): Promise<void> {
  const { error } = await supabase.storage
    .from(CHAT_IMAGE_BUCKET)
    .uploadToSignedUrl(path, token, file);

  if (error) throw error;
}
