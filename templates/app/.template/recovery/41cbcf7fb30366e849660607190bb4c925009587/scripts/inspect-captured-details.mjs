import {readFile,writeFile} from 'node:fs/promises';
const root='reference/2026-09-26-final-pass/vehicle-details';
const manifest=JSON.parse(await readFile(root+'/manifest.json','utf8'));
const summaries=[];
for(const record of manifest.results){if(!record.file)continue;const {content:c}=JSON.parse(await readFile(record.file,'utf8'));summaries.push({id:c.appointmentId,slug:record.slug,title:[c.year,c.make,c.model,c.variant].join(' '),tier:c.assortmentCategory,photos:Object.values(c.spinMedia??{}).filter(Array.isArray).reduce((n,a)=>n+a.length,0),features:c.allFeatures?.length,inspection:c.inspectionReport?.length,service:c.serviceHistory?.length,fee:c.updatedPriceBenefits?.convenienceFee,price:c.price});}
await writeFile(root+'/coverage.json',JSON.stringify(summaries,null,2));
console.log('SUMMARY',JSON.stringify(summaries));
for(const car of summaries.filter(c=>/ciaz|veloz|fortuner-exr$/.test(c.slug))){const {content:c}=JSON.parse(await readFile(`${root}/${car.id}.json`,'utf8'));console.log('DETAIL',car.id,JSON.stringify({basic:c.basicDetails,usps:c.carUsps,highlights:c.carHighlights,inspectionSummary:c.inspectionSummary,serviceDue:c.serviceHistoryDetail,fee:c.updatedPriceBenefits,compare:c.priceBenefits,assortmentCategory:c.assortmentCategory,assortmentSubCategory:c.assortmentSubCategory,warranty:c.warrantyHighlight,lifetimeWarranty:c.lifetimeWarrantyHighlight,isReturnApplicable:c.isReturnApplicable,categoryComparisons:c.categoryComparisons,facets:c.facets},null,2));}
