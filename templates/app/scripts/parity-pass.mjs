import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function exact(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Missing ${label}`);
  return source.replace(from, to);
}

function regex(source, pattern, to, label) {
  if (!pattern.test(source)) throw new Error(`Missing ${label}`);
  return source.replace(pattern, to);
}

async function patch(relative, transform) {
  const file = path.join(root, relative);
  const before = await readFile(file, 'utf8');
  const after = transform(before);
  if (before === after) throw new Error(`No changes for ${relative}`);
  await writeFile(file, after, 'utf8');
  console.log(`patched ${relative}`);
}

await patch('app/page.tsx', (input) => {
  let source = input;
  source = regex(source, /const serviceTabs = \[[\s\S]*?\] as const;/, `const serviceTabs = [
  { label: 'Buy Car', title: 'Buy\\nCar', href: '/', image: '/cutouts/compact-suv.png', photo: false },
  { label: 'Sell Car', title: 'Sell\\nCar', href: '/sell', image: '/cutouts/premium-suv.png', photo: false },
  { label: 'Get Loans', title: 'Get\\nLoans', href: '/finance', image: '/services/finance.webp', photo: true },
  { label: 'Car Service', title: 'Car\\nService', href: '/service', image: '/services/sell.png', photo: true },
] as const;`, 'home service tabs');
  source = regex(
    source,
    /<Link key=\{tab\.label\} href=\{tab\.href\} \{\.\.\.stylex\.props\(styles\.serviceTab, index === 0 && styles\.serviceTabActive\)\}>\s*\{tab\.label\}\s*<\/Link>/,
    `<Link key={tab.label} href={tab.href} aria-label={tab.label} {...stylex.props(styles.serviceTab, index === 0 && styles.serviceTabActive)}>
                  <span {...stylex.props(styles.serviceLabel)}>{tab.title}</span>
                  <img src={tab.image} alt="" {...stylex.props(styles.serviceImage, tab.photo && styles.serviceImagePhoto)} />
                </Link>`,
    'home service tab markup',
  );
  source = exact(source, 'vehicles.slice(0, 4)', 'vehicles.slice(0, 1)', 'home recent vehicles');
  source = regex(source, /  serviceTabs: \{[^\n]+\},/, `  serviceTabs: { display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: { [media.mobile]: 10, default: 14 } },`, 'home tab grid style');
  source = regex(source, /  serviceTab: \{[^\n]+\},/, `  serviceTab: { display: 'block', position: 'relative', overflow: 'hidden', minHeight: { [media.mobile]: 88, default: 106 }, paddingTop: { [media.mobile]: 10, default: 14 }, paddingRight: 6, paddingBottom: 7, paddingLeft: { [media.mobile]: 10, default: 14 }, color: '#fff', fontSize: { [media.mobile]: 18, default: 22 }, fontWeight: 750, lineHeight: 1.02, textAlign: 'left', borderColor: 'rgba(255,255,255,.34)', borderStyle: 'solid', borderWidth: 1, borderRadius: { [media.mobile]: 13, default: 18 }, backgroundColor: 'rgba(255,255,255,.06)' },`, 'home tab style');
  source = regex(source, /  serviceTabActive: \{[^\n]+\},/, `  serviceTabActive: { color: $.violet, backgroundColor: '#fff', borderColor: '#fff' },
  serviceLabel: { position: 'relative', zIndex: 2, whiteSpace: 'pre-line' },
  serviceImage: { position: 'absolute', right: -10, bottom: -6, zIndex: 1, width: { [media.mobile]: 76, default: 96 }, height: { [media.mobile]: 57, default: 72 }, objectFit: 'contain', filter: 'drop-shadow(0 5px 7px rgba(8,4,62,.22))' },
  serviceImagePhoto: { right: -4, bottom: -4, width: { [media.mobile]: 66, default: 82 }, height: { [media.mobile]: 62, default: 76 }, objectFit: 'cover', objectPosition: '54% 50%', borderTopLeftRadius: 42, opacity: .94 },`, 'home active tab style');
  source = exact(source, "top: { [media.mobile]: 174, [media.desktop]: 72, default: 0 }", "top: { [media.mobile]: 214, [media.desktop]: 72, default: 0 }", 'home sticky filter offset');
  source = exact(source, "sectionTitle: { color: $.text, fontSize: { [media.mobile]: 23, default: 31 }", "sectionTitle: { color: $.text, fontSize: { [media.mobile]: 20, default: 31 }", 'home section title size');
  source = exact(source, "borderRadius: 13, backgroundColor: '#fff' },\n  brandLogo", "borderRadius: '50%', backgroundColor: '#fff' },\n  brandLogo", 'home brand circles');
  return source;
});

await patch('components/AppShell.tsx', (input) => {
  let source = input;
  source = exact(source, "{ href: '/cars', label: 'Stores', icon: Store }", "{ href: '/stores', label: 'Stores', icon: Store }", 'stores nav route');
  source = exact(
    source,
    "const active = index === 0 ? pathname === '/' || pathname === '/sell' || pathname === '/finance' || pathname === '/service' : index === 3 ? pathname.startsWith('/more') : false;",
    "const active = index === 0 ? pathname === '/' || pathname === '/sell' || pathname === '/finance' || pathname === '/service' : index === 1 ? pathname.startsWith('/stores') : index === 2 ? pathname.startsWith('/luxe') : pathname.startsWith('/more');",
    'bottom nav active state',
  );
  return source;
});

await patch('app/tokens.stylex.ts', (input) =>
  exact(
    input,
    `fontSans: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"`,
    `fontSans: "Roboto, Arial, Helvetica, sans-serif"`,
    'font stack',
  ),
);

