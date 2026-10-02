<script lang="ts">
  import { brand } from "../data/brand";
  import EnquiryForm from "../components/EnquiryForm.svelte";
  import Icon from "../components/Icon.svelte";
  import SocialLinks from "../components/SocialLinks.svelte";
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
    {#if brand.showroomMap}
      <section class="bc-showroom-map" aria-label="Showroom map">
        <iframe
          src={brand.showroomMap.embedUrl}
          title={`${brand.name} showroom location`}
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
        <a
          class="bc-map-directions"
          href={brand.showroomMap.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get directions <Icon name="arrow" size={20} />
        </a>
      </section>
    {:else}<div class="bc-contact-visual">
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
      </div>{/if}
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
            <p>
              {brand.showroomMap?.address ||
                brand.location ||
                "Contact us for visiting information."}
            </p>
          </div>
          <div class="content-box">
            <span class="icon"><Icon name="clock" size={26} /></span>
            <h3>Opening hours</h3>
            <p>{brand.hours}</p>
          </div>
          <div class="content-box">
            <span class="icon"><Icon name="mail" size={26} /></span>
            <h3>Email</h3>
            <p>
              {#if brand.contactEmail === "hello@example.com"}{brand.contactEmail}{:else}<a
                  href={`mailto:${brand.contactEmail}`}
                >
                  {brand.contactEmail}
                </a>{/if}
            </p>
          </div>
          {#if brand.phone}
            <div class="content-box">
              <span class="icon"><Icon name="phone" size={26} /></span>
              <h3>Phone</h3>
              <p>
                <a href={`tel:${brand.phone.replace(/[^\d+]/g, "")}`}>
                  {brand.phone}
                </a>
              </p>
            </div>
          {/if}
          {#if brand.socialLinks.length}
            <div class="bc-contact-social">
              <h3>Follow us</h3>
              <SocialLinks links={brand.socialLinks} />
            </div>
          {/if}
          <div class="bc-visit">
            <h3>Planning a viewing?</h3>
            <p>
              Include the car’s make and model in your message so the dealership
              can help with your enquiry.
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>
