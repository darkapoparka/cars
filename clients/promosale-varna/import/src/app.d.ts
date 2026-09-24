declare global {
	namespace App {
		interface Locals {
			localeState: import('$lib/locale/core').LocaleState;
		}
		interface PageData {
			nativeSite?: boolean;
		}
		interface PageState {
			__bcMobileSheet?: string;
			__daynightHomeSearch?: string;
			__daynightInventoryOverlay?: string;
			__daynightWizard?: string;
			daynightInventoryProgress?: { cardSetKey: string; count: number };
			bcMobileSheet?: string;
			inventoryOverlay?: string;
		}
	}
}
export {};
