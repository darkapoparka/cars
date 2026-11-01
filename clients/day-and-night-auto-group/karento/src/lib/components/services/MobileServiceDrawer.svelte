<svelte:options runes={true} />

<script module lang="ts">
  import type { PlainMessageKey } from "#lib/i18n/text.ts";
  export interface MobileServiceDetail {
    readonly id: string;
    readonly title: string;
    readonly titleKey?: PlainMessageKey;
    readonly drawerTitle?: string;
    readonly drawerTitleKey?: PlainMessageKey;
    readonly description: string;
    readonly descriptionKey?: PlainMessageKey;
    readonly image: string;
  }
</script>

<script lang="ts">
  import { tick } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobileIconButton from "#lib/components/mobile/MobileIconButton.svelte";
  import ContactEnquiryForm from "#lib/components/contact/ContactEnquiryForm.svelte";

  const locale = useLocale();
  let {
    service = $bindable<MobileServiceDetail | null>(null),
  }: { service?: MobileServiceDetail | null } = $props();
  let view = $state<"details" | "enquiry">("details");
  let root: HTMLDivElement | undefined;
  const ownRoot: Attachment<HTMLDivElement> = (node) => {
    root = node;
    return () => {
      root = undefined;
    };
  };
  const id = $props.id();
  const formId = id + "-service-enquiry";
  const name = $derived(
    service?.titleKey ? locale.t(service.titleKey) : (service?.title ?? ""),
  );
  const title = $derived(
    view === "enquiry"
      ? locale.t("ui.contact-enquiry.send-an-enquiry")
      : service?.drawerTitleKey
        ? locale.t(service.drawerTitleKey)
        : (service?.drawerTitle ?? name),
  );

  function setOpen(open: boolean) {
    if (!open) {
      service = null;
      view = "details";
    }
  }

  async function enquire() {
    view = "enquiry";
    await tick();
    if (service && view === "enquiry")
      root
        ?.querySelector<HTMLInputElement>(
          '.service-enquiry-view input:not([type="hidden"])',
        )
        ?.focus({ preventScroll: true });
  }

  async function back() {
    view = "details";
    await tick();
    if (service && view === "details")
      root
        ?.querySelector<HTMLButtonElement>(".service-enquire")
        ?.focus({ preventScroll: true });
  }

  async function showPreviewFeedback() {
    await tick();
    if (service && view === "enquiry") {
      const content = root?.querySelector<HTMLElement>(".mobile-sheet-content");
      content?.scrollTo({ top: content.scrollHeight });
    }
  }
</script>

{#snippet backAction()}
  <MobileIconButton
    label={locale.t("reference.services.backToDetails")}
    icon="arrow-left"
    onclick={back}
  />
{/snippet}

{#snippet actions()}
  {#if view === "details"}
    <button
      type="button"
      class="mobile-filter-apply service-enquire"
      onclick={enquire}>{locale.t("reference.services.enquireAction")}</button
    >
  {:else}
    <button
      type="submit"
      class="mobile-filter-apply service-enquiry-submit"
      form={formId}>{locale.t("dealer.enquiry.preview")}</button
    >
  {/if}
{/snippet}

<div class="mobile-service-flow" {@attach ownRoot}>
  <MobileSheet
    bind:open={() => service !== null, setOpen}
    {title}
    label={(view === "details" ? name : title) ||
      locale.t("ui.services.services")}
    headerLeading={view === "enquiry" ? backAction : undefined}
    footer={actions}
    class="mobile-service-sheet"
  >
    {#if service}
      {#key service.id}
        <div class="service-detail-view" hidden={view !== "details"}>
          <img
            class="service-detail-image"
            src={service.image}
            alt={locale.t("image.illustrative")}
          />
          <p class="service-detail-description">
            {service.descriptionKey
              ? locale.t(service.descriptionKey)
              : service.description}
          </p>
          <div class="service-enquiry-guide">
            <h3>{locale.t("reference.services.enquiryDetails")}</h3>
            <ul>
              <li>{locale.t("reference.services.requirements")}</li>
              <li>{locale.t("reference.services.timeframe")}</li>
              <li>{locale.t("reference.services.contactDetails")}</li>
            </ul>
          </div>
        </div>
        <div
          class="mobile-contact-form service-enquiry-view"
          hidden={view !== "enquiry"}
        >
          <p class="service-enquiry-context">
            <span>{locale.t("reference.services.subject")}</span>
            <strong>{name}</strong>
          </p>
          <ContactEnquiryForm
            idPrefix={id + "-service"}
            {formId}
            serviceTitle={name}
            showSubmit={false}
            onpreview={showPreviewFeedback}
          />
        </div>
      {/key}
    {/if}
  </MobileSheet>
</div>

<style>
  .mobile-service-flow {
    display: contents;
  }

  .service-detail-view[hidden],
  .service-enquiry-view[hidden] {
    display: none;
  }

  @media (max-width: 767.98px) {
    .mobile-service-flow :global(dialog.mobile-service-sheet) {
      height: min(86dvh, var(--mobile-sheet-height, 100dvh));
    }

    .mobile-service-flow
      :global(.mobile-service-sheet > .mobile-sheet-content) {
      flex: 1 1 auto;
    }

    .mobile-service-flow :global(.mobile-service-sheet > footer) {
      grid-template-columns: minmax(0, 1fr);
    }

    .service-detail-view {
      display: grid;
      gap: var(--karento-space-3);
      padding: var(--karento-space-2) var(--karento-space-4)
        var(--karento-space-4);
    }

    .service-detail-image {
      display: block;
      width: 100%;
      aspect-ratio: var(--karento-image-wide);
      border-radius: var(--karento-radius-media);
      object-fit: cover;
      object-position: center top;
    }

    .service-detail-description {
      margin: 0;
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-body-size);
      line-height: var(--karento-type-body-leading);
    }

    .service-enquiry-guide,
    .service-enquiry-context {
      padding: var(--karento-space-3);
      border-radius: var(--karento-radius-media);
      background: var(--karento-surface-tool);
    }

    .service-enquiry-guide h3 {
      margin: 0 0 var(--karento-space-1);
      font-size: var(--karento-type-body-size);
      font-weight: var(--karento-type-control-weight);
      line-height: var(--karento-type-body-leading);
    }

    .service-enquiry-guide ul {
      display: grid;
      gap: var(--karento-space-1);
      margin: 0;
      padding-left: var(--karento-space-4);
      color: var(--bs-neutral-600);
      font-size: var(--karento-type-body-small-size);
      line-height: var(--karento-type-body-small-leading);
    }

    .service-enquiry-view {
      padding-top: var(--karento-space-2);
    }

    .service-enquiry-guide li {
      list-style: disc;
    }

    .service-enquiry-context {
      display: grid;
      gap: var(--karento-space-1);
      margin: 0 0 var(--karento-space-3);
      font-size: var(--karento-type-body-small-size);
      line-height: var(--karento-type-body-small-leading);
    }

    .service-enquiry-context span {
      color: var(--bs-neutral-600);
    }

    .service-enquiry-context strong {
      font-weight: var(--karento-type-control-weight);
    }

    .service-enquiry-view :global(.desktop-form-help) {
      margin: 0 0 var(--karento-space-4);
      font-size: var(--karento-type-body-small-size);
      line-height: var(--karento-type-body-small-leading);
    }
  }
</style>
