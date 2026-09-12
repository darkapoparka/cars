import {
  type OrganizationDirectoryEntry,
  type OrganizationDirectoryType,
  type OrganizationInventoryAvailabilityKind,
  organizationDirectoryEntriesSchema,
} from "./directory";
import { getMockListingById } from "./mock-data";

const getRepresentativeVehicle = (
  listingId: string,
  availability: OrganizationInventoryAvailabilityKind
) => {
  const listing = getMockListingById(listingId);
  const image = listing?.images[0];

  if (!(listing && image)) {
    throw new Error(`Missing representative marketplace listing: ${listingId}`);
  }

  return {
    availability,
    href: `/listing/${listing.slug}`,
    id: listing.id,
    image: {
      alt: image.alt,
      url: image.url,
    },
    price: listing.price,
    title: listing.title,
  };
};

/**
 * Public directory fixtures for local/demo mode. Names that are not backed by
 * existing marketplace inventory are explicitly labelled as demos so they are
 * never presented as verified real-world businesses.
 */
export const mockOrganizationDirectoryCoreEntries =
  organizationDirectoryEntriesSchema.parse([
  {
    "brandCoverage": [],
    "claimStatus": "unclaimed",
    "contact": {
      "phone": "+359877333433",
      "websiteUrl": "https://success.mobile.bg/"
    },
    "dealerOrgId": "dealer-success-automobile",
    "description": "Демонстрационна извадка от публични обяви, наблюдавани на 09.09.2026 г. Не е потвърдена наличност в реално време.",
    "displayName": "Success Automobile",
    "headquarters": {
      "city": "Пловдив",
      "countryCode": "BG"
    },
    "headline": "Автомобили в Пловдив. Разгледайте детайлите и уговорете оглед.",
    "id": "directory-success-automobile",
    "inventory": {
      "activeListingCount": 10,
      "inTransitCount": 0,
      "localCount": 10,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Success Automobile",
      "url": "/dealer/logo-light.png"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/mercedes-benz-e-220-amg-880300",
        "id": "11788284441880300",
        "image": {
          "url": "/dealer/stock/11788284441880300-1.webp",
          "alt": "Mercedes-Benz E 220 AMG — снимка 1"
        },
        "price": {
          "amount": 20999,
          "currency": "EUR"
        },
        "title": "Mercedes-Benz E 220 AMG"
      },
      {
        "availability": "local",
        "href": "/listing/kia-niro-hybrid-592643",
        "id": "21787149042592643",
        "image": {
          "url": "/dealer/stock/21787149042592643-1.webp",
          "alt": "Kia Niro Hybrid — снимка 1"
        },
        "price": {
          "amount": 11999,
          "currency": "EUR"
        },
        "title": "Kia Niro Hybrid"
      },
      {
        "availability": "local",
        "href": "/listing/vw-alltrack-422780",
        "id": "11787147891422780",
        "image": {
          "url": "/dealer/stock/11787147891422780-1.webp",
          "alt": "VW Alltrack — снимка 1"
        },
        "price": {
          "amount": 16999,
          "currency": "EUR"
        },
        "title": "VW Alltrack"
      }
    ],
    "slug": "success-automobile",
    "tradeLanes": [],
    "verification": {
      "businessVerified": false,
      "inventoryCurrent": false,
      "trustedSupplier": false
    }
  }
]);

const scaleOrganizationTypes = [
  "dealer",
  "importer",
  "manufacturer",
  "distributor",
] as const satisfies readonly OrganizationDirectoryType[];

const scaleHeadquarters = [
  { city: "Пловдив", countryCode: "BG" },
  { city: "Plovdiv", countryCode: "BG" },
  { city: "Varna", countryCode: "BG" },
  { city: "Hamburg", countryCode: "DE" },
  { city: "Shanghai", countryCode: "CN" },
  { city: "Yokohama", countryCode: "JP" },
  { city: "Busan", countryCode: "KR" },
  { city: "Long Beach", countryCode: "US" },
] as const;

