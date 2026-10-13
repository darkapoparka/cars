import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {estimateFinance} from '../lib/finance';

function closeTo(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) <= Math.max(1, Math.abs(expected)) * 1e-12, `${actual} differs from ${expected}`);
}

describe('illustrative finance numeric boundaries', () => {
  it('preserves ordinary amortisation and includes the deposit in the total', () => {
    const quote = estimateFinance(25000, 5000, 7, 5);
    assert.equal(quote.principal, 20000);
    assert.equal(quote.months, 60);
    closeTo(quote.monthly, 396.02397080699);
    closeTo(quote.total, 28761.4382484194);
    closeTo(quote.interest, 3761.4382484194);
  });

  it('handles exact zero interest', () => {
    assert.deepEqual(estimateFinance(12000, 0, 0, 1), {principal: 12000, months: 12, monthly: 1000, total: 12000, interest: 0});
  });

  for (const rate of [1e-12, 1e-20, 1e-320, Number.MIN_VALUE]) {
    it(`keeps a tiny positive annual rate ${rate} finite and close to zero interest`, () => {
      const quote = estimateFinance(25000, 5000, rate, 5);
      assert.ok(Object.values(quote).every(Number.isFinite));
      closeTo(quote.monthly, 20000 / 60);
      closeTo(quote.total, 25000);
      assert.ok(Math.abs(quote.interest) < 1e-8);
    });
  }

  it('returns no payment or interest when the deposit covers the price', () => {
    assert.deepEqual(estimateFinance(10000, 15000, 7, 2), {principal: 0, months: 24, monthly: 0, total: 10000, interest: 0});
    assert.deepEqual(estimateFinance(0, 0, 1e-20, 5), {principal: 0, months: 60, monthly: 0, total: 0, interest: 0});
  });

  it('rejects a term whose derived number of months overflows', () => {
    assert.throws(() => estimateFinance(25000, 5000, 7, Number.MAX_VALUE), RangeError);
  });

  it('rejects repayment totals that overflow despite finite inputs', () => {
    assert.throws(() => estimateFinance(Number.MAX_VALUE, 0, 7, 5), RangeError);
  });

  it('retains large finite estimates within the supported numeric range', () => {
    const quote = estimateFinance(1e300, 0, 7, 5);
    assert.ok(Object.values(quote).every(Number.isFinite));
    assert.ok(quote.total > quote.principal);
  });
});
