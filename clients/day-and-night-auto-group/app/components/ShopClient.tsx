'use client';

import {useMemo, useState} from 'react';
import {ArrowLeft, ArrowRight, Search, X} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import PageHeader from '@/components/PageHeader';
import Image from '@/components/AppImage';
import {DealerEnquiryDraft} from '@/components/DealerEnquirySheet';
import {useModal} from '@/components/useModal';
import {useCopy, useLocale} from '@/lib/locale';
import catalogue from '@/lib/shop-products.json';
import {media, tokens as $} from '@/app/tokens.stylex';

type Product = typeof catalogue.products[number];
function productPrice(product: Product, locale: string) {
  return new Intl.NumberFormat(locale === 'bg' ? 'bg-BG' : 'en-GB', {style: 'currency', currency: product.currency}).format(product.price);
}

export default function ShopClient() {
  const tx = useCopy(), locale = useLocale();
  const [query, setQuery] = useState('');
  const [selection, setSelection] = useState<Product | null>(null);
  const products = useMemo(() => catalogue.products.filter(product => [product.title, tx(product.title)].some(title => title.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))), [query, tx]);
  return <div data-shop-page {...stylex.props(s.screen)}>
    <PageHeader title="Shop" backHref="/more" backLabel="Back to menu" compact/>
    <main {...stylex.props(s.content)}>
      <label data-search-field {...stylex.props(s.search)}><Search size={20} aria-hidden="true"/><input data-search-input type="search" aria-label={tx('Search products')} placeholder={tx('Search products')} value={query} onChange={event => setQuery(event.target.value)} {...stylex.props(s.searchInput)}/>{query ? <button type="button" aria-label={tx('Clear search')} onClick={() => setQuery('')} {...stylex.props(s.clear)}><X size={18}/></button> : null}</label>
      <p {...stylex.props(s.notice)}>{tx('Example products and prices from the showroom shop. Confirm availability with the dealer.')}</p>
      <p role="status" {...stylex.props(s.count)}>{products.length} {tx(products.length === 1 ? 'product' : 'products')}</p>
      {products.length ? <div data-shop-products {...stylex.props(s.grid)}>{products.map(product => <button key={product.id} type="button" aria-haspopup="dialog" aria-label={tx(product.title)} onClick={() => setSelection(product)} {...stylex.props(s.card)}>
        <div {...stylex.props(s.photo)}><Image src={product.image} alt={tx(product.title)} fill sizes="(max-width: 767px) 45vw, 240px" {...stylex.props(s.image)}/></div>
        <h2 {...stylex.props(s.productTitle)}>{tx(product.title)}</h2><strong {...stylex.props(s.price)}>{productPrice(product, locale)}</strong>
      </button>)}</div> : <div {...stylex.props(s.empty)}><p>{tx('No matching products.')}</p><button type="button" onClick={() => setQuery('')} {...stylex.props(s.secondary)}>{tx('Show all products')}</button></div>}
    </main>
    {selection ? <ProductSheet key={selection.id} product={selection} onClose={() => setSelection(null)}/> : null}
  </div>;
}

function ProductSheet({product, onClose}: {product: Product; onClose: () => void}) {
  const tx = useCopy(), locale = useLocale();
  const [enquiry, setEnquiry] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const panel = useModal(true, onClose, {onBack: () => {if (!enquiry) return false; setEnquiry(false); return true;}});
  return <div {...stylex.props(s.backdrop)} onMouseDown={event => {if (event.target === event.currentTarget) onClose();}}><section ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="shop-product-title" data-shop-product {...stylex.props(s.sheet)}>
    <header {...stylex.props(s.sheetHeader)}>{enquiry ? <button type="button" aria-label={tx('Back to product')} onClick={() => setEnquiry(false)} {...stylex.props(s.icon, s.back)}><ArrowLeft size={20}/></button> : null}<h2 id="shop-product-title" {...stylex.props(s.sheetTitle)}>{tx(enquiry ? 'Product enquiry' : 'Product details')}</h2><button type="button" aria-label={tx('Close product')} onClick={onClose} {...stylex.props(s.icon, s.close)}><X size={21}/></button></header>
    <div {...stylex.props(s.sheetBody)}>
      <div hidden={enquiry}><div {...stylex.props(s.detailPhoto)}><Image src={product.image} alt={tx(product.title)} fill sizes="400px" {...stylex.props(s.image)}/></div><h3 {...stylex.props(s.detailTitle)}>{tx(product.title)}</h3><p {...stylex.props(s.detailPrice)}>{productPrice(product, locale)}</p><p {...stylex.props(s.notice)}>{tx('Example products and prices from the showroom shop. Confirm availability with the dealer.')}</p><button type="button" onClick={() => {setHasDraft(true); setEnquiry(true); panel.current?.focus({preventScroll: true});}} {...stylex.props(s.primary)}>{tx('Ask about this product')}<ArrowRight size={18}/></button></div>
      {hasDraft ? <div hidden={!enquiry}><DealerEnquiryDraft vehicleTitle={`${tx(product.title)} (${productPrice(product, locale)})`}/></div> : null}
    </div>
  </section></div>;
}

