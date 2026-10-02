<script lang="ts">
  import { brand } from "../data/brand";
  import EnquiryForm from "../components/EnquiryForm.svelte";
  import Icon from "../components/Icon.svelte";
  import { route } from "../lib/router.svelte";
  let { selling = false }: { selling?: boolean } = $props();
  let subject = $derived(
    new URLSearchParams(route.search).get("intent") === "viewing"
      ? "Arranging a viewing"
      : "Buying a car",
  );
</script>

<!-- Adapted from contact.html: title, wide visual, form and bordered contact column. -->
<section class="bc-inner contact-us-section">
  <div class="bc-container">
    <nav class="bc-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span>/</span>
      <span aria-current="page">Contact</span>
    </nav>
    <h1 class="bc-page-title">{selling ? "Sell Your Car" : "Contact us"}</h1>
    <div class="bc-contact-visual">
      <img
        src="/media/resource/about-inner1-3.jpg"
        alt="Vehicles on display in the Boxcar reference showroom"
        width="567"
        height="300"
      />
      <div>
        <span>{brand.name}</span>
        <h2>
          Good cars.
          <br />
          Great conversations.
        </h2>
      </div>
      <small>Sample showroom photograph</small>
    </div>
    <div class="calculater-sec">
      <section class="content-column" aria-labelledby="contact-form-title">
        <div class="inner-column">
          <div class="boxcar-title">
            <h2 id="contact-form-title">
              {selling ? "Tell us about your car" : "Get in touch"}
            </h2>
            <p>
              {selling
                ? "Share a few details about your vehicle and the next step you have in mind."
                : "A question about a car, a viewing or your next step? Start the conversation here."}
            </p>
          </div>
          <EnquiryForm {selling} {subject} variant="boxcar" />
        </div>
      </section>
      <aside class="contact-column" aria-labelledby="contact-details-title">
        <div class="inner-column">
          <div class="boxcar-title">
            <h2 id="contact-details-title">Contact details</h2>
            <p>
              Find your favourite car online, then take a closer look in person.
            </p>
          </div>
          <div class="content-box">
            <span class="icon"><Icon name="location" size={26} /></span>
            <h3>Showroom</h3>
            <p>{brand.location}</p>
            <small>Example location for this template.</small>
          </div>
          <div class="content-box">
            <span class="icon"><Icon name="clock" size={26} /></span>
            <h3>Opening hours</h3>
            <p>{brand.hours}</p>
          </div>
          <div class="content-box">
            <span class="icon"><Icon name="mail" size={26} /></span>
            <h3>Email</h3>
            <p>{brand.contactEmail}</p>
            <small>Example email address.</small>
          </div>
          <div class="bc-visit">
            <h3>Planning a viewing?</h3>
            <p>
              Include the car’s make and model in your message so the dealership
              can help with your enquiry.
            </p>
          </div>
          <p class="bc-contact-note">
            Demo business details · enquiries are previews.
          </p>
        </div>
      </aside>
    </div>
  </div>
</section>
