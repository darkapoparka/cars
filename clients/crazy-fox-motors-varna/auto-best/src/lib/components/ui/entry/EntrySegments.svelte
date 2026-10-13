<script lang="ts" generics="T extends string">
  type Option = { value: T; label: string; id?: string; controls?: string };
  let { value = $bindable(), options, label, tabs = false, onchange, class: className = '' }: { value: T; options: readonly Option[]; label: string; tabs?: boolean; onchange?: () => void; class?: string } = $props();
  function select(next: T) { value = next; onchange?.(); }
  function navigate(event: KeyboardEvent, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length;
    select(options[next].value);
    (event.currentTarget as HTMLElement).parentElement?.querySelectorAll('button')[next]?.focus();
  }
</script>
<div class={['dn-segmented-control', className]} role={tabs ? 'tablist' : 'group'} aria-label={label}>
  {#each options as option, index (option.value)}
    <button class="dn-segmented-option" type="button" id={option.id} role={tabs ? 'tab' : undefined} aria-controls={option.controls} aria-selected={tabs ? value === option.value : undefined} aria-pressed={tabs ? undefined : value === option.value} tabindex={tabs && value !== option.value ? -1 : 0} onclick={() => select(option.value)} onkeydown={(event) => navigate(event, index)}><span>{option.label}</span></button>
  {/each}
</div>
<style>
  @media (max-width: 767px) {
    .dn-segmented-option > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  }
</style>
