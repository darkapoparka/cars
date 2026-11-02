<script lang="ts">
  import "#lib/styles/hero-search.css";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  let {
    category = $bindable(""),
    query = $bindable(""),
    options,
    label,
    categoryLabel,
    queryLabel,
    placeholder,
    onsearch,
    oninputready,
  }: {
    category?: string;
    query?: string;
    options: readonly { value: string; label: string }[];
    label: string;
    categoryLabel: string;
    queryLabel: string;
    placeholder: string;
    onsearch: () => void;
    oninputready?: (node: HTMLInputElement | undefined) => void;
  } = $props();
  const locale = useLocale();
  const selectedLabel = $derived(
    options.find((option) => option.value === category)?.label ?? "",
  );
</script>

<form
  class="catalog-search-box hero-search hero-search-grid"
  role="search"
  aria-label={label}
  onsubmit={(event) => {
    event.preventDefault();
    onsearch();
  }}
>
  <label
    class={[
      "hero-search-field",
      { "is-empty": category === options[0]?.value },
    ]}
  >
    <span class="hero-search-label"
      >{locale.locale === "bg" ? "Категория" : "Category"}</span
    >
    <span class="hero-search-value" aria-hidden="true" title={selectedLabel}
      >{selectedLabel}</span
    >
    <span class="hero-search-chevron" aria-hidden="true"
      ><MobileIcon name="chevron-down" size={14} /></span
    >
    <select bind:value={category} aria-label={categoryLabel}>
      {#each options as option (option.value)}<option value={option.value}
          >{option.label}</option
        >{/each}
    </select>
  </label>
  <label class="hero-search-field"
    ><span class="hero-search-label">{queryLabel}</span><input
      class="hero-search-value"
      type="search"
      bind:value={query}
      {placeholder}
      {@attach (node) => {
        oninputready?.(node);
        return () => oninputready?.(undefined);
      }}
    /></label
  >
  <button class="hero-search-action" type="submit"
    ><MobileIcon name="search" size={18} />{locale.locale === "bg"
      ? "Търси"
      : "Search"}</button
  >
</form>

<style>
  select {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    font: inherit;
    font-size: 16px;
  }
</style>
