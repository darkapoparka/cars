import { message, type CatalogText } from "#lib/i18n/text.ts";
import type { HTMLInputAttributes } from "svelte/elements";
import type { RentalRow, ListingProduct } from "#lib/data/vehicle-listing.ts";
import type { VehicleCardContent } from "#lib/content.ts";
export interface DashboardPreferenceGroup {
  id: string;
  title: CatalogText;
  description: CatalogText;
  logo?: string;
  logoAlt?: string;
  logoClass?: string;
  toggleContainerClass: string;
  toggleClass: string;
  toggles: readonly {
    suffix: string;
    label: CatalogText;
    checked: boolean;
    ariaLabel: string;
  }[];
}
export interface DashboardWalletTransaction {
  key: string;
  payment: CatalogText;
  direction: CatalogText;
  date: string;
  amount: string;
  amountClass: string;
  balance: string;
  status: CatalogText;
  statusClass: string;
}
export interface DashboardRecentBooking {
  id: string;
  image: string;
  imageAlt: string;
  title: string;
  label: string;
  location: CatalogText;
  date: CatalogText;
  time: CatalogText;
}
export interface DashboardNotification {
  id: string;
  badgeClass: string;
  iconClass: string;
  title: CatalogText;
  time: CatalogText;
  lead: CatalogText;
  emphasis?: string;
  tail?: CatalogText;
}
export type DashboardAudience = "member" | "owner";
export interface DashboardDropdownConfig {
  initial: CatalogText;
  toggleClass: string;
  toggleLabel: CatalogText;
  menuClass: string;
  iconClass: string;
  options: readonly CatalogText[];
}
export interface DashboardField {
  id?: string;
  columnClass: string;
  label?: CatalogText;
  labelClass?: string;
  labelOutside: boolean;
  control: "input" | "textarea";
  type?: HTMLInputAttributes["type"];
  placeholder: CatalogText;
  value?: string;
  rows?: number;
  ariaLabel: CatalogText;
}
export interface DashboardBooking {
  key: string;
  id: string;
  image: string;
  imageAlt: string;
  vehicleHref: string;
  vehicleTitle: string;
  vehicleLabel: string;
  vehicleType: CatalogText;
  travellers: CatalogText;
  days: CatalogText;
  price: string;
  date: string;
  status: CatalogText;
  statusClass: string;
  statusIcon: string;
  actionTarget?: string;
}
export interface DashboardStat {
  key: string;
  columnClass: string;
  layoutClass: string;
  badgeClass: string;
  iconClass: string;
  title: CatalogText;
  value: string;
  valuePrefix: string;
  valueSuffix: CatalogText;
  count?: string;
  countClass?: string;
  change?: string;
  changeClass?: string;
  changeIcon?: string;
  period?: CatalogText;
}
/** Readonly reference account data for the clearly marked, unsaved preview screens. */
export const dashboardAudiences = {
  member: {
    label: message("reference.dynamic.dashboard-audiences.member.label"),
    noticeTitle: message(
      "reference.dynamic.dashboard-audiences.member.noticeTitle",
    ),
    name: "Steven Jobs",
    since: message("reference.dynamic.dashboard-audiences.member.since"),
    avatar: "/assets/imgs/section-1/img-2.png",
    brandLight: "",
    brandDark: "",
    settingsHref: "/account/settings",
    links: [
      {
        href: "/account",
        label: message(
          "reference.dynamic.dashboard-audiences.member.links.1.label",
        ),
        icon: "fi fi-rr-home me-1",
      },
      {
        href: "/account/bookings",
        label: message(
          "reference.dynamic.dashboard-audiences.member.links.2.label",
        ),
        icon: "fi fi-rr-calendar me-1",
      },
      {
        href: "/account/wishlist",
        label: message(
          "reference.dynamic.dashboard-audiences.member.links.3.label",
        ),
        icon: "fi fi-rr-heart me-1",
      },
      {
        href: "/account/wallet",
        label: message(
          "reference.dynamic.dashboard-audiences.member.links.4.label",
        ),
        icon: "fi fi-rr-money me-1",
      },
      {
        href: "/account/profile",
        label: message(
          "reference.dynamic.dashboard-audiences.member.links.5.label",
        ),
        icon: "fi fi-rr-user me-1",
      },
      {
        href: "/account/settings",
        label: message(
          "reference.dynamic.dashboard-audiences.member.links.6.label",
        ),
        icon: "fi fi-rr-settings me-1",
      },
    ],
  },
  owner: {
    label: message("reference.dynamic.dashboard-audiences.owner.label"),
    noticeTitle: message(
      "reference.dynamic.dashboard-audiences.owner.noticeTitle",
    ),
    name: "Honda London",
    since: message("reference.dynamic.dashboard-audiences.owner.since"),
    avatar: "/assets/imgs/page/homepage2/honda.png",
    brandLight: "/assets/imgs/page/homepage2/honda.png",
    brandDark: "/assets/imgs/page/homepage2/honda-w.png",
    settingsHref: "/dashboard/settings",
    links: [
      {
        href: "/dashboard",
        label: message(
          "reference.dynamic.dashboard-audiences.owner.links.1.label",
        ),
        icon: "fi fi-rr-home me-1",
      },
      {
        href: "/dashboard/listings",
        label: message(
          "reference.dynamic.dashboard-audiences.owner.links.2.label",
        ),
        icon: "fi fi-rr-calendar me-1",
      },
      {
        href: "/dashboard/add-listing",
        label: message(
          "reference.dynamic.dashboard-audiences.owner.links.3.label",
        ),
        icon: "fi fi-rr-heart me-1",
      },
      {
        href: "/dashboard/earnings",
        label: message(
          "reference.dynamic.dashboard-audiences.owner.links.4.label",
        ),
        icon: "fi fi-rr-money me-1",
      },
      {
        href: "/dashboard/settings",
        label: message(
          "reference.dynamic.dashboard-audiences.owner.links.5.label",
        ),
        icon: "fi fi-rr-settings me-1",
      },
    ],
  },
} as const;

