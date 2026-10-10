<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import CalendarInput from "#lib/components/CalendarInput.svelte";
  let {
    id,
    label,
    value = $bindable(""),
    class: className = "item-search",
  }: {
    id: string;
    label: string;
    value?: string;
    class?: string;
  } = $props();
</script>

<div class={className}>
  <label class="text-sm-bold neutral-500 desktop-type-label" for={id}
    >{label}</label
  >
  <div class="box-calendar-date">
    <CalendarInput
      class="search-input datepicker desktop-type-control"
      placeholder=""
      bind:value
      {id}
      aria-label={label}
    />
  </div>
</div>
