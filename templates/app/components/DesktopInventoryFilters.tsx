'use client';
import {displayMake, displayModelSelection} from '@/lib/inventory-labels';

import {useLayoutEffect, useRef, useState, type RefObject} from 'react';
import {createPortal} from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown, Search, SlidersHorizontal, X} from 'lucide-react';
import NativeFilterPane from '@/components/NativeFilterPane';
import {clearDesktopFilter, desktopBodyValue, desktopCollectionTitles, toggleDesktopBody} from '@/lib/desktop-filter-ui';
import {emptyFilters, emiOptions, type Filters, type FilterTab} from '@/lib/inventory-filters';
import {currency} from '@/lib/currency';
import {useCopy, useLocale} from '@/lib/locale';
import {searchField} from '@/components/search-field.stylex';
import {desktopHero} from '@/components/desktop-hero.stylex';
import {pillStyles as pill} from '@/components/pill.stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

export type DesktopQuickFilter = {tab: FilterTab; trigger: HTMLButtonElement};
type Props = {filters: Filters; update: (filters: Filters) => void; count: number; countMatches?: (filters: Filters) => number; onShowResults: () => void; onAllFilters: () => void; quickFilter: DesktopQuickFilter | null; setQuickFilter: (filter: DesktopQuickFilter | null) => void; quickFiltersRef: RefObject<HTMLElement | null>};
const money = (value: number, numberLocale = currency.locale) => `${currency.symbol}${new Intl.NumberFormat(numberLocale).format(value)}`;
const km = (value: number, unit: string, numberLocale = currency.locale) => `${new Intl.NumberFormat(numberLocale).format(value)} ${unit}`;
const title = (tab: FilterTab) => tab === 'BODY TYPE' ? 'Type' : tab === 'BRAND' ? 'Make' : tab === 'FUEL TYPE' ? 'Fuel' : tab === 'TRANSMISSION' ? 'Gearbox' : tab.toLowerCase().replace(/(^|\s)\S/g, letter => letter.toUpperCase());
const searchTabs: FilterTab[] = ['BRAND', 'MODEL', 'BUDGET'];
const quickTabs: FilterTab[] = ['BODY TYPE', 'YEAR', 'MILEAGE', 'FUEL TYPE', 'TRANSMISSION'];
const selectedMakes = (filters: Filters) => [...new Set([...filters.brands, ...filters.models.map(model => model.split('::')[0])])];
function budgetLabel(value: string, numberLocale = currency.locale) {
  const amount = Number(value.match(/([\d,]+)K?$/)?.[1].replaceAll(',', '')) * (value.endsWith('K') ? 1000 : 1);
  return Number.isFinite(amount) && amount ? `${value.startsWith('Above') ? '>' : '<'} ${money(amount, numberLocale)}` : value;
}
function selectionLabel(filters: Filters, tab: FilterTab, tx: (value: string) => string = value => value, numberLocale = currency.locale) {
  const defaults = emptyFilters();
  const list = (tab === 'BRAND' ? selectedMakes(filters).map(displayMake) : tab === 'MODEL' ? filters.models.map(model => model.split('::').at(-1) || model) : tab === 'BUDGET' ? filters.budget.map(value => budgetLabel(value, numberLocale)) : tab === 'BODY TYPE' ? filters.bodies : tab === 'FUEL TYPE' ? filters.fuel : tab === 'TRANSMISSION' ? filters.extra.TRANSMISSION ?? [] : []).map(value => tx(value));
  if (list.length) return `${list[0]}${list.length > 1 ? ` +${list.length - 1}` : ''}`;
  if (tab === 'BUDGET' && (filters.minimum !== defaults.minimum || filters.maximum !== defaults.maximum)) return filters.minimum === defaults.minimum ? `≤ ${money(filters.maximum, numberLocale)}` : filters.maximum === defaults.maximum ? `≥ ${money(filters.minimum, numberLocale)}` : `${money(filters.minimum, numberLocale)}–${money(filters.maximum, numberLocale)}`;
  if (tab === 'YEAR' && (filters.year || filters.yearMinimum !== defaults.yearMinimum || filters.yearMaximum !== defaults.yearMaximum)) return filters.yearMaximum === defaults.yearMaximum ? `${filters.yearMinimum}+` : `${filters.yearMinimum}–${filters.yearMaximum}`;
  if (tab === 'MILEAGE' && (filters.mileage || filters.mileageMinimum !== defaults.mileageMinimum || filters.mileageMaximum !== defaults.mileageMaximum)) return filters.mileageMinimum ? `${km(filters.mileageMinimum, tx('km'), numberLocale)}–${km(filters.mileageMaximum, tx('km'), numberLocale)}` : `≤ ${km(filters.mileageMaximum, tx('km'), numberLocale)}`;
  return '';
}

