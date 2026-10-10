'use client';

import * as stylex from '@stylexjs/stylex';
import {useId, useRef, useState} from 'react';
import {ArrowRight, Heart, MapPin, MessageSquareText, Phone, type LucideIcon} from 'lucide-react';
import Link from '@/components/AppLink';
import Image from '@/components/AppImage';
import DealerBrand from '@/components/DealerBrand';
import PageHeader from '@/components/PageHeader';
import IconButton from '@/components/IconButton';
import DealerLocationSheet from '@/components/DealerLocationSheet';
import DealerEnquirySheet from '@/components/DealerEnquirySheet';
import ShowroomBannerFrame from '@/components/ShowroomBannerFrame';
import ShowroomSearchField from '@/components/ShowroomSearchField';
import ShowroomIcon from '@/components/ShowroomIcon';
import FeatureLanding from '@/components/FeatureLanding';
import {compactDock} from '@/components/dock.stylex';
import {pillStyles} from '@/components/pill.stylex';
import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import {showroom} from '@/lib/showroom';
import {dealer} from '@/lib/dealer-config';
import {currency} from '@/lib/currency';
import {formatPrice, vehicles} from '@/lib/data';
import {emptyFilters, matchesInventory} from '@/lib/inventory-filters';
import {media, tokens as $} from '@/app/tokens.stylex';

const navigation = [
  {href: '/', label: 'Home', icon: 'home'},
  {href: '/cars', label: 'Cars', icon: 'cars'},
  {href: '/services', label: 'Services', icon: 'service'},
  {href: '/more', label: 'Menu', icon: 'more'},
] as const;

const services = [
  {href: '/sell', title: 'Sell', copy: 'Sell or part-exchange.', image: showroom.services[1].mobileImage},
  {href: '/finance', title: 'Leasing', copy: 'Explore your monthly payment.', image: showroom.services[2].mobileImage},
  {href: '/service', title: 'Car care.', copy: 'Servicing and diagnostics.', image: showroom.services[3].mobileImage},
] as const;

// Show useful entry points for this dealer's stock, including smaller budgets when available.
const budgetPicks = [10000, 20000, 30000, 50000, 80000, 100000, 150000, 200000, 300000, 500000]
  .map(maximum => ({maximum, count: vehicles.filter(vehicle => matchesInventory(vehicle, {...emptyFilters(), maximum}, '')).length}))
  .filter((pick, index, picks) => pick.count > 0 && pick.count < vehicles.length && !picks.slice(0, index).some(earlier => earlier.count === pick.count))
  .slice(0, 3);
const suvCount = vehicles.filter(vehicle => vehicle.body === 'SUV').length;
const homePromotions = [
  {href: '/cars', title: 'Explore our cars', action: 'Browse stock', image: showroom.artwork.highlights.collection},
  {href: showroom.services[2].href, title: 'Car finance.', action: 'Finance a car', image: showroom.artwork.highlights.finance},
  {href: showroom.services[1].href, title: 'Sell your car.', action: 'Valuation', image: showroom.artwork.highlights.exchange},
  {href: showroom.services[3].href, title: 'Car care.', action: 'Choose care', image: showroom.artwork.heroes.service},
] as const;

