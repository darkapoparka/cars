<script lang="ts">
  import { resolve } from '$app/paths';
  import { featuredVehicles } from '$data/inventory';
  import Icon from '$components/ui/Icon.svelte';
  const galleryVehicles = [featuredVehicles[0], featuredVehicles[2], featuredVehicles[5]];
  let activePhotos = $state<Record<number, number>>({});
  function nextPhoto(id: number, count: number) { activePhotos[id] = ((activePhotos[id] ?? 0) + 1) % count; }
</script>
<section class="dn-videos" aria-labelledby="videos-title">
  <div class="container"><div class="dn-videos__panel">
    <div class="dn-videos__heading dn-home-section-heading">
      <h2 id="videos-title" class="dn-home-section-title"><span class="dn-videos__intro">Снимки от</span><span class="dn-videos__brand-mark"><Icon name="car" size={32} /></span>обявите</h2>
      <p>Оригинални галерии към датираната селекция. Това не е видео канал.</p>
      <a class="dn-videos__channel dn-home-section-action" href={resolve('/listing-grid')}><span>Всички автомобили</span><Icon name="arrow-right" size={16} /></a>
    </div>
    <div class="dn-videos__grid">
      {#each galleryVehicles as vehicle (vehicle.id)}
        <article class="dn-video-card">
          <div class="dn-video-card__media">
            <button class="dn-video-card__play" type="button" aria-label={'Следваща снимка: ' + vehicle.title} onclick={() => nextPhoto(vehicle.id, vehicle.images.length)}>
              <img src={vehicle.images[activePhotos[vehicle.id] ?? 0]} alt={vehicle.title} width="720" height="404" loading="lazy" decoding="async" />
              <span class="dn-video-card__play-icon" aria-hidden="true"><Icon name="arrow-right" size={24} /></span>
              <span class="dn-video-card__duration">{(activePhotos[vehicle.id] ?? 0) + 1} / {vehicle.images.length}</span>
            </button>
          </div>
          <div class="dn-video-card__content"><h3>{vehicle.title}</h3><div class="dn-video-card__actions"><a href={resolve(vehicle.href)}>Данни и галерия <Icon name="arrow-right" size={16} /></a></div></div>
        </article>
      {/each}
      <a class="dn-videos__all-card" href={resolve('/listing-grid')}><span class="dn-videos__all-icon"><Icon name="car" size={40} /></span><strong>Всички обяви</strong><span>Данни, снимки и източник</span><span class="dn-videos__all-arrow">Към селекцията<Icon name="arrow-right" size={18} /></span></a>
    </div>
  </div></div>
</section>
<style>
  .dn-videos { padding: 32px 0; background: #fff; }
  .dn-videos__all-card { display: none; }
  .dn-videos__panel { padding: 32px; border-radius: 20px; background: #f1f3f5; }
  .dn-videos__heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 32px; align-items: center; margin-bottom: 24px; }
  .dn-videos__heading h2 { display: flex; align-items: center; gap: 8px; margin: 0; color: #171a20; font-size: 32px; font-weight: 650; line-height: 1.2; letter-spacing: -0.03em; }
  .dn-videos__brand-mark { display: flex; flex-shrink: 0; color: #ff0033; }
  .dn-videos__heading p { grid-column: 1; margin: 0; color: #626a75; font-size: 16px; line-height: 1.5; }
  .dn-videos__channel { display: inline-flex; grid-column: 2; grid-row: 1; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0; border-radius: 4px; color: #525a66; font-size: 16px; font-weight: 600; }
  .dn-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .dn-video-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border-radius: 16px; background: #fff; }
  .dn-video-card__media { position: relative; aspect-ratio: 16 / 9; background: #171a20; }
  .dn-video-card__play { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; padding: 0; cursor: pointer; background: #171a20; color: #fff; }
  .dn-video-card__play img { display: block; width: 100%; height: 100%; object-fit: contain; }
  .dn-video-card__play-icon { position: absolute; left: calc(50% - 28px); top: calc(50% - 22px); display: grid; place-items: center; width: 56px; height: 44px; border-radius: 12px; background: var(--dn-red); }
  .dn-video-card__play:hover .dn-video-card__play-icon { background: #24272c; }
  .dn-video-card__duration { position: absolute; bottom: 10px; right: 10px; padding: 3px 6px; border-radius: 4px; background: #171a20; color: #fff; font-size: 12px; font-weight: 600; line-height: 1.4; }
  .dn-video-card__content { display: flex; flex: 1; flex-direction: column; padding: 18px 20px 12px; }
  .dn-video-card h3 { min-height: 2.6em; margin: 0 0 8px; color: #24272c; font-size: 20px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; }
  .dn-video-card__actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; }
  .dn-video-card__actions a { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; color: #626a75; font-size: 14px; font-weight: 500; }
  .dn-video-card__actions a:hover { color: var(--dn-red); }
  .dn-videos__channel:hover { color: var(--dn-red); text-decoration: underline; text-underline-offset: 4px; }
  a:focus-visible, button:focus-visible { outline: 3px solid var(--dn-red); outline-offset: -3px; }

  @media (min-width: 768px) and (max-width: 991px) {
    .dn-videos__panel { padding: 24px; }
    .dn-videos__grid { gap: 16px; }
    .dn-video-card__content { padding-inline: 14px; }
    .dn-video-card h3 { font-size: 18px; }
  }

  @media (max-width: 767px) {
    .dn-videos { padding: 20px 0 12px; background: var(--dn-mobile-canvas); }
    .dn-videos__panel { padding: 0; border-radius: 0; background: transparent; }
    .dn-videos__heading { gap: 4px 8px; margin-bottom: 12px; }
    .dn-videos__heading h2 { font-size: 20px; font-weight: 700; }
    .dn-videos__heading p { grid-column: 1 / -1; font-size: 14px; }
    .dn-videos__channel { display: none; }
    .dn-videos__channel :global(.dn-icon) { display: none; }
    .dn-videos__grid { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: min(82vw, 320px); gap: 10px; overflow-x: auto; margin-inline: -12px; padding: 0 12px 4px; scroll-padding-inline: 12px; scroll-snap-type: x proximity; }
    .dn-video-card { border-radius: 14px; scroll-snap-align: start; }
    .dn-video-card__content { padding: 14px 14px 8px; }
    .dn-video-card h3 { font-size: 17px; }
    .dn-videos__all-card { position: relative; display: flex; min-height: 280px; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 24px; border: 1px solid #dce0e5; border-radius: 14px; background: #fff; color: #202329; text-align: center; scroll-snap-align: start; }
    .dn-videos__all-icon { color: #ff0033; }
    .dn-videos__all-card strong { font-size: 20px; line-height: 1.3; }
    .dn-videos__all-card > span:not([class]) { color: #626a75; font-size: 14px; }
    .dn-videos__all-arrow { display: flex; min-height: 44px; align-items: center; gap: 8px; padding: 8px 18px; margin-top: 4px; border-radius: var(--dn-pill); background: var(--dn-red); color: #fff; font-size: 14px; font-weight: 600; }
    .dn-videos__all-card:hover { border-color: #aab0b8; background: #fafafa; }
  }
  .dn-videos__intro { font-size: .8em; font-weight: 600; letter-spacing: -.02em; }
</style>
