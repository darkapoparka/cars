/** Factual inputs for the maintained Signature dealer/i18n boundaries. */
export function signatureBusinessPreview(profile) {
  const listings=profile.listings;
  if (!Array.isArray(listings) || !listings.length) throw new Error('Signature needs retained dated listings with media.');
  const ids=listings.map(listing=>listing.id);
  if (ids.some(id=>typeof id!=='string'||!id) || new Set(ids).size!==ids.length) throw new Error('Signature stock IDs must be nonempty and unique.');
  const currency=[...new Set(listings.map(listing=>listing.currency).filter(Boolean))];
  if (currency.some(value=>!/^[A-Z]{3}$/.test(value))) throw new Error('Signature listing currency must be an explicit ISO code.');
  const observedAt=profile.business.observedAt || listings.map(listing=>listing.observedAt).filter(Boolean).sort()[0] || '';
  if (observedAt && !Number.isFinite(Date.parse(observedAt))) throw new Error('Signature stock observation date is invalid.');
  return {mode:profile.stockKind==='illustrative-not-dealer-stock'?'illustrative-not-dealer-stock':'dated-listing-snapshot',observedAt,inventoryCount:listings.length,
    city:profile.business.city,countryCode:profile.business.countryCode,
    // A mixed stock feed has no single currency. Every displayed offer retains its own currency.
    currency:currency.length===1?currency[0]:'',contactBeforeVisit:true};
}

export function signaturePriceFacts(listing) {
  if (listing.priceAmount===null || listing.priceAmount===undefined) return {};
  if (!Number.isFinite(listing.priceAmount) || listing.priceAmount<0 || !/^[A-Z]{3}$/.test(listing.currency||''))
    throw new Error(`Signature cannot publish an invalid stock price: ${listing.id}`);
  return {priceAmount:listing.priceAmount,currency:listing.currency};
}

/** The normalizer uses zero for absent mileage; never turn that default into a stock claim. */
export function signatureMileageFacts(listing) {
  const raw=listing.raw || {};
  const known=['mileageKm','mileageMiles','mileageValue','km','mileage'].some(key=>{
    const value=raw[key];
    return typeof value==='number'?Number.isFinite(value):typeof value==='string'&&/\d/.test(value);
  });
  if (!known) return {};
  if (!Number.isFinite(listing.mileageValue) || listing.mileageValue<0 || !['km','mi'].includes(listing.mileageUnit))
    throw new Error(`Signature cannot publish invalid stock mileage: ${listing.id}`);
  return {mileageValue:listing.mileageValue,mileageUnit:listing.mileageUnit};
}

export function signatureNativeFactsContract(source) {
  return /\bbusinessPreview\??\s*:/.test(source) && /\bpriceAmount\??\s*:/.test(source) && /\bmileageValue\??\s*:/.test(source);
}
