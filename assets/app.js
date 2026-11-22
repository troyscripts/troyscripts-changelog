(() => {
  const search=document.querySelector('[data-search]');
  if(search){search.addEventListener('input',()=>{const val=search.value.trim().toLowerCase();let n=0;document.querySelectorAll('[data-filter]').forEach(e=>{const yes=e.dataset.filter.includes(val);e.hidden=!yes;if(yes)n++;});const empty=document.querySelector('[data-empty]');if(empty)empty.hidden=n!==0;});}
  const toggle=document.querySelector('[data-sidebar-toggle]');
  const sidebar=document.getElementById('sidebar');
  if(toggle&&sidebar){toggle.addEventListener('click',()=>{let open=sidebar.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕   Scriptmenu sluiten':'☰   Scriptmenu openen';});}
  document.querySelectorAll('[data-copy-text]').forEach(button=>button.addEventListener('click',async()=>{const original=button.textContent;try{await navigator.clipboard.writeText(button.dataset.copyText);button.textContent='Gekopieerd!'}catch{button.textContent='Kopiëren mislukt'}setTimeout(()=>button.textContent=original,1600)}));
  const language=document.querySelector('[data-language]');
  if(language){language.addEventListener('change',()=>{
    const lang=language.value;
    const root=new URL(language.dataset.languageRoot||location.origin+'/',location.href);
    const relative=location.pathname.startsWith(root.pathname)?location.pathname.slice(root.pathname.length):'';
    const withoutLanguage=relative.startsWith('en/')?relative.slice(3):relative;
    const destination=new URL((lang==='en'?'en/':'')+withoutLanguage,root);
    destination.search=location.search;
    destination.hash=location.hash;
    location.assign(destination.href);
  });}
})();
