import { cn } from "@repo/design-system/lib/utils";
import type { VehicleCategory } from "@repo/marketplace";
import Image from "next/image";

type ArtworkCategory = Exclude<VehicleCategory, "lease">;

const categoryArtworkPaths: Record<ArtworkCategory, string> = {
  car: "/dealer/media-pending.svg",
  motorbike: "/dealer/media-pending.svg",
  truck: "/dealer/media-pending.svg",
  van: "/dealer/media-pending.svg",
};

export const VehicleCategoryArtwork = ({
  category,
  className,
  sizes = "128px",
}: {
  category: VehicleCategory;
  className?: string;
  sizes?: string;
}) => {
  const src =
    category === "lease"
      ? categoryArtworkPaths.car
      : categoryArtworkPaths[category];

  return (
    <span aria-hidden="true" className={cn("block", className)}>
      <Image
        alt=""
        className="h-full w-full select-none object-contain"
        data-slot="lead-category-image"
        draggable={false}
        height={400}
        sizes={sizes}
        src={src}
        width={640}
      />
    </span>
  );
};
