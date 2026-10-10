'use client';
import {useCopy} from '@/lib/locale';
import {useEffect, useRef, useState, useSyncExternalStore} from 'react';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import DiscoveryHeader from '@/components/DiscoveryHeader';
import MiniVehicleCard from '@/components/MiniVehicleCard';
import ShowroomHighlights from '@/components/ShowroomHighlights';
import WelcomeBanner from '@/components/WelcomeBanner';

import VehicleCard from '@/components/VehicleCard';
import InventoryClient from '@/components/InventoryClient';
import {ShowroomBannerSkeleton} from '@/components/ShowroomBanner';
import LandingContentFrame, {landingContent} from '@/components/LandingContentFrame';
import {MobileAlternativeHero, MobileAlternativeDiscovery} from '@/components/MobileHomeAlternative';
import {useHomeAlternative} from '@/lib/home-alternative';
import {useVehicleReturn} from '@/components/useInventoryHistory';
import {BrandRow, ShowroomPromotion} from '@/components/ReferenceUI';
import {useRecentVehicles} from '@/components/useVehicleState';
import {getVehicle, homeFeed, hotDeals} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';
import {ArrowRight} from 'lucide-react';
import {assetPath} from '@/lib/paths';
import {showroom} from '@/lib/showroom';

const firstFeed = homeFeed.slice(0, 8);
const firstFeedSlugs = new Set(firstFeed.map(vehicle => vehicle.slug));
const collectionCandidates = [...hotDeals, ...homeFeed.slice(8)].filter(vehicle =>
  !firstFeedSlugs.has(vehicle.slug) && !vehicle.imagePlaceholder && !vehicle.badges.some(badge => /coming/i.test(badge)));
const collectionVehicles = [...new Map(collectionCandidates.map(vehicle => [vehicle.slug, vehicle])).values()].slice(0, 3);
const collectionSlugs = new Set(collectionVehicles.map(vehicle => vehicle.slug));
const moreFeed = homeFeed.slice(8).filter(vehicle => !collectionSlugs.has(vehicle.slug));
const desktopQuery='(min-width: 1100px)';
function subscribeDesktop(notify:()=>void){const query=window.matchMedia(desktopQuery);query.addEventListener('change',notify);return()=>query.removeEventListener('change',notify);}
function desktopSnapshot(){return window.matchMedia(desktopQuery).matches;}
function serverSnapshot(){return false;}

