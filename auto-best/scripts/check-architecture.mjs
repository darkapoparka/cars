import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const appRoots = ['src'];
const configurationFiles = ['svelte.config.js'];
const retiredArchitecturePaths = [
  'mirror',
  'server.mjs',
  path.join('src', 'routes', '[...legacy]', '+page.svelte'),
  path.join('src', 'routes', '[...legacy]', '+page.ts')
];
const forbidden = [
  ['DOMParser', 'Runtime DOM parsing is forbidden in the native SvelteKit application.'],
  ['MutationObserver', 'MutationObserver-based composition is forbidden in the native SvelteKit application.'],
  ['cloneNode(', 'Template cloning is forbidden in the native SvelteKit application.'],
  ['document.querySelector', 'Global selector-driven application behavior is forbidden on native routes.'],
  ['document.createElement', 'Imperative document composition is forbidden on native routes.'],
  ['{@html', 'Raw HTML injection is forbidden in the native SvelteKit application.'],
  ["fetch('/home04'", 'Template-page fetching is forbidden in the native SvelteKit application.'],
  ['best-home.js', 'The legacy homepage composer must never be loaded by native routes.'],
  ['best-home.css', 'The legacy homepage skin must never be loaded by native routes.'],
  ['day-night-header-bootstrap.js', 'The legacy header bootstrap must never be loaded by native routes.'],
  ['day-night-site.js', 'The legacy mutation runtime must never be loaded by native routes.'],
  ['day-night-desktop.js', 'The legacy desktop mutation runtime must never be loaded by native routes.'],
  ['day-night-site.css', 'The legacy global skin must never be loaded by native routes.'],
  ['day-night-desktop.css', 'The legacy desktop skin must never be loaded by native routes.'],
  ['/_next/static/css/', 'Mirrored framework CSS must never be loaded by native routes.'],
  ['legacy-pages', 'Legacy HTML snapshots must never be served by the native application.'],
  ['mirror/public', 'The retired mirror must never be configured as application assets.'],
  ['reloadForCompatibility', 'Compatibility reload behavior must not return after native migration.'],
  ['best-home-', 'Retired homepage compatibility classes must not return to native source.'],
  ['tf-top-bar', 'The retired template top-bar class must not return to native source.'],
  ['tf-icon-box', 'The retired template action-card class must not return to native source.'],
  ['day-night-header-action', 'Retired header compatibility classes must not return to native source.'],
  ['day-night-mega-', 'Retired mega-menu compatibility classes must not return to native source.'],
  ['box-car-list', 'The retired template vehicle-card class must not return to native source.'],
  ['hv-one', 'The retired template vehicle-card variant must not return to native source.'],
  ['hover-img', 'The retired template image-hover class must not return to native source.'],
  ['partner-item', 'The retired template partner-card class must not return to native source.'],
  ['blog-article-item', 'The retired template editorial-card class must not return to native source.'],
  ['section-icon-list', 'The retired template action-grid class must not return to native source.'],
  ['btn-button', 'The retired template button class must not return to native source.'],
  ['image-group', 'The retired template vehicle-media class must not return to native source.'],
  ['flag-tag', 'The retired template vehicle-badge class must not return to native source.'],
  ['img-style', 'The retired template image-wrapper class must not return to native source.'],
  ['day-night-card-media', 'The retired vehicle-media compatibility class must not return to native source.'],
  ['text-address', 'The retired template vehicle-category class must not return to native source.'],
  ['link-style-1', 'The retired template vehicle-title class must not return to native source.'],
  ['day-night-card-price', 'The retired vehicle-price compatibility class must not return to native source.'],
  ['container2', 'The retired template container class must not return to native source.'],
  ['autodeal-automotive', 'The retired template icon-family marker must not return to native source.']
];

const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (/\.(svelte|ts|js|css|html)$/.test(entry.name)) files.push(absolute);
  }
}
for (const relative of appRoots) await walk(path.join(root, relative));
for (const relative of configurationFiles) files.push(path.join(root, relative));

const errors = [];
for (const relative of retiredArchitecturePaths) {
  try {
    await access(path.join(root, relative));
    errors.push(`${relative}: retired compatibility architecture must not exist.`);
  } catch {
    // Absence is the required final state.
  }
}

for (const file of files) {
  const relative = path.relative(root, file);
  const source = await readFile(file, 'utf8');
  for (const [needle, message] of forbidden) {
    if (source.includes(needle)) errors.push(`${relative}: ${message}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`Architecture check passed across ${files.length} native application/configuration files.`);
