import { extraEnglish } from './extra-localized';
import { site } from '$lib/config/site';
import type { Locale } from '$lib/locale/core';
export const contentBg = {
	content0: 'Подбрани автомобили',
	content1:
		'Подбор на автомобили с проследима история, ясни снимки и реалистична крайна цена преди покупка.',
	content2: 'Проверка на обява',
	content3:
		'Преглед на VIN, пробег, история, оборудване, снимки и контекст на продавача преди решение.',
	content4: 'Продажба на автомобил',
	content5:
		'Изпрати данни, документи, снимки и очаквания, за да изберем правилния път за продажба.',
	content6: 'Документи и регистрация',
	content7: 'Съдействие за документи по внос, техническа подготовка, регистрация и предаване.',
	content8: 'Огледи с уговорка',
	content9:
		'Подготвени огледи, при които автомобилът, документите и консултантът са готови предварително.',
	content10: 'Сравнение на модели',
	content11:
		'Сравняваме цена, пробег, оборудване, история, разходи и срокове за няколко кандидата.',
	content12:
		'Практична подкрепа за покупка, внос, проверка, документи и продажба, без излишен шум.',
	content13: 'Услуги за покупка и внос',
	content14: 'Специалисти по внос и документи',
	content15: 'Огледи само с уговорен час',
	content16: 'Ясни ориентировъчни разходи преди ангажимент',
	content17: 'Съдействие от заявка до предаване',
	content18:
		'Изпрати линк, VIN, бюджет, срок или заявка за продажба и Promosale Varna ще подготви правилната следваща стъпка.',
	content19: 'Контакт за услуга',
	content20:
		'Подбор, проверка, документи и реалистична крайна цена за автомобили от Европа, преди да стигнем до оглед.',
	content21: 'Promosale Varna услуги',
	content22: 'Име',
	content23: 'Вашето име',
	content24: 'Имейл',
	content25: 'Телефон',
	content26: 'Предпочитана дата',
	content27: 'Услуга',
	content28: 'Изпрати заявка',
	content29: 'Заяви услуга',
	content30: 'Автомобил или VIN',
	content31: 'Линк към автомобил или VIN',
	content32: 'Линк/VIN',
	content33: 'Изпращаш линк към обявата от Европа или директно VIN номера.',
	content34: 'Проверка',
	content35: 'Преглеждаме историята, щетите и реалните разходи до България.',
	content36: 'Отговор',
	content37: 'Връщаме риск, крайна цена и ясен следващ ход. Без ангажимент.',
	content38: 'Изпрати линк или VIN. Проверяваме автомобила и реалните разходи до България.',
	content39: 'Процес',
	content40: 'Внос на автомобил',
	content41: 'Изпрати за проверка',
	content42: 'Провери автомобил за внос',
	content43: 'Линк към обява от Европа или VIN',
	content44:
		'Огледи, подбор на автомобили, документи и продажба на автомобил се уточняват с предварителна уговорка.',
	content45: 'Контакт',
	content46: 'Офис Promosale Varna',
	content47: 'Свържете се с Promosale Varna',
	content48: 'Фамилия',
	content49: 'Вашата фамилия',
	content50: 'Вашият имейл',
	content51: 'Вашият телефон',
	content52: 'Съобщение',
	content53: 'Автомобил, VIN, линк към обява, бюджет или въпрос',
	content54: 'Изпрати съобщение',
	content55: 'Огледи, подбор на автомобили, документи и продажба на автомобил - с уговорка.',
	content56: 'Пишете ни за автомобил',
	content57: 'Защо да внеса автомобил от Европа?',
	content58:
		'Европа често предлага добре оборудвани автомобили с проследима история и конкурентна цена. Promosale Varna проверява конкретния автомобил, документи, пробег, снимки и ориентировъчна крайна цена преди препоръка.',
	content59: 'Колко време обикновено отнема вносът?',
	content60:
		'Ориентировъчно процесът може да бъде около 6 до 10 седмици според избора на автомобил, транспорта, митническите стъпки, документите и подготовката за регистрация.',
	content61: 'Какво проверява Promosale Varna преди покупка?',
	content62:
		'Екипът преглежда история, пробег, произход, контекст на продавача, сервизна информация, налични доклади, снимки, документи и специфични изисквания за модела.',
	content63: 'Как се формира крайната цена?',
	content64:
		'Оценката обикновено включва цена на автомобила, транспорт, мито, ДДС, документи, техническа подготовка, регистрационни стъпки и нужни сервизни дейности преди предаване.',
	content65: 'Какви документи ще получа?',
	content66:
		'Документите зависят от конкретния автомобил и сделка. Promosale Varna потвърждава наличните документи за покупка, транспорт, митница и регистрация преди предаване.',
	content67: 'Имат ли внесените автомобили гаранция?',
	content68:
		'Гаранция не се приема автоматично. Ако автомобилът има остатъчно фабрично покритие или дилърска поддръжка, това се потвърждава за конкретния автомобил преди покупка.',
	content69: 'Може ли Promosale Varna да помогне при продажба на моя автомобил?',
	content70:
		'Да. Изпратете VIN, пробег, снимки, сервизна история, състояние, документи и очаквана цена. Promosale Varna може да предложи директна оферта, клиентска обява или съдействие при продажба.',
	content71: 'Нужна ли е предварителна уговорка за оглед?',
	content72:
		'Да. Огледите са с уговорка, за да бъдат автомобилът, документите и консултантът подготвени преди пристигане.',
	content73: 'Може ли Promosale Varna да сравни няколко модела?',
	content74:
		'Да. Изпратете автомобилите, бюджета, срока и приоритетите. Екипът може да сравни оборудване, история, разходи, наличност и сложност на вноса.',
	content75: 'Внос и покупка',
	content76: 'Разходи и документи',
	content77: 'Продажба и огледи',
	content78: 'Условия за използване на Promosale Varna',
	content79: '1. Информация за автомобилите',
	content80:
		'Promosale Varna представя информация за автомобилите на база налични обяви, клиентски заявки, данни от доставчици, снимки, доклади и вътрешни бележки от проверка.',
	content81:
		'Наличност, пробег, оборудване, състояние, цена и документи се потвърждават за конкретния автомобил преди покупка или резервация.',
	content82: '2. Процес на внос',
	content83:
		'Сроковете за внос зависят от избора на автомобил, транспорта, митническите стъпки, готовността на документите, техническата подготовка и външни партньори.',
	content84:
		'Ориентировъчните срокове са насока, докато не бъдат потвърдени конкретен автомобил и конкретен маршрут за транспорт.',
	content85: '3. Разходи и калкулатор',
	content86:
		'Резултатите от калкулатора са ориентировъчни. Крайната цена може да се промени според валутен курс, мито, ДДС, транспорт, пристанищни такси, регистрационни стъпки и подготовка за конкретния автомобил.',
	content87:
		'Преди решение за плащане трябва да бъде прегледана писмена разбивка за конкретния автомобил.',
	content88: '4. Огледи и тестови шофирания',
	content89:
		'Огледите се уговарят предварително, за да може Promosale Varna да подготви автомобила, документите и важния контекст за клиента.',
	content90:
		'Всяко тестово шофиране или проверка се съобразява с местните правила, статуса на автомобила, застрахователните условия и наличността на екипа.',
	content91: '5. Клиентски автомобили',
	content92:
		'Клиентските автомобили се преглеждат по информация, предоставена от собственика, включително VIN, снимки, пробег, сервизна история, състояние и документи.',
	content93:
		'Promosale Varna може да поиска допълнителна информация преди препоръка за цена, публикуване, директна оферта или съдействие при продажба.',
	content94: '6. Контакт и данни',
	content95:
		'Съобщенията, изпратени през сайта, се използват за отговор на запитвания за автомобили, внос, огледи и продажба.',
	content96:
		'Не изпращайте чувствителни платежни данни през публичните форми на сайта. Потвърждавайте официалните инструкции за плащане директно с Promosale Varna преди превод.',
	content97: 'Препоръка във Facebook',
	content98: 'Процесът по покупка и доставка следваше плана, който беше обяснен преди да започнем.',
	content99: 'Предаване на клиентски автомобил',
	content100:
		'Колата, която купих чрез Promosale Varna, дойде точно както беше уговорено. Бих ги избрал отново.',
	content101: 'Клиент с подбор на автомобили',
	content102:
		'Всяка стъпка беше обяснена ясно: снимки преди покупка, Carfax контекст и без скрити такси.',
	content103: 'Потвърден купувач',
	content104:
		'Това, което поръчах, е това, което пристигна. Важното беше автомобил без скрити проблеми.',
	content105: 'Отзив за доставка',
	content106: 'Получих автомобила в уговорения срок и без изненадващи такси.',
	content107: 'Оглед по уговорка',
	content108:
		'Документите, сервизният контекст и състоянието на автомобила бяха готови, когато дойдох да видя колата.',
	content109: 'Отзиви от клиенти',
	content110: 'Какво проверява Promosale Varna преди внос на автомобил от Европа',
	content111: 'Май 2026',
	content112:
		'История, пробег, сервизни записи, снимки от покупката и документи правят решението за внос по-спокойно.',
	content113:
		'Преди да препоръча автомобил, Promosale Varna проверява произход, пробег, сервизна история, състояние и документи, за да знае купувачът какво одобрява още преди колата да напусне Европа.',
	content114:
		'Най-силните предложения идват от проследими източници с ясни снимки, история и сервизен контекст.',
	content115:
		'След одобрение Promosale Varna организира транспорта, митническите стъпки и подготовката за регистрация.',
	content116: 'Какво означава „готов за регистрация“',
	content117: 'Документи',
	content118:
		'Технически проверки, кодиране, документи и подготовка според модела са част от истинското предаване.',
	content119:
		'При внесен автомобил подготовката не свършва с транспорта. Документите, техническите изисквания и спецификите по модела трябва да се прегледат преди регистрация.',
	content120:
		'Някои коли се нуждаят от осветление, навигация, кодиране или други настройки преди употреба в Европа.',
	content121:
		'Ясната оферта трябва да разделя следващите стъпки и очакваните разходи, преди купувачът да поеме ангажимент.',
	content122: 'Как Promosale Varna преглежда клиентски автомобил',
	content123: 'Продай автомобила си',
	content124:
		'Снимки, VIN, сервизна история, пробег и очаквана цена помагат на екипа да даде реалистична обратна връзка.',
	content125:
		'Когато клиент иска да продаде автомобил, първата стъпка е ясна информация: VIN, пробег, история, снимки и документи.',
	content126:
		'След преглед Promosale Varna може да обсъди директна оферта, съдействие при продажба или публикуване на колата като клиентски автомобил.',
	content127: 'Добрата информация в началото спестява време и помага цената да остане реалистична.',
	content128: 'Общи условия',
	content129:
		'Това е демонстрационен автомобилен сайт. Обявите и съдържанието показват как работи шаблонът; не представляват оферта за продажба.',
	content130: 'Поверителност',
	content131: 'Как се използват данните в този демонстрационен сайт.',
	content132: 'Демонстрационни заявки',
	content133:
		'Използвай примерни данни при тестване. Не изпращай лични документи, платежни данни или друга чувствителна информация.',
	content134: 'Какво се записва',
	content135:
		'Формата записва въведените име, телефон, имейл и съобщение, както и данни за избрания автомобил, изискванията за внос и страницата на заявката. Те служат за демонстрация на обработката на запитвания.',
	content136: 'Съхранение и достъп',
	content137:
		'В режим за демонстрация примерните заявки остават временно в паметта на приложението. Наличието на ключ за база данни не включва автоматично реално съхранение. Записването в отделна база се включва изрично само за конфигуриран клиентски сайт. Не се изпращат автоматични имейли до търговец.',
	content138:
		'Тестовите записи остават до изтриването им или нулирането на демо базата. За премахване на случайно въведени лични данни се свържи с човека, който ти е предоставил демонстрацията.',
	content139: 'Външни услуги',
	content140:
		'При отваряне на YouTube, Google Maps, Facebook или Viber важат правилата на съответната услуга. Изображения и шрифтове могат да се зареждат от външни доставчици.',
	content141: 'Сайт за конкретен търговец',
	content142:
		'При изграждане на клиентски сайт тестовата база се заменя с отделна база за търговеца. Преди публикуване се посочват реалният администратор на данните, контактът за въпроси, сроковете за съхранение и приложимите правила за обработка. Демо заявките не се прехвърлят.',
	content143: 'Бисквитки и локално съхранение',
	content144: 'Настройки, които помагат на демонстрационния сайт да работи.',
	content145: 'Вход и сесия',
	content146:
		'При вход сайтът използва сесийна бисквитка, за да разпознава удостоверения потребител. Администраторската сесия е ограничена във времето; изходът я прекратява.',
	content147: 'Запазени предпочитания',
	content148:
		'Браузърът може да пази избрани автомобили за сравнение, любими, състояние на менюта и други настройки в локално хранилище или бисквитки. Те не са изпратени заявки за автомобил.',
	content149: 'Външно съдържание',
	content150:
		'Видео и външни връзки могат да отварят услуги със собствени бисквитки и правила. Прегледай информацията на съответния доставчик, преди да използваш услугата.',
	content151: 'Управление в браузъра',
	content152:
		'Можеш да изтриеш бисквитките и данните за този сайт от настройките на браузъра. Това може да прекрати входа и да премахне запазени предпочитания. Изтриването им не изтрива вече записана заявка от тестовата база.',
	content153: 'Преди клиентско публикуване',
	content154:
		'Тази информация описва шаблона. Ако в клиентския сайт се добавят аналитични, рекламни или други външни услуги, страницата и механизмите за избор трябва да отразяват действителната конфигурация.',
	content155: 'Без ангажимент',
	content156: 'Демонстрационна заявка — използвай примерни данни.',
	content157:
		'Заявката е запазена. Това е демонстрация; не е изпратено съобщение до автомобилен търговец.'
} as const;
export type ContentKey = keyof typeof contentBg;
export const contentEn: Record<ContentKey, string> = {
	content0: 'Selected cars',
	content1:
		'Vehicle sourcing with traceable history, clear photos and a realistic total price before purchase.',
	content2: 'Listing review',
	content3:
		'Review the VIN, mileage, history, equipment, photos and seller context before deciding.',
	content4: 'Selling a car',
	content5:
		'Send details, documents, photos and expectations so we can choose the right approach to selling.',
	content6: 'Documents and registration',
	content7: 'Support with import documents, technical preparation, registration and handover.',
	content8: 'Viewings by appointment',
	content9: 'Prepared viewings with the vehicle, documents and consultant ready in advance.',
	content10: 'Model comparison',
	content11:
		'We compare price, mileage, equipment, history, costs and timing for several candidates.',
	content12: 'Practical support for buying, importing, checks, documents and selling.',
	content13: 'Buying and import services',
	content14: 'Import and documentation specialists',
	content15: 'Viewings by appointment only',
	content16: 'Clear estimated costs before a commitment',
	content17: 'Support from request to handover',
	content18:
		'Send a link, VIN, budget, timeframe or sale request and Promosale Varna will prepare the next step.',
	content19: 'Contact us about a service',
	content20:
		'Selection, checks, documents and a realistic total price for cars from Europe before arranging a viewing.',
	content21: 'Promosale Varna services',
	content22: 'Name',
	content23: 'Your name',
	content24: 'Email',
	content25: 'Phone',
	content26: 'Preferred date',
	content27: 'Service',
	content28: 'Submit request',
	content29: 'Request a service',
	content30: 'Vehicle or VIN',
	content31: 'Vehicle link or VIN',
	content32: 'Link/VIN',
	content33: 'Send the European listing link or the VIN directly.',
	content34: 'Review',
	content35: 'We review the history, damage and actual costs to Bulgaria.',
	content36: 'Response',
	content37: 'We explain the risks, total price and next step. No obligation.',
	content38: 'Send a link or VIN. We check the car and actual costs to Bulgaria.',
	content39: 'Process',
	content40: 'Import a car',
	content41: 'Submit for review',
	content42: 'Check a car for import',
	content43: 'European listing link or VIN',
	content44: 'Viewings, sourcing, documents and vehicle sales are arranged by appointment.',
	content45: 'Contact',
	content46: 'Promosale Varna office',
	content47: 'Contact Promosale Varna',
	content48: 'Last name',
	content49: 'Your last name',
	content50: 'Your email',
	content51: 'Your phone',
	content52: 'Message',
	content53: 'Vehicle, VIN, listing link, budget or question',
	content54: 'Send message',
	content55: 'Viewings, vehicle sourcing, documents and sales — by appointment.',
	content56: 'Ask us about a car',
	content57: 'Why import a car from Europe?',
	content58:
		'Europe often offers well-equipped cars with traceable history and competitive prices. Promosale Varna reviews the specific car, documents, mileage, photos and estimated total price before making a recommendation.',
	content59: 'How long does an import usually take?',
	content60:
		'The process may take around 6 to 10 weeks, depending on the choice of car, transport, customs steps, documentation and preparation for registration.',
	content61: 'What does Promosale Varna check before purchase?',
	content62:
		'The team reviews history, mileage, origin, seller context, service information, available reports, photos, documents and model-specific requirements.',
	content63: 'How is the total price calculated?',
	content64:
		'The estimate usually includes the vehicle price, transport, customs duty, VAT, documents, technical preparation, registration steps and any servicing needed before handover.',
	content65: 'Which documents will I receive?',
	content66:
		'Documents depend on the specific car and transaction. Promosale Varna confirms the available purchase, transport, customs and registration documents before handover.',
	content67: 'Do imported cars have a warranty?',
	content68:
		'A warranty is not assumed. Any remaining factory coverage or dealer support is confirmed for the specific car before purchase.',
	content69: 'Can Promosale Varna help sell my car?',
	content70:
		'Yes. Send the VIN, mileage, photos, service history, condition, documents and expected price. Promosale Varna may offer a direct purchase, customer listing or help with the sale.',
	content71: 'Do I need an appointment for a viewing?',
	content72:
		'Yes. Viewings are by appointment so the car, documents and consultant are ready before you arrive.',
	content73: 'Can Promosale Varna compare several models?',
	content74:
		'Yes. Send the cars, budget, timeframe and priorities. The team can compare equipment, history, costs, availability and import complexity.',
	content75: 'Import and purchase',
	content76: 'Costs and documents',
	content77: 'Sales and viewings',
	content78: 'Terms of use for Promosale Varna',
	content79: '1. Vehicle information',
	content80:
		'Promosale Varna presents vehicle information based on available listings, customer requests, supplier data, photos, reports and internal inspection notes.',
	content81:
		'Availability, mileage, equipment, condition, price and documents are confirmed for the specific car before purchase or reservation.',
	content82: '2. Import process',
	content83:
		'Import timing depends on the car selected, transport, customs steps, document readiness, technical preparation and external partners.',
	content84:
		'Estimated timeframes are guidance until the specific car and transport route have been confirmed.',
	content85: '3. Costs and calculator',
	content86:
		'Calculator results are estimates. The final price may change with exchange rates, customs duty, VAT, transport, port fees, registration steps and preparation for the specific car.',
	content87: 'Review a written breakdown for the specific car before deciding to pay.',
	content88: '4. Viewings and test drives',
	content89:
		'Viewings are arranged in advance so Promosale Varna can prepare the car, documents and relevant information for the customer.',
	content90:
		'Each test drive or inspection is subject to local rules, vehicle status, insurance terms and team availability.',
	content91: '5. Customer cars',
	content92:
		'Customer cars are reviewed using information supplied by the owner, including VIN, photos, mileage, service history, condition and documents.',
	content93:
		'Promosale Varna may request additional information before recommending a price, publishing a listing, making a direct offer or assisting with a sale.',
	content94: '6. Contact and data',
	content95:
		'Messages submitted through the site are used to respond to inquiries about vehicles, imports, viewings and sales.',
	content96:
		'Do not submit sensitive payment details through public forms. Confirm official payment instructions directly with Promosale Varna before transferring money.',
	content97: 'Facebook recommendation',
	content98: 'The purchase and delivery followed the plan explained before we started.',
	content99: 'Customer vehicle handover',
	content100:
		'The car I bought through Promosale Varna arrived exactly as agreed. I would choose them again.',
	content101: 'Vehicle sourcing customer',
	content102:
		'Every step was explained clearly: photos before purchase, Carfax context and no hidden fees.',
	content103: 'Confirmed buyer',
	content104: 'What I ordered is what arrived. What mattered was a car without hidden problems.',
	content105: 'Delivery review',
	content106: 'I received the car within the agreed timeframe and without unexpected fees.',
	content107: 'Viewing by appointment',
	content108:
		'The documents, service information and vehicle details were ready when I came to see the car.',
	content109: 'Customer reviews',
	content110: 'What Promosale Varna checks before importing a car from Europe',
	content111: 'May 2026',
	content112:
		'History, mileage, service records, purchase photos and documents make the import decision easier.',
	content113:
		'Before recommending a car, Promosale Varna checks its origin, mileage, service history, condition and documents so the buyer knows what they are approving before the car leaves Europe.',
	content114:
		'The strongest offers come from traceable sources with clear photos, history and service information.',
	content115:
		'After approval, Promosale Varna arranges transport, customs steps and preparation for registration.',
	content116: 'What does “ready for registration” mean?',
	content117: 'Documents',
	content118:
		'Technical checks, coding, documents and model-specific preparation are part of a proper handover.',
	content119:
		'For an imported car, preparation does not end with transport. Documents, technical requirements and model-specific details need review before registration.',
	content120:
		'Some cars need lighting, navigation, coding or other adjustments before use in Europe.',
	content121:
		'A clear offer should separate the next steps and expected costs before the buyer makes a commitment.',
	content122: 'How Promosale Varna reviews a customer car',
	content123: 'Sell your car',
	content124:
		'Photos, VIN, service history, mileage and the expected price help the team give realistic feedback.',
	content125:
		'When a customer wants to sell a car, the first step is clear information: VIN, mileage, history, photos and documents.',
	content126:
		'After review, Promosale Varna can discuss a direct offer, sales support or publishing the car as a customer vehicle.',
	content127: 'Good information at the start saves time and helps keep the price realistic.',
	content128: 'Terms',
	content129:
		'This is a demonstration automotive website. Listings and content show how the template works; they are not an offer to sell.',
	content130: 'Privacy',
	content131: 'How data is used on this demonstration website.',
	content132: 'Demo requests',
	content133:
		'Use sample data when testing. Do not send personal documents, payment details or other sensitive information.',
	content134: 'What is recorded',
	content135:
		'The form records the name, phone, email and message entered, along with the selected vehicle, import requirements and request page. This demonstrates inquiry processing.',
	content136: 'Storage and access',
	content137:
		'In demonstration mode, sample requests remain temporarily in application memory. A database key does not automatically enable real storage. A separate database is enabled explicitly only for a configured client site. No automatic emails are sent to a dealer.',
	content138:
		'Test records remain until deleted or the demo database is reset. To remove personal data entered accidentally, contact the person who provided the demonstration.',
	content139: 'External services',
	content140:
		'YouTube, Google Maps, Facebook and Viber are governed by their own policies. Images and fonts may load from external providers.',
	content141: 'A site for a specific dealer',
	content142:
		'When building a client site, the test database is replaced with a separate dealer database. Before publication, the actual data controller, contact, retention periods and applicable processing rules must be stated. Demo requests are not transferred.',
	content143: 'Cookies and local storage',
	content144: 'Settings that help this demonstration website work.',
	content145: 'Login and session',
	content146:
		'On login, the site uses a session cookie to recognize the authenticated user. The admin session expires after a limited time; signing out ends it.',
	content147: 'Saved preferences',
	content148:
		'The browser may store compared cars, favorites, menu state and other settings in local storage or cookies. These are not submitted vehicle requests.',
	content149: 'External content',
	content150:
		'Videos and external links may open services with their own cookies and policies. Read the provider’s information before using the service.',
	content151: 'Browser controls',
	content152:
		"You can delete this site's cookies and data in your browser settings. This may sign you out and remove saved preferences. It does not delete a request already stored in the test database.",
	content153: 'Before client publication',
	content154:
		'This information describes the template. If analytics, advertising or other external services are added to a client site, the page and preference controls must reflect the actual configuration.',
	content155: 'No obligation',
	content156: 'Demo request — please use sample data.',
	content157:
		'The request has been saved. This is a demonstration; no message has been sent to a car dealer.'
};
export const contentSourceKeys: Readonly<Record<string, ContentKey>> = {
	'Подбрани автомобили': 'content0',
	'Подбор на автомобили с проследима история, ясни снимки и реалистична крайна цена преди покупка.':
		'content1',
	'Проверка на обява': 'content2',
	'Преглед на VIN, пробег, история, оборудване, снимки и контекст на продавача преди решение.':
		'content3',
	'Продажба на автомобил': 'content4',
	'Изпрати данни, документи, снимки и очаквания, за да изберем правилния път за продажба.':
		'content5',
	'Документи и регистрация': 'content6',
	'Съдействие за документи по внос, техническа подготовка, регистрация и предаване.': 'content7',
	'Огледи с уговорка': 'content8',
	'Подготвени огледи, при които автомобилът, документите и консултантът са готови предварително.':
		'content9',
	'Сравнение на модели': 'content10',
	'Сравняваме цена, пробег, оборудване, история, разходи и срокове за няколко кандидата.':
		'content11',
	'Практична подкрепа за покупка, внос, проверка, документи и продажба, без излишен шум.':
		'content12',
	'Услуги за покупка и внос': 'content13',
	'Специалисти по внос и документи': 'content14',
	'Огледи само с уговорен час': 'content15',
	'Ясни ориентировъчни разходи преди ангажимент': 'content16',
	'Съдействие от заявка до предаване': 'content17',
	'Изпрати линк, VIN, бюджет, срок или заявка за продажба и Promosale Varna ще подготви правилната следваща стъпка.':
		'content18',
	'Контакт за услуга': 'content19',
	'Подбор, проверка, документи и реалистична крайна цена за автомобили от Европа, преди да стигнем до оглед.':
		'content20',
	'Promosale Varna услуги': 'content21',
	Име: 'content22',
	'Вашето име': 'content23',
	Имейл: 'content24',
	Телефон: 'content25',
	'Предпочитана дата': 'content26',
	Услуга: 'content27',
	'Изпрати заявка': 'content28',
	'Заяви услуга': 'content29',
	'Автомобил или VIN': 'content30',
	'Линк към автомобил или VIN': 'content31',
	'Линк/VIN': 'content32',
	'Изпращаш линк към обявата от Европа или директно VIN номера.': 'content33',
	Проверка: 'content34',
	'Преглеждаме историята, щетите и реалните разходи до България.': 'content35',
	Отговор: 'content36',
	'Връщаме риск, крайна цена и ясен следващ ход. Без ангажимент.': 'content37',
	'Изпрати линк или VIN. Проверяваме автомобила и реалните разходи до България.': 'content38',
	Процес: 'content39',
	'Внос на автомобил': 'content40',
	'Изпрати за проверка': 'content41',
	'Провери автомобил за внос': 'content42',
	'Линк към обява от Европа или VIN': 'content43',
	'Огледи, подбор на автомобили, документи и продажба на автомобил се уточняват с предварителна уговорка.':
		'content44',
	Контакт: 'content45',
	'Офис Promosale Varna': 'content46',
	'Свържете се с Promosale Varna': 'content47',
	Фамилия: 'content48',
	'Вашата фамилия': 'content49',
	'Вашият имейл': 'content50',
	'Вашият телефон': 'content51',
	Съобщение: 'content52',
	'Автомобил, VIN, линк към обява, бюджет или въпрос': 'content53',
	'Изпрати съобщение': 'content54',
	'Огледи, подбор на автомобили, документи и продажба на автомобил - с уговорка.': 'content55',
	'Пишете ни за автомобил': 'content56',
	'Защо да внеса автомобил от Европа?': 'content57',
	'Европа често предлага добре оборудвани автомобили с проследима история и конкурентна цена. Promosale Varna проверява конкретния автомобил, документи, пробег, снимки и ориентировъчна крайна цена преди препоръка.':
		'content58',
	'Колко време обикновено отнема вносът?': 'content59',
	'Ориентировъчно процесът може да бъде около 6 до 10 седмици според избора на автомобил, транспорта, митническите стъпки, документите и подготовката за регистрация.':
		'content60',
	'Какво проверява Promosale Varna преди покупка?': 'content61',
	'Екипът преглежда история, пробег, произход, контекст на продавача, сервизна информация, налични доклади, снимки, документи и специфични изисквания за модела.':
		'content62',
	'Как се формира крайната цена?': 'content63',
	'Оценката обикновено включва цена на автомобила, транспорт, мито, ДДС, документи, техническа подготовка, регистрационни стъпки и нужни сервизни дейности преди предаване.':
		'content64',
	'Какви документи ще получа?': 'content65',
	'Документите зависят от конкретния автомобил и сделка. Promosale Varna потвърждава наличните документи за покупка, транспорт, митница и регистрация преди предаване.':
		'content66',
	'Имат ли внесените автомобили гаранция?': 'content67',
	'Гаранция не се приема автоматично. Ако автомобилът има остатъчно фабрично покритие или дилърска поддръжка, това се потвърждава за конкретния автомобил преди покупка.':
		'content68',
	'Може ли Promosale Varna да помогне при продажба на моя автомобил?': 'content69',
	'Да. Изпратете VIN, пробег, снимки, сервизна история, състояние, документи и очаквана цена. Promosale Varna може да предложи директна оферта, клиентска обява или съдействие при продажба.':
		'content70',
	'Нужна ли е предварителна уговорка за оглед?': 'content71',
	'Да. Огледите са с уговорка, за да бъдат автомобилът, документите и консултантът подготвени преди пристигане.':
		'content72',
	'Може ли Promosale Varna да сравни няколко модела?': 'content73',
	'Да. Изпратете автомобилите, бюджета, срока и приоритетите. Екипът може да сравни оборудване, история, разходи, наличност и сложност на вноса.':
		'content74',
	'Внос и покупка': 'content75',
	'Разходи и документи': 'content76',
	'Продажба и огледи': 'content77',
	'Условия за използване на Promosale Varna': 'content78',
	'1. Информация за автомобилите': 'content79',
	'Promosale Varna представя информация за автомобилите на база налични обяви, клиентски заявки, данни от доставчици, снимки, доклади и вътрешни бележки от проверка.':
		'content80',
	'Наличност, пробег, оборудване, състояние, цена и документи се потвърждават за конкретния автомобил преди покупка или резервация.':
		'content81',
	'2. Процес на внос': 'content82',
	'Сроковете за внос зависят от избора на автомобил, транспорта, митническите стъпки, готовността на документите, техническата подготовка и външни партньори.':
		'content83',
	'Ориентировъчните срокове са насока, докато не бъдат потвърдени конкретен автомобил и конкретен маршрут за транспорт.':
		'content84',
	'3. Разходи и калкулатор': 'content85',
	'Резултатите от калкулатора са ориентировъчни. Крайната цена може да се промени според валутен курс, мито, ДДС, транспорт, пристанищни такси, регистрационни стъпки и подготовка за конкретния автомобил.':
		'content86',
	'Преди решение за плащане трябва да бъде прегледана писмена разбивка за конкретния автомобил.':
		'content87',
	'4. Огледи и тестови шофирания': 'content88',
	'Огледите се уговарят предварително, за да може Promosale Varna да подготви автомобила, документите и важния контекст за клиента.':
		'content89',
	'Всяко тестово шофиране или проверка се съобразява с местните правила, статуса на автомобила, застрахователните условия и наличността на екипа.':
		'content90',
	'5. Клиентски автомобили': 'content91',
	'Клиентските автомобили се преглеждат по информация, предоставена от собственика, включително VIN, снимки, пробег, сервизна история, състояние и документи.':
		'content92',
	'Promosale Varna може да поиска допълнителна информация преди препоръка за цена, публикуване, директна оферта или съдействие при продажба.':
		'content93',
	'6. Контакт и данни': 'content94',
	'Съобщенията, изпратени през сайта, се използват за отговор на запитвания за автомобили, внос, огледи и продажба.':
		'content95',
	'Не изпращайте чувствителни платежни данни през публичните форми на сайта. Потвърждавайте официалните инструкции за плащане директно с Promosale Varna преди превод.':
		'content96',
	'Препоръка във Facebook': 'content97',
	'Процесът по покупка и доставка следваше плана, който беше обяснен преди да започнем.':
		'content98',
	'Предаване на клиентски автомобил': 'content99',
	'Колата, която купих чрез Promosale Varna, дойде точно както беше уговорено. Бих ги избрал отново.':
		'content100',
	'Клиент с подбор на автомобили': 'content101',
	'Всяка стъпка беше обяснена ясно: снимки преди покупка, Carfax контекст и без скрити такси.':
		'content102',
	'Потвърден купувач': 'content103',
	'Това, което поръчах, е това, което пристигна. Важното беше автомобил без скрити проблеми.':
		'content104',
	'Отзив за доставка': 'content105',
	'Получих автомобила в уговорения срок и без изненадващи такси.': 'content106',
	'Оглед по уговорка': 'content107',
	'Документите, сервизният контекст и състоянието на автомобила бяха готови, когато дойдох да видя колата.':
		'content108',
	'Отзиви от клиенти': 'content109',
	'Какво проверява Promosale Varna преди внос на автомобил от Европа': 'content110',
	'Май 2026': 'content111',
	'История, пробег, сервизни записи, снимки от покупката и документи правят решението за внос по-спокойно.':
		'content112',
	'Преди да препоръча автомобил, Promosale Varna проверява произход, пробег, сервизна история, състояние и документи, за да знае купувачът какво одобрява още преди колата да напусне Европа.':
		'content113',
	'Най-силните предложения идват от проследими източници с ясни снимки, история и сервизен контекст.':
		'content114',
	'След одобрение Promosale Varna организира транспорта, митническите стъпки и подготовката за регистрация.':
		'content115',
	'Какво означава „готов за регистрация“': 'content116',
	Документи: 'content117',
	'Технически проверки, кодиране, документи и подготовка според модела са част от истинското предаване.':
		'content118',
	'При внесен автомобил подготовката не свършва с транспорта. Документите, техническите изисквания и спецификите по модела трябва да се прегледат преди регистрация.':
		'content119',
	'Някои коли се нуждаят от осветление, навигация, кодиране или други настройки преди употреба в Европа.':
		'content120',
	'Ясната оферта трябва да разделя следващите стъпки и очакваните разходи, преди купувачът да поеме ангажимент.':
		'content121',
	'Как Promosale Varna преглежда клиентски автомобил': 'content122',
	'Продай автомобила си': 'content123',
	'Снимки, VIN, сервизна история, пробег и очаквана цена помагат на екипа да даде реалистична обратна връзка.':
		'content124',
	'Когато клиент иска да продаде автомобил, първата стъпка е ясна информация: VIN, пробег, история, снимки и документи.':
		'content125',
	'След преглед Promosale Varna може да обсъди директна оферта, съдействие при продажба или публикуване на колата като клиентски автомобил.':
		'content126',
	'Добрата информация в началото спестява време и помага цената да остане реалистична.':
		'content127',
	'Общи условия': 'content128',
	'Това е демонстрационен автомобилен сайт. Обявите и съдържанието показват как работи шаблонът; не представляват оферта за продажба.':
		'content129',
	Поверителност: 'content130',
	'Как се използват данните в този демонстрационен сайт.': 'content131',
	'Демонстрационни заявки': 'content132',
	'Използвай примерни данни при тестване. Не изпращай лични документи, платежни данни или друга чувствителна информация.':
		'content133',
	'Какво се записва': 'content134',
	'Формата записва въведените име, телефон, имейл и съобщение, както и данни за избрания автомобил, изискванията за внос и страницата на заявката. Те служат за демонстрация на обработката на запитвания.':
		'content135',
	'Съхранение и достъп': 'content136',
	'В режим за демонстрация примерните заявки остават временно в паметта на приложението. Наличието на ключ за база данни не включва автоматично реално съхранение. Записването в отделна база се включва изрично само за конфигуриран клиентски сайт. Не се изпращат автоматични имейли до търговец.':
		'content137',
	'Тестовите записи остават до изтриването им или нулирането на демо базата. За премахване на случайно въведени лични данни се свържи с човека, който ти е предоставил демонстрацията.':
		'content138',
	'Външни услуги': 'content139',
	'При отваряне на YouTube, Google Maps, Facebook или Viber важат правилата на съответната услуга. Изображения и шрифтове могат да се зареждат от външни доставчици.':
		'content140',
	'Сайт за конкретен търговец': 'content141',
	'При изграждане на клиентски сайт тестовата база се заменя с отделна база за търговеца. Преди публикуване се посочват реалният администратор на данните, контактът за въпроси, сроковете за съхранение и приложимите правила за обработка. Демо заявките не се прехвърлят.':
		'content142',
	'Бисквитки и локално съхранение': 'content143',
	'Настройки, които помагат на демонстрационния сайт да работи.': 'content144',
	'Вход и сесия': 'content145',
	'При вход сайтът използва сесийна бисквитка, за да разпознава удостоверения потребител. Администраторската сесия е ограничена във времето; изходът я прекратява.':
		'content146',
	'Запазени предпочитания': 'content147',
	'Браузърът може да пази избрани автомобили за сравнение, любими, състояние на менюта и други настройки в локално хранилище или бисквитки. Те не са изпратени заявки за автомобил.':
		'content148',
	'Външно съдържание': 'content149',
	'Видео и външни връзки могат да отварят услуги със собствени бисквитки и правила. Прегледай информацията на съответния доставчик, преди да използваш услугата.':
		'content150',
	'Управление в браузъра': 'content151',
	'Можеш да изтриеш бисквитките и данните за този сайт от настройките на браузъра. Това може да прекрати входа и да премахне запазени предпочитания. Изтриването им не изтрива вече записана заявка от тестовата база.':
		'content152',
	'Преди клиентско публикуване': 'content153',
	'Тази информация описва шаблона. Ако в клиентския сайт се добавят аналитични, рекламни или други външни услуги, страницата и механизмите за избор трябва да отразяват действителната конфигурация.':
		'content154',
	'Без ангажимент': 'content155',
	'Демонстрационна заявка — използвай примерни данни.': 'content156',
	'Заявката е запазена. Това е демонстрация; не е изпратено съобщение до автомобилен търговец.':
		'content157'
};
const generatedDealerEnglish = (value: string): string | undefined => {
	let match = value.match(/^Как да потвърдите актуална наличност в (.+)$/u);
	if (match) return `How to confirm current availability at ${match[1]}`;
	match = value.match(
		/^Свържете се с автокъщата на (.+) и посочете точния автомобил преди посещение\.$/u
	);
	if (match)
		return `Contact the dealership on ${match[1]} and identify the exact vehicle before visiting.`;
	return (
		{
			'Информация за автокъщата': 'Dealer information',
			'Датирана извадка от обяви; потвърдете цената и наличността директно с автокъщата.':
				'Dated listing snapshot; confirm the price and availability directly with the dealership.',
			'Независим демонстрационен преглед. Формите не изпращат съобщения и не създават резервация.':
				'Independent demonstration preview. Forms do not send messages or create a reservation.',
			'Външни отзиви': 'External reviews',
			'В този преглед не са включени потвърдени клиентски отзиви':
				'No verified customer reviews are included in this preview',
			'Клиентски отзиви': 'Customer reviews',
			'В този независим преглед не са включени потвърдени клиентски отзиви.':
				'No verified customer reviews are included in this independent preview.'
		} as Record<string, string>
	)[value];
};

