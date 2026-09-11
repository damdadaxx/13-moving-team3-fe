/** 모든 Button이 공유하는 기본 클래스
 * - href를 넘기면 `<Link>(=<a>)`로 렌더되는데 `<a>`는 :disabled/:enabled에 걸리지 않음.
 *   상태 스타일은 전부 aria-disabled 기준으로 맞춤
 */
export const BUTTON_BASE_CLASS =
  'flex w-full cursor-pointer items-center justify-center transition aria-disabled:cursor-not-allowed disabled:cursor-not-allowed';
