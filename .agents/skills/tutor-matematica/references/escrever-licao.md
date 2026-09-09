# Escrever ou revisar uma lição

Complementa o `SKILL.md`: perfil do aluno, princípios, continuidade, regra
anti-mágica, erros comuns e estilo continuam valendo aqui. Este guia cobre o que
é específico de produzir uma página em `docs/`.

## Antes de editar

A maior parte do trabalho é melhorar lições que já existem, não criar novas.

Leia a lição anterior e a seguinte antes de mexer numa página. Isso revela o
que já foi ensinado, o que virá e a ponte entre as ideias. Consulte também
`src/components/README.md` antes de inserir ou criar um desenho.

## Estrutura de uma lição

Respeite esta ordem mental. Os títulos podem ser descritivos, em vez de repetir
os rótulos abaixo.

1. **Problema motivador** — situação concreta que torna o conceito necessário,
   antes de definições; a lição volta e o resolve quando a ferramenta estiver
   pronta.
2. **Mapa das ideias** — glossário mínimo dos termos que serão construídos.
3. **Uso** — onde a ideia aparece na prática e dentro da matemática.
4. **Ideias anteriores que voltam aqui** — nomeadas, ligadas à página onde
   foram estudadas e reativadas com duas ou três perguntas respondidas. Citar
   não basta: o aluno precisa trazer o bloco antigo de volta à memória.
5. **Intuição** — a ideia nova em linguagem comum, sem símbolos.
6. **Modelo visual** — tabela, desenho, reta numérica, área ou agrupamento.
7. **Ponte para a formalização** — por que a passagem para símbolos é legítima.
8. **Formalização** — definições e fórmulas, cada uma com exemplo e
   contraexemplo. O contraexemplo delimita o conceito.
9. **Exemplos resolvidos** — do simples ao composto. A partir do segundo,
   convide o aluno a tentar antes de ler a solução.
10. **Perguntas de verificação** — sobre o porquê, com respostas em
    `<details>`. Pergunta sem resposta deixa quem estuda sozinho sem saída.
11. **Exercícios** com gabarito.
12. **Revisão curta** — ideia central, quando usá-la e com o que ela se conecta.

Sempre siga concreto → pictórico → abstrato. Símbolo só depois de intuição e
imagem.

## Linguagem

A redação vale para corpo, exercícios, gabarito, dicas e legendas. O aluno lê
sozinho; uma frase ambígua consome a atenção que deveria acompanhar a
matemática.

### Ação concreta, não nome abstrato

Termos como “a manipulação”, “a obtenção”, “a aplicação da propriedade” e “o
procedimento” escondem quem faz o quê. Escreva o verbo e o movimento que a mão
faz com os números. Na primeira aparição, traduza verbos como “isolar”,
“simplificar” ou “substituir” em uma ação; só depois o termo técnico pode andar
sozinho.

Palavras aparentemente comuns que também pedem explicação na primeira vez:
**expressão, termo, parcela, fator, coeficiente, membro, satisfazer, verificar,
admitir, conjunto solução** e **forma**.

### Uma ideia por frase, com a ligação explícita

Frase longa obriga o aluno a guardar coisas demais. Quebre-a, mas mantenha o
conectivo que mostra causa, contraste, condição ou consequência: “Por isso”,
“Mas”, “Então” ou “Só que”. Frases curtas justapostas não devem transferir ao
aluno o trabalho de descobrir a relação entre elas.

Sinais de que uma frase precisa ser quebrada: mais de 25 palavras, dois
travessões, “— e”, “— ou seja”, “isto é” emendados ou orações explicativas
dependuradas umas nas outras.

### Analogia construída, não figura decorativa

Uma analogia é útil quando diz qual parte corresponde a qual e onde deixa de
valer. Metáfora decorativa, ironia e pergunta retórica sem resposta exigem que o
aluno adivinhe o sentido; troque-as pelo que querem dizer literalmente.

### Relações e referências escritas

Escreva causa, condição, contraste, finalidade e consequência. Troque “isso”,
“essa forma”, “ele”, “aqui” e “o mesmo raciocínio” pelo nome da coisa quando a
referência puder ficar solta. Quando um número reaparecer, diga sua origem.

