/** Known translated English patterns for read-only browser acceptance.
 * This is test-only recognition, never application text replacement.
 * Short currency/model/data patterns are intentionally excluded. */
const normalize = value => value.replace(/\s+/g, " ").trim();
const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export function translatedEnglishPatterns(records) {
  return [...new Set(records.filter(record =>
    record.disposition === "translate" && record.en !== record.bg &&
    /\{[A-Za-z][A-Za-z0-9_]*\}/.test(record.en) &&
    record.en.replace(/\{[^}]+\}/g, "").replace(/[^A-Za-z]/g, "").length >= 6
  ).map(record => "^" + normalize(record.en).split(/\{[A-Za-z][A-Za-z0-9_]*\}/).map(escape).join(".+?") + "$"))];
}
