import assert from 'node:assert/strict';
import { test } from 'node:test';
import { radiusPolicyErrors } from './radius-policy.mjs';

test('cards, controls, sheets and border insets use their shared corner roles', () => {
  assert.deepEqual(radiusPolicyErrors(`
    .card { border-radius: var(--dn-radius-mobile-card); }
    .sheet { border-radius: var(--dn-radius-sheet) var(--dn-radius-sheet) 0 0; }
    .control { border-radius: var(--dn-pill); }
    .media { border-radius: calc(var(--dn-radius) - 1px); }
    .row { border-radius: var(--dn-overlay-row-radius); }
    .square { border-radius: 0; }
    .focus { border-top-left-radius: inherit; }
    .logical { border-start-start-radius: var(--dn-radius); }
  `), []);
});

test('numeric corners and spacing tokens cannot bypass the corner system', () => {
  const errors = radiusPolicyErrors(`
    /* border-radius: 19px; */
    .card { border-radius: 24px; }
    .sheet { border-radius: var(--dn-radius-sheet) 20px 0 0; }
    .card { border-radius: var(--dn-space-6); }
    .close { border-radius: 50%; }
    .focus { border-bottom-right-radius: .65rem; }
    .logical { border-end-end-radius: 19px; }
  `);
  assert.deepEqual(errors.map(error => error.value), ['24px', 'var(--dn-radius-sheet) 20px 0 0', 'var(--dn-space-6)', '50%', '.65rem', '19px']);
  assert.deepEqual(errors.map(error => error.line), [3, 4, 5, 6, 7, 8]);
});

test('custom-property definitions are governed by the token scale instead of CSS usage rules', () => {
  assert.deepEqual(radiusPolicyErrors(':root { --dn-radius: 16px; --dn-radius-circle: 50%; }'), []);
});
