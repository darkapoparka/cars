<script lang="ts">
  import { vehicleContactHref } from '$data/journeys';
  import { resolve } from '$app/paths';
  import { formatVehiclePrice } from '$data/inventory';
  import { brand } from '$config/brand';

  let { priceUsd, vehicleId }: { priceUsd: number; vehicleId: number } = $props();
  // Retained source prop name; the connected US inventory supplies USD, not EUR.
  const financeTerms = [12, 24, 36, 48, 60] as const;
  let downPaymentUsd = $state(0);
  let termMonths = $state<(typeof financeTerms)[number]>(60);
  let normalizedDownPayment = $derived(Math.min(Math.max(Number(downPaymentUsd) || 0, 0), priceUsd));
  let financedPrincipal = $derived(Math.max(priceUsd - normalizedDownPayment, 0));
  let principalPerMonth = $derived(Math.round(financedPrincipal / termMonths));
  function normalizeDownPayment() { downPaymentUsd = normalizedDownPayment; }
</script>

<div class="dn-finance-calculator">
  {#if brand.dealerFinance}
    <header>
      <h2>Purchase budget (demo)</h2>
      <p>An arithmetic illustration only, not a credit quote or an application.</p>
    </header>
    <div class="dn-finance-calculator__fields">
      <label><span>Initial amount</span><span class="dn-finance-calculator__input">
        <input type="number" min="0" max={priceUsd} step="500" bind:value={downPaymentUsd} onblur={normalizeDownPayment} aria-describedby="finance-disclaimer" /><b>$</b>
      </span></label>
      <label><span>Period</span><select bind:value={termMonths} aria-describedby="finance-disclaimer">
        {#each financeTerms as term (term)}<option value={term}>{term} months</option>{/each}
      </select></label>
    </div>
    <dl class="dn-finance-calculator__result" aria-live="polite">
      <div><dt>Remaining amount</dt><dd>{formatVehiclePrice(financedPrincipal)}</dd></div>
      <div><dt>Amount / month</dt><dd>{formatVehiclePrice(principalPerMonth)}</dd></div>
    </dl>
    <p id="finance-disclaimer" class="dn-finance-calculator__disclaimer">No interest, charges or insurance are calculated. This is not an offer of credit.</p>
  {:else}
    <header>
      <h2>Payment policy</h2>
      <p>Texas Drive Auto advertises cash-only sales. It does not offer dealer financing or payment plans.</p>
    </header>
    <dl class="dn-finance-calculator__result">
      <div><dt>Advertised vehicle price</dt><dd>{formatVehiclePrice(priceUsd)}</dd></div>
      <div><dt>Dealer payment plans</dt><dd>Not offered</dd></div>
    </dl>
    <p id="finance-disclaimer" class="dn-finance-calculator__disclaimer">The published descriptions distinguish buyer-arranged financing and mention cash, cashier’s checks and major cards. Confirm accepted payment, tax, title and licensing charges directly. No credit application or payment is taken here.</p>
  {/if}
  <a href={resolve(vehicleContactHref(vehicleId, 'leasing'))}>Read the payment policy</a>
</div>

<style>
  .dn-finance-calculator header h2 { margin: 0; color: #24272c; font-size: 24px; font-weight: 650; line-height: 1.18; letter-spacing: -.025em; }
  .dn-finance-calculator header p { margin: 8px 0 0; color: #666d77; font-size: var(--dn-text-meta); line-height: 1.5; }
  .dn-finance-calculator__fields { display: grid; gap: 12px; margin-top: 16px; }
  .dn-finance-calculator__fields label { display: grid; gap: 7px; color: #555b64; font-size: var(--dn-text-meta); font-weight: 600; }
  .dn-finance-calculator__input { position: relative; }
  .dn-finance-calculator__input b { position: absolute; top: 50%; right: 14px; color: #6d737c; font-size: var(--dn-text-body); transform: translateY(-50%); pointer-events: none; }
  input, select { width: 100%; min-height: 44px; border: 1px solid #d8dce2; border-radius: var(--dn-radius-control); background: #fff; color: #24272c; font: inherit; font-size: var(--dn-text-body); }
  input { padding: 0 40px 0 13px; }
  select { padding: 0 38px 0 13px; cursor: pointer; }
  input:hover, select:hover { border-color: #b9bec6; }
  input:focus-visible, select:focus-visible { border-color: var(--dn-red); outline: 3px solid var(--dn-focus); outline-offset: 2px; }
  .dn-finance-calculator__result { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin: 14px 0 0; }
  .dn-finance-calculator__result div { min-width: 0; padding: 11px 12px; border-radius: 10px; background: #f4f6fa; }
  .dn-finance-calculator__result dt { color: #707680; font-size: 12px; line-height: 1.35; }
  .dn-finance-calculator__result dd { margin: 5px 0 0; color: #24272c; font-size: var(--dn-text-body); font-weight: 700; line-height: 1.3; }
  .dn-finance-calculator__disclaimer { margin: 10px 0 0; color: #747a83; font-size: 12px; line-height: 1.5; }
  .dn-finance-calculator > a { min-height: 50px; display: flex; align-items: center; justify-content: center; margin-top: 14px; padding: 0 18px; border-radius: var(--dn-radius-button); background: var(--dn-red); color: #fff; font-size: 17px; font-weight: 650; text-align: center; }
  .dn-finance-calculator > a:hover { background: var(--dn-red-hover); }
  .dn-finance-calculator > a:focus-visible { outline: 3px solid var(--dn-focus); outline-offset: 3px; }
  @media (max-width: 380px) { .dn-finance-calculator__result { grid-template-columns: 1fr; } }
</style>
