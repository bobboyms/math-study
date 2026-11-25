# Componentes visuais das lições

Diagramas em SVG para a etapa "modelo visual" das lições. Os diagramas
**estáticos** renderizam no build, não têm estado, não têm interação. Custam
quase o mesmo que um bloco ` ```text ` e ficam com a mesma cara do resto da
página, porque os rótulos são KaTeX — o mesmo motor das fórmulas do corpo do
texto.

Além deles há dois tipos de figura com movimento, e o critério de escolha está
na seção "Recursos visuais" da skill `tutor-matematica`:

- **interativo** (controle deslizante) — quando a ideia é uma **relação**
  entre quantidades que variam juntas;
- **animado** — quando a ideia é um **processo**: algo gira, enrola, se
  remonta. Toda animação usa o hook `useAnimation` (abaixo), que começa quando
  a figura entra na tela, oferece “ver de novo” e mostra direto o quadro final
  para quem pediu menos movimento ao sistema.

As lições-modelo com os dois tipos são `geometria/radianos`, uma ideia que se
move, e `algebra/fator-comum-em-evidencia`, uma ideia simbólica.

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
| fator comum em evidência: retângulos de mesma altura que se juntam (fatorar) ou se separam (distribuir) | `CommonFactorArea` (animado; interativo com `slider`) |
| parte numérica do fator comum: em quantos montes iguais as peças se dividem (MDC) | `EqualGroups` (interativo) |
| parcela × fator, fator comum, o 1 que sobra: cada parcela como fila de cartões de fatores | `FactorCards` (animado) |
| trocar a letra por um número: conferir equivalência, flagrar o erro que coincide num valor, achar onde zera | `SubstituteExplorer` (interativo) |
| produto como volume, cubo da soma, $(a+b)^3$ | `CubeModel` |
| adição e subtração como deslocamento, múltiplos, intervalos, sinal | `NumberLine` |
| frações, equivalência, denominador comum | `FractionBar` |
| quantidade contável, grupos iguais, quadrado perfeito, comutativa | `DotArray` |
| a unidade em 100 partes: decimal ↔ fração ↔ porcentagem | `PercentGrid` |
| direta, inversa ou nenhuma: qual coluna (quociente ou produto) fica constante | `ProportionTable` (interativo) |
| equação, operação aplicada aos dois lados | `Balance` |
| expressão lida como procedimento, operação inversa | `FunctionMachine` |
| decomposição em fatores primos | `FactorTree` |
| escolhas em etapas, sequências e contagem das possibilidades | `ChoiceTree` |
| ângulo, triângulo, figura plana com medidas, figura composta | `GeoFigure` |
| área constante com mesma base e altura; altura × lado inclinado | `ShearExplorer` (interativo) |
| área do círculo por fatias remontadas, aproximar e refinar | `CircleSlices` (interativo) |
| figura composta: soma × diferença, área × perímetro de um entalhe | `CompositeAreaExplorer` (interativo) |
| conferir ângulo reto pela trena, recíproca de Pitágoras | `RightAngleExplorer` (interativo) |
| ponto, reta, circunferência e gráfico de função no plano | `CartesianPlane` |
| girar um tambor e ver o cabo enrolar: giro → comprimento | `WinchExplorer` (interativo e animado) |
| a definição de 1 radiano: o raio colado na borda | `RadianString` (animado) |
| quantos raios cabem em ¼, ½ e 1 volta; os mesmos pedaços numa régua | `RadianCount` (animado) |
| o mesmo ângulo em graus e em radianos, conversão por fração de 180° | `DegreeRadianDial` (interativo) |
| roda rolando: distância → ângulo e voltas, $\theta = s/r$ | `RollingWheel` (interativo e animado) |
| a reta numérica enrolada no círculo de raio 1 | `WrapLine` (interativo e animado) |
| seno e cosseno como coordenadas, quadrantes, arcos | `UnitCircle` |
| arrastar o giro e ver cosseno e seno acompanharem o ponto; voltas inteiras e giros negativos | `CycleExplorer` (interativo e animado) |
| roda-gigante: o giro vira altura, $h = 22 + 20\sen\theta$ | `FerrisWheel` (interativo e animado) |
| ângulo de referência: cada ponto do ciclo é o espelho de um ponto do 1º quadrante | `ReferenceAngle` (interativo e animado) |
| a tangente lida na reta $x = 1$: T sobe sem fim perto de 90° e some em 90° | `TangentAxisExplorer` (interativo e animado) |
| laser a 1 m da parede: giros iguais, subidas cada vez maiores; o feixe paralelo em 90° e o prolongamento para trás depois | `LaserWall` (interativo e animado) |
| o gráfico da tangente nascendo da altura de T, na mesma escala; período π com o giro oposto (`pair`) | `TangentGraphTracer` (interativo e animado) |
| chegar perto de π/2 pelos dois lados: a distância cai 10 vezes, a tangente cresce 10 vezes, a escala acompanha | `TangentAsymptoteZoom` (interativo, com zoom animado) |
| a reta y = c corta cada ramo da tangente uma vez, para qualquer c; contraste com o seno | `TangentLevelLine` (interativo) |
| setor circular: ângulo e raio → arco, área e borda; setor de coroa (limpador) | `SectorExplorer` (interativo e animado) |
| o setor que vira triângulo de base $s$ e altura $r$: $A = \frac12 rs$ | `SectorUnroll` (animado) |
| o mesmo triângulo como razões, ponto do ciclo e ponto do gráfico | `TrigBridge` |
| o ciclo desenrolado: o ponto gira e a altura (ou a abscissa) é levada até o gráfico, que vai sendo traçado; roda-gigante com os giros anotados | `WaveTracer` (interativo e animado) |
| período como cópia: o trecho de uma volta copiado 2π para cada lado | `WavePeriodCopies` (animado) |
| reta horizontal y = c sobre o gráfico: quantas soluções tem sen x = c numa janela | `WaveLevelCounter` (interativo) |
| giro θ e giro −θ no círculo e no gráfico: seno ímpar, cosseno par | `WaveSymmetry` (interativo) |
| o seno deslizado h para a esquerda cai sobre o cosseno em h = π/2 | `WaveShift` (interativo e animado) |
| em radianos, arco percorrido e altura na mesma régua: $\sen x \approx x$ perto de zero | `ArcHeightCompare` (interativo) |
| variar o giro e acompanhar uma coordenada no gráfico (hoje sem uso nas lições; a 7.21 usa o `WaveTracer`) | `CycleGraphExplorer` (interativo) |
| um parâmetro de $a\sen(bx+c)+d$ por vez: $d$ sobe, $a$ estica, $b$ muda o ritmo (ondas em $2\pi$), $c$ desliza; o erro de ler a fase sem dividir por $b$ | `WaveParameterExplorer` (interativo e animado) |
| os quatro ajustes da maré, um de cada vez, do seno básico até a curva da tábua | `TideFit` (animado, com botões por ajuste) |
| comparar amplitude, período, fase e deslocamento vertical, os quatro juntos | `TrigParametersExplorer` (interativo) |
| braço robótico: a calculadora recebe só a altura (arcsen) ou y/x (atan) e erra o lado; atan2 acerta | `RobotArmInverse` (interativo e animado) |
| teste da reta horizontal no seno; trechos candidatos para inverter; nome de cada solução (α, π − α, voltas) | `HorizontalLineSine` (interativo) |
| onde cada inversa procura a resposta no ciclo: metade direita (arcsen, arctg) ou de cima (arccos) | `InverseCycle` (interativo e animado) |
| o gráfico da inversa como o trecho guardado dobrado sobre y = x (arcsen, arccos, arctg) | `InverseReflect` (animado) |
| caixote na rampa: o peso se reparte em P sen θ (ao longo) e P cos θ (contra a rampa); `solved` mostra os valores | `RampForces` (animado) |
| relação fundamental como identidade: cos² + sen² termina sempre no 1; cos + sen anda com o giro | `IdentityBars` (interativo e animado) |
| um seno, dois pontos do ciclo: a relação dá o tamanho do cosseno, o quadrante dá o sinal | `SameSinePoints` (interativo) |
| secante e cossecante como 1 dividido por cosseno e seno: nunca no meio da faixa de −1 a 1, no máximo numa ponta | `ReciprocalLine` (interativo) |
| dividir a relação por cos² (ou sen²) é ampliar o triângulo do ciclo até x = 1 (ou y = 1): 1 + tg² = sec², 1 + cotg² = cossec² | `ReciprocalTriangle` (interativo e animado) |
| dois giros seguidos: a subida do segundo depende de onde ele começa; barras "somando" × "de verdade" contra a linha do comprimento do braço | `AngleSumRise` (animado; interativo com `sliders`) |
| de onde vêm as parcelas de $\sen(a \pm b)$ e $\cos(a \pm b)$: o triângulo do ângulo $b$ girado de $a$, cada cateto separado em vertical e horizontal, régua que empilha as parcelas; giro para trás (`backward`), arco duplo (`double`) | `AngleSumRotation` (animado e interativo) |
| as três escritas de $\cos 2a$ como três caminhos na reta numérica que chegam ao mesmo ponto | `DoubleCosineRoutes` (interativo) |
| $A\sen x + B\cos x$ é uma onda só, $R\sen(x+\varphi)$: o ponto $(A, B)$ dá $R$ e $\varphi$, e a soma cai sobre a onda | `SineCosineCombo` (interativo) |
| roda-gigante de $h(t) = 25 - 20\cos(\pi t)$ com o gráfico na mesma escala: instantes numa altura (`showTimes`) e trechos acima dela (`band`) | `TrigEqWheel` (interativo e animado) |
| isolar a função trigonométrica como desfazer a receita, da última conta para a primeira; para na camada do cosseno | `TrigEqLayers` (animado) |
| a reta da equação no ciclo: horizontal (seno), vertical (cosseno) ou de O até T (tangente); dois giros espelhados, um, ou nenhum fora de [−1, 1] | `TrigEqCycleLine` (interativo) |
| os dois encontros da primeira volta copiados uma volta para cada lado, com a tabela de k | `TrigEqCopies` (animado) |
| busca dos k cujas soluções caem num intervalo, com registro das tentativas e contagem | `TrigEqInterval` (interativo, busca) |
| sen(2x) = 1/2: o giro u = 2x anda duas voltas, e cada encontro desce até u/2 | `TrigEqArgument` (animado) |
| equação do 2º grau em sen x: cada raiz u vira uma reta horizontal no ciclo; u fora da faixa não dá ângulo | `TrigEqRoots` (animado, com botões por equação) |
| cilindro, cone, esfera, bloco — volume e superfície | `SolidFigure` |
| volume do cilindro e do cone, efeito do $r^2$ contra o da altura | `CylinderConeExplorer` (interativo) |
| secante girando na direção da tangente, derivada como limite | `TangentExplorer` (interativo) |
| área sob a curva por retângulos, soma de Riemann, integral | `RiemannSum` |
| vetor como seta no plano, soma de vetores, decomposição | `CartesianPlane` com `segments` de `arrow: true` |
| quatro corridas soltas ao mesmo tempo (`mode="routes"`); as setas deslizam até uma saída comum e as iguais caem uma sobre a outra (`mode="compare"`) | `DeliveryVectors` (animado) |
| “ande 5 quarteirões”: setas de comprimento 5 em todas as direções, pontas numa circunferência | `FiveBlocksCircle` (animado) |
| a mesma seta deslizando pelo plano sem girar; ponto × vetor com os mesmos números; chegada = saída + vetor | `VectorSlide` (interativo e animado) |
| dois números guardam a seta: anda $a$ na horizontal, depois $b$ na vertical, e o sinal vira lado | `VectorSteps` (animado, com botões) |
| $\overrightarrow{AB} = B - A$: o caminho de A até B em dois trechos, e o sentido trocado | `VectorBetween` (animado, com botões) |
| módulo pelo Pitágoras com coordenadas negativas; seta × caminho em “L” | `VectorLength` (interativo) |
| vetor nulo: a volta no quarteirão, caminho andado × deslocamento | `ZeroTrip` (animado) |
| vetor oposto: a cópia que gira meia volta; contraexemplo que troca um sinal só | `OppositeVector` (animado) |
| o barco atravessa o rio com motor e correnteza agindo juntos: a trilha inclinada e o ponto “sem correnteza” | `BoatCurrent` (animado) |
| soma por ponta com cauda: u, depois v a partir da ponta de u, e a seta da saída até a chegada | `TipToTail` (animado) |
| por que a soma é coordenada a coordenada: os passos horizontais e verticais deslizam até duas faixas e se encostam | `SumByAxis` (animado, com pares de vetores nos botões) |
| regra do paralelogramo e comutativa: as cópias de v e de u deslizam e fecham no mesmo canto | `SumParallelogram` (animado) |
| subtração: a seta da ponta de v até a ponta de u, a cópia na origem e a leitura u + (−v); com `tips`, AB = B − A | `VectorDifference` (animado) |
| número vezes vetor: k estica, encolhe ou vira a seta na reta de v; com `targets`, a busca por múltiplos (paralelos) | `ScaleVector` (interativo, com passeio inicial do k) |
| combinação linear como receita: voltas de dois motores, malha das receitas inteiras, registro das receitas que acertam o alvo | `RobotRecipe` (interativo e animado) |
| andar uma fração t do caminho: T = A + t·AB, ponto médio em t = 1/2 | `PathFraction` (interativo) |
| distributiva k(u + v) = ku + kv como triângulo ampliado, semelhante ao original | `ScaledSumTriangle` (interativo) |
| comprimento da soma contra a soma dos comprimentos: ângulo entre b (8) e c (6), réguas de 14 e de ‖b + c‖ | `SumLengthAngle` (interativo) |
| o avião e o vento: uma hora de voo em que o vento arrasta o avião para fora da direção do nariz; a resolução por decompor, somar e recompor | `PlaneWind` (animado) |
| a mesma instrução por coordenadas (andar em L) e por tamanho e ângulo (linha reta) | `TwoRoutes` (animado) |
| o ângulo do vetor: o giro a partir do semieixo x positivo, a reta da direção, o ângulo de referência como contraexemplo | `VectorAngleDial` (interativo e animado) |
| todo vetor é um ponto do ciclo esticado: $r(\cos\theta,\ \sen\theta)$ | `StretchedCycle` (interativo e animado) |
| componentes como sombras com sinal nos eixos; o triângulo retângulo que dá só o tamanho (`triangle`) | `ComponentShadows` (interativo) |
| a divisão b/a enxerga a reta e não o lado: o arco tangente e a meia volta; tabela de vetores anotados (`record`) | `ArctanHalfTurn` (interativo e animado) |
| normalizar: a seta encolhe (ou estica) até o ciclo; o erro de dividir pela soma das coordenadas | `NormalizeShrink` (animado, com botões de vetor) |
| carrinho puxado rampa acima: a corda desalinhada da rampa (`mode="question"`); a força dividida em parte útil e parte perpendicular, com o ângulo da corda num controle (`mode="solved"`) | `RampPull` (animado; interativo no modo resolvido) |
| produto escalar como a conta da nota de compra: par com par, depois a soma; trocar as colunas (comutativa) e dobrar uma lista | `DotPairs` (animado, com botões) |
| sinal do produto escalar: u parado, v nos controles, a reta perpendicular a u dividindo o plano; com `readout="angle"`, o ângulo pelo arco cosseno | `DotSignExplorer` (interativo) |
| girar as duas setas juntas não muda o produto; no fim v deita no eixo e sobra sombra × tamanho; controles de tamanhos e ângulos com as duas contas lado a lado | `DotRotateInvariant` (animado e interativo) |
| produto escalar como sombra de u sobre a reta de v vezes o tamanho de v; sombra negativa com ângulo obtuso | `DotShadow` (interativo) |
| produto zero é ângulo reto: uma cópia de (2, 3) gira um quarto de volta e o produto cai de 13 a 0; contraexemplo (−2, 3) | `PerpTurn` (animado) |
| regra $m_1 \times m_2 = -1$ como produto escalar das direções $(1,\ m)$; reta horizontal e vertical | `SlopeDirections` (interativo) |
| tamanho da soma e o dobro do produto: barco de 8 km/h e correnteza de 6 km/h com o ângulo num controle (10 com 90°, 14 com 0°, 2 com 180°) | `DotSumLength` (interativo) |
| a busca do ponto mais perto numa reta: emenda arrastada pela estrada, ramal medido, tabela de tentativas; a resolução com o pé H, o ângulo reto e a comparação por Pitágoras (`mode="solved"`) | `CableSearch` (interativo, com registro) |
| o gesto da projeção: da ponta de v desce a linha em ângulo reto, a sombra cresce até o pé, a linha vira o resto | `ProjectionDrop` (animado) |
| o ângulo entre v e u decide o lado da sombra; o tamanho com sinal da sombra calculado por ‖v‖ cos θ e por (v · u)/‖u‖ (`show="comp"`) | `ProjectionExplorer` (deslizante) |
| a sombra como tamanho vezes direção: u encolhe até o unitário e estica até a sombra; o erro de dividir só uma vez por ‖u‖ (`error`) | `ProjectionBuild` (animado) |
| o número k conta quantos u cabem na sombra: cópias de u encostadas como régua | `ProjectionRuler` (animado, com botões de caso) |
| só o k da fórmula deixa o resto em ângulo reto; Pitágoras só vale para partes perpendiculares (`pythagoras`) | `ResidualSlider` (deslizante) |
| só a direção de u importa: c u estica, encolhe ou vira, e a sombra fica parada; c = 0 sem reta | `ProjectionScale` (deslizante) |
| o ponto da reta mais perto de P: AP, a sombra a partir de A, o pé H e a distância; o erro de projetar o próprio P (`error`); outro ponto Q e Pitágoras (`compare`) | `PointToLine` (animado) |
| duas rotas com tempo: as rotas crescendo (`routes`), um controle por drone para achar o cruzamento (`places`), um controle só para ver se batem (`meeting`) | `DroneRoutes` (animado e interativo) |
| a reta como caminhada A + t·d: passos inteiros, fracionários e negativos; o botão da semirreta | `LineWalker` (animado e interativo) |
| o teste de pertencer: cada coordenada da seta AX pede um número de passos; se combinam, o ponto está na reta | `LineReach` (busca com registro) |
| as paramétricas como duas sombras, uma em cada eixo, cada uma com o seu passo | `ParametricShadows` (animado e interativo) |
| a mesma reta com outra receita (outro ponto de partida, outro diretor) e o contraexemplo | `SameLineRecipes` (interativo) |
| a inclinação vem do diretor: escadinha de a na horizontal e b na vertical; a = 0 é vertical | `SlopeSteps` (interativo) |
| o vetor normal: a seta entre dois pontos da reta faz produto escalar zero com (a, b) | `NormalVector` (interativo) |
| a reta por um ponto e pelo normal; o sinal do produto escalar diz o lado | `NormalSide` (interativo) |
| a distância se mede na direção do normal, qualquer que seja o ponto A da reta | `DistanceAlongNormal` (animado e interativo) |
| a conta ax + by + c como régua: paralelas a cada \|n\| de conta ficam a 1 de distância | `LevelLines` (interativo) |
| o ponto da rota mais perto de um lugar: produto escalar com o diretor negativo, zero, positivo | `ClosestOnRoute` (animado e interativo) |
| cena 3D montada peça a peça (setas, pontos, caixas, polígonos, ângulo reto, arco), girável em torno de z | `SpaceScene` |
| o endereço (x, y, z) percorrido em três movimentos, com zeros e coordenada negativa | `SpaceWalk` |
| dois pontos diferentes que caem no mesmo lugar do papel; caixa e mesa giratória | `DepthTwins` |
| Pitágoras duas vezes: diagonal do chão, depois o triângulo em pé | `FloorThenUp` |
| a vertical perpendicular a toda linha do chão (esquadro girando em volta do poste) | `PoleSquare` |
| diagonal da caixa contra o caminho pelas arestas, com deslizantes | `BoxDiagonalExplorer` |
| o mesmo vetor do espaço desenhado em dois lugares (cópia que desliza) | `SpaceVectorSlide` |
| soma de vetores no espaço, ponta com cauda, e 2u | `SpaceTipToTail` |
| dois vetores do espaço cabem numa folha plana: a folha gira até ficar de frente | `SheetFlatten` |
| ângulo entre arestas e diagonais de um cubo, pelo produto escalar | `CubeAngles` |
| o drone do depósito (motivador da 7.34 e a resolução) | `DroneFlight` |
| matriz 2×2 como transformação: malha antes e depois, colunas = imagens de $\vec{e}_1$ e $\vec{e}_2$ | `LinearMap` |
| ponto e vetor no espaço, eixos $x$, $y$, $z$, a “caixa” das coordenadas | `Space3D` |
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
| `spans` | `[{from, to, tone?, continuesLeft?, continuesRight?}]` — faixa grossa translúcida; as opções `continuesLeft` e `continuesRight` acrescentam uma seta colorida quando a faixa não termina naquele lado |
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
| `chipWidth` | largura das caixas em px (padrão 82); aumente quando um valor como `u = 3x+1` quebraria a linha |

## FactorTree

Árvore de fatoração calculada **a partir do número**, não escrita à mão — a
figura não tem como discordar da conta.

```mdx
<FactorTree n={60} caption="..." />
```

A cada nível o menor primo sai à esquerda e o quociente desce à direita. As
folhas coloridas são a decomposição. Número primo não gera árvore.

## ChoiceTree

Árvore de escolhas calculada a partir das opções de cada etapa. Cada caminho
completo gera uma folha e uma sequência, escrita à direita. A legenda informa
a quantidade de folhas. Não atribui probabilidades aos ramos.

```mdx
import ChoiceTree from '@site/src/components/ChoiceTree';

