<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "./DemoActionLink.svelte";
  import type { ServiceSpot } from "#lib/data/services.ts";
  import { MediaQuery } from "svelte/reactivity";
  let { spot }: { spot: ServiceSpot } = $props();
  const desktop = new MediaQuery("(min-width: 992px)");
  const title = $derived(
    desktop.current && spot.desktopTitleKey
      ? locale.t(spot.desktopTitleKey)
      : spot.title,
  );
  const description = $derived(
    spot.descriptionKey ? locale.t(spot.descriptionKey) : spot.description,
  );
</script>

<div class="card-spot background-card service-spot-card">
  <div class="card-image">
    <a
      href={locale.href(spot.href)}
      aria-label={locale.t("ui.service-spot-card.view-details")}
      ><img
        class="rounded-3"
        src={spot.image}
        alt={locale.t("image.illustrative")}
      /></a
    >
  </div>
  <div class="card-info background-card">
    <div class="card-left">
      <div class="card-title"
        ><a
          class="text-lg-bold neutral-1000 desktop-type-compact-card"
          href={locale.href(spot.href)}
          aria-label={title}>{title}</a
        ></div
      >
      <div class="card-desc"
        ><DemoActionLink
          class="text-sm neutral-500 desktop-type-body-small"
          href="#!"
          aria-label={description}>{description}</DemoActionLink
        ></div
      >
    </div>
    <div class="card-right">
      <div class="card-button"
        ><a
          href={locale.href(spot.href)}
          aria-label={locale.t("ui.service-spot-card.view-details")}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011"
              stroke=""
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </a></div
      >
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .service-spot-card .card-desc {
      display: none;
    }
  }

  @media (max-width: 767.98px) {
    .service-spot-card .card-image {
      aspect-ratio: var(--karento-image-wide);
      overflow: hidden;
    }

    .service-spot-card .card-image img {
      height: 100%;
      object-fit: cover;
    }

    .service-spot-card .card-info {
      inset-inline: var(--karento-space-3);
      bottom: var(--karento-space-3);
      padding: var(--karento-space-3);
    }

    .service-spot-card .card-title a {
      display: flex;
      align-items: center;
      min-height: var(--karento-touch-target);
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }

    .service-spot-card .card-desc :global(a) {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .service-spot-card .card-button a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--karento-touch-target);
      height: var(--karento-touch-target);
      padding: 0;
    }
  }
</style>
