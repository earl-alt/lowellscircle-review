(()=>{
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('section>*:not(.kicker),.pieces figure,.p-idea').forEach(el=>{el.classList.add('reveal');io.observe(el)});
const play='<svg viewBox="0 0 24 24"><path d="M7 4v16l13-8z"/></svg>',pause='<svg viewBox="0 0 24 24"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>';
const fmt=s=>isFinite(s)?Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'):'0:00';
const all=[];
document.querySelectorAll('.clip').forEach(c=>{
  const label=c.dataset.label;
  c.innerHTML=`<button type="button" aria-label="Play clip from the ${label}">${play}</button><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><span class="meta">${label}</span>`;
  const b=c.querySelector('button'),bar=c.querySelector('.bar'),fill=bar.querySelector('i'),meta=c.querySelector('.meta');
  const a=new Audio();a.preload='metadata';a.src=c.dataset.src;all.push(a);
  a.addEventListener('error',()=>{b.disabled=true;meta.textContent='Clip coming soon \u00b7 '+label;});
  a.addEventListener('loadedmetadata',()=>{meta.textContent=label+' \u00b7 '+fmt(a.duration)});
  a.addEventListener('timeupdate',()=>{const p=a.duration?a.currentTime/a.duration*100:0;fill.style.width=p+'%';bar.setAttribute('aria-valuenow',Math.round(p));meta.textContent=fmt(a.currentTime)+' / '+fmt(a.duration)});
  a.addEventListener('play',()=>{b.innerHTML=pause;b.setAttribute('aria-label','Pause clip')});
  a.addEventListener('pause',()=>{b.innerHTML=play;b.setAttribute('aria-label','Play clip from the '+label)});
  a.addEventListener('ended',()=>{fill.style.width='0%'});
  b.addEventListener('click',()=>{if(a.paused){all.forEach(x=>x!==a&&x.pause());a.play()}else a.pause()});
  bar.addEventListener('click',e=>{if(!a.duration)return;const r=bar.getBoundingClientRect();a.currentTime=(e.clientX-r.left)/r.width*a.duration});
});
})();
