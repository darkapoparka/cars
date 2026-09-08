import { mount } from 'svelte';
import App from './App.svelte';
import manifest from './generated/manifest.json';
const path = window.location.pathname.replace(/^\/boxcar(?=\/|$)/, '').replace(/\/?$/, '/') || '/';
const aliases: Record<string, string> = { '/terms/':'/terms-and-conditions/', '/listing/':'/listings/' };
const url = (manifest as Record<string,string>)[aliases[path] || path];
const page = url ? await fetch(url).then(r => r.json()) : undefined;
mount(App, { target: document.getElementById('app')!, props: {page} });
