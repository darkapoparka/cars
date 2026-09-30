'use client';
import {useCopy} from '@/lib/locale';
import { useEffect, useState } from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import { Heart } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import VehicleCard, { STORAGE_KEY } from '@/components/VehicleCard';
import { vehicles } from '@/lib/data';
import { media, tokens as $ } from '@/app/tokens.stylex';

export default function SavedPage() {
  const tx = useCopy();

  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    const refresh = () => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
        setSaved(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSaved([]);
      }
    };
    refresh();
    window.addEventListener('drive24:saved-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('drive24:saved-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const savedVehicles = vehicles.filter((vehicle) => saved.includes(vehicle.slug));

  return (
    <div {...stylex.props(styles.screen)}>
      <PageHeader title={tx("Saved cars")}/>
      <main {...stylex.props(styles.page)}>
        {savedVehicles.length ? (
          <><div {...stylex.props(styles.heading)}><h2 {...stylex.props(styles.count)}>{tx(savedVehicles.length)} {tx(savedVehicles.length === 1 ? 'car' : 'cars')}</h2><p {...stylex.props(styles.caption)}>{tx("Your shortlist is stored on this device.")}</p></div><div {...stylex.props(styles.grid)}>{savedVehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div></>
        ) : (
          <section {...stylex.props(styles.empty)}>
            <span {...stylex.props(styles.heart)}><Heart size={58} /></span>
            <h2 {...stylex.props(styles.emptyTitle)}>{tx("No saved cars yet")}</h2>
            <p {...stylex.props(styles.caption)}>{tx("Tap the heart on any car to keep it here and compare later.")}</p>
            <Link href="/cars" {...stylex.props(styles.explore)}>{tx("Explore cars")}</Link>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = stylex.create({
  screen: { minHeight: {[media.desktop]: 'calc(100svh - 72px)', default: 'calc(100svh - 80px - env(safe-area-inset-bottom))'}, backgroundColor: '#fff' },
  page: { width: '100%', maxWidth: $.content, marginInline: 'auto', paddingBlock: { [media.mobile]: 24, default: 52 }, paddingInline: { [media.mobile]: 14, default: 28 } },
  heading: { marginBottom: 20 },
  count: {fontSize: 18, fontWeight: 600, lineHeight: '24px'},
  caption: {marginTop: 6, color: $.muted, fontSize: 14, lineHeight: '21px'},
  emptyTitle: {marginTop: 20, fontSize: 22, fontWeight: 600, lineHeight: 1.25},
  grid: { display: 'grid', gridTemplateColumns: { [media.mobile]: '1fr', [media.tablet]: 'repeat(2,1fr)', default: 'repeat(3,1fr)' }, gap: 16 },
  empty: { display: 'flex', alignItems: 'center', maxWidth: 520, minHeight: { [media.mobile]: '62vh', default: 520 }, marginInline: 'auto', paddingInline: 20, flexDirection: 'column', justifyContent: 'center', color: $.text, textAlign: 'center' },
  heart: { display: 'grid', width: 126, height: 126, placeItems: 'center', color: $.violet, borderRadius: '50%', backgroundColor: $.violetSoft },
  explore: { display: 'grid', width: '100%', maxWidth: 360, minHeight: 54, marginTop: 25, placeItems: 'center', color: '#fff', fontWeight: 600, borderRadius: 12, backgroundColor: $.violet },
});
