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
    "id": "info-0",
    "name": "Продажба на употребявани автомобили",
    "date": "Информация от обявите",
    "text": "Продажба на употребявани автомобили. За условия и оглед се свържете по телефона.",
    "avatar": "/assets/automarket/cover.png"
  },
  {
    "id": "info-1",
    "name": "Внос от ЕС и доставка по поръчка",
    "date": "Информация от обявите",
    "text": "Внос от ЕС и доставка по поръчка. За условия и оглед се свържете по телефона.",
    "avatar": "/assets/automarket/cover.png"
  },
  {
    "id": "info-2",
    "name": "Бартер с доплащане",
    "date": "Информация от обявите",
    "text": "Бартер с доплащане. За условия и оглед се свържете по телефона.",
    "avatar": "/assets/automarket/cover.png"
  }
];
