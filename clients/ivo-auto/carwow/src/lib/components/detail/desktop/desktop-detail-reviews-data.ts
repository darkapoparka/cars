export type DesktopDetailReview = {
	id: string;
	name: string;
	date: string;
	text: string;
	avatar?: string;
	initials?: string;
};

export const desktopDetailStarIndexes: number[] = [];
export const desktopDetailRatingRows: {id:string;label:string;percent:string}[] = [];
export const desktopDetailReviews: DesktopDetailReview[] = [
  {
    "id": "stock",
    "name": "Наличност",
    "date": "Потвърждение по телефона",
    "text": "Подбрани публикувани обяви; наличностите и условията се потвърждават с Иво Ауто.",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  },
  {
    "id": "visit",
    "name": "Посещение",
    "date": "Варна",
    "text": "бул. „Цар Освободител“ 256. Свържете се за работно време и оглед.",
    "avatar": "/assets/ivo-auto/wordmark.svg"
  }
];