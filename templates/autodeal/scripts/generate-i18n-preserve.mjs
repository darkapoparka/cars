import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceCatalogPath = path.join(root, 'i18n', 'source-catalog.json');
const outputPath = path.join(root, 'i18n', 'preserve.json');

const names = new Set([
	'Albert Flores', 'Annette Black', 'Arlene McCoy', 'Bessie Cooper', 'Cameron Williamson', 'Cody Fisher',
	'Cooper, Kristin', 'Devon Lane', 'Dianne Russell', 'Flores, Juanita', 'Henry, Arthur', 'Jacob Jones',
	'Jane Cooper', 'Jerome Bell', 'John Doe', 'John Smith', 'Kathryn Murphy', 'Kristin Watson',
	'Leslie Alexander', 'Marvin McKinney', 'Nguyen, Shane', 'Ralph Edwards', 'Robert Fox', 'Ronald Richards',
	'Savannah Nguyen', 'Adam', 'Mike Fratantoni, MBA', 'Domagoj Dukec', 'Adrian van Hooydonk', 'AutoDecar',
	'AutoDeal', 'Themesflat', 'CEO Themesflat', 'Car Empire', 'Enterprise'
]);

const vehicleFacts = new Set([
	'A4', 'Almera', 'Audi', 'BMW', 'Bellett', 'C-Class', 'Camry', 'Carnival', 'Chevrolet', 'Creta', 'CVT',
	'DCT', 'Dongfeng', 'Ford', 'Foton', 'GLC-Class X235', 'Honda', 'Hyundai', 'Infinity', 'Isuzu', 'Jeep',
	'KIA', 'Kia', 'Land Rover', 'Land rover', 'Lexus', 'Mercedes Benz', 'Mercedes benz', 'Mondeo Sport',
	'Mitsubishi', 'Nissan', 'Toyota', 'Tesla', 'Volkswagen', 'XUV700', 'MUV', 'MVP', 'SUV', 'Station Wagon',
	'Station wagon', 'Convertible', 'Crossover', 'Hatchback', 'Minivan', 'Pickup Truck', 'Sedan', 'Coupe',
	'Range Rover', 'Defender', 'Discovery', 'Honda cars Pasig', 'London', 'New York', 'Paris', 'United States'
]);

const vehicleInventoryFacts = new Set([
	'2012 Nissan Leaf SV', '2017 BMV X1 xDrive 20d xline', '2018 Audi Q3 Premium',
	'2018 BMV X1 xDrive 20d xline', '2021 BMV X1 xDrive 20d xline', '2024 BMW Skytop Concept',
	'Hyundai Creta 2022', 'Hyundai Elantra 2022', 'Hyundai Ioniq 5', 'Hyundai Tucson 2022',
	'Mercedes Benz GLC-Class X235', 'Chevrolet Blazer EV 2024 new car',
	'Chevrolet Colorado', 'Chevrolet Cruze', 'Chevrolet Orlando', 'Chevrolet Spark', 'Chevrolet Trailblazer',
	'Hyundai Stargazer',
	'Volkswagen Scirocco, Honda Civic, Audi A3, Toyota Vios, Nissan GTR, Subaru Impreza',
	'1st owned, automatic transmission, Apple Carplay...', 'AB9084329457', 'Sedanx50'
]);

const vehicleSpecificationFacts = new Set([
	'1.2L', '4.9s', '110 Nm', '17,730 Kms', '22,737 Kms', '28,937 Kms', '289mi', '72,491 kms',
	'2 Cylinder', '3 Cylinder', '4 Cylinder', '2 Door', '3 Door', '4 Door', '6 Door', '8 Door',
	'2 Seat', '4 Seat', '5 Seats', '6 Seat', '8 Seat', '4WD – Four-wheel drive', '60:40 Split',
	'89HP', '99,701', '999 cc', '520Nm', 'AT (CTV) MT', 'A/C: Front', '1st Owner', '1st owner',
	'From 0-100mph', 'km', 'km -'
]);

const genericAltLabels = new Set([
	'admin', 'autodecar', 'avatar', 'avt', 'blog image', 'car brand image', 'file', 'hidden', 'icon', 'imag-blog',
	'image', 'image 1', 'image 2', 'image 3', 'images', 'img', 'Dealer image', 'Partner 1', 'Partner 2',
	'Partner 3', 'Partner 4', 'Partner 5', 'Partner 6'
]);

