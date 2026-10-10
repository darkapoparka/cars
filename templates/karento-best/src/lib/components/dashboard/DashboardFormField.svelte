<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardField } from "#lib/data/dashboard.ts";
  let { field }: { field: DashboardField } = $props();
</script>

{#snippet label()}
  {#if field.label}<label
      class={[field.labelClass, "desktop-type-label"]}
      for={field.id}>{locale.text(field.label)}</label
    >{/if}
{/snippet}
<div class={field.columnClass}>
  {#if field.labelOutside}{@render label()}{/if}
  <div class="form-group">
    {#if !field.labelOutside}{@render label()}{/if}
    {#if field.control === "textarea"}
      <textarea
        class="form-control"
        placeholder={locale.text(field.placeholder)}
        rows={field.rows}
        id={field.id}
        aria-label={locale.text(field.ariaLabel)}>{field.value ?? ""}</textarea
      >
    {:else}
      <input
        class="form-control"
        type={field.type}
        placeholder={locale.text(field.placeholder)}
        value={field.value}
        id={field.id}
        aria-label={locale.text(field.ariaLabel)}
      />
    {/if}
  </div>
</div>
