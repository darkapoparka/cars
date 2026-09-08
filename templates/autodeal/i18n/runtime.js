(() => {
	'use strict';

	const FALLBACK_LOCALES = ['en', 'bg', 'de', 'el', 'ro', 'sr', 'ru', 'uk', 'tr'];
	const FALLBACK_NAMES = {
		en: 'English', bg: 'Български', de: 'Deutsch', el: 'Ελληνικά', ro: 'Română',
		sr: 'Српски', ru: 'Русский', uk: 'Українська', tr: 'Türkçe'
	};
	const SKIPPED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'CODE', 'PRE', 'TEXTAREA', 'TEMPLATE']);
	const ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt', 'value', 'content'];
	const COMPACT_SELECTOR = 'button, input, select, option, summary, label, [role="button"], [role="tab"], [class*="btn"], [class*="button"], .view-car, .tf-icon-box .content h3 a, .box-car-list .content .icon-box, [class*="filter"], [class*="tab"], [class*="badge"], [class*="tag"]';

	function readCatalog() {
		const element = document.getElementById('autodeal-i18n-catalog');
		const fallback = {
			version: 1,
			locale: FALLBACK_LOCALES.includes(location.pathname.split('/').filter(Boolean)[0]) ? location.pathname.split('/').filter(Boolean)[0] : 'bg',
			sourceLocale: 'en',
			messages: {},
			compact: {},
			preserved: {},
			locales: FALLBACK_LOCALES,
			localeNames: FALLBACK_NAMES,
			defaultLocale: 'bg'
		};
		if (!element) return fallback;
		try {
			const parsed = JSON.parse(element.textContent || '{}');
			if (!parsed || typeof parsed !== 'object' || !parsed.messages || typeof parsed.messages !== 'object') return fallback;
			return {
				...fallback,
				...parsed,
				locales: Array.isArray(parsed.locales) && parsed.locales.length ? parsed.locales : fallback.locales,
				localeNames: { ...fallback.localeNames, ...(parsed.localeNames || {}) },
				messages: parsed.messages,
				compact: parsed.compact && typeof parsed.compact === 'object' ? parsed.compact : {},
				preserved: parsed.preserved && typeof parsed.preserved === 'object' ? parsed.preserved : {}
			};
		} catch {
			return fallback;
		}
	}

	const catalog = readCatalog();
	const locales = catalog.locales;
	const locale = locales.includes(catalog.locale) ? catalog.locale : catalog.defaultLocale;
	const messages = catalog.messages;
	const compactMessages = catalog.compact;
	const missing = new Set();
	const sourceText = new WeakMap();
	const sourceAttributes = new WeakMap();
	const appliedText = new WeakMap();
	const appliedAttributes = new WeakMap();
	let applying = false;

	document.documentElement.lang = locale;
	document.documentElement.dir = 'ltr';

	function exposeState() {
		window.__autodealI18n = {
			locale,
			locales: [...locales],
			catalog,
			missing: [...missing]
		};
	}

	function noteMissing(source) {
		if (!source || locale === 'en' || messages[source] || catalog.preserved[source]) return;
		missing.add(source);
		exposeState();
	}

	function isSkipped(element) {
		return !(element instanceof Element) || SKIPPED_TAGS.has(element.tagName) || element.closest('[data-autodeal-i18n-owned="true"]');
	}

	function isCompact(element) {
		return element instanceof Element && Boolean(element.closest(COMPACT_SELECTOR));
	}

	function translateDynamic(source) {
		let match = source.match(/^Home Page (\d{2})$/u);
		if (match && messages['Home Page']) return `${messages['Home Page']} ${match[1]}`;
		match = source.match(/^Listing (grid|list|map|detail)(?: V([1-5]))?$/u);
		if (match) {
			const key = `Listing ${match[1]}`;
			if (messages[key]) return `${messages[key]}${match[2] ? ` V${match[2]}` : ''}`;
		}
		match = source.match(/^([\d,.]+) Car$/u);
		if (match && messages.Car) return `${new Intl.NumberFormat(locale).format(Number(match[1].replaceAll(',', '')))} ${messages.Car}`;
		match = source.match(/^([\d,.]+) kms$/u);
		if (match && messages.kms) return `${new Intl.NumberFormat(locale).format(Number(match[1].replaceAll(',', '')))} ${messages.kms}`;
		match = source.match(/^© (\d{4}) (.+)\. All rights reserved$/u);
		if (match && messages['All rights reserved']) return `© ${match[1]} ${match[2]}. ${messages['All rights reserved']}`;
		return source;
	}

	function translated(source, element) {
		if (Object.prototype.hasOwnProperty.call(messages, source)) {
			if (isCompact(element) && Object.prototype.hasOwnProperty.call(compactMessages, source)) return compactMessages[source];
			return messages[source];
		}
		const dynamic = translateDynamic(source);
		if (dynamic !== source) return dynamic;
		noteMissing(source);
		return source;
	}

	function getTextSource(node, current) {
		const record = sourceText.get(node);
		if (!record) return current;
		if (current === record.rendered || current === appliedText.get(node)) return record.source;
		return current;
	}

	function translateTextNode(node) {
		if (!node.parentElement || isSkipped(node.parentElement)) return;
		const current = node.nodeValue || '';
		const source = getTextSource(node, current);
		const trimmed = source.trim();
		if (!trimmed) return;
		const target = translated(trimmed, node.parentElement);
		const leading = source.match(/^\s*/u)?.[0] || '';
		const trailing = source.match(/\s*$/u)?.[0] || '';
		const rendered = `${leading}${target}${trailing}`;
		sourceText.set(node, { source, rendered });
		appliedText.set(node, rendered);
		if (current !== rendered) node.nodeValue = rendered;
	}

	function attributeSource(element, attribute, current) {
		const records = sourceAttributes.get(element);
		const record = records?.[attribute];
		if (!record) return current;
		if (current === record.rendered || current === appliedAttributes.get(element)?.[attribute]) return record.source;
		return current;
	}

	function translateElement(element) {
		if (isSkipped(element)) return;
		let records = sourceAttributes.get(element);
		if (!records) {
			records = {};
			sourceAttributes.set(element, records);
		}
		let renderedAttributes = appliedAttributes.get(element);
		if (!renderedAttributes) {
			renderedAttributes = {};
			appliedAttributes.set(element, renderedAttributes);
		}
		for (const attribute of ATTRIBUTES) {
			if (!element.hasAttribute(attribute)) continue;
			if (attribute === 'content' && element.tagName !== 'META') continue;
			const current = element.getAttribute(attribute) || '';
			const source = attributeSource(element, attribute, current);
			const target = translated(source, element);
			records[attribute] = { source, rendered: target };
			renderedAttributes[attribute] = target;
			if (current !== target) element.setAttribute(attribute, target);
		}
		for (const child of element.childNodes) {
			if (child.nodeType === Node.TEXT_NODE) translateTextNode(child);
			else if (child.nodeType === Node.ELEMENT_NODE) translateElement(child);
		}
	}

	function stripLocale(pathname) {
		const segments = pathname.split('/').filter(Boolean);
		if (locales.includes(segments[0]?.toLowerCase())) segments.shift();
		return segments.length ? `/${segments.join('/')}` : '/';
	}

	function localizedPath(pathname, targetLocale) {
		const route = stripLocale(pathname);
		return `/${targetLocale}${route === '/' ? '' : route}`;
	}

	function rewriteLink(anchor) {
		if (anchor.closest('[data-autodeal-i18n-owned="true"]')) return;
		const rawHref = anchor.getAttribute('href');
		if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) return;
		let url;
		try { url = new URL(rawHref, location.origin); } catch { return; }
		if (url.origin !== location.origin || url.pathname.startsWith('/_next/') || url.pathname.startsWith('/assets/') || url.pathname.startsWith('/i18n/')) return;
		url.pathname = localizedPath(url.pathname, locale);
		anchor.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
		anchor.dataset.localeNavigation = 'true';
	}

	function rewriteLinks(root = document) {
		if (root instanceof HTMLAnchorElement) rewriteLink(root);
		root.querySelectorAll?.('a[href]').forEach(rewriteLink);
	}

	function buildPicker(mobile = false) {
		const details = document.createElement('details');
		details.className = 'autodeal-locale-picker';
		details.dataset.mobile = String(mobile);
		details.dataset.autodealI18nOwned = 'true';
		const summary = document.createElement('summary');
		summary.setAttribute('aria-label', messages.Language || 'Language');
		summary.title = catalog.localeNames[locale] || locale;
		summary.textContent = locale.toUpperCase();
		details.append(summary);
		const list = document.createElement('ul');
		list.className = 'autodeal-locale-picker__menu';
		for (const code of locales) {
			const item = document.createElement('li');
			const link = document.createElement('a');
			link.href = `${localizedPath(location.pathname, code)}${location.search}${location.hash}`;
			link.lang = code;
			if (code === locale) link.setAttribute('aria-current', 'page');
			const name = document.createElement('span');
			name.textContent = catalog.localeNames[code] || code;
			const codeLabel = document.createElement('span');
			codeLabel.className = 'autodeal-locale-picker__code';
			codeLabel.textContent = code.toUpperCase();
			link.append(name, codeLabel);
			item.append(link);
			list.append(item);
		}
		details.append(list);
		return details;
	}

	function mountPickers() {
		const account = document.querySelector('.main-header .header-account');
		if (account && !account.querySelector(':scope > .autodeal-locale-picker')) account.prepend(buildPicker(false));
		const mobileTarget = document.querySelector('.mobile-menu .bottom-canvas');
		if (mobileTarget && !mobileTarget.querySelector(':scope > .autodeal-locale-picker')) mobileTarget.prepend(buildPicker(true));
	}

	function apply(root = document.body) {
		if (applying || !root) return;
		applying = true;
		try {
			translateElement(root);
			rewriteLinks(root);
			mountPickers();
		} finally {
			applying = false;
		}
	}

	document.addEventListener('click', (event) => {
		const anchor = event.target.closest?.('a[data-locale-navigation="true"]');
		if (!anchor || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || anchor.target === '_blank') return;
		event.preventDefault();
		location.assign(anchor.href);
	}, true);

	const observer = new MutationObserver((mutations) => {
		if (applying) return;
		for (const mutation of mutations) {
			if (mutation.type === 'characterData') translateTextNode(mutation.target);
			if (mutation.type === 'attributes' && mutation.target instanceof Element) translateElement(mutation.target);
			for (const node of mutation.addedNodes) {
				if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
				else if (node.nodeType === Node.ELEMENT_NODE) apply(node);
			}
		}
		if (document.documentElement.lang !== locale) document.documentElement.lang = locale;
		mountPickers();
	});

	function start() {
		exposeState();
		apply(document.head);
		apply(document.body);
		observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true });
	}

	function scheduleStart() {
		window.setTimeout(start, 250);
	}

	// The licensed mirror hydrates from async Next chunks. Waiting for `load` keeps
	// the overlay out of React's hydration window while retaining dynamic updates.
	if (document.readyState === 'complete') scheduleStart();
	else window.addEventListener('load', scheduleStart, { once: true });
})();