<ChoiceTree
  stages={['AB', '12'].map((options) => [...options])}
  caption="Uma letra seguida de um algarismo."
/>
<ChoiceTree
  stages={[['A', 'B', 'C'], ['A', 'B', 'C']]}
  repeat={false}
  caption="Duas letras diferentes, com ordem."
/>
```

| Prop | O que faz |
|---|---|
| `stages` | lista de etapas; cada etapa é uma lista de opções distintas em LaTeX |
| `repeat` | `false` exclui opções que já apareceram no caminho (padrão `true`) |
| `caption` | legenda em português; o total de resultados é acrescentado pelo componente |

Use em exemplos pequenos, com duas etapas e até nove folhas. Rótulos de uma
letra ou algarismo mantêm a figura legível no celular. A tabela da lição pode
descrever por extenso o que cada símbolo representa.

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
| `arcs` | `[{at, r, from, to, tone, sector}]` — arco solto em graus, de `from` até `to` no sentido anti-horário (escreva `from` menor que `to`: um semicírculo voltado para a direita é `from: -90, to: 90`); `sector: true` pinta a fatia; o enquadramento automático inclui o arco inteiro |
| `ticks` | `[{from, to, count, tone}]` — traços no meio do lado, para marcar lados iguais |
| `points` | `[{at, label, tone, place, distance, open}]` — `place` é `'above'`, `'below-left'` etc. |
| `labels` | `[{at, math, tone, dx, dy, anchor}]` — rótulo solto, deslocável em pixels |
| `unit` | pixels por unidade do autor (padrão 34) |
| `bounds` | `[xMin, yMin, xMax, yMax]` — força o enquadramento; sem isso ele sai do conteúdo |
| `padding` | margem em pixels (padrão 44). **Aumente quando um rótulo encostar na borda** — o SVG recorta o que passa |

## ShearExplorer

Mesma base, mesma altura. Um controle deslizante empurra o topo da figura para o
lado, sobre uma reta paralela à base. Os lados inclinados mudam de comprimento,
e a área não muda. É o argumento interativo contra o erro de usar o lado
inclinado como altura. No triângulo, o topo pode passar além das pontas da base:
a altura cai fora da figura, a base é prolongada em tracejado e a área continua
a mesma. No paralelogramo, o painel mostra também o produto errado $b \times \ell$
mudando enquanto a área fica parada.

```mdx
import ShearExplorer from '@site/src/components/ShearExplorer';

<ShearExplorer shape="triangle" />
<ShearExplorer shape="parallelogram" />
```

| Prop | O que faz |
|---|---|
| `shape` | `'triangle'` (padrão) ou `'parallelogram'` |
| `base`, `height` | medidas fixas (padrão 6 e 4) |
| `sMin`, `sMax` | faixa do deslocamento do topo, passo 0,5 (padrão −3 a base + 3 no triângulo; 0 a 5 no paralelogramo) |
| `initial` | deslocamento inicial (padrão 2) |

## CircleSlices

O círculo cortado em $n$ fatias iguais e remontado com as fatias alternadas,
uma de ponta para cima, outra de ponta para baixo. As fatias são setores de
verdade, com a borda curva, então o serrilhado aparece. Um retângulo tracejado
de base $\pi r$ e altura $r$ fica por cima. O deslizante muda $n$ (sempre par),
e o painel mostra, num círculo de raio 10 cm, a altura de cada dente e o avanço
da lateral inclinada. A área não muda; só a diferença para o retângulo encolhe.
É a dedução de $A = \pi r^2$.

```mdx
import CircleSlices from '@site/src/components/CircleSlices';

<CircleSlices />
```

| Prop | O que faz |
|---|---|
| `initialSlices` | número inicial de fatias, par (padrão 12) |
| `min`, `max` | limites do deslizante (padrão 4 e 60) |

## CompositeAreaExplorer

Retângulo com um entalhe retangular recortado do lado de cima, **no canto** (L)
ou **no meio** (U). Dois deslizantes mudam largura e profundidade do entalhe;
dois botões trocam o desenho entre a decomposição por soma (pedaços, com a linha
de corte tracejada) e por diferença (retângulo cheio menos o entalhe). O painel
mostra as duas contas de área, o perímetro percorrendo a borda lado a lado e
quanto daria somar os perímetros dos pedaços — sempre o dobro da linha de corte
a mais. Mexer no entalhe é a ideia: as duas decomposições concordam, e área e
perímetro mudam de forma independente (no canto o perímetro fica fixo; no meio,
cresce duas vezes a profundidade).

```mdx
import CompositeAreaExplorer from '@site/src/components/CompositeAreaExplorer';

<CompositeAreaExplorer />
```

| Prop | O que faz |
|---|---|
| `width`, `height` | retângulo envolvente, em metros (padrão 6 e 4) |
| `initialNotchWidth`, `initialNotchDepth` | entalhe inicial, múltiplos de 0,5 (padrão 2 e 1,5 — a sala em L da lição) |
| `initialPosition` | `'corner'` (padrão) ou `'middle'` |

Os deslizantes andam de 0,5 em 0,5 m; no meio, a largura máxima deixa pernas de
pelo menos 0,5 m.

## CylinderConeExplorer

Cilindro com o cone de mesma base e mesma altura desenhado dentro dele. Dois
deslizantes, raio (1 a 4 dm) e altura (1 a 8 dm), e botões “Dobrar o raio”,
“Dobrar a altura” e “Voltar ao início”. As medidas são em decímetros para o
volume sair direto em litros. O painel mostra os dois volumes e o fator do
volume em relação ao ponto de partida, escrito como
(fator do raio)² × (fator da altura) — é o $r^2$ da fórmula em ação.

```mdx
import CylinderConeExplorer from '@site/src/components/CylinderConeExplorer';

<CylinderConeExplorer />
```

| Prop | O que faz |
|---|---|
| `initialRadius` | raio inicial em dm, múltiplo de 0,5 (padrão 2) |
| `initialHeight` | altura inicial em dm, múltiplo de 0,5 (padrão 4) |

O desenho tem escala fixa (pixels por decímetro), ao contrário do `SolidFigure`:
o aluno precisa ver o cilindro engordar quando o raio cresce. Não troque pelo
`SolidFigure`.

## RightAngleExplorer

O pedreiro sem esquadro. A linha da primeira parede é fixa; a da segunda gira em
torno da estaca do canto, e o aluno a controla por um deslizante. O ângulo começa
**escondido**: a única informação é a leitura da trena entre as marcas de 3 m e
4 m, arredondada ao centímetro. O painel compara $d^2$ com $3^2 + 4^2$ e diz se o
canto está aberto, fechado ou reto. Mexer na linha até a trena bater é a ideia
da recíproca de Pitágoras.

```mdx
import RightAngleExplorer from '@site/src/components/RightAngleExplorer';

<RightAngleExplorer />
```

| Prop | O que faz |
|---|---|
| `initialAngle` | ângulo inicial do canto, em graus, múltiplo de 0,5 (padrão 84) |
| `initialSize` | triângulo inicial: `0` é 60 cm · 80 cm · 1 m, `1` é 1,5 · 2 · 2,5 m, `2` é 3 · 4 · 5 m (padrão) |

O arredondamento ao centímetro é parte do argumento, não detalhe: é ele que faz o
triângulo pequeno aprovar um canto de 89,5° e o grande reprovar. Não troque por
leitura exata.

## ProportionTable

Direta, inversa ou nenhuma das duas. Três situações fixas — gasolina a
R\$ 6,20 o litro, viagem de 300 km e conta de luz com R\$ 30 de taxa mínima
mais R\$ 0,80 por kWh. Uma tabela de duas linhas: a de referência fica parada,
a outra segue um deslizante. As duas últimas colunas trazem o quociente
$y \div x$ e o produto $x \times y$ de cada linha, e a coluna que não muda é
destacada. Na conta de luz nenhuma fica parada, e o painel aponta a taxa fixa
como culpada. Mexer no valor e ver qual coluna fica parada é a ideia do teste de
proporcionalidade.

```mdx
import ProportionTable from '@site/src/components/ProportionTable';

