<script lang="ts">
	import { resolve } from '$app/paths';
	import { daynightSite } from '$lib/data/daynight-site';
	import DesktopYellowRouteHero from '$lib/components/layout/DesktopYellowRouteHero.svelte';

	type AssetHref = `/assets/${string}`;
	type AppHref = `/${string}`;
	type Benefit = { title: string; copy: string };
	type Step = { number: string; title: string; copy: string; href: AppHref; active?: boolean };
	type BlogCard = { href: '/faq' | '/calculator' | '/sell-your-car'; image: AssetHref; category: string; title: string; copy: string };
	type FaqItem = { id: string; question: string; answers: readonly string[]; active?: boolean };

	const benefits: Benefit[] = [
		{ title: 'Проверете конкретната обява', copy: 'Лизингът или финансирането се потвърждават за конкретния автомобил. Наличието на тази страница не означава, че всеки автомобил е допустим.' },
		{ title: 'Поискайте индивидуални условия', copy: 'Първоначална вноска, срок, документи и крайна цена се уточняват с продавача или финансовия доставчик за конкретната сделка.' },
		{ title: 'Демото не подава заявление', copy: 'Калкулаторът и контактната стъпка са за преглед. Не изпращайте ЕГН, лични документи или банкови данни през демонстрацията.' }
	];

	const steps: Step[] = [
		{ number: '1', title: 'Изберете конкретна обява', copy: 'Проверете цената, статуса и бележките в оригиналната обява преди да обсъждате финансиране.', href: '/inventory' },
		{ number: '2', title: 'Направете ориентировъчна сметка', copy: 'Използвайте калкулатора само като пример. Получената месечна сума не е кредитна или лизингова оферта.', href: '/calculator', active: true },
		{ number: '3', title: 'Потвърдете условията директно', copy: `Свържете се с ${daynightSite.shortName} и уточнете доставчика, първоначалната вноска, срока, документите и възможността за конкретния автомобил.`, href: '/contact?intent=financing' }
	];

	const blogCards: BlogCard[] = [
		{ image: '/assets/images/blog/post-32.jpg', href: '/faq', category: 'СЪВЕТИ', title: 'Въпроси преди покупка', copy: 'Проверете обявата, статуса, документите и въпросите за оглед преди решение.' },
		{ image: '/assets/images/blog/post-31.jpg', href: '/calculator', category: 'ОРИЕНТИР', title: 'Демо калкулатор', copy: 'Примерна сметка за сравнение на сценарии; не е индивидуална финансова оферта.' },
		{ image: '/assets/images/blog/post-23.jpg', href: '/sell-your-car', category: 'ПОЛЕЗНО', title: 'Вашият автомобил', copy: 'Подгответе данни и попитайте продавача дали разглежда изкупуване, бартер или друга възможност.' }
	];

	const faqs: FaqItem[] = [
		{ id: 'documents', question: 'Какви документи са нужни за финансиране?', answers: ['Няма универсален списък в това демо. Поискайте актуалните изисквания от продавача или финансовия доставчик за конкретната сделка. Не изпращайте лични документи през демонстрацията.'], active: true },
		{ id: 'trade-in', question: 'Може ли да се комбинира с бартер?', answers: ['Бартерът не се приема автоматично. Попитайте продавача дали разглежда Вашия автомобил и как евентуалната оценка би участвала в конкретната сделка.'] },
		{ id: 'initial-payment', question: 'Каква първоначална вноска е нужна?', answers: ['Размерът зависи от конкретния автомобил, финансовия доставчик и клиента. Потвърдете индивидуалните условия; примерите в демото не са обвързващи.'] },
		{ id: 'approval', question: 'Колко време отнема одобрението?', answers: ['Времето за разглеждане зависи от доставчика и пълнотата на документите. Демото не подава заявление и не обещава срок за одобрение.'] }
	];

	function asset(path: AssetHref): AssetHref { return path; }
	let openId = $state<string | null>(faqs.find((faq) => faq.active)?.id ?? null);
	function toggleFaq(id: string) { openId = openId === id ? null : id; }
</script>

