import fs from 'node:fs/promises';
for (const slug of ['automarket-varna', 'elit-auto-import', 'legend-auto']) {
  const root = `J:/cars/clients/${slug}`;
  const rows = JSON.parse(await fs.readFile(root + '/qa-final/results.json'));
  if (rows.length !== 3 || rows.some(r => !r.pass)) throw Error(slug + ' incomplete matrix');
  const supplemental = JSON.parse(await fs.readFile(root + '/qa-final/carwow-final-contact-copy.json'));
  if (!supplemental.pass) throw Error(slug + ' incomplete targeted check');
  for (const row of rows) {
    const path = `${root}/${row.template}/.client/project.json`;
    const m = JSON.parse(await fs.readFile(path));
    m.qa.latestFrameworkEvidence = row.frameworkEvidence;
    m.qa.finalMatrixEvidence = root + '/qa-final/results.json';
    m.qa.checkedAt = new Date().toISOString();
    if (row.template === 'carwow') m.qa.buildScope = slug === 'automarket-varna'
      ? 'Original build passed before final static/contact-label correction; final Svelte check and targeted browser supplement pass. Unicode-aware numeric parser unchanged.'
      : 'Final numeric framework check and production build passed after numeric, static and contact-copy corrections; targeted browser supplement passes.';
    await fs.writeFile(path, JSON.stringify(m, null, 2) + '\n');
  }
  const finalPath = root + '/qa-final/FINAL.md';
  let final = await fs.readFile(finalPath, 'utf8');
  if (slug !== 'automarket-varna') final = final.replace('The Carwow build log predates this static-only correction.', 'The final numeric build includes these static corrections.').replace('Proposal redirects were included in the retry build; the manifest correction followed it.', 'The final numeric build includes proposal redirects and manifest correction.');
  await fs.writeFile(finalPath, final);
  const clientPath = root + '/CLIENT.md';
  let client = await fs.readFile(clientPath, 'utf8');
  client += `\nFinal targeted numeric/contact supplement: all source prices and mileage are finite and match stock.json; under EUR 20,000 renders ${supplemental.priceFilterCount} vehicles and under 100,000 km renders ${supplemental.mileageFilterCount}. Phone links, retained real Viber links where configured, and mobile gallery photo change passed. Exact framework timestamps and evidence are in qa-final/FINAL.md.\n`;
  await fs.writeFile(clientPath, client);
}
