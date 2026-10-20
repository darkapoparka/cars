<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import type { DashboardWalletTransaction } from "#lib/data/dashboard.ts";
  let { transaction }: { transaction: DashboardWalletTransaction } = $props();
</script>

<tr>
  <td class="text-gray-9 fw-medium">{locale.text(transaction.payment)}</td>
  <td>{locale.text(transaction.direction)}</td>
  <td>{transaction.date}</td>
  <td><span class={transaction.amountClass}>{transaction.amount}</span></td>
  <td>{transaction.balance}</td>
  <td>
    <span class={transaction.statusClass}
      ><i class="fi fi-rr-caret-right me-1"></i>{locale.text(
        transaction.status,
      )}</span
    >
  </td>
</tr>
