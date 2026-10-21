import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Game,questions} from '../public/game.js';
function setup(minutes=5){let clock=0;const game=new Game(minutes,()=>clock,()=>0);return {game,advance:n=>clock+=n};}
function combat(ctx){ctx.game.players.forEach((p,i)=>{ctx.game.auto(i);ctx.game.ready(i);});}
test('durações permitidas e padrão de cinco minutos',()=>{
  for(const m of [5,10,15])assert.equal(setup(m).game.remaining(),m*60000);
  const defaultGame=new Game();assert.equal(defaultGame.deadline-defaultGame.started,300000);
  assert.throws(()=>new Game(7));
});
test('preparação automática aos 60 segundos mantém tempo restante e posições válidas',()=>{
  const c=setup();c.game.place(0,0);c.advance(59999);c.game.tick();assert.equal(c.game.phase,'preparation');
  c.advance(1);c.game.tick();assert.equal(c.game.phase,'combat');assert.equal(c.game.remaining(),240000);
  for(const p of c.game.players){assert.equal(p.ships.length,10);const cells=p.ships.flat();assert.equal(new Set(cells).size,cells.length);assert.ok(cells.every(x=>x>=0&&x<100));}
});
test('apenas um pronto não inicia; ambos antecipam sem reiniciar relógio',()=>{
  const c=setup();c.game.auto(0);c.game.auto(1);c.game.ready(0);assert.equal(c.game.phase,'preparation');
  c.advance(30000);c.game.ready(1);assert.equal(c.game.phase,'combat');assert.equal(c.game.remaining(),270000);
});
test('não confirma frota incompleta nem posiciona sobreposição ou fora dos limites',()=>{
  const {game:g}=setup();assert.equal(g.ready(0),false);assert.equal(g.place(0,9),false);assert.equal(g.place(0,0),true);assert.equal(g.place(0,0),false);
});
test('pergunta de múltipla escolha não pausa e resposta correta efetiva dano',()=>{
  const c=setup();combat(c);const g=c.game,target=g.players[1].ships[0][0];g.attack(target);assert.equal(questions[g.pending.question][1].length,3);
  c.advance(12000);assert.equal(g.remaining(),288000);g.answer(questions[g.pending.question][2]);assert.ok(g.players[1].hits.includes(target));assert.equal(g.turn,1);
});
test('erro não efetiva dano e permite nova tentativa em turno posterior',()=>{
  const c=setup();combat(c);const g=c.game,target=g.players[1].ships[0][0];g.attack(target);g.answer(1);assert.equal(g.players[1].hits.length,0);assert.ok(!g.players[0].shots.includes(target));assert.equal(g.turn,1);
});
test('expiração durante pergunta bloqueia resposta, ataque e desistência tardios',()=>{
  const c=setup();combat(c);const g=c.game;g.attack(g.players[1].ships[0][0]);c.advance(300000);
  assert.equal(g.answer(0),false);assert.equal(g.phase,'ended');assert.equal(g.players[1].hits.length,0);assert.equal(g.pending,null);assert.equal(g.attack(99),false);assert.equal(g.resign(0,true),false);assert.equal(g.result.reason,'time');
});
test('vence por navios totalmente afundados, não pelo número de casas atingidas',()=>{
  const c=setup();combat(c);const g=c.game;g.players[1].hits=[...g.players[1].ships[6]];g.players[0].hits=g.players[0].ships[0].slice(0,3);
  c.advance(300000);g.tick();assert.equal(g.result.winner,0);
});
test('empate por igualdade incluindo placar zero',()=>{
  for(const hit of [false,true]){const c=setup();combat(c);if(hit)c.game.players.forEach(p=>p.hits=[...p.ships[6]]);c.advance(300000);c.game.tick();assert.equal(c.game.result.winner,null);}
});
test('destruir toda a frota encerra antecipadamente',()=>{
  const c=setup();combat(c);const g=c.game,enemy=g.players[1],last=enemy.ships.flat().at(-1);enemy.hits=enemy.ships.flat().filter(x=>x!==last);
  g.attack(last);g.answer(0);assert.deepEqual(g.result,{winner:0,reason:'fleet'});assert.equal(g.attack(99),false);
});
test('desistência exige confirmação em preparação e combate',()=>{
  for(const startCombat of [false,true]){const c=setup();if(startCombat)combat(c);const g=c.game;assert.equal(g.resign(0,false),false);assert.notEqual(g.phase,'ended');assert.equal(g.resign(0,true),true);assert.deepEqual(g.result,{winner:1,reason:'resignation'});}
});
test('ataques em água alternam turno e coordenadas repetidas são rejeitadas',()=>{
  const c=setup();combat(c);const g=c.game;const water=Array.from({length:100},(_,i)=>i).find(x=>!g.players[1].ships.flat().includes(x));g.attack(water);assert.equal(g.turn,1);g.turn=0;assert.equal(g.attack(water),false);
});
