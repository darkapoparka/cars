'use client';
import NextLink from 'next/link';
import type {ComponentProps} from 'react';
import {useLocale} from '@/lib/locale';
import {localePath} from '@/lib/paths';
import {homeAlternativeHref, useHomeAlternative} from '@/lib/home-alternative';
import {useVehicleDrawer} from '@/components/VehicleDrawerProvider';
export default function AppLink(props: ComponentProps<typeof NextLink>) {
  const locale = useLocale();
  const alternative = useHomeAlternative();
  const openVehicle = useVehicleDrawer();
  const href = typeof props.href === 'string' ? localePath(homeAlternativeHref(props.href, alternative), locale)
    : {...props.href, pathname: localePath(homeAlternativeHref(props.href.pathname || '/', alternative), locale)};
  return <NextLink {...props} href={href} onClick={event => {
    props.onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === '_blank' || props.download) return;
    if (openVehicle?.(event.currentTarget.href)) event.preventDefault();
  }}/>;
}
