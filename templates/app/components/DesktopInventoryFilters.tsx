'use client';

import {useEffect, useRef, useState, type RefObject} from 'react';
import {createPortal} from 'react-dom';
import * as stylex from '@stylexjs/stylex';
import {ChevronDown, Search, X} from 'lucide-react';
import NativeFilterPane from '@/components/NativeFilterPane';
import {emptyFilters, emiOptions, type Filters, type FilterTab} from '@/lib/inventory-filters';
import {currency} from '@/lib/currency';
import {useCopy, useLocale} from '@/lib/locale';
import {searchField} from '@/components/search-field.stylex';
import {desktopHero} from '@/components/desktop-hero.stylex';
import {pillStyles as pill} from '@/components/pill.stylex';
import {media, tokens as $} from '@/app/tokens.stylex';

export type DesktopQuickFilter = {tab: FilterTab; trigger: HTMLButtonElement};
type Props = {filters: Filters; update: (filters: Filters) => void; count: number; onShowResults: () => void; quickFilter: DesktopQuickFilter | null; setQuickFilter: (filter: DesktopQuickFilter | null) => void; quickFiltersRef: RefObject<HTMLElement | null>};
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
function clearSection(filters: Filters, tab: FilterTab): Filters {
  const defaults = emptyFilters();
  if (tab === 'BRAND') return {...filters, brands: [], models: []};
  if (tab === 'MODEL') return {...filters, models: []};
  if (tab === 'BUDGET') return {...filters, budget: [], minimum: defaults.minimum, maximum: defaults.maximum};
  if (tab === 'YEAR') return {...filters, year: '', yearMinimum: defaults.yearMinimum, yearMaximum: defaults.yearMaximum};
  if (tab === 'MILEAGE') return {...filters, mileage: '', mileageMinimum: defaults.mileageMinimum, mileageMaximum: defaults.mileageMaximum};
  if (tab === 'BODY TYPE') return {...filters, bodies: []};
  if (tab === 'FUEL TYPE') return {...filters, fuel: []};
  if (tab === 'TRANSMISSION') return {...filters, extra: {...filters.extra, TRANSMISSION: []}};
  return filters;
}
function selectionLabel(filters: Filters, tab: FilterTab, tx: (value: string) => string = value => value, numberLocale = currency.locale) {
  const defaults = emptyFilters();
  const list = (tab === 'BRAND' ? selectedMakes(filters) : tab === 'MODEL' ? filters.models.map(model => model.split('::').at(-1) || model) : tab === 'BUDGET' ? filters.budget.map(value => budgetLabel(value, numberLocale)) : tab === 'BODY TYPE' ? filters.bodies : tab === 'FUEL TYPE' ? filters.fuel : tab === 'TRANSMISSION' ? filters.extra.TRANSMISSION ?? [] : []).map(value => tx(value));
  if (list.length) return `${list[0]}${list.length > 1 ? ` +${list.length - 1}` : ''}`;
  if (tab === 'BUDGET' && (filters.minimum !== defaults.minimum || filters.maximum !== defaults.maximum)) return filters.minimum === defaults.minimum ? `≤ ${money(filters.maximum, numberLocale)}` : filters.maximum === defaults.maximum ? `≥ ${money(filters.minimum, numberLocale)}` : `${money(filters.minimum, numberLocale)}–${money(filters.maximum, numberLocale)}`;
  if (tab === 'YEAR' && (filters.year || filters.yearMinimum !== defaults.yearMinimum || filters.yearMaximum !== defaults.yearMaximum)) return filters.yearMaximum === defaults.yearMaximum ? `${filters.yearMinimum}+` : `${filters.yearMinimum}–${filters.yearMaximum}`;
  if (tab === 'MILEAGE' && (filters.mileage || filters.mileageMinimum !== defaults.mileageMinimum || filters.mileageMaximum !== defaults.mileageMaximum)) return filters.mileageMinimum ? `${km(filters.mileageMinimum, tx('km'), numberLocale)}–${km(filters.mileageMaximum, tx('km'), numberLocale)}` : `≤ ${km(filters.mileageMaximum, tx('km'), numberLocale)}`;
  return '';
}

