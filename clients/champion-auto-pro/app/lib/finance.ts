/** Illustrative amortisation, not an offer or eligibility assessment. No fees are assumed. */
export function estimateFinance(price: number, deposit: number, annualRate: number, years: number) {
  if (![price, deposit, annualRate, years].every(Number.isFinite) || price < 0 || deposit < 0 || annualRate < 0 || years <= 0) {
    throw new RangeError('Finance inputs must be finite, non-negative, with a positive term.');
  }
  const principal = Math.max(0, price - deposit);
  const months = Math.max(1, Math.round(years * 12));
  const rate = annualRate / 1200;
  // log1p/expm1 preserve the denominator when a positive rate is too small for
  // 1 + rate to differ from 1. Divide the rate first to avoid numerator overflow.
  const monthly = principal === 0 ? 0 : rate === 0 ? principal / months
    : principal * (rate / -Math.expm1(-months * Math.log1p(rate)));
  const total = monthly * months + Math.min(price, deposit);
  const interest = monthly * months - principal;
  if (![months, monthly, total, interest].every(Number.isFinite)) {
    throw new RangeError('Finance inputs exceed the supported numeric range.');
  }
  return {principal, months, monthly, total, interest};
}
