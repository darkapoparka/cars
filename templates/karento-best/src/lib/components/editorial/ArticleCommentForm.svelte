<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoForm from "#lib/components/DemoForm.svelte";
</script>

<div class="box-leave-comment background-100 desktop-panel">
  <DemoForm class="box-form-reviews">
    <h5 class="neutral-1000 mb-25 desktop-type-panel"
      >{locale.t("ui.article-comment-form.leave-a-comment")}</h5
    >
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <input
            class="form-control desktop-type-body-small"
            type="text"
            placeholder={locale.t("ui.article-comment-form.your-name")}
            aria-label={locale.t("ui.article-comment-form.your-name")}
          />
        </div>
      </div>
      <div class="col-md-6">
        <div class="form-group">
          <input
            class="form-control desktop-type-body-small"
            type="text"
            placeholder={locale.t("ui.article-comment-form.email-address")}
            aria-label={locale.t("ui.article-comment-form.email-address")}
          />
        </div>
      </div>
      <div class="col-md-12">
        <div class="form-group">
          <textarea
            class="form-control desktop-type-body-small"
            placeholder={locale.t("ui.article-comment-form.your-comment")}
            aria-label={locale.t("ui.article-comment-form.your-comment")}
          ></textarea>
        </div>
      </div>
      <div class="col-md-12">
        <button
          class="btn btn-primary desktop-type-control desktop-panel-action"
          type="submit"
        >
          {locale.t("ui.article-comment-form.submit-comment")}
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
        </button>
      </div>
    </div>
  </DemoForm>
</div>

<style>
  @media (min-width: 992px) {
    .box-leave-comment {
      margin-bottom: var(--karento-desktop-heading-gap);
    }
    .box-leave-comment :global(h5) {
      margin-bottom: var(--karento-desktop-space-4) !important;
    }
    .box-leave-comment :global(.row) {
      --bs-gutter-x: var(--karento-desktop-grid-gap);
    }
    .box-leave-comment :global(.form-group) {
      margin-bottom: var(--karento-desktop-space-4);
    }
    .box-leave-comment :global(input.form-control) {
      height: var(--karento-desktop-control-height);
    }
    .box-leave-comment :global(.form-control) {
      border-radius: var(--karento-desktop-control-radius);
    }
  }
</style>
