<script lang="ts">
  import { brand } from "../data/brand";
  import EnquiryForm from "../components/EnquiryForm.svelte";
  import Icon from "../components/Icon.svelte";
  import SocialLinks from "../components/SocialLinks.svelte";
  import PageBanner from "../components/PageBanner.svelte";
  import { route } from "../lib/router.svelte";
  let { selling = false }: { selling?: boolean } = $props();
  let subject = $derived(
    new URLSearchParams(route.search).get("intent") === "viewing"
      ? "Arranging a viewing"
      : "Buying a car",
  );
  let map = $derived(
    brand.showroomMap
      ? {
          embedUrl: brand.showroomMap.embedUrl,
          url: brand.showroomMap.directionsUrl,
          title: `${brand.name} showroom location`,
          label: "Showroom map",
          linkText: "Get directions",
        }
      : brand.previewCityMap
        ? {
            embedUrl: brand.previewCityMap.embedUrl,
            url: brand.previewCityMap.mapUrl,
            title: `${brand.previewCityMap.name} city map`,
            label: `${brand.previewCityMap.name} city map`,
            linkText: `${brand.previewCityMap.name} · View map`,
          }
        : null,
  );
</script>

<!-- Shared banner, location map and joined contact panel. -->
<section class="bc-inner contact-us-section has-page-banner">
  <PageBanner
    title={selling ? "Sell Your Car" : "Contact us"}
    breadcrumb={selling ? "Sell your car" : "Contact"}
    description={selling
      ? "Tell us about your car and your next step."
      : "Questions about a car or a viewing? Let’s talk."}
  />
  <div class="bc-container">
    {#if map}
      <section class="bc-showroom-map" aria-label={map.label}>
        <iframe
          src={map.embedUrl}
          title={map.title}
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        ></iframe>
        <a
          class="bc-map-directions"
          href={map.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {map.linkText} <Icon name="arrow" size={20} />
        </a>
      </section>
    {/if}
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
