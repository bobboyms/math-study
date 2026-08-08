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
| fatorar como montar um retângulo: peças de $x^2$, $x$ e $1$ | `TileModel` |
| produto como volume, cubo da soma, $(a+b)^3$ | `CubeModel` |
| adição e subtração como deslocamento, múltiplos, intervalos, sinal | `NumberLine` |
| frações, equivalência, denominador comum | `FractionBar` |
| quantidade contável, grupos iguais, quadrado perfeito, comutativa | `DotArray` |
| a unidade em 100 partes: decimal ↔ fração ↔ porcentagem | `PercentGrid` |
| equação, operação aplicada aos dois lados | `Balance` |
| expressão lida como procedimento, operação inversa | `FunctionMachine` |
| decomposição em fatores primos | `FactorTree` |
| ângulo, triângulo, figura plana com medidas, figura composta | `GeoFigure` |
| ponto, reta, circunferência e gráfico de função no plano | `CartesianPlane` |
| seno e cosseno como coordenadas, quadrantes, arcos | `UnitCircle` |
| cilindro, cone, esfera, bloco — volume e superfície | `SolidFigure` |
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

## TileModel

O `AreaModel` visto do outro lado. Lá o retângulo já vem montado e a figura
mostra em que pedaços ele se corta; aqui as peças — o quadrado de lado $x$, a
tira de $x$ por $1$ e o quadradinho de lado $1$ — vêm soltas, e a pergunta é se
elas fecham um retângulo. É o desenho da **fatoração**, que é o caminho de
volta: dado o monte de peças, achar os dois lados.

```mdx
{/* o monte que a expressão entrega */}
<TileModel loose={{x2: 1, x: 8, one: 15}} caption="x² + 8x + 15 em peças." />

{/* a montagem que fecha: (x + 3)(x + 5) */}
<TileModel rows={['x', 3]} cols={['x', 5]} caption="..." />

{/* uma montagem que não fecha: faltam tiras */}
<TileModel rows={['x', 1]} cols={['x', 5]} ghost={[[0, 3], [0, 4], [0, 5]]} />

{/* agrupamento: o retângulo cortado em duas faixas */}
<TileModel
  rows={['x', 3]} cols={['x', 5]}
  splitAfter={0} bandLabels={['x(x + 5)', '3(x + 5)']}
/>
```

| Prop | O que faz |
|---|---|
| `rows`, `cols` | os lados, em pedaços: `'x'` é um comprimento $x$, e um número `n` vira `n` células de lado 1. `['x', 'x', 1]` é o lado $2x + 1$ |
| `loose` | `{x2, x, one}` — modo peças soltas, uma linha por tipo. Ignora `rows`/`cols` |
| `ghost` | `[[linha, coluna]]` na grade expandida — peça que **faltaria**, desenhada tracejada e sem cor |
| `splitAfter` | índice da linha depois da qual o desenho abre um vão; `splitGap` (padrão 0.7) é o tamanho dele em unidades |
| `bandLabels` | `[LaTeX, LaTeX]` — rótulo de cada faixa, à direita do desenho |
| `xLen` | comprimento visual de $x$, em unidades (padrão 3.2) |
| `unit` | pixels por unidade (padrão 26). Baixe para 22 quando o retângulo for muito largo |
| `perRow` | peças por linha no modo `loose` (padrão 8) |
| `baseLabel` | LaTeX no colchete de baixo. Sem a prop, sai automático (`x + 5`); `null` remove |
| `caption` | **texto simples**, não LaTeX |

Três tipos de peça, três tons: quadrado, tira, quadradinho. Os colchetes das
bordas juntam células vizinhas do mesmo tipo, então `cols={['x', 5]}` sai como
dois colchetes, "x" e "5", e não como seis.

Duas escolhas de desenho carregam argumento e não devem ser desfeitas: cada
peça é desenhada **uma a uma**, porque o que a lição quer é que as tiras se
contem ($5 + 3 = 8$) e os quadradinhos formem uma grade ($3 \times 5 = 15$); e o
$x$ mede 3,2 quadradinhos, um valor não inteiro de propósito, porque uma tira
com exatamente três quadradinhos afirmaria que $x = 3$. No modo `loose`, os
quadradinhos quebram a cada `perRow` justamente para **não** saírem numa grade
certinha — seria entregar a fatoração que o aluno deveria procurar.

Peça tem área, e área não é negativa: o modelo cobre o caso de dois números
positivos. Para $x^2 - 12x + 35$ não existe desenho de peças, e a lição precisa
dizer isso em vez de fingir que existe.

## CubeModel

O `AreaModel` um grau acima: cubo de aresta $a + b$ cortado nos oito pedaços de
$(a+b)^3$. Projeção cavaleira — a profundidade recua a 45° com escala reduzida.

