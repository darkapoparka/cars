import test from 'node:test';
import assert from 'node:assert/strict';
import { compileCatalog } from './locale-catalog.mjs';
const row = {
	key: 'template.one',
	source: 'източник',
	en: 'One {count}',
	bg: 'Едно {count}',
	disposition: 'translate'
};
test('catalog rejects incomplete, duplicate and mismatched messages', () => {
	assert.throws(() => compileCatalog({}, [{ ...row, en: '' }]));
	assert.throws(() => compileCatalog({}, [row, row]));
	assert.throws(() => compileCatalog({}, [{ ...row, en: 'One' }]));
});
test('catalog quarantines conflicting aliases without explicit source owner', () => {
	const other = { key: 'template.two', source: 'друг', en: 'One {count}', bg: 'Две {count}' };
	const result = compileCatalog({}, [row, other]);
	assert.ok(result.ambiguousAliases.includes('One {count}'));
	assert.equal(result.sourceKeys['One {count}'], undefined);
});
test('catalog exact source owner wins over translated alias', () => {
	const other = {
		key: 'template.two',
		source: 'One {count}',
		en: 'Second {count}',
		bg: 'Две {count}'
	};
	const result = compileCatalog({}, [row, other]);
	assert.equal(result.sourceKeys['One {count}'], 'template.two');
});
