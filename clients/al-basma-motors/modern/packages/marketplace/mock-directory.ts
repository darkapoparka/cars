import { organizationDirectoryEntriesSchema } from "@repo/marketplace-domain";
import { getMockListingById } from "./mock-data";
const vehicle = (id:string) => { const listing=getMockListingById(id); if(!listing?.images[0]) throw new Error(`Missing Al Basma preview listing: ${id}`); return { availability:"local" as const, href:`/listing/${listing.slug}`, id:listing.id, image:{alt:listing.images[0].alt,url:listing.images[0].url}, price:listing.price, title:listing.title }; };
export const mockOrganizationDirectoryCoreEntries = organizationDirectoryEntriesSchema.parse([{
  brandCoverage:[{authorizationVerified:false,brand:"Lexus",relationship:"independent_importer"}], claimStatus:"unclaimed",
  contact:{email:"admin@albasmamotors.com",phone:"+971 54 342 2222",websiteUrl:"https://albasmamotors.com/"},
  description:"Independent Al Basma Motors showroom preview using dated public vehicle samples.", displayName:"Al Basma Motors",
  headquarters:{city:"Sharjah",countryCode:"AE"}, headline:"Lexus-focused showroom in Souq Al Haraj", id:"directory-al-basma-motors",
  inventory:{activeListingCount:10,inTransitCount:0,localCount:10,orderableCount:0,sourceStockCount:0}, orgType:"dealer",
  profileImage:{alt:"Al Basma Motors vehicle preview",url:"/dealer/stock/cms38d0r90058p1a10q2alud6/1.webp"},
  representativeVehicles:[vehicle("al-basma-1"),vehicle("al-basma-2"),vehicle("al-basma-3")], slug:"al-basma-motors", tradeLanes:[],
  verification:{businessVerified:false,inventoryCurrent:false,trustedSupplier:false}
}]);
export const createMockOrganizationDirectoryScaleEntries = () => mockOrganizationDirectoryCoreEntries;
export const mockOrganizationDirectoryEntries = mockOrganizationDirectoryCoreEntries;
