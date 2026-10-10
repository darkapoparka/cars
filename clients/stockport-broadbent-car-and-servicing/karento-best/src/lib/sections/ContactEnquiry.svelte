<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ContactEnquiryForm from "#lib/components/contact/ContactEnquiryForm.svelte";
  import MobileSheet from "#lib/components/MobileSheet.svelte";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { dealer } from "#lib/content.ts";
  let { open = $bindable(false) }: { open?: boolean } = $props();
  const phone = new MediaQuery("(max-width: 767.98px)");

  const address = dealer.locations[0]?.address ?? "";
  const locationQuery = encodeURIComponent(address);
</script>

<section
  class="box-section box-contact-form karento-contact-enquiry"
  aria-labelledby="contact-enquiry"
>
  <div class="container">
    <div class="karento-enquiry-shell">
      <div class="row karento-contact-layout">
        <div class="col-lg-6">
          <div class="karento-enquiry-panel">
            <h2
              id="contact-enquiry"
              tabindex="-1"
              class="neutral-1000 mb-25 karento-hero-target desktop-section-title"
              >{locale.t("ui.contact-enquiry.get-in-touch")}</h2
            >
            {#if phone.current}
              <div class="mobile-contact-opener">
                <p class="neutral-500"
                  >{locale.t(
                    dealer.businessPreview
                      ? "dealer.contact.body"
                      : "ui.contact-enquiry.ask-about-a-vehicle-or-our-services",
                  )}</p
                >
                <MobilePill
                  label={locale.t("ui.contact-enquiry.send-an-enquiry")}
                  trailingIcon="arrow-up-right"
                  popup="dialog"
                  expanded={open}
                  onclick={() => (open = true)}
                />
              </div>
            {:else}<ContactEnquiryForm />{/if}
            {#if address}<div class="karento-contact-location">
                <p class="neutral-500 karento-contact-address">{address}</p>
                <a
                  class="karento-contact-directions"
                  href={locale.href(
                    `https://www.google.com/maps/search/?api=1&query=${locationQuery}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  >{locale.t("ui.contact-enquiry.get-directions")}
                  <span aria-hidden="true">↗</span></a
                >
              </div>{/if}
          </div>
        </div>
        {#if address}<div class="col-lg-6">
            <div class="karento-contact-map">
              <iframe
                src={`https://maps.google.com/maps?q=${locationQuery}&z=13&output=embed`}
                width="100%"
                height="650"
                style="border:0;"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                title={locale.t(
                  "ui.contact-enquiry.illustrative-dealership-location",
                )}
              >
              </iframe>
            </div>
          </div>{/if}
      </div>
    </div>
  </div>
</section>

{#if phone.current}
  <MobileSheet
    bind:open
    title={locale.t("ui.contact-enquiry.send-an-enquiry")}
    class="mobile-contact-sheet"
  >
    <div class="mobile-contact-form">
      <ContactEnquiryForm idPrefix="mobile-contact" />
    </div>
  </MobileSheet>
{/if}

<style>
  /* The owner requested one outer panel, with an inner card only for the form. */
  .karento-enquiry-shell {
    padding: 24px;
    border: 1px solid var(--bs-border-color);
    border-radius: 16px;
    background: var(--bs-background-card);
  }

  .karento-enquiry-panel {
    padding: 24px;
    border-radius: 12px;
  }

  .karento-contact-map {
    border-radius: 12px;
  }

  @media (max-width: 767.98px) {
    .karento-contact-directions {
      display: inline-flex;
      align-items: center;
      gap: var(--karento-space-2);
      min-height: var(--karento-touch-target);
    }
  }

  @media (max-width: 640px) {
    .karento-enquiry-shell,
    .karento-enquiry-panel {
      padding: 16px;
    }

    .karento-contact-layout {
      --bs-gutter-x: 16px;
      row-gap: 16px;
    }
  }
</style>