export function MobileAlternativeHeader({onDark = false}: {onDark?: boolean}) {
  const tx = useCopy();
  const [locationOpen, setLocationOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const locationLabel = dealer.address || dealer.city;
  return <><header data-alternative-header {...stylex.props(s.header, onDark && s.headerDark)}>
    <Link href="/" aria-label={tx(`${showroom.name} home`)} {...stylex.props(s.brand, onDark && s.brandDark)}><DealerBrand compact={!onDark} onDark={onDark}/></Link>
    <div {...stylex.props(s.headerActions)}>
      {onDark ? <button data-alternative-header-location type="button" onClick={() => setLocationOpen(true)} aria-haspopup="dialog" aria-expanded={locationOpen} aria-label={locationLabel ? `${tx('Visit showroom')} · ${locationLabel}` : tx('Visit showroom')} title={locationLabel || tx('Visit showroom')} {...stylex.props(s.saved, s.savedDark)}><HeaderActionIcon icon={MapPin} onDark/></button> : null}
      {onDark ? dealer.phoneE164 ? <a data-alternative-header-contact href={`tel:${dealer.phoneE164}`} aria-label={`${tx('Call')} · ${dealer.phoneDisplay || dealer.phoneE164}`} title={dealer.phoneDisplay || tx('Call')} {...stylex.props(s.saved, s.savedDark)}><HeaderActionIcon icon={Phone} onDark/></a> : <button data-alternative-header-contact type="button" onClick={() => setEnquiryOpen(true)} aria-label={tx('Contact us')} title={tx('Contact us')} aria-haspopup="dialog" aria-expanded={enquiryOpen} {...stylex.props(s.saved, s.savedDark)}><HeaderActionIcon icon={MessageSquareText} onDark/></button> : null}
      <Link href="/saved" aria-label={tx('Saved cars')} title={tx('Saved cars')} {...stylex.props(s.saved, onDark && s.savedDark)}><HeaderActionIcon icon={Heart} onDark={onDark}/></Link>
    </div>
  </header><DealerLocationSheet open={locationOpen} onClose={() => setLocationOpen(false)}/><DealerEnquirySheet open={enquiryOpen} onClose={() => setEnquiryOpen(false)}/></>;
}

function HeaderActionIcon({icon: Icon, onDark}: {icon: LucideIcon; onDark: boolean}) {
  return <span data-alternative-header-icon {...stylex.props(s.headerIconSurface, onDark && s.headerIconSurfaceDark)}><Icon size={20} strokeWidth={2} absoluteStrokeWidth aria-hidden="true"/></span>;
}

export function MobileAlternativeHero() {
  const tx = useCopy();
  const headingId = useId();
  const promotionRail = useRef<HTMLDivElement>(null);
  const [activePromotion, setActivePromotion] = useState(0);
  function selectPromotion(index: number) {
    const rail = promotionRail.current;
    const card = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !card) return;
    rail.scrollTo({left: Math.max(0, card.offsetLeft - 12), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  function syncPromotion() {
    const rail = promotionRail.current;
    if (!rail) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    const nearest = cards.reduce((current, card, index) => Math.abs(card.offsetLeft - 12 - rail.scrollLeft) < Math.abs(cards[current].offsetLeft - 12 - rail.scrollLeft) ? index : current, 0);
    setActivePromotion(nearest);
  }
  return <section data-alternative-home-hero aria-labelledby={headingId} {...stylex.props(s.phoneOnly)}>
    <h1 id={headingId} className="visually-hidden">{tx('Home')}</h1>
    <ShowroomBannerFrame inline>
      <section {...stylex.props(s.hero)}>
        <div {...stylex.props(s.heroControls)}>
          <div {...stylex.props(s.heroSearch)}><ShowroomSearchField onDark/></div>
        </div>
        <div data-alternative-promotion-rail ref={promotionRail} onScroll={syncPromotion} role="region" aria-label={tx('Explore the showroom')} tabIndex={0} {...stylex.props(s.heroRail)}>
          {homePromotions.map((promotion, index) => <Link key={promotion.href} data-alternative-promotion href={promotion.href} aria-label={`${tx(promotion.title)} ${tx(promotion.action)}`} {...stylex.props(s.heroPromotion)}>
            <Image src={promotion.image} alt="" fill sizes="(max-width: 767px) calc(100vw - 24px), 1px" loading={index === 0 ? 'eager' : 'lazy'} {...stylex.props(s.promotionImage)}/>
            <span aria-hidden="true" {...stylex.props(s.promotionScrim)}/>
            <div {...stylex.props(s.promotionCopy)}>
              <h2 {...stylex.props(s.promotionTitle)}>{tx(promotion.title).replace(/\.$/, '')}</h2>
              <span aria-hidden="true" {...stylex.props(s.promotionAction)}>{tx(promotion.action).replace(/\.$/, '')}<ArrowRight size={12}/></span>
            </div>
          </Link>)}
        </div>
        <div data-alternative-promotion-pages aria-label={tx('Choose a promotion')} {...stylex.props(s.promotionPages)}>{homePromotions.map((promotion, index) => <button key={promotion.href} type="button" aria-label={`${index + 1}: ${tx(promotion.title).replace(/\.$/, '')}`} aria-current={activePromotion === index ? 'true' : undefined} onClick={() => selectPromotion(index)} {...stylex.props(s.promotionPage)}><span aria-hidden="true" {...stylex.props(s.promotionDot, activePromotion === index && s.promotionDotActive)}/></button>)}</div>
      </section>
    </ShowroomBannerFrame>
  </section>;
}

export function MobileAlternativeDiscovery() {
  const tx = useCopy();
  return <div data-alternative-discovery {...stylex.props(s.phoneOnly, s.discovery)}>
    <nav data-alternative-quick-picks aria-label={tx('Quick picks')} {...stylex.props(s.quickPicks)}>
      {budgetPicks.map(({maximum, count}) => <Link key={maximum} href={`/cars?maxPrice=${maximum}`} aria-label={`${tx('Up to')} ${currency.symbol}${formatPrice(maximum)} · ${count} ${tx(count === 1 ? 'car' : 'cars')}`} {...stylex.props(pillStyles.control, s.pickControl)}><span {...stylex.props(pillStyles.surface, s.pickSurface)}>{tx('Up to')} {currency.symbol}{formatPrice(maximum)}</span></Link>)}
      {suvCount > 0 ? <Link href="/cars?body=SUV" aria-label={`${tx('SUV')} · ${suvCount} ${tx(suvCount === 1 ? 'car' : 'cars')}`} {...stylex.props(pillStyles.control, s.pickControl)}><span {...stylex.props(pillStyles.surface, s.pickSurface)}>{tx('SUV')}</span></Link> : null}
    </nav>
  </div>;
}

export function MobileAlternativeDock({pathname}: {pathname: string}) {
  const tx = useCopy();
  return <nav data-alternative-dock aria-label={tx('App navigation')} {...stylex.props(compactDock.root, s.phoneDock)}>{navigation.map(item => {
    const active = item.href === '/' ? pathname === '/' : item.href === '/services' ? ['/services', '/sell', '/finance', '/service'].includes(pathname) : item.href === '/more' ? pathname === '/more' || pathname === '/saved' : pathname === item.href;
    return <Link key={item.href} href={item.href} aria-label={tx(item.label)} title={tx(item.label)} aria-current={active ? 'page' : undefined} {...stylex.props(compactDock.link, active && compactDock.active)}><ShowroomIcon name={item.icon} size={22} strokeWidth={active ? 2 : 1.65}/></Link>;
  })}</nav>;
}

export function MobileAlternativeServices() {
  const tx = useCopy();
  return <><div {...stylex.props(s.phoneOnly, s.serviceScreen)}><PageHeader compact title={tx('Services')} action={<IconButton href="/saved" label={tx('Saved cars')} icon={Heart}/>}/><main data-alternative-services {...stylex.props(s.services)}>
    <nav aria-label={tx('Car services')} {...stylex.props(s.serviceList)}>{services.map(item => <Link key={item.href} href={item.href} {...stylex.props(s.service)}>
      <img src={assetPath(item.image)} width={52} height={52} alt="" {...stylex.props(s.serviceImage)}/>
      <span {...stylex.props(s.serviceCopy)}><span {...stylex.props(s.serviceTitleRow)}><span {...stylex.props(s.serviceTitle)}>{tx(item.title).replace(/\.$/, '')}</span><ArrowRight size={16} aria-hidden="true" {...stylex.props(s.serviceArrow)}/></span><span {...stylex.props(s.serviceDescription)}>{tx(item.copy)}</span></span>
    </Link>)}</nav>
  </main></div><div {...stylex.props(s.wideOnly)}><FeatureLanding kind="service"/></div></>;
}

const s = stylex.create({
  phoneOnly: {display: {[media.mobile]: 'block', default: 'none'}},
  wideOnly: {display: {[media.mobile]: 'none', default: 'block'}},
  header: {display: {[media.mobile]: 'flex', default: 'none'}, position: 'sticky', top: 0, zIndex: 70, alignItems: 'center', justifyContent: 'space-between', gap: 16, minHeight: 'calc(60px + env(safe-area-inset-top))', paddingTop: 'env(safe-area-inset-top)', paddingInline: 16, backgroundColor: 'rgba(255,255,255,.97)', backdropFilter: 'blur(16px)'},
  headerDark: {color: '#fff', backgroundColor: '#202023'},
  headerActions: {display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0},
  brand: {display: 'flex', alignItems: 'center', minHeight: 44, borderRadius: 8, outlineOffset: 2},
  brandDark: {outlineColor: {':focus-visible': '#fff'}},
  saved: {display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, borderWidth: 0, borderRadius: '50%', color: $.ink, backgroundColor: 'transparent', cursor: 'pointer', outlineStyle: {default: 'none', ':focus-visible': 'solid'}, outlineWidth: 2, outlineColor: $.ink, outlineOffset: 1},
  savedDark: {color: '#fff', outlineColor: '#fff'},
  headerIconSurface: {display: 'grid', placeItems: 'center', width: $.controlCompactHeight, height: $.controlCompactHeight, borderRadius: '50%', backgroundColor: {default: $.surfaceAlt, ':hover': $.line}},
  headerIconSurfaceDark: {backgroundColor: {default: 'rgba(255,255,255,.08)', ':hover': 'rgba(255,255,255,.15)'}},
  hero: {overflow: 'hidden', color: '#fff', backgroundColor: '#202023'},
  heroControls: {display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginInline: 'auto', padding: '4px 12px 0'},
  heroSearch: {width: '100%'},
  heroRail: {position: 'relative', display: 'flex', gap: 12, overflowX: 'auto', overscrollBehaviorX: 'contain', scrollSnapType: 'x mandatory', scrollPaddingInline: 12, scrollbarWidth: 'none', marginTop: 12, padding: '0 12px', outlineColor: {':focus-visible': '#fff'}, outlineOffset: -3},
  heroPromotion: {position: 'relative', isolation: 'isolate', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0, flexBasis: '100%', minWidth: 0, height: 112, padding: '12px 10px', overflow: 'hidden', scrollSnapAlign: 'start', color: '#fff', backgroundColor: '#171719', borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(255,255,255,.18)', borderRadius: 20, textAlign: 'center', textDecoration: 'none', outlineColor: '#fff', outlineOffset: -4},
  promotionImage: {objectFit: 'cover', objectPosition: 'center 60%', pointerEvents: 'none'},
  promotionScrim: {position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(90deg,rgba(17,17,19,.16),rgba(17,17,19,.58) 26%,rgba(17,17,19,.58) 72%,rgba(17,17,19,.16))'},
  promotionCopy: {position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: '100%'},
  promotionTitle: {position: 'relative', width: '100%', fontSize: 18, fontWeight: 500, lineHeight: '22px', textWrap: 'balance', textShadow: '0 1px 8px rgba(0,0,0,.6)'},
  promotionAction: {position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4, minHeight: 30, paddingInline: 12, color: '#202023', backgroundColor: '#fff', borderRadius: 999, fontSize: 13, fontWeight: 400, lineHeight: '20px', whiteSpace: 'nowrap'},
  promotionPages: {display: 'flex', alignItems: 'center', justifyContent: 'center'},
  promotionPage: {display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, borderWidth: 0, borderRadius: 8, color: '#fff', backgroundColor: 'transparent', cursor: 'pointer', outlineOffset: -4},
  promotionDot: {display: 'block', width: 5, height: 5, borderRadius: 999, backgroundColor: '#85858d'},
  promotionDotActive: {width: 16, backgroundColor: '#fff'},
  discovery: {paddingTop: 8},
  quickPicks: {display: 'flex', gap: 8, overflowX: 'auto', overscrollBehaviorX: 'contain', marginInline: -12, paddingInline: 12, scrollbarWidth: 'none'},
  pickControl: {fontSize: 14, fontWeight: 400, textDecoration: 'none'},
  pickSurface: {borderWidth: 0, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}},
  phoneDock: {display: {[media.mobile]: 'grid', default: 'none'}},
  serviceScreen: {minHeight: '100svh'},
  services: {padding: '12px 12px 32px', color: $.ink},
  serviceList: {display: 'grid', gap: 10},
  service: {display: 'grid', gridTemplateColumns: '52px minmax(0,1fr)', alignItems: 'center', gap: 12, minHeight: 92, padding: '14px', borderRadius: 20, color: $.ink, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, outlineOffset: -3},
  serviceImage: {display: 'block', width: 52, height: 52, objectFit: 'contain'},
  serviceCopy: {display: 'grid', gap: 4, minWidth: 0},
  serviceTitleRow: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 16px', alignItems: 'center', gap: 8},
  serviceTitle: {fontSize: 18, fontWeight: 500, lineHeight: '24px'},
  serviceArrow: {display: 'block', flexShrink: 0},
  serviceDescription: {fontSize: 14, fontWeight: 400, lineHeight: '20px', color: $.muted},
});
