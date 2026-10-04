'use client';
import {memo, useEffect, useRef, useState} from 'react';
import {assetPath} from '@/lib/paths';
import {useCopy} from '@/lib/locale';
import Link from '@/components/AppLink';
import * as stylex from '@stylexjs/stylex';
import {Calculator, ChevronRight, Globe2, Heart} from 'lucide-react';
import {CurrencyLabel} from '@/components/ReferenceUI';
import {SAVED_KEY, useSavedVehicle} from '@/components/useVehicleState';
import {formatPrice, type Vehicle} from '@/lib/data';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';

export const STORAGE_KEY = SAVED_KEY;
function factOverflow(element: HTMLElement) {
  return (element.scrollLeft > 1 ? 1 : 0) | (element.scrollLeft + element.clientWidth < element.scrollWidth - 1 ? 2 : 0);
}
function VehicleCard({vehicle, showDiscount = false, desktopTile = false, finance, importListing}: {vehicle: Vehicle; showDiscount?: boolean; desktopTile?: boolean; finance?: {monthly: number; onCalculate: () => void}; importListing?: {country: string; onEnquire: () => void}}) {
  const tx = useCopy();
  const factRow = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(0);
  useEffect(() => {
    const element = factRow.current;
    if (!element) return;
    let mounted = true;
    const update = () => {if (mounted) setOverflow(factOverflow(element));};
    const observer = new ResizeObserver(update);
    observer.observe(element);
    document.fonts.ready.then(update);
    return () => {mounted = false; observer.disconnect();};
  }, [tx]);

  const {saved, toggle, error} = useSavedVehicle(vehicle.slug);
  const discount = Math.max(0, (vehicle.previousPrice ?? vehicle.price) - vehicle.price);
  const badge = /coming/i.test(vehicle.badges[0] || '') ? 'Coming soon' : '';
  const href = `/cars/${vehicle.slug}`;
  const benefits = vehicle.proposalBenefits?.slice(0, 2) ?? [];
  const facts = [vehicle.mileageOnRequest ? tx('Mileage on request') : `${formatPrice(vehicle.mileage)} ${tx('km')}`,
    vehicle.specifications || vehicle.transmission,
    vehicle.highlights[0] || (vehicle.fuel !== 'Not published' ? vehicle.fuel : vehicle.body)].filter(Boolean);
  const importAction = `${tx('Import enquiry')}: ${vehicle.year} ${vehicle.make} ${vehicle.model}, ${importListing?.country || ''}`;
  const photo = <>
    <img src={assetPath(vehicle.image)} alt={vehicle.imagePlaceholder ? tx('Photo unavailable') : tx(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)} loading="lazy" width={400} height={225} {...stylex.props(s.image, vehicle.imagePlaceholder && s.placeholderImage)} />
    {vehicle.imagePlaceholder ? <span {...stylex.props(s.placeholderLabel)}>{tx('Photo unavailable')}</span> : null}
    {importListing ? <span data-import-origin {...stylex.props(s.originBadge)}><Globe2 size={13} aria-hidden="true"/>{importListing.country}</span> : badge ? <span {...stylex.props(s.rate, /coming/i.test(badge) && s.coming)}>{tx(badge)}</span> : null}
  </>;
  const details = <>
    <p data-vehicle-make {...stylex.props(s.make, desktopTile && s.tileText, importListing && s.importText)}>{tx(vehicle.make)}</p>
    <h3 title={`${tx(vehicle.year)} ${tx(vehicle.model)}`} {...stylex.props(s.title, desktopTile && s.tileTitle, importListing && s.importText)}>{tx(vehicle.year)} {tx(vehicle.model)}</h3>
    {vehicle.trim ? <p {...stylex.props(s.trim)}>{tx(vehicle.trim)}</p> : null}
    <div {...stylex.props(s.priceRow)}><strong {...stylex.props(s.price, vehicle.priceOnRequest && s.priceOnRequest)}>{vehicle.priceOnRequest ? tx('Price on request') : <><CurrencyLabel size={18} />{tx(formatPrice(vehicle.price))}</>}</strong>{showDiscount && discount > 0 ? <span {...stylex.props(s.discount)}>{tx(formatPrice(discount))} {tx(" OFF")}</span> : null}</div>
    {!finance && vehicle.monthly > 0 ? <p {...stylex.props(s.monthly)}><span {...stylex.props(s.monthlyPrice)}><CurrencyLabel size={11} />{tx(formatPrice(vehicle.monthly))}{tx("/mo*")}</span><span {...stylex.props(s.monthlyNote)}>{tx("est.")}</span></p> : null}
  </>;
  return <article aria-label={tx(`${vehicle.year} ${vehicle.make} ${vehicle.model}`)} data-desktop-tile={desktopTile || undefined} data-price={vehicle.price} data-mileage={vehicle.mileage} data-monthly={vehicle.monthly} {...stylex.props(s.card)}>
    <div {...stylex.props(s.main, desktopTile && s.tileMain)}>
      {importListing ? <button type="button" aria-haspopup="dialog" aria-label={importAction} onClick={importListing.onEnquire} {...stylex.props(s.photo,desktopTile && s.tilePhoto,s.importAction)}>{photo}</button> : <Link href={href} aria-label={tx(`View ${vehicle.year} ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.photo,desktopTile && s.tilePhoto)}>{photo}</Link>}
      <div {...stylex.props(s.info, desktopTile && s.tileInfo)}>
        {importListing ? <button type="button" data-import-listing-action aria-haspopup="dialog" aria-label={importAction} onClick={importListing.onEnquire} {...stylex.props(s.details,s.importAction)}>{details}</button> : <Link href={href} {...stylex.props(s.details)}>{details}</Link>}
        <div {...stylex.props(s.facts)}><div ref={factRow} data-vehicle-facts role="group" tabIndex={0} aria-label={tx('Specifications')} onScroll={event => setOverflow(factOverflow(event.currentTarget))} {...stylex.props(s.meta)}>{facts.map((item, index) => <span key={`${item}-${index}`} title={tx(item)} {...stylex.props(s.pill, index === 2 && s.equipment)}>{index === 1 && item === 'Automatic' ? tx('Auto') : tx(item)}</span>)}</div>{overflow & 1 ? <span aria-hidden="true" {...stylex.props(s.factCue, s.factCueLeft)}/> : null}{overflow & 2 ? <span aria-hidden="true" {...stylex.props(s.factCue, s.factCueRight)}/> : null}</div>
        {benefits.length ? <div {...stylex.props(s.benefits)}><span {...stylex.props(s.benefitLabel)}>{tx('Example benefits')}</span><div {...stylex.props(s.benefitRow)}>{benefits.map(item => <span key={item} {...stylex.props(s.benefitChip)}>{tx(item)}</span>)}</div></div> : null}
      </div>
      {!importListing ? <button type="button" onClick={toggle} aria-pressed={saved} aria-label={tx(saved ? `Remove ${vehicle.make} ${vehicle.model} from saved cars` : `Save ${vehicle.make} ${vehicle.model}`)} {...stylex.props(s.heart, desktopTile && s.tileHeart, saved && s.heartSaved)}><Heart size={22} strokeWidth={1.3} fill={saved ? 'currentColor' : '#fafafa'} /></button> : null}
    </div>
    {finance ? <button type="button" data-finance-car-payment aria-label={`${tx('Estimate payment')}: ${vehicle.year} ${vehicle.make} ${vehicle.model}`} onClick={finance.onCalculate} {...stylex.props(s.financeAction, t.control)}><Calculator size={20} aria-hidden="true"/><span><CurrencyLabel size={16}/>{formatPrice(Math.round(finance.monthly))}{tx('/mo*')}</span><ChevronRight size={18} aria-hidden="true" {...stylex.props(s.financeArrow)}/></button> : null}
    {error ? <p role="alert" {...stylex.props(s.error)}>{tx(error)}</p> : null}
  </article>;
}
export default memo(VehicleCard);

const s = stylex.create({
  card: {position: 'relative', minWidth: 0, overflow: 'hidden', borderColor: '#e7e7ea', borderStyle: 'solid', borderWidth: 1, borderRadius: 17, backgroundColor: '#fff', boxShadow: '0 3px 12px rgba(0,0,0,.035)'},
  main: {position: 'relative', display: 'grid', gridTemplateColumns: {[media.mobile]: '44% minmax(0,1fr)', default: 'minmax(140px,39%) minmax(0,1fr)'}, gap: 10, padding: {[media.mobile]: 10, default: 12}},
  photo: {position: 'relative', alignSelf: 'stretch', display: 'block', overflow: 'hidden', borderRadius: 10},
  tileMain: {gridTemplateColumns: {[media.mobile]: '44% minmax(0,1fr)', [media.desktop]: 'minmax(0,1fr)', default: 'minmax(140px,39%) minmax(0,1fr)'}, gap: {[media.desktop]: 0, default: 10}, padding: {[media.mobile]: 10, [media.desktop]: 0, default: 12}},
  tilePhoto: {aspectRatio: {[media.desktop]: '16 / 9', default: 'auto'}, borderRadius: {[media.desktop]: 0, default: 10}},
  tileInfo: {padding: {[media.desktop]: 12, default: 0}},
  tileText: {paddingRight: {[media.mobile]: 0, [media.desktop]: 0, default: 28}},
  tileTitle: {paddingRight: {[media.mobile]: 0, [media.desktop]: 0, default: 22}, display: {[media.mobile]: 'block', [media.desktop]: 'block', default: '-webkit-box'}, whiteSpace: {[media.mobile]: 'nowrap', [media.desktop]: 'nowrap', default: 'normal'}},
  tileHeart: {top: {[media.desktop]: 10, default: 3}, right: {[media.desktop]: 10, default: 1}, borderWidth: {[media.desktop]: 1, default: 0}, borderStyle: 'solid', borderColor: {[media.desktop]: $.line, default: 'transparent'}, borderRadius: {[media.desktop]: 999, default: 0}, backgroundColor: {[media.desktop]: '#fff', default: 'transparent'}, boxShadow: {[media.desktop]: '0 2px 8px rgba(0,0,0,.08)', default: 'none'}},
  image: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'},
  placeholderImage: {objectFit: 'contain', padding: 14, backgroundColor: '#f0f2f4'},
  placeholderLabel: {position: 'absolute', left: 8, right: 8, bottom: 7, padding: '3px 6px', color: '#555b62', fontSize: 9, fontWeight: 600, lineHeight: '13px', textAlign: 'center', borderRadius: 999, backgroundColor: 'rgba(255,255,255,.94)'},
  rate: {position: 'absolute', left: 0, bottom: 0, maxWidth: '100%', overflow: 'hidden', paddingInline: 6, color: '#fff', fontSize: 12, fontWeight: 500, lineHeight: '18px', whiteSpace: 'nowrap', borderTopRightRadius: 9, backgroundColor: '#b51b72'},
  coming: {backgroundColor: '#676767'},
  originBadge: {position: 'absolute', left: 6, bottom: 6, display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: 'calc(100% - 12px)', padding: '3px 6px', color: $.ink, fontSize: 12, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap', borderRadius: 6, backgroundColor: 'rgba(255,255,255,.96)'},
  importAction: {padding: 0, color: $.ink, borderWidth: 0, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: -2},
  importText: {paddingRight: 0},
  info: {display: 'flex', flexDirection: 'column', minWidth: 0},
  details: {display: 'block', minWidth: 0},
  make: {overflow: 'hidden', paddingRight: {[media.mobile]: 0, default: 28}, color: $.muted, fontSize: 11, fontWeight: 400, lineHeight: '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  title: {overflow: 'hidden', paddingRight: {[media.mobile]: 0, default: 22}, fontSize: {[media.mobile]: 15, default: 16}, fontWeight: 400, lineHeight: '21px', display: {[media.mobile]: 'block', default: '-webkit-box'}, whiteSpace: {[media.mobile]: 'nowrap', default: 'normal'}, textOverflow: 'ellipsis', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'},
  trim: {overflow: 'hidden', marginTop: 1, color: $.muted, fontSize: 13, fontWeight: 400, lineHeight: '18px', whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  priceRow: {display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 5, marginTop: 5},
  price: {display: 'inline-flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1, maxWidth: '100%', fontSize: 20, fontWeight: 700, lineHeight: '26px', letterSpacing: '-.025em'},
  priceOnRequest: {fontSize: 15, fontWeight: 600, lineHeight: '22px', letterSpacing: 0},
  discount: {paddingInline: 4, color: '#008c36', fontSize: 11, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap', borderRadius: 12, backgroundColor: '#effbf1'},
  monthly: {display: 'flex', alignItems: 'center', gap: 4, marginTop: 1, whiteSpace: 'nowrap', lineHeight: '18px'},
  monthlyPrice: {display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 13, fontWeight: 400},
  monthlyNote: {overflow: 'hidden', color: $.muted, fontSize: 12, fontWeight: 400, textOverflow: 'ellipsis'},
  benefits: {marginTop: 6},
  benefitLabel: {display: 'block', marginBottom: 3, color: '#7a8087', fontSize: 8, fontWeight: 700, lineHeight: '11px', letterSpacing: '.04em', textTransform: 'uppercase'},
  benefitRow: {display: 'flex', flexWrap: 'wrap', gap: 3},
  benefitChip: {maxWidth: '100%', padding: '2px 5px', color: '#34383d', fontSize: 9, fontWeight: 600, lineHeight: '13px', overflowWrap: 'anywhere', borderRadius: 8, backgroundColor: '#eef0f2'},
  heart: {position: 'absolute', top: 3, right: 1, display: {[media.mobile]: 'none', default: 'grid'}, placeItems: 'center', width: 44, height: 44, padding: 0, color: '#727272', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  heartSaved: {color: $.ink},
  facts: {position: 'relative', minWidth: 0, marginTop: 8},
  factCue: {display: {[media.mobile]: 'block', default: 'none'}, position: 'absolute', top: 0, bottom: 0, width: 14, pointerEvents: 'none'},
  factCueLeft: {left: 0, backgroundImage: 'linear-gradient(to right, #fff, rgba(255,255,255,0))'},
  factCueRight: {right: 0, backgroundImage: 'linear-gradient(to left, #fff, rgba(255,255,255,0))'},
  meta: {display: {[media.mobile]: 'flex', [media.desktop]: 'flex', default: 'grid'}, flexWrap: {[media.desktop]: 'wrap', default: 'nowrap'}, gridTemplateColumns: 'max-content minmax(0,1fr)', justifyItems: 'start', alignItems: 'stretch', minWidth: 0, maxWidth: '100%', gap: 4, overflowX: {[media.mobile]: 'auto', default: 'visible'}, overscrollBehaviorX: 'contain', scrollbarWidth: 'none'},
  equipment: {gridColumn: '1 / -1'},
  pill: {display: 'flex', alignItems: 'center', flexShrink: 0, minWidth: 0, maxWidth: {[media.mobile]: 'none', default: '100%'}, padding: '3px 4px', color: $.muted, fontSize: {[media.mobile]: 12, default: 11}, fontWeight: 400, lineHeight: '16px', whiteSpace: {[media.mobile]: 'nowrap', default: 'normal'}, overflowWrap: 'normal', borderRadius: 6, backgroundColor: '#f4f4f4'},
  error: {padding: '10px 12px', color: '#b42318', fontSize: 12, lineHeight: 1.4},
  financeAction: {display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 44, padding: '8px 12px', color: $.ink, borderWidth: 0, borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: '#ededee', backgroundColor: {default: '#f7f7f8', ':hover': '#efeff0'}, textAlign: 'left', cursor: 'pointer'},
  financeArrow: {marginLeft: 'auto', flexShrink: 0},
});
