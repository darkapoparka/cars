'use client';
import {useCopy} from '@/lib/locale';
import type {MouseEvent} from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {Heart, Trash2} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import VehicleCard from '@/components/VehicleCard';
import {useSavedVehicle, useSavedVehicles} from '@/components/useVehicleState';
import {useVehicleReturn} from '@/components/useInventoryHistory';
import {vehicles, type Vehicle} from '@/lib/data';
import { media, tokens as $ } from '@/app/tokens.stylex';

export default function SavedPage() {
  const tx = useCopy();

  const saved = useSavedVehicles();
  useVehicleReturn();

  const savedVehicles = vehicles.filter((vehicle) => saved.includes(vehicle.slug));

  return (
    <div {...stylex.props(styles.screen)}>
      <PageHeader title="Saved cars" compact wrapTitle/>
      <main {...stylex.props(styles.page)}>
        {savedVehicles.length ? (
          <><div {...stylex.props(styles.heading)}><h2 {...stylex.props(styles.count)}>{tx(savedVehicles.length)} {tx(savedVehicles.length === 1 ? 'car' : 'cars')}</h2><p {...stylex.props(styles.caption)}>{tx("Your shortlist is stored on this device.")}</p></div><div data-saved-list {...stylex.props(styles.grid)}>{savedVehicles.map(vehicle => <SavedCar key={vehicle.slug} vehicle={vehicle}/>)}</div></>
        ) : (
          <section {...stylex.props(styles.empty)}>
            <span aria-hidden="true" {...stylex.props(styles.heart)}><Heart size={48}/></span>
            <h2 {...stylex.props(styles.emptyTitle)}>{tx("No saved cars yet")}</h2>
            <p {...stylex.props(styles.caption)}>{tx("Open a car and tap Save to keep it here.")}</p>
            <Link href="/cars" data-saved-explore {...stylex.props(styles.explore)}>{tx("Explore cars")}</Link>
          </section>
        )}
      </main>
    </div>
  );
}

function SavedCar({vehicle}: {vehicle: Vehicle}) {
  const tx = useCopy();
  const {remove, error} = useSavedVehicle(vehicle.slug);
  function removeCar(event: MouseEvent<HTMLButtonElement>) {
    const list = event.currentTarget.closest('[data-saved-list]');
    const buttons = Array.from(list?.querySelectorAll<HTMLButtonElement>('[data-saved-remove]') ?? []).filter(button => button.getClientRects().length > 0);
    const index = buttons.indexOf(event.currentTarget);
    const next = buttons[index + 1] ?? buttons[index - 1];
    if (!remove()) return;
    requestAnimationFrame(() => {
      const target = next?.isConnected ? next : document.querySelector<HTMLElement>('[data-saved-explore]');
      target?.focus({preventScroll: true});
    });
  }
  return <div {...stylex.props(styles.savedCar)}>
    <VehicleCard vehicle={vehicle} desktopTile onRemoveSaved={removeCar}/>
    <button type="button" data-saved-remove onClick={removeCar} aria-label={tx(`Remove ${vehicle.make} ${vehicle.model} from saved cars`)} {...stylex.props(styles.remove)}><Trash2 size={16} aria-hidden="true"/>{tx('Remove')}</button>
    {error ? <p role="alert" {...stylex.props(styles.error)}>{tx(error)}</p> : null}
  </div>;
}

const styles = stylex.create({
  screen: { minHeight: {[media.desktop]: 'calc(100svh - 72px)', default: 'calc(100svh - 80px - env(safe-area-inset-bottom))'}, backgroundColor: '#fff' },
  page: { width: '100%', maxWidth: $.content, marginInline: 'auto', paddingTop: { [media.mobile]: 16, default: 32 }, paddingBottom: 20, paddingInline: { [media.mobile]: 14, default: 28 } },
  heading: { marginBottom: 16 },
  count: {fontSize: 18, fontWeight: 600, lineHeight: '24px'},
  caption: {marginTop: 6, color: $.muted, fontSize: 14, lineHeight: '21px'},
  emptyTitle: {marginTop: 20, fontSize: 22, fontWeight: 600, lineHeight: 1.25},
  grid: { display: 'grid', gridTemplateColumns: { [media.mobile]: '1fr', [media.tablet]: 'repeat(2,1fr)', [media.desktop]: 'repeat(4,minmax(0,1fr))', default: 'repeat(3,1fr)' }, gap: 16 },
  empty: { display: 'flex', alignItems: 'center', maxWidth: 520, minHeight: { [media.mobile]: '62vh', default: 520 }, marginInline: 'auto', paddingInline: 20, flexDirection: 'column', justifyContent: 'center', color: $.text, textAlign: 'center' },
  heart: { display: 'grid', flexShrink: 0, width: 96, height: 96, placeItems: 'center', color: $.violet, borderRadius: '50%', backgroundColor: $.violetSoft },
  explore: { display: 'grid', width: '100%', maxWidth: 360, minHeight: 48, marginTop: 24, padding: '10px 12px', placeItems: 'center', color: '#fff', fontSize: 14, fontWeight: 500, lineHeight: 1.4, textAlign: 'center', borderRadius: 12, backgroundColor: $.violet, outlineOffset: 3 },
  savedCar: {minWidth: 0},
  remove: {display: {[media.mobile]: 'flex', default: 'none'}, alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 44, marginTop: 4, marginLeft: 'auto', padding: '8px 10px', color: $.muted, fontFamily: $.fontSans, fontSize: 14, lineHeight: 1.4, borderWidth: 0, borderRadius: 10, backgroundColor: {default: 'transparent', ':hover': $.surfaceAlt}, outlineOffset: -3, cursor: 'pointer'},
  error: {padding: '8px 12px', color: '#b42318', fontSize: 14, lineHeight: 1.5},
});
