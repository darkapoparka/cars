import { withBasePath } from "@repo/internationalization/paths";
import { createElement } from "react";
import { hugeiconsNavigation } from "../lib/icons/hugeicons-navigation";

const navigationArtwork: Partial<
  Record<
    keyof typeof hugeiconsNavigation,
    { src: string; width: number; top: number }
  >
> = {
  car: {
    src: "/images/services/navigation-silver-car-v5.webp",
    width: 34,
    top: -3,
  },
  import: {
    src: "/images/services/navigation-silver-import-v6.webp",
    width: 27,
    top: 0,
  },
  sell: {
    src: "/images/services/navigation-silver-sell-v6.webp",
    width: 26,
    top: 1,
  },
  lease: {
    src: "/images/services/navigation-silver-lease-v6.webp",
    width: 26,
    top: 1,
  },
  menu: {
    src: "/images/services/navigation-silver-menu-v5.webp",
    width: 32,
    top: -2,
  },
};

export function DealerBottomNavIcon({
  name,
  active = false,
}: {
  readonly name: keyof typeof hugeiconsNavigation;
  readonly active?: boolean;
}) {
  const artwork = navigationArtwork[name];
  if (artwork) {
    return (
      <span
        aria-hidden="true"
        className="relative block h-[26px] w-10 shrink-0"
        data-icon-family="generated-assets"
        data-nav-icon={name}
      >
        {active ? (
          <span
            className="absolute inset-0 rounded-full bg-zinc-100"
            data-nav-selection="true"
          />
        ) : null}
        <span
          className="relative block size-full"
          style={{
            backgroundImage: `url(${withBasePath(artwork.src)})`,
            backgroundSize: `${artwork.width}px auto`,
            backgroundPosition: `center ${artwork.top}px`,
            backgroundRepeat: "no-repeat",
          }}
        />
      </span>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className="size-6"
      data-icon-family="hugeicons-stroke-rounded"
      data-nav-icon={name}
      fill="none"
      focusable="false"
      height={24}
      viewBox="0 0 24 24"
      width={24}
    >
      {hugeiconsNavigation[name].map(([tag, attributes]) =>
        createElement(tag, { ...attributes, strokeWidth: active ? 1.9 : 1.5 })
      )}
    </svg>
  );
}
