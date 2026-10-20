import { Bike, BusFront, type LucideIcon, Truck } from "lucide-react";
import Image from "./public-image";

const artworkPaths = {
  car: "/images/services/header-system-car-v3.webp",
  bike: "/images/services/header-system-bike-v4.webp",
  truck: "/images/services/header-system-truck-v3.webp",
  van: "/images/services/header-system-van-v3.webp",
  guides: "/images/services/header-system-guides-v3.webp",
  filters: "/images/services/header-system-filters-v3.webp",
  info: "/images/services/header-system-info-v3.webp",
  location: "/images/services/header-system-location-v3.webp",
  phone: "/images/services/header-system-phone-v3.webp",
};

const categoryIconName = (icon: LucideIcon) => {
  if (icon === Bike) {
    return "bike";
  }
  if (icon === Truck) {
    return "truck";
  }
  if (icon === BusFront) {
    return "van";
  }
  return "car";
};

export function DealerMobileHeaderIcon({
  icon,
  kind,
}: {
  readonly icon: LucideIcon;
  readonly kind:
    | "category"
    | "filters"
    | "guides"
    | "info"
    | "location"
    | "phone";
}) {
  const name = kind === "category" ? categoryIconName(icon) : kind;
  const categoryArtworkClassName =
    name === "car"
      ? "size-9 select-none object-contain"
      : "size-[34px] select-none object-contain";
  const utilityArtworkClassName =
    name === "guides"
      ? "size-8 select-none object-contain"
      : "size-7 select-none object-contain";
  return (
    <span
      aria-hidden="true"
      className="relative grid size-9 place-items-center"
      data-header-artwork={name}
      data-header-icon={kind}
      data-icon-family="silver-header-artwork"
    >
      <Image
        alt=""
        // The car's shorter cutout needs the full inner frame to balance the
        // taller utility artwork. Keep every icon centred in its header slot.
        className={
          kind === "category"
            ? categoryArtworkClassName
            : utilityArtworkClassName
        }
        draggable={false}
        height={36}
        loading="eager"
        sizes="36px"
        src={artworkPaths[name]}
        // Delivery artwork is already sized at 4x its CSS slot.
        unoptimized
        width={36}
      />
    </span>
  );
}
