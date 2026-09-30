/** Shared mobile geometry for inventory links and financing selection cards. */
export const mobileVehicleCardClassName =
  "grid grid-cols-[44%_minmax(0,1fr)] lg:flex lg:flex-row";

export const mobileVehicleCardImageSizes = "44vw";

export const mobileVehicleCardMediaClassName =
  "relative col-start-1 row-start-1 z-10 m-3 mr-0 aspect-[4/3] min-w-0 self-start overflow-hidden rounded-lg bg-secondary lg:z-auto lg:m-0 lg:aspect-auto lg:min-h-28 lg:w-[40%] lg:min-w-24 lg:max-w-44 lg:shrink-0 lg:self-stretch lg:rounded-none";

/** Subgrid keeps one content link aligned with the photo and full-width facts. */
export const mobileVehicleCardContentClassName =
  "col-span-2 col-start-1 row-span-2 row-start-1 grid min-w-0 grid-cols-subgrid grid-rows-subgrid lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:gap-2 lg:px-2.5 lg:py-3";

export const mobileVehicleCardInfoClassName =
  "col-start-2 row-start-1 flex min-w-0 flex-col justify-center gap-2 p-3 pl-2.5 lg:block lg:p-0";

export const mobileVehicleCardFactsClassName =
  "col-span-2 col-start-1 row-start-2 min-w-0 px-3 pb-3 lg:p-0";

export const mobileVehicleCardPriceSummaryClassName =
  "flex min-w-0 flex-col gap-0.5 lg:block";

/** Keep inventory and financing cards on the same mobile type hierarchy. */
export const mobileVehicleCardTitleClassName =
  "line-clamp-2 font-medium text-card-title text-foreground tracking-normal";

export const mobileVehicleCardPriceClassName =
  "font-semibold text-price text-foreground tabular-nums tracking-normal";
