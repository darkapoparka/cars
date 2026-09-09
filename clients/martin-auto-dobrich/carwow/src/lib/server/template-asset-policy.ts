const unmanagedTemplateScripts = new Set(['/assets/js/switcher.js', '/assets/js/filterCar.js']);

const allowedScriptsByTemplateFile = new Map<string, Set<string>>();

export function filterTemplateScriptSrcs(templateFile: string, scriptSrcs: string[]) {
	const allowed = allowedScriptsByTemplateFile.get(templateFile);
	if (!allowed) {
		return [];
	}

	return scriptSrcs.filter((src) => allowed.has(src) && !unmanagedTemplateScripts.has(src));
}