<ProportionTable />
```

Sem props: as três situações e seus números são os da lição
`numeros-e-operacoes/razao-e-proporcao`, que os cita no texto. Se mudar um
número aqui, mude lá também.

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
| `lines[].muted`, `segments[].muted` | `true` desenha em cinza médio, que recua nos dois temas — para malhas auxiliares e prolongamentos. Prefira a `tone: 0`, que no tema escuro sai quase branco e compete com as setas |
| `segments[].arrow` | `true` põe ponta de seta no fim (`to`) — é assim que se desenha um **vetor**. Só a ponta final; não existe `'both'` aqui. O rótulo do segmento (`label`) sai no meio, deslocável com `dx`/`dy` |

**Atenção a uma diferença em relação ao `GeoFigure`:** aqui o rótulo de um ponto
**não** aceita `place`. Passar `place` não dá erro — ele é simplesmente ignorado,
e todo rótulo sai 18 pixels acima do ponto, que é o padrão. Para posicionar,
use `dx` e `dy` em pixels (`dy` positivo desce). É o que evita o rótulo do ponto
cair em cima da numeração do eixo.
| `showGrid`, `showNumbers` | desligam malha e numeração |
| `axisLabels` | `['x', 'y']` nas pontas dos eixos |

Toda curva é recortada pela caixa do gráfico. Sem isso, a tangente sairia por
cima do texto da lição.

**Ordem das camadas**, de baixo para cima: malha; `polygons`, `circles` e
`lines`; eixos; números dos eixos; `functions`; e por fim `segments`, `points`
e `labels`. Os gráficos de `functions` passam por cima dos números, para que o
fundo de um rótulo como $\frac{\pi}{2}$ nunca apague um pedaço da curva. As
retas ficam por baixo: uma assíntota vertical cai exatamente sobre o número do
eixo, e ali é o número que precisa ficar legível.

A numeração automática sai com vírgula decimal e sinal de menos tipográfico
(“0,5”, “−1,5”). Quando o “−1” do eixo x colidiria com o “−1” do eixo y perto
da origem (unidades pequenas), o número do eixo x é empurrado para a esquerda
do próprio traço, até abrir um vão; se a unidade for pequena demais para isso,
ele sobe para cima do eixo. Nenhum número é omitido.

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
| `angles` | `[{deg, label, tone, showProjections, showTangentSegment, tangentLabel, pointLabel, pointDx, pointDy, labelRadius, arcRadius, sinTone, cosTone}]` — sem `labelRadius`, o rótulo do ângulo se afasta do centro o bastante para não encostar nos lados (ângulo pequeno, rótulo mais longe); `tangentLabel` escreve um rótulo (como `T`) na ponta do segmento da tangente |
| `marks` | `[{deg, label, tone, labelRadius}]` — pontinho na circunferência com rótulo do lado de fora |
| `quadrants` | escreve I, II, III, IV |
| `quadrantNotes` | `[{quadrant: 1..4, math, tone, r}]` — texto dentro do quadrante (tabela de sinais) |
| `showTangent` | desenha o eixo das tangentes em $x=1$; `tangentClamp` limita a altura, e a altura da figura acompanha esse limite |
| `scale` | pixels por raio (padrão 120) |

`showProjections` desenha o cosseno no eixo horizontal e o seno no vertical
como **segmentos coloridos**, não como linhas auxiliares: eles *são* o seno e o
cosseno. O arco é amostrado ponto a ponto, então ângulo negativo sai no sentido
horário e ângulo maior que 360° sai como espiral — que é o desenho que explica
por que 390° e 30° caem no mesmo lugar.

## CycleExplorer

O `UnitCircle` com o ângulo vivo. O aluno arrasta o giro e vê o cosseno
(segmento verde no eixo horizontal) e o seno (laranja, no vertical)
acompanharem o ponto, trocando de sinal quando ele passa para a esquerda ou
para baixo. Ao aparecer na tela, o ponto gira de `from` até `initial`.

```mdx
<CycleExplorer initial={140} from={0} presets={[0, 90, 140, 180, 270]} />
<CycleExplorer initial={390} min={-360} max={720} showTurns presets={[30, 390, 750, -330]} />
```

| Prop | O que faz |
|---|---|
| `initial`, `from`, `duration` | giro final e inicial da animação, em graus, e a duração em segundos |
| `min`, `max`, `step` | faixa do deslizante (padrão 0 a 360, de 5 em 5) |
| `presets` | botões de giro pronto |
| `showTurns` | acrescenta ao painel a redução à primeira volta (“750° são 2 voltas e mais 30°”) |
| `caption` | **texto simples** |

O rótulo $\theta$ some depois de uma volta: o meio da espiral cai longe do
ponto, e o rótulo ali confundiria.

## FerrisWheel

A roda-gigante da lição do ciclo trigonométrico, em escala: 20 m de raio,
centro a 22 m do chão. A régua à direita acompanha a altura da cadeirinha.

```mdx
<FerrisWheel initial={150} />            {/* motivador: a altura é a pergunta */}
<FerrisWheel initial={210} showHeight /> {/* resolução: 22 + 20 sen θ */}
```

Sem `showHeight`, a régua sai inteira e o painel pergunta a altura. Com ele, a
régua se divide: os 22 m do chão ao centro (neutro, com colchete) e o trecho
laranja, quanto a cadeirinha está acima ou abaixo do centro, que é
$20\sen\theta$. `presets` (padrão 30°, 150°, 210°, 540°) e `max` (padrão 540)
controlam os botões e o deslizante.

## ReferenceAngle

O ponto $P$ do giro (tom 1) e o ponto do primeiro quadrante com a mesma
abertura até o eixo horizontal (tom 2), com os dois arcos $\alpha$ do mesmo
tamanho. O tracejado entre os pontos é o espelho: horizontal no II, vertical
no IV, pelo centro no III. Ao aparecer, e no botão “Ver o espelho”, um ponto
viaja do primeiro quadrante até $P$ por esse tracejado. O painel mostra o
quadrante, a conta de $\alpha$ e $\sen\theta = \pm\sen\alpha$,
$\cos\theta = \pm\cos\alpha$.

```mdx
<ReferenceAngle initial={150} presets={[30, 150, 210, 330]} />
```

## TangentAxisExplorer

O `UnitCircle` com `showTangent` e um deslizante para o giro. A reta do raio,
prolongada para a frente ou para trás pelo centro, corta $x = 1$ no ponto
$T$, cuja altura é $\tg\theta$. Acima de 1,8 o ponto sai do desenho e o
painel continua dando o valor; em 90° e 270° o painel diz que $T$ não existe.

```mdx
<TangentAxisExplorer initial={55} from={0} presets={[45, 80, 85, 89, 90, 135, 225]} />
```

Quando $T$ é cortado, o `UnitCircle` termina a reta do raio na borda do
desenho, na direção certa, em vez de ligá-la ao ponto cortado.

## LaserWall

O laser do motivador da lição do gráfico da tangente, em escala: 1 m de
distância até a parede, o mesmo número de pixels por metro na horizontal e na
vertical (o ângulo desenhado é o de verdade). Ao aparecer, o feixe gira de 0
até `initial` com **velocidade constante**, sem suavizar, e deixa uma marca
laranja na parede a cada 10°: giros iguais, marcas cada vez mais afastadas.
Depois, o deslizante vai de 0° a 180°. Em 90° o painel diz que o feixe é
paralelo à parede; depois de 90°, o feixe se afasta e só o prolongamento para
trás (tracejado, com bolinha vazada) cruza a parede, abaixo do laser. O painel
mostra $h = \tg\theta$ e quanto o ponto sobe com mais 1° de giro.

```mdx
<LaserWall initial={80} />
<LaserWall initial={135} presets={[60, 89, 90, 91, 120, 135, 180]} caption="..." />
```

| Prop | O que faz |
|---|---|
| `initial` | giro inicial em graus (padrão 80) |
| `max` | giro máximo do deslizante (padrão 180) |
| `presets` | botões de giro pronto |
| `caption` | **texto simples** |

A velocidade constante é o argumento da figura; não troque por `ease`.

## TangentGraphTracer

O ciclo de raio 1 com a reta $x = 1$ à esquerda e o gráfico da tangente à
direita, com a **mesma escala vertical**. A reta do raio, prolongada pelo
centro quando preciso, corta $x = 1$ em $T$; um tracejado horizontal leva a
altura de $T$ até o ponto $(\theta,\ \tg\theta)$ do gráfico. Ao aparecer, o
giro anda de `from` até `initial` com velocidade constante e o traço vai
sendo desenhado atrás do ponto (some em $\frac{\pi}{2}$ e reaparece embaixo).
Depois, o deslizante controla o giro de 0° a 360°. Acima de 3 (em módulo), $T$
e o ponto do gráfico saem do desenho e o painel continua dando o valor.

Com `pair`, o gráfico aparece inteiro e mais claro, o deslizante vai de 0° a
179°, e a figura mostra também o giro oposto $\theta + 180^\circ$ (tom 3): a
mesma reta, o mesmo $T$, e dois pontos do gráfico na mesma altura, ligados por
um segmento marcado $\pi$. É a figura do período.

```mdx
<TangentGraphTracer initial={300} />
<TangentGraphTracer pair initial={60} />
```

| Prop | O que faz |
|---|---|
| `initial`, `from`, `duration` | giro final e inicial da animação (graus) e duração em segundos (padrão 300, 0 e 6) |
| `pair` | modo período, descrito acima |
| `presets` | botões; o padrão muda com `pair` |
| `caption` | **texto simples**; o padrão muda com `pair` |

Tons: 1 é o giro (raio e $P$), 2 é a tangente ($T$, o tracejado e a curva), 3 é
o giro oposto no modo `pair`.

## TangentAsymptoteZoom

O gráfico da tangente perto de $\frac{\pi}{2}$, com os dois pontos a uma
distância $d$ antes e depois de 90° (10°, 1°, 0,1° e 0,01°, um botão cada).
A janela vertical se ajusta para caber os dois pontos (1,25 vez o valor), e o
passo da malha acompanha (2, 20, 200, 2000). A troca de botão é animada: $d$ e
a escala mudam juntos, em escala logarítmica, então o aluno vê o ponto
escorregar para a assíntota enquanto a câmera se afasta. O painel traz a
tabela das quatro distâncias, com a linha atual em negrito: dividir $d$ por
10 multiplica a tangente por cerca de 10.

```mdx
<TangentAsymptoteZoom />
```

| Prop | O que faz |
|---|---|
| `initial` | índice do botão inicial, de 0 (10°, padrão) a 3 (0,01°) |
| `caption` | **texto simples** |

A curva é passada ao `CartesianPlane` cortada logo acima da janela
(`yMax + 1,9`), e não crua: com a amostragem de 1 pixel, a amostra mais perto
da assíntota daria só algumas centenas, e na janela de 0,01° a curva pararia
no meio do desenho. O corte também mantém o salto entre $+$ e $-$ maior que a
altura da janela, para o `CartesianPlane` não ligar os dois ramos.

## TangentLevelLine

Três ramos inteiros da tangente, de $-\frac{\pi}{2}$ a $\frac{5\pi}{2}$, com as
assíntotas tracejadas, e a reta horizontal $y = c$ (tom 2) controlada por um
deslizante de $-4$ a 4. Os cortes aparecem marcados, um em cada ramo, e o
painel lista os três valores de $x$ (cada um é o anterior mais $\pi$). Botões
levam $c$ a valores fora do desenho (10, 1000): a reta sai, e o painel diz
que os cortes continuam existindo, colados nas assíntotas. “Comparar com o
seno” acrescenta o seno tracejado (tom 3) e os cortes dele: nenhum quando
$\lvert c \rvert > 1$.

```mdx
<TangentLevelLine initial={1} />
```

| Prop | O que faz |
|---|---|
| `initial` | altura inicial da reta (padrão 1) |
| `presets` | botões de altura (padrão −2, 0, 1, 3, 10, 1000) |
| `caption` | **texto simples** |

O painel dá os cortes sem nomear o arco tangente, que só é ensinado na lição
das funções inversas.

## SectorExplorer

Setor aberto em torno da vertical, como o jato de um aspersor, com
deslizantes de ângulo (5° a 180°) e de raio. O arco sai grosso no tom 2; a
meia circunferência tracejada fica para comparação. Ao aparecer, o setor
abre de 0 até o ângulo inicial.

```mdx
<SectorExplorer initialDeg={120} initialR={8} showFormulas={false} />  {/* motivador */}
<SectorExplorer initialDeg={120} initialR={8} />                       {/* contas */}
<SectorExplorer initialDeg={110} initialR={60} rMax={60} inner={15} unit="cm" />
```

| Prop | O que faz |
|---|---|
| `initialDeg`, `initialR`, `rMax` | ângulo e raio iniciais; raio máximo do deslizante (ocupa 200 px) |
| `showFormulas` | `false` mostra só a fração da volta e a pergunta; `true` mostra θ em rad, $s$, $A$ e a borda $2r + s$ |
| `inner` | raio interno: vira setor de coroa, e o painel faz $\frac12\theta(R^2 - r^2)$ |
| `unit` | unidade dos comprimentos (padrão `m`) |

## SectorUnroll

Sem props. Um setor de 100° cortado em fatias finas, todas com a ponta no
centro. A animação estica o arco sobre a reta que toca o topo do círculo,
mantendo o comprimento de cada pedacinho, e as fatias viram um triângulo de
base $s$ e altura $r$. O segmento $r$, do centro ao topo, vale nos dois
quadros; o setor original fica tracejado no quadro final.

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
| `radiusLabel`, `heightLabel`, `slantLabel` | cotas em LaTeX. No cilindro e no cone, o rótulo do raio fica abaixo da base, centrado sob a seta — não há espaço livre entre a seta e a elipse tracejada |
| `extraLabels` | `[{x, y, math, tone}]` — rótulo solto em pixels do viewBox |

## TangentExplorer

O único componente interativo das lições de cálculo. Um controle deslizante
para $h$ desenha a secante entre $A = (a, f(a))$ e $B = (a+h, f(a+h))$ e
escreve a inclinação dela, **calculada dos valores da função**. Mexer em $h$ é
a ideia da lição de derivada: ver a secante girar e a inclinação se aproximar
de um número enquanto $h$ encolhe.

```mdx
import TangentExplorer from '@site/src/components/TangentExplorer';

<TangentExplorer
  f={(x) => x * x}
  a={2}
  hMin={-1.5}
  hMax={2}
  expression="f(x) = x^2"
  caption="Arraste h até perto de zero e compare a inclinação da secante com a da reta tracejada."
/>
```

| Prop | O que faz |
|---|---|
| `f` | função JavaScript |
| `a` | abscissa do ponto fixo $A$ |
| `hMin`, `hMax`, `hStep` | intervalo e passo do controle (padrão $-1{,}5$ a $2$, passo $0{,}05$) |
| `hInitial` | valor inicial de $h$ (padrão 1) |
| `expression` | LaTeX da função para o rótulo (`"f(x) = x^2"`) |
| `digits` | casas decimais da inclinação (padrão 3) |
| `showTangent` | desenha a tangente tracejada, com inclinação obtida por diferença central (padrão `true`) |
| `xMin`…`yMax`, `xUnit`, `yUnit`, `yStep`, `axisLabels` | janela, como no `CartesianPlane` |
| `caption` | texto simples |

Quando o controle chega em $h = 0$, o componente **não** desenha secante nem
inclinação: escreve que os dois pontos coincidem e a divisão não existe. É de
propósito — é o erro comum da lição, e a figura o mostra em vez de escondê-lo.

É construído sobre o `CartesianPlane`, e por isso herda os tons, os rótulos em
KaTeX e o tema escuro. Não usa JSXGraph.

## RiemannSum

Retângulos sobre o gráfico de $f$ em $[a, b]$, com a soma **calculada a partir
dos parâmetros** e escrita na legenda — como o `FactorTree` faz com o número, a
figura não tem como discordar da conta.

```mdx
import RiemannSum from '@site/src/components/RiemannSum';

<RiemannSum
  f={(t) => t * t}
  a={0} b={3} n={10}
  method="left"
  caption="Velocidade v(t) = t² e dez retângulos de base 0,3."
/>
```

| Prop | O que faz |
|---|---|
| `f`, `a`, `b`, `n` | função, extremos e número de retângulos |
| `method` | `'left'`, `'right'` ou `'mid'` — de onde vem a altura de cada retângulo |
| `digits` | casas decimais da soma na legenda (padrão 3) |
| `showSum` | escreve a soma na legenda (padrão `true`) |
| `showRectangles` | `false` desenha só a curva e a janela — para a figura da "área exata" ao lado das aproximações |
| `xMin`…`yMax`, `xUnit`, `yUnit`, `xStep`, `yStep`, `axisLabels` | janela; sem elas, sai automática a partir de $[a, b]$ e dos valores de $f$ |
| `functions`, `points`, `labels` | extras, como no `CartesianPlane` |
| `caption` | texto simples; a soma é acrescentada depois dele |

Três tons: a curva (1), a parte de cada retângulo que fica **abaixo da curva**
(2) e o **excesso** que passa por cima dela (3). Onde o retângulo fica todo sob
a curva, a faixa que ele deixou de cobrir aparece sem cor — ela não entra na
soma. Com $f$ negativa, os retângulos descem do eixo e o excesso é o que passa
abaixo da curva.

---

## SvgMath

Helper interno (`mathviz/SvgMath.jsx`), usado pelos três. Renderiza LaTeX dentro
do SVG via `foreignObject`, para o rótulo do desenho sair na mesma fonte das
fórmulas da lição.

A caixa do `foreignObject` recorta o que passa dos limites. Rótulo encostado na
borda do desenho precisa de `space` (largura disponível do lado ancorado) —
foi o que fez o rótulo da linha aparecer cortado na primeira versão do
`AreaModel`. Use `halo` quando o rótulo puder cruzar um traço do desenho.

## TrigBridge

Sequência estática do triângulo de catetos 4 e 3 e hipotenusa 5. As razões,
as coordenadas do ciclo e o ponto do gráfico vêm das mesmas medidas.

```mdx
import TrigBridge from '@site/src/components/TrigBridge';

<TrigBridge stage="ratios" />
<TrigBridge stage="unit" />
<TrigBridge stage="graph" />
```

`stage` aceita `ratios` (padrão), `unit` e `graph`. O estágio `unit` divide
cada lado por 5 e posiciona a hipotenusa sobre o raio do ciclo. O estágio
`graph` compara P(4/5, 3/5) no ciclo com Q(α, 3/5) no gráfico do seno.
O ângulo é calculado das medidas, sem uma aproximação escrita à mão.

## CycleGraphExplorer

```mdx
import CycleGraphExplorer from '@site/src/components/CycleGraphExplorer';

<CycleGraphExplorer />
```

Sem props. Um controle varia o giro entre −360° e 720°, incluindo giros
negativos e duas voltas completas. A seleção de seno ou cosseno transporta
a coordenada correspondente para o gráfico. A entrada do gráfico é sempre
em radianos; ciclo, ponto do gráfico e valores exibidos usam o mesmo ângulo.

Antes do componente, peça uma previsão. Depois, proponha comparar uma volta
completa, um giro negativo ou a escolha da outra coordenada. O componente
oferece também botões para os quartos de volta e controles acessíveis por teclado.

## WaveTracer

O ciclo desenrolado. O círculo à esquerda e o gráfico à direita têm a **mesma
escala vertical**, então a linha que leva a coordenada de $P$ até o gráfico é
horizontal de verdade. Modo seno: o segmento laranja (altura de $P$) é levado
direto. Modo cosseno: o segmento verde (abscissa) primeiro fica em pé, girando
um quarto de volta em torno do centro (arco pontilhado), e só então é levado.
A curva é traçada até o giro atual. Ao aparecer, o giro anda de 0 até
`initial`; depois o deslizante controla.

```mdx
<WaveTracer ghost initial={300} />                 {/* seno */}
<WaveTracer fn="cos" ghost initial={300} />        {/* cosseno */}
<WaveTracer
  wheel amp={20} mid={22} rpx={80} gu={32} turns={2} xAxis="deg"
  yTicks={[2, 22, 42]} yLabel="h\ (\text{m})" unit="m"
  dots={[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]}
  showCurve={false} initial={360}
