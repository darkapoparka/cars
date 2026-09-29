/** Shared mobile geometry for inventory links and financing selection cards. */
export const mobileVehicleCardClassName =
  "grid grid-cols-[minmax(0,48fr)_minmax(0,52fr)]";

export const mobileVehicleCardImageSizes = "48vw";

export const mobileVehicleCardMediaClassName =
  "relative col-start-1 row-start-1 aspect-[4/3] min-h-28 w-full self-stretch overflow-hidden bg-secondary";

/** Span both rows so the summary link covers the facts as well as the title. */
export const mobileVehicleCardContentClassName =
  "col-span-2 col-start-1 row-span-2 row-start-1 grid min-w-0 grid-cols-subgrid grid-rows-subgrid";

export const mobileVehicleCardSummaryClassName =
  "col-start-2 row-start-1 flex min-h-28 min-w-0 flex-col justify-center gap-1 px-2.5 py-2.5 min-[360px]:px-3 min-[360px]:py-3";

export const mobileVehicleCardFactsClassName =
  "col-span-2 row-start-2 px-2.5 py-2 min-[360px]:px-3 min-[360px]:py-2.5";

/** Keep inventory and financing cards on the same mobile type hierarchy. */
export const mobileVehicleCardTitleClassName =
  "line-clamp-3 font-medium text-card-title text-foreground tracking-normal";

export const mobileVehicleCardPriceClassName =
  "font-semibold text-price text-foreground tabular-nums tracking-normal";
