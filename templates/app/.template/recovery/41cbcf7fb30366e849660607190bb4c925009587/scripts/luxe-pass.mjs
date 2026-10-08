import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'components', 'InventoryClient.tsx');
let source = await readFile(file, 'utf8');

function mustReplace(from, to, label) {
  if (!source.includes(from)) throw new Error(`Missing ${label}`);
  source = source.replace(from, to);
}

function mustRegex(pattern, to, label) {
  if (!pattern.test(source)) throw new Error(`Missing ${label}`);
  source = source.replace(pattern, to);
}

mustReplace(
`type InventoryClientProps = {
  initialQuery?: string;
  initialBrand?: string;
  initialBody?: string;
  initialOverlay?: 'filters' | 'sort' | null;
  initialOpen?: string | null;
};`,
`type InventoryClientProps = {
  initialQuery?: string;
  initialBrand?: string;
  initialBody?: string;
  initialOverlay?: 'filters' | 'sort' | null;
  initialOpen?: string | null;
  variant?: 'standard' | 'luxe';
};`,
'InventoryClient props',
);

mustReplace(
`  initialOverlay = null,
  initialOpen = null,
}: InventoryClientProps) {
  const normalizedInitialOpen`,
`  initialOverlay = null,
  initialOpen = null,
  variant = 'standard',
}: InventoryClientProps) {
  const luxe = variant === 'luxe';
  const normalizedInitialOpen`,
'InventoryClient variant',
);

mustReplace(
`  const displayCount = hasActiveFilters
    ? Math.max(results.length, Math.round((1644 * results.length) / Math.max(vehicles.length, 1)))
    : 1644;`,
`  const baseCount = luxe ? 195 : 1644;
  const displayCount = hasActiveFilters
    ? Math.max(results.length, Math.round((baseCount * results.length) / Math.max(vehicles.length, 1)))
    : baseCount;`,
'display count',
);

mustRegex(
/      <section \{\.\.\.stylex\.props\(styles\.top\)\}>[\s\S]*?      <\/section>\n\n      <div \{\.\.\.stylex\.props\(styles\.toolbar\)\}>/,
`      <section {...stylex.props(styles.top, luxe && styles.topLuxe)}>
        <div {...stylex.props(styles.topInner, luxe && styles.topInnerLuxe)}>
          {!luxe ? (
            <div {...stylex.props(styles.titleRow)}>
              <Link href="/" aria-label="Back home" {...stylex.props(styles.roundButton)}><ArrowLeft size={22} /></Link>
              <h1 {...stylex.props(styles.title)}>Cars Listing</h1>
              <button type="button" onClick={() => setLoginOpen(true)} aria-label="Saved cars" {...stylex.props(styles.roundButton)}><Heart size={22} /></button>
            </div>
          ) : null}
          <label {...stylex.props(styles.search, luxe && styles.searchLuxe)}>
            <Search size={20} />
            <input
              {...stylex.props(styles.input)}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={luxe ? 'Search Audi' : 'Search Nissan'}
              aria-label="Search cars"
            />
          </label>

          {luxe ? (
            <div {...stylex.props(styles.promoLuxe)}>
              <div {...stylex.props(styles.promoLuxeCopy)}>
                <h2 {...stylex.props(styles.promoLuxeTitle)}>Special interest rate{'\n'}@1.99% p.a.*</h2>
                <p {...stylex.props(styles.promoLuxeText)}>Applicable on all Drive24 cars</p>
                <div {...stylex.props(styles.bankNames)}>
                  <span>Emirates NBD</span><span>Emirates Islamic</span>
                </div>
              </div>
              <img src="/cutouts/premium-suv.png" alt="Premium SUV" {...stylex.props(styles.promoLuxeImage)} />
            </div>
          ) : (
            <div {...stylex.props(styles.promo)}>
              <div {...stylex.props(styles.promoCopy)}>
                <span {...stylex.props(styles.promoEyebrow)}><Sparkles size={12} /> DRIVE24</span>
                <h2 {...stylex.props(styles.promoTitle)}>You can&apos;t know a car in 20 minutes</h2>
                <p {...stylex.props(styles.promoText)}>Take 30 days to see if it feels right.</p>
                <small {...stylex.props(styles.terms)}>*Terms and conditions apply</small>
              </div>
              <div {...stylex.props(styles.returnMark)}><b {...stylex.props(styles.returnNumber)}>30</b><span {...stylex.props(styles.returnCopy)}>DAY<br />RETURN</span></div>
              <img src="/cutouts/hero-suv.png" alt="White SUV" {...stylex.props(styles.promoImage)} />
            </div>
          )}
        </div>
      </section>

      <div {...stylex.props(styles.toolbar)}>`,
'top section',
);

