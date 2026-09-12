import dealer from './dealer-stock.json';
export type CurrentDayNightListing = {
 id:string; title:string; sourceUrl:string; priceEur:string; priceBgn:string; status:string; date:string; mileage:string; color:string; fuel:string; power:string; transmission:string; body:string; features:string[]; image:string;
};
const status: Record<string,string> = {incoming:'Очакван внос',consignment:'Клиентски автомобил',advertised:'Обявен автомобил','status-unconfirmed':'Статус за потвърждение',appointment:'Оглед с уговорка'};
export const currentDayNightListings: CurrentDayNightListing[] = dealer.inventory.map(record => ({
  id:record.id,title:record.title,sourceUrl:record.sourceUrl,priceEur:`${new Intl.NumberFormat('bg-BG').format(record.price)} €`,priceBgn:'',
  status:status[record.sourceStatus] ?? 'Статус за потвърждение',date:String(record.year),mileage:`${new Intl.NumberFormat('bg-BG').format(record.mileage)} км`,
  color:record.color,fuel:record.fuel,power:`${record.powerHp} к.с.`,transmission:record.transmission,body:record.body,features:record.features,image:record.image
}));
