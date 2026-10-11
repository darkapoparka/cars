<script lang="ts">
  import { page } from "$app/state";
  import { afterNavigate } from "$app/navigation";
  import type { Attachment } from "svelte/attachments";
  import { on } from "svelte/events";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { presentVehicle } from "#lib/i18n/vehicle.ts";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import {
    discoveryText,
    discoveryReturn,
    type DiscoveryCar,
  } from "./discovery.ts";

  let { car }: { car: DiscoveryCar } = $props();
  const locale = useLocale();
  const display = $derived(presentVehicle(car, locale));
  const returnTo = $derived(
    discoveryReturn(page.url.searchParams.get("returnTo")),
  );
  const returnParams = $derived(
    new URL(returnTo, page.url.origin).searchParams,
  );
  const returnIsBrowse = $derived(
    ["q", "collection", "make", "priceMax", "yearFrom", "yearTo"].some((key) =>
      returnParams.has(key),
    ),
  );
  let canGoBack = $state(false);
  afterNavigate(({ from }) => {
    canGoBack =
      !!from &&
      from.url.pathname + from.url.search + from.url.hash ===
        locale.href(returnTo);
  });
  const restoreResults: Attachment<HTMLDivElement> = (node) =>
    on(node, "click", (event) => {
      if (
        !canGoBack ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      if (!(event.target instanceof Element) || !event.target.closest("a"))
        return;
      event.preventDefault();
      window.history.back();
    });
  const facts = $derived([
    { id: "year", value: String(car.year) },
    { id: "mileage", value: display.mileage },
  ] as const);
</script>

<main class="main background-body discovery-detail discovery-interior">
  <div class="detail-back" {@attach restoreResults}>
    <MobilePill
      label={discoveryText(
        locale.locale,
        returnIsBrowse ? "backResults" : "backHome",
      )}
      href={returnTo}
      leadingIcon="arrow-left"
      variant="secondary"
    />
  </div>
  <div class="detail-photo"><img src={car.image} alt={car.imageAlt} /></div>
  <div class="detail-copy">
    <h1>{car.title}</h1>
    <p class="detail-price">{display.price}</p>
    <dl>
      {#each facts as fact (fact.id)}
        <div
          ><dt>{discoveryText(locale.locale, fact.id)}</dt><dd>{fact.value}</dd
          ></div
        >
      {/each}
    </dl>
    <p class="sample-note">{discoveryText(locale.locale, "sampleDetail")}</p>
    <MobilePill
      label={discoveryText(locale.locale, "more")}
      href="/2"
      trailingIcon="arrow-right"
    />
  </div>
</main>

<style>
  @media (max-width: 767.98px) {
    .discovery-detail {
      padding-bottom: var(--karento-space-8);
    }
    .detail-back {
      padding: var(--karento-space-4);
    }
    .detail-photo {
      aspect-ratio: 3 / 2;
      background: var(--bs-neutral-100);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .detail-copy {
      display: grid;
      gap: var(--karento-space-4);
      padding: var(--karento-space-6) var(--karento-space-4);
    }
    h1 {
      margin: 0;
      font-size: var(--karento-type-detail-size);
      font-weight: var(--karento-type-detail-weight);
      line-height: var(--karento-type-detail-leading);
    }
    .detail-price {
      margin: 0;
      font-size: var(--karento-type-price-size);
      font-weight: var(--karento-type-price-weight);
      line-height: var(--karento-type-price-leading);
    }
    dl {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--karento-space-4);
      margin: 0;
    }
    dt {
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }
    dd {
      margin: 0;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-body-leading);
    }
    .sample-note {
      margin: 0;
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }
  }
</style>
