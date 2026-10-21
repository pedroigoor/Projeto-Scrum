// Composição provisória da frota, até o refinamento do item 2.
export const fleet = [4,3,3,2,2,2,1,1,1,1];
export const questions = [
  ['Quem ordena o Product Backlog?', ['Product Owner','Scrum Master','Gerente de projetos'],0],
  ['Qual evento inspeciona o resultado da Sprint com os interessados?', ['Daily Scrum','Sprint Review','Sprint Retrospective'],1],
  ['Qual é a duração máxima de uma Sprint?', ['Uma semana','Três meses','Um mês'],2],
  ['Quem cria o plano de trabalho da Sprint no Sprint Backlog?', ['Os Developers','Os clientes','Somente o Scrum Master'],0],
  ['Qual evento busca melhorar a qualidade e a eficácia do time?', ['Sprint Review','Sprint Retrospective','Daily Scrum'],1],
  ['Qual é o timebox da Daily Scrum?', ['15 minutos','Uma hora','30 minutos'],0],
  ['Qual compromisso está associado ao Incremento?', ['Product Goal','Sprint Goal','Definition of Done'],2],
  ['Qual destes é um pilar do empirismo no Scrum?', ['Hierarquia','Inspeção','Previsibilidade absoluta'],1]
];
export class Game {
  constructor(minutes=5, now=()=>Date.now(), random=Math.random) {
    if (![5,10,15].includes(minutes)) throw Error('Duração inválida');
    this.now=now; this.random=random; this.started=now(); this.deadline=this.started+minutes*60000;
    this.phase='preparation'; this.turn=0; this.pending=null; this.result=null; this.message='Posicione sua frota.';
    this.players=[0,1].map(()=>({ships:[],hits:[],shots:[],ready:false}));
  }
  remaining() { return Math.max(0,this.deadline-this.now()); }
  tick() {
    if(this.phase==='ended') return;
    if(this.remaining()===0) { const a=this.score(0), b=this.score(1); this.end(a===b?null:a>b?0:1,'time'); return; }
    if(this.phase==='preparation' && this.now()-this.started>=60000) {
      this.players.forEach((p,i)=>{this.auto(i);p.ready=true;}); this.phase='combat';this.turn=0;
      this.message='Combate iniciado. Escolha uma coordenada adversária.';
    }
  }
  score(i) { const enemy=this.players[1-i]; return enemy.ships.filter(s=>s.every(c=>enemy.hits.includes(c))).length; }
  place(i,cell,vertical=false) {
    this.tick(); const p=this.players[i];
    if(this.phase!=='preparation'||p.ready||p.ships.length===10||!Number.isInteger(cell)||cell<0||cell>99) return false;
    const size=fleet[p.ships.length], row=Math.floor(cell/10), col=cell%10;
    if((vertical?row:col)+size>10) return false;
    const cells=Array.from({length:size},(_,n)=>cell+n*(vertical?10:1));
    if(cells.some(c=>p.ships.some(s=>s.includes(c)))) return false;
    p.ships.push(cells);return true;
  }
  auto(i) {
    const p=this.players[i];
    while(p.ships.length<10) {
      const size=fleet[p.ships.length], options=[];
      for(let c=0;c<100;c++) for(const step of [1,10]) {
        if((step===1?c%10:Math.floor(c/10))+size>10)continue;
        const cells=Array.from({length:size},(_,n)=>c+n*step);
        if(!cells.some(x=>p.ships.some(s=>s.includes(x))))options.push(cells);
      }
      if(!options.length)throw Error('Sem posição válida');
      p.ships.push(options[Math.floor(this.random()*options.length)]);
    }
  }
  ready(i) {
    this.tick();const p=this.players[i];
    if(this.phase!=='preparation'||p.ships.length!==10||p.ready)return false;
    p.ready=true;
    if(this.players.every(x=>x.ready)){this.phase='combat';this.turn=0;this.message='Combate iniciado.';}
    return true;
  }
  attack(cell) {
    this.tick(); if(this.phase!=='combat'||this.pending||!Number.isInteger(cell)||cell<0||cell>99)return false;
    const p=this.players[this.turn],enemy=this.players[1-this.turn];
    if(p.shots.includes(cell)||enemy.hits.includes(cell))return false;
    if(enemy.ships.some(s=>s.includes(cell))) {
      this.pending={cell,question:Math.floor(this.random()*questions.length)};this.message='Alvo encontrado! Responda para efetivar o ataque.';
    } else {p.shots.push(cell);this.turn=1-this.turn;this.message='Água! Passe a vez.';}
    return true;
  }
  answer(option) {
    this.tick();if(this.phase!=='combat'||!this.pending||!Number.isInteger(option)||option<0||option>2)return false;
    const {cell,question}=this.pending,correct=option===questions[question][2];
    if(correct) {this.players[1-this.turn].hits.push(cell);this.players[this.turn].shots.push(cell);}
    this.pending=null;this.message=correct?'Resposta correta. Ataque efetivado!':'Resposta incorreta. Ataque não efetivado; coordenada disponível para nova tentativa.';
    if(this.score(this.turn)===10)this.end(this.turn,'fleet');else this.turn=1-this.turn;
    return true;
  }
  resign(i,confirmed=false) {this.tick();if(!confirmed||this.phase==='ended')return false;this.end(1-i,'resignation');return true;}
  end(winner,reason) {this.phase='ended';this.pending=null;this.result={winner,reason};}
}
