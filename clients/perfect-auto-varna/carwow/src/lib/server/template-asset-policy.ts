const unmanagedTemplateScripts = new Set(['/variant-3/assets/js/switcher.js', '/variant-3/assets/js/filterCar.js']);

const allowedScriptsByTemplateFile = new Map<string, Set<string>>();

export function filterTemplateScriptSrcs(templateFile: string, scriptSrcs: string[]) {
	const allowed = allowedScriptsByTemplateFile.get(templateFile);
	if (!allowed) {
		return [];
	}

	return scriptSrcs.filter((src) => allowed.has(src) && !unmanagedTemplateScripts.has(src));
}
