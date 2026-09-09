export type LeadSiteCurrency = "AED" | "BGN" | "EUR" | "USD";
export interface LeadSiteConfig { readonly accent:string; readonly address:string; readonly city:string; readonly contactUrl:string; readonly country:string; readonly countryCode:string; readonly currency:LeadSiteCurrency; readonly email:string; readonly heroPath:string; readonly locale:string; readonly logoPath:string; readonly mapsEmbedUrl:string; readonly mapsUrl:string; readonly name:string; readonly phoneDisplay:string; readonly phoneHref:string; readonly shortName:string; readonly slug:string; readonly socialLinks?:Partial<Record<"youtube"|"instagram"|"facebook"|"tiktok",string>>; readonly staticDemoMode:boolean; readonly tagline:string; }
export const leadSite: LeadSiteConfig = {
  accent:"#c13f38", address:"Souk Al Haraj, showroom 353", city:"Sharjah", contactUrl:"tel:+971545555204",
  country:"United Arab Emirates", countryCode:"AE", currency:"AED", email:"", heroPath:"/dealer/vehicle-preview.svg", locale:"en-AE",
  logoPath:"/dealer/logo.svg", mapsEmbedUrl:"https://maps.google.com/maps?q=Souk%20Al%20Haraj%20showroom%20353%20Sharjah&output=embed",
  mapsUrl:"https://www.google.com/maps/search/?api=1&query=Souk%20Al%20Haraj%20showroom%20353%20Sharjah",
  name:"Al Hamoor Al Thahabi Used Cars", phoneDisplay:"+971 54 555 5204", phoneHref:"tel:+971545555204", shortName:"Al Hamoor Al Thahabi",
  slug:"al-hamoor-al-thahabi", staticDemoMode:true, tagline:"Used cars in Sharjah — confirm availability and viewing location before travelling."
};
