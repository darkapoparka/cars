'use client';
import {displayMake, vehicleCardModel} from '@/lib/inventory-labels';
import {hasPublishedMileage, hasPublishedMonthlyPayment, vehicleDiscount} from '@/lib/vehicle-values';
import {memo, useEffect, useRef, useState, type MouseEvent} from 'react';
import Image from '@/components/AppImage';
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
const factKeys: Record<string, string> = {
  '7 seats': 'Seven seats',
  'Boosted Engine': 'Enhanced engine',
  'M Sport package': 'M Sport equipment',
  'Panoramic Roof': 'Panoramic roof',
};
function factOverflow(element: HTMLElement) {
  return (element.scrollLeft > 1 ? 1 : 0) | (element.scrollLeft + element.clientWidth < element.scrollWidth - 1 ? 2 : 0);
}
function VehicleCard({vehicle, showDiscount = false, desktopTile = false, mobileTile = false, mobileFlat = false, imagePriority = false, headingLevel = 3, finance, importListing, onRemoveSaved}: {vehicle: Vehicle; showDiscount?: boolean; desktopTile?: boolean; mobileTile?: boolean; mobileFlat?: boolean; imagePriority?: boolean; headingLevel?: 2 | 3; finance?: {monthly: number; onCalculate: () => void}; importListing?: {country: string; onEnquire: () => void}; onRemoveSaved?: (event: MouseEvent<HTMLButtonElement>) => void}) {
  const tx = useCopy();
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
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
  const discount = vehicleDiscount(vehicle);
  const badge = /coming/i.test(vehicle.badges[0] || '') ? 'Coming soon' : '';
  const href = `/cars/${vehicle.slug}`;
  const benefits = vehicle.proposalBenefits?.slice(0, 2) ?? [];
  const facts = [!hasPublishedMileage(vehicle) ? tx('Mileage on request') : `${formatPrice(vehicle.mileage)} ${tx('km')}`,
    vehicle.specifications || vehicle.transmission,
    vehicle.highlights[0] || (vehicle.fuel !== 'Not published' ? vehicle.fuel : vehicle.body)].filter(Boolean);
  const importAction = `${tx('Import enquiry')}: ${vehicle.year} ${displayMake(vehicle.make)} ${vehicle.model}, ${importListing?.country || ''}`;
  const photo = <>
    <Image src={vehicle.image} alt={vehicle.imagePlaceholder ? tx('Photo unavailable') : tx(`${vehicle.year} ${displayMake(vehicle.make)} ${vehicle.model}`)} fill sizes={desktopTile ? '(max-width: 767px) 44vw, (max-width: 1099px) 25vw, (max-width: 1399px) 28vw, 320px' : '(max-width: 767px) 44vw, 240px'} loading={imagePriority ? 'eager' : 'lazy'} fetchPriority={imagePriority ? 'high' : undefined} {...stylex.props(s.image, vehicle.imagePlaceholder && s.placeholderImage)} />
    {vehicle.imagePlaceholder ? <span {...stylex.props(s.placeholderLabel)}>{tx('Photo unavailable')}</span> : null}
    {importListing ? <span data-import-origin {...stylex.props(s.originBadge)}><Globe2 size={13} aria-hidden="true"/>{importListing.country}</span> : badge ? <span {...stylex.props(s.rate, /coming/i.test(badge) && s.coming)}>{tx(badge)}</span> : null}
  </>;
  const details = <>
    <p data-vehicle-make {...stylex.props(s.make, desktopTile && s.tileText, importListing && s.importText)}>{tx(displayMake(vehicle.make))}</p>
    <Heading title={`${tx(vehicle.year)} ${tx(vehicle.model)}`} {...stylex.props(s.title, desktopTile && s.tileTitle, importListing && s.importText, mobileTile && s.phoneTileTitle)}>{tx(vehicle.year)} {tx(vehicle.model)}</Heading>
    {vehicle.trim ? <p {...stylex.props(s.trim)}>{tx(vehicle.trim)}</p> : null}
    <div {...stylex.props(s.priceRow)}><strong {...stylex.props(s.price, vehicle.priceOnRequest && s.priceOnRequest)}>{vehicle.priceOnRequest ? tx('Price on request') : <><CurrencyLabel size={18} />{tx(formatPrice(vehicle.price))}</>}</strong>{showDiscount && discount > 0 ? <span {...stylex.props(s.discount)}>{tx(formatPrice(discount))} {tx(" OFF")}</span> : null}</div>
    {!finance && hasPublishedMonthlyPayment(vehicle) ? <p {...stylex.props(s.monthly)}><span {...stylex.props(s.monthlyPrice)}><span {...stylex.props(s.srOnly)}><CurrencyLabel size={11}/></span>{tx(formatPrice(vehicle.monthly))}{tx("/mo*")}</span><span {...stylex.props(s.monthlyNote)}>{tx("est.")}</span></p> : null}
  </>;
  return <article aria-label={tx(`${vehicle.year} ${displayMake(vehicle.make)} ${vehicle.model}`)} data-desktop-tile={desktopTile || undefined} data-mobile-tile={mobileTile || undefined} data-price={vehicle.price} data-mileage={vehicle.mileage} data-monthly={vehicle.monthly} {...stylex.props(s.card, mobileFlat && s.mobileFlatCard, mobileTile && s.phoneTileCard)}>
    <div {...stylex.props(s.main, desktopTile && s.tileMain, mobileTile && s.phoneTileMain)}>
      {importListing ? <button type="button" aria-haspopup="dialog" aria-label={importAction} onClick={importListing.onEnquire} {...stylex.props(s.photo,desktopTile && s.tilePhoto,s.importAction)}>{photo}</button> : <Link href={href} aria-label={tx(`View ${vehicle.year} ${displayMake(vehicle.make)} ${vehicle.model}`)} {...stylex.props(s.photo,desktopTile && s.tilePhoto,mobileTile && s.phoneTilePhoto)}>{photo}</Link>}
      <div {...stylex.props(s.info, desktopTile && s.tileInfo, mobileTile && s.phoneTileInfo)}>
        {mobileTile ? <Link href={href} data-compact-vehicle-summary {...stylex.props(s.compactDetails)}>
          <Heading title={`${tx(vehicle.year)} ${tx(displayMake(vehicle.make))} ${tx(vehicle.model)}`} {...stylex.props(s.compactTitle)}>{tx(displayMake(vehicle.make))} {tx(vehicleCardModel(vehicle.make, vehicle.model))}</Heading>
          <p {...stylex.props(s.compactMeta)}>{tx(vehicle.year)} · {hasPublishedMileage(vehicle) ? `${tx(formatPrice(vehicle.mileage))} ${tx('km')}` : tx('Mileage on request')}</p>
          <strong {...stylex.props(s.compactPrice, vehicle.priceOnRequest && s.compactPriceOnRequest)}>{vehicle.priceOnRequest ? tx('Price on request') : <>{tx(formatPrice(vehicle.price))}<CurrencyLabel size={18}/></>}</strong>
        </Link> : null}
        <div {...stylex.props(s.fullInfo, mobileTile && s.phoneExpandedInfo)}>
        {importListing ? <button type="button" data-import-listing-action aria-haspopup="dialog" aria-label={importAction} onClick={importListing.onEnquire} {...stylex.props(s.details,s.importAction)}>{details}</button> : <Link href={href} {...stylex.props(s.details)}>{details}</Link>}
        <div {...stylex.props(s.facts)}><div ref={factRow} data-vehicle-facts role="group" tabIndex={0} aria-label={tx('Specifications')} onScroll={event => setOverflow(factOverflow(event.currentTarget))} {...stylex.props(s.meta, mobileTile && s.phoneTileMeta)}>{facts.map((item, index) => <span key={`${item}-${index}`} title={tx(factKeys[item] || item)} {...stylex.props(s.pill, index === 2 && s.equipment, mobileTile && s.phoneTilePill)}>{factKeys[item] ? <><span title={tx(factKeys[item])} {...stylex.props(s.phoneFact)}>{tx(factKeys[item])}</span><span {...stylex.props(s.wideFact)}>{tx(factKeys[item])}</span></> : index === 1 && item === 'Automatic' ? tx('Auto') : tx(item)}</span>)}</div>{overflow & 1 ? <span aria-hidden="true" {...stylex.props(s.factCue, s.factCueLeft)}/> : null}{overflow & 2 ? <span aria-hidden="true" {...stylex.props(s.factCue, s.factCueRight)}/> : null}</div>
        {benefits.length ? <div {...stylex.props(s.benefits)}><span {...stylex.props(s.benefitLabel)}>{tx('Example benefits')}</span><div data-vehicle-benefits role="group" tabIndex={0} aria-label={tx('Example benefits')} {...stylex.props(s.benefitRow)}>{benefits.map(item => <span key={item} {...stylex.props(s.benefitChip)}>{tx(item)}</span>)}</div></div> : null}
        </div>
      </div>
      {!importListing ? <button type="button" data-saved-remove={onRemoveSaved && saved ? '' : undefined} onClick={onRemoveSaved && saved ? onRemoveSaved : toggle} aria-pressed={saved} aria-label={tx(saved ? `Remove ${displayMake(vehicle.make)} ${vehicle.model} from saved cars` : `Save ${displayMake(vehicle.make)} ${vehicle.model}`)} {...stylex.props(s.heart, desktopTile && s.tileHeart, mobileTile && s.phoneTileHeart, saved && s.heartSaved)}><span {...stylex.props(s.saveIcon, mobileTile && s.phoneSaveIcon)}><Heart size={22} strokeWidth={1.3} fill={saved ? 'currentColor' : '#fafafa'} /></span></button> : null}
    </div>
    {finance ? <button type="button" data-finance-car-payment aria-label={`${tx('Estimate payment')}: ${vehicle.year} ${displayMake(vehicle.make)} ${vehicle.model}`} onClick={finance.onCalculate} {...stylex.props(s.financeAction, t.control)}><Calculator size={20} aria-hidden="true"/><span><CurrencyLabel size={16}/>{formatPrice(Math.round(finance.monthly))}{tx('/mo*')}</span><ChevronRight size={18} aria-hidden="true" {...stylex.props(s.financeArrow)}/></button> : null}
    {error ? <p role="alert" {...stylex.props(s.error)}>{tx(error)}</p> : null}
  </article>;
}
export default memo(VehicleCard);

