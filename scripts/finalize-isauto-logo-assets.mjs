import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, 'clients', 'isauto-varna');
const generatedRoot = path.join(
  process.env.RUNNER_TEMP ?? path.join(ROOT, 'runtime'),
  'isauto-official-raster-logo'
);
const archiveRoot = path.join(CLIENT, 'assets', 'brand');

await fs.mkdir(archiveRoot, { recursive: true });

for (const mode of ['dark', 'light']) {
  const generated = path.join(generatedRoot, `isauto-logo-${mode}.webp`);
  const archived = path.join(archiveRoot, `isauto-logo-${mode}.webp`);
  await fs.copyFile(generated, archived);
}

const runtimeDerivatives = [
  path.join(CLIENT, 'auto-best', 'static', 'assets', 'images', 'lead', 'isauto', 'logo-dark.webp'),
  path.join(CLIENT, 'auto-best', 'static', 'assets', 'images', 'lead', 'isauto', 'logo-light.webp'),
  path.join(CLIENT, 'modern', 'apps', 'web', 'public', 'isauto', 'logo-dark.webp'),
  path.join(CLIENT, 'modern', 'apps', 'web', 'public', 'isauto', 'logo-light.webp'),
  path.join(CLIENT, 'carwow', 'static', 'brand', 'isauto-logo-dark.webp'),
  path.join(CLIENT, 'carwow', 'static', 'brand', 'isauto-logo-light.webp')
];
for (const target of runtimeDerivatives) {
  await fs.rm(target, { force: true });
}

const provenancePath = path.join(CLIENT, 'assets', 'provenance.json');
const provenance = JSON.parse(await fs.readFile(provenancePath, 'utf8'));
provenance.brand = {
  ...(provenance.brand ?? {}),
  implementation: 'Official IS AUTO raster identity cleaned into transparent dark/light PNG runtime masters. WebP derivatives are preserved under clients/isauto-varna/assets/brand. No SVG dealer logo is used at runtime.',
  webpDerivatives: [
    'assets/brand/isauto-logo-dark.webp',
    'assets/brand/isauto-logo-light.webp'
  ]
};
await fs.writeFile(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');

for (const target of runtimeDerivatives) {
  try {
    await fs.access(target);
    throw new Error(`Unused runtime logo derivative remains: ${target}`);
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('IS AUTO WebP logo derivatives archived outside runtime; transparent PNG remains the live logo.');

// Rebuild trigger: run after correcting the final Auto Best company writer.
