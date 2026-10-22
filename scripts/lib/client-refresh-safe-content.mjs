import {repairImportDealerDisclosureCatalog} from './import-dealer-inventory-copy.mjs';
import {sourceMutationWrite} from './source-mutation-writer.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { readTypeScriptCatalog } from './catalog-literal.mjs';

const read = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const write = (file, value) => {
  const bytes=Buffer.from(value.replace(/\r?\n/g, '\n'));
  return sourceMutationWrite(file,bytes,()=>{fs.mkdirSync(path.dirname(file), { recursive: true });fs.writeFileSync(file,bytes);});
};
const q = (value) => JSON.stringify(String(value ?? ''));
const isEnglish = (profile) => profile.business.countryCode !== 'BG';

export const DEMO_STOCK_LAYOUT_PATHS = Object.freeze({
  'auto-best': 'src/routes/+layout.svelte',
  modern: 'apps/web/app/[locale]/layout.tsx',
  import: 'src/routes/+layout.svelte',
  'karento-best': 'src/routes/+layout.svelte'
});

/** Demo provenance must remain visible outside tabs and desktop-only panels. */
export function personalizeDemoStockDisclosure(source, key, profile) {
  if (profile.stockKind !== 'illustrative-not-dealer-stock') return source;
  const notice = profile.business.inventoryNotice;
  if (typeof notice !== 'string' || !notice.trim()) throw Error('Demo stock requires its exact inventory disclosure');
  const anchors = {
    'auto-best': '<SiteShell {presentation}>',
    modern: '</ThemeProvider>',
    import: "{#if !nativeSite && routeParts(page.url.pathname).path.startsWith('/account')}",
    'karento-best': '<Header />'
  };
  const anchor = anchors[key];
  if (!anchor || source.split(anchor).length !== 2 || source.includes('data-dealer-stock-disclosure'))
    throw Error(`${key}: demo stock requires exactly one reviewed public layout boundary`);
  // Source literals preserve punctuation verbatim and never interpret dealer copy as markup.
  const spacing = key === 'modern'
    ? 'style={{ margin: 0, padding: "0.75rem 1rem", fontSize: "0.875rem", lineHeight: 1.5, width: "100%", boxSizing: "border-box", gridColumn: "1 / -1", flexBasis: "100%" }}'
    : 'style="margin:0;padding:0.75rem 1rem;font-size:0.875rem;line-height:1.5;width:100%;box-sizing:border-box;grid-column:1 / -1;flex-basis:100%"';
  const disclosure = `<p data-dealer-stock-disclosure ${spacing}>{${JSON.stringify(notice)}}</p>`;
  // Auto Best's absolute header overlays the top of <main>. Keep its stock disclosure
  // inside the common main region but *after* the native page, before the footer.
  // That preserves disclosure on every route without covering the header or hero.
  if (key === 'auto-best') {
    const afterContent = '  {@render children()}\n</SiteShell>';
    if (source.split(afterContent).length !== 2) throw Error('auto-best: demo stock requires exactly one reviewed public layout boundary');
    const styled = disclosure.replace('style="margin:0;', 'style="margin:24px auto 0;')
      .replace('padding:0.75rem 1rem;', 'padding:14px 20px;')
      .replace('box-sizing:border-box;', 'box-sizing:border-box;border-top:1px solid #e7e7eb;background:#f6f6f8;color:#61616a;');
    return source.replace(afterContent, () => '  {@render children()}\n  ' + styled + '\n</SiteShell>');
  }
  // Import's route owns its header/footer; keep this outside its next conditional.
  return source.replace(anchor, () => key === 'import' ? disclosure + '\n' + anchor : anchor + '\n' + disclosure);
}

