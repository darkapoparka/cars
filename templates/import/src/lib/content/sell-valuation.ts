export const sellValuationCopy = {
	en: {
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
