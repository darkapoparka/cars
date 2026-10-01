import fs from 'node:fs';
import sharp from 'sharp';
function edit(file, from, to) {
  const before = fs.readFileSync(file, 'utf8');
  if (before.split(from).length !== 2) throw Error('Expected one match: ' + file + ' ' + from);
  fs.writeFileSync(file, before.replace(from, to));
}
edit('src/components/DetailScreen.tsx', "financeAction: { flex: 1,", "financeAction: { flex: '1',");
edit('src/components/AssistantEntry.tsx', "    paddingInline: 20,", "    padding: 4,");
edit('src/components/AssistantEntry.tsx', "    borderWidth: 4,", "    borderWidth: 0,");
edit('src/components/AssistantEntry.tsx', "    backgroundImage: 'linear-gradient(#300047,#300047),linear-gradient(110deg,#903fa5,#80a6e6)',\n    backgroundOrigin: 'border-box',\n    backgroundClip: 'padding-box, border-box',", "    backgroundImage: 'linear-gradient(110deg,#903fa5,#80a6e6)',");
edit('src/components/AssistantEntry.tsx', "  compact: { width: 56, padding: 0 },", "  compact: { width: 56 },\n  inner: { height: 48, borderRadius: 13, backgroundColor: '#300047', paddingInline: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%' },\n  compactInner: { padding: 0 },");
edit('src/components/AssistantEntry.tsx', '      <Icon name="sparkles" size={26} />\n      {!compact && \'AI Assistant\'}', '      <span {...stylex.props(s.inner, compact && s.compactInner)}><Icon name="sparkles" size={26} />{!compact && \'AI Assistant\'}</span>');
edit('src/components/HomeScreen.tsx', "    fontWeight: 400,", "    fontWeight: 500,");
edit('src/components/HomeScreen.tsx', "  headline: {\n    fontSize: 24,", "  headline: {\n    fontSize: { default: 24, '@media (max-width: 380px)': 20 },");
edit('src/components/HomeScreen.tsx', "    fontSize: 20,", "    fontSize: { default: 20, '@media (max-width: 380px)': 16 },");
edit('src/components/HomeScreen.tsx', "    gap: 6,\n    fontSize: 16,", "    gap: 6,\n    fontSize: { default: 16, '@media (max-width: 380px)': 12 },");
edit('src/components/SellScreen.tsx', '    fontWeight: 400,', '    fontWeight: 500,');
edit('src/components/SellScreen.tsx', 'lineHeight: \'24px\', marginBottom: 24', 'lineHeight: \'24px\', marginBottom: 20');
const fontPath = 'public/fonts/hero-medium.otf';
if (!fs.existsSync(fontPath)) fs.copyFileSync('reference/android/fonts/sG.otf', fontPath);
const cssPath = 'src/app/globals.css';
fs.appendFileSync(cssPath, "\n@font-face { font-family: 'Mobile Hero'; src: url('/fonts/hero-medium.otf') format('opentype'); font-weight: 500; font-style: normal; font-display: swap; }\n");
// Re-crop the same captured native states used by the side-by-side comparisons.
for (const [file, left, top, width, height, target] of [
  ['08-detail', 0, 348, 1280, 810, 'bmw-x6'],
  ['17-home', 48, 1461, 844, 562, 'bmw-540'],
  ['26-sell', 72, 396, 1136, 568, 'sell-valuation'],
]) {
  await sharp('reference/android/' + file + '.png').extract({ left, top, width, height }).webp({ lossless: true }).toFile('public/images/' + target + '.webp');
}
console.log('Applied measured visual corrections and valid StyleX gradient structure.');
