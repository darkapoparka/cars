<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import { catalogSortOptions } from "#lib/data/mobile-catalog.ts";
  import type { PlainMessageKey } from "#lib/i18n/text.ts";
  let {
    prefix,
    countLabel,
    filterCount,
    sort,
    entity,
    filterOpen,
    sortOpen,
    onfilter,
    onsort,
    orderOptions = catalogSortOptions,
    filterLabel,
  }: {
    prefix: "mobile" | "rental" | "shop";
    countLabel: string;
    filterCount: number;
    sort: string;
    entity: string;
    filterOpen: boolean;
    sortOpen: boolean;
    onfilter: () => void;
    onsort: () => void;
    orderOptions?: readonly { value: string; labelKey: PlainMessageKey }[];
    filterLabel?: string;
  } = $props();
  const locale = useLocale();
  const sortTitle = $derived(
    sort === "price-asc"
      ? locale.locale === "bg"
        ? "Цена ↑"
        : "Price ↑"
      : sort === "price-desc"
        ? locale.locale === "bg"
          ? "Цена ↓"
          : "Price ↓"
        : sort === "name-asc"
          ? "A–Z"
          : locale.locale === "bg"
            ? "Подреди"
            : "Sort",
  );
  const sortOrder = $derived(
    locale.t(
      orderOptions.find((option) => option.value === sort)?.labelKey ??
        "catalog.order.default",
    ),
  );
</script>

<div class={["catalog-toolbar", `${prefix}-catalog-toolbar`]}>
  <p class="catalog-count" role="status" aria-live="polite" aria-atomic="true">
    {countLabel}
  </p>
  <div
    class="catalog-toolbar-actions"
    role="group"
    aria-label={locale.t("catalog.tools")}
  >
    <MobilePill
      class={`${prefix}-filter-trigger`}
      label={locale.t("ui.mobile-catalog.filters")}
      leadingIcon="filters"
      count={filterCount}
      selected={filterCount > 0}
      ariaLabel={filterLabel ?? locale.t("catalog.vehicleFilters")}
      popup="dialog"
      expanded={filterOpen}
      onclick={onfilter}
    />
    <MobilePill
      class={`${prefix}-sort-trigger`}
      label={sortTitle}
      leadingIcon="sort"
      selected={!!sort}
      ariaLabel={locale.t("catalog.sortLabel", { entity, order: sortOrder })}
      popup="dialog"
      expanded={sortOpen}
      onclick={onsort}
    />
  </div>
</div>

<style>
  .catalog-toolbar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }
  .catalog-toolbar-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    order: 0;
    min-width: 0;
  }
  .catalog-count {
    order: 1;
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: 13px;
    line-height: 20px;
  }
  @media (min-width: 768px) {
    .catalog-toolbar {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .catalog-count {
      order: 0;
    }
    .catalog-toolbar-actions {
      order: 1;
    }
    .catalog-toolbar :global(.mobile-pill) {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      min-height: 44px;
      padding: 8px 16px;
      border: 1px solid var(--bs-neutral-200);
      border-radius: 999px;
      background: var(--bs-neutral-0);
      color: var(--bs-neutral-1000);
      font: inherit;
      font-size: 14px;
      cursor: pointer;
    }
    .catalog-toolbar :global(.mobile-pill-selected) {
      background: var(--bs-neutral-100);
    }
  }
</style>
