import { load } from 'cheerio';
import { pages } from './pages';

const inventory = pages.get('/inventory/')!;
const records = new Map<string, { html: string; classes: string[]; price: number; mileage: number; date: number; text: string }>();
for (const [route, page] of pages) {
 if (!route.startsWith('/inventory/')) continue;
 const $ = load(page.body);
 $('.stm-isotope-sorting-main > .listing-list-loop').each((_, element) => {
  const item = $(element);
  const key = item.find('a[href*="/listings/"]').first().attr('href');
  if (!key || records.has(key)) return;
  records.set(key, {
   html: $.html(element), classes: (item.attr('class') ?? '').split(/\s+/),
   price: Number(item.attr('data-price')), mileage: Number(item.attr('data-mileage')),
   date: Number(item.attr('data-date')), text: item.text().toLowerCase()
  });
 });
}

const categories = ['make', 'serie', 'body', 'condition', 'ca-year', 'transmission', 'exterior-color', 'interior-color'];

export function inventoryResult(url: URL) {
 const params = url.searchParams;
 let items = [...records.values()].filter(item => {
  for (const key of categories) {
   const value = params.get(key);
   if (value && !item.classes.some(token => token === value || token.startsWith(`${value}-`))) return false;
  }
  for (const [key, number] of [['price', item.price], ['mileage', item.mileage]] as const) {
   const min = Number(params.get(`min_${key}`) ?? 0);
   const max = Number(params.get(`max_${key}`) ?? Infinity);
   if (number < min || number > max) return false;
  }
  const keyword = params.get('s') || params.get('keyword') || '';
  return !keyword || item.text.includes(keyword.toLowerCase());
 });
 const sort = params.get('sort_order');
 if (sort) {
  const [field, direction] = sort.split('_');
  if (field === 'price' || field === 'mileage' || field === 'date') {
   items = items.toSorted((a,b) => (a[field]-b[field])*(direction === 'high' ? -1 : 1));
  }
 }
 const total = items.length;
 const perPage = 12;
 const requestedPage = Number(url.pathname.match(/\/page\/(\d+)/)?.[1] ?? params.get('page') ?? 1);
 const pageNumber = Number.isFinite(requestedPage) ? Math.max(1, Math.trunc(requestedPage)) : 1;
 const $ = load(inventory.body);
 $('.stm-isotope-sorting-main').html(items.slice((pageNumber-1)*perPage,pageNumber*perPage).map(item=>item.html).join(''));
 $('.stm-isotope-sorting-featured-top,.stm-featured-top-cars-title').remove();
 if (!total) $('.stm-isotope-sorting-main').html('<p class="heading-font" role="status">No vehicles match your search.</p>');
 const pager = $('<ul class="page-numbers"></ul>');
 for (let n=1; n<=Math.ceil(total/perPage); n++) {
  const target = new URL(n === 1 ? '/inventory/' : `/inventory/page/${n}/`, url.origin);
  target.search = params.toString();
  const li = $('<li></li>');
  if(n===pageNumber)li.append($('<span class="page-numbers current" aria-current="page"></span>').text(String(n)));
  else li.append($('<a class="page-numbers external"></a>').attr('href',target.href).text(String(n)));
  pager.append(li);
 }
 $('.stm_ajax_pagination').empty().append(pager);
 return { html: $('#listings-result').html() ?? '', total, url: url.href, filter_badges: [], options: {} };
}

export function inventoryPage(url: URL, originalBody: string) {
 const result = inventoryResult(url);
 const $ = load(originalBody);
 $('#listings-result').html(result.html);
 $('.stm-listing-directory-total-matches span').text(String(result.total));
 for(const key of categories){
  const value=url.searchParams.get(key);
  if(value)$(`select[name="${key}"] option`).each((_,e)=>{
   if($(e).attr('value')===value)$(e).attr('selected','');else $(e).removeAttr('selected');
  });
 }
 return $('body').html() ?? originalBody;
}
