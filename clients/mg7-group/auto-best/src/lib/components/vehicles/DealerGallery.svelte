<script lang="ts">
  let { images, title }: { images: string[]; title: string } = $props();
  let selected = $state(0);
  const move = (step: number) => selected = (selected + step + images.length) % images.length;
</script>
<img src={images[selected]} alt={title + ' — снимка ' + (selected + 1)} width="1245" height="988" fetchpriority="high" decoding="async" />
{#if images.length > 1}
  <div class="dealer-gallery-controls" role="group" aria-label="Снимки на автомобила">
    <button type="button" onclick={() => move(-1)} aria-label="Предишна снимка">‹</button>
    <span aria-live="polite">{selected + 1} / {images.length}</span>
    <button type="button" onclick={() => move(1)} aria-label="Следваща снимка">›</button>
  </div>
{/if}
<style>
  img { display:block; width:100%; height:100%; object-fit:cover; }
  .dealer-gallery-controls { position:absolute; inset:auto 16px 16px auto; display:flex; align-items:center; gap:12px; padding:4px; border-radius:24px; background:rgba(15,20,28,.88); color:white; font-size:14px; }
  button { width:40px; height:40px; border:0; border-radius:50%; background:transparent; color:inherit; font-size:28px; cursor:pointer; }
  button:focus-visible { outline:2px solid white; outline-offset:2px; }
</style>
