import type { MarketplaceSearchParams } from '../search';
import type { BodyType, FuelType, Money, VehicleListing } from '../types';
import { dealer, stock } from './dealer-profile';

const fuelTypes:Record<string,FuelType> = {
  'Бензин':'gasoline','Бензинов':'gasoline','Бензин / Газ':'lpg',
  'Дизел':'diesel','Дизелов':'diesel','Електрически':'electric','Хибрид':'hybrid','Хибриден':'hybrid'
};
const bodyTypes:Record<string,BodyType> = {
  Hatchback:'hatchback',Sedan:'sedan',Wagon:'wagon',SUV:'suv',Coupe:'coupe',
  Convertible:'convertible',Van:'van',Minivan:'van',Pickup:'pickup'
};

// The retained static-demo data boundary. No invented monthly terms, reviews,
// source-dealer vehicles, supplier approvals or claim of a live inventory feed.
export const mockListings:VehicleListing[] = stock.map(record => ({
  id:record.sourceId, slug:record.slug, category:'car', dealerOrgId:`dealer-${dealer.slug}`,
  status:'active', title:record.title,
  description:[dealer.stockNotice,record.sourceNote,record.taxLabel,dealer.mediaNotice,`Оригинална обява: ${record.sourceUrl}`].join('\n\n'),
  price:{amount:record.priceEur,currency:'EUR'}, priceType:'fixed',
  images:record.gallery.map(url => ({url,alt:`${record.title} — снимката не е включена в демонстрацията`})),
  badges:['used'], location:{city:dealer.city,country:dealer.country,region:dealer.addressLine},
  features:record.features.map(feature => ({bg:feature,en:feature})),
  spec:{make:record.make,model:record.model,year:record.year,
    bodyType:bodyTypes[record.body] ?? 'other',fuelType:fuelTypes[record.fuel] ?? 'other',
    transmission:record.transmission === 'Автоматик' || record.transmission === 'Автоматична' ? 'automatic' : 'manual',
    mileageValue:record.mileageKm,mileageUnit:'km',enginePowerHp:record.powerHp,colorExterior:record.color},
  seller:{id:`dealer-${dealer.slug}`,type:'dealer',displayName:dealer.name,
    verificationStatus:'unverified',city:dealer.city,logoUrl:dealer.logo},
  // Internal snapshot timestamp, not a representation of the seller's publication date.
  publishedAt:`${record.observedAt}T00:00:00.000Z`, promoted:false
}));

const matchesText = (listing:VehicleListing,query:string) => [listing.title,listing.description,
  listing.spec.make,listing.spec.model,listing.spec.trim,listing.location.city,listing.seller.displayName]
  .filter(Boolean).join(' ').toLocaleLowerCase('bg-BG').includes(query.toLocaleLowerCase('bg-BG'));
