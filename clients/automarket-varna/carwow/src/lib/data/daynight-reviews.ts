export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
};

export const daynightReviews: DayNightReview[] = [
  {
    "id": "service-0",
    "text": "Внос на употребявани автомобили от ЕС и доставка по поръчка.",
    "avatar": "/assets/automarket/cover.png",
    "name": "Продажба на употребявани автомобили",
    "label": "Информация от публикуваните обяви"
  },
  {
    "id": "service-1",
    "text": "Обсъдете замяна на автомобила си срещу доплащане.",
    "avatar": "/assets/automarket/cover.png",
    "name": "Внос от ЕС и доставка по поръчка",
    "label": "Информация от публикуваните обяви"
  },
  {
    "id": "service-2",
    "text": "Съдействие при регистрация в КАТ и транзитни номера.",
    "avatar": "/assets/automarket/cover.png",
    "name": "Бартер с доплащане",
    "label": "Информация от публикуваните обяви"
  }
];
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Услуги и информация';
export const daynightReviewLinkLabel = 'Виж информацията';