mustReplace(
`        <section {...stylex.props(styles.results)}>
          <div {...stylex.props(styles.resultHeading)}>`,
`        <section {...stylex.props(styles.results)}>
          {luxe ? (
            <section {...stylex.props(styles.luxeBrands)}>
              <h2 {...stylex.props(styles.luxeBrandsTitle)}>Explore by brand</h2>
              <div {...stylex.props(styles.luxeBrandRow)}>
                {[
                  ['Mercedes Benz', '/brands/mercedes.webp'],
                  ['BMW', '/brands/bmw.webp'],
                  ['Audi', '/brands/audi.webp'],
                  ['Nissan', '/brands/toyota.webp'],
                  ['Toyota', '/brands/toyota.webp'],
                ].map(([label, image]) => (
                  <button
                    type="button"
                    key={label}
                    onClick={() => setSelectedBrands(label === 'Mercedes Benz' ? ['Mercedes-Benz'] : label === 'Nissan' ? [] : [label])}
                    {...stylex.props(styles.luxeBrand)}
                  >
                    <span {...stylex.props(styles.luxeBrandCircle)}><img src={image} alt="" /></span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
          <div {...stylex.props(styles.resultHeading)}>`,
'luxe brand row',
);

mustReplace(
`      <button type="button" onClick={() => setLoginOpen(true)} {...stylex.props(styles.loginBar)}>
        <span {...stylex.props(styles.loginIcon)}><SlidersHorizontal size={18} /></span>
        <span {...stylex.props(styles.loginCopy)}><strong {...stylex.props(styles.loginTitle)}>Login for the best deals</strong><small {...stylex.props(styles.loginText)}>Personalised offers and recommendations</small></span>
        <u {...stylex.props(styles.loginLink)}>Login</u>
      </button>
      <button type="button" aria-label="Open Drive24 assistant" {...stylex.props(styles.bot)}><Sparkles size={19} /><small>D24</small></button>
      <a href="https://wa.me/971555555555" aria-label="Chat on WhatsApp" {...stylex.props(styles.chat)}><MessageCircle size={22} /></a>
      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />`,
`      {!luxe ? (
        <>
          <button type="button" onClick={() => setLoginOpen(true)} {...stylex.props(styles.loginBar)}>
            <span {...stylex.props(styles.loginIcon)}><SlidersHorizontal size={18} /></span>
            <span {...stylex.props(styles.loginCopy)}><strong {...stylex.props(styles.loginTitle)}>Login for the best deals</strong><small {...stylex.props(styles.loginText)}>Personalised offers and recommendations</small></span>
            <u {...stylex.props(styles.loginLink)}>Login</u>
          </button>
          <button type="button" aria-label="Open Drive24 assistant" {...stylex.props(styles.bot)}><Sparkles size={19} /><small>D24</small></button>
          <a href="https://wa.me/971555555555" aria-label="Chat on WhatsApp" {...stylex.props(styles.chat)}><MessageCircle size={22} /></a>
        </>
      ) : null}
      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />`,
'luxe bottom controls',
);

mustReplace(
`  screen: { minHeight: '100vh', paddingBottom: { [media.mobile]: 82, default: 60 }, backgroundColor: '#fff' },
  top: { color: '#fff', backgroundColor: $.violet },
  topInner: { width: '100%', maxWidth: $.content, marginInline: 'auto', paddingTop: { [media.mobile]: 'max(72px,env(safe-area-inset-top))', default: 34 }, paddingInline: { [media.mobile]: 12, default: 28 } },`,
`  screen: { minHeight: '100vh', paddingBottom: { [media.mobile]: 82, default: 60 }, backgroundColor: '#fff' },
  top: { color: '#fff', backgroundColor: $.violet },
  topLuxe: { backgroundColor: '#090909' },
  topInner: { width: '100%', maxWidth: $.content, marginInline: 'auto', paddingTop: { [media.mobile]: 'max(72px,env(safe-area-inset-top))', default: 34 }, paddingInline: { [media.mobile]: 12, default: 28 } },
  topInnerLuxe: { paddingTop: { [media.mobile]: 'max(64px,env(safe-area-inset-top))', default: 34 } },`,
'luxe top styles',
);

