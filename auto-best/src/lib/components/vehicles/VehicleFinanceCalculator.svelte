<script lang="ts">
  import { getI18n } from '$lib/locale/context';

  const i18n = getI18n();

  import { vehicleContactHref } from '$data/journeys';
  import { resolve } from '$app/paths';
  import { formatVehiclePrice } from '$data/inventory';

  let { priceEur, vehicleId, idPrefix = 'finance' }: { priceEur: number; vehicleId: number; idPrefix?: string } = $props();

  const financeTerms = [12, 24, 36, 48, 60] as const;
  let disclaimerId = $derived(`${idPrefix}-disclaimer`);
  let downPaymentEur = $state(0);
  let termMonths = $state<(typeof financeTerms)[number]>(60);

  let normalizedDownPayment = $derived(Math.min(Math.max(Number(downPaymentEur) || 0, 0), priceEur));
  let financedPrincipal = $derived(Math.max(priceEur - normalizedDownPayment, 0));
  let principalPerMonth = $derived(Math.round(financedPrincipal / termMonths));

  function normalizeDownPayment() {
    downPaymentEur = normalizedDownPayment;
  }
</script>

<div class="dn-finance-calculator">
  <header>
    <h2>{i18n.t("m_bb13d3f9546c")}</h2>
    <p>{i18n.t("m_59771da764a8")}</p>
  </header>

  <div class="dn-finance-calculator__fields">
    <label>
      <span>{i18n.t("m_0da00b600a2d")}</span>
      <span class="dn-finance-calculator__input">
        <input {@attach i18n.validation}
          type="number"
          min="0"
          max={priceEur}
          step="500"
          bind:value={downPaymentEur}
          onblur={normalizeDownPayment}
          aria-describedby={disclaimerId}
        />
        <b>{i18n.t("m_716f15f096c0")}</b>
      </span>
    </label>

    <label>
      <span>{i18n.t("m_c6f3bfd45614")}</span>
      <select {@attach i18n.validation} bind:value={termMonths} aria-describedby={disclaimerId}>
        {#each financeTerms as term (term)}
          <option value={term}>{i18n.t("m_76866efdecb0", { p0: term })}</option>
        {/each}
      </select>
    </label>
  </div>

  <dl class="dn-finance-calculator__result" aria-live="polite">
    <div>
      <dt>{i18n.t("m_e43dbb778995")}</dt>
      <dd>{formatVehiclePrice(financedPrincipal, i18n.locale)}</dd>
    </div>
    <div>
      <dt>{i18n.t("m_25604ed836cb")}</dt>
      <dd>{formatVehiclePrice(principalPerMonth, i18n.locale)}</dd>
    </div>
  </dl>

  <p id={disclaimerId} class="dn-finance-calculator__disclaimer">
    {i18n.t("m_d2b577395c64")}
  </p>

  <a href={i18n.href(resolve(vehicleContactHref(vehicleId, 'leasing')))}>
    {i18n.t("m_1f0593e69d38")}
  </a>
</div>

<style>
  .dn-finance-calculator header h2 {
    margin: 0;
    color: #24272c;
    font-size: var(--dn-text-subheading);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-heading);
    letter-spacing: var(--dn-tracking-heading);
  }

  .dn-finance-calculator header p {
    margin: 8px 0 0;
    color: #666d77;
    font-size: var(--dn-text-meta);
    line-height: var(--dn-leading-body);
  }

  .dn-finance-calculator__fields {
    display: grid;
    gap: 12px;
    margin-top: 16px;
  }

  .dn-finance-calculator__fields label {
    display: grid;
    gap: 7px;
    color: #555b64;
    font-size: var(--dn-text-meta);
    font-weight: var(--dn-weight-semibold);
  }

  .dn-finance-calculator__input { position: relative; }

  .dn-finance-calculator__input b {
    position: absolute;
    top: 50%;
    right: 14px;
    color: #6d737c;
    font-size: var(--dn-text-body);
    transform: translateY(-50%);
    pointer-events: none;
  }

  input,
  select {
    width: 100%;
    min-height: 44px;
    border: 1px solid #d8dce2;
    border-radius: var(--dn-radius-control);
    background: #fff;
    color: #24272c;
    font: inherit;
    font-size: var(--dn-control-size);
  }

  input { padding: 0 40px 0 13px; }
  select { padding: 0 38px 0 13px; cursor: pointer; }

  input:hover,
  select:hover { border-color: #b9bec6; }

  input:focus-visible,
  select:focus-visible {
    border-color: var(--dn-red);
    outline: 3px solid var(--dn-focus);
    outline-offset: 2px;
  }

  .dn-finance-calculator__result {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 14px 0 0;
  }

  .dn-finance-calculator__result div {
    min-width: 0;
    padding: 11px 12px;
    border-radius: 10px;
    background: #f4f6fa;
  }

  .dn-finance-calculator__result dt {
    color: #707680;
    font-size: var(--dn-text-meta);
    line-height: var(--dn-leading-meta);
  }

  .dn-finance-calculator__result dd {
    margin: 5px 0 0;
    color: #24272c;
    font-size: var(--dn-text-body);
    font-weight: var(--dn-weight-semibold);
    line-height: var(--dn-leading-heading);
  }

  .dn-finance-calculator__disclaimer {
    margin: 10px 0 0;
    color: #747a83;
    font-size: var(--dn-text-meta);
    line-height: var(--dn-leading-body);
  }

  .dn-finance-calculator > a {
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 14px;
    padding: 0 18px;
    border-radius: var(--dn-radius-button);
    background: var(--dn-red);
    color: #fff;
    font-size: var(--dn-text-lead);
    font-weight: var(--dn-weight-semibold);
    text-align: center;
  }

  .dn-finance-calculator > a:hover { background: var(--dn-red-hover); }

  .dn-finance-calculator > a:focus-visible {
    outline: 3px solid var(--dn-focus);
    outline-offset: 3px;
  }

  @media (max-width: 380px) {
    .dn-finance-calculator__result { grid-template-columns: 1fr; }
  }
</style>