type ListingPredicate = (listing:VehicleListing) => boolean;
type ListingComparator = (a:VehicleListing,b:VehicleListing) => number;
const createListingPredicates = (filters:MarketplaceSearchParams):ListingPredicate[] => [
  listing => listing.status === 'active',
  listing => listing.category === filters.category,
  listing => !filters.q || matchesText(listing,filters.q),
  listing => !filters.make || listing.spec.make === filters.make,
  listing => !filters.model || listing.spec.model === filters.model,
  listing => !filters.location || listing.location.city === filters.location,
  listing => !filters.origin || listing.supply?.origin.countryCode === filters.origin ||
    (filters.origin === 'BG' && (listing.location.country === 'Bulgaria' || listing.location.country === 'България')),
  listing => !filters.deliverTo || listing.supply?.delivery.eligibleCountryCodes.includes(filters.deliverTo) ||
    (filters.deliverTo === 'BG' && (listing.location.country === 'Bulgaria' || listing.location.country === 'България')),
  listing => !filters.currency || listing.price.currency === filters.currency,
  listing => filters.priceMin === undefined || listing.price.amount >= filters.priceMin,
  listing => filters.priceMax === undefined || listing.price.amount <= filters.priceMax,
  listing => filters.yearMin === undefined || listing.spec.year >= filters.yearMin,
  listing => filters.yearMax === undefined || listing.spec.year <= filters.yearMax,
  listing => filters.mileageMax === undefined || listing.spec.mileageValue <= filters.mileageMax,
  listing => !filters.fuel || listing.spec.fuelType === filters.fuel,
  listing => !filters.transmission || listing.spec.transmission === filters.transmission,
  listing => !filters.body || listing.spec.bodyType === filters.body,
  listing => !filters.seller || listing.seller.type === filters.seller
];
const listingComparators:Record<MarketplaceSearchParams['sort'],ListingComparator> = {
  mileage_asc:(a,b)=>a.spec.mileageValue-b.spec.mileageValue,
  newest:(a,b)=>new Date(b.publishedAt).getTime()-new Date(a.publishedAt).getTime(),
  price_asc:(a,b)=>a.price.amount-b.price.amount,
  price_desc:(a,b)=>b.price.amount-a.price.amount,
  recommended:(a,b)=>Number(b.promoted)-Number(a.promoted),
  year_desc:(a,b)=>b.spec.year-a.spec.year
};
export const getMockListings = (filters:MarketplaceSearchParams) => {
  const predicates=createListingPredicates(filters);
  return mockListings.filter(listing=>predicates.every(predicate=>predicate(listing))).sort(listingComparators[filters.sort]);
};
export const getMockListingBySlug=(slug:string)=>mockListings.find(listing=>listing.slug===slug);
export const getMockListingById=(id:string)=>mockListings.find(listing=>listing.id===id);
const scoreRelatedListing=(source:VehicleListing,candidate:VehicleListing)=>
  Number(candidate.category===source.category)*4+Number(candidate.spec.make===source.spec.make)*3+
  Number(candidate.location.city===source.location.city)*2+Number(candidate.promoted);
export const getMockRelatedListings=(source:VehicleListing,limit=3)=>mockListings
  .filter(listing=>listing.status==='active'&&listing.id!==source.id)
  .map(listing=>({listing,score:scoreRelatedListing(source,listing)}))
  .sort((a,b)=>b.score-a.score).slice(0,limit).map(({listing})=>listing);

// Empty preview account state; no customers, saved searches or sales are invented.
export const mockSavedListingIds:string[]=[];
export const getMockSavedListings=()=>mockListings.filter(listing=>mockSavedListingIds.includes(listing.id));
export interface MockSavedSearch {
  cadence:'instant'|'daily'|'weekly';description:string;filters:Partial<MarketplaceSearchParams>;
  id:string;lastRunAt:string;newMatches:number;title:string;
}
export const mockSavedSearches:MockSavedSearch[]=[];
const sellerListingStatuses:Record<string,VehicleListing['status']>={};
export const getMockSellerListings=()=>mockListings.filter(listing=>Object.keys(sellerListingStatuses).includes(listing.id))
  .map(listing=>({...listing,status:sellerListingStatuses[listing.id]??listing.status}));
