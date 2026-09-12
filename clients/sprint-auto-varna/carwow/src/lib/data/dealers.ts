import { dealer as identity, stock } from './dealer';

export interface Dealer {slug:string;name:string;location:string;address:string;phone:string;logo:string;cover:string;inventory:number;rating:number;specialties:string[]}
export const dealers:Dealer[]=[{
  slug:identity.slug,name:identity.name,location:identity.city,address:identity.address,
  phone:identity.phone,logo:identity.logo,cover:identity.hero,inventory:stock.length,
  rating:0,specialties:['Демонстрационна извадка','Наличност за потвърждение','Няма потвърдена оценка']
}];
// Preserve legacy route aliases without creating fictitious additional dealers.
export function getDealerBySlug(slug:string){
  return dealers.find(dealer=>dealer.slug===slug)??(
    ['day-night-auto-group','day-night-auto-group-documents','day-night-auto-group-sourcing'].includes(slug)?dealers[0]:undefined
  );
}
