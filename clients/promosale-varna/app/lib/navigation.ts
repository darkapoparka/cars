'use client';
import {useMemo} from 'react';
import {useRouter as useNextRouter, usePathname as useNextPathname} from 'next/navigation';
import {useLocale} from './locale';
import {localePath, withoutLocale} from './paths';
export {useSearchParams, useParams} from 'next/navigation';
export function usePathname() { return withoutLocale(useNextPathname() || '/'); }
export function useRouter() {
  const router = useNextRouter();
  const locale = useLocale();
  return useMemo(() => ({...router,
    push: (href: string, options?: Parameters<typeof router.push>[1]) => router.push(localePath(href, locale), options),
    replace: (href: string, options?: Parameters<typeof router.replace>[1]) => router.replace(localePath(href, locale), options),
    prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) => router.prefetch(localePath(href, locale), options),
  }), [router, locale]);
}
