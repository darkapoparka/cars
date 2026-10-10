<svelte:options runes={true} />

<script lang="ts" generics="FilterId extends string">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let {
    searchLabel,
    placeholder,
    query = $bindable(""),
    filters = [],
    selected,
    filtersLabel,
    onselect,
    onsubmit,
    class: className = "",
    searchClass = "",
    searchInputId,
  }: {
    searchLabel: string;
    placeholder: string;
    query?: string;
    filters?: readonly { id: FilterId; label: string; count?: number }[];
    selected?: FilterId;
    filtersLabel?: string;
    onselect?: (id: FilterId) => void;
    onsubmit?: (event: SubmitEvent) => void;
    class?: string;
    searchClass?: string;
    searchInputId?: string;
  } = $props();
</script>

<div class={["discovery-search-controls", className]}>
  <form
    class={["discovery-search", searchClass]}
    role="search"
    aria-label={searchLabel}
    method="get"
    {onsubmit}
  >
    <input type="hidden" name="lang" value={locale.locale} />
    <label class="discovery-search-field desktop-type-label">
      <span>{searchLabel}</span>
      <input
        id={searchInputId}
        type="search"
        name="q"
        {placeholder}
        autocomplete="off"
        bind:value={query}
      />
    </label>
    <button
      class="discovery-search-button"
      type="submit"
      aria-label={searchLabel}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="8.5"
          cy="8.5"
          r="5.5"
          stroke="currentColor"
          stroke-width="1.6"
        />
        <path
          d="m13 13 4 4"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </form>
  {#if filters.length}
    <div class="discovery-categories" role="group" aria-label={filtersLabel}>
      {#each filters as filter (filter.id)}
        <button
          class={["desktop-type-pill", selected === filter.id && "active"]}
          type="button"
          aria-pressed={selected === filter.id}
          onclick={() => onselect?.(filter.id)}
        >
          {filter.label}{#if filter.count !== undefined}<span
              >{filter.count}</span
            >{/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  @media (min-width: 992px) {
    .discovery-search-controls {
      width: min(960px, 100%);
    }
    .discovery-search {
      display: flex;
      align-items: center;
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-space-3) var(--karento-desktop-space-4);
      border: 1px solid var(--bs-neutral-200);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-background-card);
      color: var(--bs-neutral-1000);
      text-align: left;
      box-shadow: 0 8px 24px rgb(0 0 0 / 6%);
    }
    .discovery-search:focus-within {
      outline: 2px solid var(--bs-color-white);
      outline-offset: 3px;
    }
    .discovery-search-field {
      display: flex;
      flex: 1;
      flex-direction: column;
      gap: var(--karento-desktop-space-1);
      min-width: 0;
      min-height: var(--karento-desktop-space-12);
      margin: 0;
      padding: 0 var(--karento-desktop-space-5);
    }
    .discovery-search-field > span {
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-label-size);
      line-height: var(--karento-type-label-leading);
    }
    input {
      width: 100%;
      min-width: 0;
      height: var(--karento-desktop-space-6);
      margin: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--bs-neutral-1000);
      font: inherit;
      font-size: var(--karento-type-body-size);
      line-height: var(--karento-type-body-leading);
    }
    input::placeholder {
      color: var(--bs-neutral-500);
    }
    input:focus {
      outline: none !important;
    }
    .discovery-search-button {
      display: grid;
      place-items: center;
      flex-shrink: 0;
      width: var(--karento-desktop-space-12);
      height: var(--karento-desktop-space-12);
      padding: 0;
      border: 1px solid var(--bs-neutral-1000);
      border-radius: 50%;
      background: var(--bs-neutral-1000);
      color: var(--bs-neutral-0);
      cursor: pointer;
    }
    .discovery-search-button:hover {
      background: var(--bs-neutral-800);
    }
    .discovery-search-button:focus-visible {
      outline: 2px solid var(--bs-neutral-1000) !important;
      outline-offset: 3px;
    }
    .discovery-categories {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--karento-desktop-space-2);
      margin-top: var(--karento-desktop-space-4);
    }
    .discovery-categories button {
      display: inline-flex;
      align-items: center;
      gap: var(--karento-desktop-space-2);
      min-height: calc(
        var(--karento-desktop-control-height) - var(--karento-desktop-space-2)
      );
      padding: var(--karento-desktop-space-2) var(--karento-desktop-space-4);
      border: 1px solid rgb(255 255 255 / 45%);
      border-radius: var(--karento-desktop-pill-radius);
      background: rgb(0 0 0 / 18%);
      color: var(--bs-color-white);
      font: inherit;
      font-size: var(--karento-type-pill-size);
      line-height: var(--karento-type-pill-leading);
      font-weight: var(--karento-type-pill-weight);
      white-space: nowrap;
      cursor: pointer;
    }
    .discovery-categories button span {
      opacity: 0.65;
      font-size: var(--karento-type-badge-size);
    }
    .discovery-categories button:hover {
      border-color: var(--bs-color-white);
      background: rgb(255 255 255 / 14%);
    }
    .discovery-categories button.active {
      border-color: var(--bs-color-white);
      background: var(--bs-color-white);
      color: var(--bs-neutral-1000);
    }
    .discovery-categories button:focus-visible {
      outline: 2px solid var(--bs-color-white) !important;
      outline-offset: 3px;
    }
  }
</style>
