import { daynightSite } from './daynight-site';
export interface Agent { slug: string; name: string; title: string; phone: string; email: string; image: string; rating: number; sales: number; bio: string; }
// One published business contact, not invented staff or transaction history.
export const agents: Agent[] = [{
  slug: 'public-contact', name: daynightSite.name, title: 'Публикуван бизнес контакт',
  phone: daynightSite.phoneLabel, email: '', image: daynightSite.logoDark,
  rating: 0, sales: 0,
  bio: 'Не са включени проверени оценки или данни за продажби. Използвайте публикувания телефон за наличност и оглед.'
}];
export function getAgentBySlug(slug: string) { return agents.find((agent) => agent.slug === slug); }