/** Personalize only the selected Import offer's recorded copy and identity slots. */
export function personalizeImportOfferCopy(source, profile) {
  if (!Array.isArray(profile.listings)) throw Error('Import offer requires the normalized listing pack');
  const name = String(profile.business.shortName || profile.business.name || '').trim();
  if (!name) throw Error('Import offer requires a recorded dealer name');
  const listings = profile.listings, dates = [...new Set(listings.map(row => row.observedAt))].sort();
  const illustrative = profile.stockKind === 'illustrative-not-dealer-stock' || (listings.length > 0 && listings.every(row => row.availability === 'illustrative-not-dealer-stock'));
  const dated = !illustrative && listings.length > 0 && listings.every(row => row.availability !== 'illustrative-not-dealer-stock' && /^https?:\/\//.test(row.sourceUrl || '') && /^\d{4}-\d{2}-\d{2}$/.test(row.observedAt || '') && Number.isFinite(Date.parse(row.observedAt)) && new Date(row.observedAt).toISOString().slice(0, 10) === row.observedAt);
  const date = dated ? dates.length === 1 ? dates[0] : `${dates[0]} – ${dates.at(-1)}` : '';
  const enName = String(profile.business.latinName || name);
  const copy = (english, dealer) => ({
    name: dealer, count: String(listings.length),
    inventoryLabel: english ? dated ? 'listings in a dated snapshot' : illustrative ? 'demonstration listings' : 'listings in this preview' : dated ? 'обяви в датирана извадка' : illustrative ? 'демонстрационни обяви' : 'обяви в прегледа',
    catalogTitle: english ? dated ? 'Catalogue from dated listings' : illustrative ? 'Demonstration catalogue' : 'Preview catalogue' : dated ? 'Каталог от датирани обяви' : illustrative ? 'Демонстрационен каталог' : 'Каталог за преглед',
    roadmap: english ? 'Preview catalogue, detail pages, comparison, favourites, services and contact. Confirm current price and availability with the dealership.' : 'Каталог за преглед, детайлни страници, сравнение, любими, услуги и контакт. Потвърдете актуалната цена и наличност с автокъщата.',
    title: english ? `Website proposal for ${dealer}` : `Предложение за сайт на ${dealer}`,
    description: english ? `Independent website preview for ${dealer}; ${dated ? `dated listings from ${date}` : illustrative ? 'illustrative listings, not confirmed dealer inventory' : 'current dealer availability is unconfirmed'}.` : `Независим преглед на сайт за ${dealer}; ${dated ? `датирани обяви от ${date}` : illustrative ? 'илюстративни обяви, а не потвърдена наличност на автокъщата' : 'актуалната наличност не е потвърдена'}.`,
    heroLead: english ? dated ? `Website preview for ${dealer} with ${listings.length} listings from ${date}. Prices and availability require direct confirmation; preview forms do not send enquiries.` : `Website preview for ${dealer} with ${listings.length} ${illustrative ? 'illustrative listings' : 'listings in this preview'}. They do not confirm dealer inventory or availability; preview forms do not send enquiries.` : dated ? `Преглед на сайт за ${dealer} с ${listings.length} обяви от ${date}. Цените и наличността се потвърждават директно; формите в прегледа не изпращат запитвания.` : `Преглед на сайт за ${dealer} с ${listings.length} ${illustrative ? 'илюстративни обяви' : 'обяви в прегледа'}. Те не потвърждават наличност на автокъщата; формите в прегледа не изпращат запитвания.`,
    heading: english ? `Website preview for ${dealer}` : `Демонстрационен сайт за ${dealer}`,
    headerLabel: english ? `${dealer} website proposal` : `Предложение за сайт на ${dealer}`,
    homeLabel: english ? `${dealer} home` : `Начална страница на ${dealer}`,
    openSite: english ? `Open the ${dealer} preview` : `Отвори прегледа на ${dealer}`,
    proposal: english ? `Proposal for ${dealer}` : `Предложение за ${dealer}`,
    stackBranding: english ? `Auxero template fidelity + ${dealer} visual adaptation` : `Auxero template fidelity + ${dealer} визуална адаптация`,
    stackSummary: `SvelteKit + Auxero + ${dealer} data`,
    product: english ? `Website proposal for ${dealer}.` : `Предложение за сайт на ${dealer}.`,
    featuresLead: english ? 'Preview browsing, comparison, favourites and contact flows. Forms and administration are demonstration interfaces.' : 'Преглед на търсене, сравнение, любими и контакт. Формите и админ зоната са демонстрационни интерфейси.',
    closing: english ? `${dealer} can review this proposal before any official publication.` : `${dealer} може да прегледа предложението преди официално публикуване.`
  });
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const encode = value => JSON.stringify(value, null, 2).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029').replaceAll('\n', eol);
  const block = `// CARS_IMPORT_OFFER_COPY_START${eol}\tconst offerCopy = $derived(page.data.locale === 'en' ? ${encode(copy(true, enName))} : ${encode(copy(false, name))});${eol}\t// CARS_IMPORT_OFFER_COPY_END`;
  if (source.includes('// CARS_IMPORT_OFFER_COPY_START')) {
    const boundary = /\/\/ CARS_IMPORT_OFFER_COPY_START[\s\S]*?\/\/ CARS_IMPORT_OFFER_COPY_END/g;
    if ([...source.matchAll(boundary)].length !== 1 || source.split('// CARS_IMPORT_OFFER_COPY_START').length !== 2 || source.split('// CARS_IMPORT_OFFER_COPY_END').length !== 2) throw Error('Import offer generated copy boundary changed');
    return source.replace(boundary, () => block);
  }
  const replace = (before, after) => {
    if (typeof before === 'string') {
      if (source.split(before).length !== 2) throw Error('Import offer copy shape changed: ' + before.slice(0, 60));
      source = source.replace(before, () => after);
    } else {
      const matches = [...source.matchAll(before)];
      if (matches.length !== 1) throw Error('Import offer copy shape changed');
      source = source.replace(before, () => after);
    }
  };
  const identity = /<title>Оферта за ([^<]+)<\/title>/g;
  const titles = [...source.matchAll(identity)];
  if (titles.length !== 1 || (source.match(/<title>/g) || []).length !== 1) throw Error('Import offer title identity boundary changed');
  const original = titles[0][1];
  replace('<script lang="ts">', `<script lang="ts">${eol}\timport { page } from '$app/state';${eol}\t${block}`);
  replace(/\{ value: '\d+', label: 'реални автомобила в каталога' \}/g, '{ value: offerCopy.count, label: offerCopy.inventoryLabel }');
  replace("title: 'Каталог с реални автомобили'", 'title: offerCopy.catalogTitle');
  replace("text: 'Работеща потребителска част, реални обяви, детайлни страници, сравнение, любими, услуги и контакт.'", 'text: offerCopy.roadmap');
  replace(`value: 'Auxero template fidelity + ${original} визуална адаптация'`, 'value: offerCopy.stackBranding');
  for (const array of ['stats', 'deliveredFeatures', 'roadmap', 'stack']) {
    const boundary = new RegExp('const ' + array + ' = (\\[[\\s\\S]*?\\r?\\n\\t\\]);', 'g');
    const matches = [...source.matchAll(boundary)];
    if (matches.length !== 1) throw Error('Import offer native array changed: ' + array);
    source = source.replace(boundary, (_all, values) => `const ${array} = $derived(${values});`);
  }
  replace(identity, '<title>{offerCopy.title}</title>');
  replace(`content="Клиентска оферта за новия ${original} сайт: реален каталог, админ панел, услуги, SEO, технологии и следващи стъпки."`, 'content={offerCopy.description}');
  replace(`aria-label="${original} offer header"`, 'aria-label={offerCopy.headerLabel}');
  replace(`aria-label="${original} home"`, 'aria-label={offerCopy.homeLabel}');
  replace(`alt="${original}"`, 'alt={offerCopy.name}');
  replace(`aria-label="Отвори ${original} сайта"`, 'aria-label={offerCopy.openSite}');
  replace(`Предложение за ${original}</p>`, '{offerCopy.proposal}</p>');
  replace('Новият сайт не е идея. Той вече работи.', '{offerCopy.heading}');
  replace(/Изградих реална версия на [^\r\n]+ върху Auxero визуалната база: каталог с истински\s+автомобили, страници за услуги, админ зона, сравнение, любими, блог, SEO и ясна пътна\s+карта към production\./g, '{offerCopy.heroLead}');
  replace(`SvelteKit + Auxero + ${original} data</strong>`, '{offerCopy.stackSummary}</strong>');
  replace(`Не е generic landing page. Това е ${original} продукт.`, '{offerCopy.product}');
  replace(/Фокусът е практичен: клиентът намира автомобил, разбира услугата, праща запитване,\s+сравнява, запазва и [^\r\n]+ може да управлява съдържанието\./g, '{offerCopy.featuresLead}');
  replace(`Ако ${original} иска, това може да стане официалният сайт.`, '{offerCopy.closing}');
  if (source.split('</script>')[1]?.split('<style>')[0]?.includes(original)) throw Error('Import offer retained a template dealer identity');
  return source;
}

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
export const daynightReviewDisclosure = ${q('Демонстрационни отзиви и оценки. Не са потвърдени клиентски мнения.')} as const;
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

function bindImportDatedInventoryNotice({ candidate, profile }) {
  const notice = profile.business.inventoryNotice;
  const dated = typeof notice === 'string' && notice.match(/^Представителни обяви към (\d{2}\.\d{2}\.\d{4}) г\. Потвърдете наличността и условията по телефона\.$/u);
  if (!dated) return [];
  const name = 'src/lib/content/extra-localized.ts';
  const file = path.join(candidate, name);
  const catalog = readTypeScriptCatalog(read(file), 'extraEnglish');
  if (Object.hasOwn(catalog, notice)) {
    if (typeof catalog[notice] !== 'string' || !catalog[notice].trim()) throw new Error('Import dated inventory disclosure requires an English catalog value');
    return [];
  }
  write(file, `export const extraEnglish = ${JSON.stringify({ ...catalog, [notice]: `Representative listings as of ${dated[1]}. Confirm availability and terms by phone.` }, null, 2)} as const;\n`);
  return [name];
}

export function applyImportSafeContent({ candidate, profile }) {
  const b = profile.business;
  const english = isEnglish(profile);
  const editorialFiles = [];
  editorialFiles.push(...bindImportDatedInventoryNotice({ candidate, profile }));
  const disclosureFile = path.join(candidate, 'src/lib/content/localized.ts');
  if (fs.existsSync(disclosureFile)) {
    const disclosure = repairImportDealerDisclosureCatalog(read(disclosureFile));
    if (disclosure.added) {
      write(disclosureFile, disclosure.source);
      editorialFiles.push('src/lib/content/localized.ts');
    }
  }
  const offerFile = path.join(candidate, 'src/routes/offer/+page.svelte');
  if (fs.existsSync(offerFile)) {
write(offerFile, personalizeImportOfferCopy(read(offerFile), profile));
    editorialFiles.push('src/routes/offer/+page.svelte');
  }
  const videoFile = path.join(candidate, 'src/lib/data/about-videos.ts');
  if (fs.existsSync(videoFile)) {
    write(videoFile, `export type AboutVideo = { id: string; title: string };\n\nexport const youtubeChannelHref = ${q(b.socialLinks?.youtube || '')};\nexport const aboutVideos: AboutVideo[] = [];\n`);
    editorialFiles.push('src/lib/data/about-videos.ts');
  }
  const homeFile = path.join(candidate, 'src/lib/auxero/home-five.ts');
  if (fs.existsSync(homeFile)) {
    const home = read(homeFile);
    const boundary = /export const homeFiveReviewItems: HomeFiveReview\[\] = \[[\s\S]*?\n\];/g;
    if ([...home.matchAll(boundary)].length !== 1) throw new Error('Import home review export was not found exactly once');
    // These are editorial examples, localized by the existing native source-map
    // catalog. Numbered identities remain language-neutral; no customer is implied.
    const examples = {
      'Демо профил': 'Demo profile',
      'Демонстрационен пример, а не потвърден клиентски отзив.': 'Demonstration example, not a verified customer review.',
      'Измислен пример за оформлението на отзив. Не описва реален клиент, покупка или доставка.': 'Fictional example of the review layout. It does not describe a real customer, purchase or delivery.'
    };
    const catalogFile = path.join(candidate, 'src/lib/content/extra-localized.ts');
    const catalog = readTypeScriptCatalog(read(catalogFile), 'extraEnglish');
    const items = [1, 2, 3].map((index) => ({
      avatar: '', name: `№ ${index}`, role: 'Демо профил', roleKind: 'customer',
      excerpt: 'Демонстрационен пример, а не потвърден клиентски отзив.',
      text: 'Измислен пример за оформлението на отзив. Не описва реален клиент, покупка или доставка.'
    }));
    write(homeFile, home.replace(boundary, `export const homeFiveReviewItems: HomeFiveReview[] = ${JSON.stringify(items, null, 2)};`));
    write(catalogFile, `export const extraEnglish = ${JSON.stringify({ ...catalog, ...examples }, null, 2)} as const;\n`);
    editorialFiles.push('src/lib/auxero/home-five.ts', 'src/lib/content/extra-localized.ts');
  }

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

  return [...new Set([
    ...editorialFiles,
    'src/lib/auxero/reviews.ts',
    'src/lib/data/blog.ts',
    'src/lib/components/detail/AuxeroVehicleDetailStaticContent.svelte'
  ])];
}

// Known S1 proposal copy only; control, composition and recorded identity stay outside these boundaries.
const modernCopySha = value => createHash('sha256').update(value.replaceAll('\r\n', '\n')).digest('hex');
const modernRecordedCityMask = value => value.replace(/(\$\{leadSite\.district\.(?:bg|en)\}, )[^`\r\n]+/g, '$1CARS_RECORDED_CITY.');
function modernSellCopyMask(value,profile) {
 const result=modernRecordedCityMask(value);
 if(profile.business.countryCode!=='GB'||profile.business.distanceUnit!=='mi') return result;
 const bg='mileagePlaceholder: "62 000 mi"',en='mileagePlaceholder: "62,000 mi"';
 const hasBg=result.includes(bg),hasEn=result.includes(en);
 if(hasBg!==hasEn) throw Error('Modern sell UK mileage copy pair changed');
 return hasBg?result.replace(bg,'mileagePlaceholder: "62 000 км"').replace(en,'mileagePlaceholder: "62,000 km"'):result;
}
function modernCopyBoundary(source, anchor, end, hashes, mask = value => value) {
 if(typeof source !== 'string' || source.split(anchor).length !== 2) throw Error('Modern sell known copy boundary changed');
 const start = source.indexOf(anchor), finish = source.indexOf(end,start);
 if(finish < 0) throw Error('Modern sell known copy boundary changed');
 const value = source.slice(start,finish + end.length);
 if(!hashes.includes(modernCopySha(mask(value)))) throw Error('Modern sell unreviewed copy or factual shape changed');
 return {start,end:finish + end.length,value};
}
function modernLiteralPairs(source,pairs) {
 for(const [before,after] of pairs) {
  const from = JSON.stringify(before),to = JSON.stringify(after);
  if(source.split(from).length >= 2) source = source.replaceAll(from,()=>to);
  else if(source.split(to).length < 2) throw Error('Modern sell known literal slot changed');
 }
 return source;
}
function assertModernSellProfile(profile) {
 if(!profile?.business || typeof profile.business.name !== 'string' || !profile.business.name.trim()) throw Error('Modern sell requires a recorded dealer identity');
}
export function personalizeModernSellCopy(source,profile) {
 assertModernSellProfile(profile);
 const page = modernCopyBoundary(source,'const pageCopy = ','} as const;',["539d887f97c66da2f6210a8f5dff549bf67a8f7ee53dbb2e2bd7511ff1beda25","d01cd8f034d74383df3e73f0bd753239c882c9f2bc22990935d48f310c2a2278"],value=>modernSellCopyMask(value,profile));
 const meta = modernCopyBoundary(source,'return createPublicLocalizedMetadata({','  });',["9a265151912a1e9feaabeee0aff32ca26c07cbddea41197cc95be309ee41309c","e686763b5027c5851a9cf0601a5def0d72bcd54f419e471649b8b5f110a7c44c"]);
 if(!source.includes('action={localize("/contact")}') || !source.includes('method="get"') || !source.includes('contactHref={localize("/contact")}')) throw Error('Modern sell native preview contact route changed');
 let copy = modernLiteralPairs(page.value,[["Дайте ни основните данни за автомобила. Екипът ни ще се свърже с вас за оглед и конкретна оферта.","Подгответе данни и попитайте автокъщата дали разглежда предложения за автомобил. Демото не изпраща заявка."],["Как протича оценката","Какво да уточните"],["Не. Можете да предложите автомобила за директно изкупуване, без да купувате друг.","Публичните данни не потвърждават изкупуване или бартер. Попитайте автокъщата дали разглежда такива предложения."],["Задължителен ли е бартерът?","Предлагате ли изкупуване или бартер?"],["Марка, модел, година и пробег са достатъчни за първоначалния разговор. Подгответе и телефон за връзка.","Марка, модел, година, пробег и състояние са отправна точка за разговор. Не изпращайте лични документи през демото."],["Може ли оценка само по снимки?","Какво показват снимките?"],["Регистрационните документи, сервизната история и информацията за ремонти помагат за по-бърза оценка.","Ако автокъщата разглежда предложението, уточнете дали е нужен оглед и къде. Не е потвърдена услуга за оценка."],["Какво да подготвя за огледа?","Нужен ли е оглед?"],["Без регистрация. Започнете с основните данни, а ние ще уточним следващата стъпка.","Формата подготвя данни за контакт. Тя не изпраща заявка, не оценява и не приема автомобил."],["Посочете марка, модел, година и пробег. Добавете екстри и бележки, ако желаете.","Въведете данни за контактната стъпка. Демото не изпраща заявка и не извършва оценка."],["Заявете оценка на автомобил","Подгответе данни за автомобил"],["Продайте ни автомобила си","Вашият автомобил"],["Give us the essentials about your vehicle. Our team will contact you to arrange an inspection and a concrete offer.","Prepare vehicle details and ask whether the dealership considers vehicle offers. This demo does not submit a request."],["How the appraisal works","What to confirm"],["No. You can offer the vehicle for direct purchase without buying another car.","Public information does not confirm purchase or trade-in services. Ask whether the dealership considers such offers."],["Is a trade-in required?","Do you consider purchase or trade-in?"],["Make, model, year, and mileage are enough for the initial conversation. Please also leave a phone number.","Make, model, year, mileage and condition are a starting point for a conversation. Do not submit personal documents through this demo."],["Can you appraise it from photos only?","What do photos show?"],["Registration documents, service history, and repair information help us appraise the car faster.","If the dealership considers the offer, confirm whether an inspection is needed and where. An appraisal service is unconfirmed."],["What should I prepare?","Is an inspection needed?"],["No account required. Start with the essentials and we will agree the next step with you.","The form prepares details for the contact step. It does not submit a request, appraise or accept a vehicle."],["Enter the make, model, year and mileage. Add extras and notes if you wish.","Enter details for the contact step. This demo does not submit a request or perform an appraisal."],["Request a vehicle appraisal","Prepare vehicle details"],["Sell us your vehicle","Your vehicle"]]);
 copy = copy.replace(/`Финалната оценка се прави след оглед на място в шоурума ни в \$\{leadSite\.district\.bg\}, [^`\r\n]+`/,()=>"\"Снимките помагат за разговор, но не представляват оценка. Потвърдете следващите стъпки директно.\"").replace(/`The final appraisal follows an in-person inspection at our showroom in \$\{leadSite\.district\.en\}, [^`\r\n]+`/,()=>"\"Photos can help a conversation but are not an appraisal. Confirm the next steps directly.\"");
 let metaCopy = meta.value;
 for(const [before,after] of [["`Предложете автомобила си за изкупуване или бартер на ${leadSite.name}.`","`Подгответе данни и попитайте ${leadSite.name} дали разглежда предложения за автомобил. Демото не изпраща заявка.`"],["`Offer your vehicle to ${leadSite.name} for purchase or trade-in.`","`Prepare details and ask whether ${leadSite.name} considers vehicle offers. This demo does not submit a request.`"],["\"Продайте ни автомобил\"","\"Вашият автомобил\""],["\"Sell us your vehicle\"","\"Your vehicle\""]]) if(metaCopy.includes(before)) metaCopy = metaCopy.replace(before,()=>after);
 if(modernCopySha(modernSellCopyMask(copy,profile))!=="d01cd8f034d74383df3e73f0bd753239c882c9f2bc22990935d48f310c2a2278" || modernCopySha(metaCopy)!=="e686763b5027c5851a9cf0601a5def0d72bcd54f419e471649b8b5f110a7c44c") throw Error('Modern sell output copy proof changed');
 return source.slice(0,page.start) + copy + source.slice(page.end,meta.start) + metaCopy + source.slice(meta.end);
}
export function personalizeModernMobileSellCopy(source,profile) {
 assertModernSellProfile(profile);
 const copy = modernCopyBoundary(source,'export const mobileSellVehicleCopy = ','} as const;',["3bd45c0338c50d7dd4e8eb5be83ea9fd6661cebd88113a4e7ff01237705109e7","6de2712fda21385068b4513fd24d66b5fa1bdf176f7c79f69690ff0ad47a76dc"]);
 const result = modernLiteralPairs(copy.value,[["Назад към продажбата","Назад към автомобила"],["Три ясни стъпки от данните до конкретна оферта.","Подгответе данни и потвърдете възможностите директно. Демото не изпраща заявка."],["Продажба на автомобил","Вашият автомобил"],["Обади ни се с данните, за да обсъдим удобен час за оглед.","Попитайте дали автокъщата разглежда предложения за автомобил."],["Организираме оглед","Попитайте директно"],["След огледа получаваш конкретни условия за изкупуване или бартер.","Изкупуване, бартер и оценка не са потвърдени услуги. Уточнете условията с автокъщата."],["Получаваш оферта","Уточнете възможностите"],["Как протича продажбата","Какво да уточните"],["Отворете формата за оценка","Отворете данните за автомобил"],["Продай автомобил","Вашият автомобил"],["Добавете VIN или марка, модел, година и пробег.","Добавете данни за контактния преглед. Демото не изпраща заявка и не извършва оценка."],["Back to selling","Back to your vehicle"],["Three clear steps from vehicle details to a concrete offer.","Prepare details and confirm the options directly. This demo does not submit a request."],["Sell your vehicle","Your vehicle"],["Call us with the details to discuss a convenient inspection time.","Ask whether the dealership considers vehicle offers."],["Arrange an inspection","Ask directly"],["After inspection you receive concrete purchase or trade-in terms.","Purchase, trade-in and appraisal services are unconfirmed. Ask the dealership about the terms."],["Receive an offer","Confirm the options"],["How selling works","What to confirm"],["Open appraisal form","Open vehicle details"],["Add a VIN or the make, model, year and mileage.","Add details for the contact preview. This demo does not submit a request or perform an appraisal."]]);
 if(modernCopySha(result)!=="6de2712fda21385068b4513fd24d66b5fa1bdf176f7c79f69690ff0ad47a76dc") throw Error('Modern mobile sell output copy proof changed');
 return source.slice(0,copy.start) + result + source.slice(copy.end);
}
export function applyModernSafeContent({candidate,profile}) {
 const files = [['apps/web/app/[locale]/sell/page.tsx',personalizeModernSellCopy],['apps/web/app/[locale]/components/mobile-sell-vehicle-policy.ts',personalizeModernMobileSellCopy]];
 const present = files.map(([name])=>fs.existsSync(path.join(candidate,name)));
 if(present.every(value=>!value)) return {changed:[]};
 if(present.some(value=>!value)) throw Error('Modern sell requires both known copy consumers');
 const updates = files.map(([name,transform])=>{const file=path.join(candidate,name),before=read(file),after=transform(before,profile);return {name,file,before,after};});
 const changed=[];
 for(const row of updates) if(row.before!==row.after){write(row.file,row.after);changed.push(row.name);}
 return {changed};
}
