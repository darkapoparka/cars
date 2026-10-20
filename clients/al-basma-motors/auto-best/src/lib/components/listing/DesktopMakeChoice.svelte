<script lang="ts">
  import { desktopMakeCount } from '$data/desktop-makes';
  import { getI18n } from '$lib/locale/context';
  import { vehicleCount } from '$lib/locale/messages';
  import DesktopFilterChoice from './DesktopFilterChoice.svelte';
  import DesktopMakeLogo from './DesktopMakeLogo.svelte';

  let { value, label, checked, name, portrait = true, compact = false, onchange }: {
    value: string; label: string; checked: boolean; name?: string;
    portrait?: boolean;
    compact?: boolean;
    onchange: (value: string) => void;
  } = $props();
  const i18n = getI18n();
  const stock = $derived(vehicleCount(i18n.locale, desktopMakeCount(value)));
</script>

{#snippet logo()}
  <DesktopMakeLogo {value} {portrait} {compact} />
{/snippet}

<DesktopFilterChoice {value} {label} {checked} {name} {onchange} multiple tile={portrait} {portrait} media={logo} description={compact ? String(desktopMakeCount(value)) : stock} accessibleLabel={compact ? `${label}, ${stock}` : label} />
