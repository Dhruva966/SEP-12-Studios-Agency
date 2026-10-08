const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const business=window.BUSINESS;
const defaults={...business.defaults};
const storageKey='business-site:12-studios:'+business.id;
let config={...defaults};try{config={...config,...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{}
config={...config,...window.SITE_CONFIG};
const assetUrl=name=>window.SITE_ASSETS?.[name]||'assets/'+name;
const originalHeadline=$('h1').innerHTML,originalLogo=$('.wordmark').innerHTML;
function apply(){document.documentElement.style.setProperty('--accent',config.accent);$$('.agency-name').forEach(e=>e.textContent=config.agency);$$('.wordmark').forEach(e=>{if(config.agency===defaults.agency)e.innerHTML=originalLogo;else e.textContent=config.agency});if(config.headline===defaults.headline)$('h1').innerHTML=originalHeadline;else $('h1').textContent=config.headline;;document.title='12 Studios';$('#send-brief').textContent=config.contact?'Open email draft':'Save your inquiry';$('#form-note').textContent=config.contact?'Opens an email draft for you to review and send. This does not confirm an appointment or reservation.':'Download your inquiry to share with the business. Nothing is sent or booked online.'}
apply();
const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
const wantsReduced=()=>motionPreference.matches||config.motion==='reduce';
let reduced=wantsReduced();document.documentElement.dataset.motion=reduced?'reduce':'full';
let motionCleanup=()=>{};
function setupMotion(){
  motionCleanup();
  if(!window.anime||reduced)return;
  const animations=[],observers=[],handlers=[],touched=new Set();
  const run=(target,options)=>{const a=anime.animate(target,options);animations.push(a);return a};
  const listen=(target,type,fn,options)=>{target.addEventListener(type,fn,options);handlers.push(()=>target.removeEventListener(type,fn,options))};
  const hero=anime.createTimeline();animations.push(hero);
  hero.add('.hero .eyebrow',{opacity:[0,1],y:[12,0],duration:650,ease:'outExpo'},0)
      .add('.hero h1',{opacity:[0,1],y:[24,0],rotate:[1.5,0],duration:1200,ease:'outExpo'},100)
      .add('.hero h1 em',{filter:['blur(9px)','blur(0px)'],duration:1100,ease:'outExpo'},220)
      .add('.hero-bottom > *',{opacity:[0,1],y:[22,0],delay:anime.stagger(120),duration:850,ease:'outExpo'},350)
      .add('.hero-foot',{opacity:[0,1],duration:800},600);
  // Reveal only when the section is reached; content is readable if animation fails.
  const reveal=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
    if(!isIntersecting)return;
    reveal.unobserve(target);target.classList.remove('reveal-pending');touched.add(target);
    run(target,{opacity:[0,1],y:[38,0],duration:900,ease:'outExpo'});
  }),{threshold:0,rootMargin:'0px 0px -30px 0px'});observers.push(reveal);
  $$('.section-head,.service-intro,.service-row,.demo > div:first-child,.brand-preview,.process > div,.contact > div,.contact form').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('reveal-pending');touched.add(el);reveal.observe(el)}});
  const workReveal=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{
    if(!isIntersecting)return;workReveal.unobserve(target);touched.add(target);
    run(target,{clipPath:['inset(14% 0 14% 0 round 28px)','inset(0% 0 0% 0 round 0px)'],opacity:[.4,1],duration:1150,ease:'outExpo'});
    run(target.querySelector('.project-title'),{y:[35,0],opacity:[0,1],duration:1000,delay:160,ease:'outExpo'});
  }),{threshold:.18});observers.push(workReveal);
  $$('.project-image').forEach(el=>workReveal.observe(el));
  let frame=0;const projects=$$('.project-image'),preview=$('.brand-preview');
  const paint=()=>{frame=0;const height=innerHeight;
    document.documentElement.style.setProperty('--reading-progress',String(scrollY/Math.max(1,document.documentElement.scrollHeight-height)));
    projects.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<height){const progress=Math.max(-1,Math.min(1,(height/2-r.top-r.height/2)/height));el.style.setProperty('--photo-shift',progress*28+'px')}});
    const r=preview.getBoundingClientRect();if(r.bottom>0&&r.top<height)preview.style.setProperty('--brand-turn',((height-r.top)/(height+r.height)*100-50)+'deg');
  };
  const requestPaint=()=>{if(!frame)frame=requestAnimationFrame(paint)};
  listen(window,'scroll',requestPaint,{passive:true});listen(window,'resize',requestPaint,{passive:true});paint();
  if(matchMedia('(hover:hover) and (pointer:fine)').matches){
    $$('.project').forEach(card=>{const image=card.querySelector('.project-image');let tilt;
      listen(card,'pointermove',event=>{const r=card.getBoundingClientRect();image.style.setProperty('--tilt-x',((event.clientY-r.top)/r.height-.5)*-3+'deg');image.style.setProperty('--tilt-y',((event.clientX-r.left)/r.width-.5)*4+'deg')});
      listen(card,'pointerleave',()=>{image.style.setProperty('--tilt-x','0deg');image.style.setProperty('--tilt-y','0deg')});
    });
  }
  motionCleanup=()=>{cancelAnimationFrame(frame);handlers.forEach(fn=>fn());observers.forEach(o=>o.disconnect());animations.forEach(a=>a.revert());touched.forEach(el=>el.classList.remove('reveal-pending'));projects.forEach(el=>{['--photo-shift','--tilt-x','--tilt-y'].forEach(k=>el.style.removeProperty(k))});preview.style.removeProperty('--brand-turn');document.documentElement.style.removeProperty('--reading-progress')};
}
setupMotion();
motionPreference.addEventListener('change',event=>{reduced=wantsReduced();document.documentElement.dataset.motion=reduced?'reduce':'full';setupMotion();if(reduced){presetAnimations.forEach(a=>a.revert());timeline?.revert();$('#concept-frame').textContent=concepts[active].frames.join(' · ')}});
const presets=business.presets;
let presetAnimations=[];
function preset(key){if(!presets[key])throw Error('Unknown service');presetAnimations.forEach(a=>a.revert());presetAnimations=[];if(!presets[key])throw Error('Unknown business type');const p=presets[key];$('#preview-name').textContent=p.name.toUpperCase();$('#preview-kicker').textContent=p.kicker;$('#preview-headline').textContent=p.headline;$('#preview-body').textContent=p.body;$('.brand-preview').style.backgroundImage=`linear-gradient(90deg,${p.color}ee,${p.color}44),url('${assetUrl(p.image)}')`;$$('[data-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.preset===key)));if(window.anime&&!reduced){presetAnimations.push(anime.animate('.preview-copy > *',{opacity:[0,1],y:[24,0],delay:anime.stagger(75),duration:650,ease:'outExpo'}));presetAnimations.push(anime.animate('.mini-nav b',{opacity:[0,1],y:[-8,0],duration:450}))}return {businessType:key,brand:p.name}}
$$('[data-preset]').forEach(b=>b.onclick=()=>preset(b.dataset.preset));
const concepts=business.concepts;let active=0,timeline;
function play(){
  timeline?.revert();
  const frames=concepts[active].frames;
  if(!window.anime||reduced){$('#concept-frame').textContent=frames.join(' · ');return}
  timeline=anime.createTimeline({onComplete:()=>$('#replay').textContent='Replay spotlight'});
  frames.forEach((frame,index)=>{
    const at=index*2200;
    timeline.call(()=>{$('#concept-frame').textContent=frame},at)
      .add('#concept-frame',{opacity:[0,1],y:[32,0],scale:[.94,1],filter:['blur(5px)','blur(0px)'],duration:800,ease:'outExpo'},at);
    if(index<frames.length-1)timeline.add('#concept-frame',{opacity:0,y:-16,duration:350,ease:'inQuad'},at+1800);
  });
  timeline.add('#concept-stage',{backgroundSize:['110%','125%'],duration:6500,ease:'linear'},0);
  $('#replay').textContent='Restart spotlight';
}
$$('[data-concept]').forEach(b=>b.onclick=()=>{active=Number(b.dataset.concept);const c=concepts[active];$('#concept-name').textContent=c.name;$('#concept-desc').textContent=c.desc;$('#concept-stage').style.backgroundImage=`url('${assetUrl(c.image)}')`;$('#concept-dialog').showModal();play()});$('#replay').onclick=play;
$$('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());$('#concept-dialog').addEventListener('close',()=>timeline?.pause());$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){let r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
function settings(){Object.entries(config).forEach(([k,v])=>{if($('#settings-form').elements[k])$('#settings-form').elements[k].value=v});$('#settings').showModal()}$('#edit-footer').onclick=settings;
$('#settings-form').onsubmit=e=>{e.preventDefault();const values=Object.fromEntries(new FormData(e.target));config={...config,...values};apply();updateContact();refreshMotion();syncBackground();try{localStorage.setItem(storageKey,JSON.stringify(config));$('#settings-status').textContent='Saved in this browser. Export to publish these changes.'}catch{$('#settings-status').textContent='Applied. Browser storage unavailable; export to keep your changes.'}};
$('#reset').onclick=()=>{config={...defaults};try{localStorage.removeItem(storageKey)}catch{}apply();updateContact();refreshMotion();syncBackground();$('#settings').close()};
function download(text,name,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),2000)}
$('#brief-form').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));const brief=`Inquiry for ${config.agency}\n\nName: ${f.name}\nEmail: ${f.email}\nInterest: ${f.interest}\nDetails: ${f.details||"Not specified"}\n\n${f.message}`;if(config.contact){location.href=`mailto:${encodeURIComponent(config.contact)}?subject=${encodeURIComponent('Inquiry — '+config.agency)}&body=${encodeURIComponent(brief)}`;$('#form-note').textContent='Your email draft was requested. Send it in your email app; nothing has been submitted here.'}else{download(brief,'inquiry.txt','text/plain');$('#form-note').textContent='Inquiry downloaded. Share it with the business; nothing has been sent or reserved.'}};
$('#export').onclick=async()=>{
 const status=$('#settings-status'),button=$('#export');button.disabled=true;status.textContent='Preparing your standalone site…';
 try{
  const read=async path=>{const r=await fetch(path);if(!r.ok)throw Error('Missing asset');return r.text()};
  const [html,css,js,engine,data]=window.SITE_SOURCE||await Promise.all(['index.html','style.css','app.js','assets/anime.min.js','site-data.js'].map(read));
  const assets=window.SITE_ASSETS||Object.fromEntries(await Promise.all(['citrus.jpg','coffee.jpg'].map(async name=>{
   const r=await fetch(assetUrl(name));if(!r.ok)throw Error('Image unavailable');const blob=await r.blob();
   return [name,await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)})];
  })));
  const safe=value=>JSON.stringify(value).replaceAll('<','\\u003c');
  const inline=code=>code.replaceAll('</script','<\\/script');
  const bootstrap='window.SITE_CONFIG='+safe(config)+';window.SITE_ASSETS='+safe(assets)+';window.SITE_SOURCE='+safe([html,css,js,engine,data])+';';
  let out=html.replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+css+'</style>')
   .replace('<script src="assets/anime.min.js"></script>',()=>'<script>'+inline(engine)+'</script>')
   .replace('<script src="site-data.js"></script>',()=>'<script>'+inline(data)+'</script>')
   .replace('<script src="app.js" defer></script>',()=>'<script>'+bootstrap+inline(js)+'</script>');
  Object.entries(assets).forEach(([name,url])=>{out=out.replaceAll('assets/'+name,url)});
  download(out,business.id+'-website.html','text/html');status.textContent='Downloaded with your saved settings. Upload the HTML file to publish it.';
 }catch{status.textContent='Export failed. Please check your connection and try again.'}finally{button.disabled=false}
};
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'preview_food_business',title:'Explore services',description:'Switch the visible service spotlight. Does not book or submit an inquiry.',inputSchema:{type:'object',properties:{businessType:{type:'string',enum:['beverage','restaurant','snacks']}},required:['businessType'],additionalProperties:false},annotations:{readOnlyHint:false},execute:input=>preset(input.businessType)})).catch(()=>{})}catch{}}

