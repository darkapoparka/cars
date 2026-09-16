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
    image: { alt: image.alt, url: image.url },
    price: listing.price,
    title: listing.title,
  };
};

/** Verified public IS AUTO identity plus plainly labelled synthetic scale records. */
export const mockOrganizationDirectoryCoreEntries =
  organizationDirectoryEntriesSchema.parse([
    {
      brandCoverage: [
        { authorizationVerified: false, brand: "Audi", relationship: "independent_importer" },
        { authorizationVerified: false, brand: "BMW", relationship: "independent_importer" },
      ],
      claimStatus: "unclaimed",
      contact: {
        email: "varna@isauto.net",
        phone: "+359899266666",
        websiteUrl: "https://www.isauto.net/",
      },
      dealerOrgId: "dealer-isauto-varna",
      description: "Публичен профил на IS AUTO Varna с шест автомобила от официалния сайт, локализирани за този демонстрационен проект.",
      displayName: "IS AUTO Varna",
      headquarters: { city: "Варна", countryCode: "BG" },
      headline: "Подбрани автомобили в Бизнес парк Варна",
      id: "directory-isauto-varna",
      inventory: {
        activeListingCount: 6,
        inTransitCount: 0,
        lastConfirmedAt: "2026-09-16T08:00:00.000Z",
        localCount: 6,
        orderableCount: 0,
        sourceStockCount: 0,
      },
      orgType: "dealer",
      profileImage: {
        alt: "IS AUTO Varna в Бизнес парк Варна",
        url: "/isauto/hero.webp",
      },
      representativeVehicles: [
        getRepresentativeVehicle("is-1001", "local"),
        getRepresentativeVehicle("is-1002", "local"),
        getRepresentativeVehicle("is-1003", "local"),
      ],
      slug: "isauto-varna",
      tradeLanes: [],
      verification: {
        businessVerified: true,
        inventoryCurrent: true,
        trustedSupplier: false,
      },
    },
  ]);

const scaleOrganizationTypes = [
  "dealer",
  "importer",
  "manufacturer",
  "distributor",
] as const satisfies readonly OrganizationDirectoryType[];

const scaleHeadquarters = [
  { city: "Sofia", countryCode: "BG" },
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
            url: `/variant-2/images/avatars/organization-0${(index % 7) + 1}.webp`,
          },
        }
      : {}),
    representativeVehicles: hasSourcePreview
      ? [getRepresentativeVehicle("is-1002", "source_stock")]
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
  createMockOrganizationDirectoryScaleEntries();
