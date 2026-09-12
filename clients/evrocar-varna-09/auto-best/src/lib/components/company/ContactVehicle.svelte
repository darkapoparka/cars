<script lang="ts">
  import { resolve } from '$app/paths';
  import { formatVehiclePrice, type Vehicle } from '$data/inventory';
  import Icon from '$components/ui/Icon.svelte';

  let { vehicle, hero = false }: { vehicle: Vehicle; hero?: boolean } = $props();
</script>

<a class="dn-contact-vehicle" class:dn-contact-vehicle--hero={hero} href={resolve('/listing-detail-v1/[id]', { id: String(vehicle.id) })} aria-label={`Към ${vehicle.title}`}>
  <img src={vehicle.image} alt="" width="120" height="90" />
  <span><small>Избран автомобил</small><strong>{vehicle.title}</strong><span>{vehicle.year} · {formatVehiclePrice(vehicle.priceEur)}</span></span>
  <Icon name="arrow-right" size={18} />
</a>

<style>
  .dn-contact-vehicle { display: flex; gap: 12px; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--dn-line); color: inherit; }
  .dn-contact-vehicle img { width: 88px; height: 66px; flex-shrink: 0; object-fit: cover; border-radius: 8px; }
  .dn-contact-vehicle > span { display: grid; gap: 3px; flex: 1; min-width: 0; }
  .dn-contact-vehicle small, .dn-contact-vehicle span span { font-size: 12px; color: #666d77; }
  .dn-contact-vehicle strong { font-size: 15px; line-height: 1.35; }
  .dn-contact-vehicle:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  .dn-contact-vehicle--hero { margin: 0; padding: 12px; border: 0; border-radius: 12px; background: #fff; color: var(--dn-ink); text-align: left; }
</style>
