/* Patch app.js: register Grimoire chapter and use diagram view */
(function(){
 const originalRender=window.render;
 window.render=function(){
 if(chap==="Grimoire"){
 const toks=query.toLowerCase().split(/\s+/).filter(Boolean);
 const rows=E.filter(e=>e.c==="Grimoire"&&toks.every(t=>((e.n+" "+(e.s||"")+" "+e.f.map(x=>x.join(" ")).join(" ")).toLowerCase().includes(t))));
 $("#count").textContent=rows.length+" evolutions";
 $("#list").innerHTML='<div class="grimoire">'+rows.map(e=>{
 const parts=(e.s||"").split(" + ");
 const isUnion=e.f.find(x=>x[0]==="Type")?.[1]==="Union";
 let h='<div class="gcard'+(isUnion?' union':'')+'"><div class="grow">';
 parts.forEach((p,i)=>{if(i)h+='<span class="gplus">+</span>';h+='<span class="gnode '+(i===parts.length-1&&!isUnion&&parts.length>1?'passive':'weapon')+'">'+p+'</span>'});
 h+='<span class="garrow">→</span><span class="gnode '+(isUnion?'gunion':'gevolution')+'">'+e.n+'</span></div><div class="gnote">'+(isUnion?'Union — all weapons max level':'Max weapon and passive(s), then open a chest')+'</div></div>';
 return h;
 }).join('')+'</div>';
 return;
 }
 originalRender();
 };
})();
