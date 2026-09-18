// [받은 요청] 페이지 목업 데이터
// 이번 브랜치는 퍼블리싱까지만 진행한다. API 연동 없이 UI만 목업 데이터로 완성한다.
import type { ServiceType } from '@/types/serviceType';

export interface ReceivedRequestMock {
  id: string;
  serviceType: ServiceType;
  /** true면 카드에 "지정 견적 요청" 칩이 붙는다 */
  isDesignated: boolean;
  /** "서비스 가능 지역" 체크박스 필터용 목업 필드. 실제 지역 매칭 기준은 백엔드 확정 전까지 미정 */
  isRegionAvailable: boolean;
  customerName: string;
  fromRegion: string;
  toRegion: string;
  /** 카드에 표시할 이사일 (예: '2024년 07월 01일 (월)') */
  moveDateLabel: string;
  /** 이사 빠른순 정렬용 ISO 날짜 */
  moveDate: string;
  /** 카드에 표시할 상대 시간 (예: '1시간 전') */
  requestedAtLabel: string;
  /** 요청일 빠른순 정렬용 ISO 일시 */
  requestedAt: string;
}

export const MOCK_RECEIVED_REQUESTS: ReceivedRequestMock[] = [
  {
    id: 'req-1',
    serviceType: 'SMALL_MOVE',
    isDesignated: true,
    isRegionAvailable: true,
    customerName: '김인서',
    fromRegion: '서울시 중구',
    toRegion: '경기도 수원시',
    moveDateLabel: '2024년 07월 01일 (월)',
    moveDate: '2024-07-01',
    requestedAtLabel: '1시간 전',
    requestedAt: '2024-06-20T09:00:00.000Z',
  },
  {
    id: 'req-2',
    serviceType: 'HOME_MOVE',
    isDesignated: true,
    isRegionAvailable: true,
    customerName: '박서준',
    fromRegion: '인천시 남동구',
    toRegion: '서울시 강남구',
    moveDateLabel: '2024년 07월 03일 (수)',
    moveDate: '2024-07-03',
    requestedAtLabel: '2시간 전',
    requestedAt: '2024-06-20T08:00:00.000Z',
  },
  {
    id: 'req-3',
    serviceType: 'OFFICE_MOVE',
    isDesignated: true,
    isRegionAvailable: false,
    customerName: '이하은',
    fromRegion: '경기도 성남시',
    toRegion: '서울시 마포구',
    moveDateLabel: '2024년 07월 05일 (금)',
    moveDate: '2024-07-05',
    requestedAtLabel: '3시간 전',
    requestedAt: '2024-06-20T07:00:00.000Z',
  },
  {
    id: 'req-4',
    serviceType: 'SMALL_MOVE',
    isDesignated: false,
    isRegionAvailable: true,
    customerName: '최지우',
    fromRegion: '서울시 중구',
    toRegion: '경기도 수원시',
    moveDateLabel: '2024년 07월 01일 (월)',
    moveDate: '2024-07-01',
    requestedAtLabel: '5시간 전',
    requestedAt: '2024-06-20T05:00:00.000Z',
  },
  {
    id: 'req-5',
    serviceType: 'HOME_MOVE',
    isDesignated: false,
    isRegionAvailable: true,
    customerName: '정우진',
    fromRegion: '서울시 노원구',
    toRegion: '경기도 고양시',
    moveDateLabel: '2024년 07월 08일 (월)',
    moveDate: '2024-07-08',
    requestedAtLabel: '6시간 전',
    requestedAt: '2024-06-20T04:00:00.000Z',
  },
  {
    id: 'req-6',
    serviceType: 'SMALL_MOVE',
    isDesignated: false,
    isRegionAvailable: false,
    customerName: '한소율',
    fromRegion: '경기도 안양시',
    toRegion: '서울시 동작구',
    moveDateLabel: '2024년 07월 10일 (수)',
    moveDate: '2024-07-10',
    requestedAtLabel: '8시간 전',
    requestedAt: '2024-06-20T02:00:00.000Z',
  },
  {
    id: 'req-7',
    serviceType: 'OFFICE_MOVE',
    isDesignated: false,
    isRegionAvailable: true,
    customerName: '오은우',
    fromRegion: '서울시 송파구',
    toRegion: '서울시 종로구',
    moveDateLabel: '2024년 07월 12일 (금)',
    moveDate: '2024-07-12',
    requestedAtLabel: '어제',
    requestedAt: '2024-06-19T09:00:00.000Z',
  },
  {
    id: 'req-8',
    serviceType: 'HOME_MOVE',
    isDesignated: true,
    isRegionAvailable: true,
    customerName: '신도윤',
    fromRegion: '경기도 용인시',
    toRegion: '서울시 서초구',
    moveDateLabel: '2024년 07월 15일 (월)',
    moveDate: '2024-07-15',
    requestedAtLabel: '어제',
    requestedAt: '2024-06-19T06:00:00.000Z',
  },
];
