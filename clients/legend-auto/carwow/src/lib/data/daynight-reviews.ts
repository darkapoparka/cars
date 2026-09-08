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
    "label": "Публикувани предложения",
    "text": "Разгледайте автомобилите на LEGEND AUTO. Потвърдете наличността преди посещение.",
    "id": "info-0",
    "avatar": "/assets/legend-auto/logo-original.png"
  },
  {
    "name": "Оглед",
    "label": "Предварителна уговорка",
    "text": "Обадете се на 0899 877 305 за автомобила и удобен час за оглед.",
    "id": "info-1",
    "avatar": "/assets/legend-auto/logo-original.png"
  },
  {
    "name": "Транспорт",
    "label": "До всяка точка на страната",
    "text": "Транспортът е посочен в обявите на LEGEND AUTO. Уточнете цената и условията по телефона.",
    "id": "info-2",
    "avatar": "/assets/legend-auto/logo-original.png"
  }
] satisfies DayNightReview[];
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Информация за покупката';
export const daynightReviewLinkLabel = 'Полезна информация';
