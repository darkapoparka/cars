<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogDetailSidebar } from '$lib/auxero/blog-detail';
	import type { BlogPost } from '$lib/data/blog';

	let { posts, sidebar }: { posts: BlogPost[]; sidebar: AuxeroBlogDetailSidebar } = $props();
</script>

<div class="innerpage__sidebar">
	<form action={resolve('/blog')} class="widget-search mb-34 w-full">
		<input class="input-normal" type="text" name="q" placeholder={sidebar.searchPlaceholder} />
		<button type="submit" class="widget-search-btn">
			<img src="/assets/icons/search.svg" alt="Search" />
		</button>
	</form>
	<div class="mb-32">
		<div class="listing-details--contact-dealer style-3 mb-20">
			<img
				src={sidebar.consultantImage}
				alt="OUTLETCARS.BG — Варна consultant"
				width="96"
				height="96"
				loading="lazy"
				decoding="async"
			/>
			<div class="content">
				<a
					href={resolve(sidebar.consultantHref as '/agents/daynight-import')}
					class="h4 font-weight-600 mb-8"
				>
					{sidebar.consultantTitle}
				</a>
				<p class="text-secondary">{sidebar.consultantSubtitle}</p>
			</div>
		</div>
		<p class="mb-16">{sidebar.consultantNote}</p>
	</div>
	<div class="divider mb-32 w-full"></div>
	<p class="h4 mb-16 capitalize">{sidebar.recentTitle}</p>
	<div class="mb-32">
		{#each posts as post (post.slug)}
			<a href={resolve(`/blog/${post.slug}`)} class="recent-post mb-16 overflow-hidden">
				<div class="image">
					<img
						class="post--img flex"
						src={post.image}
						alt={post.title}
						width="280"
						height="190"
						loading="lazy"
						decoding="async"
					/>
				</div>
				<div class="content">
					<div class="md-gap-6 mb-6 flex justify-start gap-12">
						<span class="text-xs">от OUTLETCARS.BG — Варна</span><span class="text-xs">{post.date}</span>
					</div>
					<p class="title h7">{post.title}</p>
				</div>
			</a>
			<div class="divider mb-16 w-full"></div>
		{/each}
	</div>
	<div class="divider mb-32 w-full"></div>
	<p class="h4 mb-18">{sidebar.newsletterTitle}</p>
	<form action="#" class="widget-search daynight-newsletter-form mb-34 w-full" novalidate>
		<input
			class="input-normal"
			type="email"
			name="email"
			placeholder={sidebar.newsletterPlaceholder}
			required
		/>
		<button type="submit" class="widget-search-btn">
			<img src="/assets/icons/right.svg" alt="Subscribe" />
		</button>
		<p class="auxero-form-status text-highlight font-weight-600 mt-12" aria-live="polite"></p>
	</form>
</div>
