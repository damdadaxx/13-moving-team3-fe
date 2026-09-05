// react-simple-star-rating 래퍼 컴포넌트
// 리뷰 별점 입력/표시에 사용

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export default function StarRating({ value }: StarRatingProps) {
  return <div>별점: {value}</div>;
}
