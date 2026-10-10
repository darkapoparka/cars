<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoForm from "#lib/components/DemoForm.svelte";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");

  let { spacing = "" }: { spacing?: string } = $props();
</script>

<div class={["section-box box-subscriber background-body", spacing]}>
  <div class="container">
    <div class="block-subscriber">
      <div class="subscriber-left">
        <span class="btn btn-primary desktop-display-badge desktop-type-pill"
          >{locale.t(
            desktop.current
              ? "editorial.signup.previewLabel"
              : "ui.subscriber-banner.get-instant-discounts",
          )}</span
        >
        <h4 class="mt-15 mb-30 neutral-1000 desktop-type-banner"
          >{locale.t(
            desktop.current
              ? "editorial.signup.previewTitle"
              : "ui.subscriber-banner.sign-up-to-unlock-secret-deals-instantly",
          )}</h4
        >
        <DemoForm class="form-subscriber desktop-subscribe-controls" action="#">
          <input
            class="form-control desktop-type-body-small"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder={locale.t("ui.subscriber-banner.your-email")}
            aria-label={locale.t("ui.subscriber-banner.your-email")}
          />
          <input
            class="btn btn-submit desktop-type-control"
            type="submit"
            value={locale.t(
              desktop.current
                ? "footer.polish.previewSignup"
                : "ui.subscriber-banner.subscribe",
            )}
            aria-label={locale.t(
              desktop.current
                ? "footer.polish.previewSignup"
                : "ui.subscriber-banner.subscribe",
            )}
          />
        </DemoForm>
        <p class="text-sm-medium neutral-500 mt-15 desktop-type-body-small"
          >{locale.t(
            desktop.current
              ? "editorial.signup.previewHelp"
              : "ui.subscriber-banner.no-ads-no-trails-no-commitments",
          )}</p
        >
      </div>
      <div class="subscriber-right"></div>
    </div>
  </div>
</div>

<style>
  @media (min-width: 992px) {
    .block-subscriber {
      border-radius: var(--karento-desktop-card-radius);
      overflow: hidden;
    }
    .block-subscriber .subscriber-left {
      padding: var(--karento-desktop-heading-gap);
    }
    .subscriber-left h4 {
      margin-top: var(--karento-desktop-space-4) !important;
      margin-bottom: var(--karento-desktop-space-6) !important;
    }
    .subscriber-left :global(.desktop-subscribe-controls > .form-control) {
      flex: 1 1 auto;
      width: 0;
      min-width: 0;
      padding-inline: var(--karento-desktop-space-12)
        var(--karento-desktop-space-3);
    }
    .subscriber-left :global(.desktop-subscribe-controls > .btn-submit) {
      flex: 0 0 auto;
      padding-inline: var(--karento-desktop-space-4);
    }
    .subscriber-left > p {
      margin-top: var(--karento-desktop-space-4) !important;
    }
    .block-subscriber .subscriber-right {
      border-radius: 0;
    }
  }
</style>
