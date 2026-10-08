const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const config=window.STUDIO_CONFIG||{};
const pref=matchMedia('(prefers-reduced-motion: reduce)');
let paused=pref.matches,animations=[],observer;
const motionToggle=$('#motion-toggle');
let lockedScroll=null;
function lockPage(){if(lockedScroll)return;lockedScroll={y:window.scrollY,position:document.body.style.position,top:document.body.style.top,width:document.body.style.width,overflow:document.body.style.overflow};Object.assign(document.body.style,{position:'fixed',top:`-${lockedScroll.y}px`,width:'100%',overflow:'hidden'});}
function unlockPage(){if(!lockedScroll)return;const saved=lockedScroll;lockedScroll=null;Object.assign(document.body.style,{position:saved.position,top:saved.top,width:saved.width,overflow:saved.overflow});const behavior=document.documentElement.style.scrollBehavior;document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,saved.y);document.documentElement.style.scrollBehavior=behavior;}
function motion(){
 animations.forEach(a=>a.revert());animations=[];observer?.disconnect();$$('.reveal-pending').forEach(el=>el.classList.remove('reveal-pending'));
 document.documentElement.dataset.motion=paused?'reduce':'full';document.body.classList.toggle('paused',paused);
 if(motionToggle){motionToggle.textContent=paused?'Play motion':'Pause motion';motionToggle.setAttribute('aria-label',paused?'Play animation':'Pause animation');motionToggle.setAttribute('aria-pressed',String(paused));}
 if(paused||!window.anime)return;
 const hero=anime.createTimeline();animations.push(hero);
 hero.add('.hero-top',{opacity:[0,1],y:[12,0],duration:700,ease:'outExpo'},0).add('.hero h1',{opacity:[0,1],y:[24,0],duration:1100,ease:'outExpo'},100).add('.hero-bottom',{opacity:[0,1],y:[18,0],duration:900,ease:'outExpo'},300);
 observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{if(!isIntersecting)return;observer.unobserve(target);target.classList.remove('reveal-pending');animations.push(anime.animate(target,{opacity:[0,1],y:[30,0],duration:850,ease:'outExpo'}))}),{rootMargin:'0px 0px -25px 0px'});
 $$('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-pending');observer.observe(el)}});
}
motion();motionToggle?.addEventListener('click',()=>{paused=!paused;motion()});pref.addEventListener('change',e=>{paused=e.matches;motion()});
const menu=$('.menu-toggle'),nav=$('nav');function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}
menu.onclick=()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))};$$('nav a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus()}});document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu()});
const safeMedia=src=>{try{const u=new URL(src,location.href);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}};
const viewer=document.createElement('dialog');viewer.className='film-dialog';viewer.setAttribute('aria-label','Video player');viewer.innerHTML='<button class="close-film" aria-label="Close video">×</button><video controls playsinline preload="metadata"></video><p class="film-title"></p>';document.body.append(viewer);
const fullVideo=viewer.querySelector('video');let activePreview=null;const previewStates=[];
function canPreview(state){return state.visible&&!document.hidden&&!viewer.open&&!pref.matches&&!paused}
function startPreview(state){state.video.muted=true;if(!canPreview(state)){state.video.pause();return}const attempt=state.video.play();attempt?.catch(()=>{state.button.classList.remove('is-playing')})}
function syncPreviews(){previewStates.forEach(startPreview)}
function closeFilm(){fullVideo.pause();viewer.close()}
viewer.querySelector('button').onclick=closeFilm;
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeFilm()}});
viewer.addEventListener('close',()=>{fullVideo.pause();fullVideo.removeAttribute('src');fullVideo.load();unlockPage();syncPreviews();activePreview?.button.focus({preventScroll:true})});
const previewObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{const state=previewStates.find(s=>s.video===target);if(state){state.visible=isIntersecting;startPreview(state)}}),{threshold:.05,rootMargin:'80px'});
if($('#video-work')&&Array.isArray(config.videos)&&config.videos.length){const grid=$('#video-work');grid.replaceChildren();config.videos.forEach((film,index)=>{
 const src=safeMedia(film.src);if(!src)return;const article=document.createElement('article');article.className='video-card';const button=document.createElement('button');button.className='video-preview';button.setAttribute('aria-label','Watch '+(film.title||'film')+' with sound');
 const poster=document.createElement('img');poster.className='video-poster';poster.alt='';poster.src=safeMedia(film.poster)||'';poster.width=720;poster.height=1280;poster.loading=index===0?'eager':'lazy';
 const video=document.createElement('video');video.muted=true;video.defaultMuted=true;video.setAttribute('muted','');video.setAttribute('autoplay','');video.setAttribute('playsinline','');video.setAttribute('webkit-playsinline','');video.autoplay=true;video.loop=true;video.playsInline=true;video.preload='auto';video.poster=poster.src;video.src=safeMedia(film.preview)||src;
 const badge=document.createElement('span');badge.className='play-badge';badge.innerHTML='<svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg> Play film';button.append(poster,video,badge);
 const title=document.createElement('h3');title.textContent=film.title||'Studio film';const credit=document.createElement('p');credit.textContent=film.credit||'Film by Ian';article.append(button);grid.append(article);
 const state={video,button,visible:false};previewStates.push(state);previewObserver.observe(video);
 video.addEventListener('loadeddata',()=>startPreview(state));video.addEventListener('canplay',()=>startPreview(state));video.addEventListener('playing',()=>button.classList.add('is-playing'));video.addEventListener('error',()=>{button.classList.remove('is-playing');credit.textContent='Ian · Click to watch the full film'});
 button.onclick=()=>{previewStates.forEach(s=>s.video.pause());activePreview=state;fullVideo.poster=poster.src;fullVideo.src=src;fullVideo.muted=false;viewer.querySelector('.film-title').textContent='';lockPage();viewer.showModal();fullVideo.play().catch(()=>{viewer.querySelector('.film-title').textContent='Press play to watch '+(film.title||'this film')});viewer.querySelector('button').focus()};
 });}
