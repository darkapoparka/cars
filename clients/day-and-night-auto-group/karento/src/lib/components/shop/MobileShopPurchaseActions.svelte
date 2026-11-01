<svelte:options runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  import { quantity } from "#lib/attachments.svelte.ts";
  import DemoActionButton from "#lib/components/DemoActionButton.svelte";
  import MobileIcon from "#lib/components/mobile/MobileIcon.svelte";
  import MobileIconButton from "#lib/components/mobile/MobileIconButton.svelte";

  const locale = useLocale();

  function normalizeQuantity(
    event: Event & { currentTarget: HTMLInputElement },
  ) {
    const amount = Math.floor(Number(event.currentTarget.value));
    event.currentTarget.value = String(
      Number.isSafeInteger(amount) && amount > 0 ? amount : 1,
    );
  }
</script>

<div class="mobile-shop-purchase-actions">
  <div
    class="product-quantity"
    role="group"
    aria-label={locale.t("ui.product-purchase-banner.quantity")}
    {@attach quantity}
  >
    <MobileIconButton
      class="qty-down"
      label={locale.t("quantity.decrease")}
      icon="minus"
      surface="plain"
    />
    <input
      class="qty-val"
      type="text"
      name="quantity"
      value="1"
      inputmode="numeric"
      enterkeyhint="done"
      aria-label={locale.t("ui.product-purchase-banner.quantity")}
      onchange={normalizeQuantity}
      onblur={normalizeQuantity}
    />
    <MobileIconButton
      class="qty-up"
      label={locale.t("quantity.increase")}
      icon="plus"
      surface="plain"
    />
  </div>
  <DemoActionButton
    type="button"
    class="mobile-product-add-to-cart button-add-to-cart"
    aria-label={locale.t("ui.product-purchase-banner.add-to-cart")}
  >
    <MobileIcon name="cart" />
    {locale.t("reference.shop.cartAction")}
  </DemoActionButton>
</div>

<style>
  .mobile-shop-purchase-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--karento-space-3);
    min-width: 0;
  }

  .product-quantity {
    position: relative;
    isolation: isolate;
    display: grid;
    grid-template-columns: repeat(3, var(--karento-touch-target));
    flex: 0 0 auto;
  }

  .product-quantity::before {
    content: "";
    position: absolute;
    inset: var(--karento-space-1) 0;
    z-index: -1;
    border-radius: var(--karento-radius-media);
    background: var(--karento-surface-tool);
    pointer-events: none;
  }

  .qty-val {
    width: var(--karento-touch-target);
    min-width: 0;
    height: var(--karento-touch-target);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: var(--karento-radius-media);
    background: transparent;
    box-shadow: none;
    color: var(--bs-neutral-1000);
    font: inherit;
    font-size: var(--karento-type-field-size);
    font-weight: var(--karento-type-field-weight);
    text-align: center;
  }

  .mobile-shop-purchase-actions :global(.mobile-product-add-to-cart) {
    position: relative;
    isolation: isolate;
    display: flex;
    flex: 1 1 128px;
    align-items: center;
    justify-content: center;
    gap: var(--karento-space-2);
    min-width: 0;
    min-height: var(--karento-touch-target);
    padding: var(--karento-space-2) var(--karento-space-3);
    border: 0;
    border-radius: var(--karento-radius-media);
    background: transparent;
    color: var(--bs-neutral-0);
    font: inherit;
    font-size: var(--karento-type-control-size);
    font-weight: var(--karento-type-control-weight);
    line-height: var(--karento-type-control-leading);
    cursor: pointer;
  }

  .mobile-shop-purchase-actions :global(.mobile-product-add-to-cart::before) {
    content: "";
    position: absolute;
    inset: var(--karento-space-1) 0;
    z-index: -1;
    border-radius: inherit;
    background: var(--bs-neutral-1000);
    pointer-events: none;
  }

  .mobile-shop-purchase-actions
    :global(.mobile-product-add-to-cart:hover::before) {
    background: var(--bs-neutral-800);
  }

  .qty-val:focus-visible,
  .mobile-shop-purchase-actions
    :global(.mobile-product-add-to-cart:focus-visible) {
    outline: var(--karento-focus-width) solid var(--bs-neutral-1000);
    outline-offset: var(--karento-focus-offset);
  }

  .mobile-shop-purchase-actions :global(output[data-demo-action]) {
    flex-basis: 100%;
    margin: 0;
    font-size: var(--karento-type-body-small-size);
    line-height: var(--karento-type-body-small-leading);
  }
</style>
