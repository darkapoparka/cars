import { dealer } from './dealer';

export const daynightTeamDisclosure='Тематични контакти на общия публикуван телефон. Това не са индивидуални профили или потвърдени служители.';
export type DayNightTeamMember={slug:string;name:string;role:string;phone:string;email:string;image:string;bio:string;detail:string};
export const daynightTeam:DayNightTeamMember[]=[
  {slug:'prodazhbi-showroom',name:`${dealer.name} — обяви`,role:'Въпроси за автомобил',phone:dealer.phoneE164,email:'',image:dealer.logo,bio:'Изберете конкретна обява и попитайте за актуалната наличност, цена и удобен час за оглед.',detail:'Данните в каталога са извадка от публикувани обяви. Потвърдете пробега, оборудването, състоянието и адреса директно с продавача.'},
  {slug:'barter-i-ocenka',name:`${dealer.name} — вашият автомобил`,role:'Въпрос за продажба или замяна',phone:dealer.phoneE164,email:'',image:dealer.logo,bio:'Попитайте дали автокъщата разглежда предложения за покупка или замяна на автомобил.',detail:'Подгответе марка, модел, година, пробег и снимки. Тази страница не е обещание за изкупуване, оценка или бартер.'},
  {slug:'dokumenti-finansirane',name:`${dealer.name} — документи`,role:'Произход и условия',phone:dealer.phoneE164,email:'',image:dealer.logo,bio:'Уточнете произхода, регистрацията, документите и начина на плащане за избрания автомобил.',detail:'Няма потвърден финансов доставчик или кредитна оферта в демонстрацията. Поискайте всички приложими условия директно от продавача.'},
  {slug:'klientski-zapitvania',name:`${dealer.name} — посещение`,role:'Адрес и оглед',phone:dealer.phoneE164,email:'',image:dealer.logo,bio:`Публикуваният адрес е ${dealer.address}. Потвърдете часа и точния вход преди посещение.`,detail:'Подготвеното в демонстрацията запитване не означава изпратено съобщение или резервиран час. За потвърждение използвайте публикувания телефон.'}
];
export const getDayNightTeamMemberBySlug=(slug:string)=>daynightTeam.find(member=>member.slug===slug);
