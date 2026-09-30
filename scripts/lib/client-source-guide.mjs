const cell = value => String(value ?? 'Not recorded').replaceAll('|', '/').replaceAll('\n', ' ');
export function clientSourceGuide(registry) {
  const deployed = registry.dealers.filter(d => d.delivery?.url).sort((a,b)=>a.slug.localeCompare(b.slug));
  const lines = [
    '# Where the dealer projects live', '',
    'All current dealer source folders are under `L:/CODEX/cars/clients/<slug>/`. This includes prospect demos; the word clients does not mean that the business has bought a site.', '',
    '## Navara example', '',
    '`clients/navara-car/` contains `auto-best/`, `modern/`, `carwow/`, `app/`, the dealer manifest and shared branding assets. The folder name is **navara-car**, while its publishing repository and Vercel project use **cars-navaracar**.', '',
    '`Cars clients/navara-car source -> reviewed package/export -> darkapoparka/cars-navaracar -> Vercel cars-navaracar`', '',
    'Vercel deploys the dedicated repository. A local edit or folder move does not update the hosted site. Use the timestamped source, deployment and browser evidence in the registry; compare current GitHub source and preserved local changes before publishing.', '',
    '## One visible folder; two existing Git ownership modes', '',
    '**Cars-owned:** Most dealer folders are source in the Cars repository. Their dedicated GitHub repositories contain the deployable packages. Use Cars packaging/export tools and preserve any publishing-only fixes.', '',
    '**Independent:** `al-reef-used-cars/` sits beside the other dealers but keeps its own `.git` and `darkapoparka/cars-alreefusedcars` repository. Cars explicitly ignores that application tree. Open/publish the independent repository directly; never run the legacy Cars exporter over it. Independent means Git ownership, not a second client-directory location.', '',
    '`L:/CODEX/cars-clients` was the old one-dealer pilot container and has been removed. The old I: compatibility path points to the shared clients directory. Recovery snapshots are not active source.', '',
    '`L:/CODEX/cars` is the canonical Cars workspace. `J:/cars` is a compatibility junction to it. Former `J:/template-repos` copies are recovery material; current template masters live under `templates/` in Cars.', '',
    '## Registered public dealer projects', '',
    `The registry contains ${deployed.length} dealer public aliases below. These rows are generated from ../docs/DEPLOYMENT-INVENTORY.json; they are a source-location guide, not a fresh visual acceptance report.`, '',
    '| Dealer / local folder | Source ownership | Publishing repository | Vercel project | Public website |',
    '| --- | --- | --- | --- | --- |'
  ];
  for (const d of deployed) {
    const repo = d.hostingObservation?.repository || d.delivery.gitRepository || d.repository;
    const own = d.sourceOwnership === 'independent-repository' ? 'Own Git repository (not tracked by Cars)' : 'Cars repository';
    lines.push(`| ${cell(d.name)} — \`${cell(d.slug)}/\` | ${own} | [${cell(repo)}](https://github.com/${repo}) | \`${cell(d.delivery.projectName)}\` | [${cell(new URL(d.delivery.url).hostname)}](${d.delivery.url}) |`);
  }
  lines.push('', '## Source-map verification', '');
  if (registry.sourceMap) lines.push(`Checked ${cell(registry.sourceMap.checkedAt)}: ${registry.sourceMap.registeredDeployedDealers} registered dealer folders and ${registry.sourceMap.localVariantDirectories} local application folders. This establishes presence, not equality with hosted code.`, '');
  const observed = deployed.filter(d=>d.hostingObservation);
  if (observed.length) {
    lines.push('The following provider metadata was read directly; other hosting names above come from recorded registry data. Existing build/browser evidence is retained separately.', '', '| Dealer | Provider-reported commit | Observed ref | Checked |', '| --- | --- | --- | --- |');
    for (const d of observed) { const o=d.hostingObservation; lines.push(`| ${d.slug} | \`${o.commit}\` | \`${o.ref}\` | ${o.checkedAt} |`); }
  }
  lines.push('', '## Other folders are not another deployed fleet', '',
    'The remaining entries under clients/ include research-only prospects, unfinished work, aliases and retained recovery material. Do not infer a deployment, sale, or outreach event from a folder name. The table above is the deployed-project directory; the full technical inventory is ../docs/DEPLOYMENTS.md.', '',
    'Day & Night and IS-AUTO previously had source omitted by a sparse checkout. Their active dealer folders are now under the shared clients directory. Read dealer.json for the actual offered designs and the registry for dated release evidence; recovering a folder alone does not publish it.', '',
    '## Find, edit and publish', '',
    '1. Search this page by the Vercel project name, repository name or dealer name. Open the matching local folder.',
    '2. Read dealer.json and the folder instructions. Keep every declared design and the shared business assets together.',
    '3. Use the recorded source owner: Cars packaging/export for Cars-owned folders; the dedicated checkout for Al Reef.',
    '4. Publish only reviewed source, then verify the public alias. A folder move, source commit and hosted release are separate steps.', '',
    'Regenerate this page and the other registry views with `node scripts/index-deployments.mjs --views-only`. This command does not deploy or overwrite dealer applications.', '');
  return lines.join('\n');
}
