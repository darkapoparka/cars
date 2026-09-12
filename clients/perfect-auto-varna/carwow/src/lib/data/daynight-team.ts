export const daynightTeamDisclosure = 'Демо профили и портрети: примерни роли, а не потвърдени членове на екипа.';

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
		slug: 'prodazhbi-showroom',
		name: "Екип продажби Перфект Ауто",
		role: 'Консултант продажби',
		phone: "0888802226",
		email: '',
		image: '/variant-3/assets/images/pages/daynight-team-sales-v1.webp',
		bio: 'Екипът съдейства при избор на автомобил, първи оглед, сравнение на наличните предложения и подреден процес до сделката.',
		detail:
			"Консултантите на Перфект Ауто помагат с избор според бюджет, пробег, оборудване и реална наличност. При нужда подготвят оглед, запазване на автомобил и координация на следващите стъпки."
	},
	{
		slug: 'barter-i-ocenka',
		name: 'Екип бартер и оценка',
		role: 'Оценка, покупка и бартер',
		phone: "0888802226",
		email: '',
		image: '/variant-3/assets/images/pages/daynight-team-evaluation-v1.webp',
		bio: 'Екипът приема запитвания за продажба или замяна на автомобил и подготвя реалистична оценка според пазара и състоянието.',
		detail:
			'При бартер или директно изкупуване екипът разглежда автомобила, документите и сервизната история, след което дава ясен вариант за следващите стъпки.'
	},
	{
		slug: 'dokumenti-finansirane',
		name: 'Екип документи и финансиране',
		role: 'Документи и финансиране',
		phone: "0888802226",
		email: '',
		image: '/variant-3/assets/images/pages/daynight-team-documents-v1.webp',
		bio: 'Екипът координира документи, регистрация, разсрочено плащане и подготовка за предаване на автомобила.',
		detail:
			'След избор на автомобил екипът подрежда документите, комуникацията по финансирането и практичните стъпки до предаването.'
	},
	{
		slug: 'klientski-zapitvania',
		name: 'Екип клиентски заявки',
		role: 'Огледи и следващи стъпки',
		phone: "0888802226",
		email: '',
		image: '/variant-3/assets/images/pages/daynight-team-customer-v1.webp',
		bio: 'Екипът подготвя запитванията, уточнява часове за оглед и държи комуникацията подредена преди посещение на място.',
		detail:
			'Клиентските заявки минават през ясен контакт за телефон, имейл и оглед, така че всеки интерес да получи отговор с реална наличност и конкретно действие.'
	}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
	daynightTeam.find((member) => member.slug === slug);