const getScaleInventory = (
  index: number
): OrganizationDirectoryEntry["inventory"] => {
  switch (index % 4) {
    case 1:
      return {
        activeListingCount: 0,
        inTransitCount: 0,
        localCount: 0,
        orderableCount: 1,
        sourceStockCount: 0,
      };
    case 2:
      return {
        activeListingCount: 0,
        inTransitCount: 0,
        localCount: 0,
        orderableCount: 0,
        sourceStockCount: 7,
      };
    case 3:
      return {
        activeListingCount: 0,
        inTransitCount: 12,
        localCount: 0,
        orderableCount: 9,
        sourceStockCount: 0,
      };
    default:
      return {
        activeListingCount: 0,
        inTransitCount: 0,
        localCount: 0,
        orderableCount: 0,
        sourceStockCount: 0,
      };
  }
};

const createScaleOrganization = (index: number): OrganizationDirectoryEntry => {
  const fixtureNumber = String(index + 1).padStart(3, "0");
  const orgType = scaleOrganizationTypes[index % scaleOrganizationTypes.length];
  const headquarters = scaleHeadquarters[index % scaleHeadquarters.length];
  const inventory = getScaleInventory(index);
  const hasSourcePreview = inventory.sourceStockCount > 0 && index % 5 === 2;
  const usesBulgarianLongName = index % 2 === 1;

  return {
    brandCoverage: [
      {
        authorizationVerified: false,
        brand: `Directory Demo Brand ${String((index % 16) + 1).padStart(2, "0")}`,
        relationship: "independent_importer",
      },
    ],
    claimStatus: "unclaimed",
    contact: {},
    description: usesBulgarianLongName
      ? "Детерминиран демонстрационен запис за проверка на търсене, филтриране, странициране и устойчиво подреждане при голяма бизнес директория."
      : "Deterministic demonstration record for validating search, filtering, pagination, and stable ordering in a large business directory.",
    displayName: usesBulgarianLongName
      ? `AutoMarket Директория Демо ${fixtureNumber} — Регионален център за автомобили, логистика и мобилност`
      : `AutoMarket Directory Demo ${fixtureNumber} — International Vehicle, Logistics and Mobility Centre`,
    headquarters: { ...headquarters },
    headline: usesBulgarianLongName
      ? "Демонстрационна организация с дълго име и ограничена тестова наличност"
      : "Demonstration organization with a long name and bounded test inventory",
    id: `directory-scale-demo-${fixtureNumber}`,
    inventory,
    orgType,
    ...(index % 3 === 0
      ? {
          profileImage: {
            alt: `Generic vehicle business artwork for directory scale demo ${fixtureNumber}`,
            url: `/images/avatars/organization-0${(index % 7) + 1}.webp`,
          },
        }
      : {}),
    representativeVehicles: hasSourcePreview
      ? [getRepresentativeVehicle("am-1009", "source_stock")]
      : [],
    slug: `directory-scale-demo-${fixtureNumber}`,
    tradeLanes:
      orgType === "importer" || orgType === "distributor"
        ? [
            {
              destinationCountryCode: "BG",
              originCountryCode: headquarters.countryCode,
              serviceKinds: ["inspection", "transport"],
              vehicleCategories: ["car"],
            },
          ]
        : [],
    verification: {
      businessVerified: false,
      inventoryCurrent: false,
      trustedSupplier: false,
    },
  };
};

export const createMockOrganizationDirectoryScaleEntries = (
  totalOrganizations = 120
) => {
  if (totalOrganizations < mockOrganizationDirectoryCoreEntries.length) {
    throw new Error(
      `Directory scale fixtures require at least ${mockOrganizationDirectoryCoreEntries.length} organizations`
    );
  }

  const generatedCount =
    totalOrganizations - mockOrganizationDirectoryCoreEntries.length;
  const generatedOrganizations = Array.from(
    { length: generatedCount },
    (_, index) => createScaleOrganization(index)
  );

  return organizationDirectoryEntriesSchema.parse([
    ...mockOrganizationDirectoryCoreEntries,
    ...generatedOrganizations,
  ]);
};

/**
 * Provider-free public demo data deliberately exercises the same bounded
 * paging path used by the database-backed directory. Synthetic scale records
 * are plainly labelled as demos and never receive verified/trusted status.
 */
export const mockOrganizationDirectoryEntries =
  mockOrganizationDirectoryCoreEntries;
