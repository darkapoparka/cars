type MileageStock = { mileage: number; mileageKnown?: boolean; mileageOnRequest?: boolean };
export function hasMobileMileage(stock: MileageStock): boolean {
  return stock.mileageKnown !== false && stock.mileageOnRequest !== true && Number.isFinite(stock.mileage) && stock.mileage >= 0;
}
export const mobileMileageValue = (stock: MileageStock): number => hasMobileMileage(stock) ? stock.mileage : NaN;
export function formatMobileMileage(stock: MileageStock, locale = 'en'): string {
  if (!hasMobileMileage(stock)) return locale.startsWith('bg') ? 'Пробег при запитване' : 'Mileage on request';
  return new Intl.NumberFormat(locale.startsWith('bg') ? 'bg-BG' : 'en-GB', { maximumFractionDigits: 0 }).format(stock.mileage) + ' ' + (locale.startsWith('bg') ? 'км' : 'km');
}
export function compareMobileMileage(a: MileageStock, b: MileageStock, direction = 1): number {
  const aKnown = hasMobileMileage(a), bKnown = hasMobileMileage(b);
  return aKnown && bKnown ? direction * (a.mileage - b.mileage) : Number(bKnown) - Number(aKnown);
}
