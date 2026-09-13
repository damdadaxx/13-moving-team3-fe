// 공용 폼 라벨 컴포넌트
// htmlFor로 input과 연결해서 라벨 클릭 시 포커스가 이동하도록 쓴다
import { cn } from '@/utils/cn';

interface LabelProps extends React.ComponentProps<'label'> {
  children: React.ReactNode;
}

export default function Label({ children, className, ...props }: LabelProps) {
  return (
    <label
      className={cn('text-md-medium text-black-400', className)}
      {...props}
    >
      {children}
    </label>
  );
}
