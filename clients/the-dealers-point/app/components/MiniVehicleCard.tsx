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

export default function MiniVehicleCard({vehicle, green = false}: {vehicle: Vehicle; green?: boolean}) {
  const tx = useCopy();

  const {saved, toggle, error} = useSavedVehicle(vehicle.slug);
  const href = `/cars/${vehicle.slug}`;
  const badge = /coming/i.test(vehicle.badges[0] || '') ? 'Coming soon' : '';
  const luxe = vehicle.tier === 'Luxe' || vehicle.slug === '2024-toyota-fortuner-exr';
  return <article aria-label={tx(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.card)}>
    <Link href={href} aria-label={tx(`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.photo)}>
      <img src={assetPath(vehicle.image)} alt={vehicle.imagePlaceholder ? tx('Photo unavailable') : tx(`${vehicle.make} ${vehicle.model}`)} width={160} height={90} loading="lazy" {...stylex.props(s.image, vehicle.imagePlaceholder && s.placeholderImage)} />
      {vehicle.imagePlaceholder ? <span {...stylex.props(s.placeholderLabel)}>{tx('Photo unavailable')}</span> : null}
      {badge ? <span {...stylex.props(s.badge, green && s.greenBadge, s.comingBadge)}>{tx(badge)}</span> : null}
      {luxe && !badge ? <span {...stylex.props(s.photoTier)}><ShowroomBadge premium/></span> : null}
    </Link>
    <button type="button" aria-label={tx(saved ? 'Remove from saved cars' : 'Save car')} aria-pressed={saved} onClick={toggle} {...stylex.props(s.save, saved && s.saved)}>
      <Heart size={19} strokeWidth={1.2} fill={saved ? 'currentColor' : '#fafafa'} />
    </button>
    <Link href={href} {...stylex.props(s.body)}>
      <h3 {...stylex.props(s.title)}>{tx(vehicle.year)} {tx(vehicle.make.toUpperCase())} {tx(vehicle.model.toUpperCase())}</h3>
      <p {...stylex.props(s.price)}>{vehicle.priceOnRequest ? tx('Price on request') : <><CurrencyLabel size={11} />{tx(formatPrice(vehicle.price))}</>}</p>
      {vehicle.monthly > 0 ? <p {...stylex.props(s.monthly)}><CurrencyLabel size={10} />{tx(formatPrice(vehicle.monthly))}{tx("/mo* est.")}</p> : null}
    </Link>
    {error ? <p role="alert" {...stylex.props(s.error)}>{tx(error)}</p> : null}
  </article>;
}
const s = stylex.create({
  card: {position: 'relative', flexShrink: 0, width: 160, alignSelf: 'start', overflow: 'hidden', borderColor: '#e3e3e3', borderStyle: 'solid', borderWidth: 1, borderRadius: 17, backgroundColor: '#fff', boxShadow: '0 3px 8px rgba(0,0,0,.06)'},
  photo: {position: 'relative', display: 'block', height: 90, overflow: 'hidden'},
  image: {width: '100%', height: '100%', objectFit: 'cover'},
  placeholderImage: {objectFit: 'contain', padding: 12, backgroundColor: '#f0f2f4'},
  placeholderLabel: {position: 'absolute', left: 7, right: 7, bottom: 6, padding: '2px 4px', color: '#555b62', fontSize: 8, fontWeight: 600, textAlign: 'center', borderRadius: 999, backgroundColor: 'rgba(255,255,255,.94)'},
  badge: {position: 'absolute', left: 0, bottom: 0, maxWidth: '100%', overflow: 'hidden', paddingInline: 5, color: '#fff', fontSize: 9, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap', borderTopRightRadius: 8, backgroundColor: '#f5269d'},
  greenBadge: {backgroundColor: '#00b737'},
  comingBadge: {backgroundColor: '#676767'},
  save: {position: 'absolute', top: 7, right: 7, display: 'grid', placeItems: 'center', width: 22, height: 24, padding: 0, color: '#727272', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  saved: {color: '#ef4070'},
  body: {display: 'flex', flexDirection: 'column', padding: '6px 8px 8px'},
  title: {overflow: 'hidden', fontSize: 13, fontWeight: 500, lineHeight: '18px', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  price: {display: 'flex', alignItems: 'center', gap: 1, marginTop: 5, fontSize: 13, fontWeight: 500, lineHeight: '18px', whiteSpace: 'nowrap'},
  monthly: {display: 'inline-flex', alignItems: 'center', gap: 1, marginTop: 1, color: '#727272', fontSize: 10, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap'},
  photoTier: {position: 'absolute', left: 6, bottom: 6, padding: '1px 4px', borderRadius: 4, backgroundColor: 'rgba(255,255,255,.94)'},
  error: {padding: 8, color: '#b42318', fontSize: 11, lineHeight: 1.4},
});
