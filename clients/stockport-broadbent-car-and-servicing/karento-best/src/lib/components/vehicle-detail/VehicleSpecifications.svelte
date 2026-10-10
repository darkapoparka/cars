<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import {
    referenceSpecifications,
    type DetailSpecification,
  } from "#lib/data/vehicle-detail.ts";
  let {
    specifications = referenceSpecifications,
    alignStart = false,
    compact = false,
  }: {
    specifications?: readonly DetailSpecification[];
    alignStart?: boolean;
    compact?: boolean;
  } = $props();
</script>

<div class="box-feature-car"
  ><div class={["list-feature-car", { "align-items-start": alignStart }]}
    >{#each specifications as specification (specification.id)}
      {@const value = specification.valueKey
        ? locale.t(specification.valueKey)
        : typeof specification.valueNumber === "number"
          ? `${locale.number(specification.valueNumber)}${specification.unit ? ` ${locale.t(`unit.${specification.unit}`)}` : ""}`
          : locale.text(specification.value) || locale.t("vehicle.notProvided")}
      <div
        class="item-feature-car w-md-25"
        aria-label={specification.labelKey
          ? locale.t(specification.labelKey)
          : undefined}
        ><div class="item-feature-car-inner"
          ><div class="feature-image"
            ><img src={specification.icon} alt="" /></div
          ><div class="feature-info"
            ><p class="text-md-medium neutral-1000 desktop-type-body-small"
              >{#if compact && specification.mobileValue}<span
                  aria-hidden="true"
                  >{locale.text(specification.mobileValue)}</span
                ><span class="visually-hidden">{value}</span>
              {:else}{value}{/if}</p
            ></div
          ></div
        ></div
      >{/each}</div
  ></div
>

<style>
  @media (max-width: 767.98px) {
    .list-feature-car {
      align-items: stretch !important;
    }

    .list-feature-car .item-feature-car {
      display: grid;
    }

    .feature-info {
      min-width: 0;
    }

    .feature-info p {
      overflow-wrap: anywhere;
    }
  }

  @media (min-width: 992px) {
    .box-feature-car {
      padding: var(--karento-desktop-panel-padding);
      margin-bottom: var(--karento-desktop-panel-gap);
      border-radius: var(--karento-desktop-card-radius);
    }
    .list-feature-car {
      margin-inline: calc(var(--karento-desktop-space-2) * -1);
      row-gap: var(--karento-desktop-space-4);
    }
    .list-feature-car .item-feature-car {
      padding-inline: var(--karento-desktop-space-2);
      margin-bottom: 0;
    }
    .list-feature-car .item-feature-car .item-feature-car-inner {
      gap: var(--karento-desktop-space-2);
      padding: var(--karento-desktop-card-padding-compact);
      border-radius: var(--karento-desktop-control-radius);
    }
    .list-feature-car .item-feature-car-inner .feature-image {
      margin-right: 0;
    }
  }
</style>
