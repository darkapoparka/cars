import { resolveContactTopic, type ContactTopicId } from './company';
import type { Vehicle } from './inventory';
import { selectedVehicle } from './journeys';
import { navigation } from './navigation';

export type ShellRoute = 'home' | 'listing' | 'vehicle-detail' | 'contact' | 'about' | 'blog' | 'content';
export type ShellMainLayout = 'flush' | 'default';
export type ShellMobileBottom = 'footer' | 'detail' | 'nav';

export type NavigationItemPresentation = {
  active: boolean;
  current: boolean;
};

export type HeaderPresentation = {
  compactDetailHeader: boolean;
  vehicleDetailHeader: boolean;
  mobileSurfaceHeader: boolean;
  listingHeader: boolean;
  homeOverlayHeader: boolean;
  contactOverlayHeader: boolean;
  mobileMenuSection: boolean;
  contactTopic: ContactTopicId | null;
  detailVehicle: Vehicle | null;
  navigation: Record<string, NavigationItemPresentation>;
  mobileNavigation: {
    home: boolean;
    listing: boolean;
    tradeIn: boolean;
    import: boolean;
    menu: boolean;
  };
  mobileMenu: {
    listing: boolean;
    blog: boolean;
    about: boolean;
  };
};

export type ShellPresentation = {
  route: ShellRoute;
  mainLayout: ShellMainLayout;
  mobileBottom: ShellMobileBottom;
  contactTopic: ContactTopicId | null;
  workflowJourney: boolean;
  showFooterActions: boolean;
  showMobileFooter: boolean;
  header: HeaderPresentation;
};

const classifyRoute = (pathname: string): ShellRoute => {
  if (pathname === '/') return 'home';
  if (pathname === '/listing-grid') return 'listing';
  if (pathname.startsWith('/listing-detail-v1/')) return 'vehicle-detail';
  if (pathname === '/contact') return 'contact';
  if (pathname === '/about-us') return 'about';
  if (pathname === '/blog') return 'blog';
  return 'content';
};

const navigationActive = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  if (href === '/listing-grid') return pathname.startsWith('/listing');
  if (href === '/blog') return pathname.startsWith('/blog');
  return pathname === href || pathname.startsWith(`${href}/`);
};

const navigationPresentation = (url: URL) => Object.fromEntries(
  navigation.map(item => {
    const destination = new URL(item.href, 'https://template.invalid');
    return [item.id, {
      active: navigationActive(url.pathname, destination.pathname),
      current: destination.pathname === url.pathname && destination.search === url.search && destination.hash === url.hash
    }];
  })
) as Record<string, NavigationItemPresentation>;

export function resolveShellPresentation(url: URL, status = 200): ShellPresentation {
  const { pathname } = url;
  const route = classifyRoute(pathname);
  const contactTopic = pathname === '/contact' ? resolveContactTopic(url.searchParams.get('topic')).id : null;
  const workflowJourney = contactTopic === 'trade-in' || contactTopic === 'import';
  const detailMatch = pathname.match(/^\/listing-detail-v1\/([^/]+)$/);
  const detailVehicle = status === 200 && detailMatch ? selectedVehicle(detailMatch[1]) : null;
  const showMobileFooter = route === 'home' || route === 'about';
  const mobileMenuSection = route === 'about' || pathname.startsWith('/blog') || (route === 'contact' && !workflowJourney);
  const mainLayout: ShellMainLayout = ['home', 'listing', 'contact', 'about', 'blog'].includes(route) ? 'flush' : 'default';
  const mobileBottom: ShellMobileBottom = showMobileFooter ? 'footer' : route === 'vehicle-detail' ? 'detail' : 'nav';

  return {
    route,
    mainLayout,
    mobileBottom,
    contactTopic,
    workflowJourney,
    showFooterActions: route !== 'home',
    showMobileFooter,
    header: {
      compactDetailHeader: pathname.startsWith('/blog-detail/') || pathname.startsWith('/listing-detail-v1/'),
      vehicleDetailHeader: Boolean(detailVehicle),
      mobileSurfaceHeader: route === 'home',
      listingHeader: route === 'listing',
      homeOverlayHeader: route === 'home',
      contactOverlayHeader: route === 'contact',
      mobileMenuSection,
      contactTopic,
      detailVehicle,
      navigation: navigationPresentation(url),
      mobileNavigation: {
        home: route === 'home',
        listing: pathname.startsWith('/listing'),
        tradeIn: contactTopic === 'trade-in',
        import: contactTopic === 'import',
        menu: mobileMenuSection
      },
      mobileMenu: {
        listing: route === 'listing',
        blog: pathname.startsWith('/blog'),
        about: route === 'about'
      }
    }
  };
}
