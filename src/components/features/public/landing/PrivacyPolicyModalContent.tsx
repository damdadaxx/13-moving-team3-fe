// 개인정보처리방침 모달 본문
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

interface PolicySection {
  title: string;
  before?: string;
  items?: string[];
}

export default function PrivacyPolicyModalContent() {
  const t = useTranslations('PrivacyPolicy');
  const sections = t.raw('sections') as PolicySection[];

  return (
    <div className={cn('text-sm-regular text-gray-500 pr-[15px]')}>
      <p className={cn('mb-[24px]')}>{t('intro')}</p>
      {sections.map((section) => (
        <section key={section.title} className={cn('mb-[24px] last:mb-0')}>
          <h3 className={cn('mb-[8px] text-md-bold text-black-400')}>
            {section.title}
          </h3>
          {section.before && <p>{section.before}</p>}
          {section.items && (
            <ul className={cn('mt-[4px] list-disc pl-[18px]')}>
              {section.items.map((item) => (
                <li key={item} className={cn('mb-[4px]')}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
