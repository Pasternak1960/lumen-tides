const $=id=>document.getElementById(id);
let scene='title', index=0, rotation=[], history=[], turns=0, total=0, sound=false, audio;
const point=(x,y)=>[50+100*x,50+100*y];
const symbol=(x,y,fill,stroke)=>`<path d="M${x} ${y-24}l24 24-24 24-24-24z" fill="${fill}" stroke="${stroke}" stroke-width="3"/>`;

function chartArt(chart, trace) {
  const cells = Array.from({length:48},(_,i)=>{
    const x=i%8,y=Math.floor(i/8);
    return `<rect x="${100*x}" y="${100*y}" width="100" height="100" fill="${i%2?'#1e4645':'#183c3e'}" fill-opacity=".24" stroke="#426664" stroke-opacity=".36"/>`;
  }).join('');
  const coast = `<path d="M0 0H800V82L758 91 708 62 651 92 583 75 532 116 476 101 435 132 364 108 296 141 238 118 192 141 127 110 62 119 0 93ZM0 550L78 532 119 557 168 536 229 565 281 535 341 560 403 531 473 565 550 545 598 569 652 541 722 569 800 537V600H0Z" fill="#a66f48" fill-opacity=".14" stroke="#c29869" stroke-opacity=".42" stroke-width="2"/>`;
  const currents = Array.from({length:6},(_,i)=>`<path d="M-30 ${136+i*62} Q160 ${86+i*62} 326 ${157+i*62} T830 ${142+i*62}" fill="none" stroke="#73aa94" stroke-opacity=".12" stroke-width="1.4"/>`).join('');
  const rocks = chart.rocks.map(([x,y])=>{
    const [a,b]=point(x,y);
    return `<path d="M${a-28} ${b+11}l17 -31 28 -3 14 21 -12 19 -35 6z" fill="#253c34" stroke="#9d8060" stroke-width="2"/><path d="M${a-12} ${b-17}l15 14 14-17" fill="none" stroke="#a98a64" opacity=".62"/>`;
  }).join('');
  const rays=trace.rays.map(([x,y,a,b])=>`M${point(x,y).join(' ')}L${point(a,b).join(' ')}`).join(' ');
  const stations=chart.stations.map(([x,y])=>{
    const [a,b]=point(x,y),on=trace.lit.has(cellKey(x,y));
    return (on?`<circle class="lit-glow" cx="${a}" cy="${b}" r="38" fill="#7affdb" opacity=".4" filter="url(#glow)"/>`:'')+symbol(a,b,on?'#95ffe0':'#102b2a',on?'#e5fff6':'#e3b081')+`<circle cx="${a}" cy="${b}" r="5" fill="${on?'#155b50':'#e3b081'}"/>`;
  }).join('');
  const [a,b]=point(...chart.source);
  return `<svg viewBox="0 0 800 600" aria-hidden="true"><defs><filter id="glow"><feGaussianBlur stdDeviation="9"/></filter><radialGradient id="sea"><stop stop-color="#204f4a"/><stop offset="1" stop-color="#0b2a2d"/></radialGradient></defs><rect width="800" height="600" fill="url(#sea)"/>${currents}${coast}${cells}${rocks}<path d="${rays}" stroke="#60ffd4" stroke-width="15" opacity=".7" filter="url(#glow)"/><path d="${rays}" stroke="#9bffe6" stroke-width="5" stroke-linecap="round"/>${stations}<circle cx="${a}" cy="${b}" r="25" fill="#173c35" stroke="#97ffe1" stroke-width="3"/><path d="M${a-8} ${b-10}l21 10-21 10z" fill="#97ffe1"/></svg>`;
}

function recordTone(won=false) {
  if (!sound) return;
  try {
    audio ??= new AudioContext();
    const start=audio.currentTime;
    const notes=won?[392,494,587,784]:[440];
    notes.forEach((hz,i)=>{
      const tone=audio.createOscillator(), gain=audio.createGain(), now=start+i*.075;
      tone.frequency.value=hz;gain.gain.setValueAtTime(.07,now);gain.gain.exponentialRampToValueAtTime(.001,now+.19);
      tone.connect(gain);gain.connect(audio.destination);tone.start(now);tone.stop(now+.2);
    });
  } catch {}
}

function openChart(i) {
  index=i;scene='play';rotation=charts[i].relays.map(r=>r[2]);history=[];turns=0;
  render();
}

