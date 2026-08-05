# Escrever ou revisar uma lição

Complementa o `SKILL.md` — perfil do aluno, princípios, continuidade, regra
anti-mágica, erros comuns e estilo continuam valendo aqui. Este arquivo cobre só
o que é específico de produzir uma página em `docs/`.

## Conteúdo

- Antes de editar
- Estrutura de uma lição
- Recursos visuais
- Exercícios e gabarito
- Tamanho e escopo
- Revisão de lições existentes
- Checklist didático

## Antes de editar

A maior parte do trabalho é melhorar lições que já existem, não criar novas.

**Leia a lição anterior e a seguinte** antes de mexer numa página: é a única
forma de saber o que já foi ensinado e o que virá — e as quatro perguntas da
continuidade não têm resposta sem isso.

## Estrutura de uma lição

A ordem mental abaixo deve ser respeitada. Os títulos não precisam ser
literalmente estes — a lição-modelo usa títulos descritivos, como "Múltiplos:
resultados de uma contagem em saltos iguais", que funcionam melhor que rótulos
genéricos.

1. **Problema motivador** — uma situação concreta que torna o conceito
   necessário, antes de qualquer definição. A lição **volta e resolve este
   problema** assim que a ferramenta fica pronta: a ideia precisa pagar o que
   prometeu na abertura.
2. **Mapa das ideias** — glossário mínimo dos termos que a lição vai
   construir, uma linha por termo, como referência inicial.
3. **Uso** — onde a ideia aparece na prática e dentro da própria matemática.
4. **Ideias anteriores que voltam aqui** — nomeadas explicitamente, com link
   para a página onde foram estudadas, e **reativadas** com duas ou três
   perguntas rápidas de resgate, respondidas ali mesmo. Citar não basta: o
   aluno precisa trazer o bloco anterior de volta à memória antes de usá-lo —
   e descobrir agora, não no meio da lição, se precisa reler a página antiga.
5. **Intuição** — a ideia nova em linguagem comum, sem símbolos.
6. **Modelo visual** — tabela, desenho, reta numérica, área, agrupamento.
7. **Ponte para a formalização** — por que a passagem para símbolos é legítima.
8. **Formalização** — definições e fórmulas, só agora. Toda definição vem com
   **um exemplo e um contraexemplo** — é o contraexemplo que delimita o
   conceito ("7 é primo porque…; 12 não é, porque…").
9. **Exemplos resolvidos** — do simples ao composto. A partir do segundo,
   convide o aluno a tentar antes de ler a solução ("pause e tente"): exemplo
   lido passivamente ensina muito menos que exemplo tentado.
10. **Perguntas de verificação** — sobre o porquê, não sobre o procedimento,
    **com respostas** em `<details>`. Para quem estuda sozinho, pergunta sem
    resposta é beco sem saída, não estímulo. (Dívida conhecida: a lição-modelo
    ainda não traz essas respostas — neste ponto específico, siga este
    documento, não a lição-modelo.)
11. **Exercícios** com gabarito.
12. **Revisão curta** — a ideia central, quando usá-la, com o que ela se conecta.

Sempre concreto → pictórico → abstrato. Símbolo só depois de intuição e imagem.

## Recursos visuais

A etapa "modelo visual" não é opcional. Escolha a ferramenta pela natureza da
ideia, não pelo que é mais rápido de escrever:

- **Diagrama em SVG** — é o padrão para desenho: área, reta numérica, barra de
  frações. Os componentes prontos estão documentados em
  `src/components/README.md` (`AreaModel`, `NumberLine`, `FractionBar`), com
  props e exemplos copiáveis. São estáticos, custam quase o mesmo que um bloco
  de texto e usam KaTeX nos rótulos, então o desenho sai na mesma fonte das
  fórmulas ao redor. Se nenhum dos três servir, escreva um componente novo em
  `src/components/` seguindo os mesmos tons (`--mv-tone-1..3`) — é trabalho de
  meia hora, não de um dia.
- **Tabela markdown** — para padrão variando (entrada → saída, ciclos, tabuada,
  crescimento). Continua sendo o melhor recurso quando a ideia é uma
  correspondência, não uma forma.
- **Matriz KaTeX** (`\begin{array}`) — para alinhar passos de uma manipulação
  algébrica lado a lado.
