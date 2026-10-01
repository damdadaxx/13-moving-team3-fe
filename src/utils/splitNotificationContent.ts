import { SERVICE_TYPE_LABELS } from '@/types/serviceType';

export interface NotificationContentPart {
  text: string;
  isHighlight?: boolean;
}

const SERVICE_LABELS = Object.values(SERVICE_TYPE_LABELS).join('|');

/*
@ 알림 문구에서 강조 구간을 나눈다
- 백엔드는 완성된 문장만 내려준다 (notificationMessage.ts)
- 맞는 문장이 아니면 전체를 그대로 보여준다
*/
export default function splitNotificationContent(
  content: string,
): NotificationContentPart[] {
  const patterns = [
    new RegExp(`^(.*기사님의 )((?:${SERVICE_LABELS}) 견적)(이 도착했어요\\.)$`),
    new RegExp(
      `^(.*님의 )((?:${SERVICE_LABELS}) 견적 요청)(이 도착했어요\\.)$`,
    ),
    /^(.*견적이 )(확정)(되었어요\.)$/,
    /^(.*은 )(.+ 이사 예정일)(이에요\.)$/,
  ];

  for (const pattern of patterns) {
    const matched = content.match(pattern);
    if (!matched) continue;
    return [
      { text: matched[1] },
      { text: matched[2], isHighlight: true },
      { text: matched[3] },
    ];
  }

  return [{ text: content }];
}
