import { daynightSite } from './daynight-site';
export interface Dealer { slug:string; name:string; location:string; address:string; phone:string; logo:string; cover:string; inventory:number; rating:number; specialties:string[] }
export const dealers:Dealer[]=[{slug:'al-basma-motors',name:daynightSite.name,location:'Sharjah',address:daynightSite.location,phone:daynightSite.phoneLabel,logo:daynightSite.logoDark,cover:'/dealer/stock/cms38d0r90058p1a10q2alud6/1.webp',inventory:daynightSite.inventoryCount,rating:0,specialties:['Vehicle sales','Showroom enquiries','Export enquiries']}];
export function getDealerBySlug(slug:string){return dealers.find((dealer)=>dealer.slug===slug)}
