<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import ListingFilterPanel from "./ListingFilterPanel.svelte";
</script>

<ListingFilterPanel
  title={locale.t("ui.vehicle-heading.show-on-map")}
  bodyClass="box-collapse scrollFilter mb-15"
>
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
        title={locale.t("ui.listing-map-filter.location-map")}
      ></iframe>
    </div>
  </div>
</ListingFilterPanel>
