<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { usePreview } from "#lib/preview.svelte.ts";
  const accordionPreview = usePreview();
  const panelOpen0 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? true
      : accordionPreview.panels[".accordion"] === "#collapse01",
  );
  const panelOpen1 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapse02",
  );
  const panelOpen2 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapse03",
  );
  const panelOpen3 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapse04",
  );
  const panelOpen4 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapse05",
  );
  const panelOpen5 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapse6",
  );
  const panelOpen6 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapse7",
  );
  const panelOpen7 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapseSevent",
  );
  const panelOpen8 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapseEight",
  );
  const panelOpen9 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapseNine",
  );
  const panelOpen10 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapseTen",
  );
  const panelOpen11 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapseEleven",
  );
  const panelOpen12 = $derived(
    accordionPreview.panels[".accordion"] === undefined
      ? false
      : accordionPreview.panels[".accordion"] === "#collapseTwelve",
  );
</script>

<section class="section-faqs-2 pt-80 pb-80 border-bottom background-body">
  <div class="container">
    <div class="text-start mb-40">
      <h2 class="my-3 neutral-1000">General</h2>
    </div>
    <div class="row">
      <div class="col-lg-6">
        <div class="accordion">
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapse01"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen0
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen0}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen0
                    ? null
                    : "#collapse01")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >How do I make a reservation on your website?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapse01"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen0 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapse02"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen1
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen1}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen1
                    ? null
                    : "#collapse02")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >What documents do I need for my trip, and how do I obtain
                  them?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapse02"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen1 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapse03"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen2
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen2}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen2
                    ? null
                    : "#collapse03")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >In the event that I need to modify or cancel my reservation,
                  what are the policies in place?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapse03"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen2 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapse04"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen3
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen3}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen3
                    ? null
                    : "#collapse04")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >Can you specify the types of credit/debit cards, digital
                  wallets, or other online payment methods accepted?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapse04"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen3 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapse05"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen4
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen4}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen4
                    ? null
                    : "#collapse05")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >What payment methods do you accept?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapse05"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen4 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapse6"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen5
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen5}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen5
                    ? null
                    : "#collapse6")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >Can I modify or cancel my reservation?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapse6"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen5 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapse7"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen6
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen6}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen6
                    ? null
                    : "#collapse7")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >Do you offer discounts for group bookings?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapse7"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen6 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 mt-lg-0 mt-2">
        <div class="accordion">
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapseSevent"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen7
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen7}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen7
                    ? null
                    : "#collapseSevent")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >How do I search for hotels on your website?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapseSevent"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen7 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapseEight"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen8
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen8}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen8
                    ? null
                    : "#collapseEight")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >In the event that I need to modify or cancel my reservation,
                  what are the policies in place?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapseEight"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen8 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapseNine"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen9
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen9}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen9
                    ? null
                    : "#collapseNine")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >Is breakfast included in the room rate?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapseNine"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen9 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapseTen"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen10
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen10}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen10
                    ? null
                    : "#collapseTen")}
              >
                <p class="text-lg-bold neutral-1000 pe-4"
                  >Are pets allowed in the hotels?</p
                >
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapseTen"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen10 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapseEleven"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen11
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen11}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen11
                    ? null
                    : "#collapseEleven")}
              >
                <p class="text-lg-bold neutral-1000 pe-4">
                  How do I contact customer support if I have a question or <br
                  />
                  issue?
                </p>
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapseEleven"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen11 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
          <div class="mb-2 card border rounded-3">
            <div class="px-0 card-header border-0 bacground-body">
              <a
                data-bs-toggle="collapse"
                href="#collapseTwelve"
                class={" px-3 py-2 text-900 fw-bold d-flex align-items-center" +
                  (accordionPreview.panels[".accordion"] === undefined
                    ? " collapsed"
                    : panelOpen12
                      ? ""
                      : " collapsed")}
                aria-expanded={panelOpen12}
                onclick={() =>
                  (accordionPreview.panels[".accordion"] = panelOpen12
                    ? null
                    : "#collapseTwelve")}
              >
                <p class="text-lg-bold neutral-1000 pe-4">
                  Are there any loyalty programs or rewards for frequent <br />
                  guests?
                </p>
                <span class="ms-auto arrow me-2">
                  <svg
                    class="invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="8"
                    viewBox="0 0 13 8"
                    fill="none"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      class="stroke-dark"
                      d="M11.5 1L6.25 6.5L1 1"
                      stroke="#111827"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </span>
              </a>
            </div>
            <div
              id="collapseTwelve"
              data-bs-parent=".accordion"
              class={"collapse" + (panelOpen12 ? " show" : "")}
            >
              <p class="pt-0 pb-4 card-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</p
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
