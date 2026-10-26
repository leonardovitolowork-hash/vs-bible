const $=s=>document.querySelector(s);
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const ICON={Characters:"🧙",Weapons:"⚔️",Evolutions:"✨",Passives:"💍",Relics:"🏺",Arcanas:"🃏",Darkanas:"🌑",Stages:"🗺️",Codes:"🔑",Grimoire:"📖"};
const COL={Characters:"#5b2f8f",Weapons:"#8f3220",Evolutions:"#9a5f10",Passives:"#1f5f8f",Relics:"#1f7a5a",Arcanas:"#8a2257",Darkanas:"#352070",Stages:"#456020",Codes:"#6b4a00",Grimoire:"#6b4a00"};
E.forEach(e=>{e.id=slug(e.c)+"/"+slug(e.n);e.hay=(e.n+" "+(e.s||"")+" "+(e.code||"")+" "+e.f.map(x=>x[0]+" "+x[1]).join(" ")).toLowerCase().replace(/\[\[|\]\]/g,"")});
const byName={};E.forEach(e=>{const k=e.n.toLowerCase();if(!byName[k]||byName[k].c==="Codes")byName[k]=e});
const fwd={},rev={};
E.forEach(e=>{if(e.c==="Codes")return;const s=new Set();e.f.forEach(f=>String(f[1]).replace(/\[\[(.+?)\]\]/g,(m,n)=>{const t=byName[n.toLowerCase()];if(t&&t!==e&&t.c!=="Codes")s.add(t)}));fwd[e.id]=[...s];s.forEach(t=>{(rev[t.id]=rev[t.id]||new Set()).add(e)})});
const CHAPS=[...new Set(E.map(e=>e.c))];
let chap=null,query="";
const IMG=JSON.parse(localStorage.getItem("vsimg2")||"{}");
const esc=s=>String(s).replace(/[&<>]/g,c=>({"&":"&","<":"<",">":">"}[c]));
const rich=t=>esc(t).replace(/\[\[(.+?)\]\]/g,(m,n)=>{const t2=byName[n.toLowerCase()];return t2?'<a class="lk" data-go="'+t2.id+'">'+n+'</a>':n});
const ini=n=>n.replace(/[^A-Za-z0-9 ]/g,"").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()||"?";
const key=e=>(e.w||e.n).replace(/ \([IVX0]+\)$/,"");
function av(e){const u=IMG[key(e)];return '<div class="av" data-t="'+esc(key(e))+'" style="background:'+(COL[e.c]||"#333")+'">'+(u?'<img loading="lazy" src="'+u+'" alt="">':(ICON[e.c]||ini(e.n)))+'</div>'}
function home(){$("#menu").innerHTML=CHAPS.map((c,i)=>'<button class="mb'+(i===CHAPS.length-1?" wide":"")+'" data-c="'+c+'"><b>'+ICON[c]+'</b>'+c.toUpperCase()+'<i>'+E.filter(e=>e.c===c).length+' entries</i></button>').join("")}
function grimoireCard(e){
 const recipe=e.s||"";
 const parts=recipe.split(" + ");
 const isUnion=(e.f.find(x=>x[0]==="Type")||[])[1]==="Union";
 let h='<div class="gcard'+(isUnion?' union':'')+'"><div class="grow">';
 parts.forEach((p,i)=>{
 if(i)h+='<span class="gplus">+</span>';
 const isPassive=i>0&&parts.length>1&&!isUnion;
 h+='<span class="gnode '+(isPassive?'passive':'weapon')+'">'+esc(p)+'</span>';
 });
 h+='<span class="garrow">→</span><span class="gnode '+(isUnion?'gunion':'gevolution')+'">'+esc(e.n)+'</span>';
 h+='</div><div class="gnote">'+(isUnion?'Union — all listed weapons must be max level':'Max the weapon and required passive(s), then open an eligible chest')+'</div></div>';
 return h;
}
function view(){
 const show=chap||query.trim();
 $("#home").classList.toggle("hidden",!!show);
 $("#bar").classList.toggle("hidden",!show);
 $("#list").classList.toggle("hidden",!show);
 if(!show)return;
 const toks=query.toLowerCase().split(/\s+/).filter(Boolean);
 const rows=E.filter(e=>(!chap||e.c===chap)&&toks.every(t=>e.hay.includes(t)));
 $("#count").textContent=(chap?chap.toUpperCase()+" · ":"SEARCH · ")+rows.length;
 if(chap==="Grimoire"){
 $("#list").innerHTML='<div class="grimoire">'+rows.map(grimoireCard).join("")+'</div>';
 return;
 }
 let h="",last="";
 rows.forEach(e=>{
 if(!chap&&e.c!==last){h+='<div class="grp">'+ICON[e.c]+" "+e.c.toUpperCase()+'</div>';last=e.c}
 h+='<div class="item" data-go="'+e.id+'">'+av(e)+'<div class="meta"><div class="nm">'+esc(e.n)+'</div><div class="sb">'+esc(e.s||"")+'</div></div>'+(e.code&&e.c!=="Codes"?'<div class="cd">🔑 '+esc(e.code.length>16?e.code.slice(0,13)+"…":e.code)+'</div>':"")+'</div>';
 });
 $("#list").innerHTML=h||'<div class="empty">Nothing found 🦇</div>';
 loadIcons(rows.slice(0,80));
}
function chips(arr){const g={};arr.forEach(t=>(g[t.c]=g[t.c]||[]).push(t));return Object.keys(g).map(c=>'<div class="cg">'+ICON[c]+" "+c+'</div><div class="chips">'+g[c].map(t=>'<a class="chip" data-go="'+t.id+'">'+esc(t.n)+'</a>').join("")+'</div>').join("")}
function open(id){
 const e=E.find(x=>x.id===id);if(!e)return;
 let h='<div class="hero">'+av(e)+'<div><h2>'+esc(e.n)+'</h2><div class="ch">'+ICON[e.c]+" "+e.c+(e.s?" · "+esc(e.s):"")+'</div></div></div>';
 if(e.code)h+='<div class="code"><span>🔑</span><code>'+esc(e.code)+'</code><button data-copy="'+esc(e.code.split("  /  ")[0])+'">Copy</button></div>';
 e.f.forEach(f=>{h+='<div class="f"><b>'+esc(f[0])+'</b><div>'+rich(f[1])+'</div></div>'});
 const mine=new Set(fwd[e.id]||[]),r=[...(rev[e.id]||[])].filter(t=>!mine.has(t));
 if(mine.size)h+='<div class="f"><b>🔗 Uses / connects to</b>'+chips([...mine])+'</div>';
 if(r.length)h+='<div class="f"><b>↩ Used by / affected by</b>'+chips(r)+'</div>';
 if(e.c!=="Codes")h+='<a class="wiki" target="_blank" rel="noopener" href="https://vampire.survivors.wiki/w/'+encodeURIComponent((e.w||e.n).replace(/ /g,"_"))+'">Open on wiki ↗</a>';
 $("#detail").innerHTML=h;$("#sheet").classList.remove("hidden");$(".card").scrollTop=0;
 loadIcons([e,...mine]);
}
function shut(){$("#sheet").classList.add("hidden")}
const tried=new Set();
const APIS=["https://vampire.survivors.wiki/api.php","https://vampire.survivors.wiki/w/api.php"];
function paint(){document.querySelectorAll(".av[data-t]").forEach(d=>{const u=IMG[d.dataset.t];if(u&&!d.querySelector("img"))d.innerHTML='<img loading="lazy" src="'+u+'" alt="">'})}
async function lookup(name){
 for(const api of APIS){
 try{
 const q=api+"?action=query&format=json&origin=*&generator=allimages&gaiprefix="+encodeURIComponent(name.replace(/ /g,"_"))+"&gailimit=8&prop=imageinfo&iiprop=url";
 const j=await (await fetch(q)).json();
 const pgs=Object.values((j.query&&j.query.pages)||{});
 if(pgs.length){
 const nm=name.toLowerCase().replace(/[^a-z0-9]/g,"");
 const score=p=>{const t=p.title.replace(/^File:/,"").replace(/\.[a-z]+$/i,"").toLowerCase().replace(/[^a-z0-9]/g,"");return t===nm?0:t.startsWith(nm)?t.length-nm.length:999};
 pgs.sort((a,b)=>score(a)-score(b));
 const best=pgs[0];
 if(score(best)<999&&best.imageinfo&&best.imageinfo[0])return best.imageinfo[0].url;
 }
 const q2=api+"?action=query&format=json&origin=*&redirects=1&prop=pageimages&piprop=thumbnail&pithumbsize=96&titles="+encodeURIComponent(name);
 const j2=await (await fetch(q2)).json();
 const p2=Object.values((j2.query&&j2.query.pages)||{})[0];
 if(p2&&p2.thumbnail)return p2.thumbnail.source;
 return null;
 }catch(x){}
 }
 return null;
}
async function loadIcons(rows){
 const need=[...new Set(rows.filter(e=>e.c!=="Codes").map(key))].filter(k=>!IMG[k]&&!tried.has(k));
 need.forEach(k=>tried.add(k));
 let i=0;
 const worker=async()=>{while(i<need.length){const k=need[i++];const u=await lookup(k);if(u){IMG[k]=u;try{localStorage.setItem("vsimg2",JSON.stringify(IMG))}catch(x){}paint()}}};
 await Promise.all([worker(),worker(),worker(),worker()]);
}
function route(){
 const h=decodeURIComponent(location.hash.slice(1));
 if(!h){chap=null;shut();}
 else if(h.startsWith("c:")){chap=h.slice(2);shut()}
 else{open(h)}
 view();
}
document.addEventListener("click",ev=>{
 const t=ev.target.closest("[data-go],[data-c],[data-copy],#close,#back");
 if(!t){if(ev.target.id==="sheet")shut();return}
 if(t.dataset.go){location.hash=t.dataset.go}
 else if(t.dataset.c){location.hash="c:"+t.dataset.c;scrollTo(0,0)}
 else if(t.dataset.copy){navigator.clipboard&&navigator.clipboard.writeText(t.dataset.copy);t.textContent="Copied ✓"}
 else if(t.id==="back"){query="";$("#q").value="";chap=null;location.hash="";view()}
 else{if(location.hash&&!location.hash.startsWith("#c:"))history.back();else shut()}
});
$("#q").addEventListener("input",e=>{query=e.target.value;view()});
addEventListener("hashchange",route);
home();route();
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js");
