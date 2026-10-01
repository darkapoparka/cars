'use client';
import Image from 'next/image';
import Link from 'next/link';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@/styles/tokens.stylex';
import { vehicles } from '@/lib/catalog';
import { useAppState } from '@/lib/store';
import { Header } from './Header';
import { Icon } from './Icon';
import { ui } from './ui';
import { HomeDiscovery } from './HomeDiscovery';
import { useScrollThreshold } from '@/lib/use-scroll-threshold';
import { VehicleCard } from './VehicleCard';
import { AssistantFab } from './AssistantEntry';
const s = stylex.create({
  ad: {
    height: 198.667,
    margin: 16,
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  adImage: { width: 'min(320px,100%)', height: 100, objectFit: 'contain' },
  searchPinned: { backgroundColor: colors.panel, boxShadow: '0 3px 9px #0003' },
  search: {
    position: 'sticky',
    top: 68,
    zIndex: 29,
    marginTop: 24,
    marginInline: 16,
    minHeight: 68.667,
    paddingBlock: 12,
    paddingInline: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 20,
    textDecoration: 'none',
  },
  searchTitle: { fontSize: 16, fontWeight: 700, lineHeight: '24px' },
  searchHint: { fontSize: 14, lineHeight: '20px', color: colors.muted },
  heading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 24,
    marginBottom: 6,
    paddingInline: 16,
  },
  headline: {
    fontSize: { default: 24, '@media (max-width: 380px)': 20 },
    lineHeight: '32px',
    fontWeight: 500,
    fontFamily: 'var(--font-hero)',
    whiteSpace: 'nowrap',
  },
  deals: {
    fontFamily: 'var(--font-base)',
    backgroundColor: '#ff8f66',
    borderRadius: 5,
    paddingLeft: 12,
    paddingRight: 5,
    fontSize: { default: 20, '@media (max-width: 380px)': 16 },
    fontWeight: 500,
    marginInline: 4,
    position: 'relative',
    clipPath: 'polygon(10px 0,100% 0,100% 100%,10px 100%,0 50%)',
    '::before': {
      content: '""',
      position: 'absolute',
      left: 5,
      top: '45%',
      width: 4,
      height: 4,
      borderRadius: '50%',
      backgroundColor: '#fff',
    },
  },
  show: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: { default: 16, '@media (max-width: 380px)': 12 },
    fontWeight: 700,
    color: colors.purple,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
  carousel: {
    display: 'flex',
    gap: 16,
    overflowX: 'auto',
    paddingInline: 16,
    paddingBottom: 4,
    scrollSnapType: 'x mandatory',
    scrollPaddingInline: 16,
    scrollbarWidth: 'none',
  },
  footer: { fontSize: 11, color: colors.muted, textAlign: 'center', padding: 24, marginBottom: 40 },
});
export function HomeScreen() {
  const { parked } = useAppState();
  const scrolled = useScrollThreshold(232);
  const parkedVehicles = vehicles.filter((vehicle) => parked.includes(vehicle.id));
  const featured = parkedVehicles.length ? parkedVehicles : [vehicles[1], vehicles[2], vehicles[0]];
  return (
    <>
      <Header home />
      <div {...stylex.props(s.ad)} aria-label="Captured reference advertisement">
        <Image
          src="/images/home-ad.webp"
          alt="Captured test advertisement"
          width={320}
          height={100}
          priority
          {...stylex.props(s.adImage)}
        />
      </div>
      <Link href="/search" {...stylex.props(s.search, scrolled && s.searchPinned)}>
        <span {...stylex.props(ui.muted)}>
          <Icon name="smartSearch" size={24} />
        </span>
        <span>
          <strong {...stylex.props(s.searchTitle)}>Search for…</strong>
          <span {...stylex.props(s.searchHint)}>
            <br />
            Vehicle • Year • Mileage
          </span>
        </span>
      </Link>
      <div {...stylex.props(s.heading)}>
        <h2 {...stylex.props(s.headline)}>
          {parkedVehicles.length ? (
            'Parked vehicles'
          ) : (
            <>
              Top <span {...stylex.props(s.deals)}>DEALS</span> for you
            </>
          )}
        </h2>
        <Link
          href={parkedVehicles.length ? '/car-park' : '/results?deal=true'}
          {...stylex.props(s.show)}
        >
          Show all <Icon name="arrow" size={25} />
        </Link>
      </div>
      <div
        {...stylex.props(s.carousel)}
        aria-label={parkedVehicles.length ? 'Parked vehicles' : 'Top deals'}
      >
        {featured.map((v) => (
          <VehicleCard key={v.id} vehicle={v} home />
        ))}
      </div>
      {parkedVehicles.length > 0 && (
        <>
          <div {...stylex.props(s.heading)}>
            <h2 {...stylex.props(s.headline)}>Recommendations</h2>
          </div>
          <div {...stylex.props(s.carousel)} aria-label="Recommendations">
            {vehicles
              .filter((vehicle) => !parked.includes(vehicle.id))
              .map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} home />
              ))}
          </div>
        </>
      )}
      <HomeDiscovery />
      <p {...stylex.props(s.footer)}>
        Local UI reference · Captured demonstration inventory
        <br />
        Not affiliated with mobile.de. No live transactions.
      </p>
      <AssistantFab compact={scrolled} />
    </>
  );
}
