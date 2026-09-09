export type DayNightReview = {
  id:string;text:string;avatar:`/assets/${string}`;name:string;label:string;rating:number;
};
// No source-dealer testimonials are rebranded as this dealership's customers.
export const daynightReviews:DayNightReview[] = [];
export const daynightReviewDisclosure = 'Няма добавени потвърдени клиентски отзиви за тази демонстрация.';
export const daynightReviewCount = daynightReviews.length;
export const daynightReviewCountLabel = 'Без потвърдени отзиви';
export const daynightReviewLinkLabel = 'Информация за отзивите';
export const daynightReviewAverage = daynightReviewCount
  ? daynightReviews.reduce((total,review)=>total+review.rating,0)/daynightReviewCount : 0;
export const daynightReviewDistribution = [5,4,3,2,1].map(rating=>{
  const count=daynightReviews.filter(review=>review.rating===rating).length;
  return {id:`${rating}-star`,label:String(rating),count,percent:`${daynightReviewCount?Math.round(count/daynightReviewCount*100):0}%`};
});
