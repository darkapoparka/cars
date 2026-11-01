<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import type { DealerContent } from "#lib/content.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  let { location }: { location: DealerContent["locations"][number] } = $props();
  const mapHref = $derived(
    location.mapUrl ??
      (location.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`
        : undefined),
  );
  const phoneHref = $derived(
    location.phone
      ? (location.phoneHref ?? `tel:${location.phone}`)
      : undefined,
  );
  const emailHref = $derived(
    location.email
      ? (location.emailHref ?? `mailto:${location.email}`)
      : undefined,
  );
</script>

{#snippet contactIcon(kind: "location" | "phone" | "email")}
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    {#if kind === "location"}
      <path
        d="M10 18s6-6.5 6-11A6 6 0 0 0 4 7c0 4.5 6 11 6 11Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <circle cx="10" cy="7" r="2" stroke="currentColor" stroke-width="1.5" />
    {:else if kind === "phone"}
      <path
        d="M4 3h3l1.5 4-2 2a13 13 0 0 0 4.5 4.5l2-2 4 1.5v3c0 1-1 2-2 2C8 17 3 12 2 5c0-1 1-2 2-2Z"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    {:else}
      <rect
        x="2"
        y="4"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="m3 5 7 6 7-6"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
    {/if}
  </svg>
{/snippet}

<div class="col-lg-3">
  <article class="card-contact karento-contact-card desktop-contact-card">
    {#if location.avatar}
      <div class="card-image"
        ><img
          class="karento-contact-avatar"
          src={location.avatar}
          alt=""
          width="160"
          height="160"
          loading="lazy"
          decoding="async"
        /></div
      >
    {/if}
    <div class="card-info">
      <div class="card-title">
        <h3 class="title heading-6 desktop-type-card">{location.name}</h3>
        {#if location.country}<p
            class="karento-contact-country neutral-500 desktop-type-meta"
            >{location.country}</p
          >{/if}
      </div>
      <div class="desktop-contact-methods desktop-type-body-small">
        {#if location.address && mapHref}<a
            href={locale.href(mapHref)}
            aria-label={locale.t("contact.polish.directions", {
              location: location.name,
            })}
          >
            {@render contactIcon("location")}<span>{location.address}</span>
          </a>{/if}
        {#if location.phone && phoneHref}<a
            href={locale.href(phoneHref)}
            aria-label={locale.t("contact.polish.call", {
              phone: location.phone,
            })}
          >
            {@render contactIcon("phone")}<span>{location.phone}</span>
          </a>{/if}
        {#if location.email && emailHref}<a
            href={locale.href(emailHref)}
            aria-label={locale.t("contact.polish.email", {
              email: location.email,
            })}
          >
            {@render contactIcon("email")}<span>{location.email}</span>
          </a>{/if}
      </div>
    </div>
    <a
      class="btn desktop-action-primary desktop-card-action desktop-type-pill desktop-contact-enquire"
      href={locale.href("/contact#contact-enquiry")}
      aria-label={locale.t("contact.polish.locationEnquiry", {
        location: location.name,
      })}
    >
      {locale.t("ui.desktop-services.enquire")}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M3 8h10m-4-4 4 4-4 4"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </a>
  </article>
</div>

<style>
  @media (min-width: 992px) {
    .desktop-contact-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin-bottom: 0;
    }
    .desktop-contact-methods {
      display: flex;
      flex-direction: column;
      gap: var(--karento-desktop-space-3);
    }
    .desktop-contact-methods a {
      display: flex;
      align-items: start;
      gap: var(--karento-desktop-space-2);
      min-width: 0;
      color: var(--bs-neutral-1000);
    }
    .desktop-contact-methods svg {
      flex-shrink: 0;
    }
    .desktop-contact-methods span {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .desktop-contact-enquire {
      align-self: center;
      margin-top: auto;
    }
    .card-info {
      margin-bottom: var(--karento-desktop-card-gap);
    }
  }
</style>
