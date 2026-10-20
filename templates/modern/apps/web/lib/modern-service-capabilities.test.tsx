import { mockListings } from "@repo/marketplace";
import type { ReactNode } from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const capability = vi.hoisted(() => ({ imports: false, lease: false }));
const financeLink = /href="[^"]*\/lease(?:\?|&|"|\/)/;
const financeVehicleLink = /href="[^"]*\/lease\?/;
const unsupportedServiceClaim =
  /in-house|собствен лизинг|Imports|Внос|Leasing|Лизинг|финансиране|finance/i;
const inHouseClaim = /in-house|собствен/i;
const importTitle = /Imports|Внос/;
const financeTitle = /Financing|Финансиране/;
const serviceMetadataClaim = /import|finance|внос|финансиране/i;
const chinaImportLink = /href="[^"]*\/imports\/china/;
const chinaImportPromise = /услугата ни за внос|our.*import service/i;
vi.mock("@/lib/public-marketplace-data", () => ({
  getChineseEvHybridCollection: vi.fn(async () => ({
    totalListings: 0,
    listings: [],
  })),
  PUBLIC_LISTING_PAGE_SIZE: 24,
}));
vi.mock("@/lib/public-url", () => ({
  getPublicWebBaseUrl: () => "https://dealer.example",
}));
vi.mock("@/lib/public-site-access", () => ({ requirePublicSitePath: vi.fn() }));
vi.mock("@/lib/public-metadata", () => ({
  createPublicLocalizedMetadata: (value: unknown) => value,
  getPublicInventoryRobots: () => ({ index: false, follow: false }),
}));
vi.mock("../app/[locale]/components/public-marketplace-frame", () => ({
  PublicMarketplaceFrame: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("../app/[locale]/components/public-inventory-list", () => ({
  PublicInventoryList: () => null,
}));
vi.mock("@repo/marketplace/site-config", async (original) => {
  const actual =
    await original<typeof import("@repo/marketplace/site-config")>();
  return {
    ...actual,
    publicSite: {
      ...actual.publicSite,
      identity: { ...actual.publicSite.identity, desktopPreview: undefined },
      services: {
        ...actual.publicSite.services,
        get imports() {
          return capability.imports;
        },
        get lease() {
          return capability.lease;
        },
      },
    },
  };
});

import { ListingDetailContent } from "../../../packages/marketplace-ui/components/listing-detail-content";
import { SellerTransactionCard } from "../../../packages/marketplace-ui/components/seller-transaction-card";
import ChineseCollection from "../app/[locale]/collections/chinese-ev-hybrids/page";
import { getContactServiceCopy, pageCopy } from "../app/[locale]/contact/copy";
import { generateMetadata as servicesMetadata } from "../app/[locale]/services/page";

beforeEach(() => {
  capability.imports = false;
  capability.lease = false;
});
const listing = { ...mockListings[0], category: "car" as const };
const renderDetail = (locale: string) =>
  renderToStaticMarkup(
    createElement(ListingDetailContent, {
      backHref: "/en/cars",
      listing,
      locale,
      price: listing.price,
      relatedListings: [],
      trustEvidence: [],
    })
  );
const renderSeller = (locale: string) =>
  renderToStaticMarkup(
    createElement(SellerTransactionCard, {
      listing,
      locale,
      contactHref: "/contact",
    })
  );

describe("Modern generated dealer service capabilities", () => {
  it.each([
    "en",
    "bg",
  ])("removes mobile and desktop finance links when disabled (%s)", (locale) => {
    expect(renderDetail(locale)).not.toMatch(financeLink);
    expect(renderSeller(locale)).not.toMatch(financeLink);
    expect(renderSeller(locale)).toContain("listing-transaction-card");
    expect(renderSeller(locale)).toContain("/contact");
  });
  it.each([
    "en",
    "bg",
  ])("preserves the existing finance artwork and purchase options when enabled (%s)", (locale) => {
    capability.lease = true;
    expect(renderDetail(locale)).toMatch(financeVehicleLink);
    expect(renderSeller(locale)).toContain("listing-purchase-options");
    expect(renderSeller(locale)).toContain("content-finance");
    expect(renderDetail(locale)).toContain("lg:hidden");
  });
  it.each([
    "en",
    "bg",
  ] as const)("does not assert unsupported services in shared contact copy (%s)", (locale) => {
    const copy = getContactServiceCopy(locale, {
      imports: false,
      lease: false,
    });
    expect(Object.values(copy).join(" ")).not.toMatch(unsupportedServiceClaim);
    expect(
      pageCopy[locale].services.find((service) => service.href === "/lease")
        ?.title
    ).not.toMatch(inHouseClaim);
  });
  it.each([
    "en",
    "bg",
  ] as const)("keeps sourced import and finance enquiry copy independent (%s)", (locale) => {
    const imports = getContactServiceCopy(locale, {
      imports: true,
      lease: false,
    });
    const finance = getContactServiceCopy(locale, {
      imports: false,
      lease: true,
    });
    expect(imports.title).toMatch(importTitle);
    expect(imports.title).not.toMatch(financeTitle);
    expect(finance.title).toMatch(financeTitle);
    expect(finance.title).not.toMatch(importTitle);
    expect(JSON.stringify(finance)).not.toMatch(inHouseClaim);
  });
  it("keeps all enabled capabilities without claiming an in-house lender", () => {
    const copy = getContactServiceCopy("en", { imports: true, lease: true });
    expect(copy.title).toBe("Premium vehicles. Imports. Financing.");
    expect(copy.servicesDescription).toBe(
      "From a vehicle in stock to an import on request, our team is one call away."
    );
  });
  it.each([
    "en",
    "bg",
  ])("does not advertise unsupported services in service metadata (%s)", async (locale) => {
    const metadata = await servicesMetadata({
      params: Promise.resolve({ locale }),
    });
    expect(metadata.description).not.toMatch(serviceMetadataClaim);
  });
  it.each([
    "en",
    "bg",
  ])("gates the real empty collection import CTA and promise (%s)", async (locale) => {
    const props = {
      params: Promise.resolve({ locale }),
      searchParams: Promise.resolve({}),
    };
    const disabled = renderToStaticMarkup(await ChineseCollection(props));
    expect(disabled).not.toMatch(chinaImportLink);
    expect(disabled).not.toMatch(chinaImportPromise);
    capability.imports = true;
    const enabled = renderToStaticMarkup(await ChineseCollection(props));
    expect(enabled).toMatch(chinaImportLink);
  });
});
