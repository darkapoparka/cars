import stock from './dealer-stock.json';

export const daynightTeamDisclosure = 'Теми за разговор с автокъщата, не профили на конкретни служители. Използва се публикуваният общ телефон; имена и снимки на екип не са предоставени.';
export type DayNightTeamMember = {
  slug: string; name: string; role: string; phone: string; email: string;
  image: string; bio: string; detail: string;
};
const topics = [
  { slug: 'prodazhbi-showroom', name: 'Автомобил и оглед', detail: 'Посочете марка, модел или номер на обявата. Потвърдете наличността, адреса и удобния час за оглед.' },
  { slug: 'barter-i-ocenka', name: 'Въпрос за бартер', detail: 'В някои обяви е посочена възможност за бартер. Приемането на конкретен автомобил и цената се договарят с продавача.' },
  { slug: 'dokumenti-finansirane', name: 'Документи и условия', detail: 'Уточнете документите, данъчната квалификация на цената и евентуалните условия за финансиране за конкретния автомобил.' },
  { slug: 'klientski-zapitvania', name: 'Общо запитване', detail: 'За въпроси за автокъщата използвайте публикувания телефон. Тази демонстрация не изпраща съобщения.' }
] as const;
export const daynightTeam: DayNightTeamMember[] = topics.map((topic) => ({
  ...topic, role: 'Тема на запитване', phone: stock.facts.phoneHref.slice(4),
  email: stock.facts.email || '', image: '/brand/logo-dark.png',
  bio: topic.detail
}));
const aliases: Record<string, string> = {
  'prodazhbi-daynight-auto': 'prodazhbi-showroom',
  'otsenka-i-barter': 'barter-i-ocenka'
};
export const getDayNightTeamMemberBySlug = (slug: string) =>
  daynightTeam.find((member) => member.slug === (aliases[slug] || slug));
