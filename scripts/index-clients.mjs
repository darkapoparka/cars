import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''));
const assignments = read('docs/lead-build/assignments.json');
const candidates = assignments.sessions.flatMap((session) => session.candidates);
const recovered = new Set(['navara-car', 'eliqauto', 'kg-team-auto', 'al-basma-motors', 'texas-drive-auto', 'al-hamoor-al-thahabi']);
const projects = fs.readdirSync(path.join(root, 'clients'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory()).map(({ name: slug }) => {
    const relative = `clients/${slug}`;
    const variants = fs.readdirSync(path.join(root, relative), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, relative, entry.name, 'package.json')))
      .map(({ name }) => name).sort((a, b) => ['auto-best', 'modern', 'carwow', 'rencar'].indexOf(a) - ['auto-best', 'modern', 'carwow', 'rencar'].indexOf(b));
    const candidate = candidates.find((item) => item.proposedClientPath === relative);
    return { slug, name: candidate?.name ?? slug, path: relative, variants,
      sourceState: variants.length ? (recovered.has(slug) ? 'recovered-unfinished' : 'existing-apps') : 'research-or-brief-only',
      reviewState: 'pending-owner-review', ...(slug === 'asko96' ? { aliasOf: 'asko-96' } : {}),
      ...(candidate ? { leadId: candidate.leadId } : {}) };
  }).sort((a, b) => a.slug.localeCompare(b.slug));
const absent = candidates.filter((item) => !projects.some((project) => project.path === item.proposedClientPath))
  .map(({ leadId, name, proposedClientPath }) => ({ leadId, name, proposedClientPath, sourceState: 'not-created' }));
const catalog = { schemaVersion: 1, updated: '2026-09-09', root: 'J:/cars', branch: 'main',
  note: 'Source inventory only. Installed dependencies, working routes, personalization and public delivery require separate verification.', projects, campaignCandidatesWithoutFolders: absent };
const three = projects.filter((item) => ['auto-best', 'modern', 'carwow'].every((key) => item.variants.includes(key)));
const other = projects.filter((item) => !three.includes(item));
const doc = `# Cars projects\n\nAll active source lives in \`J:\\cars\` on \`main\`. Each dealer has one folder; its designs stay together. The master library is in \`templates/\`. Do not create another session checkout.\n\nThis inventory has **${three.length} dealers with three application sources**, **${projects.filter((item) => item.variants.length === 1).length} dealer with one application**, and **${projects.filter((item) => !item.variants.length).length} research/brief folders**. Another **${absent.length} assigned candidates have no project folder**. Source presence is not completed personalization or visual acceptance.\n\n## Three-design review queue\n\nStart one dealer at a time. Keep Auto Best, Modern and Carwow on ports 6631, 6632 and 6633 unless explicitly choosing another free base port.\n\n\`\`\`powershell\n./scripts/start-client.ps1 -List\n./scripts/start-client.ps1 -Client navara-car -Prepare\n./scripts/start-client.ps1 -Client navara-car\n\`\`\`\n\n\`-Prepare\` installs missing dependencies from lockfiles and generates Modern's Prisma client locally. It does not start servers or connect a database. Starting checks every selected port and dependency first. Stop only the previous dealer's confirmed listeners before switching. The launcher records project paths and process IDs under \`runtime/\`. Inspect each design together in the browser before marking it accepted.\n\n| Dealer folder | Designs | Source status |\n| --- | --- | --- |\n${three.map((item) => `| [${item.slug}](../${item.path}/) | Auto Best / Modern / Carwow | ${item.sourceState === 'recovered-unfinished' ? 'Recovered; unfinished, review pending' : 'Existing; owner review pending'} |`).join('\n')}\n\n## Other existing folders\n\n| Folder | Contents |\n| --- | --- |\n${other.map((item) => `| [${item.slug}](../${item.path}/) | ${item.aliasOf ? `Legacy brief for ${item.aliasOf}; use that existing application folder` : item.variants.length ? item.variants.join(', ') : 'Research/handoff only; no application source'} |`).join('\n')}\n\n## Assigned but never created\n\n${absent.map((item) => `- ${item.name} — \`${item.proposedClientPath}\``).join('\n')}\n\nThese are retained research records, not missing Git pulls. Building them is a separate task.\n\n## Preservation and review\n\nSee [recovery record](LEAD-RECOVERY.md) for source checkpoints and local archives. Existing [manual review notes](MANUAL-REVIEW.md) remain intact; this inventory does not change their results. Regenerate this list with \`node scripts/index-clients.mjs\`. Machine-readable inventory: [clients/index.json](../clients/index.json). No recovered demo was deployed as part of consolidation.\n`;
fs.writeFileSync(path.join(root, 'clients/index.json'), JSON.stringify(catalog, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'docs/PROJECTS.md'), doc);
console.log(JSON.stringify({ folders: projects.length, threeDesignDealers: three.length, applications: projects.reduce((n, item) => n + item.variants.length, 0), researchOnly: projects.filter((item) => !item.variants.length).length, notCreated: absent.length }));
