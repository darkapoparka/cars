<script lang="ts">
  import { brand } from '$config/brand';
  const query = encodeURIComponent(brand.address);
  const mapEmbedUrl = `https://maps.google.com/maps?q=${query}&z=16&hl=en&output=embed`;
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
</script>

<div class="dn-showroom-map">
  <iframe class="dn-showroom-map__frame" src={mapEmbedUrl} title={`Map to ${brand.name}`} loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
  <a class="dn-showroom-map__link" href={directionsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a>
</div>

<style>
  .dn-showroom-map{position:relative;min-height:420px;overflow:hidden;border:1px solid #e6e8eb;border-radius:24px;background:#e9ebee}.dn-showroom-map__frame{display:block;width:100%;height:420px;border:0}.dn-showroom-map__link{position:absolute;right:16px;bottom:16px;display:inline-flex;align-items:center;min-height:46px;padding:0 18px;border-radius:999px;background:#fff;color:#15171b;font-weight:700;box-shadow:0 8px 20px rgba(18,25,38,.12)}@media(max-width:767px){.dn-showroom-map,.dn-showroom-map__frame{min-height:300px;height:300px}.dn-showroom-map__link{right:12px;bottom:12px;left:12px;justify-content:center}}
</style>
