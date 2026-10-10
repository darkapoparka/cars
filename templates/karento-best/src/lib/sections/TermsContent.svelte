<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { dealer } from "#lib/content.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { MediaQuery } from "svelte/reactivity";
  import DesktopTermsContents from "#lib/components/editorial/DesktopTermsContents.svelte";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<section
  class="box-section-term background-body pt-85 pb-85 desktop-hero-content"
>
  <div class="container">
    <div class="row">
      <div class="col-lg-3 col-md-6 mb-lg-0 mb-4">
        <div class="sidebar rounded-3 border py-5 px-4">
          <div class="sidebar-menu">
            {#if desktop.current}
              <DesktopTermsContents />
            {:else}
              <h6 class="neutral-1000 mb-3">{locale.t("terms.contents")}</h6>
              <ul class="">
                <li class="mb-2"
                  ><a
                    href="#Acceptance"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.acceptance.title")}
                    >{locale.t("terms.acceptance.title")}</a
                  ></li
                >
                <li class="mb-2"
                  ><a
                    href="#Services"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.services.title")}
                    >{locale.t("terms.services.title")}</a
                  ></li
                >
                <li class="mb-2"
                  ><a
                    href="#Responsibility"
                    class="text-md-medium neutral-500 active"
                    aria-label={locale.t("terms.responsibilities.title")}
                    >{locale.t("terms.responsibilities.title")}</a
                  ></li
                >
                <li class="mb-2"
                  ><a
                    href="#Account"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.account.title")}
                    >{locale.t("terms.account.title")}</a
                  ></li
                >
                <li class="mb-2"
                  ><a
                    href="#Payment"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.payment.title")}
                    >{locale.t("terms.payment.title")}</a
                  ></li
                >
                <li class="mb-2"
                  ><a
                    href="#Cancellations"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.cancellation.title")}
                    >{locale.t("terms.cancellation.title")}</a
                  ></li
                >

                <li class="mb-2"
                  ><a
                    href="#Limitation"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.liability.title")}
                    >{locale.t("terms.liability.title")}</a
                  ></li
                >
                <li class="mb-2"
                  ><a
                    href="#Privacy"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.privacy.title")}
                    >{locale.t("terms.privacy.title")}</a
                  ></li
                >
                <li class="mb-2"
                  ><a
                    href="#changetem"
                    class="text-md-medium neutral-500"
                    aria-label={locale.t("terms.changes.title")}
                    >{locale.t("terms.changes.title")}</a
                  ></li
                >
              </ul>
            {/if}
          </div>
        </div>
      </div>
      <div class="col-lg-9 px-lg-5">
        <div class="d-flex flex-column gap-4">
          {#if dealer.businessPreview}
            <p class="text-md-medium neutral-500 desktop-type-body"
              >{locale.t("terms.previewNotice")}</p
            >
          {/if}
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Acceptance">{locale.t("terms.acceptance.title")}</h3
            >
            <p class="text-md-medium neutral-500 desktop-type-body"
              >{locale.t("terms.acceptance.body")}</p
            >
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Services">{locale.t("terms.services.title")}</h3
            >
            <p class="text-md-medium neutral-500 desktop-type-body"
              >{locale.t("terms.services.body")}</p
            >
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Responsibility">{locale.t("terms.responsibilities.title")}</h3
            >
            <ul>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.accuracy.title")}&#32;<span
                    class="neutral-500">{locale.t("terms.accuracy.body")}</span
                  ></p
                >
              </li>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.lawfulUse.title")}&#32;<span
                    class="neutral-500">{locale.t("terms.lawfulUse.body")}</span
                  ></p
                >
              </li>
            </ul>
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Account">{locale.t("terms.account.title")}</h3
            >
            <ul>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.confidentiality.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.confidentiality.body")}</span
                  ></p
                >
              </li>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.unauthorizedUse.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.unauthorizedUse.body")}</span
                  ></p
                >
              </li>
            </ul>
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Payment">{locale.t("terms.payment.title")}</h3
            >
            <ul>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.paymentTerms.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.paymentTerms.body")}</span
                  ></p
                >
              </li>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.feeChanges.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.feeChanges.body")}</span
                  ></p
                >
              </li>
            </ul>
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Cancellations">{locale.t("terms.cancellation.title")}</h3
            >
            <ul>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.cancellationPolicy.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.cancellationPolicy.body")}</span
                  ></p
                >
              </li>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.refunds.title")}&#32;<span
                    class="neutral-500">{locale.t("terms.refunds.body")}</span
                  ></p
                >
              </li>
            </ul>
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Limitation">{locale.t("terms.liability.title")}</h3
            >
            <ul>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.generalLimitation.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.generalLimitation.body")}</span
                  ></p
                >
              </li>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.directDamages.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.directDamages.body")}</span
                  ></p
                >
              </li>
            </ul>
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="Privacy">{locale.t("terms.privacy.title")}</h3
            >
            <ul>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.commitment.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.commitment.body")}</span
                  ></p
                >
              </li>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.consent.title")}&#32;<span
                    class="neutral-500">{locale.t("terms.consent.body")}</span
                  ></p
                >
              </li>
            </ul>
          </div>
          <div class="content">
            <h3
              class="text-xl-bold mb-2 neutral-1000 desktop-type-article-subhead"
              id="changetem">{locale.t("terms.changes.title")}</h3
            >
            <ul>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.updates.title")}&#32;<span
                    class="neutral-500">{locale.t("terms.updates.body")}</span
                  ></p
                >
              </li>
              <li class="mb-2">
                <p class="text-md-medium neutral-1000 desktop-type-body"
                  >{locale.t("terms.notification.title")}&#32;<span
                    class="neutral-500"
                    >{locale.t("terms.notification.body")}</span
                  ></p
                >
              </li>
            </ul>
          </div>
          <span class="text-xl-medium border-top pt-4 neutral-1000"
            >{locale.t("terms.updated", {
              date: locale.date("2024-08-25"),
            })}</span
          >
        </div>
      </div>
    </div>
  </div>
</section>