<div class="financing-page">
	<main id="main-content" tabindex="-1" aria-labelledby="daynight-financing-title">
		<DesktopYellowRouteHero
			headingId="daynight-financing-title"
			title="Лизинг / финансиране"
			copy="Потвърдете възможността и актуалните условия за конкретния автомобил. Демото не е кредитна оферта."
			primaryLabel="Към контакт"
			primaryHref="/contact"
			secondaryLabel="Виж обяви"
			secondaryHref="/inventory"
		/>

		<section class="bg-white pb-100">
			<div class="container"><div class="hero-grid"><div>
				<p class="mb-12"></p>
				<h2 class="mb-12 capitalize">Условията се уточняват за конкретния автомобил</h2>
				<p class="h7 line-height-28 text-secondary mb-42">Публикуваните обяви могат да посочват лизинг или финансиране. Проверете статуса на автомобила и поискайте индивидуални условия директно от продавача.</p>
				<ul class="benefit-list mb-40">
					{#each benefits as benefit (benefit.title)}
						<li class="benefit-item"><img class="benefit-check" src={asset('/assets/icons/check.svg')} alt="" /><div><p class="h5 mb-4 capitalize">{benefit.title}</p><p class="h7">{benefit.copy}</p></div></li>
					{/each}
				</ul>
				<div class="hero-actions">
					<a href={resolve('/contact')} class="btn-large-3 sa-cta sa-cta-primary">Към контакт</a>
					<p class="hero-actions__call"><span>Предпочитате разговор?</span><a class="text-underline" href={`tel:${daynightSite.phone}`}>Обадете се</a></p>
				</div>
			</div></div></div>
		</section>

		<section class="background-light py-100">
			<div class="container">
				<div class="section-head"><h2 class="mb-14 capitalize">Как да проверите възможностите</h2><p class="text-secondary h7 line-height-28">Три стъпки без обещание за одобрение или конкретни финансови условия.</p></div>
				<div class="step-wrapper">
					{#each steps as step (step.number)}
						<div class={['step-box', { 'active-step': step.active }]}><p class="step-number">{step.number}</p><a href={resolve(step.href)} class="step-title h4 text-center capitalize">{step.title}</a><p class="text-secondary text-center">{step.copy}</p></div>
					{/each}
				</div>
			</div>
		</section>

		<section class="bg-white py-100">
			<div class="container">
				<div class="mb-40"><h2 class="mb-12 capitalize">Полезно преди решение</h2><p class="text-secondary h7 line-height-28">Общи насоки, демо калкулатор и подготовка на въпроси.</p></div>
				<div class="blog-grid">
					{#each blogCards as post (post.image)}
						<a href={resolve(post.href)} class="post-card"><div class="post-card__image"><img class="post-card__img" src={asset(post.image)} alt="" /></div><div class="post-card__content"><div class="post-card__meta"><span class="post-card__category text-sm">{post.category}</span></div><p class="h4 post-card__title mb-12">{post.title}</p><p class="clamp-2 text-secondary">{post.copy}</p></div></a>
					{/each}
				</div>
			</div>
		</section>

		<section class="background-light py-100">
			<div class="container">
				<h2 class="mb-40 text-center capitalize">Често задавани въпроси</h2>
				<div class="max-width-930 mx-auto w-full"><div class="flat-accordion flex flex-col gap-18" data-daynight-native-accordion>
					{#each faqs as faq (faq.id)}
						{@const open = openId === faq.id}
						<div class={['flat-toggle', { active: open }]}>
							<div class={['toggle-title', { active: open }]} role="button" tabindex="0" aria-expanded={open} onclick={() => toggleFaq(faq.id)} onkeydown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleFaq(faq.id); } }}>
								<p class="h5 title">{faq.question}</p><span class="icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 15L12 7L4 15" stroke="#1C1C1C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg></span>
							</div>
							<div class="toggle-content">{#each faq.answers as answer, index (answer)}<p class={['h7','text-secondary','line-height-28',{ 'mb-8': faq.answers.length > 1 && index === 0 }]}>{answer}</p>{/each}</div>
						</div>
					{/each}
				</div></div>
			</div>
		</section>
	</main>
</div>

<style>
	.financing-page,.financing-page *{box-sizing:border-box}.financing-page{color:#1c1c1c;font-size:16px;font-weight:400;line-height:26px;letter-spacing:0}.financing-page a:not(.sa-cta){color:inherit;text-decoration:none}.financing-page img,.financing-page svg{display:block;max-width:100%}.financing-page p,.financing-page h2,.financing-page ul{margin-top:0}.container{width:min(100% - 48px,1320px);max-width:1440px;margin:0 auto;padding:0 15px}.background-light{background:#f5f7fb}.bg-white{background:#fff}.pb-100{padding-bottom:100px}.py-100{padding-top:100px;padding-bottom:100px}.mb-4{margin-bottom:4px}.mb-8{margin-bottom:8px}.mb-12{margin-bottom:12px}.mb-14{margin-bottom:14px}.mb-40{margin-bottom:40px}.mb-42{margin-bottom:42px}.mx-auto{margin-right:auto;margin-left:auto}.w-full{width:100%}.max-width-930{max-width:930px}.flex{display:flex}.flex-col{flex-direction:column}.gap-18{gap:18px}.capitalize{text-transform:none}.text-center{text-align:center}.text-secondary{color:#667085}.text-sm{font-size:var(--sa-text-desktop-dense);line-height:1.45}.text-underline{text-decoration:underline;text-underline-offset:4px}.line-height-28{line-height:28px}.h7{font-size:var(--sa-text-desktop-body);font-weight:500;line-height:var(--sa-leading-body)}.h5{font-size:18px;font-weight:var(--sa-weight-semibold);line-height:1.35}.h4{font-size:22px;font-weight:var(--sa-weight-semibold);line-height:1.25}.financing-page h2{color:#111827;font-size:clamp(32px,3.2vw,48px);font-weight:700;letter-spacing:0;line-height:1.08}.hero-grid{display:grid;grid-template-columns:minmax(0,760px);justify-content:center;padding-top:72px}.benefit-list{display:grid;grid-template-columns:1fr;gap:26px;margin:0 0 40px;padding:0;list-style:none}.benefit-item{display:flex;align-items:flex-start;gap:12px}.benefit-check{width:24px;height:24px;flex:0 0 auto}.hero-actions{display:flex;align-items:center;gap:20px}.hero-actions__call{display:flex;gap:8px}.btn-large-3{min-height:54px;padding-right:26px;padding-left:26px}.section-head{display:flex;flex-direction:column;align-items:center;margin-bottom:40px}.step-wrapper{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px}.step-box{border:1px solid var(--sa-line);display:grid;gap:12px;align-items:center;border-radius:12px;background:#fff;padding:30px 24px;box-shadow:none}.step-box.active-step{border-color:var(--sa-line-strong)}.step-number{display:grid;width:46px;height:46px;place-items:center;margin-bottom:28px;border-radius:999px;background:var(--sa-blue,#b00000);color:#fff;font-size:32px;font-weight:700}.step-title{margin-bottom:8px}.step-box p.text-secondary{margin:0;font-size:var(--sa-text-desktop-dense);font-weight:400;line-height:26px}.blog-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:30px}.post-card{position:relative;display:block;border:1px solid #e4e8ef;border-radius:12px;background:#fff;color:#111827;box-shadow:none;text-decoration:none}.post-card__image{overflow:hidden;margin-bottom:20px;border-radius:16px}.post-card__img{width:100%;min-height:300px;height:100%;object-fit:cover}.post-card__content{width:100%;padding:22px}.post-card__meta{display:flex;justify-content:flex-start;gap:12px;margin-bottom:12px}.post-card__category{color:#b00000;text-decoration:underline;text-underline-offset:4px;text-transform:uppercase}.post-card__title{margin-bottom:12px}.clamp-2{display:-webkit-box;overflow:hidden;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical}.flat-accordion{width:100%}.flat-toggle{overflow:hidden;padding:20px 28px;border:1px solid #e4e8ef;border-radius:8px;background:#fff;box-shadow:none}.toggle-title{position:relative;display:flex;min-height:72px;align-items:center;justify-content:space-between;gap:16px;padding:20px 24px;cursor:pointer}.toggle-title .title{margin:0}.toggle-title .icon{position:absolute;top:2px;right:0;display:grid;width:34px;height:34px;flex:0 0 auto;place-items:center;border-radius:999px;background:#f4f6fa;transform:rotate(180deg);transition:all .3s ease}.toggle-title.active .icon{transform:rotate(180deg)}.toggle-content{display:none;margin-top:6px;padding:0 24px 24px}.flat-accordion .flat-toggle.active .toggle-content{display:block}
	@media(max-width:767px){.container{width:min(100% - 32px,1320px)}.pb-100,.py-100{padding-top:56px;padding-bottom:56px}.pb-100{padding-top:0}.step-wrapper,.blog-grid{grid-template-columns:1fr}.toggle-title{min-height:64px;padding:18px}.toggle-content{padding:0 18px 18px}}
</style>
