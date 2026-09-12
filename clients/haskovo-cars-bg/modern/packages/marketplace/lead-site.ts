export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig {readonly accent:string;readonly address:string;readonly city:string;readonly contactUrl:string;readonly country:string;readonly countryCode:string;readonly currency:LeadSiteCurrency;readonly email:string;readonly heroPath:string;readonly locale:string;readonly logoPath:string;readonly mapsEmbedUrl:string;readonly mapsUrl:string;readonly name:string;readonly phoneDisplay:string;readonly phoneHref:string;readonly shortName:string;readonly slug:string;readonly socialLinks?:Partial<Record<"youtube"|"instagram"|"facebook"|"tiktok",string>>;readonly staticDemoMode:boolean;readonly tagline:string;}
// LEAD_SITE_CONFIG_START
export const leadSite:LeadSiteConfig={
 accent:"#d71920",
 address:"бул. Освобождение (Кърджалийско шосе), Индустриална зона Юг",
 city:"Хасково",
 contactUrl:"tel:+359892047530",
 country:"България",countryCode:"BG",currency:"EUR",email:"",
 heroPath:"/lead-car-left.webp",locale:"bg-BG",logoPath:"/lead-logo.webp",
 mapsEmbedUrl:"https://maps.google.com/maps?q=%D0%B1%D1%83%D0%BB.%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%A5%D0%B0%D1%81%D0%BA%D0%BE%D0%B2%D0%BE&z=16&output=embed",
 mapsUrl:"https://www.google.com/maps/search/?api=1&query=%D0%B1%D1%83%D0%BB.%20%D0%9E%D1%81%D0%B2%D0%BE%D0%B1%D0%BE%D0%B6%D0%B4%D0%B5%D0%BD%D0%B8%D0%B5%2C%20%D0%A5%D0%B0%D1%81%D0%BA%D0%BE%D0%B2%D0%BE",
 name:"ХАСКОВО КАРС БГ",phoneDisplay:"0892 047 530",phoneHref:"tel:+359892047530",shortName:"ХАСКОВО КАРС БГ",slug:"haskovo-cars-bg",staticDemoMode:true,
 tagline:"Автомобили в Хасково с ясни публикувани данни и директен контакт за оглед."
};
// LEAD_SITE_CONFIG_END
