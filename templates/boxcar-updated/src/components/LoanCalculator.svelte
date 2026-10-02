<script lang="ts">
  import { calculateLoan } from "../lib/domain";
  import { money } from "../lib/catalog";
  import Icon from "./Icon.svelte";
  let {
    startPrice = 50000,
    compact = false,
  }: { startPrice?: number; compact?: boolean } = $props();
  let price = $state<number | undefined>(50000),
    deposit = $state<number | undefined>(5000),
    apr = $state<number | undefined>(6.9),
    months = $state<number | undefined>(60);
  let result = $state<ReturnType<typeof calculateLoan> | null>(null);
  $effect(() => {
    price = startPrice;
    deposit = Math.min(5000, startPrice);
    result = null;
  });
  function calculate(event: SubmitEvent) {
    event.preventDefault();
    result = calculateLoan(
      Number(price),
      Number(deposit),
      Number(apr),
      Number(months),
    );
  }
</script>

<div class="loan-calculator" class:compact>
  <form
    onsubmit={calculate}
    oninput={() => (result = null)}
    aria-label="Loan calculator"
  >
    <div class="field-grid">
      <label>
        Vehicle price ($)
        <input type="number" min="1" step="0.01" required bind:value={price} />
      </label>
      <label>
        Deposit ($)
        <input
          type="number"
          min="0"
          max={price}
          step="0.01"
          required
          bind:value={deposit}
        />
      </label>
      <label>
        Annual interest (%)
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          required
          bind:value={apr}
        />
      </label>
      <label>
        Loan term (months)
        <input
          type="number"
          min="1"
          max="360"
          step="1"
          required
          bind:value={months}
        />
      </label>
    </div>
    <button class="button" type="submit">
      Calculate <Icon name="arrow" size={16} />
    </button>
  </form>
  {#if result && "error" in result}<p class="form-error" role="alert">
      {result.error}
    </p>{:else if result}<div class="loan-result" role="status">
      <span>Estimated monthly payment</span>
      <strong>{money(result.monthly, 2)}</strong>
      <dl>
        <div>
          <dt>Amount financed</dt>
          <dd>{money(result.principal, 2)}</dd>
        </div>
        <div>
          <dt>Total interest</dt>
          <dd>{money(result.interest, 2)}</dd>
        </div>
        <div>
          <dt>Total paid, including deposit</dt>
          <dd>{money(result.total, 2)}</dd>
        </div>
      </dl>
    </div>{/if}
  <p class="fine-print">
    Illustration only. Excludes fees, taxes and insurance. This is an estimate,
    not a finance offer or approval.
  </p>
</div>