/** Desktop Home search shares the catalog's criteria, live count and return state. */
export default function DesktopInventoryFilters({filters, update, count, onShowResults, quickFilter, setQuickFilter, quickFiltersRef}: Props) {
  const tx = useCopy();
  const active = quickFilter?.tab ?? null;
  const [position, setPosition] = useState({left: 0, top: 0, width: 380, maxHeight: 520});
  const navigation = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [budgetDraft, setBudgetDraft] = useState({minimum: '', maximum: ''});
  const defaults = emptyFilters();
  const budgetRange = (draft: typeof budgetDraft) => ({minimum: draft.minimum === '' ? defaults.minimum : Number(draft.minimum), maximum: draft.maximum === '' ? defaults.maximum : Number(draft.maximum)});
  const validBudget = (range: ReturnType<typeof budgetRange>) => Number.isFinite(range.minimum) && Number.isFinite(range.maximum) && range.minimum >= defaults.minimum && range.maximum <= defaults.maximum && range.minimum <= range.maximum;
  const draftValid = validBudget(budgetRange(budgetDraft));
  function setBudget(draft: typeof budgetDraft) {
    setBudgetDraft(draft);
    const range = budgetRange(draft);
    if (validBudget(range)) update({...filters, budget: [], ...range});
  }
  function close(restoreFocus = true) {setQuickFilter(null); if (restoreFocus) quickFilter?.trigger.focus({preventScroll: true});}
  function place(button: HTMLButtonElement, tab: FilterTab) {
    const anchor = button.getBoundingClientRect();
    const shell = button.closest('[data-desktop-shell]')?.getBoundingClientRect();
    const leftEdge = (shell?.left ?? 0) + 16;
    const rightEdge = (shell?.right ?? window.innerWidth) - 16;
    const top = Math.max(82, Math.min(anchor.bottom + 8, window.innerHeight - 220));
    const width = Math.min(tab === 'BRAND' || tab === 'MODEL' ? 620 : 380, rightEdge - leftEdge);
    setPosition({left: Math.max(leftEdge, Math.min(anchor.left, rightEdge - width)), top, width, maxHeight: Math.min(tab === 'BRAND' || tab === 'MODEL' ? 640 : 560, window.innerHeight - top - 16)});
  }
  function open(tab: FilterTab, button: HTMLButtonElement) {
    if (active === tab) {close(); return;}
    if (tab === 'BUDGET') setBudgetDraft({minimum: filters.minimum === defaults.minimum ? '' : String(filters.minimum), maximum: filters.maximum === defaults.maximum ? '' : String(filters.maximum)});
    place(button, tab); setQuickFilter({tab, trigger: button});
  }
  useEffect(() => {
    if (!quickFilter) return;
    const {trigger: button, tab} = quickFilter;
    const dismiss = () => setQuickFilter(null);
    const frame = requestAnimationFrame(() => {place(button, tab); panel.current?.querySelector<HTMLElement>('input,button')?.focus({preventScroll: true});});
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
      cancelAnimationFrame(frame);
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
    const value = selectionLabel(filters, tab, tx);
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
    </div>
    {active ? createPortal(<div ref={panel} id="desktop-quick-filter-panel" data-desktop-filter-popover role="dialog" aria-label={tx(title(active))} style={position} {...stylex.props(s.panel)}>
      <header {...stylex.props(s.heading)}><h2 {...stylex.props(s.title)}>{tx(title(active))}</h2><button type="button" aria-label={tx('Close filters')} onClick={() => close()} {...stylex.props(s.close)}><X size={18} aria-hidden="true"/></button></header>
      <div {...stylex.props(s.pane)}>{active === 'BUDGET' ? <><div {...stylex.props(s.budgetInputs)}>{(['minimum', 'maximum'] as const).map(bound => <label key={bound} {...stylex.props(s.budgetInputLabel)}>{tx(bound === 'minimum' ? 'From' : 'To')}<span {...stylex.props(s.numberField)}><span aria-hidden="true">{currency.symbol}</span><input type="number" inputMode="numeric" min={defaults.minimum} max={defaults.maximum} step={1} value={budgetDraft[bound]} placeholder={tx('Any')} aria-label={`${tx(bound === 'minimum' ? 'From' : 'To')} ${currency.code}`} onChange={event => setBudget({...budgetDraft, [bound]: event.target.value})} {...stylex.props(s.numberInput)}/></span></label>)}</div><div {...stylex.props(s.budgetChoices)}>{[30000, 50000, 70000, 100000].map(maximum => <button type="button" key={maximum} aria-pressed={filters.minimum === defaults.minimum && filters.maximum === maximum && filters.budget.length === 0} onClick={() => setBudget({minimum: '', maximum: String(maximum)})} {...stylex.props(s.shortcut, filters.minimum === defaults.minimum && filters.maximum === maximum && filters.budget.length === 0 && s.shortcutSelected)}>{tx('To')} {money(maximum)}</button>)}</div></> : <NativeFilterPane key={active} active={active} filters={filters} update={update} modelMakes={selectedMakes(filters)}/>}</div>
      <footer {...stylex.props(s.footer)}><button type="button" onClick={() => {if (active === 'BUDGET') setBudgetDraft({minimum: '', maximum: ''}); update(clearSection(filters, active));}} {...stylex.props(s.clear)}>{tx('Clear')}</button><button type="button" disabled={active === 'BUDGET' && !draftValid} onClick={() => close()} {...stylex.props(s.show)}>{tx('Show')} {count} {tx(count === 1 ? 'car' : 'cars')}</button></footer>
    </div>, document.body) : null}
  </>;
}

export function DesktopQuickFilters({filters, quickFilter, setQuickFilter, railRef}: Pick<Props, 'filters' | 'quickFilter' | 'setQuickFilter'> & {railRef: RefObject<HTMLElement | null>}) {
  const tx = useCopy();
  return <nav ref={railRef} data-desktop-quick-filters aria-label={tx('Inventory filters')} {...stylex.props(s.quickFilters)}>{quickTabs.map(tab => {
    const label = tx(title(tab));
    const value = selectionLabel(filters, tab, tx);
    const active = quickFilter?.tab === tab;
    return <button key={tab} type="button" data-quick-filter={tab} title={value ? `${label}: ${value}` : label} aria-label={value ? `${label}: ${value}` : label} aria-haspopup="dialog" aria-expanded={active} aria-controls={active ? 'desktop-quick-filter-panel' : undefined} onClick={event => setQuickFilter(active ? null : {tab, trigger: event.currentTarget})} {...stylex.props(s.quickButton, Boolean(value) && s.quickSelected)}><span {...stylex.props(s.pillLabel)}>{label}{value ? ` · ${value}` : ''}</span><ChevronDown size={14} aria-hidden="true"/></button>;
  })}</nav>;
}

/** Actual chosen values are removable without reopening their category. */
export function DesktopAppliedFilters({filters, update, query, setQuery, mobile = false, emiMax, setEmiMax}: Pick<Props, 'filters' | 'update'> & {query: string; setQuery: (value: string) => void; mobile?: boolean; emiMax?: number; setEmiMax?: (value: number | undefined) => void}) {
  const tx = useCopy();
  const locale = useLocale();
  const numberLocale = mobile ? locale === 'bg' ? 'bg-BG' : 'en-GB' : currency.locale;
  const defaults = emptyFilters();
  const chips: {key: string; label: string; remove: () => void}[] = [];
  if (query.trim()) chips.push({key: 'query', label: `${tx('Search')}: ${query.trim()}`, remove: () => setQuery('')});
  for (const key of ['brands', 'models', 'budget', 'bodies', 'fuel'] as const) for (const value of filters[key]) chips.push({key: `${key}:${value}`, label: key === 'models' ? value.replace('::', ' ') : key === 'budget' ? budgetLabel(value, numberLocale) : tx(value), remove: () => update({...filters, [key]: filters[key].filter(item => item !== value)})});
  for (const tab of ['BUDGET', 'YEAR', 'MILEAGE'] as const) {
    if (tab === 'BUDGET' && filters.minimum === defaults.minimum && filters.maximum === defaults.maximum) continue;
    const value = selectionLabel(filters, tab, tx, numberLocale);
    const label = mobile && tab === 'BUDGET' ? value.replace(/^≤ /, `${tx('Up to')} `).replace(/^≥ /, `${tx('From')} `) : value;
    if (label) chips.push({key: tab, label, remove: () => update(clearSection(filters, tab))});
  }
  for (const [key, values] of Object.entries(filters.extra)) for (const value of values) {
    const payment = mobile && key === 'EMI' ? emiOptions.find(option => option.value === value) : undefined;
    const label = payment ? `${tx('EMI')}: ${tx(payment.relation)} ${money(Number(payment.amount.replace(/\D/g, '')), numberLocale)}` : tx(value);
    chips.push({key: `${key}:${value}`, label, remove: () => update({...filters, extra: {...filters.extra, [key]: values.filter(item => item !== value)}})});
  }
  if (mobile && emiMax !== undefined && setEmiMax) chips.push({key: 'payment-limit', label: `${tx('EMI')}: ≤ ${money(emiMax, numberLocale)}`, remove: () => setEmiMax(undefined)});
  if (filters.emiLimit !== null) chips.push({key: 'emi', label: `${tx('EMI')}: ≤ ${money(filters.emiLimit, numberLocale)}`, remove: () => update({...filters, emiLimit: null})});
  if (filters.engineMinimum !== defaults.engineMinimum || filters.engineMaximum !== defaults.engineMaximum) chips.push({key: 'engine', label: `${tx('Engine')}: ${mobile ? new Intl.NumberFormat(numberLocale).format(filters.engineMinimum) : filters.engineMinimum}–${mobile ? new Intl.NumberFormat(numberLocale).format(filters.engineMaximum) : filters.engineMaximum} L`, remove: () => update({...filters, engineMinimum: defaults.engineMinimum, engineMaximum: defaults.engineMaximum})});
  if (filters.cylinderMinimum !== defaults.cylinderMinimum || filters.cylinderMaximum !== defaults.cylinderMaximum) chips.push({key: 'cylinders', label: `${tx('Number Of Cylinders')}: ${filters.cylinderMinimum}–${filters.cylinderMaximum}`, remove: () => update({...filters, cylinderMinimum: defaults.cylinderMinimum, cylinderMaximum: defaults.cylinderMaximum})});
  function removeMobileChip(button: HTMLButtonElement, remove: () => void) {
    const rail = button.closest('nav');
    const next = button.nextElementSibling instanceof HTMLButtonElement ? button.nextElementSibling : null;
    remove();
    requestAnimationFrame(() => (next?.isConnected ? next : rail?.querySelector<HTMLButtonElement>('button'))?.focus({preventScroll: true}));
  }
  return chips.length ? <div data-desktop-applied-filters={mobile ? undefined : true} data-mobile-applied-filters={mobile || undefined} aria-label={tx('Applied')} {...stylex.props(s.applied, mobile && s.mobileApplied)}>{chips.map(chip => <button type="button" key={chip.key} title={chip.label} aria-label={`${tx('Clear')}: ${chip.label}`} onClick={mobile ? event => removeMobileChip(event.currentTarget, chip.remove) : chip.remove} {...stylex.props(s.chip, mobile && s.mobileChip)}><span {...stylex.props(s.chipLabel)}>{chip.label}</span><X size={14} aria-hidden="true"/></button>)}</div> : null;
}

const s = stylex.create({
  quickFilters: {display: 'flex', alignItems: 'center', flexWrap: 'nowrap', minWidth: 0, gap: 6, overflowX: 'auto', overscrollBehaviorX: 'contain', scrollbarWidth: 'none'},
  quickButton: {display: 'inline-flex', alignItems: 'center', flexShrink: 0, gap: 8, minHeight: 44, maxWidth: 220, paddingInline: 12, color: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 400, borderWidth: 0, borderRadius: 8, backgroundColor: {default: $.surfaceAlt, ':hover': $.line}, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: -2, cursor: 'pointer'},
  quickSelected: {color: '#fff', backgroundColor: {default: $.ink, ':hover': '#3b3b40'}},
  searchForm: {display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr)) auto',backgroundColor:'#fff'},
  caption: {display: 'block', color: $.muted, fontFamily: $.fontSans, fontSize: 12, fontWeight: 400, lineHeight: '16px', textAlign: 'left'},
  captionOnDark: {color:'#e6e6e9'},
  criteriaGroup: {position:'relative',minWidth:0},
  criteriaDivider: {'::before':{content:'""',position:'absolute',left:-4,top:10,bottom:10,width:1,backgroundColor:$.line}},
  criteriaControl: {width:'100%',minWidth:0,fontSize:16,fontWeight:400,outline:{default:'none',':focus-visible':'2px solid #242428'},outlineOffset:-2},
  criteriaSurface: {flexDirection:'column',alignItems:'stretch',justifyContent:'center',width:'100%',minWidth:0,gap:2,borderWidth:0,backgroundColor:{default:$.surfaceAlt,':hover':$.line}},
  criteriaLine: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, width: '100%'},
  searchAction: {display:'grid',placeItems:'center',flexShrink:0,width:44,height:44,padding:0,color:'#fff',borderWidth:0,borderRadius:999,backgroundColor:{default:$.ink,':hover':'#3b3b40'},outline:{default:'none',':focus-visible':'2px solid #242428'},outlineOffset:2,cursor:'pointer'},
  shortcut: {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44, paddingInline: 16, color: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 400, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 999, backgroundColor: {default: '#fff', ':hover': $.surfaceAlt}, cursor: 'pointer'},
  shortcutSelected: {color: '#fff', borderColor: $.ink, backgroundColor: {default: $.ink, ':hover': '#3b3b40'}},
  pillLabel: {minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  budgetInputs: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12},
  budgetInputLabel: {display: 'flex', flexDirection: 'column', gap: 7, color: $.muted, fontSize: {[media.desktop]: $.desktopSupportSize, default: 13}},
  numberField: {display: 'flex', alignItems: 'center', gap: 7, minHeight: 46, paddingInline: 10, color: $.ink, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 10, backgroundColor: '#fff', outline: {default: 'none', ':focus-within': '2px solid #242428'}, outlineOffset: 2},
  numberInput: {width: '100%', minWidth: 0, padding: 0, minHeight: 42, color: $.ink, fontFamily: $.fontSans, fontSize: 16, borderWidth: 0, outlineStyle: 'none', backgroundColor: 'transparent'},
  budgetChoices: {display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 8, marginTop: 18},
  panel: {position: 'fixed', zIndex: 130, display: 'flex', flexDirection: 'column', width: 380, color: $.ink, fontFamily: $.fontSans, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 18, backgroundColor: '#fff', boxShadow: $.shadowStrong, overflow: 'hidden'},
  heading: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexShrink: 0, padding: '12px 16px',},
  title: {fontSize: 17, fontWeight: 500},
  close: {display: 'grid', placeItems: 'center', width: 36, height: 36, padding: 0, color: $.ink, borderWidth: 0, borderRadius: 999, backgroundColor: $.surfaceAlt, cursor: 'pointer'},
  pane: {minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '14px 18px 18px'},
  footer: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexShrink: 0, padding: '6px 16px',},
  clear: {minHeight: 44, paddingInline: 14, color: $.ink, fontSize: 14, borderWidth: 1, borderStyle: 'solid', borderColor: $.line, borderRadius: 999, backgroundColor: $.surface, cursor: 'pointer'},
  show: {minHeight: 44, paddingInline: 16, color: '#fff', fontSize: 14, borderWidth: 0, borderRadius: 999, backgroundColor: $.ink, opacity: {default: 1, ':disabled': .45}, cursor: {default: 'pointer', ':disabled': 'default'}},
  applied: {display: 'flex', flexGrow: 1, minWidth: 0, flexWrap: 'nowrap', alignItems: 'center', gap: 6, overflowX: 'auto', overscrollBehaviorX: 'contain', scrollbarWidth: 'none'},
  mobileApplied: {display: {[media.mobile]: 'contents', default: 'none'}},
  mobileChip: {minHeight: 44, paddingInline: 12, color: '#fff', fontSize: 14, borderRadius: $.radiusPill, backgroundColor: {default: $.ink, ':hover': $.violetDark}, outlineColor: {':focus-visible': '#fff'}},
  chip: {display: 'inline-flex', alignItems: 'center', flexShrink: 0, gap: 6, minHeight: 32, paddingInline: 10, color: $.ink, fontFamily: $.fontSans, fontSize: {[media.desktop]: $.desktopSupportSize, default: 13}, fontWeight: 400, borderWidth: 0, borderRadius: 8, backgroundColor: {default: $.surfaceAlt, ':hover': $.violetSoft}, outline: {default: 'none', ':focus-visible': '2px solid #202024'}, outlineOffset: -2, cursor: 'pointer'},
  chipLabel: {maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
});
