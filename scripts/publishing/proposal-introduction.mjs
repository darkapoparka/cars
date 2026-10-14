import fs from 'node:fs';

const START = '/* START CARS PROPOSAL INTRODUCTION v1 */';
const END = '/* END CARS PROPOSAL INTRODUCTION v1 */';
const source = fs.readFileSync(new URL('./proposal-introduction.js', import.meta.url), 'utf8');
const featureImages = ['vehicle','enquiries','viewings','editing','analytics','assistant'].map(name => `data:image/webp;base64,${fs.readFileSync(new URL(`./assets/feature-${name}.webp`, import.meta.url)).toString('base64')}`);

/** Preserve a reviewed selector and append the shared proposal controls. */
export function appendProposalIntroduction(selectorSource, proposal) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(proposal?.dealerId ?? '')) throw new Error('A valid dealerId is required.');
  if (typeof proposal.dealerName !== 'string' || !proposal.dealerName.trim() || proposal.dealerName.length > 120) throw new Error('A concise dealerName is required.');
  let adminOrigin;
  if (proposal.adminOrigin) {
    const admin = new URL(proposal.adminOrigin);
    if (admin.username || admin.password || admin.pathname !== '/' || admin.search || admin.hash || !(admin.origin === 'https://cars-admin-blue.vercel.app' || (admin.protocol === 'http:' && ['localhost','127.0.0.1'].includes(admin.hostname)))) throw new Error('A trusted adminOrigin is required.');
    adminOrigin = admin.origin;
  }
  if (!selectorSource.includes('__CARS_SWITCHER_CONFIG__') && !selectorSource.includes('embeddedConfig')) throw new Error('The reviewed selector is required.');
  const configText = selectorSource.match(/const embeddedConfig = (\{[^\r\n]*\});/)?.[1];
  let selectorConfig;
  try { selectorConfig = JSON.parse(configText); } catch { throw new Error('The reviewed six-design selector configuration is required.'); }
  const families = ['auto-best','modern','import','app','mobile','karento-best'];
  if (selectorConfig.variants?.length !== families.length || families.some(family => selectorConfig.variants.filter(variant => variant.key === family).length !== 1)) {
    throw new Error('Exactly one of each approved six-design family is required.');
  }
  const start = selectorSource.indexOf(START), end = selectorSource.indexOf(END);
  if ((start >= 0) !== (end >= 0) || (start >= 0 && end < start)) throw new Error('Incomplete introduction marker.');
  const retained = start < 0 ? selectorSource : selectorSource.slice(0,start).trimEnd() + selectorSource.slice(end + END.length);
  const config = JSON.stringify({ enabled:true, dealerId:proposal.dealerId, dealerName:proposal.dealerName.trim(), ...(adminOrigin ? {adminOrigin} : {}) }).replaceAll('<','\\u003c');
  const bundled = source.replace('__CARS_PROPOSAL_INTRO__', () => config).replace('__CARS_FEATURE_IMAGES__', () => JSON.stringify(featureImages));
  return `${retained.trimEnd()}\n\n${START}\n${bundled}\n${END}\n`;
}
