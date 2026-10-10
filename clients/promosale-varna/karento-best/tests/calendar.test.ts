import assert from "node:assert/strict";
import { test } from "node:test";
import {
  calendarDays,
  dateAt,
  formatDate,
  moveMonth,
  parseDate,
} from "../src/lib/calendar.ts";
test("calendar rejects impossible dates and parses the preserved input formats", () => {
  for (const invalid of ["31/02/2025", "29/02/2025", "12/13/2025", "bad"])
    assert.equal(parseDate(invalid), null);
  for (const valid of ["29/02/2024", "Thu, Oct 01 2024", "01 October 2024"])
    assert.ok(parseDate(valid));
  assert.equal(formatDate(parseDate("Thu, Oct 01 2024")!, true), "01/10/2024");
  assert.equal(formatDate(parseDate("17/02/2025")!, false), "17 February 2025");
});
test("calendar navigation clamps month ends and lays out six complete Sunday weeks", () => {
  assert.equal(
    formatDate(moveMonth(dateAt(2024, 0, 31), 1), true),
    "29/02/2024",
  );
  assert.equal(
    formatDate(moveMonth(dateAt(2025, 0, 31), 1), true),
    "28/02/2025",
  );
  const dates = calendarDays(2025, 1);
  assert.equal(dates.length, 42);
  assert.equal(dates[0].getDay(), 0);
  assert.equal(dates[41].getDay(), 6);
  assert.equal(new Set(dates.map((date) => date.getTime())).size, 42);
});