await patch('components/InventoryClient.tsx', (input) => {
  let source = input;
  source = regex(
    source,
    /(  const filterState: FilterState = \{[\s\S]*?\n  \};)\n\n  function pushOverlay/,
    `$1

  const hasActiveFilters = Boolean(
    query.trim()
      || selectedBrands.length
      || selectedFuel.length
      || selectedBodies.length
      || selectedBudget.length
      || selectedYear
      || selectedMileage
      || Object.values(genericSelections).some((items) => items.length),
  );
  const displayCount = hasActiveFilters
    ? Math.max(results.length, Math.round((1644 * results.length) / Math.max(vehicles.length, 1)))
    : 1644;

  function pushOverlay`,
    'inventory display count',
  );
  source = exact(source, '{results.length} Used Cars in UAE', '{displayCount} Used Cars in UAE', 'inventory heading count');
  source = exact(source, 'count={results.length}', 'count={displayCount}', 'inventory filter count');
  source = exact(
    source,
    `      <a href="https://wa.me/971555555555" aria-label="Chat on WhatsApp" {...stylex.props(styles.chat)}><MessageCircle size={22} /></a>`,
    `      <button type="button" aria-label="Open Drive24 assistant" {...stylex.props(styles.bot)}><Sparkles size={19} /><small>D24</small></button>
      <a href="https://wa.me/971555555555" aria-label="Chat on WhatsApp" {...stylex.props(styles.chat)}><MessageCircle size={22} /></a>`,
    'inventory assistant bubble',
  );
  source = exact(source, '<ChevronDown size={18} /> : null}</label>;', '<ChevronDown size={18} {...stylex.props(styles.optionChevron)} /> : null}</label>;', 'filter option chevrons');
  source = exact(source, "title: { fontSize: { [media.mobile]: 20, default: 31 }, fontWeight: 750", "title: { fontSize: { [media.mobile]: 18, default: 31 }, fontWeight: 720", 'inventory title style');
  source = exact(source, "resultTitle: { fontSize: { [media.mobile]: 14, default: 18 }, fontWeight: 800", "resultTitle: { fontSize: { [media.mobile]: 14, default: 18 }, fontWeight: 720", 'inventory result heading style');
  source = exact(source, "filterClose: { display: 'grid', width: 31, height: 31, placeItems: 'center', color: $.ink", "filterClose: { display: 'grid', width: 31, height: 31, placeItems: 'center', color: $.orange", 'filter close color');
  source = exact(source, "filterTitle: { fontSize: 24, fontWeight: 800 }", "filterTitle: { fontSize: 20, fontWeight: 750 }", 'filter title style');
  source = exact(source, "radioRow: { gridTemplateColumns: '27px 1fr' },", "radioRow: { gridTemplateColumns: '27px 1fr' },\n  optionChevron: { color: $.orange },", 'filter chevron style');
  source = exact(
    source,
    "  chat: { display: 'grid', position: 'fixed', right: 17, bottom: { [media.mobile]: 92, default: 24 }",
    "  bot: { display: { [media.mobile]: 'flex', default: 'none' }, alignItems: 'center', justifyContent: 'center', position: 'fixed', right: 18, bottom: 148, zIndex: 66, width: 48, height: 48, flexDirection: 'column', color: $.blue, fontSize: 7, fontWeight: 900, borderColor: '#67d9f2', borderStyle: 'solid', borderWidth: 2, borderRadius: '50%', backgroundColor: '#dffaff', boxShadow: $.shadowStrong, cursor: 'pointer' },\n  chat: { display: 'grid', position: 'fixed', right: 17, bottom: { [media.mobile]: 92, default: 24 }",
    'inventory bot style',
  );
  return source;
});

