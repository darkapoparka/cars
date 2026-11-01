export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
export function dateAt(year: number, month: number, day: number): Date {
  return new Date(year, month, day, 12);
}
export function parseDate(value: string): Date | null {
  let match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  let day: number, month: number, year: number;
  if (match) {
    [, day, month, year] = match.map(Number);
    month -= 1;
  } else {
    match = /^(?:\w{3},\s*)?([A-Za-z]+)\s+(\d{1,2})\s+(\d{4})$/.exec(
      value.trim(),
    );
    if (match) {
      month = months.findIndex((name) =>
        name.toLowerCase().startsWith(match![1].toLowerCase()),
      );
      day = Number(match[2]);
      year = Number(match[3]);
    } else {
      match = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(value.trim());
      if (!match) return null;
      day = Number(match[1]);
      year = Number(match[3]);
      month = months.findIndex((name) =>
        name.toLowerCase().startsWith(match![2].toLowerCase()),
      );
    }
  }
  if (month < 0 || month > 11 || year < 100 || year > 9999) return null;
  const date = dateAt(year, month, day);
  return date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year
    ? date
    : null;
}
export function formatDate(date: Date, numeric: boolean): string {
  const day = String(date.getDate()).padStart(2, "0");
  return numeric
    ? `${day}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`
    : `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
export function calendarDays(year: number, month: number): Date[] {
  const start = dateAt(year, month, 1);
  start.setDate(1 - start.getDay());
  return Array.from({ length: 42 }, (_, i) =>
    dateAt(start.getFullYear(), start.getMonth(), start.getDate() + i),
  );
}
export function moveMonth(date: Date, amount: number): Date {
  const start = dateAt(date.getFullYear(), date.getMonth() + amount, 1);
  const last = dateAt(start.getFullYear(), start.getMonth() + 1, 0).getDate();
  return dateAt(
    start.getFullYear(),
    start.getMonth(),
    Math.min(date.getDate(), last),
  );
}
