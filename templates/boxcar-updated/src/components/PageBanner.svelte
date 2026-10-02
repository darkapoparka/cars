<script lang="ts">
  let {
    title,
    breadcrumb,
    description,
    headingId = "page-banner-title",
  }: {
    title: string;
    breadcrumb: string;
    description: string;
    headingId?: string;
  } = $props();
</script>

<section class="dealer-banner" aria-labelledby={headingId}>
  <div class="banner-inner">
    <img
      class="banner-car banner-car-left"
      src="/media/banners/boxcar-estate-right-v1.webp"
      alt=""
      width="720"
      height="405"
    />
    <div class="banner-copy">
      <nav class="banner-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{breadcrumb}</span>
      </nav>
      <h1 id={headingId}>{title}</h1>
      <p>{description}</p>
    </div>
    <img
      class="banner-car banner-car-right"
      src="/media/banners/boxcar-suv-left-v1.webp"
      alt=""
      width="720"
      height="405"
    />
  </div>
</section>

<style>
  .dealer-banner {
    position: relative;
    overflow: hidden;
    margin-bottom: 28px;
    color: #050b20;
    background: linear-gradient(110deg, #e4eaff 0%, #eef1ff 55%, #e6edff 100%);
    font-family: "Boxcar Dealer", Arial, sans-serif;
  }
  .dealer-banner::before {
    content: "";
    position: absolute;
    width: 440px;
    height: 440px;
    left: max(-120px, calc((100% - 1320px) / 2 - 170px));
    top: -205px;
    border-radius: 50%;
    background: #405ff20a;
    box-shadow:
      0 0 0 56px #405ff206,
      0 0 0 112px #405ff204;
    pointer-events: none;
  }
  .banner-inner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: min(1320px, calc(100% - 80px));
    min-height: 180px;
    margin-inline: auto;
    padding-block: 20px;
  }
  .banner-copy {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 500px;
    text-align: center;
  }
  .banner-breadcrumb {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 10px;
    margin: 0 0 8px;
    color: #596582;
    font-size: 0.8125rem;
    line-height: 1.55;
  }
  .banner-breadcrumb a {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    color: #405ff2;
  }
  h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: -1.2px;
    overflow-wrap: anywhere;
    text-wrap: balance;
  }
  .banner-copy p {
    margin: 10px 0 0;
    color: #465270;
    font-size: 0.9375rem;
    line-height: max(26px, 1.7em);
    text-wrap: balance;
  }
  .banner-car {
    position: absolute;
    bottom: 8px;
    width: 300px;
    height: auto;
    pointer-events: none;
  }
  .banner-car-left {
    left: -8px;
  }
  .banner-car-right {
    right: -8px;
  }
  @media (max-width: 1240px) {
    .banner-car {
      display: none;
    }
  }
  @media (max-width: 767px) {
    .dealer-banner {
      margin-bottom: 20px;
    }
    .banner-inner {
      width: calc(100% - 36px);
      min-height: 156px;
    }
    .dealer-banner::before {
      left: -290px;
      top: -250px;
    }
    h1 {
      font-size: 2rem;
      letter-spacing: -0.8px;
    }
    .banner-copy p {
      margin-top: 8px;
      font-size: 0.875rem;
    }
  }
</style>
