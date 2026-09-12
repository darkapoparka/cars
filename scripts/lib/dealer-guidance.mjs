const commands = {
  'auto-best': {runtime:'Node 22.12+ on the 22 line; npm/package-lock.json', install:'npm ci', dev:'npm run dev -- --host 127.0.0.1 --port 6601 --strictPort', check:'npm run check && npm run build'},
  carwow: {runtime:'Use the locked Node runtime; npm/package-lock.json', install:'npm ci', dev:'npm exec vite dev -- --host 127.0.0.1 --port 6603 --strictPort', check:'npm run check && npm run build'},
  import: {runtime:'Use the locked Node runtime; npm/package-lock.json', install:'npm ci', dev:'npm run dev -- --host 127.0.0.1 --port 6602 --strictPort', check:'npm run check && npm run build'},
  modern: {runtime:'Node >=22.22.0 <23; pnpm 11.4.0; retain the whole workspace', install:'pnpm install --frozen-lockfile\npnpm --filter @repo/database build', dev:'pnpm --filter web exec next dev -H 127.0.0.1 -p 6602', check:'pnpm --filter web typecheck\npnpm --filter web build'}
};
export function dealerGuidance({slug, variants, workflowCommit, variant = null}) {
  const source = 'https://github.com/darkapoparka/cars/blob/' + (workflowCommit || 'main');
  const fence = String.fromCharCode(96).repeat(3);
  const selected = variant ? variants.filter(v => v.key === variant) : variants;
  const lines = [
    '# Dealer project: ' + slug + (variant ? ' / ' + variant : ''), '',
    'This is an independent personalized dealer copy. Canonical editable source is Cars clients/' + slug + '/. The dedicated dealer repository is a publishing mirror. Make lasting fixes in canonical source or the versioned packaging layer and regenerate; preserve unmatched mirror fixes first. This copy is not a reusable template master.', '',
    'Read local CLIENT.md and dealer.json (or their parent-directory copies), .client/project.json when present, and the relevant technical TEMPLATE.md. Shared policy: [Cars workflow](' + source + '/docs/WORKFLOW.md) and [publishing](' + source + '/docs/LEAD-PUBLISHING.md).', '',
    'Preserve this dealer identity, exact repository/domain and offered designs. Apply sourced facts to real data modules; metadata alone does not change the application. Protect layout and interactions during an ordinary correction. Sample forms do not prove delivery. Audit requests are read-only; publication never authorizes outreach.', '',
    '## Variant commands', ''
  ];
  for (const v of selected) {
    const c = commands[v.key];
    lines.push('### ' + v.key, '', 'Run from ' + (variant ? 'this variant directory' : v.key + '/') + '. ' + c.runtime + '. Use an explicitly free port and verify its owner.', '', fence + 'sh', c.install, c.dev, c.check, fence, '', 'Published entry: ' + v.entry + '. Exact template identity is in .client/project.json.');
    if (v.key === 'modern') lines.push('Read docs/QA.md for the static-demo environment before starting or building.');
    lines.push('');
  }
  lines.push('## Verification', '', 'For affected designs check entry, inventory, a real detail, contact/enquiry destination, navigation/filter and menu dismissal at 390 and 1440 px. In a mounted preview test the actual design switcher, deep links, assets, back navigation and console; include 320 px for the switcher. Do not submit external test messages. Record exact commit, deployment, date and evidence; owner review remains separate from agent QA.', '');
  return lines.join('\n');
}
export {commands as variantCommands};
