# Componentes visuais das lições

Diagramas em SVG para a etapa "modelo visual" das lições. Todos são
**estáticos**: renderizam no build, não têm estado, não têm interação. Custam
quase o mesmo que um bloco ` ```text ` e ficam com a mesma cara do resto da
página, porque os rótulos são KaTeX — o mesmo motor das fórmulas do corpo do
texto.

Componente interativo (com controle deslizante) é outra coisa: veja
`DistributiveArea` e `FunctionGraph`, e o critério na skill `tutor-matematica`
— só quando **mexer no parâmetro é a ideia** sendo ensinada.

## Como usar numa lição

1. A página precisa ser `.mdx`. Se ainda for `.md`, renomeie com `git mv` — o id
   e a URL não mudam, porque o Docusaurus já ignora a extensão e o prefixo
   numérico. `sidebars.js` não precisa de ajuste.
2. Importe logo abaixo do frontmatter:

```mdx
---
title: Operações básicas
---

import AreaModel from '@site/src/components/AreaModel';
```

3. Use no corpo. Atenção ao escape: em `.mdx`, dentro de uma prop string você
   escreve LaTeX com **barra dupla** (`'4 \\times 5'`), porque a string passa
   pelo JavaScript antes de chegar ao KaTeX.

## Qual usar

| Ideia | Componente |
|---|---|
| produto como área, distributiva, produtos notáveis, fatoração | `AreaModel` |
| adição e subtração como deslocamento, múltiplos, intervalos, sinal | `NumberLine` |
| frações, equivalência, denominador comum | `FractionBar` |
| quantidade contável, grupos iguais, quadrado perfeito, comutativa | `DotArray` |
| a unidade em 100 partes: decimal ↔ fração ↔ porcentagem | `PercentGrid` |
| equação, operação aplicada aos dois lados | `Balance` |
| expressão lida como procedimento, operação inversa | `FunctionMachine` |
| decomposição em fatores primos | `FactorTree` |
| tabela de padrão (entrada → saída, ciclos, crescimento) | tabela markdown |
| passos alinhados de uma manipulação | `\begin{array}` em KaTeX |

`AreaModel` e `DotArray` são a mesma multiplicação vista de dois jeitos: no
primeiro a quantidade é área contínua, no segundo são objetos que dá para
contar um a um. Use `DotArray` quando o argumento depende de **contar**.

## Cores

Três tons, definidos em `src/css/custom.css` como `--mv-tone-1`, `--mv-tone-2` e
`--mv-tone-3`, com valores próprios para tema claro e escuro. Estão validados
para daltonismo e contraste nos dois temas.

**Não acrescente um quarto tom.** Quando um diagrama parece precisar de mais de
três cores, quase sempre duas regiões representam a mesma quantidade e devem
dividir a mesma cor — como os dois retângulos $ab$ em $(a+b)^2$.

Em todos os componentes, `tone` é `1`, `2` ou `3`; `0` é neutro (sem cor).

---

## AreaModel

Retângulo dividido em linhas e colunas. Uma linha × duas colunas é a
distributiva; duas × duas é o quadrado da soma.

```mdx
<AreaModel
  rows={[{size: 4, label: 'a = 4'}]}
  cols={[{size: 5, label: 'b = 5'}, {size: 6, label: 'c = 6'}]}
  cells={[['4 \\times 5 = 20', '4 \\times 6 = 24']]}
  baseLabel="b + c = 11"
  caption="O corte não muda a área total: 20 + 24 = 44."
/>
```

| Prop | O que faz |
|---|---|
| `rows` | `[{size, label}]` — `size` é a proporção visual (em unidades), `label` é LaTeX no colchete da esquerda |
| `cols` | idem, colchete de cima |
| `cells` | matriz `linha × coluna`. Cada item é uma string LaTeX, ou `{math, tone}`, ou `null` para célula vazia |
| `unit` | pixels por unidade de `size` (padrão 30) |
| `baseLabel` | LaTeX num colchete embaixo, cobrindo a largura toda |
| `caption` | **texto simples**, não LaTeX — legenda abaixo da figura |
| `labelWidth` | espaço reservado para o rótulo das linhas (padrão 56). Aumente se ele estiver sendo cortado |

O tom padrão de cada célula é `((linha + coluna) % 3) + 1`. Numa grade 2×2 isso
dá azul, laranja / laranja, verde — os dois produtos cruzados saem com a mesma
cor de propósito. Passe `{math, tone}` para escolher outra.

## NumberLine

Reta numérica com saltos, pontos e intervalos.

```mdx
<NumberLine
  min={-2}
  max={9}
  jumps={[
    {from: 0, to: 5, label: '+5', tone: 1},
    {from: 5, to: 2, label: '-3', tone: 2, level: 1},
  ]}
  marks={[{at: 2, label: '2', tone: 2}]}
  caption="Somar é andar para a direita; subtrair é andar para a esquerda."
