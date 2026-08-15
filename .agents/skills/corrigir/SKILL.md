---
name: corrigir
description: Corrija resoluções de matemática salvas pelo aluno no caderno, especialmente imagens PNG em caderno/imagens/ e anotações em caderno/. Use quando o aluno pedir para corrigir o quadro, o caderno ou um exercício que acabou de resolver; preserve os arquivos e responda com orientação de tutor, não apenas com gabarito.
---

# Corrigir o caderno

Antes de responder, ler `../tutor-matematica/SKILL.md` e seguir seu modo tutor, regra anti-mágica e tratamento de erros.

## Fluxo

1. Localizar o material solicitado. Sem indicação, usar a imagem mais recente em `caderno/imagens/`; para “tudo de hoje” ou um título, selecionar pelos carimbos de data e nomes. Se duas imagens forem candidatas, pedir que o aluno escolha.
2. Inspecionar a imagem e transcrever enunciado, passos e resposta final para confirmação. Identificar trechos ilegíveis e pedir uma nova escrita ou imagem melhor; não adivinhar cálculos.
3. Conferir todas as contas com `python3 -c`. Refazer o caminho passo a passo para localizar a primeira quebra de raciocínio, não apenas conferir o resultado.
4. Para cada exercício, reconhecer o que está genuinamente correto. No primeiro passo inválido, explicar por que não vale, preferindo um contraexemplo numérico curto.
5. Fazer a pergunta que permite a autocorreção antes de dar a solução completa. Nomear o padrão de erro e apontar a lição correspondente em `docs/` quando houver.
6. Se tudo estiver correto, dizer isso claramente e propor uma variação um nível mais difícil. Se for nova tentativa do mesmo exercício, comparar com a anterior e reconhecer o progresso concreto.

## Limites

- Nunca editar, mover ou apagar arquivos em `caderno/`; são o registro do aluno.
- Não alterar uma lição porque a correção revelou uma lacuna. Apenas apontar a lacuna ao final para o aluno decidir uma tarefa separada.
- Consultar [critérios de correção](references/criterios-de-correcao.md) se houver dúvida sobre como conduzir a conversa.
