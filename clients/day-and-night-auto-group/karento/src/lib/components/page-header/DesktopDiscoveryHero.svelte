<svelte:options runes={true} />

<script lang="ts" generics="FilterId extends string">
  import HeroBackdrop from "./HeroBackdrop.svelte";
  import type { HeaderImage } from "#lib/data/page-headers.ts";
  import DesktopDiscoveryControls from "./DesktopDiscoveryControls.svelte";
  let {
    image,
    title,
    titleId,
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
    embedded = false,
    searchInputId,
  }: {
    image: HeaderImage;
    title: string;
    titleId: string;
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
    embedded?: boolean;
    searchInputId?: string;
  } = $props();
</script>

<section
  class={[
    "page-header background-body karento-page-hero desktop-discovery-hero",
    !embedded && "pt-30 container",
    className,
  ]}
  aria-labelledby={titleId}
>
  <div class="custom-container position-relative mx-auto">
    <HeroBackdrop {image} />
    <div class="discovery-hero-content">
      <h1 id={titleId} class="desktop-hero-title">{title}</h1>
      <DesktopDiscoveryControls
        {searchLabel}
        {placeholder}
        bind:query
        {filters}
        {selected}
        {filtersLabel}
        {onselect}
        {onsubmit}
        {searchClass}
        {searchInputId}
      />
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .desktop-discovery-hero .custom-container {
      max-width: none;
      padding: 0;
      height: var(--karento-desktop-hero-height);
      min-height: var(--karento-desktop-hero-height);
    }
    .discovery-hero-content {
      position: absolute;
      inset: 0;
      z-index: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: var(--karento-desktop-grid-gap);
      padding: var(--karento-desktop-space-8);
      text-align: center;
    }
    h1 {
      margin: 0;
      color: var(--bs-color-white);
      font-size: var(--karento-desktop-hero-title-size);
      line-height: var(--karento-type-hero-leading);
    }
  }
</style>
