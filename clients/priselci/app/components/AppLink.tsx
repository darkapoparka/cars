'use client';
import NextLink from 'next/link';
import type {ComponentProps} from 'react';
import {useLocale} from '@/lib/locale';
import {localePath} from '@/lib/paths';
export default function AppLink(props: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const href = typeof props.href === 'string' ? localePath(props.href, locale)
    : {...props.href, pathname: localePath(props.href.pathname || '/', locale)};
  return <NextLink {...props} href={href}/>;
}
