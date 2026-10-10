'use client';
import {useMemo} from 'react';
import {useRouter as useNextRouter, usePathname as useNextPathname} from 'next/navigation';
import {useLocale} from './locale';
import {localePath, withoutLocale} from './paths';
import {homeAlternativeHref, useHomeAlternative} from './home-alternative';
export {useSearchParams, useParams} from 'next/navigation';
export function usePathname() { return withoutLocale(useNextPathname() || '/'); }
export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();
  const alternative = useHomeAlternative();
  return useMemo(() => ({...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) => router.push(localePath(homeAlternativeHref(href, alternative), locale), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) => router.replace(localePath(homeAlternativeHref(href, alternative), locale), options),
    prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) => router.prefetch(localePath(homeAlternativeHref(href, alternative), locale), options),
  }), [router, locale, alternative]);
}
