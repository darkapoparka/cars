import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
import {scopedGlobalsSource,scopeCompiledModule,singleWorkerSource} from './package-uk-single-worker.mjs';
const require=createRequire(process.env.CARS_ESBUILD_RESOLVE_FROM||import.meta.url),esbuild=require('esbuild');
const uri=(source,tag)=>'data:text/javascript;base64,'+Buffer.from(source+'\n// '+tag).toString('base64');
test('framework registries are separate while native constructors remain native',async()=>{
 const a=(await import(uri(scopedGlobalsSource(),'a'))).frameworkGlobal,b=(await import(uri(scopedGlobalsSource(),'b'))).frameworkGlobal;
 a.__vite_rsc_require__=()=>'A';b.__vite_rsc_require__=()=>'B';
 assert.equal(a.__vite_rsc_require__(),'A');assert.equal(b.__vite_rsc_require__(),'B');assert.equal(globalThis.__vite_rsc_require__,undefined);
 const key=Symbol.for('vinext.als.registry');a[key]=new Set([1]);assert.equal(b[key],globalThis[key]);assert.notEqual(a[key],b[key]);
 assert.equal(a.Response,Response);assert.equal(b.URL,URL);assert.equal(a.crypto,globalThis.crypto);assert.equal(a.globalThis,a);assert.equal(b.global,b);
 delete a.__vite_rsc_require__;assert.equal(a.__vite_rsc_require__,undefined);assert.equal(b.__vite_rsc_require__(),'B');
});
test('AST scoping rewrites only executable globals and retains client-script literals',async()=>{
 const source='globalThis.__vite_rsc_require__=()=>"modern";export const current=()=>__vite_rsc_require__();export const literal="globalThis.__vite_rsc_require__";';
 const scope=uri(scopedGlobalsSource(),'scope-modern'),output=scopeCompiledModule(source,scope,esbuild),module=await import(uri(output,'module-modern'));
 assert.equal(module.current(),'modern');assert.equal(module.literal,'globalThis.__vite_rsc_require__');assert.equal(globalThis.__vite_rsc_require__,undefined);
 const source2=source.replace('"modern"','"mobile"'),module2=await import(uri(scopeCompiledModule(source2,uri(scopedGlobalsSource(),'scope-mobile'),esbuild),'module-mobile'));
 assert.deepEqual(await Promise.all([Promise.resolve(module.current()),Promise.resolve(module2.current())]),['modern','mobile']);
});
test('one public router preserves six existing application bindings and their original request objects',()=>{
 const source=singleWorkerSource();for(const key of ['AUTO_BEST','MODERN','IMPORT','APP','MOBILE','KARENTO_BEST'])assert.ok(source.includes('CARS_'+key+':{fetch:r=>'));
 assert.equal((source.match(/\.fetch\(r,env,ctx\)/g)||[]).length,6);assert.ok(source.includes('router.fetch(request,bindings)'));assert.ok(!source.includes('new URL('));
});

test('generated entry is valid ECMAScript even for the Import design key',()=>{assert.doesNotThrow(()=>esbuild.transformSync(singleWorkerSource(),{format:'esm',target:'es2022'}));});
