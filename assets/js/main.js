/* SVX site — shared behaviour (loaded on every page) */
(function(){
  "use strict";
  var root=document.documentElement;

  /* ---- Theme toggle (persisted) ---- */
  var SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>';
  var MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"/></svg>';
  var tg=document.getElementById('themeTg');
  function applyIcon(t){ if(tg) tg.innerHTML=(t==='dark')?SUN:MOON; }
  applyIcon(root.getAttribute('data-theme')||'light');
  if(tg){
    tg.addEventListener('click',function(){
      var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
      root.setAttribute('data-theme',next);
      try{localStorage.setItem('svx-theme',next);}catch(e){}
      applyIcon(next);
    });
  }

  /* ---- Nav scroll state ---- */
  var nav=document.getElementById('nav');
  if(nav){ window.addEventListener('scroll',function(){ nav.classList.toggle('scrolled',window.scrollY>40); }); }

  /* ---- Mobile menu ---- */
  var burger=document.querySelector('.burger');
  if(burger){
    burger.addEventListener('click',function(){
      var l=document.querySelector('.nav-links');
      var open=l.style.display==='flex';
      l.style.cssText=open?'':'display:flex;position:absolute;top:60px;right:22px;flex-direction:column;background:var(--bg);padding:18px 22px;border:1px solid var(--border);border-radius:14px;gap:16px;box-shadow:0 20px 40px -20px rgba(0,0,0,.3)';
    });
  }

  /* ---- Reveal on scroll ---- */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.14});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

  /* ---- Animated counters ---- */
  var countIO=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return; countIO.unobserve(e.target);
    var el=e.target, target=parseFloat(el.dataset.count), suf=el.dataset.suffix||'';
    if(isNaN(target))return; var t0=null,dur=1400,dec=(target%1!==0)?1:0;
    function step(ts){if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1); p=1-Math.pow(1-p,3);
      el.innerHTML=(target*p).toFixed(dec)+'<span class="u">'+suf+'</span>'; if(p<1)requestAnimationFrame(step);}
    requestAnimationFrame(step);
  });},{threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ if(!isNaN(parseFloat(el.dataset.count))) countIO.observe(el); });

  /* ---- Animated bars ---- */
  var barIO=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
    e.target.querySelectorAll('.bar-fill').forEach(function(b,i){setTimeout(function(){b.style.width=b.dataset.w+'%';},i*120);});
    barIO.unobserve(e.target);
  }});},{threshold:.4});
  document.querySelectorAll('.viz-card').forEach(function(c){barIO.observe(c);});

  /* ---- Generative lattice visuals ---- */
  function buildLattice(svg,W,H,density){
    var cols=7,rows=7,gx=W/(cols+1),gy=H/(rows+1),pts=[];
    for(var r=1;r<=rows;r++)for(var c=1;c<=cols;c++){pts.push({x:c*gx+(Math.random()*14-7),y:r*gy+(Math.random()*14-7)});}
    var lines='';
    for(var i=0;i<pts.length;i++)for(var j=i+1;j<pts.length;j++){
      var dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<gx*1.45){lines+='<line x1="'+pts[i].x.toFixed(1)+'" y1="'+pts[i].y.toFixed(1)+'" x2="'+pts[j].x.toFixed(1)+'" y2="'+pts[j].y.toFixed(1)+'" stroke="rgba(246,242,233,0.13)" stroke-width="1"/>';}
    }
    var dots='';
    pts.forEach(function(p){var hot=Math.random()<(density||0.18);var col=hot?'#F2A35E':'rgba(246,242,233,0.5)';var rad=hot?3.4:2;
      dots+='<circle cx="'+p.x.toFixed(1)+'" cy="'+p.y.toFixed(1)+'" r="'+rad+'" fill="'+col+'">';
      if(hot)dots+='<animate attributeName="opacity" values="1;0.35;1" dur="'+(2.5+Math.random()*2).toFixed(1)+'s" repeatCount="indefinite" begin="'+(Math.random()*2).toFixed(1)+'s"/>';
      dots+='</circle>';
    });
    svg.innerHTML=lines+dots;
  }
  document.querySelectorAll('[data-lattice]').forEach(function(svg){
    var vb=(svg.getAttribute('viewBox')||'0 0 400 376').split(' ');
    buildLattice(svg,parseFloat(vb[2]),parseFloat(vb[3]),parseFloat(svg.dataset.lattice)||0.18);
  });

  /* ---- Footer year ---- */
  var y=document.getElementById('year'); if(y)y.textContent=new Date().getFullYear();
})();

