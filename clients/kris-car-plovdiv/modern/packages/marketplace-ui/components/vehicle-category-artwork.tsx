import { cn } from "@repo/design-system/lib/utils";
import type { VehicleCategory } from "@repo/marketplace";
import Image from "next/image";

type ArtworkCategory = Exclude<VehicleCategory, "lease">;

const categoryArtworkPaths: Record<ArtworkCategory, string> = {
  car: "/dealer/stock/21781080017250424-1.webp",
  motorbike: "/dealer/stock/11780494813207389-1.webp",
  truck: "/dealer/stock/11788352260592650-1.webp",
  van: "/dealer/stock/11760713901930244-1.webp",
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
