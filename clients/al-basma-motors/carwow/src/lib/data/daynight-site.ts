import { daynightReviewCount, daynightReviewCountLabel, daynightReviewLinkLabel } from './daynight-reviews';
const location = 'Showroom 61, Souq Al Haraj, Sharjah, UAE';
export const daynightSite = {
  name:'AL BASMA MOTORS', shortName:'Al Basma', phone:'+971543422222', phoneLabel:'+971 54 342 2222', email:'admin@albasmamotors.com', location, locationShort:'Souq Al Haraj, Sharjah',
  hoursLabel:'Contact the showroom before travelling', mapEmbedSrc:`https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=16&hl=en&output=embed`, mapUrl:`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`, mapLabel:'Al Basma Motors, Sharjah, UAE',
  sourceInventory:'https://albasmamotors.com/cars', inventoryCount:10, logoLight:'/dealer/brand/logo-on-dark.png', logoDark:'/dealer/brand/logo-on-light.png',
  primaryCta:'View current cars', sellCarCta:'Vehicle enquiry', accountCta:'Contact the showroom', phoneCta:'Call the showroom', heroTitle:'AL BASMA MOTORS', heroSubtitle:'Lexus-focused showroom stock in Sharjah. Confirm current availability directly with the showroom.',
  reviewCount:daynightReviewCount, reviewCountLabel:daynightReviewCountLabel, reviewLinkLabel:daynightReviewLinkLabel
} as const;
export const publicNavItems=[{label:'Home',href:'/'},{label:'Cars',href:'/inventory'},{label:'Services',href:'/services'},{label:'About',href:'/about'},{label:'Guides',href:'/blog'},{label:'Contact',href:'/contact'}] as const;
export const publicNavGroups=[{label:'Home',href:'/'},{label:'Cars',href:'/inventory',children:[{label:'All cars',href:'/inventory'},{label:'Compare',href:'/compare'}]},{label:'Services',href:'/services',children:[{label:'Showroom services',href:'/services'},{label:'FAQ',href:'/faq'}]},{label:'About',href:'/about',children:[{label:'About Al Basma',href:'/about'},{label:'Guides',href:'/blog'}]},{label:'Contact',href:'/contact'}] as const;
export const footerNavItems=[{label:'Available cars',href:'/inventory'},{label:'Services',href:'/services'},{label:'FAQ',href:'/faq'},{label:'Contact',href:'/contact'}] as const;
