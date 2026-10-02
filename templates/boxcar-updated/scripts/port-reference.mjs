// Build-time port of the captured public demo into compiled Svelte markup.
// Svelte owns the pages and controls; the original slider core is a compatibility dependency.
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { load } from "cheerio";
import ts from "typescript";
import { compile } from "svelte/compiler";
import postcss from "postcss";

const base = "https://creativelayers.net/themes/boxcar-html/";
const capture = path.resolve("../../runtime/boxcar-updated-reference");
const manifestPath = ".template/assets.json";
const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const assets = new Map(manifest.assets.map((a) => [a.local, a]));
const downloaded = new Map();
const missingBackgrounds =
  JSON.parse(await fs.readFile(".template/port.json", "utf8").catch(() => "{}"))
    .missingBackgrounds || [];
const googleAgent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const siteURL = (value) => new URL(value, base);
function localAsset(url) {
  if (url.href.startsWith(base)) {
    const suffix = url.pathname.slice(new URL(base).pathname.length);
    return suffix.startsWith("images/")
      ? "public/media/" + suffix.slice(7)
      : "public/reference/" + suffix;
  }
  if (url.hostname === "fonts.gstatic.com")
    return "public/reference/fonts/" + path.basename(url.pathname);
  if (url.hostname === "fonts.googleapis.com")
    return "public/reference/css/dm-sans.css";
  throw Error("Unexpected asset origin: " + url.href);
}
async function asset(url, optionalBackground = false) {
  const local = localAsset(url);
  if (downloaded.has(local)) return downloaded.get(local);
  downloaded.set(local, "/" + local.slice(7));
  let bytes;
  const prior = assets.get(local);
  if (
    prior?.source === url.href &&
    !url.pathname.endsWith(".css") &&
    url.hostname !== "fonts.googleapis.com"
  )
    bytes = await fs.readFile(local).catch(() => undefined);
  if (!bytes) {
    const response = await fetch(url, {
      headers: { "User-Agent": googleAgent },
    });
    if (!response.ok) {
      if (optionalBackground && response.status === 404) {
        missingBackgrounds.push(url.href);
        const blank =
          "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22/%3E";
        downloaded.set(local, blank);
        return blank;
      }
      throw Error(url.href + ": " + response.status);
    }
    bytes = Buffer.from(await response.arrayBuffer());
    if (/<html|<!doctype html/i.test(bytes.subarray(0, 300).toString()))
      throw Error("Asset returned HTML: " + url.href);
  }
  const sourceSHA256 = hash(bytes);
  if (
    url.pathname.endsWith(".css") ||
    url.hostname === "fonts.googleapis.com"
  ) {
    // Keep source layout rules; localize assets and retain custom-control label styling.
    let css = bytes.toString().replaceAll("\r\n", "\n");
    // The live demo's optional Slick loader/font URLs return 404. Boxcar's
    // visible arrows use Font Awesome; neither unused dependency is required.
    if (url.pathname.endsWith("/slick-theme.css"))
      css = css
        .replace(/@font-face\s*\{[^}]*\}/g, "")
        .replace(/url\(['"]?\.?\/?ajax-loader\.gif['"]?\)/g, "none");
    if (url.pathname.endsWith("/owl.css"))
      css = css.replace(/url\(['"]?owl\.video\.play\.png['"]?\)/g, "none");
    if (url.pathname.endsWith("/style.css")) {
      const rules = postcss.parse(css);
      rules.walkRules((rule) => {
        rule.selector = rule.selector
          .replace(
            /(^|[\s>+~,])span(?=[\s>+~,.#:[\]]|$)/g,
            "$1span:where(:not(.reference-label))",
          )
          .replace(
            /(^|[\s>+~,])label(?=[\s>+~,.#:[\]]|$)/g,
            "$1:is(label, span:where(.reference-label))",
          );
      });
      css = rules.toString();
    }
    const references = [
      ...css.matchAll(
        /(?:url\(\s*['"]?([^'"\)]+)['"]?\s*\)|@import\s+['"]([^'"]+)['"])/g,
      ),
    ];
    for (const ref of references) {
      const value = (ref[1] || ref[2]).trim();
      if (!value || value.startsWith("data:") || value.startsWith("#"))
        continue;
      const next = new URL(value, url);
      const pathname = await asset(
        next,
        /\.(png|jpg|jpeg|gif|webp)$/.test(next.pathname),
      );
      css = css.replaceAll(value, pathname);
    }
    bytes = Buffer.from(css.replace(/[\t ]+$/gm, ""));
  }
  await fs.mkdir(path.dirname(local), { recursive: true });
  await fs.writeFile(local, bytes);
  assets.set(local, {
    source: url.href,
    local,
    bytes: bytes.length,
    sha256: hash(bytes),
    ...(sourceSHA256 !== hash(bytes)
      ? {
          sourceSHA256,
          transformation:
            "Local URLs and LF whitespace; unused missing Slick/Owl assets removed; custom-control label selectors preserve source specificity and appearance.",
        }
      : {}),
  });
  return "/" + local.slice(7);
}

const files = Array.from({ length: 10 }, (_, i) =>
  i ? `index-${i + 1}.html` : "index.html",
);
for (const name of [
  "bootstrap.min.css",
  "slick-theme.css",
  "slick.css",
  "mmenu.css",
  "style.css",
]) {
  const local = "public/reference/css/" + name;
  if (process.argv.includes("--refresh-assets") || !assets.has(local))
    await asset(siteURL("css/" + name));
}

// Read the public demo's options as syntax data, never execute its JS.
const vendor = await fs.readFile(path.join(capture, "slick.min.js"), "utf8");
const ast = ts.createSourceFile(
  "reference.js",
  vendor,
  ts.ScriptTarget.Latest,
  true,
);
await asset(siteURL("js/jquery.js"));
const sliderCore = Buffer.from(ast.statements[0].getText(ast) + "\n");
const sliderPath = "public/reference/js/slick-core.js";
await fs.mkdir(path.dirname(sliderPath), { recursive: true });
await fs.writeFile(sliderPath, sliderCore);
assets.set(sliderPath, {
  source: base + "js/slick.min.js",
  local: sliderPath,
  bytes: sliderCore.length,
  sha256: hash(sliderCore),
  sourceSHA256: hash(vendor),
  transformation:
    "Original Slick core UMD statement; demo auto-initialization replaced by the Svelte lifecycle action.",
});
function literal(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node))
    return ts.isNumericLiteral(node) ? Number(node.text) : node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties
        .filter(ts.isPropertyAssignment)
        .map((p) => [
          p.name.getText(ast).replace(/^['"]|['"]$/g, ""),
          literal(p.initializer),
        ]),
    );
  return undefined;
}
const configs = [];
function visit(node) {
  if (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    node.expression.name.text === "slick" &&
    ts.isObjectLiteralExpression(node.arguments[0])
  ) {
    let target = node.expression.expression;
    while (
      ts.isCallExpression(target) &&
      ts.isPropertyAccessExpression(target.expression)
    )
      target = target.expression.expression;
    const selector =
      ts.isCallExpression(target) && ts.isStringLiteral(target.arguments[0])
        ? target.arguments[0].text
        : undefined;
    if (selector) configs.push({ selector, ...literal(node.arguments[0]) });
  }
  ts.forEachChild(node, visit);
}
visit(ast);
await fs.mkdir("src/reference", { recursive: true });
await fs.writeFile(
  "src/reference/carousels.json",
  JSON.stringify(configs, null, 2) + "\n",
);

const aliases = {
  "contact.html": "/contact/",
  "about.html": "/about/",
  "loan-calculator.html": "/calculator/",
  "faq.html": "/faq/",
  "compare.html": "/compare/",
  "blog-list-01.html": "/blog/",
  "blog-list-02.html": "/blog/",
  "blog-list-03.html": "/blog/",
  "blog-single.html": "/blog/choosing-your-next-car/",
  "add-listings.html": "/sell/",
  "login.html": "#account-preview",
  "register.html": "#account-preview",
  "shop-list.html": "/inventory/",
  "shop-single.html": "/inventory/",
  "shop-cart.html": "/compare/",
  "shop-checkout.html": "/sell/",
  "terms.html": "/terms/",
};
function href(value) {
  if (!value || value.startsWith("#")) return value;
  const url = new URL(value, base);
  const name = path.basename(url.pathname);
  if (url.href.startsWith(base)) {
    const home = files.indexOf(name);
    if (home >= 0) return home ? `/home-${home + 1}/` : "/";
    if (name.startsWith("inventory"))
      return name.includes("single")
        ? "/vehicle/mercedes-e-class/"
        : "/inventory/";
    if (aliases[name]) return aliases[name];
    // Preserve the demo label but keep unsupported demo navigation local.
    return "/about/";
  }
  return value;
}
const receipts = [];
for (let n = 1; n <= 10; n++) {
  const html = await fs.readFile(path.join(capture, files[n - 1]), "utf8");
  const $ = load(html);
  $("script, style").remove();
  $("*")
    .contents()
    .each((_, node) => {
      if (node.type === "comment") $(node).remove();
    });
  const root = $(".boxcar-wrapper");
  // Event/ARIA attributes do not change the original visual DOM contract.
  root.attr("use:referencePage", "");
  root.addClass("reference-home");
  root.attr("data-reference-home", n);
  root.attr("data-home", n);
  $("img").each((_, el) => {
    if (!$(el).attr("alt")) $(el).attr("alt", "");
  });
  $("input,textarea,select").each((_, el) => {
    const item = $(el);
    if (item.attr("type") !== "hidden")
      item.attr(
        "aria-label",
        item.attr("placeholder") || item.attr("name") || "Search filter",
      );
    if (item.attr("tabindex") === "2") item.removeAttr("tabindex");
  });
  $("a").each((_, el) => {
    const item = $(el);
    let target = href(item.attr("href"));
    const text = item.text().trim();
    if (!target || target === "#" || target.startsWith("javascript:")) {
      const body = [
        "SUV",
        "Sedan",
        "Hatchback",
        "Coupe",
        "Hybrid",
        "Convertible",
        "Wagon",
        "Minivan",
        "Truck",
        "Sport Coupe",
      ].find((t) => text === t);
      target = body
        ? "/inventory/?body=" + encodeURIComponent(body)
        : /Add Listing/i.test(text)
          ? "/sell/"
          : /Terms|Privacy/.test(text)
            ? "/terms/"
            : /Contact|phone|Location/.test(text) || item.hasClass("phone")
              ? "/contact/"
              : /More Info|Learn More|View Details/.test(text)
                ? "/vehicle/" +
                  (n === 4 ? "volvo-xc90-recharge" : "mercedes-e-class") +
                  "/"
                : item.hasClass("icon-box")
                  ? "/favorites/"
                  : item.closest(".nav-sub").length
                    ? "#dashboard-menu"
                    : "/inventory/";
    }
    if (item.closest("footer").length) {
      if (/About|Careers|Team/.test(text)) target = "/about/";
      else if (text === "Blog") target = "/blog/";
      else if (/Contact/.test(text)) target = "/contact/";
      else if (/FAQ/.test(text)) target = "/faq/";
      else if (item.closest(".social-icons").length) target = "#social-preview";
      else if (item.hasClass("store")) target = "#app-preview";
    }
    item.attr("href", target);
    if (!text)
      item.attr(
        "aria-label",
        item.find("img").length
          ? "Boxcars home"
          : item.hasClass("icon-box")
            ? "Save car"
            : "Open",
      );
  });
  $(".mobile-navigation a").attr("aria-label", "Open menu");
  $("button").each((_, el) => {
    const item = $(el);
    if (!item.text().trim()) item.attr("aria-label", "Open");
  });
  $("[data-tab]")
    .attr("role", "tab")
    .attr("tabindex", "0")
    .attr("aria-selected", "false");
  $(".form-tabs-list").attr("role", "tablist");
  $(".form-tabs-list .current").attr("aria-selected", "true");
  $(".drop-menu .select")
    .attr("role", "button")
    .attr("tabindex", "0")
    .attr("aria-expanded", "false");
  $(".drop-menu .dropdown li")
    .attr("role", "option")
    .attr("tabindex", "0")
    .attr("aria-selected", "false");
  $(".drop-menu .dropdown").attr("role", "listbox");
  $(".current-dropdown > span")
    .attr("role", "button")
    .attr("tabindex", "0")
    .attr("aria-expanded", "false");
  $(".drop-menu > label").each((_, el) => {
    const item = $(el);
    item.replaceWith(
      '<span class="reference-label">' + item.html() + "</span>",
    );
  });
  $("label").each((i, el) => {
    const label = $(el),
      field = label
        .closest(".form_boxes")
        .find("input:not([type=hidden]),select,textarea")
        .first();
    if (field.length) {
      const id = `reference-${n}-field-${i}`;
      field.attr("id", id).attr("aria-label", label.text().trim());
      label.attr("for", id);
    } else if (!label.attr("for") && !label.find("input").length) {
      label.replaceWith(
        '<span class="reference-label">' + label.html() + "</span>",
      );
    }
  });
  // Sample contact destinations must never reach an unrelated dealer.
  $('a[href^="tel:"],a[href^="mailto:"]').attr("href", "/contact/");
  $(".show-search").removeAttr("required").removeAttr("aria-required");
  for (const el of $("[src]:not(iframe)").toArray()) {
    const value = $(el).attr("src");
    if (value) $(el).attr("src", await asset(siteURL(value)));
  }
  $("iframe")
    .attr("title", "Illustrative demo location")
    .attr("loading", "lazy");
  for (const el of $("[style]").toArray()) {
    let style = $(el).attr("style");
    for (const m of style.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))
      style = style.replaceAll(m[1], await asset(siteURL(m[1])));
    $(el).attr("style", style);
  }
  $("a[data-fancybox],a.play-now")
    .attr("href", "#demo-video")
    .attr("data-preview-video", "");
  $(".form-submit button").each((_, el) => {
    $(el).removeAttr("formaction");
  });
  $("form button[type=button]")
    .filter((_, el) => !$(el).attr("data-bs-toggle"))
    .attr("type", "submit");
  $(".count-text[data-stop]").each((_, el) =>
    $(el).text($(el).attr("data-stop")),
  );
  // Keep source SVGs including clip paths. Svelte must treat literal braces as text.
  let markup =
    root.prop("outerHTML") + "\n" + $(".scroll-to-top").prop("outerHTML");
  markup = markup
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;")
    .replaceAll('use:referencepage=""', "use:referencePage")
    .replaceAll('use:referencePage=""', "use:referencePage");
  markup = markup
    .replace(
      /\b(required|checked|disabled|multiple|autofocus|readonly|autoplay|loop|muted)="[^"]*"/g,
      "$1",
    )
    .replaceAll("viewbox=", "viewBox=")
    .replaceAll("<clippath", "<clipPath")
    .replaceAll("</clippath", "</clipPath");
  const source = `<svelte:options preserveWhitespace={true} />\n<script lang="ts">\n  import { referencePage } from './interactions';\n</script>\n\n${markup}\n`;
  const compiled = compile(source, {
    filename: `Home${n}.svelte`,
    generate: false,
  });
  const codes = [...new Set(compiled.warnings.map((w) => w.code))];
  await fs.writeFile(`src/reference/Home${n}.svelte`, source);
  receipts.push({
    home: n,
    source: base + files[n - 1],
    sourceSHA256: hash(html),
    svelteSHA256: hash(source),
    warnings: codes,
    sections: root.find("section").length,
  });
}
manifest.assets = [...assets.values()];
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
await fs.writeFile(
  ".template/port.json",
  JSON.stringify(
    {
      captured: "2026-10-02",
      method:
        "Compiled Svelte preserves public HTML DOM, whitespace, SVGs and styles. Native controls and a Svelte lifecycle bridge to the original Slick core supply behavior.",
      missingBackgrounds,
      pages: receipts,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    { assets: assets.size, carousels: configs.length, pages: receipts },
    null,
    2,
  ),
);
