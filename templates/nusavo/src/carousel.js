import Swiper from 'swiper';
import {Autoplay,Navigation,Pagination,A11y} from 'swiper/modules';
export function carousel(element){
 const host=element.closest('.elementor-widget');const settings=JSON.parse(host?.getAttribute('data-carousel')||'{}');
 const image=host?.classList.contains('elementor-widget-image-carousel');const loop=host?.classList.contains('elementor-widget-loop-carousel');
 const desktop=Number(settings.slides_to_show|| (image?6:loop?5:3));const mobile=Number(settings.slides_to_show_mobile|| (image?3:1));const tablet=Number(settings.slides_to_show_tablet|| (image?5:2));const gap=Number(settings.image_spacing_custom?.size ?? settings.space_between?.size ?? (loop?10:20));
 let swiper;let stopped=false;
 requestAnimationFrame(()=>{if(stopped)return;swiper=new Swiper(element,{modules:[Autoplay,Navigation,Pagination,A11y],slidesPerView:mobile,spaceBetween:gap,loop:element.querySelectorAll(':scope > .swiper-wrapper > .swiper-slide').length>desktop,speed:500,autoplay:matchMedia('(prefers-reduced-motion: reduce)').matches?false:{delay:Number(settings.autoplay_speed||5000),pauseOnMouseEnter:true,disableOnInteraction:false},breakpoints:{768:{slidesPerView:tablet},1025:{slidesPerView:desktop}},navigation:{prevEl:host?.querySelector('.elementor-swiper-button-prev'),nextEl:host?.querySelector('.elementor-swiper-button-next')},pagination:{el:host?.querySelector('.swiper-pagination'),clickable:true},a11y:{enabled:true}})});
 return()=>{stopped=true;swiper?.destroy(true,true)};
}
