import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type {
	DayNightCmsDocument,
	DayNightInventoryListingRecord,
	DayNightVehicleSubmissionRecord
} from '$lib/types/account';

type CmsCollectionName = 'inventory-listings' | 'vehicle-submissions';

type CmsCollections = {
	'inventory-listings': DayNightInventoryListingRecord[];
	'vehicle-submissions': DayNightVehicleSubmissionRecord[];
};

export type CmsUploadKind = 'documents' | 'gallery' | 'preview';

export type CmsUploadResult = {
	documents: DayNightCmsDocument[];
	galleryImages: string[];
	previewImage?: string;
};

const uploadsRoot = path.join(process.cwd(), 'static', 'uploads', 'cms');

const dataRoot = () => {
	if (process.env.DAYNIGHT_CMS_DATA_DIR) return process.env.DAYNIGHT_CMS_DATA_DIR;
	if (process.env.VITEST) {
		return path.join(process.cwd(), '.tmp', 'daynight-cms-vitest', String(process.pid));
	}

	return path.join(process.cwd(), '.daynight-cms');
};

const collectionPath = (collection: CmsCollectionName) =>
	path.join(dataRoot(), `${collection}.json`);

const ensureDirectory = (directory: string) => {
	mkdirSync(directory, { recursive: true });
};

const readJson = <Collection extends CmsCollectionName>(
	collection: Collection
): CmsCollections[Collection] => {
	const filePath = collectionPath(collection);

	if (!existsSync(filePath)) return [] as CmsCollections[Collection];

	try {
		const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as unknown;

		return Array.isArray(parsed) ? (parsed as CmsCollections[Collection]) : [];
	} catch {
		return [] as CmsCollections[Collection];
	}
};

const writeJson = <Collection extends CmsCollectionName>(
	collection: Collection,
	records: CmsCollections[Collection]
) => {
	const filePath = collectionPath(collection);
	const directory = path.dirname(filePath);
	const tempPath = `${filePath}.${process.pid}.tmp`;

	ensureDirectory(directory);
	writeFileSync(tempPath, `${JSON.stringify(records, null, 2)}\n`);
	renameSync(tempPath, filePath);
};

const clone = <Value>(value: Value): Value => JSON.parse(JSON.stringify(value)) as Value;

export const readCmsCollection = <Collection extends CmsCollectionName>(collection: Collection) =>
	clone(readJson(collection));

export const writeCmsCollection = <Collection extends CmsCollectionName>(
	collection: Collection,
	records: CmsCollections[Collection]
) => writeJson(collection, clone(records));

export const resetCmsPersistenceForTests = () => {
	if (!process.env.VITEST && process.env.NODE_ENV !== 'test') return;

	writeJson('inventory-listings', []);
	writeJson('vehicle-submissions', []);
};

const safeSegment = (value: string) =>
	value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 80) || 'upload';

const extensionFromName = (name: string) => {
	const extension = path
		.extname(name)
		.toLowerCase()
		.replace(/[^a-z0-9.]/g, '');

	return extension || '';
};

const imageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const documentMimeTypes = new Set([
	'application/msword',
	'application/pdf',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);
const documentExtensions = new Set(['.doc', '.docx', '.pdf']);

const isValidUpload = (file: File, kind: CmsUploadKind) => {
	const extension = extensionFromName(file.name);

	if (kind === 'documents') {
		return documentExtensions.has(extension) || documentMimeTypes.has(file.type);
	}

	return imageExtensions.has(extension) || imageMimeTypes.has(file.type);
};

const maxUploadSize = (kind: CmsUploadKind) => (kind === 'documents' ? 10 : 8) * 1024 * 1024;

const uploadPublicPath = (segments: string[]) => `/uploads/cms/${segments.join('/')}`;

const fileList = (formData: FormData, name: string) =>
	formData
		.getAll(name)
		.filter(
			(value): value is File => value instanceof File && value.size > 0 && Boolean(value.name)
		);

export const saveCmsUploadFiles = async ({
	formData,
	recordId
}: {
	formData: FormData;
	recordId: string;
}): Promise<CmsUploadResult> => {
	const now = new Date().toISOString();
	const result: CmsUploadResult = {
		documents: [],
		galleryImages: []
	};
	const groups: Array<{ files: File[]; kind: CmsUploadKind }> = [
		{ files: fileList(formData, 'previewImage').slice(0, 1), kind: 'preview' },
		{ files: fileList(formData, 'galleryImages').slice(0, 12), kind: 'gallery' },
		{ files: fileList(formData, 'documents').slice(0, 8), kind: 'documents' }
	];

	for (const { files, kind } of groups) {
		if (!files.length) continue;

		const safeRecordId = safeSegment(recordId);
		const targetDirectory = path.join(uploadsRoot, safeRecordId, kind);
		ensureDirectory(targetDirectory);

		for (const [index, file] of files.entries()) {
			if (file.size > maxUploadSize(kind)) {
				throw new Error(`${file.name} is larger than the allowed upload size.`);
			}
			if (!isValidUpload(file, kind)) {
				throw new Error(`${file.name} is not an allowed ${kind} file.`);
			}

			const extension = extensionFromName(file.name);
			const base = safeSegment(path.basename(file.name, path.extname(file.name)));
			const filename = `${Date.now().toString(36)}-${index + 1}-${base}${extension}`;
			const targetPath = path.join(targetDirectory, filename);
			const publicPath = uploadPublicPath([safeRecordId, kind, filename]);

			writeFileSync(targetPath, Buffer.from(await file.arrayBuffer()));

			if (kind === 'preview') {
				result.previewImage = publicPath;
			} else if (kind === 'gallery') {
				result.galleryImages.push(publicPath);
			} else {
				result.documents.push({
					filename,
					id: `${safeRecordId}-${kind}-${Date.now().toString(36)}-${index + 1}`,
					mimeType: file.type || 'application/octet-stream',
					originalName: file.name,
					size: file.size,
					uploadedAt: now,
					url: publicPath
				});
			}
		}
	}

	return result;
};
