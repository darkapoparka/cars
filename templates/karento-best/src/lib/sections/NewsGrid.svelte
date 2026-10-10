<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import NewsHero from "#lib/components/editorial/NewsHero.svelte";
  import DesktopHeroBreadcrumb from "#lib/components/page-header/DesktopHeroBreadcrumb.svelte";
  import DesktopDiscoveryHero from "#lib/components/page-header/DesktopDiscoveryHero.svelte";
  import { newsDiscoveryImage } from "#lib/data/page-headers.ts";

  import SubscriberBanner from "#lib/components/editorial/SubscriberBanner.svelte";

  import NewsGridCard from "#lib/components/editorial/NewsGridCard.svelte";
  import { dealer } from "#lib/content.ts";
  import { filterNews, newsCategories, suppliedNews } from "#lib/data/news.ts";
  import { tick } from "svelte";
  import { MediaQuery } from "svelte/reactivity";
  import MobilePill from "#lib/components/mobile/MobilePill.svelte";
  import MobilePillRail from "#lib/components/mobile/MobilePillRail.svelte";
  import MobilePreviewControls from "#lib/components/mobile/MobilePreviewControls.svelte";
  import { focusableScroll } from "#lib/horizontal-scroll.ts";
  type FeedbackContainerGetter = () => HTMLElement | undefined;
  const phone = new MediaQuery("(max-width: 767.98px)");
  const desktop = new MediaQuery("(min-width: 992px)");
  const reducedMotion = new MediaQuery("(prefers-reduced-motion: reduce)");
  let query = $state("");
  let selectedCategory = $state("");
  const articles = $derived(suppliedNews(dealer.news));
  const availableCategories = $derived(newsCategories(articles));
  const filteredNews = $derived(
    filterNews(
      articles,
      phone.current ? "" : query,
      selectedCategory,
      locale.text,
      locale.locale,
    ),
  );
  const visibleNews = $derived(
    desktop.current || phone.current ? filteredNews : articles,
  );
  async function clearFilters() {
    const restoreSearch = desktop.current;
    query = "";
    selectedCategory = "";
    if (restoreSearch) {
      await tick();
      document.getElementById("news-search")?.focus();
    }
  }
  function submitSearch(event: SubmitEvent) {
    event.preventDefault();
    const results = document.getElementById("news-results");
    results?.focus({ preventScroll: true });
    results?.scrollIntoView({
      block: "start",
      behavior: reducedMotion.current ? "auto" : "smooth",
    });
  }
</script>

<section
  class="box-section background-body pt-80 karento-news-grid desktop-heading-container"
