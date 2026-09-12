import dealer from '../marketplace-domain/dealer-stock.json';

/** Authored preview guidance, not dealer-authored news or a service guarantee. */
export type DealerGuide = {
  id: number;
  category: 'Оглед' | 'Внос' | 'Лизинг' | 'Насоки' | 'Бартер';
  title: { bg: string; en: string };
  description: { bg: string; en: string };
  sections: { heading: { bg: string; en: string }; body: { bg: string; en: string } }[];
};
const section = (bgHeading: string, enHeading: string, bg: string, en: string) => ({
  heading: { bg: bgHeading, en: enHeading }, body: { bg, en }
});
const isChernomore = dealer.profile === 'https://chernomore.mobile.bg/';
export const dealerServiceSource = isChernomore
  ? 'https://chernomoreauto.com/bg/za-nas/' : dealer.profile;
export const dealerServiceCopy = {
  finance: isChernomore
    ? 'Сайтът на Черно море посочва собствен лизинг. Поискайте актуална индивидуална оферта; демото не определя условия и не одобрява кредит.'
    : 'Попитайте дали за избрания автомобил се предлага финансиране и кой го предоставя. Демо калкулаторът не е кредитна оферта.',
  tradeIn: isChernomore
    ? 'Черно море описва обратно изкупуване (BUY-BACK) на собствения си сайт. Уточнете дали Вашият автомобил е подходящ и как се определя оценката.'
    : 'Попитайте дали продавачът разглежда предложение за замяна. Въведените данни не са приета оферта или автоматична оценка.',
  registration: isChernomore
    ? 'Сайтът на Черно море посочва съдействие за регистрация в КАТ. Уточнете обхвата, документите и разходите за конкретната сделка.'
    : 'Уточнете кои документи придружават автомобила и дали продавачът съдейства за регистрацията. Демото не обещава такава услуга.',
  delivery: isChernomore
    ? 'Черно море публикува възможност за доставка в България за оглед или покупка. Срокът, цената и възможността за конкретния автомобил се уточняват директно.'
    : 'Попитайте дали е възможен транспорт за конкретния автомобил. Очаквана дата за внос не е обещание за доставка до Вас.'
};

