<script lang="ts">
  import { brand } from '$config/brand';

  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(brand.mapQuery)}&z=13&hl=bg&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.mapQuery)}`;
</script>

<div class="dn-showroom-map">
  <iframe
    class="dn-showroom-map__frame"
    src={mapEmbedUrl}
    title={`Карта до ${brand.name}`}
    loading="lazy"
    referrerpolicy="strict-origin-when-cross-origin"
  ></iframe>
  <a class="dn-showroom-map__link" href={directionsUrl} target="_blank" rel="noreferrer">Отворете в Google Maps</a>
</div>

<style>
  .dn-showroom-map {
    position: relative;
    min-height: 460px;
    overflow: hidden;
    border: 1px solid #e6e8eb;
    border-radius: 24px;
    background: #e9ebee;
  }

  .dn-showroom-map__frame {
    display: block;
    width: 100%;
    height: 460px;
    border: 0;
  }

  .dn-showroom-map__link {
    position: absolute;
    right: 16px;
    bottom: 16px;
    z-index: 2;
    min-height: 46px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 18px;
    border: 1px solid rgba(20, 23, 29, .1);
    border-radius: var(--dn-radius-button);
    background: rgba(255, 255, 255, .96);
    box-shadow: 0 8px 20px rgba(18, 25, 38, .12);
    color: var(--dn-ink);
    font-size: 14px;
    font-weight: 700;
  }

  .dn-showroom-map__link:hover,
  .dn-showroom-map__link:focus-visible {
    color: var(--dn-red);
  }

  @media (max-width: 767px) {
    .dn-showroom-map,
    .dn-showroom-map__frame {
      min-height: 320px;
      height: 320px;
    }
  }

  @media (max-width: 480px) {
    .dn-showroom-map,
    .dn-showroom-map__frame {
      min-height: 280px;
      height: 280px;
    }

    .dn-showroom-map__link {
      right: 12px;
      bottom: 12px;
      left: 12px;
    }
  }
</style>