function turnRelay(i, fromKeyboard=false) {
  if (scene!=='play') return;
  history.push(i);rotation[i]^=1;turns++;
  const lit=traceLight(charts[index],rotation).lit.size;
  if (lit===charts[index].stations.length) {
    total+=turns;scene=index===charts.length-1?'end':'won';
    recordTone(true);
    render();
    $('action').focus({preventScroll:true});
  } else {
    recordTone();render();
    if (fromKeyboard) document.querySelector(`[data-relay="${i}"]`)?.focus({preventScroll:true});
  }
}

function render() {
  const title=scene==='title', end=scene==='end', won=scene==='won';
  const chart=charts[title?3:index];
  const orient=title?chart.solution:rotation;
  const trace=traceLight(chart,orient);
  $('coordinates').textContent=title?'NORTH COAST OBSERVATORY':end?'WATCH COMPLETE':chart.location.toUpperCase();
  $('title').innerHTML=title?'Lumen<br>Tides':end?'Coast<br>alight':chart.name;
  $('story').textContent=title?'A storm has darkened the coast. Turn the mirrors in the old relay network and bring five lighthouses back to life.':end?`All five beacons are transmitting. You restored the coast in ${total} turns.`:won?'The beacon is transmitting. The next station is ready.':chart.note;
  $('chartname').textContent=title?'NIGHT CHART / NORTH COAST':`BEACON ${index+1} / ${chart.location.toUpperCase()}`;
  $('meter').hidden=title;$('commands').hidden=scene!=='play';$('action').hidden=scene==='play';
  $('action').innerHTML=(title?'Begin the watch':end?'Play again':'Next beacon')+' <span aria-hidden="true">→</span>';
  $('signal').textContent=`${trace.lit.size}/${chart.stations.length}`;$('turns').textContent=end?total:turns;
  $('undo').disabled=history.length===0;
  $('message').textContent=won?'Signal confirmed.':'';
  $('progress').innerHTML=charts.map((_,i)=>`<div class="pip ${end||!title&&(i<index||won&&i===index)?'done':!title&&i===index?'current':''}"><span>${i+1}</span></div>`).join('');
  $('board').innerHTML=chartArt(chart,trace)+chart.relays.map(([x,y,,kind],i)=>{
    const type=kind==='split'?'Splitter':'Mirror';
    const style=`left:${(x+.5)*12.5}%;top:${(y+.5)*100/6}%`;
    const inside=`<span aria-hidden="true">${orient[i]?'╲':'╱'}</span>${kind?'<small aria-hidden="true">✦</small>':''}`;
    return scene==='play'
      ? `<button class="socket ${kind||''}" data-relay="${i}" style="${style}" aria-label="${type}, column ${x+1}, row ${y+1}, ${orient[i]?'backslash':'slash'}">${inside}</button>`
      : `<div class="socket ${kind||''}" style="${style};display:grid;place-items:center" aria-hidden="true">${inside}</div>`;
  }).join('');
}

$('action').onclick=()=>{if(scene==='title'||scene==='end'){total=0;openChart(0);}else openChart(index+1);document.querySelector('[data-relay]')?.focus({preventScroll:true});};
$('board').onclick=e=>{const b=e.target.closest('button[data-relay]');if(b) turnRelay(+b.dataset.relay,e.detail===0);};
$('board').onkeydown=e=>{
  const arrows={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1};
  if (!(e.key in arrows)||!e.target.matches('[data-relay]')) return;
  e.preventDefault();
  const items=[...$('board').querySelectorAll('button')];
  items[(items.indexOf(e.target)+arrows[e.key]+items.length)%items.length].focus();
};
$('undo').onclick=()=>{if(history.length){rotation[history.pop()]^=1;turns--;render();}};
$('reset').onclick=()=>openChart(index);
$('hint').onclick=()=>{
  const chart=charts[index], i=rotation.findIndex((v,j)=>v!==chart.solution[j]);
  if(i>=0){const [x,y]=chart.relays[i];$('message').textContent=`Try the relay in column ${x+1}, row ${y+1}.`;document.querySelector(`[data-relay="${i}"]`)?.focus({preventScroll:true});}
};
$('sound').onclick=()=>{sound=!sound;$('sound').setAttribute('aria-pressed',String(sound));$('sound').textContent=sound?'Sound on':'Sound off';recordTone();};
render();

