// Assemble the dealer homepage from the preserved Boxcar DOM. The ten source
// homes remain untouched; this only writes the separately curated components.
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import { compile } from "svelte/compiler";

const sources = new Map();
async function home(n) {
  const source = await fs.readFile(`src/reference/Home${n}.svelte`, "utf8");
  sources.set(n, createHash("sha256").update(source).digest("hex"));
  return load(source.slice(source.indexOf('<div class="boxcar-wrapper')));
}
const ten = await home(10),
  five = await home(5),
  eight = await home(8);
const arrow = eight(".car-block-ten .details svg").first().clone();
arrow.find("defs").remove();
arrow.find("g").removeAttr("clip-path");
arrow.find("path").attr("fill", "currentColor");
const arrowHTML = arrow.prop("outerHTML");
const dynamic = (html) =>
  html
    .replaceAll("__LOGO__", "{brand.logoDark}")
    .replaceAll("__NAME__", "{brand.name}")
    .replaceAll("__TAGLINE__", "{brand.tagline}")
    .replaceAll("__HOURS__", "{brand.hours}")
    .replaceAll("__LOCATION__", "{brand.location}")
    .replaceAll("__EMAIL__", "{brand.contactEmail}");
const outer = ($, el) => $(el).prop("outerHTML");

const header = ten("header").clone();
header
  .find(".navigation")
  .html(
    `<li class="current"><a href="/" aria-current="page">Home</a></li><li><a href="/inventory/">Cars</a></li><li><a href="/about/">About us</a></li><li><a href="/contact/">Contact</a></li>`,
  );
header.find("nav").attr("aria-label", "Main navigation");
header.find(".logo a").attr("href", "/").attr("aria-label", "__NAME__ home");
header
  .find(".logo img")
  .attr("src", "__LOGO__")
  .attr("alt", "__NAME__")
  .attr("title", "__NAME__");
header
  .find(".box-account")
  .attr("href", "/favorites/")
  .attr("aria-label", "Saved cars")
  .html('<i class="far fa-bookmark" aria-hidden="true"></i> Saved');
header.find(".header-btn-two").attr("href", "/contact/").text("Contact us");
header.find(".search-popup").remove();
// Keep one source-shaped row for the header action to clone, with real catalogue
// bindings instead of the demo's repeated placeholder. Initialization fills six.
header.find(".box-car-search li").slice(1).remove();
header.find(".car-search-item").attr("href", "/vehicle/{vehicles[0].slug}/");
header
  .find(".box-car-search img")
  .attr("src", "{vehicles[0].image}")
  .attr("alt", "{vehicles[0].title}");
header.find(".box-car-search .name").text("{vehicles[0].title}");
header.find(".box-car-search .price").text("{money(vehicles[0].price)}");
header
  .find(".btn-view-search")
  .attr("href", "/inventory/")
  .html(`View all cars ${arrowHTML}`);
header
  .find(".show-search")
  .attr("placeholder", "Search cars…")
  .attr("aria-label", "Search cars");

const hero = ten(".boxcar-banner-section-seven").clone();
hero.addClass("curated-banner");
hero.find(".banner-slider-v7").attr("data-static-hero", "");
hero.find(".banner-slider-v7 > .inner-box").slice(1).remove();
hero
  .find("[data-animation-in],[data-delay-in]")
  .removeAttr("data-animation-in")
  .removeAttr("data-delay-in");
hero.find(".sub-title").text("Explore new and used cars, all in one place.");
hero.find("h1").text("Find Your Perfect Car");
hero
  .find(".banner-slide > img")
  .attr("fetchpriority", "high")
  .attr("width", "1800")
  .attr("height", "700");
const search = five(".form-tab-pane").first().clone();
search.removeAttr("id");
search.find("form").attr("aria-label", "Find your next car");
search.find("input[type=hidden]").remove();
const condition = search.find(".drop-menu").first();
condition.find(".select > span").text("All Cars");
condition
  .find(".dropdown")
  .html(
    ["All Cars", "New Cars", "Used Cars"]
      .map(
        (value) =>
          `<li role="option" tabindex="0" aria-selected="${value === "All Cars"}">${value}</li>`,
      )
      .join(""),
  );
search
  .find(".select")
  .each((i, el) =>
    five(el).attr(
      "aria-label",
      ["Car condition", "Make", "Model", "Maximum price"][i],
    ),
  );
search
  .find(".form-submit button")
  .removeAttr("aria-label")
  .html('<i class="flaticon-search" aria-hidden="true"></i>Search cars');
hero.find(".cus-container10").empty().append(search);

