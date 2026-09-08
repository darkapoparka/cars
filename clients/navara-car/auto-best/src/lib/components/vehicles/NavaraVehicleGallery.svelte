<script lang="ts">
  import Icon from '$components/ui/Icon.svelte';
  import type { Vehicle } from '$data/inventory';

  let { vehicle, returnTo }: { vehicle: Vehicle; returnTo: string } = $props();
  let selectedIndex = $state(0);
  const images = $derived(vehicle.gallery.length ? vehicle.gallery : [vehicle.image]);
  const activeImage = $derived(images[selectedIndex] ?? images[0]);

  function move(direction: number) {
    selectedIndex = (selectedIndex + direction + images.length) % images.length;
  }
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'Home') { event.preventDefault(); selectedIndex = 0; }
    if (event.key === 'End') { event.preventDefault(); selectedIndex = images.length - 1; }
  }
  function imageUnavailable(event: Event) {
    const image = event.currentTarget as HTMLImageElement;
    if (!image.src.endsWith('/navara/photo-unavailable.svg')) image.src = '/navara/photo-unavailable.svg';
  }
</script>

<figure class="dn-detail-gallery" aria-label={`Снимки от обявата: ${vehicle.title}`}>
  <a class="dn-detail-mobile-back" href={returnTo} aria-label="Назад към автомобилите">
    <Icon name="arrow-left" size={20} strokeWidth={2} />
  </a>
  <img src={activeImage} alt={`${vehicle.title} — снимка ${selectedIndex + 1} от обявата на Навара кар`} width="1245" height="988" fetchpriority="high" decoding="async" onerror={imageUnavailable} />
  {#if images.length > 1}
    <figcaption class="navara-gallery-controls">
      <button type="button" aria-label="Предишна снимка" onclick={() => move(-1)} onkeydown={handleKeydown}>
        <Icon name="arrow-left" size={20} />
      </button>
      <span aria-live="polite" aria-atomic="true">{selectedIndex + 1} / {images.length}</span>
      <button type="button" aria-label="Следваща снимка" onclick={() => move(1)} onkeydown={handleKeydown}>
        <Icon name="arrow-right" size={20} />
      </button>
    </figcaption>
  {/if}
</figure>

<style>
  .dn-detail-gallery { position: relative; }
  .navara-gallery-controls {
    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 10px; padding: 4px;
    border-radius: 999px; background: rgba(255, 255, 255, .96); color: #24272c;
    box-shadow: 0 2px 12px rgba(0, 0, 0, .16);
  }
  .navara-gallery-controls button {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 44px; min-height: 44px; border: 0; border-radius: 50%;
    background: transparent; color: inherit; cursor: pointer;
  }
  .navara-gallery-controls button:hover { background: #eef0f2; }
  .navara-gallery-controls button:focus-visible { outline: 3px solid var(--dn-red); outline-offset: 2px; }
  .navara-gallery-controls span { min-width: 42px; text-align: center; font-size: 14px; font-weight: 600; }
</style>
