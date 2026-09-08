export type DayNightReview = {
	id: string;
	text: string;
	avatar: `/assets/${string}`;
	name: string;
	label: string;
};

// Published service information, not customer testimonials.
export const daynightReviews = [
  {
    "id": "service-0",
    "text": "Потвърдете наличността и уговорете посещение по телефона.",
    "avatar": "/assets/excellent/vehicle-01-1.webp",
    "name": "Excellent Cars",
    "label": "Продажба на автомобили"
  },
  {
    "id": "service-1",
    "text": "Оглед и тест драйв на избрания автомобил след уговорка.",
    "avatar": "/assets/excellent/vehicle-02-1.webp",
    "name": "Excellent Cars",
    "label": "Оглед и тест драйв"
  },
  {
    "id": "service-2",
    "text": "Възможност за проверка в избран от клиента сервиз.",
    "avatar": "/assets/excellent/vehicle-03-1.webp",
    "name": "Excellent Cars",
    "label": "Проверка в сервиз по избор на клиента"
  },
  {
    "id": "service-3",
    "text": "Съдействие при регистрация и транзитни номера.",
    "avatar": "/assets/excellent/vehicle-04-1.webp",
    "name": "Excellent Cars",
    "label": "Съдействие при регистрация и транзитни номера"
  },
  {
    "id": "service-4",
    "text": "Обсъдете индивидуалните условия за избрания автомобил.",
    "avatar": "/assets/excellent/vehicle-05-1.webp",
    "name": "Excellent Cars",
    "label": "Лизинг с индивидуални условия"
  },
  {
    "id": "service-5",
    "text": "Предложете своя автомобил за оценка.",
    "avatar": "/assets/excellent/vehicle-06-1.webp",
    "name": "Excellent Cars",
    "label": "Изкупуване и бартер"
  }
] satisfies DayNightReview[];
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Услуги и информация';
export const daynightReviewLinkLabel = 'Виж услугите';
