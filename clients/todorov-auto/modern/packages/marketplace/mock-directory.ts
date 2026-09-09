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
      "phone": "+359888417282",
      "websiteUrl": "https://todorovauto.mobile.bg/"
    },
    "dealerOrgId": "dealer-todorov-auto",
    "description": "Демонстрационна извадка от публични обяви, наблюдавани на 09.09.2026 г. Не е потвърдена наличност в реално време.",
    "displayName": "Автосалон Тодоров",
    "headquarters": {
      "city": "Бургас",
      "countryCode": "BG"
    },
    "headline": "Автомобили в Бургас. Изберете, сравнете и уговорете оглед.",
    "id": "directory-todorov-auto",
    "inventory": {
      "activeListingCount": 10,
      "inTransitCount": 0,
      "localCount": 10,
      "orderableCount": 0,
      "sourceStockCount": 0
    },
    "orgType": "dealer",
    "profileImage": {
      "alt": "Автосалон Тодоров",
      "url": "/dealer/logo-light.png"
    },
    "representativeVehicles": [
      {
        "availability": "local",
        "href": "/listing/renault-captur-1-3-tce-intens-307272",
        "id": "11763371717307272",
        "image": {
          "url": "/dealer/stock/11763371717307272-1.webp",
          "alt": "Renault Captur 1.3 TCe Intens — снимка 1"
        },
        "price": {
          "amount": 16450,
          "currency": "EUR"
        },
        "title": "Renault Captur 1.3 TCe Intens"
      },
      {
        "availability": "local",
        "href": "/listing/nissan-micra-ig-t-acenta-xtronic-161812",
        "id": "11704208021161812",
        "image": {
          "url": "/dealer/stock/11704208021161812-1.webp",
          "alt": "Nissan Micra IG-T Acenta Xtronic — снимка 1"
        },
        "price": {
          "amount": 11950,
          "currency": "EUR"
        },
        "title": "Nissan Micra IG-T Acenta Xtronic"
      },
      {
        "availability": "local",
        "href": "/listing/nissan-leaf-2-zeroemission-980884",
        "id": "11735041255980884",
        "image": {
          "url": "/dealer/stock/11735041255980884-1.webp",
          "alt": "Nissan Leaf 2 ZeroEmission — снимка 1"
        },
        "price": {
          "amount": 11250,
          "currency": "EUR"
        },
        "title": "Nissan Leaf 2 ZeroEmission"
      }
    ],
    "slug": "todorov-auto",
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
  { city: "Бургас", countryCode: "BG" },
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
