import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSourceGraph } from './lib/source-graph.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// These are tooling entry points, not route dependencies. The seed CLI loads its module via Vite.
const entries = ['src/lib/server/seed/daynight-catalog-seed.ts', 'src/lib/data/mobile-media.ts'];
const graph = buildSourceGraph(root, entries);
if (graph.unresolved.length || graph.unreachable.length) {
	for (const { file, specifier } of graph.unresolved)
		console.error(`Unresolved local import: ${file} -> ${specifier}`);
	for (const { file } of graph.unreachable) console.error(`Unreachable source module: ${file}`);
	process.exitCode = 1;
} else {
	console.log(
		`Architecture: ${graph.records.length} source modules; no unresolved local imports or unreachable modules.`
	);
}