/** Desktop Home search shares the catalog's criteria, live count and return state. */
export default function DesktopInventoryFilters({filters, update, count, countMatches, onShowResults, onAllFilters, quickFilter, setQuickFilter, quickFiltersRef}: Props) {
  const tx = useCopy();
  const locale = useLocale();
  const active = quickFilter?.tab ?? null;
  const [position, setPosition] = useState({left: 0, top: 0, width: 380, maxHeight: 520});
  const navigation = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [paneRevision, setPaneRevision] = useState(0);
  function close(restoreFocus = true) {setQuickFilter(null); if (restoreFocus) quickFilter?.trigger.focus({preventScroll: true});}
  function place(button: HTMLButtonElement, tab: FilterTab) {
    const anchor = button.getBoundingClientRect();
    const shell = button.closest('[data-desktop-shell]')?.getBoundingClientRect();
    const leftEdge = (shell?.left ?? 0) + 16;
    const rightEdge = (shell?.right ?? window.innerWidth) - 16;
    const wide = tab === 'BRAND' || tab === 'MODEL';
    const searchBox = wide ? button.closest('[data-desktop-buy-search]')?.getBoundingClientRect() : undefined;
    const below = (searchBox ?? anchor).bottom + 8;
    const top = window.innerHeight - below - 16 < 280 ? 82 : below;
    const width = Math.min(searchBox?.width ?? (wide ? 620 : 380), rightEdge - leftEdge);
    setPosition({left: Math.max(leftEdge, Math.min(searchBox?.left ?? anchor.left, rightEdge - width)), top, width, maxHeight: Math.min(wide ? 640 : 560, window.innerHeight - top - 16)});
  }
  function open(tab: FilterTab, button: HTMLButtonElement) {
    if (active === tab) {close(); return;}
    place(button, tab); setQuickFilter({tab, trigger: button});
  }
  useLayoutEffect(() => {
    if (!quickFilter) return;
    const {trigger: button, tab} = quickFilter;
    const dismiss = () => setQuickFilter(null);
    const fields = panel.current?.querySelectorAll<HTMLElement>('input:not(:disabled),select:not(:disabled)');
    const firstField = [...(fields ?? [])].find(field => field.getClientRects().length > 0 && getComputedStyle(field).visibility !== 'hidden');
    (firstField ?? panel.current?.querySelector<HTMLElement>('button:not(:disabled)'))?.focus({preventScroll: true});
    function outside(event: PointerEvent | FocusEvent) {
      if (event.target instanceof Node && !navigation.current?.contains(event.target) && !quickFiltersRef.current?.contains(event.target) && !panel.current?.contains(event.target)) dismiss();
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') {event.preventDefault(); dismiss(); button.focus({preventScroll: true});}
    }
    function move() {
      if (!button || window.innerWidth < 1100 || button.getBoundingClientRect().bottom < 82) {dismiss(); return;}
      place(button, tab);
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    window.addEventListener('resize', move);
    window.addEventListener('scroll', move, {passive: true});
    window.addEventListener('popstate', dismiss);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
      window.removeEventListener('resize', move);
      window.removeEventListener('scroll', move);
      window.removeEventListener('popstate', dismiss);
    };
  }, [quickFilter, setQuickFilter, quickFiltersRef]);
  function criterion(tab: FilterTab) {
    const label = tx(title(tab));
    const value = selectionLabel(filters, tab, tx, locale === 'bg' ? 'bg-BG' : 'en-GB');
    const placeholder = tx(tab === 'BRAND' ? 'All brands' : tab === 'MODEL' ? 'All models' : 'Any');
    const description = `${label}: ${value || placeholder}`;
    const selected = Boolean(value);
    return <div key={tab} {...stylex.props(s.criteriaGroup, tab !== 'BRAND' && s.criteriaDivider)}><button type="button" data-quick-filter={tab} title={description} aria-label={description} aria-haspopup="dialog" aria-expanded={active === tab} aria-controls={active === tab ? 'desktop-quick-filter-panel' : undefined} onClick={event => open(tab, event.currentTarget)} {...stylex.props(pill.control, s.criteriaControl, desktopHero.cell, selected && pill.selectedControl)}><span {...stylex.props(pill.surface, s.criteriaSurface, desktopHero.cell, desktopHero.field, selected && pill.selected)}><span {...stylex.props(s.caption, selected && s.captionOnDark)}>{label}</span><span {...stylex.props(s.criteriaLine)}><span {...stylex.props(s.pillLabel)}>{value || placeholder}</span><ChevronDown size={14} aria-hidden="true"/></span></span></button></div>;
  }
  return <>
    <div ref={navigation}>
      <form data-desktop-buy-search role="search" onSubmit={event => {event.preventDefault(); close(false); onShowResults();}} {...stylex.props(searchField.field, s.searchForm, desktopHero.bar)}>
        {searchTabs.map(tab => criterion(tab))}
        <button type="submit" data-desktop-search-action title={tx('Search cars')} aria-label={`${tx('Find cars')} · ${count} ${tx(count === 1 ? 'car' : 'cars')}`} {...stylex.props(s.searchAction, desktopHero.cell, desktopHero.iconButton)}><Search size={20} strokeWidth={2} aria-hidden="true"/></button>
      </form>
      <div data-desktop-hero-filters {...stylex.props(s.heroFilters)}>
        <button type="button" data-desktop-all-filters aria-haspopup="dialog" onClick={onAllFilters} {...stylex.props(pill.control, s.quickButton)}><span {...stylex.props(pill.surface, s.quickSurface)}><SlidersHorizontal size={16} aria-hidden="true"/>{tx('All filters')}</span></button>
        <DesktopQuickFilters filters={filters} quickFilter={quickFilter} onOpen={open} railRef={quickFiltersRef}/>
      </div>
    </div>
    {active ? createPortal(<div ref={panel} id="desktop-quick-filter-panel" data-desktop-filter-popover role="dialog" aria-label={tx(title(active))} style={position} {...stylex.props(s.panel)}>
      <header {...stylex.props(s.heading)}><h2 {...stylex.props(s.title)}>{tx(title(active))}</h2><button type="button" aria-label={tx('Close filters')} onClick={() => close()} {...stylex.props(s.close)}><X size={18} aria-hidden="true"/></button></header>
      <div {...stylex.props(s.pane)}><NativeFilterPane key={`${active}:${paneRevision}`} active={active} filters={filters} update={update} countMatches={countMatches} modelMakes={selectedMakes(filters)} wide/></div>
      <footer {...stylex.props(s.footer)}><button type="button" onClick={() => {setPaneRevision(revision => revision + 1); update(clearDesktopFilter(filters, active));}} {...stylex.props(s.clear)}>{tx('Clear')}</button><button type="button" onClick={() => {const invalid = panel.current?.querySelector<HTMLInputElement>('input[aria-invalid="true"]'); if (invalid) {invalid.focus({preventScroll: true}); return;} close();}} {...stylex.props(s.show)}>{tx('Show')} {count} {tx(count === 1 ? 'car' : 'cars')}</button></footer>
    </div>, document.body) : null}
  </>;
}

