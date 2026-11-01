export type CarsPurpose = 'buy' | 'rent';

export function readCarsPurpose(value: string | null | undefined): CarsPurpose {
  return value === 'rent' ? 'rent' : 'buy';
}

export function localDateValue(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function validRentalDates(pickup: string, returning: string, today: string): boolean {
  const validDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
    && localDateValue(new Date(value + 'T00:00:00')) === value;
  return [pickup, returning, today].every(validDay) && pickup >= today && returning >= pickup;
}
