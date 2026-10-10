import assert from "node:assert/strict";
import { test } from "node:test";
import {
  auditDesktopTypography,
  desktopMedia,
} from "../scripts/check-desktop-typography.mjs";

const definition = {
  path: "src/lib/styles/desktop-typography.css",
  source: `@media (min-width: 992px) {
    :root { --karento-type-card-size: 1.7rem; --karento-type-card-weight: 580;
      --karento-type-card-leading: 1.43; --karento-type-card-tracking: -.015em;
      --karento-type-meta-size: .77rem; --karento-type-counter-leading: 1; }
    html:root .desktop-type-card { font-size: var(--karento-type-card-size); }
    html:root .desktop-type-meta { font-size: var(--karento-type-meta-size); }
  }`,
};
const component = (source: string) => ({
  path: "src/lib/Example.svelte",
  source,
});
const css = (source: string) => ({
  path: "src/lib/styles/example.css",
  source,
});
const audit = (source: ReturnType<typeof component>) =>
  auditDesktopTypography([definition, source]);

test("accepts declared roles and tokens without depending on the chosen numeric scale", () => {
  const report = audit(
    component(`<script>
    const headingClass = "desktop-type-card";
    const quiet = true;
  </script>
  <h3 class={[headingClass, { "desktop-type-meta": quiet }]}>Article</h3>
  <span class:desktop-type-meta={quiet}>Date</span>
  <style>@media (min-width: 62rem) { h3 {
    font-size: var(--karento-type-card-size);
    font-weight: var(--karento-type-card-weight);
    line-height: var(--karento-type-card-leading);
    letter-spacing: var(--karento-type-card-tracking);
  } .counter { line-height: var(--karento-type-counter-leading); } }</style>`),
  );
  assert.deepEqual(report.problems, []);
});

test("rejects desktop size, weight, leading, tracking and shorthand literals", () => {
  const report = audit(
    css(`@media (min-width: 992px) {
    .title { font-size: 21px; font-weight: 650; line-height: 1.4;
      letter-spacing: -.02em; font: 600 18px/1.5 sans-serif; }
  }`),
  );
  assert.deepEqual(
    report.problems.map((issue) => issue.property),
    ["font-size", "font-weight", "line-height", "letter-spacing", "font"],
  );
  assert.ok(report.problems.every((issue) => issue.code === "type-literal"));
});

test("preserves base/mobile styles while enforcing nested desktop media and range queries", () => {
  assert.equal(desktopMedia("screen and (width >= 992px)"), true);
  assert.equal(desktopMedia("(62rem <= width < 100rem)"), true);
  assert.equal(desktopMedia("(min-width: 992px), (min-width: 75em)"), true);
  assert.equal(
    desktopMedia("(min-width: 992px), (orientation: portrait)"),
    false,
  );
  assert.equal(desktopMedia("not screen and (min-width: 992px)"), false);
  const report = audit(
    css(`.title { font-size: 30px; }
    @media (max-width: 991.98px) { .title { font-size: 24px; } }
    @media (min-width: 768px) { .title { font-size: 28px; }
      @media (width >= 1200px) { .title { font-size: 32px; } }
    }`),
  );
  assert.equal(report.problems.length, 1);
  assert.equal(report.problems[0].value, "32px");
  assert.equal(report.problems[0].line, 4);
});

test("rejects numeric token fallbacks and undeclared typography references", () => {
  const report = audit(
    css(`@media (min-width: 992px) {
    .title { font-size: var(--karento-type-card-size, 20px);
      font-weight: var(--karento-type-missing-weight); }
  }`),
  );
  assert.deepEqual(
    report.problems.map((issue) => issue.code),
    ["type-literal", "unknown-token"],
  );
  const badAlias = {
    ...definition,
    source: definition.source.replace(
      "--karento-type-counter-leading: 1;",
      "--karento-type-counter-leading: var(--missing-leading);",
    ),
  };
  assert.equal(
    auditDesktopTypography([badAlias]).problems[0].code,
    "unknown-token",
  );
});

test("validates dynamic class values and directives without scanning prose or comments as hooks", () => {
  const report = audit(
    component(`<script>const titleClass = "desktop-type-missing";</script>
    <!-- desktop-type-comment -->
    <p>The literal phrase desktop-type-prose-example is not a class.</p>
    <h3 class={titleClass}>Title</h3>
    <span class={true ? "desktop-type-meta" : "desktop-type-typo"}>Date</span>
    <span class:desktop-type-wrong={true}>Author</span>`),
  );
  assert.deepEqual(
    report.problems.map((issue) => issue.message),
    [
      "Undefined typography role desktop-type-missing.",
      "Undefined typography role desktop-type-typo.",
      "Undefined typography role desktop-type-wrong.",
    ],
  );
});

test("requires explicit role alternatives rather than unverifiable constructed class names", () => {
  const report = audit(
    component(
      '<script>let role = "card";</script><h3 class={`desktop-type-${role}`}>Title</h3>',
    ),
  );
  assert.ok(report.problems.some((issue) => issue.code === "dynamic-role"));
});

test("rejects central definitions that would leak typography roles or tokens into mobile", () => {
  const unscoped = {
    ...definition,
    source:
      ":root { --karento-type-card-size: 2rem; } .desktop-type-card { font-size: var(--karento-type-card-size); }",
  };
  const report = auditDesktopTypography([unscoped]);
  assert.deepEqual(
    report.problems.map((issue) => issue.code),
    ["unscoped-token", "unscoped-role"],
  );
});

test("reports missing definitions, invalid source and undefined CSS role selectors", () => {
  assert.equal(
    auditDesktopTypography([component("<h3>Title</h3>")]).problems[0].code,
    "missing-definition",
  );
  assert.ok(
    audit(component("<h3>Unclosed")).problems.some(
      (issue) => issue.code === "parse-error",
    ),
  );
  assert.equal(
    audit(
      css("@media (min-width: 992px) { .desktop-type-typo { color: red; } }"),
    ).problems[0].code,
    "unknown-role",
  );
});
