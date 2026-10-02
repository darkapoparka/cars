<svelte:options preserveWhitespace={true} />
<script lang="ts">
import {referencePage} from './interactions';
import {brand} from '../data/brand';
import {vehicles} from '../lib/catalog';
import {articles} from '../data/journal';
import CuratedStock from './CuratedStock.svelte';
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
<section class="vehicles-section-two curated-types">
        <div class="boxcar-container">
            <div class="boxcar-title text-center">
                <h2>A Car For Every Lifestyle</h2>
            </div>
            <div class="row">
                
                <div class="Vehicle-block col-sm-6 col-lg-3 col-md-3">
                    <a class="inner-box" href="/inventory/?body=Sedan" aria-label="Browse Sedan cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/vehicles2-1.png" alt="" width="200" height="150"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">Sedan</h6>
                        </div>
                    </a>
                </div>
                
                <div class="Vehicle-block col-sm-6 col-lg-3 col-md-3">
                    <a class="inner-box" href="/inventory/?body=Coupe" aria-label="Browse Coupe cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/vehicles2-2.png" alt="" width="200" height="150"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">Coupe</h6>
                        </div>
                    </a>
                </div>
                
                <div class="Vehicle-block col-sm-6 col-lg-3 col-md-3">
                    <a class="inner-box" href="/inventory/?body=SUV" aria-label="Browse SUV cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/vehicles2-3.png" alt="" width="200" height="150"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">SUV</h6>
                        </div>
                    </a>
                </div>
                
                
                
                <div class="Vehicle-block col-sm-6 col-lg-3 col-md-3">
                    <a class="inner-box" href="/inventory/?body=Hatchback" aria-label="Browse Hatchback cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/vehicles2-5.png" alt="" width="200" height="150"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">Hatchback</h6>
                        </div>
                    </a>
                </div>
                
                
            </div>
        </div>
    </section>
<section class="boxcar-brand-section-five pt-0 curated-brands">
        <div class="boxcar-container">
            <div class="boxcar-title">
                <h2 class="wow fadeInUp">Explore Our Brands</h2>
                
            </div>
            <div class="right-box">
                
                <div class="cars-block-five">
                    <a class="inner-box" href="/inventory/?make=Audi" aria-label="Browse Audi cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/brand5-1.png" alt="Audi" loading="lazy"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">Audi</h6>
                        </div>
                    </a>
                </div>
                
                <div class="cars-block-five">
                    <a class="inner-box" href="/inventory/?make=BMW" aria-label="Browse BMW cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/brand5-2.png" alt="BMW" loading="lazy"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">BMW</h6>
                        </div>
                    </a>
                </div>
                
                
                
                <div class="cars-block-five">
                    <a class="inner-box" href="/inventory/?make=Mercedes-Benz" aria-label="Browse Mercedes-Benz cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/brand5-4.png" alt="Mercedes-Benz" loading="lazy"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">Mercedes-Benz</h6>
                        </div>
                    </a>
                </div>
                
                
                
                
                
                <div class="cars-block-five">
                    <a class="inner-box" href="/inventory/?make=Bentley" aria-label="Browse Bentley cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/brand5-7.png" alt="Bentley" loading="lazy"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">Bentley</h6>
                        </div>
                    </a>
                </div>
                
                <div class="cars-block-five">
                    <a class="inner-box" href="/inventory/?make=Nissan" aria-label="Browse Nissan cars">
                        <div class="image-box">
                            <figure class="image"><img src="/media/resource/brand5-8.png" alt="Nissan" loading="lazy"></figure>
                        </div>
                        <div class="content-box">
                            <h6 class="title">Nissan</h6>
                        </div>
                    </a>
                </div>
                
                
                
                
            </div>
        </div>
    </section>
