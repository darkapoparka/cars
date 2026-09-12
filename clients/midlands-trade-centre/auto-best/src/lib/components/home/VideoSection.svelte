<script lang="ts">
 import { featuredVehicles } from '$data/inventory';
 import Icon from '$components/ui/Icon.svelte';
</script>
<section class="dn-videos" aria-labelledby="videos-title"><div class="container"><div class="dn-videos__panel">
 <div class="dn-videos__heading dn-home-section-heading"><h2 id="videos-title" class="dn-home-section-title">A closer look</h2><p>Source photographs of dated listing samples. No dealer video channel is connected.</p><a class="dn-videos__channel dn-home-section-action" href="/listing-grid">All samples <Icon name="arrow-right" size={16} /></a></div>
 <div class="dn-videos__grid">{#each featuredVehicles.slice(0,3) as vehicle (vehicle.id)}<article class="dn-video-card"><div class="dn-video-card__media"><a class="dn-video-card__play" href={vehicle.href} aria-label={`View photographs of ${vehicle.title}`}><img src={vehicle.image} alt={vehicle.title} width="720" height="404" loading="lazy" decoding="async"/><span class="dn-video-card__duration">{vehicle.gallery.length} source photographs</span></a></div><div class="dn-video-card__content"><h3>{vehicle.title}</h3><div class="dn-video-card__actions"><a href={vehicle.href}>Photographs and details <Icon name="arrow-right" size={16}/></a></div></div></article>{/each}<a class="dn-videos__all-card" href="/listing-grid"><strong>All sampled vehicles</strong><span>Original photographs and source specifications.</span><span class="dn-videos__all-arrow">View catalogue <Icon name="arrow-right" size={18}/></span></a></div>
 </div></div></section>
<style>
  .dn-videos { padding: 32px 0; background: #fff; }
  .dn-videos__all-card { display: none; }
  .dn-videos__panel { position: relative; margin-top: -24px; padding: 24px; border-radius: 16px; background: #fff; }
  .dn-videos__heading { display: grid; min-height: 234px; grid-template-columns: minmax(0, 1fr); gap: 12px; align-content: center; align-items: center; padding: 32px 32px 56px; border-radius: 20px; background: #101114; }
  .dn-videos__heading h2 { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; margin: 0; color: #fff; font-size: 32px; font-weight: 650; line-height: 1.2; letter-spacing: -0.03em; }
  .dn-videos__wordmark { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-weight: 750; }
  .dn-videos__brand-mark { display: flex; flex-shrink: 0; color: #ff0033; }

  .dn-videos__channel { display: inline-flex; grid-column: 1; justify-self: start; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 10px 20px; border-radius: var(--dn-radius-button); background: #fff; color: #24272c; font-size: 16px; font-weight: 600; }
  .dn-videos__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
  .dn-video-card { display: flex; flex-direction: column; min-width: 0; overflow: hidden; border-radius: 16px; background: #fff; }
  .dn-video-card__title { position: absolute; top: 0; left: 0; right: 0; padding: 12px 12px 26px; background: linear-gradient(#000c, #0008 65%, transparent); color: #fff; font-size: 16px; font-weight: 500; line-height: 1.3; text-align: left; text-shadow: 0 1px 2px #000; }
  .dn-video-card__title > span { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; line-clamp: 2; overflow: hidden; }
  .dn-video-card__media { position: relative; aspect-ratio: 16 / 9; background: #171a20; }
  .dn-video-card__play { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; padding: 0; cursor: pointer; background: #171a20; color: #fff; }
  .dn-video-card__play img { display: block; width: 100%; height: 100%; object-fit: cover; }
  .dn-video-card__play-icon { position: absolute; left: calc(50% - 28px); top: calc(50% - 22px); display: grid; place-items: center; width: 56px; height: 44px; border-radius: 12px; background: var(--dn-red); }
  .dn-video-card__play:hover .dn-video-card__play-icon { background: #24272c; }
  .dn-video-card__duration { position: absolute; bottom: 10px; right: 10px; padding: 3px 6px; border-radius: 4px; background: #171a20; color: #fff; font-size: 12px; font-weight: 600; line-height: 1.4; }
  .dn-video-card iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  .dn-video-card__close { position: absolute; top: 8px; right: 8px; display: grid; place-items: center; width: 44px; height: 44px; padding: 0; border: 1px solid #525a66; border-radius: 50%; background: #171a20; color: #fff; cursor: pointer; }
  .dn-videos__channel:hover { background: #e9edf1; color: #171a20; }
  .dn-video-card__close:hover { background: #343941; }
  a:focus-visible, button:focus-visible, iframe:focus-visible { outline: 3px solid var(--dn-red); outline-offset: -3px; }

  @media (min-width: 992px) {
    .dn-videos .dn-videos__heading.dn-home-section-heading { min-height: var(--dn-home-heading-banner-height); }
    .dn-videos__heading h2 { justify-content: center; }
    .dn-videos__channel :global(svg) { width: 18px; height: 18px; stroke-width: 2; }
    .dn-videos__panel { background: var(--dn-home-panel); }
  }

  @media (min-width: 768px) and (max-width: 991px) {
    .dn-videos__heading { grid-template-columns: 1fr; }
    .dn-videos__channel { grid-column: 1; grid-row: auto; justify-self: start; }
    .dn-videos__grid { gap: 16px; }
  }

  @media (max-width: 767px) {
    .dn-videos { padding: 20px 0 12px; background: var(--dn-mobile-canvas); }
    .dn-videos__panel { margin-top: 12px; padding: 0; border-radius: 0; background: transparent; }
    .dn-videos__heading { min-height: 0; grid-template-columns: 1fr; gap: 10px; padding: 20px; border-radius: 14px; }
    .dn-videos__heading h2 { gap: 6px 8px; font-size: 24px; font-weight: 700; }
    .dn-videos__brand-mark :global(svg) { width: 32px; height: 32px; }

    .dn-videos__channel { grid-column: 1; grid-row: auto; justify-self: start; margin-top: 4px; border-radius: var(--dn-pill); font-size: 14px; }
    .dn-videos__grid { grid-template-columns: none; grid-auto-flow: column; grid-auto-columns: min(82vw, 320px); gap: 10px; overflow-x: auto; margin-inline: -12px; padding: 0 12px 4px; scroll-padding-inline: 12px; scroll-snap-type: x proximity; }
    .dn-video-card { border-radius: 14px; scroll-snap-align: start; }
    .dn-videos__all-card { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 12px; border: 1px solid #dce0e5; border-radius: 14px; background: #fff; color: #202329; text-align: center; scroll-snap-align: start; }
    .dn-videos__all-icon { color: #ff0033; }
    .dn-videos__all-card strong { font-size: 18px; line-height: 1.3; }
    .dn-videos__all-arrow { display: flex; min-height: 44px; align-items: center; gap: 8px; padding: 8px 18px; margin-top: 4px; border-radius: var(--dn-pill); background: var(--dn-red); color: #fff; font-size: 14px; font-weight: 600; }
    .dn-videos__all-card:hover { border-color: #aab0b8; background: #fafafa; }
  }
  .dn-videos__intro { font-size: .85em; font-weight: 600; letter-spacing: -.02em; }
</style>
