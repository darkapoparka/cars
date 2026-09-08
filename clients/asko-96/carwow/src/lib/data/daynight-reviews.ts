export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
};

export const daynightReviews = [
  {
    "id": "service-0",
    "name": "Автомобили",
    "label": "Продажба на автомобили",
    "text": "Разгледайте публикуваните предложения на АСКО 96. Потвърдете наличността преди посещение.",
    "avatar": "/assets/asko96/asko96-wordmark.png"
  },
  {
    "id": "service-1",
    "name": "Замяна и изкупуване",
    "label": "Вашият автомобил",
    "text": "АСКО 96 предлага замяна и изкупуване. Свържете се с екипа за условията и оценка.",
    "avatar": "/assets/asko96/asko96-wordmark.png"
  },
  {
    "id": "service-2",
    "name": "Внос по поръчка",
    "label": "По вашите критерии",
    "text": "Обсъдете търсения автомобил, бюджет и условия за внос с АСКО 96.",
    "avatar": "/assets/asko96/asko96-wordmark.png"
  },
  {
    "id": "service-3",
    "name": "Собствен лизинг",
    "label": "Финансиране",
    "text": "АСКО 96 предлага собствен лизинг. Конкретните условия се уточняват индивидуално.",
    "avatar": "/assets/asko96/asko96-wordmark.png"
  },
  {
    "id": "service-4",
    "name": "Сервизно обслужване",
    "label": "Следващи стъпки",
    "text": "Попитайте АСКО 96 за възможностите за сервизно обслужване.",
    "avatar": "/assets/asko96/asko96-wordmark.png"
  },
  {
    "id": "service-5",
    "name": "Посещение",
    "label": "София",
    "text": "Ще намерите АСКО 96 на бул. „Ботевградско шосе“ 300 в София.",
    "avatar": "/assets/asko96/asko96-wordmark.png"
  }
] satisfies DayNightReview[];
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = `${daynightReviewCount} полезни акцента`;
export const daynightReviewLinkLabel = `Всички услуги`;
