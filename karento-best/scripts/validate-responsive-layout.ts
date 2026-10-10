import assert from "node:assert/strict";
import fs from "node:fs";
import { launchBrowser } from "./browser.ts";
import { teamMembersCompact2 } from "../src/lib/data/editorial.ts";
import { purchaseProcess } from "../src/lib/data/purchase-process.ts";
import { dealer } from "../src/lib/content.ts";
import { translate } from "../src/lib/i18n/messages.ts";

const purchaseStepTitles = purchaseProcess.steps.map(({ title }) =>
  typeof title === "string" ? title : translate("en", title.message),
);

const base = process.env.KARENTO_NATIVE_URL || "http://127.0.0.1:6466";
const directory =
  process.env.KARENTO_EVIDENCE_DIR || ".runtime/evidence/responsive-layout";
fs.mkdirSync(directory, { recursive: true });
const browser = await launchBrowser();
const results: { width: number; checks: string[] }[] = [];

try {
  for (const width of [320, 390, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 844 },
      reducedMotion: "reduce",
      hasTouch: width < 768,
    });
    const phone = width < 768;
    const checks: string[] = [];
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/*", (request) =>
      new URL(request.request().url()).hostname === "127.0.0.1"
        ? request.continue()
        : request.abort(),
    );

    async function visit(route: string) {
      await page.goto(base + route, { waitUntil: "networkidle" });
      await page.waitForFunction(
        () => document.body.dataset.karentoReady === "true",
      );
      await page.evaluate(() => document.fonts.ready);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route}: page overflow at ${width}`,
      );
    }

    await visit("/");
    const agents = page.getByRole("region", {
      name: "Our agents",
      exact: true,
    });
    if (phone) {
      const collection = await agents.boundingBox();
      const cards = await page
        .locator(".section-team-1 .agent-card")
        .evaluateAll((items) =>
          items.map((item) => item.getBoundingClientRect().toJSON()),
        );
      assert.ok(collection);
      assert.equal(cards.length, teamMembersCompact2.length);
      assert.equal(
        cards[0].y,
        cards[1].y,
        "Profiles stay in one horizontal row",
      );
      assert.ok(
        cards[0].left >= collection.x &&
          cards[0].right < collection.x + collection.width &&
          cards[1].left > cards[0].right &&
          cards[1].left < collection.x + collection.width &&
          cards[1].right > collection.x + collection.width,
        "One complete profile and a visible part of the next",
      );
      assert.equal(await agents.getAttribute("tabindex"), "0");
      await agents.scrollIntoViewIfNeeded();
      const swipeBounds = await agents.boundingBox();
      assert.ok(swipeBounds);
      const client = await page.context().newCDPSession(page);
      try {
        const y = swipeBounds.y + swipeBounds.height / 3;
        await client.send("Input.dispatchTouchEvent", {
          type: "touchStart",
          touchPoints: [{ x: swipeBounds.x + swipeBounds.width * 0.8, y }],
        });
        for (let step = 1; step <= 6; step++)
          await client.send("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [
              { x: swipeBounds.x + swipeBounds.width * (0.8 - step / 10), y },
            ],
          });
        await client.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
        await page.waitForFunction(
          () =>
            document.querySelector(".section-team-1 .responsive-collection")!
              .scrollLeft > 0,
        );
      } finally {
        await client.detach();
      }
      await agents.evaluate((element) => {
        element.scrollLeft = 0;
      });
      await agents.focus();
      for (let index = 0; index < (await agents.locator("a").count()); index++)
        await page.keyboard.press("Tab");
      const lastProfile = agents.locator(".icon-shape-arrow").last();
      assert.equal(
        await lastProfile.evaluate(
          (element) => element === document.activeElement,
        ),
        true,
        "Every profile remains keyboard reachable",
      );
      assert.ok(
        await lastProfile.evaluate((element) => {
          const bounds = element.getBoundingClientRect();
          const rail = element
            .closest(".responsive-collection")!
            .getBoundingClientRect();
          return bounds.left >= rail.left && bounds.right <= rail.right + 1;
        }),
        "Focusing a profile reveals its control inside the rail",
      );
      assert.ok(
        await agents
          .locator(".agent-action")
          .last()
          .evaluate((element) => {
            const box = element.getBoundingClientRect();
            const x = box.x + box.width / 2;
            const y = box.y + box.height / 2;
            return [
              [x - 21, y],
              [x + 21, y],
              [x, y - 21],
              [x, y + 21],
            ].every(
              ([left, top]) =>
                document.elementFromPoint(left, top)?.closest("a") === element,
            );
          }),
        "The small painted profile circle has 44px touch coverage",
      );
      const profileBounds = await lastProfile.boundingBox();
      assert.ok(profileBounds);
      await page.touchscreen.tap(
        profileBounds.x + profileBounds.width / 2,
        profileBounds.y - 5,
      );
      await page.waitForURL(base + "/import/source");
      await visit("/");
      const images = await page
        .locator(".mobile-home-vehicles .mobile-vehicle-photo")
        .evaluateAll((items) =>
          items.map((item) => {
            const box = item.getBoundingClientRect();
            return box.width / box.height;
          }),
        );
      assert.ok(
        images.every((ratio) => Math.abs(ratio - 4 / 3) < 0.02),
        "Vehicle images follow their available width",
      );
      await page.setViewportSize({ width: 1440, height: 844 });
      await page.waitForFunction(
        () =>
          !document
            .querySelector(".section-team-1 .responsive-collection")!
            .hasAttribute("tabindex"),
      );
      await page.setViewportSize({ width, height: 844 });
      await page.waitForFunction(
        () =>
          document
            .querySelector(".section-team-1 .responsive-collection")!
            .getAttribute("tabindex") === "0",
      );
      checks.push(
        "profile peek, native swipe, keyboard reachability, touch targets and breakpoint reset",
      );
      checks.push("proportional vehicle images");
    } else {
      assert.equal(await agents.getAttribute("tabindex"), null);
    }

    const process = page.locator("#how-it-works");
    assert.deepEqual(
      await process.locator("h6").allTextContents(),
      purchaseStepTitles,
    );
    assert.equal(
      await process.locator("a").count(),
      purchaseProcess.steps.length,
      "Each step has one complete link",
    );
    if (phone) {
      const steps = await process
        .locator(".karento-process-step-link")
        .evaluateAll((elements) =>
          elements.map((element) => element.getBoundingClientRect().toJSON()),
        );
      assert.ok(
        steps.every(
          (step, index) =>
            step.height >= 44 &&
            step.left >= 0 &&
            step.right <= width + 1 &&
            (index === 0 || step.top >= steps[index - 1].bottom),
        ),
        "Buying steps are ordered rows with full touch coverage",
      );
      const firstStep = process.getByRole("link", {
        name: purchaseStepTitles[0],
        exact: true,
      });
      await firstStep.focus();
      await page.keyboard.press("Tab");
      assert.equal(
        await process
          .getByRole("link", {
            name: purchaseStepTitles[1],
            exact: true,
          })
          .evaluate((element) => element === document.activeElement),
        true,
        "Keyboard navigation advances to the next step without a duplicate stop",
      );
      await firstStep.scrollIntoViewIfNeeded();
      const bounds = await firstStep.boundingBox();
      assert.ok(bounds);
      await page.touchscreen.tap(
        bounds.x + bounds.width - 2,
        bounds.y + bounds.height - 2,
      );
      await page.waitForURL(base + purchaseProcess.steps[0].href);
      await visit("/");
      await page
        .locator("#how-it-works")
        .getByRole("link", {
          name: purchaseStepTitles[2],
          exact: true,
        })
        .press("Enter");
      await page.waitForURL(base + purchaseProcess.steps[2].href);
      await visit("/");
      checks.push(
        "ordered buying steps, one keyboard stop per step and whole-row navigation",
      );
    }

    const footerGroups = page.locator("footer .responsive-disclosure");
    assert.equal(await footerGroups.count(), 4);
    for (const group of await footerGroups.all()) {
      assert.equal(
        await group.evaluate((element) => element.hasAttribute("open")),
        !phone,
      );
      if (phone) {
        const summary = group.locator("summary");
        const bounds = await summary.boundingBox();
        assert.ok(bounds && bounds.height >= 44);
        await summary.press("Enter");
        assert.equal(
          await group.evaluate((element) => element.hasAttribute("open")),
          true,
        );
        assert.ok(await group.locator("a").first().isVisible());
        await summary.press("Enter");
        assert.equal(
          await group.evaluate((element) => element.hasAttribute("open")),
          false,
        );
      } else {
        assert.ok(await group.locator("a").first().isVisible());
      }
    }
    checks.push("footer disclosure keyboard access and desktop visibility");

    await visit("/membership");
    const planGroups = page.locator(
      ".section-pricing-1 .responsive-disclosure",
    );
    assert.equal(await planGroups.count(), 4);
    assert.equal(
      await planGroups
        .first()
        .evaluate((element) => element.hasAttribute("open")),
      !phone,
    );
    if (phone) {
      assert.equal(await planGroups.first().locator("ul").isVisible(), false);
      await planGroups.first().locator("summary").click();
      assert.equal(await planGroups.first().locator("ul").isVisible(), true);
    }
    const price = page.locator("main .section-pricing-1 h3").nth(1);
    const monthly = await price.innerText();
    await page.getByText("Annual", { exact: true }).click();
    assert.equal(
      await page
        .getByRole("radio", { name: "Annual", exact: true })
        .isChecked(),
      true,
    );
    assert.notEqual(await price.innerText(), monthly);
    checks.push("plan features and billing updates");

    for (const route of ["/vehicle", "/shop/product"]) {
      await visit(route);
      const reviews = page.locator('[data-bs-target="#collapseReviews"]');
      assert.equal(await reviews.getAttribute("aria-expanded"), String(!phone));
      await reviews.click();
      assert.equal(await reviews.getAttribute("aria-expanded"), String(phone));
      await page
        .getByRole("link", { name: `${dealer.name} home`, exact: true })
        .click();
      await page.waitForURL(base + "/");
      await visit(route);
      assert.equal(
        await page
          .locator('[data-bs-target="#collapseReviews"]')
          .getAttribute("aria-expanded"),
        String(!phone),
        "Detail panels reset on navigation",
      );
    }
    checks.push("detail panels retain user actions and reset between visits");
    assert.deepEqual(errors, []);
    results.push({ width, checks });
    console.log("PASS responsive layout", width, checks.length);
    await page.close();
  }
} finally {
  await browser.close();
}
fs.writeFileSync(
  `${directory}/responsive-layout.json`,
  JSON.stringify(results, null, 2),
);
