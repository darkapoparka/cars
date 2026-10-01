import { desktopBannerArtwork } from "../lib/desktop-banner-artwork";
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
  return (
    <section
      aria-labelledby="desktop-home-title"
      className={styles.landing}
      data-slot="dealer-desktop-home-hero"
    >
      <div className={styles.introduction}>
        <Image
          alt=""
          aria-hidden="true"
          className={styles.showroomScene}
          fill
          sizes="(min-width: 1024px) 100vw, 0px"
          src={desktopBannerArtwork.inventory}
        />
        <div className={styles.introCopy}>
          <p className={styles.eyebrow}>
            {isBg
              ? "АВТОМОБИЛИ · ВНОС · ЛИЗИНГ"
              : "INVENTORY · IMPORT · FINANCING"}
          </p>
          <h1 id="desktop-home-title">
            {isBg ? "Намерете своя автомобил." : "Find your next car."}
          </h1>
          <p className={styles.introDescription}>
            {isBg
              ? `${totalListings} автомобила. Разгледайте, сравнете, изберете.`
              : `${totalListings} vehicles. Browse, compare, find your fit.`}
          </p>
        </div>
      </div>
      <div className={styles.heroSearch}>
        <DealerHeroSearch {...toolbarProps} locale={locale} />
      </div>
    </section>
  );
}
