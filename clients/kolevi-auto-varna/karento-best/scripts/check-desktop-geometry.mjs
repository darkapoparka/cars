import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss, { AtRule } from "postcss";
import { load } from "cheerio";
import { parse } from "svelte/compiler";
import { desktopMedia } from "./check-desktop-typography.mjs";

const centralPath = "src/lib/styles/desktop-geometry.css";
const sharedToken =
  /^(?!.*-title-)--karento-desktop-(?:space-|card-|panel-|grid-gap|section-padding|heading-gap|control-|pill-|disclosure-height$)/;
const cardActionGeometry =
  /^(?:display|align-(?:items|content)|justify-(?:items|content)|place-(?:items|content)|flex-(?:direction|wrap|shrink)|vertical-align|(?:min-|max-)?(?:height|block-size)|padding(?:-(?:top|right|bottom|left|block(?:-start|-end)?|inline(?:-start|-end)?))?|border(?:-(?:top|bottom)-(?:left|right)|-(?:start|end)-(?:start|end))?-radius|white-space)$/;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function record(value) {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

/** @param {unknown} value @param {(node: Record<string, unknown>) => void} visit */
function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const node of value) walk(node, visit);
  } else if (record(value)) {
    visit(value);
    for (const [key, child] of Object.entries(value))
      if (key !== "metadata") walk(child, visit);
  }
}

/** @param {unknown} value @param {Map<string, string>} defaults @returns {string} */
function staticText(value, defaults) {
  if (Array.isArray(value))
    return value.map((node) => staticText(node, defaults)).join(" ");
  if (!record(value)) return "";
  if (value.type === "Text" && typeof value.data === "string")
    return value.data;
  if (value.type === "Literal" && typeof value.value === "string")
    return value.value;
  if (value.type === "Identifier" && typeof value.name === "string")
    return defaults.get(value.name) ?? "";
  if (value.type === "ExpressionTag")
    return staticText(value.expression, defaults);
  if (value.type === "ArrayExpression")
    return staticText(value.elements, defaults);
  return "";
}

/** @param {string} value */
function attributeText(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
}

/**
 * Build only the element hierarchy and statically known classes/attributes.
 * Props' literal class defaults let aliases such as .card-button .btn match the
 * same explicit action hook, without treating other toolbar buttons as actions.
 * @param {ReturnType<typeof parse>} component
 */
function actionDocument(component) {
  /** @type {Map<string, string>} */
  const defaults = new Map();
  walk(component.instance, (node) => {
    if (
      node.type === "AssignmentPattern" &&
      record(node.left) &&
      node.left.type === "Identifier" &&
      typeof node.left.name === "string"
    ) {
      const value = staticText(node.right, defaults);
      if (value) defaults.set(node.left.name, value);
    }
  });
  /** @param {unknown} value @returns {string} */
  function elements(value) {
    if (Array.isArray(value)) return value.map(elements).join("");
    if (!record(value)) return "";
    if (
      (value.type === "RegularElement" || value.type === "Component") &&
      typeof value.name === "string"
    ) {
      const name =
        value.name === "DemoActionLink"
          ? "a"
          : value.name === "DemoActionButton"
            ? "button"
            : value.name;
      const attributes = Array.isArray(value.attributes)
        ? value.attributes
            .filter(
              (attribute) =>
                record(attribute) &&
                attribute.type === "Attribute" &&
                typeof attribute.name === "string",
            )
            .map((attribute) => {
              if (!record(attribute)) return "";
              const text = staticText(attribute.value, defaults);
              return text ? ` ${attribute.name}="${attributeText(text)}"` : "";
            })
            .join("")
        : "";
      return `<${name}${attributes}>${elements(value.fragment)}</${name}>`;
    }
    return Object.entries(value)
      .filter(([key]) => key !== "metadata")
      .map(([, child]) => elements(child))
      .join("");
  }
  const document = load(
    `<main class="main">${elements(component.fragment)}</main>`,
  );
  return document(".desktop-card-action").length ? document : undefined;
}

