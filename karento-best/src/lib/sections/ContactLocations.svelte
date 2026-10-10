<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import ContactLocationCard from "#lib/components/contact/ContactLocationCard.svelte";
  import { dealer } from "#lib/content.ts";
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { MediaQuery } from "svelte/reactivity";
  const locale = useLocale();
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<section
  class="box-section background-body pt-110 karento-contact-team"
  aria-labelledby="contact-team-title"
>
  <div class="container">
    <div class="text-center karento-contact-heading">
      {#if desktop.current}
        <h2 id="contact-team-title" class="neutral-1000 desktop-section-title">
          {dealer.businessPreview
            ? locale.t("dealer.contact.heading", { dealer: dealer.name })
            : (dealer.copy["contact.agents"] ??
              locale.t("ui.contact-locations.speak-with-our-team"))}
        </h2>
      {:else}
        <h4 id="contact-team-title" class="neutral-1000 desktop-section-title"
          >{dealer.businessPreview
            ? locale.t("dealer.contact.heading", { dealer: dealer.name })
            : (dealer.copy["contact.agents"] ??
              locale.t("ui.contact-locations.speak-with-our-team"))}</h4
        >
      {/if}
      <p class="karento-contact-sample neutral-500 desktop-type-body-small"
        >{dealer.businessPreview
          ? locale.t("dealer.contact.beforeVisit")
          : locale.t(
              "ui.contact-locations.sample-locations-ai-generated-portraits",
            )}</p
      >
    </div>
    <div class="row mt-30">
      {#each dealer.locations as location (location.name)}<ContactLocationCard
          {location}
        />
      {/each}
    </div>
  </div>
</section>