mustReplace(
`  search: { display: 'flex', alignItems: 'center', gap: 9, marginTop: { [media.mobile]: 13, default: 16 }, minHeight: { [media.mobile]: 40, default: 54 }, paddingInline: { [media.mobile]: 13, default: 16 }, color: $.violet, borderRadius: { [media.mobile]: 10, default: 13 }, backgroundColor: '#fff' },`,
`  search: { display: 'flex', alignItems: 'center', gap: 9, marginTop: { [media.mobile]: 13, default: 16 }, minHeight: { [media.mobile]: 40, default: 54 }, paddingInline: { [media.mobile]: 13, default: 16 }, color: $.violet, borderRadius: { [media.mobile]: 10, default: 13 }, backgroundColor: '#fff' },
  searchLuxe: { marginTop: 0 },`,
'luxe search style',
);

mustReplace(
`  promo: { position: 'relative', overflow: 'hidden', minHeight: { [media.mobile]: 141, default: 280 }, marginTop: { [media.mobile]: 14, default: 14 }, backgroundImage: 'radial-gradient(circle at 78% 20%,rgba(100,255,205,.25),transparent 23%),linear-gradient(130deg,#503aff,#4028f1)' },`,
`  promo: { position: 'relative', overflow: 'hidden', minHeight: { [media.mobile]: 141, default: 280 }, marginTop: { [media.mobile]: 14, default: 14 }, backgroundImage: 'radial-gradient(circle at 78% 20%,rgba(100,255,205,.25),transparent 23%),linear-gradient(130deg,#503aff,#4028f1)' },
  promoLuxe: { position: 'relative', overflow: 'hidden', minHeight: { [media.mobile]: 141, default: 280 }, marginTop: 0, color: '#fff', backgroundColor: '#090909' },
  promoLuxeCopy: { position: 'relative', zIndex: 2, width: { [media.mobile]: '55%', default: '47%' }, paddingTop: { [media.mobile]: 35, default: 62 }, paddingLeft: { [media.mobile]: 2, default: 24 } },
  promoLuxeTitle: { color: '#fff', whiteSpace: 'pre-line', fontSize: { [media.mobile]: 21, default: 37 }, fontWeight: 720, lineHeight: 1.1, letterSpacing: '-.025em' },
  promoLuxeText: { marginTop: 5, color: '#fff', fontSize: { [media.mobile]: 10, default: 15 } },
  bankNames: { display: 'flex', gap: 7, marginTop: 9, color: 'rgba(255,255,255,.72)', fontSize: { [media.mobile]: 7, default: 10 }, fontWeight: 750 },
  promoLuxeImage: { position: 'absolute', right: { [media.mobile]: -37, default: 0 }, bottom: { [media.mobile]: -15, default: -48 }, width: { [media.mobile]: 235, default: 500 }, filter: 'grayscale(1) contrast(1.12) drop-shadow(0 14px 22px rgba(0,0,0,.72))' },`,
'luxe promo styles',
);

mustReplace(
`  results: { minWidth: 0 },`,
`  results: { minWidth: 0 },
  luxeBrands: { marginBottom: { [media.mobile]: 23, default: 32 } },
  luxeBrandsTitle: { marginBottom: 14, color: $.ink, fontSize: { [media.mobile]: 18, default: 25 }, fontWeight: 720 },
  luxeBrandRow: { display: 'flex', gap: { [media.mobile]: 13, default: 18 }, overflowX: 'auto', paddingBottom: 3, scrollbarWidth: 'none' },
  luxeBrand: { display: 'flex', flexShrink: 0, width: { [media.mobile]: 76, default: 98 }, padding: 0, alignItems: 'center', flexDirection: 'column', gap: 7, color: $.ink, fontSize: { [media.mobile]: 12, default: 14 }, textAlign: 'center', borderWidth: 0, backgroundColor: 'transparent', cursor: 'pointer' },
  luxeBrandCircle: { display: 'grid', width: { [media.mobile]: 67, default: 82 }, height: { [media.mobile]: 67, default: 82 }, placeItems: 'center', borderColor: $.line, borderStyle: 'solid', borderWidth: 1, borderRadius: '50%', backgroundColor: '#fff' },
  luxeBrandImage: { width: '62%', height: '62%', objectFit: 'contain' },`,
'luxe brand styles',
);

source = source.replace(
`<span {...stylex.props(styles.luxeBrandCircle)}><img src={image} alt="" /></span>`,
`<span {...stylex.props(styles.luxeBrandCircle)}><img src={image} alt="" {...stylex.props(styles.luxeBrandImage)} /></span>`,
);

await writeFile(file, source, 'utf8');
console.log('Patched InventoryClient luxe variant.');