<section class="cars-section-ten v8 curated-stock" aria-labelledby="curated-stock-title"><div class="large-container"><div class="right-box"><div class="curated-stock-layout"><div class="boxcar-title text-center"><h2 id="curated-stock-title">Explore Our Latest Cars</h2><p class="curated-stock-note">{vehicles.length} sample vehicles to explore</p></div><CuratedStock /><div class="curated-stock-more"><a class="read-more" href="/inventory/"><span>View all cars</span></a></div></div></div></div></section>
<section class="blog-section-two pt-0 curated-services" aria-labelledby="curated-services-title">
        <div class="boxcar-container"><div class="boxcar-title text-center"><h2 id="curated-services-title">A Better Way To Find Your Next Car</h2><p>Buy, sell and plan your next move, all in one place.</p></div>
            <div class="row"><div class="blog-blockt-two curated-service-card">
                    <div class="inner-box wow fadeInUp"><div class="hover-img"><svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 110 110" fill="none" aria-hidden="true">
                                <path d="M43.1686 14.8242C36.3829 14.8242 30.2324 18.8167 27.4699 25.0145L16.292 50.093C9.59105 50.5534 4.29688 56.1314 4.29688 62.9492V75.8398C4.29688 81.7725 9.10637 86.582 15.0391 86.582H17.9835C17.9994 85.7553 18.0204 84.9288 18.0469 84.1023C17.3476 82.6768 16.9533 81.0745 16.9533 79.3796L16.7578 71.7578C16.7578 66.1212 17.9046 60.9441 22.0885 60.1012C24.0773 59.7006 25.7424 58.3456 26.5573 56.4876L40.3605 25.0145C43.1228 18.8167 49.2733 14.8242 56.0592 14.8242H43.1686Z" fill="#CEE1F2"></path>
                                <path d="M94.9609 86.582C100.894 86.582 105.703 81.7725 105.703 75.8398V62.9492C105.703 55.8299 99.9318 50.0586 92.8125 50.0586L79.5736 24.2505C76.6474 18.4688 70.7184 14.8242 64.2383 14.8242H43.1686C36.3829 14.8242 30.2324 18.8167 27.4699 25.0145L16.292 50.093C9.59105 50.5534 4.29688 56.1314 4.29688 62.9492V75.8398C4.29688 81.7725 9.10637 86.582 15.0391 86.582" stroke="#405FF2" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M38.0269 95.1758C42.7731 95.1758 46.6207 91.3282 46.6207 86.582C46.6207 81.8358 42.7731 77.9883 38.0269 77.9883C33.2807 77.9883 29.4332 81.8358 29.4332 86.582C29.4332 91.3282 33.2807 95.1758 38.0269 95.1758Z" stroke="#405FF2" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M63.1641 86.582H49.8433" stroke="#405FF2" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M71.9727 95.1758C76.7189 95.1758 80.5664 91.3282 80.5664 86.582C80.5664 81.8358 76.7189 77.9883 71.9727 77.9883C67.2265 77.9883 63.3789 81.8358 63.3789 86.582C63.3789 91.3282 67.2265 95.1758 71.9727 95.1758Z" stroke="#405FF2" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M51.5608 66.8164L63.5304 55.2099C65.9362 52.8587 64.2729 48.7712 60.9101 48.7712H49.9475C46.5786 48.7712 44.9182 44.6705 47.3367 42.3234L59.7328 30.293" stroke="#FF5CF3" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg></div>
                        <h3 class="title">Browse Cars</h3>
                        <div class="text">Find the right car for your lifestyle, from city hatchbacks to family SUVs.</div>
                        <a href="/inventory/" class="read-more"><span>Explore cars</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-1 -1 16 16" fill="none" aria-hidden="true">
                                                <g>
                                                <path d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z" fill="currentColor" stroke="currentColor" stroke-width=".45" stroke-linejoin="round"></path>
                                                </g>
                                                
                                                </svg></a>
                        
                    </div>
                </div>
