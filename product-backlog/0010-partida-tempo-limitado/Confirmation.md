# Critérios de aceitação

O aluno deve conseguir:

- Escolher a duração da partida entre 5, 10 e 15 minutos antes do início, com 5 minutos selecionados por padrão. A duração escolhida permanece fixa durante a partida.
- Visualizar a fase de posicionamento e a contagem regressiva. O posicionamento ocupa, no máximo, o primeiro minuto do tempo total escolhido.
- Confirmar o posicionamento pelo botão Pronto. Quando ambos os jogadores confirmarem antes do fim do primeiro minuto, o combate começa imediatamente, mantendo o tempo restante e sem reiniciar o cronômetro.
- Desistir desde a fase de posicionamento e durante o combate, mediante confirmação. Cancelar a confirmação mantém a partida em andamento; confirmar encerra imediatamente a partida com vitória do adversário.

O sistema deve:

- Ao completar o primeiro minuto, caso o combate ainda não tenha começado, posicionar automaticamente as embarcações restantes em posições válidas e iniciar o combate.
- Manter o cronômetro correndo durante os ataques e as perguntas de Scrum, que são de múltipla escolha. Não disponibilizar pausa.
- Encerrar a partida imediatamente ao zerar o tempo, inclusive durante um ataque ou pergunta, bloqueando novos ataques e respostas. Somente ataques já efetivados por respostas corretas entram no resultado; respostas não enviadas antes do fim não efetivam ataques.
- Declarar vencedor o jogador que afundou mais navios ao terminar o tempo. Se as quantidades forem iguais, declarar empate.
- Encerrar antecipadamente a partida com vitória imediata do jogador que afundar toda a frota adversária.

## Verificação da Definition of Done

- Todos os critérios acima devem ser atendidos.
- Os testes aplicáveis devem passar, incluindo início antecipado, posicionamento automático, expiração durante pergunta, empate, destruição de toda a frota e confirmação ou cancelamento da desistência.
- Não deve haver defeitos conhecidos no incremento, em particular ataques efetivados após o encerramento ou reinício indevido do cronômetro.
- O fluxo de preparação, combate e encerramento deve poder ser demonstrado aos interessados.

A Definition of Done atual é uma proposta inicial; sua validação global permanece pendente. Nenhum de seus quatro itens foi considerado inaplicável a esta história.
