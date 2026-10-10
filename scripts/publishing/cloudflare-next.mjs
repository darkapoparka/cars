import { createHash } from 'node:crypto';

// Provider-only overlay. Templates and application routes retain their native
// request behavior; this module does not turn SSR applications into an SPA.
export const CLOUDFLARE_NEXT_VERSION = '1';
export const CLOUDFLARE_NEXT_PINS = Object.freeze({
  vinext: '1.1.0', vite: '8.3.4', '@vitejs/plugin-rsc': '0.5.36',
  '@cloudflare/vite-plugin': '1.63.1', wrangler: '4.149.0',
  '@vinext/cloudflare': '1.1.0', '@stylexjs/unplugin': '0.19.1', unplugin: '2.3.11'
});
const services = { modern: 'modern/apps/web', app: 'app', mobile: 'mobile' };
const digest = value => createHash('sha256').update(value).digest('hex');
const encode = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
const text = (files, name) => {
  if (!files.has(name)) throw Error('Missing Next Cloudflare source: ' + name);
  return Buffer.from(files.get(name)).toString('utf8').replaceAll('\r\n', '\n');
};
function generated(files, name, value) {
  if (files.has(name)) throw Error('Occupied Next Cloudflare adapter path: ' + name);
  files.set(name, Buffer.from(value));
}
function retainCommonJs(files, root, name, retained) {
  const original = root + '/' + name;
  const contents = text(files, original);
  if (!/\bmodule\.exports\s*=/.test(contents)) throw Error('Unknown CommonJS adapter boundary: ' + original);
  generated(files, root + '/' + retained, contents);
  files.delete(original);
  return contents;
}
function stylexConfiguration() {
  return `import { createRequire } from 'node:module';
import stylex from '@stylexjs/unplugin';
const sourceBabel = createRequire(import.meta.url)('./cars-babel-source.cjs');
const sourceStylex = sourceBabel.plugins.filter(entry => Array.isArray(entry) && entry[0] === '@stylexjs/babel-plugin');
if (sourceStylex.length !== 1) throw new Error('Expected one approved StyleX compiler configuration');
const stylexPlugin = stylex.vite({
  ...sourceStylex[0][1], useCSSLayers: true,
  dev: false, runtimeInjection: false, devMode: 'off',
});
`;
}
function viteConfiguration(stylex) {
  return `// Generated Cloudflare publisher configuration; canonical templates remain Next.js.
import { defineConfig } from 'vite';
import vinext from 'vinext';
import { cloudflare } from '@cloudflare/vite-plugin';
${stylex ? stylexConfiguration() : ''}
export default defineConfig({
  plugins: [
    ${stylex ? 'stylexPlugin,' : ''}
    vinext(),
    cloudflare({ viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] } }),
  ],
  build: { target: ['chrome111', 'edge111', 'firefox111', 'safari16.4'] },
});
`;
}
function modernTrustedCountry(files) {
  const name = 'modern/packages/internationalization/request.ts';
  const original = 'process.env.VERCEL === "1"\n          ? request.headers.get("x-vercel-ip-country")\n          : null';
  const source = text(files, name);
  if (source.split(original).length !== 2) throw Error('Modern trusted country boundary changed; review the provider adapter');
  files.set(name, Buffer.from(source.replace(original,
    'process.env.CARS_CLOUDFLARE_PROVIDER === "1"\n          ? request.headers.get("x-cars-country")\n          : process.env.VERCEL === "1"\n            ? request.headers.get("x-vercel-ip-country")\n            : null')));
}
function modernReact(files, changes) {
  // Vinext 1.1.0 requires ^19.2.6. Record this generated-only security/runtime
  // alignment explicitly instead of silently loosening upstream peer checks.
  for (const name of [...files.keys()].sort()) {
    if (!/^modern\/(?:apps|packages)\/[^/]+\/package\.json$/.test(name)) continue;
    const pkg = JSON.parse(text(files, name)); let changed = false;
    for (const field of ['dependencies', 'devDependencies', 'peerDependencies']) {
      for (const dep of ['react', 'react-dom']) {
        if (pkg[field]?.[dep] !== '19.2.4') continue;
        changes.push({ file: name, field, dependency: dep, from: '19.2.4', to: '19.2.6' });
        pkg[field][dep] = '19.2.6'; changed = true;
      }
    }
    if (changed) files.set(name, encode(pkg));
  }
}

