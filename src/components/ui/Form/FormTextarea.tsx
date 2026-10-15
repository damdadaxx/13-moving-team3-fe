'use client';

import { useId } from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import Textarea, { type TextareaProps } from '@/components/ui/Form/Textarea';
import TextLengthHint from '@/components/ui/Form/TextLengthHint';

/*
@ 글자 수 안내가 있는 Textarea (React Hook Form 전용)
- 입력창 아래에 TextLengthHint로 최소(·최대) 글자 수 규칙과 실시간 글자 수를 보여줍니다.
- 최소 글자 수·에러 메시지는 zod 스키마가 맡습니다. minLength는 안내용이므로 스키마의 값과 같게 맞춥니다.
  (예: messageTextValidation)
- 글자 수는 입력한 그대로(공백 포함) 셉니다.
- 나머지 props(label, labelVariant, required, placeholder, disabled 등)는 공용 Textarea로 전달됩니다.

@ 사용 예시
const { control } = useForm<{ comment: string }>({
  resolver: zodResolver(schema),
  mode: 'onTouched',
});

<FormTextarea
  control={control}
  name="comment"
  label="상세 정보"
  labelVariant="modal"
  minLength={MESSAGE_TEXT_MIN_LENGTH}
/>
*/

export interface FormTextareaProps<
  TFieldValues extends FieldValues,
> extends Omit<
  TextareaProps,
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'error'
  | 'minLength'
  | 'maxLength'
> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  /** 안내용 최소 글자 수 (검증은 스키마에서) */
  minLength: number;
  /** 입력 가능한 최대 글자 수. 있으면 maxLength로 입력을 막고 안내에도 표시한다 */
  maxLength?: number;
}

export default function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  minLength,
  maxLength,
  id,
  'aria-describedby': ariaDescribedBy,
  ...props
}: FormTextareaProps<TFieldValues>) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const counterId = `${textareaId}-counter`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const length = String(field.value ?? '').length;

        return (
          <div className="flex w-full flex-col gap-[4px]">
            <Textarea
              {...props}
              id={textareaId}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              maxLength={maxLength}
              error={fieldState.error?.message}
              aria-describedby={
                [ariaDescribedBy, counterId].filter(Boolean).join(' ') ||
                undefined
              }
            />

            <TextLengthHint
              id={counterId}
              length={length}
              minLength={minLength}
              maxLength={maxLength}
            />
          </div>
        );
      }}
    />
  );
}
