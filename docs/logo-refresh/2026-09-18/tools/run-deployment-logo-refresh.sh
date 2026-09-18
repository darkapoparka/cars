#!/usr/bin/env bash
set -euo pipefail

: "${CARS_LOGO_SHARP_ROOT:?CARS_LOGO_SHARP_ROOT is required}"
: "${DEALER_SLUG:?DEALER_SLUG is required}"
: "${IDENTITY_STRATEGY:?IDENTITY_STRATEGY is required}"

TOOL_SCRIPT="${TOOL_SCRIPT:-$RUNNER_TEMP/refresh-deployment-repo.mjs}"
node "$TOOL_SCRIPT"

node --input-type=module <<'NODE'
import fs from 'node:fs/promises';
import path from 'node:path';

const roots = [
  ['auto-best/src', 'auto-best'],
  ['modern/packages', 'modern'],
  ['modern/apps/web', 'modern']
];
async function walk(dir, out = []) {
  try {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      if (['node_modules', '.next', '.svelte-kit', 'build', 'dist', '.turbo'].includes(entry.name)) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(file, out);
      else if (entry.isFile() && /\.(?:ts|js|mjs|svelte|tsx|jsx)$/.test(entry.name)) out.push(file);
    }
  } catch {}
  return out;
}
for (const [root, variant] of roots) {
  for (const file of await walk(root)) {
    let text = await fs.readFile(file, 'utf8');
    const before = text;
    if (variant === 'auto-best') {
      text = text.replace(/(logoLight\s*:\s*)["'][^"']+["']/g, "$1'/assets/brand/logo-on-dark.webp'");
      text = text.replace(/(logoOnDark\s*:\s*)["'][^"']+["']/g, "$1'/assets/brand/logo-on-dark.webp'");
    } else {
      text = text.replace(/(logoPath\s*:\s*)["'][^"']+["']/g, '$1"/variant-2/assets/brand/logo-on-dark.webp"');
    }
    if (text !== before) await fs.writeFile(file, text.replaceAll('\r\n', '\n'));
  }
}
NODE

required_roots=(assets/brand auto-best/static/assets/brand carwow/static/assets/brand)
if [ -d modern ]; then required_roots+=(modern/apps/web/public/assets/brand); fi
if [ -d import ]; then required_roots+=(import/static/assets/brand); fi
for root in "${required_roots[@]}"; do
  test -s "$root/logo-master.png"
  test -s "$root/logo-on-light.webp"
  test -s "$root/logo-on-dark.webp"
  test -s "$root/logo-on-accent.webp"
done

grep -RIlE 'logo(Light|OnDark)[[:space:]]*:' auto-best/src | xargs -r grep -H 'logo-on-dark.webp'
if [ -d modern ]; then
  grep -RIlE 'logoPath[[:space:]]*:' modern/packages modern/apps/web | xargs -r grep -H '/variant-2/assets/brand/logo-on-dark.webp'
fi
if [ -d import ]; then
  grep -RIlE 'logo(Light|Dark)[[:space:]]*:' import/src | xargs -r grep -H '/variant-2/assets/brand/logo-on-'
fi
grep -RIlE 'logo(Light|Dark)[[:space:]]*:' carwow/src | xargs -r grep -H '/variant-3/assets/brand/logo-on-'

(
  cd auto-best
  npm ci
  npm run build
)
if [ -d modern ]; then
  (
    cd modern
    corepack enable
    pnpm install --frozen-lockfile
    pnpm --filter @repo/database build
    pnpm --filter web build
  )
elif [ -d import ]; then
  (
    cd import
    npm ci
    npm run build
  )
else
  echo 'No supported variant-2 source (modern/import) found.' >&2
  exit 1
fi
(
  cd carwow
  npm ci
  npm run build
)

git clean -fdX
git config user.name 'github-actions[bot]'
git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
git add -A
if git diff --cached --quiet; then
  echo 'Logo implementation already matches the approved contract.'
else
  git commit -m 'Complete contextual logo implementation and QA'
  target_branch="${GITHUB_REF_NAME:-$(git branch --show-current)}"
  git push origin "HEAD:$target_branch"
fi
