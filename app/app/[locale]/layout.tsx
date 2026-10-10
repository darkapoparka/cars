import {notFound} from 'next/navigation';
import {dealer} from '@/lib/dealer-config';
import {isAppLocale} from '@/lib/locale-policy';
export default async function LocaleLayout({children,params}: {children: React.ReactNode;params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isAppLocale(locale) || !dealer.enabledLocales.includes(locale)) notFound();
  return children;
}

export function generateStaticParams() { return dealer.enabledLocales.map(locale => ({locale})); }
