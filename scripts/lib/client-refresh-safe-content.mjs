import fs from 'node:fs';
import path from 'node:path';

const read = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value.replace(/\r?\n/g, '\n'));
};
const q = (value) => JSON.stringify(String(value ?? ''));
const isEnglish = (profile) => profile.business.countryCode !== 'BG';

export function applyCarwowSafeContent({ candidate, profile, logo }) {
  const b = profile.business;
  const english = isEnglish(profile);
  const contactName = b.shortName || b.name;

  write(path.join(candidate, 'src/lib/data/daynight-reviews.ts'), `export type DayNightReview = {
\tid: string;
\ttext: string;
\tavatar: string;
\tname: string;
\tlabel: string;
\trating: number;
};

export const daynightReviews: DayNightReview[] = [];
export const daynightReviewDisclosure = ${q(english
    ? 'No verified customer reviews are included in this independent preview.'
    : 'В този независим преглед не са включени потвърдени клиентски отзиви.')} as const;
export const daynightReviewCount = 0;
export const daynightReviewCountLabel = ${q(english ? 'No verified reviews' : 'Няма потвърдени отзиви')};
export const daynightReviewLinkLabel = daynightReviewCountLabel;
export const daynightReviewAverage = 0;
export const daynightReviewDistribution = [5, 4, 3, 2, 1].map((rating) => ({
\tid: \`${'${rating}'}-star\`,
\tlabel: String(rating),
\tcount: 0,
\tpercent: '0%'
}));
`);

  write(path.join(candidate, 'src/lib/data/daynight-team.ts'), `export const daynightTeamDisclosure = ${q(english
    ? 'Generic dealership contact, not a named or independently verified staff profile.'
    : 'Общ контакт на автокъщата, а не именуван или независимо потвърден профил на служител.')} as const;

export type DayNightTeamMember = {
\tslug: string;
\tname: string;
\trole: string;
\tphone: string;
\temail: string;
\timage: string;
\tbio: string;
\tdetail: string;
};

export const daynightTeam: DayNightTeamMember[] = [
\t{
\t\tslug: 'dealer-contact',
\t\tname: ${q(contactName)},
\t\trole: ${q(english ? 'Availability and viewing enquiries' : 'Запитвания за наличност и оглед')},
\t\tphone: ${q(b.phoneDisplay)},
\t\temail: ${q(b.email)},
\t\timage: ${q(logo)},
\t\tbio: ${q(english
      ? `Contact ${contactName} to confirm current availability, vehicle details, and viewing arrangements.`
      : `Свържете се с ${contactName}, за да потвърдите актуална наличност, данни за автомобила и възможност за оглед.`)},
\t\tdetail: ${q(`${b.inventoryNotice} ${b.previewNotice}`)}
\t}
];

export const getDayNightTeamMemberBySlug = (slug: string) =>
\tdaynightTeam.find((member) => member.slug === slug);
`);

  const date = (b.observedAt || '2026-01-01').slice(0, 10);
  const title = english
    ? `How to confirm current availability at ${contactName}`
    : `Как да потвърдите актуална наличност в ${contactName}`;
  const description = english
    ? 'Use the listing reference and contact the dealership before travelling or making a decision.'
    : 'Използвайте конкретната обява и се свържете с автокъщата преди пътуване или решение за покупка.';
  const firstParagraph = english
    ? `Call ${b.phoneDisplay} and identify the exact vehicle you are interested in.`
    : `Обадете се на ${b.phoneDisplay} и посочете точния автомобил, който Ви интересува.`;
  const secondParagraph = english
    ? 'Ask the dealership to confirm price, availability, mileage, documents, and viewing arrangements.'
    : 'Поискайте потвърждение за цена, наличност, пробег, документи и условия за оглед.';

  write(path.join(candidate, 'src/lib/data/daynight-blog.ts'), `export type DayNightArticleCategory =
\t| 'Новини'
\t| 'Съвети'
\t| 'Финансиране'
\t| 'Документи'
\t| 'Марки'
\t| 'Покупка'
\t| 'Продажба';
export type DayNightArticleKind = 'news' | 'guide';
export type DayNightArticleSection = { heading: string; paragraphs: string[]; };
export type DayNightArticle = {
\tslug: string;
\ttitle: string;
\tdescription: string;
\tcategory: DayNightArticleCategory;
\tkind: DayNightArticleKind;
\tdate: string;
\tauthor: string;
\timage: string;
\treadMinutes: number;
\tsummary: string[];
\tsections: DayNightArticleSection[];
\ttags: string[];
\tbody: string[];
};

const article: DayNightArticle = {
\tslug: 'confirm-current-availability',
\ttitle: ${q(title)},
\tdescription: ${q(description)},
\tcategory: 'Съвети',
\tkind: 'guide',
\tdate: ${q(date)},
\tauthor: ${q(english ? 'Independent preview information' : 'Информация за независим преглед')},
\timage: '/assets/images/blog/post-20.jpg',
\treadMinutes: 2,
\tsummary: [${q(b.inventoryNotice)}, ${q(b.previewNotice)}],
\tsections: [
\t\t{
\t\t\theading: ${q(english ? 'Before visiting' : 'Преди посещение')},
\t\t\tparagraphs: [${q(firstParagraph)}]
\t\t},
\t\t{
\t\t\theading: ${q(english ? 'Confirm the published details' : 'Потвърдете публикуваните данни')},
\t\t\tparagraphs: [${q(secondParagraph)}]
\t\t}
\t],
\ttags: [${q(english ? 'availability' : 'наличност')}, ${q(b.city)}],
\tbody: []
};
article.body = [article.description, ...article.summary, ...article.sections.flatMap((section) => section.paragraphs)];
export const daynightArticles: DayNightArticle[] = [article];
export const getDayNightArticleBySlug = (slug: string) => daynightArticles.find((item) => item.slug === slug);
export const getDayNightArticleIndex = (slug: string) => daynightArticles.findIndex((item) => item.slug === slug);
`);

  const answerClass = 'h7 text-secondary line-height-28';
  const answer = (value) => [{ class: answerClass, text: value }];
  const faqGroups = [{
    id: 'dealer-information',
    containerClass: 'container',
    headingClass: 'h3 mb-20 text-center capitalize',
    heading: english ? 'Dealer information' : 'Информация за автокъщата',
    items: [
      {
        id: 'availability',
        question: english ? 'Is every vehicle currently available?' : 'Всички автомобили налични ли са в момента?',
        toggleClass: 'flat-toggle bg-white',
        answer: answer(b.inventoryNotice)
      },
      {
        id: 'viewing',
        question: english ? 'How do I arrange a viewing?' : 'Как да уговоря оглед?',
        toggleClass: 'flat-toggle',
        answer: answer(english
          ? `Contact ${contactName} on ${b.phoneDisplay} before visiting ${b.address}.`
          : `Свържете се с ${contactName} на ${b.phoneDisplay} преди посещение на адрес ${b.address}.`)
      },
      {
        id: 'forms',
        question: english ? 'Does this preview submit a reservation?' : 'Този преглед създава ли резервация?',
        toggleClass: 'flat-toggle bg-white',
        answer: answer(b.previewNotice)
      }
    ]
  }];
  write(path.join(candidate, 'src/lib/data/daynight-faq.ts'), `export type FaqAnswerParagraph = { readonly class: string; readonly text: string; };
export type FaqItem = { readonly id: string; readonly question: string; readonly toggleClass: string; readonly answer: readonly FaqAnswerParagraph[]; };
export type FaqGroup = { readonly id: string; readonly containerClass: string; readonly headingClass: string; readonly heading: string; readonly items: readonly FaqItem[]; };
export const daynightFaqGroups: readonly FaqGroup[] = ${JSON.stringify(faqGroups, null, 2)};
`);

  return [
    'src/lib/data/daynight-reviews.ts',
    'src/lib/data/daynight-team.ts',
    'src/lib/data/daynight-blog.ts',
    'src/lib/data/daynight-faq.ts'
  ];
}

