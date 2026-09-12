<script lang="ts">
	import { resolve } from '$app/paths';
	import type { AuxeroBlogDetailContent } from '$lib/auxero/blog-detail';
	import type {
		HomeFiveFooterData,
		HomeFiveHeaderData,
		HomeFiveModalsData
	} from '$lib/auxero/home-five';
	import type { AuxeroPageDocument } from '$lib/auxero/page-document';
	import type { HomePageCopy } from '$lib/i18n/messages';
	import AuxeroPublicShell from '$lib/components/layout/AuxeroPublicShell.svelte';
	import BlogDetailMainContent from './BlogDetailMainContent.svelte';
	import BlogDetailRelatedCard from './BlogDetailRelatedCard.svelte';
	import BlogDetailSidebar from './BlogDetailSidebar.svelte';

	let {
		content,
		pageDocument,
		shellCopy,
		shellFooter,
		shellHeader,
		shellModals,
		shellRuntimeHtml
	}: {
		content: AuxeroBlogDetailContent;
		pageDocument: AuxeroPageDocument;
		shellCopy: HomePageCopy;
		shellFooter: HomeFiveFooterData;
		shellHeader: HomeFiveHeaderData;
		shellModals?: HomeFiveModalsData;
		shellRuntimeHtml: string;
	} = $props();

	let post = $derived(content.post);
</script>

<AuxeroPublicShell
	copy={shellCopy}
	footer={shellFooter}
	header={shellHeader}
	modals={shellModals}
	{pageDocument}
	runtimeHtml={shellRuntimeHtml}
	title={`${post.title} — Promosale Varna`}
>
	<div data-daynight-blog-detail-page>
		<section class="blog-details-banner">
			<img
				class="overlay-image"
				src="/assets/images/blog/overlay-blogdetails.webp"
				alt="blog-details-banner"
				width="1920"
				height="420"
				loading="eager"
				decoding="async"
			/>
			<div class="breadcrumb-wrapper">
				<div class="container">
					<ul class="breadcrumb">
						<li><a class="text-white" href={resolve('/')}>Начало</a></li>
						<li><img src="/assets/icons/right.svg" alt="chevron-right" /></li>
						<li><a class="text-white" href={resolve('/blog')}>Съвети</a></li>
						<li><img src="/assets/icons/right.svg" alt="chevron-right" /></li>
						<li><span class="text-muted">{post.title}</span></li>
					</ul>
				</div>
			</div>
			<div class="image flex">
				<img
					src={post.image}
					alt={post.title}
					width="1280"
					height="760"
					loading="eager"
					decoding="async"
					fetchpriority="high"
				/>
			</div>
			<div class="content">
				<div class="container">
					<h1 class="letter-spacing-1 mb-20 text-white">{post.title}</h1>
					<ul class="flex flex-wrap items-center gap-20">
						<li><a class="text-white" href={resolve('/agents')}>от Promosale Varna</a></li>
						<li><a class="text-white" href={resolve('/blog')}>{post.date}</a></li>
						<li>
							<a class="text-highlight text-underline uppercase" href={resolve('/blog')}>
								{post.category}
							</a>
						</li>
					</ul>
				</div>
			</div>
		</section>

		<section>
			<div class="tf-spacing"></div>
			<div class="innerpage-container container">
				<BlogDetailMainContent {content} />
				<BlogDetailSidebar posts={content.related} sidebar={content.sidebar} />
			</div>
		</section>

		<section class="py-100">
			<div class="container">
				<h2 class="mb-40">{content.relatedTitle}</h2>
				<div class="md-grid-cols-1 grid grid-cols-3 gap-x-30 gap-y-40">
					{#each content.related as relatedPost (relatedPost.slug)}
						<BlogDetailRelatedCard post={relatedPost} />
					{/each}
				</div>
			</div>
		</section>
	</div>
</AuxeroPublicShell>

<style>
	@media (max-width: 767.98px) {
		/* The final breadcrumb crumb repeats the full post title (already shown as the
		   <h1> below) and wraps across the hero image as a grey "ghost". Hide it and its
		   preceding chevron on phones so the breadcrumb stays a clean "Начало › Съвети". */
		:global([data-daynight-blog-detail-page] .blog-details-banner .breadcrumb li:last-child),
		:global(
			[data-daynight-blog-detail-page] .blog-details-banner .breadcrumb li:nth-last-child(2)
		) {
			display: none !important;
		}

		/* Tame the desktop-sized hero title (40px) to the mobile display scale. */
		:global([data-daynight-blog-detail-page] .blog-details-banner .content h1) {
			font-size: 30px !important;
			line-height: 38px !important;
		}

		/* The white hero title sits directly on the photo with no scrim, so it washes
		   out over the light (garage) top of the image. Lay a bottom-up gradient behind
		   the title block (.content is z:3) and add a faint shadow for insurance. */
		:global([data-daynight-blog-detail-page] .blog-details-banner::after) {
			content: '';
			position: absolute;
			inset: 0;
			z-index: 2;
			pointer-events: none;
			background: linear-gradient(
				to top,
				rgba(13, 20, 8, 0.8) 0%,
				rgba(13, 20, 8, 0.45) 32%,
				rgba(13, 20, 8, 0) 62%
			);
		}

		:global([data-daynight-blog-detail-page] .blog-details-banner .content h1),
		:global([data-daynight-blog-detail-page] .blog-details-banner .content ul) {
			text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
		}
	}
</style>
