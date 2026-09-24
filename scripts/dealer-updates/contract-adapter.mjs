import fs from 'node:fs';
import path from 'node:path';
import { applyRefreshAdapter } from '../lib/client-refresh-adapters.mjs';
import { contractForTemplate, DEALER_CONTENT_CONTRACT_VERSION } from './dealer-content-contract.mjs';

function requiredPaths(contract) {
  const values = [contract.identity.path, contract.inventory.path];
  for (const value of Object.values(contract.locale)) {
    if (typeof value === 'string') values.push(value);
    else if (value?.path) values.push(value.path);
    else if (value?.config) values.push(value.config);
    else if (value?.catalog) values.push(value.catalog);
    else if (value?.copy) values.push(value.copy);
  }
  return [...new Set(values)];
}

/** Run the existing framework-specific Svelte/Next adapter and verify it still
 * writes each declared content schema. Unrecognized adapter targets stay in
 * the plan/diff so custom code changes are visible to the reviewer. */
export function applyContractAdapter(options) {
  const contract = contractForTemplate(options.key);
  const changed = applyRefreshAdapter(options).map(value => String(value).replaceAll('\\', '/'));
  const missing = requiredPaths(contract).filter(required => !changed.some(item => item === required || item.startsWith(required + ' ')));
  if (missing.length) throw new Error(`${options.key}: adapter no longer writes declared content boundaries: ${missing.join(', ')}`);
  for (const value of Object.values(contract.locale)) {
    if (!value || typeof value !== 'object' || !value.field) continue;
    const file = path.join(options.candidate, value.path);
    if (!fs.existsSync(file) || !fs.readFileSync(file, 'utf8').includes(`${value.field}:`)) {
      throw new Error(`${options.key}: adapter did not emit localized field ${value.field} in ${value.path}`);
    }
  }
  return {
    contractVersion: DEALER_CONTENT_CONTRACT_VERSION,
    changed: [...new Set(changed)].sort()
  };
}
