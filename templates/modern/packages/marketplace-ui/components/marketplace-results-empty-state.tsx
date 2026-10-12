import { getMarketplaceResultsEmptyCopy } from "../lib/native-marketplace-query-policy";
import { Button } from "@repo/design-system/components/ui/button";
import {
  buildMarketplaceSearchHref,
  type MarketplaceSearchParams,
} from "@repo/marketplace";
import { Search } from "lucide-react";
import Link from "next/link";

export const MarketplaceResultsEmptyState = ({
  currentPath,
  filters,
  filtered,
  isBg,
  onChooseCategory,
  nativeQuerySlots = false,
}: {
  currentPath: string;
  filters: MarketplaceSearchParams;
  filtered: boolean;
  isBg: boolean;
  onChooseCategory: () => void;
  nativeQuerySlots?: boolean;
}) => {
  const { title, description } = getMarketplaceResultsEmptyCopy(filtered, isBg);

  const clearAction = (<Button
          hidden={nativeQuerySlots ? !filtered : undefined}
          style={nativeQuerySlots && !filtered ? { display: "none" } : undefined}
          asChild
          className="mt-5 h-12 w-full max-w-xs rounded-xl lg:h-10 lg:w-auto"
        >
          <Link
            data-native-query-slot={nativeQuerySlots ? "empty-clear-link" : undefined}
            href={buildMarketplaceSearchHref(
              {
                category: filters.category,
                page: 1,
                sort: "recommended",
              },
              currentPath
            )}
          >
            {isBg ? "Изчисти филтрите" : "Clear filters"}
          </Link>
        </Button>);
  const categoryAction = (<Button
          className="mt-5 h-12 w-full max-w-xs rounded-xl lg:h-10 lg:w-auto"
          data-native-query-slot={nativeQuerySlots ? "empty-category-action" : undefined}
          hidden={nativeQuerySlots ? filtered : undefined}
          style={nativeQuerySlots && filtered ? { display: "none" } : undefined}
          onClick={onChooseCategory}
          type="button"
        >
          {isBg ? "Избери друга категория" : "Choose another category"}
        </Button>);

  return (
    <div
      aria-live="polite"
      className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-zinc-50/70 px-5 py-10 text-center lg:min-h-72 lg:border-dashed lg:bg-secondary/40 lg:px-6 lg:py-0"
      data-slot="marketplace-empty-state"
    >
      <span className="mb-4 grid size-12 place-items-center rounded-full border border-zinc-200/70 bg-white shadow-sm">
        <Search aria-hidden="true" className="size-5 text-zinc-500" />
      </span>
      <h2 data-native-query-slot={nativeQuerySlots ? "empty-title" : undefined} className="font-semibold text-card-title lg:text-card-title-lg">
        {title}
      </h2>
      <p data-native-query-slot={nativeQuerySlots ? "empty-description" : undefined} className="mt-1.5 max-w-sm text-meta text-muted-foreground leading-5">
        {description}
      </p>
      {nativeQuerySlots ? <>{clearAction}{categoryAction}</> : filtered ? clearAction : categoryAction}
    </div>
  );
};
