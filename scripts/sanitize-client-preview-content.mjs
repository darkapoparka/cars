import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const argv = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = argv.indexOf(flag);
  return index >= 0 ? argv[index + 1] : '';
};
const slug = valueAfter('--client');
if (!slug) throw new Error('Usage: node scripts/sanitize-client-preview-content.mjs --client <slug>');

const client = path.join(root, 'clients', slug);
const factsFile = path.join(client, 'business-facts.json');
if (!fs.existsSync(factsFile)) throw new Error(`${slug}: business-facts.json is required`);
const raw = JSON.parse(fs.readFileSync(factsFile, 'utf8').replace(/^\uFEFF/, ''));
const business = raw.business && typeof raw.business === 'object' ? raw.business : raw;
const countryCode = String(business.countryCode || business.country || '').toUpperCase();
const neutral = countryCode.includes('BG') || /BULGARIA|БЪЛГАР/i.test(countryCode)
  ? 'Свържете се с автокъщата преди посещение и потвърдете наличността.'
  : 'Contact the showroom before travelling and confirm availability.';
const internalNotice = /implementation|in progress|unfinished|not a finished|prototype|synthetic|independent preview|demo build|forms? do not|no enquiry|no inquiry|remaining template|runtime review|asset review|client review/i;

for (const target of [raw, business]) {
  for (const key of ['previewNotice', 'status', 'rightsNote', 'assetStatus', 'implementationNotice', 'disclaimer']) {
    if (typeof target[key] === 'string' && internalNotice.test(target[key])) target[key] = neutral;
  }
}
business.previewNotice = neutral;
fs.writeFileSync(factsFile, `${JSON.stringify(raw, null, 2)}\n`);

const replacements = [
  [/Implementation in progress[^\n"'`<]*/gi, neutral],
  [/not a finished dealer website/gi, neutral],
  [/Independent preview\.[^\n"'`<]*/gi, neutral],
  [/No enquiry is delivered by this preview\.?/gi, neutral],
  [/No inquiry is delivered by this preview\.?/gi, neutral],
  [/remaining template copy and runtime review are unfinished\.?/gi, neutral]
];
const textExtensions = new Set(['.json', '.ts', '.tsx', '.js', '.mjs', '.svelte', '.html', '.md']);
let changedFiles = 0;
function walk(directory) {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', '.svelte-kit', 'build', 'dist', '.turbo'].includes(entry.name)) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.isFile() && textExtensions.has(path.extname(entry.name).toLowerCase())) {
      const before = fs.readFileSync(target, 'utf8');
      let after = before;
      for (const [pattern, replacement] of replacements) after = after.replace(pattern, replacement);
      if (after !== before) {
        fs.writeFileSync(target, after.replace(/\r?\n/g, '\n'));
        changedFiles += 1;
      }
    }
  }
}
walk(client);
console.log(JSON.stringify({ client: slug, neutralNotice: neutral, changedFiles }, null, 2));
