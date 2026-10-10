<svelte:options runes={true} />

<script lang="ts">
  import MobileSearchField from "./MobileSearchField.svelte";

  interface Choice {
    value: string;
    label: string;
  }

  let {
    value = $bindable(""),
    options,
    label,
    searchLabel,
    allLabel,
    emptyLabel,
    onselect,
  }: {
    value?: string;
    options: readonly Choice[];
    label: string;
    searchLabel: string;
    allLabel: string;
    emptyLabel: string;
    onselect?: (value: string) => void;
  } = $props();

  const id = $props.id();
  let query = $state("");
  const visible = $derived(
    options.filter((option) =>
      option.label.toLowerCase().includes(query.trim().toLowerCase()),
    ),
  );
</script>

<div class="mobile-choice-picker">
  <MobileSearchField bind:value={query} label={searchLabel} />
  <fieldset class="mobile-choice-options">
    <legend class="visually-hidden">{label}</legend>
    {#each [{ value: "", label: allLabel }, ...visible] as option (option.value)}
      <label class="mobile-choice-row">
        <span>{option.label}</span>
        <input
          type="radio"
          name={id}
          value={option.value}
          bind:group={value}
          onchange={() => onselect?.(option.value)}
        />
      </label>
    {/each}
  </fieldset>
  {#if !visible.length}<p class="mobile-choice-empty" role="status"
      >{emptyLabel}</p
    >{/if}
</div>
