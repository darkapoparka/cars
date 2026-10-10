import type {
  DashboardDropdownConfig,
  DashboardBooking,
  DashboardNotification,
  DashboardWalletTransaction,
} from "./dashboard.ts";
import {
  catalogSortOptions,
  emptyCatalogFilters,
  matchCatalog,
  type CatalogItem,
} from "./mobile-catalog.ts";
import { message, type CatalogText } from "../i18n/text.ts";
import { translate } from "../i18n/messages.ts";

export function dashboardBookingTypeConfig(
  base: DashboardDropdownConfig,
  items: readonly DashboardBooking[],
  text: (value: CatalogText) => string,
): DashboardDropdownConfig {
  const types = new Map<string, CatalogText>();
  for (const item of items)
    types.set(text(item.vehicleType).trim().toLowerCase(), item.vehicleType);
  return {
    ...base,
    options: [
      message("ui.desktop-catalog-filter-modal.all"),
      ...types.values(),
    ],
  };
}

export function dashboardBookingSortConfig(
  base: DashboardDropdownConfig,
): DashboardDropdownConfig {
  return {
    ...base,
    options: [message("catalog.order.default"), ...base.options.slice(0, 2)],
  };
}

export function matchDashboardBookings<T extends DashboardBooking>(
  items: readonly T[],
  query: string,
  vehicleType: CatalogText | undefined,
  sort: CatalogText | undefined,
  text: (value: CatalogText) => string,
): T[] {
  const term = query.trim().toLowerCase();
  const chosenType =
    vehicleType &&
    (typeof vehicleType === "string" ||
      vehicleType.message !== "ui.desktop-catalog-filter-modal.all")
      ? text(vehicleType).trim().toLowerCase()
      : "";
  const filtered = items.filter(
    (item) =>
      (!chosenType ||
        text(item.vehicleType).trim().toLowerCase() === chosenType) &&
      (!term ||
        [
          item.id,
          item.vehicleTitle,
          text(item.vehicleType),
          text(item.travellers),
          text(item.days),
          item.price,
          item.date,
          text(item.status),
        ].some((value) => value.toLowerCase().includes(term))),
  );
  const direction =
    typeof sort === "string"
      ? 0
      : sort?.message ===
          "reference.dynamic.dashboard-dropdowns.bookingsSort.options.1"
        ? -1
        : sort?.message ===
            "reference.dynamic.dashboard-dropdowns.bookingsSort.options.2"
          ? 1
          : 0;
  if (!direction) return filtered;
  return filtered.toSorted((a, b) => {
    const first = Date.parse(a.date);
    const second = Date.parse(b.date);
    if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
    if (!Number.isFinite(second)) return -1;
    return (first - second) * direction;
  });
}

const recentOptions = new Set([
  "reference.dynamic.dashboard-dropdowns.notificationsScope.options.2",
  "reference.dynamic.dashboard-dropdowns.recentBookingsPeriod.options.2",
  "reference.dynamic.dashboard-dropdowns.invoicesPeriod.options.2",
  "reference.dynamic.dashboard-dropdowns.bookingsChartPeriod.options.2",
  "reference.dynamic.dashboard-dropdowns.earningTransactionsPeriod.options.2",
]);

export function dashboardRecentSelected(selection?: CatalogText): boolean {
  return (
    typeof selection !== "string" &&
    !!selection &&
    recentOptions.has(selection.message)
  );
}

/** The reference's authored dates are parsed independently of the display locale. */
export function dashboardReferenceDate(value: CatalogText): number {
  const authored =
    typeof value === "string" ? value : translate("en", value.message);
  return Date.parse(authored.replace(/^Date\s*:\s*/i, ""));
}

