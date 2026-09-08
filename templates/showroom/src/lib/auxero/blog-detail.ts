import type { BlogPost } from '$lib/data/blog';
import { agents } from '$lib/data/agents';
import { eliqautoConsultants, eliqautoContact } from '$lib/data/eliqauto';

export type AuxeroBlogDetailContent = {
	emailPlaceholder: string;
	facebookHref: string;
	firstRelated: BlogPost;
	paragraphs: AuxeroBlogDetailParagraph[];
	post: BlogPost;
	related: BlogPost[];
	relatedTitle: string;
	secondRelated: BlogPost;
	sidebar: AuxeroBlogDetailSidebar;
};

export type AuxeroBlogDetailParagraph = {
	id: string;
	quoteBefore: boolean;
	text: string;
};

export type AuxeroBlogDetailSidebar = {
	consultantHref: string;
	consultantImage: string;
	consultantNote: string;
	consultantSubtitle: string;
	consultantTitle: string;
	newsletterPlaceholder: string;
	newsletterTitle: string;
	recentTitle: string;
	searchPlaceholder: string;
};

const articleParagraphs = (post: BlogPost): AuxeroBlogDetailParagraph[] =>
	post.content.map((text, index) => ({
		id: `${post.slug}-paragraph-${index + 1}`,
		quoteBefore: index === 1,
		text
	}));

const blogSidebarConsultantImage = agents[1]?.image ?? eliqautoConsultants[1].image;

export const auxeroBlogDetailFromState = ({
	post,
	related
}: {
	post: BlogPost;
	related: BlogPost[];
}): AuxeroBlogDetailContent => ({
	emailPlaceholder: eliqautoContact.emailLabel,
	facebookHref: eliqautoContact.facebookHref,
	firstRelated: related[0] ?? post,
	paragraphs: articleParagraphs(post),
	post,
	related,
	relatedTitle: 'Свързани публикации',
	secondRelated: related[1] ?? post,
	sidebar: {
		consultantHref: '/agents/eliqauto-import',
		consultantImage: blogSidebarConsultantImage,
		consultantNote:
			'Изпрати VIN, линк към обява, бюджет или срок и Eliqauto ще прегледа конкретния случай.',
		consultantSubtitle: 'Подбор, транспорт и крайни разходи',
		consultantTitle: 'Внос и лизинг',
		newsletterPlaceholder: 'Имейл адрес',
		newsletterTitle: 'Абонамент за новини',
		recentTitle: 'Последни публикации',
		searchPlaceholder: 'Търси в съветите на Eliqauto'
	}
});