/** @param {string} selector @param {ReturnType<typeof actionDocument>} document */
function selectsCardAction(selector, document) {
  if (!document || /::[\w-]+/.test(selector)) return false;
  const normalized = selector
    .replace(/:global\(([^()]*)\)/g, "$1")
    .replace(
      /:(?:hover|active|focus(?:-visible|-within)?|visited|link|any-link|enabled|disabled|checked|indeterminate|target)(?![\w-])/g,
      ":is(*)",
    );
  try {
    return document(normalized).filter(".desktop-card-action").length > 0;
  } catch {
    // Unsupported selectors cannot prove that a rule owns this consumer.
    return false;
  }
}

/** @param {import('postcss').Node} node */
function desktopScoped(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      parent instanceof AtRule &&
      parent.name === "media" &&
      desktopMedia(parent.params)
    )
      return true;
  }
  return false;
}

/**
 * Shared geometry definitions and their consumers must stay above the desktop
 * breakpoint. Image dimensions and existing mobile tokens remain independent.
 * @param {readonly {path: string, source: string}[]} sources
 */
export function auditDesktopGeometry(sources) {
  /** @type {{path: string, code: string, token: string, selector?: string}[]} */
  const problems = [];
  /** @type {Set<string>} */
  const definitions = new Set();
  const parsed = sources.map((file) => {
    const component = file.path.endsWith(".svelte")
      ? parse(file.source, { modern: true })
      : undefined;
    const source =
      component?.css?.content.styles ?? (component ? "" : file.source);
    return {
      file,
      css: postcss.parse(source, { from: file.path }),
      actions: component ? actionDocument(component) : undefined,
    };
  });
  for (const { file, css } of parsed)
    css.walkDecls((decl) => {
      if (!sharedToken.test(decl.prop)) return;
      definitions.add(decl.prop);
      if (file.path !== centralPath)
        problems.push({
          path: file.path,
          code: "duplicate-definition",
          token: decl.prop,
        });
      if (!desktopScoped(decl))
        problems.push({
          path: file.path,
          code: "mobile-definition",
          token: decl.prop,
        });
    });
  for (const { file, css, actions } of parsed)
    css.walkDecls((decl) => {
      const selector =
        decl.parent?.type === "rule" ? decl.parent.selector : undefined;
      if (
        file.path !== centralPath &&
        desktopScoped(decl) &&
        cardActionGeometry.test(decl.prop) &&
        selector &&
        (actions
          ? selectsCardAction(selector, actions)
          : !file.path.endsWith(".svelte") &&
            parsed.some(({ actions: consumers }) =>
              selectsCardAction(selector, consumers),
            ))
      )
        problems.push({
          path: file.path,
          code: "local-card-action-geometry",
          token: decl.prop,
          selector,
        });
      for (const match of decl.value.matchAll(
        /var\(\s*(--karento-desktop-[\w-]+)\s*(,[^)]*)?\)/g,
      )) {
        const token = match[1];
        if (!sharedToken.test(token)) continue;
        if (!definitions.has(token))
          problems.push({ path: file.path, code: "missing-token", token });
        if (!desktopScoped(decl))
          problems.push({ path: file.path, code: "mobile-consumer", token });
        if (match[2])
          problems.push({ path: file.path, code: "local-fallback", token });
      }
    });
  return { tokenCount: definitions.size, problems };
}

/** @param {string} directory @returns {string[]} */
function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory()
      ? sourceFiles(file)
      : /\.(svelte|css)$/.test(file)
        ? [file]
        : [];
  });
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const report = auditDesktopGeometry(
    sourceFiles("src").map((file) => ({
      path: file.replaceAll("\\", "/"),
      source: fs.readFileSync(file, "utf8"),
    })),
  );
  if (report.problems.length) {
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  } else
    console.log(
      `Desktop geometry: ${report.tokenCount} shared tokens, no scope or reference errors.`,
    );
}