export function applyCloudflareNext(inputFiles, manifest, { workerPrefix = 'cars-' + manifest?.slug, dependencyLocks } = {}) {
  if (!(inputFiles instanceof Map)) throw Error('Next Cloudflare adapter requires a source file map');
  if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(workerPrefix) || workerPrefix.length > 54) throw Error('Invalid Cloudflare Worker prefix');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest?.slug ?? '')) throw Error('Invalid Next Cloudflare dealer slug');
  const selected = (manifest.variants ?? []).filter(({ key }) => Object.hasOwn(services, key));
  if (!selected.length || new Set(selected.map(({ key }) => key)).size !== selected.length) throw Error('Missing or duplicate Next Cloudflare services');
  const files = new Map(inputFiles), adaptations = [], targets = [];
  for (const { key, base } of selected) {
    const allowed = key === 'modern' ? ['/variant-2', '/variant-3'] : [key === 'app' ? '/variant-4' : '/variant-5'];
    if (!allowed.includes(base)) throw Error('Invalid Next Cloudflare native mount: ' + key);
    const root = services[key], packageName = root + '/package.json';
    const originalPackage = text(files, packageName), pkg = JSON.parse(originalPackage);
    const lockPath = key === 'modern' ? 'modern/pnpm-lock.yaml' : key + '/package-lock.json';
    const sourceLockSha256 = digest(text(files, lockPath));
    if (!pkg.dependencies?.next) throw Error(key + ': approved Next.js dependency is missing');
    const sourceReact = pkg.dependencies.react;
    const react = key === 'modern' && sourceReact === '19.2.4' ? '19.2.6' : sourceReact?.replace(/^[~^]/, '');
    if (!/^19\.(?:2\.(?:[6-9]|[1-9]\d+)|[3-9]\.\d+)$/.test(react ?? '')) throw Error(key + ': React runtime is incompatible with pinned vinext 1.1.0');
    generated(files, root + '/cars-next-source-package.json', originalPackage);
    if (key === 'modern') modernReact(files, adaptations);
    pkg.type = 'module';
    pkg.dependencies = { ...pkg.dependencies, react, 'react-dom': react, vinext: CLOUDFLARE_NEXT_PINS.vinext, 'react-server-dom-webpack': react };
    pkg.devDependencies = { ...pkg.devDependencies,
      vite: CLOUDFLARE_NEXT_PINS.vite, '@vitejs/plugin-rsc': CLOUDFLARE_NEXT_PINS['@vitejs/plugin-rsc'],
      '@cloudflare/vite-plugin': CLOUDFLARE_NEXT_PINS['@cloudflare/vite-plugin'], wrangler: CLOUDFLARE_NEXT_PINS.wrangler,
      '@vinext/cloudflare': CLOUDFLARE_NEXT_PINS['@vinext/cloudflare'],
      ...(key === 'modern' ? {} : { '@stylexjs/unplugin': CLOUDFLARE_NEXT_PINS['@stylexjs/unplugin'], unplugin: CLOUDFLARE_NEXT_PINS.unplugin })
    };
    pkg.scripts = { ...pkg.scripts, 'check:cloudflare': 'vinext check', 'build:cloudflare': 'vite build', 'dev:cloudflare': 'vite dev' };
    files.set(packageName, encode(pkg));
    if (key !== 'modern') {
      const originalConfig = retainCommonJs(files, root, 'next.config.js', 'cars-next-source.cjs');
      generated(files, root + '/next.config.mjs', "// Original native Next configuration, preserved through a Node CJS boundary.\nimport { createRequire } from 'node:module';\nconst nextConfig = createRequire(import.meta.url)('./cars-next-source.cjs');\nexport default nextConfig;\n");
      const compiler = retainCommonJs(files, root, 'babel.config.js', 'cars-babel-source.cjs');
      const postcss = retainCommonJs(files, root, 'postcss.config.js', 'cars-postcss-source.cjs');
      if (!compiler.includes('@stylexjs/babel-plugin') || !postcss.includes('@stylexjs/postcss-plugin') || !postcss.includes('autoprefixer')) throw Error(key + ': unknown StyleX source compilation boundary');
      // StyleX is compiled exactly once by its official Vite plugin; keep the
      // original PostCSS definition as source evidence, and preserve prefixing.
      generated(files, root + '/postcss.config.cjs', "module.exports = { plugins: { autoprefixer: {} } };\n");
      adaptations.push({ file: root + '/next.config.mjs', operation: 'delegate-original-commonjs', sourceSha256: digest(originalConfig) });
      adaptations.push({ file: root + '/vite.config.ts', operation: 'stylex-vite', compilerSha256: digest(compiler), postcssSha256: digest(postcss) });
    } else modernTrustedCountry(files);
    const workerName = workerPrefix + '-' + key;
    generated(files, root + '/vite.config.ts', viteConfiguration(key !== 'modern'));
    generated(files, root + '/wrangler.jsonc', encode({
      $schema: 'node_modules/wrangler/config-schema.json', name: workerName,
      compatibility_date: '2026-10-10', compatibility_flags: ['nodejs_compat'],
      main: 'vinext/server/app-router-entry', workers_dev: false,
      assets: { binding: 'ASSETS', not_found_handling: 'none', run_worker_first: false },
      vars: { NEXT_PUBLIC_BASE_PATH: base, CARS_CLOUDFLARE_PROVIDER: '1' },
      observability: { enabled: true },
    }));
    const ignore = root + '/.gitignore';
    files.set(ignore, Buffer.from((files.has(ignore) ? text(files, ignore).trimEnd() + '\n' : '') + '/dist/\n/.vinext/\n/.wrangler/\n/.cloudflare/\n'));
    targets.push({ key, root, base, workerName, node: '22.23.2', packageManager: key === 'modern' ? 'pnpm@11.4.0' : 'npm',
      config: root + '/wrangler.jsonc', generatedConfig: root + '/dist/server/wrangler.json', assets: root + '/dist/client',
      main: root + '/dist/server/index.js', react,
      environment: { NEXT_PUBLIC_BASE_PATH: base, CARS_CLOUDFLARE_PROVIDER: '1' },
      sourcePackageSha256: digest(originalPackage), sourceLockSha256, generatedPackageSha256: digest(files.get(packageName)), lockPath });
  }
  generated(files, 'scripts/build-cloudflare-next.mjs', cloudflareNextBuildHelper());
  generated(files, '.cars-cloudflare-next.json', encode({ schemaVersion: 1, adapter: 'cars-cloudflare-vinext-v1', version: CLOUDFLARE_NEXT_VERSION,
    dealer: manifest.slug, pins: CLOUDFLARE_NEXT_PINS, targets, adaptations,
    dependencyLock: 'requires-generated-lock-and-install-proof', build: 'unverified', hosted: 'unverified', freeTier: 'unverified' }));
  return dependencyLocks ? freezeCloudflareNextDependencies(files, dependencyLocks) : files;
}

