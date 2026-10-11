'use client';
import NextLink from 'next/link';
import type {ComponentProps} from 'react';
import {useLocale} from '@/lib/locale';
import {localePath} from '@/lib/paths';
import {homeAlternativeHref, useHomeAlternative} from '@/lib/home-alternative';
export default function AppLink(props: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const alternative = useHomeAlternative();
  const href = typeof props.href === 'string' ? localePath(homeAlternativeHref(props.href, alternative), locale)
    : {...props.href, pathname: localePath(homeAlternativeHref(props.href.pathname || '/', alternative), locale)};
  return <NextLink {...props} href={href}/>;
}