export function applyImportSafeContent({ candidate, profile }) {
  const b = profile.business;
  const english = isEnglish(profile);

  write(path.join(candidate, 'src/lib/auxero/reviews.ts'), `import { daynightContact } from '$lib/data/daynight';

export type AuxeroReviewCard = { avatar: string; id: string; name: string; role: string; stars: number; text: string; };
export type AuxeroReviewsPageData = { facebookHref: string; facebookLabel: string; pageLabel: string; title: string; };
export const auxeroReviewCards: AuxeroReviewCard[] = [];
export const auxeroReviewsPage: AuxeroReviewsPageData = {
\tfacebookHref: daynightContact.reviewsHref,
\tfacebookLabel: ${q(english ? 'External reviews' : 'Външни отзиви')},
\tpageLabel: '1',
\ttitle: ${q(english
    ? 'No verified customer reviews are included in this preview'
    : 'В този преглед не са включени потвърдени клиентски отзиви')}
};
`);

  const post = {
    slug: 'confirm-current-availability',
    title: english
      ? `How to confirm current availability at ${b.shortName || b.name}`
      : `Как да потвърдите актуална наличност в ${b.shortName || b.name}`,
    category: english ? 'Dealer information' : 'Информация за автокъщата',
    date: (b.observedAt || '2026-01-01').slice(0, 10),
    image: '/assets/daynight/codex-generated-v2/blog/blog-cover-import-check-v2.webp',
    excerpt: b.inventoryNotice,
    content: [
      english
        ? `Contact the dealership on ${b.phoneDisplay} and identify the exact vehicle before visiting.`
        : `Свържете се с автокъщата на ${b.phoneDisplay} и посочете точния автомобил преди посещение.`,
      b.previewNotice
    ]
  };
  write(path.join(candidate, 'src/lib/data/blog.ts'), `export interface BlogPost { slug: string; title: string; category: string; date: string; image: string; excerpt: string; content: string[]; }
export const posts: BlogPost[] = [${JSON.stringify(post, null, 2)}];
export function getPostBySlug(slug: string) { return posts.find((post) => post.slug === slug); }
`);

  const detailFile = path.join(candidate, 'src/lib/components/detail/AuxeroVehicleDetailStaticContent.svelte');
  if (fs.existsSync(detailFile)) {
    let detail = read(detailFile);
    const start = detail.indexOf('<section class="daynight-pdp-reviews-shell"');
    const end = detail.indexOf('\n</section>', start);
    if (start >= 0 && end >= 0) {
    const replacement = `<section class="daynight-pdp-reviews-shell" aria-labelledby="daynight-pdp-reviews-title">
\t<div class="daynight-pdp-reviews-shell__header">
\t\t<p class="h4" id="daynight-pdp-reviews-title">${english ? 'Customer reviews' : 'Клиентски отзиви'}</p>
\t</div>
\t<p class="text-secondary">${english
      ? 'No verified customer reviews are included in this independent preview.'
      : 'В този независим преглед не са включени потвърдени клиентски отзиви.'}</p>
</section>`;
    detail = detail.slice(0, start) + replacement + detail.slice(end + '\n</section>'.length);
      write(detailFile, detail);
    }
  }

  return [
    'src/lib/auxero/reviews.ts',
    'src/lib/data/blog.ts',
    'src/lib/components/detail/AuxeroVehicleDetailStaticContent.svelte'
  ];
}
