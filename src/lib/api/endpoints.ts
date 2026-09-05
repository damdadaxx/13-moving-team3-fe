// API 엔드포인트 모음
// 주석 예시: [메서드] [인증필요여부] - 설명

export const ENDPOINTS = {
  // --- Auth(인증) ---
  auth: {
    signUp: '/auth/signUp', // [POST] 비로그인
    login: '/auth/login', // [POST] 비로그인
    logout: '/auth/logout', // [POST] 로그인
    refresh: '/auth/refresh', // [POST] 비로그인 (refreshToken 쿠키)
    me: '/auth/me', // [GET/PATCH] 로그인
    password: '/auth/password', // [PATCH] 로그인
    social: (provider: SocialProvider) => `/auth/${provider}`, // [GET] 비로그인 (소셜 진입)
    socialCallback: (provider: SocialProvider) => `/auth/${provider}/callback`, // [GET] 비로그인 (소셜 콜백)
  },

  // --- Mover(기사) ---
  mover: {
    profile: '/mover/profile', // [POST/GET/PATCH] 로그인
    list: '/mover', // [GET] 비로그인
    detail: (id: number | string) => `/mover/${id}`, // [GET] 비로그인
  },

  // --- Customer(고객) ---
  customer: {
    profile: '/customer/profile', // [POST/GET/PATCH] 로그인
  },

  // --- Estimate(견적) ---
  estimate: {
    request: '/estimate-request', // [POST] 로그인 - 견적 요청
    estimates: (estimateRequestId: number | string) =>
      `/estimate-requests/${estimateRequestId}/estimates`, // [POST/GET] 로그인 - 지정 견적목록
    list: '/estimates', // [GET] 로그인 - 내 견적 목록
    detail: (estimateId: number | string) => `/estimates/${estimateId}`, // [GET] 로그인 - 견적 상세
    update: (estimateId: number | string) => `/estimates/${estimateId}`, // [PATCH] 로그인 - 견적 수정
  },

  // --- Review(리뷰) ---
  review: {
    mine: '/reviews/me', // [GET] 로그인 - 내가 쓴 리뷰 목록
    byMover: (id: number | string) => `/reviews/mover/${id}`, // [GET] 비로그인 - 기사 리뷰 목록
    create: '/reviews', // [POST] 로그인 - 리뷰 작성
  },

  // --- Like(찜) ---
  like: {
    mine: '/likes/me', // [GET] 로그인 - 찜한 기사님 목록
    create: '/likes', // [POST] 로그인 - 찜하기
    bulkDelete: '/likes/bulk-delete', // [POST] 로그인 - 여러 찜 취소
    delete: (id: number | string) => `/likes/${id}`, // [DELETE] 로그인 - 찜 취소
  },

  // --- Notification(알림) ---
  notification: {
    list: '/notifications', // [GET] 로그인 - 알림 목록
    unreadCount: '/notifications/unread-count', // [GET] 로그인 - 안 읽은 알림수(GNB)
    read: (id: number | string) => `/notifications/${id}/read`, // [PATCH] 로그인 - 알림 읽음(개별)
    readAll: '/notifications/read-all', // [PATCH] 로그인 - 전체 읽음
  },
} as const;

// 소셜 로그인 Provider 타입
type SocialProvider = 'google' | 'kakao' | 'naver';
