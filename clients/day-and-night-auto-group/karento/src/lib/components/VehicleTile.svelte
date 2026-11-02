<script lang="ts">
  import { catalogMake } from "#lib/data/mobile-catalog.ts";
  let {
    title,
    image,
    price,
    meta,
    unit = "",
    total = "",
    href,
    onclick,
    label = title,
    class: className = "",
  }: {
    title: string;
    image: string;
    price: string;
    meta: string;
    unit?: string;
    total?: string;
    href?: string;
    onclick?: () => void;
    label?: string;
    class?: string;
  } = $props();
  const make = $derived(catalogMake({ title, price: "" }));
  const model = $derived(
    title.startsWith(make + " ") ? title.slice(make.length + 1) : title,
  );
</script>

{#snippet content()}
  <div class="tile-photo">
    <img src={image} alt={title} loading="lazy" decoding="async" />
  </div>
  <div class="tile-copy">
    <p class="tile-make">{make}</p>
    <h3 {title}>{model}</h3>
    <p class="tile-meta">{meta}</p>
    <p class={["tile-price", "car-price", { "rental-price": !!unit }]}>
      <strong>{price}</strong>{#if unit}<span>{unit}</span>{/if}
    </p>
    {#if total}<p class="tile-total rental-trip-total">{total}</p>{/if}
  </div>
{/snippet}

<article class={["vehicle-tile", className]} data-vehicle-title={title}>
  {#if href}<a {href} aria-label={label}>{@render content()}</a>{:else}<button
      type="button"
      {onclick}
      aria-label={label}>{@render content()}</button
    >{/if}
</article>

<style>
  .vehicle-tile {
    min-width: 0;
    height: 100%;
  }
  a,
  button {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: var(--bs-neutral-1000);
    font: inherit;
    text-decoration: none;
    text-align: left;
    cursor: pointer;
  }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid var(--bs-neutral-1000);
    outline-offset: 4px;
  }
  .tile-photo {
    width: 100%;
    aspect-ratio: 4/3;
    overflow: hidden;
    border: 1px solid rgb(0 0 0 / 4%);
    border-radius: 12px;
    background: var(--bs-neutral-100);
  }
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .tile-copy {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    min-width: 0;
    padding-top: 6px;
  }
  p {
    margin: 0;
  }
  .tile-make {
    color: var(--bs-neutral-500);
    font-size: 12px;
    line-height: 16px;
  }
  h3 {
    width: 100%;
    margin: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: inherit;
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
  }
  .tile-meta,
  .tile-total {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--bs-neutral-500);
    font-size: 12px;
    line-height: 16px;
  }
  .tile-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    padding-top: 2px;
    line-height: 26px;
  }
  .tile-price strong {
    font-size: 20px;
    font-weight: 600;
    line-height: inherit;
  }
  .tile-price span {
    color: var(--bs-neutral-500);
    font-size: 12px;
    line-height: inherit;
  }
</style>