await patch('components/VehicleCard.tsx', (input) => {
  let source = input;
  source = exact(source, "borderRadius: { [media.mobile]: 7, default: 20 }", "borderRadius: { [media.mobile]: 15, default: 20 }", 'vehicle card radius');
  source = exact(source, "fontWeight: 800,\n    lineHeight: { [media.mobile]: '20px'", "fontWeight: 650,\n    lineHeight: { [media.mobile]: '20px'", 'vehicle title weight');
  source = exact(source, "fontWeight: 850, lineHeight: { [media.mobile]: '20px'", "fontWeight: 720, lineHeight: { [media.mobile]: '20px'", 'vehicle price weight');
  source = exact(source, "fontWeight: 750, lineHeight: { [media.mobile]: '15px'", "fontWeight: 650, lineHeight: { [media.mobile]: '15px'", 'vehicle monthly weight');
  return source;
});

await patch('components/FeatureLanding.tsx', (input) => {
  let source = input;
  source = regex(source, /const tabs = \[[\s\S]*?\] as const;/, `const tabs = [
  { label: 'Buy car', title: 'Buy\\nCar', href: '/', kind: 'buy', image: '/cutouts/compact-suv.png', photo: false },
  { label: 'Sell car', title: 'Sell\\nCar', href: '/sell', kind: 'sell', image: '/cutouts/premium-suv.png', photo: false },
  { label: 'Loans', title: 'Get\\nLoans', href: '/finance', kind: 'finance', image: '/services/finance.webp', photo: true },
  { label: 'Service', title: 'Car\\nService', href: '/service', kind: 'service', image: '/services/sell.png', photo: true },
] as const;`, 'feature tabs');
  source = regex(
    source,
    /\{tabs\.map\(\(tab\) => <Link key=\{tab\.label\} href=\{tab\.href\} \{\.\.\.stylex\.props\(styles\.tab, tab\.kind === kind && styles\.tabActive\)\}>\{tab\.label\}<\/Link>\)\}/,
    `{tabs.map((tab) => (
              <Link key={tab.label} href={tab.href} aria-label={tab.label} {...stylex.props(styles.tab, tab.kind === kind && styles.tabActive)}>
                <span {...stylex.props(styles.tabLabel)}>{tab.title}</span>
                <img src={tab.image} alt="" {...stylex.props(styles.tabImage, tab.photo && styles.tabImagePhoto)} />
              </Link>
            ))}`,
    'feature tab markup',
  );
  source = exact(source, "paddingTop: { [media.mobile]: 'max(26px,env(safe-area-inset-top))'", "paddingTop: { [media.mobile]: 'max(60px,env(safe-area-inset-top))'", 'feature safe area');
  source = regex(source, /  tabs: \{[^\n]+\},/, `  tabs: { display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 10 },`, 'feature tab grid');
  source = regex(source, /  tab: \{[^\n]+\},/, `  tab: { display: 'block', position: 'relative', overflow: 'hidden', minHeight: { [media.mobile]: 88, default: 106 }, paddingTop: { [media.mobile]: 10, default: 14 }, paddingRight: 6, paddingBottom: 7, paddingLeft: { [media.mobile]: 10, default: 14 }, color: '#fff', fontSize: { [media.mobile]: 18, default: 22 }, fontWeight: 750, lineHeight: 1.02, textAlign: 'left', borderColor: 'rgba(255,255,255,.34)', borderStyle: 'solid', borderWidth: 1, borderRadius: { [media.mobile]: 13, default: 18 }, backgroundColor: 'rgba(255,255,255,.06)' },`, 'feature tab style');
  source = regex(source, /  tabActive: \{[^\n]+\},/, `  tabActive: { color: $.violet, borderColor: '#fff', backgroundColor: '#fff' },
  tabLabel: { position: 'relative', zIndex: 2, whiteSpace: 'pre-line' },
  tabImage: { position: 'absolute', right: -10, bottom: -6, zIndex: 1, width: { [media.mobile]: 76, default: 96 }, height: { [media.mobile]: 57, default: 72 }, objectFit: 'contain', filter: 'drop-shadow(0 5px 7px rgba(8,4,62,.22))' },
  tabImagePhoto: { right: -4, bottom: -4, width: { [media.mobile]: 66, default: 82 }, height: { [media.mobile]: 62, default: 76 }, objectFit: 'cover', objectPosition: '54% 50%', borderTopLeftRadius: 42, opacity: .94 },`, 'feature active tab style');
  return source;
});

console.log('Parity pass complete.');