export function DesktopQuickFilters({filters, quickFilter, onOpen, railRef}: Pick<Props, 'filters' | 'quickFilter'> & {onOpen: (tab: FilterTab, trigger: HTMLButtonElement) => void; railRef: RefObject<HTMLElement | null>}) {
  const tx = useCopy();
  const locale = useLocale();
  return <nav ref={railRef} data-desktop-quick-filters aria-label={tx('Inventory filters')} {...stylex.props(s.quickFilters)}>{quickTabs.map(tab => {
    const label = tx(title(tab));
    const value = selectionLabel(filters, tab, tx, locale === 'bg' ? 'bg-BG' : 'en-GB');
    const active = quickFilter?.tab === tab;
    return <button key={tab} type="button" data-quick-filter={tab} title={value ? `${label}: ${value}` : label} aria-label={value ? `${label}: ${value}` : label} aria-haspopup="dialog" aria-expanded={active} aria-controls={active ? 'desktop-quick-filter-panel' : undefined} onClick={event => onOpen(tab, event.currentTarget)} {...stylex.props(pill.control, s.quickButton, (Boolean(value) || active) && pill.selectedControl)}><span {...stylex.props(pill.surface, s.quickSurface, (Boolean(value) || active) && pill.selected, (Boolean(value) || active) && s.quickSurfaceSelected)}><span {...stylex.props(s.pillLabel)}>{label}{value ? ` · ${value}` : ''}</span><ChevronDown size={14} aria-hidden="true"/></span></button>;
  })}</nav>;
}