/>                                                  {/* roda-gigante: só os pontos anotados */}
```

| Prop | O que faz |
|---|---|
| `fn` | `'sin'` (padrão) ou `'cos'` |
| `amp`, `mid` | raio e altura do centro, nas unidades do gráfico (padrão 1 e 0). A curva é `mid + amp·sen θ` |
| `rpx`, `gu` | pixels do raio e pixels por radiano no eixo horizontal (padrão: `gu = rpx`, a mesma escala nos dois eixos) |
| `turns` | voltas no eixo horizontal (padrão 1); o deslizante vai até `360·turns` graus |
| `initial`, `duration`, `step`, `presets` | giro final da animação, duração, passo do deslizante, botões |
| `xAxis` | `'rad'` (padrão, múltiplos de π/2) ou `'deg'` |
| `yTicks`, `yLabel` | alturas marcadas no eixo e rótulo do eixo vertical (LaTeX) |
| `dots` | giros, em graus, marcados como pontos no gráfico; cada um aparece quando o giro passa por ele |
| `showCurve` | `false` não traça a curva: só os pontos (a pergunta do motivador) |
| `ghost` | desenha a curva inteira tracejada em cinza, para o quadro final mostrar a forma toda mesmo com $P$ parado antes do fim |
| `wheel` | desenha roda-gigante: chão, suporte, raios, cadeirinha, linha do centro |
| `showFormula`, `unit` | no modo `wheel`, o painel mostra a conta `h = mid + amp × sen θ`; `unit` é a unidade |
| `caption` | texto simples |

Deixe `initial` num giro em que a coordenada não é zero (300°, por exemplo):
em 360° o segmento do seno some e o do cosseno coincide com o raio vertical,
e o quadro final deixa de mostrar o transporte.

## WavePeriodCopies

Sem props além de `fn` e `caption`. O trecho de 0 a $2\pi$ (com fundo) é
copiado e arrastado $2\pi$ para a direita e depois $2\pi$ para a esquerda,
sobre a curva verdadeira tracejada em cinza. O quadro final tem as três
voltas com o colchete “2π”.

## WaveLevelCounter

```mdx
<WaveLevelCounter initialC={0.4} initialTurns={2} />
```

Reta $y = c$ (deslizante de $-1{,}5$ a $1{,}5$, de 0,05 em 0,05) sobre o
gráfico, numa janela de 1, 2 ou 3 voltas (botões). Os pontos de encontro saem
da fórmula ($\arcsen c$ e $\pi - \arcsen c$ mais voltas; no cosseno,
$\pm\arccos c$), não de amostragem, e o painel conta e lista os $x$. Fora de
$[-1,\ 1]$, diz que não há solução. `fn="cos"` usa o cosseno.

## WaveSymmetry

```mdx
<WaveSymmetry fn="sin" initial={50} />
<WaveSymmetry fn="cos" initial={50} />
```

Círculo e gráfico de $-2\pi$ a $2\pi$, na mesma escala vertical. O giro
$\theta$ (cheio) e o giro $-\theta$ (tracejado, ponto vazado). No seno, os dois
pontos do gráfico ficam em lados opostos da origem, ligados por um segmento
que passa por ela; no cosseno, à mesma altura, espelhados no eixo vertical.

## WaveShift

```mdx
<WaveShift initial={6} />
```

Cinza: $\sen x$ parado. Verde tracejado: $\cos x$. Laranja:
$\sen(x + h)$, com $h$ de 15° em 15° (`initial` conta passos de $\frac{\pi}{12}$;
6 é $\frac{\pi}{2}$). A seta liga um pico do seno ao lugar para onde ele foi. O
painel avisa quando a curva cai sobre o cosseno ($h = \frac{\pi}{2}$), sobre
$-\sen x$ ($h = \pi$, o erro do “de cabeça para baixo”), sobre $-\cos x$ e
sobre o próprio seno. Ao aparecer, $h$ anda de 0 até `initial`.

## ArcHeightCompare

```mdx
<ArcHeightCompare initial={50} />
```

Um quarto do círculo de raio 1, ampliado: o arco percorrido $x$ (azul) e a
altura $\sen x$ (laranja), e os dois esticados como barras sobre o mesmo chão,
com a linha de 1 raio. `initial` é $x$ em centésimos de radiano. O painel dá a
altura como porcentagem do arco e o mesmo giro em graus, para mostrar que o
número em graus não é um comprimento.

## WaveParameterExplorer

Um parâmetro de $a\sen(bx + c) + d$ por vez. Só o deslizante de `param` fica
ativo; os outros ficam travados em `base`. A curva tracejada (tom 1) é a mesma
função com o parâmetro estudado no valor neutro; a contínua (tom 2) usa o
deslizante. O tom 3 marca o que ler: a linha central $y = d$ (`d`), a seta da
altura em $\frac{\pi}{2}$ e os zeros que não se mexem (`a`), uma onda inteira
a partir de zero e a reta $x = 2\pi$ (`b`), o caminho do máximo (`c`). Ao
aparecer, o parâmetro desliza do valor neutro até `initial`.

```mdx
<WaveParameterExplorer param="d" initial={2} caption="..." />
<WaveParameterExplorer param="a" initial={2} caption="..." />
<WaveParameterExplorer param="b" initial={2} caption="..." />
<WaveParameterExplorer param="c" initial={2} caption="..." />                       {/* c = π/2 */}
<WaveParameterExplorer param="c" base={{b: 2}} initial={2} showWrongShift caption="..." />
```

| Prop | O que faz |
|---|---|
| `param` | `'d'` (−1 a 3), `'a'` (−3 a 3), `'b'` (0,5 a 4), todos de 0,5 em 0,5; ou `'c'` |
| `initial` | valor inicial do deslizante. **Em `param="c"` é o número de quartos de π**: `initial={2}` é $c = \frac{\pi}{2}$ (faixa de −4 a 4, isto é, de $-\pi$ a $\pi$) |
| `base` | valores travados dos outros parâmetros (padrão $a = 1$, $b = 1$, $c = 0$, $d = 0$). Em `param="c"`, use `b` inteiro (1 ou 2): o painel escreve o deslocamento como fração de π |
| `showWrongShift` | só com `param="c"` e $b \neq 1$: círculo vazio onde a leitura apressada “$c$ inteiro para a esquerda” poria o máximo |
| `presets`, `duration`, `caption` | botões prontos (mesma unidade de `initial`), duração da animação, legenda em texto simples |

O painel escreve o resultado exato (imagem, amplitude, período como fração de
π, deslocamento $-\frac{c}{b}$) e uma frase com o que mudou e o que não mudou.
Em `param="b"`, quando a onda é mais longa que a janela ($b = 0{,}5$), a seta
diz que ela continua além. Fora do caso `c`, a janela começa colada no eixo
vertical, para a curva não passar por cima dos números do eixo $y$; no caso
`c` o eixo $y$ fica sem números, porque o máximo cai muitas vezes em cima dele.

## TideFit

A maré do porto da lição de parâmetros: máximo de 4,2 m às 5 h, mínimo de
0,8 m, ciclo de 12 h. As marcas da tábua (tom 3) ficam fixas; a curva (tom 1)
é $d + a\sen(bt + c)$.

```mdx
<TideFit mode="question" />   {/* motivador: só sen t e as marcas da tábua */}
<TideFit />                   {/* resolução: os quatro ajustes animados */}
```

No modo padrão, ao aparecer, a curva recebe os ajustes um de cada vez, na
ordem $d$, $a$, $b$, $c$, e termina em
$2{,}5 + 1{,}7\sen\left(\frac{\pi}{6}t - \frac{\pi}{3}\right)$. Os botões
repetem um ajuste isolado; o ponto cheio é o primeiro máximo da curva, que se
move até as 5 h. Sem props além de `mode` e `caption`; os números são os da
lição `geometria/parametros-das-funcoes-trigonometricas`, que os cita no
texto. Se mudar um número aqui, mude lá também.

## TrigParametersExplorer

```mdx
<TrigParametersExplorer />
```

Sem props. Quatro controles ajustam $a\sen(bx+c)+d$, começando no seno básico
($a$, $b$ e $d$ de 0,5 em 0,5; $c$ de $\frac{\pi}{4}$ em $\frac{\pi}{4}$). A
fórmula sai escrita como no papel ($\sen\left(2x + \frac{\pi}{2}\right) + 1$,
sem parênteses em volta de cada número). A curva ajustada é contínua e a
referência é tracejada; a linha central tem o terceiro tom. Os eixos mantêm
as mesmas escalas em todos os ajustes, para não esconder as mudanças de
amplitude ou período.

Permite fatores negativos e zero. Quando $a = 0$ ou $b = 0$, mostra uma
constante, com amplitude zero e sem menor período positivo. Nos outros casos,
o painel dá amplitude, período (fração de π e decimal), imagem, linha central
e o deslocamento $-\frac{c}{b}$ como fração de π, com o sentido.

Os exploradores e a sequência estática reutilizam `GeoFigure`,
`UnitCircle` e `CartesianPlane`. A disposição em colunas vira uma coluna no
celular; a paleta e o KaTeX seguem os mesmos tokens e macros do curso.

## RobotArmInverse

O braço de 1 m da lição de funções trigonométricas inversas. O braço real sai
no tom 1; a resposta da calculadora, um braço fantasma tracejado no tom 2, só
aparece quando ela erra. Ao aparecer, o braço gira de `from` até `initial`.

```mdx
<RobotArmInverse initial={150} from={30} caption="..." />          {/* o problema */}
<RobotArmInverse mode="tg" initial={150} from={0} caption="..." /> {/* a solução */}
```

| Prop | O que faz |
|---|---|
| `mode` | `'sen'` (padrão): giro de 0° a 180° acima da mesa, régua da altura h = sen θ (tom 3), fantasma em arcsen h. `'tg'`: volta inteira, projeções da garra nos eixos (tom 3), fantasma em atan(y/x); o painel compara com atan2(y, x) |
| `initial`, `from` | giro final e inicial da animação, em graus (padrão 150; `from` 30 em `'sen'`, 0 em `'tg'`) |
| `presets` | botões de giro (padrão 30°, 60°, 120°, 150° ou 45°, 150°, 210°, 270°, 330°) |
| `caption` | **texto simples** |

Com $x = 0$ (90° e 270° no modo `'tg'`) não há fantasma: o painel diz que a
divisão não existe e dá o atan2.

## HorizontalLineSine

O gráfico do seno de $-2\pi$ a $2\pi$ e a reta $y = k$ (tom 2, deslizante de
$-1{,}3$ a $1{,}3$). Os cortes são calculados ($\arcsen k + 2n\pi$ e
$\pi - \arcsen k + 2n\pi$), não desenhados à mão, e o painel os conta.

```mdx
<HorizontalLineSine initial={0.5} caption="..." />
<HorizontalLineSine initial={-0.5} pieces={['principal', 'meiaVolta', 'quarto', 'outro']} />
<HorizontalLineSine initial={0.5} labelCuts />
```

| Prop | O que faz |
|---|---|
| `initial` | altura inicial da reta (padrão 0,5) |
| `pieces` | botões de trechos candidatos: `'tudo'`, `'principal'` ($[-\frac{\pi}{2}, \frac{\pi}{2}]$), `'meiaVolta'` ($[0, \pi]$), `'quarto'` ($[0, \frac{\pi}{2}]$), `'outro'` ($[\frac{\pi}{2}, \frac{3\pi}{2}]$). O resto do gráfico fica tracejado, só contam os cortes no trecho, e o painel diz se ele serve para inverter e por quê |
| `initialPiece` | trecho inicial (padrão: o primeiro de `pieces`) |
| `labelCuts` | escreve em cada corte o nome dele em função de $\alpha$: $\alpha$, $\pi - \alpha$, $\alpha - 2\pi$, $-\pi - \alpha$… |
| `caption` | **texto simples** |

## InverseCycle

O ciclo trigonométrico com a metade em que a inversa procura destacada (arco
grosso translúcido, tom 1). Um deslizante dá o valor $v$; a reta que ele define
(tom 2, tracejada) corta o ciclo em dois pontos. O ponto devolvido sai cheio,
no tom 1, com o arco do giro; o outro sai vazio, no tom 2. O painel mostra o
valor da inversa (graus e radianos) e a conta do outro giro. Ao aparecer, $v$
corre do mínimo até `initial` e o ponto percorre a metade destacada.

```mdx
<InverseCycle fn="sen" initial={0.5} caption="..." />
<InverseCycle fn="cos" initial={0.5} caption="..." />
<InverseCycle fn="tg" initial={1} caption="..." />
```

| Prop | O que faz |
|---|---|
| `fn` | `'sen'`: reta horizontal $y = v$, metade direita, outro giro $180^\circ - \alpha$. `'cos'`: reta vertical $x = v$, metade de cima, outro giro $-\alpha$. `'tg'`: ponto $T$ na reta $x = 1$ e a reta do raio por ele; metade direita com as pontas abertas; outro giro $\alpha + 180^\circ$; deslizante de $-4$ a 4 |
| `initial` | valor inicial (padrão 0,5; 1 em `'tg'`) |
| `caption` | **texto simples** |

Na tangente, acima de 1,3 o ponto $T$ sai do desenho e o painel avisa; os
rótulos dos giros saem girados 13° para não cair sobre a reta tracejada.

## InverseReflect

O trecho guardado da função (tracejado, neutro) e a reta $y = x$ (cinza). Na
animação, cada ponto $(x, y)$ do trecho anda em linha reta até $(y, x)$: o
caminho cruza $y = x$ em ângulo reto, e a curva azul que sobra no quadro final
é o gráfico da inversa. Um ponto marcado (tom 2) mostra as coordenadas
trocando. Na tangente, as assíntotas verticais $x = \pm\frac{\pi}{2}$ giram até
virar as horizontais $y = \pm\frac{\pi}{2}$ (tom 1).

```mdx
<InverseReflect fn="sen" choices={['sen', 'cos', 'tg']} caption="..." />
```

| Prop | O que faz |
|---|---|
| `fn` | `'sen'` (trecho $[-\frac{\pi}{2}, \frac{\pi}{2}]$, ponto $(\frac{\pi}{2}, 1)$), `'cos'` ($[0, \pi]$, ponto $(\frac{\pi}{3}; 0{,}5)$) ou `'tg'` ($\lvert\tg x\rvert \le 7$, ponto $(\frac{\pi}{3}, \sqrt3)$) |
| `choices` | botões para trocar de função; cada troca repete a animação |
| `caption` | **texto simples** |

Construído sobre o `CartesianPlane`. A curva em movimento não é gráfico de
função no meio da dobra (no cosseno, deixa de ser), por isso vai como
`polygons` com `fill: false`, percorrida até o fim e de volta: o polígono sempre
se fecha, e a volta pelo mesmo caminho faz ele parecer uma linha aberta. O
ponto marcado foi escolhido longe da reta $y = x$; um ponto perto dela (como
$(\frac{\pi}{6}; 0{,}5)$) fica escondido pela própria imagem.

## RampForces

Caixote numa rampa com a inclinação de verdade (`sinValue`). A animação faz o
peso P (verde) crescer e se repartir nas duas componentes (laranja); as
tracejadas fecham o retângulo, e o ângulo θ aparece também entre P e a
componente perpendicular. Lição 7.25.

```mdx
<RampForces />
<RampForces solved />
```

| Prop | O que faz |
|---|---|
| `weight` | peso em `unit` (padrão 80) |
| `sinValue` | seno da inclinação (padrão 0,28) |
| `unit` | unidade do peso (padrão `kgf`) |
| `solved` | rótulos com os valores, cos θ calculado pela relação fundamental |
| `caption` | legenda |

## IdentityBars

Ciclo com o triângulo de P (cosseno verde, seno laranja, raio azul) ao lado de
duas réguas na mesma escala. Em cima, os quadrados empilhados: cos²θ + sen²θ
termina sempre no 1. Embaixo, cos θ + sen θ como duas setas com sinal: o ponto
final anda e só cai no 1 em 0° e 90°. Ao aparecer, o giro varre de 0° até
`initial`. Lição 7.25.

```mdx
<IdentityBars />
```

| Prop | O que faz |
|---|---|
| `initial` | giro final da animação e valor inicial do deslizante (padrão 300) |
| `duration` | duração da varredura, em segundos (padrão 5) |
| `caption` | legenda |

## SameSinePoints

A reta horizontal y = s corta o ciclo em dois pontos de mesmo seno; os
segmentos verdes mostram cossenos de mesmo tamanho e sinais contrários, e o
painel faz cos² = 1 − s² e diz o quadrante de cada ponto. Lição 7.25.

```mdx
<SameSinePoints initial={0.28} />
```

| Prop | O que faz |
|---|---|
| `initial` | altura inicial da reta, entre −1 e 1 (padrão 0,28) |
| `caption` | legenda |

## ReciprocalLine

Régua de −4 a 4 com o cosseno (verde) e a secante (azul), ou o seno (laranja)
e a cossecante, com a faixa de −1 a 1 sombreada. Botões trocam entre secante e
cossecante; quando a recíproca passa do fim da régua, uma seta avisa, e com o
denominador zero o painel diz “não existe”. Lição 7.25.

```mdx
<ReciprocalLine initial={60} fn="cos" />
```

| Prop | O que faz |
|---|---|
| `initial` | giro inicial em graus (padrão 60) |
| `fn` | `'cos'` (secante) ou `'sen'` (cossecante) no começo |
| `caption` | legenda (o padrão acompanha o modo) |

## ReciprocalTriangle

O triângulo do ciclo (cos θ, sen θ, 1) é ampliado, com O parado, pelo fator
1/cos θ até encostar na reta x = 1 (lados 1, tg θ, sec θ) ou pelo fator
1/sen θ até a reta y = 1 (lados cotg θ, 1, cossec θ). O triângulo do ciclo fica
tracejado por dentro, e o painel confere a identidade derivada. Lição 7.25.

```mdx
<ReciprocalTriangle mode="cos" />
<ReciprocalTriangle mode="sen" initial={50} />
```

| Prop | O que faz |
|---|---|
| `mode` | `'cos'` (1 + tg² = sec², giro de 20° a 65°) ou `'sen'` (1 + cotg² = cossec², giro de 25° a 80°) |
| `initial` | giro inicial em graus (padrão 50) |
| `caption` | legenda (o padrão acompanha o modo) |

## AngleSumRise

Um braço gira `a` e depois mais `b`. Azul: a altura depois do primeiro giro
($\sen a$). Laranja: quanto o segundo giro sobe de verdade, começando em `a`.
Verde: quanto o mesmo giro `b` subiria começando do zero ($\sen b$). À direita,
duas barras no mesmo chão: "somando" (azul + verde, a regra errada
$\sen a + \sen b$) e "de verdade" (azul + laranja), com a linha tracejada do
comprimento do braço. Na abertura, o braço gira `a`, depois `b`, e as barras
crescem.

```mdx
<AngleSumRise a={45} b={30} length={4} unit="m" mystery />
<AngleSumRise sliders a={40} b={30} />
```

| Prop | O que faz |
|---|---|
| `a`, `b` | os dois giros, em graus (padrão 30 e 30) |
| `length`, `unit` | comprimento do braço e unidade dos números (padrão 1, sem unidade) |
| `sliders` | deslizantes para `a` e `b` (0° a 90°, de 5 em 5); a figura reserva altura para a barra de até 2 |
| `mystery` | a barra "de verdade" sai com "?" no lugar do número (problema motivador) |
| `caption` | legenda |

Usado em `geometria/soma-diferenca-e-arco-duplo` (motivador, seção do erro de
distribuir e resolução do motivador).

## AngleSumRotation

A dedução de $\sen(a+b)$ e $\cos(a+b)$ animada. O triângulo retângulo do
ângulo `b` (hipotenusa 1, cateto deitado $\cos b$ em azul até $R$, cateto em pé
$\sen b$ em laranja até $P$) aparece deitado no eixo e gira `a` em torno da
origem. Depois, cada cateto se separa:

- `part="sen"`: a altura de $P$ é a altura de $R$ ($\sen a\cos b$, tracejado
  azul) mais a subida de $R$ até $P$ ($\cos a\sen b$, tracejado laranja). O
  ângulo `a` entre o cateto laranja e a vertical aparece marcado em $P$. Régua
  vertical à direita empilha as duas parcelas.
- `part="cos"`: a abscissa de $P$ é o avanço até $R$ ($\cos a\cos b$) menos o
  recuo de $R$ até $P$ ($\sen a\sen b$). Régua horizontal embaixo: avanço numa
  faixa, recuo logo abaixo.

O painel mostra a fórmula com os números e confere com o valor direto.

```mdx
<AngleSumRotation part="sen" a={40} b={30} />
<AngleSumRotation part="cos" a={40} b={30} />
<AngleSumRotation backward toggle part="sen" a={60} b={30} />
<AngleSumRotation double toggle part="sen" a={30} />
```

| Prop | O que faz |
|---|---|
| `a`, `b` | giros iniciais, em graus; deslizantes de 0° a 90°, de 5 em 5 |
| `part` | `'sen'` (altura) ou `'cos'` (abscissa) |
| `backward` | o segundo giro é para trás ($a - b$); o deslizante de `b` vai só até `a`, e $P$ fica no primeiro quadrante. Na régua do seno, a descida fica numa coluna ao lado |
| `double` | `b = a`, um deslizante só (arco duplo); rótulos com `a` nos dois catetos |
| `toggle` | botões para trocar entre seno e cosseno (a figura reserva espaço para as duas réguas) |
| `caption` | legenda |

## DoubleCosineRoutes

As três escritas de $\cos 2a$ como três caminhos na reta numérica, saindo do
zero: $\cos^2 a - \sen^2 a$ (avança azul, recua laranja), $1 - 2\sen^2 a$
(avança o cinza de comprimento 1, recua dois laranjas) e $2\cos^2 a - 1$
(avança dois azuis, recua o cinza). A reta verde tracejada marca $\cos 2a$, e
as três chegadas caem nela. Deslizante para `a` de 0° a 90°.

```mdx
<DoubleCosineRoutes initial={30} />
```

## SineCosineCombo

$A\sen x + B\cos x = R\sen(x + \varphi)$. Esquerda: o ponto $(A, B)$, a
distância $R$ até a origem e o ângulo $\varphi$. Direita: $A\sen x$ (cinza
tracejado), $B\cos x$ (cinza pontilhado), a soma (laranja) e
$R\sen(x+\varphi)$ (azul tracejado), que coincidem; o pico marcado vale $R$.
Deslizantes para `A` e `B`, de 0 a 5, de meio em meio. O painel mostra $R$,
$\tg\varphi$ e compara o pico com $A + B$.

```mdx
<SineCosineCombo A={3} B={4} />
```

## TrigEqWheel

Roda de 40 m de diâmetro, eixo a 25 m, uma volta a cada 2 minutos, cabine
partindo do fundo. À direita, o gráfico de $h(t)$ em duas voltas, na mesma
escala vertical da roda: a reta da altura procurada atravessa os dois desenhos.
Na entrada da tela, a roda dá as duas voltas e o gráfico se desenha; depois, o
deslizante escolhe o instante (de 5 em 5 segundos).

```mdx
<TrigEqWheel />
<TrigEqWheel showTimes />
<TrigEqWheel band showTimes initial={60} />
```

| Prop | O que faz |
|---|---|
| `level` | altura procurada, em metros (padrão 35) |
| `showTimes` | rotula os instantes em que a cabine está nessa altura (frações de minuto) e põe botões para eles |
| `band` | pinta de verde os trechos do gráfico com a cabine nessa altura ou acima, e o arco da roda acima dela |
| `initial` | instante inicial do deslizante, em segundos (padrão 240) |
| `caption` | legenda |

## TrigEqLayers

Duas colunas: a "ida" (as contas que a fórmula faz com $t$, na ordem) e a
"volta" (a equação desfeita de fora para dentro). Cada linha da volta risca a
conta da ida que ela desfez, e a animação termina destacando a camada do
cosseno, que não se desfaz com uma resposta só. Os padrões são os da roda.

```mdx
<TrigEqLayers />
```

| Prop | O que faz |
|---|---|
| `input` | LaTeX da incógnita (padrão `t`) |
| `forward` | `[{op, value}]`: as contas da ida e o resultado de cada uma |
| `back` | `[{eq, note, undoes}]`: as linhas da volta; `undoes` é o índice da conta da ida que a linha desfaz |
| `stop` | índice da conta da ida destacada no fim (padrão 1, o cosseno) |
| `stopNote` | texto do quadro "Pare aqui" |

## TrigEqCycleLine

Uma volta do ciclo e a reta que procura as soluções, com deslizante para o
valor $c$ e botões de valores notáveis. O painel dá os giros entre 0 e $2\pi$
(em fração de π quando possível), o giro da calculadora e o espelho.

```mdx
<TrigEqCycleLine fn="sin" initial={1.3} />
<TrigEqCycleLine fn="cos" initial={-0.5} />
<TrigEqCycleLine fn="tan" initial={1} />
```

| Prop | O que faz |
|---|---|
| `fn` | `'sin'` (reta horizontal; espelho no eixo vertical), `'cos'` (reta vertical; espelho no eixo horizontal) ou `'tan'` (ponto T na reta x = 1 e reta de O até T) |
| `initial` | valor inicial de $c$ |
| `presets` | `[{label, value}]`: botões; cada modo tem os seus padrões |
| `caption` | legenda |

## TrigEqCopies

O gráfico de três voltas, de $-2\pi$ a $4\pi$, com a reta $y = c$. Os dois
encontros da primeira volta (k = 0) aparecem, e cópias deles deslizam uma
volta para a direita (k = 1) e uma para a esquerda (k = −1). Cada família tem
o seu tom; a tabela abaixo da figura lista os valores com o seu $k$.

```mdx
<TrigEqCopies fn="sin" value={0.5} />
```

| Prop | O que faz |
|---|---|
| `fn` | `'sin'` ou `'cos'` |
| `value` | o valor $c$ (use $c \ge 0$ no seno: a primeira família é escrita como $\alpha + 2k\pi$) |

## TrigEqInterval

Reta numérica com o intervalo pedido (faixa cinza, pontas fechadas) e botões de
$k$ para cada família da solução geral. Cada tentativa vai para a reta (ponto
cheio dentro, vazio fora) e para o registro; o painel conta quantas das
soluções do intervalo já foram achadas.

```mdx
<TrigEqInterval
  families={[
    {tex: '\\frac{\\pi}{6} + 2k\\pi', base: Math.PI / 6, step: 2 * Math.PI},
    {tex: '\\frac{5\\pi}{6} + 2k\\pi', base: (5 * Math.PI) / 6, step: 2 * Math.PI},
  ]}
  interval={[0, 4 * Math.PI]}
  intervalTex="[0,\ 4\pi]"
  ks={[-1, 0, 1, 2]}
  initialTries={[[0, 0], [1, 0], [0, -1]]}
