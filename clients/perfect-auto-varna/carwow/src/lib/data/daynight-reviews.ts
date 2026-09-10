export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/variant-3/assets/${string}`;
	name: string;
	label: string;
	rating: number;
};

export const daynightReviews = [
	{id:'inventory',text:'Разгледайте текущата представителна извадка от публикувани автомобили и потвърдете наличността по телефона.',avatar:'/variant-3/assets/perfect-auto/cover.png',name:'Текущи обяви',label:'Информация от Mobile.bg',rating:0},
	{id:'trade',text:'Част от текущите обяви посочват възможност за бартер. Условията се уточняват директно с автокъщата.',avatar:'/variant-3/assets/perfect-auto/cover.png',name:'Бартер',label:'Публикувана възможност',rating:0},
	{id:'leasing',text:'Част от текущите обяви посочват лизинг. Конкретните условия и одобрение се потвърждават при запитване.',avatar:'/variant-3/assets/perfect-auto/cover.png',name:'Лизинг',label:'Публикувана възможност',rating:0}
] satisfies DayNightReview[];

export const daynightReviewDisclosure = 'Информационни карти от текущи обяви — не клиентски отзиви или оценки.';
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Услуги и информация';
export const daynightReviewLinkLabel = 'Виж информацията';
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5,4,3,2,1].map(rating=>({id:`${rating}-star`,label:String(rating),count:0,percent:'0%'}));
