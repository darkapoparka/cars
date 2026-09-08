<script lang="ts">
  import { readIds, type Vehicle } from './catalog';
  let { vehicles }: { vehicles: Vehicle[] } = $props();
  let ids = $state(readIds('boxcar-compare'));
  let selected = $derived(vehicles.filter(v => ids.includes(v.id)));
  function remove(id: string) { ids = ids.filter(x => x !== id); localStorage.setItem('boxcar-compare', JSON.stringify(ids)); }
  const rows = ['Body', 'Mileage', 'Fuel Type', 'Year', 'Transmission', 'Drive Type', 'Condition', 'Engine Size', 'Door', 'Cylinder', 'Color'];
</script>

{#if !selected.length}<div class="not-found alert alert-warning">No listings found.</div>
{:else}
  <div class="comparison-scroll"><table class="comparison-table">
    <thead><tr><th scope="col">Compare Cars</th>{#each selected as car (car.id)}<th scope="col"><button class="remove" aria-label={`Remove ${car.title}`} onclick={() => remove(car.id)}>×</button><a href={car.href}><img src={car.image} alt={car.title}/><h3>{car.title}</h3></a><strong>${car.price.toLocaleString('en-US')}</strong></th>{/each}</tr></thead>
    <tbody>{#each rows as row (row)}<tr><th scope="row">{row}</th>{#each selected as car (car.id)}<td>{car.specs[row] || '—'}</td>{/each}</tr>{/each}</tbody>
  </table></div>
  <a class="btn btn-theme" href="/listings/">Add another car ↗</a>
{/if}

<style>.comparison-scroll{overflow:auto;margin-bottom:30px}.comparison-table{min-width:650px;width:100%;border-collapse:collapse}.comparison-table th,.comparison-table td{padding:22px;border:1px solid #e9e9e9;text-align:left;min-width:190px}.comparison-table th{font-weight:500}.comparison-table thead th{position:relative;vertical-align:top}.comparison-table img{width:280px;aspect-ratio:1.5;object-fit:cover;border-radius:12px}.comparison-table h3{font-size:20px;margin-top:18px}.comparison-table tbody tr:nth-child(odd){background:#f9fbfc}.remove{position:absolute;right:30px;top:30px;border:0;background:white;border-radius:50%;width:36px;height:36px;font-size:25px;cursor:pointer}</style>