// Materialize qualified dependency locks BEFORE the publisher seals the final
// source package. Upload/build commands never gain permission to rewrite them.
export function freezeCloudflareNextDependencies(inputFiles, frozenLocks) {
  const files = new Map(inputFiles), receipt = JSON.parse(text(files, '.cars-cloudflare-next.json'));
  if (receipt.adapter !== 'cars-cloudflare-vinext-v1' || receipt.version !== CLOUDFLARE_NEXT_VERSION || !Array.isArray(frozenLocks)) throw Error('Invalid Next Cloudflare frozen dependency adapter');
  if (new Set(frozenLocks.map(item => item.key)).size !== frozenLocks.length || frozenLocks.length !== receipt.targets.length) throw Error('Frozen dependency locks must cover every selected Next service exactly once');
  const locks = [];
  for (const target of receipt.targets) {
    const frozen = frozenLocks.find(item => item.key === target.key);
    if (frozen?.schemaVersion !== 1 || frozen.adapter !== receipt.adapter || frozen.node !== 'v22.23.2'
      || frozen.sourcePackageSha256 !== target.sourcePackageSha256
      || frozen.sourceLockSha256 !== target.sourceLockSha256
      || frozen.generatedPackageSha256 !== target.generatedPackageSha256
      || frozen.generatedPackageSha256 !== digest(files.get(target.root + '/package.json'))
      || frozen.lockPath !== target.lockPath || typeof frozen.lockText !== 'string'
      || frozen.lockSha256 !== digest(Buffer.from(frozen.lockText))) throw Error('Qualified dependency input mismatch: ' + target.key);
    const pkg = JSON.parse(text(files, target.root + '/package.json'));
    for (const name of ['vinext', 'vite', '@vitejs/plugin-rsc', '@cloudflare/vite-plugin', 'wrangler', 'react', 'react-dom', 'react-server-dom-webpack', ...(target.key === 'modern' ? [] : ['@stylexjs/unplugin', 'unplugin'])]) {
      if (frozen.installedPins?.[name] !== (pkg.dependencies?.[name] ?? pkg.devDependencies?.[name])) throw Error('Qualified runtime pin mismatch: ' + target.key + '/' + name);
    }
    if (target.key !== 'modern') {
      const lock = JSON.parse(frozen.lockText);
      if (lock.lockfileVersion !== 3 || !lock.packages?.['']) throw Error('Expected qualified npm lock v3: ' + target.key);
      const sorted = value => JSON.stringify(Object.entries(value ?? {}).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      for (const field of ['dependencies', 'devDependencies']) if (sorted(lock.packages[''][field]) !== sorted(pkg[field])) throw Error('Qualified npm lock root differs from generated package: ' + target.key);
    } else if (!/^lockfileVersion:\s*['"]?9\.0/m.test(frozen.lockText) || !frozen.lockText.includes('vinext:')) throw Error('Expected qualified pnpm 11 lock: modern');
    files.set(target.lockPath, Buffer.from(frozen.lockText));
    locks.push({ key: target.key, path: target.lockPath, sha256: frozen.lockSha256, generatedPackageSha256: frozen.generatedPackageSha256 });
  }
  files.set('.cars-cloudflare-next.json', encode({ ...receipt, dependencyLock: 'frozen', locks }));
  return files;
}

export function cloudflareNextBuildHelper() {
  return `import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const packageRoot=path.resolve(import.meta.dirname,'..');
const receipt=JSON.parse(fs.readFileSync(path.join(packageRoot,'.cars-cloudflare-next.json'),'utf8'));
const [phase,key]=process.argv.slice(2);
if(!['install','prove','check','build','freeze'].includes(phase)||process.argv.length!==4) throw Error('Usage: node scripts/build-cloudflare-next.mjs install|prove|check|build|freeze modern|app|mobile');
const target=receipt.targets.find(item=>item.key===key);
if(!target||receipt.adapter!=='cars-cloudflare-vinext-v1') throw Error('Invalid generated Next Cloudflare target');
if(process.version!=='v22.23.2') throw Error('Use pinned Node 22.23.2 for the Next Cloudflare build');
const cwd=path.join(packageRoot,target.root), dependencyRoot=path.join(packageRoot,key);
if(!cwd.startsWith(packageRoot+path.sep)||!dependencyRoot.startsWith(packageRoot+path.sep)) throw Error('Target outside generated package');
for(let dir=packageRoot;;dir=path.dirname(dir)){
  if(fs.existsSync(path.join(dir,'templates.lock.json'))&&!packageRoot.startsWith(path.join(dir,'runtime')+path.sep)) throw Error('Cloudflare helper runs only in generated packages');
  if(dir===path.dirname(dir))break;
}
const environment={...process.env,...target.environment,NODE_ENV:phase==='build'?'production':'development'};
for(const name of Object.keys(environment))if(name.toLowerCase()==='path')delete environment[name];
environment[process.platform==='win32'?'Path':'PATH']=path.dirname(process.execPath)+path.delimiter+(Object.entries(process.env).find(([name])=>name.toLowerCase()==='path')?.[1]??'');
function run(args,where=cwd){const r=spawnSync(process.execPath,args,{cwd:where,env:environment,stdio:'inherit',windowsHide:true});if(r.error||r.status!==0)throw Error('Next Cloudflare command failed: '+(r.error?.message??r.status));}
const npmCli=path.join(path.dirname(process.execPath),'node_modules/npm/bin/npm-cli.js');
const require=createRequire(path.join(cwd,'package.json'));
function packageInfo(name){for(const directory of require.resolve.paths(name)??[]){const file=path.join(directory,name,'package.json');if(fs.existsSync(file)){const pkg=JSON.parse(fs.readFileSync(file,'utf8'));if(pkg.name===name)return {directory:path.dirname(file),pkg};}}throw Error('Installed package is missing: '+name);}
function bin(name,command){const info=packageInfo(name),relative=typeof info.pkg.bin==='string'?info.pkg.bin:info.pkg.bin?.[command];if(!relative)throw Error('Installed compiler has no expected bin: '+name);return path.resolve(info.directory,relative);}
const hash=value=>createHash('sha256').update(value).digest('hex');
const proofFile=path.join(packageRoot,'.cars-next-'+key+'-dependencies.json');
function inputs(){const rows=[];function add(file){if(fs.existsSync(file))rows.push([path.relative(dependencyRoot,file).replaceAll('\\\\','/'),hash(fs.readFileSync(file))]);}
  add(path.join(dependencyRoot,'package.json'));add(path.join(dependencyRoot,key==='modern'?'pnpm-lock.yaml':'package-lock.json'));add(path.join(dependencyRoot,'pnpm-workspace.yaml'));
  if(key==='modern')for(const family of ['apps','packages'])for(const name of fs.readdirSync(path.join(dependencyRoot,family)))add(path.join(dependencyRoot,family,name,'package.json'));
  return hash(JSON.stringify(rows.sort()));}
function sourceInputs(){const rows=[];const ignored=new Set(['node_modules','.git','dist','runtime','.vinext','.wrangler','.cloudflare','.turbo']);
  function visit(directory){for(const item of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){if(ignored.has(item.name)||item.name.startsWith('.next')||item.name==='next-env.d.ts'||item.name.endsWith('.tsbuildinfo'))continue;const file=path.join(directory,item.name);if(/packages[\\\\/]database[\\\\/]generated(?:[\\\\/]|$)/.test(file))continue;if(item.isSymbolicLink())throw Error('Linked generated source requires review: '+file);if(item.isDirectory())visit(file);else if(item.isFile())rows.push([path.relative(packageRoot,file).replaceAll('\\\\','/'),hash(fs.readFileSync(file))]);}}
  visit(dependencyRoot);for(const name of ['dealer.json','.cars-cloudflare-next.json','scripts/build-cloudflare-next.mjs']){const file=path.join(packageRoot,name);if(fs.existsSync(file))rows.push([name,hash(fs.readFileSync(file))]);}
  return hash(JSON.stringify(rows.sort()));}
function verifyPins(){const pkg=JSON.parse(fs.readFileSync(path.join(cwd,'package.json'),'utf8')),installed={};
  for(const name of ['vinext','vite','@vitejs/plugin-rsc','@cloudflare/vite-plugin','wrangler','react','react-dom','react-server-dom-webpack',...(key==='modern'?[]:['@stylexjs/unplugin','unplugin'])]){
    const wanted=pkg.dependencies?.[name]??pkg.devDependencies?.[name],actual=packageInfo(name).pkg.version;
    if(actual!==wanted)throw Error('Installed runtime version mismatch: '+name+' '+actual+' != '+wanted);installed[name]=actual;
  }
  return installed;
}
if(phase==='prove'){
  const proof=fs.existsSync(proofFile)?JSON.parse(fs.readFileSync(proofFile,'utf8')):null;
  if(!proof||proof.node!==process.version||proof.digest!==inputs())throw Error('Dependency installation cannot be reused after changed inputs');
  verifyPins();fs.writeFileSync(proofFile,JSON.stringify({...proof,sourceDigest:sourceInputs()})+'\\n');
}else if(phase==='install'){
  if(key==='modern')run([npmCli,'exec','--yes','--package=pnpm@11.4.0','--','pnpm','install',receipt.dependencyLock==='frozen'?'--frozen-lockfile':'--no-frozen-lockfile','--prod=false'],dependencyRoot);
  else run([npmCli,receipt.dependencyLock==='frozen'?'ci':'install','--include=dev'],dependencyRoot);
  verifyPins();fs.writeFileSync(proofFile,JSON.stringify({schemaVersion:1,node:process.version,digest:inputs(),sourceDigest:sourceInputs()})+'\\n');
}else{
  const proof=fs.existsSync(proofFile)?JSON.parse(fs.readFileSync(proofFile,'utf8')):null;
  if(!proof||proof.digest!==inputs()||proof.sourceDigest!==sourceInputs())throw Error('Run install to seal the current generated dependency lock and source');
  const installedPins=verifyPins();
  if(phase==='freeze'){
    const lockText=fs.readFileSync(path.join(packageRoot,target.lockPath),'utf8');
    const frozen={schemaVersion:1,adapter:receipt.adapter,key,node:process.version,sourcePackageSha256:target.sourcePackageSha256,sourceLockSha256:target.sourceLockSha256,generatedPackageSha256:hash(fs.readFileSync(path.join(cwd,'package.json'))),lockPath:target.lockPath,lockSha256:hash(Buffer.from(lockText)),lockText,installedPins};
    fs.writeFileSync(path.join(packageRoot,'.cars-next-'+key+'-frozen-lock.json'),JSON.stringify(frozen,null,2)+'\\n');
    console.log(JSON.stringify({key,phase,lockSha256:frozen.lockSha256}));
  }else run([bin('vinext','vinext'),'check']);
  if(phase==='build'){
    if(key==='modern')run([npmCli,'exec','--yes','--package=pnpm@11.4.0','--','pnpm','--filter','@repo/database','build'],dependencyRoot);
    run([bin('vite','vite'),'build']);
    if(proof.sourceDigest!==sourceInputs())throw Error('Generated Next Cloudflare source changed during build');
    for(const file of [target.generatedConfig,target.main])if(!fs.existsSync(path.join(packageRoot,file)))throw Error('Missing Cloudflare build artifact: '+file);
    // Vite emits compiled assets beneath basePath but copies public namespaces
    // to the asset root. Place only generated copies at their published mount.
    const publicRoot=path.join(cwd,'public'),assetRoot=path.join(packageRoot,target.assets),mounted=path.join(assetRoot,target.base.slice(1));
    if(!mounted.startsWith(assetRoot+path.sep))throw Error('Unbounded generated asset mount');
    fs.mkdirSync(mounted,{recursive:true});
    for(const item of fs.readdirSync(publicRoot,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
      if(item.name==='preview-switcher.js')continue;
      if(item.isSymbolicLink())throw Error('Linked public source requires review');
      const from=path.join(assetRoot,item.name),to=path.join(mounted,item.name);
      if(!from.startsWith(assetRoot+path.sep)||!to.startsWith(mounted+path.sep))throw Error('Unbounded generated public namespace');
      if(!fs.existsSync(from))throw Error('Missing emitted public namespace: '+item.name);
      if(fs.existsSync(to))throw Error('Occupied mounted public namespace: '+item.name);
      fs.renameSync(from,to);
    }
    console.log(JSON.stringify({key,phase,worker:target.workerName,config:target.generatedConfig,assets:target.assets,hosted:'unverified',freeTier:'unverified'}));
  }
}
`;
}
