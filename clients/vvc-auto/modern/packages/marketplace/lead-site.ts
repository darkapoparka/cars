export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig { readonly accent:string; readonly address:string; readonly city:string; readonly contactUrl:string; readonly country:string; readonly countryCode:string; readonly currency:LeadSiteCurrency; readonly email:string; readonly heroPath:string; readonly locale:string; readonly logoPath:string; readonly mapsEmbedUrl:string; readonly mapsUrl:string; readonly name:string; readonly phoneDisplay:string; readonly phoneHref:string; readonly shortName:string; readonly slug:string; readonly socialLinks?:Partial<Record<"youtube"|"instagram"|"facebook"|"tiktok",string>>; readonly staticDemoMode:boolean; readonly tagline:string; }
const address = "Орландовци, ул. „Железопътна“ 24Б";
export const leadSite: LeadSiteConfig = {
  accent:"#2563a6", address, city:"София", contactUrl:"tel:+359888629959", country:"България", countryCode:"BG", currency:"EUR", email:"",
  heroPath:"/lead-hero.jpg", locale:"bg-BG", logoPath:"/brand/logo.svg",
  mapsEmbedUrl:`https://www.google.com/maps?q=${encodeURIComponent(address + ', София')}&output=embed`, mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', София')}`,
  name:"В.В.Ц – АУТО", phoneDisplay:"0888 629 959", phoneHref:"tel:+359888629959", shortName:"В.В.Ц – АУТО", slug:"vvc-auto", staticDemoMode:true,
  tagline:"Употребявани автомобили в София. Цената, наличността и условията за всяка обява се потвърждават по телефона."
};
