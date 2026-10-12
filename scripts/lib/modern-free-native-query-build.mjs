import {createHash} from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs';
import {gzipSync,gunzipSync} from 'node:zlib';
import {pathToFileURL} from 'node:url';
import {planThreeWayUpgrade} from '../dealer-updates/three-way-upgrade.mjs';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
const hex=(value,n)=>typeof value==='string'&&new RegExp('^[a-f0-9]{'+n+'}$').test(value);
const exact=(value,keys)=>value&&typeof value==='object'&&!Array.isArray(value)&&JSON.stringify(Object.keys(value).sort())===JSON.stringify([...keys].sort());
const fail=message=>{throw Error('Modern native query producer: '+message);};
const safe=value=>typeof value==='string'&&value.length<512&&value.split('/').every(part=>part&&part!=='.'&&part!=='..'&&!part.includes('\\')&&!part.includes(':'));
const sourceName=value=>safe(value)&&value.startsWith('templates/modern/')&&/\.(?:tsx?|json)$/.test(value)&&!value.includes('/public/')&&value!=='templates/modern/apps/web/app/[locale]/layout.tsx'&& !value.includes('locale-preferences');
export const NATIVE_COMPOSITION_BINDING='modern/apps/web/lib/cars-native-composition-binding.ts';
const inventoryPath='modern/packages/marketplace-domain/testing/mock-data.ts';

export function selectModernNativeQueryDiagnostic(normal,diagnostic,{workflowRef,dealer,family}={}){
 if(normal?.modernFreeNativeQueryExperiment!==undefined)fail('native query capture is diagnostic-only until runtime admission exists');
 if(diagnostic?.modernFreeNativeQueryExperiment===undefined)return {request:normal,diagnostic:null};
 if(workflowRef!=='darkapoparka/cars/.github/workflows/modern-native-diagnostic.yml@refs/heads/main'||dealer!=='priselci'||family!=='modern'||diagnostic.schemaVersion!==1||diagnostic.kind!=='cars-modern-native-diagnostic'||diagnostic.dealer!==dealer||diagnostic.family!==family||diagnostic.admittedForDelivery!==false||diagnostic.providerWrites!==false||diagnostic.expectedClientTree!==diagnostic.modernFreeNativeQueryExperiment.sourceTree||diagnostic.selectedTemplateCommit!==diagnostic.modernFreeNativeQueryExperiment.sourceRevision||typeof diagnostic.id!=='string'||diagnostic.id.length>128||!diagnostic.modernFreeServicesExperiment)fail('exact nondelivery Modern workflow and diagnostic source authority required');
 return {request:{...normal,modernFreeServicesExperiment:diagnostic.modernFreeServicesExperiment,modernFreeNativeQueryExperiment:diagnostic.modernFreeNativeQueryExperiment},diagnostic:{id:diagnostic.id,requestSha256:hash(JSON.stringify(diagnostic)),admittedForDelivery:false,providerWrites:false}};
}
export function verifyModernNativeQuerySourceUpdate(update,{sourceCommit,readTree,readBytes}={}){
 if(!update)return null;
 if(!hex(sourceCommit,40)||typeof readTree!=='function'||typeof readBytes!=='function')fail('immutable source update object readers required');
 const predecessor='bf6303bbde4268c649efb91df2b04ad3240b347b',client='clients/priselci',modern=client+'/modern';
 if(readTree(predecessor,client)!==update.predecessorSourceTree||readTree(update.publicationCommit,client)!==update.sourceTree||readTree(sourceCommit,client)!==update.sourceTree)fail('published successor client tree differs');
 const nativeTree=readTree(predecessor,modern);if(!hex(nativeTree,40)||readTree(update.publicationCommit,modern)!==nativeTree||readTree(sourceCommit,modern)!==nativeTree)fail('native Modern subtree changed across localization publication');
 for(const row of update.changes){if(readTree(predecessor,row.path)!==row.beforeGitBlob||readTree(update.publicationCommit,row.path)!==row.afterGitBlob||readTree(sourceCommit,row.path)!==row.afterGitBlob)fail('published localization leaf lease differs');const bytes=Buffer.from(readBytes(update.publicationCommit,row.path));if(bytes.length!==row.bytes||blob(bytes)!==row.afterGitBlob)fail('actual published localization leaf bytes differ');}
 return {publicationCommit:update.publicationCommit,sourceCommit,clientTree:update.sourceTree,preservedModernTree:nativeTree,publicationReceiptSha256:update.publicationReceiptSha256,changes:update.changes};
}

/** Only immutable, explicitly selected structural source may enter the overlay.
 * Before leases refer to selected B1 source, not the publisher's main parent. */
export function validateModernNativeQueryRequest(request,{dealer,sourceTree,sourceRevision}){
 if(!exact(request,['schemaVersion','kind','dealer','sourceTree','sourceRevision','overlayCommit','files','inventory'])||request.schemaVersion!==1||request.kind!=='cars-modern-native-query-build-proposal'||request.dealer!==dealer||request.sourceTree!==sourceTree||request.sourceRevision!==sourceRevision||!hex(sourceTree,40)||!hex(sourceRevision,40)||!hex(request.overlayCommit,40))fail('exact source/request authority required');
 if(!Array.isArray(request.files)||request.files.length<1||request.files.length>64||new Set(request.files.map(row=>row?.path)).size!==request.files.length)fail('bounded structural source selection required');
 for(const row of request.files){if(!exact(row,['path','beforeGitBlob','beforeSha256','afterGitBlob','afterSha256'])||!sourceName(row.path)||!hex(row.afterGitBlob,40)||!hex(row.afterSha256,64)||(row.beforeGitBlob===null)!==(row.beforeSha256===null)||(row.beforeGitBlob!==null&&(!hex(row.beforeGitBlob,40)||!hex(row.beforeSha256,64))))fail('exact structural file leases required');}
 if(!exact(request.inventory,['path','stockLiteralSha256','identityPaths'])||request.inventory.path!==inventoryPath||!hex(request.inventory.stockLiteralSha256,64)||!Array.isArray(request.inventory.identityPaths)||request.inventory.identityPaths.length<1||request.inventory.identityPaths.length>16||new Set(request.inventory.identityPaths).size!==request.inventory.identityPaths.length||request.inventory.identityPaths.some(name=>!safe(name)||!name.startsWith('modern/')||!name.endsWith('.ts')||name===inventoryPath))fail('actual inventory and identity sources required');
 return request;
}

