import type { ChatMessage, ChatMessageList } from '@/types/chat';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import { getChatMessages } from '@/lib/api/chat';

import { chatKeys } from '@/hooks/features/chat/queries/keys';

type MessagesData = InfiniteData<ChatMessageList, string | undefined>;

/*
@ 채팅 메시지 캐시 직접 갱신
- Socket.IO 이벤트나 전송 응답으로 이미 알고 있는 변경은 목록을 다시 불러오지 않고 캐시에 바로 반영한다
  (재조회는 BFF → ALB → Express → DB까지 전체 경로를 타고, 이미지가 있으면 signed URL도 새로 발급한다)
- 메시지 목록을 한 번도 안 연 방은 캐시가 없으므로 건드리지 않는다. 열 때 새로 조회한다
- 목록은 페이지마다 최신 메시지가 앞에 온다 (ChatRoomView가 reverse해서 그린다)
*/

/** 이 방의 메시지 캐시에 해당 메시지가 이미 있는지 */
export function hasChatMessageInCache(
  queryClient: QueryClient,
  estimateId: string,
  messageId: string,
): boolean {
  const data = queryClient.getQueryData<MessagesData>(
    chatKeys.messages(estimateId),
  );

  return Boolean(
    data?.pages.some((page) =>
      page.list.some((message) => message.messageId === messageId),
    ),
  );
}

/** 메시지 캐시가 있는 방에만, 중복이 아니면 첫 페이지 맨 앞에 새 메시지를 넣는다 */
export function addChatMessageToCache(
  queryClient: QueryClient,
  estimateId: string,
  message: ChatMessage,
) {
  queryClient.setQueryData<MessagesData>(
    chatKeys.messages(estimateId),
    (data) => {
      if (!data || data.pages.length === 0) return data;
      const exists = data.pages.some((page) =>
        page.list.some((item) => item.messageId === message.messageId),
      );
      if (exists) return data;

      const [firstPage, ...restPages] = data.pages;
      return {
        ...data,
        pages: [
          { ...firstPage, list: [message, ...firstPage.list] },
          ...restPages,
        ],
      };
    },
  );
}

/** readerId가 보낸 게 아닌(=내가 보낸) 메시지를 전부 읽음으로 바꾼다 ('read' 이벤트용)
 * - payload가 { readerId }뿐이라 messageId를 모른다. BE의 markRead도 같은 조건
 *   (senderId !== readerId)으로 갱신하므로 캐시도 동일하게 맞춘다
 */
export function setMessagesReadByOthersInCache(
  queryClient: QueryClient,
  estimateId: string,
  readerId: string,
) {
  queryClient.setQueryData<MessagesData>(
    chatKeys.messages(estimateId),
    (data) => {
      if (!data) return data;

      let isChanged = false;
      const pages = data.pages.map((page) => ({
        ...page,
        list: page.list.map((message) => {
          if (message.senderId === readerId || message.isRead) return message;
          isChanged = true;
          return { ...message, isRead: true };
        }),
      }));

      return isChanged ? { ...data, pages } : data;
    },
  );
}

/*
@ 최신 메시지를 받아 캐시에 합친다 (이미 쌓인 이전 메시지는 그대로 둔다)
- infinite query를 통째로 다시 불러오면 첫 페이지가 "최신 N개"로 바뀌면서
  이전에 불러둔 메시지가 사라지거나, 페이지 사이에 빈 구간이 생긴다 (커서가 옛날 값이라서)
- 그래서 최신 한 페이지만 받아서, 캐시에 없는 메시지만 첫 페이지 앞에 넣고
  읽음 상태만 갱신한다. imageUrl은 이미 있으면 바꾸지 않는다 (URL이 바뀌면 이미지를 다시 받는다)
- 메시지 캐시가 없는 방은 건드리지 않는다. 요청이 실패해도 기존 화면은 그대로 둔다
*/
export async function refreshLatestChatMessages(
  queryClient: QueryClient,
  estimateId: string,
) {
  if (!queryClient.getQueryData(chatKeys.messages(estimateId))) return;

  let latest: ChatMessageList;
  try {
    latest = await getChatMessages(estimateId);
  } catch {
    return;
  }

  queryClient.setQueryData<MessagesData>(
    chatKeys.messages(estimateId),
    (data) => {
      if (!data || data.pages.length === 0) return data;

      const latestById = new Map(
        latest.list.map((message) => [message.messageId, message]),
      );
      const knownIds = new Set<string>();
      const pages = data.pages.map((page) => ({
        ...page,
        list: page.list.map((message) => {
          knownIds.add(message.messageId);
          const fresh = latestById.get(message.messageId);
          return fresh && fresh.isRead !== message.isRead
            ? { ...message, isRead: fresh.isRead }
            : message;
        }),
      }));

      const added = latest.list.filter(
        (message) => !knownIds.has(message.messageId),
      );
      if (added.length === 0) return { ...data, pages };

      const [firstPage, ...restPages] = pages;
      return {
        ...data,
        pages: [
          { ...firstPage, list: [...added, ...firstPage.list] },
          ...restPages,
        ],
      };
    },
  );
}