/** Actual chosen values are removable without reopening their category. */
export function DesktopAppliedFilters({filters, update, query, setQuery, mobile = false, compact = false, emiMax, setEmiMax}: Pick<Props, 'filters' | 'update'> & {query: string; setQuery: (value: string) => void; mobile?: boolean; compact?: boolean; emiMax?: number; setEmiMax?: (value: number | undefined) => void}) {
  const tx = useCopy();
  const locale = useLocale();
  const numberLocale = locale === 'bg' ? 'bg-BG' : 'en-GB';
  const defaults = emptyFilters();
  const chips: {key: string; label: string; remove: () => void}[] = [];
  if (query.trim()) chips.push({key: 'query', label: `${tx('Search')}: ${query.trim()}`, remove: () => setQuery('')});
  for (const key of ['brands', 'models', 'budget', 'bodies', 'fuel'] as const) {
    const values = key === 'bodies' && !mobile ? [...new Set(filters.bodies.map(desktopBodyValue))] : filters[key];
    for (const value of values) chips.push({key: `${key}:${value}`, label: key === 'models' ? displayModelSelection(value) : key === 'brands' ? tx(displayMake(value)) : key === 'budget' ? budgetLabel(value, numberLocale) : tx(value), remove: () => update(key === 'bodies' && !mobile ? toggleDesktopBody(filters, value) : {...filters, [key]: filters[key].filter(item => item !== value)})});
  }
  for (const tab of ['BUDGET', 'YEAR', 'MILEAGE'] as const) {
    if (tab === 'BUDGET' && filters.minimum === defaults.minimum && filters.maximum === defaults.maximum) continue;
    const value = selectionLabel(filters, tab, tx, numberLocale);
    const label = mobile && tab === 'BUDGET' ? value.replace(/^≤ /, `${tx('Up to')} `).replace(/^≥ /, `${tx('From')} `) : value;
    if (label) chips.push({key: tab, label, remove: () => update(clearDesktopFilter(filters, tab))});
  }
  for (const [key, values] of Object.entries(filters.extra)) for (const value of values) {
    const payment = key === 'EMI' ? emiOptions.find(option => option.value === value) : undefined;
    const label = payment ? `${tx(mobile ? 'EMI' : 'Monthly payment')}: ${tx(payment.relation)} ${money(Number(payment.amount.replace(/\D/g, '')), numberLocale)}` : !mobile && key === 'CAR TYPE' ? tx(desktopCollectionTitles[value] ?? value) : !mobile && key === 'CATEGORIES' && value === 'Hot deals' ? tx('Filter: Hot deals') : tx(value);
    chips.push({key: `${key}:${value}`, label, remove: () => update({...filters, extra: {...filters.extra, [key]: values.filter(item => item !== value)}})});
  }
  if (emiMax !== undefined && setEmiMax) chips.push({key: 'payment-limit', label: `${tx(mobile ? 'EMI' : 'Monthly payment')}: ≤ ${money(emiMax, numberLocale)}`, remove: () => setEmiMax(undefined)});
  if (filters.emiLimit !== null) chips.push({key: 'emi', label: `${tx(mobile ? 'EMI' : 'Monthly payment')}: ≤ ${money(filters.emiLimit, numberLocale)}`, remove: () => update({...filters, emiLimit: null})});
  if (filters.engineMinimum !== defaults.engineMinimum || filters.engineMaximum !== defaults.engineMaximum) chips.push({key: 'engine', label: `${tx('Engine')}: ${new Intl.NumberFormat(numberLocale).format(filters.engineMinimum)}–${new Intl.NumberFormat(numberLocale).format(filters.engineMaximum)} L`, remove: () => update({...filters, engineMinimum: defaults.engineMinimum, engineMaximum: defaults.engineMaximum})});
  if (filters.cylinderMinimum !== defaults.cylinderMinimum || filters.cylinderMaximum !== defaults.cylinderMaximum) chips.push({key: 'cylinders', label: `${tx('Number Of Cylinders')}: ${filters.cylinderMinimum}–${filters.cylinderMaximum}`, remove: () => update({...filters, cylinderMinimum: defaults.cylinderMinimum, cylinderMaximum: defaults.cylinderMaximum})});
  function removeMobileChip(button: HTMLButtonElement, remove: () => void) {
    const rail = button.closest('nav');
    const next = button.nextElementSibling instanceof HTMLButtonElement ? button.nextElementSibling : null;
    remove();
    requestAnimationFrame(() => (next?.isConnected ? next : rail?.querySelector<HTMLButtonElement>('button'))?.focus({preventScroll: true}));
  }
  function removeCompactChip(button: HTMLButtonElement, remove: () => void) {
    const sibling = button.nextElementSibling ?? button.previousElementSibling;
    const closeButton = button.closest('[role="dialog"]')?.querySelector<HTMLButtonElement>('header button');
    remove();
    requestAnimationFrame(() => (sibling instanceof HTMLButtonElement && sibling.isConnected ? sibling : closeButton)?.focus({preventScroll: true}));
  }
  return chips.length ? <div data-desktop-applied-filters={mobile ? undefined : true} data-mobile-applied-filters={mobile || undefined} aria-label={tx('Applied')} {...stylex.props(s.applied, mobile && s.mobileApplied)}>{chips.map(chip => {
    const content = <><span {...stylex.props(s.chipLabel)}>{chip.label}</span><X size={14} aria-hidden="true"/></>;
    return <button type="button" key={chip.key} title={chip.label} aria-label={`${tx('Clear')}: ${chip.label}`} onClick={mobile ? event => removeMobileChip(event.currentTarget, chip.remove) : compact ? event => removeCompactChip(event.currentTarget, chip.remove) : chip.remove} {...stylex.props(pill.control, mobile && pill.selectedControl, !mobile && s.desktopChip)}><span {...stylex.props(pill.surface, pill.soft, mobile && pill.selected, !mobile && s.chipSurface, !mobile && compact && pill.selected, !mobile && compact && s.compactChipSurface)}>{content}</span></button>;
  })}</div> : null;
}

