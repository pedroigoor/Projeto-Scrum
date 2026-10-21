import {Game,fleet,questions} from './game.js';
const $=id=>document.getElementById(id);
let game,names,viewer=0,vertical=false,passing=false;
const coord=c=>'ABCDEFGHIJ'[Math.floor(c/10)]+(c%10+1);
const time=ms=>{const s=Math.ceil(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;};
function pass(i){viewer=i;passing=true;$('play').hidden=true;$('handoffText').textContent=`Somente ${names[i]} deve olhar a próxima tela.`;if(!$('handoff').open)$('handoff').showModal();}
function board(id,player,own){
  const root=$(id);root.replaceChildren();
  for(let r=-1;r<10;r++)for(let c=-1;c<10;c++){
    if(r<0||c<0){const label=document.createElement('span');label.className='axis';label.textContent=r<0?(c<0?'':c+1):'ABCDEFGHIJ'[r];root.append(label);continue;}
    const cell=r*10+c,b=document.createElement('button');b.type='button';b.className='cell';
    const hit=player.hits.includes(cell), ship=own&&player.ships.some(s=>s.includes(cell));
    const miss=!own&&game.players[viewer].shots.includes(cell)&&!hit;
    b.textContent=hit?'×':miss?'•':ship?'■':'';b.classList.toggle('hit',hit);b.classList.toggle('ship',ship&&!hit);b.classList.toggle('miss',miss);
    b.setAttribute('aria-label',`${coord(cell)}${hit?' acerto':miss?' água':ship?' embarcação':''}`);
    b.disabled=own?(game.phase!=='preparation'||player.ready):game.phase!=='combat'||hit||miss||!!game.pending;
    b.onclick=()=>{if(own){if(!game.place(viewer,cell,vertical))game.message='Posição inválida: verifique limites e sobreposição.';}else{const before=game.turn;game.attack(cell);if(game.pending)showQuiz();else if(game.turn!==before)pass(game.turn);}render();};root.append(b);
  }
}
function showQuiz(){const q=questions[game.pending.question];$('question').textContent=q[0];$('options').replaceChildren();q[1].forEach((text,i)=>{const label=document.createElement('label'),input=document.createElement('input');input.type='radio';input.name='option';input.value=i;input.required=true;input.className='form-check-input me-2';label.append(input,document.createTextNode(text));$('options').append(label);});$('quiz').showModal();}
function render(){
  game.tick();
  if(game.phase==='ended'){
    for(const id of ['quiz','handoff','quit'])$(id).close();$('match').hidden=true;$('result').hidden=false;
    $('winner').textContent=game.result.winner===null?'Empate!':`${names[game.result.winner]} venceu!`;
    $('reason').textContent={time:'O tempo da partida terminou.',fleet:'Toda a frota adversária foi afundada.',resignation:'A partida terminou por desistência.'}[game.result.reason];
    $('finalScore').textContent=names.map((n,i)=>`${n}: ${game.score(i)} navios afundados`).join(' · ');return;
  }
  if(game.phase==='combat'&&viewer!==game.turn&&!game.pending)pass(game.turn);
  $('clock').textContent=time(game.remaining());$('prepClock').textContent=game.phase==='preparation'?`Preparação: ${time(Math.max(0,60000-(game.now()-game.started)))}`:'';
  $('phase').textContent=game.phase==='preparation'?'POSICIONAMENTO':'COMBATE';$('current').textContent=names[viewer];$('notice').textContent=game.message;
  $('controls').hidden=game.phase!=='preparation';$('controls').style.display=game.phase==='preparation'?'':'none';$('targetPanel').hidden=game.phase!=='combat';$('play').hidden=passing;
  $('ownTitle').textContent=game.phase==='preparation'?`Sua frota · ${game.players[viewer].ships.length}/10 · próximo: ${fleet[game.players[viewer].ships.length]||'—'} casas`:'Sua frota';
  $('ready').disabled=game.players[viewer].ships.length!==10||game.players[viewer].ready;$('auto').disabled=game.players[viewer].ready||game.players[viewer].ships.length===10;
  board('own',game.players[viewer],true);board('target',game.players[1-viewer],false);
  $('score').textContent=names.map((n,i)=>`${n}: ${game.score(i)} navios afundados`).join(' · ');
}
$('start').onsubmit=e=>{e.preventDefault();names=[$('p0').value.trim()||'Jogador 1',$('p1').value.trim()||'Jogador 2'];game=new Game(Number($('duration').value));$('setup').hidden=true;$('match').hidden=false;vertical=false;$('rotate').textContent='Orientação: horizontal';pass(0);render();};
$('continue').onclick=()=>{game.tick();$('handoff').close();passing=false;render();};
$('rotate').onclick=()=>{vertical=!vertical;$('rotate').textContent='Orientação: '+(vertical?'vertical':'horizontal');};
$('auto').onclick=()=>{game.tick();if(game.phase==='preparation'&&!game.players[viewer].ready)game.auto(viewer);render();};
$('ready').onclick=()=>{if(game.ready(viewer)){if(game.phase==='preparation')pass(1-viewer);else pass(game.turn);}render();};
$('answer').onsubmit=e=>{e.preventDefault();const selected=new FormData(e.target).get('option');if(selected===null)return;game.answer(Number(selected));$('quiz').close();if(game.phase!=='ended')pass(game.turn);render();};
$('resign').onclick=()=>{game.tick();if(game.phase!=='ended')$('quit').showModal();render();};
$('cancelQuit').onclick=()=>{$('quit').close();render();};$('confirmQuit').onclick=()=>{game.resign(viewer,true);render();};
// Permite desistir mesmo enquanto os diálogos bloqueiam o restante da tela.
for(const id of ['quiz','handoff']){
  const button=document.createElement('button');button.type='button';button.className='btn btn-outline-danger mt-3';button.textContent='Desistir';
  button.onclick=()=>{game.tick();if(game.phase!=='ended')$('quit').showModal();render();};$(id).append(button);
}
for(const id of ['handoff','quiz'])$(id).addEventListener('cancel',e=>e.preventDefault());
$('again').onclick=()=>{game=null;passing=false;$('result').hidden=true;$('setup').hidden=false;};
setInterval(()=>{if(!game)return;const previous=game.phase;game.tick();if(previous!==game.phase||game.phase==='ended')render();else{$('clock').textContent=time(game.remaining());$('prepClock').textContent=game.phase==='preparation'?`Preparação: ${time(Math.max(0,60000-(game.now()-game.started)))}`:'';}},200);
