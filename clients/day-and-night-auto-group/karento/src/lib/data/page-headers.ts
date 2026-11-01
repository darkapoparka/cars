import { message, type CatalogText } from "#lib/i18n/text.ts";

/** Typed reference presentation inputs; these are not verified dealer or account data. */
export interface HeaderImage {
  readonly src: string;
  readonly alt: CatalogText;
  readonly className: string;
}
export const newsDiscoveryImage = {
  src: "/assets/imgs/blog/blog-grid/img-1.png",
  alt: message("header.image.preview"),
  className: "w-100 h-100 img-banner",
} satisfies HeaderImage;
export interface BreadcrumbItem {
  readonly id: string;
  readonly href: string;
  readonly label: CatalogText;
  readonly className: string;
  readonly accessibleLabel?: CatalogText;
  readonly separatorClass?: string;
}
export interface BreadcrumbContent {
  readonly className: string;
  readonly items: readonly BreadcrumbItem[];
}
export interface ArticleHeaderMetadata {
  readonly avatar: string;
  readonly author: CatalogText;
  readonly date: string;
  readonly duration: CatalogText;
  readonly comments: CatalogText;
}
export interface PageHeroContent {
  readonly title: CatalogText;
  readonly mobileDescription?: CatalogText;
  readonly variant: "page" | "source" | "article";
  readonly image: HeaderImage;
  readonly description?: {
    readonly text: CatalogText;
    readonly kind: "paragraph" | "span";
  };
  readonly action?: { readonly href: string; readonly label: CatalogText };
  readonly category?: CatalogText;
  readonly article?: ArticleHeaderMetadata;
  readonly breadcrumbs?: BreadcrumbContent;
}
export interface DiscoveryBannerContent {
  readonly image: HeaderImage;
  readonly label: CatalogText;
  readonly titleLines:
    | readonly [CatalogText]
    | readonly [CatalogText, CatalogText];
  readonly description: CatalogText;
  readonly mobileTitle?: CatalogText;
  readonly mobileDescription?: CatalogText;
  readonly breadcrumbs: BreadcrumbContent;
}
export const pageHeroes = {
  about: {
    title: message("header.about.title"),
    variant: "page",
    image: {
      src: "/assets/imgs/page-header/banner.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-banner",
    },
    description: {
      text: message("header.about.description"),
      kind: "span",
    },
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 ",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "#!",
          label: message("header.about.title"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.about.title"),
        },
      ],
    },
  },
  contact: {
    title: message("header.contact.title"),
    mobileDescription: message("header.contact.mobileDescription"),
    variant: "page",
    image: {
      src: "/assets/imgs/page-header/banner4.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 rounded-12 img-banner",
    },
    description: {
      text: message("header.contact.description"),
      kind: "paragraph",
    },
    action: {
      href: "#contact-enquiry",
      label: message("header.contact.enquiry"),
    },
  },
  importSources: {
    title: message("header.import.title"),
    variant: "page",
    image: {
      src: "/assets/imgs/page-header/banner7.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-banner",
    },
    description: {
      text: message("header.import.description"),
      kind: "span",
    },
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "#!",
          label: "",
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.details"),
        },
      ],
    },
  },
  sourceProfile: {
    title: "Peugeot Sheffield",
    variant: "source",
    image: {
      src: "/assets/imgs/page-header/banner8.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-banner",
    },
    description: {
      text: message("header.source.description"),
      kind: "span",
    },
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "#!",
          label: "",
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.details"),
        },
      ],
    },
  },
  terms: {
    title: message("header.terms.title"),
    variant: "page",
    image: {
      src: "/assets/imgs/page-header/banner5.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 rounded-12 img-banner",
    },
    description: {
      text: message("header.terms.description"),
      kind: "span",
    },
  },
  pricing: {
    title: message("header.pricing.title"),
    variant: "page",
    image: {
      src: "/assets/imgs/page-header/banner2.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-banner",
    },
    description: {
      text: message("header.pricing.description"),
      kind: "span",
    },
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "#!",
          label: "",
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.details"),
        },
      ],
    },
  },
  services: {
    title: message("header.services.title"),
    mobileDescription: message("header.services.mobileDescription"),
    variant: "page",
    image: {
      src: "/assets/imgs/page-header/banner1.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-banner",
    },
    description: {
      text: message("header.services.description"),
      kind: "span",
    },
    action: {
      href: "/contact",
      label: message("header.contact.action"),
    },
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 ",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "#!",
          label: message("header.services.breadcrumb"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.services.breadcrumb"),
        },
      ],
    },
  },
  article: {
    title: message("header.article.title"),
    variant: "article",
    image: {
      src: "/assets/imgs/page-header/banner3.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 rounded-12 img-banner",
    },
    category: message("header.article.category"),
    article: {
      avatar: "/assets/imgs/blog/blog-grid/avatar3.png",
      author: message("header.article.author"),
      date: "2024-09-18",
      duration: message("header.article.duration"),
      comments: message("header.article.comments"),
    },
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border gap-3 d-none d-md-flex w-md-75",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "/news",
          label: message("header.breadcrumb.news"),
          className: "neutral-700 text-md-bold",
          accessibleLabel: message("header.breadcrumb.news"),
        },
        {
          id: "current",
          href: "#!",
          label: message("header.article.title"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.article.title"),
        },
      ],
    },
  },
} satisfies Record<string, PageHeroContent>;
export const discoveryBanners = {
  shop: {
    mobileTitle: message("header.shop.mobileTitle"),
    mobileDescription: message("header.shop.mobileDescription"),
    image: {
      src: "/assets/imgs/page-header/banner9.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-fluid img-banner",
    },
    label: message("header.discovery.label"),
    titleLines: [
      message("header.shop.titleFirst"),
      message("header.shop.titleSecond"),
    ],
    description: "",
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3  d-none d-md-flex",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "#!",
          label: message("header.breadcrumb.shop"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.shop"),
          separatorClass: "",
        },
        {
          id: "current",
          href: "#!",
          label: message("header.breadcrumb.allItems"),
          className: "neutral-1000 text-md-bold text-nowrap",
          accessibleLabel: message("header.breadcrumb.allItems"),
        },
      ],
    },
  },
  vehicleFinder: {
    image: {
      src: "/assets/imgs/page-header/banner6.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-fluid img-banner",
    },
    label: message("header.discovery.label"),
    titleLines: [message("header.finder.title")],
    description: message("header.discovery.description"),
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "/",
          label: message("header.breadcrumb.explore"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.explore"),
          separatorClass: "",
        },
        {
          id: "current",
          href: "/",
          label: message("header.breadcrumb.explore"),
          className: "neutral-1000 text-md-bold text-nowrap",
          accessibleLabel: message("header.breadcrumb.explore"),
        },
      ],
    },
  },
  dreamRide: {
    image: {
      src: "/assets/imgs/page-header/banner6.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-fluid img-banner",
    },
    label: message("header.discovery.label"),
    titleLines: [message("header.dreamRide.title")],
    description: message("header.discovery.description"),
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "/",
          label: message("header.breadcrumb.explore"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.explore"),
          separatorClass: "",
        },
        {
          id: "current",
          href: "/",
          label: message("header.breadcrumb.explore"),
          className: "neutral-1000 text-md-bold text-nowrap",
          accessibleLabel: message("header.breadcrumb.explore"),
        },
      ],
    },
  },
  carFinder: {
    image: {
      src: "/assets/imgs/page-header/banner6.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-fluid img-banner",
    },
    label: message("header.discovery.label"),
    titleLines: [message("header.carFinder.title")],
    description: message("header.discovery.description"),
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "/",
          label: message("header.breadcrumb.explore"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.explore"),
          separatorClass: "",
        },
        {
          id: "current",
          href: "/",
          label: message("header.breadcrumb.explore"),
          className: "neutral-1000 text-md-bold text-nowrap",
          accessibleLabel: message("header.breadcrumb.explore"),
        },
      ],
    },
  },
  vehicles: {
    mobileTitle: message("header.vehicles.mobileTitle"),
    mobileDescription: message("header.vehicles.mobileDescription"),
    image: {
      src: "/assets/imgs/page-header/banner6.png",
      alt: message("header.image.preview"),
      className: "w-100 h-100 img-fluid img-banner",
    },
    label: message("header.discovery.label"),
    titleLines: [message("header.vehicles.title")],
    description: message("header.discovery.description"),
    breadcrumbs: {
      className:
        "background-body position-absolute z-1 top-100 start-50 translate-middle px-3 py-2 rounded-12 border d-flex gap-3 d-none d-none d-md-flex",
      items: [
        {
          id: "home",
          href: "/",
          label: message("header.breadcrumb.home"),
          className: "neutral-700 text-md-medium",
          accessibleLabel: message("header.breadcrumb.home"),
        },
        {
          id: "section",
          href: "/vehicles",
          label: message("header.breadcrumb.vehicles"),
          className: "neutral-1000 text-md-bold",
          accessibleLabel: message("header.breadcrumb.vehicles"),
          separatorClass: "",
        },
        {
          id: "current",
          href: "/vehicles",
          label: message("header.breadcrumb.vehicles"),
          className: "neutral-1000 text-md-bold text-nowrap",
          accessibleLabel: message("header.breadcrumb.vehicles"),
        },
      ],
    },
  },
} satisfies Record<string, DiscoveryBannerContent>;
export const accountHeadingTitles = {
  wishlist: message("header.account.wishlist"),
  bookings: message("header.account.bookings"),
  earnings: message("header.account.earnings"),
  ownerDashboard: message("header.account.ownerDashboard"),
  profile: message("header.account.profile"),
  agentSettings: message("header.account.agentSettings"),
  accountSettings: message("header.account.accountSettings"),
  listings: message("header.account.listings"),
  wallet: message("header.account.wallet"),
  userDashboard: message("header.account.userDashboard"),
  addListing: message("header.account.addListing"),
} satisfies Record<string, CatalogText>;
export function accountBreadcrumbs(title: CatalogText): BreadcrumbContent {
  return {
    className:
      "background-body px-3 py-2 rounded-12 border d-flex gap-3 d-inline-flex",
    items: [
      {
        id: "home",
        href: "/",
        label: message("header.breadcrumb.home"),
        className: "neutral-700 text-md-medium",
        accessibleLabel: message("header.breadcrumb.home"),
      },
      {
        id: "current",
        href: "#!",
        label: title,
        className: "neutral-1000 text-md-bold",
        accessibleLabel: title,
      },
    ],
  };
}
