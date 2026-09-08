export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
};

export const daynightReviews = [
  {
    "id": "info-0",
    "name": "Автомобили",
    "label": "Публикувани предложения",
    "text": "Разгледайте 16 избрани обяви. За актуална наличност се свържете с AVANGARD AUTO.",
    "avatar": "/assets/avangard/social-logo.jpg"
  },
  {
    "id": "info-1",
    "name": "Регистрация",
    "label": "Съдействие в КАТ",
    "text": "В обявите се предлага съдействие при регистрация и издаване на транзитни номера.",
    "avatar": "/assets/avangard/social-logo.jpg"
  },
  {
    "id": "info-2",
    "name": "Транспорт",
    "label": "В България",
    "text": "В обявите се предлага транспорт до всяка точка в България. Уточнете цена и условия.",
    "avatar": "/assets/avangard/social-logo.jpg"
  },
  {
    "id": "info-3",
    "name": "Лизинг",
    "label": "Индивидуални условия",
    "text": "Автомобили с обявена възможност за лизинг. Условията се потвърждават за конкретната сделка.",
    "avatar": "/assets/avangard/social-logo.jpg"
  },
  {
    "id": "info-4",
    "name": "Оглед",
    "label": "Варна",
    "text": "Бул. Цар Освободител 289, Варна. Обадете се за работно време и удобен час.",
    "avatar": "/assets/avangard/social-logo.jpg"
  },
  {
    "id": "info-5",
    "name": "Контакт",
    "label": "0877 800 921",
    "text": "За въпроси: 0877 800 921 или 0896 391 615.",
    "avatar": "/assets/avangard/social-logo.jpg"
  }
] satisfies DayNightReview[];
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Полезна информация';
export const daynightReviewLinkLabel = 'Всички акценти';
