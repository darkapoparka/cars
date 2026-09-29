import {test} from 'node:test';
import assert from 'node:assert/strict';
import {calculateReferenceLoan as loan} from '../lib/loan-estimate.ts';

test('captured Fortuner default rounds to AED 1,430', () => {
  const result = loan(94099, 18819, 5);
  assert.equal(result.monthly, 1430);
  assert.equal(result.loan, 75280);
  assert.equal(Number(result.interest.toFixed(2)), 2.79);
});
test('zero-deposit three-year estimate uses the same arithmetic', () => {
  assert.equal(loan(94099, 0, 3).monthly, 2822);
});
test('increasing the deposit does not increase the payment', () => {
  let previous = Infinity;
  for (let deposit = 0; deposit <= 94099; deposit += 1000) {
    const current = loan(94099, deposit, 5).monthly;
    assert.ok(current <= previous); previous = current;
  }
});
test('non-finite and negative-price inputs are rejected', () => {
  for (const values of [[NaN,0,5],[94099,Infinity,5],[94099,0,NaN],[-1,0,5]]) assert.throws(() => loan(...values), RangeError);
});
test('deposit and tenure boundaries are clamped', () => {
  assert.equal(loan(0,0,5).monthly, 0);
  assert.equal(loan(94099,999999,5).monthly, 0);
  assert.equal(loan(94099,-10,5).downPayment, 0);
  assert.equal(loan(94099,0,99).years, 5);
  assert.equal(loan(94099,0,0).years, 1);
});