/>
```

| Prop | O que faz |
|---|---|
| `families` | `[{tex, base, step}]`: cada família é `base + k × step`; `tex` é o rótulo |
| `interval`, `intervalTex` | o intervalo fechado e o LaTeX dele |
| `ks` | os valores de $k$ oferecidos nos botões |
| `initialTries` | `[[família, k], ...]` já marcados (o que a página estática mostra) |

## TrigEqArgument

$\sen(2x) = \frac12$ com $x$ em $[0, 2\pi]$, em dois painéis na mesma escala.
Em cima, $\sen u$ com $u = 2x$ de 0 a $4\pi$ e os quatro encontros. Cada
encontro desce até $x = u/2$, e embaixo a curva $\sen(2x)$ se desenha por eles;
no fim, o tracejado $\sen x$ mostra que ele só tem dois encontros. Sem props.

```mdx
<TrigEqArgument />
```

## TrigEqRoots

Régua vertical de $u$ (com a faixa de $-1$ a 1 em verde) ao lado do ciclo, na
mesma escala. Cada raiz $u$ vira, uma de cada vez, uma reta horizontal que
atravessa o ciclo; os cortes ganham o giro. Raiz fora da faixa: reta
tracejada por cima do círculo, "nenhum ponto".

```mdx
<TrigEqRoots
  sets={[
    {label: '2u² − u − 1 = 0', roots: [{u: 1, tex: '1'}, {u: -0.5, tex: '-\\frac{1}{2}'}]},
    {label: '2u² − 3u − 2 = 0', roots: [{u: 2, tex: '2'}, {u: -0.5, tex: '-\\frac{1}{2}'}]},
  ]}
/>
```

| Prop | O que faz |
|---|---|
| `sets` | `[{label, roots: [{u, tex}]}]`: uma ou mais equações; com mais de uma, aparecem botões. A régua vai de −1,4 a 2,35 |

## LinearMap

O plano antes e depois de uma matriz $2 \times 2$. Ensina que a matriz leva a
malha quadriculada inteira numa malha de paralelogramos, e que as **colunas**
da matriz são os destinos de $\vec{e}_1 = (1, 0)$ e $\vec{e}_2 = (0, 1)$.

```mdx
<LinearMap
  matrix={[[2, 1], [0, 1]]}
  vectors={[{v: [1, 2], label: '\\vec{v}', imageLabel: 'A\\vec{v}'}]}
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `matrix` | `[[a, b], [c, d]]`, **por linhas**, como se escreve no papel. A imagem de $\vec{e}_1$ é a coluna $(a, c)$ |
| `layout` | `'side'` (padrão): dois painéis, antes e depois; `'overlay'`: só o painel do depois, com a malha original clara ao fundo |
| `vectors` | `[{v, tone, label, imageLabel, offset, imageOffset}]` — seta para `v` no painel do antes e para a imagem no do depois. Tom padrão 3 |
| `showBasis` | desenha $\vec{e}_1$ (tom 1) e $\vec{e}_2$ (tom 2) e suas imagens. Padrão `true` |
| `showSquare` | pinta o quadrado unitário e o paralelogramo em que ele se transforma (tom 3, claro). Padrão `true` |
| `basisLabels` | `{before: [l1, l2], after: [l1, l2]}`; o padrão do depois são as coordenadas das colunas, como $(2,\ 0)$ |
| `window` | `[xMin, xMax, yMin, yMax]` — sem ela, a janela cabe o quadrado, os vetores e as imagens com uma unidade de folga. **Aumente** quando o rótulo de uma seta encostar na borda |
| `extent` | até onde a malha transformada é desenhada (padrão 4) |
| `unit`, `titles`, `caption` | pixels por unidade (padrão 34); títulos dos dois painéis |

O rótulo de cada seta vai, sem deslocamento informado, um pouco além da ponta,
na direção da seta, ancorado pela borda quando a seta aponta para o lado.

## Space3D

Eixos $x$, $y$ e $z$ em perspectiva cavaleira: $y$ para a direita, $z$ para
cima e $x$ saindo do papel, desenhado na diagonal para baixo e para a
esquerda e encurtado.

```mdx
<Space3D
  max={[3, 4, 3]}
  points={[{at: [2, 3, 2], label: 'P(2,\\,3,\\,2)'}]}
  boxes={[[2, 3, 2]]}
  vectors={[{to: [2, 3, 2], tone: 1, label: '\\vec{v}'}]}
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `max`, `min` | até onde vai cada eixo; os traços numerados vão de 1 até `max` |
| `points` | `[{at: [x, y, z], label, tone, dx, dy}]` |
| `vectors` | `[{from, to, tone, label, dx, dy}]` — `from` padrão é a origem |
| `boxes` | `[[x, y, z]]` — a “caixa” do ponto: tracejado do ponto até a sombra $(x, y, 0)$ no chão, da sombra até os dois eixos, e a diagonal do chão pontilhada. É o desenho de Pitágoras duas vezes |
| `segments`, `labels` | segmentos (`dashed`) e rótulos soltos, em coordenadas do espaço |
| `unit`, `ticks`, `axisLabels`, `padding` | escala (padrão 40), traços numerados, nomes dos eixos, margem |

Cuidado próprio da perspectiva: dois pontos diferentes do espaço podem cair no
mesmo lugar do papel. Sempre desenhe a caixa (`boxes`) do ponto que o texto
discute, e confira na imagem se a linha vertical tracejada não passa em cima de
um número do eixo.

## DeliveryVectors

As quatro corridas do problema motivador de `geometria/vetores`, num
`CartesianPlane` de 0 a 13 por 0 a 10.

```mdx
<DeliveryVectors mode="routes" />
<DeliveryVectors mode="compare" />
```

| Prop | O que faz |
|---|---|
| `mode` | `'routes'`: os entregadores saem juntos e a seta de cada corrida cresce atrás deles. `'compare'`: as setas, coloridas pelo vetor, deslizam sem girar até a saída comum $(6,\ 1)$; as corridas 1 e 2 coincidem |
| `caption` | substitui a legenda padrão |

## FiveBlocksCircle

Doze setas de comprimento 5 saem da origem uma depois da outra, nas doze
esquinas da circunferência de raio 5 ($3$-$4$-$5$ e eixos). No quadro final, a
circunferência tracejada mostra que todo ponto dela está a 5 da saída. Sem
props além de `caption`.

## VectorSlide

A seta de um vetor fixo desliza, sem girar, por uma sequência de caudas
(`tour`), deixando cópias cinza. Depois, dois deslizantes movem a cauda.

```mdx
<VectorSlide vector={[3, 2]} tour={[[0, 0], [5, 0], [1, 4], [6, 3]]} />
<VectorSlide vector={[3, 4]} xMin={-1} xMax={10} yMin={-1} yMax={6}
  tour={[[0, 0], [5, 0]]} point={{at: [3, 4], label: 'P(3,\\ 4)', dx: -34, dy: -8}} readout="point" />
<VectorSlide vector={[3, 4]} xMin={0} xMax={13} yMin={0} yMax={10} xUnit={30}
  tour={[[1, 1], [5, 3]]} readout="sum" tailName="A" tipName="B" />
