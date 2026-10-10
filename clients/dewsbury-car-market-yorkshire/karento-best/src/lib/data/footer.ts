import { message, type CatalogText } from "#lib/i18n/text.ts";
import type { canonicalRoutes } from "#lib/routes.ts";

type WebsiteRoute = Exclude<
  keyof typeof canonicalRoutes,
  "404" | "" | `${"account" | "dashboard"}${string}`
>;

export interface FooterLinkGroupContent {
  readonly id: string;
  readonly title: CatalogText;
  readonly links: readonly {
    readonly href: `/${WebsiteRoute}`;
    readonly label: CatalogText;
  }[];
}

/** Public navigation only; unavailable services and social profiles are omitted. */
export const footerLinkGroups: readonly FooterLinkGroupContent[] = [
  {
    id: "browse",
    title: message("footer.polish.browse"),
    links: [
      { href: "/vehicles", label: message("navigation.vehicles") },
      { href: "/import", label: message("navigation.import") },
      { href: "/services", label: message("navigation.services") },
      { href: "/shop", label: message("navigation.shop") },
    ],
  },
  {
    id: "explore",
    title: message("navigation.explore"),
    links: [
      { href: "/about", label: message("navigation.about") },
      { href: "/news", label: message("navigation.news") },
      { href: "/calculator", label: message("navigation.calculator") },
      { href: "/membership", label: message("navigation.plans") },
    ],
  },
  {
    id: "support",
    title: message("ui.footer.support"),
    links: [
      { href: "/contact", label: message("navigation.contact") },
      { href: "/faq", label: message("navigation.faq") },
      { href: "/terms", label: message("navigation.terms") },
    ],
  },
];
