const games=[
{name:"Roblox",desc:"Official Roblox website",category:"Sandbox",icon:"R",url:"https://www.roblox.com/"},
{name:"CrazyGames",desc:"Instant browser games",category:"Browser",icon:"CG",url:"https://www.crazygames.com/"},
{name:"Poki",desc:"Play games online",category:"Browser",icon:"P",url:"https://poki.com/"},
{name:"Minecraft",desc:"Official Minecraft website",category:"Sandbox",icon:"M",url:"https://www.minecraft.net/"},
{name:"Steam",desc:"PC game store",category:"Store",icon:"S",url:"https://store.steampowered.com/"},
{name:"itch.io",desc:"Indie and HTML5 games",category:"Browser",icon:"i",url:"https://itch.io/games/html5"},
{name:"Coolmath Games",desc:"Puzzles and casual games",category:"Browser",icon:"C",url:"https://www.coolmathgames.com/"},
{name:"Neal.fun",desc:"Creative mini experiences",category:"Browser",icon:"N",url:"https://neal.fun/"},
{name:"Scratch",desc:"Play community-made games",category:"Platform",icon:"Sc",url:"https://scratch.mit.edu/"}];
const $=id=>document.getElementById(id);
const get=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let favorites=get("gh-favorites",[]),recent=get("gh-recent",[]),favoritesOnly=false;
function save(){localStorage.setItem("gh-favorites",JSON.stringify(favorites));localStorage.setItem("gh-recent",JSON.stringify(recent))}
function render(){
 const q=$("search").value.toLowerCase(),cat=$("category").value,sort=$("sort").value;
 let list=games.filter(g=>(g.name+" "+g.desc+" "+g.category).toLowerCase().includes(q)&&(cat==="All"||g.category===cat)&&(!favoritesOnly||favorites.includes(g.name)));
 if(sort==="az")list.sort((a,b)=>a.name.localeCompare(b.name));
 if(sort==="recent")list.sort((a,b)=>recent.indexOf(a.name)-recent.indexOf(b.name));
 $("gameCount").textContent=`${list.length} games`;
 $("gameGrid").innerHTML=list.map(g=>`<div class="game-card"><a class="game-link" href="${g.url}" target="_blank" rel="noopener" data-name="${g.name}"><span class="game-icon">${g.icon}</span><span class="game-name">${g.name}</span><span class="game-desc">${g.desc}</span><span class="launch">↗</span></a><button class="favorite" data-fav="${g.name}" aria-label="Toggle ${g.name} favorite">${favorites.includes(g.name)?"★":"☆"}</button></div>`).join("");
 $("emptyState").hidden=list.length!==0;
 document.querySelectorAll(".game-link").forEach(a=>a.addEventListener("click",()=>{recent=[a.dataset.name,...recent.filter(x=>x!==a.dataset.name)].slice(0,5);save();setTimeout(renderRecent,0)}));
 document.querySelectorAll("[data-fav]").forEach(b=>b.addEventListener("click",()=>{const n=b.dataset.fav;favorites=favorites.includes(n)?favorites.filter(x=>x!==n):[...favorites,n];save();render()}));
}
function renderRecent(){$("recentList").innerHTML=recent.length?recent.map(n=>{const g=games.find(x=>x.name===n);return g?`<a href="${g.url}" target="_blank" rel="noopener">${g.icon} &nbsp;${g.name} ↗</a>`:""}).join(""):"Your recently opened games will appear here."}
["search","category","sort"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",render));
$("favoritesOnly").addEventListener("click",()=>{favoritesOnly=!favoritesOnly;$("favoritesOnly").setAttribute("aria-pressed",String(favoritesOnly));render()});
$("gamingMode").addEventListener("click",()=>{const on=$("gamingMode").getAttribute("aria-pressed")!=="true";$("gamingMode").setAttribute("aria-pressed",String(on));$("gamingMode").textContent=`Browser Gaming Mode: ${on?"ON":"OFF"}`;document.body.classList.toggle("gaming-mode",on)});
$("fullscreenBtn").addEventListener("click",async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{$("fullscreenBtn").textContent="Fullscreen unavailable"}});
document.addEventListener("fullscreenchange",()=>$("fullscreenBtn").textContent=document.fullscreenElement?"⛶ Exit fullscreen":"⛶ Fullscreen");
document.querySelectorAll(".theme-choice").forEach(b=>b.addEventListener("click",()=>{document.body.dataset.theme=b.dataset.theme;localStorage.setItem("gh-theme",b.dataset.theme);document.querySelectorAll(".theme-choice").forEach(x=>x.classList.toggle("active",x===b))}));
const theme=localStorage.getItem("gh-theme")||"midnight";if(theme!=="midnight")document.body.dataset.theme=theme;
document.querySelectorAll(".theme-choice").forEach(b=>b.classList.toggle("active",b.dataset.theme===theme));
render();renderRecent();
if("serviceWorker"in navigator&&location.protocol.startsWith("http"))addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));