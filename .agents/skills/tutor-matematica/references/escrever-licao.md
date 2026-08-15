# Escrever ou revisar uma lição

Usar com o `SKILL.md` de `tutor-matematica`. Este guia trata apenas da produção de páginas em `docs/`.

## Antes de editar

- Ler a lição anterior e a seguinte. Identificar o que já foi ensinado, o que será necessário depois e a ponte entre as ideias.
- Consultar `src/components/README.md` antes de inserir ou criar um desenho.
- Manter uma ideia central por página; cortar redundância, não profundidade.

## Estrutura mínima

Adaptar os títulos ao assunto, mas preservar esta ordem mental:

1. Problema motivador concreto, resolvido mais adiante pela própria lição.
2. Mapa das ideias: glossário curto dos termos a construir.
3. Uso prático e matemático da ideia.
4. Ideias anteriores que voltam: links e duas ou três perguntas de resgate, respondidas na página.
5. Intuição sem símbolos.
6. Modelo visual.
7. Ponte que explica por que a formalização é legítima.
8. Definições e fórmulas; cada definição com exemplo e contraexemplo.
9. Exemplos resolvidos, do simples ao composto; convidar uma tentativa a partir do segundo.
10. Perguntas de verificação sobre o porquê, com respostas em `<details>`.
11. Exercícios e gabarito.
12. Revisão curta: ideia central, uso e conexões.

Seguir sempre concreto → pictórico → abstrato. Não apresentar símbolos antes de a intuição e a imagem sustentá-los.

## Linguagem

- Trocar nomes abstratos de processos por ações que o aluno pode executar com papel e caneta. Explicar a ação junto da primeira menção a termos como “isolar”, “simplificar” ou “substituir”.
- Usar uma ideia por frase. Quebrar frases longas, mas escrever o conectivo que mostra causa, contraste, condição ou consequência.
- Usar analogias somente quando forem construídas: dizer a correspondência com o caso concreto e o limite da comparação. Remover metáforas decorativas, ironia e perguntas retóricas sem resposta.
- Substituir “isso”, “essa forma” e referências soltas pelo nome da coisa. Dizer a origem de todo número que reaparece.
- Remover “basta”, “apenas”, “é só”, “simplesmente”, “obviamente”, “claramente”, “naturalmente”, “fácil” e similares. Se a frase depender do advérbio, escrever o passo omitido.
- Fazer uma passada final de linguagem apenas no texto novo ou alterado; apontar problemas fora do diff, em vez de reescrever a página inteira.

## Recursos visuais

- Preferir os componentes SVG existentes (`AreaModel`, `NumberLine`, `FractionBar`) para áreas, retas e frações; criar um novo componente em `src/components/` seguindo os tons existentes se nenhum servir.
- Usar tabela Markdown para padrões entrada → saída e matriz KaTeX para alinhar manipulações algébricas.
- Não usar arte ASCII como desenho didático. Reservá-la a fluxos ou alinhamento monoespaçado.
- Usar componente interativo em MDX somente quando mudar um parâmetro for parte da ideia ensinada.
- Conferir todo desenho renderizado nos temas claro e escuro e em largura de celular. Usar no máximo três cores.

## Exercícios e gabarito

Organizar progressão: reconhecimento, explicação, aplicação direta, variação, problema misto e justificativa. Incluir dicas mínimas em `<details>` para os itens mais difíceis. Terminar toda lista com:

```md
<details>
<summary>Respostas para conferência</summary>

1. ...
</details>
```

Explicar a razão nos itens conceituais e de justificativa. Quando houver um erro provável, incluir diagnóstico que ajude o aluno a localizá-lo.

## Checklist didática

- [ ] Explicar para que serve a ideia, que problema resolve, em que se apoia e o que muda ou permanece igual em cada transformação.
- [ ] Resolver o problema motivador na própria página.
- [ ] Dar exemplo e contraexemplo a toda definição nova.
- [ ] Tratar erros comuns no corpo da lição.
- [ ] Responder às perguntas de verificação.
- [ ] Aplicar a passada de linguagem ao diff.
- [ ] Conferir cada visual renderizado em claro, escuro e celular.
- [ ] Reler como aluno e responder às perguntas que o texto ainda deixaria abertas.
