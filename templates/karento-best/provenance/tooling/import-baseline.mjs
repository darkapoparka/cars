import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { load } from "cheerio";
import {composeSitePage,siteRoutes} from './baseline-composition.mjs';
const pages = JSON.parse(
  fs.readFileSync("karento/src/lib/server/pages.json", "utf8"),
);
const body = (k) =>
  fs.readFileSync("karento/src/lib/server/pages/" + k + ".html", "utf8");
const put = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};
const escape = (s) => s.replaceAll("{", "&#123;").replaceAll("}", "&#125;");
const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);
let imports = new Map(),
  states = [],
  counter = 0;
let collapseStates = new Map();
let locationIndex = 0;let componentPrefix="";let currentSource="";
let inCard = false;
const cardTemplates = new Map();
function vehicleCard(node) {
  const $ = load(node, undefined, false);
  if (!$(node).find('.card-title a[href="/vehicle"]').length) return null;
  const card = { sample: true };
  const fields = [
    ["image", ".card-image img", "src"],
    ["imageAlt", ".card-image img", "alt"],
    ["href", ".card-title a", "href"],
    ["title", ".card-title a"],
    ["location", ".card-location p"],
    ["mileage", ".card-miles"],
    ["transmission", ".card-gear"],
    ["fuel", ".card-fuel"],
    ["seats", ".card-seat"],
    ["price", ".card-price h6"],
    ["pricePeriod", ".card-price p"],
    ["action", ".card-button a"],
    ["reviews", ".rating span"],
  ];
  for (const [field, selector, attr] of fields) {
    const el = $(node).find(selector).first();
    card[field] = attr ? el.attr(attr) || "" : el.text();
    if (!el.length) continue;
    if (attr) el.attr(attr, "___card_" + field + "___");
    else
      el.empty().append({ type: "text", data: "", __binding: "card." + field });
  }
  const rating = $(node).find(".rating").first();
  const direct = rating
    .contents()
    .toArray()
    .find((n) => n.type === "text" && n.data.trim());
  card.rating = direct?.data || "";
  if (direct) direct.__binding = "card.rating";
  $(node).find(".card-image a,.card-button a").attr("href", "___card_href___");
  const savedImports = imports,
    savedStates = states,
    savedCounter = counter;
  imports = new Map();
  states = [];
  counter = 0;
  inCard = true;
  let markup = render(node).replace(/"___card_(\w+)___"/g, "{card.$1}");
  inCard = false;
  imports = savedImports;
  states = savedStates;
  counter = savedCounter;
  const hash = crypto
      .createHash("sha256")
      .update(markup)
      .digest("hex")
      .slice(0, 10),
    name = "VehicleCard" + hash;
  if (!cardTemplates.has(hash)) {
    cardTemplates.set(hash, name);
    put(
      "src/lib/cards/" + name + ".svelte",
      `<svelte:options preserveWhitespace={true} />\n<script lang="ts">import {dealer,type VehicleCardContent} from '#lib/content.ts';let {card:referenceCard}: {card:VehicleCardContent}=$props();const card=$derived(dealer.inventory[referenceCard.title]??referenceCard);</script>\n${markup}\n`,
    );
  }
  imports.set(name, "#lib/cards/" + name + ".svelte");
  return `<${name} card={${JSON.stringify(card)}} />`;
}
function render(node) {
  if (node.__binding) return `{${node.__binding}}`;
  if (
    node.type === "text" &&
    [
      "Discover your next car today.",
      "Our agents worldwide",
      "Our location",
      "Explore a range of leading car manufacturers.",
    ].includes(node.data.trim())
  ) {
    imports.set("dealer", "#lib/content.ts");
    const keys = {
      "Discover your next car today.": "home.hero",
      "Our agents worldwide": "contact.agents",
      "Our location": "contact.location",
      "Explore a range of leading car manufacturers.": "home.brandsIntro",
    };
    return (
      "{dealer.copy[" +
      JSON.stringify(keys[node.data.trim()]) +
      "] ?? " +
      JSON.stringify(node.data) +
      "}"
    );
  }
  if(node.type === "text" && node.data.includes("\u00a0"))return "{"+JSON.stringify(node.data)+"}";
  if (node.type === "text")
    return escape(node.data.replaceAll("&", "&amp;").replaceAll("<", "&lt;"));
  if (node.type === "comment") return "";
  if (!node.name) return "";
  const tag = node.name;
  const initialClass=node.attribs?.class||'';
  if(initialClass.split(' ').includes('block-filter')){
    const id='filterOpen'+counter++;states.push('let '+id+'=$state(true);');const visit=n=>{if(n.attribs?.class?.split(' ').includes('item-collapse')){const interactive={type:'tag',name:'span',attribs:{},children:n.children};n.children=[interactive];interactive.__extra=' role="button" tabindex="0" aria-expanded={'+id+'} onclick={()=>'+id+'=!'+id+'} onkeydown={(event)=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();'+id+'=!'+id+';}}}';n.__attributes={class:JSON.stringify(n.attribs.class)+'+('+id+'?"":" collapsed-item")'};}if(n.attribs?.class?.split(' ').includes('box-collapse'))n.__extra=' style:display={'+id+'?undefined:"none"}';(n.children||[]).forEach(visit);};(node.children||[]).forEach(visit);
  }
  if(node.attribs?.['data-type']==='monthly'||node.attribs?.['data-type']==='yearly'){if(!states.includes('let annualPrice=$state(false);'))states.push('let annualPrice=$state(false);');const yearly=node.attribs['data-type']==='yearly';node.__extra=' role="button" onclick={(event)=>{event.preventDefault();annualPrice='+yearly+';}} aria-pressed={annualPrice==='+yearly+'}';node.__attributes={...node.__attributes,class:JSON.stringify(initialClass.replace(/(?:^| )active(?= |$)/g,''))+'+(annualPrice==='+yearly+'?" active":"")'};}
  const tier=Object.keys({basic:1,standard:1,business:1,enterprise:1}).find(key=>initialClass.split(' ').includes('text-price-'+key));
  const period=initialClass.split(' ').some(c=>c.startsWith('text-type-'));
  if(tier||period){if(!states.includes('let annualPrice=$state(false);'))states.push('let annualPrice=$state(false);');const amounts={basic:['19','288'],standard:['29','348'],business:['49','588'],enterprise:['99','1.188']};node.children=[{type:'text',data:'',__binding:period?'annualPrice?"/ year":"/ month"':'annualPrice?'+JSON.stringify(amounts[tier][1])+':'+JSON.stringify(amounts[tier][0])}];}

  if (currentSource === "contact" && node.attribs?.class?.split(" ").includes("card-contact")) {
    const index = locationIndex++;
    const $ = load(node, undefined, false);
    for (const [selector, field, href] of [
      [".title", "name", null],
      [".location", "address", "mapUrl"],
      [".phone", "phone", "phoneHref"],
      [".email", "email", "emailHref"],
    ]) {
      const element = $(node).find(selector).first()[0];
      if (!element) continue;
      const fallback = $(element).text();
      element.children = [
        {
          type: "text",
          data: "",
          __binding:
            "dealer.locations[" +
            index +
            "]?." +
            field +
            " ?? " +
            JSON.stringify(fallback),
        },
      ];
      if (href)
        element.__attributes = {
          href:
            "dealer.locations[" +
            index +
            "]?." +
            href +
            " ?? " +
            JSON.stringify(element.attribs.href),
        };
    }
    imports.set("dealer", "#lib/content.ts");
  }
  if (tag === "a" && node.attribs?.href === "tel:+1 222-555-33-99") {
    node.__attributes = { href: '"tel:"+dealer.contacts.phone' };
    const text = (node.children || []).find(
      (n) => n.type === "text" && n.data.trim(),
    );
    if (text) text.__binding = "dealer.contacts.phone";
    imports.set("dealer", "#lib/content.ts");
  }

  if (tag === "script" || tag === "style") return "";
  if (
    !inCard &&
    node.attribs?.class?.split(" ").includes("card-journey-small")
  ) {
    const result = vehicleCard(node);
    if (result) return result;
  }
  const a = { ...node.attribs };
  let extra = "";
  const cls = a.class || "";
  if (a.href === "#" && tag === "a") a.href = "#!";
  if (tag === "img" && !("alt" in a)) a.alt = "";
  if (tag === "svg") {
    a["aria-hidden"] = "true";
    a.focusable = "false";
  }
  if (tag === "input" || tag === "select" || tag === "textarea") {
    if (!a["aria-label"] && !a["aria-labelledby"])
      a["aria-label"] = a.placeholder || a.name || a.id || "Preview field";
  }
  if (
    tag === "label" &&
    !a.for &&
    !(node.children || []).some((n) =>
      ["input", "select", "textarea"].includes(n.name),
    )
  ) {
    const field = (n) => {
      if (["input", "select", "textarea", "button"].includes(n.name)) return n;
      for (const child of n.children || []) {
        const found = field(child);
        if (found) return found;
      }
      return null;
    };
    const control = field(node.parent || node);
    if (control) {
      control.attribs.id ||= "field-" + componentPrefix + "-" + counter++;
      a.for = control.attribs.id;
    } else {
      node.name = "span";
      return render(node);
    }
  }
  if (tag === "iframe") {
    a.title = a.title || "Location map";
  }
  if (a.href?.startsWith("javascript:")) a.href = "#!";
  if (tag === "a" || tag === "button")
    a["aria-label"] =
      a["aria-label"] ||
      load("<div></div>")("div")
        .text(
          (node.children || [])
            .filter((n) => n.type === "text")
            .map((n) => n.data)
            .join(""),
        )
        .text()
        .trim() ||
      a.title ||
      "View details";
  if (tag === "img" && a.alt && !a.alt.startsWith("___card_"))
    a.alt = a.alt.replace(/image|picture|photo/gi, "").trim();
  if (
    tag === "h5" &&
    (node.children || []).some(
      (n) =>
        n.name === "button" && (n.children || []).some((c) => c.name === "h3"),
    )
  ) {
    node.name = "div";
    return render(node);
  }
  if (tag === "button" && !a.type) {
    let parent = node.parent;
    while (parent && parent.name !== "form") parent = parent.parent;
    a.type = parent && !a["data-bs-toggle"] ? "submit" : "button";
  }
  for (const k of Object.keys(a)) if (/^on/i.test(k)) delete a[k];
  if (cls.split(" ").includes("has-children")) {
    let parent = node.parent;
    let mobile = false;
    while (parent) {
      if (parent.attribs?.class?.split(" ").includes("mobile-menu"))
        mobile = true;
      parent = parent.parent;
    }
    if (mobile) {
      const id = "mobileExpanded" + counter++;
      states.push(`let ${id}=$state(false);`);
      const submenu = (node.children || []).find((n) => n.name === "ul");
      if (submenu) submenu.__extra = ` style:display={${id}?'block':'none'}`;
      const trigger = (node.children || []).find((n) => n.name === "a");
      if (trigger)
        trigger.__extra = ` aria-expanded={${id}} onclick={(event)=>{event.preventDefault();${id}=!${id};}}`;
    }
  }
  // Each control gets local Svelte state; no document-wide delegated runtime.
  if (cls.split(" ").includes("dropdown")) {
    const id = "expanded" + counter++;
    states.push(`let ${id} = $state(false);`);
    const button = (node.children || []).find(
      (n) => n.attribs?.["data-bs-toggle"] === "dropdown",
    );
    const selected = "selected" + counter++;
    const textNode = (button?.children || []).find(
      (n) => n.type === "text" && n.data.trim(),
    );
    if (textNode) {
      states.push(
        `let ${selected}=$state(${JSON.stringify(textNode.data.trim())});`,
      );
      textNode.__binding = selected;
    }
    extra += ` use:dropdownClose={{close:()=>${id}=false}}`;
    imports.set("dropdownClose", "#lib/interactions.ts");
    const walk = (n) => {
      if (!n.name) return;
      if (n.name === "a" && n.attribs?.class?.includes("dropdown-item")) {
        const label = (n.children || [])
          .filter((c) => c.type === "text")
          .map((c) => c.data)
          .join("")
          .trim();
        n.__extra = ` onclick={(event)=>{event.preventDefault();${id}=false;${textNode ? selected + "=" + JSON.stringify(label) + ";" : ""}}}`;
      }
      if (n.attribs?.["data-bs-toggle"] === "dropdown") {
        n.__extra = ` onclick={() => ${id} = !${id}} aria-expanded={${id}}`;
        delete n.attribs["aria-expanded"];
      }
      if (n.attribs?.class?.split(" ").includes("dropdown-menu")) {
        n.__class = `${n.attribs.class} `;
        n.__extra = ` class={${JSON.stringify(n.__class)} + (${id} ? 'show' : '')}`;
        delete n.attribs.class;
      }
      (n.children || []).forEach(walk);
    };
    (node.children || []).forEach(walk);
  }
  if (cls.split(" ").includes("btn-click")) {
    extra += " onclick={selectCategory}";
    imports.set("selectCategory", "#lib/interactions.ts");
  }
  if (a["data-bs-toggle"] === "collapse") {
    const target = a["data-bs-target"] || a.href;
    let root = node;
    while (root.parent) root = root.parent;
    const find = (n) =>
      n.attribs?.id === target?.slice(1)
        ? n
        : (n.children || []).map(find).find(Boolean);
    const body = find(root);
    if (body) {
      const id = "panelOpen" + counter++,
        group = body.attribs["data-bs-parent"] || target,
        initial = (body.attribs.class || "").split(" ").includes("show");
      if (!imports.has("usePreview")) {
        imports.set("usePreview", "#lib/preview.svelte.ts");
        states.push("const accordionPreview=usePreview();");
      }
      states.push(
        `const ${id}=$derived(accordionPreview.panels[${JSON.stringify(group)}]===undefined?${initial}:accordionPreview.panels[${JSON.stringify(group)}]===${JSON.stringify(target)});`,
      );
      collapseStates.set(target.slice(1), id);
      a.class = (a.class || "").replace(/(?:^| )collapsed(?= |$)/g, "");
      delete a["aria-expanded"];
      extra += ` class={${JSON.stringify(a.class)}+(${id}?'':' collapsed')} aria-expanded={${id}} onclick={() => accordionPreview.panels[${JSON.stringify(group)}]=${id}?null:${JSON.stringify(target)}}`;
      delete a.class;
    }
  }
  if (a.id && collapseStates.has(a.id)) {
    const id = collapseStates.get(a.id),
      base = (a.class || "").replace(/(?:^| )show(?= |$)/g, "");
    delete a.class;
    extra += ` class={${JSON.stringify(base)}+(${id}?' show':'')}`;
  }

  if (a["data-bs-toggle"] === "tab" || a["data-bs-toggle"] === "pill") {
    extra += " onclick={selectTab} onkeydown={tabKeydown}";
    imports.set("selectTab", "#lib/interactions.ts");
    imports.set("tabKeydown", "#lib/interactions.ts");
  }
  if (/(?:^| )swiper(?:-container)?(?: |$)/.test(cls)) {
    extra += " use:slider";
    imports.set("slider", "#lib/vendor.ts");
  }
  if (
    /(?:^| )(?:sidebar-canvas-container|mobile-header-wrapper-inner)(?: |$)/.test(
      cls,
    )
  ) {
    extra += " use:scrollbar";
    imports.set("scrollbar", "#lib/vendor.ts");
  }
  if (cls.split(" ").includes("image-gallery")) {
    extra += " onclick={openImage}";
    imports.set("openImage", "#lib/interactions.ts");
  }
  if (
    cls
      .split(" ")
      .some((c) => ["button-add-to-cart", "btn-wishlish"].includes(c))
  ) {
    extra += " onclick={demoAction}";
    imports.set("demoAction", "#lib/interactions.ts");
  }
  if (cls.split(" ").includes("detail-qty")) {
    extra += " use:quantity";
    imports.set("quantity", "#lib/interactions.ts");
  }
  if (
    cls.split(" ").some((c) => ["datepicker", "calendar-date"].includes(c)) ||
    a.id === "calendar-events"
  ) {
    extra += " use:calendar";
    imports.set("calendar", "#lib/vendor.ts");
  }
  if (a.id === "slider-range") {
    extra += " use:range";
    imports.set("range", "#lib/vendor.ts");
  }
  if (["chart", "chart-2", "chart-3"].includes(a.id)) {
    extra += " use:chart";
    imports.set("chart", "#lib/vendor.ts");
  }
  if (
    cls
      .split(" ")
      .some((c) => ["banner-main", "banner-activities-detail"].includes(c))
  ) {
    extra += " use:gallery";
    imports.set("gallery", "#lib/vendor.ts");
  }
  if (tag === "form") {
    extra += " onsubmit={demoSubmit}";
    imports.set("demoSubmit", "#lib/interactions.ts");
  }
  const bool = new Set([
    "checked",
    "selected",
    "disabled",
    "readonly",
    "required",
    "multiple",
    "hidden",
    "inert",
    "allowfullscreen",
  ]);
  const attrs = Object.entries(a)
    .map(([k, v]) =>
      node.__attributes?.[k]
        ? " " + k + "={" + node.__attributes[k] + "}"
        : " " +
          (k === "viewbox" ? "viewBox" : k) +
          (bool.has(k)
            ? ""
            : `="${escape(String(v).replaceAll("&", "&amp;").replaceAll('"', "&quot;"))}"`),
    )
    .join("");
  return `<${tag}${attrs}${extra}${node.__extra || ""}${voidTags.has(tag) ? " />" : ">" + (node.children || []).map(render).join("") + `</${tag}>`}`;
}
function component(nodes, header = false) {
  imports = new Map();
  states = [];
  counter = 0;
  collapseStates = new Map();
  locationIndex = 0;componentPrefix=crypto.createHash("sha256").update(nodes.map(n=>load(n,undefined,false).html()).join("|")).digest("hex").slice(0,8);
  let markup = nodes.map(render).join("");
  let pre = "";
  if (header) {
    pre = `import {usePreview} from '#lib/preview.svelte.ts';\nimport {drawerFocus} from '#lib/interactions.ts';\nimport {onMount} from 'svelte';import {page} from '$app/state';import {goto} from '$app/navigation';import {dealer} from '#lib/content.ts';\nconst preview=usePreview();\nlet sticky=$state(false);\nonMount(()=>{const scroll=()=>sticky=window.scrollY>=200;window.addEventListener('scroll',scroll,{passive:true});scroll();return ()=>window.removeEventListener('scroll',scroll);});\n`;
    markup = markup.replace(
      'class="header sticky-bar header-home-2 border-0"',
      'class={"header sticky-bar header-home-2 border-0"+(sticky?" stick":"")}',
    );
    markup = markup
      .replace(
        'class="burger-icon-2 karento-menu-toggle"',
        'class={"burger-icon-2 karento-menu-toggle"+(preview.drawer?" burger-2-close":"")} onclick={() => preview.drawer = !preview.drawer}',
      )
      .replace('aria-expanded="false"', "aria-expanded={preview.drawer}");
    markup = markup.replace(
      'class="burger-icon burger-icon-white"',
      'role="button" tabindex="0" aria-label="Open mobile navigation" onkeydown={(event) => {if(event.key === "Enter" || event.key === " ") preview.mobile = !preview.mobile;}} onclick={() => preview.mobile = !preview.mobile} class={"burger-icon burger-icon-white"+(preview.mobile?" burger-close":"")}',
    );
    markup = markup.replace(
      'class="mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2"',
      'class={"mobile-header-active mobile-header-wrapper-style perfect-scrollbar button-bg-2"+(preview.mobile?" sidebar-visible":"")}',
    );
    markup = markup.replace(
      'class="sidebar-canvas-wrapper perfect-scrollbar button-bg-2 karento-account-drawer"',
      'use:drawerFocus={preview.drawer} class={"sidebar-canvas-wrapper perfect-scrollbar button-bg-2 karento-account-drawer"+(preview.drawer?" sidebar-canvas-visible":"")}',
    );
    markup = markup.replace(
      'aria-hidden="true" inert',
      "aria-hidden={!preview.drawer} inert={!preview.drawer}",
    );
    markup = markup.replace(
      'class="close-canvas"',
      'class="close-canvas" onclick={() => preview.drawer = false}',
    );
    markup = markup.replace(
      'class="mobile-menu-close"',
      'class="mobile-menu-close" role="button" tabindex="0" aria-label="Close mobile navigation" onclick={() => preview.mobile = false} onkeydown={(event) => {if(event.key === "Enter") preview.mobile = false;}}',
    );
    markup = markup.replace(
      /href="\/login"( data-demo-account-link(?:="[^"]*")?)/g,
      "href={preview.accountHref}$1",
    );
    markup = markup.replace(
      "Your account</p>",
      '{preview.role === "guest" ? "Your account" : preview.role === "owner" ? "Dealership owner" : "Member account"}</p>',
    );
    markup = markup.replace(
      'data-demo-drawer-account="" aria-label="Sign in">Sign in',
      'data-demo-drawer-account="" aria-label={preview.role === "guest" ? "Sign in" : "View account"}>{preview.role === "guest" ? "Sign in" : "View account"}',
    );
    markup = markup.replace(
      'data-demo-register-link=""',
      'data-demo-register-link="" hidden={preview.role !== "guest"}',
    );
    markup = markup.replace(
      'href="/account/settings" data-demo-settings-link="" hidden',
      'href={preview.role === "owner" ? "/dashboard/settings" : "/account/settings"} data-demo-settings-link="" hidden={preview.role === "guest"}',
    );
    markup = markup.replace(
      'class="karento-demo-signout" type="button" hidden',
      'class="karento-demo-signout" type="button" hidden={preview.role === "guest"} onclick={() => {preview.setRole("guest");preview.drawer=false;void goto("/login");}}',
    );
    markup = markup.replace(
      'class="burger-icon burger-icon-white"></div>',
      'class="burger-icon burger-icon-white" role="button" tabindex="0" aria-label="Close mobile navigation" onclick={() => preview.mobile=false} onkeydown={(event)=>{if(event.key==="Enter"||event.key===" ")preview.mobile=false;}}></div>',
    );
    markup = markup.replace(
      'class={"mobile-header-active',
      'use:drawerFocus={preview.mobile} inert={!preview.mobile} aria-hidden={!preview.mobile} class={"mobile-header-active',
    );
    markup = markup
      .replaceAll(
        'src="/assets/imgs/template/logo-d.svg"',
        "src={dealer.logo.light}",
      )
      .replaceAll(
        'src="/assets/imgs/template/logo-w.svg"',
        "src={dealer.logo.archivedDark}",
      )
      .replaceAll('alt="Carento"', "alt={dealer.logo.alt}");
    markup = markup.replace(
      /(<a\b[^>]*\shref="([^"]*)")/g,
      (match, start, href) =>
        href.startsWith("/")
          ? start +
            " aria-current={page.url.pathname===" +
            JSON.stringify(href) +
            '?"page":undefined}'
          : match,
    );
    markup += `{#if preview.drawer || preview.mobile}<div class="body-overlay-1" role="button" tabindex="0" onkeydown={(event)=>{if(event.key==='Enter') {preview.drawer=false;preview.mobile=false;}}} aria-label="Close menu overlay" onclick={() => {preview.drawer=false;preview.mobile=false;}}></div>{/if}\n<svelte:window onkeydown={(event) => {if(event.key === 'Escape') {preview.drawer=false;preview.mobile=false;}}} />`;
  }
  if (header) imports.delete("dealer");
  return `<svelte:options preserveWhitespace={true} />\n<script lang="ts">\n${pre}${[...imports].map(([name, p]) => (name.startsWith("VehicleCard") ? `import ${name} from '${p}';` : `import { ${name} } from '${p}';`)).join("\n")}\n${states.join("\n")}\n</script>\n${markup}\n`;
}
const sections = new Map();
const sectionFiles = [];
const routeData = {};
let headerWritten = false;
for (const key of Object.keys(pages)) {currentSource=key;
  const p = composeSitePage(
    key,
    pages[key],
    body(key),
    body("index-2"),
    body("index-3"),
    body("index"),
  );
  const $ = load(p.body, undefined, false);
  if (!headerWritten) {
    put(
      "src/lib/components/Header.svelte",
      component(
        $(
          "header.header, .mobile-header-active, .sidebar-canvas-wrapper",
        ).toArray(),
        true,
      ),
    );
    headerWritten = true;
  }
  const main = $("main").first();
  const children = main.contents().toArray();
  const names = [];
  for (const n of children) {
    if (n.type === "comment" || (n.type === "text" && !n.data.trim())) continue;
    const html = $.html(n);
    const hash = crypto
      .createHash("sha256")
      .update(html)
      .digest("hex")
      .slice(0, 12);
    const stem = (
      n.name === "footer"
        ? "Footer"
        : (n.attribs?.class || n.name || "Content")
            .split(" ")
            .filter(
              (c) =>
                ![
                  "section-box",
                  "background-body",
                  "background-100",
                  "py-96",
                ].includes(c),
            )
            .slice(0, 2)
            .join("-")
    )
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean)
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join("");
    const name =
      n.name === "footer" ? "Footer" : (stem || "Section") + hash.slice(0, 8);
    names.push(name);
    if (!sections.has(hash)) {
      sections.set(hash, html);
      put(
        name === "Footer"
          ? "src/lib/components/Footer.svelte"
          : `src/lib/sections/${name}.svelte`,
        component([n]),
      );
      sectionFiles.push(name);
    }
  }
  const script = names
    .map(
      (n) =>
        `import ${n} from '#lib/${n === "Footer" ? "components" : "sections"}/${n}.svelte';`,
    )
    .join("\n");
  put(
    `src/lib/pages/${key}.svelte`,
    `<script lang="ts">\n${script}\nimport {dealer} from '#lib/content.ts';\n</script>\n<svelte:head><title>{dealer.name==='Karento'?${JSON.stringify(p.title)}:${JSON.stringify(p.title.split(" | ")[0])}+' | '+dealer.name}</title></svelte:head>\n<main class="${main.attr("class") || ""}">${names.map((n) => `<${n} />`).join("\n")}</main>\n`,
  );
  routeData[key] = { title: p.title, sections: names };
}
put(
  "src/lib/routes.ts",
  `export const canonicalRoutes = ${JSON.stringify(siteRoutes, null, 2)} as const;\nexport const sourceKeys = ${JSON.stringify(Object.keys(pages))} as const;\nexport type SourceKey = typeof sourceKeys[number];\nexport function resolveRoute(path: string): SourceKey | null {\n const key=path.replace(/^\\//,'').replace(/\\/$/,'').replace(/\\.html$/,'');\n if(Object.hasOwn(canonicalRoutes,key)) return canonicalRoutes[key as keyof typeof canonicalRoutes];\n return (sourceKeys as readonly string[]).includes(key) ? key as SourceKey : null;\n}\n`,
);
put(
  "src/routes/+error.svelte",
  `<script lang="ts">import NotFound from '#lib/pages/404.svelte';</script>\n<NotFound />\n`,
);
put(
  "provenance/conversion.json",
  JSON.stringify(
    {
      canonical: 30,
      aliases: Object.keys(pages).length,
      sections: sections.size,
      pages: routeData,
    },
    null,
    2,
  ),
);
for (const file of fs.readdirSync("src/lib/cards"))
  if (![...cardTemplates.values()].includes(file.replace(".svelte", "")))
    fs.unlinkSync("src/lib/cards/" + file);
for (const file of fs.readdirSync("src/lib/sections"))
  if (!sectionFiles.includes(file.replace(".svelte", "")))
    fs.unlinkSync("src/lib/sections/" + file);
console.log(
  `Compiled ${Object.keys(pages).length} compositions into ${sections.size} deduplicated sections.`,
);
