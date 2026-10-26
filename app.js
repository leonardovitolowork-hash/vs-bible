const $=s=>document.querySelector(s);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
E.forEach((e,i)=>{e.id=slug(e.c)+"/"+slug(e.n);e.hay=(e.n+" "+(e.s||"")+" "+(e.code||"")+" "+e.f.map(x=>x[0]+" "+x[1]).join(" ")).toLowerCase().replace(/\[\[|\]\]/g,"")});
const byName={};E.forEach(e=>{if(!byName[e.n.toLowerCase()]||e.c!=="Codes")byName[e.n.toLowerCase()]=e});
const CH=["All",...[...new Set(E.map(e=>e.c))]];
let chap="All",query="";
const COL={Characters:"#7b3fb5",Weapons:"#b5472f",Evolutions:"#c27a1a",Passives:"#2f7fb5",Relics:"#2fa07a",Arcanas:"#a02f6e",Darkanas:"#4a2f8a",Stages:"#5a7a2f",Codes:"#8a6200"};
const IMG=JSON.parse(localStorage.getItem("vsimg")||"{}");
const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
const rich=t=>esc(t).replace(/\[\[(.+?)\]\]/g,(m,n)=>byName[n.toLowerCase().replace(/&#39;/g,"'")]?'<a class="lk" data-go="'+byName[n.toLowerCase()].id+'">'+n+'</a>':n);
const ini=n=>n.replace(/[^A-Za-z0-9 ]/g,"").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"?";
function av(e,cls){const u=IMG[e.w||e.n];return '<div class="av '+(cls||"")+'" data-t="'+esc(e.w||e.n)+'" style="background:'+(COL[e.c]||"#555")+'">'+(u?'<img loading="lazy" src="'+u+'" alt="">':ini(e.n))+'</div>'}
function render(){
  const toks=query.toLowerCase().split(/\s+/).filter(Boolean);
  const rows=E.filter(e=>(chap==="All"||e.c===chap)&&toks.every(t=>e.hay.includes(t)));
  $("#count").textContent=rows.length+" entries";
  let h="",last="";
  rows.forEach(e=>{
    if(chap==="All"&&e.c!==last){h+='<div class="grp">'+e.c+'</div>';last=e.c}
    h+='<div class="item" data-go="'+e.id+'">'+av(e)+'<div class="meta"><div class="nm">'+esc(e.n)+'</div><div class="sb">'+esc(e.s||"")+'</div></div>'+(e.code&&e.c!=="Codes"?'<div class="cd">'+esc(e.code.length>26?e.code.slice(0,22)+"…":e.code)+'</div>':"")+'</div>';
  });
  $("#list").innerHTML=h||'<div class="empty">Nothing found 🦇</div>';
  loadIcons(rows.slice(0,60));
}
function tabs(){$("#tabs").innerHTML=CH.map(c=>'<button class="'+(c===chap?"on":"")+'" data-c="'+c+'">'+c+'</button>').join("")}
function open(id){
  const e=E.find(x=>x.id===id);if(!e)return;
  let h='<div class="hero">'+av(e)+'<div><h2>'+esc(e.n)+'</h2><div class="ch">'+e.c+(e.s?" · "+esc(e.s):"")+'</div></div></div>';
  if(e.code)h+='<div class="code"><span>🔑</span><code>'+esc(e.code)+'</code><button data-copy="'+esc(e.code)+'">Copy</button></div>';
  e.f.forEach(f=>{h+='<div class="f"><b>'+esc(f[0])+'</b><div>'+rich(f[1])+'</div></div>'});
  if(e.c!=="Codes")h+='<a class="wiki" target="_blank" rel="noopener" href="https://vampire.survivors.wiki/w/'+encodeURIComponent((e.w||e.n).replace(/ /g,"_"))+'">Open on wiki ↗</a>';
  $("#detail").innerHTML=h;$("#sheet").classList.remove("hidden");$(".card").scrollTop=0;
  if(location.hash!=="#"+id)history.pushState(null,"","#"+id);
  loadIcons([e]);
}
function shut(){$("#sheet").classList.add("hidden");if(location.hash)history.pushState(null,"",location.pathname)}
async function loadIcons(rows){
  const need=[...new Set(rows.filter(e=>e.c!=="Codes"&&!(e.w||e.n in IMG)&&!(e.n in IMG)).map(e=>e.w||e.n))].filter(t=>!(t in IMG)&&!window.__tried?.has(t));
  window.__tried=window.__tried||new Set();
  for(let i=0;i<need.length;i+=40){
    const b=need.slice(i,i+40);b.forEach(t=>window.__tried.add(t));
    try{
      const r=await fetch("https://vampire.survivors.wiki/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=96&redirects=1&format=json&origin=*&titles="+encodeURIComponent(b.join("|")));
      const j=await r.json();const map={};
      (j.query.normalized||[]).forEach(n=>map[n.to]=n.from);(j.query.redirects||[]).forEach(n=>map[n.to]=map[n.from]||n.from);
      Object.values(j.query.pages||{}).forEach(p=>{if(p.thumbnail){IMG[map[p.title]||p.title]=p.thumbnail.source}});
      localStorage.setItem("vsimg",JSON.stringify(IMG));
      document.querySelectorAll(".av[data-t]").forEach(d=>{const u=IMG[d.dataset.t];if(u&&!d.querySelector("img"))d.innerHTML='<img loading="lazy" src="'+u+'" alt="">'});
    }catch(x){}
  }
}
document.addEventListener("click",ev=>{
  const t=ev.target.closest("[data-go],[data-c],[data-copy],#close");
  if(!t){if(ev.target.id==="sheet")shut();return}
  if(t.dataset.go)open(t.dataset.go);
  else if(t.dataset.c){chap=t.dataset.c;tabs();render();scrollTo(0,0)}
  else if(t.dataset.copy){navigator.clipboard&&navigator.clipboard.writeText(t.dataset.copy);t.textContent="Copied ✓"}
  else shut();
});
$("#q").addEventListener("input",e=>{query=e.target.value;render()});
addEventListener("popstate",()=>{const id=location.hash.slice(1);id?open(id):$("#sheet").classList.add("hidden")});
tabs();render();
if(location.hash.length>1)open(location.hash.slice(1));
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");
