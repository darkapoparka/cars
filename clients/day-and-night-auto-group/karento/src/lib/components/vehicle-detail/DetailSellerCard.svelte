<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import {
    referenceSeller,
    type DetailSeller,
  } from "#lib/data/vehicle-detail.ts";
  let {
    seller = referenceSeller,
    desktopBranding = false,
  }: { seller?: DetailSeller; desktopBranding?: boolean } = $props();
  const brandReferenceSeller = $derived(
    desktopBranding && seller === referenceSeller,
  );
  const displayedSeller = $derived<DetailSeller>(
    brandReferenceSeller
      ? {
          name: dealer.name,
          location: dealer.locations[0]?.address ?? "",
          avatar: dealer.logo.light,
          mobile: dealer.contacts.phone,
          email: dealer.contacts.email,
          whatsapp: "",
          fax: "",
        }
      : seller,
  );
</script>

{#snippet listingsAction()}
  <span class="seller-listings-full"
    >{locale.t("ui.detail-seller-card.all-items-by-this-dealer")}</span
  >
  <span class="seller-listings-mobile" aria-hidden="true"
    >{locale.t("ui.detail-seller-card.mobile-items-by-this-dealer")}</span
  >
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M8 15L15 8L8 1M15 8L1 8"
      stroke=""
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    ></path>
  </svg>
{/snippet}

<div
  class={[
    "sidebar-left border-1 background-card desktop-panel",
    { "seller-dealer-brand": brandReferenceSeller },
  ]}
>
  <h6 class="text-xl-bold neutral-1000 desktop-type-panel"
    >{locale.t("ui.detail-seller-card.listed-by")}</h6
  >
  <div class="box-sidebar-content">
    <div class="box-agent-support border-bottom pb-3 mb-3">
      <div class="card-author">
        {#if brandReferenceSeller}
          <div class="me-2"
            ><img src={dealer.logo.light} alt={dealer.logo.alt} /></div
          >
        {:else}
          <div class="me-2"><img src={seller.avatar} alt={seller.name} /></div>
        {/if}
        <div class="card-author-info">
          <p
            class={[
              "text-lg-bold neutral-1000 desktop-type-compact-card",
              { "visually-hidden": brandReferenceSeller },
            ]}>{displayedSeller.name}</p
          >
          <p class="text-sm-medium neutral-500 desktop-type-meta"
            >{displayedSeller.location}</p
          >
        </div>
      </div>
    </div>
    <div class="box-info-contact">
      {#if displayedSeller.mobile}<p
          class="text-md-medium mobile-phone neutral-1000 desktop-type-body-small"
          ><span class="text-md-bold desktop-type-label"
            >{locale.t("ui.detail-seller-card.mobile")}</span
          >
          <a href={locale.href(`tel:${displayedSeller.mobile}`)}
            >{displayedSeller.mobile}</a
          ></p
        >{/if}
      {#if displayedSeller.email}<p
          class="text-md-medium email neutral-1000 desktop-type-body-small"
          ><span class="text-md-bold desktop-type-label"
            >{locale.t("ui.detail-seller-card.email")}</span
          >
          <a href={locale.href(`mailto:${displayedSeller.email}`)}
            >{displayedSeller.email}</a
          ></p
        >{/if}
      {#if displayedSeller.whatsapp}<p
          class="text-md-medium whatsapp neutral-1000 desktop-type-body-small"
          ><span class="text-md-bold desktop-type-label"
            >{locale.t("ui.detail-seller-card.whatsapp")}</span
          >
          {displayedSeller.whatsapp}</p
        >{/if}
      {#if displayedSeller.fax}<p
          class="text-md-medium fax neutral-1000 desktop-type-body-small"
          ><span class="text-md-bold desktop-type-label"
            >{locale.t("ui.detail-seller-card.fax")}</span
          >
          {displayedSeller.fax}</p
        >{/if}
    </div>
    <div class="box-link-bottom">
      {#if brandReferenceSeller || dealer.businessPreview}
        <a
          class="btn btn-primary py-3 w-100 rounded-3 desktop-type-control desktop-panel-action"
          href={locale.href("/vehicles")}
          aria-label={locale.t(
            "ui.detail-seller-card.all-items-by-this-dealer",
          )}
        >
          {@render listingsAction()}
        </a>
      {:else}
        <DemoActionLink
          class="btn btn-primary py-3 w-100 rounded-3 desktop-type-control desktop-panel-action"
          href="#!"
          aria-label={locale.t(
            "ui.detail-seller-card.all-items-by-this-dealer",
          )}
        >
          {@render listingsAction()}
        </DemoActionLink>
      {/if}
    </div>
  </div>
</div>

<style>
  .seller-listings-mobile {
    display: none;
  }

  @media (max-width: 767.98px) {
    .seller-listings-full {
      display: none;
    }

    .seller-listings-mobile {
      display: inline;
    }

    .sidebar-left {
      padding: var(--karento-space-4);
      margin: 0;
      border-radius: var(--karento-radius-card);
    }

    .sidebar-left > h6 {
      margin: 0;
      font-size: var(--karento-type-panel-size);
      font-weight: var(--karento-type-panel-weight);
      line-height: var(--karento-type-panel-leading);
    }

    .sidebar-left .box-sidebar-content {
      padding-top: var(--karento-space-3);
    }

    .box-sidebar-content .box-agent-support {
      padding-bottom: var(--karento-space-3) !important;
      margin-bottom: var(--karento-space-3) !important;
    }

    .card-author > div:first-child {
      flex: 0 0 auto;
    }

    .card-author img {
      width: var(--karento-control-field);
      height: var(--karento-control-field);
      object-fit: contain;
    }

    .card-author-info {
      min-width: 0;
    }

    .card-author-info > p:first-child {
      font-size: var(--karento-type-card-size);
      font-weight: var(--karento-type-card-weight);
      line-height: var(--karento-type-card-leading);
    }

    .card-author-info > p:last-child {
      font-size: var(--karento-type-meta-size);
      font-weight: var(--karento-type-meta-weight);
      line-height: var(--karento-type-meta-leading);
    }

    .sidebar-left .box-info-contact {
      display: grid;
      gap: var(--karento-space-2);
      margin: var(--karento-space-3) 0 var(--karento-space-4);
    }

    .box-info-contact p {
      margin: 0;
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-body-weight);
      line-height: var(--karento-type-body-leading);
      overflow-wrap: anywhere;
    }

    .box-info-contact p > span {
      font-size: var(--karento-type-label-size);
      font-weight: var(--karento-type-label-weight);
      line-height: var(--karento-type-label-leading);
    }

    .box-info-contact :is(.mobile-phone, .email) {
      display: flex;
      align-items: center;
      gap: var(--karento-space-2);
    }

    .box-info-contact :is(.mobile-phone, .email) > a {
      display: inline-flex;
      flex: 1;
      align-items: center;
      min-width: var(--karento-touch-target);
      min-height: var(--karento-touch-target);
    }

    .box-link-bottom :global(.btn) {
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-control-leading);
    }

    .sidebar-left :global(output[data-demo-action]) {
      font-size: var(--karento-type-body-small-size);
      font-weight: var(--karento-type-body-small-weight);
      line-height: var(--karento-type-body-small-leading);
    }

    .sidebar-left .box-link-bottom {
      margin: 0;
    }
  }

  @media (min-width: 992px) {
    .seller-dealer-brand .card-author {
      display: grid;
      gap: var(--karento-desktop-space-3);
    }
    .seller-dealer-brand .card-author img {
      width: auto;
      height: var(--karento-desktop-space-8);
      max-width: 100%;
      border-radius: 0;
      object-fit: contain;
    }
    .seller-dealer-brand .card-author-info p {
      margin: 0;
    }
    .sidebar-left {
      margin-bottom: var(--karento-desktop-panel-gap);
    }
    .sidebar-left > h6 {
      margin: 0;
    }
    .sidebar-left .box-sidebar-content {
      padding-top: var(--karento-desktop-space-4);
    }
    .sidebar-left .box-agent-support {
      padding-bottom: var(--karento-desktop-space-4) !important;
      margin-bottom: var(--karento-desktop-space-4) !important;
    }
    .sidebar-left .box-info-contact {
      display: grid;
      gap: var(--karento-desktop-space-3);
      margin: var(--karento-desktop-space-4) 0;
    }
    .box-info-contact p {
      margin: 0;
      overflow-wrap: anywhere;
    }
    .sidebar-left .box-link-bottom {
      margin: 0;
    }
  }
</style>