export const dealerGuides: DealerGuide[] = [
  {
    id: 1, category: 'Оглед',
    title: { bg: 'Проверка преди покупка', en: 'Checks before buying' },
    description: { bg: `Какво да уточните за обява на ${dealer.shortName} преди решение.`, en: `Questions about a ${dealer.shortName} listing before deciding.` },
    sections: [
      section('Започнете от конкретната обява', 'Start with the actual listing',
        `Сравнете описанието, цената и данните в оригиналната обява на ${dealer.name}. Запазете нейния номер и попитайте за липсващи данни, известни забележки и сервизна история.`,
        `Compare the description, price and specifications with the original ${dealer.name} advertisement. Keep its reference and ask about missing details, known defects and service history.`),
      section('Уточнете независим оглед', 'Discuss an independent inspection',
        'Поискайте възможност за оглед от избран от Вас специалист. Наличието на обява, снимки или описано оборудване не е независима проверка на състоянието.',
        'Ask about an inspection by a specialist you choose. An advertisement, photographs or listed equipment do not constitute an independent condition check.')
    ]
  },
  {
    id: 2, category: 'Внос',
    title: { bg: 'Внос и статус на автомобила', en: 'Imports and vehicle status' },
    description: { bg: 'Различавайте обявен автомобил, очакван внос и клиентски автомобил.', en: 'Distinguish an advertisement, an incoming vehicle and a consignment car.' },
    sections: [
      section('Очакваната дата не е потвърдено пристигане', 'An expected date does not confirm arrival',
        'При очакван внос проверете актуалния срок с продавача, дори посочената дата вече да е минала. Не планирайте пътуване само по старото описание.',
        'For incoming stock, confirm the current schedule even when the advertised date has passed. Do not plan a journey based only on an older description.'),
      section('Проверете кой предлага автомобила и къде е той', 'Confirm the seller and the vehicle location',
        'При клиентски автомобил уточнете местоположението и кой организира огледа. Попитайте какви документи, цена и разходи са включени за конкретното предложение.',
        'For a consignment car, confirm its location and who arranges the viewing. Ask which documents, price and costs apply to that specific offer.')
    ]
  },
  {
    id: 3, category: 'Лизинг',
    title: { bg: 'Въпроси за финансиране', en: 'Questions about finance' },
    description: { bg: 'Подгответе въпросите за конкретна оферта, без да приемате демо сметката за обещание.', en: 'Prepare questions for a specific offer; a demo calculation is not a promise.' },
    sections: [
      section('Първо проверете възможностите', 'First establish the available options',
        dealerServiceCopy.finance,
        isChernomore ? 'Chernomore advertises in-house leasing on its website. Request a current individual offer; this demo does not set terms or approve credit.' : 'Ask whether finance is offered for the chosen vehicle and who provides it. The demo calculator is not a credit offer.'),
      section('Сравнете писмените условия', 'Compare the written terms',
        'Поискайте първоначалното плащане, срока, общата дължима сума, таксите и условията за собственост. Не изпращайте лични документи през демонстрационните форми.',
        'Ask for the upfront payment, duration, total amount payable, fees and ownership terms. Do not send identity documents through demonstration forms.')
    ]
  },
  {
    id: 4, category: 'Насоки',
    title: { bg: 'Избор според ежедневието', en: 'Choose for everyday use' },
    description: { bg: 'Сравнете купето, горивото, пробега и бюджета по реалните данни в обявите.', en: 'Compare body style, fuel, mileage and budget using the actual advertised data.' },
    sections: [
      section('Определете важните критерии', 'Set the important criteria',
        'Помислете за обичайните маршрути, пътниците, багажа и възможността за зареждане, когато разглеждате електрически или plug-in автомобил. Филтрирайте обявите по Вашите критерии.',
        'Consider regular journeys, passengers, luggage and charging access when considering an electric or plug-in vehicle. Filter the listings by your own criteria.'),
      section('Уточнете непубликуваното', 'Clarify what is not published',
        'Не извеждайте състояние на батерията, разход или остатъчна гаранция само от модела и годината. Поискайте конкретни данни и документи от продавача.',
        'Do not infer battery condition, consumption or remaining warranty from model and year alone. Ask the seller for vehicle-specific information and documents.')
    ]
  },
  {
    id: 5, category: 'Оглед',
    title: { bg: `Оглед във ${dealer.city}`, en: `Arrange a viewing: ${dealer.city}` },
    description: { bg: `Свържете се с ${dealer.shortName} на ${dealer.phone} преди посещение.`, en: `Contact ${dealer.shortName} on ${dealer.phone} before visiting.` },
    sections: [
      section('Потвърдете мястото и часа', 'Confirm the place and time',
        `Публикуваното местоположение е ${dealer.address}, ${dealer.city}. ${dealer.hours} Уточнете точно къде се намира избраният автомобил.`,
        `Published location: ${dealer.address}, ${dealer.city}. Confirm the opening hours, exact vehicle location and viewing time with the seller.`),
      section('Посочете автомобила', 'Identify the vehicle',
        'Дайте номера или линка на обявата. Клиентските автомобили и тези, които се използват ежедневно, може да изискват отделна уговорка; очакван внос не означава автомобил на място.',
        'Provide the listing reference or link. Consignment and daily-driven vehicles may require a separate appointment; incoming stock is not confirmation that a car is on site.')
    ]
  },
  {
    id: 6, category: 'Бартер',
    title: { bg: 'Разговор за замяна на автомобил', en: 'Discussing a vehicle exchange' },
    description: { bg: 'Подгответе данните, след което уточнете дали продавачът разглежда предложението.', en: 'Prepare the details, then establish whether the seller will consider the proposal.' },
    sections: [
      section('Проверете дали предложението е подходящо', 'Check whether the proposal is suitable',
        dealerServiceCopy.tradeIn,
        isChernomore ? 'Chernomore describes a BUY-BACK service on its website. Confirm eligibility and how an appraisal is determined for your vehicle.' : 'Ask whether the seller considers exchanges. Entered details are not an accepted offer or an automatic appraisal.'),
      section('Подгответе точна информация', 'Prepare accurate information',
        'Запишете модела, годината, пробега, историята и известните забележки. Демо формата подготвя разговор; тя не потвърждава изкупуване или цена.',
        'Note the model, year, mileage, history and known defects. The demo form prepares a conversation; it does not confirm a purchase or a price.')
    ]
  },
  {
    id: 7, category: 'Внос',
    title: { bg: 'Документи и регистрация', en: 'Documents and registration' },
    description: { bg: 'Уточнете какво се предава с конкретния автомобил и кой поема следващите стъпки.', en: 'Clarify the documents supplied with the vehicle and who handles the next steps.' },
    sections: [
      section('Изяснете обхвата', 'Clarify the scope',
        dealerServiceCopy.registration,
        isChernomore ? 'Chernomore lists registration assistance on its website. Confirm the scope, required documents and costs for your transaction.' : 'Ask which documents accompany the vehicle and whether registration assistance is offered. This demo does not promise that service.'),
      section('Потвърдете актуалните изисквания', 'Check the current requirements',
        'Сверете идентификационните данни и датите в документите. За необходимите оригинали и актуалната процедура използвайте официалните източници, а не стар списък в демонстрационен сайт.',
        'Compare identification details and dates in the documents. Check official sources for current requirements and original documents rather than relying on an old list in a demo website.')
    ]
  },
  {
    id: 8, category: 'Оглед',
    title: { bg: 'Как да четете тази селекция', en: 'How to read this selection' },
    description: { bg: 'Източник, дата, цена и статус са отделни от независима проверка.', en: 'Source, date, price and status are separate from independent verification.' },
    sections: [
      section('Проверете оригиналния източник', 'Check the original source',
        `Селекцията използва обяви на ${dealer.name}, записани към ${dealer.observedAt}. Това не е автоматично обновяван каталог. Проверете актуалната обява преди решение.`,
        `The selection uses ${dealer.name} advertisements recorded on ${dealer.observedAt}. It is not an automatically updated feed. Check the original listing before deciding.`),
      section('Цена и статус', 'Price and status',
        'Четете бележката за ДДС и уточненията за конкретния автомобил. Броят на показаните записи не е потвърден наличен автопарк. Противоречията в обявата се уточняват с продавача.',
        'Read the tax note and qualifications for each vehicle. The displayed record count is not confirmed available stock. Clarify conflicting advertised details with the seller.')
    ]
  },
  {
    id: 9, category: 'Насоки',
    title: { bg: 'След избора на автомобил', en: 'After choosing a vehicle' },
    description: { bg: 'Уточнете предаването, документите и договореното съдействие.', en: 'Confirm handover, documents and any agreed assistance.' },
    sections: [
      section('Потвърдете договореното', 'Confirm what has been agreed',
        'Запазете писмените условия, платежните документи и предадената сервизна информация. Попитайте какво е включено при предаване; демото не обещава обслужване или гаранция.',
        'Keep written terms, payment documents and supplied service information. Ask what is included at handover; the demo does not promise servicing or a warranty.'),
      section('Транспорт и следващи стъпки', 'Transport and next steps',
        dealerServiceCopy.delivery,
        isChernomore ? 'Chernomore advertises delivery within Bulgaria for viewing or purchase. Confirm the vehicle-specific availability, schedule and cost directly.' : 'Ask whether transport can be arranged for the specific car. An expected import date is not a delivery promise to you.')
    ]
  }
];


dealerGuides.push({
  id: 10, category: 'Насоки',
  title: { bg: 'Електрически и хибриден автомобил', en: 'Electric and hybrid vehicle questions' },
  description: { bg: 'Поискайте данни за конкретния автомобил, не предполагайте състоянието по модела.', en: 'Ask for vehicle-specific evidence rather than inferring condition from the model.' },
  sections: [
    section('Батерия и документи', 'Battery and documentation',
      'Попитайте за отчет за състоянието на батерията, зарядните кабели и документите за евентуална оставаща гаранция. Посочен капацитет не е измерване на текущото състояние.',
      'Ask about a battery-condition report, charging cables and documents for any remaining warranty. A stated capacity is not a measurement of current condition.'),
    section('Проверете какво е описано', 'Check what is actually described',
      'Различавайте mild hybrid, plug-in хибрид и електрически автомобил. При разминаване между заглавието и техническите полета поискайте уточнение от продавача.',
      'Distinguish mild hybrid, plug-in hybrid and electric vehicles. When the title and specifications disagree, ask the seller to clarify.')
  ]
});
