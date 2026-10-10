import { showroomService } from './showroom-services';

export type ServiceDetailPoint = { title: string; copy: string };
export type ServiceDetailFaq = { question: string; answer: string };
export type ServiceDetailContent = {
  summary: string;
  intro: string;
  expectations: readonly [ServiceDetailPoint, ServiceDetailPoint, ServiceDetailPoint];
  steps: readonly [ServiceDetailPoint, ServiceDetailPoint, ServiceDetailPoint];
  faqs: readonly [ServiceDetailFaq, ServiceDetailFaq];
  preparation: string;
};
export type ShowroomServiceDetail = {
  id: string;
  en: ServiceDetailContent;
  bg: ServiceDetailContent;
};

// These guides describe an enquiry, not a confirmed dealer service or quotation.
const details: readonly ShowroomServiceDetail[] = [
  {
    id: 'import',
    en: {
      summary:
        'Discuss finding a car abroad, vehicle checks and delivery for your chosen model and budget.',
      intro:
        'A car abroad can open up more choice. Start with the model, budget and country you have in mind, then discuss the checks and costs before making a decision.',
      expectations: [
        {
          title: 'Your search',
          copy: 'Set out your preferred make, model, specification and budget.',
        },
        {
          title: 'Vehicle checks',
          copy: 'Ask what history, ownership documents and condition checks can be arranged.',
        },
        {
          title: 'The full cost',
          copy: 'Discuss purchase, transport, taxes and registration costs for the chosen country.',
        },
      ],
      steps: [
        {
          title: 'Share your brief',
          copy: 'Choose a country and describe the car you are looking for.',
        },
        {
          title: 'Review an option',
          copy: 'Check the listing, available documents and any inspection information.',
        },
        {
          title: 'Confirm the next step',
          copy: 'Agree the scope, costs and responsibilities before any purchase or transport.',
        },
      ],
      faqs: [
        {
          question: 'Can I share a car I have already found?',
          answer:
            'Yes. Include its listing link or VIN in your enquiry so the discussion can focus on that vehicle.',
        },
        {
          question: 'Is delivery included?',
          answer:
            'Ask for the proposed transport scope and total costs. Delivery and registration arrangements need to be confirmed for each enquiry.',
        },
      ],
      preparation:
        'Have your preferred make and model, total budget and country ready. A listing link or VIN helps if you already have a car in mind.',
    },
    bg: {
      summary:
        'Изберете модел, бюджет и държава. Обсъдете проверката на автомобила, транспорта и регистрацията.',
      intro:
        'Търсенето на автомобил в чужбина може да разшири избора ви. Започнете с модел, бюджет и държава, след което обсъдете проверките и разходите, преди да решите.',
      expectations: [
        {
          title: 'Вашето търсене',
          copy: 'Посочете предпочитаните марка, модел, оборудване и бюджет.',
        },
        {
          title: 'Проверки на автомобила',
          copy: 'Попитайте какви проверки на историята, документите и състоянието могат да се организират.',
        },
        {
          title: 'Общият разход',
          copy: 'Обсъдете цената, транспорта, данъците и регистрацията за избраната държава.',
        },
      ],
      steps: [
        {
          title: 'Споделете желанията си',
          copy: 'Изберете държава и опишете автомобила, който търсите.',
        },
        {
          title: 'Разгледайте конкретен вариант',
          copy: 'Прегледайте обявата, наличните документи и информацията от евентуален оглед.',
        },
        {
          title: 'Уточнете следващата стъпка',
          copy: 'Уговорете обхвата, разходите и отговорностите преди покупка или транспорт.',
        },
      ],
      faqs: [
        {
          question: 'Мога ли да изпратя автомобил, който вече съм намерил?',
          answer:
            'Да. Добавете линк към обявата или VIN в запитването, за да обсъдите конкретния автомобил.',
        },
        {
          question: 'Включена ли е доставката?',
          answer:
            'Поискайте уточнение за транспорта и общите разходи. Доставката и регистрацията се уговарят за всяко конкретно запитване.',
        },
      ],
      preparation:
        'Подгответе предпочитани марка и модел, общ бюджет и държава. Линк към обява или VIN ще помогне, ако вече сте избрали автомобил.',
    },
  },
  {
    id: 'sell',
    en: {
      summary:
        'Share your car’s details and discuss its valuation, a direct sale or part exchange.',
      intro:
        'Thinking of selling your car? Share its details and condition to discuss a direct sale or part exchange, with the valuation and terms confirmed before you commit.',
      expectations: [
        {
          title: 'Vehicle details',
          copy: 'Make, model, year, mileage and specification give the enquiry a useful starting point.',
        },
        {
          title: 'Condition and history',
          copy: 'Mention maintenance records, known faults and any previous damage.',
        },
        {
          title: 'Sale options',
          copy: 'Discuss direct sale or part exchange and ask how a final valuation would be agreed.',
        },
      ],
      steps: [
        {
          title: 'Describe your car',
          copy: 'Add the main vehicle details and choose your sale preference.',
        },
        {
          title: 'Discuss an assessment',
          copy: 'Ask what photographs, documents or inspection would be needed.',
        },
        {
          title: 'Review the terms',
          copy: 'Confirm any offer, payment arrangements and handover requirements before deciding.',
        },
      ],
      faqs: [
        {
          question: 'Does an enquiry give me a valuation?',
          answer:
            'An enquiry starts the discussion. Any valuation needs a review of the vehicle and confirmation of the proposed terms.',
        },
        {
          question: 'Can I ask about part exchange?',
          answer:
            'Yes. Choose part exchange and include the car you would like to move into, if you have one in mind.',
        },
      ],
      preparation:
        'Have the make, model, year, mileage and condition ready. Keep ownership and service documents available for a later assessment.',
    },
    bg: {
      summary: 'Споделете данните на колата си и обсъдете оценка, директна продажба или замяна.',
      intro:
        'Обмисляте да продадете автомобила си? Споделете данните и състоянието му, за да обсъдите директна продажба или замяна, като оценката и условията се уточняват преди решение.',
      expectations: [
        {
          title: 'Данни за автомобила',
          copy: 'Марка, модел, година, пробег и оборудване дават добра основа за запитването.',
        },
        {
          title: 'Състояние и история',
          copy: 'Посочете сервизната история, известните проблеми и предишни повреди.',
        },
        {
          title: 'Варианти за продажба',
          copy: 'Обсъдете директна продажба или замяна и попитайте как се определя окончателната оценка.',
        },
      ],
      steps: [
        {
          title: 'Опишете автомобила си',
          copy: 'Добавете основните данни и предпочитания вариант за продажба.',
        },
        {
          title: 'Обсъдете оценяването',
          copy: 'Попитайте какви снимки, документи или оглед ще са необходими.',
        },
        {
          title: 'Прегледайте условията',
          copy: 'Уточнете предложението, начина на плащане и предаването, преди да решите.',
        },
      ],
      faqs: [
        {
          question: 'Запитването дава ли ми оценка?',
          answer:
            'Запитването започва разговора. Оценката изисква преглед на автомобила и потвърждение на предложените условия.',
        },
        {
          question: 'Мога ли да попитам за замяна?',
          answer:
            'Да. Изберете замяна и посочете следващия автомобил, ако вече имате конкретен вариант.',
        },
      ],
      preparation:
        'Подгответе марка, модел, година, пробег и описание на състоянието. Запазете документите за собственост и сервизната история за последваща оценка.',
    },
  },
  {
    id: 'viewing',
    en: {
      summary:
        'Choose a car and a convenient time. Confirm the viewing and ask about a test drive.',
      intro:
        'Get a closer look at a car before deciding. Ask about a viewing or test drive, share your preferred time and confirm the arrangements before travelling.',
      expectations: [
        {
          title: 'The right vehicle',
          copy: 'Identify the car you want to see and confirm it is available to view.',
        },
        {
          title: 'A closer look',
          copy: 'Bring questions about the specification, condition and available service records.',
        },
        {
          title: 'Test drive arrangements',
          copy: 'Ask about test drive availability, licence requirements and any applicable conditions.',
        },
      ],
      steps: [
        { title: 'Choose a car', copy: 'Include the listing or model in your enquiry.' },
        {
          title: 'Suggest a time',
          copy: 'Share a suitable day and ask which viewing times are available.',
        },
        {
          title: 'Confirm the visit',
          copy: 'Check the location, appointment and any documents needed before setting off.',
        },
      ],
      faqs: [
        {
          question: 'Does my enquiry book an appointment?',
          answer: 'No. A time and the car’s availability need to be confirmed before your visit.',
        },
        {
          question: 'What should I bring for a test drive?',
          answer:
            'Ask which identification and driving licence documents are required and what conditions apply.',
        },
      ],
      preparation:
        'Have the listing link, your preferred day and your questions ready. Ask about licence requirements if you would like a test drive.',
    },
    bg: {
      summary:
        'Изберете автомобил и удобен час. Уточнете огледа и възможността за пробно шофиране.',
      intro:
        'Разгледайте автомобила отблизо, преди да решите. Попитайте за оглед или пробно шофиране, посочете удобен час и потвърдете уговорката, преди да тръгнете.',
      expectations: [
        {
          title: 'Конкретният автомобил',
          copy: 'Посочете кой автомобил искате да видите и потвърдете, че е достъпен за оглед.',
        },
        {
          title: 'По-подробен оглед',
          copy: 'Подгответе въпроси за оборудването, състоянието и наличната сервизна история.',
        },
        {
          title: 'Условия за пробно шофиране',
          copy: 'Попитайте дали е възможно пробно шофиране, какви документи са нужни и какви условия важат.',
        },
      ],
      steps: [
        { title: 'Изберете автомобил', copy: 'Добавете обявата или модела в запитването.' },
        {
          title: 'Предложете час',
          copy: 'Посочете удобен ден и попитайте за свободните часове за оглед.',
        },
        {
          title: 'Потвърдете посещението',
          copy: 'Уточнете адреса, уговорката и необходимите документи, преди да тръгнете.',
        },
      ],
      faqs: [
        {
          question: 'Запитването запазва ли час?',
          answer:
            'Не. Часът и достъпността на автомобила трябва да бъдат потвърдени преди посещението.',
        },
        {
          question: 'Какво да нося за пробно шофиране?',
          answer:
            'Попитайте какви документи за самоличност и свидетелство за управление са необходими и какви условия важат.',
        },
      ],
      preparation:
        'Подгответе линк към обявата, предпочитан ден и въпросите си. Попитайте за изискванията към шофьорската книжка, ако желаете пробно шофиране.',
    },
  },
  {
    id: 'trade-in',
    en: {
      summary: 'Discuss the value of your current car and the difference towards your next one.',
      intro:
        'Explore using your current car towards your next one. Start with its details and the replacement you have in mind, then discuss the valuation and any balance to pay.',
      expectations: [
        {
          title: 'Your current car',
          copy: 'Share its make, model, year, mileage, condition and service history.',
        },
        {
          title: 'Your next car',
          copy: 'Include a listing or describe the model and budget you are considering.',
        },
        {
          title: 'The proposed balance',
          copy: 'Ask how an agreed valuation would affect the amount payable for the replacement.',
        },
      ],
      steps: [
        { title: 'Share both sides', copy: 'Describe your current car and the car you want next.' },
        {
          title: 'Discuss the valuation',
          copy: 'Confirm what assessment and documents are needed for your current vehicle.',
        },
        {
          title: 'Review the exchange',
          copy: 'Check the valuation, replacement price and handover terms together before deciding.',
        },
      ],
      faqs: [
        {
          question: 'Is a part exchange value guaranteed?',
          answer:
            'No. Any value needs to be confirmed after the vehicle is assessed and the terms are agreed.',
        },
        {
          question: 'What if I have not chosen my next car?',
          answer:
            'Describe your preferred model and budget so you can discuss the options alongside your current car.',
        },
      ],
      preparation:
        'Prepare your current car’s main details and any replacement listing. Mention outstanding finance if it needs to be considered in the discussion.',
    },
    bg: {
      summary: 'Обсъдете оценката на сегашния си автомобил и доплащането за следващия.',
      intro:
        'Обсъдете възможността да използвате сегашния си автомобил за покупката на следващия. Посочете данните му и желания нов автомобил, след което уточнете оценката и евентуалното доплащане.',
      expectations: [
        {
          title: 'Сегашният ви автомобил',
          copy: 'Споделете марка, модел, година, пробег, състояние и сервизна история.',
        },
        {
          title: 'Следващият ви автомобил',
          copy: 'Добавете обява или опишете модела и бюджета, които обмисляте.',
        },
        {
          title: 'Предложеното доплащане',
          copy: 'Попитайте как договорената оценка ще се отрази на сумата за следващия автомобил.',
        },
      ],
      steps: [
        {
          title: 'Споделете двата автомобила',
          copy: 'Опишете сегашния си автомобил и този, който искате след него.',
        },
        {
          title: 'Обсъдете оценката',
          copy: 'Уточнете каква оценка и документи са необходими за сегашния автомобил.',
        },
        {
          title: 'Прегледайте замяната',
          copy: 'Проверете заедно оценката, цената на следващия автомобил и условията за предаване, преди да решите.',
        },
      ],
      faqs: [
        {
          question: 'Гарантирана ли е оценката при замяна?',
          answer:
            'Не. Стойността се потвърждава след оценяване на автомобила и договаряне на условията.',
        },
        {
          question: 'Ако още не съм избрал следващ автомобил?',
          answer:
            'Опишете предпочитания модел и бюджет, за да обсъдите вариантите заедно със сегашния си автомобил.',
        },
      ],
      preparation:
        'Подгответе основните данни на сегашния автомобил и обява за следващия, ако имате такава. Посочете непогасено финансиране, ако трябва да се вземе предвид.',
    },
  },
  {
    id: 'sourcing',
    en: {
      summary:
        'Describe the model, equipment and budget you want, then discuss suitable cars and checks.',
      intro:
        'Looking for something specific? Describe your ideal car and budget so you can discuss a focused search, including which features matter most and where you can be flexible.',
      expectations: [
        {
          title: 'Your priorities',
          copy: 'Set out the make, model, age, mileage and features that matter to you.',
        },
        {
          title: 'Your budget',
          copy: 'Share your total budget and ask which additional costs should be considered.',
        },
        {
          title: 'An informed choice',
          copy: 'Review any suggested listing, its condition information and the checks still needed.',
        },
      ],
      steps: [
        {
          title: 'Create your brief',
          copy: 'Describe the car you want and the features you need.',
        },
        {
          title: 'Discuss the search',
          copy: 'Confirm the search scope, availability and whether your requirements need adjusting.',
        },
        {
          title: 'Review a match',
          copy: 'Compare the details and agree any checks before making a purchase decision.',
        },
      ],
      faqs: [
        {
          question: 'Can I ask for a particular specification?',
          answer:
            'Yes. Separate essential features from preferences so the enquiry describes what you really need.',
        },
        {
          question: 'Is finding a matching car guaranteed?',
          answer:
            'No. Suitable options depend on the market and your requirements. Confirm the search scope and any costs before proceeding.',
        },
      ],
      preparation:
        'Prepare your preferred make and model, budget and essential features. Example listings can help explain the specification you want.',
    },
    bg: {
      summary:
        'Опишете желания модел, оборудване и бюджет. Обсъдете подходящи предложения и проверки.',
      intro:
        'Търсите нещо конкретно? Опишете желания автомобил и бюджета си, за да обсъдите целенасочено търсене, включително кои характеристики са най-важни и къде сте гъвкави.',
      expectations: [
        {
          title: 'Вашите приоритети',
          copy: 'Посочете марка, модел, възраст, пробег и важните за вас характеристики.',
        },
        {
          title: 'Вашият бюджет',
          copy: 'Споделете общия си бюджет и попитайте какви допълнителни разходи трябва да се предвидят.',
        },
        {
          title: 'Информиран избор',
          copy: 'Прегледайте предложената обява, данните за състоянието и необходимите допълнителни проверки.',
        },
      ],
      steps: [
        {
          title: 'Опишете търсенето',
          copy: 'Посочете желания автомобил и необходимото оборудване.',
        },
        {
          title: 'Обсъдете обхвата',
          copy: 'Уточнете търсенето, наличността и дали изискванията ви имат нужда от промяна.',
        },
        {
          title: 'Разгледайте подходящ вариант',
          copy: 'Сравнете данните и уговорете проверките, преди да решите да купите.',
        },
      ],
      faqs: [
        {
          question: 'Мога ли да търся конкретно оборудване?',
          answer:
            'Да. Отделете задължителните характеристики от предпочитанията, за да опишете ясно нуждите си.',
        },
        {
          question: 'Гарантирано ли е намирането на автомобил?',
          answer:
            'Не. Подходящите варианти зависят от пазара и изискванията ви. Уточнете обхвата на търсенето и евентуалните разходи, преди да продължите.',
        },
      ],
      preparation:
        'Подгответе предпочитани марка и модел, бюджет и задължително оборудване. Примерни обяви могат да помогнат да обясните какво търсите.',
    },
  },
  {
    id: 'servicing',
    en: {
      summary: 'Describe the work your car needs and discuss diagnostics, maintenance or a repair.',
      intro:
        'Have a maintenance question or a repair to discuss? Describe your vehicle and the work or symptoms, then ask about the assessment, availability and proposed scope.',
      expectations: [
        {
          title: 'Your vehicle',
          copy: 'Include the make, model, year, mileage and relevant maintenance history.',
        },
        {
          title: 'The work needed',
          copy: 'Describe routine maintenance or the symptoms you have noticed, including warning lights.',
        },
        {
          title: 'A clear scope',
          copy: 'Ask which checks are needed and request the proposed work and costs before agreeing.',
        },
      ],
      steps: [
        {
          title: 'Describe the issue',
          copy: 'Share the vehicle details and what you would like checked.',
        },
        {
          title: 'Discuss an assessment',
          copy: 'Confirm whether an inspection is needed and ask about availability.',
        },
        {
          title: 'Agree the work',
          copy: 'Review the proposed scope, parts and cost before authorising a repair or service.',
        },
      ],
      faqs: [
        {
          question: 'Can a repair price be confirmed from my message?',
          answer:
            'Some issues need an inspection first. Ask what is required for an estimate and what it includes.',
        },
        {
          question: 'Does an enquiry reserve a workshop slot?',
          answer: 'No. The work, availability and appointment need to be confirmed separately.',
        },
      ],
      preparation:
        'Have the vehicle’s main details, mileage and a description of the work or symptoms ready. Note when the issue occurs and any relevant service history.',
    },
    bg: {
      summary:
        'Опишете от какво се нуждае автомобилът ви. Обсъдете диагностика, обслужване или ремонт.',
      intro:
        'Имате въпрос за обслужване или ремонт? Опишете автомобила и необходимата работа или симптомите, след което попитайте за оценяване, възможен час и предложен обхват.',
      expectations: [
        {
          title: 'Вашият автомобил',
          copy: 'Посочете марка, модел, година, пробег и съответната сервизна история.',
        },
        {
          title: 'Необходимата работа',
          copy: 'Опишете плановото обслужване или забелязаните симптоми, включително предупредителни лампи.',
        },
        {
          title: 'Ясен обхват',
          copy: 'Попитайте какви проверки са необходими и поискайте описание на работата и разходите, преди да се съгласите.',
        },
      ],
      steps: [
        {
          title: 'Опишете проблема',
          copy: 'Споделете данните на автомобила и какво искате да бъде проверено.',
        },
        {
          title: 'Обсъдете оценяването',
          copy: 'Уточнете дали е необходим оглед и попитайте за възможен час.',
        },
        {
          title: 'Уговорете работата',
          copy: 'Прегледайте обхвата, частите и разходите, преди да одобрите ремонт или обслужване.',
        },
      ],
      faqs: [
        {
          question: 'Може ли цената за ремонт да се потвърди по съобщение?',
          answer:
            'Някои проблеми изискват първо оглед. Попитайте какво е необходимо за приблизителна цена и какво включва тя.',
        },
        {
          question: 'Запитването запазва ли час в сервиз?',
          answer: 'Не. Работата, наличният час и уговорката трябва да бъдат потвърдени отделно.',
        },
      ],
      preparation:
        'Подгответе основните данни, пробега и описание на работата или симптомите. Отбележете кога се появява проблемът и съответната сервизна история.',
    },
  },
  {
    id: 'financing',
    en: {
      summary:
        'Ask about financing options, the monthly payment, term and documents you will need.',
      intro:
        'Explore how a car purchase could fit your budget. Share the car or price range, deposit and monthly budget to ask about available payment options and their full terms.',
      expectations: [
        {
          title: 'Your budget',
          copy: 'Discuss the purchase price, preferred deposit and monthly payment.',
        },
        {
          title: 'Available options',
          copy: 'Ask which payment arrangements, if any, are available for the chosen car.',
        },
        {
          title: 'The full terms',
          copy: 'Review the rate, fees, repayment period and total amount payable in any proposal.',
        },
      ],
      steps: [
        {
          title: 'Share your preferences',
          copy: 'Include the car, deposit and monthly budget you have in mind.',
        },
        {
          title: 'Ask about options',
          copy: 'Confirm availability, eligibility requirements and who would provide any financing.',
        },
        {
          title: 'Review a proposal',
          copy: 'Read the full terms and total costs before deciding whether to apply.',
        },
      ],
      faqs: [
        {
          question: 'Is this a finance application?',
          answer:
            'No. This is an enquiry about payment options. It does not submit an application or produce a credit decision.',
        },
        {
          question: 'Are approval or monthly payments guaranteed?',
          answer:
            'No. Availability, eligibility and terms must be confirmed by the relevant provider. Ask for a complete proposal before deciding.',
        },
      ],
      preparation:
        'Have the car or price range, preferred deposit and monthly budget ready. Financial documents are not needed to draft this initial enquiry.',
    },
    bg: {
      summary:
        'Попитайте за възможностите за финансиране, месечната вноска, срока и необходимите документи.',
      intro:
        'Разгледайте как покупката на автомобил може да се вмести в бюджета ви. Посочете автомобил или ценови диапазон, първоначална вноска и месечен бюджет, за да попитате за възможностите и пълните им условия.',
      expectations: [
        {
          title: 'Вашият бюджет',
          copy: 'Обсъдете цената, предпочитаната първоначална вноска и месечното плащане.',
        },
        {
          title: 'Възможни варианти',
          copy: 'Попитайте дали и какви варианти за плащане са налични за избрания автомобил.',
        },
        {
          title: 'Пълните условия',
          copy: 'Прегледайте лихвата, таксите, срока и общата дължима сума във всяко предложение.',
        },
      ],
      steps: [
        {
          title: 'Споделете предпочитанията си',
          copy: 'Посочете автомобил, първоначална вноска и месечен бюджет.',
        },
        {
          title: 'Попитайте за вариантите',
          copy: 'Уточнете наличността, изискванията и кой би предоставил финансирането.',
        },
        {
          title: 'Прегледайте предложение',
          copy: 'Прочетете пълните условия и общите разходи, преди да решите дали да кандидатствате.',
        },
      ],
      faqs: [
        {
          question: 'Това заявление за финансиране ли е?',
          answer:
            'Не. Това е запитване за варианти за плащане. То не подава заявление и не води до кредитно решение.',
        },
        {
          question: 'Гарантирани ли са одобрението или месечните вноски?',
          answer:
            'Не. Наличността, изискванията и условията се потвърждават от съответния доставчик. Поискайте пълно предложение, преди да решите.',
        },
      ],
      preparation:
        'Подгответе автомобил или ценови диапазон, предпочитана първоначална вноска и месечен бюджет. За чернова на това първоначално запитване не са необходими финансови документи.',
    },
  },
  {
    id: 'parts',
    en: {
      summary:
        'Share your car’s details and the part you need. Discuss compatibility, availability and fitting.',
      intro:
        'Looking for a replacement part or an accessory? Describe the vehicle and what you need, then confirm compatibility, availability and fitting options before placing an order.',
      expectations: [
        {
          title: 'Vehicle compatibility',
          copy: 'Share the make, model, year and any relevant engine or trim details.',
        },
        {
          title: 'The right item',
          copy: 'Include a part name, reference number or photograph if you have one.',
        },
        {
          title: 'Supply and fitting',
          copy: 'Ask about availability, price and whether fitting can be arranged.',
        },
      ],
      steps: [
        {
          title: 'Describe what you need',
          copy: 'Add the vehicle details and the part or accessory you are looking for.',
        },
        {
          title: 'Confirm the match',
          copy: 'Check the item reference and compatibility before agreeing to an order.',
        },
        {
          title: 'Agree the arrangements',
          copy: 'Confirm the price, supply terms and any collection, delivery or fitting options.',
        },
      ],
      faqs: [
        {
          question: 'Do I need a part number?',
          answer:
            'A reference number helps, but you can start with the vehicle details and a description or photograph of the item.',
        },
        {
          question: 'Does my enquiry reserve a part?',
          answer:
            'No. Compatibility, availability, price and order terms need to be confirmed separately.',
        },
      ],
      preparation:
        'Have the vehicle’s make, model and year ready, plus any part number or photograph. Mention whether you are asking about supply only or fitting too.',
    },
    bg: {
      summary:
        'Посочете автомобила и нужната част. Уточнете съвместимостта, наличността и възможността за монтаж.',
      intro:
        'Търсите резервна част или аксесоар? Опишете автомобила и необходимото, след което потвърдете съвместимостта, наличността и вариантите за монтаж, преди да поръчате.',
      expectations: [
        {
          title: 'Съвместимост с автомобила',
          copy: 'Посочете марка, модел, година и важни данни за двигателя или оборудването.',
        },
        {
          title: 'Точният артикул',
          copy: 'Добавете име на частта, каталожен номер или снимка, ако разполагате с тях.',
        },
        {
          title: 'Доставка и монтаж',
          copy: 'Попитайте за наличност, цена и възможност за организиране на монтаж.',
        },
      ],
      steps: [
        {
          title: 'Опишете необходимото',
          copy: 'Добавете данните на автомобила и частта или аксесоара, който търсите.',
        },
        {
          title: 'Потвърдете съвместимостта',
          copy: 'Проверете каталожния номер и съвместимостта, преди да се съгласите с поръчка.',
        },
        {
          title: 'Уточнете условията',
          copy: 'Потвърдете цената, условията и вариантите за получаване, доставка или монтаж.',
        },
      ],
      faqs: [
        {
          question: 'Необходим ли е каталожен номер?',
          answer:
            'Каталожният номер помага, но можете да започнете с данните на автомобила и описание или снимка на артикула.',
        },
        {
          question: 'Запитването запазва ли част?',
          answer:
            'Не. Съвместимостта, наличността, цената и условията за поръчка се потвърждават отделно.',
        },
      ],
      preparation:
        'Подгответе марка, модел и година, както и каталожен номер или снимка, ако имате. Посочете дали питате само за доставка или и за монтаж.',
    },
  },
];

export function getShowroomServiceDetail(id?: string): ShowroomServiceDetail | undefined {
  const service = showroomService(id);
  return service ? details.find((detail) => detail.id === service.id) : undefined;
}

export function serviceDetailHref(id?: string): string | undefined {
  const service = showroomService(id);
  return service ? '/services/' + encodeURIComponent(service.id) : undefined;
}

export function serviceEnquiryHref(id?: string): string | undefined {
  const service = showroomService(id);
  if (!service) return undefined;
  if (service.id === 'import' || service.id === 'sell') {
    return '/services?tab=' + service.id + '&request=1';
  }
  if (service.id === 'trade-in') {
    return '/services?tab=sell&saleType=part-exchange&request=1';
  }
  return '/contact?service=' + encodeURIComponent(service.id);
}
