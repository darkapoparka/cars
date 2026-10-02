<svelte:options preserveWhitespace={true} />
<script lang="ts">
import {referencePage} from './interactions';
import {vehicles} from '../lib/catalog';
import {articles} from '../data/journal';
import CuratedStock from './CuratedStock.svelte';
import CuratedServices from './CuratedServices.svelte';
</script>
<div class="boxcar-wrapper cus-layout-home10 reference-home curated-home" data-reference-home="curated" data-curated-home use:referencePage>
<section class="boxcar-banner-section-seven v10 curated-banner">
        <div class="banner-slider-v7" data-static-hero="">
            <div class="inner-box">
                <div class="boxcar-container">
                    <div class="banner-slide">
                        <img src="/media/banner/bg-7.jpg" alt="" fetchpriority="high" width="1800" height="700">
                        <div class="right-box">
                            <div class="boxcar-container">
                                <div class="content-box">
                                    <div class="curated-hero-heading"><span class="sub-title">Explore new and used cars, all in one place.</span><h1>Find Your Perfect Car</h1></div>
                                    
                                <div class="form-tab-content">
            <div class="cus-container10"><div class="form-tab-pane current">
                            <form aria-label="Find your next car">
                                <div class="form_boxes">
                                    <div class="drop-menu">
                                        <div class="select" role="button" tabindex="0" aria-expanded="false" aria-label="Car condition">
                                            <span>All Cars</span>
                                            <svg class="curated-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </div>
                                        
                                        <ul class="dropdown" style="display: none;" role="listbox"><li role="option" tabindex="0" aria-selected="true">All Cars</li><li role="option" tabindex="0" aria-selected="false">New Cars</li><li role="option" tabindex="0" aria-selected="false">Used Cars</li></ul>
                                    </div>
                                </div>
                                <div class="form_boxes">
                                    <div class="drop-menu">
                                        <div class="select" role="button" tabindex="0" aria-expanded="false" aria-label="Make">
                                            <span>All Makes</span>
                                            <svg class="curated-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </div>
                                        
                                        <ul class="dropdown" style="display: none;" role="listbox">
                                            <li role="option" tabindex="0" aria-selected="false">A3</li>
                                            <li role="option" tabindex="0" aria-selected="false">Accord</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="form_boxes">
                                    <div class="drop-menu">
                                        <div class="select" role="button" tabindex="0" aria-expanded="false" aria-label="Model">
                                            <span>All Models</span>
                                            <svg class="curated-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </div>
                                        
                                        <ul class="dropdown" style="display: none;" role="listbox">
                                            <li role="option" tabindex="0" aria-selected="false">200$</li>
                                            <li role="option" tabindex="0" aria-selected="false">300$</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="form_boxes">
                                    <div class="drop-menu">
                                        <div class="select" role="button" tabindex="0" aria-expanded="false" aria-label="Maximum price">
                                            <span>Any Price</span>
                                            <svg class="curated-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                                        </div>
                                        
                                        <ul class="dropdown" style="display: none;" role="listbox">
                                            <li role="option" tabindex="0" aria-selected="false">200$</li>
                                            <li role="option" tabindex="0" aria-selected="false">300$</li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="form-submit">
                                    <button type="submit" class="theme-btn"><svg width="22" height="22" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M7.29301 1.2876C3.9872 1.2876 1.29431 3.98048 1.29431 7.28631C1.29431 10.5921 3.9872 13.2902 7.29301 13.2902C8.70502 13.2902 10.0036 12.7954 11.03 11.9738L13.5287 14.4712C13.6548 14.5921 13.8232 14.6588 13.9979 14.657C14.1725 14.6552 14.3395 14.5851 14.4631 14.4617C14.5867 14.3382 14.6571 14.1713 14.6591 13.9967C14.6611 13.822 14.5947 13.6535 14.474 13.5272L11.9753 11.0285C12.7976 10.0006 13.293 8.69995 13.293 7.28631C13.293 3.98048 10.5988 1.2876 7.29301 1.2876ZM7.29301 2.62095C9.87824 2.62095 11.9584 4.70108 11.9584 7.28631C11.9584 9.87153 9.87824 11.9569 7.29301 11.9569C4.70778 11.9569 2.62764 9.87153 2.62764 7.28631C2.62764 4.70108 4.70778 2.62095 7.29301 2.62095Z" fill="currentColor"></path>
                                </svg><span>Search cars</span></button>
                                </div>
                            </form>
                        </div></div>
        </div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            
        </div>  
        
    </section>
<section class="cars-section-ten v8 curated-stock" aria-labelledby="curated-stock-title"><div class="large-container"><div class="right-box"><div class="curated-stock-layout"><div class="boxcar-title text-center"><h2 id="curated-stock-title">Explore Our Latest Cars</h2><p class="curated-stock-note">{vehicles.length} cars to explore</p></div><CuratedStock /><div class="curated-stock-more"><a class="read-more" href="/inventory/"><span>View all cars</span></a></div></div></div></div></section>
<CuratedServices />
<section class="brand-boxcar-banner-section curated-next-car" aria-labelledby="curated-next-car-title">
        <div class="boxcar-container">
            <div class="row">
                <div class="content-column col-xl-7 col-lg-12 col-md-12 col-sm-12">
                    <div class="inner-column wow fadeInUp">
                        <h2 class="title" id="curated-next-car-title">Your Next Car, Made Simple</h2><p class="text">Found something you like? Come and see it for yourself. Ask your questions, take a closer look and find your fit.</p>
                        <a href="/contact/?intent=viewing" class="btn"><span>Arrange a viewing</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-1 -1 16 16" fill="none" aria-hidden="true">
                                                <g>
                                                <path d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z" fill="currentColor" stroke="currentColor" stroke-width=".45" stroke-linejoin="round"></path>
                                                </g>
                                                
                                                </svg></a>
                    </div>
                </div>
            </div>
        </div>
    </section>
<section class="blog-section pt-0 curated-journal">
        <div class="boxcar-container">
            <div class="boxcar-title wow fadeInUp">
                <h2>Advice For The Road Ahead</h2>
            </div>
            <div class="row">{#each articles as article}<div class="blog-block col-lg-4 col-md-6 col-sm-12">
                    <div class="inner-box wow fadeInUp">
                        <div class="image-box">
                            <figure class="image"><a href="/blog/{article.slug}/" aria-label="{article.title}"><img src="{article.image}" alt="" loading="lazy"></a></figure>
                            <span class="date">{article.category}</span>
                        </div>
                        <div class="content-box">
                            <ul class="post-info"><li>Buying guide</li></ul>
                            <h6 class="title"><a href="/blog/{article.slug}/" title="">{article.title}</a></h6>
                        </div>
                    </div>
                </div>{/each}</div>
        </div>
    </section>

</div>
