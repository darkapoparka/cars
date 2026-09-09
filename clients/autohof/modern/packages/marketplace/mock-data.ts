import stock from './dealer-stock.json';
import { dealerProfile } from './dealer-profile';
import type { MarketplaceSearchParams } from '@repo/marketplace-domain/search';
import type { VehicleListing } from './types';
export * from '@repo/marketplace-domain/testing/mock-data';
const imagePending = '/assets/images/lead/inventory-photo-pending.svg';
const number = new Intl.NumberFormat('bg-BG');
const bodyTypes: Record<string, VehicleListing['spec']['bodyType']> = { Wagon:'wagon', SUV:'suv', Hatchback:'hatchback', Sedan:'sedan', Coupe:'coupe' };
const fuelTypes: Record<string, VehicleListing['spec']['fuelType']> = { 'Дизел':'diesel', 'Бензин':'gasoline', 'Хибрид':'hybrid', 'Електрически':'electric' };
const slugFor = (record: (typeof stock.listings)[number]) => `${record.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}-${record.sourceId}`;
export const mockListings: VehicleListing[] = stock.listings.map(record => ({
  id: record.sourceId, slug: slugFor(record), category:'car', dealerOrgId:`dealer-${dealerProfile.slug}`, status:'active',
  title:`${record.title} · ${record.yearNumber}`,
  description:`${record.description} Данни от обява към ${record.observedAt}; наличността не е независимо потвърдена. ${record.priceQualification}. Източник: ${record.evidenceUrl}`,
  price:{amount:record.priceEur,currency:'EUR'}, priceType:'fixed',
  images:[{url:imagePending,alt:`Няма интегрирана разрешена снимка за ${record.title}; вижте източника на обявата.`}],
  badges:['used'], location:{city:dealerProfile.city,region:dealerProfile.region,country:'България'},
  features:record.equipment.map(label=>({bg:label,en:label})),
  spec:{make:record.make,model:record.title.slice(record.make.length).trim(),year:record.yearNumber,bodyType:bodyTypes[record.category]??'other',fuelType:fuelTypes[record.fuel]??'other',transmission:record.transmission==='Автоматик'?'automatic':'manual',mileageValue:record.mileageKm,mileageUnit:'km',...(record.powerHp===null?{}:{enginePowerHp:record.powerHp}),colorExterior:record.color},
  seller:{id:`dealer-${dealerProfile.slug}`,type:'dealer',displayName:dealerProfile.name,verificationStatus:'unverified',city:dealerProfile.city},
  publishedAt:`${record.observedAt}T00:00:00.000Z`, promoted:false,
}));
const matchesText=(listing:VehicleListing,query:string)=>[listing.title,listing.description,listing.spec.make,listing.spec.model,listing.spec.trim,listing.location.city,listing.seller.displayName,number.format(listing.spec.mileageValue)].filter(Boolean).join(' ').toLocaleLowerCase('bg-BG').includes(query.trim().toLocaleLowerCase('bg-BG'));
export const getMockListings=(filters:MarketplaceSearchParams):VehicleListing[]=>{
 const result=mockListings.filter(listing=>listing.status==='active'&&listing.category===filters.category&&(!filters.q||matchesText(listing,filters.q))&&(!filters.make||listing.spec.make===filters.make)&&(!filters.model||listing.spec.model===filters.model)&&(!filters.location||listing.location.city===filters.location)&&(!filters.origin||filters.origin==='BG')&&(!filters.deliverTo||filters.deliverTo==='BG')&&(!filters.currency||filters.currency===listing.price.currency)&&(filters.priceMin===undefined||listing.price.amount>=filters.priceMin)&&(filters.priceMax===undefined||listing.price.amount<=filters.priceMax)&&(filters.yearMin===undefined||listing.spec.year>=filters.yearMin)&&(filters.yearMax===undefined||listing.spec.year<=filters.yearMax)&&(filters.mileageMax===undefined||listing.spec.mileageValue<=filters.mileageMax)&&(!filters.fuel||listing.spec.fuelType===filters.fuel)&&(!filters.transmission||listing.spec.transmission===filters.transmission)&&(!filters.body||listing.spec.bodyType===filters.body)&&(!filters.seller||listing.seller.type===filters.seller));
 const comparators:Record<MarketplaceSearchParams['sort'],(a:VehicleListing,b:VehicleListing)=>number>={mileage_asc:(a,b)=>a.spec.mileageValue-b.spec.mileageValue,newest:(a,b)=>b.publishedAt.localeCompare(a.publishedAt),price_asc:(a,b)=>a.price.amount-b.price.amount,price_desc:(a,b)=>b.price.amount-a.price.amount,recommended:()=>0,year_desc:(a,b)=>b.spec.year-a.spec.year};
 return result.sort(comparators[filters.sort]??comparators.recommended);
};
export const getMockListingBySlug=(slug:string)=>mockListings.find(listing=>listing.slug===slug);
export const getMockListingById=(id:string)=>mockListings.find(listing=>listing.id===id);
export const getMockRelatedListings=(source:VehicleListing,limit=3)=>mockListings.filter(listing=>listing.id!==source.id).map(listing=>({listing,score:Number(listing.spec.make===source.spec.make)*3+Number(listing.spec.bodyType===source.spec.bodyType)*2})).sort((a,b)=>b.score-a.score).slice(0,Math.max(0,limit)).map(({listing})=>listing);
export const mockSavedListingIds:string[]=[];
export const getMockSavedListings=():VehicleListing[]=>[];
export const mockSavedSearches:never[]=[];
