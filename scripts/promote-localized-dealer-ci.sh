#!/usr/bin/env bash
set -euo pipefail

: "${DEALER_SLUG:?DEALER_SLUG is required}"
: "${DEALER_REPOSITORY:?DEALER_REPOSITORY is required}"

CARS_COMMIT="4b43d7f15cf89868312b2ab9562a4abc5e043ab7"
SOURCE_SHA="$(git rev-parse HEAD)"
CARS="${RUNNER_TEMP:?}/cars-release"
OUTPUT="$RUNNER_TEMP/localized"
REPORT="$RUNNER_TEMP/localization-rollout-report.json"

rm -rf "$CARS" "$OUTPUT"
git init "$CARS"
git -C "$CARS" remote add origin https://github.com/darkapoparka/cars.git
git -C "$CARS" config core.sparseCheckout true
printf '%s\n' \
  '/package.json' \
  '/templates.lock.json' \
  '/scripts/' \
  '/templates/' \
  '/docs/' \
  "/clients/$DEALER_SLUG/" \
  > "$CARS/.git/info/sparse-checkout"
git -C "$CARS" fetch --no-tags --filter=blob:none --depth=1 origin "$CARS_COMMIT"
git -C "$CARS" checkout --detach FETCH_HEAD
test "$(git -C "$CARS" rev-parse HEAD)" = "$CARS_COMMIT"
test -s "$CARS/clients/$DEALER_SLUG/dealer.json"

node "$CARS/scripts/rollout-localized-client.mjs" \
  --client-root "$CARS/clients/$DEALER_SLUG" \
  --slug "$DEALER_SLUG" \
  --repository "$DEALER_REPOSITORY" \
  --output "$OUTPUT" \
  | tee "$REPORT"

ROOT="$OUTPUT" CARS="$CARS" node <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const root = process.env.ROOT;
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'dealer.json'), 'utf8'));
const contract = JSON.parse(fs.readFileSync(path.join(root, 'localization/contract.json'), 'utf8'));
const adoption = JSON.parse(fs.readFileSync(path.join(root, 'localization/adoption.json'), 'utf8'));
const lock = JSON.parse(fs.readFileSync(path.join(process.env.CARS, 'templates.lock.json'), 'utf8'));
if (manifest.slug !== process.env.DEALER_SLUG) throw new Error(`Dealer slug changed: ${manifest.slug}`);
if (manifest.repository !== process.env.DEALER_REPOSITORY) throw new Error(`Dealer repository changed: ${manifest.repository}`);
if (manifest.packaging?.version !== '2') throw new Error('Expected packaging version 2');
if (JSON.stringify([...contract.enabledLocales].sort()) !== '["bg","en"]') throw new Error('Expected complete EN/BG locale contract');
if (adoption.packagingVersion !== '2' || adoption.dealerId !== contract.dealerId) throw new Error('Invalid localization adoption seal');
for (const variant of manifest.variants) {
  const release = lock.templates?.[variant.key];
  if (!release?.commit || release.qa?.nativeLocalization?.commit !== release.commit) {
    throw new Error(`Unreviewed localization release: ${variant.key}`);
  }
  if (manifest.templateRevisions?.[variant.key] !== release.commit) throw new Error(`Manifest release mismatch: ${variant.key}`);
  if (adoption.releases?.[variant.key]?.commit !== release.commit) throw new Error(`Adoption release mismatch: ${variant.key}`);
}
const reviews = path.join(root, 'carwow/src/lib/data/daynight-reviews.ts');
if (fs.existsSync(reviews)) {
  const source = fs.readFileSync(reviews, 'utf8');
  if (source.includes('No verified customer reviews are included in this independent preview.')) {
    throw new Error('Carwow review disclosure bypasses the locale catalog');
  }
}
NODE

git fetch origin main
test "$(git rev-parse origin/main)" = "$SOURCE_SHA" || {
  echo 'Dealer main changed during generation' >&2
  exit 1
}
rsync -a --delete \
  --exclude='.git/' \
  --exclude='.github/' \
  "$OUTPUT/" "$GITHUB_WORKSPACE/"
git config user.name github-actions[bot]
git config user.email 41898282+github-actions[bot]@users.noreply.github.com
git add -A
git diff --cached --check
if git diff --cached --quiet; then
  echo 'Dealer already matches the reviewed localized package.'
  exit 0
fi
git commit -m 'Promote current native EN/BG localization' -m "Cars source: $CARS_COMMIT"
git fetch origin main
test "$(git rev-parse origin/main)" = "$SOURCE_SHA" || {
  echo 'Dealer main changed before publication' >&2
  exit 1
}
git push origin HEAD:main
