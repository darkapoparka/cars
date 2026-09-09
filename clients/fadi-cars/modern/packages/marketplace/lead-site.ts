export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig { readonly accent:string; readonly address:string; readonly city:string; readonly contactUrl:string; readonly country:string; readonly countryCode:string; readonly currency:LeadSiteCurrency; readonly email:string; readonly heroPath:string; readonly locale:string; readonly logoPath:string; readonly mapsEmbedUrl:string; readonly mapsUrl:string; readonly name:string; readonly phoneDisplay:string; readonly phoneHref:string; readonly shortName:string; readonly slug:string; readonly socialLinks?:Partial<Record<"youtube"|"instagram"|"facebook"|"tiktok",string>>; readonly staticDemoMode:boolean; readonly tagline:string; }
const address = "Суходол, ул. „Околовръстен път Суходол“ 899";
export const leadSite: LeadSiteConfig = {
  accent:"#0f7a68", address, city:"София", contactUrl:"tel:+359897985999", country:"България", countryCode:"BG", currency:"EUR", email:"",
  heroPath:"/lead-hero.jpg", locale:"bg-BG", logoPath:"/brand/logo.svg",
  mapsEmbedUrl:`https://www.google.com/maps?q=${encodeURIComponent(address + ', София')}&output=embed`, mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', София')}`,
  name:"ФАДИ КАРС", phoneDisplay:"0897 985 999", phoneHref:"tel:+359897985999", shortName:"Фади Карс", slug:"fadi-cars", staticDemoMode:true,
  tagline:"Автомобили в София с публикувани цени и оборудване; условията за конкретния автомобил се потвърждават с продавача."
};
