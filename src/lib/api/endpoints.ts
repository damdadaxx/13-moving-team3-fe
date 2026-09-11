// API 엔드포인트 모음
// 주석 예시: [메서드] [인증필요여부] - 설명
// 브라우저는 프록시(/api)만 사용. 백엔드 실경로는 프록시가 API_BASE_URL 뒤로 붙인다.
import type { SocialProvider } from '@/types/auth';

const API_PREFIX = '/api';
const api = (path: string) => `${API_PREFIX}${path}`;

export const ENDPOINTS = {
  // --- Auth(인증) ---
  auth: {
    signUp: api('/auth/signUp'), // [POST] 비로그인
    login: api('/auth/login'), // [POST] 비로그인
    logout: api('/auth/logout'), // [POST] 로그인
    refresh: api('/auth/refresh'), // [POST] 비로그인 (refreshToken 쿠키)
    me: api('/auth/me'), // [GET/PATCH] 로그인
    password: api('/auth/password'), // [PATCH] 로그인
    social: (provider: SocialProvider) => api(`/auth/social/${provider}`), // [POST] 비로그인 (프론트 릴레이)
  },

  // --- Mover(기사) ---
  mover: {
    profile: api('/mover/profile'), // [POST/GET/PATCH] 로그인
    list: api('/mover'), // [GET] 비로그인
    detail: (id: number | string) => api(`/mover/${id}`), // [GET] 비로그인
  },

  // --- Customer(고객) ---
  customer: {
    profile: api('/customer/profile'), // [POST/GET/PATCH] 로그인
  },

  // --- Estimate(견적) ---
  estimate: {
    request: api('/estimate-request'), // [POST] 로그인 - 견적 요청
    estimates: (estimateRequestId: number | string) =>
      api(`/estimate-requests/${estimateRequestId}/estimates`), // [POST/GET] 로그인 - 지정 견적목록
    list: api('/estimates'), // [GET] 로그인 - 내 견적 목록
    detail: (estimateId: number | string) => api(`/estimates/${estimateId}`), // [GET] 로그인 - 견적 상세
    update: (estimateId: number | string) => api(`/estimates/${estimateId}`), // [PATCH] 로그인 - 견적 수정
  },

  // --- Review(리뷰) ---
  review: {
    mine: api('/reviews/me'), // [GET] 로그인 - 내가 쓴 리뷰 목록
    byMover: (id: number | string) => api(`/reviews/mover/${id}`), // [GET] 비로그인 - 기사 리뷰 목록
    create: api('/reviews'), // [POST] 로그인 - 리뷰 작성
  },

  // --- Like(찜) ---
  like: {
    mine: api('/likes/me'), // [GET] 로그인 - 찜한 기사님 목록
    create: api('/likes'), // [POST] 로그인 - 찜하기
    bulkDelete: api('/likes/bulk-delete'), // [POST] 로그인 - 여러 찜 취소
    delete: (id: number | string) => api(`/likes/${id}`), // [DELETE] 로그인 - 찜 취소
  },

  // --- Notification(알림) ---
  notification: {
    list: api('/notifications'), // [GET] 로그인 - 알림 목록
    unreadCount: api('/notifications/unread-count'), // [GET] 로그인 - 안 읽은 알림수(GNB)
    read: (id: number | string) => api(`/notifications/${id}/read`), // [PATCH] 로그인 - 알림 읽음(개별)
    readAll: api('/notifications/read-all'), // [PATCH] 로그인 - 전체 읽음
  },
} as const;
