<script>
 import {cars,readCart,saveCart} from './interactions.js';
 import images from './car-images.json';
 let items=$state(readCart());let coupon=$state('');let message=$state('');let dirty=$state(false);
 const added=sessionStorage.getItem('nusavo-added');sessionStorage.removeItem('nusavo-added');
 const subtotal=$derived(items.reduce((sum,item)=>sum+item.price*item.quantity,0));
 function update(){saveCart(items)}
 function remove(id){items=items.filter(i=>i.id!==id);update()}
 function apply(){message=coupon.trim()?'This coupon is not available in the local preview.':'Please enter a coupon code.'}
</script>
{#if items.length}
{#if added}<div class="woocommerce-message" role="status">“{added}” has been added to your cart. <a href="/cart/" class="button wc-forward">View cart</a></div>{/if}
<div class="e-cart__container">
 <div class="e-cart__column e-cart__column-start">
  <form class="woocommerce-cart-form" onsubmit={(e)=>{e.preventDefault();update();dirty=false;message='Cart updated.'}}>
   <div class="e-shop-table e-cart-section">
   <table class="shop_table shop_table_responsive cart woocommerce-cart-form__contents"><thead><tr><th class="product-remove"><span class="screen-reader-text">Remove item</span></th><th class="product-thumbnail"><span class="screen-reader-text">Thumbnail image</span></th><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th></tr></thead><tbody>
    {#each items as item(item.id)}<tr class="woocommerce-cart-form__cart-item cart_item"><td class="product-remove"><button class="remove" type="button" aria-label={'Remove '+item.name} onclick={()=>remove(item.id)}>×</button></td><td class="product-thumbnail"><a href={'/car-listing/'+item.slug+'/'}><img src={images[item.slug]} alt={item.name} width="300" height="300"/></a></td><td class="product-name" data-title="Product"><a href={'/car-listing/'+item.slug+'/'}>{item.name}</a></td><td class="product-price" data-title="Price">${item.price.toFixed(2)}</td><td class="product-quantity" data-title="Quantity"><div class="quantity"><label class="screen-reader-text" for={'quantity-'+item.id}>{item.name} quantity</label><input id={'quantity-'+item.id} class="input-text qty text" type="number" min="1" max="30" bind:value={item.quantity} onchange={()=>{item.quantity=Math.max(1,Math.min(30,item.quantity||1));dirty=true;update()}}/></div></td><td class="product-subtotal" data-title="Subtotal">${(item.price*item.quantity).toFixed(2)}</td></tr>{/each}
    <tr><td colspan="6" class="actions"><button type="submit" class="button" name="update_cart" disabled={!dirty}>Update Cart</button></td></tr>
   </tbody></table></div>
   <div class="coupon e-cart-section"><div class="e-coupon-box"><label class="screen-reader-text" for="coupon_code">Coupon:</label><input id="coupon_code" class="input-text" placeholder="Coupon code" bind:value={coupon}/><button type="button" class="button" onclick={apply}>Apply coupon</button></div></div>
  </form>
  {#if message}<p role="status">{message}</p>{/if}
 </div>
 <div class="e-cart__column e-cart__column-end"><div class="e-cart__column-inner e-cart-totals e-cart-section"><div class="cart-collaterals"><div class="cart_totals calculated_shipping"><h2>Cart Totals</h2><table class="shop_table shop_table_responsive"><tbody><tr class="cart-subtotal"><th>Subtotal</th><td data-title="Subtotal">${subtotal.toFixed(2)}</td></tr><tr class="woocommerce-shipping-totals shipping"><th>Shipment</th><td data-title="Shipping">Flat rate: <strong>$10.00</strong><p class="woocommerce-shipping-destination">Shipping to <strong>CA</strong>.</p><details><summary>Change address</summary><label for="shipping-country">Country / region</label><select id="shipping-country"><option>United States (US)</option><option>Bulgaria</option><option>Indonesia</option></select><label for="shipping-postcode">Postcode / ZIP</label><input id="shipping-postcode"/><button class="button" type="button" onclick={()=>message='Address updated for this preview.'}>Update</button></details></td></tr><tr class="order-total"><th>Total</th><td data-title="Total"><strong>${(subtotal+10).toFixed(2)}</strong></td></tr></tbody></table><div class="wc-proceed-to-checkout"><a href="/checkout/" class="checkout-button button alt wc-forward">Proceed to checkout</a></div></div></div></div></div>
</div>
{:else}<div class="wc-empty-cart-message"><div class="cart-empty woocommerce-info">Your cart is currently empty.</div></div><p class="return-to-shop"><a href="/car-listing/" class="button wc-backward">Return to shop</a></p>{/if}

