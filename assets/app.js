(() => {
  const search=document.querySelector('[data-search]');
  if(search){search.addEventListener('input',()=>{const val=search.value.trim().toLowerCase();let n=0;document.querySelectorAll('[data-filter]').forEach(e=>{const yes=e.dataset.filter.includes(val);e.hidden=!yes;if(yes)n++;});const empty=document.querySelector('[data-empty]');if(empty)empty.hidden=n!==0;});}
  const toggle=document.querySelector('[data-sidebar-toggle]');
  const sidebar=document.getElementById('sidebar');
  if(toggle&&sidebar){toggle.addEventListener('click',()=>{let open=sidebar.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'✕   Scriptmenu sluiten':'☰   Scriptmenu openen';});}
})();
