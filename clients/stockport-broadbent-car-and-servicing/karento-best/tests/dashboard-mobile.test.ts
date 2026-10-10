import assert from "node:assert/strict";
import { test } from "node:test";
import {
  dashboardMakeConfig,
  dashboardPriceConfig,
  dashboardBookingTypeConfig,
  dashboardBookingSortConfig,
  matchDashboardBookings,
  dashboardReferenceDate,
  recentDashboardItems,
  recentDashboardNotifications,
  matchDashboardTransactions,
  matchDashboardVehicles,
} from "../src/lib/data/dashboard-mobile.ts";
import {
  dashboardDropdowns,
  dashboardBookingRows,
  dashboardNotifications,
  dashboardRecentBookings,
  dashboardOwnerInventory,
  dashboardWalletTransactions,
  dashboardWishlist,
} from "../src/lib/data/dashboard.ts";
import { translate } from "../src/lib/i18n/messages.ts";
import { message, type CatalogText } from "../src/lib/i18n/text.ts";

test("phone bookings combine translated search, supplied car types, and date ordering", () => {
  const original = [...dashboardBookingRows.memberBookings];
  for (const locale of ["en", "bg"] as const) {
    const text = (value: CatalogText) =>
      typeof value === "string" ? value : translate(locale, value.message);
    const types = dashboardBookingTypeConfig(
      dashboardDropdowns.bookingsVehicleType,
      original,
      text,
    );
    assert.equal(types.options.length, 6);
    const sedan = original[0].vehicleType;
    const expected = original.filter(
      (item) => text(item.vehicleType) === text(sedan),
    );
    assert.deepEqual(
      matchDashboardBookings(original, "", sedan, undefined, text),
      expected,
    );
    assert.deepEqual(
      matchDashboardBookings(original, " TOYOTA ", sedan, undefined, text),
      [original[7]],
    );
    assert.deepEqual(
      matchDashboardBookings(
        original,
        text(original[5].status),
        undefined,
        undefined,
        text,
      ),
      [original[5]],
    );
    assert.deepEqual(
      matchDashboardBookings(original, "absent", undefined, undefined, text),
      [],
    );
    assert.deepEqual(
      matchDashboardBookings(
        original,
        "",
        types.options[0],
        dashboardDropdowns.bookingsSort.options[0],
        text,
      ),
      original.toReversed(),
    );
    assert.deepEqual(
      matchDashboardBookings(
        original,
        "",
        undefined,
        dashboardDropdowns.bookingsSort.options[1],
        text,
      ),
      original,
    );
  }
  assert.deepEqual(
    dashboardBookingSortConfig(dashboardDropdowns.bookingsSort).options,
    [
      message("catalog.order.default"),
      ...dashboardDropdowns.bookingsSort.options.slice(0, 2),
    ],
  );
  assert.deepEqual(dashboardBookingRows.memberBookings, original);
});

test("phone recent filters retain supplied date ties and select actual snapshot dates", () => {
  const recent = dashboardDropdowns.recentBookingsPeriod.options[1];
  assert.deepEqual(
    recentDashboardItems(dashboardRecentBookings, recent, (item) =>
      dashboardReferenceDate(item.date),
    ),
    dashboardRecentBookings,
  );
  assert.deepEqual(
    recentDashboardItems(
      dashboardBookingRows.ownerInvoices,
      dashboardDropdowns.invoicesPeriod.options[1],
      (item) => Date.parse(item.date),
    ),
    [dashboardBookingRows.ownerInvoices[3]],
  );
  assert.deepEqual(
    recentDashboardItems(
      dashboardBookingRows.earningTransactions,
      dashboardDropdowns.earningTransactionsPeriod.options[1],
      (item) => Date.parse(item.date),
    ),
    [dashboardBookingRows.earningTransactions[3]],
  );
  const invalid = [{ date: "unknown" }];
  assert.deepEqual(
    recentDashboardItems(invalid, recent, (item) => Date.parse(item.date)),
    [],
  );
  assert.deepEqual(
    recentDashboardItems(
      invalid,
      dashboardDropdowns.recentBookingsPeriod.options[0],
      (item) => Date.parse(item.date),
    ),
    invalid,
  );
});

test("phone recent notifications use authored relative ages without inventing read status", () => {
  assert.deepEqual(
    recentDashboardNotifications(
      dashboardNotifications,
      dashboardDropdowns.notificationsScope.options[1],
    ),
    dashboardNotifications.slice(0, 3),
  );
  assert.deepEqual(
    recentDashboardNotifications(
      dashboardNotifications,
      dashboardDropdowns.notificationsScope.options[0],
    ),
    dashboardNotifications,
  );
});

test("phone wishlist search selects supplied vehicles and leaves no invented matches", () => {
  assert.deepEqual(matchDashboardVehicles(dashboardWishlist, " porsche "), []);
  assert.deepEqual(matchDashboardVehicles(dashboardWishlist, " VOLVO "), [
    dashboardWishlist[1],
  ]);
  assert.deepEqual(matchDashboardVehicles(dashboardWishlist, "", "Honda"), [
    dashboardWishlist[3],
  ]);
  assert.deepEqual(
    matchDashboardVehicles(dashboardWishlist, "Volvo", "Honda"),
    [],
  );
  assert.deepEqual(
    matchDashboardVehicles(
      dashboardWishlist,
      "  ",
      message("catalog.allMakes"),
    ),
    dashboardWishlist,
  );
});

