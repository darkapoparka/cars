'use client';
import {displayMake} from '@/lib/inventory-labels';

import {useDeferredValue, useLayoutEffect, useId, useRef, useState} from 'react';
import * as stylex from '@stylexjs/stylex';
import {ArrowLeft, ChevronRight, Search, X} from 'lucide-react';
import {useCopy} from '@/lib/locale';
import {assetPath} from '@/lib/paths';
import {currency} from '@/lib/currency';
import {formatPrice, vehicles, type Vehicle} from '@/lib/data';
import {emptyFilters, matchesInventory} from '@/lib/inventory-filters';
import {media, tokens as $} from '@/app/tokens.stylex';
import {typography as t} from '@/app/typography.stylex';
import {searchField} from './search-field.stylex';
import FinanceCalculator from './FinanceCalculator';
import {useModal} from './useModal';

// Priced local cars remain selectable inside the illustrative calculator.
const stock = vehicles.filter(car => Number.isFinite(car.price) && car.price > 0 && !car.priceOnRequest && !car.badges.some(badge => /coming soon/i.test(badge)));
const defaultFilters = emptyFilters();

export type FinanceView = 'cars' | 'calculator' | null;

export default function FinanceCalculatorLauncher({view, onViewChange: setView, backNavigation = false, onChooseCar}: {view: FinanceView; onViewChange: (view: FinanceView) => void; backNavigation?: boolean; onChooseCar?: (car: Vehicle | null) => void}) {
  const tx = useCopy(), id = useId();
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [selection, setSelection] = useState<{car: Vehicle | null; version: number}>({car: null, version: 0});
  const input = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const close = () => setView(null);
  const panel = useModal(view !== null, close);
  const results = stock.filter(car => matchesInventory(car, defaultFilters, deferredQuery));

  useLayoutEffect(() => {
    if (!view) return;
    content.current?.scrollTo({top: 0, behavior: 'instant'});
    if (view === 'cars') input.current?.focus({preventScroll: true});
    else panel.current?.focus({preventScroll: true});
  }, [view, panel]);

  function choose(car: Vehicle) {
    if (onChooseCar) {onChooseCar(car); close(); return;}
    setSelection(previous => previous.car?.slug === car.slug ? previous : {car, version: previous.version + 1});
    setView('calculator');
  }
  function chooseCustomPrice() {
    if (onChooseCar) {onChooseCar(null); close(); return;}
    setSelection(previous => previous.car ? {car: null, version: previous.version + 1} : previous);
    setView('calculator');
  }
  return <div hidden={!view} {...stylex.props(s.backdrop, !view && s.hidden)} onMouseDown={event => {if (event.currentTarget === event.target) close();}}>
      <section id={id + '-dialog'} ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={id + '-title'} {...stylex.props(s.sheet)}>
        <header data-finance-step-header {...stylex.props(s.header, backNavigation && s.stepHeader)}>
          {backNavigation ? <button type="button" aria-label={tx(view === 'calculator' ? 'Back to car selection' : 'Back to finance')} onClick={() => view === 'calculator' ? setView('cars') : close()} {...stylex.props(s.close, s.stepBack)}><ArrowLeft size={20} aria-hidden="true"/></button> : null}
          {view === 'cars' ? <button type="button" aria-label={onChooseCar ? tx('Back to your estimate') : `${tx('Back')}: ${tx('Finance calculator')}`} onClick={() => onChooseCar ? close() : setView('calculator')} {...stylex.props(s.close, s.desktopBack)}><ArrowLeft size={18} aria-hidden="true"/></button> : null}
          <h2 id={id + '-title'} {...stylex.props(t.heading, s.desktopTitle, backNavigation && s.stepTitle)}>{tx(view === 'cars' ? 'Choose your car' : 'Finance calculator')}</h2>
          <button type="button" aria-label={tx(view === 'cars' ? 'Close car selection' : 'Close calculator')} onClick={close} {...stylex.props(s.close)}><X size={23} aria-hidden="true"/></button>
        </header>
        <div ref={content} {...stylex.props(s.body)}>
          {view === 'cars' ? <div data-finance-car-picker>
            <div data-search-field role="search" {...stylex.props(searchField.field, s.pickerSearch)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/><input ref={input} data-search-input type="search" aria-label={tx('Search cars')} placeholder={tx('Make or model')} autoComplete="off" autoCapitalize="none" spellCheck={false} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(searchField.input)}/>{query ? <button type="button" aria-label={tx('Clear search')} onClick={() => {setQuery(''); input.current?.focus();}} {...stylex.props(searchField.clear)}><X size={18} aria-hidden="true"/></button> : null}</div>
            <div {...stylex.props(s.pickerMeta)}><p role="status" aria-live="polite" {...stylex.props(s.note, s.resultCount, t.caption)}>{results.length} {tx(results.length === 1 ? 'car' : 'cars')}</p><button type="button" onClick={chooseCustomPrice} {...stylex.props(s.customPrice, t.caption)}>{tx('Enter a price')}<ChevronRight size={16} aria-hidden="true"/></button></div>
            <div aria-busy={query !== deferredQuery} {...stylex.props(s.choices)}>{results.map(car => <button type="button" key={car.slug} data-finance-car-choice aria-label={tx('Choose your car') + ': ' + car.year + ' ' + car.make + ' ' + car.model} onClick={() => choose(car)} {...stylex.props(s.choice)}>
              <img src={assetPath(car.image)} width={88} height={66} loading="lazy" alt="" {...stylex.props(s.choiceImage)}/><span {...stylex.props(s.choiceCopy)}><span {...stylex.props(s.note, t.caption, s.desktopChoiceMeta)}>{tx(displayMake(car.make))} · {car.year}</span><span {...stylex.props(s.model, t.control)}>{car.model}</span><span {...stylex.props(t.body, s.desktopChoicePrice)}>{currency.symbol} {formatPrice(car.price)}</span></span><ChevronRight size={20} aria-hidden="true" {...stylex.props(s.icon)}/>
            </button>)}</div>
            {!results.length ? <p {...stylex.props(s.empty, t.body)}>{tx('No cars match these filters')}</p> : null}
          </div> : null}
          {!onChooseCar ? <div hidden={view !== 'calculator'}>
            <button type="button" aria-label={tx('Change car')} onClick={() => setView('cars')} {...stylex.props(s.selectedCar, t.control)}>{selection.car ? <><img src={assetPath(selection.car.image)} width={64} height={48} alt="" {...stylex.props(s.selectedImage)}/><span {...stylex.props(s.choiceCopy)}><span {...stylex.props(s.model)}>{tx(displayMake(selection.car.make))} {selection.car.model}</span><span {...stylex.props(s.note, t.caption)}>{selection.car.year} · {currency.symbol} {formatPrice(selection.car.price)}</span></span></> : <><Search size={20} aria-hidden="true"/>{tx('Choose your car')}</>}<ChevronRight size={20} aria-hidden="true" {...stylex.props(s.changeIcon)}/></button>
            <FinanceCalculator key={selection.version} initialPrice={selection.car?.price ?? 25000} presentation="dialog"/>
          </div> : null}
        </div>
      </section>
    </div>;
}