<div class="blog-blockt-two curated-service-card">
                    <div class="inner-box wow fadeInUp two"><div class="hover-img"><svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 110 110" fill="none" aria-hidden="true">
                                <path d="M17.1875 84.2276V25.7724C17.1875 13.9118 26.779 4.29688 38.6109 4.29688H25.5664C13.7008 4.29688 4.08203 13.9156 4.08203 25.7812V84.2188C4.08203 96.0841 13.7008 105.703 25.5664 105.703H38.6109C26.779 105.703 17.1875 96.0882 17.1875 84.2276Z" fill="#CEE1F2"></path>
                                <path d="M72.4023 104.506C70.1826 105.281 67.7967 105.703 65.3125 105.703H25.7812C13.9156 105.703 4.29688 96.0841 4.29688 84.2188V25.7812C4.29688 13.9156 13.9156 4.29688 25.7812 4.29688H65.3125C77.1779 4.29688 86.7969 13.9156 86.7969 25.7812V48.3398M54.7852 82.2852H71.1133M21.4844 82.0703L25.4341 86.1614C27.1343 87.8681 29.8912 87.8681 31.5915 86.1614L39.7461 77.7734" stroke="#405FF2" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M105.047 70.0629C100.32 68.2247 97.1951 67.9622 94.8535 67.9622C90.5029 67.9622 87.0117 71.489 87.0117 75.8398C87.0117 80.1906 90.9148 83.7175 96.6917 83.7175C101.681 83.7175 105.703 87.2444 105.703 91.5952C105.703 95.9458 101.961 99.4729 97.6106 99.4729C95.5763 99.4729 91.0458 98.8124 86.582 97.038M96.6797 67.9622V61.0156M96.6797 99.4727V105.703M57.793 57.793V59.5117M34.1602 57.793V59.5117" stroke="#FF5CF4" stroke-width="5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M68.5352 36.7383H68.1835C68.1734 36.7146 68.1661 36.6902 68.1557 36.6667L64.3038 28.1203C64.3002 28.1123 64.2967 28.1046 64.2931 28.0966C62.5023 24.1867 58.9291 21.3217 54.734 20.4329C52.2427 19.9053 49.1996 19.5508 45.8829 19.5508C42.6308 19.5508 39.6816 19.8928 37.2649 20.402C33.0507 21.2902 29.4639 24.1577 27.6706 28.0728C27.6669 28.0807 27.6635 28.0887 27.6598 28.0966L23.7974 36.6665C23.7869 36.6899 23.7798 36.7144 23.7697 36.7381H23.418C21.0448 36.7381 19.1211 38.6618 19.1211 41.0349C19.1211 43.4081 21.0448 45.3318 23.418 45.3318V49.303C23.418 54.8137 27.8339 59.2969 33.2617 59.2969H58.6912C64.1193 59.2969 68.5352 54.8137 68.5352 49.3032V45.332C70.9083 45.332 72.832 43.4083 72.832 41.0352C72.832 38.662 70.9083 36.7383 68.5352 36.7383ZM35.4885 31.6415C36.1541 30.1969 37.4799 29.1393 39.0369 28.8112C40.6093 28.4799 42.9015 28.1445 45.8831 28.1445C48.9326 28.1445 51.3212 28.4945 52.953 28.8402C54.4951 29.167 55.811 30.2227 56.4755 31.6654L58.7617 36.7383H33.1914L35.4885 31.6415ZM35.0195 53.0664C32.1718 53.0664 29.8633 50.7579 29.8633 47.9102C29.8633 45.0624 32.1718 42.7539 35.0195 42.7539C37.8673 42.7539 40.1758 45.0624 40.1758 47.9102C40.1758 50.7579 37.8673 53.0664 35.0195 53.0664ZM56.9336 53.0664C54.0858 53.0664 51.7773 50.7579 51.7773 47.9102C51.7773 45.0624 54.0858 42.7539 56.9336 42.7539C59.7813 42.7539 62.0898 45.0624 62.0898 47.9102C62.0898 50.7579 59.7813 53.0664 56.9336 53.0664Z" fill="#FF5CF4"></path>
                            </svg></div>
                        <h3 class="title">Sell Your Car</h3>
                        <div class="text">Thinking of a change? Talk to the showroom about selling or part exchange.</div>
                        <a href="/contact/?intent=sell" class="read-more"><span>Get in touch</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-1 -1 16 16" fill="none" aria-hidden="true">
                                                <g>
                                                <path d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z" fill="currentColor" stroke="currentColor" stroke-width=".45" stroke-linejoin="round"></path>
                                                </g>
                                                
                                                </svg></a>
                        
                    </div>
                </div>
