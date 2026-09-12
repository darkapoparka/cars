import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

/** Compile real pure application modules for QA and image-export scripts. */
export async function loadDomain(entry, output = 'artifacts/domain-modules') {
  const root = process.cwd();
  const seen = new Set();
  async function compile(relative) {
    if (seen.has(relative)) return;
    seen.add(relative);
    const source = await readFile(path.join(root, relative), 'utf8');
    const dependencies = [];
    let code = ts.transpileModule(source, { compilerOptions: {
      target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022
    } }).outputText;
    code = code.replace(/from (['"])([^'"]+)\1/g, (whole, quote, specifier) => {
      const mapped = specifier.replace(/^\$data\//, 'src/lib/data/').replace(/^\$config\//, 'src/lib/config/');
      if (!mapped.startsWith('.') && !mapped.startsWith('src/')) return whole;
      const dependency = path.posix.normalize(mapped.startsWith('.') ? path.posix.join(path.posix.dirname(relative), mapped) : mapped).replace(/\.(?:m?js|ts)$/, '') + '.ts';
      dependencies.push(dependency);
      let link = path.posix.relative(path.posix.dirname(relative), dependency).replace(/\.ts$/, '.mjs');
      if (!link.startsWith('.')) link = './' + link;
      return `from ${quote}${link}${quote}`;
    });
    const destination = path.join(root, output, relative.replace(/\.ts$/, '.mjs'));
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, code);
    for (const dependency of dependencies) await compile(dependency);
  }
  await compile(entry);
  return import(pathToFileURL(path.join(root, output, entry.replace(/\.ts$/, '.mjs'))).href);
}