// Use native scrolling; smooth anchor travel never captures wheel or touch input.
$$('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
  const hash=link.getAttribute('href');if(!hash.startsWith('#'))return;const destination=hash==='#'?document.body:document.getElementById(hash.slice(1));
  if(!destination)return;
  event.preventDefault();closeMenu();if(hash==='#')window.scrollTo({top:0,behavior:reduced?'instant':'smooth'});else destination.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});
  history.replaceState(null,'',hash);
}));
const heroVideo=$('#hero-video'),backgroundToggle=$('#background-toggle');
let backgroundPaused=reduced,videoSource='',videoFailed=false;
function backgroundState(){
  backgroundToggle.disabled=reduced;
  $('.hero').classList.toggle('background-paused',backgroundPaused||reduced);
  if(backgroundToggle)backgroundToggle.textContent=reduced?'Motion reduced':(backgroundPaused?'Play background':'Pause background');
  backgroundToggle?.setAttribute('aria-pressed',String(backgroundPaused));
}
function playBackground(){
  if(!videoSource||videoFailed)return;
  heroVideo.play().then(()=>{if(backgroundPaused||document.hidden){heroVideo.pause();return}$('#video-status').textContent='';backgroundState()}).catch(error=>{if(error.name==='AbortError'||videoFailed)return;backgroundPaused=true;backgroundState();$('#video-status').textContent=''});
}
function syncBackground(){
  $('#video-status').textContent='';const raw=(config.video||'').trim();let next='';
  try{if(raw){const url=new URL(raw);if(!['https:','http:'].includes(url.protocol))throw Error('Unsupported URL');next=url.href}}catch{$('#video-status').textContent='Use a direct HTTPS video link in Site settings.'}
  if(next!==videoSource){videoFailed=false;backgroundPaused=reduced;heroVideo.pause();heroVideo.removeAttribute('src');videoSource=next;if(next)heroVideo.src=next;heroVideo.load()}
  $('.hero').classList.toggle('has-video',!!next);backgroundState();
  if(next&&!backgroundPaused&&!reduced)playBackground();
}
heroVideo.addEventListener('error',()=>{if(!videoSource)return;videoFailed=true;$('.hero').classList.remove('has-video');$('#video-status').textContent='Video could not load. Check the direct MP4/WebM link in Site settings.'});
if(backgroundToggle)backgroundToggle.onclick=()=>{backgroundPaused=!backgroundPaused;if(backgroundPaused)heroVideo.pause();else if(videoSource)playBackground();backgroundState()};
motionPreference.addEventListener('change',event=>{backgroundPaused=wantsReduced();if(backgroundPaused)heroVideo.pause();else if(videoSource)playBackground();backgroundState()});
// Pause offscreen video to avoid using bandwidth and power during the rest of the page.
const videoVisibility=new IntersectionObserver(entries=>{if(!videoSource)return;if(!entries[0].isIntersecting)heroVideo.pause();else if(!backgroundPaused&&!reduced)playBackground()},{threshold:0});videoVisibility.observe($('.hero'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)heroVideo.pause();else if(videoSource&&!backgroundPaused&&!reduced&&$('.hero').getBoundingClientRect().bottom>0)playBackground()});
syncBackground();

