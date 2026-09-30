/** Shared mobile geometry for inventory links and financing selection cards. */
export const mobileVehicleCardClassName = "flex flex-col lg:flex-row";

export const mobileVehicleCardImageSizes = "calc(100vw - 2rem)";

export const mobileVehicleCardMediaClassName =
  "relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-secondary lg:aspect-auto lg:min-h-28 lg:w-[40%] lg:min-w-24 lg:max-w-44 lg:self-stretch";

export const mobileVehicleCardContentClassName =
  "flex min-w-0 flex-1 flex-col gap-2.5 p-3 min-[390px]:p-4 lg:justify-center lg:gap-2 lg:px-2.5 lg:py-3";

export const mobileVehicleCardPriceSummaryClassName =
  "flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1 lg:block";

/** Keep inventory and financing cards on the same mobile type hierarchy. */
export const mobileVehicleCardTitleClassName =
  "line-clamp-2 font-medium text-card-title text-foreground tracking-normal";

export const mobileVehicleCardPriceClassName =
  "font-semibold text-price-lg text-foreground tabular-nums tracking-normal lg:text-price";
