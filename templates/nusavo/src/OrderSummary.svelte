<script>
 import {readCart} from './interactions.js';
 let {confirmation=false}=$props();
 const items=readCart();
 const subtotal=items.reduce((s,i)=>s+i.price*i.quantity,0);
</script>
{#if confirmation}<p class="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received">Local booking preview complete. No reservation or payment has been submitted.</p>{/if}
<table class="shop_table woocommerce-checkout-review-order-table"><thead><tr><th class="product-name">Product</th><th class="product-total">Subtotal</th></tr></thead><tbody>{#each items as item(item.id)}<tr class="cart_item"><td class="product-name">{item.name} <strong class="product-quantity">× {item.quantity}</strong></td><td class="product-total">${(item.price*item.quantity).toFixed(2)}</td></tr>{/each}</tbody><tfoot><tr class="cart-subtotal"><th>Subtotal</th><td>${subtotal.toFixed(2)}</td></tr><tr class="woocommerce-shipping-totals shipping"><th>Shipment</th><td>Flat rate: <strong>$10.00</strong></td></tr><tr class="order-total"><th>Total</th><td><strong>${(subtotal+10).toFixed(2)}</strong></td></tr></tfoot></table>