```

| Prop | O que faz |
|---|---|
| `vector` | as coordenadas $(a,\ b)$ da seta |
| `tour` | caudas por onde a seta passa ao aparecer; a última é a posição inicial dos controles |
| `xMin`…`yMax`, `xUnit` | janela do plano; os deslizantes só deixam a cauda onde a ponta continua dentro dela |
| `point` | `{at, label, dx, dy}`: ponto fixo em laranja; com `readout="point"` o painel diz se a ponta caiu nele |
| `readout` | `'translate'` (padrão), `'point'` ou `'sum'` (escreve $A + \vec{v} = B$ com os números) |
| `vecLabel`, `tailName`, `tipName` | rótulos em LaTeX da seta, da cauda e da ponta |

## VectorSteps

Um ponto sai da origem e percorre a seta em duas etapas, horizontal e
vertical; a seta aparece no fim. Botões trocam o vetor: $(3,\ 4)$, $(-3,\ 4)$,
$(4,\ -2)$, $(-2,\ -5)$ e $(0,\ 5)$. O painel traduz cada sinal em lado.
`initial` escolhe o botão inicial (índice).

## VectorBetween

O vetor de A até B como “chegada menos saída”: o ponto anda $\Delta x$ e
depois $\Delta y$, e a seta liga as pontas. Botões com três pares de pontos
(um com coordenadas negativas) e um botão que troca o sentido (de B até A),
mostrando as coordenadas trocando de sinal. O painel escreve
$\overrightarrow{AB} = B - A = (\ldots)$ com os números.

## VectorLength

Deslizantes para $a$ e $b$ de $-8$ a $8$. Os catetos tracejados levam o valor
sem sinal; a seta leva o comprimento. O painel faz
$\sqrt{(-3)^2 + 4^2} = \ldots$ e compara com o caminho em “L”,
$\lvert a \rvert + \lvert b \rvert$. Botões: $(3,\ 4)$, $(-3,\ 4)$, $(6,\ -8)$,
$(0,\ -7)$ e o vetor nulo. Props: `initialA`, `initialB`, `caption`.

## ZeroTrip

O entregador contorna o retângulo de $(1,\ 1)$ a $(6,\ 4)$ e volta ao
restaurante. A seta azul liga a saída à posição atual e some na chegada; o
painel mostra o caminho andado (16 quarteirões) e o deslocamento $(0,\ 0)$.

## OppositeVector

A seta $\vec{v} = \overrightarrow{AB} = (4,\ 2)$, de $A(1,\ 1)$ a $B(5,\ 3)$;
uma cópia sobe duas unidades e gira meia volta em torno do meio, virando
$-\vec{v}$. Um botão mostra o contraexemplo $(-4,\ 2)$, tracejado.

## BoatCurrent

O problema motivador da 7.29. O rio corre entre y = 0 e y = 8 (km); o motor
empurra para o norte a 8 km/h e a correnteza para o leste a 6 km/h. A animação
faz passar uma hora: o barco (ponto verde) deixa a trilha tracejada, duas
setinhas presas a ele (em escala 1/4) mostram os dois empurrões, e um ponto
cinza mostra onde ele estaria sem correnteza. Quadro final: barco em (6, 8),
ponto cinza em (0, 8). O painel mostra o tempo e as duas posições.

```mdx
<BoatCurrent />
```

| Prop | O que faz |
|---|---|
| `caption` | troca a legenda |

## TipToTail

Ponta com cauda, animado: u cresce a partir da origem, v cresce a partir da
ponta de u, e a soma liga a saída à chegada. Um ponto cinza percorre os dois
trechos.

```mdx
<TipToTail u={[3, 1]} v={[1, 2]} />
```

| Prop | O que faz |
|---|---|
| `u`, `v` | os dois vetores (janela fixa de −1 a 6 por −1 a 4) |
| `caption` | troca a legenda |

## SumByAxis

Por que a soma é coordenada a coordenada. As setas aparecem ponta com cauda,
cada uma se desmonta num passo horizontal e num vertical, os horizontais descem
até uma faixa embaixo e os verticais vão até uma faixa à esquerda, chegando
encostados; por fim aparecem os totais (verde) e a seta da soma. Botões trocam
o par: (3, 1) e (1, 2); (5, −2) e (−1, 6); (4, 1) e (−3, 2).

```mdx
<SumByAxis initial={0} />
```

| Prop | O que faz |
|---|---|
| `initial` | índice do par mostrado primeiro (0, 1 ou 2) |
| `caption` | troca a legenda |

## SumParallelogram

Regra do paralelogramo, animado: u e v saem do mesmo ponto, uma cópia de v
desliza até a ponta de u, uma cópia de u desliza até a ponta de v, e a diagonal
verde aparece. O painel escreve as duas somas.

```mdx
<SumParallelogram u={[3, 1]} v={[1, 2]} />
```

| Prop | O que faz |
|---|---|
| `u`, `v` | os dois vetores (janela fixa de −1 a 6 por −1 a 4) |
| `caption` | troca a legenda |

## VectorDifference

Subtração, animado: u e v saem da origem, a seta verde cresce da ponta de v
até a ponta de u (u − v), e uma cópia tracejada desliza até a origem. O botão
“Ler como u + (−v)” acrescenta −v saindo da ponta de u, que chega ao mesmo
ponto. Com `tips`, as pontas ganham nomes de pontos e a figura mostra
AB = b − a.

```mdx
<VectorDifference />

<VectorDifference
  u={[2, 5]} v={[5, 1]}
  uName="\vec{b}" vName="\vec{a}" diffName="\overrightarrow{AB}"
  tips={['B', 'A']} slide={false} minusButton={false}
  window={{xMin: -1, xMax: 7, yMin: -1, yMax: 6}} xUnit={42}
  offsets={{u: [-58, 0], v: [16, -16], d: [62, 8], tipU: [-14, -12], tipV: [14, -12]}}
/>
```

| Prop | O que faz |
|---|---|
| `u`, `v` | os vetores; a figura desenha u − v |
| `uName`, `vName`, `diffName` | nomes em LaTeX (atributo JSX entre aspas: barra simples) |
| `tips` | `[nome da ponta de u, nome da ponta de v]` |
| `slide` | `false` tira a cópia que desliza até a origem |
| `minusButton` | `false` tira o botão “Ler como u + (−v)” |
| `window`, `xUnit` | janela e escala do plano |
| `offsets` | deslocamentos `[dx, dy]` em pixels dos rótulos `u`, `v`, `d`, `tipU`, `tipV` |
| `caption` | troca a legenda |

## ScaleVector

Número vezes vetor. O tracejado cinza é a reta pela origem na direção de v; a
seta laranja é k·v, e v fica tracejado em azul por cima. Ao entrar na tela o k
passeia sozinho (1 → 3 → −2 → `initial`); depois o aluno controla o
deslizante. O painel mostra k·v, o módulo |k| × ‖v‖ e o que o k fez com a seta.
Com `targets`, vira busca: o painel guarda os alvos alcançados e avisa quando
só a primeira coordenada bate.

```mdx
<ScaleVector />

<ScaleVector
  v={[2, 3]} initial={1} kMin={-2.5} kMax={2.5}
  targets={[[-4, -6], [4, 5]]}
  window={{xMin: -6, xMax: 6, yMin: -8, yMax: 8}} xUnit={22} labelEvery={2}
/>
```

| Prop | O que faz |
|---|---|
| `v` | o vetor |
| `initial`, `kMin`, `kMax`, `step` | valor final do passeio e limites do deslizante |
| `targets` | pontos-alvo `[[x, y], ...]` |
| `window`, `xUnit`, `labelEvery` | janela, escala e numeração dos eixos |
| `caption` | troca a legenda |

## RobotRecipe

Combinação linear como receita. Dois deslizantes inteiros (a e b, de −1 a 3)
dão as voltas dos motores u e v; cada volta é uma seta. A seta verde vai da
origem até onde o robô parou. A malha tracejada mostra as receitas inteiras. O
painel escreve a·u + b·v, diz quanto falta para o alvo e guarda as receitas que
acertaram. Com `intro`, monta a receita inicial volta por volta ao entrar na
tela.

```mdx
<RobotRecipe />
```

| Prop | O que faz |
|---|---|
| `u`, `v` | direções dos motores (padrão (2, 1) e (1, 3); a janela é fixa para esses dois) |
| `target`, `targetName` | o alvo e o nome dele em LaTeX |
| `initialA`, `initialB` | receita inicial |
| `intro` | `false` desliga a montagem animada |
| `caption` | troca a legenda |

## PathFraction

T = A + t·AB. Deslizante em doze avos do caminho (passa por 1/4, 1/3, 1/2, 2/3,
3/4); botões 1/3, 1/2 e 2/3. Ao entrar na tela, o t vai de 0 a 1/2. O painel
escreve a conta, com “≈” quando a coordenada não é exata.

```mdx
<PathFraction A={[2, 2]} B={[11, 7]} />
```

| Prop | O que faz |
|---|---|
| `A`, `B` | os pontos (janela fixa de −1 a 12 por −1 a 8) |
| `initial` | número de doze avos mostrado no fim do passeio (padrão 6) |
| `caption` | troca a legenda |

## ScaledSumTriangle

A distributiva k(u + v) = ku + kv. O triângulo sombreado de lados tracejados é
u, v e u + v; o triângulo de setas é o mesmo com os lados multiplicados por k
(deslizante de 0,5 a 2,5). O painel escreve os dois lados da igualdade. Ao
entrar na tela, o k vai de 1 a 2.

```mdx
<ScaledSumTriangle u={[2, 1]} v={[1, 2]} />
```

## SumLengthAngle

O comprimento da soma contra a soma dos comprimentos. A seta b (8) aponta para
a direita; c (6) sai da ponta de b com o ângulo do deslizante (0° a 180°). A
seta verde é b + c. Duas réguas embaixo: a cinza mede 14, a verde mede
‖b + c‖. Botões 0°, 90° e 180°. Ao entrar na tela, o ângulo vai de 0° a 90°.

```mdx
<SumLengthAngle initial={90} />
```

## PlaneWind

O problema motivador e a resolução da lição 7.30. Cada unidade do plano vale
100 km/h. Avião a 500 km/h e 30° do leste, vento de 60 km/h para o sul.

```mdx
<PlaneWind />                 {/* o problema */}
<PlaneWind mode="solved" />   {/* a resolução */}
```

| Prop | O que faz |
|---|---|
| `mode` | `'problem'` (padrão): uma hora de voo em 4 s. A seta azul tracejada cresce na direção do nariz (onde o avião estaria sem vento); a laranja, da ponta dela, mostra o arrasto do vento; o ponto e o rastro verdes são o avião de verdade, com "GPS: ?" no fim. `'solved'`: componentes da seta azul (433 e 250), o vento descendo 60 da ponta, a seta verde (433, 190) com ≈ 472,9 e 23,7° |
| `caption` | **texto simples** |

## TwoRoutes

Da praça (origem) até a padaria (4, 3): o caminhante laranja anda 4 para o
leste e 3 para o norte; depois o azul anda 5 em linha reta, e a cunha marca
≈ 36,9°.

```mdx
<TwoRoutes />
```

Só `caption` (texto simples).

## VectorAngleDial

Seta de tamanho 4 na origem, cunha azul do semieixo x positivo até ela
(anti-horário) e a reta da direção em cinza tracejado. Deslizante de 0° a
359°; cada botão faz a seta girar do ângulo atual até o novo. Ao aparecer,
gira de 0° até `initial`.

```mdx
<VectorAngleDial initial={30} />
<VectorAngleDial initial={216.87} reference caption="..." />
```

| Prop | O que faz |
|---|---|
| `initial` | ângulo final da animação inicial (padrão 30) |
| `reference` | mostra o ângulo de referência (cunha laranja, até a parte do eixo x mais próxima) fora do 1º quadrante, como contraexemplo |
| `presets` | `[{deg, label}]` (padrão 30°, 210°, 90° e a seta de (−4, −3)) |
| `caption` | **texto simples** |

## StretchedCycle

O ciclo de raio 1 (laranja) com a seta até $(\cos\theta,\ \sen\theta)$; ao
aparecer, a seta estica sem girar até o tamanho r (azul), e a circunferência
tracejada de raio r acompanha. Deslizantes de ângulo e tamanho; o painel
mostra $r \times (\cos\theta,\ \sen\theta)$ com os números.

```mdx
<StretchedCycle />   {/* começa em (4, 3): r = 5, θ ≈ 36,87° */}
```

| Prop | O que faz |
|---|---|
| `initialAngle`, `initialR` | padrão 36,87° e 5 |
| `caption` | **texto simples** |

Quando r é menor que 1, a seta azul é desenhada por cima da laranja, para as
duas continuarem visíveis.

## ComponentShadows

Seta azul de tamanho r e ângulo θ; linhas cinza até os eixos; as sombras com
sinal são setas sobre os eixos (horizontal laranja, vertical verde), rotuladas
$r\cos\theta = \ldots$ e $r\sen\theta = \ldots$.

```mdx
<ComponentShadows />                       {/* 5 a 150° */}
<ComponentShadows triangle presets={[...]} />
```

| Prop | O que faz |
|---|---|
| `initialR`, `initialAngle` | padrão 5 e 150 |
| `triangle` | desenha o triângulo retângulo sob a seta, com o ângulo de referência (cunha laranja) e catetos rotulados pelo **tamanho**, sem sinal; o painel compara com a fórmula |
| `presets` | `[{r, deg}]` (padrão 5 a 150°, 5 a 30°, 4 a 240°, 4 a 315°) |
| `caption` | **texto simples** |

Deslizante de ângulo em passos de 5°, de tamanho em passos de 0,5.

## ArctanHalfTurn

Deslizantes para as coordenadas inteiras a e b (de −6 a 6). A seta azul é o
vetor; a reta cinza tracejada tem inclinação b/a; a seta laranja tracejada, do
mesmo tamanho, aponta em $\arctg\frac{b}{a}$, com a cunha do ângulo. Com a
negativo aparece o botão "Girar a seta laranja meia volta", que a gira 180°
até cair sobre a azul. Com a = 0, o painel diz que a divisão não existe e dá
90° ou 270°; com o vetor nulo, que não há ângulo.

```mdx
<ArctanHalfTurn />                                     {/* começa em (−3, 4) */}
<ArctanHalfTurn record initialA={1} initialB={2} presets={[[1, 2], [-1, 2]]} caption="..." />
```

| Prop | O que faz |
|---|---|
| `initialA`, `initialB` | vetor inicial (padrão −3 e 4) |
| `record` | botão "Anotar este vetor na tabela" e tabela com b/a, arctg, "a é negativo?" e o ângulo certo (até 6 linhas, sem repetir vetor) |
| `presets` | `[[a, b], ...]` (padrão (−3, 4), (3, −4), (4, 3), (−4, −3), (0, 5)) |
| `caption` | **texto simples** |

## NormalizeShrink

O vetor v (azul, fica tracejado quando a cópia começa a mudar) e o ciclo de
raio 1 (verde tracejado). Uma cópia verde encolhe, ou estica, sobre a mesma
reta até a ponta tocar o ciclo; o painel mostra o módulo e a divisão de cada
coordenada por ele. O botão do erro desenha (laranja) o resultado de dividir
pela soma das coordenadas, com o tamanho dele; quando a soma é zero ou
negativa, o painel explica por que nem isso funciona. O botão (0, 0) mostra
que o vetor nulo não se normaliza.

```mdx
<NormalizeShrink />   {/* começa em (4, 3) */}
```

| Prop | O que faz |
|---|---|
| `initial` | vetor inicial (padrão `[4, 3]`); os botões trocam entre (4, 3), (1, 1), (−3, 4), (0,4; −0,3) e (0, 0) |
| `caption` | **texto simples** |

## RampPull

O carrinho da lição `geometria/produto-escalar`. A rampa avança 8 e sobe 6
($\vec{d} = (8,\ 6)$); a corda puxa com 50 N na direção de $(30,\ 40)$. Escala
da força: 1 unidade para 10 N.

```mdx
<RampPull />
<RampPull mode="solved" />
```

| Prop | O que faz |
|---|---|
| `mode` | `'question'` (padrão): o carrinho sobe a rampa puxado pela corda e termina com o ângulo $\theta = ?$ e a seta $\vec{d}$ sobre a rampa. `'solved'`: a força se divide em parte ao longo da rampa (azul, a força útil) e parte perpendicular (verde), com tracejados fechando o retângulo; controle do ângulo entre corda e rampa (0° a 180°) e botões “alinhada”, “como no problema” (16,26°, exatamente $(30,\ 40)$), “em ângulo reto” e “obtusa, 120°”. O painel faz $\vec{F} \cdot \vec{d}$ e a força útil |
| `caption` | substitui a legenda padrão |

## DotPairs

Duas listas lado a lado, uma linha por par, em cartões. Na animação, cada
linha escreve o produto do seu par e, no fim, os produtos são somados num
número só.

```mdx
<DotPairs a={[3, 2, 5]} b={[4, 10, 2]} names={['café', 'queijo', 'pão']} unit="reais" />
<DotPairs a={[3, 4]} b={[2, -1]} names={['primeira', 'segunda']}
  headA="\vec{u} = (3,\ 4)" headB="\vec{v} = (2,\ -1)" />
<DotPairs a={[3, 2, 5]} b={[4, 10, 2]} names={['café', 'queijo', 'pão']} unit="reais"
  controls={['swap', 'double']} />
