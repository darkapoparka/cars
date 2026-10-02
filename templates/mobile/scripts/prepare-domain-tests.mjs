import { mkdir, readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';
const files = [
  'types',
  'gallery',
  'filters',
  'catalog',
  'search',
  'assistant',
  'persistence',
  'model-groups',
  'make-selection',
  'make-picker-options',
  'model-picker',
  'navigation',
  'enquiry',
  'filter-fields',
  'native-filter-options',
  'native-filter-fields',
  'native-taxonomy',
  'showroom-services',
  'service-requests',
  'showroom-filter-editor',
  'vehicle-detail-navigation',
];
await mkdir('.qa/domain/native-data', { recursive: true });
for (const file of files) {
  const source = await readFile(`src/lib/${file}.ts`, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
  });
  const moduleText = outputText
    .replace(/from ['"]\.\/([\w-]+)['"]/g, "from './$1.mjs'")
    .replace(/from ['"](.+?)\.json['"]/g, "from '$1.mjs'");
  await writeFile(`.qa/domain/${file}.mjs`, moduleText);
}
for (const file of ['car-models', 'makes', 'filter-definitions', 'listing-details']) {
  const json = await readFile(`src/lib/native-data/${file}.json`, 'utf8');
  await writeFile(`.qa/domain/native-data/${file}.mjs`, `export default ${json};\n`);
}