export const dashboardDropdowns = {
  walletStatus: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.walletStatus.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.walletStatus.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-steering-wheel me-2",
    options: [
      message("reference.dynamic.dashboard-dropdowns.walletStatus.options.1"),
      message("reference.dynamic.dashboard-dropdowns.walletStatus.options.2"),
      message("reference.dynamic.dashboard-dropdowns.walletStatus.options.3"),
    ],
  },
  walletSort: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.walletSort.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.walletSort.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message("reference.dynamic.dashboard-dropdowns.walletSort.options.1"),
      message("reference.dynamic.dashboard-dropdowns.walletSort.options.2"),
      message("reference.dynamic.dashboard-dropdowns.walletSort.options.3"),
      message("reference.dynamic.dashboard-dropdowns.walletSort.options.4"),
      message("reference.dynamic.dashboard-dropdowns.walletSort.options.5"),
    ],
  },
  wishlistVehicleType: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.wishlistVehicleType.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.wishlistVehicleType.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-steering-wheel me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.wishlistVehicleType.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.wishlistVehicleType.options.2",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.wishlistVehicleType.options.3",
      ),
    ],
  },
  wishlistSort: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.wishlistSort.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.wishlistSort.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message("reference.dynamic.dashboard-dropdowns.wishlistSort.options.1"),
      message("reference.dynamic.dashboard-dropdowns.wishlistSort.options.2"),
      message("reference.dynamic.dashboard-dropdowns.wishlistSort.options.3"),
      message("reference.dynamic.dashboard-dropdowns.wishlistSort.options.4"),
      message("reference.dynamic.dashboard-dropdowns.wishlistSort.options.5"),
    ],
  },
  bookingsVehicleType: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.bookingsVehicleType.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.bookingsVehicleType.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-steering-wheel me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.bookingsVehicleType.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.bookingsVehicleType.options.2",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.bookingsVehicleType.options.3",
      ),
    ],
  },
  bookingsSort: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.bookingsSort.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.bookingsSort.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message("reference.dynamic.dashboard-dropdowns.bookingsSort.options.1"),
      message("reference.dynamic.dashboard-dropdowns.bookingsSort.options.2"),
      message("reference.dynamic.dashboard-dropdowns.bookingsSort.options.3"),
      message("reference.dynamic.dashboard-dropdowns.bookingsSort.options.4"),
      message("reference.dynamic.dashboard-dropdowns.bookingsSort.options.5"),
    ],
  },
  earningsPeriod: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.earningsPeriod.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.earningsPeriod.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message("reference.dynamic.dashboard-dropdowns.earningsPeriod.options.1"),
      message("reference.dynamic.dashboard-dropdowns.earningsPeriod.options.2"),
      message("reference.dynamic.dashboard-dropdowns.earningsPeriod.options.3"),
      message("reference.dynamic.dashboard-dropdowns.earningsPeriod.options.4"),
    ],
  },
  invoicesPeriod: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.invoicesPeriod.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.invoicesPeriod.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message("reference.dynamic.dashboard-dropdowns.invoicesPeriod.options.1"),
      message("reference.dynamic.dashboard-dropdowns.invoicesPeriod.options.2"),
    ],
  },
  notificationsScope: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.notificationsScope.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.notificationsScope.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.notificationsScope.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.notificationsScope.options.2",
      ),
    ],
  },
  recentBookingsPeriod: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.recentBookingsPeriod.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.recentBookingsPeriod.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.recentBookingsPeriod.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.recentBookingsPeriod.options.2",
      ),
    ],
  },
  ownerListingsVehicleType: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.ownerListingsVehicleType.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.ownerListingsVehicleType.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-steering-wheel me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsVehicleType.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsVehicleType.options.2",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsVehicleType.options.3",
      ),
    ],
  },
  ownerListingsSort: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.ownerListingsSort.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm neutral-500 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.ownerListingsSort.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsSort.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsSort.options.2",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsSort.options.3",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsSort.options.4",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.ownerListingsSort.options.5",
      ),
    ],
  },
  bookingsChartPeriod: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.bookingsChartPeriod.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.bookingsChartPeriod.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.bookingsChartPeriod.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.bookingsChartPeriod.options.2",
      ),
    ],
  },
  earningTransactionsPeriod: {
    initial: message(
      "reference.dynamic.dashboard-dropdowns.earningTransactionsPeriod.initial",
    ),
    toggleClass:
      "dropdown-toggle btn btn-sort bg-neutral-100 btn-sm text-gray-6 rounded-pill fw-normal fs-8 d-inline-flex align-items-center",
    toggleLabel: message(
      "reference.dynamic.dashboard-dropdowns.earningTransactionsPeriod.toggleLabel",
    ),
    menuClass: "dropdown-menu small dropdown-menu-end p-2 ",
    iconClass: "fi fi-rr-filter-list me-2",
    options: [
      message(
        "reference.dynamic.dashboard-dropdowns.earningTransactionsPeriod.options.1",
      ),
      message(
        "reference.dynamic.dashboard-dropdowns.earningTransactionsPeriod.options.2",
      ),
    ],
  },
} as const satisfies Readonly<Record<string, DashboardDropdownConfig>>;