const latinPlaceholder = /^[\s"“‘]*(?:Lorem ipsum|Nulla |Nullam |Donec |Fusce |Proin |Sed |Maecenas |Ut |Mauris |Vestibulum |Phasellus |Aenean |Pellentesque |Nunc |Nam |Integer |Duis |Cras |Curabitur |Praesent |Quisque )/u;
const datePattern = /^(?:\d{1,2} [A-Z][a-z]+ \d{4}|[A-Z][a-z]+ \d{1,2}(?:, \d{4})?|\d{1,2}:[0-5]\d\s*(?:AM|PM|am|pm)\s*-\s*[A-Z][a-z]+ \d{1,2}, \d{4}|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[^\n]*\d{1,2}:\d{2}|(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) \d{4})$/u;
const addressPattern = /^(?:\d{2,5}\s+.+,\s+.+,\s+[A-Za-z ]{2,}\s+\d{4,6}|\d{2,5}\s+.+,\s+[A-Za-z ]{2,}\s+\d{4,6})$/u;
const hoursPattern = /^(?:\d{1,2}[^\n]*\b(?:AM|PM|Am|Pm|am|pm)\b|(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)[^\n]*\d{1,2}:\d{2})/u;
const contactPattern = /^(?:https?:\/\/|www\.|[^\s]+@[^\s]+|[+]?\d[\d ()*.-]{5,})/u;
const numericPattern = /^[\d\s$€£%,.()+\-/:*]+$/u;
const durationControlPattern = /^\d+\s+(?:monthly|months?)$/iu;
const specPattern = /^(?:\d[\d,.]*\s*(?:Kms?|kms|mi|cc|Nm|HP|star|Cylinder|Door|Seat|Seats|Monthly|months?|days?|hours?|years?|characters minimum|advertised listings|car sellers)|\d+WD\s+[–-].+|[A-Z0-9]+\s*[–-].+|[A-Z0-9]+(?:\.[A-Z0-9]+)?\s*(?:Split|Owner|owned).*)$/u;

function reasonFor(entry) {
	const source = entry.source;
	if (genericAltLabels.has(source)) return { category: 'asset-label', reason: 'Generic or technical image label; it is not user-facing editorial copy.' };
	if (latinPlaceholder.test(source)) return { category: 'placeholder-copy', reason: 'Licensed reference placeholder or lorem-style filler content, retained as supplied.' };
	if (source === 'Aa') return { category: 'placeholder-copy', reason: 'Typography sample placeholder retained as supplied.' };
	if (/^Sample Data \d+$/u.test(source)) return { category: 'placeholder-copy', reason: 'Generic sample-data label from the licensed reference content, retained as supplied.' };
	if (/^(?:n\/a|N\/A)$/u.test(source)) return { category: 'identifier-or-model', reason: 'Unavailable-value marker retained as supplied.' };
	if (/^["“”‘’'.,:;!?()[\]{}+*/=\-]+$/u.test(source)) return { category: 'punctuation', reason: 'Punctuation-only artifact retained without localization.' };
	if (names.has(source)) return { category: 'person-or-business-name', reason: 'Proper name or business identity from the licensed reference data.' };
	if (vehicleInventoryFacts.has(source)) return { category: 'vehicle-inventory-fact', reason: 'Vehicle listing, model, trim, VIN, or inventory fact retained as supplied.' };
	if (vehicleSpecificationFacts.has(source)) return { category: 'vehicle-specification', reason: 'Vehicle specification or performance value retained as supplied.' };
	if (vehicleFacts.has(source)) return { category: 'vehicle-brand-or-model', reason: 'Automotive brand, model, body type, or named location retained as factual reference data.' };
	if (addressPattern.test(source)) return { category: 'address', reason: 'Reference address retained as supplied factual contact/location data.' };
	if (contactPattern.test(source)) return { category: 'contact-data', reason: 'Telephone number, email address, URL, or other contact identifier retained as supplied.' };
	if (datePattern.test(source)) return { category: 'date-or-time-fact', reason: 'Reference date or opening-hour value; the runtime may localize its presentation without changing the fact.' };
	if (hoursPattern.test(source)) return { category: 'date-or-time-fact', reason: 'Reference opening-hour value retained as supplied; the runtime may localize its presentation without changing the fact.' };
	if (durationControlPattern.test(source)) return null;
	if (numericPattern.test(source) || specPattern.test(source)) return { category: 'numeric-or-specification', reason: 'Numeric value, price, rating, measurement, identifier, or vehicle specification retained as supplied.' };
	if (/^(?:[A-Z]{2,}|[A-Z]\d|[A-Za-z]+\d|\d+[A-Za-z])$/u.test(source) && source.length <= 24) return { category: 'identifier-or-model', reason: 'Short model, trim, drivetrain, or technical identifier retained as supplied.' };
	return null;
}

const sourceCatalog = JSON.parse(await readFile(sourceCatalogPath, 'utf8'));
const entries = {};
for (const entry of sourceCatalog.entries) {
	const reason = reasonFor(entry);
	if (reason) entries[entry.source] = reason;
}

const output = {
	version: 1,
	sourceLocale: 'en',
	entries
};
await writeFile(outputPath, `${JSON.stringify(output, null, '\t')}\n`, 'utf8');
console.log(`Allowlisted ${Object.keys(entries).length} explicit preserved source strings.`);