export function nativeStockLiteral(bytes,typescript){
 if(typeof typescript?.createSourceFile!=='function'||typeof typescript?.isVariableDeclaration!=='function')fail('existing TypeScript parser required');
 const source=Buffer.from(bytes).toString('utf8'),file=typescript.createSourceFile(inventoryPath,source,typescript.ScriptTarget.Latest,true,typescript.ScriptKind.TS),found=[];
 const visit=node=>{if(typescript.isVariableDeclaration(node)&&typescript.isIdentifier(node.name)&&node.name.text==='mockListings')found.push(node);typescript.forEachChild(node,visit);};visit(file);
 if(file.parseDiagnostics.length||found.length!==1||!found[0].initializer||!typescript.isArrayLiteralExpression(found[0].initializer))fail('actual mockListings array declaration differs');
 return Buffer.from(source.slice(found[0].initializer.getStart(file),found[0].initializer.end));
}

/** Existing three-way merge preserves personalized stock/facts while adopting
 * source-owned native boundaries. No full template or dealer copy is created. */
export function applyModernNativeQuerySource(input,request,{dealer,sourceTree,sourceRevision,sourceCommit,readBefore,readAfter,typescript,tempRoot}={}){
 if(request===undefined)return {files:input,experiment:null};
 if(!(input instanceof Map)||!hex(sourceCommit,40)||typeof readBefore!=='function'||typeof readAfter!=='function')fail('source Map and immutable byte readers required');
 validateModernNativeQueryRequest(request,{dealer,sourceTree,sourceRevision});
 if(input.has(NATIVE_COMPOSITION_BINDING))fail('occupied generated native composition binding');
 const oldBase=new Map(),newBase=new Map(),personalized=new Map();
 for(const row of request.files){const name=row.path.slice('templates/'.length),before=row.beforeGitBlob===null?null:Buffer.from(readBefore(request.sourceRevision,row.path)),after=Buffer.from(readAfter(request.overlayCommit,row.path));
  if(before&&(hash(before)!==row.beforeSha256||blob(before)!==row.beforeGitBlob))fail('selected template before bytes differ: '+row.path);
  if(after.length<1||after.length>2*1024*1024||(before&&before.length>2*1024*1024))fail('bounded structural source bytes required');
  if(hash(after)!==row.afterSha256||blob(after)!==row.afterGitBlob)fail('reviewed native source bytes differ: '+row.path);
  if(before)oldBase.set(name,before);newBase.set(name,after);if(input.has(name))personalized.set(name,Buffer.from(input.get(name)));
 }
 if(!input.has(inventoryPath))fail('actual dealer inventory source missing');
 const originalStock=nativeStockLiteral(input.get(inventoryPath),typescript);if(hash(originalStock)!==request.inventory.stockLiteralSha256)fail('actual dealer stock literal lease differs');
 const merged=planThreeWayUpgrade({oldBase,newBase,dealer:personalized,...(tempRoot?{tempRoot}:{})});
 if(!merged.ready||merged.conflicts.length)fail('native structural source conflicts with personalized dealer: '+merged.conflicts.map(row=>row.path).join(','));
 const files=new Map(input),changes=[];for(const [name,bytes]of merged.candidate){const before=files.get(name);files.set(name,bytes);if(!before||!Buffer.from(before).equals(bytes))changes.push({path:name,before:before?{bytes:before.length,sha256:hash(before),gitBlob:blob(before)}:null,after:{bytes:bytes.length,sha256:hash(bytes),gitBlob:blob(bytes)}});}
 for(const name of personalized.keys())if(!merged.candidate.has(name))fail('native source deletion forbidden');
 if(!nativeStockLiteral(files.get(inventoryPath),typescript).equals(originalStock))fail('native merge changed original dealer stock');
 for(const [name,bytes]of input)if(!personalized.has(name)&&(!files.has(name)||!Buffer.from(files.get(name)).equals(Buffer.from(bytes))))fail('non-overlay dealer source changed');
 const rows=[...files].filter(([name])=>name.startsWith('modern/')).sort(([a],[b])=>Buffer.compare(Buffer.from(a),Buffer.from(b))).map(([path,bytes])=>({path,bytes:bytes.length,sha256:hash(bytes)}));
 const sourceDigest=hash(JSON.stringify(rows)),identity=request.inventory.identityPaths.map(name=>{if(!files.has(name))fail('actual identity source missing: '+name);const bytes=files.get(name);return {path:name,bytes:bytes.length,sha256:hash(bytes)};});
 const inventory={path:inventoryPath,bytes:files.get(inventoryPath).length,sha256:hash(files.get(inventoryPath)),stockLiteralSha256:hash(originalStock)};
 const nativeInventorySeal=hash(JSON.stringify({sourceTree,sourceDigest,inventory,identity}));
 const binding=Buffer.from('// Provider-only binding of the preserved assembled native source.\nexport const nativeInventorySeal = '+JSON.stringify(nativeInventorySeal)+';\nexport const sourceTree = '+JSON.stringify(sourceTree)+';\nexport const nativeQuerySourceMode = "original-public-demo-query-v1" as const;\n');files.set(NATIVE_COMPOSITION_BINDING,binding);
 const experiment={schemaVersion:1,kind:request.kind,dealer,sourceTree,sourceRevision,sourceCommit,overlayCommit:request.overlayCommit,requestSha256:hash(JSON.stringify(request)),nativeInventorySeal,sourceDigest,sourceRows:rows,inventory,identity,changes,binding:{path:NATIVE_COMPOSITION_BINDING,before:null,after:{bytes:binding.length,sha256:hash(binding),gitBlob:blob(binding)}},stockLiteralPreserved:true,nonOverlaySourcePreserved:true,nativeCaptureAdmitted:false,runtimeAdmitted:false,fullModernFree:false};
 return {files,experiment};
}

/** Walk actual final emitted imports. A source-only claim cannot admit an entry
 * whose shared chunk initializes SSR, database, or request-render machinery. */

/** Provider-only lexical split of the unchanged native resolver. The same native
 * locale policy/parser owns request cookies and country; no SSR request import
 * is allowed to reach the cold query entry. */
