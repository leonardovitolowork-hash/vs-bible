/* GRIMOIRE VIEW */
const grimoireView=()=>{
 const rows=E.filter(e=>e.c==="Grimoire");
 let h='<div class="grimoire">';
 rows.forEach(e=>{
 const parts=(e.s||"").split(" + ");
 const result=e.n;
 const isUnion=e.f.find(x=>x[0]==="Type")?.[1]==="Union";
 h+='<div class="gcard'+(isUnion?' union':'')+'">';
 h+='<div class="grow">';
 parts.forEach((p,i)=>{if(i)h+='<span class="gplus">+</span>';h+='<span class="gnode '+(i===parts.length-1&&!isUnion&&parts.length>1?'passive':'weapon')+'">'+p+'</span>'});
 h+='<span class="garrow">→</span><span class="gnode '+(isUnion?'gunion':'gevolution')+'">'+result+'</span>';
 h+='</div><div class="gnote">'+(isUnion?'Union — all weapons max level':'Max weapon and passive(s), then open a chest')+'</div></div>';
 });
 return h+'</div>';
};