export const dashboardFields = {
  memberFullName: {
    id: "field-49bbf3aa-0",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-0.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "Steven Job",
    ariaLabel: "Steven Job",
  },
  memberEmail: {
    id: "field-49bbf3aa-1",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-1.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "stevenjob@gmail.com",
    ariaLabel: "stevenjob@gmail.com",
  },
  memberContactNumber: {
    id: "field-49bbf3aa-2",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-2.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-2.placeholder",
    ),
    value: "01 - 234 567 89",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-2.ariaLabel",
    ),
  },
  memberWebsite: {
    id: "field-49bbf3aa-3",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-3.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "https://alithemes.com",
    ariaLabel: "https://alithemes.com",
  },
  memberBio: {
    id: "field-49bbf3aa-4",
    columnClass: "col-lg-12",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-4.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "textarea",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-4.placeholder",
    ),
    value:
      "We are AliThemes , a creative and dedicated group of individuals who love web development almost as much as we love our customers. We are passionate team with the mission for achieving the perfection in web design.",
    rows: 6,
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-4.ariaLabel",
    ),
  },
  memberLanguages: {
    id: "field-49bbf3aa-5",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-5.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "",
    value: "English, French",
    ariaLabel: "field-49bbf3aa-5",
  },
  memberNationality: {
    id: "field-49bbf3aa-6",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-6.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-6.placeholder",
    ),
    value: "France",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-6.ariaLabel",
    ),
  },
  memberCountry: {
    id: "field-49bbf3aa-7",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-7.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-7.placeholder",
    ),
    value: "United States of America",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-7.ariaLabel",
    ),
  },
  memberCity: {
    id: "field-49bbf3aa-8",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-8.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-8.placeholder",
    ),
    value: "Chicago",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-8.ariaLabel",
    ),
  },
  memberAddress: {
    id: "field-49bbf3aa-9",
    columnClass: "col-lg-12",
    label: message("reference.dynamic.dashboard-fields.field-49bbf3aa-9.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-9.placeholder",
    ),
    value: "205 North Michigan Avenue, Suite 810, Chicago, 60601, USA",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-9.ariaLabel",
    ),
  },
  memberMap: {
    id: "field-49bbf3aa-10",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-10.label",
    ),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-10.placeholder",
    ),
    value: "205 North Michigan Avenue, Suite 810, Chicago, 60601, USA",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-10.ariaLabel",
    ),
  },
  memberLatitude: {
    id: "field-49bbf3aa-11",
    columnClass: "col-lg-6",
    label: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-11.label",
    ),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-11.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-11.ariaLabel",
    ),
  },
  memberLongitude: {
    id: "field-49bbf3aa-12",
    columnClass: "col-lg-6",
    label: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-12.label",
    ),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-12.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-12.ariaLabel",
    ),
  },
  memberFacebook: {
    id: "field-49bbf3aa-13",
    columnClass: "col-lg-12",
    label: "Facebook",
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "text",
    placeholder: "https://www.facebook.com",
    ariaLabel: "https://www.facebook.com",
  },
  memberTwitter: {
    id: "field-49bbf3aa-14",
    columnClass: "col-lg-12",
    label: "Twitter",
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "text",
    placeholder: "https://twitter.com",
    ariaLabel: "https://twitter.com",
  },
  memberInstagram: {
    id: "field-49bbf3aa-15",
    columnClass: "col-lg-12",
    label: "Instagram",
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "text",
    placeholder: "https://www.instagram.com",
    ariaLabel: "https://www.instagram.com",
  },
  memberOldPassword: {
    id: "field-49bbf3aa-16",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-16.label",
    ),
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "password",
    placeholder: "*************",
    ariaLabel: "*************",
  },
  memberNewPassword: {
    id: "field-49bbf3aa-17",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-17.label",
    ),
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "password",
    placeholder: "*************",
    ariaLabel: "*************",
  },
  memberConfirmPassword: {
    id: "field-49bbf3aa-18",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-49bbf3aa-18.label",
    ),
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "password",
    placeholder: "*************",
    ariaLabel: "*************",
  },
  ownerFullName: {
    id: "field-2c5ad6f8-0",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-0.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "Steven Job",
    ariaLabel: "Steven Job",
  },
  ownerEmail: {
    id: "field-2c5ad6f8-1",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-1.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "stevenjob@gmail.com",
    ariaLabel: "stevenjob@gmail.com",
  },
  ownerContactNumber: {
    id: "field-2c5ad6f8-2",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-2.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-2.placeholder",
    ),
    value: "01 - 234 567 89",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-2.ariaLabel",
    ),
  },
  ownerWebsite: {
    id: "field-2c5ad6f8-3",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-3.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "https://alithemes.com",
    ariaLabel: "https://alithemes.com",
  },
  ownerBio: {
    id: "field-2c5ad6f8-4",
    columnClass: "col-lg-12",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-4.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "textarea",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-4.placeholder",
    ),
    value:
      "We are AliThemes , a creative and dedicated group of individuals who love web development almost as much as we love our customers. We are passionate team with the mission for achieving the perfection in web design.",
    rows: 6,
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-4.ariaLabel",
    ),
  },
  ownerLanguages: {
    id: "field-2c5ad6f8-5",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-5.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: "",
    value: "English, French",
    ariaLabel: "field-2c5ad6f8-5",
  },
  ownerNationality: {
    id: "field-2c5ad6f8-6",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-6.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-6.placeholder",
    ),
    value: "France",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-6.ariaLabel",
    ),
  },
  ownerCountry: {
    id: "field-2c5ad6f8-7",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-7.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-7.placeholder",
    ),
    value: "United States of America",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-7.ariaLabel",
    ),
  },
  ownerCity: {
    id: "field-2c5ad6f8-8",
    columnClass: "col-lg-6",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-8.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-8.placeholder",
    ),
    value: "Chicago",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-8.ariaLabel",
    ),
  },
  ownerAddress: {
    id: "field-2c5ad6f8-9",
    columnClass: "col-lg-12",
    label: message("reference.dynamic.dashboard-fields.field-2c5ad6f8-9.label"),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-9.placeholder",
    ),
    value: "205 North Michigan Avenue, Suite 810, Chicago, 60601, USA",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-9.ariaLabel",
    ),
  },
  ownerMap: {
    id: "field-2c5ad6f8-10",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-10.label",
    ),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-10.placeholder",
    ),
    value: "205 North Michigan Avenue, Suite 810, Chicago, 60601, USA",
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-10.ariaLabel",
    ),
  },
  ownerLatitude: {
    id: "field-2c5ad6f8-11",
    columnClass: "col-lg-6",
    label: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-11.label",
    ),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-11.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-11.ariaLabel",
    ),
  },
  ownerLongitude: {
    id: "field-2c5ad6f8-12",
    columnClass: "col-lg-6",
    label: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-12.label",
    ),
    labelClass: "text-sm-medium neutral-500 mb-10",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-12.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-12.ariaLabel",
    ),
  },
  ownerFacebook: {
    id: "field-2c5ad6f8-13",
    columnClass: "col-lg-12",
    label: "Facebook",
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "text",
    placeholder: "https://www.facebook.com",
    ariaLabel: "https://www.facebook.com",
  },
  ownerTwitter: {
    id: "field-2c5ad6f8-14",
    columnClass: "col-lg-12",
    label: "Twitter",
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "text",
    placeholder: "https://twitter.com",
    ariaLabel: "https://twitter.com",
  },
  ownerInstagram: {
    id: "field-2c5ad6f8-15",
    columnClass: "col-lg-12",
    label: "Instagram",
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "text",
    placeholder: "https://www.instagram.com",
    ariaLabel: "https://www.instagram.com",
  },
  ownerOldPassword: {
    id: "field-2c5ad6f8-16",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-16.label",
    ),
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "password",
    placeholder: "*************",
    ariaLabel: "*************",
  },
  ownerNewPassword: {
    id: "field-2c5ad6f8-17",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-17.label",
    ),
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "password",
    placeholder: "*************",
    ariaLabel: "*************",
  },
  ownerConfirmPassword: {
    id: "field-2c5ad6f8-18",
    columnClass: "col-lg-12",
    label: message(
      "reference.dynamic.dashboard-fields.field-2c5ad6f8-18.label",
    ),
    labelClass: "lbl-checkbox text-sm-medium neutral-500",
    labelOutside: true,
    control: "input",
    type: "password",
    placeholder: "*************",
    ariaLabel: "*************",
  },
  listingPrice: {
    columnClass: "col-lg-12",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingPrice.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingPrice.ariaLabel",
    ),
  },
  listingTitle: {
    columnClass: "col-lg-12",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingTitle.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingTitle.ariaLabel",
    ),
  },
  listingModel: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingModel.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingModel.ariaLabel",
    ),
  },
  listingType: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingType.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingType.ariaLabel",
    ),
  },
  listingCondition: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingCondition.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingCondition.ariaLabel",
    ),
  },
  listingStockNumber: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingStockNumber.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingStockNumber.ariaLabel",
    ),
  },
  listingMileage: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingMileage.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingMileage.ariaLabel",
    ),
  },
  listingTransmission: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingTransmission.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingTransmission.ariaLabel",
    ),
  },
  listingDescription: {
    columnClass: "col-lg-12",
    labelOutside: false,
    control: "textarea",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingDescription.placeholder",
    ),
    rows: 6,
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingDescription.ariaLabel",
    ),
  },
  listingCountry: {
    columnClass: "col-lg-12",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingCountry.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingCountry.ariaLabel",
    ),
  },
  listingRegion: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingRegion.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingRegion.ariaLabel",
    ),
  },
  listingState: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingState.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingState.ariaLabel",
    ),
  },
  listingCity: {
    columnClass: "col-lg-4",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingCity.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingCity.ariaLabel",
    ),
  },
  listingAddress: {
    columnClass: "col-lg-12",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingAddress.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingAddress.ariaLabel",
    ),
  },
  listingAddressLine2: {
    columnClass: "col-lg-12",
    labelOutside: false,
    control: "input",
    type: "text",
    placeholder: message(
      "reference.dynamic.dashboard-fields.listingAddressLine2.placeholder",
    ),
    ariaLabel: message(
      "reference.dynamic.dashboard-fields.listingAddressLine2.ariaLabel",
    ),
  },
} as const satisfies Readonly<Record<string, DashboardField>>;