export function splitModernNativeQueryPreferences(files,{typescript}={}){
 const name='modern/apps/web/lib/locale-preferences.ts',source=Buffer.from(files.get(name)||'').toString('utf8');
 if(!source||!typescript?.createSourceFile)fail('actual native preference source/parser required');
 const ast=typescript.createSourceFile(name,source,typescript.ScriptTarget.Latest,true,typescript.ScriptKind.TS);if(ast.parseDiagnostics.length)fail('native preference source syntax differs');
 const functions=ast.statements.filter(node=>typescript.isFunctionDeclaration(node)&&node.name?.text==='resolveCarsNativePreferences');
 const policies=ast.statements.filter(node=>typescript.isVariableStatement(node)&&node.declarationList.declarations.some(declaration=>declaration.name.getText(ast)==='localePolicy'));
 if(functions.length!==1||policies.length!==1)fail('original native preference closure differs');
 const functionNode=functions[0],policyNode=policies[0],functionBytes=source.slice(functionNode.getStart(ast),functionNode.end),policyBytes=source.slice(policyNode.getStart(ast),policyNode.end);
 const imports=[];for(const node of ast.statements.filter(typescript.isImportDeclaration)){
  const spec=node.moduleSpecifier.text;
  if(['@repo/internationalization/config','@repo/internationalization/paths','@repo/internationalization/policy','./locale-configuration'].includes(spec))imports.push(source.slice(node.getStart(ast),node.end));
 }
 if(imports.length!==4||!functionBytes.startsWith('export function resolveCarsNativePreferences(')||!policyBytes.includes('createLocalePolicy(localeConfiguration)'))fail('exact original preference lexical imports required');
 const target='modern/apps/web/lib/cars-native-query-preferences.ts';if(files.has(target))fail('occupied pure preference split');
 const pure=Buffer.from(imports.join('\n')+'\n\n'+policyBytes+'\n\n'+functionBytes+'\n');
 const patches=[{start:functionNode.getStart(ast),end:functionNode.end,after:'export { resolveCarsNativePreferences } from "./cars-native-query-preferences";'}, {start:policyNode.getStart(ast),end:policyNode.end,after:'export { localePolicy } from "./cars-native-query-preferences";\nimport { localePolicy, resolveCarsNativePreferences } from "./cars-native-query-preferences";'}].sort((a,b)=>b.start-a.start);
 let rewritten=source;for(const patch of patches)rewritten=rewritten.slice(0,patch.start)+patch.after+rewritten.slice(patch.end);
 const result=new Map(files);result.set(name,Buffer.from(rewritten));result.set(target,pure);
 return {files:result,proof:{kind:'exact-native-preference-function-lexical-split',functionSha256:hash(functionBytes),policySha256:hash(policyBytes),source:{path:name,before:{bytes:Buffer.byteLength(source),sha256:hash(source),gitBlob:blob(Buffer.from(source))},after:{bytes:Buffer.byteLength(rewritten),sha256:hash(rewritten),gitBlob:blob(Buffer.from(rewritten))}},pure:{path:target,before:null,after:{bytes:pure.length,sha256:hash(pure),gitBlob:blob(pure)}}}};
}

export function inspectModernNativePureQueryGraph(graph,{entry='cars-native-marketplace-query.js'}={}){
 if(graph?.environment!=='rsc'||graph.phase!=='final'||graph.lifecycle?.isScanBuild!==false||graph.lifecycle?.write!==true||graph.lifecycle?.plugin!=='@vitejs/plugin-rsc'||graph.lifecycle?.version!=='0.5.36'||!Array.isArray(graph.rows))fail('actual final written native graph required');
 const byName=new Map(graph.rows.map(row=>[row.file,row]));if(byName.size!==graph.rows.length||!byName.has(entry))fail('pure query final entry missing');
 const visited=new Set(),closure=[];const visit=name=>{if(visited.has(name))return;visited.add(name);const row=byName.get(name);if(!row||!hex(row.sha256,64)||!Number.isSafeInteger(row.bytes)||row.bytes<1||!Array.isArray(row.moduleIds)||!Array.isArray(row.imports)||!Array.isArray(row.dynamicImports))fail('pure query graph row differs');
  for(const id of row.moduleIds){if(typeof id!=='string'||/(?:^|\/)(?:react|react-dom|react-server-dom-[^/]+|vinext|database)(?:\/|$)|(?:next\/(?:headers|server)|public-marketplace-data|public-request-policy|cars-original-proxy)/.test(id))fail('pure query closure initializes native SSR/request/database: '+id);}
  // No lazy request renderer may be hidden beneath this data entry.
  if(row.dynamicImports.length)fail('pure query entry has deferred graph imports');closure.push({file:row.file,bytes:row.bytes,sha256:row.sha256,moduleIds:row.moduleIds});for(const imported of row.imports)visit(path.posix.normalize(imported));};visit(entry);
 return {entry,rows:closure.sort((a,b)=>a.file.localeCompare(b.file)),closureSha256:hash(JSON.stringify(closure.sort((a,b)=>a.file.localeCompare(b.file)))),ssrImportsAbsent:true,finalWrittenGraph:true};
}

/** Pure virtual export in the same official RSC compiler; factory is source-owned. */
export function modernNativeQueryGraphEntrySource(cwd){
 const name=path.join(cwd,'lib/native-marketplace-static-entry.ts').replaceAll('\\','/'),binding=path.join(cwd,'lib/cars-native-composition-binding.ts').replaceAll('\\','/'),preferences=path.join(cwd,'lib/cars-native-query-preferences.ts').replaceAll('\\','/');
 return 'export {createNativeModernStaticEntry,createNativeModernRouteContexts,getNativeModernSlotBindings,mapNativeModernSlotHref,nativeModernSlotSerializerOwners} from '+JSON.stringify(name)+';\nexport {nativeInventorySeal,sourceTree,nativeQuerySourceMode} from '+JSON.stringify(binding)+';\nexport {resolveCarsNativePreferences} from '+JSON.stringify(preferences)+';\n';
}

/** Probe only actual source-derived routes through the same original live
 * handler. No prerender status/header transformation or standalone renderer. */
