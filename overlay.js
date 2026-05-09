const API='/.netlify/functions/state';
const defaults={teamA:'AMIGOS DE LUÍS SÉRGIO',teamB:'VILA BELMIRO',abbrA:'ALS',abbrB:'VIL',colorA:'#0055ff',colorB:'#ff1f1f',scoreA:0,scoreB:0,yellowA:0,yellowB:0,redA:0,redB:0,seconds:0,period:'1º TEMPO'};
const pad=n=>String(n).padStart(2,'0'); const fmt=s=>`${pad(Math.floor(s/60))}:${pad(s%60)}`;
async function getState(){try{return {...defaults,...await fetch(API,{cache:'no-store'}).then(r=>r.json())}}catch(e){return defaults}}
async function setState(patch){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)}).then(r=>r.json())}

async function render(){
 const s=await getState();
 ['teamA','teamB','abbrA','abbrB','scoreA','scoreB','yellowA','yellowB','redA','redB','period'].forEach(id=>document.getElementById(id).textContent=s[id]);
 timer.textContent=fmt(Number(s.seconds||0)); colorA.style.background=s.colorA; colorB.style.background=s.colorB; cardsAName.textContent=s.abbrA; cardsBName.textContent=s.abbrB;
}
setInterval(render,700); render();