export const dashboardBookingRows = {
  memberBookings: [
    {
      key: "#CR-2356:/assets/imgs/cars-listing/cars-listing-6/car-1.png",
      id: "#CR-2356",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Volkswagen Amarok",
      vehicleLabel: "Volkswagen Amarok",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-1-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-1-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-1-png.days",
      ),
      price: "$1,569",
      date: "15 May 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-1-png.status",
      ),
      statusClass:
        "badge badge-info rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#upcoming",
    },
    {
      key: "#CR-2356:/assets/imgs/cars-listing/cars-listing-6/car-2.png",
      id: "#CR-2356",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Toyota Camry SE 400",
      vehicleLabel: "Toyota Camry SE 400",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-2-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-2-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-2-png.days",
      ),
      price: "$1,745",
      date: "20 May 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-2-png.status",
      ),
      statusClass:
        "badge badge-info rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#upcoming",
    },
    {
      key: "#CR-6536:/assets/imgs/cars-listing/cars-listing-6/car-3.png",
      id: "#CR-6536",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Ford Mustang 4.0 AT",
      vehicleLabel: "Ford Mustang 4.0 AT",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-6536-assets-imgs-cars-listing-cars-listing-6-car-3-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-6536-assets-imgs-cars-listing-cars-listing-6-car-3-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-6536-assets-imgs-cars-listing-cars-listing-6-car-3-png.days",
      ),
      price: "$2,160",
      date: "04 Jun 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-6536-assets-imgs-cars-listing-cars-listing-6-car-3-png.status",
      ),
      statusClass:
        "badge badge-info rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#upcoming",
    },
    {
      key: "#CR-8677:/assets/imgs/cars-listing/cars-listing-6/car-4.png",
      id: "#CR-8677",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Ferrari 458 MM Special",
      vehicleLabel:
        "Ferrari 458 MM\n                                                                                Special",
      vehicleType: "SUV",
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-8677-assets-imgs-cars-listing-cars-listing-6-car-4-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-8677-assets-imgs-cars-listing-cars-listing-6-car-4-png.days",
      ),
      price: "$1,840",
      date: "17 Jun 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-8677-assets-imgs-cars-listing-cars-listing-6-car-4-png.status",
      ),
      statusClass:
        "badge badge-warning rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#pending",
    },
    {
      key: "#CR-5654:/assets/imgs/cars-listing/cars-listing-6/car-5.png",
      id: "#CR-5654",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-5.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "\u00a0Mercedes-benz",
      vehicleLabel: "Mercedes-benz",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5654-assets-imgs-cars-listing-cars-listing-6-car-5-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5654-assets-imgs-cars-listing-cars-listing-6-car-5-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5654-assets-imgs-cars-listing-cars-listing-6-car-5-png.days",
      ),
      price: "$1,450",
      date: "25 Jun 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5654-assets-imgs-cars-listing-cars-listing-6-car-5-png.status",
      ),
      statusClass:
        "badge badge-info rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#upcoming",
    },
    {
      key: "#CR-3243:/assets/imgs/cars-listing/cars-listing-6/car-6.png",
      id: "#CR-3243",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "BMW 3.0 Gran Turismo",
      vehicleLabel:
        "BMW\n                                                                                3.0 Gran\n                                                                                Turismo",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-3243-assets-imgs-cars-listing-cars-listing-6-car-6-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-3243-assets-imgs-cars-listing-cars-listing-6-car-6-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-3243-assets-imgs-cars-listing-cars-listing-6-car-6-png.days",
      ),
      price: "$1,600",
      date: "02 Jul 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-3243-assets-imgs-cars-listing-cars-listing-6-car-6-png.status",
      ),
      statusClass:
        "badge badge-danger rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#cancelled",
    },
    {
      key: "#CR-5236:/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      id: "#CR-5236",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Infiniti QX60",
      vehicleLabel: "Infiniti QX60",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.days",
      ),
      price: "$2,380",
      date: "12 Jul 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#completed",
    },
    {
      key: "#CR-1256:/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      id: "#CR-1256",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Toyota 86 Coupe",
      vehicleLabel: "Toyota 86 Coupe",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.days",
      ),
      price: "$1,400",
      date: "26 Jul 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#completed",
    },
    {
      key: "#CR-2356:/assets/imgs/cars-listing/cars-listing-6/car-9.png",
      id: "#CR-2356",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-9.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Jeep Wrangler",
      vehicleLabel: "Jeep Wrangler",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.days",
      ),
      price: "$1,810",
      date: "10 Aug 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#completed",
    },
    {
      key: "#CR-5414:/assets/imgs/cars-listing/cars-listing-6/car-10.png",
      id: "#CR-5414",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-10.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Jaguar XK",
      vehicleLabel: "Jaguar XK",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.days",
      ),
      price: "$1,450",
      date: "22 Aug 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.memberBookings.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
      actionTarget: "#completed",
    },
  ],
  ownerInvoices: [
    {
      key: "#CR-5236:/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      id: "#CR-5236",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Infiniti QX60",
      vehicleLabel: "Infiniti QX60",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.days",
      ),
      price: "$2,380",
      date: "12 Jul 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.status",
      ),
      statusClass:
        "badge badge-warning rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
    {
      key: "#CR-1256:/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      id: "#CR-1256",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Toyota 86 Coupe",
      vehicleLabel: "Toyota 86 Coupe",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.days",
      ),
      price: "$1,400",
      date: "26 Jul 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
    {
      key: "#CR-2356:/assets/imgs/cars-listing/cars-listing-6/car-9.png",
      id: "#CR-2356",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-9.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Jeep Wrangler",
      vehicleLabel: "Jeep Wrangler",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.days",
      ),
      price: "$1,810",
      date: "10 Aug 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
    {
      key: "#CR-5414:/assets/imgs/cars-listing/cars-listing-6/car-10.png",
      id: "#CR-5414",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-10.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Jaguar XK",
      vehicleLabel: "Jaguar XK",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.days",
      ),
      price: "$1,450",
      date: "22 Aug 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.ownerInvoices.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.status",
      ),
      statusClass:
        "badge badge-danger rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
  ],
  earningTransactions: [
    {
      key: "#CR-5236:/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      id: "#CR-5236",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-7.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Infiniti QX60",
      vehicleLabel: "Infiniti QX60",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.days",
      ),
      price: "$2,380",
      date: "12 Jul 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5236-assets-imgs-cars-listing-cars-listing-6-car-7-png.status",
      ),
      statusClass:
        "badge badge-warning rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
    {
      key: "#CR-1256:/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      id: "#CR-1256",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-8.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Toyota 86 Coupe",
      vehicleLabel: "Toyota 86 Coupe",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.days",
      ),
      price: "$1,400",
      date: "26 Jul 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-1256-assets-imgs-cars-listing-cars-listing-6-car-8-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
    {
      key: "#CR-2356:/assets/imgs/cars-listing/cars-listing-6/car-9.png",
      id: "#CR-2356",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-9.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Jeep Wrangler",
      vehicleLabel: "Jeep Wrangler",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.days",
      ),
      price: "$1,810",
      date: "10 Aug 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-2356-assets-imgs-cars-listing-cars-listing-6-car-9-png.status",
      ),
      statusClass:
        "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
    {
      key: "#CR-5414:/assets/imgs/cars-listing/cars-listing-6/car-10.png",
      id: "#CR-5414",
      image: "/assets/imgs/cars-listing/cars-listing-6/car-10.png",
      imageAlt: "img",
      vehicleHref: "/vehicle",
      vehicleTitle: "Jaguar XK",
      vehicleLabel: "Jaguar XK",
      vehicleType: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.vehicleType",
      ),
      travellers: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.travellers",
      ),
      days: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.days",
      ),
      price: "$1,450",
      date: "22 Aug 2025",
      status: message(
        "reference.dynamic.dashboard-booking-rows.earningTransactions.cr-5414-assets-imgs-cars-listing-cars-listing-6-car-10-png.status",
      ),
      statusClass:
        "badge badge-danger rounded-pill d-inline-flex align-items-center fs-10",
      statusIcon: "fi fi-rr-caret-right me-1",
    },
  ],
} as const satisfies Readonly<Record<string, readonly DashboardBooking[]>>;

