'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {tokens as $} from '@/app/tokens.stylex';

const offers = [
  {asset: 'offer-warranty', label: 'Lifetime warranty', href: '/benefits/warranty'},
  {asset: 'offer-finance', label: 'Special interest rates on Luxe cars', href: '/luxe'},
  {asset: 'offer-return', label: '30-day return guarantee', href: '/benefits/returns'},
];
/** Manual carousel: the captured app explicitly disables autoplay. */
export default function OfferCarousel({onLogin}: {onLogin?: () => void}) {
  const tx = useCopy();

  return <div aria-label={tx("Offers")} role="region" aria-roledescription="carousel" {...stylex.props(s.rail)}>
    {offers.map(offer => <Link data-offer key={offer.asset} href={offer.href} aria-label={tx(offer.label)} {...stylex.props(s.offer)}>
      <img src={assetPath(`/reference-assets/${offer.asset}.png`)} width={1212} height={681} alt={tx(offer.label)} loading="lazy" {...stylex.props(s.image)} />
    </Link>)}
    <button type="button" data-offer onClick={onLogin} aria-label={tx("Book a virtual test drive")} {...stylex.props(s.offer)}><img src={assetPath("/reference-assets/continuation/offer-virtual.png")} width={1212} height={681} alt={tx("Book a virtual test drive")} loading="lazy" {...stylex.props(s.image)} /></button>
  </div>;
}
const s = stylex.create({
  rail: {display: 'flex', gap: 14, overflowX: 'auto', marginInline: -12, marginTop: 14, paddingInline: 36, paddingBottom: 5, scrollbarWidth: 'none', scrollSnapType: 'x mandatory', scrollPaddingInline: 36, overscrollBehaviorX: 'contain'},
  offer: {display: 'block', flex: '0 0 100%', maxWidth: 550, padding: 0, overflow: 'hidden', scrollSnapAlign: 'center', borderWidth: 0, borderRadius: 24, backgroundColor: $.violet, cursor: 'pointer'},
  image: {width: '100%', height: 'auto', aspectRatio: '1212/681', objectFit: 'cover'},
});
