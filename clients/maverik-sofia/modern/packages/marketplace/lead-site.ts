export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig { readonly accent:string; readonly address:string; readonly city:string; readonly contactUrl:string; readonly country:string; readonly countryCode:string; readonly currency:LeadSiteCurrency; readonly email:string; readonly heroPath:string; readonly locale:string; readonly logoPath:string; readonly mapsEmbedUrl:string; readonly mapsUrl:string; readonly name:string; readonly phoneDisplay:string; readonly phoneHref:string; readonly shortName:string; readonly slug:string; readonly socialLinks?:Partial<Record<"youtube"|"instagram"|"facebook"|"tiktok",string>>; readonly staticDemoMode:boolean; readonly tagline:string; }
const address = "Дружба 1, бул. „Искърско шосе“ 13";
export const leadSite: LeadSiteConfig = {
  accent:"#d82c24", address, city:"София", contactUrl:"tel:+359878754914", country:"България", countryCode:"BG", currency:"EUR", email:"",
  heroPath:"/lead-hero.jpg", locale:"bg-BG", logoPath:"/brand/logo.svg",
  mapsEmbedUrl:`https://www.google.com/maps?q=${encodeURIComponent(address + ', София')}&output=embed`, mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', София')}`,
  name:"МАВЕРИК", phoneDisplay:"0878 754 914", phoneHref:"tel:+359878754914", shortName:"Маверик", slug:"maverik-sofia", staticDemoMode:true,
  tagline:"Автомобили в София и публикувани предложения с различни локации; проверете местонахождението на конкретния автомобил преди оглед."
};
