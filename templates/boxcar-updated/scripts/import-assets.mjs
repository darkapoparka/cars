import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { load } from "cheerio";
const base = "https://creativelayers.net/themes/boxcar-html/";
const summary = JSON.parse(
  await fs.readFile(
    "../../runtime/boxcar-updated-reference/summary.json",
    "utf8",
  ),
);
const names = new Set(
  summary.flatMap((p) => p.sections.flatMap((s) => s.images)),
);
for (const page of summary) {
  const $ = load(
    await fs.readFile(
      `../../runtime/boxcar-updated-reference/${page.file}`,
      "utf8",
    ),
  );
  $("header .logo img").each((_, img) => {
    const src = $(img).attr("src");
    if (src) names.add(src);
  });
}
for (const file of [
  "images/logo.svg",
  "images/banner/banner-page1.jpg",
  "images/banner/banner-hp3.jpg",
  "images/resource/banner-six.png",
  "images/background/banner-v8.jpg",
  "images/banner/banner-page9.jpg",
  "images/resource/inventory1-1.jpg",
  "images/resource/inventory1-2.jpg",
  "images/resource/inventory1-3.png",
  "images/resource/inventory1-4.jpg",
  "images/resource/inventory1-5.png",
])
  names.add(file);
const previous = JSON.parse(
  await fs
    .readFile(".template/assets.json", "utf8")
    .catch(() => '{"assets":[]}'),
);
const assets = previous.assets.filter(
  (asset) => asset.local === "public/media/fonts/dm-sans.ttf",
);
for (const name of names) {
  const url = new URL(name, base);
  if (!url.href.startsWith(base))
    throw new Error("Unexpected reference asset origin");
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const local = "public/media/" + name.replace(/^images\//, "");
  await fs.mkdir(path.dirname(local), { recursive: true });
  await fs.writeFile(local, bytes);
  assets.push({
    source: url.href,
    local,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  });
}
const fontSource =
  "https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&display=swap";
const css = await fetch(fontSource, {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  },
}).then((r) => r.text());
const fonts = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
const url = fonts.at(-1);
if (!url?.endsWith(".woff2"))
  throw new Error("DM Sans variable WOFF2 font URL missing");
const bytes = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()));
await fs.mkdir("public/media/fonts", { recursive: true });
const local = "public/media/fonts/dm-sans.woff2";
await fs.writeFile(local, bytes);
assets.push({
  source: url,
  local,
  bytes: bytes.length,
  sha256: createHash("sha256").update(bytes).digest("hex"),
});
const licenseSource =
  "https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt";
const license = await fetch(licenseSource).then((response) => {
  if (!response.ok) throw new Error(`Font license: HTTP ${response.status}`);
  return response.text();
});
const localLicense = license.replaceAll("\r\n", "\n").replace(/[\t ]+$/gm, "");
await fs.writeFile("public/media/fonts/OFL.txt", localLicense);
assets.push({
  source: licenseSource,
  local: "public/media/fonts/OFL.txt",
  bytes: Buffer.byteLength(localLicense),
  sha256: createHash("sha256").update(localLicense).digest("hex"),
  transformation:
    "LF line endings and trimmed trailing whitespace; license wording preserved.",
});
// This refresh preserves copied vehicle inputs and records their exact Cars source.
for (const name of await fs.readdir("public/media/vehicles")) {
  const local = `public/media/vehicles/${name}`;
  const data = await fs.readFile(local);
  assets.push({
    source: `cars:templates/boxcar/public/assets/${name}`,
    local,
    bytes: data.length,
    sha256: createHash("sha256").update(data).digest("hex"),
  });
}
await fs.mkdir(".template", { recursive: true });
await fs.writeFile(
  ".template/assets.json",
  JSON.stringify(
    {
      captured: "2026-10-02",
      status:
        "Public preview reference assets; license scope requires owner review before commercial dealer reuse.",
      assets,
    },
    null,
    2,
  ),
);
console.log(
  `${assets.length} assets, ${(assets.reduce((s, a) => s + a.bytes, 0) / 1048576).toFixed(1)} MiB. Font: variable WOFF2`,
);
