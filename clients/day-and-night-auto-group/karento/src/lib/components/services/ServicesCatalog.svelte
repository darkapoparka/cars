<script lang="ts">
  import { flushSync, tick } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import {
    serviceCards,
    serviceFilters,
    type ServiceCardContent,
    type ServiceFilterId,
  } from "#lib/data/services.ts";
  import { serviceDetails } from "#lib/data/service-details.ts";
  import { filterDesktopServices } from "#lib/data/desktop-services.ts";
  import VehicleLandingHero from "#lib/sections/VehicleLandingHero.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import CatalogSearchBox from "#lib/components/vehicle-listing/CatalogSearchBox.svelte";
  import ContactEnquiryForm from "#lib/components/contact/ContactEnquiryForm.svelte";
  import { ownCatalogDialog } from "#lib/components/vehicle-listing/catalog-dialog.ts";

  let {
    query = $bindable(""),
    category = $bindable<ServiceFilterId>("all"),
  }: { query?: string; category?: ServiceFilterId } = $props();
  const locale = useLocale();
  const results = $derived(
    filterDesktopServices(serviceCards, query, category, locale.locale),
  );
  let draftQuery = $derived(query);
  let draftCategory: string = $derived(category);
  const active = $derived(Boolean(query.trim()) || category !== "all");
  let selected = $state<ServiceCardContent | null>(null);
  let enquiry = $state(false);
  let dialog: HTMLDialogElement | undefined;
  let searchInput: HTMLInputElement | undefined;
  const id = $props.id();
  const formId = id + "-enquiry";
  const name = $derived(selected ? title(selected) : "");
  function setSearchInput(node: HTMLInputElement | undefined) {
    searchInput = node;
  }
  function search() {
    query = draftQuery.trim();
    category =
      serviceFilters.find((option) => option.id === draftCategory)?.id ?? "all";
  }
  const ownDialog: Attachment<HTMLDialogElement> = (node) => {
    dialog = node;
    const dispose = ownCatalogDialog(node);
    return () => {
      dispose?.();
      dialog = undefined;
    };
  };
  function title(service: ServiceCardContent) {
    return service.titleKey ? locale.t(service.titleKey) : service.title;
  }
  function clear() {
    query = "";
    category = "all";
    draftQuery = "";
    draftCategory = "all";
    searchInput?.focus({ preventScroll: true });
  }
  function close() {
    selected = null;
    enquiry = false;
  }
  function open(service: ServiceCardContent) {
    enquiry = false;
    selected = service;
  }
  function showEnquiry() {
    flushSync(() => {
      enquiry = true;
    });
    dialog
      ?.querySelector<HTMLInputElement>('input:not([type="hidden"])')
      ?.focus({ preventScroll: true });
  }
  function back() {
    flushSync(() => {
      enquiry = false;
    });
    dialog
      ?.querySelector<HTMLButtonElement>(".service-enquire")
      ?.focus({ preventScroll: true });
  }
  async function showPreviewFeedback() {
    await tick();
    const body = dialog?.querySelector<HTMLElement>(".service-dialog-body");
    body?.scrollTo({ top: body.scrollHeight });
  }
  function containTab(
    event: KeyboardEvent & { currentTarget: EventTarget & HTMLDialogElement },
  ) {
    if (event.key !== "Tab") return;
    const controls = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        "button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]",
      ),
    ].filter((node) => node.getClientRects().length > 0);
    const target =
      event.shiftKey && document.activeElement === controls[0]
        ? controls.at(-1)
        : !event.shiftKey && document.activeElement === controls.at(-1)
          ? controls[0]
          : undefined;
    if (target) {
      event.preventDefault();
      target.focus();
    }
  }
</script>

<VehicleLandingHero title={locale.t("ui.services-heading.services")}>
  <CatalogSearchBox
    bind:category={draftCategory}
    bind:query={draftQuery}
    options={serviceFilters.map((option) => ({
      value: option.id,
      label: locale.t(option.labelKey),
    }))}
    label={locale.t("ui.services-heading.search-services")}
    categoryLabel={locale.t("ui.services-heading.service-categories")}
    queryLabel={locale.locale === "bg" ? "Услуга" : "Service"}
    placeholder={locale.locale === "bg" ? "Име или дума" : "Name or keyword"}
    onsearch={search}
    oninputready={setSearchInput}
  />
</VehicleLandingHero>

<section
  class="container services-catalog"
  aria-label={locale.t("ui.desktop-services.service-results")}