<div class="blog-blockt-two curated-service-card">
                    <div class="inner-box wow fadeInUp"><div class="hover-img"><svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                                <g clip-path="url(#clip0_24_681-curated-9)">
                                <path d="M8.75576 36.7478L35.3054 10.198C37.136 8.36741 40.104 8.36741 41.9346 10.198L36.8955 5.15894C35.0649 3.32837 32.097 3.32837 30.2664 5.15894L3.71671 31.7087C1.88613 33.5393 1.88613 36.5073 3.71671 38.3378L8.75576 43.3768C6.92518 41.5462 6.92518 38.5783 8.75576 36.7478Z" fill="#EEF1FB"></path>
                                <path d="M50.1537 18.4171C51.9843 20.2477 51.9843 23.2157 50.1537 25.0463L23.6039 51.5959C21.7734 53.4265 18.8054 53.4265 16.9748 51.5959L3.71671 38.3378C1.88613 36.5072 1.88613 33.5392 3.71671 31.7086L30.2664 5.15894C32.097 3.32836 35.0649 3.32836 36.8955 5.15894L43.5247 11.7881L52.9689 2.34387" stroke="#405FF2" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M18.9633 31.0458C18.7631 32.4554 19.2051 33.9388 20.2894 35.0231C22.12 36.8537 25.088 36.8537 26.9186 35.0231C28.7492 33.1926 28.7492 30.2246 26.9186 28.394C25.088 26.5634 25.088 23.5954 26.9186 21.7648C28.7492 19.9342 31.7172 19.9342 33.5478 21.7648C34.6321 22.8491 35.0741 24.3325 34.8739 25.7421" stroke="#405FF2" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M16.9749 38.3378L20.2894 35.0232" stroke="#405FF2" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M33.5476 21.765L36.8621 18.4504" stroke="#405FF2" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M43.5938 57.6562L57.6563 43.5937" stroke="#FF5CF4" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                </g>
                                <defs>
                                <clipPath id="clip0_24_681-curated-9">
                                <rect width="60" height="60" fill="white"></rect>
                                </clipPath>
                                </defs>
                                </svg></div>
                        <h3 class="title">Compare Cars</h3>
                        <div class="text">Put your shortlisted cars side by side and take a closer look at the details.</div>
                        <a href="/compare/" class="read-more"><span>Compare cars</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-1 -1 16 16" fill="none" aria-hidden="true">
                                                <g>
                                                <path d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z" fill="currentColor" stroke="currentColor" stroke-width=".45" stroke-linejoin="round"></path>
                                                </g>
                                                
                                                </svg></a>
                        
                    </div>
                </div>
