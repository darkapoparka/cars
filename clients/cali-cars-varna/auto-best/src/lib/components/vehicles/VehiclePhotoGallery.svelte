<script lang="ts">
  import { getI18n } from '$lib/locale/context';
  import type { VehicleImage } from '$data/inventory';
  import VehiclePhoto from './VehiclePhoto.svelte';

  let { photos, title, vehicleId, demo = false }: { photos: readonly VehicleImage[]; title: string; vehicleId: number; demo?: boolean } = $props();
  const i18n = getI18n();
  let category = $state<'all' | VehicleImage['category']>('all');
  const categories = $derived([
    { value: 'all' as const, label: i18n.t('detail.photos.all'), count: photos.length },
    { value: 'exterior' as const, label: i18n.t('detail.photos.exterior'), count: photos.filter(photo => photo.category === 'exterior').length },
    { value: 'interior' as const, label: i18n.t('detail.photos.interior'), count: photos.filter(photo => photo.category === 'interior').length }
  ].filter(item => item.count > 0));
  const effectiveCategory = $derived(categories.some(item => item.value === category) ? category : 'all');
  const visiblePhotos = $derived(photos.filter(photo => effectiveCategory === 'all' || photo.category === effectiveCategory));
  const caption = (photo: VehicleImage) => photo.caption?.[i18n.locale] ?? i18n.t(photo.category === 'exterior' ? 'detail.photos.exterior' : 'detail.photos.interior');
</script>

<div class="dn-photo-gallery">
  <header>
    {#if demo}
      <div class="demo-note"><strong>{i18n.t('detail.photos.demo')}</strong><p>{i18n.t('detail.photos.demoNote')}</p></div>
    {/if}
    <div class="categories" role="group" aria-label={i18n.t('detail.photos.categories')}>
      {#each categories as item (item.value)}
        <button class="dn-compact-control" type="button" aria-pressed={effectiveCategory === item.value} aria-label={i18n.t('detail.photos.categoryCount', { category: item.label, count: item.count })} onclick={() => category = item.value}>{item.label}<span>{item.count}</span></button>
      {/each}
    </div>
  </header>
  <ul class="photos" aria-label={i18n.t('detail.photos')}>
    {#each visiblePhotos as photo (photo.image)}
      <li>
        <div class="photo-frame">
          <VehiclePhoto image={photo.image} title={i18n.t(demo ? 'detail.photos.demoAlt' : 'detail.photos.imageAlt', { car: title, view: caption(photo) })} id={`vehicle-gallery-${vehicleId}-${photos.indexOf(photo)}`} compact priority={false} />
        </div>
        <span class="caption">{caption(photo)}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .dn-photo-gallery { display: grid; gap: var(--dn-space-4); }
  header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--dn-space-3); }
  .demo-note { display: grid; gap: var(--dn-space-1); }
  .demo-note strong { color: var(--dn-ink); font: var(--dn-control-font); }
  .demo-note p { margin: 0; color: var(--dn-muted); font: var(--dn-field-label-font); }
  .categories { display: flex; flex-wrap: wrap; gap: var(--dn-space-2); }
  .categories button { --dn-compact-control-surface: var(--dn-home-panel); gap: var(--dn-space-2); padding-inline: var(--dn-space-3); border: 0; cursor: pointer; }
  .categories button[aria-pressed='true'] { --dn-compact-control-surface: var(--dn-ink); --dn-compact-control-ink: var(--dn-white); }
  .categories button span { font-size: var(--dn-text-meta); }
  .categories button:focus-visible { outline: 2px solid var(--dn-focus); outline-offset: var(--dn-space-half); }
  .photos { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: var(--dn-space-3); margin: 0; padding: 0; list-style: none; }
  .photos li { min-width: 0; padding: var(--dn-space-2); border: 1px solid var(--dn-line); border-radius: var(--dn-radius-card); background: var(--dn-surface-subtle); }
  .photo-frame { aspect-ratio: 3 / 2; overflow: hidden; border-radius: var(--dn-radius-control); background: var(--dn-home-panel); }
  .caption { display: block; padding: var(--dn-space-3) var(--dn-space-1) var(--dn-space-1); color: var(--dn-ink); font: var(--dn-field-label-font); }
  @media (max-width: 1199px) { .photos { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
