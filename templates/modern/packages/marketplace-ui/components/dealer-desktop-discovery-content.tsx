import {
  buildMarketplaceSearchHref,
  getListingPath,
  leadSite,
  type VehicleListing,
} from "@repo/marketplace";
import { publicSite } from "@repo/marketplace/site-config";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getLocalizedPublicPath } from "../lib/public-path";
import styles from "./dealer-desktop-discovery.module.css";
import { DealerDesktopServiceLinks } from "./dealer-desktop-service-links";
import Image from "./public-image";
import { VehicleCard } from "./vehicle-card";

export interface DealerDesktopJournalCard {
  category: string;
  href: string;
  image: string;
  meta: string;
  title: string;
}

/** Desktop composition reuses the same stock, capabilities and editorial content. */
export const DealerDesktopDiscoveryContent = ({
  articles = [],
  currentPath,
  listings,
  locale,
}: {
  articles?: readonly DealerDesktopJournalCard[];
  currentPath: string;
  listings: readonly VehicleListing[];
  locale?: string;
}) => {
  const isBg = locale?.startsWith("bg") ?? false;
  const text = (bg: string, en: string) => (isBg ? bg : en);
  const path = (href: string) => getLocalizedPublicPath(locale, href);
  return (
    <div
      className={styles.discoveryContent}
      data-slot="dealer-desktop-discovery-content"
    >
      <section
        aria-labelledby="desktop-inventory-heading"
        className={styles.stockPanel}
        data-slot="home-stock-panel"
      >
        <div className={styles.sectionHeading}>
          <h2 id="desktop-inventory-heading">
            {text("Разгледайте нашите автомобили", "Explore Our Vehicles")}
          </h2>
          {leadSite.staticDemoMode && (
            <p>
              {text(
                "Показани са примерни автомобили.",
                "Sample vehicles shown."
              )}
            </p>
          )}
        </div>
        <nav
          aria-label={text("Разгледайте автомобилите", "Browse inventory")}
          className={styles.stockTabs}
        >
          <Link aria-current="page" href={currentPath}>
            {text("Всички автомобили", "All Vehicles")}
          </Link>
          <Link
            href={buildMarketplaceSearchHref(
              { category: "car", sort: "newest" },
              currentPath
            )}
          >
            {text("Най-нови", "Newest Arrivals")}
          </Link>
          <Link
            href={buildMarketplaceSearchHref(
              { category: "car", sort: "price_asc" },
              currentPath
            )}
          >
            {text("По цена", "By Price")}
          </Link>
        </nav>
        <div className={styles.stockGrid} data-slot="home-stock-grid">
          {listings.slice(0, 8).map((listing) => (
            <VehicleCard
              density="compact"
              desktopHeadingLevel={3}
              desktopLayout="grid"
              href={path(getListingPath(listing))}
              key={listing.id}
              listing={listing}
              locale={locale}
              presentation="showroom"
              priority={false}
              viewMode="grid"
            />
          ))}
        </div>
        <Link className={styles.primaryAction} href={currentPath}>
          {text("Виж всички автомобили", "View All Vehicles")}
          <ArrowUpRight aria-hidden size={18} />
        </Link>
      </section>
      <section
        aria-labelledby="desktop-services-heading"
        className={styles.servicesSection}
      >
        <div className={styles.sectionHeading}>
          <h2 id="desktop-services-heading">
            {text(
              "Повече от покупка на автомобил",
              "Everything You Need for Your Next Car"
            )}
          </h2>
          <p>
            {text(
              "Открийте автомобил, обсъдете финансиране или ни поверете продажбата и вноса.",
              "Find a car, explore financing, or talk to our team about selling and importing."
            )}
          </p>
        </div>
        <DealerDesktopServiceLinks locale={locale} placement="inventory" />
      </section>
      <section className={styles.visitBanner}>
        <Image
          alt=""
          className={styles.bannerImage}
          fill
          loading="lazy"
          sizes="(min-width: 1440px) 1392px, 100vw"
          src={
            publicSite.artwork.desktopVisitBanner ??
            publicSite.artwork.contactHero
          }
        />
        <div>
          <h2>
            {text(
              "Вашият следващ автомобил започва тук",
              "Your Next Car Starts Here"
            )}
          </h2>
          <p>
            {text(
              "Разгледайте автомобилите онлайн или се свържете с екипа за оглед и повече информация.",
              "Explore our cars online or speak to the team to arrange a viewing and discuss the details."
            )}
          </p>
          <Link className={styles.bannerAction} href={path("/contact")}>
            {text("Свържете се с нас", "Get in Touch")}
            <ArrowUpRight aria-hidden size={18} />
          </Link>
        </div>
      </section>
      {articles.length > 0 && (
        <section
          aria-labelledby="desktop-journal-heading"
          className={styles.journalSection}
        >
          <div className={styles.journalHeading}>
            <h2 id="desktop-journal-heading">
              {text("Полезно за вашия автомобил", "Latest News & Advice")}
            </h2>
            <Link href={path("/blog")}>
              {text("Всички статии", "View All Articles")}
              <ArrowUpRight aria-hidden size={18} />
            </Link>
          </div>
          <div className={styles.journalGrid}>
            {articles.slice(0, 3).map((article) => (
              <Link
                className={styles.journalCard}
                href={article.href}
                key={article.href}
              >
                <div className={styles.journalImage}>
                  <Image
                    alt=""
                    fill
                    sizes="(min-width: 1440px) 448px, 33vw"
                    src={article.image}
                  />
                </div>
                <div className={styles.journalCardBody}>
                  <p>
                    <span className={styles.journalCategory}>
                      {article.category}
                    </span>
                    <span>{article.meta}</span>
                  </p>
                  <h3>{article.title}</h3>
                  <span className={styles.journalAction}>
                    {text("Прочети статията", "Read Article")}
                    <ArrowUpRight aria-hidden size={18} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
