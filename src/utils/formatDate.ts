// 날짜 포맷 유틸

/**
 * 날짜를 사용 목적에 따라 다양한 형식(이용일, 리뷰, 이사일 등)으로 포맷하는 유틸
 *
 * - "이용일": "YYYY. MM. DD(요일) 오전/오후 HH:MM"
 * - "리뷰": "YYYY-MM-DD"
 * - "이사일"/"견적 요청일": "YYYY년 MM월 DD일 (요일)"
 * - "신청일": "YYYY년 M월 D일" (0 없이, 요일 없이)
 * - "상대 시간"(relative): "방금 전" / "N분 전" / "N시간 전" / "어제" / "N일 전"
 * - "견적 요청일(짧게)": "YY. MM. DD."
 *
 * @param {Date | string | number} date - 변환할 날짜
 * @param {'usage' | 'review' | 'korean' | 'relative' | 'requested' | 'short'} [type='usage'] - 포맷 타입
 * @returns {string} 지정한 형식의 날짜 문자열
 */
export default function formatDate(
  date: Date | string | number,
  type:
    | 'usage'
    | 'review'
    | 'korean'
    | 'relative'
    | 'requested'
    | 'short' = 'usage',
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

  if (type === 'relative') {
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / (60 * 1000));
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay === 1) return '어제';
    return `${diffDay}일 전`;
  }

  if (type === 'requested') {
    // 견적 신청일. 이사일과 달리 0을 채우지 않고 요일도 붙이지 않는다
    // 예: 2024년 6월 24일
    return `${year}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  }

  if (type === 'short') {
    // 예: 24. 06. 24.
    return `${String(year).slice(-2)}. ${month}. ${day}.`;
  }

  // 'korean' (이사일/견적 요청일 등): 2024년 07월 01일 (월)
  return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
}