export default function HomePage() {
  const tx = useCopy();
  const alternative = useHomeAlternative();
  const desktop=useSyncExternalStore(subscribeDesktop,desktopSnapshot,serverSnapshot);
  useVehicleReturn(true, !desktop);

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
    <div {...stylex.props(s.phoneTablet)}>
    <div {...stylex.props(s.discovery, alternative && s.alternativeDiscovery)}><DiscoveryHeader active="buy" hideMobileIdentity /><ShowroomPromotion /></div>
    {alternative ? <MobileAlternativeHero/> : null}
    <LandingContentFrame><main data-landing-content {...stylex.props(landingContent.panel, s.content)}>
      {alternative ? <MobileAlternativeDiscovery/> : null}
      <div {...stylex.props(s.contents, alternative && s.hideAlternativePhone)}><BrandRow showTitle={false} /></div>
      <section aria-label={tx('Your showroom, your way')} {...stylex.props(s.offers, alternative && s.hideAlternativeOffers)}><ShowroomHighlights /></section>
      <section aria-label={tx('Available cars')}>
        <div {...stylex.props(s.feed, s.firstFeed)}>{firstFeed.map(vehicle => <VehicleCard key={vehicle.slug} vehicle={vehicle} desktopTile showDiscount={false} />)}</div>
      </section>
      <div {...stylex.props(s.contents)}>{recent.length ? <section {...stylex.props(s.recent)}>
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
      </section> : null}</div>
      {alternative ? <div data-alternative-extra-stock {...stylex.props(s.feed, s.alternativeMoreCars)}>{collectionVehicles.map(vehicle => <VehicleCard key={vehicle.slug} vehicle={vehicle} desktopTile showDiscount={false}/>)}</div> : null}
      <section aria-label={tx("More cars")} {...stylex.props(s.feed)}>{moreFeed.slice(0, visibleCount).map(vehicle => <VehicleCard key={vehicle.slug} vehicle={vehicle} desktopTile showDiscount={false} />)}</section>
      <div ref={sentinel} aria-hidden="true" {...stylex.props(s.sentinel)} />
      <div {...stylex.props(s.contents)}><Link href="/cars" {...stylex.props(s.browse)}>{tx("View all cars")}</Link></div>
    </main></LandingContentFrame>
    </div>
    {desktop ? <InventoryClient presentation="home"/> : <ShowroomBannerSkeleton title={showroom.promotion.title}/>}
  </div>;
}
const s = stylex.create({
  phoneTablet:{display:{[media.desktop]:'none',default:'contents'}},
  discovery:{display:'contents'},
  alternativeDiscovery:{display:{[media.mobile]:'none',default:'contents'}},
  hideAlternativeOffers:{display:{[media.mobile]:'none',default:'block'}},
  contents:{display:'contents'},
  hideAlternativePhone:{display:{[media.mobile]:'none',default:'contents'}},
  alternativeMoreCars:{display:{[media.mobile]:'grid',default:'none'}},
  screen: {minHeight: '100vh', backgroundColor: '#fff'},
  content: {maxWidth: $.content, marginInline: 'auto', paddingTop: {[media.mobile]: 0, default: 8}, paddingInline: {[media.mobile]: 12, default: 28}, paddingBottom: {[media.mobile]: 16, [media.desktop]: 48, default: 170}},
  heading: {fontSize: {[media.mobile]: 18, default: 25}, fontWeight: {[media.mobile]: 600, default: 500}, lineHeight: 1.35, letterSpacing: 0},
  recent: {marginTop: 27},
  recentRail: {display: 'flex', gap: 12, overflowX: 'auto', marginTop: 12, paddingBottom: 6, scrollbarWidth: 'none'},
  offers: {marginTop: {[media.mobile]: $.mobileBrandGap, default: 24}},
  feed: {display: 'grid', gridTemplateColumns: {[media.mobile]: '1fr', [media.desktop]: 'repeat(4,minmax(0,1fr))', default: 'repeat(2,minmax(0,1fr))'}, gap: {[media.mobile]: $.mobileSectionGap, default: 14}, marginTop: {[media.mobile]: $.mobileSectionGap, default: 14}},
  firstFeed: {marginTop: {[media.mobile]: 4, default: 14}},
  hotDeals: {marginTop: {[media.mobile]: 24, default: 26}, paddingTop: {[media.mobile]: 0, default: 18}, paddingBottom: {[media.mobile]: 0, default: 8},},
  mobileCollectionBanner: {display: {[media.mobile]: 'block', default: 'none'}, position: 'relative', height: 156, overflow: 'hidden', color: '#fff', borderRadius: 18, backgroundColor: '#242428'},
  collectionBannerImage: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'},
  collectionBannerShade: {position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,.65), transparent 50%)'},
  collectionBannerContent: {position: 'absolute', insetInline: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: 16},
  collectionBannerTitle: {color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.1, whiteSpace: 'nowrap'},
  collectionBannerArrow: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 32, height: 32, color: '#1b1b1d', borderRadius: 16, backgroundColor: '#fff'},
  desktopCollection: {display: {[media.mobile]: 'none', default: 'block'}},
  collectionHeading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10},
  collectionLink: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, gap: 4, minHeight: {[media.desktop]: 44, default: 36}, paddingInline: {[media.desktop]: 14, default: 0}, color: $.ink, fontSize: {[media.desktop]: 14, default: 13}, fontWeight: {[media.desktop]: 400, default: 600}, borderWidth: {[media.desktop]: 1, default: 0}, borderStyle: 'solid', borderColor: $.line, borderRadius: {[media.desktop]: 999, default: 0}, backgroundColor: {default: 'transparent', ':hover': {[media.desktop]: $.surfaceAlt}}, textDecoration: 'none'},
  caption: {marginTop: 2, color: $.muted, fontSize: 12, lineHeight: '18px'},
  dealsRail: {display: 'flex', gap: 12, overflowX: 'auto', overscrollBehaviorX: 'contain', marginTop: 14, marginRight: {[media.mobile]: -12, default: 0}, paddingRight: {[media.mobile]: 12, default: 0}, paddingBottom: 8, scrollbarWidth: 'none'},
  sentinel: {height: 1},
  browse: {display: 'grid', placeItems: 'center', minHeight: 46, marginTop: 22, color: $.violet, fontSize: 15, fontWeight: 500, borderColor: $.violet, borderStyle: 'solid', borderWidth: 1, borderRadius: 12},
});