const s = stylex.create({
  icon: {flexShrink: 0},
  note: {color: $.muted},
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.58)'},
  hidden: {display: 'none'},
  sheet: {display: 'flex', flexDirection: 'column', width: '100%', maxWidth: {[media.desktop]: 528, default: 560}, maxHeight: {[media.desktop]: 'min(640px, calc(100dvh - 48px))', default: 'calc(100dvh - 24px)'}, color: $.ink, fontFamily: $.fontSans, borderRadius: {[media.mobile]: '24px 24px 0 0', [media.desktop]: 20, default: 24}, backgroundColor: '#fff', outlineStyle: 'none', overflow: 'hidden'},
  header: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: 12, padding: '16px 20px 0'},
  stepHeader: {gap: {[media.mobile]: 8, default: null}, padding: {[media.mobile]: '8px 12px 0', default: null}},
  stepTitle: {flexGrow: {[media.mobile]: 1, [media.desktop]: 1, default: 0}, minWidth: {[media.mobile]: 0, default: null}, fontSize: {[media.mobile]: 18, [media.desktop]: 22, default: 28}, lineHeight: {[media.mobile]: '24px', [media.desktop]: '28px', default: '34px'}},
  stepBack: {display: {[media.mobile]: 'grid', default: 'none'}},
  desktopBack: {display: {[media.desktop]: 'grid', default: 'none'}},
  desktopTitle: {flexGrow: {[media.desktop]: 1, default: 0}, fontSize: {[media.mobile]: 24, [media.desktop]: 22, default: 28}, lineHeight: {[media.mobile]: '28px', [media.desktop]: '28px', default: '34px'}},
  close: {display: 'grid', placeItems: 'center', flexShrink: 0, width: {[media.desktop]: 36, default: 44}, height: {[media.desktop]: 36, default: 44}, padding: 0, color: $.ink, borderWidth: 0, borderRadius: '50%', backgroundColor: '#f2f2f3', cursor: 'pointer'},
  body: {minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', padding: '0 20px calc(20px + env(safe-area-inset-bottom))'},
  pickerSearch: {marginTop: 14, marginBottom: 8},
  pickerMeta: {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  resultCount: {margin: 0},
  customPrice: {display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: 44, padding: '8px 0', color: $.ink, borderWidth: 0, borderRadius: 8, backgroundColor: 'transparent', cursor: 'pointer', outlineOffset: -3},
  choices: {display: 'grid', gap: {[media.desktop]: 8, default: 4}, marginTop: 8},
  choice: {display: 'grid', gridTemplateColumns: {[media.desktop]: '72px minmax(0,1fr) 20px', default: '88px minmax(0,1fr) 20px'}, alignItems: 'center', gap: 12, width: '100%', minHeight: {[media.desktop]: 78, default: 92}, padding: {[media.desktop]: 10, default: '10px 0'}, color: $.ink, textAlign: 'left', borderWidth: 0, borderRadius: {[media.desktop]: 12, default: 8}, backgroundColor: {default: '#fff', ':hover': '#f7f7f8', [media.desktop]: {default: $.surfaceAlt, ':hover': '#ededf0'}}, cursor: 'pointer'},
  choiceImage: {width: {[media.desktop]: 72, default: 88}, height: {[media.desktop]: 54, default: 66}, borderRadius: 8, objectFit: 'cover'},
  choiceCopy: {display: 'grid', gap: 2, minWidth: 0},
  desktopChoiceMeta: {fontSize: {[media.desktop]: 12, default: 14}, lineHeight: {[media.desktop]: '16px', default: '20px'}},
  desktopChoicePrice: {fontSize: {[media.mobile]: 15, [media.desktop]: 14, default: 16}, lineHeight: {[media.mobile]: '22px', [media.desktop]: '20px', default: '24px'}, fontWeight: {[media.desktop]: 600, default: 400}},
  model: {overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'},
  empty: {paddingBlock: 28, color: $.muted},
  selectedCar: {display: 'flex', alignItems: 'center', gap: 12, width: '100%', minHeight: {[media.desktop]: 56, default: 64}, padding: {[media.desktop]: '8px 12px', default: '8px 0'}, marginTop: {[media.desktop]: 12, default: 8}, color: $.ink, textAlign: 'left', borderWidth: 0, borderRadius: {[media.desktop]: 12, default: null}, backgroundColor: {[media.desktop]: $.surfaceAlt, default: '#fff'}, cursor: 'pointer'},
  selectedImage: {flexShrink: 0, width: 64, height: 48, objectFit: 'cover', borderRadius: 8},
  changeIcon: {marginLeft: 'auto', flexShrink: 0},
});
