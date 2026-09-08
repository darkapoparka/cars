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

export const daynightTeam: DayNightTeamMember[] = [
  {
    "slug": "prodazhbi-showroom",
    "name": "Автомобили",
    "role": "Контакт с Аутомаркет Варна",
    "phone": "0886424400",
    "email": "",
    "image": "/assets/automarket/cover.png",
    "bio": "Въпроси за публикуваните автомобили, оборудването и актуалната наличност.",
    "detail": "Въпроси за публикуваните автомобили, оборудването и актуалната наличност. Телефон: 0886 424 400."
  },
  {
    "slug": "barter-i-ocenka",
    "name": "Бартер",
    "role": "Контакт с Аутомаркет Варна",
    "phone": "0886424400",
    "email": "",
    "image": "/assets/automarket/cover.png",
    "bio": "Обсъдете замяна на стар автомобил срещу доплащане.",
    "detail": "Обсъдете замяна на стар автомобил срещу доплащане. Телефон: 0886 424 400."
  },
  {
    "slug": "dokumenti-finansirane",
    "name": "Регистрация и лизинг",
    "role": "Контакт с Аутомаркет Варна",
    "phone": "0886424400",
    "email": "",
    "image": "/assets/automarket/cover.png",
    "bio": "Попитайте за съдействие при регистрация и за условията на финансовите партньори.",
    "detail": "Попитайте за съдействие при регистрация и за условията на финансовите партньори. Телефон: 0886 424 400."
  },
  {
    "slug": "klientski-zapitvania",
    "name": "Оглед във Варна",
    "role": "Контакт с Аутомаркет Варна",
    "phone": "0886424400",
    "email": "",
    "image": "/assets/automarket/cover.png",
    "bio": "Уточнете работно време, автомобил и удобен час по телефона.",
    "detail": "Уточнете работно време, автомобил и удобен час по телефона. Телефон: 0886 424 400."
  }
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
