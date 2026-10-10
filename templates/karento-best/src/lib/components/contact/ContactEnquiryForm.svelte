<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { dealer } from "#lib/content.ts";
  import DemoForm from "#lib/components/DemoForm.svelte";
  let { idPrefix = "contact" }: { idPrefix?: string } = $props();
</script>

<DemoForm class="form-contact" data-contact-enquiry>
  {#if dealer.businessPreview}<p
      class="text-sm-medium neutral-500 desktop-type-body-small"
      >{locale.t("dealer.enquiry.draft")}</p
    >{/if}
  <div class="row">
    <div class="col-lg-6">
      <div class="form-group">
        <label
          class="text-sm-medium neutral-1000 desktop-type-label"
          for={idPrefix + "-first-name"}
          >{locale.t("ui.contact-enquiry-form.first-name")}</label
        >
        <input
          class="form-control username"
          type="text"
          placeholder={locale.t("ui.contact-enquiry-form.first-name-96ce6e")}
          id={idPrefix + "-first-name"}
          autocomplete="given-name"
        />
      </div>
    </div>
    <div class="col-lg-6">
      <div class="form-group">
        <label
          class="text-sm-medium neutral-1000 desktop-type-label"
          for={idPrefix + "-last-name"}
          >{locale.t("ui.contact-enquiry-form.last-name")}</label
        >
        <input
          class="form-control username"
          type="text"
          placeholder={locale.t("ui.contact-enquiry-form.last-name-f55563")}
          id={idPrefix + "-last-name"}
          autocomplete="family-name"
        />
      </div>
    </div>
    <div class="col-lg-12">
      <div class="form-group">
        <label
          class="text-sm-medium neutral-1000 desktop-type-label"
          for={idPrefix + "-email"}
          >{locale.t("ui.contact-enquiry-form.email-address")}</label
        >
        <input
          class="form-control email"
          type="email"
          placeholder="email@domain.com"
          id={idPrefix + "-email"}
          autocomplete="email"
        />
      </div>
    </div>
    <div class="col-lg-12">
      <div class="form-group">
        <label
          class="text-sm-medium neutral-1000 desktop-type-label"
          for={idPrefix + "-phone"}
          >{locale.t("ui.contact-enquiry-form.phone-number")}</label
        >
        <input
          class="form-control phone"
          type="tel"
          placeholder={locale.t("ui.contact-enquiry-form.phone-number")}
          id={idPrefix + "-phone"}
          autocomplete="tel"
        />
      </div>
    </div>
    <div class="col-lg-12">
      <div class="form-group">
        <label
          class="text-sm-medium neutral-1000 desktop-type-label"
          for={idPrefix + "-message"}
          >{locale.t("ui.contact-enquiry-form.your-message")}</label
        >
        <textarea
          class="form-control"
          rows="6"
          placeholder={locale.t("ui.contact-enquiry-form.leave-us-a-message")}
          id={idPrefix + "-message"}
        ></textarea>
      </div>
    </div>
    <div class="box-remember-forgot">
      <div class="form-group">
        <div class="remeber-me">
          <label class="text-sm-medium neutral-500 desktop-type-label"
            ><input
              class="cb-remember"
              type="checkbox"
              aria-label={locale.t("ui.contact-enquiry-form.preview-field")}
            />{locale.t("ui.contact-enquiry-form.agree-to-our")}
            <a
              class="text-sm-medium neutral-1000"
              href={locale.href("/terms")}
              aria-label={locale.t("ui.contact-enquiry-form.terms-of-service")}
              >{locale.t("ui.contact-enquiry-form.terms-of-service")}</a
            ></label
          >
        </div>
      </div>
    </div>
    <div class="col-lg-12">
      <button
        class="btn btn-book desktop-type-control"
        aria-label={locale.t(
          dealer.businessPreview
            ? "dealer.enquiry.preview"
            : "ui.contact-enquiry-form.send-message",
        )}
        type="submit"
      >
        {locale.t(
          dealer.businessPreview
            ? "dealer.enquiry.preview"
            : "ui.contact-enquiry-form.send-message",
        )}
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M8.5 15L15.5 8L8.5 1M15.5 8L1.5 8"
            stroke=""
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</DemoForm>