const s = stylex.create({
  screen: {minHeight: '100svh', color: $.ink, backgroundColor: '#fff'},
  content: {maxWidth: 1040, marginInline: 'auto', padding: '8px 12px 24px'},
  search: {display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, paddingInline: 12, borderRadius: 999, backgroundColor: $.rail, outline: {default: 'none', ':focus-within': '2px solid #242428'}, outlineOffset: 2},
  searchInput: {flexGrow: 1, minWidth: 0, width: '100%', minHeight: 44, padding: 0, borderWidth: 0, backgroundColor: 'transparent', color: $.ink, fontFamily: $.fontSans, fontSize: 16, outlineStyle: 'none'},
  clear: {display: 'grid', placeItems: 'center', flexShrink: 0, width: 40, height: 44, padding: 0, borderWidth: 0, borderRadius: 999, backgroundColor: 'transparent', color: $.ink, cursor: 'pointer'},
  notice: {marginTop: 12, color: $.muted, fontSize: 12, lineHeight: '18px'},
  count: {marginTop: 16, marginBottom: 12, color: $.muted, fontSize: 12, lineHeight: '18px'},
  grid: {display: 'grid', gridTemplateColumns: {[media.mobile]: 'repeat(2,minmax(0,1fr))', default: 'repeat(4,minmax(0,1fr))'}, gap: '20px 12px'},
  card: {display: 'block', minWidth: 0, padding: 0, borderWidth: 0, color: $.ink, backgroundColor: 'transparent', textAlign: 'left', cursor: 'pointer', borderRadius: 10, outlineOffset: 3},
  photo: {position: 'relative', aspectRatio: '3 / 2', overflow: 'hidden', borderRadius: 10, backgroundColor: $.rail},
  image: {objectFit: 'contain', padding: 12, mixBlendMode: 'multiply'},
  productTitle: {display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 38, marginTop: 6, fontSize: 14, fontWeight: 500, lineHeight: '19px'},
  price: {display: 'block', marginTop: 2, fontSize: 18, fontWeight: 700, lineHeight: '25px'},
  empty: {padding: '40px 12px', textAlign: 'center', color: $.muted},
  secondary: {minHeight: 44, marginTop: 12, padding: '10px 14px', borderWidth: 0, borderRadius: 12, backgroundColor: $.rail, color: $.ink, fontFamily: $.fontSans, cursor: 'pointer'},
  backdrop: {position: 'fixed', inset: 0, zIndex: 250, display: 'flex', alignItems: {[media.mobile]: 'flex-end', default: 'center'}, justifyContent: 'center', padding: {[media.mobile]: 0, default: 24}, backgroundColor: 'rgba(0,0,0,.48)'},
  sheet: {width: '100%', maxWidth: 560, maxHeight: '92dvh', overflowY: 'auto', paddingBottom: 'calc(20px + env(safe-area-inset-bottom))', borderRadius: {[media.mobile]: '24px 24px 0 0', default: 24}, color: $.ink, backgroundColor: '#fff', outlineStyle: 'none'},
  sheetHeader: {display: 'grid', gridTemplateColumns: '44px minmax(0,1fr) 44px', alignItems: 'center', gap: 8, padding: '12px 16px'},
  sheetTitle: {gridColumn: 2, gridRow: 1, fontSize: 19, fontWeight: 600, lineHeight: '26px', textAlign: 'center'},
  icon: {display: 'grid', placeItems: 'center', width: 44, height: 44, padding: 0, borderWidth: 0, borderRadius: 999, backgroundColor: $.rail, color: $.ink, cursor: 'pointer'},
  back: {gridColumn: 1, gridRow: 1},
  close: {gridColumn: 3, gridRow: 1},
  sheetBody: {paddingInline: 20},
  detailPhoto: {position: 'relative', height: 180, overflow: 'hidden', borderRadius: 14, backgroundColor: $.rail},
  detailTitle: {marginTop: 16, fontSize: 18, fontWeight: 500, lineHeight: '25px'},
  detailPrice: {marginTop: 8, fontSize: 22, fontWeight: 700, lineHeight: '28px'},
  primary: {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', minHeight: 48, marginTop: 20, padding: '10px 12px', borderWidth: 0, borderRadius: 12, color: '#fff', backgroundColor: $.ink, fontFamily: $.fontSans, fontSize: 14, fontWeight: 500, cursor: 'pointer'},
});
