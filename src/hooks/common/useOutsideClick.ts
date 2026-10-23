import { RefObject, useEffect } from 'react';

interface UseOutsideClickOptions {
  enabled?: boolean;
  detectFocus?: boolean;
  closeOnEscape?: boolean;
}

type OutsideClickHandler = (e: MouseEvent | FocusEvent | KeyboardEvent) => void;

/**
 * 외부 클릭(Outside Click) 감지 훅
 *
 * @param {React.RefObject<HTMLElement | null>} ref - 감지할 요소의 ref
 * @param {(e: MouseEvent | FocusEvent | KeyboardEvent) => void} handler - 외부 클릭/포커스/ESC에 실행될 콜백
 * @param {Object} [options] - 옵션 객체
 * @param {boolean} [options.enabled=true] - 감지 활성화 여부
 * @param {boolean} [options.detectFocus=false] - true면 키보드(Tab 등)로 ref 바깥 포커스 이동 시에도 handler 호출
 * @param {boolean} [options.closeOnEscape=false] - true면 ESC 키 입력에도 handler 호출
 *
 * @description
 * ref로 지정한 요소 외부를 클릭(마우스)하거나,
 * (detectFocus=true 시) 키보드로 포커스가 바깥으로 이동하거나,
 * (closeOnEscape=true 시) ESC 키를 눌렀을 때 handler를 호출하는 공통 훅입니다.
 * 옵션 미사용 시 기본적으로 마우스 외부 클릭만 감지합니다.
 */
const MODAL_ROOT_ID = 'modal-root';

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: OutsideClickHandler,
  {
    enabled = true,
    detectFocus = false,
    closeOnEscape = false,
  }: UseOutsideClickOptions = {},
) {
  useEffect(() => {
    if (!enabled) return;

    function handleOutside(e: MouseEvent | FocusEvent) {
      // e.target이 Node|null로 타이핑될 수 있으므로 type guard 사용
      if (!ref.current || !(e.target instanceof Node)) return;
      if (ref.current.contains(e.target)) return;

      /*
      @ 모달/라이트박스는 #modal-root로 포탈돼서 감시 대상(ref) 바깥의 DOM 트리에 있다.
      - 그래서 모달 안을 클릭하면(전송 버튼, 배경, 이미지 크게 보기 등) 이 ref 입장에서는
        "바깥 클릭"으로 보여 드롭다운/팝오버가 같이 닫혀버린다.
      - ref 자신이 모달 안(#modal-root 하위)에 있는 경우는 제외한다 — 그건 모달 자신의
        바깥 클릭 감지(배경 클릭으로 모달 닫기)라서 그대로 동작해야 한다.
      */
      const modalRoot = document.getElementById(MODAL_ROOT_ID);
      const refIsInsideModal = !!modalRoot && modalRoot.contains(ref.current);
      const targetIsInsideModal = !!modalRoot && modalRoot.contains(e.target);
      if (!refIsInsideModal && targetIsInsideModal) return;

      handler(e);
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') handler(e);
    }

    document.addEventListener('mousedown', handleOutside);
    if (detectFocus) {
      document.addEventListener('focusin', handleOutside);
    }
    if (closeOnEscape) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutside);
      if (detectFocus) {
        document.removeEventListener('focusin', handleOutside);
      }
      if (closeOnEscape) {
        document.removeEventListener('keydown', handleEscape);
      }
    };
  }, [ref, handler, enabled, detectFocus, closeOnEscape]);
}
