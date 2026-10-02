<script lang="ts">
  import { brand } from "../data/brand";
  import Icon from "./Icon.svelte";
</script>

<!-- One dealer footer for the curated homepage and supporting pages. -->
<footer class="dealer-footer">
  <div class="dealer-footer-frame">
    <div class="dealer-footer-grid">
      <div class="dealer-footer-brand">
        <a
          class="dealer-footer-logo"
          href="/"
          aria-label={`${brand.name} home`}
        >
          <img src={brand.logoLight} alt={brand.name} width="132" height="32" />
        </a>
        <p>{brand.tagline}</p>
        <p>{brand.location}</p>
      </div>
      <nav aria-label="Find a car">
        <h3>Find a car</h3>
        <a href="/inventory/">Browse all cars</a>
        <a href="/inventory/?condition=New">New cars</a>
        <a href="/inventory/?condition=Used">Used cars</a>
        <a href="/favorites/">Saved cars</a>
        <a href="/compare/">Compare cars</a>
      </nav>
      <nav aria-label="Explore">
        <h3>Explore</h3>
        <a href="/about/">About us</a>
        <a href="/blog/">Buying advice</a>
        <a href="/calculator/">Repayment calculator</a>
        <a href="/faq/">FAQs</a>
        <a href="/contact/?intent=sell">Sell your car</a>
      </nav>
      <div class="dealer-footer-contact">
        <h3>Visit the showroom</h3>
        <p>{brand.hours}</p>
        <a class="dealer-footer-cta" href="/contact/">
          Get in touch <Icon name="arrow" size={20} />
        </a>
        <a href="/contact/?intent=viewing">Arrange a viewing</a>
      </div>
    </div>
    <div class="dealer-footer-bottom">
      <span>
        © {new Date().getFullYear()}
        {brand.name}. All rights reserved.
      </span>
      <a href="/terms/">Terms &amp; privacy</a>
    </div>
    {#if brand.inventoryMode === "sample" || brand.formMode === "preview"}
      <p class="dealer-footer-note">
        Template preview · sample vehicles. Enquiries are local previews.
      </p>
    {/if}
  </div>
</footer>

<style>
  .dealer-footer {
    color: #fff;
    background: var(--accent, #405ff2);
    border-radius: 32px 32px 0 0;
    font-family: "Boxcar Dealer", Arial, sans-serif;
  }
  .dealer-footer-frame {
    width: min(1320px, calc(100% - 80px));
    margin-inline: auto;
  }
  .dealer-footer-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr 1.1fr;
    gap: 48px;
    padding: 64px 0 48px;
  }
  .dealer-footer-grid > * {
    min-width: 0;
  }
  .dealer-footer-logo {
    display: inline-flex;
    margin-bottom: 20px;
  }
  .dealer-footer-logo img {
    display: block;
    width: 132px;
    height: 32px;
    object-fit: contain;
  }
  h3 {
    color: #fff;
    font-size: 18px;
    line-height: 26px;
    font-weight: 500;
    margin: 0 0 18px;
  }
  p {
    color: #fff;
    font-size: 15px;
    line-height: 26px;
    margin: 0 0 10px;
  }
  a {
    color: #fff;
    font-size: 15px;
    line-height: 24px;
    text-decoration: none;
  }
  nav a,
  .dealer-footer-contact > a {
    display: flex;
    align-items: center;
    min-height: 36px;
    width: fit-content;
  }
  nav a:hover,
  .dealer-footer-contact > a:not(.dealer-footer-cta):hover,
  .dealer-footer-bottom a:hover {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  a:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 4px;
    border-radius: 4px;
  }
  .dealer-footer-contact .dealer-footer-cta {
    display: inline-flex;
    gap: 12px;
    min-height: 48px;
    padding: 12px 20px;
    margin: 14px 0 10px;
    color: var(--accent, #405ff2);
    background: #fff;
    border-radius: 12px;
    font-weight: 500;
  }
  .dealer-footer-cta :global(svg) {
    flex: none;
  }
  .dealer-footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    border-top: 1px solid #ffffff40;
    padding: 24px 0 12px;
    font-size: 14px;
    line-height: 24px;
  }
  .dealer-footer-bottom a {
    min-height: 32px;
    display: inline-flex;
    align-items: center;
    font-size: 14px;
  }
  .dealer-footer-note {
    margin: 0;
    padding: 0 0 24px;
    font-size: 12px;
    line-height: 20px;
  }
  @media (max-width: 999px) {
    .dealer-footer-frame {
      width: calc(100% - 48px);
    }
    .dealer-footer-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 36px 48px;
      padding: 48px 0 36px;
    }
  }
  @media (max-width: 575px) {
    .dealer-footer {
      border-radius: 24px 24px 0 0;
    }
    .dealer-footer-frame {
      width: calc(100% - 36px);
    }
    .dealer-footer-grid {
      gap: 28px 24px;
      padding: 40px 0 28px;
    }
    .dealer-footer-brand,
    .dealer-footer-contact {
      grid-column: 1 / -1;
    }
    h3 {
      font-size: 17px;
      margin-bottom: 14px;
    }
    nav a,
    .dealer-footer-contact > a {
      min-height: 44px;
    }
    .dealer-footer-logo {
      margin-bottom: 14px;
    }
    .dealer-footer-bottom {
      align-items: flex-start;
      flex-direction: column;
      gap: 8px;
      padding-top: 20px;
    }
  }
</style>
