import { chromium, webkit } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
import { load } from "cheerio";
import sharp from "sharp";
import http from "node:http";
import assert from "node:assert/strict";
const base = process.env.BOXCAR_URL || "http://127.0.0.1:6455";
const capture = path.resolve("../../runtime/boxcar-updated-reference");
const out = path.resolve("../../runtime/boxcar-updated-parity");
await fs.mkdir(out, { recursive: true });
await fs.mkdir(path.join(capture, "js"), { recursive: true });
const js = [
  "jquery.js",
  "popper.min.js",
  "bootstrap.min.js",
  "slick.min.js",
  "slick-animation.min.js",
  "jquery.fancybox.js",
  "wow.js",
  "appear.js",
  "mixitup.js",
  "knob.js",
  "mmenu.js",
  "main.js",
];
for (const name of js) {
  const file = path.join(capture, "js", name);
  try {
    await fs.access(file);
  } catch {
    const local = path.join(capture, name);
    let bytes = await fs.readFile(local).catch(() => undefined);
    if (!bytes) {
      const r = await fetch(
        "https://creativelayers.net/themes/boxcar-html/js/" + name,
      );
      if (!r.ok) throw Error(r.status + ": " + name);
      bytes = Buffer.from(await r.arrayBuffer());
    }
    await fs.writeFile(file, bytes);
  }
}
const engine = process.env.BOXCAR_BROWSER || "chromium";
const fixture = http.createServer(async (req, res) => {
  try {
    const requestPath = new URL(req.url, "http://localhost").pathname;
    let bytes,
      type = "application/octet-stream";
    if (requestPath.endsWith(".html")) {
      const html = await fs.readFile(
        path.join(capture, path.basename(requestPath)),
        "utf8",
      );
      const $ = load(html);
      $("link[href]").each((_, el) => {
        const value = $(el).attr("href");
        $(el).attr(
          "href",
          value.startsWith("css/")
            ? "/reference/" + value
            : value.startsWith("images/")
              ? "/media/" + value.slice(7)
              : value,
        );
      });
      $("[src]").each((_, el) => {
        const value = $(el).attr("src");
        if (value.startsWith("images/"))
          $(el).attr("src", "/media/" + value.slice(7));
        else if (value.startsWith("js/")) $(el).attr("src", "/" + value);
      });
      bytes = Buffer.from($.html());
      type = "text/html";
    } else {
      const root = requestPath.startsWith("/js/")
        ? capture
        : path.resolve("public");
      const filename = path.resolve(root, "." + requestPath);
      if (!filename.startsWith(root + path.sep))
        throw Error("Out of fixture root");
      bytes = await fs.readFile(filename);
      type = requestPath.endsWith(".css")
        ? "text/css"
        : requestPath.endsWith(".js")
          ? "application/javascript"
          : requestPath.endsWith(".woff2")
            ? "font/woff2"
            : requestPath.endsWith(".svg")
              ? "image/svg+xml"
              : requestPath.endsWith(".png")
                ? "image/png"
                : requestPath.endsWith(".jpg")
                  ? "image/jpeg"
                  : "application/octet-stream";
    }
    res.writeHead(200, { "Content-Type": type });
    res.end(bytes);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((resolve) => fixture.listen(0, "127.0.0.1", resolve));
const fixtureURL = "http://127.0.0.1:" + fixture.address().port;
const browser = await (engine === "webkit" ? webkit : chromium).launch(
  engine === "webkit" ? {} : { channel: "chrome" },
);
const results = [];
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 950 },
    deviceScaleFactor: 1,
  });
  // Render the archived vendor HTML/scripts locally as a comparison fixture.
  // Production retains only jQuery and the Slick core through the Svelte action.
  const reference = await context.newPage(),
    local = await context.newPage();
  reference.on("pageerror", (e) => console.log("REFERENCE ERROR", e.message));
  local.on("console", (m) => {
    if (m.type() === "error") console.log("CONSOLE", m.text());
  });
  local.on("requestfailed", (r) =>
    console.log("REQUEST", r.url(), r.failure()?.errorText),
  );
  local.on("pageerror", (e) => console.log("ERROR", e.message));
  const widthArg = process.argv.find((value) => value.startsWith("--width="));
  const widths = widthArg
    ? [Number(widthArg.split("=")[1])]
    : process.argv.includes("--all")
      ? [1440, 390, 320]
      : [1440];
  const pending = new Set();
  reference.on("request", (r) => pending.add(r.url()));
  reference.on("requestfinished", (r) => pending.delete(r.url()));
  reference.on("requestfailed", (r) => pending.delete(r.url()));
  const homeArg = process.argv.find((value) => value.startsWith("--home="));
  const homes = homeArg
    ? [Number(homeArg.split("=")[1])]
    : process.argv.includes("--all")
      ? Array.from({ length: 10 }, (_, i) => i + 1)
      : [1, 2, 4, 7, 8];
  const pixelDifference = async (a, b) => {
    const x = await sharp(a).removeAlpha().raw().toBuffer(),
      y = await sharp(b).removeAlpha().raw().toBuffer();
    assert.equal(x.length, y.length, "Screenshot dimensions match");
    let sum = 0,
      changed = 0;
    for (let i = 0; i < x.length; i += 3) {
      const d = Math.max(
        Math.abs(x[i] - y[i]),
        Math.abs(x[i + 1] - y[i + 1]),
        Math.abs(x[i + 2] - y[i + 2]),
      );
      sum += d;
      if (d > 16) changed++;
    }
    return { mae: sum / (x.length / 3), different: changed / (x.length / 3) };
  };
  const geometry = async (page) =>
    page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      fonts: [...document.fonts]
        .filter((f) => f.family === "DM Sans")
        .map((f) => f.status),
      sections: [...document.querySelectorAll("section")].map((el) => ({
        class: el.className,
        rect: el.getBoundingClientRect().toJSON(),
        head: el.querySelector("h1,h2")?.textContent?.trim(),
      })),
      hero: [
        ...(document
          .querySelector("section")
          ?.querySelectorAll(
            "h1,h2,.form-tabs,.form-tabs-list,.model-links,.banner-v8-form",
          ) || []),
      ]
        .filter((el) => el.getBoundingClientRect().height > 0)
        .map((el) => ({
          class: el.className,
          rect: el.getBoundingClientRect().toJSON(),
          size: getComputedStyle(el).fontSize,
        })),
      detail: [
        ".cars-section-three .slick-current img",
        ".cars-section-two .slick-current",
        ".testimonial-slider-two .slick-current img",
        "footer form",
        "footer input",
      ].map((selector) => {
        const el = document.querySelector(selector);
        if (!el) return { selector };
        const style = getComputedStyle(el);
        return {
          selector,
          tag: el.tagName,
          class: el.className,
          rect: el.getBoundingClientRect().toJSON(),
          display: style.display,
          font: style.font,
          lineHeight: style.lineHeight,
          background: style.background,
        };
      }),
      cardDetail: [
        ...document.querySelectorAll(
          ".cars-section-two .car-block-two:not(.slick-cloned)",
        ),
      ]
        .slice(0, 1)
        .map((card) => ({
          html: card.querySelector(".image-box")?.innerHTML,
          children: [
            ...card.querySelectorAll(
              ".inner-box,.image-box,.image,a,img,.content-box,.title,.text,ul,li,.btn-box",
            ),
          ].map((el) => ({
            tag: el.tagName,
            class: el.className,
            text: el.textContent?.trim(),
            rect: el.getBoundingClientRect().toJSON(),
            font: getComputedStyle(el).font,
            margin: getComputedStyle(el).margin,
            width: getComputedStyle(el).width,
            min: getComputedStyle(el).minWidth,
            max: getComputedStyle(el).maxWidth,
            flex: getComputedStyle(el).flex,
            float: getComputedStyle(el).cssFloat,
            whiteSpace: getComputedStyle(el).whiteSpace,
          })),
        })),
      broken: [...document.images]
        .filter(
          (i) =>
            i.getBoundingClientRect().height &&
            (!i.complete || !i.naturalWidth),
        )
        .map((i) => i.src),
    }));
  for (const width of widths)
    for (const home of homes) {
      await reference.setViewportSize({ width, height: 950 });
      await local.setViewportSize({ width, height: 950 });
      const file = home === 1 ? "index.html" : `index-${home}.html`,
        url = `/home-${home}/`;
      console.log("Compare", engine, width, home);
      await reference.bringToFront();
      await reference.goto(fixtureURL + "/" + file, {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      console.log("Reference DOM ready");
      try {
        await reference.waitForFunction(
          () => document.fonts.status === "loaded",
          undefined,
          { timeout: 10000 },
        );
      } catch {
        console.log(
          "FONT DEBUG",
          JSON.stringify({
            pending: [...pending],
            fonts: await reference.evaluate(() =>
              [...document.fonts].map((f) => ({
                family: f.family,
                status: f.status,
              })),
            ),
            styles: await reference.evaluate(() =>
              [...document.styleSheets].map((s) => s.href),
            ),
          }),
        );
      }
      await reference
        .locator(".slick-initialized")
        .first()
        .waitFor({ state: "attached" });
      await local.bringToFront();
      await local.goto(base + url, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
      await local.locator(".reference-home[data-ready=true]").waitFor();
      await local.waitForFunction(
        () => document.fonts.status === "loaded",
        undefined,
        { timeout: 15000 },
      );
      console.log("Local ready");
      // Finish source entrance animations and counters; disable time-dependent CSS.
      await reference.bringToFront();
      await reference.evaluate(() =>
        Promise.all(
          [...document.images].map((img) => img.decode().catch(() => {})),
        ),
      );
      await reference.waitForTimeout(1800);
      await reference.evaluate(() => {
        document.querySelectorAll(".wow").forEach((el) => {
          el.style.visibility = "visible";
          el.style.animation = "none";
        });
        document
          .querySelectorAll(".count-text[data-stop]")
          .forEach((el) => (el.textContent = el.dataset.stop));
      });
      await local.bringToFront();
      await local.evaluate(() => {
        document
          .querySelectorAll(".wow")
          .forEach((el) => (el.style.animation = "none"));
      });
      await reference.bringToFront();
      const ref = await geometry(reference);
      await local.bringToFront();
      const actual = await geometry(local);
      if (home === 1 && width === 1440) {
        await fs.writeFile(
          path.join(out, "carousel-dom.json"),
          JSON.stringify(
            {
              reference: await reference
                .locator(".car-slider-three,.car-slider")
                .evaluateAll((els) =>
                  els.map((el) => el.outerHTML.slice(0, 7000)),
                ),
              local: await local
                .locator(".car-slider-three,.car-slider")
                .evaluateAll((els) =>
                  els.map((el) => el.outerHTML.slice(0, 7000)),
                ),
            },
            null,
            2,
          ),
        );
      }
      const delta = actual.sections.map((s, i) => ({
        section: s.class,
        dy: s.rect.y - (ref.sections[i]?.rect.y || 0),
        dh: s.rect.height - (ref.sections[i]?.rect.height || 0),
      }));
      const a = path.join(out, `${engine}-${width}-${home}-reference.png`),
        b = path.join(out, `${engine}-${width}-${home}-local.png`);
      await reference.bringToFront();
      await reference.screenshot({ path: a });
      await local.bringToFront();
      await local.screenshot({ path: b });
      const result = {
        engine,
        width,
        home,
        ...(await pixelDifference(a, b)),
        reference: ref,
        actual,
        delta,
      };
      if (
        process.argv.includes("--full") &&
        width === 1440 &&
        [1, 3, 7, 10].includes(home)
      ) {
        const end = Math.floor(
          Math.min(
            ref.sections.at(-1).rect.bottom,
            actual.sections.at(-1).rect.bottom,
          ),
        );
        const fullRef = path.join(
            out,
            `${engine}-${width}-${home}-full-reference.png`,
          ),
          fullLocal = path.join(
            out,
            `${engine}-${width}-${home}-full-local.png`,
          );
        await reference.bringToFront();
        await reference.screenshot({ path: fullRef, fullPage: true });
        await local.bringToFront();
        await local.screenshot({ path: fullLocal, fullPage: true });
        const crop = { left: 0, top: 0, width, height: end };
        result.fullContent = {
          height: end,
          ...(await pixelDifference(
            await sharp(fullRef).extract(crop).png().toBuffer(),
            await sharp(fullLocal).extract(crop).png().toBuffer(),
          )),
        };
      }
      results.push(result);
      console.log(
        JSON.stringify({
          engine,
          width,
          home,
          mae: result.mae.toFixed(3),
          different: (result.different * 100).toFixed(2) + "%",
          drift: delta.filter((d) => Math.abs(d.dy) > 1 || Math.abs(d.dh) > 1),
          full: result.fullContent,
          badFonts: actual.fonts.some((f) => f === "error"),
          broken: actual.broken.length,
          overflow: actual.overflow,
        }),
      );
    }
  await fs.writeFile(
    path.join(
      out,
      `${engine}${homeArg ? "-home" + homes[0] : ""}-results.json`,
    ),
    JSON.stringify(results, null, 2),
  );
  for (const result of results) {
    const label = `${engine} home ${result.home} at ${result.width}px`;
    assert.equal(
      result.actual.sections.length,
      result.reference.sections.length,
      label + ": section count",
    );
    assert.ok(
      result.delta.every((d) => Math.abs(d.dy) <= 1 && Math.abs(d.dh) <= 1),
      label + ": section geometry",
    );
    assert.equal(result.actual.overflow, false, label + ": document overflow");
    assert.deepEqual(result.actual.broken, [], label + ": broken images");
    assert.ok(!result.actual.fonts.includes("error"), label + ": font loading");
    assert.ok(
      result.different < 0.01,
      label + ": first viewport pixel differences exceed 1%",
    );
  }
} finally {
  await browser.close();
  await new Promise((resolve) => fixture.close(resolve));
}
