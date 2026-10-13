<svelte:options preserveWhitespace={true} runes={true} />

<script lang="ts">
  import { useLocale } from "#lib/i18n/context.svelte.ts";
  const locale = useLocale();
  import DemoActionLink from "#lib/components/DemoActionLink.svelte";
  import SubscriberBanner from "#lib/components/editorial/SubscriberBanner.svelte";

  import NewsSidebar from "#lib/components/editorial/NewsSidebar.svelte";

  import NewsListCard from "#lib/components/editorial/NewsListCard.svelte";
  import { newsList } from "#lib/data/editorial.ts";
  import { MediaQuery } from "svelte/reactivity";
  const desktop = new MediaQuery("(min-width: 992px)");
</script>

<section class="box-section background-body">
  <div class="container">
    <div class="section-box background-body py-96 desktop-collection-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8">
            <h2 class="neutral-1000 desktop-type-collection"
              >{locale.t("ui.news-list.recent-posts")}</h2
            >
            <p class="text-xl-medium neutral-500 desktop-type-lead"
              >{locale.t(
                desktop.current
                  ? "editorial.list.sampleSummary"
                  : "ui.news-list.favorite-vehicles-based-on-customer-reviews",
              )}</p
            >
            <div class="box-grid-hotels box-grid-news mt-60 mb-50">
              {#each newsList as item (item.id)}<NewsListCard {item} />
              {/each}
            </div>
            <nav aria-label={locale.t("ui.news-list.page-navigation-example")}>
              <ul class="pagination">
                <li class="page-item">
                  <DemoActionLink
                    class="desktop-type-pill page-link"
                    href="#!"
                    aria-label={locale.t("ui.news-list.previous")}
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
                    class="desktop-type-pill page-link"
                    href="#!"
                    aria-label="1">1</DemoActionLink
                  ></li
                >
                <li class="page-item"
                  ><DemoActionLink
                    class="desktop-type-pill page-link active"
                    href="#!"
                    aria-label="2">2</DemoActionLink
                  ></li
                >
                <li class="page-item"
                  ><DemoActionLink
                    class="desktop-type-pill page-link"
                    href="#!"
                    aria-label="3">3</DemoActionLink
                  ></li
                >
                <li class="page-item"
                  ><DemoActionLink
                    class="desktop-type-pill page-link"
                    href="#!"
                    aria-label="4">4</DemoActionLink
                  ></li
                >
                <li class="page-item"
                  ><DemoActionLink
                    class="desktop-type-pill page-link"
                    href="#!"
                    aria-label="5">5</DemoActionLink
                  ></li
                >
                <li class="page-item"
                  ><DemoActionLink
                    class="desktop-type-pill page-link"
                    href="#!"
                    aria-label="...">...</DemoActionLink
                  ></li
                >
                <li class="page-item">
                  <DemoActionLink
                    class="desktop-type-pill page-link"
                    href="#!"
                    aria-label={locale.t("ui.news-list.next")}
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
          </div>
          <NewsSidebar />
        </div>
      </div>
    </div>
    <SubscriberBanner spacing="" />
  </div>
</section>

<style>
  @media (min-width: 992px) {
    .box-grid-news {
      margin-top: var(--karento-desktop-heading-gap);
    }
  }
</style>
