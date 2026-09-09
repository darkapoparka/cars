import { dealerProfile } from './dealer-profile';
export type FaqAnswerParagraph={readonly class:string;readonly text:string};
export type FaqItem={readonly id:string;readonly question:string;readonly toggleClass:string;readonly answer:readonly FaqAnswerParagraph[]};
export type FaqGroup={readonly id:string;readonly containerClass:string;readonly headingClass:string;readonly heading:string;readonly items:readonly FaqItem[]};
const answer=(...paragraphs:string[]):readonly FaqAnswerParagraph[]=>paragraphs.map((text,index)=>({class:`${index<paragraphs.length-1?'mb-8 ':''}h7 text-secondary line-height-28`,text}));
export const daynightFaqGroups:readonly FaqGroup[]=[
 {id:'how-to-buy',containerClass:'container mb-60',headingClass:'h3 mb-20 text-center capitalize',heading:'Избор и оглед',items:[
  {id:'steps',question:'Как да започна с избрания автомобил?',toggleClass:'flat-toggle bg-white',answer:answer(`Разгледайте автомобила и оригиналната му обява. Този демо каталог използва ${dealerProfile.sampleCount} датирани обяви на ${dealerProfile.name} към ${dealerProfile.observedAt}; не е текуща складова система.`,`За актуална наличност, цена и оглед се обадете на ${dealerProfile.phoneDisplay}. Демо сайтът не резервира автомобил и не потвърждава покупка.`)},
  {id:'financing-documents',question:'Какви са условията за финансиране?',toggleClass:'flat-toggle',answer:answer(`${dealerProfile.financingSummary} Необходими документи, лихви, такси и решение за одобрение се уточняват по конкретна оферта.`)},
  {id:'reserve',question:'Мога ли да резервирам през сайта?',toggleClass:'flat-toggle bg-white',answer:answer('Не. Демо действията не приемат капаро, не запазват автомобил и не изпращат заявка към дилъра. Условията за евентуална резервация се потвърждават директно.')},
  {id:'payment-methods',question:'Какво означават показаните цени?',toggleClass:'flat-toggle bg-white',answer:answer('Показана е обявената кешова цена в евро към датата на проверката и публикуваната данъчна квалификация. Месечна вноска, депозит или рекламна финансова сума не заместват кешовата цена.')},
  {id:'test-drive',question:'Как се уговаря оглед или тестово шофиране?',toggleClass:'flat-toggle bg-white',answer:answer(`${dealerProfile.inspectionSummary} Демо сайтът не гарантира тестово шофиране.`)}
 ]},
 {id:'exchanges',containerClass:'container mb-60',headingClass:'h3 mb-20 text-center capitalize',heading:'Продажба и евентуална замяна',items:[
  {id:'trade-in-accepted',question:'Приема ли се автомобил за замяна?',toggleClass:'flat-toggle bg-white',answer:answer('Попитайте дилъра за конкретната сделка. Наличието на демо страница за замяна не означава потвърдена обща услуга или гарантирано приемане.')},
  {id:'trade-in-valuation',question:'Прави ли сайтът оценка на автомобила ми?',toggleClass:'flat-toggle',answer:answer('Не. Въвеждането на данни в демо форма не е експертна оценка или оферта за изкупуване.')},
  {id:'trade-in-topup',question:'Може ли да се доплати разлика при замяна?',toggleClass:'flat-toggle bg-white',answer:answer('Само ако това бъде изрично договорено с дилъра. Демото не потвърждава бартер, сума за доплащане или кредитно одобрение.')},
  {id:'trade-in-documents',question:'Трябва ли да качвам лични документи тук?',toggleClass:'flat-toggle bg-white',answer:answer('Не изпращайте лични документи в този преглед. При реална сделка уточнете сигурния начин за предоставяне на необходимите документи директно с дилъра.')}
 ]},
 {id:'condition',containerClass:'container',headingClass:'h3 mb-18 text-center capitalize',heading:'Състояние, документи и предаване',items:[
  {id:'warranty',question:'Обещава ли този сайт гаранция?',toggleClass:'flat-toggle bg-white',answer:answer('Не. Ако конкретна обява съдържа гаранционно твърдение, поискайте писмените условия от продавача. Демото не добавя гаранция.')},
  {id:'history-check',question:'Независимо проверени ли са пробегът и историята?',toggleClass:'flat-toggle',answer:answer(`${dealerProfile.provenanceSummary} Пробегът, оборудването и описанието са данни на продавача до независима проверка.`)},
  {id:'delivery',question:'Има ли потвърдена доставка до друг град?',toggleClass:'flat-toggle bg-white',answer:answer('В този проект няма потвърдена услуга, тарифа или срок за доставка. Уточнете мястото и условията за предаване директно с дилъра.')}
 ]}
];
