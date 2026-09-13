/*
@ 서비스 타입 값
- 백엔드 Prisma ServiceType enum과 동일한 값을 사용합니다.
- DESIGNATED는 서비스 타입이 아니므로 이 목록에 포함하지 않습니다.
- 화면에 표시할 한글 이름은 SERVICE_TYPE_LABELS를 사용합니다.
*/

export const SERVICE_TYPES = [
  'SMALL_MOVE',
  'HOME_MOVE',
  'OFFICE_MOVE',
] as const;

export type ServiceType = (typeof SERVICE_TYPES)[number];

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  SMALL_MOVE: '소형이사',
  HOME_MOVE: '가정이사',
  OFFICE_MOVE: '사무실이사',
};