```

| Prop | O que faz |
|---|---|
| `a`, `b` | as duas listas (mesmo tamanho) |
| `names` | nome de cada linha, à esquerda (texto curto: a coluna tem uns 90 px) |
| `headA`, `headB`, `headP` | títulos das colunas, em LaTeX (padrão: quantidade, preço, produto) |
| `unit` | unidade escrita depois do total |
| `controls` | `'swap'` troca as colunas (os produtos não mudam); `'double'` dobra a primeira lista (cada produto e o total dobram) |
| `caption` | legenda |

## DotSignExplorer

Plano de $-6$ a $6$. O vetor `u` fica parado; dois controles escolhem as
coordenadas inteiras de $\vec{v}$. A reta tracejada passa pela origem em
ângulo reto com $\vec{u}$; o lado de $\vec{u}$ fica sombreado (produto
positivo). Uma fatia verde marca o ângulo entre as setas, pelo lado menor.

```mdx
<DotSignExplorer />
<DotSignExplorer u={[3, 0]} initial={[3, 3]} presets={[[3, 3], [0, 4], [-3, 3], [-4, -3]]} readout="angle" />
```

| Prop | O que faz |
|---|---|
| `u` | o vetor parado (padrão $(4,\ 1)$) |
| `initial`, `presets` | $\vec{v}$ inicial e os botões |
| `readout` | `'sign'` (padrão): conta das coordenadas e tipo de ângulo. `'angle'`: acrescenta $\cos\theta$ e $\theta$ pelo arco cosseno |
| `range` | alcance dos controles (padrão 5) |
| `caption` | substitui a legenda padrão |

## DotRotateInvariant

$\vec{u}$ (tamanho 4, a 65° do eixo) e $\vec{v}$ (tamanho 5, a 20°) giram
juntos 20° no sentido horário; o painel mostra as coordenadas mudando e a
conta das coordenadas parada em 14,14. No fim, $\vec{v}$ fica no eixo $x$ e um
tracejado verde mostra a sombra $4\cos 45^\circ$. Depois, quatro controles
(tamanhos e ângulos com o eixo) e o painel com as duas contas lado a lado:
pelas coordenadas e por tamanho × tamanho × cosseno. Sem props além de
`caption`.

## DotShadow

$\vec{v}$ deitado (tamanho no controle, 1 a 6) e $\vec{u}$ de tamanho 4 com o
ângulo no outro controle (0° a 180°). O tracejado desce da ponta de $\vec{u}$
em ângulo reto com a reta de $\vec{v}$, e uma faixa verde mostra a sombra,
que passa para o outro lado da origem com ângulo obtuso. O painel faz
$\text{sombra} \times \lVert \vec{v} \rVert$ e confere pelas coordenadas.
Props: `initialTheta` (50), `initialB` (5), `caption`.

## PerpTurn

$\vec{u} = (2,\ 3)$ parado; uma cópia gira um quarto de volta até
$(-3,\ 2)$, com a fatia do ângulo crescendo, e o painel acompanha o produto
(13 no começo, 0 no fim, com o quadradinho do ângulo reto). Botão do
contraexemplo $(-2,\ 3)$, tracejado, com produto 5. Sem props além de
`caption`.

## SlopeDirections

Duas retas pela origem com inclinações $m_1$ e $m_2$ (controles de $-3$ a $3$,
passo 0,25) e as setas $(1,\ m_1)$ e $(1,\ m_2)$. O painel faz
$1 + m_1 m_2$ e diz se as retas são perpendiculares. Botões: $(2;\ -0{,}5)$,
$(1;\ -1)$, $(0{,}5;\ 1)$ e “horizontal e vertical”, que troca a segunda reta
pela vertical $(0,\ 1)$. Sem props além de `caption`.

## DotSumLength

O barco da lição de soma: velocidade própria de 8 km/h, correnteza de 6 km/h,
ângulo entre as duas num controle. O paralelogramo tracejado e a soma em
verde. O painel abre $\lVert \vec{u} + \vec{v} \rVert^2 = 64 + 2\,\vec{u}
\cdot \vec{v} + 36$: 10 com 90°, 14 com 0°, 2 com 180°. Props: `initial` (90),
`caption`.

## CableSearch

O problema motivador e a resolução da lição 7.32: estrada pela origem na
direção de (4, 3), galpão em G(2, 9), R\$ 15 mil por km de ramal.

```mdx
<CableSearch />                 {/* a busca, com tabela de tentativas */}
<CableSearch mode="solved" />   {/* a resolução */}
```

| Prop | O que faz |
|---|---|
| `mode` | `'search'` (padrão): o deslizante leva a emenda E pela estrada (de −1 a 10 km do poste, de 0,5 em 0,5); o painel mede o ramal e o custo; "Registrar esta tentativa" guarda o caso numa tabela, com o menor em negrito e o aviso de que a tabela não cobre os pontos entre dois testes. `'solved'`: H(5,6; 4,2) marcado, a sombra de 7 km, o ramal de 6 km e o ângulo reto; o deslizante leva outra emenda Q, e o painel mostra o ramal de Q como a raiz de 6² + (s − 7)² |
| `initial` | posição inicial da emenda, em km do poste (padrão 0 na busca, 5 na resolução) |
| `caption` | **texto simples** |

## ProjectionDrop

Os três passos do gesto, animados: a linha que desce em ângulo reto da ponta
de v até a reta de u; a sombra crescendo da origem até o pé; a marca de ângulo
reto e os rótulos "sombra" e "resto". Botões trocam a vara: (1, 4), (3, 3) e
(−3, 1), este com a sombra atrás da origem.

```mdx
<ProjectionDrop />
<ProjectionDrop u={[4, 2]} initial={[1, 4]} />
```

| Prop | O que faz |
|---|---|
| `u` | o vetor do chão (padrão (4, 2)) |
| `initial` | a vara inicial (padrão (1, 4)) |
| `caption` | **texto simples** |

## ProjectionExplorer

u = (4, 2) parado; v de tamanho 4 fazendo com u o ângulo do deslizante (0° a
180°, de 5 em 5), com botões 30°, 90° e 135°. A sombra encolhe, vira o vetor
nulo em 90° e cai atrás da origem no obtuso.

```mdx
<ProjectionExplorer />
<ProjectionExplorer show="comp" initial={135} />
```

| Prop | O que faz |
|---|---|
| `initial` | ângulo inicial, em graus (padrão 50) |
| `show` | `'sign'` (padrão): o painel liga o sinal de v · u ao lado da sombra. `'comp'`: o rótulo verde vira o número da sombra, e o painel o calcula como ‖v‖ cos θ e como (v · u)/‖u‖ |
| `caption` | **texto simples** |

## ProjectionBuild

Animação em dois movimentos: uma cópia de u encolhe até o unitário; o unitário
estica pelo tamanho da sombra até o pé. O painel faz as duas peças e a conta
única com u · u.

```mdx
<ProjectionBuild />
<ProjectionBuild u={[2, 0]} v={[3, 5]} error box={[-1, 7, -1, 6]} unit={44} />
```

| Prop | O que faz |
|---|---|
| `u`, `v` | os vetores (padrão (4, 2) e (1, 4)) |
| `error` | acrescenta o botão "Mostrar o erro: dividir só uma vez", que desenha (laranja) o tamanho da sombra vezes o próprio u, mais comprido que v |
| `box` | janela `[xMin, xMax, yMin, yMax]`; sem ela, a janela envolve os pontos com folga de 1 |
| `unit` | pixels por unidade (padrão 52) |
| `caption` | **texto simples** |

## ProjectionRuler

A sombra de v (verde) e, logo abaixo da reta, cópias de u (azul) encostadas
uma na ponta da outra, uma por vez; o pedaço que sobra sai tracejado, com o
valor. Com k negativo, as cópias são de −u e vão para trás.

```mdx
<ProjectionRuler />
```

| Prop | O que faz |
|---|---|
| `initial` | caso inicial: 0 = v (2, 9) sobre u (4, 3), k = 1,4; 1 = (1, 4) sobre (4, 2), k = 0,6; 2 = (−4, 3) sobre (2, 1), k = −1. Os três têm botão |
| `caption` | **texto simples** |

## ResidualSlider

v = (1, 4), u = (4, 2). O deslizante escolhe k (0,2 a 1,6, de 0,1 em 0,1); a
seta verde é k u, e o resto (laranja tracejado) vai dela até a ponta de v. Só
em k = 0,6 o resto · u dá zero e a marca de ângulo reto aparece.

```mdx
<ResidualSlider />
<ResidualSlider pythagoras initial={1.2} />
```

| Prop | O que faz |
|---|---|
| `initial` | k inicial (padrão 1,2) |
| `pythagoras` | o painel soma os quadrados dos tamanhos das duas partes e compara com 17, o quadrado do tamanho de v |
| `caption` | **texto simples** |

O deslizante começa em 0,2 de propósito: em k = 0 a "decomposição" v = 0 + v
também satisfaz a soma dos quadrados, sem ângulo reto nenhum, e confundiria.

## ProjectionScale

v = (1, 4) parado; o vetor do chão é c (2, 1), com c no deslizante (−3 a 3, de
0,5 em 0,5). A sombra fica sempre em (2,4; 1,2); o painel mostra o k mudando.
Com c = 0, a figura tira a reta e o painel explica a divisão por zero.

```mdx
<ProjectionScale />
```

| Prop | O que faz |
|---|---|
| `initial` | c inicial (padrão 1) |
| `caption` | **texto simples** |

## PointToLine

A reta (azul) por A na direção u e o ponto P. Animação: a seta de A até P; a
linha que desce de P em ângulo reto; a sombra de AP crescendo a partir de A; o
pé H, o ângulo reto e a distância. Padrão: o exemplo 5 da lição 7.12, reta
y = 2x + 3, A(0, 3), u = (1, 2), P(1, 8), H(2,2; 7,4), d ≈ 1,34.

```mdx
<PointToLine error />
<PointToLine compare caption="..." />
```

| Prop | O que faz |
|---|---|
| `A`, `u`, `P` | a reta e o ponto |
| `box`, `unit` | janela e pixels por unidade (padrão `[-1, 4.6, -0.6, 9.6]` e 44) |
| `lineLabel` | rótulo da reta, em LaTeX (padrão `'y = 2x + 3'`; `null` tira) |
| `error` | botão "Mostrar o erro: projetar o próprio P": a reta pela origem (cinza), a seta da origem até P e o ponto vazado que sai, fora da reta azul |
| `compare` | deslizante de outro ponto Q = A + s u da reta; o painel faz PQ² = PH² + HQ² |
| `caption` | **texto simples** |

## DroneRoutes

Os drones do galpão: A parte de (1, 2) com (2, 1) por segundo, B parte de
(9, 1) com (−1, 2). Janela de 0 a 11 por 0 a 10.

```mdx
<DroneRoutes mode="routes" caption="..." />   {/* o problema motivador */}
<DroneRoutes mode="places" caption="..." />   {/* as rotas se cruzam? */}
<DroneRoutes mode="meeting" caption="..." />  {/* os drones batem? */}
```

| Prop | O que faz |
|---|---|
| `mode` | `'routes'`: cada drone com a seta de um segundo; as rotas tracejadas crescem até a borda (3,5 s), botão "Ver as rotas de novo". `'places'`: dois controles, t (drone A) e s (drone B), de 0 a 4 em meios segundos; rastro sólido de cada drone; o painel avisa quando os dois param no mesmo ponto. `'meeting'`: um controle só, o mesmo t; tracejado cinza entre os drones, diferença em x, em y e distância. Nos dois últimos, pontinhos com os instantes 0 a 4 e um círculo verde no cruzamento |
| `A`, `u`, `B`, `v` | partida e deslocamento por segundo de cada drone |
| `marks` | instantes marcados nas rotas (padrão 0 a 4) |
| `xMin`…`yMax`, `xUnit` | janela |
| `caption` | **texto simples** |

## LineWalker

A caminhada P = A + t·d. Ao aparecer, o ponto dá `steps` passos iguais (uma
seta azul por passo). Depois o controle escolhe t: passo fracionário aparece
como pedaço de seta, passo negativo vai para trás em laranja, com a seta d de
referência em cinza. Botão "Só t ≥ 0" mostra a semirreta.

```mdx
<LineWalker A={[1, 2]} d={[2, 1]} caption="..." />
```

| Prop | O que faz |
|---|---|
| `A`, `d` | partida e diretor |
| `tMin`, `tMax`, `step` | faixa do controle (padrão −2 a 4, de meio em meio) |
| `steps` | passos da animação; também o valor inicial do controle (padrão 3) |
| `initial` | valor inicial do controle, se for outro |
| `marks` | passos marcados com o número embaixo (padrão −1 a 4) |
| `xMin`…`yMax`, `xUnit` | janela |

## LineReach

O teste de pertencer. Dois controles movem um ponto X (coordenadas inteiras).
A seta AX sai em laranja e o diretor d em azul, por cima. O painel calcula
quantos passos cada coordenada pede e diz se combinam. Botão "Guardar este
ponto" monta uma lista dos pontos testados.

```mdx
<LineReach A={[1, 2]} d={[2, 1]} caption="..." />
```

Props: `A`, `d`, `initial` (padrão `[7, 5]`), `xMin`…`yMax`, `xUnit`,
`caption`. Trata o caso X = A e diretores com coordenada zero.

## ParametricShadows

O ponto P anda pela reta e leva duas sombras: azul no eixo x, verde no eixo y.
Na animação (t de 0 a `tEnd`), cada passo inteiro deixa uma marca em cada
eixo. O painel escreve as duas paramétricas com o t do controle.

```mdx
<ParametricShadows A={[1, 2]} d={[2, 1]} caption="..." />
```

Props: `A`, `d`, `tMin`, `tMax` (controle de meio em meio), `tEnd` (padrão 3),
`xMin`…`yMax`, `xUnit`, `caption`.

## SameLineRecipes

Receita azul A + t·d fixa e receita laranja B + t·e escolhida nos botões
("Outro relógio" (5, 4) + t(2, 1), "Outro passo" (1, 2) + t(−4, −2), "Os dois
trocados" (5, 4) + t(−4, −2), "Contraexemplo" (1, 2) + t(1, 2)). Um controle
move P e Q com o mesmo t; pontinhos marcam os passos inteiros das duas
receitas. O painel faz os dois testes (diretores paralelos, partida na reta).

```mdx
<SameLineRecipes A={[1, 2]} d={[2, 1]} caption="..." />
```

Props: `A`, `d`, `initialRecipe` (`'clock'`, `'step'`, `'both'`, `'wrong'`),
`xMin`…`yMax`, `xUnit`, `caption`. As receitas estão fixas no componente,
feitas para a rota (1, 2) + t(2, 1).

## SlopeSteps

Dois controles escolhem o diretor (a, b), inteiros de −3 a 3. A reta passa
por A; os dois primeiros passos aparecem como escadinha (a em azul, b em
verde) e o diretor como seta laranja. O painel dá m = b/a simplificada, ou
avisa que a reta é vertical (a = 0) ou que não há reta (vetor nulo).

```mdx
<SlopeSteps caption="..." />
```

Props: `A` (padrão `[1, 2]`), `initial` (padrão `[2, 1]`), `xMin`…`yMax`,
`xUnit`, `caption`.

## NormalVector

A reta a·x + b·y = k, dois pontos dela movidos por controles (de `step` em
`step` na coordenada x) e o normal n saindo de P₁ com o quadradinho do ângulo
reto. O painel mostra as duas contas que dão k, a diferença zero e o produto
escalar n · P₁P₂ = 0. Botão "Andar na direção de n": o ponto R = P₁ + n sai da
reta.

```mdx
<NormalVector caption="..." />
```

Props: `n` (padrão `[2, 3]`), `k` (padrão 12), `p1Range`, `p2Range`, `step`
(padrão 1,5, para as coordenadas saírem inteiras), `initial` (x de P₁ e de
P₂), `xMin`…`yMax`, `xUnit`, `caption`. Escolha `p1Range` de modo que P₁ + n
caiba na janela.

## NormalSide

P₀ e n fixos; o aluno move P (inteiros). Sombreia o semiplano para onde n
aponta. O painel calcula n · (P − P₀) e diz: zero (na reta), positivo (lado
de n), negativo (outro lado).

```mdx
<NormalSide caption="..." />
```

Props: `P0` (padrão `[3, 2]`), `n` (padrão `[2, 3]`), `initial`, `xMin`…`yMax`,
`xUnit`, `caption`.

## DistanceAlongNormal

A reta a·x + b·y + c = 0 (com b ≠ 0), o ponto P e um ponto A que desliza
pela reta (animação de 5 s: vai de uma ponta à outra da faixa e volta a
`initial`; depois, o controle). Mostra w = AP, o normal n em A, a parte de w
na direção de n (verde, saindo de A), o resto de w (tracejado cinza) e o
tracejado verde de P até o pé H, com ângulo reto. O painel mostra que w · n
não muda.

```mdx
<DistanceAlongNormal caption="..." />
```

Props: `a`, `b`, `c` (padrão 2, −1, 3), `P` (padrão `[1, 8]`), `sRange`
(faixa da coordenada x de A, padrão −1,5 a 2), `initial` (padrão 0),
`xMin`…`yMax`, `xUnit`, `caption`.

## LevelLines

A reta a·x + b·y + c = 0 e as paralelas onde a conta vale múltiplos de |n|
(tracejadas), a 1 de distância uma da outra. O valor de cada paralela fica
escrito ao lado do normal, como numa régua. O aluno move P (inteiros) e o
painel calcula a conta e a distância |conta| ÷ |n|.

```mdx
<LevelLines caption="..." />
```

Props: `a`, `b`, `c` (padrão 3, 4, −7), `base` (ponto da reta onde sai o
normal, padrão `[1, 1]`), `levels` (múltiplos de |n| desenhados, padrão −2 a
6 sem o 0), `initial` (padrão `[4, 5]`), `xMin`…`yMax`, `xUnit`, `caption`.
Funciona melhor com |n| inteiro (3, 4 → 5).

## ClosestOnRoute

A rota A + t·d, um ponto fixo S e o drone no instante t (controle de `step`
em `step`). Tracejado verde do drone até S com a distância; seta d no drone;
quadradinho de ângulo reto no instante do ponto mais perto. Na animação, o
drone voa de t = 0 até esse instante. O painel dá o sinal de (P(t) − S) · d.

```mdx
<ClosestOnRoute caption="..." />
```

Props: `A`, `d`, `S` (padrão `[1, 2]`, `[2, 1]`, `[4, 8]`), `tMax`, `step`
(padrão 0,2, para cair em 2,4), `xMin`…`yMax`, `xUnit`, `caption`.

## SpaceScene

Cena em três dimensões, com a mesma convenção do `Space3D` (y para a direita,
z para cima, x na diagonal para baixo e para a esquerda, encurtado). A
diferença: recebe uma lista de peças, que um componente animado remonta a cada
quadro, e pode girar em torno do eixo z.

O eixo x vai na tela para (−0,5; −0,25) por unidade (no `Space3D` é 0,6 a
210°). Com esses números, (x, y, z) cai no papel em (y − 0,5x; z − 0,25x): os
pontos (0, 2, 3) e (4, 4, 4) coincidem, o que o `DepthTwins` usa.

```mdx
<SpaceScene
  unit={40}
  axes={{max: [4, 5, 4]}}
  frame={[[3, 4, 2]]}
  items={[
    {type: 'arrow', from: [0, 0, 0], to: [3, 4, 2], tone: 1, math: '\\vec{v}'},
    {type: 'point', at: [3, 4, 2], tone: 2},
  ]}
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `items` | lista de peças (abaixo) |
| `view` | giro da cena em torno de z, em graus (padrão 0) |
| `frame`, `frameViews` | pontos que precisam caber e vistas em que precisam caber; o tamanho da figura só depende deles, e não muda enquanto as peças se movem |
| `axes` | `{max: [x, y, z], min: [x, y, z]}`; `null` esconde os eixos |
| `axesOpacity` | apaga os eixos (o `SheetFlatten` usa durante o giro da folha) |
| `unit`, `padding`, `maxWidth`, `axisLabels`, `caption` | escala, margem, largura máxima, nomes dos eixos, legenda |

