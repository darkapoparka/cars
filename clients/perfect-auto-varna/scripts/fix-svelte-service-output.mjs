import fs from 'node:fs';
import path from 'node:path';

// Services namespaces function outputs. The adapter's root destination `/`
// needs an explicit `index` function, and base-mounted prerender overrides must
// refer to the actual files inside static/<base>/.
const output = path.resolve('.vercel/output');
const file = path.join(output, 'config.json');
const config = JSON.parse(fs.readFileSync(file, 'utf8'));
const base = process.argv[2] || '';
for (const route of config.routes) {
  // SvelteKit route.pattern excludes kit.paths.base; Services preserves it.
  if (base && route.src?.startsWith('^') && !route.src.startsWith(`^${base}`)) {
    route.src = `^${base}${route.src.slice(1)}`;
  }
  if (route.dest === '/' && fs.existsSync(path.join(output, 'functions/index.func'))) {
    route.dest = '/index';
  }
}
const staticRoutes = [];
const escaped = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
for (const [relativeFile, override] of Object.entries(config.overrides || {})) {
  const candidates = [relativeFile, `${override.path}.html`, `${override.path}/index.html`];
  const actual = candidates.find(candidate => fs.existsSync(path.join(output, 'static', candidate)));
  if (!actual) throw new Error(`Missing prerendered output for ${override.path}`);
  staticRoutes.push({src:`^/${escaped(override.path)}/?$`,dest:`/${actual}`});
}
config.routes.unshift(...staticRoutes);
config.overrides = {};
fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\n');
console.log(`Prepared Services routes: root function and ${staticRoutes.length} static pages`);
