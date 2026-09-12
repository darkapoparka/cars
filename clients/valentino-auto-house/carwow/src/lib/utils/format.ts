export function formatPrice(value: number, options: Intl.NumberFormatOptions = {}) {
  if (!Number.isFinite(value)) return 'По запитване';
  return new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2, ...options }).format(value);
}
export function formatTemplatePrice(value: number) { return formatPrice(value); }
export function formatMileage(value: number) { return `${new Intl.NumberFormat('bg-BG').format(value)} км`; }
export function formatNumber(value: number) { return Number.isFinite(value) ? new Intl.NumberFormat('bg-BG').format(value) : '—'; }
/** An illustrative calculator using visitor-selected assumptions, never a finance offer. */
export function calculateMonthlyPayment(principal: number, annualRate: number, months: number, downPayment = 0) {
  const financed = Math.max(principal - downPayment, 0);
  const monthlyRate = annualRate / 100 / 12;
  if (months <= 0) return 0;
  if (monthlyRate === 0) return Math.round(financed / months);
  const payment = (financed * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment);
}
export function shortFuel(fuel: string): string { return fuel === 'Електрически' ? 'Електрич.' : fuel; }