<div class="blog-blockt-two curated-service-card">
                    <div class="inner-box wow fadeInUp two"><div class="hover-img"><svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 51 60" fill="none" aria-hidden="true">
                                <g clip-path="url(#clip0_24_628-curated-11)">
                                    <path d="M22.9688 52.9676C22.9688 52.732 22.827 52.5195 22.6096 52.4289C20.0682 51.3695 18.2812 48.8627 18.2812 45.9375V23.4375C18.2812 20.5123 20.0682 18.0054 22.6096 16.9461C22.827 16.8555 22.9688 16.6429 22.9688 16.4074V16.4062H18.2812C14.398 16.4062 11.25 19.5543 11.25 23.4375V45.9375C11.25 49.8207 14.398 52.9688 18.2812 52.9688H22.9688V52.9676Z" fill="#EEF1FB"></path>
                                    <path d="M23.3708 41.3167L36.6292 28.0583" stroke="#FF5CF4" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M30 21.0938L44.0625 2.34375" stroke="#405FF2" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M15.9375 2.34375L25.3895 12.9483" stroke="#405FF2" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M48.75 30V23.4375C48.75 19.5543 45.602 16.4062 41.7188 16.4062H38.0747C36.4508 13.6159 33.4612 11.7188 30 11.7188C26.5388 11.7188 23.5493 13.6159 21.9253 16.4062H18.2812C14.398 16.4062 11.25 19.5543 11.25 23.4375V45.9375C11.25 49.8207 14.398 52.9688 18.2812 52.9688H21.9253C23.5492 55.7591 26.5388 57.6562 30 57.6562C33.4612 57.6562 36.4507 55.7591 38.0747 52.9688H41.7188C45.602 52.9688 48.75 49.8207 48.75 45.9375V39.375" stroke="#405FF2" stroke-width="3" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
                                </g>
                                <defs>
                                    <clipPath id="clip0_24_628-curated-11">
                                    <rect width="51" height="60" fill="white"></rect>
                                    </clipPath>
                                </defs>
                                </svg></div>
                        <h3 class="title">Plan Your Budget</h3>
                        <div class="text">Explore an illustrative monthly payment before you take the next step.</div>
                        <a href="/calculator/" class="read-more"><span>Calculate payments</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="-1 -1 16 16" fill="none" aria-hidden="true">
                                                <g>
                                                <path d="M13.6109 0H5.05533C4.84037 0 4.66643 0.173943 4.66643 0.388901C4.66643 0.603859 4.84037 0.777802 5.05533 0.777802H12.6721L0.113697 13.3362C-0.0382246 13.4881 -0.0382246 13.7342 0.113697 13.8861C0.18964 13.962 0.289171 14 0.388666 14C0.488161 14 0.587656 13.962 0.663635 13.8861L13.222 1.3277V8.94447C13.222 9.15943 13.3959 9.33337 13.6109 9.33337C13.8259 9.33337 13.9998 9.15943 13.9998 8.94447V0.388901C13.9998 0.173943 13.8258 0 13.6109 0Z" fill="currentColor" stroke="currentColor" stroke-width=".45" stroke-linejoin="round"></path>
                                                </g>
                                                
                                                </svg></a>
                        
                    </div>
                </div></div>
        </div>
    </section>
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
<footer class="boxcar-footer footer-style-two v8">
        <div class="widgets-section">
            <div class="boxcar-container">
                <div class="row">
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><a class="curated-footer-logo" href="/" aria-label="{brand.name} home"><img src="{brand.logoDark}" alt="{brand.name}" width="108" height="28"></a><div class="widget-content"><p class="text">{brand.tagline}</p><p class="text">{brand.location}</p></div></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Find a car</h4><ul class="user-links style-two"><li><a href="/inventory/">Browse all cars</a></li><li><a href="/inventory/?condition=New">New cars</a></li><li><a href="/inventory/?condition=Used">Used cars</a></li><li><a href="/favorites/">Saved cars</a></li><li><a href="/compare/">Compare cars</a></li></ul></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Explore</h4><ul class="user-links style-two"><li><a href="/about/">About us</a></li><li><a href="/blog/">Buying advice</a></li><li><a href="/calculator/">Repayment calculator</a></li><li><a href="/faq/">Frequently asked questions</a></li></ul></div></div>
  <div class="footer-column col-lg-3 col-md-6 col-sm-12"><div class="footer-widget links-widget"><h4 class="widget-title">Visit the showroom</h4><div class="widget-content"><p class="text">{brand.hours}</p><ul class="user-links style-two"><li><a href="/contact/">Get in touch</a></li><li><a href="/contact/?intent=viewing">Arrange a viewing</a></li></ul></div></div></div></div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <div class="boxcar-container">
                <div class="inner-container"><div class="copyright-text">© 2026 {brand.name}. All rights reserved.</div><ul class="footer-nav"><li><a href="/terms/">Terms &amp; privacy</a></li></ul></div>
            </div>
        </div>
    </footer>
</div>
