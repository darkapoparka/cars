'use client';

import {useEffect, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import VehicleDetailClient from '@/components/VehicleDetailClient';
import {useModal} from '@/components/useModal';
import {vehicles, type Vehicle} from '@/lib/data';
import {dealer} from '@/lib/dealer-config';
import {useCopy} from '@/lib/locale';
import {browserPath} from '@/lib/paths';
import {useLocale} from '@/lib/locale';
import type {ReferenceVehicleDetail} from '@/lib/reference-types';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function VehicleDrawer({vehicle, onClose}: {vehicle: Vehicle; onClose: () => void}) {
  const tx = useCopy();
  const locale = useLocale();
  const panel = useModal(true, onClose, {history: false});
  const [reference, setReference] = useState<ReferenceVehicleDetail>();
  useEffect(() => {
    if (dealer.mode !== 'template') return;
    const controller = new AbortController();
    // Request only this vehicle's public comparison data; keep full snapshots on the server.
    void fetch(browserPath('/cars/' + vehicle.slug + '/reference.json', locale), {signal: controller.signal})
      .then(response => response.ok ? response.json() : null)
      .then(detail => {if (detail && !controller.signal.aborted) setReference(detail);})
      .catch(() => {/* The configured vehicle remains usable when comparison data is unavailable. */});
    return () => controller.abort();
  }, [vehicle.slug, locale]);
  return <div {...stylex.props(s.backdrop)} onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <div data-vehicle-drawer ref={panel} role="dialog" aria-modal="true" aria-label={tx(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)} tabIndex={-1} {...stylex.props(s.panel)}>
      <div data-vehicle-drawer-scroll {...stylex.props(s.scroll)}><VehicleDetailClient vehicle={vehicle} related={vehicles.filter(item => item.slug !== vehicle.slug).slice(0, 3)} reference={reference} onClose={onClose}/></div>
    </div>
  </div>;
}

const s = stylex.create({
  backdrop: {position: 'fixed', inset: 0, zIndex: 190, display: 'flex', justifyContent: {[media.mobile]: 'center', default: 'flex-end'}, alignItems: {[media.mobile]: 'flex-end', default: 'stretch'}, backgroundColor: 'rgba(0,0,0,.48)'},
  panel: {position: 'relative', width: '100%', maxWidth: {[media.desktop]: 1240, [media.tablet]: 760, default: '100%'}, height: {[media.mobile]: 'calc(100dvh - 12px)', default: '100dvh'}, overflow: 'hidden', transform: 'translateZ(0)', borderRadius: {[media.mobile]: '20px 20px 0 0', default: '20px 0 0 20px'}, outlineStyle: 'none', backgroundColor: $.surface, boxShadow: $.shadowStrong},
  scroll: {height: '100%', overflowY: 'auto', overscrollBehaviorY: 'contain'},
});
