<script lang="ts">
import { featuredVehicles } from '$data/inventory';
import Icon from '$components/ui/Icon.svelte';
</script>
<section class="dn-videos" aria-labelledby="videos-title"><div class="container"><div class="dn-videos__panel"><div class="dn-videos__heading"><h2 id="videos-title">От нашите обяви</h2><p>Подбрани публикувани обяви към 07.09.2026. Наличностите и условията се потвърждават по телефона.</p><a class="dn-videos__channel dn-home-section-action" href="/listing-grid">Всички автомобили <Icon name="arrow-right" size={18}/></a></div><div class="dn-videos__grid">{#each featuredVehicles.slice(0,3) as vehicle (vehicle.id)}<article class="dn-video-card"><div class="dn-video-card__media"><a class="dn-video-card__play" href={vehicle.href}><img src={vehicle.image} alt={vehicle.title} width="720" height="404" loading="lazy" /></a></div><div class="dn-video-card__content"><h3>{vehicle.title}</h3><div class="dn-video-card__actions"><a href={vehicle.href}>Разгледайте автомобила <Icon name="arrow-right" size={16}/></a></div></div></article>{/each}</div></div></div></section>
<style>
  .dn-videos { padding: 32px 0; background: #fff; }
  .dn-videos__panel { padding: 32px; border-radius: 20px; background: #f1f3f5; }
  .dn-videos__heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px 32px; align-items: center; margin-bottom: 24px; }
  .dn-videos__heading h2 { display: flex; align-items: center; gap: 8px; margin: 0; color: #171a20; font-size: 32px; font-weight: 650; line-height: 1.2; letter-spacing: -0.03em; }
  .dn-videos__heading p { grid-column: 1; margin: 0; color: #626a75; font-size: 16px; line-height: 1.5; }
  .dn-videos__channel { display: inline-flex; grid-column: 2; grid-row: 1; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0; border-radius: 4px; color: #525a66; font-size: 16px; font-weight: 600; }
  .dn-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .dn-video-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border-radius: 16px; background: #fff; }
  .dn-video-card__media { position: relative; aspect-ratio: 16 / 9; background: #171a20; }
  .dn-video-card__play { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; padding: 0; cursor: pointer; background: #171a20; color: #fff; }
  .dn-video-card__play img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .dn-video-card__content { display: flex; flex: 1; flex-direction: column; padding: 18px 20px 12px; }
  .dn-video-card h3 { min-height: 2.6em; margin: 0 0 8px; color: #24272c; font-size: 20px; font-weight: 600; line-height: 1.3; overflow-wrap: anywhere; }
  .dn-video-card__actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: auto; }
  .dn-video-card__actions a { display: inline-flex; min-height: 44px; align-items: center; gap: 8px; color: #626a75; font-size: 14px; font-weight: 500; }
  .dn-video-card__actions a:hover { color: var(--dn-red); }
  .dn-videos__channel:hover { color: var(--dn-red); text-decoration: underline; text-underline-offset: 4px; }
  a:focus-visible { outline: 3px solid var(--dn-red); outline-offset: -3px; }

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
  }
</style>

