import dealer from './dealer-records.json';
export type CurrentDayNightListing={id:string;title:string;make:string;model:string;sourceUrl:string;priceEur:string;priceBgn:string;status:string;date:string;mileage:string;color:string;fuel:string;power:string;transmission:string;body:string;features:string[];image:string;gallery:string[];description:string;taxNote:string;location:string;};
// Seller-advertised, dated sample. No independent stock or condition verification is implied.
export const currentDayNightListings:CurrentDayNightListing[]=dealer.vehicles.map(v=>({
 id:v.sourceId,title:v.title,make:v.make,model:v.model,sourceUrl:v.sourceUrl,
 priceEur:`${new Intl.NumberFormat('bg-BG').format(v.price)} €`,priceBgn:'',status:'По обява',
 date:v.date,mileage:`${new Intl.NumberFormat('bg-BG').format(v.mileageKm)} км`,color:v.color,
 fuel:v.fuel,power:v.power,transmission:v.transmission,body:v.body,features:v.equipment,
 image:v.images[0],gallery:v.images,description:v.description,taxNote:v.taxNote,location:v.location
}));
