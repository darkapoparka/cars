export type DayNightTeamMember = {
	slug: string;
	name: string;
	role: string;
	phone: string;
	email: string;
	image: string;
	bio: string;
	detail: string;
};

export const daynightTeam: DayNightTeamMember[] = [{"slug":"prodazhbi-showroom","name":"Автомобили","role":"Публикувани предложения","phone":"0877800921","email":"","image":"/assets/avangard/vehicle-01-1.webp","bio":"Разгледайте 16 избрани обяви. За актуална наличност се свържете с AVANGARD AUTO.","detail":"Разгледайте 16 избрани обяви. За актуална наличност се свържете с AVANGARD AUTO."},{"slug":"barter-i-ocenka","name":"Регистрация","role":"Съдействие в КАТ","phone":"0877800921","email":"","image":"/assets/avangard/vehicle-02-1.webp","bio":"В обявите се предлага съдействие при регистрация и издаване на транзитни номера.","detail":"В обявите се предлага съдействие при регистрация и издаване на транзитни номера."},{"slug":"dokumenti-finansirane","name":"Транспорт","role":"В България","phone":"0877800921","email":"","image":"/assets/avangard/vehicle-03-1.webp","bio":"В обявите се предлага транспорт до всяка точка в България. Уточнете цена и условия.","detail":"В обявите се предлага транспорт до всяка точка в България. Уточнете цена и условия."},{"slug":"klientski-zapitvania","name":"Лизинг","role":"Индивидуални условия","phone":"0877800921","email":"","image":"/assets/avangard/vehicle-04-1.webp","bio":"Автомобили с обявена възможност за лизинг. Условията се потвърждават за конкретната сделка.","detail":"Автомобили с обявена възможност за лизинг. Условията се потвърждават за конкретната сделка."}];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
