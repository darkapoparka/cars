import type { PublicSiteConfig } from "@repo/marketplace/site-config";
import { publicSite } from "@repo/marketplace/site-config";
import styles from "./dealer-desktop-logo.module.css";
import Image from "./public-image";

/** Master preview wordmark; personalized copies retain their configured raster logo. */
export function DealerDesktopLogo({
  className,
  inverse = false,
  site = publicSite,
}: {
  className?: string;
  inverse?: boolean;
  site?: PublicSiteConfig;
}) {
  if (site.identity.desktopPreview) {
    return (
      <span className={className}>
        <span className={styles.wordmark}>
          {site.identity.desktopPreview.shortName}
        </span>
      </span>
    );
  }
  return (
    <Image
      alt={site.identity.name}
      className={className}
      height={48}
      sizes="(max-width: 1023px) 1px, 160px"
      src={inverse ? site.identity.inverseLogo : site.identity.logo}
      width={220}
    />
  );
}
