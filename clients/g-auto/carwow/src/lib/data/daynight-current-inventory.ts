import stock from './dealer-stock.json';
export type CurrentDayNightListing = {
	id: string;
	title: string;
	sourceUrl: string;
	priceEur: string;
	priceBgn: string;
	status: string;
	date: string;
	mileage: string;
	color: string;
	fuel: string;
	power: string;
	transmission: string;
	body: string;
	features: string[];
	image: string;
	gallery: string[];
	notes: string;
	engine: string;
	canonicalSlug: string;
	shortTitle: string;
	brand: string;
	model: string;
};


export const currentDayNightListings: CurrentDayNightListing[] = stock.map(v=>({id:v.sourceId,title:v.title,shortTitle:v.title,brand:v.make,model:v.model,canonicalSlug:v.slug,sourceUrl:v.sourceUrl,priceEur:new Intl.NumberFormat('bg-BG').format(v.priceEur)+' €',priceBgn:'',status:'По обява · 09.09.2026',date:v.production,mileage:new Intl.NumberFormat('bg-BG').format(v.mileageKm)+' км',color:v.color,fuel:v.fuel,power:v.powerHp?String(v.powerHp)+' к.с.':'—',transmission:v.transmission,body:v.bodyLabel,features:v.features,image:v.images[0].path,gallery:v.images.map(i=>i.path),notes:v.notes+' '+(v.taxText??''),engine:String(v.engineCc)+' см³'}));
