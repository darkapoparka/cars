import fs from 'node:fs';
import path from 'node:path';
import { excluded, normalized, sha256, inside } from './workflow.mjs';
import { signatureBusinessPreview, signaturePriceFacts, signatureMileageFacts, signatureNativeFactsContract } from './client-refresh-signature.mjs';

export const EXTENDED_VARIANT_RECEIPTS = Object.freeze({
  mobile: '.cars-mobile.json',
  'karento-best': '.cars-signature.json'
});
const publicDirectory = key => ['mobile','app'].includes(key) ? 'public' : key === 'modern' ? 'apps/web/public' : 'static';
const text = (files, name) => {
  const bytes = files.get(name);
  if (!bytes) throw new Error(`Missing reviewed personalization boundary: ${name}`);
  return bytes.toString('utf8').replace(/^\uFEFF/, '');
};
const put = (files, name, value) => files.set(name, Buffer.from(value));
const jsonText = value => JSON.stringify(value, null, 2) + '\n';
const unique = values => [...new Set(values.filter(Boolean))];

/** The input seal is canonical source, before provider mounting or metadata transforms. */
export function extendedVariantSourceDigest(files, key) {
  if (!Object.hasOwn(EXTENDED_VARIANT_RECEIPTS, key)) throw new Error(`Unsupported extended variant: ${key}`);
  const prefix = key + '/';
  const source = [...files].filter(([name]) => name.startsWith(prefix) && !excluded(name.slice(prefix.length)))
    .map(([name, bytes]) => [name.slice(prefix.length), sha256(normalized(bytes))])
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  if (!source.some(([name]) => name === 'package.json')) throw new Error(`${key}: missing source package.json`);
  return sha256(JSON.stringify(source));
}

function safePublicPath(value) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') &&
    !/[?#\\]/.test(value) && !value.slice(1).split('/').some(part => !part || part === '.' || part === '..');
}

