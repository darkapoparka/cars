import { brand } from '$config/brand';
import { featuredVehicles } from '$data/inventory';

export type NavigationHref = '/'|'/about-us'|`/about-us#${string}`|`/blog-detail/${number}`|'/blog'|`/blog?${string}`|'/contact'|`/contact?${string}`|'/listing-grid'|`/listing-grid?${string}`|`tel:${string}`;
export type InternalNavigationHref = Exclude<NavigationHref, `tel:${string}`>;
export type NavigationLink = { id:string; label:string; href:NavigationHref };
export type NavigationGroup = { id:string; title:string; links:NavigationLink[] };
export type NavigationFeature = { id:string; title:string; detail:string; image:string; href:InternalNavigationHref };
export type MegaMenu = { title:string; description:string; features:NavigationFeature[]; groups:NavigationGroup[]; cta:Omit<NavigationLink,'href'>&{href:InternalNavigationHref;detail:string} };
export type NavigationItem = Omit<NavigationLink,'href'>&{href:InternalNavigationHref;menu?:MegaMenu};
const art=(i:number)=>featuredVehicles[i%featuredVehicles.length]?.image??featuredVehicles[0].image;
export const navigation:NavigationItem[]=[
 {id:'home',label:'Home',href:'/'},
 {id:'vehicles',label:'Cars',href:'/listing-grid',menu:{title:'Cars',description:'Browse the dated showroom sample by body type, year or price.',features:[{id:'cars-1',title:featuredVehicles[0].title,detail:featuredVehicles[0].mileage,image:art(0),href:featuredVehicles[0].href},{id:'cars-2',title:featuredVehicles[1].title,detail:featuredVehicles[1].mileage,image:art(1),href:featuredVehicles[1].href}],groups:[{id:'browse',title:'Browse',links:[{id:'all',label:'All cars',href:'/listing-grid'},{id:'newest',label:'Newest model years',href:'/listing-grid?sort=newest'},{id:'used',label:'Used cars',href:'/listing-grid?condition=used'}]}],cta:{id:'cars-cta',label:'View all cars',href:'/listing-grid',detail:'Current details must be confirmed with the showroom.'}}},
 {id:'about',label:'About',href:'/about-us',menu:{title:brand.name,description:`Showroom information and direct contact in ${brand.city}.`,features:[{id:'about-1',title:'Showroom',detail:brand.address,image:art(2),href:'/about-us'},{id:'about-2',title:'Arrange a viewing',detail:'Confirm the vehicle before travelling.',image:art(3),href:'/contact?topic=inspection'}],groups:[{id:'company',title:'Company',links:[{id:'overview',label:`About ${brand.shortName}`,href:'/about-us'},{id:'contact',label:'Contact',href:'/contact'},{id:'phone',label:brand.phone,href:brand.phoneHref}]}],cta:{id:'about-cta',label:'Contact the showroom',href:'/contact',detail:'Ask about availability, price or a visit.'}}},
 {id:'guides',label:'Guides',href:'/blog',menu:{title:'Buying guides',description:'Short, neutral guidance for preparing a vehicle enquiry.',features:[{id:'guide-1',title:'Confirm current stock',detail:'Public listings can change.',image:art(4),href:'/blog-detail/1'},{id:'guide-2',title:'Prepare a showroom visit',detail:'Take the listing and your questions.',image:art(5),href:'/blog-detail/2'}],groups:[{id:'guides-list',title:'Guides',links:[{id:'all-guides',label:'All guides',href:'/blog'},{id:'viewing-guide',label:'Viewing',href:'/blog?category=Viewing'},{id:'stock-guide',label:'Stock',href:'/blog?category=Stock'}]}],cta:{id:'guides-cta',label:'View guides',href:'/blog',detail:'Dated sample content for demo review.'}}},
 {id:'contact',label:'Contact',href:'/contact'}
];
