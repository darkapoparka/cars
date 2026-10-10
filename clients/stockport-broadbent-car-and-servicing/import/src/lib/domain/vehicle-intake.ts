export function isVin(value: string): boolean {
	return /^[A-HJ-NPR-Z0-9]{17}$/i.test(value.trim());
}
export function isVehicleReference(value: string): boolean {
	if (isVin(value)) return true;
	try {
		const url = new URL(value.trim());
		return (
			['http:', 'https:'].includes(url.protocol) &&
			Boolean(url.hostname) &&
			!url.username &&
			!url.password
		);
	} catch {
		return false;
	}
}
