export const mobileServiceCopy = {
	en: {
		preferences: 'Import preferences',
		country: 'Country',
		type: 'Type',
		make: 'Make',
		model: 'Model',
		countryHelp: 'Choose the purchase market for your sourcing request.',
		typeHelp: 'Choose the kind of car you want.',
		makeHelp: 'Choose a make or enter another one.',
		modelHelp: 'Choose a model or describe the one you want.',
		anyCountry: 'Any country',
		anyType: 'Any type',
		anyMake: 'Any make',
		anyModel: 'Any model',
		apply: 'Apply',
		reset: 'Reset',
		find: 'Find this car',
		noMatches: 'Nothing in stock matches yet.',
		noMatchesHelp: 'Send your preferences and we can discuss sourcing the car.',
		sellTitle: 'Sell your car',
		sellAction: 'Start a valuation',
		sellNote: 'VIN or details · Photos optional',
		howTitle: 'How it works',
		sellSteps: [
			{ title: 'Tell us about your car', text: 'VIN or make, model, year and mileage.' },
			{
				title: 'Review it together',
				text: 'We discuss its history, condition and your expectations.'
			},
			{ title: 'Choose how to sell', text: 'Agree on an offer or a plan to find a buyer.' }
		]
	},
	bg: {
		preferences: 'Предпочитания за внос',
		country: 'Държава',
		type: 'Тип',
		make: 'Марка',
		model: 'Модел',
		countryHelp: 'Избери пазара, от който да потърсим автомобил.',
		typeHelp: 'Избери типа автомобил, който търсиш.',
		makeHelp: 'Избери марка или въведи друга.',
		modelHelp: 'Избери модел или опиши този, който търсиш.',
		anyCountry: 'Всички държави',
		anyType: 'Всички типове',
		anyMake: 'Всички марки',
		anyModel: 'Всички модели',
		apply: 'Приложи',
		reset: 'Изчисти',
		find: 'Намери този автомобил',
		noMatches: 'Все още няма наличен автомобил с тези параметри.',
		noMatchesHelp: 'Изпрати предпочитанията си, за да обсъдим вноса.',
		sellTitle: 'Продай колата си',
		sellAction: 'Заяви оценка',
		sellNote: 'VIN или данни · Снимки по желание',
		howTitle: 'Как работи',
		sellSteps: [
			{ title: 'Разкажи за автомобила', text: 'VIN или марка, модел, година и пробег.' },
			{ title: 'Обсъдете го заедно', text: 'Уточняваме историята, състоянието и очакванията ти.' },
			{ title: 'Избери как да продадеш', text: 'Уговаряме оферта или план да намерим купувач.' }
		]
	}
} as const;
