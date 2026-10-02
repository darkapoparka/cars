import { cn } from "@repo/design-system/lib/utils";
import { withBasePath } from "@repo/internationalization/paths";
import {
  isPublicSitePathEnabled,
  type PublicSiteConfig,
  publicSite,
} from "@repo/marketplace/site-config";
import { ArrowUpRight, ChevronDown, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { getLocalizedPublicPath } from "../lib/public-path";
import styles from "./dealer-desktop-header.module.css";
import { DealerNavigationLink } from "./dealer-navigation-link";
import { MarketplaceLocaleSwitchLink } from "./marketplace-locale-switch-link";
import type { MarketplaceMode } from "./marketplace-masthead";
import Image from "./public-image";

/** Desktop-only dealership navigation, shared by inventory and service routes. */
export const DealerDesktopHeader = ({
  activeMode = "buy",
  children,
  homeHref,
  locale,
  layout = "showroom",
  site = publicSite,
}: {
  activeMode?: MarketplaceMode | "home" | null;
  children?: ReactNode;
  homeHref?: string;
  locale?: string;
  site?: PublicSiteConfig;
  layout?: "default" | "showroom";
}) => {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const destinations = [
    { id: "home", path: "/", label: isBg ? "Начало" : "Home" },
    { id: "buy", path: "/cars", label: isBg ? "Автомобили" : "Inventory" },
    { id: "sell", path: "/sell", label: isBg ? "Продай" : "Sell" },
    { id: "imports", path: "/imports", label: isBg ? "Внос" : "Import" },
    { id: "lease", path: "/lease", label: isBg ? "Лизинг" : "Financing" },
  ];

  return (
    <>
      <header
        className={cn(styles.header, "dealer-desktop-header hidden lg:block")}
        data-has-search={Boolean(children)}
        data-layout={layout}
        data-slot="dealer-desktop-header"
      >
        <div className={cn(styles.nav, "dealer-desktop-nav")}>
          <Link
            aria-label={isBg ? "Начало" : "Home"}
            className={cn(styles.brand, "dealer-desktop-brand relative")}
            href={homeHref ?? getLocalizedPublicPath(locale, "/")}
          >
            <Image
              alt=""
              className="object-contain object-left"
              fill
              priority
              sizes="220px"
              src={site.identity.logo}
            />
          </Link>
          <nav
            aria-label={
              isBg ? "Основни действия" : "Primary dealership navigation"
            }
            className={cn(styles.segments, "dealer-desktop-segments")}
          >
            {destinations
              .filter((destination) =>
                isPublicSitePathEnabled(destination.path, site)
              )
              .map((destination) => (
                <DealerNavigationLink
                  aria-current={
                    activeMode === destination.id ? "page" : undefined
                  }
                  data-marketplace-mode={destination.id}
                  data-slot="marketplace-mode-action"
                  href={getLocalizedPublicPath(locale, destination.path)}
                  key={destination.id}
                >
                  {destination.label}
                </DealerNavigationLink>
              ))}
          </nav>
          <div className={cn(styles.contact, "dealer-desktop-contact")}>
            <a
              aria-label={
                isBg
                  ? `Шоурум: ${site.contact.address}`
                  : `Showroom: ${site.contact.address}`
              }
              className={cn(styles.showroom, "dealer-desktop-showroom")}
              href={withBasePath(site.contact.mapsUrl)}
              rel="noreferrer"
              target="_blank"
            >
              <span>{isBg ? "Шоурум" : "Showroom"}</span>
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
            </a>
            <a
              aria-label={
                isBg
                  ? `Обадете се на ${site.contact.phoneDisplay}`
                  : `Call ${site.contact.phoneDisplay}`
              }
              className={styles.phone}
              href={withBasePath(site.contact.phoneHref)}
            >
              <Phone aria-hidden="true" size={16} strokeWidth={1.8} />
              <span>{site.contact.phoneDisplay}</span>
            </a>
            <MarketplaceLocaleSwitchLink
              className={styles.language}
              label={isBg ? "Държава и език" : "Country and language"}
              locale={locale}
            >
              {isBg ? "BG" : "EN"}
              <ChevronDown aria-hidden="true" size={14} />
            </MarketplaceLocaleSwitchLink>
          </div>
        </div>
      </header>
      {children}
    </>
  );
};
