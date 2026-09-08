import { mount } from 'svelte';
import App from './App.svelte';
mount(App, { target: document.getElementById('app') });
// The reference widgets own generated DOM. A full refresh keeps editing deterministic.
if (import.meta.hot) import.meta.hot.on('vite:beforeUpdate', () => window.location.reload());
