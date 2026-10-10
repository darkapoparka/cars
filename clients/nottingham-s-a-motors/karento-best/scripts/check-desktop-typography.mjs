import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postcss, { AtRule } from "postcss";
import { parse } from "svelte/compiler";

/** @typedef {{ path: string, source: string }} TypographySource */
/** @typedef {{ path: string, line: number, code: string, message: string, property?: string, value?: string }} TypographyProblem */
/** @typedef {{ fileCount: number, roleCount: number, tokenCount: number, problems: TypographyProblem[] }} TypographyReport */

const centralPath = "src/lib/styles/desktop-typography.css";
const typeProperties = new Set([
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "font",
]);
const rolesIn = /desktop-type-[\w-]+/g;
const cssWideValues = /^(?:inherit|initial|unset|revert|revert-layer)$/i;

/** @param {unknown} value @returns {value is Record<string, unknown>} */
function record(value) {
  return typeof value === "object" && value !== null;
}

/** @param {unknown} value @param {(node: Record<string, unknown>) => void} visit */
function walk(value, visit) {
  if (Array.isArray(value)) {
    for (const child of value) walk(child, visit);
  } else if (record(value)) {
    visit(value);
    for (const [key, child] of Object.entries(value)) {
      if (!["metadata", "loc", "parent"].includes(key)) walk(child, visit);
    }
  }
}

/** @param {string} text @returns {string[]} */
function roleNames(text) {
  return [...new Set(text.match(rolesIn) ?? [])];
}

/**
 * A media list is desktop-only when every alternative supplies its own desktop
 * lower bound. A nested desktop media rule also constrains its descendants.
 * rem/em breakpoints use the browser's initial 16px media-query font size.
 * @param {string} query
 */
export function desktopMedia(query) {
  return query.split(",").every((alternative) => {
    if (/\bnot\b/i.test(alternative)) return false;
    const bounds = [
      ...alternative.matchAll(
        /min-width\s*:\s*(\d+(?:\.\d+)?)\s*(px|rem|em)/gi,
      ),
      ...alternative.matchAll(/width\s*>=?\s*(\d+(?:\.\d+)?)\s*(px|rem|em)/gi),
      ...alternative.matchAll(/(\d+(?:\.\d+)?)\s*(px|rem|em)\s*<=?\s*width/gi),
    ];
    return bounds.some((match) => {
      const pixels =
        Number(match[1]) * (match[2].toLowerCase() === "px" ? 1 : 16);
      return pixels >= 992;
    });
  });
}

