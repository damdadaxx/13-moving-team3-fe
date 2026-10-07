export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const /* 내 채팅방 목록 */,
  messages: (estimateId: string) =>
    [...chatKeys.all, 'messages', estimateId] as const /* 채팅 메시지 목록 */,
  unreadCount: (estimateId: string) =>
    [
      ...chatKeys.all,
      'unread-count',
      estimateId,
    ] as const /* 채팅방 안 읽은 메시지 수 */,
};
