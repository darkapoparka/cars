import { createHash } from 'node:crypto';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const roots = {'auto-best':'static', modern:'apps/web/public', import:'static', app:'public', mobile:'public', 'karento-best':'static'};
export const DEALER_ICON_PATH = '/dealer-brand/app-icon.png';
export const DEALER_MANIFEST_PATH = '/dealer-brand/site.webmanifest';
export const ICO_INPUT_PATH = 'assets/favicon.ico';

export function inspectDealerIcon(png, ico) {
  if (!Buffer.isBuffer(png) || png.length < 24 || png.subarray(0,8).toString('hex') !== '89504e470d0a1a0a' ||
      png.toString('ascii',12,16) !== 'IHDR' || png.readUInt32BE(16) < 32 || png.readUInt32BE(16) !== png.readUInt32BE(20)) {
    throw new Error('Dealer App/touch icon must be a retained square PNG of at least 32 pixels.');
  }
  if (!Buffer.isBuffer(ico) || ico.length < 22 || ico.readUInt16LE(0) !== 0 || ico.readUInt16LE(2) !== 1 ||
      ico.readUInt16LE(4) < 1 || ico.length < 6 + ico.readUInt16LE(4) * 16) throw new Error('Retain a genuine assets/favicon.ico; PNG bytes renamed to ICO are not accepted.');
  for (let index=0; index<ico.readUInt16LE(4); index++) {
    const at=6+index*16, size=ico.readUInt32LE(at+8), offset=ico.readUInt32LE(at+12);
    if (!size || offset < 6+ico.readUInt16LE(4)*16 || offset+size > ico.length) throw new Error('Invalid retained favicon ICO directory.');
  }
  return {width:png.readUInt32BE(16), height:png.readUInt32BE(20), pngSha256:hash(png), icoSha256:hash(ico)};
}

function replaceOne(source, search, replacement, label) {
  const matches = typeof search === 'string' ? source.split(search).length-1 : [...source.matchAll(new RegExp(search.source, search.flags.includes('g')?search.flags:search.flags+'g'))].length;
  if (matches !== 1) throw new Error('Expected one reviewed dealer icon boundary: ' + label);
  return source.replace(search,replacement);
}