```mdx
{/* cubo montado, com as linhas de corte à mostra */}
<CubeModel a={4} b={2} showPieceLabels={false} baseLabel="a + b" caption="..." />

{/* os oito pedaços separados */}
<CubeModel
  a={4} b={2}
  gap={4.4} gapY={1.2} depth={0.55}
  showEdgeLabels={false}
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `a`, `b` | proporção visual das duas arestas (em unidades) |
| `unit` | pixels por unidade (padrão 30) |
| `gap` | afastamento entre os pedaços na largura e na profundidade, em unidades. `0` (padrão) monta o cubo inteiro |
| `gapY` | afastamento na vertical (padrão: igual a `gap`) |
| `depth` | quanto a profundidade recua (padrão 0.5) |
| `aLabel`, `bLabel` | LaTeX nos colchetes das arestas |
| `pieceLabels` | `[a³, a²b, ab², b³]` em LaTeX — um rótulo por **tipo** de pedaço |
| `showPieceLabels` | `false` no cubo montado, onde metade dos pedaços está escondida |
| `showEdgeLabels` | `false` na vista explodida, onde os colchetes não medem mais nada |
| `baseLabel` | LaTeX num colchete embaixo, cobrindo a aresta inteira |
| `caption` | **texto simples**, não LaTeX |

O tom vem do **tipo** do pedaço, contando quantas arestas $b$ ele tem: $a^3$ sai
neutro (é o volume que já existia), e os três $a^2b$ dividem uma cor, os três
$ab^2$ dividem outra. São quatro tipos e três tons — o limite de três cores
continua valendo porque o neutro não gasta tom. Topo, frente e lado do mesmo
pedaço variam só a opacidade, para dar relevo sem gastar uma segunda cor.

**Por que `gap` e `gapY` são separados.** A profundidade recua na diagonal. Com
folga igual nos três eixos, cada pedaço de trás pousa exatamente sobre a aresta
da face superior do pedaço que está uma casa à frente na diagonal, e o rótulo
dele fica pela metade — não adianta aumentar a folga, porque os dois andam na
mesma diagonal. Separar as folgas quebra esse alinhamento. Os valores do exemplo
acima foram escolhidos por busca, verificando pedaço a pedaço que nenhum rótulo
cai dentro de um polígono desenhado depois; ao mexer neles, confira os oito.

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
| `marks` | `[{at, label?, tone?, open?}]` — ponto sobre a reta; `open: true` desenha a bola vazia |
| `spans` | `[{from, to, tone?}]` — faixa grossa translúcida sobre a reta |
| `caption` | texto simples |

Dois saltos que se cruzam precisam de `level` diferente, senão os arcos se
sobrepõem. Reta longa fica apertada no celular: prefira intervalos curtos, ou
aumente `step` e use `labelEvery`.

`open` é o que distingue $x < 3$ de $x \le 3$ no desenho: bola vazia exclui o
extremo, bola cheia inclui. Um intervalo é um `span` mais as duas bolas nas
pontas — `[2, 5)` sai de `spans={[{from: 2, to: 5}]}` com
`marks={[{at: 2}, {at: 5, open: true}]}`.

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

## GeoFigure

Figura plana em coordenadas do autor, com **y para cima**. Um só componente
cobre ângulo, triângulo, quadrilátero, figura composta e cota de medida —
porque todos são a mesma coisa: segmentos, arcos e rótulos.

```mdx
<GeoFigure
  polygons={[{points: [[0, 0], [4, 0], [4, 3]], tone: 1}]}
  angles={[
    {at: [4, 0], from: [0, 0], to: [4, 3], right: true},
    {at: [0, 0], from: [4, 0], to: [4, 3], label: '\\alpha', tone: 2},
  ]}
  dims={[{from: [0, 0], to: [4, 0], label: '4', offset: 24}]}
  points={[{at: [0, 0], label: 'A', place: 'below-left'}]}
  caption="Triângulo retângulo de catetos 4 e 3."
