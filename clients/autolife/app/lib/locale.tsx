'use client';
import {createContext, useContext, useMemo, type ReactNode} from 'react';
import {dealer, type AppLocale} from './dealer-config';
import {createCopy} from './locale-core';
const LocaleContext = createContext<AppLocale>(dealer.defaultLocale);
export function LocaleProvider({locale, children}: {locale: AppLocale; children: ReactNode}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}
export const useLocale = () => useContext(LocaleContext);
export function useCopy() {
  const locale = useLocale();
  return useMemo(() => createCopy(locale), [locale]);
}
