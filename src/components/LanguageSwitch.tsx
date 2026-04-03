'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Globe } from 'lucide-react';

export function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const next = locale === 'pl' ? 'en' : 'pl';
    // Replace the current locale prefix in the path
    const segments = pathname.split('/');
    segments[1] = next;
    router.push(segments.join('/'));
  };

  return (
    <button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
      aria-label="Switch language"
    >
      <Globe size={13} />
      <span className="uppercase">{locale === 'pl' ? 'EN' : 'PL'}</span>
    </button>
  );
}