/>
```

| Prop | O que faz |
|---|---|
| `polygons` | `[{points, tone, fill, open}]` — `fill: false` desenha só o contorno; `open: true` não fecha o caminho |
| `segments` | `[{from, to, tone, dashed, arrow}]` — `arrow: true` põe ponta no fim, `'both'` nas duas |
| `dims` | `[{from, to, label, offset, tone}]` — cota: seta de duas pontas deslocada `offset` pixels para fora, com o rótulo no meio |
| `angles` | `[{at, from, to, label, tone, right, radius, labelRadius}]` — `at` é o vértice, `from` e `to` são pontos nos dois lados; `right: true` desenha o quadradinho |
| `arcs` | `[{at, r, from, to, tone, sector}]` — arco solto em graus; `sector: true` pinta a fatia |
| `ticks` | `[{from, to, count, tone}]` — traços no meio do lado, para marcar lados iguais |
| `points` | `[{at, label, tone, place, distance, open}]` — `place` é `'above'`, `'below-left'` etc. |
| `labels` | `[{at, math, tone, dx, dy, anchor}]` — rótulo solto, deslocável em pixels |
| `unit` | pixels por unidade do autor (padrão 34) |
| `bounds` | `[xMin, yMin, xMax, yMax]` — força o enquadramento; sem isso ele sai do conteúdo |
| `padding` | margem em pixels (padrão 44). **Aumente quando um rótulo encostar na borda** — o SVG recorta o que passa |

## CartesianPlane

O plano com eixos numerados e malha. É o irmão do `GeoFigure` para quando a
**posição** importa: lá a figura flutua no papel, aqui cada ponto tem endereço.

```mdx
<CartesianPlane
  xMin={-1} xMax={7} yMin={-1} yMax={6}
  points={[{at: [2, 1], label: 'A(2,1)', tone: 1}]}
  lines={[{m: 0.5, n: 1, tone: 2}]}
  circles={[{center: [3, 2], r: 2, tone: 3}]}
  functions={[{f: (x) => x * x, tone: 1}]}
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `xMin`…`yMax` | janela |
| `xUnit`, `yUnit` | pixels por unidade (padrão 30; `yUnit` herda `xUnit`) |
| `xStep`, `yStep` | espaçamento da malha; `xLabelEvery`, `yLabelEvery` numeram uma a cada N |
| `xTicks`, `yTicks` | `[{at, label}]` — substitui a numeração automática. `label` é LaTeX: é assim que o eixo sai em $\frac{\pi}{2}$, $\pi$, $\frac{3\pi}{2}$ |
| `functions` | `[{f, tone, domain, dashed}]` — `f` é uma função JavaScript, amostrada de pixel em pixel |
| `lines` | `[{m, n}]`, `[{through: [p, q]}]` ou `[{x: 3}]` para vertical; aceita `dashed` |
| `circles` | `[{center, r, tone, dashed}]` |
| `points`, `segments`, `polygons`, `labels` | como no `GeoFigure`, mas em coordenadas do plano |

**Atenção a uma diferença em relação ao `GeoFigure`:** aqui o rótulo de um ponto
**não** aceita `place`. Passar `place` não dá erro — ele é simplesmente ignorado,
e todo rótulo sai 18 pixels acima do ponto, que é o padrão. Para posicionar,
use `dx` e `dy` em pixels (`dy` positivo desce). É o que evita o rótulo do ponto
cair em cima da numeração do eixo.
| `showGrid`, `showNumbers` | desligam malha e numeração |
| `axisLabels` | `['x', 'y']` nas pontas dos eixos |

Toda curva é recortada pela caixa do gráfico. Sem isso, a tangente sairia por
cima do texto da lição.

## UnitCircle

A circunferência de raio 1 com o ângulo marcado a partir do eixo horizontal.

```mdx
<UnitCircle
  angles={[{deg: 50, label: '\\theta', showProjections: true, pointLabel: 'P(\\cos\\theta,\\ \\sen\\theta)'}]}
  quadrants
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `angles` | `[{deg, label, tone, showProjections, showTangentSegment, pointLabel, pointDx, pointDy, labelRadius, arcRadius, sinTone, cosTone}]` |
| `marks` | `[{deg, label, tone, labelRadius}]` — pontinho na circunferência com rótulo do lado de fora |
| `quadrants` | escreve I, II, III, IV |
| `quadrantNotes` | `[{quadrant: 1..4, math, tone, r}]` — texto dentro do quadrante (tabela de sinais) |
| `showTangent` | desenha o eixo das tangentes em $x=1$; `tangentClamp` limita a altura |
| `scale` | pixels por raio (padrão 120) |

`showProjections` desenha o cosseno no eixo horizontal e o seno no vertical
como **segmentos coloridos**, não como linhas auxiliares: eles *são* o seno e o
cosseno. O arco é amostrado ponto a ponto, então ângulo negativo sai no sentido
horário e ângulo maior que 360° sai como espiral — que é o desenho que explica
por que 390° e 30° caem no mesmo lugar.

## SolidFigure

Sólidos em perspectiva simples, com a metade escondida da base tracejada.

```mdx
<SolidFigure kind="cylinder" radiusLabel="r" heightLabel="h" caption="..." />
```

| Prop | O que faz |
|---|---|
| `kind` | `'cylinder'`, `'cone'`, `'sphere'` ou `'box'` |
| `rx`, `ry` | raio horizontal e achatamento da elipse da base |
| `height`, `width`, `depth` | dimensões em pixels |
| `radiusLabel`, `heightLabel`, `slantLabel` | cotas em LaTeX |
| `extraLabels` | `[{x, y, math, tone}]` — rótulo solto em pixels do viewBox |

---

## SvgMath

Helper interno (`mathviz/SvgMath.jsx`), usado pelos três. Renderiza LaTeX dentro
do SVG via `foreignObject`, para o rótulo do desenho sair na mesma fonte das
fórmulas da lição.

A caixa do `foreignObject` recorta o que passa dos limites. Rótulo encostado na
borda do desenho precisa de `space` (largura disponível do lado ancorado) —
foi o que fez o rótulo da linha aparecer cortado na primeira versão do
`AreaModel`. Use `halo` quando o rótulo puder cruzar um traço do desenho.
