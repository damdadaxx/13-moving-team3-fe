// react-hook-form 연동 기본 Input 컴포넌트
import { cn } from '@/utils/cn';

interface InputBaseProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function InputBase({
  label,
  error,
  className,
  ...props
}: InputBaseProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-md-medium">{label}</label>}
      <input
        className={cn(
          'rounded-[8px] border border-gray-300 px-3 py-2',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs-medium text-red-500">{error}</p>}
    </div>
  );
}
