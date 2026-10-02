<script lang="ts">
  import { brand } from "../data/brand";
  import Icon from "./Icon.svelte";
  let {
    vehicle = "",
    selling = false,
    variant = "default",
    subject = "Buying a car",
  }: {
    vehicle?: string;
    selling?: boolean;
    variant?: "default" | "boxcar";
    subject?: string;
  } = $props();
  let previewed = $state(false);
  let interest = $state("Buying a car");
  $effect(() => {
    interest = selling ? "Selling a car" : subject;
  });
  const uid = $props.id();
</script>

<form
  class="enquiry-form"
  class:boxcar-form={variant === "boxcar"}
  aria-label="Enquiry form"
  onsubmit={(event) => {
    event.preventDefault();
    previewed = true;
  }}
  oninput={() => (previewed = false)}
>
  <div class="field-grid">
    <label for={`${uid}-name`} class:form_boxes={variant === "boxcar"}>
      Full name
      <input
        id={`${uid}-name`}
        name="name"
        autocomplete="name"
        required
        placeholder="Your name"
      />
    </label>
    <label for={`${uid}-email`} class:form_boxes={variant === "boxcar"}>
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
  {#if variant === "boxcar"}<div class="field-grid">
      <label class="form_boxes" for={`${uid}-phone`}>
        Phone <span>(optional)</span>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          autocomplete="tel"
          placeholder="Your phone number"
        />
      </label>
      <label class="form_boxes" for={`${uid}-interest`}>
        I’m interested in
        <select id={`${uid}-interest`} name="interest" bind:value={interest}>
          <option>Buying a car</option>
          <option>Arranging a viewing</option>
          <option>Selling a car</option>
          <option>Something else</option>
        </select>
      </label>
    </div>{/if}
  {#if vehicle}<label class:form_boxes={variant === "boxcar"}>
      Vehicle
      <input name="vehicle" value={vehicle} readonly />
    </label>{/if}
  {#if selling}<div class="field-grid">
      <label class:form_boxes={variant === "boxcar"}>
        Car make and model
        <input name="car" required placeholder="e.g. Audi A4" />
      </label>
      <label class:form_boxes={variant === "boxcar"}>
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
  <label for={`${uid}-message`} class:form_boxes={variant === "boxcar"}>
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
  <button class="button" type="submit">
    Preview enquiry <Icon name="arrow" size={20} />
  </button>
  {#if previewed}<p class="form-feedback" role="status">
      Enquiry preview complete. No message was sent to {brand.name}.
    </p>{/if}
</form>
