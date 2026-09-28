'use client';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState} from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import DiscoveryHeader, {ShowroomSearch} from '@/components/DiscoveryHeader';
import MiniVehicleCard from '@/components/MiniVehicleCard';
import ShowroomHighlights from '@/components/ShowroomHighlights';

import VehicleCard from '@/components/VehicleCard';
import {BrandRow, FilterPills, ShowroomPromotion} from '@/components/ReferenceUI';
import {useRecentVehicles} from '@/components/useVehicleState';
import {getVehicle, homeFeed, hotDeals} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function HomePage() {
  const tx = useCopy();

  const [compact, setCompact] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const sentinel = useRef<HTMLDivElement>(null);
  const recent = useRecentVehicles().map(getVehicle).filter(vehicle => vehicle !== undefined);
  useEffect(() => {
    const update = () => setCompact(window.scrollY > 90);
    const frame = requestAnimationFrame(update);
    window.addEventListener('scroll', update, {passive: true});
    return () => {cancelAnimationFrame(frame); window.removeEventListener('scroll', update);};
  }, []);
  useEffect(() => {
    const element = sentinel.current;
    if (!element || visibleCount >= homeFeed.length) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setVisibleCount(count => Math.min(count + 8, homeFeed.length));
    }, {rootMargin: '600px'});
    observer.observe(element);
    return () => observer.disconnect();
  }, [visibleCount]);
  return <div {...stylex.props(s.screen)}>
    <DiscoveryHeader active="buy" />
    <ShowroomPromotion />
    <ShowroomSearch />
    <div {...stylex.props(s.filters, compact && s.filtersCompact)}><FilterPills /></div>
    <main {...stylex.props(s.content)}>
      <BrandRow />
      {recent.length ? <section {...stylex.props(s.recent)}>
        <h2 {...stylex.props(s.heading)}>{tx("Recently viewed cars")}</h2>
        <div {...stylex.props(s.recentRail)}>{recent.map(vehicle => <MiniVehicleCard key={vehicle.slug} vehicle={vehicle} green />)}</div>
      </section> : null}
      <section {...stylex.props(s.offers)}><h2 {...stylex.props(s.heading)}>{tx("Your showroom, your way")}</h2><ShowroomHighlights /></section>
      <section aria-label={tx("Available cars")} {...stylex.props(s.feed)}>
        {homeFeed.slice(0, 8).map((vehicle, index) => <div key={vehicle.slug} {...stylex.props(index === 4 && s.feedGroup)}><VehicleCard vehicle={vehicle} showDiscount={false} /></div>)}
      </section>
      <section {...stylex.props(s.hotDeals)}>
        <h2 {...stylex.props(s.heading)}>{tx("Explore the collection")}</h2><p {...stylex.props(s.caption)}>{tx("Listing samples — confirm availability")}</p>
        <div {...stylex.props(s.dealsRail)}>{hotDeals.map(vehicle => <MiniVehicleCard key={vehicle.slug} vehicle={vehicle} />)}</div>
      </section>
      <section aria-label={tx("More cars")} {...stylex.props(s.feed)}>{homeFeed.slice(8, visibleCount).map(vehicle => <VehicleCard key={vehicle.slug} vehicle={vehicle} showDiscount={false} />)}</section>
      <div ref={sentinel} aria-hidden="true" {...stylex.props(s.sentinel)} />
      <Link href="/cars" {...stylex.props(s.browse)}>{tx("View all cars")}</Link>
    </main>
  </div>;
}
const s = stylex.create({
  screen: {minHeight: '100vh', backgroundColor: '#fff'},
  filters: {position: 'sticky', top: {[media.mobile]: 'calc(156px + env(safe-area-inset-top))', [media.desktop]: 72, default: 0}, zIndex: 60, maxWidth: $.content, marginInline: 'auto', backgroundColor: '#fff'},
  filtersCompact: {top: {[media.mobile]: 'calc(112px + env(safe-area-inset-top))', [media.desktop]: 72, default: 0}},
  content: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingBottom: 170},
  heading: {fontSize: {[media.mobile]: 18, default: 25}, fontWeight: 500, lineHeight: 1.2, letterSpacing: 0},
  recent: {marginTop: 27},
  recentRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 12, paddingBottom: 6, scrollbarWidth: 'none'},
  offers: {marginTop: 24},
  feed: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: 14, marginTop: 14},
  feedGroup: {marginTop: {[media.mobile]: 24, default: 0}},
  hotDeals: {marginTop: 6, marginInline: {[media.mobile]: -12, default: 0}, padding: '15px 12px 20px', backgroundColor: '#f6f6f7'},
  caption: {marginTop: 4, color: $.muted, fontSize: 15, lineHeight: '20px'},
  dealsRail: {display: 'flex', gap: 16, overflowX: 'auto', marginTop: 12, marginRight: -12, paddingRight: 12, scrollbarWidth: 'none'},
  sentinel: {height: 1},
  browse: {display: 'grid', placeItems: 'center', minHeight: 46, marginTop: 22, color: $.violet, fontSize: 15, fontWeight: 500, borderColor: $.violet, borderStyle: 'solid', borderWidth: 1, borderRadius: 12},
});
