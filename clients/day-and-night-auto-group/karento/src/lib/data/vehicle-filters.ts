import type { PlainMessageKey } from "#lib/i18n/text.ts";
export interface VehicleFilterChoice {
  readonly id: string;
  readonly label: string;
  readonly labelKey?: PlainMessageKey;
  readonly active: boolean;
}
export interface VehicleFilter {
  readonly id: string;
  readonly label: string;
  readonly labelKey?: PlainMessageKey;
  readonly choices: readonly VehicleFilterChoice[];
}
export const popularVehicleFilters = [
  {
    id: "popular-filter-1",
    label: "Categories",
    labelKey: "reference.listing.filter.categories",
    choices: [
      {
        id: "filter-0-Sedan",
        label: "Sedan",
        labelKey: "reference.listing.filter.sedan",
        active: true,
      },
      {
        id: "filter-1-SUVs",
        label: "SUVs",
        labelKey: "reference.listing.filter.suv",
        active: false,
      },
      {
        id: "filter-2-Coupes",
        label: "Coupes",
        labelKey: "reference.listing.filter.coupes",
        active: false,
      },
      {
        id: "filter-3-Hatchbacks",
        label: "Hatchbacks",
        labelKey: "reference.listing.filter.hatchbacks",
        active: false,
      },
      {
        id: "filter-4-Trucks",
        label: "Trucks",
        labelKey: "reference.listing.filter.trucks",
        active: false,
      },
      {
        id: "filter-5-Minivan",
        label: "Minivan",
        labelKey: "reference.listing.filter.minivan",
        active: false,
      },
      {
        id: "filter-6-Sport",
        label: "Sport",
        labelKey: "reference.listing.filter.sport",
        active: false,
      },
      {
        id: "filter-7-Cross-over",
        label: "Cross-over",
        labelKey: "reference.listing.filter.crossover",
        active: false,
      },
    ],
  },
  {
    id: "popular-filter-2",
    label: "Fuel Type",
    labelKey: "reference.listing.filter.fuel",
    choices: [
      {
        id: "filter-0-Plug-in Hybrid (PHEV)",
        label: "Plug-in Hybrid (PHEV)",
        labelKey: "reference.listing.filter.phev",
        active: true,
      },
      {
        id: "filter-1-Hybrid (HEV)",
        label: "Hybrid (HEV)",
        labelKey: "reference.listing.filter.hev",
        active: false,
      },
      {
        id: "filter-2-Electric Vehicle (EV)",
        label: "Electric Vehicle (EV)",
        labelKey: "reference.listing.filter.ev",
        active: false,
      },
      {
        id: "filter-3-Diesel",
        label: "Diesel",
        labelKey: "reference.listing.filter.diesel",
        active: false,
      },
      {
        id: "filter-4-Gasoline/Petrol",
        label: "Gasoline/Petrol",
        labelKey: "reference.listing.filter.petrol",
        active: false,
      },
      {
        id: "filter-5-Hydrogen",
        label: "Hydrogen",
        labelKey: "reference.listing.filter.hydrogen",
        active: false,
      },
    ],
  },
  {
    id: "popular-filter-3",
    label: "Review / Rating",
    labelKey: "reference.listing.filter.rating",
    choices: [
      {
        id: "filter-0-Newest",
        label: "Newest",
        labelKey: "reference.listing.filter.newest",
        active: true,
      },
      {
        id: "filter-1-Oldest",
        label: "Oldest",
        labelKey: "reference.listing.filter.oldest",
        active: false,
      },
    ],
  },
  {
    id: "popular-filter-4",
    label: "Price range",
    labelKey: "reference.listing.filter.price",
    choices: [
      {
        id: "filter-0-$10 - $100",
        label: "$10 - $100",
        active: true,
      },
      {
        id: "filter-1-$100 - $1.000",
        label: "$100 - $1.000",
        active: false,
      },
      {
        id: "filter-2-$1.000 - $10.000",
        label: "$1.000 - $10.000",
        active: false,
      },
    ],
  },
] as const satisfies readonly VehicleFilter[];
