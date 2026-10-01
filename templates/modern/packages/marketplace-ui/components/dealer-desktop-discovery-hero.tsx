import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { getLocalizedPublicPath } from "../lib/public-path";
import styles from "./dealer-desktop-discovery.module.css";
import {
  DealerHeroSearch,
  type DealerHeroSearchProps,
} from "./dealer-hero-search";
import Image from "./public-image";

export function DealerDesktopDiscoveryHero({
  locale,
  totalListings,
  ...toolbarProps
}: DealerHeroSearchProps & { totalListings: number }) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  const featured = toolbarProps.searchListings?.find(
    (listing) => listing.images[0]?.url
  );
  return (
    <section
      aria-labelledby="desktop-home-title"
      className={styles.landing}
      data-slot="dealer-desktop-home-hero"
    >
      <div className={styles.introduction}>
        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>
            {isBg
              ? "АВТОМОБИЛИ · ВНОС · ЛИЗИНГ"
              : "INVENTORY · IMPORT · FINANCING"}
          </p>
          <h1 id="desktop-home-title">
            {isBg
              ? "Следващият ви автомобил е тук."
              : "Your next drive starts here."}
          </h1>
          <p className={styles.introDescription}>
            {isBg
              ? "Открийте своя автомобил. Разгледайте наличностите, сравнете детайлите и поговорете с нашия екип."
              : "Find a car that feels right. Explore the collection, compare the details and talk to our team."}
          </p>
          <a className={styles.browseLink} href="#desktop-inventory-heading">
            {isBg
              ? `Разгледайте ${totalListings} автомобила`
              : `Explore ${totalListings} vehicles`}
            <ArrowDown aria-hidden="true" size={18} />
          </a>
        </div>
        {featured && (
          <Link
            className={styles.featured}
            href={getLocalizedPublicPath(locale, `/listing/${featured.slug}`)}
          >
            <Image
              alt={featured.images[0].alt || featured.title}
              fill
              sizes="(min-width: 1024px) 52vw, 0px"
              src={featured.images[0].url}
            />
            <div className={styles.featuredCaption}>
              <div>
                <span>{isBg ? "В нашата селекция" : "In the collection"}</span>
                <strong>{featured.title}</strong>
              </div>
              <ArrowUpRight aria-hidden="true" size={22} />
            </div>
          </Link>
        )}
      </div>
      <div className={styles.heroSearch}>
        <DealerHeroSearch {...toolbarProps} locale={locale} />
      </div>
    </section>
  );
}
