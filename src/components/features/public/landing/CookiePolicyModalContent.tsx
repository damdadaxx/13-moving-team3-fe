// 쿠키정책 모달 본문
import { useTranslations } from 'next-intl';

import { cn } from '@/utils/cn';

interface CookieRow {
  name: string;
  purpose: string;
  duration: string;
}

interface PolicySection {
  title: string;
  before?: string;
  items?: string[];
  cookies?: CookieRow[];
  after?: string;
}

export default function CookiePolicyModalContent() {
  const t = useTranslations('CookiePolicy');
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
          {section.cookies && (
            <div className={cn('mt-[4px]')}>
              {section.cookies.map((cookie) => (
                <div
                  key={cookie.name}
                  className={cn(
                    'flex flex-col gap-[2px] border-b border-line-100 py-[10px] last:border-b-0',
                  )}
                >
                  <p className={cn('text-sm-medium text-black-300')}>
                    {cookie.name}
                  </p>
                  <p>{cookie.purpose}</p>
                  <p className={cn('text-xs-regular text-gray-400')}>
                    {t('cookieDuration', { duration: cookie.duration })}
                  </p>
                </div>
              ))}
            </div>
          )}
          {section.after && <p className={cn('mt-[10px]')}>{section.after}</p>}
        </section>
      ))}
    </div>
  );
}
