<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import DemoForm from "#lib/components/DemoForm.svelte";
  import { MediaQuery } from "svelte/reactivity";
  import DesktopRegistration from "#lib/components/account/DesktopRegistration.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
  const phone = new MediaQuery("(max-width: 767.98px)");
</script>

{#if desktop.current}
  <DesktopRegistration />
{:else}
  <div class="container pt-140 pb-170 karento-account-access">
    <div class="row">
      <div class="col-lg-5 mx-auto">
        <div
          class="register-content border rounded-3 px-md-5 px-3 ptb-50 karento-access-panel"
        >
          <div class="text-center">
            <p
              class="neutral-1000 px-4 py-2 bg-2 text-sm-bold rounded-12 d-inline-flex align-items-center"
              >{locale.t("ui.demo-registration.register")}</p
            >
            <h4 class="neutral-1000 desktop-type-panel"
              >{locale.t("ui.demo-registration.create-an-account")}</h4
            >
          </div>
          <div class="form-login mt-30">
            <DemoForm action="#">
              <div class="form-group">
                <input
                  class="form-control username"
                  type="text"
                  name="name"
                  autocomplete="name"
                  placeholder={locale.t("ui.desktop-registration.your-name")}
                  aria-label={locale.t("ui.desktop-registration.name")}
                />
              </div>
              <div class="form-group">
                <input
                  class="form-control email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  placeholder={locale.t(
                    "ui.desktop-registration.email-address",
                  )}
                  aria-label={locale.t("ui.desktop-registration.email-address")}
                />
              </div>
              <div class="form-group">
                <input
                  class="form-control password"
                  type="password"
                  name="password"
                  autocomplete="new-password"
                  placeholder={locale.t("ui.desktop-registration.password")}
                  aria-label={locale.t("ui.desktop-registration.password")}
                />
              </div>
              <div class="form-group">
                <input
                  class="form-control password"
                  type="password"
                  name="confirmation"
                  autocomplete="new-password"
                  placeholder={locale.t(
                    "ui.desktop-registration.confirm-password",
                  )}
                  aria-label={locale.t(
                    "ui.desktop-registration.confirm-password",
                  )}
                />
              </div>
              <div class="form-group my-3">
                <div class="box-remember-forgot">
                  <label
                    class="remeber-me d-flex align-items-center neutral-500"
                  >
                    <input class="cb-remember" type="checkbox" />
                    {locale.t("account.agreeTerms")}
                  </label>
                </div>
              </div>
              <div class="form-group mb-30">
                <DemoActionLink
                  class="btn btn-primary w-100 desktop-type-control"
                  href="#!"
                  aria-label={locale.t("ui.demo-registration.sign-up")}
                  >{locale.t("ui.demo-registration.sign-up")}
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
                </DemoActionLink>
              </div>
              <p
                class="text-md-medium neutral-500 text-center desktop-type-body"
                >{locale.t(
                  "ui.demo-registration.or-connect-with-your-social-account",
                )}</p
              >
              <div class="box-button-logins">
                <DemoActionLink
                  class="btn btn-login btn-google mr-10 desktop-type-control"
                  href="#!"
                  aria-label={locale.t(
                    "ui.demo-registration.sign-up-with-google",
                  )}
                >
                  <img
                    src="/assets/imgs/template/popup/google.svg"
                    alt={locale.t("image.illustrative")}
                  />
                  <span class="text-sm-bold desktop-type-eyebrow"
                    >{phone.current
                      ? "Google"
                      : locale.t(
                          "ui.demo-registration.sign-up-with-google",
                        )}</span
                  >
                </DemoActionLink>
                <DemoActionLink
                  class="btn btn-login mr-10 desktop-type-control"
                  href="#!"
                  aria-label={locale.t("reference.controls.facebook")}
                >
                  <img
                    src="/assets/imgs/template/popup/facebook.svg"
                    alt={locale.t("image.illustrative")}
                  />
                </DemoActionLink>
                <DemoActionLink
                  class="btn btn-login desktop-type-control"
                  href="#!"
                  aria-label={locale.t("reference.controls.apple")}
                >
                  <img
                    src="/assets/imgs/template/popup/apple.svg"
                    alt={locale.t("image.illustrative")}
                  />
                </DemoActionLink>
              </div>
              <p
                class="text-sm-medium neutral-500 text-center mt-70 desktop-type-body-small"
                >{locale.t("ui.demo-registration.already-have-an-account")}
                <a
                  class="neutral-1000"
                  href={locale.href("/login")}
                  aria-label={locale.t("ui.demo-registration.login-here")}
                  >{locale.t("ui.demo-registration.login-here")}</a
                ></p
              >
            </DemoForm>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
