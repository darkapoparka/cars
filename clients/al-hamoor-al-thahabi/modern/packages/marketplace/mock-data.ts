export * from "@repo/marketplace-domain/testing/mock-data";
import type { MarketplaceSearchParams } from "@repo/marketplace-domain/search";
import type { VehicleListing } from "@repo/marketplace-domain/types";
const source="https://www.dubicars.com/dealers/sharjah-al-hamoor-al-thahabi-used-cars-1414";
const raw=[
 ["ah-1","mercedes-benz-cla250-2025","2025 Mercedes-Benz CLA250 Premium + 2.0L",95000,22000,"Mercedes-Benz","CLA250",2025,"sedan"],
 ["ah-2","nissan-rogue-2023","2023 Nissan Rogue Platinum",45000,56000,"Nissan","Rogue",2023,"suv"],
 ["ah-3","toyota-prado-2011","2011 Toyota Prado TX-L",56000,212000,"Toyota","Prado",2011,"suv"],
 ["ah-4","chevrolet-malibu-2022","2022 Chevrolet Malibu LT",32000,95000,"Chevrolet","Malibu",2022,"sedan"],
 ["ah-5","toyota-rush-2023","2023 Toyota Rush EX 1.5L",43000,121000,"Toyota","Rush",2023,"suv"],
 ["ah-6","chevrolet-trax-2020","2020 Chevrolet Trax LT AWD",14500,106000,"Chevrolet","Trax",2020,"suv"],
 ["ah-7","ford-figo-2019","2019 Ford Figo Ambiente",13500,185000,"Ford","Figo",2019,"sedan"],
 ["ah-8","nissan-sentra-2021","2021 Nissan Sentra SV 1.6L",23000,116000,"Nissan","Sentra",2021,"sedan"]
] as const;
export const mockListings:VehicleListing[]=raw.map(([id,slug,title,amount,mileage,make,model,year,bodyType],i)=>({id,slug,category:"car",dealerOrgId:"dealer-al-hamoor",status:"active",title,description:`Dated marketplace sample from ${source}. Confirm availability, condition and viewing location.`,price:{amount,currency:"AED"},priceType:"fixed",images:[{url:"/dealer/vehicle-preview.svg",alt:title}],badges:["used"],location:{city:"Sharjah",region:"Sharjah",country:"United Arab Emirates"},spec:{make,model,year,bodyType:bodyType as "sedan"|"suv",fuelType:"gasoline",transmission:"automatic",mileageValue:mileage,mileageUnit:"km"},seller:{id:"dealer-al-hamoor",type:"dealer",displayName:"Al Hamoor Al Thahabi Used Cars",verificationStatus:"unverified",city:"Sharjah"},publishedAt:`2026-09-0${Math.min(i+1,9)}T09:00:00.000Z`,promoted:i<2}));
const text=(x:VehicleListing)=>`${x.title} ${x.spec.make} ${x.spec.model}`.toLowerCase();
export const getMockListings=(f:MarketplaceSearchParams)=>mockListings.filter(x=>x.status==="active"&&x.category===f.category&&(!f.q||text(x).includes(f.q.toLowerCase()))&&(!f.make||x.spec.make===f.make)&&(!f.model||x.spec.model===f.model)&&(f.priceMin===undefined||x.price.amount>=f.priceMin)&&(f.priceMax===undefined||x.price.amount<=f.priceMax)&&(f.yearMin===undefined||x.spec.year>=f.yearMin)&&(f.yearMax===undefined||x.spec.year<=f.yearMax)&&(f.mileageMax===undefined||x.spec.mileageValue<=f.mileageMax)&&(!f.fuel||x.spec.fuelType===f.fuel)&&(!f.transmission||x.spec.transmission===f.transmission)&&(!f.body||x.spec.bodyType===f.body)).sort((a,b)=>f.sort==="price_asc"?a.price.amount-b.price.amount:f.sort==="price_desc"?b.price.amount-a.price.amount:f.sort==="mileage_asc"?a.spec.mileageValue-b.spec.mileageValue:f.sort==="year_desc"?b.spec.year-a.spec.year:Number(b.promoted)-Number(a.promoted));
export const getMockListingById=(id:string)=>mockListings.find(x=>x.id===id); export const getMockListingBySlug=(slug:string)=>mockListings.find(x=>x.slug===slug); export const getMockRelatedListings=(sourceListing:VehicleListing,limit=3)=>mockListings.filter(x=>x.id!==sourceListing.id).slice(0,limit); export const getMockSavedListings=()=>mockListings.slice(0,3);
