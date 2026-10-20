<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { ServiceCardContent } from "#lib/data/services.ts";
  import MobileMediaRow from "./MobileMediaRow.svelte";
  let {
    service,
    onselect,
    expanded,
  }: {
    service: ServiceCardContent;
    onselect?: (service: ServiceCardContent) => void;
    expanded?: boolean;
  } = $props();
</script>

<MobileMediaRow
  class="mobile-service-card"
  href={locale.href(service.href)}
  label={locale.t(
    onselect ? "reference.services.viewService" : "reference.services.enquire",
    {
      service: service.titleKey ? locale.t(service.titleKey) : service.title,
    },
  )}
  image={service.image}
  imageAlt={service.imageAlt}
  loading="lazy"
  onclick={onselect ? () => onselect?.(service) : undefined}
  {expanded}
>
  <div class="service-summary">
    <h4 class="mobile-service-title neutral-1000"
      >{service.titleKey ? locale.t(service.titleKey) : service.title}</h4
    >
    <p class="mobile-service-description neutral-600"
      >{service.summaryKey ? locale.t(service.summaryKey) : service.summary}</p
    >
  </div>
</MobileMediaRow>

<style>
  .service-summary {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--karento-space-2);
    min-width: 0;
  }
  .mobile-service-title {
    margin: 0;
    overflow-wrap: anywhere;
  }
  .mobile-service-description {
    margin: 0;
    overflow-wrap: anywhere;
  }
  @media (max-width: 767.98px) {
    .service-summary {
      gap: var(--karento-space-1);
    }
    .mobile-service-title {
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }
    .mobile-service-description {
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
    }
  }
  @media (min-width: 768px) {
    .mobile-service-title {
      font-size: var(--karento-text-card-title);
      line-height: 1.3;
    }
    .mobile-service-description {
      font-size: var(--karento-text-body);
      line-height: 1.45;
    }
  }
</style>
