<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { Attachment } from "svelte/attachments";
  import {
    matchDesktopShop,
    readDesktopShopFilters,
    type DesktopShopFilters,
  } from "#lib/data/desktop-shop.ts";
  import {
    availableShopBrands,
    availableShopCategories,
    type DesktopShopProduct,
  } from "#lib/data/shop-reference-facets.ts";

  let {
    id,
    products,
    filters,
    onapply,
    onclose,
  }: {
    id: string;
    products: readonly DesktopShopProduct[];
    filters: DesktopShopFilters;
    onapply: (filters: DesktopShopFilters) => void;
    onclose: () => void;
  } = $props();

  let draft = $derived({ ...filters });
  const normalized = $derived(
    readDesktopShopFilters(new URLSearchParams(Object.entries(draft))),
  );
  const count = $derived(matchDesktopShop(products, normalized).length);
  const categories = $derived(availableShopCategories(products));
  const brands = $derived(availableShopBrands(products, draft.category));
  const priceError = $derived(
    normalized.minPrice &&
      normalized.budget &&
      Number(normalized.minPrice) > Number(normalized.budget)
      ? locale.t("reference.shop.price.rangeError")
      : "",
  );

  // Own the modal, page scroll lock and opener focus for this component's lifetime.
  const ownDialog: Attachment<HTMLDialogElement> = (node) => {
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : undefined;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    const padding = root.style.paddingRight;
    const overflowAnchor = root.style.overflowAnchor;
    const scroll = {
      left: window.scrollX,
      top: window.scrollY,
      behavior: "instant" as const,
    };
    const gutter = window.innerWidth - root.clientWidth;
    const paddingAmount =
      Number.parseFloat(getComputedStyle(root).paddingRight) || 0;
    root.style.overflow = "hidden";
    root.style.overflowAnchor = "none";
    if (gutter > 0) root.style.paddingRight = `${paddingAmount + gutter}px`;
    node.showModal();
    node
      .querySelector<HTMLButtonElement>("header button")
      ?.focus({ preventScroll: true });
    window.scrollTo(scroll);
    return () => {
      node.close();
      root.style.overflow = overflow;
      root.style.paddingRight = padding;
      root.style.overflowAnchor = overflowAnchor;
      if (opener?.isConnected) opener.focus({ preventScroll: true });
      window.scrollTo(scroll);
    };
  };

  function dismissBackdrop(
    event: MouseEvent & { currentTarget: HTMLDialogElement },
  ) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      onclose();
  }

  function containTab(
    event: KeyboardEvent & { currentTarget: HTMLDialogElement },
  ) {
    if (event.key !== "Tab") return;
    const controls = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        "button:not(:disabled), input:not(:disabled), select:not(:disabled)",
      ),
    ].filter((element) => element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    const target =
      event.shiftKey && document.activeElement === first
        ? last
        : !event.shiftKey && document.activeElement === last
          ? first
          : undefined;
    if (target) {
      event.preventDefault();
      target.focus({ preventScroll: true });
    }
  }

  function selectCategory(category: string) {
    const available = availableShopBrands(products, category);
    draft = {
      ...draft,
      category,
      brand: available.includes(draft.brand) ? draft.brand : "",
    };
  }

  function reset() {
    draft = {
      ...readDesktopShopFilters(new URLSearchParams()),
      sort: draft.sort,
    };
  }

  function apply(event: SubmitEvent) {
    event.preventDefault();
    if (!priceError) onapply({ ...normalized });
  }
</script>

<dialog
  {id}
  class="shop-filter-dialog"
  aria-labelledby={id + "-title"}
  {@attach ownDialog}
  {onclose}
  onclick={dismissBackdrop}
  onkeydown={containTab}
  oncancel={(event) => {
    event.preventDefault();
    onclose();
  }}
