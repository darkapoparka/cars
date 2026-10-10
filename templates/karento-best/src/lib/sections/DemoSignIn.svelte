<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { demoSignIn } from "#lib/demo-sign-in.ts";
  import { usePreview } from "#lib/preview.svelte.ts";
  const preview = usePreview();
</script>

<div class="container pt-140 pb-170 karento-account-access">
  <div class="row">
    <div class="col-lg-5 mx-auto">
      <div class="border rounded-3 px-md-5 px-3 ptb-50 karento-access-panel">
        <div class="login-content">
          <div class="text-center">
            <p
              class="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center"
              >{locale.t("ui.demo-sign-in.sign-in")}</p
            >
            <h4 class="neutral-1000 desktop-type-panel"
              >{locale.t("ui.demo-sign-in.welcome-back")}</h4
            >
          </div>
          <div class="form-login mt-30">
            <form
              action={locale.href("/dashboard")}
              data-demo-signin="true"
              method="get"
              onsubmit={(event) => demoSignIn(event, preview, locale.href)}
            >
              <input type="hidden" name="lang" value={locale.locale} /><p
                class="text-sm-medium neutral-500 mb-20 desktop-type-body-small"
                >{locale.t(
                  "ui.demo-sign-in.template-preview-choose-your-dashboard-no-credentials-are-required",
                )}</p
              >
              <div class="form-group"
                ><label
                  class="text-sm-bold neutral-1000 mb-10"
                  for="demo-account-type"
                  >{locale.t("ui.demo-sign-in.account-type")}</label
                >
                <select
                  class="form-control"
                  id="demo-account-type"
                  name="area"
                  aria-label={locale.t("reference.controls.accountArea")}
                >
                  <option value="owner"
                    >{locale.t("ui.demo-sign-in.dealership-owner")}</option
                  ><option value="member"
                    >{locale.t("ui.demo-sign-in.member")}</option
                  >
                </select>
              </div>
              <div class="form-group mb-0"
                ><button
                  class="btn btn-primary w-100 desktop-type-control"
                  type="submit"
                  aria-label={locale.t("ui.demo-sign-in.sign-in-to-demo")}
                  >{locale.t("ui.demo-sign-in.sign-in-to-demo")}
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
                  </svg></button
                ></div
              >
              <p
                class="text-sm-medium neutral-500 text-center mt-20 desktop-type-body-small"
                >{locale.t("ui.demo-sign-in.new-here")}
                <a
                  class="neutral-1000"
                  href={locale.href("/register")}
                  aria-label={locale.t("ui.demo-sign-in.create-an-account")}
                  >{locale.t("ui.demo-sign-in.create-an-account")}</a
                ></p
              ></form
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