export const dashboardStats = {
  ownerOverview: [
    {
      key: "Total Bookings",
      columnClass: "col-xl-3 mb-2 mb-lg-0",
      layoutClass: "d-flex flex-column",
      badgeClass: "avatar avatar-xl rounded-circle bg-primary me-3",
      iconClass: "fi fi-rr-ticket-alt",
      title: message(
        "reference.dynamic.dashboard-stats.ownerOverview.total-bookings.title",
      ),
      value: "425",
      valuePrefix: "",
      valueSuffix: "",
      count: "425",
      countClass: "karento-static-count",
      change: "45%",
      changeClass: "text-success",
      changeIcon: "fi fi-rr-arrow-small-up",
      period: message(
        "reference.dynamic.dashboard-stats.ownerOverview.total-bookings.period",
      ),
    },
    {
      key: "New Vehicles Listings",
      columnClass: "col-xl-3 mb-2 mb-lg-0",
      layoutClass: "d-flex flex-column",
      badgeClass: "avatar avatar-xl rounded-circle bg-danger me-3",
      iconClass: "fi fi-rr-car-side",
      title: message(
        "reference.dynamic.dashboard-stats.ownerOverview.new-vehicles-listings.title",
      ),
      value: "15",
      valuePrefix: "",
      valueSuffix: "",
      count: "15",
      countClass: "karento-static-count",
      change: "15%",
      changeClass: "text-danger",
      changeIcon: "",
      period: message(
        "reference.dynamic.dashboard-stats.ownerOverview.new-vehicles-listings.period",
      ),
    },
    {
      key: "Total Transaction",
      columnClass: "col-xl-3 mb-2 mb-lg-0",
      layoutClass: "d-flex flex-column",
      badgeClass: "avatar avatar-xl rounded-circle bg-info me-3",
      iconClass: "fi fi-rr-sack-dollar",
      title: message(
        "reference.dynamic.dashboard-stats.ownerOverview.total-transaction.title",
      ),
      value: "625",
      valuePrefix: "$",
      valueSuffix: "",
      count: "625",
      countClass: "karento-static-count",
      change: "25%",
      changeClass: "text-success",
      changeIcon: "fi fi-rr-arrow-small-up",
      period: message(
        "reference.dynamic.dashboard-stats.ownerOverview.total-transaction.period",
      ),
    },
    {
      key: "New Agents",
      columnClass: "col-xl-3 mb-2 mb-lg-0",
      layoutClass: "d-flex flex-column",
      badgeClass: "avatar avatar-xl rounded-circle bg-warning me-3",
      iconClass: "fi fi-rr-users-alt",
      title: message(
        "reference.dynamic.dashboard-stats.ownerOverview.new-agents.title",
      ),
      value: "12",
      valuePrefix: "",
      valueSuffix: "",
      count: "12",
      countClass: "karento-static-count",
      change: "5%",
      changeClass: "text-danger",
      changeIcon: "fi fi-rr-arrow-small-down",
      period: message(
        "reference.dynamic.dashboard-stats.ownerOverview.new-agents.period",
      ),
    },
  ],
  memberOverview: [
    {
      key: "Total Bookings",
      columnClass: "col-xl-4 mb-2 mb-lg-0",
      layoutClass: "d-flex align-items-center",
      badgeClass: "avatar avatar-xl rounded-circle bg-primary me-3",
      iconClass: "fi fi-rr-bookmark fs-36",
      title: message(
        "reference.dynamic.dashboard-stats.memberOverview.total-bookings.title",
      ),
      value: "25",
      valuePrefix: "",
      valueSuffix: "",
      count: "25",
      countClass: "karento-static-count",
    },
    {
      key: "Total Transactions",
      columnClass: "col-xl-4 mb-2 mb-lg-0",
      layoutClass: "d-flex align-items-center",
      badgeClass: "avatar avatar-xl rounded-circle bg-danger me-3",
      iconClass: "fi fi-rr-research-arrows-circle",
      title: message(
        "reference.dynamic.dashboard-stats.memberOverview.total-transactions.title",
      ),
      value: "28",
      valuePrefix: "$",
      valueSuffix: "K",
      count: "28",
      countClass: "karento-static-count",
    },
    {
      key: "Wallet balance",
      columnClass: "col-xl-4",
      layoutClass: "d-flex align-items-center",
      badgeClass: "avatar avatar-xl rounded-circle bg-warning me-3",
      iconClass: "fi fi-rr-wallet",
      title: message(
        "reference.dynamic.dashboard-stats.memberOverview.wallet-balance.title",
      ),
      value: "2458",
      valuePrefix: "$",
      valueSuffix: "",
      count: "2458",
      countClass: "karento-static-count",
    },
  ],
  wallet: [
    {
      key: "Wallet Balance",
      columnClass: "col-xl-4 mb-2 mb-lg-0",
      layoutClass: "d-flex align-items-center",
      badgeClass: "avatar avatar-xl rounded-circle bg-primary me-3",
      iconClass: "fi fi-rr-bookmark fs-36",
      title: message(
        "reference.dynamic.dashboard-stats.wallet.wallet-balance.title",
      ),
      value: "$12,500",
      valuePrefix: "",
      valueSuffix: "",
      change: "45%",
      changeClass: "text-success",
      changeIcon: "fi fi-rr-arrow-small-up",
      period: message(
        "reference.dynamic.dashboard-stats.wallet.wallet-balance.period",
      ),
    },
    {
      key: "Total Credit",
      columnClass: "col-xl-4 mb-2 mb-lg-0",
      layoutClass: "d-flex align-items-center",
      badgeClass: "avatar avatar-xl rounded-circle bg-danger me-3",
      iconClass: "fi fi-rr-research-arrows-circle",
      title: message(
        "reference.dynamic.dashboard-stats.wallet.total-credit.title",
      ),
      value: "$18256",
      valuePrefix: "",
      valueSuffix: "",
      change: "15%",
      changeClass: "text-danger",
      changeIcon: "fi fi-rr-arrow-small-down",
      period: message(
        "reference.dynamic.dashboard-stats.wallet.total-credit.period",
      ),
    },
    {
      key: "Total transactions",
      columnClass: "col-xl-4",
      layoutClass: "d-flex align-items-center",
      badgeClass: "avatar avatar-xl rounded-circle bg-warning me-3",
      iconClass: "fi fi-rr-wallet",
      title: message(
        "reference.dynamic.dashboard-stats.wallet.total-transactions.title",
      ),
      value: "65",
      valuePrefix: "",
      valueSuffix: "",
      change: "8%",
      changeClass: "text-success",
      changeIcon: "fi fi-rr-arrow-small-up",
      period: message(
        "reference.dynamic.dashboard-stats.wallet.total-transactions.period",
      ),
    },
  ],
} as const satisfies Readonly<Record<string, readonly DashboardStat[]>>;