Peças (`type`): `line` (`from`, `to`, `dashed`, `dotted`, `guide`, `width`),
`arrow` (`from`, `to`), `point` (`at`, `r`), `poly` (`pts`, `fill`, `stroke`),
`right` (marca de ângulo reto: `at`, direções `a` e `b`, `size`), `arc` (arco
de ângulo: `at`, `a`, `b`, `r`, `labelR`), `label` (`at`, `math`). Toda peça
aceita `tone`, `opacity` e um rótulo `math` com `dx`, `dy`, `anchor`, `size`.

Funções exportadas: `project`, `turn`, `add`, `sub`, `times`, `dot`, `norm`,
`cross`, `lerp`, `arcPoints`, `pointBox(p)` (a caixa do ponto, como no
`Space3D`), `fullBox(a, b)` (as 12 arestas tracejadas), `num`, `tex`, `triple`
(terna na notação da casa).

Cuidado próprio: a marca de ângulo reto é desenhada no espaço, então sai como
paralelogramo em perspectiva. Use-a junto de um polígono pintado (o triângulo
do ângulo), para o aluno ler o canto.

## SpaceWalk

Animação do endereço: o ponto anda x, depois y (no chão), depois sobe z,
deixando os três trechos verdes (as arestas da caixa). Botões trocam o ponto.

```mdx
<SpaceWalk presets={[[3, 4, 2], [2, 4, 3], [2, 3, -1]]} />
<SpaceWalk showWhere presets={[[0, 0, 3], [3, 0, 0], [3, 4, 0], [0, 3, 2]]} />
```

| Prop | O que faz |
|---|---|
| `presets` | lista de ternas inteiras (os botões) |
| `initial` | índice do ponto inicial |
| `showWhere` | o painel diz se o ponto está num eixo, no chão ou numa parede |

## DepthTwins

P(0, 2, 3) e Q(4, 4, 4) caem no mesmo lugar do papel. Botões mostram a caixa
de cada um; o deslizante gira a cena (−40° a 40°) e separa os dois. Sem props
além de `caption`.

## FloorThenUp

Pitágoras duas vezes com os números do drone (3, 4, 12): catetos 3 e 4 com
ângulo reto, diagonal do chão 5; depois a vertical 12 com ângulo reto em S e
a hipotenusa 13. O painel mostra as duas contas. `stages={1}` para só a etapa
do chão.

## PoleSquare

Um esquadro em pé, com um lado no poste vertical e outro no chão, dá uma volta
em torno do poste e termina apontando para a origem. Sem props além de
`caption`.

## BoxDiagonalExplorer

Caixa com cantos A e A + (a, b, c): o caminho verde pelas arestas e a seta
azul pela diagonal; o painel compara a + b + c com √(a² + b² + c²).

```mdx
<BoxDiagonalExplorer />
<BoxDiagonalExplorer from={[1, 2, 3]} initial={[2, 3, 6]} sliders={false} names={['A', 'B']} />
```

| Prop | O que faz |
|---|---|
| `from` | canto de saída (padrão a origem) |
| `initial` | arestas (a, b, c) |
| `sliders`, `max` | deslizantes de 0 a `max` (padrão 6) |
| `names` | nomes dos dois cantos (padrão O e P) |

## SpaceVectorSlide

A seta de A(1, 3, 0) até B(3, 6, 6) e a cópia que desliza até a origem,
terminando em (2, 3, 6). Botão para comparar com (2, 3, −6), de mesmo módulo.

## SpaceTipToTail

u = (0, 2, 1) e, da ponta dele, v = (3, 1, −1); a soma (3, 3, 0) volta ao
chão. Botão "Mostrar 2u".

## SheetFlatten

u e v saem da origem; o triângulo O, ponta de u, ponta de v vira uma folha
verde, que gira como objeto rígido (rotação de Rodrigues) até o plano yz, que
sai sem perspectiva. No fim: θ, ‖u‖, ‖v‖, ‖u − v‖. O painel faz a conta dos três
lados e do cosseno. Dois pares: (1, 2, 2) e (2, −1, 3) (θ ≈ 57,7°), e (1, 1, 0)
e (0, 1, 1) (60°, triângulo equilátero).

## CubeAngles

Cubo de aresta 1 com um canto na origem; botões escolhem pares de setas
(arestas, diagonal do chão, diagonal do cubo, diagonais de face). Arco do
ângulo, ou marca de ângulo reto quando o produto é zero. Prop `pairs` para
trocar a lista: `[{name, u, v}]`.

## DroneFlight

`mode="intro"`: o drone voa de O até P(3, 4, 12), com as três medidas e "? m".
`mode="solved"`: sombra 5, subida 12 com ângulo reto em S, voo 13 e θ ≈ 67,4°.

## Auxiliares dos componentes de vetores

Funções sem desenho, importadas pelos componentes do Módulo 8. Use-as num
componente novo de vetor em vez de reescrever as contas e a formatação.

| Arquivo | O que tem |
|---|---|
| `mathviz/vectorArc.js` | `polar`, `angleOf` (ângulo de 0° a 360°), `wedge` (arco de ângulo), `edgePoint`, `dec`/`decText` (vírgula decimal), `pairTex` (par na notação da casa) |
| `mathviz/projection.js` | `dot`, `add`, `sub`, `times`, `norm`, `lerp`, `kOf` (fator da projeção), `rightAngle` (marca de ângulo reto), `clipLine` (reta cortada na janela), `num`/`par`/`pair` (números e pares formatados) |
| `mathviz/lineParam.js` | `at(A, d, t)` (ponto da reta), `windowRange`, `rightAngleMark`, `signed`, e as mesmas `add`/`sub`/`dot`/`norm` |
| `VectorSumKit/index.js` | `pairMath` (ponto e vírgula quando alguma coordenada tem vírgula), `signedMath`, `plainNumber` |

## useAnimation

Hook de `src/components/mathviz/useAnimation.js`, a base de toda figura
animada. Devolve o tempo `t` (em segundos, de 0 até `duration`) e a função
`play`; o componente desenha cada quadro em função de `t`.

```jsx
import useAnimation, {stage, arcPath, onCircle} from '../mathviz/useAnimation';

const {ref, t, play, playing} = useAnimation({duration: 4});
const lift = stage(t, 0, 1.2); // progresso suavizado (0 → 1) da etapa de 0 s a 1,2 s
return (
  <figure ref={ref}> ... </figure>  // a animação começa quando esta figura aparece
  <button onClick={() => play()}>Ver de novo</button>
);
```

| Opção | O que faz |
|---|---|
| `duration` | duração em segundos — de 2 a 5 na maioria das figuras |
| `autoplay` | `false` para só animar quando o aluno apertar o botão (padrão `true`) |
| `onFrame(t, total)` | chamada a cada quadro — útil para soltar o controle manual durante a animação |

`play({duration})` troca a duração naquela vez (como na `RadianCount`, em que
meia volta demora menos que a volta inteira).

Regras que o hook já garante, e que um componente novo não deve desfazer:

- **no build e para quem pediu menos movimento, `t` começa no fim** — o HTML
  estático e a captura de tela mostram o quadro final completo, então o
  quadro final precisa ser o que ensina;
- a animação automática acontece uma vez, quando a figura entra na tela; as
  outras vêm do botão.

Ferramentas no mesmo arquivo: `ease`, `stage(t, a, b)`, `onCircle(cx, cy, r, ângulo)`,
`arcPath(cx, cy, r, de, até)` (ângulos em radianos, anti-horário), `fmt`
(vírgula decimal), `piFraction(graus)` e `fractionOf180(graus)` (frações em
LaTeX).

Para conferir uma animação, `scripts/capturar-figuras.js` captura o quadro
final por padrão; com `MOTION=play WAIT=600` (e outro `WAIT`) ele captura
quadros do meio.

## WinchExplorer

Guincho em escala: o tambor (raio 25 cm) gira, o cabo enrola e a carga sobe. O
arco laranja da borda e a barra laranja da subida têm o mesmo comprimento no
desenho. Anima de 0 até `initial` quando aparece; depois o deslizante controla.

```mdx
<WinchExplorer initial={80} />
<WinchExplorer initial={80} showRadians />
```

| Prop | O que faz |
|---|---|
| `initial` | giro inicial em graus (padrão 80) |
| `max` | giro máximo do deslizante (padrão 180 — acima disso a carga encostaria no tambor) |
| `showRadians` | acrescenta ao painel a conversão e a conta $s = r\theta$; deixe desligado antes de o radiano ser ensinado |
| `caption` | legenda |

## RadianString

A definição de 1 radiano acontecendo: uma cópia do raio fica em pé na borda,
enrola-se nela sem esticar (a parte solta segue pela tangente) e então surgem
as duas linhas do centro, o “1 rad” e o “≈ 57,3°”. Sem props além de `caption`.

## RadianCount

Barbantes do tamanho do raio colados na borda, alternando dois tons para dar
para contar, e os mesmos pedaços esticados numa régua na mesma escala. Botões
para um quarto de volta, meia volta e volta inteira. `initial`: `'quarto'`,
`'meia'` (padrão) ou `'volta'`.

## DegreeRadianDial

Mostrador de duas escalas — graus por fora, radianos por dentro —, de 15° em
15°. O painel converte pelo raciocínio “que pedaço de 180° é esse?” antes de
mostrar o resultado. `initial` em graus (padrão 135).

## RollingWheel

Roda de raio 0,30 m rolando até 3 m sem escorregar. Pinta no mesmo tom o
trecho do chão percorrido e o arco da borda que já encostou nele, e mostra
$\theta = s/r$ e as voltas. Anima ao aparecer; o deslizante controla depois.

## WrapLine

A reta numérica, de 0 a $2\pi$, enrolando-se no círculo de raio 1 a partir de
$(1,\ 0)$. Inteiros do lado de fora da curva, múltiplos de $\frac{\pi}{2}$ do
lado de dentro; o raio e o ângulo até o último ponto enrolado no terceiro tom.
Anima ao aparecer; o deslizante controla depois.

## CommonFactorArea

Retângulos de **mesma altura** lado a lado. Ao aparecer na tela, eles
deslizam até encostar e a segunda anotação da altura some: é o fator comum
saindo em evidência. Os botões “Juntar (fatorar)” e “Separar (distribuir)”
repetem o movimento nos dois sentidos. O quadro final é o retângulo juntado,
com a largura somada embaixo.

```mdx
<CommonFactorArea
  factor="3"
  grid
  parts={[
    {size: 2, label: '2', area: '6'},
    {size: 5, label: '5', area: '15'},
  ]}
  sumLabel="2 + 5 = 7"
  splitFormula="3 \times 2 + 3 \times 5 = 21"
  mergedFormula="3 \times (2 + 5) = 21"
/>
```

| Prop | O que faz |
|---|---|
| `factor` | rótulo da altura comum, em LaTeX |
| `parts` | `{size, label, area, value?, tone?}` por retângulo: largura em unidades, rótulo da largura, rótulo da área; `value` é o número usado no painel do `slider` |
| `sumLabel` | rótulo da largura somada, que aparece quando os retângulos encostam |
| `splitFormula`, `mergedFormula` | fórmula mostrada embaixo, separado e juntado |
| `grid` | malha de quadradinhos, para a área ser contada (medidas inteiras) |
| `slider` | `{label, min, max, step, initial, digits}`: a altura comum vira um deslizante, e o painel mostra a conta separada e a juntada |
| `start="split"` + `buttons={false}` | figura parada com os retângulos separados — para o problema motivador, antes de a lição ensinar a juntar |
| `heightSize`, `unit` | altura em unidades (padrão 3) e pixels por unidade (padrão 30) |

## EqualGroups

As peças de uma expressão como $12x + 18$ (tiras de $x$ e quadradinhos de 1,
nas cores do `TileModel`) distribuídas como cartas em $k$ montes. Se todos os
montes ficam iguais, $k$ é fator comum e cada monte é o que vai dentro do
parêntese; se não, o painel diz qual tipo de peça não se dividiu. O painel
guarda os números de montes que deram certo — o maior é o MDC. As peças
deslizam até o monte novo (sem movimento para quem pediu menos movimento).

```mdx
<EqualGroups bars={12} units={18} initial={1} max={9} />
```

Props: `bars`, `units`, `letter` (padrão `'x'`), `min`, `max`, `initial`,
`caption`.

## FactorCards

Cada parcela como uma fila de cartões, um cartão por fator. Na animação, os
cartões presentes em **todas** as filas se acendem e formam a coluna do fator
comum; o resto é a sobra de cada fila. Fila que fica vazia ganha o cartão 1.
Os cartões comuns são encontrados sozinhos (interseção das listas).

```mdx
<FactorCards
  terms={[
    {tex: '8x^3', factors: ['2', '2', '2', 'x', 'x', 'x']},
    {tex: '12x^2', factors: ['2', '2', '3', 'x', 'x']},
  ]}
  common="4x^2"
  rests={['2x', '3']}
  result="8x^3 + 12x^2 = 4x^2(2x + 3)"
/>
<FactorCards still terms={[...]} />
```

| Prop | O que faz |
|---|---|
| `terms` | `{tex, factors, sign?}` por parcela; `sign: '-'` para subtração |
| `common` | rótulo do fator comum, em LaTeX |
| `rests` | o que sobra de cada parcela, em LaTeX (mostrado com seta no fim da fila) |
| `result` | fórmula final, embaixo |
| `still` | só as filas, com o sinal de vezes entre os cartões — para apresentar parcela e fator |

## SubstituteExplorer

Tabela com deslizante: o aluno escolhe o valor da letra e vê quanto cada
expressão vale. As funções vêm da lição, em JavaScript.

```mdx
<SubstituteExplorer
  compare
  initial={1}
  rows={[
    {tex: '6x + 9', f: (x) => 6 * x + 9},
    {tex: '3(2x + 3)', f: (x) => 3 * (2 * x + 3)},
    {tex: 'x(6 + 9)', f: (x) => x * (6 + 9)},
  ]}
/>
```

| Prop | O que faz |
|---|---|
| `rows` | `{tex, f, compareTo?}` por linha; `compareTo` é o índice (a partir de 0) da linha com que esta é comparada |
| `compare` | compara todas as linhas com a primeira |
| `zero` | acende as linhas que valem zero |
| `letter`, `min`, `max`, `step`, `initial` | a letra e o deslizante |
| `caption` | legenda: diga o que comparar |

Divisão por zero aparece como “não existe”. Para mostrar que uma escrita
errada coincide por acaso, comece o deslizante no valor da coincidência
(`initial`) e peça ao aluno que arraste.