- **Bloco ` ```text `** — hoje é o recurso mais frequente no repositório, por
  herança, e quase sempre é a escolha errada: arte ASCII ao lado de fórmulas
  KaTeX parece saída de terminal colada na página. Reserve-o para esquema de
  fluxo, tabela de alinhamento monoespaçado ou rascunho — nunca para um desenho
  que o `AreaModel`, a `NumberLine` ou a `FractionBar` fariam. Ao revisar uma
  lição por outro motivo, converta os blocos de desenho que você tocar.
- **Componente interativo** — React com estado e controle deslizante, em `.mdx`.
  Veja `src/components/DistributiveArea` e `src/components/FunctionGraph`. Use
  apenas quando **mexer no parâmetro é a ideia** que está sendo ensinada; uma
  figura que só ilustra deve ser SVG estático.

Duas obrigações ao entregar qualquer desenho:

- **Olhe a página renderizada**, não só o código-fonte. Rótulo cortado,
  sobreposição e estouro no celular não aparecem no diff.
- **Nunca mais de três cores.** Quando um diagrama parece precisar de uma
  quarta, quase sempre duas regiões representam a mesma quantidade e devem
  dividir a mesma cor — como os dois retângulos $ab$ em $(a+b)^2$.

## Exercícios e gabarito

Exercícios desenvolvem domínio, não repetição mecânica. Use a progressão em
seções numeradas, como na lição-modelo:

1. **Reconhecimento** — identificar a ideia ou a representação.
2. **Explicação** — dizer com palavras o que está acontecendo.
3. **Aplicação direta** — um caso simples.
4. **Variação** — caso parecido, com uma mudança importante.
5. **Problema misto** — combinando com ideias de lições anteriores.
6. **Justificativa** — por que o procedimento funciona.

Perguntas de verificação úteis: que ideia anterior estamos usando aqui? o que
mudou nesta transformação? o que permaneceu igual? por que esta operação é
permitida? como você verificaria isso com um desenho ou um número simples?

**Toda lista de exercícios termina com gabarito**, no formato:

```md
<details>
<summary>Respostas para conferência</summary>

1. ...

</details>
```

O gabarito não traz só o resultado: nos itens de explicação e justificativa, traz
a razão em uma ou duas frases. O aluno estuda sozinho e não tem quem corrija.

Dois reforços para quem não tem professor:

- **Dica antes da solução**, nos problemas mais difíceis: um `<details>` com
  `<summary>Dica</summary>` antes do gabarito, contendo o empurrão mínimo —
  nunca a resposta.
- **Diagnóstico de erro** no gabarito, quando o erro é previsível: "se você
  encontrou 36, provavelmente esqueceu o dobro do produto". Ninguém vai olhar
  a conta do aluno e apontar onde ele escorregou — o gabarito faz esse papel.

## Tamanho e escopo

**Não existe alvo de número de linhas.** A estrutura acima — motivador
resolvido, reativação do pré-requisito, intuição, modelo visual, formalização
com contraexemplo, exemplos resolvidos, erros comuns, perguntas de verificação
com resposta e gabarito comentado — custa o que custa. Aplicada com honestidade,
uma lição fica entre 900 e 1200 linhas, e as boas páginas do repositório estão
nessa faixa. Cortar para caber num número é cortar exatamente o que o aluno que
estuda sozinho não tem como repor.

O critério é outro: **uma ideia central por página**. A pergunta não é "está
longa demais?", e sim:

- a página tem **uma** ideia central, ou duas que só estão juntas por vizinhança
  temática?
- se são duas, a segunda **depende** da primeira ao ponto de separá-las obrigar
  a página nova a começar reensinando a anterior? Se depende, mantenha juntas.
- alguma seção repete o que outra já disse, ou acrescenta exemplo sem
  acrescentar entendimento?

Só a segunda resposta autoriza propor uma divisão — e proponha, em vez de
continuar acrescentando. O que sempre vale cortar é redundância, não
profundidade.

## Revisão de lições existentes

- Ao aprofundar uma explicação, verifique se o resto da página ainda flui: um
  parágrafo novo no meio pode duplicar algo que já vinha depois.
- Se a lição usa uma ideia sem ter apresentado, o conserto pode estar na página
  anterior, não nesta.

## Checklist didático

Antes de entregar qualquer lição nova ou revisada (além do checklist técnico de
`CLAUDE.md`):

- [ ] a lição responde: para que serve · que problema resolve · em que ideias
      anteriores se apoia · que ponte justifica cada transformação · o que muda e
      o que permanece igual em cada passo;
- [ ] o problema motivador é resolvido na própria lição;
- [ ] toda definição nova tem exemplo e contraexemplo;
- [ ] os erros comuns do conceito estão tratados no corpo da lição;
- [ ] as perguntas de verificação têm resposta;
- [ ] todo desenho novo foi conferido **na página renderizada**, nos temas claro
      e escuro e numa largura de celular;
- [ ] releitura final na pele do aluno: que pergunta ele faria que o texto não
      responde?
