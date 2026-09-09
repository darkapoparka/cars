import { dealer } from './dealer';

export type FaqAnswerParagraph={readonly class:string;readonly text:string};
export type FaqItem={readonly id:string;readonly question:string;readonly toggleClass:string;readonly answer:readonly FaqAnswerParagraph[]};
export type FaqGroup={readonly id:string;readonly containerClass:string;readonly headingClass:string;readonly heading:string;readonly items:readonly FaqItem[]};
const paragraph=(text:string):readonly FaqAnswerParagraph[]=>[{class:'h7 text-secondary line-height-28',text}];
const stepsAnswer:readonly FaqAnswerParagraph[]=[
  {class:'mb-8 h7 text-secondary line-height-28',text:`Изберете обява и се свържете с ${dealer.name} на ${dealer.phone}. Потвърдете наличността, цената и удобния час за оглед.`},
  {class:'h7 text-secondary line-height-28',text:'Прегледайте автомобила и документите и уточнете условията с продавача. Каталогът не е договор, резервация или доказателство за извършена проверка.'}
];
const termsAnswer=paragraph('Конкретната възможност и всички условия трябва да бъдат потвърдени от продавача. Демонстрацията не обещава финансиране, бартер, доставка, гаранция или запазване на автомобил.');
const item=(id:string,question:string,answer:readonly FaqAnswerParagraph[]=termsAnswer,toggleClass='flat-toggle bg-white'):FaqItem=>({id,question,toggleClass,answer});
export const daynightFaqGroups:readonly FaqGroup[]=[
  {id:'how-to-buy',containerClass:'container mb-60',headingClass:'h3 mb-20 text-center capitalize',heading:'Покупка и оглед',items:[
    item('steps','Какви са стъпките за покупка?',stepsAnswer),
    item('financing-documents','Къде да попитам за начините на плащане?',paragraph('Обсъдете плащането с продавача. Няма потвърдени лизингови условия, лихви или доставчик в тази демонстрация.'),'flat-toggle'),
    item('reserve','Може ли автомобил да бъде запазен?'),
    item('payment-methods','Какви варианти за плащане има?'),
    item('test-drive','Как се организира оглед или тест?',paragraph(`Обадете се на ${dealer.phone} за конкретния автомобил. Уточнете адреса, часа и условията за оглед или пробно шофиране.`))
  ]},
  {id:'exchanges',containerClass:'container mb-60',headingClass:'h3 mb-20 text-center capitalize',heading:'Вашият автомобил',items:[
    item('trade-in-accepted','Разглеждате ли предложения за бартер?'),
    item('trade-in-valuation','Какво да подготвя при въпрос за оценка?',paragraph('Подгответе марка, модел, година, обявен пробег, състояние и снимки. Попитайте дали автокъщата предлага оценка.'),'flat-toggle'),
    item('trade-in-topup','Мога ли да доплатя разликата при замяна?'),
    item('trade-in-documents','Къде да уточня документите за замяна?')
  ]},
  {id:'refund',containerClass:'container',headingClass:'h3 mb-18 text-center capitalize',heading:'Проверка и условия',items:[
    item('warranty','Има ли гаранция за конкретния автомобил?'),
    item('history-check','Потвърдена ли е историята на автомобила?',paragraph('Историята и състоянието не са независимо проверени от този демо каталог. Уточнете наличните документи и възможността за независим преглед.'),'flat-toggle'),
    item('delivery','Предлага ли се доставка до друг град?')
  ]}
];
