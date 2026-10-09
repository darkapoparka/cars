export const sellValuationCopy = {
	en: {
		sellTitle: 'Sell your car',
		sellDescription: 'Start with the basics.',
		sellAction: 'Get a valuation',
		sellNote: 'VIN or details · Photos optional',
		howTitle: 'Selling in 3 steps',
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
		sellDescription: 'Започни с данните.',
		sellAction: 'Заяви оценка',
		sellNote: 'VIN или данни · Снимки по желание',
		howTitle: 'Продажба в 3 стъпки',
		sellSteps: [
			{ title: 'Разкажи за автомобила', text: 'VIN или марка, модел, година и пробег.' },
			{ title: 'Обсъдете го заедно', text: 'Уточняваме историята, състоянието и очакванията ти.' },
			{ title: 'Избери как да продадеш', text: 'Уговаряме оферта или план да намерим купувач.' }
		]
	}
} as const;
