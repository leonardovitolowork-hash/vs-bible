(function(){
const NAMES=["Miang Moonspell","Menya Moonspell","Syuuto Moonspell","Babi-Onna","McCoy-Oni","Gav'Et-Oni","Megalo Menya Moonspell","Megalo Syuuto Moonspell","Megalo Miang Moonspell","Spiritoso","Spiritosa","Gekkojin","Eleanor Uziron","Maruto Cuts","Keitha Muort","Luminaire Foscari","Genevieve Gruyère","Je-Ne-Viv","Sammy","Rottin'Ghoul","Silver Wind","Four Seasons","Summon Night","Mirage Robe","Night Sword","Mille Bolle Blu","108 Bocce","LunarMight","LunarSight","LunarBight","SpellString","SpellStream","SpellStrike","Eskizzibur","Flash Arrow","Prismatic Missile","Shadow Servant","Party Popper","Festive Winds","Argent Flow","Godai Shuffle","Echo Night","J'Odore","Muramasa","Boo Roo Boolle","LunarFlight","Legionnaire","Millionaire","Luminaire","Ophion","SpellStrom","Academy Badge","Pearl Magatama"];
const KEY='vsdlcsprites1';let cache={};try{cache=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const alias={"Gav'Et-Oni ★":"Gav'Et-Oni"};
function put(n,u){LOCAL_SPRITES[n]=u;Object.keys(alias).forEach(k=>{if(alias[k]===n)LOCAL_SPRITES[k]=u})}
function refresh(){try{route()}catch(e){}}
async function run(){
Object.keys(cache).forEach(n=>put(n,cache[n]));refresh();
const need=NAMES.filter(n=>!LOCAL_SPRITES[n]);let i=0,found=0;
const worker=async()=>{while(i<need.length){const n=need[i++];let u=null;try{u=await lookup(n)}catch(e){}if(u){put(n,u);cache[n]=u;found++;if(found%6===0)refresh()}}};
await Promise.all([worker(),worker(),worker(),worker()]);
try{localStorage.setItem(KEY,JSON.stringify(cache))}catch(e){}
refresh();
}
function wait(){if(typeof LOCAL_SPRITES==='undefined'||typeof lookup!=='function'||typeof route!=='function'||typeof E==='undefined'){setTimeout(wait,300);return}run()}
wait();
})();