>
  <div class="services-summary">
    <p role="status" aria-live="polite" aria-atomic="true">
      {locale.count(results.cards.length, "services")}
    </p>
    {#if active}<button type="button" class="clear-filters" onclick={clear}
        >{locale.t("ui.desktop-services.clear-all")}</button
      >{/if}
  </div>
  {#if results.cards.length}
    <div class="services-grid">
      {#each results.cards as service (service.id)}
        <button
          class="service-card"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={selected?.id === service.id}
          aria-label={locale.t("reference.services.viewService", {
            service: title(service),
          })}
          onclick={() => open(service)}
        >
          <img src={service.image} alt="" loading="lazy" decoding="async" />
          <h2>{title(service)}</h2>
          <p>
            {service.summaryKey
              ? locale.t(service.summaryKey)
              : service.summary}
          </p>
        </button>
      {/each}
    </div>
  {:else}
    <div class="services-empty">
      <h2>{locale.t("ui.desktop-services.no-matching-services")}</h2>
      <p>
        {locale.t("ui.desktop-services.try-another-service-name-or-category")}
      </p>
      <button type="button" onclick={clear}
        >{locale.t("ui.desktop-services.clear-filters")}</button
      >
    </div>
  {/if}
  <div class="service-help">
    <div>
      <h2>
        {locale.locale === "bg"
          ? "Нека уточним подробностите"
          : "Let’s discuss the details"}
      </h2>
      <p>
        {locale.locale === "bg"
          ? "Изберете услуга или се свържете с екипа за конкретно запитване."
          : "Choose a service or contact the team with your requirements."}
      </p>
    </div>
    <a href={locale.href("/contact#contact-enquiry")}
      >{locale.t("ui.desktop-service-support.contact-us")}<MobileIcon
        name="arrow-right"
        size={16}
      /></a
    >
  </div>
</section>

{#if selected}
  <dialog
    class="service-dialog"
    aria-labelledby={id + "-title"}
    {@attach ownDialog}
    onclose={close}
    onkeydown={containTab}
    oncancel={(event) => {
      event.preventDefault();
      close();
    }}
  >
    <header>
      {#if enquiry}<button
          type="button"
          class="icon-button"
          onclick={back}
          aria-label={locale.t("reference.services.backToDetails")}
          ><MobileIcon name="arrow-left" size={20} /></button
        >{/if}
      <h2 id={id + "-title"}>
        {enquiry ? locale.t("ui.contact-enquiry.send-an-enquiry") : name}
      </h2>
      <button
        type="button"
        class="icon-button"
        onclick={close}
        aria-label={locale.locale === "bg"
          ? "Затвори услугата"
          : "Close service"}><MobileIcon name="close" size={20} /></button
      >
    </header>
    <div class="service-dialog-body">
      <div class="service-enquiry-view" hidden={!enquiry}>
        <p class="service-context">
          {locale.t("reference.services.subject")}: <strong>{name}</strong>
        </p>
        <div class="mobile-contact-form">
          <ContactEnquiryForm
            idPrefix={id}
            {formId}
            serviceTitle={name}
            showSubmit={false}
            onpreview={showPreviewFeedback}
          />
        </div>
      </div>
      <div class="service-details-view" hidden={enquiry}>
        <img class="service-detail-image" src={selected.image} alt="" />
        <p class="service-description">
          {serviceDetails[selected.id]?.[
            locale.locale === "bg" ? "bg" : "en"
          ] ??
            (selected.descriptionKey
              ? locale.t(selected.descriptionKey)
              : selected.description)}
        </p>
        <h3>{locale.t("reference.services.enquiryDetails")}</h3>
        <ul>
          <li>{locale.t("reference.services.requirements")}</li>
          <li>{locale.t("reference.services.timeframe")}</li>
          <li>{locale.t("reference.services.contactDetails")}</li>
        </ul>
      </div>
    </div>
    <footer>
      {#if enquiry}<button type="submit" class="primary-action" form={formId}
          >{locale.t("dealer.enquiry.preview")}</button
        >
      {:else}
        {#if selected.category === "rentals"}<a
            class="rent-link"
            href={locale.href("/rent")}
            >{locale.t("navigation.rent")}<MobileIcon
              name="arrow-right"
              size={16}
            /></a
          >{/if}
        <button
          type="button"
          class="primary-action service-enquire"
          onclick={showEnquiry}
          >{locale.t("reference.services.enquireAction")}</button
        >
      {/if}
    </footer>
  </dialog>
{/if}

<style>
  .service-enquiry-view[hidden],
  .service-details-view[hidden] {
    display: none;
  }
  .icon-button {
    display: inline-flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: var(--bs-neutral-100);
    color: var(--bs-neutral-1000);
    cursor: pointer;
  }
  .services-catalog {
    padding-top: 16px;
    padding-bottom: 40px;
  }
  .services-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 44px;
    margin: 4px 0 8px;
  }
  .services-summary p {
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: 13px;
  }
  .clear-filters {
    min-height: 44px;
    padding: 4px 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 3px;
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }
  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
  .service-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: var(--bs-neutral-1000);
    text-align: left;
    font: inherit;
    cursor: pointer;
  }
  .service-card img {
    width: 100%;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 12px;
    background: var(--bs-neutral-100);
  }
  .service-card h2 {
    margin: 2px 0 0;
    font-size: 17px;
    line-height: 23px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  .service-card p {
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: 14px;
    line-height: 20px;
  }
  .service-card:hover img {
    filter: brightness(0.96);
  }
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
  }
  .services-empty {
    padding: 32px 0;
  }
  .services-empty h2,
  .service-help h2 {
    margin: 0 0 8px;
    font-size: 20px;
    line-height: 26px;
  }
  .services-empty p,
  .service-help p {
    margin: 0;
    color: var(--bs-neutral-500);
    font-size: 14px;
    line-height: 21px;
  }
  .services-empty button {
    min-height: 44px;
    margin-top: 12px;
    border: 0;
    border-radius: 999px;
    padding: 8px 18px;
    font: inherit;
    cursor: pointer;
  }
  .service-help {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    margin-top: 36px;
    padding: 24px;
    border-radius: 16px;
    background: var(--bs-neutral-100);
  }
  .service-help a,
  .primary-action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 44px;
    padding: 10px 18px;
    border: 0;
    border-radius: 999px;
    background: var(--bs-neutral-1000);
    color: var(--bs-neutral-0);
    font: inherit;
    font-size: 14px;
    line-height: 20px;
    text-decoration: none;
    cursor: pointer;
  }
  .service-help a {
    flex-shrink: 0;
  }
  .service-dialog {
    display: flex;
    flex-direction: column;
    width: min(560px, calc(100% - 24px));
    max-height: min(90dvh, 780px);
    margin: auto;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 18px;
    background: var(--bs-neutral-0);
    color: var(--bs-neutral-1000);
  }
  .service-dialog::backdrop {
    background: rgb(0 0 0 / 45%);
  }
  .service-dialog header {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    padding: 12px 16px;
    border-bottom: 1px solid var(--bs-neutral-200);
  }
  .service-dialog header h2 {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 18px;
    line-height: 24px;
    font-weight: 600;
  }
  .service-dialog-body {
    padding: 16px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .service-detail-image {
    display: block;
    width: 100%;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 10px;
  }
  .service-description {
    margin: 16px 0;
    font-size: 15px;
    line-height: 23px;
  }
  .service-dialog h3 {
    margin: 20px 0 8px;
    font-size: 16px;
    line-height: 22px;
  }
  .service-dialog ul {
    margin: 0;
    padding-left: 20px;
    color: var(--bs-neutral-500);
    font-size: 14px;
    line-height: 24px;
  }
  .service-context {
    margin: 0 0 16px;
    font-size: 14px;
  }
  .service-dialog footer {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;
    padding: 12px 16px;
    border-top: 1px solid var(--bs-neutral-200);
  }
  .rent-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-right: auto;
    min-height: 44px;
    color: inherit;
    font-size: 14px;
    text-decoration: none;
  }
  @media (max-width: 767.98px) {
    .services-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 20px 12px;
    }
    .service-card {
      gap: 4px;
    }
    .service-card h2 {
      font-size: 14px;
      line-height: 19px;
    }
    .service-card p {
      font-size: 12px;
      line-height: 17px;
    }
    .service-help {
      align-items: flex-start;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      margin-top: 28px;
    }
    .service-help h2 {
      font-size: 18px;
      line-height: 24px;
    }
    .service-help a {
      width: 100%;
    }
    .service-dialog header {
      padding: 10px 12px;
    }
    .service-dialog header h2 {
      font-size: 16px;
      line-height: 22px;
    }
    .service-dialog footer .primary-action {
      flex: 1;
    }
  }
</style>
