import { publicSite } from "@repo/marketplace/site-config";
import styles from "./dealer-desktop-discovery.module.css";
import { DealerDesktopHero } from "./dealer-desktop-hero";
import {
  DealerHeroSearch,
  type DealerHeroSearchProps,
} from "./dealer-hero-search";

export function DealerDesktopDiscoveryHero({
  locale,
  ...toolbarProps
}: DealerHeroSearchProps & { totalListings: number }) {
  const isBg = locale?.toLowerCase().startsWith("bg") ?? false;
  return (
    <DealerDesktopHero
      artwork={publicSite.artwork.heroScene}
      description={
        isBg
          ? "Налични автомобили. Внос по заявка. Възможности за лизинг."
          : "Available vehicles. Imports to order. Financing options."
      }
      eyebrow={publicSite.identity.name}
      title={isBg ? "Вашият следващ автомобил" : "Find your next car"}
      variant="landing"
    >
      <div className={styles.heroSearch}>
        <DealerHeroSearch
          {...toolbarProps}
          compact
          locale={locale}
          surface="hero"
        />
      </div>
    </DealerDesktopHero>
  );
}
