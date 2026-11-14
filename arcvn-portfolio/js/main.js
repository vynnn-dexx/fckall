/* ARCVN MD | main.js. Vanilla JS tanpa build. Efek terinspirasi ReactBits. */
(()=>{
'use strict';
const D=window.SITE||{},$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v)),esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
const tick=fn=>{let q=0;return()=>{q||(q=requestAnimationFrame(()=>{q=0;fn()}))}};
try{
  /* render dari data.js */
  $('#track').innerHTML=Array(4).fill(D.stack||[]).flat().map(t=>`<span>${esc(t)}</span>`).join('');
  $('#services').innerHTML=(D.services||[]).map(s=>`<article class="tile"><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><small>${esc(s.g)}</small></article>`).join('');
  $('#projects').innerHTML=(D.projects||[]).map(p=>`<li><a href="${esc(p.u)}" target="_blank" rel="noopener noreferrer"><b>${esc(p.n)}</b><span>${esc(p.g)}</span><span>${esc(p.y)}</span></a></li>`).join('');
  $('#yr').textContent=new Date().getFullYear();

  /* PillNav */
  $$('.pill').forEach(a=>{const t=a.textContent.trim();a.innerHTML=`<i class="hc"></i><span class="lbl"><span>${t}</span><span aria-hidden="true">${t}</span></span>`});
  const menu=$('#menu'),bg=$('#burger'),shut=()=>{menu.classList.remove('open');bg.setAttribute('aria-expanded','false')};
  bg.addEventListener('click',()=>bg.setAttribute('aria-expanded',menu.classList.toggle('open')));
  $$('.pill').forEach(a=>a.addEventListener('click',shut));
  addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
  const spy=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('.pill').forEach(p=>p.classList.toggle('is-active',p.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
  $$('main section[id]').forEach(s=>spy.observe(s));

  /* SplitText + BlurText (jalan pas elemen masuk layar) */
  const split=(n,m,c)=>[...n.childNodes].forEach(k=>{
    if(k.nodeType===3){const f=document.createDocumentFragment();
      (m==='words'?k.textContent.split(/(\s+)/):[...k.textContent]).forEach(p=>{
        if(!p)return;if(!p.trim()){f.append(' ');return}
        const s=document.createElement('span');s.className=m==='words'?'w':'ch';s.style.setProperty('--i',c.i++);s.textContent=p;f.append(s)});
      k.replaceWith(f)}
    else if(k.nodeType===1&&k.tagName!=='BR')split(k,m,c)});
  const io=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}}),{threshold:.2});
  $$('[data-split]').forEach(el=>{el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());split(el,el.dataset.split,{i:0});el.classList.add('sp');io.observe(el)});

  /* ScrollReveal (kata nyala pelan-pelan pas di-scroll) */
  const ab=$('#about');
  ab.innerHTML=ab.textContent.trim().split(/\s+/).map(w=>`<span>${esc(w)}</span>`).join(' ');
  const ws=$$('span',ab),upd=()=>{const r=ab.getBoundingClientRect(),h=innerHeight,p=RM?1:clamp((h*.85-r.top)/(r.height+h*.3),0,1),n=p*ws.length*1.1;ws.forEach((w,i)=>{w.style.opacity=(.16+.84*clamp(n-i,0,1)).toFixed(2)})};
  addEventListener('scroll',tick(upd),{passive:true});addEventListener('resize',upd);upd();

  /* progress bar */
  const bar=$('#progress'),prog=tick(()=>{const h=document.documentElement;bar.style.transform=`scaleX(${scrollY/Math.max(1,h.scrollHeight-innerHeight)})`});
  addEventListener('scroll',prog,{passive:true});prog();

  /* SpotlightCard (mouse + sentuh) */
  $$('.tile').forEach(t=>{
    const mv=e=>{const r=t.getBoundingClientRect();t.style.setProperty('--mx',e.clientX-r.left+'px');t.style.setProperty('--my',e.clientY-r.top+'px')};
    t.addEventListener('pointermove',mv);t.addEventListener('pointerdown',e=>{mv(e);t.classList.add('on')});
    ['pointerup','pointercancel','pointerleave'].forEach(v=>t.addEventListener(v,()=>t.classList.remove('on')))});

  /* Magnet (desktop aja) */
  if(FINE&&!RM)$$('[data-magnet]').forEach(b=>addEventListener('pointermove',e=>{
    const r=b.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;
    b.style.transform=Math.hypot(x,y)<r.width*.8?`translate(${x*.22}px,${y*.3}px)`:''},{passive:true}));

  /* DotGrid (canvas, berhenti kalau hero nggak keliatan) */
  const cv=$('#dots'),cx=cv.getContext('2d');let W=0,H=0,dots=[],mx=-999,my=-999,sx=-999,sy=-999,last=0,id=0;
  const draw=()=>{cx.clearRect(0,0,W,H);sx+=(mx-sx)*.12;sy+=(my-sy)*.12;
    for(let i=0;i<dots.length;i+=2){const x=dots[i],y=dots[i+1],dx=x-sx,dy=y-sy,d=Math.hypot(dx,dy);let ox=0,oy=0,r=1.3;
      if(d<150&&d>.1){const f=1-d/150;ox=dx/d*f*f*18;oy=dy/d*f*f*18;r=1.3+f*2.8;cx.fillStyle=`rgba(255,200,61,${.3+f*.7})`}else cx.fillStyle='rgba(143,161,199,.22)';
      cx.beginPath();cx.arc(x+ox,y+oy,r,0,6.2832);cx.fill()}};
  const size=()=>{const b=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2),g=b.width<640?24:30;W=b.width;H=b.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0);dots=[];for(let y=g/2;y<H;y+=g)for(let x=g/2;x<W;x+=g)dots.push(x,y);draw()};
  const loop=t=>{if(t-last>2500){mx=W*(.5+.4*Math.sin(t/2600));my=H*(.55+.3*Math.sin(t/1900+1))}draw();id=requestAnimationFrame(loop)};
  addEventListener('pointermove',e=>{const b=cv.getBoundingClientRect();mx=e.clientX-b.left;my=e.clientY-b.top;last=performance.now()},{passive:true});
  new ResizeObserver(size).observe(cv);
  if(!RM)new IntersectionObserver(([e])=>{cancelAnimationFrame(id);if(e.isIntersecting)id=requestAnimationFrame(loop)}).observe(cv);

  /* ClickSpark (klik & tap) */
  const sc=$('#sparks'),sg=sc.getContext('2d');let sp=[],sw=0,sh=0,sid=0;
  const rs=()=>{const d=Math.min(devicePixelRatio||1,2);sw=innerWidth;sh=innerHeight;sc.width=sw*d;sc.height=sh*d;sg.setTransform(d,0,0,d,0,0)};rs();addEventListener('resize',rs);
  const sl=now=>{sg.clearRect(0,0,sw,sh);sp=sp.filter(s=>now-s.t<480);sg.strokeStyle='#ffc83d';sg.lineWidth=2;sg.lineCap='round';
    sp.forEach(s=>{const p=(now-s.t)/480,e=1-Math.pow(1-p,3),a=Math.cos(s.a),b=Math.sin(s.a),r1=e*30,r2=r1+(1-p)*14;sg.globalAlpha=1-p;sg.beginPath();sg.moveTo(s.x+a*r1,s.y+b*r1);sg.lineTo(s.x+a*r2,s.y+b*r2);sg.stroke()});
    sid=sp.length?requestAnimationFrame(sl):0};
  if(!RM)addEventListener('pointerdown',e=>{const t=performance.now();for(let i=0;i<9;i++)sp.push({x:e.clientX,y:e.clientY,a:i*.698+Math.random()*.3,t});if(!sid)sid=requestAnimationFrame(sl)},{passive:true});
}catch(err){console.error(err);$$('.sp').forEach(e=>e.classList.add('in'))}
})();