export const dashboardWishlist = [
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Mini Cooper S Hardtop 2 Door",
    titleLabel: "Mini Cooper S Hardtop 2 Door",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$202.87",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list2.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list2.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Volvo XC90 T6 Inscription",
    titleLabel: "Volvo XC90 T6 Inscription",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$778.35",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list3.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list3.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Cadillac Escalade ESV Premium Luxury",
    titleLabel: "Cadillac Escalade ESV Premium Luxury",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$779.58",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list4.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list4.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Honda Civic Si Coupe",
    titleLabel: "Honda Civic Si Coupe",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$601.13",
    pricePeriod: "/ night",
    action: "Book Now",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-9/car-list5.png",
    image: "/assets/imgs/cars-listing/cars-listing-9/car-list5.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Kia Telluride SX",
    titleLabel:
      "Kia\n                                                                Telluride SX",
    location: "Manchester, England",
    sale: "-25%",
    rating: "4.96 ",
    reviews: "(672 reviews)",
    reviewCount: 672,
    mileage: "Unlimited mileage",
    transmission: "Automatic",
    transmissionType: "automatic",
    baggage: "3 Large bags",
    baggageCount: 3,
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    body: "SUVs",
    bodyKey: "reference.listing.filter.suv",
    price: "$450.54",
    pricePeriod: "/ night",
    action: "Book Now",
  },
] as const satisfies readonly RentalRow[];

