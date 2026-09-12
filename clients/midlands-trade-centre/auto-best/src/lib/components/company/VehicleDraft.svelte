<script lang="ts">
  import { brand } from '$config/brand';
  import { formatVehiclePrice, type Vehicle } from '$data/inventory';
  let { vehicle }: { vehicle: Vehicle } = $props();
  let note = $state('');
  let feedback = $state('');
  const draft = $derived([`Vehicle enquiry for ${brand.name}`, `${vehicle.title} | source ${vehicle.sourceId}`, `${formatVehiclePrice(vehicle.priceAmount)} | ${vehicle.mileage}`, `Source: ${vehicle.sourceUrl}`, 'Please confirm availability, final price, condition and the viewing location.', note.trim()].filter(Boolean).join('\n'));
  async function copyDraft() {
    try { await navigator.clipboard.writeText(draft); feedback = 'Copied to your clipboard. Nothing has been sent.'; }
    catch { feedback = 'Select and copy the draft below. Nothing has been sent.'; }
  }
</script>
<section class="dn-vehicle-draft" aria-labelledby="draft-title">
  <h3 id="draft-title">Prepare your vehicle enquiry</h3>
  <p>This preview creates a local draft only. It does not contact the dealership.</p>
  <label>Your question <textarea rows="3" bind:value={note} placeholder="What would you like to confirm?" /></label>
  <label>Enquiry draft <textarea rows="7" readonly value={draft} /></label>
  <button type="button" onclick={copyDraft}>Copy enquiry draft</button>
  <p role="status">{feedback}</p>
</section>
<style>
.dn-vehicle-draft { display:grid; gap:12px; margin-block:24px; padding:20px; border-radius:16px; background:#f3f4f6; }
.dn-vehicle-draft h3,.dn-vehicle-draft p { margin:0; } label { display:grid; gap:6px; font-size:14px; }
textarea { width:100%; padding:12px; border:1px solid #d3d6da; border-radius:8px; background:#fff; color:#202329; font:inherit; resize:vertical; }
button { min-height:44px; padding:12px 18px; border:0; border-radius:8px; background:var(--dn-red); color:#fff; font:inherit; font-weight:600; cursor:pointer; }
button:focus-visible,textarea:focus-visible { outline:3px solid var(--dn-red); outline-offset:3px; }
</style>