function retainedAsset(client, publicPath) {
  if (!safePublicPath(publicPath)) throw new Error(`Dealer media must use a retained local public path: ${publicPath}`);
  const relative = publicPath.slice(1), unmounted = relative.replace(/^variant-[2-6]\//, ''), candidates = [];
  const mount = publicPath.match(/^(\/variant-[2-6])\//)?.[1], manifestFile=path.join(client,'dealer.json');
  if (mount && fs.existsSync(manifestFile)) {
    const variants=JSON.parse(fs.readFileSync(manifestFile,'utf8')).variants;
    const key=Array.isArray(variants)?variants.find(variant=>variant.base===mount)?.key:null;
    if (['auto-best','modern','import','app','mobile','karento-best','carwow'].includes(key)) candidates.push(`${key}/${publicDirectory(key)}/${unmounted}`);
  }
  candidates.push(relative);
  for (const local of unique([relative,unmounted])) {
    candidates.push(local);
    for (const variant of ['auto-best', 'modern', 'import', 'app', 'mobile', 'karento-best', 'carwow']) {
      candidates.push(`${variant}/${variant === 'modern' ? 'apps/web/public' : ['app','mobile'].includes(variant) ? 'public' : 'static'}/${local}`);
    }
  }
  if (unmounted.startsWith('assets/')) {
    candidates.push('assets/' + unmounted.split('/').slice(2).join('/'), 'assets/' + path.posix.basename(unmounted));
  }
  for (const candidate of unique(candidates)) {
    const file = inside(client, candidate);
    if (fs.existsSync(file) && fs.lstatSync(file).isFile()) return fs.readFileSync(file);
  }
  throw new Error(`Missing retained dealer asset: ${publicPath}`);
}

export function retainDealerVariantAssets(files, key, profile, client) {
  const logoPaths = unique([profile.logoContract?.assets.onLight?.publicPath || profile.business.logo,
    profile.logoContract?.assets.onDark?.publicPath || profile.business.logoDark || profile.business.logo]);
  if (!logoPaths.length || logoPaths.some(value => !/\.(?:png|webp)$/i.test(value))) throw new Error(`${key}: reviewed PNG/WebP dealer logos are required`);
  const originalMediaPaths = unique(profile.listings.flatMap(listing => listing.images));
  const canonicalize = Object.hasOwn(EXTENDED_VARIANT_RECEIPTS,key);
  const mediaMappings = originalMediaPaths.filter(value => canonicalize && /^\/variant-[2-6]\//.test(value))
    .map(sourcePath => ({sourcePath,publicPath:sourcePath.replace(/^\/variant-[2-6](?=\/)/,'')}));
  const mapped = new Map(mediaMappings.map(item => [item.sourcePath,item.publicPath]));
  const mediaPaths = unique(originalMediaPaths.map(value => mapped.get(value) || value));
  const written = new Map();
  for (const publicPath of unique([...logoPaths, ...originalMediaPaths])) {
    const bytes = retainedAsset(client, publicPath);
    const contractAsset = Object.values(profile.logoContract?.assets || {}).find(asset => asset.publicPath === publicPath);
    if (contractAsset && sha256(bytes) !== contractAsset.sha256) throw new Error(`${key}: dealer logo bytes differ from the approved contract`);
    const destination = mapped.get(publicPath) || publicPath, digest = sha256(bytes);
    if (written.has(destination) && written.get(destination)!==digest) throw new Error(`Ambiguous retained media after mount removal: ${destination}`);
    written.set(destination,digest);
    files.set(`${key}/${publicDirectory(key)}${destination}`, bytes);
  }
  return { logoPaths, mediaPaths, mediaMappings };
}

/** Replace only an exported initializer, retaining its declared type and consumers. */
export function replaceExportInitializer(source, name, value) {
  const anchor = new RegExp(`export const ${name}(?:\\s*:[^=]+)?\\s*=\\s*`, 'g');
  const matches = [...source.matchAll(anchor)];
  if (matches.length !== 1) throw new Error(`Expected one typed export for ${name}`);
  const start = matches[0].index + matches[0][0].length;
  let depth = 0, quote = '', lineComment = false, blockComment = false;
  for (let i = start; i < source.length; i++) {
    const ch = source[i], next = source[i + 1];
    if (lineComment) { if (ch === '\n') lineComment = false; continue; }
    if (blockComment) { if (ch === '*' && next === '/') { blockComment = false; i++; } continue; }
    if (quote) { if (ch === '\\') i++; else if (ch === quote) quote = ''; continue; }
    if (ch === '/' && next === '/') { lineComment = true; i++; continue; }
    if (ch === '/' && next === '*') { blockComment = true; i++; continue; }
    if ('\'"`'.includes(ch)) { quote = ch; continue; }
    if ('[{('.includes(ch)) depth++;
    else if (']})'.includes(ch)) depth--;
    else if (ch === ';' && depth === 0) return source.slice(0, start) + JSON.stringify(value, null, 2) + source.slice(i);
    if (depth < 0) break;
  }
  throw new Error(`Unterminated typed export: ${name}`);
}

function showroomVehicle(listing, profile) {
  const raw = listing.raw || {};
  const price = listing.priceAmount;
  if (!Number.isFinite(price) || price < 0) throw new Error(`Mobile cannot display an unpublished price as a numeric offer: ${listing.id}`);
  if (!Number.isFinite(listing.year) || !/\d{4}/.test(String(raw.year || raw.production || raw.date || ''))) throw new Error(`Mobile needs the source year for ${listing.id}`);
  const attribute = {
    description: `${listing.description}\n${profile.business.inventoryNotice}`,
    availability: listing.availability,
    source: listing.sourceUrl,
    observedAt: listing.observedAt
  };
  return {
    id: listing.id, make: listing.make, model: listing.model, variant: listing.trim,
    price, sample: false, year: listing.year, registration: String(raw.registration || raw.production || listing.year),
    mileage: Math.round(listing.mileageUnit === 'mi' ? listing.mileageValue * 1.609344 : listing.mileageValue),
    power: listing.powerHp || 0, fuel: listing.fuel, transmission: listing.transmission, body: listing.body,
    color: listing.color, seats: Number(raw.seats) || 0, doors: Number(raw.doors) || 0,
    dealer: profile.business.name, location: listing.location || profile.business.city,
    rating: 0, reviews: 0, country: profile.business.countryCode, images: listing.images,
    category: 'car', features: listing.features, attributes: attribute
  };
}

function replaceOne(source,pattern,replacement,label) {
  const matcher=typeof pattern==='string'?null:new RegExp(pattern.source,'g');
  const count=matcher?[...source.matchAll(matcher)].length:source.split(pattern).length-1;
  if(count!==1)throw new Error(`Reviewed dealer consumer changed: ${label}`);
  return source.replace(pattern,replacement);
}

function guardMobileFacts(files,profile) {
  const prefix='mobile/src/components/',changed=[];
  const patch=(name,transform)=>{const file=prefix+name;if(!files.has(file))return;put(files,file,transform(text(files,file)));changed.push(file);};
  patch('NativeDealerCards.tsx',source=>{
    source=replaceOne(source,/        <button\s+type="button"\s+aria-label="View dealer ratings"[\s\S]*?<\/button>/,node=>'{v.reviews > 0 && ('+node+')}', 'Mobile dealer rating action');
    source=replaceOne(source,"['list', 'Ads online', data.listings]","['list', 'Dated vehicle examples', data.listings]",'Mobile dated inventory label');
    source=replaceOne(source,'{stats.map(([icon, label, value]) => (','{stats.filter(([, , value]) => value.trim()).map(([icon, label, value]) => (','Mobile verified dealer facts');
    source=replaceOne(source,/This information is based exclusively on data from mobile\.de and reviews by other users\.\s*All content is independent and not for sale\./,'{'+JSON.stringify(profile.business.inventoryNotice)+'}','Mobile dated disclosure');
    source=replaceOne(source,/<div \{\.\.\.stylex\.props\(s\.section\)\}>\s*<h3 \{\.\.\.stylex\.props\(s\.subheading\)\}>We speak<\/h3>\s*<p \{\.\.\.stylex\.props\(s\.text\)\}>\{data\.languages\}<\/p>\s*<\/div>/,node=>'{data.languages && ('+node+')}','Mobile unpublished languages');
    source=replaceOne(source,'<Modal open={reviews}','<Modal open={reviews && v.reviews > 0}','Mobile verified reviews modal');
    return source;
  });
  patch('DealerScreens.tsx',source=>{
    source=replaceOne(source,/<span \{\.\.\.stylex\.props\(s\.stars\)\}>★★★★★<\/span>\s*<p>\s*\{v\.rating\} \/ 5 · \{number\(v\.reviews\)\} reviews\s*<\/p>/,node=>'{v.reviews > 0 && (<>'+node+'</>)}','Mobile dealer rating summary');
    return replaceOne(source,"['Power', (v) => v.power + ' hp']","['Power', (v) => v.power > 0 ? v.power + ' hp' : 'Not published']",'Mobile compare published power');
  });
  patch('VehicleCard.tsx',source=>{
    source=replaceOne(source,'<Pill icon="gauge">{v.power} HP</Pill>','{v.power > 0 && <Pill icon="gauge">{v.power} HP</Pill>}','Mobile card published power');
    source=replaceOne(source,'{Math.round(v.power / 1.36)} kW ({v.power} hp)',"{v.power > 0 ? Math.round(v.power / 1.36) + ' kW (' + v.power + ' hp)' : 'Power not published'}",'Mobile compact published power');
    return replaceOne(source,/<RatingStars rating=\{v\.rating\} size=\{20\} \/>\s*<span \{\.\.\.stylex\.props\(s\.reviewCount\)\}>\(\{v\.reviews\}\)<\/span>/,node=>'{v.reviews > 0 && (<>'+node+'</>)}','Mobile card verified reviews');
  });
  patch('VehicleSections.tsx',source=>{
    const power="Math.round(v.power / 1.36) + ' kW (' + v.power + ' ' + t('hp') + ')'";
    if(source.split(power).length!==3)throw new Error('Reviewed Mobile power specification consumers changed');
    source=source.replaceAll(power,"v.power > 0 ? "+power+" : 'Not published'");
    source=replaceOne(source,'String(v.seats)',"v.seats > 0 ? String(v.seats) : 'Not published'",'Mobile published seats');
    source=replaceOne(source,'String(v.doors)',"v.doors > 0 ? String(v.doors) : 'Not published'",'Mobile published doors');
    return replaceOne(source,/<p \{\.\.\.stylex\.props\(s\.stars\)\}>\s*<RatingStars rating=\{v\.rating\} \/>\{[\s\S]*?<span \{\.\.\.stylex\.props\(s\.label\)\}>\(\{v\.reviews\}\)<\/span>\s*<\/p>/,node=>'{v.reviews > 0 && ('+node+')}','Mobile PDP verified reviews');
  });
  return changed;
}

function patchMobile(files, profile, logos) {
  const prefix = 'mobile/', business = profile.business;
  const currencies=unique(profile.listings.map(listing=>listing.currency));
  if(currencies.length!==1 || !/^[A-Z]{3}$/.test(currencies[0]))throw new Error('Mobile needs one explicit stock currency; mixed currency amounts cannot be relabeled');
  const currency=currencies[0];
  const file = prefix + 'src/lib/showroom-config.ts';
  let config = text(files, file);
  const pattern = /export const showroom = defineShowroom\(\{[\s\S]*?\n\}\);/;
  if ([...config.matchAll(new RegExp(pattern.source, 'g'))].length !== 1) throw new Error('Mobile showroom schema changed; review its typed personalization adapter');
  const showroom = { name: business.name, logo: logos[0], phone: business.phoneE164 || null,
    email: business.email || null, address: business.address || null, directionsUrl: business.mapsUrl || null,
    mapEmbedUrl: business.mapsEmbedUrl || null, socialLinks: Object.entries(business.socialLinks).filter(([,href]) => href).map(([label,href]) => ({label,href})),
    contactPreview: false, hours: business.hours ? [business.hours] : [], storageNamespace: profile.slug };
  config = config.replace(pattern, 'export const showroom = defineShowroom(' + JSON.stringify(showroom, null, 2) + ');');
  put(files, file, config);
  const inventory = profile.listings.map(listing => showroomVehicle(listing, profile));
  const catalog = prefix + 'src/lib/catalog.ts';
  let source = text(files, catalog);
  if (!/export const vehicles: Vehicle\[\] =/.test(source)) throw new Error('Mobile catalog no longer exposes the reviewed Vehicle[] boundary');
  source = "import dealerInventory from './dealer-inventory.json';\n" + replaceExportInitializer(source, 'vehicles', inventory);
  // Retain the template's make/model/filter logic while the actual feed contains only this dealer.
  source = source.replace(/export const vehicles: Vehicle\[\] = [\s\S]*?\n\];/, 'export const vehicles: Vehicle[] = dealerInventory as Vehicle[];');
  put(files, catalog, source);
  put(files, prefix + 'src/lib/dealer-inventory.json', jsonText(inventory));
  const dealerFile = prefix + 'src/lib/dealers.ts';
  const dealers = Object.fromEntries(inventory.map(vehicle => [vehicle.id, {
    address: business.address, languages: '', openingHours: business.hours,
    years: '', listings: String(inventory.length), referrals: '', descriptionAccuracy: '', highlights: [], logo: logos[0], logoWidth: 128
  }]));
  put(files, dealerFile, replaceExportInitializer(text(files,dealerFile), 'capturedDealers', dealers));
  const localeFile=prefix+'src/lib/locale.ts',searchFile=prefix+'src/lib/search.ts';
  if (files.has(localeFile)) put(files,localeFile,replaceOne(text(files,localeFile),"currency: 'EUR'","currency: " + JSON.stringify(currency),'Mobile explicit stock currency'));
  if (files.has(searchFile)) put(files,searchFile,text(files,searchFile).replace(/'€' \+ new Intl.NumberFormat\('en-GB', \{ maximumFractionDigits: 0 \}\).format\(amount\)/,
    `new Intl.NumberFormat('en-GB', { style: 'currency', currency: ${JSON.stringify(currency)}, maximumFractionDigits: 0 }).format(amount)`));
  return { contentPaths: [file,catalog,dealerFile,prefix+'src/lib/dealer-inventory.json',...[localeFile,searchFile].filter(name=>files.has(name)),...guardMobileFacts(files,profile)], inventory };
}

function signatureCard(listing, profile, nativeFacts=false) {
  const business = profile.business;
  const priceFacts=signaturePriceFacts(listing),mileageFacts=signatureMileageFacts(listing);
  const fuel=listing.fuel==='Not published'?'':listing.fuel,transmission=listing.transmission==='Not published'?'':listing.transmission;
  const price = Number.isFinite(listing.priceAmount) ? new Intl.NumberFormat(business.locale, {style:'currency',currency:listing.currency,maximumFractionDigits:0}).format(listing.priceAmount) : 'Price on request';
  return { sample: false, image: listing.image, imageAlt: listing.title,
    href: '/vehicle?id=' + encodeURIComponent(listing.id), title: listing.title, location: listing.location || business.city,
    mileage: Number.isFinite(mileageFacts.mileageValue)?`${mileageFacts.mileageValue.toLocaleString(business.locale)} ${mileageFacts.mileageUnit}`:'',
    transmission, fuel, seats: listing.raw?.seats ? String(listing.raw.seats) : '',
    bodyType: listing.bodyType, price, pricePeriod: '', action: 'Enquire', rating: '', reviews: '',
    ...(nativeFacts?{...priceFacts,...mileageFacts,...(fuel?{fuelType:listing.fuelType}:{}),...(transmission?{transmissionType:listing.transmissionType}:{})}:{}) };
}

function signatureDetail(listing, profile, logo, nativeFacts=false) {
  const card=signatureCard(listing,profile,nativeFacts), business=profile.business;
  const specification = (id,value,facts={}) => ({id,icon:`/assets/imgs/page/car/${id}.svg`,value,...(nativeFacts?facts:{})});
  const specifications=[];
  if(card.mileage)specifications.push(specification('km',card.mileage,{labelKey:'vehicle.field.mileage',valueNumber:card.mileageValue,unit:card.mileageUnit}));
  if(card.transmission&&card.transmission!=='Not published')specifications.push(specification('auto',card.transmission,{labelKey:'vehicle.field.transmission',valueKey:'transmission.'+listing.transmissionType}));
  if(card.fuel&&card.fuel!=='Not published')specifications.push(specification('diesel',card.fuel,{labelKey:'vehicle.field.fuel',valueKey:'fuel.'+listing.fuelType}));
  if (listing.powerHp>0) specifications.push(specification('lit',String(listing.powerHp)+' hp',{labelKey:'vehicle.field.power',valueNumber:listing.powerHp,unit:'hp'}));
  const overview=unique([listing.description]).filter(value=>value!==business.inventoryNotice&&value!==business.previewNotice);
  const gallery={slides:listing.images.map(src=>({src,alt:listing.title})),thumbnails:listing.images.map(src=>({src,alt:listing.title}))};
  const content={overview,includedFeatures:listing.features,questions:[],loanFields:[],
    loanSummary:{downPayment:'',financed:'',monthlyPayment:''},
    reviewMetrics:[],reviewSummary:{rating:'',count:''},reviews:[]};
  return {id:listing.id,heading:{title:listing.title,mobileTitle:listing.title,location:card.location,fleetCode:listing.id,rating:'',reviewCount:''},
    specifications,gallery,content,
    seller:{name:business.name,location:business.address,avatar:logo,mobile:business.phoneDisplay,email:business.email || '',whatsapp:'',fax:''},
    reservation:{title:'Vehicle enquiry',pickUp:'',dropOff:'',extras:[],subtotal:card.price,discount:'',total:card.price,...(nativeFacts?signaturePriceFacts(listing):{})}};
}

function bindSignatureDetail(files,profile,logos,nativeFacts=false) {
  const prefix='karento-best/',detailFile=prefix+'src/lib/data/vehicle-detail.ts';
  const details=profile.listings.map(listing=>signatureDetail(listing,profile,logos[0],nativeFacts)),first=details[0];
  let source=text(files,detailFile);
  for (const [name,value] of Object.entries({referenceSpecifications:first.specifications,referenceOverview:first.content.overview,
    referenceIncludedFeatures:first.content.includedFeatures,referenceQuestions:[],referenceReviewMetrics:[],referenceReviews:[],referenceSeller:first.seller,
    referenceReservation:first.reservation,referenceHeading:first.heading,referenceSliderGallery:first.gallery,
    referenceGridGallery:{hero:first.gallery.slides[0],columns:[]},referenceLoanSummary:first.content.loanSummary,
    referenceReviewSummary:first.content.reviewSummary,referenceRelatedProducts:[]})) source=replaceExportInitializer(source,name,value);
  put(files,detailFile,source);
  const derived=prefix+'src/lib/data/dealer-detail.ts';
  put(files,derived,`/** Generated from the dealer's dated fact pack; no live stock or finance approval. */\nimport type { DetailHeading, DetailSpecification, DetailSliderGallery, DetailContent, DetailSeller, DetailReservation } from './vehicle-detail.ts';\nexport interface DealerDetail { id: string; heading: DetailHeading; specifications: readonly DetailSpecification[]; gallery: DetailSliderGallery; content: DetailContent; seller: DetailSeller; reservation: DetailReservation }\nexport const dealerDetails: readonly DealerDetail[] = ${JSON.stringify(details,null,2)};\nexport function dealerDetailFor(id: string | null): DealerDetail | null {\n  return id === null ? dealerDetails[0] ?? null : dealerDetails.find(item => item.id === id) ?? null;\n}\n`);
  const factualPagePaths=[],detailHostPaths=[];
  const enquiry=prefix+'src/lib/sections/VehicleEnquiryDetail.svelte';
  const mobileFile=prefix+'src/lib/components/vehicle-detail/MobileVehicleDetail.svelte';
  let component=text(files,enquiry),mobile=text(files,mobileFile);
  const localizedNotFound=nativeFacts&&files.has(prefix+'src/lib/components/vehicle-detail/DealerVehicleNotFound.svelte');
  const nativeDetail=/specifications\?\s*:\s*readonly DetailSpecification\[\]/.test(component);
  if(nativeDetail) {
    if(!nativeFacts||!localizedNotFound)throw new Error('Signature typed detail needs its factual dealer and localized missing-vehicle boundaries');
    const props={heading:'DetailHeading',gallery:'DetailSliderGallery',specifications:'readonly DetailSpecification\\[\\]',details:'DetailContent',reservation:'DetailReservation',seller:'DetailSeller'};
    for(const [name,type]of Object.entries(props))for(const [label,source]of [['host',component],['mobile',mobile]]) {
      if(!new RegExp('\\b'+name+'\\?\\s*:\\s*'+type+(name==='specifications'?'':'\\b')).test(source))
        throw new Error(`Signature native ${label} detail must expose typed ${name}`);
    }
    const forwarded=(source,pattern,label)=>{
      if([...source.matchAll(new RegExp(pattern,'g'))].length!==1)throw new Error('Signature native detail must forward '+label+' exactly once');
    };
    forwarded(component,'<MobileVehicleDetail\\s+\\{heading\\}\\s+\\{gallery\\}\\s+\\{specifications\\}\\s+\\{details\\}\\s+\\{reservation\\}\\s+\\{seller\\}\\s*\\/>','all six mobile props');
    for(const source of [component,mobile])for(const [tag,prop]of [['VehicleHeading','heading'],['VehicleSpecifications','specifications'],['VehicleDetailPanels','details'],['VehicleReservationCard','reservation'],['DetailSellerCard','seller']])
      forwarded(source,'<'+tag+'\\s+\\{'+prop+'\\}(?=\\s|\\/)','selected '+prop);
    forwarded(component,'<VehicleSliderGallery\\s+\\{gallery\\}\\s*\\/>','desktop gallery');
    if(!mobile.includes('slides={gallery.slides}')||!mobile.includes('thumbnails={gallery.thumbnails}'))throw new Error('Signature native mobile gallery must use its selected vehicle');
  }
  if(nativeFacts) {
    const breadcrumb=prefix+'src/lib/sections/VehicleBreadcrumb.svelte';
    if(!/\bvehicleTitle\?\s*:\s*string/.test(text(files,breadcrumb)))throw new Error('Signature native breadcrumb must expose its factual vehicle title');
    const pageFile=prefix+'src/lib/pages/cars-details-3.svelte';
    let page=text(files,pageFile);
    page=replaceOne(page,'</script>','  import { page as dealerPage } from "$app/state";\n  import { dealerDetailFor } from "#lib/data/dealer-detail.ts";\n'+(nativeDetail?'  import DealerVehicleNotFound from "#lib/components/vehicle-detail/DealerVehicleNotFound.svelte";\n':'')+'  const dealerBreadcrumbDetail = $derived(dealerDetailFor(dealerPage.url.searchParams.get("id")));\n</script>','Signature dealer breadcrumb data');
    page=replaceOne(page,'<VehicleBreadcrumb centered />','<VehicleBreadcrumb centered vehicleTitle={dealerBreadcrumbDetail?.heading.title} />','Signature selected vehicle breadcrumb');
    if(nativeDetail)page=replaceOne(page,'<VehicleEnquiryDetail />','{#if dealerBreadcrumbDetail}<VehicleEnquiryDetail heading={dealerBreadcrumbDetail.heading} gallery={dealerBreadcrumbDetail.gallery} specifications={dealerBreadcrumbDetail.specifications} details={dealerBreadcrumbDetail.content} reservation={dealerBreadcrumbDetail.reservation} seller={dealerBreadcrumbDetail.seller} />{:else}<DealerVehicleNotFound />{/if}','Signature native factual six-prop detail');
    put(files,pageFile,page);factualPagePaths.push(pageFile);
  }
  if(!nativeDetail) {
  const scriptEnd='</script>';
  if (component.split(scriptEnd).length!==2) throw new Error('Signature detail host changed; review the dealer binding');
  component=component.replace(scriptEnd,`  import { page } from "$app/state";\n  import { dealerDetailFor } from "#lib/data/dealer-detail.ts";\n${localizedNotFound?'  import DealerVehicleNotFound from "#lib/components/vehicle-detail/DealerVehicleNotFound.svelte";\n':''}  const selected = $derived(dealerDetailFor(page.url.searchParams.get("id")));\n</script>`);
  for (const [before,after] of [
    ['<MobileVehicleDetail />','<MobileVehicleDetail heading={selected.heading} gallery={selected.gallery} specifications={selected.specifications} details={selected.content} reservation={selected.reservation} seller={selected.seller} />'],
    ['<VehicleHeading />','<VehicleHeading heading={selected.heading} />'],
    ['<VehicleSliderGallery />','<VehicleSliderGallery gallery={selected.gallery} />'],
    ['<VehicleSpecifications alignStart />','<VehicleSpecifications specifications={selected.specifications} alignStart />'],
    ['<VehicleDetailPanels />','<VehicleDetailPanels details={selected.content} />'],
    ['<VehicleReservationCard />','<VehicleReservationCard reservation={selected.reservation} />'],
    ['<DetailSellerCard />','<DetailSellerCard seller={selected.seller} />']]) {
    if (component.split(before).length!==2) throw new Error('Signature detail prop boundary changed: '+before);
    component=component.replace(before,after);
  }
  const bodyStart=component.indexOf(scriptEnd)+scriptEnd.length;
  component=component.slice(0,bodyStart)+'\n{#if selected}'+component.slice(bodyStart)+
    `\n{:else}${localizedNotFound?'<DealerVehicleNotFound />':'<section class="box-section"><div class="container"><h1>Vehicle not found in this dated preview</h1><a href="/vehicles">Browse vehicles</a></div></section>'}{/if}\n`;
  put(files,enquiry,component);
  if(!/specifications\?\s*:\s*readonly DetailSpecification\[\]/.test(mobile)) {
  mobile=replaceOne(mobile,'type DetailSliderGallery,','type DetailSliderGallery,\n    referenceSpecifications, referenceDetailContent, referenceReservation, referenceSeller,\n    type DetailSpecification, type DetailContent, type DetailReservation, type DetailSeller,','Signature mobile detail data types');
  mobile=replaceOne(mobile,'gallery = referenceSliderGallery,','gallery = referenceSliderGallery,\n    specifications = referenceSpecifications, details = referenceDetailContent,\n    reservation = referenceReservation, seller = referenceSeller,','Signature mobile detail defaults');
  mobile=replaceOne(mobile,'{ heading?: DetailHeading; gallery?: DetailSliderGallery }','{ heading?: DetailHeading; gallery?: DetailSliderGallery; specifications?: readonly DetailSpecification[]; details?: DetailContent; reservation?: DetailReservation; seller?: DetailSeller }','Signature mobile detail prop types');
  for(const [before,after] of [['<VehicleSpecifications alignStart />','<VehicleSpecifications {specifications} alignStart />'],['<VehicleReservationCard />','<VehicleReservationCard {reservation} />'],['<DetailSellerCard />','<DetailSellerCard {seller} />'],['<VehicleDetailPanels />','<VehicleDetailPanels {details} />']])mobile=replaceOne(mobile,before,after,'Signature mobile '+before);
  } else if(!/<VehicleSpecifications\s+\{specifications\}/.test(mobile)||!/<VehicleDetailPanels\s+\{details\}/.test(mobile)||!/<VehicleReservationCard\s+\{reservation\}/.test(mobile)||!/<DetailSellerCard\s+\{seller\}/.test(mobile)) {
    throw new Error('Signature native mobile detail props must reach every selected-vehicle consumer');
  }
  put(files,mobileFile,mobile);
  detailHostPaths.push(enquiry,mobileFile);
  }
  const reservationFile=prefix+'src/lib/components/vehicle-detail/VehicleReservationCard.svelte';
  let reservation=text(files,reservationFile);
  const nativeReservation=nativeFacts&&reservation.includes('{#if dealer.businessPreview}')&&reservation.includes('locale.href("/contact#contact-enquiry")');
  if(!nativeReservation) {
  const dates=/<ReservationDateField[\s\S]*?first\s*\/>\s*<ReservationDateField[\s\S]*?\/>/;
  if (!/\{#if\s+reservation\.pickUp\s*&&\s*reservation\.dropOff\}/.test(reservation)) {
    if (!dates.test(reservation)) throw new Error('Signature reservation date boundary changed');
    reservation=reservation.replace(dates,match=>'{#if reservation.pickUp && reservation.dropOff}'+match+'{/if}');
  }
  reservation=reservation.replace(/<div class="item-line-booking last-item pb-0">\s*<strong class="text-md-medium neutral-1000">Sale discount<\/strong>[\s\S]*?<\/div>\s*<\/div>/,
    match=>'{#if reservation.discount}'+match+'{/if}').replaceAll('Total Payable','Advertised price').replaceAll('Book Now','Enquire');
  reservation=reservation.replaceAll('{extra.label}{" "}','{extra.label} ');
  }
  put(files,reservationFile,reservation);
  const panelsFile=prefix+'src/lib/components/vehicle-detail/VehicleDetailPanels.svelte';
  let panels=text(files,panelsFile);
  for(const condition of ['{#if !product && mobile.current}','{#if !product && !mobile.current}']) {
    if(panels.includes(condition))panels=replaceOne(panels,condition,condition.slice(0,-1)+' && content.loanFields.length > 0}','Signature verified finance fields');
    else if(!panels.includes(condition.slice(0,-1)+' && content.loanFields.length > 0}') &&
      !(nativeFacts&&panels.includes('{#if !dealer.businessPreview && '+condition.slice(5))))throw new Error('Signature native detail must hide unpublished finance fields');
  }
  put(files,panelsFile,panels);
  return [detailFile,derived,...factualPagePaths,...detailHostPaths,reservationFile,panelsFile];
}

function personalizeSignatureCopy(files,profile) {
  const prefix='karento-best/',changed=[],b=profile.business;
  const footerFile=prefix+'src/lib/components/Footer.svelte';
  let footer=text(files,footerFile);
  if(!footer.includes('businessPreview')) {
  footer=footer.replace('2356 Oakwood Drive, Suite 18, San Francisco, California 94111, US','{dealer.locations[0]?.address || "Contact the dealership"}')
    .replace('Hours: 8:00 - 17:00, Mon - Sat','{dealer.copy["contact.hours"] || "Contact before visiting"}')
    .replace('support@carento.com','{dealer.contacts.email || "Contact the dealership"}')
    .replace('aria-label="+1 222-555-33-99"','aria-label={dealer.contacts.phone || "Contact the dealership"}');
  footer=replaceOne(footer,'<div class="box-info-contact mt-0">','<div class="box-info-contact mt-0">\n            <p class="text-sm neutral-400">{dealer.copy["inventory.notice"]}</p>','Signature dated inventory footer');
  put(files,footerFile,footer);changed.push(footerFile);
  }
  const editorialFile=prefix+'src/lib/data/editorial.ts';
  if(files.has(editorialFile)) {
    let editorial=text(files,editorialFile);
    for(const name of ['teamMembers','teamMembersCompact1','teamMembersCompact2']) editorial=replaceExportInitializer(editorial,name,[]).replace(`export const ${name} =`,`export const ${name}: readonly AgentItem[] =`);
    editorial=replaceExportInitializer(editorial,'importSources',[]).replace('export const importSources =','export const importSources: readonly ImportSourceItem[] =').replaceAll('Jimmy Dave','Demo editorial');
    put(files,editorialFile,editorial);changed.push(editorialFile);
  }
  const storyFile=prefix+'src/lib/data/home-stories.ts';
  if(files.has(storyFile)) {
    let stories=text(files,storyFile);
    for(const name of ['referenceTestimonials','referenceBookingTestimonials']) stories=replaceExportInitializer(stories,name,[]).replace(`export const ${name} =`,`export const ${name}: readonly Testimonial[] =`);
    put(files,storyFile,stories);changed.push(storyFile);
  }
  for(const [name,bytes] of files) {
    if(!name.startsWith(prefix+'src/lib/') || !name.endsWith('.svelte')) continue;
    let component=bytes.toString('utf8');
    if(name.endsWith('/VehicleHeading.svelte')&&!/\{#if[^}]*heading\.rating[^}]*heading\.reviewCount/.test(component))component=replaceOne(component,/<div class="tour-rate">[\s\S]*?<\/div>\s*<\/div>/,node=>'{#if heading.rating && heading.reviewCount}'+node+'{/if}','Signature PDP rating guard');
    if(name.includes('/cards/')&&component.includes('{card.rating}')&&!/\{#if[^}]*card\.rating[^}]*card\.reviews/.test(component))component=replaceOne(component,/<span\s+class=[^>]*>\s*\{card\.rating\}[\s\S]*?<\/span\s*>\s*<\/span\s*>/,node=>'{#if card.rating && card.reviews}'+node+'{/if}','Signature card rating guard');
    if(name.endsWith('/ReviewSummary.svelte')&&!/\{#if[^}]*summary\.count/.test(component))component=replaceOne(component,/<FiveStarRating source="\/assets\/imgs\/page\/tour-detail\/star\.svg" \/>/,node=>'{#if summary.count}'+node+'{/if}','Signature verified review stars');
    if(/import \{ referenceBookingTestimonials \}/.test(component) && name.endsWith('/CustomerReviewCarousel.svelte')) {
      const end=component.indexOf('</script>')+9;
      component=component.slice(0,end)+'\n{#if referenceBookingTestimonials.length}'+component.slice(end)+'\n{/if}\n';
    }
    // Names and contacts from the preserved donor must never become dealer claims.
    component=component.replaceAll('support@carento.com',b.email || 'Contact the dealership')
      .replaceAll('emily-rose@gmail.com',b.email || 'Contact the dealership')
      .replaceAll('+1 222-555-33-99',b.phoneDisplay || 'Contact the dealership');
    component=component.replace(/<([A-Z][A-Za-z]+)\b[^<>]*\bcard=\{(referenceVehicles\.[A-Za-z]+\[\d+\])\}[^<>]*\/>/g,
      (node,_tag,card)=>`{#if ${card}}${node}{/if}`);
    if(component!==bytes.toString('utf8')) {put(files,name,component);changed.push(name);}
  }
  return unique(changed);
}

function patchSignature(files, profile, logos) {
  const prefix = 'karento-best/', business = profile.business;
  const file = prefix + 'src/lib/content.ts';
  const nativeFacts=signatureNativeFactsContract(text(files,file));
  const facts=signatureBusinessPreview(profile);
  const cards = profile.listings.map(listing => signatureCard(listing, profile,nativeFacts));
  const dealer = {name: business.name, locale: business.locale,
    logo: {light:logos[0],footer:logos.at(-1),archivedDark:logos.at(-1),alt:business.name,favicon:logos[0],monochromeOnDark:false},
    contacts: {phone:business.phoneE164,email:business.email},
    hero:{desktopImage:'/assets/imgs/hero/hero-3/dealership-desktop.webp',imageAlt:'Illustrative silver car outside a modern showroom'},
    locations:[{name:business.name,address:business.address,country:business.country,mapUrl:business.mapsUrl,
      phone:business.phoneDisplay,phoneHref:business.phoneHref,email:business.email,emailHref:business.email ? 'mailto:'+business.email : ''}],
    // The actual collections below already contain dealer stock. A title-keyed
    // override would collapse different listings that happen to share a title.
    inventory:{},copy:{'home.hero':business.name,'home.hero.mobile':'Find your next car.','home.brandsIntro':'Explore our dated vehicle examples.','contact.agents':'Contact the dealership','contact.hours':business.hours,'inventory.notice':business.inventoryNotice},
    ...(nativeFacts?{businessPreview:facts}:{}),contentStatus:'reference-demo'};
  put(files,file,replaceExportInitializer(text(files,file),'dealer',dealer).replace(/^import referenceLocations from [^;]+;\s*/m,''));
  const homeData = prefix+'src/lib/data/vehicles.ts', listData = prefix+'src/lib/data/vehicle-listing.ts';
  const groups = (source) => unique([...source.matchAll(/^  ([A-Za-z][A-Za-z0-9]*): \[/gm)].map(match=>match[1]));
  const home = text(files,homeData), listing = text(files,listData);
  const homeKeys = groups(home), listingKeys = groups(listing.slice(0,listing.indexOf('export const rentalRows')));
  if (!homeKeys.length || !listingKeys.length) throw new Error('Signature listing collections no longer match their typed data boundary');
  put(files,homeData,replaceExportInitializer(home,'referenceVehicles',Object.fromEntries(homeKeys.map(key=>[key,cards]))).replace('export const referenceVehicles =','export const referenceVehicles: Readonly<Record<string, readonly VehicleCardContent[]>> ='));
  let personalizedListing=replaceExportInitializer(listing,'vehicleListings',Object.fromEntries(listingKeys.map(key=>[key,cards.map((card,index)=>({id:profile.listings[index].id,...card}))])))
    .replace('export const vehicleListings =','export const vehicleListings: Readonly<Record<string, readonly ListingVehicle[]>> =');
  personalizedListing=replaceOne(personalizedListing,/\nconst vehicleDefaults = \{[\s\S]*?\nexport const vehicleListings/,'\nexport const vehicleListings','Signature unused donor vehicle factory');
  put(files,listData,personalizedListing);
  const detailData = prefix+'src/lib/data/dealer-vehicles.json';
  put(files,detailData,jsonText(profile.listings.map((listing,index)=>({ ...listing,raw:undefined,card:cards[index] }))));
  return {contentPaths:[file,homeData,listData,detailData,...bindSignatureDetail(files,profile,logos,nativeFacts),...personalizeSignatureCopy(files,profile)],inventory:cards,nativeFacts};
}

/** Personalization operates on a derived pinned source map, never an editable master. */
export function applyExtendedRefreshAdapter({ files, key, profile, client }) {
  if (!Object.hasOwn(EXTENDED_VARIANT_RECEIPTS,key)) throw new Error(`No extended dealer adapter for ${key}`);
  const assets = retainDealerVariantAssets(files,key,profile,client);
  const mapped = new Map(assets.mediaMappings.map(item => [item.sourcePath,item.publicPath]));
  const derivedProfile = {...profile,listings:profile.listings.map(listing => ({...listing,
    image:mapped.get(listing.image)||listing.image,images:listing.images.map(value=>mapped.get(value)||value)}))};
  const adaptation = key === 'mobile' ? patchMobile(files,derivedProfile,assets.logoPaths) : patchSignature(files,derivedProfile,assets.logoPaths);
  return {...assets,...adaptation};
}

export function sealExtendedVariant({files,key,manifest,profile,adaptation}) {
  const profileDigest=sha256(JSON.stringify(profile));
  if(adaptation.profileSha256&&adaptation.profileSha256!==profileDigest)throw new Error(`${key}: dealer facts changed after personalization; review the factual consumers before resealing`);
  const template = manifest.templateSources?.[key];
  if (!template || template.repository !== 'darkapoparka/cars' || template.path !== `templates/${key}` ||
    !/^[a-f0-9]{40}$/.test(template.revision || '') || template.revision !== manifest.templateRevisions?.[key] ||
    !/^[a-f0-9]{40}$/.test(template.tree || '') || !/^[a-f0-9]{64}$/.test(template.digest || '')) throw new Error(`${key}: exact reviewed Cars source is required`);
  const receipt = { schemaVersion:1,format:key==='mobile'?'mobile-preview-v1':'signature-preview-v1',
    dealer:profile.slug,name:profile.business.name,template,sourceDigest:extendedVariantSourceDigest(files,key),
    inventory:{mode:profile.stockKind==='illustrative-not-dealer-stock'?'illustrative-not-dealer-stock':'dated-listing-snapshot',count:profile.listings.length,observedAt:profile.business.observedAt},
    personalization:{profileSha256:profileDigest,logoPaths:adaptation.logoPaths,mediaPaths:adaptation.mediaPaths,mediaMappings:adaptation.mediaMappings||[],contentPaths:adaptation.contentPaths,
      ...(key==='karento-best'?{nativeDealerFacts:adaptation.nativeFacts===true||adaptation.nativeDealerFacts===true}: {})},
    needsDealerQA:true,readyToPublish:false };
  put(files,EXTENDED_VARIANT_RECEIPTS[key],jsonText(receipt));
  return receipt;
}