export const dashboardViewedProducts = [
  {
    id: "/assets/imgs/shop/shop-list/product2.png",
    image: "/assets/imgs/shop/shop-list/product2.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Thinkware F770 Dash Cam Dual Channel Wifi",
    titleLabel: "Thinkware F770 Dash Cam Dual Channel Wifi",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product3.png",
    image: "/assets/imgs/shop/shop-list/product3.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
    titleLabel:
      "Mobil Delvac 1300 Super Heavy Duty Synthetic\n                                                                    Blend",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
  {
    id: "/assets/imgs/shop/shop-list/product4.png",
    image: "/assets/imgs/shop/shop-list/product4.png",
    imageAlt: "Carento",
    href: "/shop/product",
    title: "Spyder® – Projector Headlight Misubisi 2024",
    titleLabel: "Spyder® – Projector Headlight Misubisi 2024",
    rating: "4.9 5 ",
    reviews: "(672 reviews)",
    reviewsKey: "reference.shop.reviewCount",
    features: [
      "Mobil Delvac 1300 Super Heavy Duty Synthetic Blend",
      "Confident driving in all weather conditions",
      "Visual Alignment Indicators",
    ],
    featureKeys: [
      null,
      "reference.shop.feature.weather",
      "reference.shop.feature.alignment",
    ],
    originalPrice: "$68.53",
    price: "$98.67",
    action: "Buy Now",
    actionKey: "reference.shop.buy",
  },
] as const satisfies readonly ListingProduct[];

export const dashboardPreferences = {
  notifications: [
    {
      id: "Booking Confirmations",
      title: message(
        "reference.dynamic.dashboard-preferences.notifications.booking-confirmations.title",
      ),
      description: message(
        "reference.dynamic.dashboard-preferences.notifications.booking-confirmations.description",
      ),
      toggleContainerClass: "d-flex gap-5",
      toggleClass: "da",
      toggles: [
        {
          suffix: "-check1-0",
          label: "SMS",
          checked: true,
          ariaLabel: "check1",
        },
        {
          suffix: "-check2-0",
          label: message(
            "reference.dynamic.dashboard-preferences.notifications.booking-confirmations.toggles.2.label",
          ),
          checked: true,
          ariaLabel: "check2",
        },
        {
          suffix: "-check3-0",
          label: message(
            "reference.dynamic.dashboard-preferences.notifications.booking-confirmations.toggles.3.label",
          ),
          checked: false,
          ariaLabel: "check3",
        },
      ],
    },
    {
      id: "Policy",
      title: message(
        "reference.dynamic.dashboard-preferences.notifications.policy.title",
      ),
      description: message(
        "reference.dynamic.dashboard-preferences.notifications.policy.description",
      ),
      toggleContainerClass: "d-flex gap-5",
      toggleClass: "da",
      toggles: [
        {
          suffix: "-check1-1",
          label: "SMS",
          checked: true,
          ariaLabel: "check1",
        },
        {
          suffix: "-check2-1",
          label: message(
            "reference.dynamic.dashboard-preferences.notifications.policy.toggles.2.label",
          ),
          checked: true,
          ariaLabel: "check2",
        },
        {
          suffix: "-check3-1",
          label: message(
            "reference.dynamic.dashboard-preferences.notifications.policy.toggles.3.label",
          ),
          checked: false,
          ariaLabel: "check3",
        },
      ],
    },
    {
      id: "Promotions",
      title: message(
        "reference.dynamic.dashboard-preferences.notifications.promotions.title",
      ),
      description: message(
        "reference.dynamic.dashboard-preferences.notifications.promotions.description",
      ),
      toggleContainerClass: "d-flex gap-5",
      toggleClass: "da",
      toggles: [
        {
          suffix: "-check1-2",
          label: "SMS",
          checked: true,
          ariaLabel: "check1",
        },
        {
          suffix: "-check2-2",
          label: message(
            "reference.dynamic.dashboard-preferences.notifications.promotions.toggles.2.label",
          ),
          checked: true,
          ariaLabel: "check2",
        },
        {
          suffix: "-check3-2",
          label: message(
            "reference.dynamic.dashboard-preferences.notifications.promotions.toggles.3.label",
          ),
          checked: false,
          ariaLabel: "check3",
        },
      ],
    },
  ],
  connectivity: [
    {
      id: "Google",
      title: "Google",
      description: message(
        "reference.dynamic.dashboard-preferences.connectivity.google.description",
      ),
      logo: "/assets/imgs/dashboard/logo-google.svg",
      logoAlt: "carento",
      toggleContainerClass: "row",
      toggleClass: "col-4",
      toggles: [
        {
          suffix: "-check1-3",
          label: "Google API",
          checked: false,
          ariaLabel: "check1",
        },
        {
          suffix: "-check2-3",
          label: "Google Calendar",
          checked: true,
          ariaLabel: "check2",
        },
        {
          suffix: "-check3-3",
          label: "Google Maps",
          checked: false,
          ariaLabel: "check3",
        },
      ],
    },
    {
      id: "Amazone",
      title: "Amazone",
      description: message(
        "reference.dynamic.dashboard-preferences.connectivity.amazone.description",
      ),
      logo: "/assets/imgs/dashboard/logo-amazon.svg",
      logoAlt: "carento",
      toggleContainerClass: "row",
      toggleClass: "col-4",
      toggles: [
        {
          suffix: "-check1-4",
          label: "API Gateway",
          checked: true,
          ariaLabel: "check1",
        },
        {
          suffix: "-check2-4",
          label: "AWS",
          checked: false,
          ariaLabel: "check2",
        },
        {
          suffix: "-check3-4",
          label: "SP-API",
          checked: false,
          ariaLabel: "check3",
        },
      ],
    },
    {
      id: "Facebook",
      title: "Facebook",
      description: message(
        "reference.dynamic.dashboard-preferences.connectivity.facebook.description",
      ),
      logo: "/assets/imgs/dashboard/logo-facebook.svg",
      logoClass: "w-75",
      logoAlt: "carento",
      toggleContainerClass: "row",
      toggleClass: "col-4",
      toggles: [
        {
          suffix: "-check1-5",
          label: "Data API",
          checked: true,
          ariaLabel: "check1",
        },
        {
          suffix: "-check2-5",
          label: "Map API",
          checked: true,
          ariaLabel: "check2",
        },
        {
          suffix: "-check3-5",
          label: "Graph API",
          checked: false,
          ariaLabel: "check3",
        },
      ],
    },
  ],
} as const satisfies Readonly<
  Record<string, readonly DashboardPreferenceGroup[]>
>;

export const dashboardWalletTransactions = [
  {
    key: "15 May 2025, 10:00 AM",
    payment: message(
      "reference.dynamic.dashboard-wallet-transactions.15-may-2025-10-00-am.payment",
    ),
    direction: message(
      "reference.dynamic.dashboard-wallet-transactions.15-may-2025-10-00-am.direction",
    ),
    date: "15 May 2025, 10:00 AM",
    amount: "-$256",
    amountClass: "text-danger",
    balance: "$11,569",
    status: message(
      "reference.dynamic.dashboard-wallet-transactions.15-may-2025-10-00-am.status",
    ),
    statusClass:
      "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
  },
  {
    key: "20 May 2025, 11:20 AM",
    payment: "Paypal",
    direction: message(
      "reference.dynamic.dashboard-wallet-transactions.20-may-2025-11-20-am.direction",
    ),
    date: "20 May 2025, 11:20 AM",
    amount: "+$3000",
    amountClass: "text-success",
    balance: "$11,569",
    status: message(
      "reference.dynamic.dashboard-wallet-transactions.20-may-2025-11-20-am.status",
    ),
    statusClass:
      "badge badge-secondary rounded-pill d-inline-flex align-items-center fs-10",
  },
  {
    key: "22 May 2025, 02:40 PM",
    payment: "Stripe",
    direction: message(
      "reference.dynamic.dashboard-wallet-transactions.22-may-2025-02-40-pm.direction",
    ),
    date: "22 May 2025, 02:40 PM",
    amount: "+$4000",
    amountClass: "text-success",
    balance: "$12,497",
    status: message(
      "reference.dynamic.dashboard-wallet-transactions.22-may-2025-02-40-pm.status",
    ),
    statusClass:
      "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
  },
  {
    key: "12 Jun 2025, 05:15 PM",
    payment: message(
      "reference.dynamic.dashboard-wallet-transactions.12-jun-2025-05-15-pm.payment",
    ),
    direction: message(
      "reference.dynamic.dashboard-wallet-transactions.12-jun-2025-05-15-pm.direction",
    ),
    date: "12 Jun 2025, 05:15 PM",
    amount: "-$600",
    amountClass: "text-danger",
    balance: "$14,284",
    status: message(
      "reference.dynamic.dashboard-wallet-transactions.12-jun-2025-05-15-pm.status",
    ),
    statusClass:
      "badge badge-danger rounded-pill d-inline-flex align-items-center fs-10",
  },
  {
    key: "17 Jun 2025, 09:30 AM",
    payment: message(
      "reference.dynamic.dashboard-wallet-transactions.17-jun-2025-09-30-am.payment",
    ),
    direction: message(
      "reference.dynamic.dashboard-wallet-transactions.17-jun-2025-09-30-am.direction",
    ),
    date: "17 Jun 2025, 09:30 AM",
    amount: "+$11,569",
    amountClass: "text-success",
    balance: "$13,025",
    status: message(
      "reference.dynamic.dashboard-wallet-transactions.17-jun-2025-09-30-am.status",
    ),
    statusClass:
      "badge badge-success rounded-pill d-inline-flex align-items-center fs-10",
  },
] as const satisfies readonly DashboardWalletTransaction[];

export const dashboardRecentBookings = [
  {
    id: "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
    imageAlt: "Img",
    title: "GMC Sierra 2500HD Denali ",
    label:
      "GMC Sierra\n                                                                    2500HD Denali",
    location: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-1-png.location",
    ),
    date: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-1-png.date",
    ),
    time: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-1-png.time",
    ),
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
    imageAlt: "Img",
    title: "Ford Mustang GT Premium ",
    label:
      "Ford\n                                                                    Mustang GT Premium",
    location: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-2-png.location",
    ),
    date: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-2-png.date",
    ),
    time: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-2-png.time",
    ),
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
    imageAlt: "Img",
    title: "Subaru Impreza WRX STI ",
    label:
      "Subaru\n                                                                    Impreza WRX STI",
    location: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-3-png.location",
    ),
    date: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-3-png.date",
    ),
    time: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-3-png.time",
    ),
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
    image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
    imageAlt: "Img",
    title: "Mazda MX-5 Miata Club ",
    label:
      "Mazda MX-5\n                                                                    Miata Club",
    location: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-4-png.location",
    ),
    date: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-4-png.date",
    ),
    time: message(
      "reference.dynamic.dashboard-recent-bookings.assets-imgs-cars-listing-cars-listing-6-car-4-png.time",
    ),
  },
] as const satisfies readonly DashboardRecentBooking[];

