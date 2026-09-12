import dealerPack from './dealer-pack.json';
export const daynightTeamDisclosure = 'Публикуван контакт на автокъщата. Не са установени именувани служители и не използваме измислени портрети.';
export type DayNightTeamMember = {
  slug: string; name: string; role: string; phone: string; email: string; image: string; bio: string; detail: string;
};
const dealer = dealerPack.dealer;
export const daynightTeam: DayNightTeamMember[] = [{
  slug: 'public-contact', name: dealer.name, role: 'Публикуван бизнес контакт',
  phone: dealer.phoneE164, email: '', image: dealer.logo,
  bio: dealer.appointment,
  detail: `${dealer.address}. ${dealer.stockNotice} Използвайте публикувания телефон за директен разговор.`
}];
export const getDayNightTeamMemberBySlug = (slug: string) => daynightTeam.find((member) => member.slug === slug);
