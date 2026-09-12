export const financeTerms = [12, 24, 36, 48, 60] as const;
export type FinanceTerm = (typeof financeTerms)[number];
export type FinanceSelection = { downPaymentEur: number; termMonths: FinanceTerm };
const validTerm = (value: number): value is FinanceTerm => financeTerms.some(term => term === value);

/** This is principal-only arithmetic, not an interest/fee quote. */
export function calculateFinance(priceEur: number, selection: FinanceSelection) {
  const price = Number.isFinite(priceEur) ? Math.max(0, priceEur) : 0;
  const down = Number.isFinite(selection.downPaymentEur) ? selection.downPaymentEur : 0;
  const normalizedDownPayment = Math.min(Math.max(down, 0), price);
  const financedPrincipal = price - normalizedDownPayment;
  const term = validTerm(selection.termMonths) ? selection.termMonths : 60;
  return { normalizedDownPayment, financedPrincipal, principalPerMonth: Math.round(financedPrincipal / term) };
}

export function parseFinanceSelection(params: URLSearchParams, priceEur: number): FinanceSelection | null {
  const amount = params.get('down_payment') ?? '';
  const term = params.get('term') ?? '';
  if (!/^\d+(?:\.\d{1,2})?$/.test(amount) || !/^\d+$/.test(term)) return null;
  const downPaymentEur = Number(amount), termMonths = Number(term);
  if (!Number.isFinite(priceEur) || !Number.isFinite(downPaymentEur) || downPaymentEur < 0 || downPaymentEur > priceEur || !validTerm(termMonths)) return null;
  return { downPaymentEur, termMonths };
}

export function financeParams(selection: FinanceSelection) {
  return new URLSearchParams({ down_payment: String(selection.downPaymentEur), term: String(selection.termMonths) });
}