export const dashboardNotifications = [
  {
    id: "Reservation Confirmed",
    badgeClass:
      "avatar avatar-lg bg-primary rounded-circle flex-shrink-0 me-2 lh-1",
    iconClass: "fi fi-rr-calendar-clock",
    title: message(
      "reference.dynamic.dashboard-notifications.reservation-confirmed.title",
    ),
    time: message(
      "reference.dynamic.dashboard-notifications.reservation-confirmed.time",
    ),
    lead: message(
      "reference.dynamic.dashboard-notifications.reservation-confirmed.lead",
    ),
    emphasis: "#12345",
    tail: message(
      "reference.dynamic.dashboard-notifications.reservation-confirmed.tail",
    ),
  },
  {
    id: "Payment Successful",
    badgeClass:
      "avatar avatar-lg bg-warning rounded-circle flex-shrink-0 me-2 lh-1",
    iconClass: "fi fi-rr-money-check-edit",
    title: message(
      "reference.dynamic.dashboard-notifications.payment-successful.title",
    ),
    time: message(
      "reference.dynamic.dashboard-notifications.payment-successful.time",
    ),
    lead: message(
      "reference.dynamic.dashboard-notifications.payment-successful.lead",
    ),
  },
  {
    id: "New Promotion Alert",
    badgeClass:
      "avatar avatar-lg bg-info rounded-circle flex-shrink-0 me-2 lh-1",
    iconClass: "fi fi-rr-bolt",
    title: message(
      "reference.dynamic.dashboard-notifications.new-promotion-alert.title",
    ),
    time: message(
      "reference.dynamic.dashboard-notifications.new-promotion-alert.time",
    ),
    lead: message(
      "reference.dynamic.dashboard-notifications.new-promotion-alert.lead",
    ),
    emphasis: "20%",
    tail: message(
      "reference.dynamic.dashboard-notifications.new-promotion-alert.tail",
    ),
  },
  {
    id: "Vehicle Ready for Pickup",
    badgeClass:
      "avatar avatar-lg bg-danger rounded-circle flex-shrink-0 me-2 lh-1",
    iconClass: "fi fi-rr-bell-ring",
    title: message(
      "reference.dynamic.dashboard-notifications.vehicle-ready-for-pickup.title",
    ),
    time: message(
      "reference.dynamic.dashboard-notifications.vehicle-ready-for-pickup.time",
    ),
    lead: message(
      "reference.dynamic.dashboard-notifications.vehicle-ready-for-pickup.lead",
    ),
  },
] as const satisfies readonly DashboardNotification[];

export const dashboardOwnerInventory = [
  {
    sample: true,
    image: "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "GMC Sierra 2500HD Denali",
    location: "New South Wales, Australia",
    mileage: "25,100 miles",
    transmission: "Automatic",
    transmissionType: "automatic",
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    price: "$98.67",
    pricePeriod: "/ day",
    action: "",
    reviews: "(672 reviews)",
    reviewCount: 672,
    rating: "4.96 ",
  },
  {
    sample: true,
    image: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Ford Mustang GT Premium",
    location: "New South Wales, Australia",
    mileage: "25,100 miles",
    transmission: "Automatic",
    transmissionType: "automatic",
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    price: "$89.32",
    pricePeriod: "/ day",
    action: "",
    reviews: "(672 reviews)",
    reviewCount: 672,
    rating: "4.96 ",
  },
  {
    sample: true,
    image: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Mazda MX-5 Miata Club",
    location: "New South Wales, Australia",
    mileage: "25,100 miles",
    transmission: "Automatic",
    transmissionType: "automatic",
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    price: "$89.56",
    pricePeriod: "/ day",
    action: "",
    reviews: "(672 reviews)",
    reviewCount: 672,
    rating: "4.96 ",
  },
  {
    sample: true,
    image: "/assets/imgs/cars-listing/cars-listing-6/car-4.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Subaru Impreza WRX STI",
    location: "New South Wales, Australia",
    mileage: "25,100 miles",
    transmission: "Automatic",
    transmissionType: "automatic",
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    price: "$658.0",
    pricePeriod: "/ day",
    action: "",
    reviews: "(672 reviews)",
    reviewCount: 672,
    rating: "4.96 ",
  },
  {
    sample: true,
    image: "/assets/imgs/cars-listing/cars-listing-6/car-5.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Porsche 911 Carrera S",
    location: "New South Wales, Australia",
    mileage: "25,100 miles",
    transmission: "Automatic",
    transmissionType: "automatic",
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    price: "$125.0",
    pricePeriod: "/ day",
    action: "",
    reviews: "(672 reviews)",
    reviewCount: 672,
    rating: "4.96 ",
  },
  {
    sample: true,
    image: "/assets/imgs/cars-listing/cars-listing-6/car-6.png",
    imageAlt: "Carento",
    href: "/vehicle",
    title: "Toyota Camry LE Hybrid",
    location: "New South Wales, Australia",
    mileage: "25,100 miles",
    transmission: "Automatic",
    transmissionType: "automatic",
    fuel: "Diesel",
    fuelType: "diesel",
    seats: "7 seats",
    seatsCount: 7,
    price: "$32.47",
    pricePeriod: "/ day",
    action: "",
    reviews: "(672 reviews)",
    reviewCount: 672,
    rating: "4.96 ",
  },
] as const satisfies readonly VehicleCardContent[];

export interface DashboardPromotion {
  alertClass: string;
  message: CatalogText;
}
export const dashboardPromotions = {
  memberOverview: {
    alertClass:
      "alert alert-success alert-dismissible d-flex align-items-center border-0 mb-4 fade show",
    message: message(
      "reference.dynamic.dashboard-promotions.memberOverview.message",
    ),
  },
  bookings: {
    alertClass:
      "alert alert-info alert-dismissible d-flex align-items-center border-0 mb-4 fade show mb-4",
    message: message("reference.dynamic.dashboard-promotions.bookings.message"),
  },
  ownerListings: {
    alertClass:
      "alert alert-info alert-dismissible d-flex align-items-center border-0 mb-4 fade show mb-4",
    message: message(
      "reference.dynamic.dashboard-promotions.ownerListings.message",
    ),
  },
} as const satisfies Readonly<Record<string, DashboardPromotion>>;

export interface DashboardPreviewImage {
  id: string;
  src: string;
  alt: string;
}
export const dashboardListingImages = [
  {
    id: "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
    src: "/assets/imgs/cars-listing/cars-listing-6/car-1.png",
    alt: "Travilla",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
    src: "/assets/imgs/cars-listing/cars-listing-6/car-2.png",
    alt: "Travilla",
  },
  {
    id: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
    src: "/assets/imgs/cars-listing/cars-listing-6/car-3.png",
    alt: "Travilla",
  },
] as const satisfies readonly DashboardPreviewImage[];

export const dashboardListingFeatures = [
  message("reference.dynamic.dashboard-listing-features.1"),
  message("reference.dynamic.dashboard-listing-features.2"),
  message("reference.dynamic.dashboard-listing-features.3"),
  message("reference.dynamic.dashboard-listing-features.4"),
  message("reference.dynamic.dashboard-listing-features.5"),
  message("reference.dynamic.dashboard-listing-features.6"),
  message("reference.dynamic.dashboard-listing-features.7"),
  message("reference.dynamic.dashboard-listing-features.8"),
  message("reference.dynamic.dashboard-listing-features.9"),
  message("reference.dynamic.dashboard-listing-features.10"),
  message("reference.dynamic.dashboard-listing-features.11"),
  message("reference.dynamic.dashboard-listing-features.12"),
] as const;
