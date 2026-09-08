import { cn } from "@repo/design-system/lib/utils";
import { leadSite } from "@repo/marketplace";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { mobileHeaderIconActionClassName } from "../lib/mobile-header-icon-action";
import { getLocalizedPublicPath } from "../lib/public-path";
import { DealerMobileHeaderIcon } from "./dealer-mobile-header-icon";

export const DealerMobileBrandBar = ({
  isBg,
  locale,
  tone = "dark",
  wordmarkTone = "original",
  onNavigate,
}: {
  readonly isBg: boolean;
  readonly locale?: string;
  readonly tone?: "clean" | "dark" | "light";
  readonly wordmarkTone?: "original" | "light" | "dark";
  readonly onNavigate?: () => void;
}) => {
  const light = tone === "light";
  const clean = tone === "clean";
  const logoWidthClassName = "w-[144px] max-w-[48vw]";

  return (
    <div
      className={cn(
        "items-center",
        !clean && (light ? "text-zinc-950" : "text-white"),
        clean
          ? "flex h-11 justify-center"
          : "grid h-[54px] grid-cols-[44px_minmax(0,1fr)_44px]"
      )}
    >
      {clean ? null : (
        <a
          aria-label={isBg ? "Отвори местоположението" : "Open location"}
          className={mobileHeaderIconActionClassName}
          href={leadSite.mapsUrl}
          rel="noreferrer"
          target="_blank"
        >
          <DealerMobileHeaderIcon icon={MapPin} kind="location" />
        </a>
      )}

      <Link
        aria-label={isBg ? "Начало" : "Home"}
        className={cn(
          "mx-auto flex min-h-11 min-w-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-[var(--lead-site-accent-bright)] focus-visible:outline-offset-2",
          light && "h-10"
        )}
        href={getLocalizedPublicPath(locale, "/")}
        onClick={onNavigate}
      >
        <span
          className={cn("relative block aspect-[336/160]", logoWidthClassName)}
        >
          <Image
            alt={leadSite.name}
            className="h-full w-full object-contain"
            height={160}
            priority
            sizes="(max-width: 1023px) 144px, 0px"
            src={leadSite.logoPath}
            style={{ filter: (wordmarkTone === "light" || (wordmarkTone === "original" && !light)) ? "grayscale(1)" : "invert(1) grayscale(1)", mixBlendMode: (wordmarkTone === "light" || (wordmarkTone === "original" && !light)) ? "screen" : "multiply" }}
            width={336}
          />
          
        </span>
      </Link>

      {clean ? null : (
        <a
          aria-label={`${isBg ? "Обадете се на" : "Call"} ${leadSite.phoneDisplay}`}
          className={mobileHeaderIconActionClassName}
          href={leadSite.phoneHref}
        >
          <DealerMobileHeaderIcon icon={Phone} kind="phone" />
        </a>
      )}
    </div>
  );
};

