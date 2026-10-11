import assert from "node:assert/strict";
import { test } from "node:test";
import { auditDesktopGeometry } from "../scripts/check-desktop-geometry.mjs";

const definition = {
  path: "src/lib/styles/desktop-geometry.css",
  source:
    "@media (min-width: 992px) { :root { --karento-desktop-card-padding: 19px; } }",
};
const component = (css: string) => ({
  path: "src/lib/Example.svelte",
  source: `<div class="card">Card</div><style>${css}</style>`,
});
const cardAction = (css: string) => ({
  path: "src/lib/Card.svelte",
  source: `<div class="card">
    <div class="card-button"><a class="btn btn-gray desktop-card-action">Book now</a></div>
    <div class="endtime desktop-card-footer"></div>
    <div class="toolbar"><button class="btn">Filter</button></div>
  </div><style>${css}</style>`,
});

test("accepts shared desktop geometry without enforcing today's chosen values", () => {
  const report = auditDesktopGeometry([
    definition,
    component(
      "@media (min-width: 62rem) {.card {padding:var(--karento-desktop-card-padding);}}",
    ),
  ]);
  assert.deepEqual(report.problems, []);
});
test("rejects shared geometry definitions that reach mobile", () => {
  const report = auditDesktopGeometry([
    { ...definition, source: ":root {--karento-desktop-card-padding:19px;}" },
  ]);
  assert.equal(report.problems[0].code, "mobile-definition");
});
test("rejects desktop token consumers in base or tablet CSS", () => {
  const report = auditDesktopGeometry([
    definition,
    component(
      "@media (min-width:768px) {.card {padding:var(--karento-desktop-card-padding);}}",
    ),
  ]);
  assert.equal(report.problems[0].code, "mobile-consumer");
});
test("validates formatter-wrapped geometry token consumers", () => {
  const wrapped = "var(\n  --karento-desktop-card-padding\n)";
  for (const css of [
    `.card {padding:${wrapped};}`,
    `@media (min-width:768px) {.card {padding:${wrapped};}}`,
  ]) {
    assert.deepEqual(
      auditDesktopGeometry([definition, component(css)]).problems.map(
        (problem) => problem.code,
      ),
      ["mobile-consumer"],
    );
  }
  assert.deepEqual(
    auditDesktopGeometry([
      definition,
      component(`@media (min-width:992px) {.card {padding:${wrapped};}}`),
    ]).problems,
    [],
  );
  assert.deepEqual(
    auditDesktopGeometry([
      definition,
      component(
        "@media (min-width:992px) {.card {padding:var(\n --karento-desktop-card-padding \n, 20px\n);gap:var(\n --karento-desktop-panel-gap\n);}}",
      ),
    ]).problems.map((problem) => problem.code),
    ["local-fallback", "missing-token"],
  );
});
test("rejects undeclared tokens and component-owned shared definitions", () => {
  const report = auditDesktopGeometry([
    definition,
    component(
      "@media (min-width:992px) {.card {--karento-desktop-card-gap:16px;gap:var(--karento-desktop-panel-gap);}}",
    ),
  ]);
  assert.deepEqual(
    report.problems.map((p) => p.code),
    ["duplicate-definition", "missing-token"],
  );
});
test("rejects local fallbacks while preserving independent mobile geometry", () => {
  const report = auditDesktopGeometry([
    definition,
    component(
      ".card {padding:18px;} @media (min-width:992px) {.card {padding:var(--karento-desktop-card-padding,20px);}}",
    ),
  ]);
  assert.deepEqual(
    report.problems.map((p) => p.code),
    ["local-fallback"],
  );
});

test("counts and validates the shared disclosure height token", () => {
  const report = auditDesktopGeometry([
    {
      ...definition,
      source:
        "@media (min-width:992px) {:root {--karento-desktop-disclosure-height:44px;}}",
    },
    component(
      "@media (min-width:992px) {.card {min-height:var(--karento-desktop-disclosure-height);}}",
    ),
  ]);
  assert.equal(report.tokenCount, 1);
  assert.deepEqual(report.problems, []);
});

test("rejects reintroduced legacy card CTA sizing through matching aliases", () => {
  const report = auditDesktopGeometry([
    cardAction(
      "@media (min-width:992px) {.card-button .btn {min-height:40px;padding:8px 18px;border-radius:12px;}}",
    ),
  ]);
  assert.deepEqual(
    report.problems.map((problem) => [problem.code, problem.token]),
    [
      ["local-card-action-geometry", "min-height"],
      ["local-card-action-geometry", "padding"],
      ["local-card-action-geometry", "border-radius"],
    ],
  );
});

test("matches literal class prop defaults on explicit action consumers", () => {
  const report = auditDesktopGeometry([
    {
      path: "src/lib/Card.svelte",
      source: `<script lang="ts">
        let { actionClass = "btn btn-gray" }: { actionClass?: string } = $props();
      </script><div class="card-button"><a class={[actionClass, "desktop-card-action"]}>Book now</a></div>
      <style>@media (min-width:992px) {.card-button :global(.btn) {height:44px;}}</style>`,
    },
  ]);
  assert.deepEqual(
    report.problems.map((problem) => problem.code),
    ["local-card-action-geometry"],
  );
});

test("rejects local action display, centering and wrapping ownership", () => {
  const report = auditDesktopGeometry([
    cardAction(
      "@media (min-width:62rem) {.desktop-card-action {display:inline-block;align-items:start;justify-content:start;white-space:normal;}}",
    ),
  ]);
  assert.deepEqual(
    report.problems.map((problem) => problem.token),
    ["display", "align-items", "justify-content", "white-space"],
  );
});

test("allows centrally owned compact action geometry", () => {
  const report = auditDesktopGeometry([
    {
      ...definition,
      source:
        "@media (min-width:992px) {.main .desktop-card-action {display:inline-flex;align-items:center;min-height:34px;padding:6px 16px;border-radius:999px;white-space:nowrap;}}",
    },
    cardAction(""),
  ]);
  assert.deepEqual(report.problems, []);
});

test("allows variant colors, focus styling and the narrow desktop footer gap", () => {
  const report = auditDesktopGeometry([
    cardAction(
      "@media (min-width:992px) {.card-button .btn-gray {color:white;background-color:black;border-color:black;} .card-button .btn-gray:focus-visible {outline:2px solid black;outline-offset:3px;}} @media (min-width:992px) and (max-width:1199.98px) {.card .endtime {gap:4px;}}",
    ),
  ]);
  assert.deepEqual(report.problems, []);
});

test("preserves unrelated controls, wrapper geometry and base/mobile CSS", () => {
  const report = auditDesktopGeometry([
    cardAction(
      ".card-button .btn {min-height:44px;} @media (max-width:767.98px) {.card-button .btn {padding:12px;}} @media (min-width:992px) {.toolbar .btn {min-height:40px;} .card-button {padding:12px;} .card-button a:not(.desktop-card-action) {padding:12px;} .desktop-card-action::before {display:block;padding:0;}}",
    ),
  ]);
  assert.deepEqual(report.problems, []);
});

test("rejects noncentral CSS overriding a rendered explicit action hook", () => {
  const report = auditDesktopGeometry([
    cardAction(""),
    {
      path: "src/lib/styles/catalog.css",
      source:
        "@media (min-width:992px) {.main .desktop-card-action {min-height:40px;}}",
    },
  ]);
  assert.deepEqual(
    report.problems.map((problem) => problem.code),
    ["local-card-action-geometry"],
  );
});