/** Call only at immutable template editorial boundaries, never on vehicle facts or user input. */
export function contentText(locale: Locale, value: string): string {
	const key = contentSourceKeys[value];
	const generated = locale === 'en' ? generatedDealerEnglish(value) : undefined;
	if (
		locale === 'en' &&
		!key &&
		!generated &&
		!Object.hasOwn(extraEnglish, value) &&
		/[\u0400-\u04ff]/.test(value)
	)
		throw new Error('Missing English editorial catalog entry: ' + value);
	const text = key
		? (locale === 'en' ? contentEn : contentBg)[key]
		: (generated ??
			(locale === 'en' ? ((extraEnglish as Record<string, string>)[value] ?? value) : value));
	return text.replaceAll('Promosale Varna', site.identity.displayName);
}

/** Localize selected, explicit presentation fields only; identity, URLs, values and facts are preserved. */
export function localizedCopy<T>(value: T, locale: Locale): T {
	const fields = new Set([
		'title',
		'text',
		'description',
		'intro',
		'question',
		'answer',
		'body',
		'content',
		'category',
		'date',
		'role',
		'label',
		'placeholder',
		'messageLabel',
		'messagePlaceholder',
		'submitLabel',
		'subtitle',
		'serviceLabel',
		'checklist',
		'response',
		'notice',
		'success',
		'stepsTitle',
		'formTitle',
		'contactLabel',
		'formEyebrow',
		'mobileLabel',
		'mobilePlaceholder',
		'statusMessage',
		'emailLabel',
		'eyebrow',
		'excerpt'
	]);
	function visit(input: unknown, translate = false): unknown {
		if (typeof input === 'string') return translate ? contentText(locale, input) : input;
		if (Array.isArray(input)) return input.map((v) => visit(v, translate));
		if (input && typeof input === 'object')
			return Object.fromEntries(
				Object.entries(input).map(([k, v]) => [k, visit(v, fields.has(k))])
			);
		return input;
	}
	return visit(value) as T;
}
