/** Shared mobile geometry for inventory links and financing selection cards. */
export const mobileVehicleCardMediaClassName =
  "relative min-h-28 w-[36%] min-w-24 max-w-44 shrink-0 self-stretch overflow-hidden bg-secondary min-[390px]:w-[40%]";

export const mobileVehicleCardContentClassName =
  "flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-2 py-2.5 min-[360px]:gap-2 min-[360px]:px-2.5 min-[360px]:py-3";

/** Keep inventory and financing cards on the same mobile type hierarchy. */
export const mobileVehicleCardTitleClassName =
  "line-clamp-2 font-medium text-card-title text-foreground tracking-normal";

export const mobileVehicleCardPriceClassName =
  "font-semibold text-price text-foreground tabular-nums tracking-normal";
