<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { usePreview } from "#lib/preview.svelte.ts";
  const accordionPreview = usePreview();
  const panelOpen0 = $derived(
    accordionPreview.panels["#accordionFAQ"] === undefined
      ? true
      : accordionPreview.panels["#accordionFAQ"] === "#collapseOne",
  );
  const panelOpen1 = $derived(
    accordionPreview.panels["#accordionFAQ"] === undefined
      ? false
      : accordionPreview.panels["#accordionFAQ"] === "#collapseTwo",
  );
  const panelOpen2 = $derived(
    accordionPreview.panels["#accordionFAQ"] === undefined
      ? false
      : accordionPreview.panels["#accordionFAQ"] === "#collapseThree",
  );
  const panelOpen3 = $derived(
    accordionPreview.panels["#accordionFAQ"] === undefined
      ? false
      : accordionPreview.panels["#accordionFAQ"] === "#collapseFour",
  );
  const panelOpen4 = $derived(
    accordionPreview.panels["#accordionFAQ"] === undefined
      ? false
      : accordionPreview.panels["#accordionFAQ"] === "#collapseFive",
  );
</script>

<section class="section-box box-faqs background-body pt-0">
  <div class="box-faqs-inner">
    <div class="container">
      <div class="text-center">
        <span class="text-sm-bold bg-2 p-3 rounded-12">Our Support</span>
        <h3 class="mt-4 neutral-1000">Frequently Asked Questions</h3>
      </div>
      <div class="block-faqs">
        <div class="accordion" id="accordionFAQ">
          <div class="accordion-item border-bottom-0">
            <div class="accordion-header" id="headingOne">
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-controls="collapseOne"
                aria-label="View details"
                class={"accordion-button text-heading-5" +
                  (panelOpen0 ? "" : " collapsed")}
                aria-expanded={panelOpen0}
                onclick={() =>
                  (accordionPreview.panels["#accordionFAQ"] = panelOpen0
                    ? null
                    : "#collapseOne")}
              >
                <h3>01</h3>
                <p>How do I make a reservation on your website</p>
              </button>
            </div>
            <div
              id="collapseOne"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionFAQ"
              class={"accordion-collapse collapse" +
                (panelOpen0 ? " show" : "")}
            >
              <div class="accordion-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</div
              >
            </div>
          </div>
          <div class="accordion-item border-bottom-0">
            <div class="accordion-header" id="headingTwo">
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-controls="collapseTwo"
                aria-label="View details"
                class={"accordion-button text-heading-5" +
                  (panelOpen1 ? "" : " collapsed")}
                aria-expanded={panelOpen1}
                onclick={() =>
                  (accordionPreview.panels["#accordionFAQ"] = panelOpen1
                    ? null
                    : "#collapseTwo")}
              >
                <h3>02</h3>
                <p
                  >What documents do I need for my trip, and how do I obtain
                  them?</p
                >
              </button>
            </div>
            <div
              id="collapseTwo"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionFAQ"
              class={"accordion-collapse collapse" +
                (panelOpen1 ? " show" : "")}
            >
              <div class="accordion-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</div
              >
            </div>
          </div>
          <div class="accordion-item border-bottom-0">
            <div class="accordion-header" id="headingThree">
              <button
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-controls="collapseThree"
                aria-label="View details"
                type="button"
                class={"accordion-button text-heading-5 text-heading-5 type=" +
                  (panelOpen2 ? "" : " collapsed")}
                aria-expanded={panelOpen2}
                onclick={() =>
                  (accordionPreview.panels["#accordionFAQ"] = panelOpen2
                    ? null
                    : "#collapseThree")}
              >
                <h3>03</h3>
                <p
                  >In the event that I need to modify or cancel my reservation,
                  what are the policies in place?</p
                >
              </button>
            </div>
            <div
              id="collapseThree"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionFAQ"
              class={"accordion-collapse collapse" +
                (panelOpen2 ? " show" : "")}
            >
              <div class="accordion-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</div
              >
            </div>
          </div>
          <div class="accordion-item border-bottom-0">
            <div class="accordion-header" id="headingFour">
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-controls="collapseFour"
                aria-label="View details"
                class={"accordion-button text-heading-5" +
                  (panelOpen3 ? "" : " collapsed")}
                aria-expanded={panelOpen3}
                onclick={() =>
                  (accordionPreview.panels["#accordionFAQ"] = panelOpen3
                    ? null
                    : "#collapseFour")}
              >
                <h3>04</h3>
                <p
                  >Can you specify the types of credit/debit cards, digital
                  wallets, or other online payment methods accepted?</p
                >
              </button>
            </div>
            <div
              id="collapseFour"
              aria-labelledby="headingFour"
              data-bs-parent="#accordionFAQ"
              class={"accordion-collapse collapse" +
                (panelOpen3 ? " show" : "")}
            >
              <div class="accordion-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</div
              >
            </div>
          </div>
          <div class="accordion-item border-bottom-0">
            <div class="accordion-header" id="headingFive">
              <button
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-controls="collapseFive"
                aria-label="View details"
                class={"accordion-button text-heading-5" +
                  (panelOpen4 ? "" : " collapsed")}
                aria-expanded={panelOpen4}
                onclick={() =>
                  (accordionPreview.panels["#accordionFAQ"] = panelOpen4
                    ? null
                    : "#collapseFive")}
              >
                <h3>05</h3>
                <p
                  >What are the working hours, and what can I expect in terms of
                  response times?</p
                >
              </button>
            </div>
            <div
              id="collapseFive"
              aria-labelledby="headingFive"
              data-bs-parent="#accordionFAQ"
              class={"accordion-collapse collapse" +
                (panelOpen4 ? " show" : "")}
            >
              <div class="accordion-body"
                >Provide a step-by-step guide on how users can browse and book
                travel services on your platform. Include information on
                searching for destinations, selecting dates, choosing
                accommodation, and completing the booking process. Mention any
                special features or tools that can help users find the best
                deals.</div
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 mt-4">
          <div class="d-flex justify-content-center gap-2">
            <a class="btn btn-primary mt-2" href="#!" aria-label="Contact Us">
              Contact Us
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
            </a>
            <a
              class="btn btn-primary bg-transparent mt-2 invert"
              href="#!"
              aria-label="Help Center"
            >
              Help Center
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
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