export const getMockSellerListingById=(id:string)=>getMockSellerListings().find(listing=>listing.id===id);
export const getMockDealerInventory=()=>mockListings.filter(listing=>listing.seller.type==='dealer');
export interface MockDealerLead {
  buyerName:string;id:string;intent:'test_drive'|'finance'|'trade_in'|'availability';
  listingId:string;listingTitle:string;receivedAt:string;source:'listing'|'saved_search'|'dealer_profile';
  status:'new'|'contacted'|'qualified'|'closed';
}
export const mockDealerLeads:MockDealerLead[]=[];
export const getMockDealerStats=()=>{
  const inventory=getMockDealerInventory();
  return {activeInventory:inventory.filter(listing=>listing.status==='active').length,
    averagePrice:inventory.length?inventory.reduce((total,listing)=>total+listing.price.amount,0)/inventory.length:0,
    leadCount:mockDealerLeads.length,newLeadCount:mockDealerLeads.filter(lead=>lead.status==='new').length};
};
export interface MockModerationReport {
  createdAt:string;details:string;flags:string[];id:string;listingId:string;listingTitle:string;
  reason:'duplicate'|'fraud_risk'|'incorrect_details'|'prohibited_content'|'seller_behavior';
  reporter:string;severity:'low'|'medium'|'high';source:'buyer_report'|'system_flag'|'admin_review';
  status:'new'|'reviewing'|'resolved'|'dismissed';
}
export const mockModerationReports:MockModerationReport[]=[];
export interface MockTrustReview {
  city:string;documents:string[];entityId:string;entityName:string;entityType:'dealer'|'seller';
  linkedListings:number;riskLevel:'low'|'medium'|'high';status:'unverified'|'pending'|'verified'|'rejected';submittedAt:string;
}
export const mockTrustReviews:MockTrustReview[]=[];
export interface MockAuditLogEntry {
  action:string;actor:string;createdAt:string;entityId:string;entityType:'listing'|'report'|'seller'|'dealer';id:string;note:string;
}
export const mockAuditLog:MockAuditLogEntry[]=[];
export const getMockAdminStats=()=>({auditEvents:mockAuditLog.length,
  highRiskReports:mockModerationReports.filter(report=>report.severity==='high').length,
  openReports:mockModerationReports.filter(report=>report.status==='new'||report.status==='reviewing').length,
  pendingTrustReviews:mockTrustReviews.filter(review=>review.status==='pending').length});
export interface MockDealerPlan {
  current?:boolean;description:string;id:string;leadCredits:number;listingLimit:number;
  monthlyPrice:Money;name:string;promotionCredits:number;support:'standard'|'priority'|'managed';
}
export const mockDealerPlans:MockDealerPlan[]=[];
export interface MockPromotionProduct {
  description:string;durationDays:number;id:string;label:string;
  placement:'search_top'|'category_featured'|'lease_partner';price:Money;
}
export const mockPromotionProducts:MockPromotionProduct[]=[];
export interface MockActivePromotion {
  clicks:number;endsAt:string;id:string;impressions:number;leads:number;listingId:string;
  productId:string;spend:Money;startsAt:string;status:'scheduled'|'active'|'ended';
}
export const mockActivePromotions:MockActivePromotion[]=[];
export interface MockDealerBillingAccount {
  currentPlanId:string;includedLeadCredits:number;invoiceBalance:Money;monthlySpend:Money;
  paymentMethod:string;renewalDate:string;status:'active'|'past_due'|'trialing';usedLeadCredits:number;
}
export const mockDealerBillingAccount:MockDealerBillingAccount={
  currentPlanId:'demo-unconfigured',status:'trialing',renewalDate:'',paymentMethod:'Демонстрация — няма свързан метод',
  invoiceBalance:{amount:0,currency:'EUR'},monthlySpend:{amount:0,currency:'EUR'},includedLeadCredits:0,usedLeadCredits:0
};
export const getMockCurrentDealerPlan=()=>mockDealerPlans.find(plan=>plan.id===mockDealerBillingAccount.currentPlanId)??mockDealerPlans[0];
export const getMockPromotionProductById=(id:string)=>mockPromotionProducts.find(product=>product.id===id);
export const getMockMonetizationStats=()=>({
  activePromotions:mockActivePromotions.filter(promotion=>promotion.status==='active').length,
  leadCreditsRemaining:mockDealerBillingAccount.includedLeadCredits-mockDealerBillingAccount.usedLeadCredits,
  promotionLeads:mockActivePromotions.reduce((total,promotion)=>total+promotion.leads,0),
  promotionSpend:{amount:mockActivePromotions.reduce((total,promotion)=>total+promotion.spend.amount,0),currency:'EUR'} satisfies Money
});
