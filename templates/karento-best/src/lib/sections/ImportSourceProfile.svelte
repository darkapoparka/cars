<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoForm from "#lib/components/DemoForm.svelte";
  import type { ImportSourceItem } from "#lib/data/editorial.ts";
  let { source }: { source: ImportSourceItem } = $props();

  import { usePreview } from "#lib/preview.svelte.ts";

  const accordionPreview = usePreview();
  const panelOpen0 = $derived(
    accordionPreview.panels["#collapseOverview"] === undefined
      ? true
      : accordionPreview.panels["#collapseOverview"] === "#collapseOverview",
  );
  const panelOpen1 = $derived(
    accordionPreview.panels["#collapseHighlight"] === undefined
      ? true
      : accordionPreview.panels["#collapseHighlight"] === "#collapseHighlight",
  );
</script>

<section
  class="box-section box-content-tour-detail box-content-room-detail background-body border-bottom"
>
  <div class="container">
    <div class="row">
      <div class="col-lg-8">
        <div class="box-collapse-expand">
          <div class="group-collapse-expand">
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOverview"
              aria-controls="collapseOverview"
              aria-label={locale.t("ui.import-source-profile.view-details")}
              class={"btn btn-collapse" + (panelOpen0 ? "" : " collapsed")}
              aria-expanded={panelOpen0}
              onclick={() =>
                (accordionPreview.panels["#collapseOverview"] = panelOpen0
                  ? null
                  : "#collapseOverview")}
            >
              <h6 class="desktop-type-panel"
                >{locale.t("ui.import-source-profile.overview")}</h6
              >
              <svg
                width="12"
                height="7"
                viewBox="0 0 12 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke=""
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>
            <div
              id="collapseOverview"
              class={"collapse" + (panelOpen0 ? " show" : "")}
            >
              <div class="card-contact border-0 border-bottom rounded-0 d-flex">
                <div class="card-image me-3">
                  <div class="position-relative">
                    <img src={source.image} alt={source.name} />
                  </div>
                </div>
                <div class="card-info">
                  <div class="card-title">
                    <p class="title heading-6 desktop-type-card"
                      >{source.name}</p
                    >
                    <p class="text-md-medium neutral-500 desktop-type-body"
                      >{source.address}</p
                    >
                  </div>
                </div>
              </div>
              <div class="card card-body">
                {#if source.sample}<p
                    >{locale.t(
                      "ui.import-source-profile.this-illustrative-profile-shows-how-a-vehicle-source-can",
                    )}</p
                  >{/if}
                <p
                  >{locale.t(
                    "ui.import-source-profile.tell-us-your-preferred-model-source-market-and-budget",
                  )}</p
                >
                {#if source.sample}<div class="row g-3 mt-1">
                    <div class="col-md-6">
                      <img
                        class="rounded-1"
                        src="/assets/imgs/dealer/dealer-details/img-1.png"
                        alt={locale.t("image.illustrative")}
                      />
                    </div>
                    <div
                      class="col-md-6 d-flex align-items-center justify-content-between flex-column gap-3"
                    >
                      <img
                        class="rounded-1"
                        src="/assets/imgs/dealer/dealer-details/img-2.png"
                        alt={locale.t("image.illustrative")}
                      />
                      <img
                        class="rounded-1"
                        src="/assets/imgs/dealer/dealer-details/img-3.png"
                        alt={locale.t("image.illustrative")}
                      />
                    </div>
                  </div>{/if}
              </div>
            </div>
          </div>
          {#if source.sample}<div class="group-collapse-expand mb-0">
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseHighlight"
                aria-controls="collapseHighlight"
                aria-label={locale.t("ui.import-source-profile.view-details")}
                class={"btn btn-collapse" + (panelOpen1 ? "" : " collapsed")}
                aria-expanded={panelOpen1}
                onclick={() =>
                  (accordionPreview.panels["#collapseHighlight"] = panelOpen1
                    ? null
                    : "#collapseHighlight")}
              >
                <h6 class="desktop-type-panel"
                  >{locale.t("ui.import-source-profile.services")}</h6
                >
                <svg
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke=""
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <div
                id="collapseHighlight"
                class={"collapse" + (panelOpen1 ? " show" : "")}
              >
                <div class="card card-body">
                  <div class="row flex-lg-nowrap">
                    <div class="col-auto">
                      <ul class="list-checked-green-2">
                        <li>{locale.t("reference.import.sales")}</li>
                        <li>{locale.t("reference.import.preowned")}</li>
                        <li>{locale.t("reference.import.finance")}</li>
                        <li>{locale.t("reference.import.repair")}</li>
                        <li>{locale.t("reference.import.parts")}</li>
                      </ul>
                    </div>
                    <div class="col-auto ms-lg-auto">
                      <ul class="list-checked-green-2">
                        <li>{locale.t("reference.import.maintenance")}</li>
                        <li>{locale.t("reference.import.accessories")}</li>
                        <li>{locale.t("reference.import.tradeIn")}</li>
                        <li>{locale.t("reference.import.warranty")}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>{/if}
        </div>
      </div>
      <div class="col-lg-4">
        <div class="sidebar-left border-1 background-card">
          <h6 class="text-xl-bold neutral-1000 desktop-type-panel"
            >{locale.t("ui.import-source-profile.get-in-touch")}</h6
          >
          <div class="box-sidebar-content">
            <DemoForm class="form-contact">
              <input type="hidden" name="source" value={source.id} />
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      class="form-control username"
                      type="text"
                      placeholder={locale.t(
                        "ui.import-source-profile.your-name",
                      )}
                      aria-label={locale.t(
                        "ui.import-source-profile.your-name",
                      )}
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      class="form-control email"
                      type="email"
                      placeholder={locale.t(
                        "ui.import-source-profile.your-email",
                      )}
                      aria-label={locale.t(
                        "ui.import-source-profile.your-email",
                      )}
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <textarea
                      class="form-control message"
                      rows="6"
                      placeholder={locale.t("ui.import-source-profile.message")}
                      aria-label={locale.t("ui.import-source-profile.message")}
                    ></textarea>
                  </div>
                </div>
                <div class="col-lg-12">
                  <button
                    class="btn btn-book desktop-type-control"
                    aria-label={locale.t(
                      "ui.import-source-profile.send-message",
                    )}
                    type="submit"
                  >
                    {locale.t("ui.import-source-profile.send-message")}
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
          </div>
        </div>
        <div class="sidebar-banner">
          <div class="p-4 background-body border rounded-3">
            <p class="text-xl-bold neutral-1000 mb-4"
              >{locale.t("ui.import-source-profile.source-location")}</p
            >
            {#if source.mapUrl}
              <a
                class="text-sm-medium neutral-1000 desktop-type-body-small"
                href={source.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                >{locale.t("ui.import-source-profile.location-map")}</a
              >
            {/if}
            <p class="text-sm-medium neutral-1000 desktop-type-body-small"
              >{source.address}</p
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
