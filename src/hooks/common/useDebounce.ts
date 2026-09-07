import { useEffect, useState } from 'react';

/**
 * 값 변화에 디바운싱(delay 후 반영) 처리하는 공통 훅
 *
 * @template T
 * @param {T} value - 디바운싱할 값
 * @param {number} [delay=500] - 값이 변경된 뒤 반영될 때까지의 대기 시간(ms)
 * @returns {T} 디바운스된 값
 *
 * @example
 * const debouncedValue = useDebounce(inputValue, 300);
 */
function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
