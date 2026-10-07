/*
@ 채팅 관련 타입 (Supabase 분리 DB, chat_messages 테이블 기반)
- 채팅방 키는 estimateId(기존 도메인 DB의 견적 id)다
- ACCEPTED: 송수신+이미지+조회 / COMPLETED: 조회만 / 그 외: 접근 불가
- 백엔드 OpenAPI(ChatMessage/ChatMessageListResponse/SendMessageResponse/
  UnreadCountResponse/ImageUploadResponse) 스키마와 이름을 맞춘다
*/

export interface ChatMessage {
  /** Supabase bigint id. 문자열로 내려온다 */
  messageId: string;
  senderId: string;
  content: string | null;
  imageUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface ChatMessageList {
  list: ChatMessage[];
  /** 다음 페이지 cursor. 없으면 마지막 페이지 */
  nextCursor: string | null;
}

export interface ChatMessageListQuery {
  cursor?: string;
  size?: number;
}

/** POST /chat/rooms/:estimateId/messages 요청 본문
 * - content만, imageUrl만, 혹은 둘 다 보낼 수 있다 (백엔드 예시 기준)
 */
export interface SendChatMessageInput {
  content?: string;
  imageUrl?: string;
}

export interface ChatUnreadCount {
  unreadCount: number;
}

/** POST /chat/rooms/:estimateId/image 응답
 * - uploadUrl(PUT)로 직접 업로드 후, path를 공개 URL로 변환해 imageUrl로 쓴다
 */
export interface ChatImageUploadUrl {
  uploadUrl: string;
  path: string;
  token: string;
}

/** GET /chat/rooms - 내가 참여 중인 채팅방(견적 ACCEPTED, 요청 CONFIRMED·COMPLETED) 목록
 * - 마지막 메시지 최신순. 메시지 없는 방은 뒤로 밀린다
 */
export interface ChatRoomOtherParty {
  /** 고객이면 기사님, 기사님이면 고객 */
  id: string;
  name: string;
  imgUrl: string | null;
}

export interface ChatRoomListItem {
  estimateId: string;
  otherParty: ChatRoomOtherParty;
  /** 메시지가 없는 방이면 null */
  lastMessage: ChatMessage | null;
  unreadCount: number;
}

export interface ChatRoomList {
  list: ChatRoomListItem[];
}
