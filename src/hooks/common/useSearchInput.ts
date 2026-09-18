import { useState } from 'react';

import useDebounce from '@/hooks/common/useDebounce';

interface UseSearchInputOptions {
  /** 디바운스 대기 시간(ms) */
  delay?: number;
}

/**
 * 검색창 입력값 + 디바운스를 묶은 공통 훅
 * 입력은 즉시 반영해 타이핑이 끊기지 않게 하고, 실제 검색/필터링에는
 * debouncedValue를 사용한다.
 *
 * @example
 * const { value, debouncedValue, onChange } = useSearchInput();
 * <SearchBar value={value} onChange={onChange} />
 * // debouncedValue로 목록 필터링 또는 쿼리 키 구성
 */
export default function useSearchInput(
  initialValue = '',
  { delay = 500 }: UseSearchInputOptions = {},
) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, delay);

  function reset() {
    setValue('');
  }

  return { value, debouncedValue, onChange: setValue, reset };
}
