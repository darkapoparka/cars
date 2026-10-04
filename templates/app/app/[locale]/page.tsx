'use client';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState} from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import DiscoveryHeader, {ShowroomSearch} from '@/components/DiscoveryHeader';
import MiniVehicleCard from '@/components/MiniVehicleCard';
import ShowroomHighlights from '@/components/ShowroomHighlights';
import WelcomeBanner from '@/components/WelcomeBanner';

import VehicleCard from '@/components/VehicleCard';
import {BrandRow, ShowroomPromotion} from '@/components/ReferenceUI';
import {useRecentVehicles} from '@/components/useVehicleState';
import {getVehicle, homeFeed, hotDeals} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';
import {ArrowRight} from 'lucide-react';
import {assetPath} from '@/lib/paths';

const firstFeed = homeFeed.slice(0, 8);
const firstFeedSlugs = new Set(firstFeed.map(vehicle => vehicle.slug));
const collectionCandidates = [...hotDeals, ...homeFeed.slice(8)].filter(vehicle =>
  !firstFeedSlugs.has(vehicle.slug) && !vehicle.imagePlaceholder && !vehicle.badges.some(badge => /coming/i.test(badge)));
const collectionVehicles = [...new Map(collectionCandidates.map(vehicle => [vehicle.slug, vehicle])).values()].slice(0, 3);
const collectionSlugs = new Set(collectionVehicles.map(vehicle => vehicle.slug));
const moreFeed = homeFeed.slice(8).filter(vehicle => !collectionSlugs.has(vehicle.slug));

