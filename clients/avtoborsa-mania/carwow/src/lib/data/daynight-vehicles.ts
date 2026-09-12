import dealer from './dealer-stock.json';
export type Car = {
	slug: string;
	title: string;
	shortTitle: string;
	brand: string;
	model: string;
	year: number;
	mileage: string;
	mileageValue: number;
	fuel: string;
	transmission: string;
	body: string;
	doors: number | string;
	engine: string;
	power: string;
	drive: string;
	color: string;
	price: number;
	priceEur: string;
	priceBgn: string;
	monthly: string;
	image: string;
	gallery: string[];
	badges: string[];
	conditionLine: string;
	description: string;
	features: string[];
	highlights: string[];
	lot: string;
	sourceUrl: string;
};
const labels: Record<string,string> = {incoming:'Очакван внос',consignment:'Клиентски автомобил',advertised:'Обявен автомобил','status-unconfirmed':'Статус за потвърждение',appointment:'Оглед с уговорка'};
export const cars: Car[] = dealer.inventory.map(record => {
  if (!Number.isFinite(record.price) || record.price <= 0) throw new Error(`Missing advertised price: ${record.id}`);
  const status = labels[record.sourceStatus] ?? 'Статус за потвърждение';
  const mileage = `${new Intl.NumberFormat('bg-BG').format(record.mileage)} км`;
  const slugBase = `${record.make}-${record.model}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return {
    slug:`${slugBase}-${record.id.slice(-6)}`, title:`${record.title} · ${status}`, shortTitle:record.title,
    brand:record.make,model:record.model,year:record.year,mileage,mileageValue:record.mileage,
    fuel:record.fuel,transmission:record.transmission,body:record.body,doors:'Не е посочено',engine:'Не е посочено',
    power:`${record.powerHp} к.с.`,drive:record.features.includes('4x4') ? '4x4' : 'Не е посочено',color:record.color,
    price:record.price,priceEur:`${new Intl.NumberFormat('bg-BG').format(record.price)} €`,priceBgn:'',monthly:'Условия при запитване',
    image:record.image,gallery:record.gallery.length ? record.gallery : [record.image],badges:[status],
    conditionLine:record.note,description:`${record.note} ${record.taxNote}. Данни към ${record.observedAt}; не са независима проверка на наличността.`,
    features:record.features,highlights:[status,record.taxNote,`${record.powerHp} к.с.`],lot:record.id,sourceUrl:record.sourceUrl
  };
});
export const daynightVehicles = cars;
export type DayNightVehicle = Car;
export type DayNightVehicleCondition = 'new' | 'used';
export type DayNightVehicleAvailability = 'available' | 'incoming' | 'unknown';
export const getDayNightVehicleCondition = (_vehicle: Pick<Car,'mileageValue'>): DayNightVehicleCondition => 'used';
export const getDayNightVehicleAvailability = (vehicle: Pick<Car,'highlights'>): DayNightVehicleAvailability => vehicle.highlights.includes('Очакван внос') ? 'incoming' : 'unknown';
export const getDayNightVehicleBySlug = (slug: string) => daynightVehicles.find(car => car.slug === slug);
export const placeholderImageSlugs = new Set(daynightVehicles.filter(car => car.image === '/dealer/media-pending.svg').map(car => car.slug));
export const featuredDayNightVehicles = daynightVehicles.slice(0,6);
