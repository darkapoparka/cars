// Builds a FINISHED banner preview = plate + logo + text + CTA, written to
// static/_previews so the dev server serves it. Review artifact (delete the
// _previews folder when done). Usage: node scripts/make-banner-preview.mjs
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const PLATE = 'static/assets/eliqauto/codex-generated-v2/cta/cta-import-plate-v2.webp';
const LOGO = 'static/assets/eliqauto/brand/eliqauto-logo-dark.svg';
const OUTDIR = 'static/_previews';
const W = 1900;
mkdirSync(OUTDIR, { recursive: true });

const { data: baseBuf, info } = await sharp(PLATE).resize({ width: W }).toBuffer({ resolveWithObject: true });
const H = info.height;
const s = W / 1600;
const r = (n) => Math.round(n * s);
const logo = await sharp(LOGO).resize({ height: r(42) }).toBuffer();

const F = 'font-family="Segoe UI, Arial, sans-serif"';
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="scrim" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#070d06" stop-opacity="0.86"/>
    <stop offset="0.52" stop-color="#070d06" stop-opacity="0.34"/>
    <stop offset="1" stop-color="#070d06" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
  <rect x="${r(70)}" y="${r(118)}" rx="${r(17)}" ry="${r(17)}" width="${r(196)}" height="${r(34)}" fill="#c9ee4e"/>
  <text x="${r(88)}" y="${r(141)}" ${F} font-size="${r(15)}" font-weight="700" letter-spacing="${r(2)}" fill="#14210f">ВНОС ОТ КАНАДА</text>
  <text x="${r(67)}" y="${r(226)}" ${F} font-size="${r(58)}" font-weight="800" fill="#ffffff">Премиум автомобили</text>
  <text x="${r(67)}" y="${r(292)}" ${F} font-size="${r(58)}" font-weight="800" fill="#c9ee4e">с изрядна история</text>
  <text x="${r(70)}" y="${r(344)}" ${F} font-size="${r(22)}" fill="#e7ece0">Карфакс, сервизна история и личен оглед —</text>
  <text x="${r(70)}" y="${r(376)}" ${F} font-size="${r(22)}" fill="#e7ece0">потвърдени преди да платиш.</text>
  <rect x="${r(70)}" y="${r(416)}" rx="${r(10)}" ry="${r(10)}" width="${r(252)}" height="${r(56)}" fill="#c9ee4e"/>
  <text x="${r(100)}" y="${r(452)}" ${F} font-size="${r(20)}" font-weight="700" fill="#14210f">Виж наличните   →</text>
  <text x="${r(72)}" y="${r(536)}" ${F} font-size="${r(17)}" font-weight="600" fill="#cfe0bf">★ 4.8 · 157 отзива       Карфакс + сервизна история       Оглед в Пловдив</text>
</svg>`;

await sharp(baseBuf)
	.composite([
		{ input: Buffer.from(svg), top: 0, left: 0 },
		{ input: logo, top: r(52), left: r(70) }
	])
	.png()
	.toFile(`${OUTDIR}/promo-banner-demo.png`);
await sharp(`${OUTDIR}/promo-banner-demo.png`).webp({ quality: 86 }).toFile(`${OUTDIR}/promo-banner-demo.webp`);
console.log('wrote', `${OUTDIR}/promo-banner-demo.png`, W + 'x' + H);
