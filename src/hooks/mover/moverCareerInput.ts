/*=================================================
기사님 경력 입력 정규화
=================================================*/

/*
@ 숫자 입력 공통 정리
- 키보드 종류와 상관없이 숫자가 아닌 문자는 제거한다.
- 값이 비어 있으면 사용자가 다시 입력할 수 있도록 빈 문자열을 유지한다.
- 00, 003처럼 앞에 붙은 불필요한 0은 각각 0, 3으로 정리한다.
*/
export function normalizeCareerNumberInput(value: string): string {
  const digitsOnly = value.replace(/\D/g, '');

  if (!digitsOnly) return '';

  return digitsOnly.replace(/^0+(?=\d)/, '');
}

interface NormalizedCareerRemainder {
  careerYears: string;
  careerRemainderMonths: string;
}

/*
@ 개월을 연수와 나머지 개월로 환산
- 개월을 입력하면 12개월마다 1년으로 올려 기존 연수에 더한다.
  예: 3년 + 12개월 → 4년 0개월
- 12개월 미만만 입력했고 연수가 비어 있으면 연수를 0으로 채운다.
  예: 빈 연수 + 11개월 → 0년 11개월
- 붙여넣기처럼 한 번에 큰 값이 들어와도 몫과 나머지를 모두 계산한다.
  예: 빈 연수 + 26개월 → 2년 2개월
- 개월을 모두 지운 경우에는 재입력을 방해하지 않도록 빈 값을 유지한다.
*/
export function normalizeCareerRemainderInput(
  value: string,
  currentCareerYears: string,
): NormalizedCareerRemainder {
  const normalizedMonths = normalizeCareerNumberInput(value);

  if (!normalizedMonths) {
    return {
      careerYears: currentCareerYears,
      careerRemainderMonths: '',
    };
  }

  const normalizedYears = normalizeCareerNumberInput(currentCareerYears);
  const totalMonths = Number(normalizedMonths);
  const additionalYears = Math.floor(totalMonths / 12);
  const remainderMonths = totalMonths % 12;

  return {
    careerYears: String(Number(normalizedYears || '0') + additionalYears),
    careerRemainderMonths: String(remainderMonths),
  };
}
