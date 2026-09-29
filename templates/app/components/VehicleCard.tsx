'use client';
import {assetPath} from '@/lib/paths';
import {useCopy, useLocale} from '@/lib/locale';
import {showroomLocation} from '@/lib/showroom-location';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import ShowroomBadge from '@/components/ShowroomBadge';
import {showroom} from '@/lib/showroom';
import {ChevronRight, Heart, MapPin} from 'lucide-react';
import {CurrencyLabel} from '@/components/ReferenceUI';
import {SAVED_KEY, useSavedVehicle} from '@/components/useVehicleState';
import {formatPrice, type Vehicle} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';

export const STORAGE_KEY = SAVED_KEY;
export default function VehicleCard({vehicle, luxe = false, showDiscount = false}: {vehicle: Vehicle; luxe?: boolean; showDiscount?: boolean}) {
  const tx = useCopy();
  const location = showroomLocation(useLocale());

  const {saved, toggle, error} = useSavedVehicle(vehicle.slug);
  const discount = Math.max(0, (vehicle.previousPrice ?? vehicle.price) - vehicle.price);
  const isLuxe = vehicle.tier ? vehicle.tier === 'Luxe' : luxe || vehicle.slug === '2024-toyota-fortuner-exr';
  const badge = /coming/i.test(vehicle.badges[0] || '') ? 'Coming soon' : '';
  const href = `/cars/${vehicle.slug}`;
  const benefits = vehicle.proposalBenefits?.slice(0, 2) ?? [];
  const facts = [vehicle.mileageOnRequest ? tx('Mileage on request') : `${formatPrice(vehicle.mileage)} ${tx('km')}`,
    vehicle.specifications || vehicle.transmission,
    vehicle.highlights[0] || (vehicle.fuel !== 'Not published' ? vehicle.fuel : vehicle.body)].filter(Boolean);
  return <article aria-label={tx(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)} data-price={vehicle.price} data-mileage={vehicle.mileage} data-monthly={vehicle.monthly} {...stylex.props(s.card)}>
    <div {...stylex.props(s.main)}>
      <Link href={href} aria-label={tx(`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.photo)}>
        <img src={assetPath(vehicle.image)} alt={vehicle.imagePlaceholder ? tx('Photo unavailable') : tx(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)} loading="lazy" width={400} height={225} {...stylex.props(s.image, vehicle.imagePlaceholder && s.placeholderImage)} />
        {vehicle.imagePlaceholder ? <span {...stylex.props(s.placeholderLabel)}>{tx('Photo unavailable')}</span> : null}
        {badge ? <span {...stylex.props(s.rate, /coming/i.test(badge) && s.coming)}>{tx(badge)}</span> : null}
      </Link>
      <Link href={href} {...stylex.props(s.info)}>
        <h3 {...stylex.props(s.title)}>{tx(vehicle.year)} {tx(vehicle.make)} {tx(vehicle.model)}</h3>
        {vehicle.trim ? <p {...stylex.props(s.trim)}>{tx(vehicle.trim)}</p> : null}
        <div {...stylex.props(s.priceRow)}><strong {...stylex.props(s.price)}>{vehicle.priceOnRequest ? tx('Price on request') : <><CurrencyLabel size={13} />{tx(formatPrice(vehicle.price))}</>}</strong>{showDiscount && discount > 0 ? <span {...stylex.props(s.discount)}>{tx(formatPrice(discount))} {tx(" OFF")}</span> : null}</div>
        {vehicle.monthly > 0 ? <p {...stylex.props(s.monthly)}><span {...stylex.props(s.monthlyPrice)}><CurrencyLabel size={11} />{tx(formatPrice(vehicle.monthly))}{tx("/mo*")}</span><span {...stylex.props(s.monthlyNote)}>{tx("est.")}</span></p> : null}
        {benefits.length ? <div {...stylex.props(s.benefits)}><span {...stylex.props(s.benefitLabel)}>{tx('Example benefits')}</span><div {...stylex.props(s.benefitRow)}>{benefits.map(item => <span key={item} {...stylex.props(s.benefitChip)}>{tx(item)}</span>)}</div></div> : null}
      </Link>
      <button type="button" onClick={toggle} aria-pressed={saved} aria-label={tx(saved ? `Remove ${vehicle.make} ${vehicle.model} from saved cars` : `Save ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.heart, saved && s.heartSaved)}><Heart size={22} strokeWidth={1.3} fill={saved ? 'currentColor' : '#fafafa'} /></button>
    </div>
    <Link href={href} {...stylex.props(s.meta)}>{facts.map((item, index) => <span key={`${item}-${index}`} {...stylex.props(s.pill)}>{tx(item)}</span>)}</Link>
    <Link href={showroom.locationHref} aria-label={location ? `${tx(showroom.locationLabel)}: ${location}` : tx(showroom.locationLabel)} {...stylex.props(s.location)}><MapPin size={17} strokeWidth={1.6} aria-hidden="true" {...stylex.props(s.locationIcon)}/><span {...stylex.props(s.locationText)}>{location || tx(showroom.locationLabel)}</span>{isLuxe ? <ShowroomBadge premium/> : null}<ChevronRight size={14} aria-hidden="true" {...stylex.props(s.locationIcon)}/></Link>
    {error ? <p role="alert" {...stylex.props(s.error)}>{tx(error)}</p> : null}
  </article>;
}
const s = stylex.create({
  card: {position: 'relative', minWidth: 0, overflow: 'hidden', borderColor: '#e7e7ea', borderStyle: 'solid', borderWidth: 1, borderRadius: 17, backgroundColor: '#fff', boxShadow: '0 3px 12px rgba(0,0,0,.035)'},
  main: {position: 'relative', display: 'grid', gridTemplateColumns: {[media.mobile]: '40% minmax(0,1fr)', default: 'minmax(140px,39%) minmax(0,1fr)'}, gap: 12, paddingTop: 12, paddingBottom: 8, paddingInline: 12, minHeight: 101},
  photo: {position: 'relative', alignSelf: 'start', display: 'block', height: {[media.mobile]: 104, default: 126}, overflow: 'hidden', borderRadius: 10},
  image: {width: '100%', height: '100%', objectFit: 'cover'},
  placeholderImage: {objectFit: 'contain', padding: 14, backgroundColor: '#f0f2f4'},
  placeholderLabel: {position: 'absolute', left: 8, right: 8, bottom: 7, padding: '3px 6px', color: '#555b62', fontSize: 9, fontWeight: 600, lineHeight: '13px', textAlign: 'center', borderRadius: 999, backgroundColor: 'rgba(255,255,255,.94)'},
  rate: {position: 'absolute', left: 0, bottom: 0, maxWidth: '100%', overflow: 'hidden', paddingInline: 5, color: '#fff', fontSize: {[media.mobile]: 9, default: 10}, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap', borderTopRightRadius: 9, backgroundColor: '#f5269d'},
  coming: {backgroundColor: '#676767'},
  info: {minWidth: 0},
  title: {overflow: 'hidden', paddingRight: 22, fontSize: {[media.mobile]: 14, default: 16}, fontWeight: 600, lineHeight: '19px', display: {'@media (max-width: 390px)': 'block', default: '-webkit-box'}, whiteSpace: {'@media (max-width: 390px)': 'nowrap', default: 'normal'}, textOverflow: 'ellipsis', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'},
  trim: {overflow: 'hidden', marginTop: 1, color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '18px', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  priceRow: {display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5, marginTop: 3, minHeight: 20},
  price: {display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, maxWidth: '100%', fontSize: 16, fontWeight: 600, lineHeight: '20px'},
  discount: {paddingInline: 4, color: '#008c36', fontSize: 11, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap', borderRadius: 12, backgroundColor: '#effbf1'},
  monthly: {display: 'flex', alignItems: 'center', gap: 4, marginTop: 1, whiteSpace: 'nowrap', lineHeight: '18px'},
  monthlyPrice: {display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 13, fontWeight: 400},
  monthlyNote: {overflow: 'hidden', color: $.muted, fontSize: 10, fontWeight: 400, textOverflow: 'ellipsis'},
  benefits: {marginTop: 6},
  benefitLabel: {display: 'block', marginBottom: 3, color: '#7a8087', fontSize: 8, fontWeight: 700, lineHeight: '11px', letterSpacing: '.04em', textTransform: 'uppercase'},
  benefitRow: {display: 'flex', flexWrap: 'wrap', gap: 3},
  benefitChip: {maxWidth: '100%', padding: '2px 5px', color: '#34383d', fontSize: 9, fontWeight: 600, lineHeight: '13px', overflowWrap: 'anywhere', borderRadius: 8, backgroundColor: '#eef0f2'},
  heart: {position: 'absolute', top: 3, right: 1, display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: '#727272', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  heartSaved: {color: $.ink},
  meta: {display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', minHeight: 30, paddingTop: 3, paddingBottom: 8, paddingInline: 12},
  pill: {overflow: 'hidden', paddingBlock: 3, paddingInline: 4, color: '#727272', fontSize: 10, fontWeight: 500, lineHeight: '13px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', borderRadius: 4, backgroundColor: '#f4f4f4'},
  location: {display: 'flex', alignItems: 'center', gap: 7, minHeight: 44, paddingInline: 12, color: $.muted, borderTopColor: $.line, borderTopStyle: 'solid', borderTopWidth: 1, backgroundColor: {default: $.surfaceAlt, ':hover': $.rail}},
  locationIcon: {flexShrink: 0},
  locationText: {flexGrow: 1, minWidth: 0, overflow: 'hidden', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  error: {padding: '10px 12px', color: '#b42318', fontSize: 12, lineHeight: 1.4},
});