Teste: para entender a frase, o aluno precisa de alguma ligação que o texto não
escreveu? Se precisa, escreva-a.

### Dificuldade não é tratada como trivial

Corte “basta”, “apenas”, “é só”, “simplesmente”, “obviamente”, “claramente”,
“naturalmente”, “evidentemente”, “fácil”, “nada mais é do que” e “como todos
sabem”. Se a frase depende de um desses advérbios, ele está escondendo um passo:
escreva o passo. Se o passo já foi ensinado na página, diga qual exemplo o
ensina.

Avisar que uma passagem é difícil ajuda; fingir que é fácil destrói a confiança
do aluno. Depois de acertar o conteúdo, faça uma passada de linguagem por vez.
Na revisão, limite essa passada ao trecho tocado; problemas fora do diff devem
ser apontados, não reescritos sem necessidade.

## Recursos visuais

O modelo visual não é opcional. Escolha a ferramenta pela natureza da ideia:

- **SVG** para áreas, retas numéricas e barras de fração. Use primeiro os
  componentes documentados em `src/components/README.md` (`AreaModel`,
  `NumberLine` e `FractionBar`). Se nenhum servir, crie um componente em
  `src/components/` seguindo os tons `--mv-tone-1..3`.
- **Tabela Markdown** para padrões que variam: entrada → saída, ciclos, tabuada
  e crescimento.
- **Matriz KaTeX** com `\begin{array}` para alinhar passos algébricos.
- **Bloco `text`** apenas para fluxo ou alinhamento monoespaçado; nunca como
  desenho didático quando SVG servir. Ao tocar numa arte ASCII por outro motivo,
  converta-a para o recurso visual adequado.
- **Componente interativo** em MDX somente quando alterar um parâmetro fizer
  parte da própria ideia ensinada. Figura meramente ilustrativa deve ser SVG
  estático.

Confira cada visual na página renderizada, nos temas claro e escuro e em largura
de celular. Não use mais de três cores; se parecer necessária uma quarta, duas
regiões provavelmente representam a mesma quantidade.

## Exercícios e gabarito

Exercícios desenvolvem domínio, não repetição mecânica. Organize a progressão:

1. Reconhecimento;
2. Explicação;
3. Aplicação direta;
4. Variação;
5. Problema misto;
6. Justificativa.

Perguntas úteis: que ideia anterior está sendo usada? O que mudou e o que
permaneceu igual? Por que a operação é permitida? Como verificar com desenho ou
número simples?

Toda lista termina assim:

```md
<details>
<summary>Respostas para conferência</summary>

1. ...
</details>
```

O gabarito explica a razão nos itens de explicação e justificativa. Para os
mais difíceis, coloque uma dica em `<details>` antes do gabarito, com o menor
empurrão útil. Quando houver erro previsível, inclua diagnóstico: ele substitui
a devolutiva que um professor daria.

## Tamanho, escopo e revisão

Não há meta de linhas. A estrutura completa custa o que custa. O critério é
**uma ideia central por página**: corte redundância, não profundidade. Só
proponha dividir a página se a segunda ideia não depender da primeira; se
depender, mantê-las juntas evita que a página nova comece reensinando a anterior.

Ao aprofundar uma explicação, confira o fluxo da página inteira para não
duplicar uma seção posterior. Se uma ideia foi usada antes de ser apresentada,
o conserto pode estar na página anterior. Não renomeie títulos sem necessidade,
pois eles são âncoras de links.

## Checklist didática

- [ ] A lição explica para que serve a ideia, que problema resolve, em que se
      apoia, que ponte justifica cada transformação e o que muda ou permanece
      igual em cada passo.
- [ ] O problema motivador foi resolvido na própria lição.
- [ ] Toda definição nova tem exemplo e contraexemplo.
- [ ] Erros comuns aparecem no corpo da lição.
- [ ] Perguntas de verificação têm resposta.
- [ ] A passada de linguagem foi aplicada ao texto novo ou alterado.
- [ ] Todo desenho novo foi conferido renderizado, em claro, escuro e celular.
- [ ] A releitura final responde às perguntas que o aluno ainda faria.
- [ ] Foram aplicados os requisitos de build, links, fórmulas e barra lateral
      de `AGENTS.md`.
