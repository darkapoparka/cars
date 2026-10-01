import fs from 'node:fs';
function patch(p,a,b){let t=fs.readFileSync(p,'utf8');if(!t.includes(a))throw Error('Missing patch '+p+' '+a.slice(0,60));fs.writeFileSync(p,t.replace(a,b));}
patch('src/components/ResultsScreen.tsx',"import { Header } from './Header';","import { Header } from './Header';\nimport { AuthPrompt } from './AuthPrompt';");
patch('src/components/ResultsScreen.tsx',"  const [name, setName] = useState([...filters.makes, ...filters.models].join(' ') || 'My search');","  const [name, setName] = useState([...filters.makes, ...filters.models].join(' ') || 'My search');\n  const { email } = useAppState();\n  if (!email) return <AuthPrompt open={open} onClose={onClose} next={'/results?'+serializeFilters(filters)} />;");
const p='src/components/ResultsScreen.tsx';let t=fs.readFileSync(p,'utf8');t=t.replace("['standard', 'price-asc', 'price-desc', 'mileage', 'newest', 'power']","['standard', 'price-asc', 'price-desc', 'mileage', 'mileage-desc', 'oldest', 'newest', 'listing-oldest', 'listing-newest']");
const start=t.indexOf('  const sorts = [');const end=t.indexOf('\n  ];',start);if(start<0||end<0)throw Error('Sort block missing');
t=t.slice(0,start)+`  const sorts = [
    ['standard','Standard sorting'],['price-asc','Price (lowest first)'],['price-desc','Price (highest first)'],
    ['mileage','Mileage (lowest first)'],['mileage-desc','Mileage (highest first)'],
    ['oldest','First registration (oldest first)'],['newest','First registration (newest first)'],
    ['listing-oldest','Listing (oldest first)'],['listing-newest','Listing (newest first)']
  ];`+t.slice(end+5);t=t.replace('title="Sort by"','title="Sort By"');fs.writeFileSync(p,t);
patch('src/lib/search.ts',"    newest: (a, b) => b.year - a.year,","    newest: (a, b) => b.year - a.year,\n    oldest: (a, b) => a.year - b.year,\n    'mileage-desc': (a,b) => b.mileage-a.mileage,\n    'listing-oldest': (a,b) => vehicles.indexOf(a)-vehicles.indexOf(b),\n    'listing-newest': (a,b) => vehicles.indexOf(b)-vehicles.indexOf(a),");
patch('src/components/LoginScreen.tsx',"export function LoginScreen({ next = '/profile' }: { next?: string })", "export function LoginScreen({ next = '/profile', registerInitially = false }: { next?: string; registerInitially?: boolean })");
patch('src/components/LoginScreen.tsx','  const [register, setRegister] = useState(false);','  const [register, setRegister] = useState(registerInitially);');
patch('src/components/LoginScreen.tsx',"      ['/sell/create', '/sell/valuation', '/sell/direct', '/profile'].includes(next)","      next.startsWith('/') && !next.startsWith('//') && !next.includes('\\\\') && ['/sell/create', '/sell/valuation', '/sell/direct', '/profile', '/results', '/my-searches', '/car-park'].includes(next.split('?')[0])");
patch('src/app/login/page.tsx','Promise<{ next?: string }>','Promise<{ next?: string; register?: string }>');
patch('src/app/login/page.tsx','  const { next } = await searchParams;','  const { next, register } = await searchParams;');
patch('src/app/login/page.tsx','<LoginScreen next={next} />','<LoginScreen next={next} registerInitially={register === \'true\'} />');
console.log('Native save-search sign-in gate, return flow and nine sorting choices wired.');