const types = eight(".boxcar-brand-section-six").clone();
types.addClass("curated-types");
types.find(".boxcar-title h2").text("A Car For Every Lifestyle");
types.find(".btn-title").remove();
types.find(".cars-block-six").each((_, el) => {
  const card = eight(el),
    name = card.find("h6").text().trim();
  if (
    !["SUV", "Sedan", "Hatchback", "Coupe", "Hybrid", "Convertible"].includes(
      name,
    )
  ) {
    card.remove();
    return;
  }
  card
    .find("a")
    .attr("href", `/inventory/?${name === "Hybrid" ? "fuel" : "body"}=${name}`)
    .attr("aria-label", `Browse ${name} cars`);
});

const brands = eight(".boxcar-brand-section-five").clone();
brands.addClass("curated-brands");
brands.find(".boxcar-title h2").text("Explore Our Brands");
brands.find(".btn-title").remove();
brands.find(".cars-block-five").each((_, el) => {
  const card = eight(el),
    name = card.find("h6").text().trim();
  const make = name === "Mercedes Benz" ? "Mercedes-Benz" : name;
  if (!["Audi", "BMW", "Mercedes-Benz", "Bentley", "Nissan"].includes(make)) {
    card.remove();
    return;
  }
  card.find("h6 a").text(make);
  card
    .find("a")
    .attr("href", "/inventory/?make=" + encodeURIComponent(make))
    .attr("aria-label", `Browse ${make} cars`);
  card.find("img").attr("alt", make).attr("loading", "lazy");
});

const benefits = five(".why-choose-us-section-three").clone();
benefits.addClass("curated-benefits");
benefits.find("h2").text("A Better Way To Find Your Next Car");
const benefitsCopy = [
  [
    "Plan Your Budget",
    "Explore prices and use the repayment calculator to work through your options.",
  ],
  [
    "Find Your Fit",
    "Search by make, model and price to find a car that suits your everyday life.",
  ],
  [
    "Compare The Details",
    "Save your favourites and compare the specifications side by side.",
  ],
  [
    "Talk It Through",
    "Ask questions about the car and arrange a viewing with the showroom.",
  ],
];
benefits.find(".choose-us-block").each((i, el) => {
  eight(el).find(".title").text(benefitsCopy[i][0]);
  eight(el).find(".text").text(benefitsCopy[i][1]);
});

const steps = eight(".boxcar-testimonial-section-four").clone();
steps.addClass("curated-next-steps");
steps.find(".boxcar-title h2").text("Your Next Car, Made Simple");
steps
  .find(".boxcar-title .text")
  .text("From your first search to your next test drive.");
steps.find(".stories-slider").removeClass("stories-slider");
const stepCopy = [
  [
    "Find Your Favourite",
    "Explore the cars, compare the details and build a shortlist that works for you.",
    "/inventory/",
    "Browse cars",
  ],
  [
    "Ask Us Anything",
    "Want to know more about a car? Get in touch and talk through the details.",
    "/contact/",
    "Get in touch",
  ],
  [
    "See It For Yourself",
    "Arrange a viewing, take a closer look and decide whether it is the right fit.",
    "/contact/?intent=viewing",
    "Arrange a viewing",
  ],
];
steps.find(".testimonial-block-four").each((i, el) => {
  const card = eight(el);
  if (i >= 3) {
    card.remove();
    return;
  }
  card.find(".icon").html(`<span class="curated-step-number">0${i + 1}</span>`);
  card.find(".title").text(stepCopy[i][0]);
  card.find(".text").text(stepCopy[i][1]);
  card
    .find(".auther-info")
    .replaceWith(
      `<a class="curated-step-link" href="${stepCopy[i][2]}">${stepCopy[i][3]} ${arrowHTML}</a>`,
    );
});

const blog = eight(".blog-section").clone();
blog.addClass("curated-journal");
blog.find("h2").text("Advice For The Road Ahead");
const blogCard = blog.find(".blog-block").first().clone();
blogCard
  .find(".image a")
  .attr("href", "__ARTICLE_HREF__")
  .attr("aria-label", "__ARTICLE_TITLE__");
blogCard
  .find(".image img")
  .attr("src", "__ARTICLE_IMAGE__")
  .attr("alt", "")
  .attr("loading", "lazy");
blogCard.find(".date").text("__ARTICLE_CATEGORY__");
blogCard.find(".post-info").html("<li>Buying guide</li>");
blogCard
  .find(".title a")
  .attr("href", "__ARTICLE_HREF__")
  .text("__ARTICLE_TITLE__");
const blogMarkup = outer(eight, blogCard)
  .replaceAll("__ARTICLE_HREF__", "/blog/{article.slug}/")
  .replaceAll("__ARTICLE_TITLE__", "{article.title}")
  .replaceAll("__ARTICLE_IMAGE__", "{article.image}")
  .replaceAll("__ARTICLE_CATEGORY__", "{article.category}");
