'use client';

import {useId, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeft, ArrowRight, Search, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import FilterPill from '@/components/FilterPill';
import IconButton from '@/components/IconButton';
import {searchField} from '@/components/search-field.stylex';
import {actionButton} from '@/components/action-button.stylex';
import Image from '@/components/AppImage';
import {DealerEnquiryDraft} from '@/components/DealerEnquirySheet';
import {useModal} from '@/components/useModal';
import {useCopy, useLocale} from '@/lib/locale';
import {useHomeAlternative} from '@/lib/home-alternative';
import catalogue from '@/lib/shop-products.json';
import {media, tokens as $} from '@/app/tokens.stylex';

type Product = typeof catalogue.products[number];
const categories = [
  {id: 'all', label: 'All'},
  {id: 'oils', label: 'Oils'},
  {id: 'wheels', label: 'Wheels and tyres'},
  {id: 'lighting', label: 'Lighting'},
  {id: 'brakes', label: 'Brakes'},
  {id: 'accessories', label: 'Accessories'},
] as const;
type Category = typeof categories[number]['id'];
function productPrice(product: Product, locale: string) {
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {style: 'currency', currency: product.currency}).format(product.price);
}

export default function ShopClient() {
  const tx = useCopy(), locale = useLocale();
  const alternative = useHomeAlternative();
  const countId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selection, setSelection] = useState<Product | null>(null);
  const matchingProducts = useMemo(() => catalogue.products.filter(product => [product.title, tx(product.title)].some(title => title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))), [query, tx]);
  const products = matchingProducts.filter(product => category === 'all' || product.category === category);
  return <div data-shop-page {...stylex.props(s.screen)}>
    <PageHeader title="Shop" showBack={alternative} backHref="/more" backLabel="Back to menu" compact action={<FilterPill label="Filters" icon="filter" tone="grey" compact iconOnly count={category === 'all' ? 0 : 1} expanded={filtersOpen} onClick={() => setFiltersOpen(true)}/>}/>
    <main {...stylex.props(s.content)}>
      <label data-search-field {...stylex.props(searchField.field)}><Search size={20} aria-hidden="true" {...stylex.props(searchField.icon)}/><span {...stylex.props(s.searchCopy)}><span {...stylex.props(searchField.inputSlot, s.searchSlot)}><span data-search-measure aria-hidden="true" {...stylex.props(searchField.inputMeasure)}>{query || tx('Search products')}</span><input data-search-input type="search" aria-label={tx('Search products')} aria-describedby={countId} placeholder={tx('Search products')} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(searchField.input, searchField.inlineInput)}/></span><span id={countId} data-shop-result-count role="status" aria-live="polite" aria-atomic="true" {...stylex.props(s.resultCount)}><span aria-hidden="true">({products.length})</span><span className="visually-hidden">{products.length} {tx(products.length === 1 ? 'product' : 'products')}</span></span></span>{query ? <IconButton icon={X} tone="embedded" label={tx('Clear search')} onClick={() => setQuery('')} layout={searchField.clear}/> : null}</label>
      <div role="group" aria-label={tx('Product categories')} {...stylex.props(s.categories)}>{categories.map(option => <FilterPill key={option.id} label={option.label} pressed={category === option.id} compact onClick={() => setCategory(option.id)}/>)}</div>
      {products.length ? <div data-shop-products {...stylex.props(s.grid)}>{products.map(product => <button key={product.id} type="button" aria-haspopup="dialog" aria-label={tx(product.title)} onClick={() => setSelection(product)} {...stylex.props(s.card)}>
        <div {...stylex.props(s.photo)}><Image src={product.image} alt={tx(product.title)} fill sizes="(max-width: 767px) 45vw, 240px" {...stylex.props(s.image)}/></div>
        <h2 {...stylex.props(s.productTitle)}>{tx(product.title)}</h2><strong {...stylex.props(s.price)}>{productPrice(product, locale)}</strong>
      </button>)}</div> : <div {...stylex.props(s.empty)}><p>{tx('No matching products.')}</p><button type="button" onClick={() => {setQuery(''); setCategory('all');}} {...stylex.props(s.secondary, actionButton.secondary)}>{tx('Show all products')}</button></div>}
    </main>
    {selection ? <ProductSheet key={selection.id} product={selection} onClose={() => setSelection(null)}/> : null}
    {filtersOpen ? <ShopFilters category={category} onChange={setCategory} products={matchingProducts} resultCount={products.length} onClose={() => setFiltersOpen(false)}/> : null}
  </div>;
}

