export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
};

export const daynightReviews = [
  {
    "name": "Автомобили",
    "label": "Публикувани обяви",
    "text": "Подбрани публикувани обяви; наличностите и условията се потвърждават с Иво Ауто.",
    "id": "info-0",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  },
  {
    "name": "Посещение",
    "label": "Варна",
    "text": "бул. „Цар Освободител“ 256",
    "id": "info-1",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  },
  {
    "name": "Телефон",
    "label": "Контакт",
    "text": "0878 720 035",
    "id": "info-2",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  },
  {
    "name": "Бартер",
    "label": "Според обявата",
    "text": "Попитайте за условията за конкретния автомобил.",
    "id": "info-3",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  },
  {
    "name": "Лизинг",
    "label": "Според обявата",
    "text": "Условията се потвърждават индивидуално с продавача.",
    "id": "info-4",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  },
  {
    "name": "Работно време",
    "label": "Преди посещение",
    "text": "Свържете се за работно време и оглед.",
    "id": "info-5",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  }
] satisfies DayNightReview[];
export const daynightReviewCount=daynightReviews.length;
export const daynightReviewCountLabel='Полезна информация';
export const daynightReviewLinkLabel='Контакт и условия';