/** @param {import("postcss").Node} node */
function desktopScoped(node) {
  let parent = node.parent;
  while (parent) {
    if (
      parent instanceof AtRule &&
      parent.name.toLowerCase() === "media" &&
      desktopMedia(parent.params)
    ) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

/** @param {string} value */
function hasTypeLiteral(value) {
  if (cssWideValues.test(value.trim())) return false;
  return (
    /(?:^|[\s,(+*/])(?:[+-]?\d+(?:\.\d+)?|[+-]?\.\d+)(?:[a-z%]+)?(?:$|[\s,)/+*])/i.test(
      value,
    ) || /\b(?:normal|bold|bolder|lighter)\b/i.test(value)
  );
}

/**
 * Audit in-memory source so fixture tests can exercise the policy independently
 * of today's chosen font sizes. Only the central definition owns literal type.
 * @param {readonly TypographySource[]} sources
 * @param {{ centralPath?: string }} [options]
 * @returns {TypographyReport}
 */
export function auditDesktopTypography(sources, options = {}) {
  const definitionPath = options.centralPath ?? centralPath;
  /** @type {TypographyProblem[]} */
  const problems = [];
  /** @type {Set<string>} */
  const tokens = new Set();
  /** @type {Set<string>} */
  const roles = new Set();
  /** @type {{ file: TypographySource, css: import("postcss").Root, offset: number, ast?: ReturnType<typeof parse> }[]} */
  const parsed = [];

  /** @param {TypographySource} file @param {number} line @param {string} code @param {string} message @param {{property?: string, value?: string}} [detail] */
  function problem(file, line, code, message, detail = {}) {
    problems.push({ path: file.path, line, code, message, ...detail });
  }

  for (const file of sources) {
    try {
      if (file.path.endsWith(".svelte")) {
        const ast = parse(file.source, { modern: true });
        parsed.push({
          file,
          ast,
          css: postcss.parse(ast.css?.content.styles ?? "", {
            from: file.path,
          }),
          offset: ast.css
            ? file.source.slice(0, ast.css.content.start).split("\n").length - 1
            : 0,
        });
      } else if (file.path.endsWith(".css")) {
        parsed.push({
          file,
          css: postcss.parse(file.source, { from: file.path }),
          offset: 0,
        });
      }
    } catch (error) {
      problem(
        file,
        1,
        "parse-error",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const definition = parsed.find(({ file }) => file.path === definitionPath);
  if (!definition) {
    problems.push({
      path: definitionPath,
      line: 1,
      code: "missing-definition",
      message: "The central typography definition must be included.",
    });
  } else {
    definition.css.walkDecls((declaration) => {
      if (declaration.prop.startsWith("--")) {
        tokens.add(declaration.prop);
        if (!desktopScoped(declaration)) {
          problem(
            definition.file,
            declaration.source?.start?.line ?? 1,
            "unscoped-token",
            `${declaration.prop} must stay desktop-scoped.`,
          );
        }
      }
    });
    definition.css.walkRules((rule) => {
      const names = roleNames(rule.selector);
      for (const role of names) roles.add(role);
      if (names.length && !desktopScoped(rule)) {
        problem(
          definition.file,
          rule.source?.start?.line ?? 1,
          "unscoped-role",
          "Central typography roles must stay desktop-scoped.",
        );
      }
    });
  }

  for (const { file, css, offset, ast } of parsed) {
    css.walkRules((rule) => {
      for (const role of roleNames(rule.selector)) {
        if (!roles.has(role))
          problem(
            file,
            offset + (rule.source?.start?.line ?? 1),
            "unknown-role",
            `Undefined typography role ${role}.`,
          );
      }
    });
    css.walkDecls((declaration) => {
      const typography =
        typeProperties.has(declaration.prop.toLowerCase()) &&
        desktopScoped(declaration);
      const definitionToken =
        file.path === definitionPath && declaration.prop.startsWith("--");
      if (!typography && !definitionToken) return;
      const line = offset + (declaration.source?.start?.line ?? 1);
      const detail = { property: declaration.prop, value: declaration.value };
      if (
        typography &&
        file.path !== definitionPath &&
        hasTypeLiteral(declaration.value)
      ) {
        problem(
          file,
          line,
          "type-literal",
          "Desktop typography values belong in the central definition; use a role token.",
          detail,
        );
      }
      for (const match of declaration.value.matchAll(/var\(\s*(--[\w-]+)/g)) {
        if (!tokens.has(match[1]))
          problem(
            file,
            line,
            "unknown-token",
            `Undefined typography token ${match[1]}.`,
            detail,
          );
      }
    });
    if (!ast) continue;
    /** @type {Map<string, unknown>} */
    const bindings = new Map();
    walk(ast.instance, (node) => {
      if (
        node.type === "VariableDeclarator" &&
        record(node.id) &&
        node.id.type === "Identifier" &&
        typeof node.id.name === "string"
      ) {
        bindings.set(node.id.name, node.init);
      }
    });
    walk(ast.module, (node) => {
      if (
        node.type === "VariableDeclarator" &&
        record(node.id) &&
        node.id.type === "Identifier" &&
        typeof node.id.name === "string"
      ) {
        bindings.set(node.id.name, node.init);
      }
    });
    walk(ast.fragment, (node) => {
      if (
        !(
          (node.type === "Attribute" && node.name === "class") ||
          node.type === "ClassDirective"
        )
      )
        return;
      const line = file.source
        .slice(0, typeof node.start === "number" ? node.start : 0)
        .split("\n").length;
      /** @type {Set<string>} */
      const found = new Set();
      /** @type {Set<string>} */
      const seenBindings = new Set();
      /** @param {unknown} expression */
      function inspect(expression) {
        walk(expression, (part) => {
          const text =
            typeof part.data === "string"
              ? part.data
              : typeof part.value === "string"
                ? part.value
                : undefined;
          if (text) {
            for (const role of roleNames(text)) found.add(role);
            if (text.includes("desktop-type-") && !roleNames(text).length) {
              problem(
                file,
                line,
                "dynamic-role",
                "Constructed typography role names cannot be verified; use explicit role names in a class map or conditional.",
              );
            }
          }
          if (
            part.type === "TemplateElement" &&
            record(part.value) &&
            typeof part.value.raw === "string"
          ) {
            for (const role of roleNames(part.value.raw)) found.add(role);
            if (part.value.raw.endsWith("desktop-type-"))
              problem(
                file,
                line,
                "dynamic-role",
                "Constructed typography role names cannot be verified; use explicit role names.",
              );
          }
          if (
            part.type === "Identifier" &&
            typeof part.name === "string" &&
            bindings.has(part.name) &&
            !seenBindings.has(part.name)
          ) {
            seenBindings.add(part.name);
            inspect(bindings.get(part.name));
          }
        });
      }
      if (node.type === "ClassDirective" && typeof node.name === "string") {
        for (const role of roleNames(node.name)) found.add(role);
      } else inspect(node.value);
      for (const role of found)
        if (!roles.has(role))
          problem(
            file,
            line,
            "unknown-role",
            `Undefined typography role ${role}.`,
          );
    });
  }
  return {
    fileCount: sources.length,
    roleCount: roles.size,
    tokenCount: tokens.size,
    problems,
  };
}

/** @param {{ root?: string }} [options] @returns {TypographyReport} */
export function checkDesktopTypography(options = {}) {
  const root = options.root ?? process.cwd();
  const sourceRoot = path.join(root, "src");
  const sources = fs
    .readdirSync(sourceRoot, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(?:svelte|css)$/.test(entry.name))
    .map((entry) => {
      const absolute = path.join(entry.parentPath, entry.name);
      return {
        path: path.relative(root, absolute).replaceAll("\\", "/"),
        source: fs.readFileSync(absolute, "utf8"),
      };
    });
  return auditDesktopTypography(sources);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const report = checkDesktopTypography();
  if (process.argv.includes("--json"))
    console.log(JSON.stringify(report, null, 2));
  else if (report.problems.length) {
    for (const issue of report.problems)
      console.error(
        `${issue.path}:${issue.line} [${issue.code}] ${issue.message}${issue.property ? ` (${issue.property}: ${issue.value})` : ""}`,
      );
  } else
    console.log(
      `Desktop typography: ${report.fileCount} source files, ${report.roleCount} roles; no architectural violations.`,
    );
  if (report.problems.length) process.exitCode = 1;
}