const s = stylex.create({
  card: {position: 'relative', minWidth: 0, overflow: 'hidden', borderColor: $.surfaceBorder, borderStyle: 'solid', borderWidth: 1, borderRadius: 17, backgroundColor: $.surface, boxShadow: $.shadowSoft},
  mobileFlatCard: {boxShadow: {[media.mobile]: 'none', default: $.shadowSoft}},
  phoneTileCard: {borderWidth: {[media.mobile]: 0, default: 1}, borderRadius: {[media.mobile]: 0, default: 17}, boxShadow: {[media.mobile]: 'none', default: $.shadowSoft}},
  compactDetails: {display: {[media.mobile]: 'block', default: 'none'}, minWidth: 0, paddingTop: 6},
  compactTitle: {overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: 14, fontWeight: 500, lineHeight: '20px'},
  compactMeta: {overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: $.muted, fontSize: 12, lineHeight: '18px'},
  compactPrice: {display: 'inline-flex', alignItems: 'baseline', gap: 2, fontSize: 18, fontWeight: 700, lineHeight: '25px', whiteSpace: 'nowrap'},
  compactPriceOnRequest: {fontSize: 14, whiteSpace: 'normal', lineHeight: '20px'},
  fullInfo: {display: 'contents'},
  phoneExpandedInfo: {display: {[media.mobile]: 'none', default: 'contents'}},
  saveIcon: {display: 'contents'},
  phoneSaveIcon: {display: {[media.mobile]: 'grid', default: 'contents'}, placeItems: 'center', width: 30, height: 30, borderRadius: 999, backgroundColor: '#fff'},
  phoneTileMain: {gridTemplateColumns: {[media.mobile]: 'minmax(0,1fr)', [media.desktop]: 'minmax(0,1fr)', default: 'minmax(140px,39%) minmax(0,1fr)'}, gap: {[media.mobile]: 0, [media.desktop]: 0, default: 10}, padding: {[media.mobile]: 0, [media.desktop]: 0, default: 12}},
  phoneTilePhoto: {aspectRatio: {[media.mobile]: '3 / 2', [media.desktop]: '16 / 9', default: 'auto'}, borderRadius: {[media.mobile]: 10, [media.desktop]: 0, default: 10}},
  phoneTileInfo: {padding: {[media.mobile]: 0, [media.desktop]: 12, default: 0}},
  phoneTileTitle: {display: {[media.mobile]: '-webkit-box', [media.desktop]: 'block', default: '-webkit-box'}, whiteSpace: {[media.mobile]: 'normal', [media.desktop]: 'nowrap', default: 'normal'}, minHeight: {[media.mobile]: 38, default: 'auto'}, fontSize: {[media.mobile]: 14, default: 16}, lineHeight: {[media.mobile]: '19px', [media.desktop]: '24px', default: '21px'}},
  phoneTileMeta: {flexWrap: {[media.mobile]: 'wrap', [media.desktop]: 'wrap', default: 'nowrap'}},
  phoneTilePill: {display: {[media.mobile]: 'block', default: 'flex'}, maxWidth: '100%', overflow: {[media.mobile]: 'hidden', default: 'visible'}, textOverflow: {[media.mobile]: 'ellipsis', default: 'clip'}, fontSize: {[media.mobile]: 11, [media.desktop]: $.desktopLabelSize, default: 11}},
  phoneTileHeart: {display: 'grid', top: {[media.mobile]: 0, [media.desktop]: 10, default: 3}, right: {[media.mobile]: 0, [media.desktop]: 10, default: 1}, borderRadius: {[media.mobile]: 999, [media.desktop]: 999, default: 0}, backgroundColor: {[media.mobile]: 'transparent', [media.desktop]: '#fff', default: 'transparent'}},
  main: {position: 'relative', display: 'grid', gridTemplateColumns: {[media.mobile]: '44% minmax(0,1fr)', default: 'minmax(140px,39%) minmax(0,1fr)'}, gap: {[media.mobile]: 8, default: 10}, padding: {[media.mobile]: 8, default: 12}},
  photo: {position: 'relative', alignSelf: 'stretch', display: 'block', overflow: 'hidden', borderRadius: 10},
  tileMain: {gridTemplateColumns: {[media.mobile]: '44% minmax(0,1fr)', [media.desktop]: 'minmax(0,1fr)', default: 'minmax(140px,39%) minmax(0,1fr)'}, gap: {[media.mobile]: 8, [media.desktop]: 0, default: 10}, padding: {[media.mobile]: 8, [media.desktop]: 0, default: 12}},
  tilePhoto: {aspectRatio: {[media.desktop]: '16 / 9', default: 'auto'}, borderRadius: {[media.desktop]: 0, default: 10}},
  tileInfo: {padding: {[media.desktop]: 12, default: 0}},
  tileText: {paddingRight: {[media.mobile]: 0, [media.desktop]: 0, default: 28}},
  tileTitle: {paddingRight: {[media.mobile]: 0, [media.desktop]: 0, default: 22}, display: {[media.mobile]: 'block', [media.desktop]: 'block', default: '-webkit-box'}, whiteSpace: {[media.mobile]: 'nowrap', [media.desktop]: 'nowrap', default: 'normal'}},
  tileHeart: {top: {[media.desktop]: 10, default: 3}, right: {[media.desktop]: 10, default: 1}, borderWidth: {[media.desktop]: 1, default: 0}, borderStyle: 'solid', borderColor: {[media.desktop]: $.line, default: 'transparent'}, borderRadius: {[media.desktop]: 999, default: 0}, backgroundColor: {[media.desktop]: '#fff', default: 'transparent'}, boxShadow: {[media.desktop]: '0 2px 8px rgba(0,0,0,.08)', default: 'none'}},
  image: {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'},
  placeholderImage: {objectFit: 'contain', padding: 14, backgroundColor: '#f0f2f4'},
  placeholderLabel: {position: 'absolute', left: 8, right: 8, bottom: 7, padding: '3px 6px', color: '#555b62', fontSize: {[media.desktop]: $.desktopLabelSize, default: 9}, fontWeight: 600, lineHeight: {[media.desktop]: '18px', default: '13px'}, textAlign: 'center', borderRadius: 999, backgroundColor: 'rgba(255,255,255,.94)'},
  rate: {position: 'absolute', left: 0, bottom: 0, maxWidth: '100%', overflow: 'hidden', paddingInline: 6, color: '#fff', fontSize: 12, fontWeight: 500, lineHeight: '18px', whiteSpace: 'nowrap', borderTopRightRadius: 9, backgroundColor: '#b51b72'},
  coming: {backgroundColor: '#676767'},
  originBadge: {position: 'absolute', left: 6, bottom: 6, display: 'inline-flex', alignItems: 'center', gap: 4, maxWidth: 'calc(100% - 12px)', padding: '3px 6px', color: $.ink, fontSize: 12, fontWeight: 500, lineHeight: '16px', whiteSpace: 'nowrap', borderRadius: 6, backgroundColor: 'rgba(255,255,255,.96)'},
  importAction: {padding: 0, color: $.ink, borderWidth: 0, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: -2},
  importText: {paddingRight: 0},
  info: {display: 'flex', flexDirection: 'column', minWidth: 0},
  details: {display: 'block', minWidth: 0},
  make: {overflow: 'hidden', paddingRight: {[media.mobile]: 0, default: 28}, color: $.muted, fontSize: {[media.desktop]: $.desktopLabelSize, default: 11}, fontWeight: 400, lineHeight: {[media.desktop]: '18px', default: '14px'}, whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  title: {overflow: 'hidden', paddingRight: {[media.mobile]: 0, default: 22}, fontSize: {[media.mobile]: 15, default: 16}, fontWeight: 400, lineHeight: {[media.desktop]: '24px', default: '21px'}, display: {[media.mobile]: 'block', default: '-webkit-box'}, whiteSpace: {[media.mobile]: 'nowrap', default: 'normal'}, textOverflow: 'ellipsis', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'},
  trim: {overflow: 'hidden', marginTop: 1, color: $.muted, fontSize: {[media.desktop]: $.desktopSupportSize, default: 13}, fontWeight: 400, lineHeight: {[media.desktop]: '20px', default: '18px'}, whiteSpace: 'nowrap', textOverflow: 'ellipsis'},
  priceRow: {display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 5, marginTop: {[media.mobile]: 3, default: 5}},
  price: {display: 'inline-flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 1, maxWidth: '100%', fontSize: {[media.desktop]: 22, default: 20}, fontWeight: 700, lineHeight: {[media.desktop]: '28px', default: '26px'}, letterSpacing: '-.025em'},
  priceOnRequest: {fontSize: {[media.desktop]: $.desktopTextSize, default: 15}, fontWeight: 600, lineHeight: {[media.desktop]: '24px', default: '22px'}, letterSpacing: 0},
  discount: {paddingInline: 4, color: '#008c36', fontSize: {[media.desktop]: $.desktopLabelSize, default: 11}, fontWeight: 500, lineHeight: {[media.desktop]: '18px', default: '16px'}, whiteSpace: 'nowrap', borderRadius: 12, backgroundColor: '#effbf1'},
  monthly: {display: 'flex', alignItems: 'center', gap: 4, marginTop: 1, whiteSpace: 'nowrap', lineHeight: {[media.desktop]: '20px', default: '18px'}},
  monthlyPrice: {display: 'inline-flex', alignItems: 'center', gap: 2, color: $.muted, fontSize: {[media.desktop]: $.desktopSupportSize, default: 13}, fontWeight: 400},
  monthlyNote: {overflow: 'hidden', color: $.muted, fontSize: 12, fontWeight: 400, textOverflow: 'ellipsis'},
  srOnly: {position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap', borderWidth: 0},
  benefits: {marginTop: {[media.mobile]: 4, default: 6}},
  benefitLabel: {display: 'block', marginBottom: 3, color: '#7a8087', fontSize: {[media.desktop]: $.desktopLabelSize, default: 8}, fontWeight: 700, lineHeight: {[media.desktop]: '18px', default: '11px'}, letterSpacing: '.04em', textTransform: 'uppercase'},
  benefitRow: {display: 'flex', flexWrap: {[media.mobile]: 'nowrap', default: 'wrap'}, gap: 3, minWidth: 0, maxWidth: '100%', overflowX: {[media.mobile]: 'auto', default: 'visible'}, overscrollBehaviorX: 'contain', scrollbarWidth: 'none', outline: {default: 'none', ':focus-visible': '2px solid #242428'}, outlineOffset: 2},
  benefitChip: {flexShrink: {[media.mobile]: 0, default: 1}, maxWidth: {[media.mobile]: 'none', default: '100%'}, padding: '2px 5px', color: '#34383d', fontSize: {[media.desktop]: $.desktopLabelSize, default: 9}, fontWeight: 600, lineHeight: {[media.desktop]: '18px', default: '13px'}, whiteSpace: {[media.mobile]: 'nowrap', default: 'normal'}, overflowWrap: {[media.mobile]: 'normal', default: 'anywhere'}, borderRadius: 8, backgroundColor: '#eef0f2'},
  heart: {position: 'absolute', top: 3, right: 1, display: {[media.mobile]: 'none', default: 'grid'}, placeItems: 'center', width: 44, height: 44, padding: 0, color: '#727272', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer'},
  heartSaved: {color: $.ink},
  facts: {position: 'relative', minWidth: 0, marginTop: {[media.mobile]: 4, default: 8}},
  factCue: {display: {[media.mobile]: 'block', [media.desktop]: 'block', default: 'none'}, position: 'absolute', top: 0, bottom: 0, width: 14, pointerEvents: 'none'},
  factCueLeft: {left: 0, backgroundImage: 'linear-gradient(to right, #fff, rgba(255,255,255,0))'},
  factCueRight: {right: 0, backgroundImage: 'linear-gradient(to left, #fff, rgba(255,255,255,0))'},
  meta: {display: {[media.mobile]: 'flex', [media.desktop]: 'flex', default: 'grid'}, flexWrap: {[media.desktop]: 'wrap', default: 'nowrap'}, gridTemplateColumns: 'max-content minmax(0,1fr)', justifyItems: 'start', alignItems: 'stretch', minWidth: 0, maxWidth: '100%', gap: 4, overflowX: {[media.mobile]: 'auto', default: 'visible'}, overscrollBehaviorX: 'contain', scrollbarWidth: 'none'},
  equipment: {gridColumn: '1 / -1'},
  phoneFact: {display: {[media.mobile]: 'inline', default: 'none'}},
  wideFact: {display: {[media.mobile]: 'none', default: 'inline'}},
  pill: {display: 'flex', alignItems: 'center', flexShrink: 0, minWidth: 0, maxWidth: {[media.mobile]: 'none', default: '100%'}, padding: '3px 4px', color: $.muted, fontSize: {[media.mobile]: 12, [media.desktop]: $.desktopLabelSize, default: 11}, fontWeight: 400, lineHeight: {[media.desktop]: '18px', default: '16px'}, whiteSpace: {[media.mobile]: 'nowrap', default: 'normal'}, overflowWrap: {[media.desktop]: 'anywhere', default: 'normal'}, borderRadius: 6, backgroundColor: '#f4f4f4'},
  error: {padding: '10px 12px', color: '#b42318', fontSize: 12, lineHeight: 1.4},
  financeAction: {display: 'flex', alignItems: 'center', gap: 8, width: '100%', minHeight: 44, padding: '8px 12px', color: $.ink, borderWidth: 0, backgroundColor: {default: '#f7f7f8', ':hover': '#efeff0'}, textAlign: 'left', cursor: 'pointer'},
  financeArrow: {marginLeft: 'auto', flexShrink: 0},
});
