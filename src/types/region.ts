/*
@ 지역 값
- 백엔드 Prisma Region enum과 동일한 값을 사용합니다.
- Chip, Dropdown, 프로필 등 여러 도메인에서 함께 사용하는 공용 상수입니다.
- 화면에 표시할 한글 이름은 label을 사용합니다.
*/

export const REGION_OPTIONS = [
  { value: 'SEOUL', label: '서울' },
  { value: 'GYEONGGI', label: '경기' },
  { value: 'INCHEON', label: '인천' },
  { value: 'GANGWON', label: '강원' },
  { value: 'CHUNGBUK', label: '충북' },
  { value: 'CHUNGNAM', label: '충남' },
  { value: 'SEJONG', label: '세종' },
  { value: 'DAEJEON', label: '대전' },
  { value: 'JEONBUK', label: '전북' },
  { value: 'JEONNAM', label: '전남' },
  { value: 'GWANGJU', label: '광주' },
  { value: 'GYEONGBUK', label: '경북' },
  { value: 'GYEONGNAM', label: '경남' },
  { value: 'DAEGU', label: '대구' },
  { value: 'ULSAN', label: '울산' },
  { value: 'BUSAN', label: '부산' },
  { value: 'JEJU', label: '제주' },
] as const;

export type Region = (typeof REGION_OPTIONS)[number]['value'];
