<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
</script>

<section
  class="desktop-service-support background-body"
  aria-labelledby="service-support-title"
>
  <div class="container">
    <div class="service-support-panel">
      <img
        src="/assets/imgs/cta/cta-10/img-1.png"
        alt={locale.t("reference.services.planning.image")}
        loading="lazy"
        decoding="async"
      />
      <div class="service-support-copy">
        <h3 id="service-support-title" class="desktop-section-title"
          >{locale.t(
            "ui.desktop-service-support.let-s-discuss-what-you-need",
          )}</h3
        >
        <p class="desktop-type-body"
          >{locale.t(
            "ui.desktop-service-support.tell-us-which-service-interests-you-and-the-details",
          )}</p
        >
        <div class="service-support-actions">
          <a
            class="service-support-contact desktop-type-control"
            href={locale.href("/contact#contact-enquiry")}
            >{locale.t("ui.desktop-service-support.contact-us")}
            <span aria-hidden="true">↗</span></a
          >
          <a
            class="service-support-vehicles desktop-type-control"
            href={locale.href("/vehicles")}
            >{locale.t("ui.desktop-service-support.view-vehicles")}</a
          >
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .desktop-service-support {
      padding-bottom: var(--karento-desktop-space-18);
    }
    .service-support-panel {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
      align-items: stretch;
      overflow: hidden;
      border: 1px solid var(--bs-neutral-200);
      border-radius: var(--karento-desktop-card-radius);
      background: var(--bs-neutral-100);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      max-height: 320px;
      object-fit: cover;
    }
    .service-support-copy {
      display: flex;
      align-items: start;
      flex-direction: column;
      justify-content: center;
      gap: var(--karento-desktop-space-4);
      padding: var(--karento-desktop-space-10);
    }
    h3 {
      margin: 0;
      color: var(--bs-neutral-1000);
      font-size: var(--karento-type-section-size);
      line-height: var(--karento-type-section-leading);
    }
    p {
      margin: 0;
      max-width: 420px;
      color: var(--bs-neutral-500);
      font-size: var(--karento-type-body-size);
      line-height: var(--karento-type-body-leading);
    }
    .service-support-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--karento-desktop-space-5);
      margin-top: var(--karento-desktop-space-2);
    }
    .service-support-contact {
      display: inline-flex;
      align-items: center;
      gap: 18px;
      padding: 11px var(--karento-desktop-space-5);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-1000);
      color: var(--bs-neutral-0);
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-control-leading);
      text-decoration: none;
    }
    .service-support-vehicles {
      color: var(--bs-neutral-1000);
      font-size: var(--karento-type-control-size);
      font-weight: var(--karento-type-control-weight);
      text-decoration: underline;
      text-underline-offset: 4px;
    }
    a:focus-visible {
      outline: 2px solid var(--bs-neutral-1000) !important;
      outline-offset: 4px;
    }
  }

  @media (min-width: 992px) {
    .desktop-service-support {
      padding-bottom: var(--karento-desktop-space-18);
    }
    .service-support-panel {
      border-radius: var(--karento-desktop-card-radius);
    }
    .service-support-copy {
      gap: var(--karento-desktop-card-gap);
      padding: var(--karento-desktop-panel-padding);
    }
    .service-support-actions {
      gap: var(--karento-desktop-space-5);
      margin-top: var(--karento-desktop-space-2);
    }
    .service-support-contact {
      gap: var(--karento-desktop-card-gap);
      min-height: var(--karento-desktop-control-height);
      padding-inline: var(--karento-desktop-space-5);
      border-radius: var(--karento-desktop-pill-radius);
    }
  }
</style>