/** Recent means the last seven days in the supplied snapshot, preserving date ties. */
export function recentDashboardItems<T>(
  items: readonly T[],
  selection: CatalogText | undefined,
  date: (item: T) => number,
): T[] {
  if (!dashboardRecentSelected(selection)) return [...items];
  const dates = items.map(date);
  const latest = Math.max(...dates.filter(Number.isFinite));
  if (!Number.isFinite(latest)) return [];
  const first = latest - 7 * 24 * 60 * 60 * 1000;
  return items.filter(
    (_, index) => Number.isFinite(dates[index]) && dates[index] >= first,
  );
}

/** Recent notifications use the supplied relative ages, with no read-state inference. */
export function recentDashboardNotifications<T extends DashboardNotification>(
  items: readonly T[],
  selection?: CatalogText,
): T[] {
  if (!dashboardRecentSelected(selection)) return [...items];
  return items.filter((item) => {
    const authored =
      typeof item.time === "string"
        ? item.time
        : translate("en", item.time.message);
    const age = authored.match(
      /^(\d+)\s+(mins?|minutes?|hours?|days?)\s+ago$/i,
    );
    if (!age) return false;
    const unit = age[2].toLowerCase();
    const minutes =
      Number(age[1]) *
      (unit.startsWith("day") ? 1440 : unit.startsWith("hour") ? 60 : 1);
    return minutes <= 1440;
  });
}

export function dashboardMakeConfig(
  base: DashboardDropdownConfig,
  items: readonly CatalogItem[],
): DashboardDropdownConfig {
  return {
    ...base,
    initial: message("catalog.make"),
    toggleLabel: message("catalog.make"),
    options: [
      message("catalog.allMakes"),
      ...new Set(items.map((item) => item.title.split(" ")[0])),
    ],
  };
}

export function dashboardPriceConfig(
  base: DashboardDropdownConfig,
): DashboardDropdownConfig {
  return {
    ...base,
    initial: message("catalog.sort"),
    toggleLabel: message("catalog.sort"),
    options: catalogSortOptions.map((option) => message(option.labelKey)),
  };
}

export function dashboardPriceOrder(selection?: CatalogText): string {
  return (
    catalogSortOptions.find(
      (option) =>
        typeof selection !== "string" && selection?.message === option.labelKey,
    )?.value ?? ""
  );
}

export function matchDashboardVehicles<T extends CatalogItem>(
  items: readonly T[],
  query: string,
  make?: CatalogText,
  sort?: CatalogText,
): T[] {
  return matchCatalog(items, {
    ...emptyCatalogFilters,
    q: query.trim(),
    make: typeof make === "string" ? make : "",
    sort: dashboardPriceOrder(sort),
  });
}

export function matchDashboardTransactions<
  T extends DashboardWalletTransaction,
>(
  items: readonly T[],
  query: string,
  status: CatalogText | undefined,
  sort: CatalogText | undefined,
  text: (value: CatalogText) => string,
): T[] {
  const term = query.trim().toLowerCase();
  const chosenStatus =
    status &&
    (typeof status === "string" ||
      status.message !== "ui.desktop-catalog-filter-modal.all")
      ? text(status).trim().toLowerCase()
      : "";
  const filtered = items.filter(
    (item) =>
      (!chosenStatus ||
        text(item.status).trim().toLowerCase() === chosenStatus) &&
      (!term ||
        [
          text(item.payment),
          text(item.direction),
          item.date,
          item.amount,
          item.balance,
          text(item.status),
        ].some((value) => value.toLowerCase().includes(term))),
  );
  const direction =
    typeof sort === "string"
      ? 0
      : sort?.message ===
          "reference.dynamic.dashboard-dropdowns.walletSort.options.1"
        ? -1
        : sort?.message ===
            "reference.dynamic.dashboard-dropdowns.walletSort.options.2"
          ? 1
          : 0;
  if (!direction) return filtered;
  return filtered.toSorted((a, b) => {
    const first = Date.parse(a.date);
    const second = Date.parse(b.date);
    if (!Number.isFinite(first)) return Number.isFinite(second) ? 1 : 0;
    if (!Number.isFinite(second)) return -1;
    return (first - second) * direction;
  });
}
