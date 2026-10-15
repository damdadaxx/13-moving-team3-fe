import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

/*
@ 글자 수 안내
- 왼쪽에 "최소 N자 이상"(최대가 있으면 "최소 N자 · 최대 M자"), 오른쪽에 실시간 글자 수를 보여줍니다.
- 최소 글자 수를 채우면 글자 수가 주황색으로 바뀝니다.
- 글자 수는 입력한 그대로(공백 포함) 셉니다. 검증은 스키마(zod)에서 하고 이 컴포넌트는 안내만 합니다.
- Textarea는 FormTextarea가 이 컴포넌트를 포함합니다. Input처럼 직접 이어 붙일 때는
  useWatch로 얻은 값의 길이를 length로 전달합니다.

@ 사용 예시
const nickname = useWatch({ control, name: 'nickname' });

<Input ... {...register('nickname')} />
<TextLengthHint length={nickname.length} minLength={2} maxLength={10} />
*/

interface TextLengthHintProps {
  /** 현재 입력한 글자 수 */
  length: number;
  minLength: number;
  maxLength?: number;
  id?: string;
  className?: string;
}

export default function TextLengthHint({
  length,
  minLength,
  maxLength,
  id,
  className,
}: TextLengthHintProps) {
  const t = useTranslations('Common');

  return (
    <p
      id={id}
      className={cn(
        'flex items-center justify-between px-[8px] text-sm-regular text-gray-400 tablet:text-md-regular',
        className,
      )}
    >
      <span>
        {maxLength === undefined
          ? t('textLengthRule', { min: minLength })
          : t('textLengthRuleRange', { min: minLength, max: maxLength })}
      </span>
      <span
        className={cn('tabular-nums', length >= minLength && 'text-orange-400')}
      >
        {maxLength === undefined
          ? t('textLengthCount', { count: length })
          : t('textLengthCountMax', { count: length, max: maxLength })}
      </span>
    </p>
  );
}
