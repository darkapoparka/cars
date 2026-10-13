import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateLoanEstimate,
  createLoanCalculatorState,
  type LoanEstimateDraft,
} from "../src/lib/data/loan-estimate.ts";

const example: LoanEstimateDraft = {
  price: 20000,
  annualRate: 5,
  termMonths: 12,
  downPayment: 12000,
};

test("calculator instances clone supplied defaults and retain their own currency and draft", () => {
  const defaults = {
    price: 20000,
    annualRate: 5,
    termMonths: 12,
    downPayment: 12000,
  };
  const first = createLoanCalculatorState(defaults, "EUR");
  const second = createLoanCalculatorState(defaults, "USD");
  first.values.price = 35000;
  first.currency = "GBP";
  assert.equal(second.values.price, 20000);
  assert.equal(second.currency, "USD");
  assert.equal(defaults.price, 20000);
});

test("a fixed-rate estimate amortizes the financed balance over the entered term", () => {
  const result = calculateLoanEstimate(example);
  assert.equal(result.valid, true);
  if (!result.valid) return;
  assert.equal(result.financed, 8000);
  assert.equal(result.downPayment, 12000);
  assert.ok(Math.abs(result.monthly - 684.8598543077396) < 0.000001);
  let balance = result.financed;
  for (let month = 0; month < 12; month++)
    balance = balance * (1 + 0.05 / 12) - result.monthly;
  assert.ok(Math.abs(balance) < 0.000001);
});

test("zero interest divides the principal equally and a full deposit finances zero", () => {
  assert.deepEqual(
    calculateLoanEstimate({ ...example, annualRate: 0, termMonths: 20 }),
    { valid: true, downPayment: 12000, financed: 8000, monthly: 400 },
  );
  assert.deepEqual(calculateLoanEstimate({ ...example, downPayment: 20000 }), {
    valid: true,
    downPayment: 20000,
    financed: 0,
    monthly: 0,
  });
});

test("invalid and empty numeric fields return their own errors without payment figures", () => {
  for (const price of [undefined, 0, -1, NaN, Infinity]) {
    const result = calculateLoanEstimate({ ...example, price });
    assert.equal(result.valid, false);
    if (!result.valid) assert.equal(result.errors.price, true);
  }
  for (const annualRate of [undefined, -1, NaN, Infinity]) {
    const result = calculateLoanEstimate({ ...example, annualRate });
    assert.equal(result.valid, false);
    if (!result.valid) assert.equal(result.errors.annualRate, true);
  }
  for (const termMonths of [undefined, 0, -1, 1.5, NaN, Infinity]) {
    const result = calculateLoanEstimate({ ...example, termMonths });
    assert.equal(result.valid, false);
    if (!result.valid) assert.equal(result.errors.termMonths, true);
  }
  for (const downPayment of [undefined, -1, 20001, NaN, Infinity]) {
    const result = calculateLoanEstimate({ ...example, downPayment });
    assert.equal(result.valid, false);
    if (!result.valid) assert.equal(result.errors.downPayment, true);
  }
});

test("near-zero interest stays finite and unrepresentable estimates are rejected", () => {
  const result = calculateLoanEstimate({ ...example, annualRate: 1e-10 });
  assert.equal(result.valid, true);
  if (result.valid) assert.ok(Math.abs(result.monthly - 8000 / 12) < 0.000001);
  assert.deepEqual(
    calculateLoanEstimate({
      price: Number.MAX_VALUE,
      annualRate: Number.MAX_VALUE,
      termMonths: 1,
      downPayment: 0,
    }),
    { valid: false, errors: {}, calculationError: true },
  );
});
