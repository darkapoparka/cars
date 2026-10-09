'use client';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import ShowroomBadge from '@/components/ShowroomBadge';
import {Heart} from 'lucide-react';
import {CurrencyLabel} from '@/components/ReferenceUI';
import {useSavedVehicle} from '@/components/useVehicleState';
import {formatPrice, type Vehicle} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';

export default function MiniVehicleCard({vehicle, green = false, featured = false}: {vehicle: Vehicle; green?: boolean; featured?: boolean}) {
  const tx = useCopy();

  const {saved, toggle, error} = useSavedVehicle(vehicle.slug);
  const href = `/cars/${vehicle.slug}`;
  const badge = /coming/i.test(vehicle.badges[0] || '') ? 'Coming soon' : '';
  const luxe = vehicle.tier === 'Luxe' || vehicle.slug === '2024-toyota-fortuner-exr';
  return <article aria-label={tx(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.card, featured && s.featuredCard)}>
    <Link href={href} aria-label={tx(`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.photo, featured && s.featuredPhoto)}>
      <img src={assetPath(vehicle.image)} alt={vehicle.imagePlaceholder ? tx('Photo unavailable') : tx(`${vehicle.make} ${vehicle.model}`)} width={160} height={90} loading="lazy" {...stylex.props(s.image, vehicle.imagePlaceholder && s.placeholderImage)} />
      {vehicle.imagePlaceholder ? <span {...stylex.props(s.placeholderLabel)}>{tx('Photo unavailable')}</span> : null}
      {badge ? <span {...stylex.props(s.badge, green && s.greenBadge, s.comingBadge)}>{tx(badge)}</span> : null}
      {luxe && !badge ? <span {...stylex.props(s.photoTier)}><ShowroomBadge premium/></span> : null}
    </Link>
    <button type="button" aria-label={tx(saved ? 'Remove from saved cars' : 'Save car')} aria-pressed={saved} onClick={toggle} {...stylex.props(s.save, saved && s.saved)}>
      <Heart size={19} strokeWidth={1.2} fill={saved ? 'currentColor' : '#fafafa'} />
    </button>
    <Link href={href} {...stylex.props(s.body)}>
      <h3 {...stylex.props(s.title)}>{tx(vehicle.year)} {tx(vehicle.make)} {tx(vehicle.model)}</h3>
      <p {...stylex.props(s.price)}>{vehicle.priceOnRequest ? tx('Price on request') : <><CurrencyLabel size={11} />{tx(formatPrice(vehicle.price))}</>}</p>
      {vehicle.monthly > 0 ? <p {...stylex.props(s.monthly)}><CurrencyLabel size={10} />{tx(formatPrice(vehicle.monthly))}{tx("/mo* est.")}</p> : null}
    </Link>
    {error ? <p role="alert" {...stylex.props(s.error)}>{tx(error)}</p> : null}
  </article>;
}
const s = stylex.create({
  card: {position: 'relative', flexShrink: 0, width: 192, alignSelf: 'start', overflow: 'hidden', borderColor: $.surfaceBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 16, backgroundColor: $.surface, boxShadow: $.shadowSoft},
  featuredCard: {width: {[media.mobile]: 192, default: 210}},
  photo: {position: 'relative', display: 'block', height: 108, overflow: 'hidden'},
  featuredPhoto: {height: {[media.mobile]: 116, default: 126}},
  image: {width: '100%', height: '100%', objectFit: 'cover'},
  placeholderImage: {objectFit: 'contain', padding: 12, backgroundColor: '#f0f2f4'},
  placeholderLabel: {position: 'absolute', left: 7, right: 7, bottom: 6, padding: '2px 4px', color: '#555b62', fontSize: 8, fontWeight: 600, textAlign: 'center', borderRadius: 999, backgroundColor: 'rgba(255,255,255,.94)'},
  badge: {position: 'absolute', left: 0, bottom: 0, maxWidth: '100%', overflow: 'hidden', paddingInline: 5, color: '#fff', fontSize: 9, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap', borderTopRightRadius: 8, backgroundColor: '#f5269d'},
  greenBadge: {backgroundColor: '#00b737'},
  comingBadge: {backgroundColor: '#676767'},
  save: {position: 'absolute', top: 0, right: 0, display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: '#727272', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  saved: {color: '#202024'},
  body: {display: 'flex', flexDirection: 'column', padding: '10px 10px 12px'},
  title: {display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14, fontWeight: 500, lineHeight: '20px'},
  price: {display: 'flex', alignItems: 'center', gap: 1, marginTop: 6, fontSize: 15, fontWeight: 600, lineHeight: '21px', whiteSpace: 'nowrap'},
  monthly: {display: 'inline-flex', alignItems: 'center', gap: 1, marginTop: 2, color: '#626269', fontSize: 12, fontWeight: 400, lineHeight: '18px', whiteSpace: 'nowrap'},
  photoTier: {position: 'absolute', left: 6, bottom: 6, padding: '1px 4px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,.94)'},
  error: {padding: 8, color: '#b42318', fontSize: 11, lineHeight: 1.4},
});
