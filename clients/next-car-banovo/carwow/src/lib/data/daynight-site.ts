import stock from './dealer-stock.json';
import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
const location = stock.facts.address;
export const daynightSite = {
 name: stock.facts.name, shortName: stock.facts.name, phone: stock.facts.phoneE164, phoneLabel: stock.facts.phoneLabel, email: '',
 location, locationShort: 'Баново, обл. Варна', hoursLabel: stock.facts.hours + ' · Оглед с предварителна уговорка',
 mapEmbedSrc: 'https://www.google.com/maps?q=' + encodeURIComponent(location) + '&z=15&output=embed',
 mapUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(location), mapLabel: 'NEXT CAR — ' + location,
 sourceInventory: stock.facts.sourceUrl, inventoryCount: stock.vehicles.length, logoLight: '/brand/logo.png', logoDark: '/brand/logo.png',
 primaryCta: 'Разгледай автомобилите', sellCarCta: 'Запитване за автомобил', accountCta: 'Контакт с автокъщата', phoneCta: 'Уговори оглед',
 heroTitle: stock.facts.name, heroSubtitle: stock.facts.description,
 reviewCount: daynightReviewCount, reviewCountLabel: daynightReviewCountLabel, reviewLinkLabel: daynightReviewLinkLabel
} as const;
export const publicNavItems = [
 { label: 'Начало', href: '/' }, { label: 'Автомобили', href: '/inventory' }, { label: 'Запитване', href: '/sell-your-car' },
 { label: 'Информация', href: '/services' }, { label: 'За нас', href: '/about' }, { label: 'Ръководства', href: '/blog' }, { label: 'Контакти', href: '/contact' }
] as const;
export const publicNavGroups = [
 { label: 'Начало', href: '/' },
 { label: 'Автомобили', href: '/inventory', children: [{ label: 'Всички автомобили', href: '/inventory' },{ label: 'Карта', href: '/inventory/map' },{ label: 'Сравнение', href: '/compare' },{ label: 'Примерен калкулатор', href: '/calculator' }] },
 { label: 'Запитване', href: '/sell-your-car', children: [{ label: 'Въпрос за бартер', href: '/sell-your-car' },{ label: 'Подготви запитване', href: '/sell-your-car/request' }] },
 { label: 'Информация', href: '/services', children: [{ label: 'Преди оглед', href: '/services' },{ label: 'Въпроси за финансиране', href: '/financing' },{ label: 'ЧЗВ', href: '/faq' }] },
 { label: 'За нас', href: '/about', children: [{ label: 'За NEXT CAR', href: '/about' },{ label: 'Профил на автокъщата', href: '/about/daynight-auto-plovdiv' },{ label: 'Контакт с автокъщата', href: '/team' },{ label: 'Информация за отзивите', href: '/reviews' },{ label: 'Ръководства', href: '/blog' },{ label: 'Условия на демото', href: '/terms' }] },
 { label: 'Контакти', href: '/contact' }
] as const;
export const footerNavItems = [{ label: 'Публикувани автомобили', href: '/inventory' },{ label: 'Карта', href: '/inventory/map' },{ label: 'Въпроси за финансиране', href: '/financing' },{ label: 'Примерен калкулатор', href: '/calculator' },{ label: 'Въпрос за бартер', href: '/sell-your-car' },{ label: 'Подготви запитване', href: '/sell-your-car/request' },{ label: 'Преди оглед', href: '/services' },{ label: 'ЧЗВ', href: '/faq' }] as const;