>
  <form onsubmit={apply}>
    <header>
      <h2 id={id + "-title"} class="desktop-type-panel"
        >{locale.t("ui.desktop-shop-filter-dialog.product-filters")}</h2
      >
      <button
        type="button"
        class="dialog-close"
        aria-label={locale.t(
          "ui.desktop-shop-filter-dialog.close-product-filters",
        )}
        onclick={onclose}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          ><path
            d="m5 5 10 10M15 5 5 15"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          /></svg
        >
      </button>
    </header>
    <div class="dialog-body">
      <label class="filter-field desktop-type-label"
        ><span>{locale.t("reference.controls.keyword")}</span><input
          type="search"
          placeholder={locale.t(
            "ui.desktop-shop-filter-dialog.product-name-or-keyword",
          )}
          value={draft.q}
          oninput={(event) =>
            (draft = { ...draft, q: event.currentTarget.value })}
          class="desktop-type-body-small"
        /></label
      >
      <fieldset>
        <legend class="desktop-type-label"
          >{locale.t("ui.desktop-shop-filter-dialog.category")}</legend
        >
        <div class="category-options">
          <label class="category-choice"
            ><input
              type="radio"
              name={id + "-category"}
              value=""
              checked={!draft.category}
              onchange={() => selectCategory("")}
            /><span class="desktop-type-pill"
              >{locale.t("ui.desktop-shop-filter-dialog.all-products")}</span
            ></label
          >
          {#each categories as category (category.value)}
            <label class="category-choice"
              ><input
                type="radio"
                name={id + "-category"}
                value={category.value}
                checked={draft.category === category.value}
                onchange={() => selectCategory(category.value)}
              /><span class="desktop-type-pill"
                >{locale.t(category.labelKey)}</span
              ></label
            >
          {/each}
        </div>
      </fieldset>
      <label class="filter-field desktop-type-label"
        ><span>{locale.t("ui.desktop-shop-filter-dialog.product-brand")}</span
        ><select
          value={draft.brand}
          onchange={(event) =>
            (draft = { ...draft, brand: event.currentTarget.value })}
          class="desktop-type-body-small"
        >
          <option value=""
            >{locale.t("ui.desktop-shop-filter-dialog.all-brands")}</option
          >
          {#if draft.brand && !brands.includes(draft.brand)}<option
              value={draft.brand}>{draft.brand}</option
            >{/if}
          {#each brands as brand (brand)}<option value={brand}>{brand}</option
            >{/each}
        </select></label
      >
      <fieldset>
        <legend class="desktop-type-label"
          >{locale.t("ui.desktop-shop-filter-dialog.price-range")}</legend
        >
        <div class="field-pair">
          <label class="filter-field desktop-type-label"
            ><span
              >{locale.t("ui.desktop-shop-filter-dialog.minimum-price")}</span
            ><input
              type="number"
              min="0"
              step="0.01"
              placeholder={locale.t("ui.desktop-shop-filter-dialog.any")}
              value={draft.minPrice}
              oninput={(event) =>
                (draft = { ...draft, minPrice: event.currentTarget.value })}
              aria-invalid={!!priceError}
              aria-describedby={priceError ? id + "-price-error" : undefined}
              class="desktop-type-body-small"
            /></label
          >
          <label class="filter-field desktop-type-label"
            ><span
              >{locale.t("ui.desktop-shop-filter-dialog.maximum-price")}</span
            ><input
              type="number"
              min="0"
              step="0.01"
              placeholder={locale.t("ui.desktop-shop-filter-dialog.any")}
              value={draft.budget}
              oninput={(event) =>
                (draft = { ...draft, budget: event.currentTarget.value })}
              aria-invalid={!!priceError}
              aria-describedby={priceError ? id + "-price-error" : undefined}
              class="desktop-type-body-small"
            /></label
          >
        </div>
        {#if priceError}<p
            class="price-error desktop-type-meta"
            id={id + "-price-error"}
            role="status">{priceError}</p
          >{/if}
      </fieldset>
    </div>
    <footer>
      <button
        type="button"
        class="dialog-reset desktop-type-control"
        onclick={reset}
        >{locale.t("ui.desktop-shop-filter-dialog.reset-filters")}</button
      >
      <button
        type="submit"
        class="dialog-apply desktop-type-control"
        disabled={!!priceError}
        >{priceError
          ? locale.t("reference.shop.price.rangeCheck")
          : locale.t("reference.shop.show", {
              count: locale.count(count, "products"),
            })}</button
      >
    </footer>
  </form>
</dialog>

<style>
  dialog.shop-filter-dialog {
    position: fixed;
    inset: 0 0 0 auto;
    width: 480px;
    max-width: calc(100vw - 32px);
    height: 100dvh;
    max-height: none;
    padding: 0;
    margin: 0;
    border: 0;
    border-radius: 20px 0 0 20px;
    background: var(--bs-background-card);
    color: var(--bs-neutral-1000);
    box-shadow: -16px 0 60px rgb(0 0 0 / 12%);
    overflow: hidden;
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 32%);
  }
  form {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding: 24px 28px;
    border-bottom: 1px solid var(--bs-neutral-200);
    flex-shrink: 0;
  }
  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    line-height: 32px;
  }
  button {
    font: inherit;
    cursor: pointer;
  }
  .dialog-close {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 999px;
    background: var(--bs-background-card);
    color: inherit;
  }
  .dialog-body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-height: 0;
    flex: 1;
    padding: 24px 28px;
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    scroll-padding-block: 16px;
  }
  fieldset {
    padding: 0;
    margin: 0;
    border: 0;
    min-width: 0;
  }
  legend {
    float: none;
    width: auto;
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
  }
  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    margin: 0;
    font-size: 14px;
    line-height: 22px;
    font-weight: 500;
  }
  input,
  select {
    width: 100%;
    min-width: 0;
    height: 44px;
    margin: 0;
    padding: 10px 12px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 10px;
    background: var(--bs-background-card);
    color: inherit;
    font: inherit;
    font-size: 14px;
    line-height: 22px;
    box-shadow: none;
    text-overflow: ellipsis;
  }
  select {
    cursor: pointer;
    padding-right: 28px;
  }
  input::placeholder {
    color: var(--bs-neutral-500);
    opacity: 1;
  }
  input:hover,
  select:hover,
  .dialog-close:hover {
    border-color: var(--bs-neutral-500);
  }
  input:focus-visible,
  select:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000) !important;
    outline-offset: 3px;
  }
  .field-pair {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
  }
  .category-options {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
  .category-choice {
    position: relative;
    margin: 0;
  }
  .category-choice input {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: 0;
    opacity: 0;
  }
  .category-choice span {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 36px;
    padding: 6px 8px;
    border: 1px solid var(--bs-neutral-200);
    border-radius: 999px;
    font-size: 13px;
    line-height: 22px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
  }
  .category-choice:hover span {
    border-color: var(--bs-neutral-500);
  }
  .category-choice input:checked + span {
    background: var(--bs-neutral-1000);
    border-color: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
  }
  .category-choice input:focus-visible {
    outline: none !important;
  }
  .category-choice input:focus-visible + span {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 3px;
  }
  .price-error {
    margin: 12px 0 0;
    font-size: 13px;
    line-height: 20px;
    color: var(--bs-neutral-1000);
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-shrink: 0;
    padding: 20px 28px;
    border-top: 1px solid var(--bs-neutral-200);
  }
  .dialog-reset {
    padding: 10px 0;
    border: 0;
    border-radius: 4px;
    background: transparent;
    color: var(--bs-neutral-500);
    font-size: 14px;
    line-height: 22px;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .dialog-reset:hover {
    color: var(--bs-neutral-1000);
  }
  .dialog-apply {
    min-height: 44px;
    padding: 10px 24px;
    border: 1px solid var(--bs-neutral-1000);
    border-radius: 999px;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font-size: 14px;
    line-height: 22px;
    font-weight: 600;
    white-space: nowrap;
  }
  .dialog-apply:hover {
    background: #333;
    border-color: #333;
  }
  .dialog-apply:disabled {
    background: var(--bs-neutral-200);
    border-color: var(--bs-neutral-200);
    color: var(--bs-neutral-500);
    cursor: default;
  }

  @media (min-width: 992px) {
    dialog.shop-filter-dialog {
      border-radius: var(--karento-desktop-card-radius) 0 0
        var(--karento-desktop-card-radius);
    }
    header,
    .dialog-body,
    footer {
      padding: var(--karento-desktop-panel-padding);
      gap: var(--karento-desktop-panel-gap);
    }
    .dialog-close,
    .category-choice span,
    .dialog-apply {
      border-radius: var(--karento-desktop-pill-radius);
    }
    .dialog-body input:not([type="checkbox"]):not([type="radio"]),
    select {
      height: var(--karento-desktop-control-height);
      border-radius: var(--karento-desktop-control-radius);
    }
    .field-pair {
      gap: var(--karento-desktop-card-gap);
    }
    .category-options {
      gap: var(--karento-desktop-space-2);
    }
    .dialog-apply {
      min-height: var(--karento-desktop-control-height);
      padding-inline: var(--karento-desktop-panel-padding);
    }
  }
</style>