const s = stylex.create({
  heroFilters: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, maxWidth: '100%', overflowX: 'auto', overscrollBehaviorX: 'contain', scrollbarWidth: 'none'},
  quickFilters: {display: 'flex', alignItems: 'center', flexWrap: 'nowrap', minWidth: 0, gap: 6, overflowX: 'auto', overscrollBehaviorX: 'contain', scrollbarWidth: 'none'},
  quickButton: {maxWidth: 220, fontSize: 14, fontWeight: 400, outline: {default: 'none', ':focus-visible': '2px solid #fff'}, outlineOffset: -2},
  quickSurface: {minWidth: 0, maxWidth: '100%', paddingInline: 12, fontSize: 14, fontWeight: 400},
  quickSurfaceSelected: {borderColor: '#fff'},
  searchForm: {display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr)) auto',backgroundColor:'#fff'},
  caption: {display: 'block', color: $.muted, fontFamily: $.fontSans, fontSize: 12, fontWeight: 400, lineHeight: '16px', textAlign: 'left'},
  captionOnDark: {color:'#e6e6e9'},
  criteriaGroup: {position:'relative',minWidth:0},
  criteriaDivider: {'::before':{content:'""',position:'absolute',left:-4,top:10,bottom:10,width:1,backgroundColor:$.line}},
  criteriaControl: {width:'100%',minWidth:0,fontSize:16,fontWeight:400,outline:{default:'none',':focus-visible':'2px solid #242428'},outlineOffset:-2},
  criteriaSurface: {flexDirection:'column',alignItems:'stretch',justifyContent:'center',width:'100%',minWidth:0,gap:2,borderWidth:0,backgroundColor:{default:$.surfaceAlt,':hover':$.line}},
  criteriaLine: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%'},
  searchAction: {display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:'#fff',borderWidth:0,borderRadius:999,backgroundColor:{default:$.ink,':hover':'#3b3b40'},outline:{default:'none',':focus-visible':'2px solid #242428'},outlineOffset:2,cursor:'pointer'},
  pillLabel: {minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  panel: {position: 'fixed', zIndex: 130, display: 'flex', flexDirection: 'column', width: 380, color: $.ink, fontFamily: $.fontSans, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 18, backgroundColor: '#fff', boxShadow: $.shadowStrong, overflow: 'hidden'},
  heading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0, padding: '12px 18px', borderBottomWidth: 1, borderBottomStyle: 'solid', borderBottomColor: $.line},
  title: {fontSize: 17, fontWeight: 500},
  close: {display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, color: $.ink, borderWidth: 0, borderRadius: 999, backgroundColor: $.surfaceAlt, cursor: 'pointer'},
  pane: {minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '14px 18px 18px'},
  footer: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0, padding: '10px 18px', borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: $.line},
  clear: {minHeight: 44, paddingInline: 14, color: $.ink, fontSize: $.desktopTextSize, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 999, backgroundColor: $.surface, cursor: 'pointer'},
  show: {minHeight: 44, paddingInline: 16, color: '#fff', fontSize: $.desktopTextSize, borderWidth: 0, borderRadius: 999, backgroundColor: $.ink, opacity: {default: 1, ':disabled': .45}, cursor: {default: 'pointer', ':disabled': 'default'}},
  applied: {display: 'flex', flexGrow: 1, minWidth: 0, flexWrap: 'nowrap', alignItems: 'center', gap: 6, overflowX: 'auto', overscrollBehaviorX: 'contain', scrollbarWidth: 'none'},
  desktopChip: {fontSize: $.desktopSupportSize, fontWeight: $.desktopTextWeight, lineHeight: $.desktopSupportLineHeight, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: -2},
  chipSurface: {paddingInline: 12, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}},
  compactChipSurface: {minHeight: 28, paddingInline: 10, fontSize: $.desktopSupportSize, lineHeight: $.desktopSupportLineHeight, gap: 4},
  mobileApplied: {display: {[media.mobile]: 'contents', default: 'none'}},
  chipLabel: {maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
});
