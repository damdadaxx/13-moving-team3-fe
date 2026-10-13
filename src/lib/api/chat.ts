import type {
  ChatImageUploadUrl,
  ChatMessage,
  ChatMessageList,
  ChatMessageListQuery,
  ChatRoomList,
  ChatUnreadCount,
  SendChatMessageInput,
} from '@/types/chat';

import clientFetch from '@/lib/api/clientFetch';
import { ENDPOINTS } from '@/lib/api/endpoints';

const DEFAULT_PAGE_SIZE = 10;

/** GET /chat/rooms - 내 채팅방 목록 (GNB 플로팅 버튼용) */
export function getChatRooms(): Promise<ChatRoomList> {
  return clientFetch<ChatRoomList>(ENDPOINTS.chat.rooms);
}

/** GET /chat/rooms/:estimateId/messages - 커서 기반, size 기본 10 */
export function getChatMessages(
  estimateId: string,
  query: ChatMessageListQuery = {},
): Promise<ChatMessageList> {
  const params = new URLSearchParams();
  params.set('size', String(query.size ?? DEFAULT_PAGE_SIZE));
  if (query.cursor) params.set('cursor', query.cursor);

  return clientFetch<ChatMessageList>(
    `${ENDPOINTS.chat.messages(estimateId)}?${params.toString()}`,
  );
}

/** POST /chat/rooms/:estimateId/messages */
export function sendChatMessage(
  estimateId: string,
  input: SendChatMessageInput,
): Promise<ChatMessage> {
  return clientFetch<ChatMessage>(ENDPOINTS.chat.messages(estimateId), {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

/** PATCH /chat/rooms/:estimateId/read */
export function readChatMessages(estimateId: string): Promise<null> {
  return clientFetch<null>(ENDPOINTS.chat.read(estimateId), {
    method: 'PATCH',
  });
}

/** GET /chat/rooms/:estimateId/unread-count */
export function getChatUnreadCount(
  estimateId: string,
): Promise<ChatUnreadCount> {
  return clientFetch<ChatUnreadCount>(ENDPOINTS.chat.unreadCount(estimateId));
}

/** POST /chat/rooms/:estimateId/image - presigned 업로드 URL 발급 */
export function getChatImageUploadUrl(
  estimateId: string,
  fileName: string,
): Promise<ChatImageUploadUrl> {
  return clientFetch<ChatImageUploadUrl>(ENDPOINTS.chat.image(estimateId), {
    method: 'POST',
    body: JSON.stringify({ fileName }),
  });
}
