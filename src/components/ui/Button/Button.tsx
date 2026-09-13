// 공용 버튼 컴포넌트
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'w-full bg-orange-400 text-gray-50 rounded-[12px] px-[24px] py-[14px] text-lg-semibold',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
