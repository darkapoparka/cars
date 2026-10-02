<script lang="ts">
  import { brand } from "../data/brand";
  import Icon from "./Icon.svelte";
  let {
    vehicle = "",
    selling = false,
  }: { vehicle?: string; selling?: boolean } = $props();
  let previewed = $state(false);
  const uid = $props.id();
</script>

<form
  class="enquiry-form"
  aria-label="Enquiry form"
  onsubmit={(event) => {
    event.preventDefault();
    previewed = true;
  }}
  oninput={() => (previewed = false)}
>
  <div class="field-grid">
    <label for={`${uid}-name`}>
      Full name
      <input
        id={`${uid}-name`}
        name="name"
        autocomplete="name"
        required
        placeholder="Your name"
      />
    </label>
    <label for={`${uid}-email`}>
      Email address
      <input
        id={`${uid}-email`}
        name="email"
        type="email"
        autocomplete="email"
        required
        placeholder="you@example.com"
      />
    </label>
  </div>
  {#if vehicle}<label>
      Vehicle
      <input name="vehicle" value={vehicle} readonly />
    </label>{/if}
  {#if selling}<div class="field-grid">
      <label>
        Car make and model
        <input name="car" required placeholder="e.g. Audi A4" />
      </label>
      <label>
        Year
        <input
          name="year"
          type="number"
          min="1900"
          max={new Date().getFullYear() + 1}
          required
        />
      </label>
    </div>{/if}
  <label for={`${uid}-message`}>
    {selling ? "Tell us about your car" : "Your message"}
    <textarea
      id={`${uid}-message`}
      name="message"
      rows="4"
      required
      placeholder={selling
        ? "Mileage, condition and anything you would like us to know…"
        : "How can we help?"}
    ></textarea>
  </label>
  <p class="fine-print">Demo enquiry · no message is sent.</p>
  <button class="button" type="submit">
    Preview enquiry <Icon name="arrow" size={16} />
  </button>
  {#if previewed}<p class="form-feedback" role="status">
      Enquiry preview complete. No message was sent to {brand.name}.
    </p>{/if}
</form>
