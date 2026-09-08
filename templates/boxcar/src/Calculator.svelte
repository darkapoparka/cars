<script lang="ts">
  let { compact = false }: { compact?: boolean } = $props();
  let price = $state<number | undefined>(10000);
  let interest = $state<number | undefined>(10);
  let years = $state<number | undefined>(3);
  let deposit = $state<number | undefined>(5000);
  let result = $state<{ monthly: number; interest: number; total: number } | null>(null);
  let error = $state('');
  const money = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function calculate(event: SubmitEvent) {
    event.preventDefault();
    if (price == null || interest == null || years == null || deposit == null || ![price, interest, years, deposit].every(Number.isFinite) || price <= 0 || years <= 0 || interest < 0 || deposit < 0 || deposit > price) {
      error = 'Enter a positive price and term, a non-negative interest rate, and a down payment no greater than the price.';
      result = null; return;
    }
    error = '';
    const principal = price - deposit, months = Math.round(years * 12), rate = interest / 1200;
    if (months < 1) { error = 'The loan term must be at least one month.'; return; }
    const monthly = rate === 0 ? principal / months : principal * rate / (1 - (1 + rate) ** -months);
    result = { monthly, interest: monthly * months - principal, total: monthly * months };
  }
</script>

<div class={['apus-mortgage-calculator', !compact && 'always_show']}>
  <div class="main-inner"><div class="inner-info">
    {#if !compact}<h4 class="title">Auto Loan Calculator</h4><div class="des">Use our loan calculator to calculate payments over the life of your loan. Enter your information to see how much your monthly payments could be. You can adjust length of loan, down payment and interest rate to see how those changes raise or lower your payments.</div>{/if}
    <form class="row" onsubmit={calculate}>
      <div class="col-12 col-md-6"><div class="form-group"><label for="loan-price">Price ($)</label><input class="form-control" id="loan-price" type="number" min="1" step="any" required bind:value={price}/></div></div>
      <div class="col-12 col-md-6"><div class="form-group"><label for="loan-interest">Interest Rate</label><input class="form-control" id="loan-interest" type="number" min="0" step="any" required bind:value={interest}/></div></div>
      <div class="col-12 col-md-6"><div class="form-group"><label for="loan-years">Loan Term (year)</label><input class="form-control" id="loan-years" type="number" min="0.083333" step="any" required bind:value={years}/></div></div>
      <div class="col-12 col-md-6"><div class="form-group"><label for="loan-deposit">Down Payment</label><input class="form-control" id="loan-deposit" type="number" min="0" step="any" required bind:value={deposit}/></div></div>
      <div class="col-12"><button type="submit" class={['btn btn-theme', !compact && 'w-100']}>Calculate <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 13L13 1M1 1h12v12" stroke="currentColor"/></svg></button></div>
    </form>
    {#if error}<p class="loan-error" role="alert">{error}</p>{/if}
  </div></div>
  <div class="apus_mortgage_results" class:local-results-visible={compact && !!result} aria-live="polite">
    {#each [{ label: 'Monthly Payment', key: 'monthly', className: 'monthly-payment' }, { label: 'Total Interest', key: 'interest', className: 'total-interest' }, { label: 'Total Payment', key: 'total', className: 'total-payment' }] as item (item.key)}
      <div class={item.className}><span class="text">{item.label}</span><span class="value">${result ? money(result[item.key as keyof typeof result]) : '0'}</span></div>
    {/each}
  </div>
</div>

<style>.loan-error{color:#b42318;margin-top:16px}.local-results-visible{display:flex!important;justify-content:space-between;gap:24px}@media(max-width:767px){.local-results-visible{flex-direction:column}}</style>
