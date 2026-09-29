'use client';
import {useCopy} from '@/lib/locale';
import { useEffect, useState } from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import { Heart, LogIn } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import LoginSheet from '@/components/DealerEnquirySheet';
import VehicleCard, { STORAGE_KEY } from '@/components/VehicleCard';
import { vehicles } from '@/lib/data';
import { media, tokens as $ } from '@/app/tokens.stylex';

export default function SavedPage() {
  const tx = useCopy();

  const [saved, setSaved] = useState<string[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);

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
          <><div {...stylex.props(styles.heading)}><span>{tx("YOUR WISHLIST")}</span><h2>{tx(savedVehicles.length)} {tx(" saved ")}{tx(savedVehicles.length === 1 ? 'car' : 'cars')}</h2><p>{tx("Your shortlist is stored on this device.")}</p></div><div {...stylex.props(styles.grid)}>{savedVehicles.map((vehicle) => <VehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div></>
        ) : (
          <section {...stylex.props(styles.empty)}>
            <span {...stylex.props(styles.heart)}><Heart size={58} /></span>
            <h2>{tx("No saved cars yet")}</h2>
            <p>{tx("Tap the heart on any car to keep it here and compare later.")}</p>
            <Link href="/cars" {...stylex.props(styles.explore)}>{tx("Explore cars")}</Link>
            <button type="button" onClick={() => setLoginOpen(true)} {...stylex.props(styles.login)}><LogIn size={18} /> {tx(" Login to sync your wishlist")}</button>
          </section>
        )}
      </main>
      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

const styles = stylex.create({
  screen: { minHeight: {[media.desktop]: 'calc(100svh - 72px)', default: 'calc(100svh - 80px - env(safe-area-inset-bottom))'}, backgroundColor: '#fff' },
  page: { width: '100%', maxWidth: $.content, marginInline: 'auto', paddingBlock: { [media.mobile]: 24, default: 52 }, paddingInline: { [media.mobile]: 14, default: 28 } },
  heading: { marginBottom: 24 },
  grid: { display: 'grid', gridTemplateColumns: { [media.mobile]: '1fr', [media.tablet]: 'repeat(2,1fr)', default: 'repeat(3,1fr)' }, gap: 16 },
  empty: { display: 'flex', alignItems: 'center', maxWidth: 520, minHeight: { [media.mobile]: '62vh', default: 520 }, marginInline: 'auto', paddingInline: 20, flexDirection: 'column', justifyContent: 'center', color: $.text, textAlign: 'center' },
  heart: { display: 'grid', width: 126, height: 126, placeItems: 'center', color: $.violet, borderRadius: '50%', backgroundColor: $.violetSoft },
  explore: { display: 'grid', width: '100%', maxWidth: 360, minHeight: 54, marginTop: 25, placeItems: 'center', color: '#fff', fontWeight: 850, borderRadius: 12, backgroundColor: $.violet },
  login: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, minHeight: 48, marginTop: 10, paddingInline: 16, color: $.blue, fontWeight: 800, borderColor: $.blue, borderStyle: 'solid', borderWidth: 1, borderRadius: 12, backgroundColor: '#fff', cursor: 'pointer' },
});