const menuToggle=$('.menu-toggle'),mainNav=$('#main-nav');
function closeMenu(){menuToggle.setAttribute('aria-expanded','false');mainNav.classList.remove('is-open');document.documentElement.style.setProperty('--nav-offset',($('header').getBoundingClientRect().height+18)+'px')}
menuToggle.onclick=()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));mainNav.classList.toggle('is-open',open)};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuToggle.getAttribute('aria-expanded')==='true'){closeMenu();menuToggle.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('header'))closeMenu()});
$$('dialog').forEach(dialog=>{
 const open=dialog.showModal.bind(dialog);
 dialog.showModal=()=>{open();if(window.anime&&!reduced)anime.animate(dialog,{opacity:[0,1],y:[12,0],duration:240,ease:'outCubic'})};
});

function updateContact(){
 const phone=(config.phone||'').trim(),address=(config.address||'').trim(),hours=(config.hours||'').trim();
 $('#business-details').hidden=!(phone||address||hours);
 $('#phone-link').hidden=!phone;$('#phone-link').textContent=phone;$('#phone-link').href='tel:'+phone.replace(/[^+0-9]/g,'');
 $('#map-link').hidden=!address;$('#map-link').textContent=address;$('#map-link').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address);
 $('#business-hours').hidden=!hours;$('#business-hours').textContent=hours;
 $('.visit-strip').hidden=!(phone||address||hours);
 $('#quick-phone').hidden=!phone;$('#quick-phone').textContent=phone;$('#quick-phone').href=$('#phone-link').href;
 $('#quick-address').hidden=!address;$('#quick-address').textContent=address;$('#quick-address').href=$('#map-link').href;
 $('#quick-hours').hidden=!hours;$('#quick-hours').textContent=hours;
 let booking='';try{const url=new URL(config.booking);if(['https:','http:'].includes(url.protocol))booking=url.href}catch{}
 $$('.booking-cta').forEach(link=>{link.href=booking||'#contact';if(booking){link.target='_blank';link.rel='noopener';link.textContent='Book a visit'}else{link.removeAttribute('target');link.textContent=business.cta}});
}
function refreshMotion(){
 const next=wantsReduced();if(next===reduced)return;reduced=next;document.documentElement.dataset.motion=reduced?'reduce':'full';setupMotion();
 presetAnimations.forEach(a=>a.revert());timeline?.revert();
 if(reduced){backgroundPaused=true;heroVideo.pause();$('#concept-frame').textContent=concepts[active].frames.join(' · ')}else backgroundPaused=false;
 backgroundState();
}
updateContact();

const headerSize=new ResizeObserver(()=>document.documentElement.style.setProperty('--nav-offset',($('header').getBoundingClientRect().height+18)+'px'));headerSize.observe($('header'));
