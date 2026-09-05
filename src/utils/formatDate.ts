// 날짜 포맷 유틸

/**
 * 날짜를 사용 목적에 따라 다양한 형식(이용일, 리뷰, 이사일 등)으로 포맷하는 유틸
 *
 * - "이용일": "YYYY. MM. DD(요일) 오전/오후 HH:MM"
 * - "리뷰": "YYYY-MM-DD"
 * - "이사일"/"견적 요청일": "YYYY년 MM월 DD일 (요일)"
 *
 * @param {Date | string | number} date - 변환할 날짜
 * @param {'usage' | 'review' | 'korean'} [type='usage'] - 포맷 타입
 * @returns {string} 지정한 형식의 날짜 문자열
 */
export default function formatDate(
  date: Date | string | number,
  type: 'usage' | 'review' | 'korean' = 'usage',
): string {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  const weekKor = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = weekKor[d.getDay()];

  if (type === 'usage') {
    // 예: 2024. 08. 26(월) 오전 10:00
    const hour = d.getHours();
    const minute = String(d.getMinutes()).padStart(2, '0');
    const isAM = hour < 12;
    const ampm = isAM ? '오전' : '오후';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${year}. ${month}. ${day}(${dayOfWeek}) ${ampm} ${hour12}:${minute}`;
  }

  if (type === 'review') {
    // 예: 2024-07-01
    return `${year}-${month}-${day}`;
  }

  // 'korean' (이사일/견적 요청일 등): 2024년 07월 01일 (월)
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}