blog.find(".row").html("__BLOG_CARDS__");

const footer = eight("footer").clone();
footer.find(".widgets-section .row").first().html(`
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><a class="curated-footer-logo" href="/" aria-label="__NAME__ home"><img src="__LOGO__" alt="__NAME__" width="108" height="28"></a><div class="widget-content"><p class="text">__TAGLINE__</p><p class="text">__LOCATION__</p></div></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Find a car</h4><ul class="user-links style-two"><li><a href="/inventory/">Browse all cars</a></li><li><a href="/inventory/?condition=New">New cars</a></li><li><a href="/inventory/?condition=Used">Used cars</a></li><li><a href="/favorites/">Saved cars</a></li><li><a href="/compare/">Compare cars</a></li></ul></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Explore</h4><ul class="user-links style-two"><li><a href="/about/">About us</a></li><li><a href="/blog/">Buying advice</a></li><li><a href="/calculator/">Repayment calculator</a></li><li><a href="/faq/">Frequently asked questions</a></li></ul></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Visit the showroom</h4><div class="widget-content"><p class="text">__HOURS__</p><ul class="user-links style-two"><li><a href="/contact/">Get in touch</a></li><li><a href="/contact/?intent=viewing">Arrange a viewing</a></li></ul></div></div></div>`);
footer
  .find(".footer-bottom .inner-container")
  .html(
    '<div class="copyright-text">© 2026 __NAME__. All rights reserved.</div><ul class="footer-nav"><li><a href="/terms/">Terms &amp; privacy</a></li></ul>',
  );

const stock = `<section class="cars-section-ten v8 curated-stock" aria-labelledby="curated-stock-title"><div class="large-container"><div class="right-box"><div class="curated-stock-layout"><div class="boxcar-title text-center"><h2 id="curated-stock-title">Explore Our Latest Cars</h2><p class="curated-stock-note">{vehicles.length} sample vehicles to explore</p></div><CuratedStock /><div class="curated-stock-more"><a class="read-more" href="/inventory/">View all cars ${arrowHTML}</a></div></div></div></div></section>`;
let markup = `<div class="boxcar-wrapper cus-layout-home10 reference-home curated-home" data-reference-home="curated" data-curated-home use:referencePage>
${outer(ten, header)}
${outer(ten, hero)}
${outer(eight, types)}
${outer(eight, brands)}
${stock}
${outer(five, benefits)}
${outer(eight, steps)}
${outer(eight, blog).replace("__BLOG_CARDS__", `{#each articles as article}${blogMarkup}{/each}`)}
${outer(eight, footer)}
</div>`;
markup = dynamic(markup);
// Every inline SVG has its own clip-path ID in the composed document.
let id = 0;
markup = markup.replace(/<svg[\s\S]*?<\/svg>/g, (svg) => {
  const suffix = `-curated-${id++}`;
  return svg.replace(/(id="|url\(#)([^"\)]+)("|\))/g, "$1$2" + suffix + "$3");
});
const script = `<svelte:options preserveWhitespace={true} />\n<script lang="ts">\nimport {referencePage} from './interactions';\nimport {brand} from '../data/brand';\nimport {vehicles, money} from '../lib/catalog';\nimport {articles} from '../data/journal';\nimport CuratedStock from './CuratedStock.svelte';\n</script>\n`;
compile(script + markup, { filename: "CuratedHome.svelte", generate: false });
await fs.writeFile("src/reference/CuratedHome.svelte", script + markup + "\n");
await fs.writeFile(
  ".template/curated.json",
  JSON.stringify(
    {
      version: "2026.10.02-curated",
      defaultRoute: "/",
      preservedReferenceRoutes: Array.from(
        { length: 10 },
        (_, i) => `/home-${i + 1}/`,
      ),
      sources: [...sources].map(([home, sha256]) => ({
        home,
        svelteSHA256: sha256,
      })),
      composition: {
        header: "Home 10, simplified dealer navigation and shared identity",
        hero: "Home 10, single source photograph and centered Home 5 headline",
        search:
          "Home 5 white pill DOM, four working filters and visible search label",
        typesAndBrands: "Home 8, centered rows with catalogue destinations",
        inventory:
          "Home 8 boxed shelf and card DOM, shared catalogue and saved state",
        benefits: "Home 5 horizontal four-icon section",
        nextSteps:
          "Home 8 dark rounded card section, buyer steps instead of fixture reviews",
        journalAndFooter: "Home 8, shared articles and identity",
      },
      method:
        "Compose preserved source DOM as compiled Svelte; scoped responsive CSS and native controls. No changes to the ten source homepage components.",
    },
    null,
    2,
  ) + "\n",
);
console.log(
  "Composed curated homepage; the ten reference homes were not changed.",
);
