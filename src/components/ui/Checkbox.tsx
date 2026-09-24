// 공용 체크박스 (목록 필터 등에서 사용)
// Figma: check-box (node 1:10449)
'use client';

import IcCheck from '@/assets/icons/ic_check.svg';

import { cn } from '@/utils/cn';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  className,
}: CheckboxProps) {
  return (
    <label
      className={cn('flex cursor-pointer items-center gap-[4px]', className)}
    >
      <span className="relative flex size-[36px] shrink-0 items-center justify-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="absolute inset-0 size-full cursor-pointer opacity-0"
        />
        <span
          aria-hidden="true"
          className={cn(
            'flex size-[20px] items-center justify-center rounded-[4px]',
            checked ? 'bg-orange-400' : 'border border-gray-100 bg-gray-50',
          )}
        >
          {checked && <IcCheck className="h-[8px] w-[10px]" />}
        </span>
      </span>
      <span className="text-md-regular tablet:text-lg-regular text-black-500">
        {label}
      </span>
    </label>
  );
}
