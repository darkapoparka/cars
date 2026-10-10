// Temporary enquiry state only. No appointments, messages or trade-in offers are submitted.
export type EnquiryKind = 'Trade-in' | 'Onsite visit' | 'Delivery';
export type EnquiryFields = Record<string, string>;
export const registrationMonths = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export function currentLocalDate(): string {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
}
/** Round-trip every component; Date alone silently normalizes dates such as February 30. */
export function isISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(value + 'T12:00:00');
  return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;
}
export function referenceDate(value: string): string {
  return isISODate(value) ? value.split('-').reverse().join('.') : '';
}
export function enquirySummary(kind: EnquiryKind, fields: EnquiryFields): string {
  if (kind === 'Onsite visit')
    return [referenceDate(fields.date || ''), fields.time].filter(Boolean).join(' • ');
  if (kind === 'Delivery') return [fields.postal, fields.city].filter(Boolean).join(' • ');
  return [
    fields.brand,
    fields.model,
    fields.year,
    fields.mileage && Number(fields.mileage).toLocaleString('en-GB') + ' mi',
  ]
    .filter(Boolean)
    .join(' • ');
}
export function validTradeBasics(fields: EnquiryFields, today = currentLocalDate()): boolean {
  const month = registrationMonths.indexOf(fields.month) + 1;
  if (!isISODate(today) || !fields.brand?.trim() || !fields.model?.trim() || !month) return false;
  if (!/^\d{4}$/.test(fields.year || '') || Number(fields.year) < 1900) return false;
  if (!/^\d{1,6}$/.test(fields.mileage || '')) return false;
  return fields.year + '-' + String(month).padStart(2, '0') <= today.slice(0, 7);
}
export function validTradeDetails(fields: EnquiryFields, today: string): boolean {
  return validTradeBasics(fields, today) && (!fields.vin || /^[a-zA-Z0-9]{17}$/.test(fields.vin));
}
/** Reset dependent values instead of keeping a previous model's engine/trim selection. */
export function changeEnquiryField(
  fields: EnquiryFields,
  key: string,
  value: string,
): EnquiryFields {
  const result = { ...fields, [key]: value };
  if (fields[key] === value) return result;
  const optional = ['doors', 'body', 'fuel', 'transmission', 'power', 'variant'];
  const descendants: Record<string, string[]> = {
    brand: ['model', 'year', 'month', ...optional],
    model: ['year', 'month', ...optional],
    year: ['month', ...optional],
    month: optional,
    fuel: ['transmission', 'power', 'variant'],
    transmission: ['power', 'variant'],
    power: ['variant'],
    date: ['time'],
  };
  for (const field of descendants[key] || []) result[field] = '';
  return result;
}
/** Half-hour labels from captured opening-hours text, not live appointment availability. */
export function visitTimes(date: string, openingHours: string): string[] {
  if (!isISODate(date)) return [];
  const day = new Date(date + 'T12:00:00').getDay();
  const prefix = day === 0 ? 'Sun' : day === 6 ? 'Sat' : 'Mon';
  const line = openingHours.split('\n').find((value) => value.trim().startsWith(prefix));
  const times = line?.match(/\d{2}:\d{2}/g);
  if (
    !times ||
    times.length < 2 ||
    times.some((value) => !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value))
  )
    return [];
  const minutes = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3));
  const start = minutes(times[0]),
    end = minutes(times[1]);
  return Array.from({ length: Math.max(0, Math.floor((end - start) / 30)) }, (_, index) => {
    const value = start + index * 30;
    return (
      String(Math.floor(value / 60)).padStart(2, '0') + ':' + String(value % 60).padStart(2, '0')
    );
  });
}
export function validVisit(fields: EnquiryFields, today: string, openingHours: string): boolean {
  return (
    isISODate(fields.date || '') &&
    fields.date >= today &&
    visitTimes(fields.date, openingHours).includes(fields.time)
  );
}
// Observed BMW 120 / 2024 / January trade-in branch: captures 322–328.
export function capturedTradeOptions(fields: EnquiryFields): Record<string, string[]> | undefined {
  if (
    fields.brand !== 'BMW' ||
    fields.model !== '120' ||
    fields.year !== '2024' ||
    fields.month !== 'January'
  )
    return;
  return {
    doors: ['4/5'],
    body: ['Saloon'],
    fuel: ['Petrol', 'Diesel'],
    ...(fields.fuel === 'Petrol' ? { transmission: ['Automatic'] } : {}),
    ...(fields.fuel === 'Petrol' && fields.transmission === 'Automatic'
      ? { power: ['170 HP (125 kW)', '178 HP (131 kW)'] }
      : {}),
  };
}
