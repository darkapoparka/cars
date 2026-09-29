/** Illustrative amortisation, not an offer or eligibility assessment. No fees are assumed. */
export function estimateFinance(price: number, deposit: number, annualRate: number, years: number) {
  if (![price, deposit, annualRate, years].every(Number.isFinite) || price < 0 || deposit < 0 || annualRate < 0 || years <= 0) {
    throw new RangeError('Finance inputs must be finite, non-negative, with a positive term.');
  }
  const principal = Math.max(0, price - deposit);
  const months = Math.max(1, Math.round(years * 12));
  const rate = annualRate / 1200;
  const monthly = principal === 0 ? 0 : rate === 0 ? principal / months
    : principal * rate / (1 - Math.pow(1 + rate, -months));
  return {principal, months, monthly, total: monthly * months + Math.min(price, deposit), interest: monthly * months - principal};
}
