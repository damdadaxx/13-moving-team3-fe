/*
@ 전화번호 표시 형식
- 화면에는 010-1234-5678 처럼 하이픈을 넣어 보여주고, API 에는 숫자만 보낸다
- 최대 11자리까지만 받는다 (010 + 4자리 + 4자리)
- 입력 중(010-123)에도 어색하지 않도록 자리 수에 맞춰 점진적으로 하이픈을 넣는다
*/
const MAX_PHONE_NUMBER_DIGITS = 11;

/** 하이픈·공백 등을 걷어내고 숫자만 남긴다 (API 전송용) */
export function toPhoneNumberDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, MAX_PHONE_NUMBER_DIGITS);
}

/** 숫자를 010-1234-5678 형태로 만든다 (화면 표시용) */
export function formatPhoneNumber(value: string): string {
  const digits = toPhoneNumberDigits(value);

  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

  // 11자리는 3-4-4, 10자리는 3-3-4로 끊는다
  const middleLength = digits.length === MAX_PHONE_NUMBER_DIGITS ? 4 : 3;
  const middle = digits.slice(3, 3 + middleLength);
  const last = digits.slice(3 + middleLength);

  return `${digits.slice(0, 3)}-${middle}-${last}`;
}
