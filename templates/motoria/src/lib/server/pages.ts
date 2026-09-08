export interface ReferencePage {
 name: string;
 route: string;
 source: string;
 title: string;
 head: string;
 body: string;
 bodyAttributes: string;
}

const files = import.meta.glob<ReferencePage>('../snapshots/*.json', {
 eager: true,
 import: 'default'
});

export const pages = new Map(Object.values(files).map(page => [page.route, page]));

export function getPage(path: string): ReferencePage | undefined {
 const normalized = path.replace(/^\/elementor-classified-(one|four)/, '') || '/';
 return pages.get(normalized.endsWith('/') ? normalized : `${normalized}/`);
}
