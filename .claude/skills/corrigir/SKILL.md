---
name: corrigir
description: Corrige as resoluções que o aluno salvou no caderno — imagens do quadro digital em caderno/imagens/ ou anotações em texto em caderno/. Use quando o aluno pedir para corrigir o quadro, o caderno ou um exercício que ele acabou de resolver.
---

# Corrigir o caderno

O aluno resolve exercícios à mão no quadro digital (`npm run quadro`); cada
clique em "Salvar para correção" grava um PNG em `caderno/imagens/`, com data e
hora no nome. Este fluxo corrige essas resoluções.

## Passos

1. **Carregue a skill `tutor-matematica` antes de responder.** A correção é uma
   conversa de tutor, não um gabarito seco — valem o modo tutor, a regra
   anti-mágica e o tratamento de erros comuns definidos lá.

2. **Localize o material.** Sem indicação em contrário, corrija a imagem mais
   recente: `ls -t caderno/imagens/ | head`. Se o aluno pedir "tudo de hoje" ou
   citar um exercício pelo nome, selecione pelos carimbos de data e pelos
   títulos nos nomes de arquivo. Na dúvida entre duas imagens, pergunte.

3. **Leia a imagem com a ferramenta Read** e transcreva na resposta o que o
   aluno escreveu — enunciado, cada passo, resposta final — para ele confirmar
   que você leu certo. Se algum trecho estiver ilegível, diga qual e peça que
   reescreva ou salve uma foto melhor. **Não adivinhe conta ilegível.**

4. **Confira toda conta com `python3 -c`**, nunca de cabeça (regra de
   `CLAUDE.md`). Refaça o caminho do aluno passo a passo — o objetivo é achar
   **em qual passo** o raciocínio quebrou, não só dizer se a resposta final
   bate.

5. **Responda como tutor**, exercício por exercício:
   - comece pelo que está genuinamente certo — método válido, passo bem
     executado — sem elogio vazio;
   - no primeiro passo errado, mostre **por que** a passagem não vale (regra
     anti-mágica), de preferência desmontando o erro com um caso numérico
     simples;
   - **não entregue a resposta correta de imediato**: faça a pergunta que leva
     o aluno a se corrigir sozinho. Entregue a solução completa só se ele já
     tentou de novo e não saiu do lugar, ou se pedir;
   - se o erro é um dos previsíveis (somar denominadores, distribuir expoente
     sobre soma, sinal ao isolar termo…), nomeie o padrão e aponte a lição do
     curso em `docs/` que trata dele;
   - se estiver tudo certo, diga com clareza e proponha uma variação um degrau
     mais difícil, ligada à lição correspondente.

6. **Se for uma nova tentativa do mesmo exercício** (imagem anterior com o
   mesmo título), compare com a anterior e reconheça o progresso concreto.

## Limites

- Os arquivos de `caderno/` são o registro do aluno: **não os edite nem
  apague**.
- Se a dificuldade revelar lacuna numa lição do curso, aponte isso ao final da
  correção — consertar a lição é tarefa separada, que o aluno decide.
