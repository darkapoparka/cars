import { cn } from "@repo/design-system/lib/utils";
import { withBasePath } from "@repo/internationalization/paths";
import { leadSite } from "@repo/marketplace";
import { publicSite } from "@repo/marketplace/site-config";
import { MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { mobileHeaderIconActionClassName } from "../lib/mobile-header-icon-action";
import { getLocalizedPublicPath } from "../lib/public-path";
import { DealerDesktopLogo } from "./dealer-desktop-logo";
import { DealerMobileHeaderIcon } from "./dealer-mobile-header-icon";
import Image from "./public-image";

type WordmarkTone = "original" | "light" | "dark";

function DealerMobileWordmark({
  clean,
  wordmarkTone,
}: {
  clean: boolean;
  wordmarkTone: WordmarkTone;
}) {
  if (publicSite.identity.desktopPreview) {
    return (
      <DealerDesktopLogo
        className={cn(
          "inline-flex h-11 max-w-[48vw] items-center justify-center",
          (wordmarkTone === "light" || !clean) && "text-white",
          wordmarkTone === "dark" && "text-zinc-950"
        )}
      />
    );
  }
  // Tone is the painted logo surface, not the layout-only "clean" flag.
  // Dark chrome and its black logo badge use the committed inverse raster.
  const onDarkSurface =
    wordmarkTone === "light" || (wordmarkTone === "original" && !clean);
  const logoSrc = onDarkSurface
    ? leadSite.logoOnDark
    : leadSite.logoOnLight;

  return (
    <span className="relative block h-10 w-[176px] max-w-[48vw]">
      <Image
        alt={leadSite.name}
        className="h-full w-full object-contain"
        height={512}
        priority
        sizes="(max-width: 1023px) 176px, 0px"
        src={logoSrc}
        width={1780}
      />
    </span>
  );
}

export const DealerMobileBrandBar = ({
  isBg,
  locale,
  tone = "dark",
  wordmarkTone = "original",
  onNavigate,
  leadingAction,
  trailingAction,
}: {
  readonly isBg: boolean;
  readonly leadingAction?: ReactNode;
  readonly trailingAction?: ReactNode;
  readonly locale?: string;
  readonly tone?: "clean" | "dark" | "light";
  readonly wordmarkTone?: WordmarkTone;
  readonly onNavigate?: () => void;
}) => {
  const light = tone === "light";
  const clean = tone === "clean";

  return (
    <div
      className={cn(
        "items-center",
        !clean && (light ? "text-zinc-950" : "text-white"),
        clean
          ? "flex h-11 justify-center"
          : "grid h-11 grid-cols-[44px_minmax(0,1fr)_44px]"
      )}
    >
      {clean
        ? null
        : (leadingAction ?? (
            <a
              aria-label={isBg ? "Отвори местоположението" : "Open location"}
              className={mobileHeaderIconActionClassName}
              href={withBasePath(leadSite.mapsUrl)}
              rel="noreferrer"
              target="_blank"
            >
              <DealerMobileHeaderIcon icon={MapPin} kind="location" />
            </a>
          ))}

      <Link
        aria-label={isBg ? "Начало" : "Home"}
        className={cn(
          "mx-auto flex min-h-11 min-w-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-[var(--lead-site-accent-bright)] focus-visible:outline-offset-2",
          light && "h-10 bg-black px-2.5"
        )}
        href={getLocalizedPublicPath(locale, "/")}
        onClick={onNavigate}
      >
        <DealerMobileWordmark clean={clean} wordmarkTone={wordmarkTone} />
      </Link>

      {clean
        ? null
        : (trailingAction ?? (
            <a
              aria-label={`${isBg ? "Обадете се на" : "Call"} ${leadSite.phoneDisplay}`}
              className={mobileHeaderIconActionClassName}
              href={withBasePath(leadSite.phoneHref)}
            >
              <DealerMobileHeaderIcon icon={Phone} kind="phone" />
            </a>
          ))}
    </div>
  );
};
