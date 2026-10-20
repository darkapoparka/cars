/** Local reproduction of the captured calculator; not a lender quote or approval. */
export function calculateReferenceLoan(price: number, downPayment: number, years: number) {
  if (![price, downPayment, years].every(Number.isFinite) || price < 0) throw new RangeError('Invalid loan inputs');
  const tenure = Math.max(1, Math.min(5, Math.round(years)));
  const deposit = Math.max(0, Math.min(price, downPayment));
  const loan = price - deposit;
  const interest = (1.99 + 2.99 * (tenure - 1)) / tenure;
  const monthly = Math.round(loan * (1 + interest / 100 * tenure) / (tenure * 12));
  return {loan, interest, monthly, years: tenure, downPayment: deposit};
}
