export interface BlogPost {
	slug: string;
	title: string;
	category: string;
	date: string;
	image: string;
	excerpt: string;
	content: string[];
}

export const posts: BlogPost[] = [
  {
    "slug": "vnos-ot-kanada-proverka",
    "title": "Какво да попитате преди оглед",
    "category": "Оглед",
    "date": "Септември 2026",
    "image": "/assets/daynight/blog/import-studio-v2.png",
    "excerpt": "Потвърдете наличност, история и документи за конкретния автомобил.",
    "content": [
      "Изпратете номера или връзката към избраната обява и попитайте дали автомобилът все още е наличен.",
      "Поискайте наличната сервизна история и уточнете кои данни и документи могат да бъдат проверени на място."
    ]
  },
  {
    "slug": "gotov-za-registracia",
    "title": "Подгответе въпросите си за автомобила",
    "category": "Документи",
    "date": "Септември 2026",
    "image": "/assets/daynight/blog/registration-studio-v2.png",
    "excerpt": "Уточнете какво е включено в цената и какви документи са налични.",
    "content": [
      "Данните на този сайт са датирана извадка от публични обяви, а не автоматично обновявана наличност.",
      "Потвърдете цената, условията и документите директно с автокъщата, преди да вземете решение."
    ]
  },
  {
    "slug": "prodai-avtomobila-si",
    "title": "Организирайте посещение във Варна",
    "category": "Посещение",
    "date": "Септември 2026",
    "image": "/assets/daynight/blog/inspection-studio-v2.png",
    "excerpt": "бул. Янош Хуняди 518, срещу КАТ Варна. Проверете работното време преди пътуване.",
    "content": [
      "Пон.–пет. 08:30–17:30; съб.–нед. почивни дни",
      "Обадете се предварително, посочете автомобила и уговорете удобно време."
    ]
  }
];

export function getPostBySlug(slug: string) {
	return posts.find((post) => post.slug === slug);
}
