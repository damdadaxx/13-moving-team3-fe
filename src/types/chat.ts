/*
@ 채팅 관련 타입 (도메인 DB의 chatMessage 테이블 기반, Socket.IO로 실시간 반영)
- 채팅방 키는 estimateId(기존 도메인 DB의 견적 id)다. Socket.IO room 이름도 estimateId다
- ACCEPTED: 송수신+이미지+조회 / COMPLETED: 조회만 / 그 외: 접근 불가
- 백엔드 OpenAPI(ChatMessage/ChatMessageListResponse/SendMessageResponse/
  UnreadCountResponse/ImageUploadResponse) 스키마와 이름을 맞춘다
*/

export interface ChatMessage {
  /** UUID */
  messageId: string;
  estimateId: string;
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
 * - content 또는 imagePath 중 하나는 있어야 한다 (둘 다 보낼 수도 있다)
 * - imagePath는 Storage 경로(ChatImageUploadUrl.path)다. 응답 ChatMessage.imageUrl은
 *   서버가 발급한 signed URL(짧은 만료)이라 요청 바디에는 쓰지 않는다
 */
export interface SendChatMessageInput {
  content?: string;
  imagePath?: string;
}

export interface ChatUnreadCount {
  unreadCount: number;
}

/** POST /chat/rooms/:estimateId/image 응답
 * - uploadUrl(POST, S3 presigned POST)로 fields를 같이 실어 직접 업로드한 뒤,
 *   path를 메시지 전송(imagePath)에 쓴다. PUT이 아니라 POST — 4MB 제한을
 *   content-length-range 조건으로 S3가 강제하려면 POST 정책 방식이어야 한다
 */
export interface ChatImageUploadUrl {
  uploadUrl: string;
  path: string;
  fields: Record<string, string>;
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
