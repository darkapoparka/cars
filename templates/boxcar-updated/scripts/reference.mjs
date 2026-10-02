// Public HTML is design evidence, never injected into the Svelte application.
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { load } from "cheerio";
const base = "https://creativelayers.net/themes/boxcar-html/";
const out = path.resolve("../../runtime/boxcar-updated-reference");
await fs.mkdir(out, { recursive: true });
const summary = [];
for (let home = 1; home <= 10; home++) {
  const file = home === 1 ? "index.html" : `index-${home}.html`;
  const response = await fetch(new URL(file, base));
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
  const html = await response.text();
  await fs.writeFile(path.join(out, file), html);
  const $ = load(html);
  const sections = $("section")
    .map((_, el) => ({
      class: $(el).attr("class"),
      headings: $(el)
        .find("h1,h2,h3")
        .map((_, h) => $(h).text().replace(/\s+/g, " ").trim())
        .get()
        .slice(0, 10),
      images: [
        ...new Set(
          $(el)
            .find("img")
            .map((_, img) => $(img).attr("src"))
            .get(),
        ),
      ].slice(0, 12),
      background: $(el).attr("style"),
    }))
    .get();
  summary.push({
    home,
    file,
    source: new URL(file, base).href,
    sha256: createHash("sha256").update(html).digest("hex"),
    styles: $("link[rel=stylesheet]")
      .map((_, el) => $(el).attr("href"))
      .get(),
    sections,
    links: [
      ...new Set(
        $("a[href]")
          .map((_, el) => $(el).attr("href"))
          .get(),
      ),
    ].filter((x) => /inventory|contact|about|loan|compare/.test(x)),
  });
  console.log(JSON.stringify({ home, sections }));
}
await fs.writeFile(
  path.join(out, "summary.json"),
  JSON.stringify(summary, null, 2),
);
const css = await fetch(new URL("css/style.css", base)).then((r) => r.text());
await fs.writeFile(path.join(out, "style.css"), css);
console.log(
  JSON.stringify({
    output: out,
    bytes: css.length,
    styles: summary[0].styles,
    links: summary[0].links,
  }),
);