>
  <div class="container">
    {#if !desktop.current}
      <div class="text-center mb-40 karento-news-heading">
        <div
          class="background-body px-3 py-2 rounded-12 border d-flex gap-3 d-inline-flex"
        >
          <a
            href={locale.href("/")}
            class="neutral-700 text-md-medium"
            aria-label={locale.t("ui.news-grid.home")}
            >{locale.t("ui.news-grid.home")}</a
          >
          <span>
            <img
              src="/assets/imgs/template/icons/arrow-right.svg"
              alt={locale.t("image.illustrative")}
            />
          </span>
          <DemoActionLink
            href="#!"
            class="neutral-1000 text-md-bold"
            aria-label={locale.t("ui.news-grid.news")}
            >{locale.t("ui.news-grid.news")}</DemoActionLink
          >
        </div>
        <h3 class="my-3 neutral-1000"
          >{locale.t("ui.news-grid.inside-trending")}</h3
        >
      </div>
    {/if}
    {#if desktop.current}
      <header class="karento-news-banner desktop-page-hero">
        <DesktopDiscoveryHero
          embedded
          image={newsDiscoveryImage}
          title={locale.t("ui.news-grid.news")}
          titleId="news-title"
          searchLabel={locale.t("editorial.search.articles")}
          placeholder={locale.t("editorial.search.articlePlaceholder")}
          bind:query
          filters={[
            { id: "", label: locale.t("ui.desktop-services.all") },
            ...availableCategories.map((category) => ({
              id: category.id,
              label: locale.text(category.label),
            })),
          ]}
          selected={selectedCategory}
          filtersLabel={locale.t("ui.news-grid.news-categories")}
          onselect={(id) => (selectedCategory = id)}
          onsubmit={submitSearch}
          searchInputId="news-search"
        />
        <DesktopHeroBreadcrumb label={locale.t("ui.news-grid.news")} />
      </header>
    {:else}
      <NewsHero />
    {/if}
    {#if desktop.current}
      <div class="desktop-hero-content">
        <div
          class="desktop-content-toolbar"
          id="news-results"
          role="region"
          aria-labelledby="news-results-title"
          tabindex="-1"
        >
          <div class="desktop-news-toolbar">
            <h2
              class="neutral-1000 desktop-type-collection"
              id="news-results-title">{locale.t("ui.news-grid.latest-news")}</h2
            >
            <div
              class="desktop-news-results"
              aria-live="polite"
              aria-atomic="true"
            >
              <p class="text-sm-medium neutral-500 desktop-type-meta"
                >{locale.count(filteredNews.length, "articles")}</p
              >
              {#if query || selectedCategory}<button
                  class="desktop-type-pill"
                  type="button"
                  onclick={clearFilters}
                  >{locale.t("ui.desktop-services.clear-filters")}</button
                >{/if}
            </div>
          </div>
        </div>
      </div>
    {:else if phone.current}
      <div class="mobile-news-category-controls">
        <MobilePillRail
          class="mobile-news-categories"
          label={locale.t("ui.news-grid.news-categories")}
        >
          <MobilePill
            label={locale.t("ui.desktop-services.all")}
            selected={!selectedCategory}
            pressed={!selectedCategory}
            onclick={clearFilters}
          />
          {#each availableCategories as category (category.id)}
            <MobilePill
              label={locale.text(category.label)}
              selected={selectedCategory === category.id}
              pressed={selectedCategory === category.id}
              onclick={() => {
                query = "";
                selectedCategory = category.id;
              }}
            />
          {/each}
        </MobilePillRail>
      </div>
    {:else}
      <div
        class="d-flex flex-wrap align-items-center justify-content-center gap-3 pt-55 pb-60"
      >
        <span class="text-md-bold neutral-1000">
          {locale.t("ui.news-grid.category")}
        </span>
        <DemoActionLink
          href="#!"
          class="btn btn-white px-3 py-2"
          aria-label={locale.t("ui.news-grid.industry-news")}
          >{locale.t("ui.news-grid.industry-news")}</DemoActionLink
        >
        <DemoActionLink
          href="#!"
          class="btn btn-white px-3 py-2"
          aria-label={locale.t("ui.news-grid.rental-advice")}
          >{locale.t("ui.news-grid.rental-advice")}</DemoActionLink
        >
        <DemoActionLink
          href="#!"
          class="btn btn-white px-3 py-2"
          aria-label={locale.t("ui.news-grid.road-trips")}
          >{locale.t("ui.news-grid.road-trips")}</DemoActionLink
        >
        <DemoActionLink
          href="#!"
          class="btn btn-white px-3 py-2"
          aria-label={locale.t("ui.news-grid.car-review")}
          >{locale.t("ui.news-grid.car-review")}</DemoActionLink
        >
        <DemoActionLink
          href="#!"
          class="btn btn-white px-3 py-2"
          aria-label={locale.t("ui.news-grid.travel-tips")}
          >{locale.t("ui.news-grid.travel-tips")}</DemoActionLink
        >
        <DemoActionLink
          href="#!"
          class="btn btn-white px-3 py-2"
          aria-label={locale.t("ui.news-grid.customer-stories")}
          >{locale.t("ui.news-grid.customer-stories")}</DemoActionLink
        >
      </div>
    {/if}
    {#if !desktop.current}<h3 class="text-center mb-65 neutral-1000"
        >{locale.t("ui.news-grid.latest-news")}</h3
      >{/if}
    {#if phone.current}
      <p class="mobile-result-count" aria-live="polite" aria-atomic="true"
        >{locale.count(visibleNews.length, "articles")}</p
      >
    {/if}
    <div class="row karento-news-cards">
      {#each visibleNews as item (item.id)}<NewsGridCard {item} />
      {/each}
    </div>
    {#if desktop.current && filteredNews.length === 0}
      <div class="desktop-news-empty">
        <h3 class="neutral-1000 desktop-type-card"
          >{locale.t("editorial.search.emptyTitle")}</h3
        >
        <p class="neutral-500 desktop-type-body"
          >{locale.t("editorial.search.emptyBody")}</p
        >
        <button
          class="btn btn-white desktop-type-pill"
          type="button"
          onclick={clearFilters}
          >{locale.t("ui.desktop-services.clear-filters")}</button
        >
      </div>
    {:else if phone.current && visibleNews.length === 0}
      <div class="mobile-empty-results">
        <h3>{locale.t("editorial.search.emptyTitle")}</h3>
        <p class="neutral-500">{locale.t("editorial.search.emptyBody")}</p>
        <MobilePill
          label={locale.t("ui.desktop-services.clear-filters")}
          variant="secondary"
          onclick={clearFilters}
        />
      </div>
    {/if}
    {#if !desktop.current}
      <div class="d-flex justify-content-center">
        {#snippet newsPaginationControls(
          getFeedbackContainer: FeedbackContainerGetter | undefined,
        )}
          <nav
            aria-label={locale.t("ui.news-grid.page-navigation-example")}
            class="karento-news-pagination"
            {@attach focusableScroll}
          >
            <ul class="pagination">
              <li class="page-item">
                <DemoActionLink
                  class="page-link"
                  href="#!"
                  aria-label={locale.t("ui.news-grid.previous")}
                  {getFeedbackContainer}
                >
                  <span aria-hidden="true">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M6.00016 1.33325L1.3335 5.99992M1.3335 5.99992L6.00016 10.6666M1.3335 5.99992H10.6668"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </span>
                </DemoActionLink>
              </li>
              <li class="page-item"
                ><DemoActionLink
                  class="page-link"
                  href="#!"
                  aria-label="1"
                  {getFeedbackContainer}>1</DemoActionLink
                ></li
              >
              <li class="page-item"
                ><DemoActionLink
                  class="page-link"
                  href="#!"
                  aria-label="2"
                  {getFeedbackContainer}>2</DemoActionLink
                ></li
              >
              <li class="page-item"
                ><DemoActionLink
                  class="page-link"
                  href="#!"
                  aria-label="3"
                  {getFeedbackContainer}>3</DemoActionLink
                ></li
              >
              <li class="page-item"
                ><DemoActionLink
                  class="page-link"
                  href="#!"
                  aria-label="4"
                  {getFeedbackContainer}>4</DemoActionLink
                ></li
              >
              <li class="page-item"
                ><DemoActionLink
                  class="page-link"
                  href="#!"
                  aria-label="5"
                  {getFeedbackContainer}>5</DemoActionLink
                ></li
              >
              <li class="page-item"
                ><DemoActionLink
                  class="page-link"
                  href="#!"
                  aria-label="..."
                  {getFeedbackContainer}>...</DemoActionLink
                ></li
              >
              <li class="page-item">
                <DemoActionLink
                  class="page-link active"
                  href="#!"
                  aria-label={locale.t("ui.news-grid.next")}
                  {getFeedbackContainer}
                >
                  <span aria-hidden="true">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        d="M5.99967 10.6666L10.6663 5.99992L5.99968 1.33325M10.6663 5.99992L1.33301 5.99992"
                        stroke=""
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </svg>
                  </span>
                </DemoActionLink>
              </li>
            </ul>
          </nav>
        {/snippet}
        <MobilePreviewControls
          enabled={phone.current}
          class="mobile-news-pagination-controls"
          children={newsPaginationControls}
        />
      </div>
    {/if}
    <SubscriberBanner spacing="pt-85" />
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .karento-news-banner {
      position: relative;
    }
    .desktop-news-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--karento-desktop-grid-gap);
    }
    .desktop-news-toolbar h2 {
      margin: 0;
    }
    .desktop-news-results button:focus-visible,
    .desktop-news-empty button:focus-visible {
      outline: 2px solid var(--bs-neutral-1000);
      outline-offset: 3px;
    }
    #news-results {
      scroll-margin-top: calc(
        var(--karento-desktop-space-16) + var(--karento-desktop-space-8)
      );
    }
    #news-results:focus {
      outline: none;
    }
    .desktop-news-results {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--karento-desktop-card-gap);
      min-height: var(--karento-desktop-pill-height);
      margin: 0;
    }
    .desktop-news-results p {
      margin: 0;
    }
    .desktop-news-results button {
      min-height: var(--karento-desktop-pill-height);
      padding: var(--karento-desktop-space-2) var(--karento-desktop-space-4);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-pill-radius);
      background: var(--bs-neutral-100);
      color: var(--bs-neutral-1000);
    }
    .karento-news-cards {
      row-gap: var(--karento-desktop-grid-gap);
    }
    .desktop-news-empty {
      padding: var(--karento-desktop-space-12) var(--karento-desktop-space-6);
      border: 1px solid var(--bs-border-color);
      border-radius: var(--karento-desktop-card-radius);
      text-align: center;
    }
    .desktop-news-empty h3 {
      margin-bottom: var(--karento-desktop-space-3);
    }
    .desktop-news-empty p {
      margin-bottom: var(--karento-desktop-space-5);
    }
    .desktop-news-empty button {
      min-height: var(--karento-desktop-pill-height);
      padding: var(--karento-desktop-space-2) var(--karento-desktop-space-4);
      border-radius: var(--karento-desktop-pill-radius);
    }
  }
</style>