/** Bind identity assets before native/App/extended source seals, without changing layouts. */
export function applyDealerIcons({files,manifest,profile,png,ico}) {
  const image = inspectDealerIcon(png,ico), dimensions=image.width+'x'+image.height, changed=[];
  const put=(name,bytes)=>{files.set(name,Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes));changed.push(name);};
  const edit=(name,fn)=>{
    if(!files.has(name))throw new Error('Missing reviewed icon consumer: '+name);
    put(name,fn(files.get(name).toString('utf8')));
  };
  for (const {key,base,entry} of manifest.variants) {
    if (!roots[key]) throw new Error('Unsupported icon family: '+key);
    put(key+'/'+roots[key]+DEALER_ICON_PATH,png);
    // Relative manifest URLs keep the same bytes valid under each package mount.
    if(key!=='app') put(key+'/'+roots[key]+DEALER_MANIFEST_PATH,JSON.stringify({
      id:'../',name:profile.business.name,short_name:profile.business.shortName||profile.business.name,
      description:profile.business.previewNotice||profile.business.inventoryNotice,lang:'en',
      start_url:'..'+entry.slice(base.length),scope:'../',display:'standalone',
      background_color:'#ffffff',theme_color:profile.business.accent||'#ffffff',
      icons:[{src:'app-icon.png',sizes:dimensions,type:'image/png',purpose:'any'}]
    },null,2)+'\n');
  }
  for(const name of ['auto-best/static/favicon.ico','app/app/favicon.ico','mobile/src/app/favicon.ico']) {
    if(!files.has(name))throw new Error('Reviewed favicon route moved: '+name);
    put(name,ico);
  }
  for(const name of ['modern/apps/web/app/-/icon.png','modern/apps/web/app/-/apple-icon.png']) {
    if(!files.has(name))throw new Error('Reviewed Modern file icon moved: '+name);
    put(name,png);
  }
  put('app/public/dealer-app/icon.png',png);
  edit('auto-best/src/app.html',source=>{
    const icon='<link rel="icon" type="image/png" href="%sveltekit.assets%'+DEALER_ICON_PATH+'" />';
    const extra='\n    <link rel="apple-touch-icon" href="%sveltekit.assets%'+DEALER_ICON_PATH+'" />'+
      '\n    <link rel="manifest" href="%sveltekit.assets%'+DEALER_MANIFEST_PATH+'" />';
    return replaceOne(source,/<link rel="icon"[^>]+\/>/,icon+extra,'AutoBest favicon');
  });
  edit('modern/apps/web/app/[locale]/layout.tsx',source=>replaceOne(source,
    /icons:\s*\{\s*icon:\s*\[\{ type: "image\/png", url: withBasePath\(leadSite\.logoPath\) \}\],\s*\}/,
    'icons: {\n    icon: [{ type: "image/png", url: withBasePath("'+DEALER_ICON_PATH+'") }],\n'+
    '    apple: [{ type: "image/png", url: withBasePath("'+DEALER_ICON_PATH+'") }],\n'+
    '  },\n  manifest: withBasePath("'+DEALER_MANIFEST_PATH+'")','Modern metadata'));
  edit('import/src/lib/config/site.ts',source=>replaceOne(source,
    /favicon:\s*['"][^'"]+['"]/, 'favicon: '+JSON.stringify(DEALER_ICON_PATH),'Import favicon configuration'));
  edit('import/src/routes/+layout.svelte',source=>replaceOne(source,
    '<link rel="icon" href={base + site.identity.favicon} />',
    '<link rel="icon" type="image/png" href={base + site.identity.favicon} />\n'+
    '\t<link rel="apple-touch-icon" href={base + site.identity.favicon} />\n'+
    '\t<link rel="manifest" href={base + "'+DEALER_MANIFEST_PATH+'"} />','Import head icons'));
  edit('app/app/manifest.ts',source=>replaceOne(source,
    "sizes: isDealer ? '512x512' : 'any'",'sizes: isDealer ? '+JSON.stringify(dimensions)+" : 'any'",'App actual manifest icon dimensions'));
  edit('mobile/src/app/layout.tsx',source=>replaceOne(source,
    'export const metadata: Metadata = showroomMetadata();',
    'export const metadata: Metadata = {...showroomMetadata(), icons: {\n'+
    '  icon: [{url: "'+DEALER_ICON_PATH+'", type: "image/png"}],\n'+
    '  apple: [{url: "'+DEALER_ICON_PATH+'", type: "image/png"}],\n'+
    '}, manifest: "'+DEALER_MANIFEST_PATH+'"};','Mobile metadata'));
  edit('karento-best/src/lib/content.ts',source=>replaceOne(source,
    /(?:favicon|"favicon"):\s*["'][^"']+["']/, '"favicon": '+JSON.stringify(DEALER_ICON_PATH),'Signature favicon configuration'));
  edit('karento-best/src/routes/+layout.svelte',source=>replaceOne(source,
    /<link\s+rel="shortcut icon"\s+href=\{dealer\.logo\.favicon \?\? "\/assets\/imgs\/template\/favicon\.svg"\}\s*\/>/,
    '<link rel="icon" type="image/png" href={dealer.logo.favicon ?? "'+DEALER_ICON_PATH+'"} />\n'+
    '  <link rel="apple-touch-icon" href={dealer.logo.favicon ?? "'+DEALER_ICON_PATH+'"} />\n'+
    '  <link rel="manifest" href="'+DEALER_MANIFEST_PATH+'" />','Signature head icons'));
  return {schemaVersion:1,inputPng:'assets/app-icon.png',inputIco:ICO_INPUT_PATH,...image,
    paths:changed,rendering:'unverified',identityQa:false};
}
