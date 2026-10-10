<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import { afterNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import { onDestroy, tick } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import PageMetadata from "#lib/components/PageMetadata.svelte";
  import ContactHeading from "#lib/sections/ContactHeading.svelte";
  import ContactLocations from "#lib/sections/ContactLocations.svelte";
  import ContactEnquiry from "#lib/sections/ContactEnquiry.svelte";
  import Footer from "#lib/components/Footer.svelte";
  let enquiryOpen = $state(false);
  const phone = new MediaQuery("(max-width: 767.98px)");
  let active = true;
  afterNavigate(async () => {
    if (page.url.hash !== "#contact-enquiry") return;
    await tick();
    if (active && phone.current && page.url.hash === "#contact-enquiry")
      enquiryOpen = true;
  });
  onDestroy(() => {
    active = false;
  });
</script>

<PageMetadata title={locale.t("ui.contact.contact")} />
<main class="main"
  ><ContactHeading bind:open={enquiryOpen} />
  <ContactLocations />
  <ContactEnquiry bind:open={enquiryOpen} />
  <Footer /></main
>
