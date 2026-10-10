import test from 'node:test';
import assert from 'node:assert/strict';
import { auditSource, auditApplication } from './locale-source-audit.mjs';
import { compileCatalog } from './locale-catalog.mjs';
import path from 'node:path';
const catalog = compileCatalog({ 'action.buy': { en: 'Buy now', bg: 'Купи сега' } }, [
  { key: 'vehicle.about', source: 'Vehicle description', en: 'About', bg: 'Описание', disposition: 'translate' },
  { key: 'company.about', source: 'Company information', en: 'About', bg: 'За нас', disposition: 'translate' }
]);
const audit = s => auditSource(s, 'negative.svelte', catalog);
test('rejects unkeyed visible and accessibility copy', () => {
  assert.ok(audit('<button>Buy now</button>').some(x => x.kind === 'unkeyed-rendered-copy'));
  assert.ok(audit('<button aria-label="Buy now">+</button>').some(x => x.value === 'Buy now'));
});
test('rejects unknown keys and ambiguous source aliases, including attributes', () => {
  assert.ok(audit("<button>{i18n.t('missing.key')}</button>").some(x => x.kind === 'key'));
  assert.ok(audit("<button>{i18n.text('About')}</button>").some(x => x.kind === 'alias'));
  assert.ok(audit("<button aria-label={i18n.text('About')}>+</button>").some(x => x.kind === 'alias'));
});
test('accepts explicit context keys and language autonyms', () => {
  assert.deepEqual(audit("<button>{i18n.t('vehicle.about')}</button><option lang='bg'>Български</option>"), []);
});
test('all native application files satisfy the source-copy boundary', () => {
  const result = auditApplication(path.resolve(import.meta.dirname, '..'));
  assert.ok(result.files > 100);
  assert.deepEqual(result.issues, []);
});
