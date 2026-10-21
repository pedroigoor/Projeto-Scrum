# Batalha Naval Scrum

Aplicação Node.js com HTML, Bootstrap 5.3.8 e JavaScript, sem dependências de execução externas ao Node.

## Executar

Requer Node.js 20 ou superior.

```sh
npm start
# Abrir http://localhost:3000
npm test
```

Dois jogadores usam o mesmo dispositivo, alternando a vez com uma tela de passagem. Não há multiplayer em rede. Bootstrap é carregado por CDN e requer internet para seu estilo completo. O estado fica em memória no navegador; recarregar encerra a sessão local.

## Item 1

Duração fixa de 5 (padrão), 10 ou 15 minutos. O primeiro minuto inclui posicionamento; ambos prontos antecipam o combate sem reiniciar o relógio. Ao terminar a preparação, navios restantes são posicionados automaticamente. Não há pausa. O relógio também corre nas telas de passagem, perguntas e confirmação de desistência.

O tempo usa um prazo absoluto, evitando depender da frequência dos intervalos do navegador. Ao terminar, ações são bloqueadas antes de processar respostas. Vitória por maior número de navios afundados, empate por igualdade, vitória antecipada por destruição de toda a frota ou desistência confirmada.

### Decisões provisórias para demonstração

Os itens 2 e 4 ainda não foram refinados. Para viabilizar o item 1, a frota tem tamanhos 4, 3, 3, 2, 2, 2, 1, 1, 1, 1, sem sobreposição e podendo encostar. O posicionamento segue essa ordem. O jogador 1 inicia. Cada ataque, inclusive um acerto, alterna a vez. Uma resposta errada não causa dano e permite tentar aquela coordenada em outra vez. Perguntas são sorteadas de um banco inicial e podem repetir. Essas escolhas ainda precisam de validação nos respectivos itens.

Histórico persistente, revisão das perguntas e os demais itens do backlog não estão implementados. O item 1 não foi marcado como concluído: a DoD global e a demonstração pelos interessados permanecem pendentes.
