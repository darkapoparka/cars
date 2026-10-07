<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { usePreview } from "#lib/preview.svelte.ts";
  import { demoSubmit } from "#lib/interactions.ts";
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
              aria-label="View details"
              class={"btn btn-collapse" + (panelOpen0 ? "" : " collapsed")}
              aria-expanded={panelOpen0}
              onclick={() =>
                (accordionPreview.panels["#collapseOverview"] = panelOpen0
                  ? null
                  : "#collapseOverview")}
            >
              <h6>Overview</h6>
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
                    <img
                      src="/assets/imgs/dealer/dealer-listing/icon-9.svg"
                      alt="Carento"
                    />
                  </div>
                </div>
                <div class="card-info">
                  <div class="card-title">
                    <a
                      class="title heading-6"
                      href="#!"
                      aria-label="Peugeot Sheffield">Peugeot Sheffield</a
                    >
                    <p class="text-md-medium neutral-500"
                      >123 Kingsway Strandeif, Manchester, M19 2XS</p
                    >
                  </div>
                  <div class="card-method-contact2">
                    <a
                      class="email text-xs-bold"
                      href="#!"
                      aria-label="180 Vehicles"
                    >
                      180 Vehicles
                    </a>
                  </div>
                </div>
              </div>
              <div class="card card-body">
                <p
                  >This illustrative profile shows how a vehicle source can be
                  presented with its location, brands and available stock.
                  Source details are examples for the website proposal.</p
                >
                <p
                  >Tell us your preferred model, source market and budget.
                  Vehicle availability, condition, transport and import costs
                  are confirmed individually before proceeding.</p
                >
                <div class="row g-3 mt-1">
                  <div class="col-md-6">
                    <img
                      class="rounded-1"
                      src="/assets/imgs/dealer/dealer-details/img-1.png"
                      alt="Carento"
                    />
                  </div>
                  <div
                    class="col-md-6 d-flex align-items-center justify-content-between flex-column gap-3"
                  >
                    <img
                      class="rounded-1"
                      src="/assets/imgs/dealer/dealer-details/img-2.png"
                      alt="Carento"
                    />
                    <img
                      class="rounded-1"
                      src="/assets/imgs/dealer/dealer-details/img-3.png"
                      alt="Carento"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="group-collapse-expand mb-0">
            <button
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseHighlight"
              aria-controls="collapseHighlight"
              aria-label="View details"
              class={"btn btn-collapse" + (panelOpen1 ? "" : " collapsed")}
              aria-expanded={panelOpen1}
              onclick={() =>
                (accordionPreview.panels["#collapseHighlight"] = panelOpen1
                  ? null
                  : "#collapseHighlight")}
            >
              <h6>Services</h6>
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
                      <li
                        >Exclusive new vehicle sales with customization options</li
                      >
                      <li
                        >Certified pre-owned vehicles with comprehensive
                        inspections</li
                      >
                      <li
                        >Flexible financing and leasing solutions tailored to
                        your needs</li
                      >
                      <li>Full-service vehicle maintenance and repair center</li
                      >
                      <li
                        >Authentic parts and accessories for optimal vehicle
                        performance</li
                      >
                    </ul>
                  </div>
                  <div class="col-auto ms-lg-auto">
                    <ul class="list-checked-green-2">
                      <li>Comprehensive Vehicle Maintenance</li>
                      <li>Genuine Parts &amp; Accessories</li>
                      <li>Trade-In Valuation</li>
                      <li>Extended Warranty Plans</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="sidebar-left border-1 background-card">
          <h6 class="text-xl-bold neutral-1000">Get in touch</h6>
          <div class="box-sidebar-content">
            <form class="form-contact" onsubmit={demoSubmit}>
              <div class="row">
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      class="form-control username"
                      type="text"
                      placeholder="Your name"
                      aria-label="Your name"
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <input
                      class="form-control email"
                      type="email"
                      placeholder="Your email"
                      aria-label="Your email"
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <textarea
                      class="form-control message"
                      rows="6"
                      placeholder="Message"
                      aria-label="Message"
                    ></textarea>
                  </div>
                </div>
                <div class="col-lg-12">
                  <button
                    class="btn btn-book"
                    aria-label="Send message"
                    type="submit"
                  >
                    Send message
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
            </form>
            <div class="box-info-contact pt-4">
              <p class="text-md-medium mobile-phone neutral-1000"
                ><span class="text-md-bold">Mobile:</span> 1-222-333-4444</p
              >
              <p class="text-md-medium email neutral-1000"
                ><span class="text-md-bold">Email:</span> emily-rose@gmail.com</p
              >
              <p class="text-md-medium whatsapp neutral-1000"
                ><span class="text-md-bold">WhatsApp:</span> 1-222-333-4444</p
              >
              <p class="text-md-medium fax neutral-1000"
                ><span class="text-md-bold">Fax:</span> 1-222-333-4444</p
              >
            </div>
          </div>
        </div>
        <div class="sidebar-banner">
          <div class="p-4 background-body border rounded-3">
            <p class="text-xl-bold neutral-1000 mb-4">Source Location</p>
            <div class="box-collapse scrollFilter mb-15">
              <div class="pt-0">
                <div class="box-map-small">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5249.611419370571!2d2.3406913487788334!3d48.86191519358772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e18a5f84801%3A0x6eb5daa624bdebd2!2sLes%20Halles%2C%2075001%20Pa%20ri%2C%20Ph%C3%A1p!5e0!3m2!1svi!2s!4v1711728202093!5m2!1svi!2s"
                    width="100%"
                    height="160"
                    style="border:0;"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Location map"
                  ></iframe>
                </div>
              </div>
            </div>
            <p class="text-sm-medium neutral-1000"
              >123 Kingsway Strandeif, Manchester, M19 2XS</p
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
