import {
  formatMoney,
  getListingPath,
  type VehicleListing,
} from "@repo/marketplace";
import { getLeadCopy } from "@repo/marketplace/lead-copy";
import { localizeListingCopy } from "@repo/marketplace/listing-copy";
import { publicSite } from "@repo/marketplace/site-config";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { getPrimaryListingPrice } from "../lib/listing-truth";
import { getLocalizedPublicPath } from "../lib/public-path";
import { getShowroomVehicleHeading } from "../lib/vehicle-card-policy";
import styles from "./dealer-desktop-landing.module.css";
import {
  DealerHeroSearch,
  type DealerHeroSearchProps,
} from "./dealer-hero-search";
import Image from "./public-image";

export function DealerDesktopDiscoveryHero({
  locale,
  totalListings,
  featuredListing,
  loading = false,
  ...toolbarProps
}: DealerHeroSearchProps & {
  totalListings: number;
  featuredListing?: VehicleListing;
  loading?: boolean;
}) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const text = (bg: string, en: string) => (isBg ? bg : en);
  const listing = featuredListing
    ? localizeListingCopy(featuredListing, locale)
    : undefined;
  const image = listing?.images[0];
  const heading = listing
    ? getShowroomVehicleHeading(listing, locale)
    : undefined;
  const inventoryHref = getLocalizedPublicPath(locale, "/cars");
  return (
    <section
      aria-labelledby="desktop-home-title"
      className={styles.landing}
      data-loading={loading || undefined}
      data-slot="dealer-desktop-home-hero"
    >
      <div className={styles.heroFrame}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>{publicSite.identity.name}</p>
          <h1 id="desktop-home-title">
            <span className={styles.headlineLine}>
              {text("Следващият ви автомобил.", "Your next drive.")}
            </span>
            <span className={styles.headlineLine}>
              {text("Започва оттук.", "Starts here.")}
            </span>
          </h1>
          <p className={styles.description}>{getLeadCopy(locale).tagline}</p>
          <div className={styles.actions}>
            <Link className={styles.primaryAction} href={inventoryHref}>
              {text("Разгледайте автомобилите", "Explore the inventory")}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link
              className={styles.secondaryAction}
              href={getLocalizedPublicPath(locale, "/contact")}
            >
              {text("За нас и контакти", "About & contact")}
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className={styles.context}>
            <span>
              {new Intl.NumberFormat(isBg ? "bg-BG" : "en-GB").format(
                totalListings
              )}{" "}
              {text("обяви в каталога", "listings to explore")}
            </span>
            <span>
              <MapPin aria-hidden="true" size={14} />
              {getLeadCopy(locale).city}
            </span>
          </div>
        </div>
        {listing && image && heading ? (
          <Link
            className={styles.spotlight}
            data-slot="desktop-featured-vehicle"
            href={getLocalizedPublicPath(locale, getListingPath(listing))}
          >
            <Image
              alt={image.alt || listing.title}
              className={styles.spotlightImage}
              fill
              loading="lazy"
              sizes="(min-width: 1600px) 700px, (min-width: 1024px) 50vw, 0px"
              src={image.url}
            />
            <span className={styles.spotlightLabel}>
              {text("На фокус", "In the spotlight")}
            </span>
            <div className={styles.spotlightCaption}>
              <div>
                <strong>{heading.title}</strong>
                <span>{heading.subtitle}</span>
              </div>
              <div className={styles.spotlightPrice}>
                <strong>
                  {formatMoney(getPrimaryListingPrice(listing), locale)}
                </strong>
                <span>
                  {text("Вижте автомобила", "Explore this vehicle")}{" "}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <Link className={styles.emptySpotlight} href={inventoryHref}>
            <strong>
              {text("Открийте възможностите.", "Explore the possibilities.")}
            </strong>
            <span>
              {text("Разгледайте каталога", "Browse the catalog")}{" "}
              <ArrowRight aria-hidden="true" size={20} />
            </span>
          </Link>
        )}
      </div>
      <div className={styles.heroSearch}>
        {loading ? (
          <div aria-hidden="true" className={styles.skeletonSearch}>
            <div />
            <div />
            <div className={styles.skeletonFields}>
              <div />
              <div />
              <div />
              <div />
            </div>
            <div className={styles.skeletonMore} />
          </div>
        ) : (
          <DealerHeroSearch
            {...toolbarProps}
            key={JSON.stringify(toolbarProps.filters)}
            locale={locale}
          />
        )}
      </div>
    </section>
  );
}