function ShopFilters({category, onChange, products, resultCount, onClose}: {category: Category; onChange: (category: Category) => void; products: Product[]; resultCount: number; onClose: () => void}) {
  const tx = useCopy();
  const id = useId();
  const panel = useModal(true, onClose);
  return createPortal(<div {...stylex.props(s.backdrop)} onMouseDown={event => {if (event.target === event.currentTarget) onClose();}}><section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={id} data-shop-filters {...stylex.props(s.sheet, s.filterSheet)}>
    <header {...stylex.props(s.sheetHeader)}><h2 id={id} {...stylex.props(s.sheetTitle)}>{tx('Filters')}</h2><div {...stylex.props(s.close)}><IconButton icon={X} label={tx('Close filters')} onClick={onClose}/></div></header>
    <fieldset {...stylex.props(s.filterOptions)}><legend {...stylex.props(s.filterLegend)}>{tx('Category')}</legend>{categories.map(option => <label key={option.id} {...stylex.props(s.filterOption)}><input type="radio" name={id} value={option.id} checked={category === option.id} onChange={() => onChange(option.id)} {...stylex.props(s.radio)}/><span {...stylex.props(s.filterLabel)}>{tx(option.label)}</span><span {...stylex.props(s.filterCount)}>{products.filter(product => option.id === 'all' || product.category === option.id).length}</span></label>)}</fieldset>
    <footer {...stylex.props(s.filterFooter)}><button type="button" onClick={onClose} {...stylex.props(s.applyFilters)}>{tx('Show products')} ({resultCount})</button></footer>
  </section></div>, document.body);
}

function ProductSheet({product, onClose}: {product: Product; onClose: () => void}) {
  const tx = useCopy(), locale = useLocale();
  const [enquiry, setEnquiry] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const panel = useModal(true, onClose, {onBack: () => {if (!enquiry) return false; setEnquiry(false); return true;}});
  return <div {...stylex.props(s.backdrop)} onMouseDown={event => {if (event.target === event.currentTarget) onClose();}}><section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="shop-product-title" data-shop-product {...stylex.props(s.sheet)}>
    <header {...stylex.props(s.sheetHeader)}>{enquiry ? <IconButton icon={ArrowLeft} label={tx('Back to product')} onClick={() => setEnquiry(false)} layout={s.back}/> : null}<h2 id="shop-product-title" {...stylex.props(s.sheetTitle)}>{tx(enquiry ? 'Product enquiry' : 'Product details')}</h2><IconButton icon={X} label={tx('Close product')} onClick={onClose} layout={s.close}/></header>
    <div {...stylex.props(s.sheetBody)}>
      <div hidden={enquiry}><div {...stylex.props(s.detailPhoto)}><Image src={product.image} alt={tx(product.title)} fill sizes="400px" {...stylex.props(s.image)}/></div><h3 {...stylex.props(s.detailTitle)}>{tx(product.title)}</h3><p {...stylex.props(s.detailPrice)}>{productPrice(product, locale)}</p><button type="button" onClick={() => {setHasDraft(true); setEnquiry(true); panel.current?.focus({preventScroll: true});}} {...stylex.props(s.primary)}>{tx('Ask about this product')}<ArrowRight size={18}/></button></div>
      {hasDraft ? <div hidden={!enquiry}><DealerEnquiryDraft vehicleTitle={`${tx(product.title)} (${productPrice(product, locale)})`}/></div> : null}
    </div>
  </section></div>;
}