test("phone vehicle menus describe available makes and real price ordering", () => {
  const makes = dashboardMakeConfig(
    dashboardDropdowns.ownerListingsVehicleType,
    dashboardOwnerInventory,
  );
  assert.deepEqual(makes.initial, message("catalog.make"));
  assert.deepEqual(makes.options, [
    message("catalog.allMakes"),
    "GMC",
    "Ford",
    "Mazda",
    "Subaru",
    "Porsche",
    "Toyota",
  ]);
  assert.deepEqual(
    dashboardPriceConfig(dashboardDropdowns.wishlistSort).options,
    [
      message("catalog.order.default"),
      message("catalog.order.priceAsc"),
      message("catalog.order.priceDesc"),
    ],
  );
});

test("phone vehicle sorting orders numeric prices without mutating source records", () => {
  const before = [...dashboardOwnerInventory];
  const ascending = matchDashboardVehicles(
    dashboardOwnerInventory,
    "",
    undefined,
    message("catalog.order.priceAsc"),
  );
  assert.deepEqual(
    ascending.map((item) => item.price),
    ["$32.47", "$89.32", "$89.56", "$98.67", "$125.0", "$658.0"],
  );
  const descending = matchDashboardVehicles(
    dashboardOwnerInventory,
    "",
    undefined,
    message("catalog.order.priceDesc"),
  );
  assert.deepEqual(descending, ascending.toReversed());
  assert.deepEqual(
    matchDashboardVehicles(
      dashboardOwnerInventory,
      "",
      undefined,
      message("reference.dynamic.dashboard-dropdowns.walletSort.options.1"),
    ),
    before,
  );
  assert.deepEqual(dashboardOwnerInventory, before);
});

test("phone transaction search and status filters use the active language together", () => {
  for (const locale of ["en", "bg"] as const) {
    const text = (value: CatalogText) =>
      typeof value === "string" ? value : translate(locale, value.message);
    const completed = message(
      "reference.dynamic.dashboard-dropdowns.walletStatus.options.2",
    );
    const expected = dashboardWalletTransactions.filter(
      (item) => text(item.status) === text(completed),
    );
    for (const status of dashboardDropdowns.walletStatus.options) {
      const matches = dashboardWalletTransactions.filter(
        (item) => text(item.status).trim() === text(status).trim(),
      );
      assert.ok(matches.length > 0);
      assert.deepEqual(
        matchDashboardTransactions(
          dashboardWalletTransactions,
          "",
          status,
          undefined,
          text,
        ),
        matches,
      );
    }
    assert.deepEqual(
      matchDashboardTransactions(
        dashboardWalletTransactions,
        "",
        completed,
        undefined,
        text,
      ),
      expected,
    );
    assert.deepEqual(
      matchDashboardTransactions(
        dashboardWalletTransactions,
        " PAYPAL ",
        undefined,
        undefined,
        text,
      ),
      [dashboardWalletTransactions[1]],
    );
    assert.deepEqual(
      matchDashboardTransactions(
        dashboardWalletTransactions,
        "Stripe",
        completed,
        undefined,
        text,
      ),
      expected.filter((item) => text(item.payment) === "Stripe"),
    );
    assert.deepEqual(
      matchDashboardTransactions(
        dashboardWalletTransactions,
        "",
        message("ui.desktop-catalog-filter-modal.all"),
        undefined,
        text,
      ),
      dashboardWalletTransactions,
    );
    assert.deepEqual(
      matchDashboardTransactions(
        dashboardWalletTransactions,
        "absent-record",
        undefined,
        undefined,
        text,
      ),
      [],
    );
  }
});

test("phone transaction sorting uses supplied dates and puts invalid dates last", () => {
  const text = (value: CatalogText) =>
    typeof value === "string" ? value : translate("en", value.message);
  const before = [...dashboardWalletTransactions];
  const newest = message(
    "reference.dynamic.dashboard-dropdowns.walletSort.options.1",
  );
  const oldest = message(
    "reference.dynamic.dashboard-dropdowns.walletSort.options.2",
  );
  assert.deepEqual(
    matchDashboardTransactions(
      dashboardWalletTransactions,
      "",
      undefined,
      newest,
      text,
    ),
    before.toReversed(),
  );
  assert.deepEqual(
    matchDashboardTransactions(
      dashboardWalletTransactions,
      "",
      undefined,
      oldest,
      text,
    ),
    before,
  );
  const missing = { ...before[0], key: "unknown-date", date: "unknown" };
  const items = [missing, ...before];
  assert.equal(
    matchDashboardTransactions(items, "", undefined, newest, text).at(-1),
    missing,
  );
  assert.equal(
    matchDashboardTransactions(items, "", undefined, oldest, text).at(-1),
    missing,
  );
  assert.deepEqual(dashboardWalletTransactions, before);
});