/>
```

| Prop | O que faz |
|---|---|
| `min`, `max` | extremos da reta |
| `step` | espaçamento entre marcas (padrão 1) |
| `labelEvery` | numera uma marca a cada N (padrão 1) |
| `unit` | pixels por unidade (padrão 44) |
| `jumps` | `[{from, to, label?, tone?, level?}]` — seta curva com ponta na direção do movimento. `level` (0, 1, 2…) empilha arcos que se cruzariam |
| `marks` | `[{at, label?, tone?}]` — ponto cheio sobre a reta |
| `spans` | `[{from, to, tone?}]` — faixa grossa translúcida sobre a reta |
| `caption` | texto simples |

Dois saltos que se cruzam precisam de `level` diferente, senão os arcos se
sobrepõem. Reta longa fica apertada no celular: prefira intervalos curtos, ou
aumente `step` e use `labelEvery`.

## FractionBar

Barras divididas em partes iguais, com parte pintada. Todas as barras têm a
mesma largura total — é isso que torna a comparação honesta.

```mdx
<FractionBar
  bars={[
    {parts: 2, filled: 1, label: '\\frac{1}{2}', tone: 1},
    {parts: 6, filled: 3, label: '\\frac{3}{6}', tone: 2},
  ]}
  caption="Mesma quantidade, partes de tamanhos diferentes."
/>
```

| Prop | O que faz |
|---|---|
| `bars` | `[{parts, filled, label?, tone?}]` — `parts` divisões iguais, as `filled` primeiras pintadas |
| `barWidth` | largura da barra em pixels do viewBox (padrão 400) |
| `caption` | texto simples |

## DotArray

Pontos em linhas e colunas. Dois arranjos: grade (`rows` × `cols`) e grupos
separados (`groups` blocos de `perGroup`).

```mdx
<DotArray rows={4} cols={6} rowLabels={['\\text{caixa 1}']} caption="..." />
<DotArray groups={6} perGroup={4} tone={2} caption="..." />
<DotArray rows={5} cols={5} gnomon={4} caption="..." />
```

| Prop | O que faz |
|---|---|
| `rows`, `cols` | dimensões da grade |
| `rowLabels` | `[LaTeX]` — rótulo à direita de cada linha |
| `groups`, `perGroup` | modo grupos: N blocos separados de M pontos |
| `groupLabels` | `[LaTeX]` — rótulo abaixo de cada grupo |
| `gnomon` | pinta com o segundo tom tudo fora do quadrado `n × n` — o "L" que leva de $n^2$ a $(n+1)^2$ |
| `tone` | `1`, `2` ou `3` |

## PercentGrid

A unidade em 100 partes, com as `filled` primeiras pintadas da esquerda para a
direita. Liga as três escritas: $\frac{25}{100}$, $0{,}25$ e $25\%$.

```mdx
<PercentGrid filled={25} caption="..." />
```

## Balance

A equação como balança. Cada estado é uma linha; `op` é a operação aplicada aos
dois lados, mostrada na seta entre um estado e o seguinte.

```mdx
<Balance
  states={[
    {left: '8 + 3x', right: '23'},
    {left: '3x', right: '15', op: '\\text{tira } 8 \\text{ dos dois lados}'},
  ]}
  caption="..."
/>
```

Um único estado desenha uma balança sozinha; vários desenham o caminho inteiro.

## FunctionMachine

Cadeia de transformações: valor, operação, novo valor.

```mdx
<FunctionMachine
  input="x"
  steps={[{op: '\\text{dobrar}', value: '2x'}]}
  back="\text{metade}"
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `input` | LaTeX do valor de entrada (desenhado com borda tracejada) |
| `steps` | `[{op, value, tone?}]` — `op` vai sobre a seta, `value` é o chip seguinte |
| `back` | seta de volta por baixo, para o par que desfaz (quadrado ↔ raiz) |

## FactorTree

Árvore de fatoração calculada **a partir do número**, não escrita à mão — a
figura não tem como discordar da conta.

```mdx
<FactorTree n={60} caption="..." />
```

A cada nível o menor primo sai à esquerda e o quociente desce à direita. As
folhas coloridas são a decomposição. Número primo não gera árvore.

---

## SvgMath

Helper interno (`mathviz/SvgMath.jsx`), usado pelos três. Renderiza LaTeX dentro
do SVG via `foreignObject`, para o rótulo do desenho sair na mesma fonte das
fórmulas da lição.

A caixa do `foreignObject` recorta o que passa dos limites. Rótulo encostado na
borda do desenho precisa de `space` (largura disponível do lado ancorado) —
foi o que fez o rótulo da linha aparecer cortado na primeira versão do
`AreaModel`. Use `halo` quando o rótulo puder cruzar um traço do desenho.