/* ===== Living cathode lattice — hero canvas ===== */
(function(){
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function initField(canvas){
  var ctx=canvas.getContext('2d');
  var nodes=[], edges=[], adj=[], pulses=[], W=0,H=0,DPR=1, mx=.5,my=.5, tmx=.5,tmy=.5, t=0;

  function build(){
    var r=canvas.getBoundingClientRect(); W=r.width; H=r.height; DPR=Math.min(devicePixelRatio||1,2);
    canvas.width=W*DPR; canvas.height=H*DPR; ctx.setTransform(DPR,0,0,DPR,0,0);
    var sp=Math.max(78, Math.min(W,H)/9);
    nodes=[]; var cols=Math.ceil(W/sp)+2, rows=Math.ceil(H/sp)+2;
    for(var iy=0;iy<rows;iy++)for(var ix=0;ix<cols;ix++){
      var bx=(ix-1)*sp+(iy%2?sp/2:0), by=(iy-1)*sp;
      nodes.push({bx:bx,by:by,jx:(Math.random()*2-1)*sp*.22,jy:(Math.random()*2-1)*sp*.22,ph:Math.random()*6.28,hot:0});
    }
    edges=[]; adj=nodes.map(function(){return[];});
    for(var i=0;i<nodes.length;i++)for(var j=i+1;j<nodes.length;j++){
      var dx=(nodes[i].bx+nodes[i].jx)-(nodes[j].bx+nodes[j].jx), dy=(nodes[i].by+nodes[i].jy)-(nodes[j].by+nodes[j].jy);
      if(dx*dx+dy*dy < (sp*1.42)*(sp*1.42)){ edges.push([i,j]); adj[i].push(j); adj[j].push(i); }
    }
    pulses=[];
  }
  function pos(n){ return {x:n.bx+n.jx+Math.sin(t*0.0006+n.ph)*5+(tmx-.5)*22, y:n.by+n.jy+Math.cos(t*0.0005+n.ph)*5+(tmy-.5)*22}; }
  function spawn(){
    if(nodes.length<4) return;
    var start=(Math.random()*nodes.length)|0, path=[start], cur=start, prev=-1;
    var len=5+(Math.random()*5|0);
    for(var k=0;k<len;k++){ var nb=adj[cur]; if(!nb.length)break; var nx=nb[(Math.random()*nb.length)|0]; if(nx===prev&&nb.length>1){nx=nb[(Math.random()*nb.length)|0];} path.push(nx); prev=cur; cur=nx; }
    if(path.length>2) pulses.push({path:path,t:0,sp:0.012+Math.random()*0.012});
  }

  function frame(){
    t=performance.now(); tmx+=(mx-tmx)*.05; tmy+=(my-tmy)*.05;
    var dark=root.getAttribute('data-theme')==='dark';
    var base=dark?'235,242,246':'18,42,46';
    ctx.clearRect(0,0,W,H);
    // edges
    ctx.lineWidth=1;
    for(var e=0;e<edges.length;e++){ var a=pos(nodes[edges[e][0]]), b=pos(nodes[edges[e][1]]);
      var glow=Math.max(nodes[edges[e][0]].hot,nodes[edges[e][1]].hot);
      ctx.strokeStyle='rgba('+base+','+(0.06+glow*0.32)+')'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    }
    // pulses
    for(var p=pulses.length-1;p>=0;p--){ var pu=pulses[p]; pu.t+=pu.sp; var seg=Math.floor(pu.t);
      if(seg>=pu.path.length-1){ pulses.splice(p,1); continue; }
      var f=pu.t-seg, n1=nodes[pu.path[seg]], n2=nodes[pu.path[seg+1]], p1=pos(n1), p2=pos(n2);
      var x=p1.x+(p2.x-p1.x)*f, y=p1.y+(p2.y-p1.y)*f; n1.hot=1; n2.hot=Math.max(n2.hot,f);
      var g=ctx.createRadialGradient(x,y,0,x,y,16); g.addColorStop(0,'rgba(242,163,94,.95)'); g.addColorStop(.4,'rgba(232,116,59,.5)'); g.addColorStop(1,'rgba(232,116,59,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,16,0,6.2832); ctx.fill();
      ctx.fillStyle='#FCE7CF'; ctx.beginPath(); ctx.arc(x,y,2.4,0,6.2832); ctx.fill();
    }
    // nodes
    for(var i=0;i<nodes.length;i++){ var n=nodes[i], pp=pos(n);
      if(n.hot>0){ var gg=ctx.createRadialGradient(pp.x,pp.y,0,pp.x,pp.y,10); gg.addColorStop(0,'rgba(242,163,94,'+(n.hot*.8)+')'); gg.addColorStop(1,'rgba(242,163,94,0)'); ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(pp.x,pp.y,10,0,6.2832); ctx.fill(); }
      ctx.fillStyle='rgba('+base+','+(0.28+n.hot*0.6)+')'; ctx.beginPath(); ctx.arc(pp.x,pp.y,1.7+n.hot*1.6,0,6.2832); ctx.fill();
      n.hot*=0.96;
    }
    requestAnimationFrame(frame);
  }

  function staticDraw(){ // reduced-motion: one frame, no pulses, no parallax
    tmx=.5; tmy=.5; var dark=root.getAttribute('data-theme')==='dark'; var base=dark?'235,242,246':'18,42,46';
    ctx.clearRect(0,0,W,H); ctx.lineWidth=1;
    for(var e=0;e<edges.length;e++){ var a=pos(nodes[edges[e][0]]), b=pos(nodes[edges[e][1]]); ctx.strokeStyle='rgba('+base+',.1)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); }
    for(var i=0;i<nodes.length;i++){ var pp=pos(nodes[i]); ctx.fillStyle='rgba('+base+',.4)'; ctx.beginPath(); ctx.arc(pp.x,pp.y,1.8,0,6.2832); ctx.fill(); }
  }

  build();
  addEventListener('resize',function(){ build(); if(reduce) staticDraw(); });
  if(reduce){ staticDraw(); }
  else{
    canvas.parentElement.addEventListener('mousemove',function(ev){ var r=canvas.getBoundingClientRect(); mx=(ev.clientX-r.left)/r.width; my=(ev.clientY-r.top)/r.height; });
    setInterval(spawn, 900); spawn();
    requestAnimationFrame(frame);
  }
  }
  var fields=document.querySelectorAll('.field'); Array.prototype.forEach.call(fields, initField);
})();

/* ===== Cathode half-dials: build, hover-focus, scenario toggle, scroll-in ===== */
(function(){
  var wraps=[].slice.call(document.querySelectorAll('.dialwrap[data-metric]'));
  if(!wraps.length) return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CX=165, CY=165, R=120, SPAN=180;
  var COL={cathode:'#E8743B', cathode2:'#F2A35E', svx:'#FFC24B', other:'#4FA6A0', anode:'#AEB89C'};
  function polar(cx,cy,r,d){ var a=d*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; }
  function arcD(cx,cy,r,a0,a1){ var p0=polar(cx,cy,r,a0), p1=polar(cx,cy,r,a1), lg=(a1-a0)>180?1:0;
    return 'M '+p0[0].toFixed(2)+' '+p0[1].toFixed(2)+' A '+r+' '+r+' 0 '+lg+' 1 '+p1[0].toFixed(2)+' '+p1[1].toFixed(2); }
  function pc(v){ return v.toFixed(1)+'%'; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
  function colorOf(k,id){ return k==='cathode'?('url(#dcg-'+id+')'):k==='other'?COL.other:COL.anode; }

  var models=[];
  wraps.forEach(function(wrap){
    var segs; try{ segs=JSON.parse(wrap.getAttribute('data-segs')); }catch(e){ return; }
    var m={ wrap:wrap, id:wrap.getAttribute('data-metric'), title:wrap.getAttribute('data-title'),
      segs:segs, host:wrap.querySelector('.dial-svg'), legend:wrap.querySelector('.dial-legend'),
      catShow:segs[0].val, on:false };
    m.shortOf=function(k){ for(var i=0;i<segs.length;i++){ if(segs[i].key===k) return segs[i].short; } return k; };
    buildLegend(m); render(m); wireHover(m); models.push(m);
  });

  function buildLegend(m){
    var html=m.segs.map(function(s){ var c=s.key==='cathode'?COL.cathode:s.key==='other'?COL.other:COL.anode;
      return '<span class="dl-item"><span class="dl-sw" style="background:'+c+'"></span>'+esc(s.name)+'</span>'; }).join('');
    html+='<span class="dl-item"><span class="dl-sw" style="background:'+COL.svx+'"></span>SVX zone · '+pc(m.segs[0].svx)+'</span>';
    m.legend.innerHTML=html;
  }
  function render(m){
    var s=m.segs, svx=s[0].svx||0, id=m.id, deg=SPAN/100;
    var vals=[m.catShow, s[1].val, s[2].val], keys=['cathode','other','anode'];
    var acc=180, seg='', lab='', end=0;
    vals.forEach(function(v,i){
      var a0=acc, a1=acc+v*deg, mid=(a0+a1)/2;
      seg+='<path class="arc-seg" data-key="'+keys[i]+'" data-val="'+v.toFixed(1)+'" stroke="'+colorOf(keys[i],id)+'" d="'+arcD(CX,CY,R,a0,a1)+'"/>';
      var lp=polar(CX,CY,R+30,mid), anc=lp[0]<CX-4?'end':(lp[0]>CX+4?'start':'middle');
      lab+='<g class="dlab" text-anchor="'+anc+'"><text class="dl-cat" x="'+lp[0].toFixed(1)+'" y="'+(lp[1]-2).toFixed(1)+'">'+esc(m.shortOf(keys[i]))+'</text><text class="dl-num" x="'+lp[0].toFixed(1)+'" y="'+(lp[1]+14).toFixed(1)+'">'+pc(v)+'</text></g>';
      acc=a1; end+=v;
    });
    var baseEnd=s[0].val-svx;
    var svxg='<path class="arc-svx" d="'+arcD(CX,CY,R,180+baseEnd*deg,180+m.catShow*deg)+'"/>';
    m.host.innerHTML='<svg viewBox="0 0 330 210" role="img" aria-label="'+esc(m.title)+'">'
      +'<defs><linearGradient id="dcg-'+id+'" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="'+COL.cathode+'"/><stop offset="1" stop-color="'+COL.cathode2+'"/></linearGradient></defs>'
      +'<g class="d-segs">'+seg+'</g><g class="d-svx">'+svxg+'</g><g class="d-labs">'+lab+'</g>'
      +'<g class="d-cx" text-anchor="middle"><text class="d-big" x="165" y="150">'+pc(m.catShow)+'</text><text class="d-sm" x="165" y="171">cathode share</text></g></svg>';
  }
  function restore(m){ var big=m.host.querySelector('.d-big'), sm=m.host.querySelector('.d-sm');
    if(big) big.textContent=pc(m.catShow); if(sm) sm.textContent='cathode share'; }
  function wireHover(m){
    m.wrap.addEventListener('mouseover', function(e){
      var p=e.target.closest?e.target.closest('.arc-seg,.arc-svx'):null; if(!p||!m.host.contains(p)) return;
      var big=m.host.querySelector('.d-big'), sm=m.host.querySelector('.d-sm');
      [].forEach.call(m.host.querySelectorAll('.arc-seg,.arc-svx'), function(x){ x.classList.add('dimmed'); });
      p.classList.remove('dimmed'); p.classList.add('hot');
      if(p.classList.contains('arc-svx')){ big.textContent=pc(m.segs[0].svx); sm.textContent='SVX potential'; }
      else { big.textContent=pc(parseFloat(p.getAttribute('data-val'))); sm.textContent=m.shortOf(p.getAttribute('data-key')); }
    });
    m.wrap.addEventListener('mouseout', function(e){
      var p=e.target.closest?e.target.closest('.arc-seg,.arc-svx'):null; if(!p) return;
      [].forEach.call(m.host.querySelectorAll('.arc-seg,.arc-svx'), function(x){ x.classList.remove('dimmed','hot'); });
      restore(m);
    });
  }
  function countUp(m){
    var nodes=[m.host.querySelector('.d-big')].concat([].slice.call(m.host.querySelectorAll('.dl-num')));
    nodes.forEach(function(n){ if(!n) return; var t=parseFloat(n.textContent); if(isNaN(t)) return; var dur=1000, st=null;
      function step(ts){ if(!st)st=ts; var p=Math.min((ts-st)/dur,1), e=1-Math.pow(1-p,3);
        n.textContent=(t*e).toFixed(1)+'%'; if(p<1){ requestAnimationFrame(step); } else { n.textContent=t.toFixed(1)+'%'; } }
      requestAnimationFrame(step);
    });
  }
  function reveal(m){ m.wrap.classList.add('in'); if(!reduce) countUp(m); }
  if(reduce || !('IntersectionObserver' in window)){ models.forEach(function(m){ m.wrap.classList.add('in'); }); return; }
  function find(el){ for(var i=0;i<models.length;i++){ if(models[i].wrap===el) return models[i]; } return null; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var m=find(e.target); if(m) reveal(m); io.unobserve(e.target); } }); },{threshold:0.3});
  models.forEach(function(m){ io.observe(m.wrap); });
  // safety net: reveal any in-viewport dial the observer may have missed
  setTimeout(function(){ models.forEach(function(m){ if(!m.wrap.classList.contains('in')){ var r=m.wrap.getBoundingClientRect(); if(r.top < (window.innerHeight||0) && r.bottom > 0){ reveal(m); io.unobserve(m.wrap); } } }); }, 1600);
})();

