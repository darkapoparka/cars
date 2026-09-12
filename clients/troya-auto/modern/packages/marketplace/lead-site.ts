export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig {
  readonly accent:string; readonly address:string; readonly city:string; readonly contactUrl:string;
  readonly country:string; readonly countryCode:string; readonly currency:LeadSiteCurrency; readonly email:string;
  readonly heroPath:string; readonly locale:string; readonly logoPath:string; readonly mapsEmbedUrl:string; readonly mapsUrl:string;
  readonly name:string; readonly phoneDisplay:string; readonly phoneHref:string; readonly shortName:string; readonly slug:string;
  readonly socialLinks?: Partial<Record<"youtube"|"instagram"|"facebook"|"tiktok",string>>;
  readonly staticDemoMode:boolean; readonly tagline:string;
}
const address = "в.з. Врана – Лозен, ул. „Стар Лозенски път“ 45";
export const leadSite: LeadSiteConfig = {
  accent:"#b86b32", address, city:"София", contactUrl:"tel:+359886067006", country:"България", countryCode:"BG", currency:"EUR", email:"",
  heroPath:"/lead-hero.jpg", locale:"bg-BG", logoPath:"/brand/logo.svg",
  mapsEmbedUrl:`https://www.google.com/maps?q=${encodeURIComponent(address + ', София')}&output=embed`,
  mapsUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', София')}`,
  name:"TROYA AUTO", phoneDisplay:"0886 067 006", phoneHref:"tel:+359886067006", shortName:"Troya Auto", slug:"troya-auto",
  staticDemoMode:true, tagline:"Употребявани автомобили от Швейцария, Германия и Холандия. Потвърдете конкретната наличност и оглед по телефона."
};