document.addEventListener('visibilitychange',()=>{if(document.hidden)fullVideo.pause();syncPreviews()});window.addEventListener('pageshow',syncPreviews);pref.addEventListener('change',syncPreviews);motionToggle?.addEventListener('click',syncPreviews);
const proof=config.proof||{};if($('#channel-link')&&proof.channelUrl&&safeMedia(proof.channelUrl)){const link=$('#channel-link');link.href=safeMedia(proof.channelUrl);link.textContent=proof.channelLabel||'Explore Ian’s channel';link.hidden=false;if($('#channel-pending'))$('#channel-pending').hidden=true}
(proof.metrics||[]).forEach((metric,index)=>{const card=$$('.metric-card')[index];if(!card||!metric.value||!metric.sourceUrl||!safeMedia(metric.sourceUrl))return;card.querySelector('.metric-value').textContent=metric.value;card.querySelector('h3').textContent=metric.label;card.querySelector('p')?.remove();card.classList.add('verified')});
$('#signup-form')?.addEventListener('submit',async e=>{e.preventDefault();const form=e.currentTarget,button=form.querySelector('button'),status=$('#form-status');const data=Object.fromEntries(new FormData(form));button.disabled=true;status.textContent='Sending your details…';try{const response=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:data.email,consent:data.consent==='on',website:data.website,kind:'contact',message:data.message||''})});let result={};try{result=await response.json()}catch{}if(!response.ok)throw Error(result.error||'Signup is not available yet. Please try again later.');status.textContent='Thanks! Your details are saved. We’ll keep in touch.';form.reset()}catch(error){status.textContent=error.message}finally{button.disabled=false}});

(config.team||[]).slice(0,12).forEach((member,index)=>{const card=$$('.team-card')[index];if(!card)return;if(member.name)card.querySelector('h3').textContent=member.name;if(member.role)card.querySelector('p').textContent=member.role;if(member.photo&&safeMedia(member.photo)){const portrait=card.querySelector('.team-portrait');const img=document.createElement('img');img.src=safeMedia(member.photo);img.alt=member.name?'Portrait of '+member.name:'Team member portrait';img.style.objectPosition=member.position||'50% 35%';img.style.transform='scale('+(member.zoom||1)+')';img.style.transformOrigin=member.position||'50% 35%';img.loading='lazy';img.width=600;img.height=750;portrait.removeAttribute('role');portrait.removeAttribute('aria-label');portrait.replaceChildren(img)}});

const proofViewer=document.createElement('dialog');proofViewer.id='proof-viewer';proofViewer.setAttribute('aria-label','Metric screenshot');proofViewer.innerHTML='<button aria-label="Close screenshot">×</button><button class="proof-zoom" aria-pressed="false">Read full size</button><img alt=""><p></p>';document.body.append(proofViewer);proofViewer.querySelector('button').onclick=()=>proofViewer.close();proofViewer.addEventListener('click',e=>{if(e.target===proofViewer){const r=proofViewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)proofViewer.close()}});

let activeScreenshot=null;
proofViewer.addEventListener('close',()=>{unlockPage();activeScreenshot?.focus({preventScroll:true});});
$$('[data-screenshot]').forEach(button=>button.onclick=()=>{activeScreenshot=button;proofViewer.querySelector('img').src=button.dataset.screenshot;proofViewer.querySelector('img').alt=button.querySelector('img').alt;proofViewer.querySelector('p').textContent=button.querySelector('img').alt;lockPage();proofViewer.showModal()});

const gallery=$('.website-gallery');
if(gallery){
 const previous=$('#examples-prev'),next=$('#examples-next');
 const updateArrows=()=>{previous.disabled=gallery.scrollLeft<3;next.disabled=gallery.scrollLeft+gallery.clientWidth>=gallery.scrollWidth-3;};
 const move=direction=>gallery.scrollBy({left:direction*(gallery.querySelector('article').getBoundingClientRect().width+parseFloat(getComputedStyle(gallery).gap)),behavior:pref.matches?'auto':'smooth'});
 previous.onclick=()=>move(-1);next.onclick=()=>move(1);gallery.addEventListener('keydown',e=>{if(e.target===gallery&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowLeft'?-1:1);}});
 gallery.addEventListener('scroll',updateArrows,{passive:true});new ResizeObserver(updateArrows).observe(gallery);updateArrows();
}

const proofZoom=proofViewer.querySelector(".proof-zoom");proofZoom.onclick=()=>{const zoomed=proofViewer.classList.toggle("zoomed");proofZoom.setAttribute("aria-pressed",String(zoomed));proofZoom.textContent=zoomed?"Fit to screen":"Read full size";};proofViewer.addEventListener("close",()=>{proofViewer.classList.remove("zoomed");proofZoom.textContent="Read full size";proofZoom.setAttribute("aria-pressed","false");});
