import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const directory = fileURLToPath(new URL('../public/navigation/dock/', import.meta.url));
const source = path.join(directory, 'master.png');
const metadata = await sharp(source).metadata();
if (!metadata.hasAlpha || metadata.width !== metadata.height * 3) {
  throw new Error('Dock master must contain three square cells in one transparent row.');
}

await mkdir(directory, { recursive: true });
const report = [];
for (const [index, name] of ['cars', 'services', 'contact'].entries()) {
  const target = path.join(directory, `${name}.webp`);
  // Slice and resize the generated artwork without repainting its pixels.
  const cell = await sharp(source)
    .extract({
      left: index * metadata.height,
      top: 0,
      width: metadata.height,
      height: metadata.height,
    })
    .png()
    .toBuffer();
  await sharp(cell)
    .trim()
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ lossless: true, effort: 6 })
    .toFile(target);
  report.push({ name, width: 64, height: 64, bytes: (await stat(target)).size });
}
console.log(JSON.stringify(report, null, 2));
