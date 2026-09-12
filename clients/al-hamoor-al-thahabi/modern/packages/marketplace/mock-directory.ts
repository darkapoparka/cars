import { organizationDirectoryEntriesSchema } from './directory';
import { mockListings } from './mock-data';
import { leadSite } from './lead-site';
/** This private dealer preview deliberately contains one unverified business, not synthetic organizations. */
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([{
 id: 'directory-'+leadSite.slug,slug:leadSite.slug,dealerOrgId:'dealer-'+leadSite.slug,
 displayName:leadSite.name,headline:leadSite.tagline,description:leadSite.previewNotice,
 orgType:'dealer',claimStatus:'unclaimed',contact:{phone:leadSite.phoneHref.replace('tel:','')},
 headquarters:{city:leadSite.city,countryCode:leadSite.countryCode},
 inventory:{activeListingCount:mockListings.length,localCount:0,inTransitCount:0,orderableCount:0,sourceStockCount:mockListings.length},
 profileImage:{alt:leadSite.name+' — private preview identity',url:leadSite.logoPath},
 brandCoverage:[...new Set(mockListings.map(listing=>listing.spec.make))].map(brand=>({brand,authorizationVerified:false,relationship:'independent_importer'})),
 representativeVehicles:mockListings.slice(0,3).map(listing=>({availability:'source_stock',href:'/listing/'+listing.slug,id:listing.id,image:listing.images[0],price:listing.price,title:listing.title})),
 tradeLanes:[],verification:{businessVerified:false,inventoryCurrent:false,trustedSupplier:false}
}]);
export const createMockOrganizationDirectoryScaleEntries = (_totalOrganizations=1) => [...mockOrganizationDirectoryCoreEntries];
export const mockOrganizationDirectoryEntries = [...mockOrganizationDirectoryCoreEntries];
