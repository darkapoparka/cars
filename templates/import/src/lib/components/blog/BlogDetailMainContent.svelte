<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';

	let { content }: { content: AuxeroBlogDetailContent } = $props();

	let post = $derived(content.post);
	let firstRelated = $derived(content.firstRelated);
	let paragraphs = $derived(content.paragraphs);
	let secondRelated = $derived(content.secondRelated);

	const externalHref = (href: string) => ({ href });
</script>

<div class="innerpage__content md-mb-30">
	<img
		class="post--img radius-20 mb-40 flex"
		src={post.image}
		alt={post.title}
		width="1040"
		height="620"
		loading="eager"
		decoding="async"
		fetchpriority="high"
	/>
	{#each paragraphs as paragraph (paragraph.id)}
		{#if paragraph.quoteBefore}
			<div class="quote mb-28">
				<div class="content">
					<p class="h4 mb-14">
						„Добрите решения за внос започват с документи, снимки, история и ясна следваща стъпка.“
					</p>
					<p class="h7 flex items-center gap-8">
						<img src="/assets/icons/line.svg" alt="quote" />Day Night Auto
					</p>
				</div>
				<img class="icon-quote" src="/assets/icons/quote.svg" alt="quote" />
			</div>
			<p class="text-secondary h7 line-height-28 mb-40">{paragraph.text}</p>
		{:else}
			<p class="h7 text-secondary line-height-28 mb-28">{paragraph.text}</p>
		{/if}
	{/each}
	<p class="h4 mb-12">Следваща стъпка</p>
	<p class="text-secondary h7 line-height-28 mb-40">
		Изпрати на Day Night Auto точния линк към автомобила, VIN, бюджет или заявка за продажба, за да
		прегледа екипът реалния случай вместо обща оценка.
	</p>
	<div class="md-flex-col mb-40 flex justify-between gap-16">
		<ul class="blog-detail-tags flex gap-12">
			<li><p>Етикет:</p></li>
			<li><a href={resolve('/blog')}>{post.category}</a></li>
			<li><a href={resolve('/services')}>Day Night Auto</a></li>
		</ul>
		<ul class="blog-detail-social flex gap-12">
			<li><p>Сподели публикацията:</p></li>
			<li>
				<a {...externalHref(content.facebookHref)} target="_blank" rel="noreferrer">Facebook</a>
			</li>
		</ul>
	</div>
	<div class="divider mb-26"></div>
	<div class="blog-detail-recentpost mb-24 flex justify-between">
		<div class="previous">
			<p class="font-weight-600 text-highlight mb-4 uppercase">Предишна</p>
			<a href={resolve(`/blog/${firstRelated.slug}`)} class="h5 font-weight-500 capitalize">
				{firstRelated.title}
			</a>
		</div>
		<div class="next">
			<p class="font-weight-600 text-highlight mb-4 text-right uppercase">Следваща</p>
			<a
				href={resolve(`/blog/${secondRelated.slug}`)}
				class="h5 font-weight-500 text-right capitalize"
			>
				{secondRelated.title}
			</a>
		</div>
	</div>
	<div class="divider mb-40"></div>
	<form action="#" class="blog-detail-comment-form daynight-blog-comment-form" novalidate>
		<p class="h3 mb-24">Остави коментар</p>
		<div class="md-grid-cols-1 mb-16 grid grid-cols-2 gap-22">
			<div class="md-col-span-2">
				<p class="mb-8">Вашето име</p>
				<input
					class="active input-large"
					name="name-review"
					type="text"
					placeholder="Вашето име"
					required
				/>
			</div>
			<div class="md-col-span-2">
				<p class="mb-8">Вашият имейл</p>
				<input
					class="input-large"
					name="email-comment"
					type="email"
					placeholder={content.emailPlaceholder}
					required
				/>
			</div>
			<div class="padding-0 col-span-2">
				<p class="mb-8">Коментар</p>
				<textarea
					placeholder="Напишете коментара си тук"
					rows="3"
					name="comment"
					class="message"
					required
				></textarea>
			</div>
		</div>
		<label class="filter-checkbox style-2 style-3 mb-28">
			<input type="checkbox" name="save" /><span>Запомни името и имейла ми за следващия път</span>
		</label>
		<button class="btn btn-primary-3 btn-large font-weight-600">Изпрати коментар</button>
		<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
	</form>
</div>
