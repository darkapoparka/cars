<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { dealer } from "#lib/content.ts";
  import { footerLinkGroups } from "#lib/data/footer.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { stockNotice } from "#lib/i18n/dealer.ts";
  import DemoForm from "./DemoForm.svelte";
  const locale = useLocale();
  const primaryLocation = dealer.locations[0];
  const mapHref =
    primaryLocation?.mapUrl ??
    (primaryLocation?.address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryLocation.address)}`
      : undefined);
</script>

<footer class="footer desktop-footer">
  <div class="container">
    <div class="footer-top desktop-footer-signup">
      <div>
        <h2 class="color-white desktop-type-panel">
          {locale.t("footer.polish.updatesTitle")}
        </h2>
        <p class="neutral-400 desktop-type-body-small">
          {locale.t("footer.polish.updatesHelp")}
        </p>
      </div>
      <div class="desktop-footer-signup-form">
        <DemoForm class="desktop-subscribe-controls">
          <input
            class="form-control desktop-type-body-small"
            type="email"
            name="email"
            autocomplete="email"
            required
            placeholder={locale.t("ui.footer.enter-your-email")}
            aria-label={locale.t("ui.contact-enquiry-form.email-address")}
          />
          <button
            class="btn btn-white rounded-pill desktop-panel-action desktop-type-pill"
            type="submit"
          >
            {locale.t("footer.polish.previewSignup")}
          </button>
        </DemoForm>
      </div>
    </div>
    <div class="row desktop-footer-grid">
      <div class="col-lg-3">
        <a
          class="desktop-footer-brand"
          href={locale.href("/")}
          aria-label={locale.t("navigation.brandHome", { dealer: dealer.name })}
        >
          <img
            src={dealer.logo.footer}
            alt={dealer.logo.alt}
            width="168"
            height="76"
            style:object-fit="contain"
            style:filter={dealer.logo.monochromeOnDark
              ? "brightness(0) invert(1)"
              : undefined}
          />
        </a>
        <div
          class="desktop-footer-contacts desktop-type-body-small neutral-400"
        >
          {#if primaryLocation && mapHref}<a
              href={locale.href(mapHref)}
              aria-label={locale.t("contact.polish.directions", {
                location: primaryLocation.name,
              })}>{primaryLocation.address}</a
            >{/if}
          {#if dealer.contacts.phone}<a
              href={locale.href(`tel:${dealer.contacts.phone}`)}
              aria-label={locale.t("contact.polish.call", {
                phone: dealer.contacts.phone,
              })}>{dealer.contacts.phone}</a
            >{/if}
          {#if dealer.contacts.email}<a
              href={locale.href(`mailto:${dealer.contacts.email}`)}
              aria-label={locale.t("contact.polish.email", {
                email: dealer.contacts.email,
              })}>{dealer.contacts.email}</a
            >{/if}
        </div>
      </div>
      {#each footerLinkGroups as group (group.id)}
        <nav class="col-lg-3" aria-label={locale.text(group.title)}>
          <h2 class="color-white desktop-type-compact-card"
            >{locale.text(group.title)}</h2
          >
          <ul class="menu-footer desktop-type-body-small">
            {#each group.links as link (link.href)}
              <li
                ><a href={locale.href(link.href)}>{locale.text(link.label)}</a
                ></li
              >
            {/each}
          </ul>
        </nav>
      {/each}
    </div>
    <div class="footer-bottom desktop-footer-bottom">
      <p class="neutral-400 desktop-type-meta"
        >© {new Date().getFullYear()}
        {dealer.name}{locale.t("ui.footer.all-rights-reserved")}</p
      >
      {#if dealer.contentStatus === "reference-demo"}
        <p class="neutral-400 desktop-type-meta"
          >{locale.t("footer.polish.exampleContacts")}</p
        >
      {:else if dealer.businessPreview}
        <p class="neutral-400 desktop-type-meta"
          >{stockNotice(dealer.businessPreview, locale)}</p
        >
      {/if}
    </div>
  </div>
</footer>

<style>
  @media (min-width: 992px) {
    .desktop-footer {
      padding-top: var(--karento-desktop-section-padding-compact);
      padding-bottom: var(--karento-desktop-space-8);
    }
    .desktop-footer-signup {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: center;
      gap: var(--karento-desktop-heading-gap);
      margin-bottom: var(--karento-desktop-heading-gap);
      padding-bottom: var(--karento-desktop-heading-gap);
    }
    h2 {
      margin: 0 0 var(--karento-desktop-space-3);
    }
    p {
      margin: 0;
    }
    .desktop-footer-signup-form :global(.desktop-subscribe-controls) {
      flex-wrap: wrap;
    }
    .desktop-footer-signup-form :global(.form-control) {
      flex: 1;
      width: 0;
      min-width: 0;
      padding-inline: var(--karento-desktop-space-4);
      border: 1px solid var(--bs-neutral-700);
      background: var(--bs-neutral-800);
      color: var(--bs-neutral-0);
    }
    .desktop-footer-signup-form :global(.form-control::placeholder) {
      color: var(--bs-neutral-400);
    }
    .desktop-footer-signup-form :global([data-demo-feedback]) {
      flex-basis: 100%;
      color: var(--bs-neutral-400);
    }
    .desktop-footer-grid {
      row-gap: var(--karento-desktop-heading-gap);
    }
    .desktop-footer-brand {
      display: inline-flex;
      margin-bottom: var(--karento-desktop-space-4);
    }
    .desktop-footer-contacts {
      display: flex;
      flex-direction: column;
      gap: var(--karento-desktop-space-3);
    }
    .desktop-footer-contacts a {
      overflow-wrap: anywhere;
      color: inherit;
    }
    .menu-footer {
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .menu-footer li + li {
      margin-top: var(--karento-desktop-space-3);
    }
    .desktop-footer-bottom {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: var(--karento-desktop-space-4);
      margin-top: var(--karento-desktop-heading-gap);
      padding-top: var(--karento-desktop-space-6);
    }
    a:focus-visible,
    button:focus-visible,
    .desktop-footer-signup-form :global(input:focus-visible) {
      outline: 2px solid var(--bs-neutral-0) !important;
      outline-offset: 3px;
    }
  }
</style>
