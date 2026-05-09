const API='/.netlify/functions/state';
const defaults={teamA:'AMIGOS DE LUÍS SÉRGIO',teamB:'VILA BELMIRO',abbrA:'ALS',abbrB:'VIL',colorA:'#0055ff',colorB:'#ff1f1f',scoreA:0,scoreB:0,yellowA:0,yellowB:0,redA:0,redB:0,seconds:0,period:'1º TEMPO'};
const pad=n=>String(n).padStart(2,'0'); const fmt=s=>`${pad(Math.floor(s/60))}:${pad(s%60)}`;
async function getState(){try{return {...defaults,...await fetch(API,{cache:'no-store'}).then(r=>r.json())}}catch(e){return defaults}}
async function setState(patch){return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(patch)}).then(r=>r.json())}

let teams=[]; let current={...defaults}; let timerInterval=null;
async function init(){teams=await fetch('teams.json').then(r=>r.json()); fill(teamASelect); fill(teamBSelect); current=await getState(); load(); bind(); setInterval(async()=>{current=await getState(); render()},1500)}
function fill(sel){teams.forEach((t,i)=>{let o=document.createElement('option');o.value=i;o.textContent=t.name;sel.appendChild(o)})}
function bind(){
 teamASelect.onchange=()=>setTeam('A',teams[teamASelect.value]); teamBSelect.onchange=()=>setTeam('B',teams[teamBSelect.value]);
 teamAName.oninput=()=>update({teamA:teamAName.value}); teamBName.oninput=()=>update({teamB:teamBName.value});
 abbrAInput.oninput=()=>update({abbrA:abbrAInput.value.toUpperCase()}); abbrBInput.oninput=()=>update({abbrB:abbrBInput.value.toUpperCase()});
 periodInput.onchange=()=>update({period:periodInput.value});
}
async function update(patch){current={...current,...patch}; render(); current=await setState(patch)}
async function setTeam(side,t){let patch={}; patch['team'+side]=t.name; patch['abbr'+side]=t.abbr; patch['color'+side]=t.color; await update(patch); load()}
function load(){teamAName.value=current.teamA;teamBName.value=current.teamB;abbrAInput.value=current.abbrA;abbrBInput.value=current.abbrB;periodInput.value=current.period;render()}
async function change(k,n){await update({[k]:Math.max(0,Number(current[k]||0)+n)})}
async function addSeconds(n){await update({seconds:Math.max(0,Number(current.seconds||0)+n)})}
function startTimer(){if(timerInterval)return;timerInterval=setInterval(()=>addSeconds(1),1000)}
function pauseTimer(){clearInterval(timerInterval);timerInterval=null}
async function resetTimer(){await update({seconds:0})}
async function resetMatch(){pauseTimer(); current={...defaults}; await setState(current); load()}
function render(){timerPreview.textContent=fmt(Number(current.seconds||0))}
init();
