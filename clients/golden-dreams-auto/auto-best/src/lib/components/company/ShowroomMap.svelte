<script lang="ts">
  import { brand } from '$config/brand';
  const query = `${brand.name}, ${brand.city}`;
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=13&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
</script>

<div class="dn-showroom-map">
  <iframe class="dn-showroom-map__frame" src={mapEmbedUrl} title={`Търсене на ${brand.name} в Google Maps`} loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
  <p class="dn-showroom-map__note">Точният адрес не е потвърден в публичния източник. Потвърдете го по телефона.</p>
  <a class="dn-showroom-map__link" href={directionsUrl} target="_blank" rel="noreferrer">Търсене в Google Maps</a>
</div>

<style>
  .dn-showroom-map{position:relative;min-height:420px;overflow:hidden;border:1px solid #e6e8eb;border-radius:24px;background:#e9ebee}
  .dn-showroom-map__frame{display:block;width:100%;height:420px;border:0}
  .dn-showroom-map__note{position:absolute;left:16px;bottom:70px;max-width:520px;margin:0;padding:10px 14px;border-radius:12px;background:rgba(17,18,20,.9);color:#fff;font-size:13px}
  .dn-showroom-map__link{position:absolute;right:16px;bottom:16px;display:inline-flex;min-height:46px;align-items:center;padding:0 18px;border-radius:999px;background:#fff;color:#17181a;font-weight:700}
  @media(max-width:767px){.dn-showroom-map,.dn-showroom-map__frame{min-height:320px;height:320px}.dn-showroom-map__note{right:12px;left:12px;bottom:68px}.dn-showroom-map__link{right:12px;bottom:12px;left:12px;justify-content:center}}
</style>
