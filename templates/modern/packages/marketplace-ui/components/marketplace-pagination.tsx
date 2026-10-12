import { getPaginationCopy, getVisiblePages, getNativeMarketplacePaginationSlots } from "../lib/marketplace-pagination-policy";
import { cn } from "@repo/design-system/lib/utils";
import {
  buildMarketplaceSearchHref,
  type MarketplaceSearchParams,
} from "@repo/marketplace";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const DEFAULT_PAGE_SIZE = 24;

interface MarketplacePaginationProps {
  basePath?: string;
  filters: MarketplaceSearchParams;
  locale?: string;
  pageSize?: number;
  totalListings: number;
  nativeSlotTotalListings?: number;
}


export const MarketplacePagination = ({
  basePath,
  filters,
  locale,
  pageSize = DEFAULT_PAGE_SIZE,
  totalListings,
  nativeSlotTotalListings,
}: MarketplacePaginationProps) => {
  const totalPages = Math.ceil(totalListings / pageSize);

  const nativeSlots = nativeSlotTotalListings !== undefined;
  if (!nativeSlots && totalPages <= 1) {
    return null;
  }

  const currentPage = Math.min(Math.max(filters.page, 1), totalPages);
  const copy = getPaginationCopy(locale);
  const pages = nativeSlots
    ? getNativeMarketplacePaginationSlots(currentPage, totalPages, Math.ceil(nativeSlotTotalListings / pageSize))
    : getVisiblePages(currentPage, totalPages).map(page => ({ page, hidden: false }));
  const getHref = (page: number) =>
    buildMarketplaceSearchHref({ ...filters, page }, basePath);
  const pageLinkClassName =
    "inline-flex h-11 min-w-11 items-center justify-center rounded-lg border border-border bg-card px-3 font-medium text-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-10 lg:min-w-10";

  return (
    <nav
      data-native-query-slot={nativeSlots ? "pagination" : undefined}
      hidden={nativeSlots ? totalPages <= 1 : undefined}
      style={nativeSlots && totalPages <= 1 ? { display: "none" } : undefined}
      aria-label={copy.nav}
      className="mt-5 flex flex-wrap items-center justify-center gap-2 pb-2"
    >
      {(currentPage > 1 || nativeSlots) && (
        <Link
          data-native-query-slot={nativeSlots ? "pagination-prev" : undefined}
          hidden={nativeSlots ? currentPage <= 1 : undefined}
          style={nativeSlots && currentPage <= 1 ? { display: "none" } : undefined}
          aria-label={copy.previousLabel}
          className={pageLinkClassName}
          href={getHref(Math.max(1, currentPage - 1))}
          rel="prev"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">
            {copy.previous}
          </span>
        </Link>
      )}

      {pages.map(({ page, hidden }) => (
        <Link
          data-native-query-slot={nativeSlots ? `pagination-page:${page}` : undefined}
          hidden={nativeSlots ? hidden : undefined}
          style={nativeSlots && hidden ? { display: "none" } : undefined}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={copy.pageLabel(page)}
          className={cn(
            pageLinkClassName,
            page === currentPage &&
              "border-foreground bg-foreground text-background hover:bg-foreground/90"
          )}
          href={getHref(page)}
          key={page}
        >
          {page}
        </Link>
      ))}

      {(currentPage < totalPages || nativeSlots) && (
        <Link
          data-native-query-slot={nativeSlots ? "pagination-next" : undefined}
          hidden={nativeSlots ? currentPage >= totalPages : undefined}
          style={nativeSlots && currentPage >= totalPages ? { display: "none" } : undefined}
          aria-label={copy.nextLabel}
          className={pageLinkClassName}
          href={getHref(nativeSlots ? Math.max(1, Math.min(totalPages, currentPage + 1)) : currentPage + 1)}
          rel="next"
        >
          <span className="sr-only sm:not-sr-only sm:mr-1">{copy.next}</span>
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
};
