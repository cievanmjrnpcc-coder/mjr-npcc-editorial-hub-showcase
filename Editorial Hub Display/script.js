'use strict';
// Only publicly approved, redacted image filenames belong in this collection.
const screenshots = [
 ['01-dashboard.png','Editorial Dashboard','Daily operations','A central overview of announcements, upcoming activities and member development.'],
 ['02-calendar.png','Calendar','Daily operations','A scheduling interface for team activities, deadlines and training sessions.'],
 ['03-polling.png','Polling','Daily operations','A dedicated workspace for collecting responses and documenting team decisions.'],
 ['04-editorial-vault.png','Editorial Vault','Resources & development','A searchable library of editorial resources. Internal document records are withheld.'],
 ['05-formats.png','Formats','Resources & development','A template library and message composition workspace for consistent communication.'],
 ['06-training.png','Training Hub','Resources & development','A structured learning pathway with modules, prerequisites and progress tracking.'],
 ['07-mentorship.png','Mentorship','Resources & development','A workspace for coordinating mentorship and monitoring development. Personal records are withheld.'],
 ['08-editorial-ai.png','Editorial AI','Resources & development','An integrated assistant for learning and writing. This preview shows the onboarding interface, not a functioning chatbot.'],
 ['09-workspace-selector.png','Workspace selector','Specialist workspaces','A common navigation entry point for the platform’s distinct workspaces.'],
 ['10-hierarchy-editor.png','Hierarchy Editor','Specialist workspaces','A Data Centre interface for organisational records. The actual hierarchy is withheld.'],
 ['11-database-progress-report.png','Database Progress Report','Specialist workspaces','A structured reporting interface with a document preview. Internal metrics are withheld.'],
 ['12-admin-users.png','User administration','Administration','An account management interface. Personal records and identifying fields are withheld.'],
 ['13-admin-permissions.png','Permissions','Administration','A governance interface for reviewing access boundaries. Internal permission details are withheld.'],
 ['14-admin-site-control.png','Site Control','Administration','An operational administration interface. Sensitive settings and controls are withheld.'],
 ['15-chief-editorial-progress-report.png','Department Progress Report','Specialist workspaces','A Chief Editorial Centre reporting interface with structured inputs and a document preview.']
].map(([file,title,category,description]) => ({file,title,category,description}));
const gallery = document.querySelector('#gallery');
const filters = document.querySelector('#filters');
const status = document.querySelector('#gallery-status');
const viewer = document.querySelector('#viewer');
const viewerImage = document.querySelector('#viewer-img');
let current = 0;
const categories = ['Daily operations', 'Resources & development', 'Specialist workspaces', 'Administration'];
let active = categories[0];
let visible = [];
let opener = null;
function element(tag, className, text) {
 const node = document.createElement(tag);
 if (className) node.className = className;
 if (text !== undefined) node.textContent = text;
 return node;
}
function renderGallery() {
 visible = screenshots.filter(item => item.category === active);
 gallery.replaceChildren();
 const fragment = document.createDocumentFragment();
 for (const item of visible) {
  const card = element('article','shot');
  const link = element('a','shot-link');
  link.href = `images/${item.file}`;
  link.dataset.preview = item.file;
  link.setAttribute('aria-label', `Enlarge ${item.title} screenshot`);
  const image = element('img');
  image.src = link.href; image.alt = `Redacted ${item.title} interface`; image.loading = 'lazy'; image.decoding = 'async';
  link.append(image);
  const meta = element('div','shot-meta');
  meta.append(element('span','',`${item.file.slice(0,2)} / ${item.category}`),element('span','','View ↗'));
  card.append(link,meta,element('h3','',item.title),element('p','',item.description));
  fragment.append(card);
 }
 gallery.append(fragment);
 status.textContent = `${active} · ${visible.length} interface previews`;
 for(const button of filters.querySelectorAll('button')) button.setAttribute('aria-pressed',String(button.dataset.category === active));
}
for(const category of categories) {
 const button = element('button','',category); button.type = 'button';
 button.dataset.category = category; button.setAttribute('aria-controls','gallery');
 button.append(element('span','filter-count',String(screenshots.filter(item=>item.category===category).length))); 
 button.addEventListener('click',()=>{active=category;renderGallery();});
 filters.append(button);
}
filters.hidden = false;
renderGallery();
let sequence = visible;
function showImage(index) {
 current = Math.max(0,Math.min(index,sequence.length-1));
 const item = sequence[current];
 viewerImage.src = `images/${item.file}`; viewerImage.alt = `Redacted ${item.title} interface`;
 document.querySelector('#viewer-title').textContent=item.title;
 document.querySelector('#viewer-category').textContent=item.category;
 document.querySelector('#viewer-description').textContent=item.description;
 document.querySelector('#viewer-count').textContent=`${current+1} / ${sequence.length}`;
 document.querySelector('#previous').disabled=current===0;
 document.querySelector('#next').disabled=current===sequence.length-1;
}
document.addEventListener('click',event=>{
 const link=event.target.closest('a[data-preview]');
 if(!link || !viewer.showModal || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button!==0) return;
 const selectedItem = screenshots.find(item=>item.file===link.dataset.preview);
 if(!selectedItem) return;
 sequence = gallery.contains(link) ? visible : screenshots.filter(item=>item.category===selectedItem.category);
 const index=sequence.findIndex(item=>item.file===link.dataset.preview);
 if(index<0) return;
 event.preventDefault(); opener=link; showImage(index); viewer.showModal(); document.querySelector('#close-viewer').focus();
});
document.querySelector('#close-viewer').addEventListener('click',()=>viewer.close());
document.querySelector('#previous').addEventListener('click',()=>showImage(current-1));
document.querySelector('#next').addEventListener('click',()=>showImage(current+1));
viewer.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();showImage(current-1);} if(event.key==='ArrowRight'){event.preventDefault();showImage(current+1);}});
viewer.addEventListener('click',event=>{if(event.target===viewer){const r=viewer.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)viewer.close();}});
viewer.addEventListener('close',()=>{viewerImage.removeAttribute('src');opener?.focus();});