const s = stylex.create({
  screen: {minHeight: '100svh', color: $.ink, backgroundColor: $.surface},
  content: {maxWidth: 1040, marginInline: 'auto', padding: '8px 12px 24px'},
  searchCopy: {display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0, gap: 4},
  searchSlot: {minHeight: $.controlHeight},
  resultCount: {flexShrink: 0, color: $.muted, fontSize: 16, fontVariantNumeric: 'tabular-nums', lineHeight: '24px'},
  categories: {display: 'flex', gap: 8, overflowX: 'auto', overscrollBehaviorX: 'contain', scrollbarWidth: 'none', marginTop: 8},
  grid: {display: 'grid', gridTemplateColumns: {[media.mobile]: 'repeat(2,minmax(0,1fr))', default: 'repeat(4,minmax(0,1fr))'}, gap: '20px 12px', marginTop: 12},
  card: {display: 'block', minWidth: 0, padding: 0, borderWidth: 0, color: $.ink, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: 10, outlineOffset: 3},
  photo: {position: 'relative', aspectRatio: '3 / 2', overflow: 'hidden', borderRadius: 10, backgroundColor: $.rail},
  image: {objectFit: 'contain', padding: 12, mixBlendMode: 'multiply'},
  productTitle: {display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 38, marginTop: 6, fontSize: 14, fontWeight: 500, lineHeight: '19px'},
  price: {display: 'block', marginTop: 2, fontSize: 18, fontWeight: 700, lineHeight: '25px'},
  empty: {padding: '40px 12px', textAlign: 'center', color: $.muted},
  secondary: {minHeight: 44, marginTop: 12, padding: '10px 14px', borderWidth: 0, borderRadius: 12, fontFamily: $.fontSans, cursor: 'pointer'},
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {width: '100%', maxWidth: 560, maxHeight: '92dvh', overflowY: 'auto', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, color: $.ink, backgroundColor: '#fff', outlineStyle: 'none'},
  sheetHeader: {display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 44px', alignItems: 'center', gap: 8, padding: '12px 16px'},
  sheetTitle: {gridColumn: "2", gridRow: "1", fontSize: 19, fontWeight: 600, lineHeight: '26px', textAlign: 'center'},
  back: {gridColumn: "1", gridRow: "1"},
  close: {gridColumn: "3", gridRow: "1"},
  sheetBody: {paddingInline: 20},
  detailPhoto: {position: 'relative', height: 180, overflow: 'hidden', borderRadius: 14, backgroundColor: $.rail},
  detailTitle: {marginTop: 16, fontSize: 18, fontWeight: 500, lineHeight: '25px'},
  detailPrice: {marginTop: 8, fontSize: 22, fontWeight: 700, lineHeight: '28px'},
  primary: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', minHeight: 48, marginTop: 20, padding: '10px 12px', borderWidth: 0, borderRadius: 12, color: '#fff', backgroundColor: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 500, cursor: 'pointer'},
  filterSheet: {display: 'flex', flexDirection: 'column', overflowY: 'hidden'},
  filterOptions: {minHeight: 0, overflowY: 'auto', overscrollBehaviorY: 'contain', margin: 0, padding: '0 20px', borderWidth: 0},
  filterLegend: {padding: '0 0 8px', color: $.muted, fontSize: 13, lineHeight: '18px'},
  filterOption: {display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: '10px 12px', color: $.ink, borderRadius: 12, backgroundColor: {default: 'transparent', ':hover': $.surfaceAlt}, outline: {default: 'none', ':focus-within': '2px solid #242428'}, outlineOffset: -2, cursor: 'pointer'},
  radio: {flexShrink: 0, width: 18, height: 18, margin: 0, accentColor: $.ink, cursor: 'pointer'},
  filterLabel: {flexGrow: 1, minWidth: 0, fontSize: 15, lineHeight: '22px'},
  filterCount: {color: $.muted, fontSize: 13, fontVariantNumeric: 'tabular-nums'},
  filterFooter: {flexShrink: 0, padding: '16px 20px 0'},
  applyFilters: {display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 48, padding: '12px 16px', borderWidth: 0, borderRadius: $.radiusPill, color: $.surface, backgroundColor: {default: $.ink, ':hover': $.violetDark}, fontFamily: $.fontSans, fontSize: 15, fontWeight: 500, lineHeight: '22px', cursor: 'pointer'},
});