export async function captureModernNativeQueryRoutes({packageRoot,mount,sourceTree,graphSha256,entry,request,fetchNative,readBody}){
 packageRoot=fs.realpathSync(packageRoot);const context=createModernNativeQueryCaptureContext(entry,{sourceTree,mount});
 if(!hex(graphSha256,64)||typeof fetchNative!=='function'||typeof readBody!=='function')fail('actual native graph/handler/body reader required');
 const original=new URL(request.url);
 if(original.protocol!=='http:'||original.hostname!=='127.0.0.1'||!original.port||request.method!=='GET'||!request.headers.has('x-vinext-prerender-secret')||['cookie','authorization','x-cars-country','x-vercel-ip-country','cf-ipcountry'].some(name=>request.headers.has(name)))fail('exact original handler loopback authority required');
 const directory='.cars-modern-native-query-capture';const destination=path.resolve(packageRoot,directory);if(!destination.startsWith(packageRoot+path.sep)||fs.existsSync(destination))fail('fresh owned native capture required');fs.mkdirSync(destination);
 const rows=[];let totalBytes=0,storedBytes=0;
 for(const route of context.routes){
  const searches=['',...(route.kind==='catalogue'&&route.pathname===mount+'/'+route.locale+'/cars'?['?q=Golf']:[])];
  for(const search of searches)for(const representation of ['html','rsc']){
   const url=new URL(original);url.pathname=route.pathname;url.search=search;
   const headers=new Headers(request.headers);if(representation==='rsc'){headers.set('RSC','1');headers.set('Accept','text/x-component');url.searchParams.set('_rsc','');}else{headers.delete('RSC');headers.set('Accept','text/html');}
   const probe=new Request(url,{method:'GET',headers,redirect:'manual'}),response=await fetchNative(probe),body=await readBody(response.clone());
   if(!(body instanceof Uint8Array)||body.byteLength>2*1024*1024)fail('bounded whole native route body required');totalBytes+=body.byteLength;if(totalBytes>2*1024*1024*1024)fail('original native route captures exceed total logical bound');
   const storage=gzipSync(body,{level:9});storedBytes+=storage.length;if(storedBytes>128*1024*1024)fail('compressed owned native route captures exceed storage bound');
   const id=hash(JSON.stringify({pathname:route.pathname,search,representation})),bodyPath=directory+'/'+id+'.'+representation+'.gz',receiptPath=directory+'/'+id+'.json';
   const value={schemaVersion:1,kind:'cars-modern-native-query-original-handler-response',sourceTree,nativeInventorySeal:context.inventorySeal,graphSha256,route,request:{method:'GET',pathname:route.pathname,search:url.search,rsc:representation==='rsc',loopback:true,prerenderSecretPresent:true,personalizedHeaders:false},status:response.status,headers:Object.fromEntries(response.headers),body:{path:bodyPath,bytes:body.byteLength,sha256:hash(body),storage:{encoding:'gzip',bytes:storage.length,sha256:hash(storage)}},officialStaticAccepted:false};
   const receiptBytes=Buffer.from(JSON.stringify(value,null,2)+'\n');fs.writeFileSync(path.join(packageRoot,bodyPath),storage,{flag:'wx'});fs.writeFileSync(path.join(packageRoot,receiptPath),receiptBytes,{flag:'wx'});
   rows.push({path:receiptPath,bytes:receiptBytes.length,sha256:hash(receiptBytes),receipt:value});if(response.status!==200)console.error(JSON.stringify({kind:'native-query-response-not-200',pathname:route.pathname,search,representation,status:response.status,receiptPath,receiptSha256:hash(receiptBytes),bodySha256:value.body.sha256}));await response.body?.cancel();
  }
 }
 const result={schemaVersion:1,kind:'cars-modern-native-query-original-handler-capture-set',sourceTree,graphSha256,inventorySeal:context.inventorySeal,routeContextsSha256:context.routeContextsSha256,routes:context.routes,rows,totalBytes,storedBytes,method:'original-handler-no-store-capture',officialStaticAccepted:false,nativeCaptureAdmitted:false,fullFlightReuseAdmitted:false,runtimeAdmitted:false,fullModernFree:false};fs.writeFileSync(path.join(destination,'index.json'),JSON.stringify({...result,rows:rows.map(({receipt,...row})=>row)},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({kind:result.kind,routes:context.routes.length,responses:rows.length,logicalBytes:totalBytes,storedBytes,statuses:rows.reduce((counts,row)=>(counts[row.receipt.status]=(counts[row.receipt.status]||0)+1,counts),{}),officialStaticAccepted:false,runtimeAdmitted:false}));return result;
}

export function createModernNativeQueryCaptureContext(entry,{sourceTree,mount}){
 if(!['/variant-2','/variant-3'].includes(mount)||!hex(sourceTree,40)||entry?.sourceTree!==sourceTree||entry.nativeQuerySourceMode!=='original-public-demo-query-v1'||!hex(entry.nativeInventorySeal,64)||typeof entry.createNativeModernRouteContexts!=='function'||typeof entry.createNativeModernStaticEntry!=='function')fail('exact original pure native entry required');
 const data=entry.createNativeModernRouteContexts(entry.nativeInventorySeal);
 if(data?.inventory?.schemaVersion!==1||data.inventory.inventorySeal!==entry.nativeInventorySeal||!Array.isArray(data.inventory.listings)||data.inventory.listings.length<1||data.inventory.listings.length>256||!data.inventory.identity||data.inventory.pageSize!==24||!(data.routes instanceof Map)||data.routes.size<1||data.routes.size>1024)fail('actual finite source-derived native route contexts required');
 const routes=[];for(const [pathname,row]of data.routes){const locale=pathname.split('/')[2],kind=row?.kind==='listing'?'listing':'catalogue';
  if(typeof pathname!=='string'||!pathname.startsWith(mount+'/')||!['en','bg'].includes(locale)||pathname.includes('?')||pathname.includes('#')||pathname.includes('..')||row?.inventory?.inventorySeal!==entry.nativeInventorySeal||(!row.route)||(kind==='listing'&&(row.route.pathname!==pathname||row.route.locale!==locale||typeof row.route.listingId!=='string'||!data.inventory.listings.some(listing=>listing.id===row.route.listingId))))fail('source-derived route context differs');
  if(!exact(row.protocol,['routePattern','renderedPath','params'])||typeof row.protocol.routePattern!=='string'||row.protocol.routePattern.length>512||row.protocol.renderedPath!==pathname.slice(mount.length)||!row.protocol.params||row.protocol.params.locale!==locale||Object.keys(row.protocol.params).length>4||Object.entries(row.protocol.params).some(([key,value])=>!['locale','make','model','slug'].includes(key)||typeof value!=='string'||value.length>256||value.includes('/')||value.includes('..')))fail('original source route protocol context differs');
  if(kind==='catalogue'&&row.route.basePath!==pathname.slice(mount.length))fail('mounted catalogue context differs from original base path');
  routes.push({pathname,locale,kind,protocol:row.protocol,...(kind==='listing'?{listingId:row.route.listingId}:{category:row.route.category??'car',make:row.route.make??null,model:row.route.model??null})});
 }
 if(!routes.some(row=>row.pathname===mount+'/en/cars')||!routes.some(row=>row.pathname===mount+'/bg/cars'))fail('both original catalogue locales required');routes.sort((a,b)=>a.pathname.localeCompare(b.pathname));
 return {inventorySeal:entry.nativeInventorySeal,routes,routeContextsSha256:hash(JSON.stringify(routes))};
}


/** Byte-bound whole-root coordinates. No independent card render or fabricated
 * slot admission: the source binding reducer and actual query oracle own it. */
export function inspectModernNativeRoot(body,{route,inventorySeal}){
 const html=new TextDecoder('utf-8',{fatal:true}).decode(body),nodes=[],stack=[],voids=new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
 const tags=/<\/?!?[^>]*>/g;let match;
 while((match=tags.exec(html))){const token=match[0];if(token.startsWith('<!--')){const end=html.indexOf('-->',match.index+4);if(end<0)fail('unterminated native comment');tags.lastIndex=end+3;continue;}if(/^<!/i.test(token))continue;
  const closing=/^<\//.test(token),name=/^<\/?([a-zA-Z][\w:-]*)/.exec(token)?.[1]?.toLowerCase();if(!name)fail('unknown native HTML token');
  if(closing){const node=stack.pop();if(!node||node.tag!==name)fail('native HTML nesting differs');node.contentEnd=match.index;node.end=tags.lastIndex;continue;}
  const attributes=[],attribute=/(?:^|\s)([^\s=<>]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;attribute.lastIndex=token.indexOf(name)+name.length;let field;
  while((field=attribute.exec(token))){const key=field[1].toLowerCase();if(key==='/'||key===name)continue;if(attributes.some(row=>row.name===key))fail('duplicate native HTML attribute');const rawValue=field[2]??field[3]??field[4]??'',offset=field.index+field[0].indexOf(field[1]),valueOffset=field[0].indexOf('=');attributes.push({name:key,value:rawValue,start:match.index+offset,end:match.index+field.index+field[0].length,valueStart:valueOffset<0?null:match.index+field.index+valueOffset+1+(field[2]!==undefined||field[3]!==undefined?1:0),valueEnd:valueOffset<0?null:match.index+field.index+field[0].length-(field[2]!==undefined||field[3]!==undefined?1:0)});}
  const node={tag:name,start:match.index,openEnd:tags.lastIndex,contentStart:tags.lastIndex,contentEnd:tags.lastIndex,end:tags.lastIndex,attributes,parent:stack.length?nodes.indexOf(stack.at(-1)):null};nodes.push(node);
  if(voids.has(name)||token.endsWith('/>'))continue;
  if(name==='script'||name==='style'){const end=html.indexOf('</'+name+'>',tags.lastIndex);if(end<0)fail('native raw text element missing closure');node.contentEnd=end;node.end=end+name.length+3;tags.lastIndex=node.end;continue;}stack.push(node);
 }
 if(stack.length)fail('native HTML root not complete');
 const value=(node,key)=>node.attributes.find(row=>row.name===key)?.value,marked=nodes.filter(node=>node.attributes.some(row=>row.name.startsWith('data-native-'))),bootstrap=nodes.filter(node=>node.tag==='script'&&value(node,'id')==='cars-modern-native-preferences'&&value(node,'type')==='application/json');
 if(bootstrap.length!==1||html.slice(bootstrap[0].contentStart,bootstrap[0].contentEnd)!=='null')fail('native root immutable preference slot differs');
 if(route.kind==='listing'){if(nodes.filter(node=>value(node,'data-native-detail-root')===route.listingId).length!==1)fail('original native listing root missing');}
 else if(nodes.filter(node=>value(node,'data-native-inventory')===inventorySeal).length!==1)fail('original native inventory root missing');
 const cards=[],starts=nodes.filter(node=>value(node,'data-native-listing-start')!==undefined),ends=nodes.filter(node=>value(node,'data-native-listing-end')!==undefined),used=new Set();
 for(const start of starts){const key=value(start,'data-native-listing-start'),end=ends.find(row=>!used.has(row)&&value(row,'data-native-listing-end')===key&&row.start>start.end&&row.parent===start.parent);if(!end)fail('native original card range missing');used.add(end);cards.push({key,start:start.start,end:end.end,parent:start.parent,sha256:hash(html.slice(start.start,end.end))});}
 if(used.size!==ends.length||cards.length>512)fail('unowned native card markers');
 const head=nodes.find(node=>node.tag==='head');if(!head)fail('native full head missing');
 const headNodes=nodes.filter(node=>node.start>=head.contentStart&&node.end<=head.contentEnd&&['meta','link','title'].includes(node.tag)).map(node=>({tag:node.tag,start:node.start,end:node.end,sha256:hash(html.slice(node.start,node.end)),attributes:node.attributes}));
 const ids=nodes.flatMap(node=>value(node,'id')===undefined?[]:[{id:value(node,'id'),tag:node.tag,start:node.start}]),aria=nodes.flatMap(node=>node.attributes.filter(row=>['aria-controls','aria-labelledby','aria-describedby','for'].includes(row.name)).map(row=>({tag:node.tag,name:row.name,value:row.value,start:row.start})));
 return {schemaVersion:1,kind:'cars-modern-native-whole-root-coordinates',htmlSha256:hash(body),htmlBytes:body.length,pathname:route.pathname,inventorySeal,bootstrap:{start:bootstrap[0].contentStart,end:bootstrap[0].contentEnd,before:'null'},markers:marked.map(node=>({...node})),cards,head:headNodes,ids,aria,independentRoots:false,slotBindingsAdmitted:false,queryHtmlEquivalence:false,hydrationAdmitted:false};
}

/** Retain the compiled source's finite scalar descriptors at every original
 * node occurrence. Unmapped markers/serializers never imply admission. */
export function inspectModernNativeSlotBindings(root,{entry,route}){
 if(typeof entry.getNativeModernSlotBindings!=='function'||typeof entry.mapNativeModernSlotHref!=='function'||!entry.nativeModernSlotSerializerOwners)fail('compiled source binding/serializer exports missing');
 const result=[],unmapped=[];
 for(const node of root.markers){const attrs=Object.fromEntries(node.attributes.map(row=>[row.name,row.value]));let marker,key;
  if(attrs['data-native-query-slot']!==undefined){marker=attrs['data-native-query-slot'];if(/^(chip(?:-label)?|mobile-pill(?:-label|-clear|-open)?|pagination-page):/.test(marker))key=marker.slice(marker.indexOf(':')+1);}
  else if(attrs['data-native-detail-atom']!==undefined)marker=attrs['data-native-detail-atom'];
  else if(attrs['data-native-result-grid']!==undefined)marker='result-grid';
  else if(attrs['data-native-result-empty']!==undefined)marker='result-empty';
  else for(const [attribute,meaning]of [['data-native-card-link','card-link'],['data-native-card-image','card-image'],['data-native-card-delivery','card-delivery'],['data-native-listing-slot','card-container'],['data-native-detail-container','related-container']])if(attrs[attribute]!==undefined){marker=meaning;key=attrs[attribute];break;}
  if(marker===undefined)continue;
  const atoms=entry.getNativeModernSlotBindings({kind:route.kind==='listing'?'listing':'category',locale:route.locale,marker,...(key===undefined?{}:{key})});
  if(atoms===undefined){unmapped.push({marker,key,start:node.start});continue;}
  if(!Array.isArray(atoms)||atoms.length>16||atoms.some(atom=>!atom||typeof atom.target!=='string'||!atom.binding||!Array.isArray(atom.binding.path)||atom.binding.path.length>12||atom.binding.path.some(part=>typeof part!=='string'||['__proto__','constructor','prototype'].includes(part))))fail('bounded original source scalar descriptors differ');
  result.push({marker,key,start:node.start,end:node.end,atoms});
 }
 return {kind:'original-compiled-native-slot-descriptors',bindings:result,unmapped,serializerOwners:entry.nativeModernSlotSerializerOwners,scalarSourceJoined:true,slotSerializationAdmitted:false,headImageSerializerAdmitted:false,hydrationAdmitted:false};
}

/** Exact official client-reference index and final client disk/module joins. */

export function inspectModernNativeClientIndex(clientReferenceManifest,{clientGraph,packageRoot}){
 if(clientGraph.environment!=='client'||clientGraph.phase!=='final'||clientGraph.lifecycle?.write!==true||!clientReferenceManifest?.clientReferenceDeps)fail('official final client-reference manifest required');
 const assets=new Map(),references=[];for(const [id,dependencies]of Object.entries(clientReferenceManifest.clientReferenceDeps)){
  if(!/^[a-f0-9]{12}$/.test(id)||!Array.isArray(dependencies.js)||!Array.isArray(dependencies.css)||!dependencies.js.length||dependencies.js.length+dependencies.css.length>512)fail('bounded original client reference required');const files=[];
  for(const file of [...dependencies.js,...dependencies.css]){const name=file.startsWith('/')?file.slice(1):file;if(!safe(name))fail('client reference asset path differs');files.push(name);if(assets.has(name))continue;
   const output=path.resolve(packageRoot,clientGraph.outputDirectory),absolute=path.resolve(output,name);if(!absolute.startsWith(output+path.sep))fail('unbounded client reference output');const stat=fs.lstatSync(absolute);if(!stat.isFile()||stat.isSymbolicLink())fail('client reference disk output differs');const bytes=fs.readFileSync(absolute),graphRow=clientGraph.rows.find(row=>row.file===name);if(name.endsWith('.js')&&(!graphRow||graphRow.bytes!==bytes.length||graphRow.sha256!==hash(bytes)))fail('Flight client asset does not join final native graph');assets.set(name,{file:name,bytes:bytes.length,sha256:hash(bytes),moduleIds:graphRow?.moduleIds??[],css:!name.endsWith('.js')});
  }references.push({id,files});
 }
 return {schemaVersion:1,kind:'cars-modern-native-official-client-reference-index',references:references.sort((a,b)=>a.id.localeCompare(b.id)),assets:[...assets.values()].sort((a,b)=>a.file.localeCompare(b.file)),finalDiskJoined:true};
}

export function inspectModernNativeFlight(body,{clientReferenceManifest,clientGraph,packageRoot,clientIndex}){
 const text=new TextDecoder('utf-8',{fatal:true}).decode(body),ids=new Set();
 for(const match of text.matchAll(/(?:^|\n)[a-f0-9]+:I(\[[^\n]*\])(?=\n|$)/g)){let record;try{record=JSON.parse(match[1]);}catch{fail('native Flight import record malformed');}if(typeof record[0]!=='string'||!/^[a-f0-9]{12}$/.test(record[0]))fail('native Flight client identifier differs');ids.add(record[0]);}
 if(!ids.size)fail('original native Flight client records required');
 const index=clientIndex??inspectModernNativeClientIndex(clientReferenceManifest,{clientGraph,packageRoot});if(index?.kind!=='cars-modern-native-official-client-reference-index'||index.finalDiskJoined!==true)fail('final native client reference proof required');
 for(const id of ids)if(!index.references.some(row=>row.id===id))fail('native Flight ID absent from official client manifest');
 return {schemaVersion:1,kind:'cars-modern-native-full-flight-client-joins',bodySha256:hash(body),bodyBytes:body.length,ids:[...ids].sort(),clientIndexSha256:hash(JSON.stringify(index)),fullBodyRetained:true,clientIdsJoined:true,queryNeutralityAdmitted:false};
}

/** Seal actual original bodies as compressed owned candidates, with truthful
 * unclosed hydration/slot gates. Raw canonical Flight is never rewritten. */
export async function emitModernNativeQuerySnapshots({packageRoot,target,readGraph,sealHeaders,nativeResponseIdentities,producer,servicesReceipt}){
 if(!target.nativeQueryExperiment)return null;
 packageRoot=fs.realpathSync(packageRoot);const contract=JSON.parse(fs.readFileSync(path.join(packageRoot,'.cars-modern-free-build.json'))),query=contract.nativeQuery;
 if(!query||query.sourceTree!==contract.sourceTree||query.sourceCommit!==contract.sourceCommit||target.key!=='modern'||typeof readGraph!=='function'||typeof sealHeaders!=='function')fail('explicit compiled query authority missing');
 const graph={};for(const environment of ['rsc','ssr','client'])graph[environment]=readGraph(packageRoot,environment,'final');
 const rsc=graph.rsc.value,closure=inspectModernNativePureQueryGraph(rsc),server=path.resolve(packageRoot,rsc.outputDirectory),entryPath=path.join(server,closure.entry),entryBytes=fs.readFileSync(entryPath),entry=await import(pathToFileURL(entryPath).href+'?cars-query-seal='+hash(entryBytes)),context=createModernNativeQueryCaptureContext(entry,{sourceTree:contract.sourceTree,mount:contract.mount});
 if(context.inventorySeal!==query.nativeInventorySeal||typeof entry.resolveCarsNativePreferences!=='function')fail('pure native source/preference export differs');
 const graphSeal=hash(JSON.stringify(Object.fromEntries(Object.entries(graph).map(([name,row])=>[name,hash(row.bytes)])))),indexPath=path.join(packageRoot,'.cars-modern-native-query-capture/index.json'),indexBytes=fs.readFileSync(indexPath),index=JSON.parse(indexBytes);
 if(index.kind!=='cars-modern-native-query-original-handler-capture-set'||index.sourceTree!==contract.sourceTree||index.inventorySeal!==query.nativeInventorySeal||index.graphSha256!==hash(graph.rsc.bytes)||index.routeContextsSha256!==context.routeContextsSha256||JSON.stringify(index.routes)!==JSON.stringify(context.routes)||index.officialStaticAccepted!==false||!Array.isArray(index.rows))fail('original handler route capture/source/final graph differs');
 const assetManifestPath=path.join(server,'__vite_rsc_assets_manifest.js'),assetManifestBytes=fs.readFileSync(assetManifestPath),assetManifest=(await import(pathToFileURL(assetManifestPath).href+'?cars-query-manifest='+hash(assetManifestBytes))).default;
 const retained=path.join(server,'cars-native-query-evidence');if(fs.existsSync(retained))fail('occupied compiled query evidence');fs.mkdirSync(retained);// Capture checkpoint: compressed bodies remain in this owned nonpublic server namespace; no new public asset/runtime admission.

 const clientIndex=inspectModernNativeClientIndex(assetManifest,{clientGraph:graph.client.value,packageRoot}),clientIndexBytes=Buffer.from(JSON.stringify(clientIndex)+'\n');fs.writeFileSync(path.join(retained,'client-references.json'),clientIndexBytes,{flag:'wx'});
 const canonical=new Map(),captures=[],routes=[];let totalStoredBytes=0,identities=null;
 for(const item of index.rows){if(!safe(item.path)||!item.path.startsWith('.cars-modern-native-query-capture/'))fail('unbounded query capture receipt');const receiptBytes=fs.readFileSync(path.join(packageRoot,item.path));if(receiptBytes.length!==item.bytes||hash(receiptBytes)!==item.sha256)fail('raw query capture receipt bytes differ');const row=JSON.parse(receiptBytes),route=context.routes.find(value=>value.pathname===row.route?.pathname);if(!route||JSON.stringify(row.route)!==JSON.stringify(route)||row.sourceTree!==contract.sourceTree||row.nativeInventorySeal!==query.nativeInventorySeal||row.graphSha256!==hash(graph.rsc.bytes)||row.status!==200||row.officialStaticAccepted!==false||!safe(row.body?.path)||!row.body.path.startsWith('.cars-modern-native-query-capture/')||row.body.storage?.encoding!=='gzip')fail('exact original query response tuple differs');
  const representation=row.request?.rsc?'rsc':'html',search=representation==='rsc'?row.request.search.replace(/(?:\?|&)_rsc=(?=&|$)/,'').replace(/^&/,'?').replace(/\?$/,''):row.request?.search;
  if(row.request?.method!=='GET'||row.request.pathname!==route.pathname||row.request.loopback!==true||row.request.prerenderSecretPresent!==true||row.request.personalizedHeaders!==false||!['','?q=Golf'].includes(search)||(search&&route.pathname!==contract.mount+'/'+route.locale+'/cars'))fail('query capture request authority differs');
  const storage=fs.readFileSync(path.join(packageRoot,row.body.path));if(storage.length!==row.body.storage.bytes||hash(storage)!==row.body.storage.sha256||storage.length>2*1024*1024)fail('compressed native body lease differs');const body=gunzipSync(storage,{maxOutputLength:2*1024*1024});if(body.length!==row.body.bytes||hash(body)!==row.body.sha256||!body.length)fail('original native decompressed body lease differs');
  const security=await producer.resolveCarsNativeResponsePolicy(route.locale),sealed=sealHeaders(row.headers,security,{locale:route.locale,kind:representation,pathname:route.pathname,routeParams:route.protocol.params,renderedPath:route.protocol.renderedPath+search,internalHeaderNames:producer.VINEXT_INTERNAL_HEADERS});
  if(representation==='rsc'){const identity=nativeResponseIdentities(sealed.headers);if(identities&&JSON.stringify(identities)!==JSON.stringify(identity))fail('native query graph identities differ');identities=identity;}
  const whole=representation==='html'?inspectModernNativeRoot(body,{route,inventorySeal:query.nativeInventorySeal}):inspectModernNativeFlight(body,{clientIndex});if(representation==='html')whole.sourceBindings=inspectModernNativeSlotBindings(whole,{entry,route});
  const key=route.pathname+'\0'+search+'\0'+representation;if(canonical.has(key))fail('duplicate canonical query tuple');canonical.set(key,{row,body,storage,sealed,whole});
  const base=hash(key),bodyName=base+'.'+representation+'.gz',receiptName=base+'.response.json',proofName=base+'.'+representation+'.proof.json.gz';fs.writeFileSync(path.join(retained,bodyName),storage,{flag:'wx'});fs.writeFileSync(path.join(retained,receiptName),receiptBytes,{flag:'wx'});const proofBytes=gzipSync(Buffer.from(JSON.stringify(whole)+'\n'),{level:9});fs.writeFileSync(path.join(retained,proofName),proofBytes,{flag:'wx'});totalStoredBytes+=storage.length+receiptBytes.length+proofBytes.length;
  captures.push({pathname:route.pathname,search,representation,response:{path:target.root+'/dist/server/cars-native-query-evidence/'+receiptName,bytes:receiptBytes.length,sha256:hash(receiptBytes)},body:{...row.body,path:target.root+'/dist/server/cars-native-query-evidence/'+bodyName},proof:{path:target.root+'/dist/server/cars-native-query-evidence/'+proofName,encoding:'gzip',bytes:proofBytes.length,sha256:hash(proofBytes)},omitted:sealed.omitted});
 }
 for(const route of context.routes){const pair={...route,inventorySeal:query.nativeInventorySeal};for(const representation of ['html','rsc']){const selected=canonical.get(route.pathname+'\0\0'+representation);if(!selected)fail('missing original canonical route body');const {row,sealed}=selected,base=hash(route.pathname+'\0\0'+representation);pair[representation]={path:target.root+'/dist/server/cars-native-query-evidence/'+base+'.'+representation+'.gz',bytes:row.body.bytes,sha256:row.body.sha256,storage:row.body.storage,headers:sealed.headers};}routes.push(pair);}
 const oracles=[];for(const locale of ['en','bg']){const pathname=contract.mount+'/'+locale+'/cars',original=canonical.get(pathname+'\0\0rsc'),oracle=canonical.get(pathname+'\0?q=Golf\0rsc');if(!oracle)fail('actual query Flight oracle missing');oracles.push({pathname,query:'?q=Golf',canonicalSha256:hash(original.body),querySha256:hash(oracle.body),equal:original.body.equals(oracle.body)});}
 const nativeCaptureAdmitted=oracles.every(row=>row.equal),admission={sourcePreserved:query.stockLiteralPreserved===true&&query.nonOverlaySourcePreserved===true,pureFinalGraph:true,originalBodies:true,canonicalClientIds:true,queryFlightNeutral:nativeCaptureAdmitted,wholeHtmlSlots:false,headImageSerializer:false,sameRootHydration:false,runtime:false,fullModernFree:false};
 const manifest={schemaVersion:1,kind:'cars-modern-native-query-capture-candidate',nativeQueryAbi:1,mount:contract.mount,sourceTree:contract.sourceTree,nativeInventorySeal:query.nativeInventorySeal,sourceDigest:query.sourceDigest,producerSha256:hash(entryBytes),policyProducerSha256:servicesReceipt.responsePolicy.producerSha256,graphSeal,identities,routes,admission},manifestBytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n'),manifestPath=path.join(server,'cars-free-native-query.json');fs.writeFileSync(manifestPath,manifestBytes,{flag:'wx'});
 const receipt={schemaVersion:1,kind:'cars-modern-native-query-compiled-candidate',sourceCommit:contract.sourceCommit,sourceTree:contract.sourceTree,sourceRevision:query.sourceRevision,overlayCommit:query.overlayCommit,requestSha256:query.requestSha256,nativeInventorySeal:query.nativeInventorySeal,source:query,graphSeal,graph:Object.fromEntries(Object.entries(graph).map(([name,row])=>[name,{bytes:row.bytes.length,sha256:hash(row.bytes),path:servicesReceipt.graph[name].path}])),pureEntry:{path:target.root+'/dist/server/'+closure.entry,bytes:entryBytes.length,sha256:hash(entryBytes),closure},assetManifest:{path:target.root+'/dist/server/__vite_rsc_assets_manifest.js',bytes:assetManifestBytes.length,sha256:hash(assetManifestBytes)},captureIndex:{bytes:indexBytes.length,sha256:hash(indexBytes),routeContextsSha256:context.routeContextsSha256},clientIndex:{path:target.root+'/dist/server/cars-native-query-evidence/client-references.json',bytes:clientIndexBytes.length,sha256:hash(clientIndexBytes)},captures,oracles,sourceBindingExports:{getNativeModernSlotBindings:typeof entry.getNativeModernSlotBindings==='function',mapNativeModernSlotHref:typeof entry.mapNativeModernSlotHref==='function',owners:entry.nativeModernSlotSerializerOwners},callbackIntegrationAuthored:false,manifest:{path:target.root+'/dist/server/cars-free-native-query.json',bytes:manifestBytes.length,sha256:hash(manifestBytes)},totalStoredBytes,provenance:{method:'original-handler-no-store-capture',officialStaticAccepted:false,officialIndex:servicesReceipt.snapshotProvenance.officialIndex},admission};
 totalStoredBytes+=manifestBytes.length+clientIndexBytes.length;if(totalStoredBytes>256*1024*1024)fail('bounded compressed query evidence exceeded');fs.writeFileSync(path.join(server,'cars-free-native-query-build.json'),JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});return {manifestPath:target.root+'/dist/server/cars-free-native-query.json',entryPath:target.root+'/dist/server/'+closure.entry,receiptPath:target.root+'/dist/server/cars-free-native-query-build.json',admission};
}

export function modernNativeQueryBuildRuntimeSource(){
 return "import fs from 'node:fs';\nimport path from 'node:path';\nimport {createHash} from 'node:crypto';\nimport {gzipSync,gunzipSync} from 'node:zlib';\nimport {pathToFileURL} from 'node:url';\nconst safe="+safe.toString()+";\nconst exact="+exact.toString()+";\nconst hash="+hash.toString()+";\nconst hex="+hex.toString()+";\nconst fail="+fail.toString()+";\n"+[inspectModernNativePureQueryGraph,modernNativeQueryGraphEntrySource,captureModernNativeQueryRoutes,createModernNativeQueryCaptureContext,inspectModernNativeRoot,inspectModernNativeSlotBindings,inspectModernNativeClientIndex,inspectModernNativeFlight,emitModernNativeQuerySnapshots].map(fn=>'export '+fn.toString()).join('\n')+'\n';
}
