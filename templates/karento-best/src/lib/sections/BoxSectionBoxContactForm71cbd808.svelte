<svelte:options preserveWhitespace={true} />

<script lang="ts">
  import { demoSubmit } from "#lib/interactions.ts";
  const address = "12560 Rental Rd, Memphis, TN 38118, United States";
  const locationQuery = encodeURIComponent(address);
</script>

<section
  class="box-section box-contact-form karento-contact-enquiry"
  aria-labelledby="contact-enquiry"
>
  <div class="container">
    <div class="karento-enquiry-shell">
      <div class="row karento-contact-layout">
        <div class="col-lg-6">
          <div class="karento-enquiry-panel">
            <h2
              id="contact-enquiry"
              tabindex="-1"
              class="neutral-1000 mb-25 karento-hero-target">Get in Touch</h2
            >
            <form
              class="form-contact"
              data-contact-enquiry
              onsubmit={demoSubmit}
            >
              <div class="row">
                <div class="col-lg-6">
                  <div class="form-group">
                    <label
                      class="text-sm-medium neutral-1000"
                      for="contact-first-name">First name</label
                    >
                    <input
                      class="form-control username"
                      type="text"
                      placeholder="First Name"
                      id="contact-first-name"
                      autocomplete="given-name"
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  <div class="form-group">
                    <label
                      class="text-sm-medium neutral-1000"
                      for="contact-last-name">Last name</label
                    >
                    <input
                      class="form-control username"
                      type="text"
                      placeholder="Last Name"
                      id="contact-last-name"
                      autocomplete="family-name"
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <label
                      class="text-sm-medium neutral-1000"
                      for="contact-email">Email address</label
                    >
                    <input
                      class="form-control email"
                      type="email"
                      placeholder="email@domain.com"
                      id="contact-email"
                      autocomplete="email"
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <label
                      class="text-sm-medium neutral-1000"
                      for="contact-phone">Phone number</label
                    >
                    <input
                      class="form-control phone"
                      type="tel"
                      placeholder="Phone number"
                      id="contact-phone"
                      autocomplete="tel"
                    />
                  </div>
                </div>
                <div class="col-lg-12">
                  <div class="form-group">
                    <label
                      class="text-sm-medium neutral-1000"
                      for="contact-message">Your message</label
                    >
                    <textarea
                      class="form-control"
                      rows="6"
                      placeholder="Leave us a message..."
                      id="contact-message"
                    ></textarea>
                  </div>
                </div>
                <div class="box-remember-forgot">
                  <div class="form-group">
                    <div class="remeber-me">
                      <label class="text-sm-medium neutral-500"
                        ><input
                          class="cb-remember"
                          type="checkbox"
                          aria-label="Preview field"
                        />Agree to our
                        <a
                          class="text-sm-medium neutral-1000"
                          href="/terms"
                          aria-label="Terms of service">Terms of service</a
                        ></label
                      >
                    </div>
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
            <div class="karento-contact-location">
              <p class="neutral-500 karento-contact-address">{address}</p>
              <a
                class="karento-contact-directions"
                href={`https://www.google.com/maps/search/?api=1&query=${locationQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                >Get directions <span aria-hidden="true">↗</span></a
              >
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="karento-contact-map">
            <iframe
              src={`https://maps.google.com/maps?q=${locationQuery}&z=13&output=embed`}
              width="100%"
              height="650"
              style="border:0;"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Illustrative dealership location"
            >
            </iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  /* The owner requested one outer panel, with an inner card only for the form. */
  .karento-enquiry-shell {
    padding: 24px;
    border: 1px solid var(--bs-border-color);
    border-radius: 16px;
    background: var(--bs-background-card);
  }

  .karento-enquiry-panel {
    padding: 24px;
    border-radius: 12px;
  }

  .karento-contact-map {
    border-radius: 12px;
  }

  @media (max-width: 640px) {
    .karento-enquiry-shell,
    .karento-enquiry-panel {
      padding: 16px;
    }

    .karento-contact-layout {
      --bs-gutter-x: 16px;
      row-gap: 16px;
    }
  }
</style>
