<script lang="ts">
  import { onMount } from 'svelte';
  import { initialize } from './interactions';
  import './local.css';
  const path = window.location.pathname.replace(/^\/boxcar(?=\/|$)/, '').replace(/\/?$/, '/') || '/';
  let { page }: { page?: { title: string; bodyClass: string; html: string; styles: ({href:string;media:string}|{text:string})[] } } = $props();
  let notice = $state('');
  let modal = $state<{title:string;html:string} | null>(null);
  let dialog: HTMLDialogElement;
  let root: HTMLDivElement;
  let timeout: ReturnType<typeof setTimeout>;
  function notify(text: string) { notice = text; clearTimeout(timeout); timeout = setTimeout(()=>notice='',6500); }
  function showModal(title: string, html: string) { modal = {title,html}; dialog.showModal(); }
  function closeModal(){dialog.close();modal=null;}
  function submitModal(event: SubmitEvent){event.preventDefault();notify('This form is ready for a backend connection. No message was sent.');closeModal();}
  onMount(() => {
    document.body.className = page?.bodyClass || 'apus-body';
    const cleanup = initialize(root, { notify, showModal }, path);
    return () => { cleanup.then(fn=>fn()); clearTimeout(timeout); };
  });
</script>

<svelte:head>
  <title>{page?.title || 'Page not found – Boxcar'}</title>
  {#each page?.styles || [] as style, i (i)}
    {#if 'href' in style}<link rel="stylesheet" href={style.href} media={style.media}/>
    {:else if 'text' in style}{@html `<style>${style.text}</style>`}{/if}
  {/each}
</svelte:head>

<div bind:this={root}>
  {#if page}{@html page.html || ''}{:else}<main class="local-not-found"><h1>Page not found</h1><p>This page is outside the imported demo.</p><a class="btn btn-theme" href="/">Back to Boxcar</a></main>{/if}
</div>
{#if notice}<div class="local-toast" role="status">{notice}<button aria-label="Dismiss notification" onclick={()=>notice=''}>×</button></div>{/if}
<dialog bind:this={dialog} class="local-dialog" oncancel={()=>modal=null}>
  <button class="local-dialog-close" onclick={closeModal} aria-label="Close dialog">×</button>
  {#if modal}<h2>{modal.title}</h2><div onsubmit={submitModal}>{@html modal.html}</div>{/if}
</dialog>