export default function HomePage() {
  const tx = useCopy();

  const [visibleCount, setVisibleCount] = useState(4);
  const sentinel = useRef<HTMLDivElement>(null);
  const recent = useRecentVehicles().map(getVehicle).filter(vehicle => vehicle !== undefined);
  useEffect(() => {
    const element = sentinel.current;
    if (!element || visibleCount >= moreFeed.length) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) setVisibleCount(count => Math.min(count + 8, moreFeed.length));
    }, {rootMargin: '600px'});
    observer.observe(element);
    return () => observer.disconnect();
  }, [visibleCount]);
  return <div {...stylex.props(s.screen)}>
    <WelcomeBanner/>
    <DiscoveryHeader active="buy" hideMobileIdentity />
    <ShowroomPromotion />
    <ShowroomSearch desktopOnly />
    <main {...stylex.props(s.content)}>
      <BrandRow showTitle={false} />
      <section aria-label={tx('Your showroom, your way')} {...stylex.props(s.offers)}><ShowroomHighlights /></section>
      <section aria-label={tx('Available cars')}>
        <div {...stylex.props(s.collectionHeading, s.inventoryHeading)}>
          <h2 id="home-inventory-heading" {...stylex.props(s.heading)}>{tx('Available cars')}</h2>
          <Link href="/cars" aria-label={tx('View all cars')} {...stylex.props(s.collectionLink, s.inventoryLink)}>{tx('View all')}<ArrowRight size={15} aria-hidden="true"/></Link>
        </div>
        <div {...stylex.props(s.feed)}>{firstFeed.map(vehicle => <VehicleCard key={vehicle.slug} vehicle={vehicle} showDiscount={false} />)}</div>
      </section>
      {recent.length ? <section {...stylex.props(s.recent)}>
        <h2 {...stylex.props(s.heading)}>{tx("Recently viewed cars")}</h2>
        <div {...stylex.props(s.recentRail)}>{recent.map(vehicle => <MiniVehicleCard key={vehicle.slug} vehicle={vehicle} green />)}</div>
      </section> : null}
      {collectionVehicles.length ? <section aria-label={tx("Explore the collection")} {...stylex.props(s.hotDeals)}>
        <Link href="/cars" {...stylex.props(s.mobileCollectionBanner)}>
          <img src={assetPath('/showroom/black/collection-lineup-v2.webp')} width={1200} height={500} loading="lazy" alt="" {...stylex.props(s.collectionBannerImage)}/>
          <span aria-hidden="true" {...stylex.props(s.collectionBannerShade)}/>
          <span {...stylex.props(s.collectionBannerContent)}><h2 {...stylex.props(s.collectionBannerTitle)}>{tx("Explore the collection")}</h2><span aria-hidden="true" {...stylex.props(s.collectionBannerArrow)}><ArrowRight size={18}/></span></span>
        </Link>
        <div {...stylex.props(s.desktopCollection)}>
          <div {...stylex.props(s.collectionHeading)}><h2 {...stylex.props(s.heading)}>{tx("Explore the collection")}</h2><Link href="/cars" {...stylex.props(s.collectionLink)}>{tx("View all")}<ArrowRight size={15} aria-hidden="true"/></Link></div>
          <p {...stylex.props(s.caption)}>{tx("Listing samples — confirm availability")}</p>
          <div {...stylex.props(s.dealsRail)}>{collectionVehicles.map(vehicle => <MiniVehicleCard key={vehicle.slug} vehicle={vehicle} featured />)}</div>
        </div>
      </section> : null}
      <section aria-label={tx("More cars")} {...stylex.props(s.feed)}>{moreFeed.slice(0, visibleCount).map(vehicle => <VehicleCard key={vehicle.slug} vehicle={vehicle} showDiscount={false} />)}</section>
      <div ref={sentinel} aria-hidden="true" {...stylex.props(s.sentinel)} />
      <Link href="/cars" {...stylex.props(s.browse)}>{tx("View all cars")}</Link>
    </main>
  </div>;
}
const s = stylex.create({
  screen: {minHeight: '100vh', backgroundColor: '#fff'},
  content: {maxWidth: $.content, marginInline: 'auto', paddingInline: {[media.mobile]: 12, default: 28}, paddingBottom: {[media.mobile]: 16, default: 170}},
  heading: {fontSize: {[media.mobile]: 18, default: 25}, fontWeight: {[media.mobile]: 600, default: 500}, lineHeight: 1.35, letterSpacing: 0},
  recent: {marginTop: 27},
  recentRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 12, paddingBottom: 6, scrollbarWidth: 'none'},
  offers: {marginTop: {[media.mobile]: $.mobileBrandGap, default: 24}},
  feed: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', default: 'repeat(2,minmax(0,1fr))'}, gap: {[media.mobile]: $.mobileSectionGap, default: 14}, marginTop: {[media.mobile]: $.mobileSectionGap, default: 14}},
  inventoryHeading: {display: {[media.mobile]: 'none', default: 'flex'}, marginTop: {[media.mobile]: 0, default: 16}},
  inventoryLink: {minHeight: 44},
  hotDeals: {marginTop: {[media.mobile]: 24, default: 26}, paddingTop: {[media.mobile]: 0, default: 18}, paddingBottom: {[media.mobile]: 0, default: 8}, borderTopWidth: {[media.mobile]: 0, default: 1}, borderTopStyle: 'solid', borderTopColor: '#e8e8eb'},
  mobileCollectionBanner: {display: {[media.mobile]: 'block', default: 'none'}, position: 'relative', height: 156, overflow: 'hidden', color: '#fff', borderRadius: 18, backgroundColor: '#242428'},
  collectionBannerImage: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'},
  collectionBannerShade: {position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,.65), transparent 50%)'},
  collectionBannerContent: {position: 'absolute', insetInline: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 16},
  collectionBannerTitle: {color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.1, whiteSpace: 'nowrap'},
  collectionBannerArrow: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 32, height: 32, color: '#1b1b1d', borderRadius: 16, backgroundColor: '#fff'},
  desktopCollection: {display: {[media.mobile]: 'none', default: 'block'}},
  collectionHeading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10},
  collectionLink: {display: 'inline-flex', alignItems: 'center', flexShrink: 0, gap: 4, minHeight: 36, color: $.ink, fontSize: 13, fontWeight: 600, textDecoration: 'none'},
  caption: {marginTop: 2, color: $.muted, fontSize: 12, lineHeight: '18px'},
  dealsRail: {display: 'flex', gap: 12, overflowX: 'auto', overscrollBehaviorX: 'contain', marginTop: 14, marginRight: {[media.mobile]: -12, default: 0}, paddingRight: {[media.mobile]: 12, default: 0}, paddingBottom: 8, scrollbarWidth: 'none'},
  sentinel: {height: 1},
  browse: {display: 'grid', placeItems: 'center', minHeight: 46, marginTop: 22, color: $.violet, fontSize: 15, fontWeight: 500, borderColor: $.violet, borderStyle: 'solid', borderWidth: 1, borderRadius: 12},
});
