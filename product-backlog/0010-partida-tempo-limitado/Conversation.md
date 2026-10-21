## 2026-10-21

**Scope:** Partida entre dois alunos com duração escolhida antes do início: 5, 10 ou 15 minutos, padrão de 5. A duração fica fixa. O primeiro minuto do tempo total é destinado ao posicionamento, com fase e contagem regressiva visíveis. Cada jogador pode confirmar o posicionamento pelo botão Pronto; se ambos confirmarem antes do minuto acabar, o combate começa imediatamente, mantendo o tempo restante, sem reiniciar o cronômetro. Caso contrário, ao completar um minuto, o sistema posiciona automaticamente as embarcações restantes em posições válidas e inicia o combate. Não há pausa.

**Users:** Alunos de uma disciplina de Scrum disputando uma partida entre dois jogadores.

**Edge cases:** O cronômetro continua durante perguntas de múltipla escolha. Ao zerar, a partida encerra imediatamente, inclusive durante ataque ou pergunta; somente ataques já efetivados por respostas corretas contam. Respostas não enviadas antes do fim não efetivam ataques. Vence quem afundou mais navios; igualdade resulta em empate. Afundar toda a frota adversária encerra a partida imediatamente com vitória. O botão Desistir está disponível desde o posicionamento e durante o combate; exige confirmação, e a confirmação encerra a partida imediatamente com vitória do adversário.

**Constraints:** O posicionamento consome o tempo total escolhido; uma partida de 5 minutos tem 4 minutos de combate se toda a preparação for usada, ou 4min30s se ambos confirmarem Pronto aos 30 segundos. As regras detalhadas de posicionamento e visualização da disputa serão refinadas nos itens 0020 e 0040. Histórico local e revisão educativa pertencem a outros Cards.

**Open questions:** Nenhuma pendência nas regras discutidas deste item. Critérios de aceitação aprovados pelo usuário e registrados em Confirmation.md. O refinamento dos itens 0020 e 0040 foi adiado por solicitação do usuário. Detalhes de implementação e dos itens relacionados não foram definidos nesta entrevista.
