import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";
const dir = path.resolve("../../runtime/boxcar-updated-reference");
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 950 },
  deviceScaleFactor: 1,
});
try {
  for (let n = 1; n <= 10; n++) {
    await page.goto(
      `https://creativelayers.net/themes/boxcar-html/${n === 1 ? "index.html" : `index-${n}.html`}`,
      { waitUntil: "networkidle" },
    );
    await page.evaluate(() => document.fonts.ready);
    await page.locator("section").first().waitFor({ state: "visible" });
    await page.waitForTimeout(700); // Reference animation completion, not application readiness.
    await page.screenshot({ path: path.join(dir, `home-${n}-desktop.png`) });
    const geometry = await page
      .locator("section")
      .first()
      .evaluate((el) => {
        const r = el.getBoundingClientRect();
        const title = el.querySelector("h1,h2");
        return {
          x: r.x,
          y: r.y,
          width: r.width,
          height: r.height,
          title: title?.textContent?.trim(),
          titleStyle: title && {
            size: getComputedStyle(title).fontSize,
            lineHeight: getComputedStyle(title).lineHeight,
          },
          background: getComputedStyle(el).backgroundImage,
        };
      });
    console.log(JSON.stringify({ home: n, ...geometry }));
    await fs.writeFile(
      path.join(dir, `home-${n}-geometry.json`),
      JSON.stringify(geometry, null, 2),
    );
  }
} finally {
  await browser.close();
}
