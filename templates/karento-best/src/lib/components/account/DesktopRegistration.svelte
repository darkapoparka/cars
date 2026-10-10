<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoForm from "#lib/components/DemoForm.svelte";
  let password = "";
  let confirmation = "";
  let confirmationInput: HTMLInputElement | undefined;
  function validatePasswords() {
    confirmationInput?.setCustomValidity(
      confirmation && confirmation !== password
        ? locale.t("account.passwordMatch")
        : "",
    );
  }
</script>

<div class="container karento-account-access">
  <div class="row">
    <div class="col-lg-5 mx-auto">
      <div class="border rounded-3 karento-access-panel">
        <div class="text-center">
          <p class="registration-label desktop-type-eyebrow"
            >{locale.t("ui.desktop-registration.register")}</p
          >
          <h4 class="neutral-1000 desktop-type-panel"
            >{locale.t("ui.desktop-registration.create-an-account")}</h4
          >
        </div>
        <p class="registration-note desktop-type-body-small"
          >{locale.t(
            "ui.desktop-registration.template-preview-registration-details-are-not-sent-or-saved",
          )}</p
        >
        <DemoForm class="desktop-registration" data-desktop-registration>
          <div class="form-group">
            <label class="desktop-type-label" for="registration-name"
              >{locale.t("ui.desktop-registration.name")}</label
            >
            <input
              id="registration-name"
              class="form-control"
              name="name"
              autocomplete="name"
              placeholder={locale.t("ui.desktop-registration.your-name")}
              required
            />
          </div>
          <div class="form-group">
            <label class="desktop-type-label" for="registration-email"
              >{locale.t("ui.desktop-registration.email-address")}</label
            >
            <input
              id="registration-email"
              class="form-control"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="email@domain.com"
              required
            />
          </div>
          <div class="form-group">
            <label class="desktop-type-label" for="registration-password"
              >{locale.t("ui.desktop-registration.password")}</label
            >
            <input
              id="registration-password"
              class="form-control"
              type="password"
              name="password"
              autocomplete="new-password"
              placeholder={locale.t(
                "ui.desktop-registration.at-least-8-characters",
              )}
              minlength="8"
              required
              oninput={(event) => {
                password = event.currentTarget.value;
                validatePasswords();
              }}
            />
          </div>
          <div class="form-group">
            <label class="desktop-type-label" for="registration-confirmation"
              >{locale.t("ui.desktop-registration.confirm-password")}</label
            >
            <input
              bind:this={confirmationInput}
              id="registration-confirmation"
              class="form-control"
              type="password"
              name="confirmation"
              autocomplete="new-password"
              placeholder={locale.t(
                "ui.desktop-registration.repeat-your-password",
              )}
              minlength="8"
              required
              oninput={(event) => {
                confirmation = event.currentTarget.value;
                validatePasswords();
              }}
            />
          </div>
          <p class="registration-terms desktop-type-body-small"
            >{locale.t("ui.desktop-registration.review-the")}
            <a href={locale.href("/terms")}
              >{locale.t("ui.desktop-registration.sample-terms")}</a
            >
            {locale.t("ui.desktop-registration.before-continuing")}</p
          >
          <button
            type="submit"
            class="btn btn-primary w-100 desktop-type-control"
            >{locale.t("ui.desktop-registration.preview-registration")}
            <span aria-hidden="true">→</span></button
          >
        </DemoForm>
        <p class="registration-signin desktop-type-body-small"
          >{locale.t("ui.desktop-registration.already-have-an-account")}
          <a href={locale.href("/login")}
            >{locale.t("ui.desktop-registration.sign-in")}</a
          ></p
        >
      </div>
    </div>
  </div>
</div>

<style>
  .registration-label {
    display: inline-flex;
    padding: 6px 14px;
    border-radius: 999px;
    background: var(--bs-neutral-100);
    color: var(--bs-neutral-1000);
    font-size: 13px;
    font-weight: 600;
  }
  .registration-note {
    margin-block: 20px 24px;
    color: var(--bs-neutral-600);
    font-size: 14px;
    line-height: 1.5;
  }
  label {
    display: block;
    margin-bottom: 8px;
    color: var(--bs-neutral-1000);
    font-size: 14px;
    font-weight: 600;
  }
  .form-group {
    margin-bottom: 16px;
  }
  .form-control {
    padding-inline: 14px;
    background: var(--bs-background-body);
  }
  .registration-terms,
  .registration-signin {
    color: var(--bs-neutral-600);
    font-size: 14px;
    line-height: 1.5;
  }
  .registration-terms {
    margin-bottom: 20px;
  }
  .registration-signin {
    margin-top: 20px;
    text-align: center;
  }
  a {
    color: var(--bs-neutral-1000);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
</style>
