/*
@ Google Analytics 수집 동의
- 브라우저 쿠키에만 남긴다. 계정과 무관해서 서버 테이블은 두지 않는다.
- granted일 때만 분석 스크립트를 넣고, denied면 넣지 않는다.
*/

export const ANALYTICS_CONSENT_COOKIE = 'analytics_consent';
export const ANALYTICS_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export type AnalyticsConsent = 'granted' | 'denied';

export function parseAnalyticsConsent(
  value: string | undefined,
): AnalyticsConsent | null {
  if (value === 'granted' || value === 'denied') return value;
  return null;
}

export function createAnalyticsConsentCookie(consent: AnalyticsConsent) {
  return `${ANALYTICS_CONSENT_COOKIE}=${consent}; Path=/; Max-Age=${ANALYTICS_CONSENT_MAX_AGE}; SameSite=Lax`;
}
