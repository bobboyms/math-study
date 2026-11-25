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
| linha de planilha como vetor de 5 coordenadas, em barras: os quatro clientes (`clients`), a linha que vira lista e a ordem trocada (`row`), soma/dobro/média/lista curta (`sum`), diferença gênero por gênero e distância (`diff`), perfis normalizados (`normalize`) | `GenreBars` (animado, com botões) |
| recorte de duas colunas de uma tabela de 5: cada cliente vira uma seta do plano; o múltiplo fica na mesma reta em todo recorte | `GenrePlanePicker` (interativo, botões) |
| módulo como Pitágoras repetido: cada coordenada é uma perna em ângulo reto com a hipotenusa anterior (espiral); pernas em fila contra o módulo | `CoordLengthSpiral` (animado, com botões) |
| a folha plana de dois vetores de $\mathbb{R}^n$ desenhada com os módulos e o ângulo do cosseno; distância entre as pontas medida no desenho igual à conta | `PairSheet` (animado, com botões de par) |
| Cauchy-Schwarz: a parábola $\lVert \vec{u} - t\vec{v} \rVert^2$ nunca desce abaixo do eixo; encosta nele quando um vetor é múltiplo do outro | `CauchyParabola` (deslizante) |
| ângulo entre a diagonal $(1, \ldots, 1)$ e um eixo conforme $n$ cresce: $\cos\theta = 1/\sqrt{n}$ | `DiagonalDims` (deslizante) |
| uma planilha lida por linhas (o total de cada linha) e por uma coluna (o que muda quando um preço muda) | `MatrixStoreQuestions` (animado) |
| matriz como tabela: dimensão $m \times n$ com as linhas na frente, entrada $a_{ij}$ (linha primeiro, coluna depois) | `MatrixTable` (animado; interativo) |
| vetor coluna: o mesmo vetor, deitado e em pé, com as mesmas coordenadas na mesma ordem | `MatrixColumnVector` (animado) |
| matriz vezes vetor pelas duas leituras: por linhas (produto escalar de cada linha) e por colunas (mistura das colunas com os pesos do vetor), lado a lado; mudar um peso move o resultado pela coluna dele | `MatrixVectorReadings` (animado; interativo com `sliders`) |
| leitura por colunas de uma matriz $2 \times 2$ no plano: as colunas como setas encadeadas; $A\vec{e}_j$ é a coluna $j$ | `MatrixColumnsPlane` (animado; interativo) |
| dimensões compatíveis: a linha da matriz posta em pé ao lado do vetor, entrada com coordenada; casa sem par | `MatrixShapeCheck` (interativo, anima a cada mudança) |
| soma de matrizes e número vezes matriz, casa por casa | `MatrixEntrywise` (animado) |
| transposta como reflexo na diagonal, contra o giro de um quarto de volta | `MatrixTranspose` (animado, dois botões) |
| camada de rede neural $W\vec{x} + \vec{b}$: cada linha de $W$ é um neurônio; cada coluna, o efeito de uma entrada | `NeuralLayerMatrix` (animado; interativo) |
| busca com três deslizantes: porções de três alimentos contra três metas ao mesmo tempo, barras por nutriente e registro das tentativas | `SystemSnackPlan` (interativo, busca) |
| cada equação ax + by = c é uma reta; um ponto, paralelas ou a mesma reta; deslizantes de uma equação, botões de sistemas prontos; com `echelon`, a matriz escalonada e a leitura da última linha; com três equações, ponto comum ou triângulo | `SystemLines` (interativo) |
| do sistema com letras para a matriz aumentada: letras e sinais saem, os números deslizam para as colunas; o caminho de volta | `SystemAugmented` (animado) |
| operações elementares com a matriz e as retas lado a lado: trocar, multiplicar por 3, somar múltiplo (a reta gira em volta do cruzamento), multiplicar por 0 (contraexemplo) e desfazer; `mode="slider"` com L2 ← L2 + kL1 | `SystemRowOps` (animado e interativo) |
| escalonamento animado linha a linha: linha que muda pintada, linha que empresta contornada, operação escrita ao lado, troca de linhas com seta; no fim a escada e os pivôs; passo a passo | `SystemElimination` (animado, com botões) |
| está na forma escalonada? primeiro número diferente de zero circulado, a escada tracejada, o degrau que volta ou a linha de zeros no meio em laranja | `SystemEchelon` (estático, com botões) |
| substituição de trás para a frente: o valor sobe por uma seta até a equação de cima | `SystemBackSub` (animado) |
| a variável livre como deslizante: as outras incógnitas calculadas de trás para a frente e conferidas nas equações originais | `SystemFreeVariable` (interativo, com passeio inicial do t) |
| contar pivôs classifica o sistema: matriz e forma escalonada, pivôs em caixas, a linha 0 = c em laranja, posto, desfecho e solução | `SystemPivotCount` (interativo) |
| combinação linear como mistura de tintas: uma barra por pigmento, empilhada por base; busca de receitas com alvos (`targets`) ou despejo animado de uma receita (`pour`) | `PaintMix` (interativo; animado com `pour`) |
| a base que sobra: cada litro de R vira 1 litro de P e 2 de Q, e nenhuma altura muda (p + q + r = 2p + 3q) | `PaintSwap` (animado) |
| a·u + b·v (+ c·w) com um deslizante por vetor, caminho ponta com cauda e rastro; não paralelos enchem o plano, paralelos ficam na reta; alvos com registro; `zeroHunt` procura receita não trivial que volta à origem | `SpanCombo` (interativo, com varredura animada) |
| o alvo é alcançável? a matriz aumentada [u v \| alvo] depois de uma operação, com o alvo nos deslizantes; o canto zera para vetores paralelos | `SpanRowTest` (deslizante) |
| três vetores numa mesma folha do espaço não saem dela: grade de receitas, giro da cena e vista de perfil; troca de R por S | `SpanSheet` (animado e interativo) |
| teste por escalonamento: os vetores como colunas, uma operação por vez, pivôs circulados, coluna sem pivô sombreada, linha sem pivô anotada | `PivotColumns` (animado, com botões por caso) |
| a malha do plano se deformando aos poucos da identidade até a matriz (rotação anima o ângulo; translação escorrega; matriz e translação juntas em duas etapas, camada W x + b; mapas que entortam com `warp`); botões de catálogo, deslizante de ângulo, de cisalhamento ou do progresso; logotipo, pontos com rastro, receita de passos de e1 e e2 | `LinearGridMorph` (animado e interativo) |
| as colunas da matriz são os destinos de e1 e e2: o aluno arrasta as duas pontas, a malha e a matriz acompanham, e a receita de v é refeita na malha nova | `LinearColumnsDrag` (arrastável, com teclado e botões) |
| as duas condições da linearidade no desenho: T(u + v) contra T(u) + T(v) (`mode="sum"`), T(kv) contra kT(v) com deslizante de k (`mode="scale"`); linear, translação e (x², y) nos botões | `LinearityCheck` (animado e interativo) |
| produto de matrizes como comandos em sequência: a malha passa por um comando de cada vez, com pausa e rótulos entre eles; painéis lado a lado comparam AB com BA (o mesmo logotipo indo para lugares diferentes), (AB)C com A(BC), ou dois comandos contra a matriz única; potências C, C², C³ | `ProductComposeGrid` (animado; botões e deslizante de progresso) |
| regra linha por coluna: B em cima, A à esquerda, AB embaixo à direita; cada casa no cruzamento de uma linha de A com uma coluna de B, o par da vez em verde; clique numa casa para ver a conta | `ProductRowColumn` (animado; interativo) |
| dimensões compatíveis como peças de dominó: (m × n)(n × p) encaixa e sobra m × p; números de dentro diferentes não encaixam; cadeia de três peças; transposta como peça virada | `ProductShapeFit` (animado; botões ou deslizantes) |
| duas camadas W x + b valem por uma; a ReLU no meio dobra o gráfico da saída e impede a junção | `TwoLayersCollapse` (animado; deslizante e botão) |
| o código da filial: letras viram números, pares passam por uma matriz (`mode="encode"`, com os pares recebidos e “?” no lugar das letras); os pares recebidos descem pela inversa e viram a palavra (`mode="decode"`); duas palavras chegam ao mesmo par por uma matriz sem inversa (`mode="ambiguous"`) | `InverseCipher` (animado) |
| a malha passando por transformações em sequência: ida e volta (A e depois A⁻¹), as duas ordens, a meia e o sapato com a volta certa e a errada; ponto com rastro e caminho escrito etapa por etapa | `InverseRoundTrip` (animado, com botões) |
| decodificar é resolver um sistema com letras no lado direito: os passos da eliminação e os coeficientes de p e q voando para dentro da matriz inversa; botões com os pares recebidos | `InverseFromSystem` (animado e interativo) |
| a fórmula 2 × 2 como receita: a e d trocam de lugar, b e c trocam de sinal, o fator 1/(ad − bc) vai para a frente; botões − e + nas quatro entradas, o paralelogramo das colunas achatando quando ad − bc = 0 | `InverseFormula2x2` (animado e interativo) |
| sem inversa: a malha achata numa reta (ou num ponto) e dois pontos caem no mesmo lugar, a volta com “?”; com `slider`, o k de [[2, 4], [1, k]] e as imagens se aproximando até coincidir quando ad − bc = 0 | `InverseCollapse` (animado; deslizante com passeio inicial) |
| Gauss-Jordan animado: [A ∣ I] até [I ∣ A⁻¹], caixas de I e de A⁻¹ no fim, ou a linha de zeros em laranja quando não há inversa | `InverseGaussJordan` (animado, com botões de passo) |
| com a inversa, A x = b tem uma única solução: o aluno arrasta b e vê o único x; com a matriz sem inversa, nenhuma solução (b fora da reta alcançada) ou uma reta inteira de soluções | `InverseSolveDrag` (arrastável, com teclado) |
| a malha se deformando com o determinante no painel: terreno de lotes com a área de cada lote (`lots`), região qualquer com a área antes e depois (`region`), achatamento (det zero), duas transformações em sequência com a cadeia de fatores 1 → ×det → ×det (`stages`, com rotação que não encolhe no meio), pontos com rastro; `hideNumbers` para o motivador | `DetGridMorph` (animado, com botões) |
| o recorte que mede o paralelogramo das colunas: o retângulo que o envolve menos seis peças que saem aos pares; com `letters`, a mesma conta em letras até ad − bc | `DetCutout` (animado) |
| o escorregão que não muda a área: o lado v anda na direção de u sobre a paralela tracejada até ficar em pé (0, 5/3), e o deslizante escolhe t em doze avos; o painel faz ad − bc com frações exatas | `DetShearSlide` (animado e interativo) |
| área e sinal juntos: duas colunas arrastáveis, paralelogramo verde (hachurado quando o determinante é negativo), arco do giro da coluna azul para a laranja, reta numérica do determinante; `path` anima a coluna atravessando a reta da outra (det 5 → 0 → −5) | `DetColumnsDrag` (arrastável, animado) |
| o cubo de aresta 1 virando a caixa das três colunas; botões de matrizes, volume no painel, caixa que achata (det zero); `floor` destaca o chão e a altura da matriz triangular; deslizante gira a cena | `DetBox3D` (animado, com botões e deslizante) |
| o efeito de cada operação de linha: a matriz do loteamento passa por E (cisalhamento, troca, esticar por 2, multiplicar por −1), o paralelogramo das colunas vai junto com a malha, o painel compara os determinantes | `DetRowOps` (animado, com botões) |
| escalonamento animado de matriz quadrada com o efeito de cada passo no determinante (não muda, troca de sinal, × k) e, no fim, o produto da diagonal corrigido pelas trocas | `DetElimination` (animado, passo a passo) |
| a regra de Sarrus: as duas primeiras colunas copiadas, as seis diagonais acendendo (três somam, três subtraem), a soma montada no painel; com `letters`, aei + bfg + cdh − ceg − afh − bdi | `SarrusDiagonals` (animado) |
| quantas colunas de uma planilha carregam informação: o aluno apaga colunas, a figura acha a conta que refaz cada uma (ou avisa que se perdeu) e anota as escolhas que não perdem nada | `RankColumnKeeper` (interativo, busca com registro) |
| o mesmo ponto com dois endereços: a viagem pela malha da prefeitura e depois pelas ruas inclinadas de uma base, com o ponto parado | `BasisTwoGrids` (animado, botões de destino) |
| numa base o endereço é único: ir por uma receita e voltar pela outra é uma volta fechada, que só existe quando as direções são dependentes | `BasisAddressLoop` (animado, dois modos) |
| o teste do subespaço: origem, soma e múltiplo de vetores do conjunto, com bolinha cheia (dentro) ou vazada (escapou); reta pela origem, reta deslocada, os dois eixos | `SubspaceClosure` (deslizantes) |
| dimensão como número de deslizantes: só a origem, reta, plano x + z = 2y e espaço, no 3D, com o endereço na base contra as três coordenadas | `DimensionSlots` (animado e interativo) |
| escalonar uma planilha com colunas nomeadas, várias operações por passo, pivôs circulados, colunas "guardada" e "refeita", e as receitas das colunas sem pivô | `RankSheetEchelon` (animado, passo a passo) |
| o escalonamento muda as colunas, mas não as relações: as colunas de [[1, 2], [2, 4]] descem até o eixo x e a reta delas gira | `EchelonColumnsShift` (animado e deslizante) |
| o núcleo é o que a matriz manda para a origem: a malha se achata sobre y = 2x, a reta do núcleo encolhe até a origem e uma reta paralela encolhe até um ponto | `KernelCollapse` (animado e deslizante) |
| teorema do posto como contagem: cada coluna da forma escalonada desce para a caixa "com pivô" (posto) ou "sem pivô" (núcleo) | `RankNullityTally` (animado, botões de matriz) |
| quase toda seta sai da sua reta, e só algumas direções ficam: o aluno gira a seta v e vê Av; gráfico do desvio por ângulo; registro das direções encontradas (com ímã) e botão de varredura | `EigenDirectionSearch` (busca com registro) |
| a malha se deformando da identidade até a matriz com as retas dos autovetores marcadas (as setas sobre elas só esticam); deslizante do autovalor de uma reta (estica, encolhe, vira, achata); pontos de uma reta indo à origem em A − λI; malha quadriculada contra malha dos autovetores (diagonalização) | `EigenGridMorph` (animado e interativo) |
| os autovalores são os λ que fazem A − λI achatar: colunas e paralelogramo de A − λI ao lado da parábola det(A − λI), com registro dos λ que achatam | `EigenCharSlider` (deslizante com registro) |
| rotação sem nenhuma direção que fica (deslizante do ângulo, com o discriminante) e cisalhamento com uma direção só (deslizante de k): doze setas e as suas imagens | `EigenRing` (animado e interativo) |
| aplicar a matriz muitas vezes: a seta se alinha com a reta do maior autovalor, passo a passo, com as duas partes e a tabela dos números | `EigenPowerWalk` (animado e por passos) |
| as potências λ⁰ a λ¹⁰ como barras: some, fica, cresce, alterna | `EigenPowerBars` (deslizante) |
| a população entre cidade e campo, ano a ano (motivador com diagrama de fluxo; resolução com equilíbrio, plano (cidade, campo) e deslizante da população inicial) | `EigenPopulation` (animado e por passos) |
| a primeira tentativa de ajuste: a reta por dois pontos cresce e erra os outros (bolinhas vazias e tracejados com o tamanho do erro) | `FitFirstTry` (animado) |
| a reta y = mx + n pelos apartamentos da 11.12: erros como segmentos verticais com sinal e tabela (`residuals`); quadrados de verdade sobre cada erro e soma no painel (`squares`); busca com a menor soma já vista e tabela de tentativas (`search`); melhor reta e previsão por área, com aviso de extrapolação (`solved`); treino até a solução das equações normais, com a perda descendo (`train`) | `FitLineExplorer` (interativo; `train` animado) |
| somar erros com sinal: as setas dos erros vão para uma coluna, encostadas ponta com ponta, e a fila termina na soma (zero para y = 350) | `FitErrorStack` (animado, com botões de reta) |
| valor absoluto contra quadrado: dois erros que somam 40, um quadrado sobre cada, a barra da soma sem sinal parada e a dos quadrados mudando | `FitAbsVsSquare` (deslizante) |
| a lista de previsões como combinação das colunas: barras m × área mais n, com o preço observado e o erro | `FitPredictionBars` (deslizantes) |
| mínimos quadrados como projeção: o plano das colunas em três dimensões, b fora dele, A c no deslizante e o resto; vista de perfil com ângulo reto de verdade; Pitágoras com o pé H (`pythagoras`) | `FitProjection3D` (interativo e animado) |
| as linhas de A transposta vezes o resto: produto escalar de cada coluna com o resto, coordenada por coordenada (equações normais) | `FitNormalRows` (animado, com botões) |
| o círculo de raio 1 se deformando aos poucos até a imagem pela matriz: elipse, círculo, segmento ou ponto, com o painel dizendo os semieixos; setas singulares v → Av com ângulo reto marcado (`singular`); quarto de disco e arco de orientação, que vira no espelho (`orientation`) | `SvdCircleMorph` (animado, com botões de matriz) |
| a busca da direção que mais e menos estica: seta v de comprimento 1 girada, seta Av, gráfico do comprimento (ou do quadrado, `squared`) contra o ângulo, registro do máximo e do mínimo | `SvdStretchSearch` (deslizante com registro e varredura) |
| A = UΣVᵀ como girar, esticar e girar de novo: círculo, v₁, v₂ e malha passando por Vᵀ, Σ e U, com espelho animado como página virando e reta do espelho tracejada; botões de passo; matrizes escritas (`showMatrices`) | `SvdThreeSteps` (animado, passo a passo) |
| a matriz muda de lado no produto escalar se for transposta: (Av)·w = v·(Aᵀw), e a conta errada sem transpor | `SvdTransposeCheck` (deslizantes) |
| simetria e autovetores perpendiculares: a entrada de baixo, à esquerda, no deslizante; retas de autovetores e o ângulo entre elas, discriminante no painel | `SvdSymmetrySlider` (deslizante) |
| o esticamento ao quadrado como média dos autovalores: v = a v₁ + b v₂, os pesos a² e b² e o ponto λ₁a² + λ₂b² preso entre λ₂ e λ₁ | `SvdWeightedMean` (deslizante) |
| uma coluna vezes uma linha preenchendo a tabela linha a linha (camada de posto 1), em tons de cinza | `SvdOuterProduct` (animado) |
| matriz ou imagem refeita com k camadas σuvᵀ: original, aproximação, erro com sinal e barras do erro por k; comparação com guardar os pixels mais claros (`naive`); foto 32 × 32 embutida (`image="foto"`) | `SvdImageLayers` (deslizante) |
| a melhor camada de posto 1 como a reta pela origem mais perto das linhas da matriz (projeção de cada linha), com registro do menor erro; o mesmo para componentes principais (`mode="pca"`) | `SvdRowsLine` (deslizante com registro e varredura) |
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

## GenreBars

Figuras da lição `algebra-linear/vetores-com-muitas-coordenadas`. Os dados
(quatro clientes, cinco gêneros) e as contas ficam em
`GenreBars/clientes.js`, compartilhado com `GenrePlanePicker`,
`CoordLengthSpiral`, `PairSheet` e `CauchyParabola`: Paula
$(6, 1, 0, 4, 3)$, Gustavo $(12, 2, 0, 8, 6)$, Carla $(3, 3, 4, 1, 2)$, Davi
$(0, 5, 4, 0, 1)$. Paula e Gustavo dividem o tom 1 (mesmo gosto).

```mdx
<GenreBars mode="clients" caption="..." />
<GenreBars mode="row" caption="..." />
<GenreBars mode="sum" cases={['soma', 'dobro', 'media', 'falta']} initial="soma" caption="..." />
<GenreBars mode="diff" pairs={[['Paula', 'Carla'], ['Paula', 'Gustavo']]} caption="..." />
<GenreBars mode="normalize" clients={['Paula', 'Gustavo', 'Carla']} caption="..." />
```

| Prop | O que faz |
|---|---|
| `mode` | `'clients'`: quatro perfis de barras horizontais (2 × 2); uma cópia tracejada das barras da Paula estica para o dobro e cai sobre as do Gustavo. `'row'`: a linha da tabela desce e vira a lista $\vec{p} = (6, 1, 0, 4, 3)$ com índices $p_1 \ldots p_5$ e uma barra por posição; o botão troca as duas primeiras posições (sai outra cliente). `'sum'`: as barras do segundo vetor chegam pela direita e se encostam nas do primeiro, gênero por gênero; o número no fim é o total. `'diff'`: as barras de dois clientes em cada gênero (em cima e embaixo), o traço verde da diferença e a conta com sinal; o painel faz $\vec{u} - \vec{v}$ e a distância. `'normalize'`: cada perfil dividido pelo próprio módulo; Paula estica, Gustavo encolhe, e os dois terminam iguais |
| `cases`, `initial` | só em `'sum'`: quais botões aparecem entre `'soma'` (Paula + Carla), `'dobro'` (Paula + cópia da Paula = Gustavo), `'media'` (soma que encolhe para a metade) e `'falta'` (lista de 4 números: o “?” sem par) |
| `pairs` | só em `'diff'`: pares de nomes de clientes nos botões |
| `clients` | só em `'normalize'`: os perfis lado a lado (padrão Paula, Gustavo, Carla) |
| `caption` | legenda (texto simples) |

## GenrePlanePicker

O recorte de duas das cinco colunas: os quatro clientes como setas do plano
(`CartesianPlane`), com o par de gêneros escolhido nos botões (ação e
comédia, ação e terror, comédia e drama, terror e documentário, drama e
documentário). A seta do Gustavo é tracejada e fica sob a da Paula, sempre na
mesma reta. O painel dá as coordenadas do recorte e o ângulo entre Paula e
Carla naquele recorte, que muda de um recorte para outro. No recorte de ação
e terror o Davi é o vetor nulo (ponto na origem). Os deslocamentos dos
rótulos estão acertados à mão em `CUTS`.

```mdx
<GenrePlanePicker />
```

| Prop | O que faz |
|---|---|
| `initial` | índice do recorte inicial (padrão 0, ação e comédia) |
| `caption` | substitui a legenda padrão |

## CoordLengthSpiral

O módulo de um vetor de $n$ coordenadas como Pitágoras repetido. A primeira
coordenada é uma perna deitada; cada coordenada seguinte é uma perna nova
(laranja) em ângulo reto com a hipotenusa anterior, e a hipotenusa nova
(azul) mede a raiz da soma dos quadrados até ali. As hipotenusas antigas
ficam tracejadas; coordenada zero não acrescenta perna. A escala se ajusta a
cada vetor. O botão “Comparar com as pernas em fila” põe as pernas uma depois
da outra numa linha, contra o módulo (erro de somar as coordenadas).

```mdx
<CoordLengthSpiral />
<CoordLengthSpiral presets={['paula', 'diferenca']} initial="diferenca" compare={false} />
```

| Prop | O que faz |
|---|---|
| `presets` | botões entre `'plano'` (3, 4), `'espaco'` (3, 4, 12), `'paula'` (6, 1, 0, 4, 3), `'uns'` (1, 1, 1, 1) e `'diferenca'` (3, −2, −4, 3, 1); padrão os quatro primeiros |
| `initial` | vetor inicial (padrão `'paula'`) |
| `compare` | `false` esconde o botão das pernas em fila |
| `caption` | legenda |

## PairSheet

A folha plana de dois vetores de cinco coordenadas, desenhada só com os dois
módulos e o ângulo $\theta$ da fórmula do cosseno: o primeiro deitado, o
segundo girado de $\theta$. A animação desenha as setas, o arco e o tracejado
entre as pontas. O painel faz o produto escalar, os módulos, o cosseno e o
ângulo, e compara a distância medida na folha com a da conta das cinco
diferenças (iguais). Com ângulo zero (Paula e Gustavo), as setas ficam na
mesma reta e a distância vira uma cota embaixo.

```mdx
<PairSheet pairs={[['Paula', 'Carla'], ['Carla', 'Davi']]} />
<PairSheet pairs={[['Paula', 'Gustavo'], ['Paula', 'Carla'], ['Paula', 'Davi']]} initial={0} />
```

| Prop | O que faz |
|---|---|
| `pairs` | pares de nomes de clientes (de `clientes.js`), um botão por par |
| `initial` | índice do par inicial |
| `caption` | legenda |

## CauchyParabola

A desigualdade de Cauchy-Schwarz como parábola: $f(t) = \lVert \vec{u} -
t\vec{v} \rVert^2$ em `CartesianPlane`, com o deslizante de $t$ (de −0,5 a
1,5). O painel mostra o vetor $\vec{u} - t\vec{v}$, a soma dos quadrados dele,
a expressão $c + bt + at^2$ e o discriminante. Botões: Paula e Carla
(discriminante −5828, a curva fica acima do eixo, mínimo ≈ 37,36) e Paula e
Gustavo (discriminante 0, a curva encosta no eixo em $t = 1/2$: caso da
igualdade).

```mdx
<CauchyParabola />
```

| Prop | O que faz |
|---|---|
| `initial` | 0 (Paula e Carla) ou 1 (Paula e Gustavo) |
| `caption` | substitui a legenda padrão |

## DiagonalDims

O ângulo entre a diagonal $(1, 1, \ldots, 1)$ e o eixo $\vec{e}_1$ com $n$
coordenadas, $\cos\theta = 1/\sqrt{n}$, desenhado na folha dos dois vetores
normalizados, com o tracejado de 90°. O deslizante percorre n = 2, 3, 4, 5,
10, 20, 50, 100, 1 000, 10 000 e 1 000 000.

```mdx
<DiagonalDims caption="..." />
```

| Prop | O que faz |
|---|---|
| `initial` | índice inicial na lista de n (padrão 0, n = 2) |
| `caption` | legenda |

## MatrixKit

Auxiliares sem figura, importados pelos componentes `Matrix*` da lição 11.3.
Use-os num componente novo de matriz em vez de reescrever as peças.

| Exportação | O que faz |
|---|---|
| `Cell` | uma casa de tabela com número em KaTeX: `{x, y, w, h, math, tone, fill, strong, dashed, halo, solid, opacity, fontSize}`. `fill` pinta o fundo com o tom (claro); `strong` engrossa a borda; `halo` põe fundo no número (para uma linha que passa por cima); `solid` põe fundo opaco na casa inteira |
| `WideMath` | fórmula longa numa linha só dentro do SVG, ancorada pela esquerda, com largura dada (`{x, y, math, width, fontSize, tone}`). O `SvgMath` limita a caixa a 260 px e quebrava contas compridas em duas linhas |
| `Brackets` | colchetes de matriz em volta de um retângulo `{x0, y0, x1, y1, tone}` |
| `num`, `factor`, `plain` | número em LaTeX com vírgula decimal; o mesmo entre parênteses quando negativo, para fator de multiplicação; o mesmo em texto comum, com sinal de menos tipográfico |
| `pairTex`, `sumTex`, `dotTex` | vetor deitado na notação da casa, $(3,\ 4)$; soma de parcelas com sinais; a conta de um produto escalar por extenso |
| `mix`, `toneVar` | interpolação linear; cor de um tom |

## MatrixStoreQuestions

Problema motivador da 11.3. A planilha de pedidos (lojas nas linhas, produtos
nas colunas, preços em cima). A animação percorre as linhas, uma loja de cada
vez, e põe um “?” na coluna de totais; depois acende a coluna de um produto,
troca o preço dele (R\$ 10 vira R\$ 11) e põe um “?” na coluna de aumentos.

```mdx
<MatrixStoreQuestions caption="..." />
```

| Prop | O que faz |
|---|---|
| `matrix`, `rowNames`, `colNames`, `prices` | a planilha (padrão: as três lojas e os quatro produtos da 11.3) |
| `changed` | índice (a partir de 0) da coluna cujo preço sobe 1 (padrão 1, o queijo) |
| `caption` | legenda |

## MatrixTable

A matriz como tabela. Ao entrar na tela, conta as linhas (1, 2, 3) e depois as
colunas (1, 2, 3, 4) e escreve “3 linhas × 4 colunas”. Depois, dois
deslizantes escolhem a linha $i$ (azul) e a coluna $j$ (laranja); a casa do
cruzamento (verde) é $a_{ij}$, e o painel a escreve com o nome da linha e da
coluna. Os botões de atalho (padrão $a_{23}$ e $a_{32}$) mostram que a ordem
do índice muda a casa.

```mdx
<MatrixTable
  matrix={[[3, 2, 5, 4], [10, 0, 20, 6], [1, 5, 2, 3]]}
  rowNames={['Centro', 'Bairro', 'Shopping']}
  colNames={['café', 'queijo', 'pão', 'leite']}
/>
```

| Prop | O que faz |
|---|---|
| `matrix` | a matriz, por linhas |
| `rowNames`, `colNames` | nomes opcionais das linhas e colunas (texto curto) |
| `entry` | letra da entrada (padrão `'a'`) |
| `initial`, `presets` | casa inicial `[i, j]` (a partir de 1) e botões de atalho |
| `caption` | legenda |

## MatrixColumnVector

Um vetor deitado e o mesmo vetor em pé. Uma cópia de cada coordenada desce
até uma faixa livre embaixo, anda para a direita e sobe até a sua casa na
coluna, na mesma ordem (o caminho não passa por cima de nenhuma outra
coordenada). O nome de cada coordenada aparece ao lado quando ela chega.
Quadro final: as duas escritas com um sinal de igual.

```mdx
<MatrixColumnVector vector={[4, 10, 2, 5]} names={['café', 'queijo', 'pão', 'leite']} name="\vec{p}" />
```

| Prop | O que faz |
|---|---|
| `vector`, `names` | as coordenadas e o nome de cada uma |
| `name` | nome do vetor em LaTeX (padrão $\vec{p}$) |
| `caption` | legenda |

## MatrixVectorReadings

O produto de matriz por vetor pelas duas leituras.

- **Por linhas**: a matriz, o vetor em pé e o resultado. Cada linha acende
  (azul) com o vetor (laranja); na primeira linha os pares se encontram um de
  cada vez. A conta de cada linha é escrita embaixo, e o número vai para a
  coordenada da linha no resultado (verde).
- **Por colunas**: cada coluna recebe o seu peso (laranja, em cima), é
  multiplicada e desce para a segunda fileira; no fim, as colunas
  multiplicadas são somadas (verde).

No modo `'both'` os dois painéis ficam lado a lado (empilhados no celular),
animam juntos e têm botões para rever só um deles. Com `sliders`, o aluno muda
coordenadas do vetor e o painel escreve o resultado novo como o resultado
inicial mais cada coluna cujo peso mudou, vezes a mudança.

```mdx
<MatrixVectorReadings mode="rows" matrix={[[2, 1], [1, 3]]} vector={[3, 1]} matrixName="B" />
<MatrixVectorReadings mode="both" matrix={[[3, 2, 5, 4], [10, 0, 20, 6], [1, 5, 2, 3]]} vector={[4, 10, 2, 5]}
  rowNames={['Centro', 'Bairro', 'Shopping']} colNames={['café', 'queijo', 'pão', 'leite']} vectorName="\vec{p}" unit="reais" />
<MatrixVectorReadings mode="columns" matrix={...} vector={[4, 10, 2, 5]} sliders={[0, 1, 2, 3]} sliderRange={[0, 15]}
  sliderNames={['Preço do café (R$)', 'Preço do queijo (R$)', 'Preço do pão (R$)', 'Preço do leite (R$)']} />
```

| Prop | O que faz |
|---|---|
| `matrix`, `vector` | a matriz (por linhas) e o vetor; o número de colunas tem que ser o tamanho do vetor |
| `mode` | `'rows'`, `'columns'` ou `'both'` (padrão) |
| `rowNames`, `colNames` | nomes opcionais (as linhas só aparecem no painel por linhas; com nomes, as contas embaixo começam pelo nome) |
| `matrixName`, `vectorName`, `resultName` | rótulos em LaTeX (padrão $A$, $\vec{x}$ e $A\vec{x}$) |
| `sliders`, `sliderRange`, `sliderNames` | índices (a partir de 0) das coordenadas editáveis, alcance inteiro e rótulos dos controles |
| `unit` | unidade citada no painel do modo `'both'` |
| `caption` | legenda |

Tamanho testado: até $3 \times 4$ com números de até dois algarismos. Matriz
mais larga pede células menores (`CW` no código).

## MatrixColumnsPlane

A leitura por colunas de uma matriz $2 \times 2$ no plano. As colunas são duas
setas; o vetor $\vec{x} = (a,\ b)$ diz quantas cópias de cada uma, encadeadas
ponta com cauda (azul, depois laranja). A seta verde vai até $A\vec{x}$. O
painel faz a conta pelas duas leituras. Botões com vetores prontos, incluindo
$(1,\ 0)$ e $(0,\ 1)$, que devolvem uma coluna. Ao entrar na tela, monta o
vetor inicial seta por seta.

```mdx
<MatrixColumnsPlane />
```

| Prop | O que faz |
|---|---|
| `matrix` | matriz $2 \times 2$ por linhas (padrão a do robô, `[[2, 1], [1, 3]]`) |
| `name` | letra da matriz no rótulo (padrão `B`) |
| `initial`, `range`, `presets` | vetor inicial, alcance inteiro dos pesos (a janela se ajusta a ele) e botões |
| `intro` | `false` desliga a montagem animada |
| `caption` | troca a legenda |

## MatrixShapeCheck

Dimensões compatíveis. Três deslizantes (linhas e colunas da matriz,
coordenadas do vetor, de 1 a 4). A primeira linha da matriz (azul) se levanta
e encosta no vetor (laranja), entrada com coordenada; o que sobra sem par fica
tracejado, com “sem par”. Se tudo faz par, aparece o resultado (verde) com
uma coordenada por linha. Anima a cada mudança.

```mdx
<MatrixShapeCheck />
```

| Prop | O que faz |
|---|---|
| `initial` | `[m, n, k]`: linhas, colunas, coordenadas do vetor (padrão `[2, 3, 2]`, o contraexemplo) |
| `presets` | botões `[m, n, k]` |
| `caption` | legenda |

## MatrixEntrywise

Duas fileiras: $A + B$ e $kA$, casa por casa. Uma casa de cada vez acende nas
matrizes de entrada (azul e laranja) e o resultado aparece na mesma posição
(verde).

```mdx
<MatrixEntrywise a={[[1, 4], [0, -2]]} b={[[3, 1], [5, 2]]} k={3} />
```

| Prop | O que faz |
|---|---|
| `a`, `b` | as duas matrizes (mesmo tamanho) |
| `k` | o número da segunda fileira |
| `caption` | legenda |

## MatrixTranspose

À esquerda a matriz original, com cada linha numa cor (até três linhas
distintas: a cor repete a partir da quarta) e a diagonal tracejada.
“Transpor”: uma linha de cada vez acende na original, e os números dela
aparecem como a coluna de mesmo número da tabela da direita (a linha 1 vira a
coluna 1; os números da diagonal são os mesmos nas duas). As casas não voam
de uma tabela à outra de propósito: os caminhos se cruzariam e um número
passaria por cima de outro. “Girar um quarto de volta”: uma cópia gira
inteira no sentido horário, como uma folha (a linha 1 vira a última coluna).
Os dois resultados têm o mesmo formato e números em casas diferentes.

```mdx
<MatrixTranspose matrix={[[3, 2, 5, 4], [10, 0, 20, 6], [1, 5, 2, 3]]} />
```

| Prop | O que faz |
|---|---|
| `matrix` | a matriz, por linhas |
| `name` | letra no título (padrão `A`) |
| `initialKind` | `'transpose'` (padrão) ou `'rotate'` |
| `caption` | legenda |

## NeuralLayerMatrix

Uma camada $\vec{y} = W\vec{x} + \vec{b}$ desenhada como neurônios. Entradas
à esquerda, neurônios à direita; as setas de cada neurônio têm a cor dele e
trazem os pesos da sua linha de $W$ (peso 0 tracejado). Na animação, cada
neurônio acende as suas setas, escreve a conta (produto escalar mais viés) e
a saída. Deslizantes mudam as entradas; o painel escreve $W\vec{x} + \vec{b}$
com matrizes e, quando uma entrada muda, a saída nova como a inicial mais a
coluna daquela entrada vezes a mudança.

```mdx
<NeuralLayerMatrix />
```

| Prop | O que faz |
|---|---|
| `weights`, `bias`, `input` | $W$ (por linhas), $\vec{b}$ e a entrada inicial (padrão a camada da 11.3, saída $(9,\ 2)$) |
| `range` | alcance inteiro dos deslizantes das entradas (padrão de $-2$ a $4$) |
| `caption` | legenda |

Desenho pensado para 3 entradas e 2 neurônios; com mais, os rótulos dos pesos
podem se aproximar.

## SystemSnackPlan

O problema motivador da 11.4. Três deslizantes (porções de 0 a `max`) e uma
barra por nutriente, com o traço da meta. A barra fica verde na meta, azul
abaixo e laranja acima. O painel escreve a conta de cada nutriente e quantas
metas foram atingidas; “Anotar esta tentativa” guarda até 8 tentativas numa
tabela.

```mdx
<SystemSnackPlan caption="..." />
<SystemSnackPlan initial={[2, 3, 2]} caption="..." />
```

| Prop | O que faz |
|---|---|
| `foods` | `[{name, per: [proteína, carboidrato, gordura]}]` (padrão: iogurte, granola, castanhas da 11.4) |
| `nutrients`, `targets` | nomes e metas (padrão 45, 90, 55) |
| `initial`, `max` | porções iniciais e máximo do deslizante |

## SystemLines

Duas ou três equações `[a, b, c]` (para ax + by = c) desenhadas no
`CartesianPlane`, uma cor por equação, com o rótulo de cada reta posto
automaticamente perto da borda (ajustável). Com duas equações, o painel diz
se há um ponto comum (marcado em verde), se são paralelas ou se são a mesma
reta (a segunda sai tracejada). Com três, diz se as três passam pelo mesmo
ponto ou lista os três pontos de cada par (triângulo).

```mdx
<SystemLines
  eqs={[[1, 1, 5], [2, -1, 1]]}
  slider={{row: 2, a: [-3, 4, 1], c: [-8, 10, 1]}}
  echelon
  presets={[{label: 'Paralelas: −x − y = −2', eqs: [[1, 1, 5], [-1, -1, -2]]}]}
  window={{xMin: -2, xMax: 7, yMin: -3, yMax: 7}}
/>
```

| Prop | O que faz |
|---|---|
| `eqs` | equações iniciais, coeficientes inteiros |
| `slider` | `{row, a: [min, max, step], c: [...]}`: deslizantes do coeficiente do x e do número depois do igual da equação `row` |
| `presets` | botões `{label, eqs}` que trocam o sistema inteiro |
| `echelon` | (duas equações, primeiro coeficiente diferente de zero) a matriz aumentada antes e depois de zerar o número embaixo do primeiro pivô, e a leitura da última linha |
| `labelPlaces` | por equação, `{f, side, dx, dy}`: fixa a fração do trecho visível (`f`) ou o lado (`side`, 1 ou −1). Sem isso, o componente testa posições ao longo da reta, dos dois lados, com âncoras e distâncias diferentes, e fica com a caixa mais longe das outras retas, dos eixos e dos números, dos pontos e dos rótulos já postos; caixa cruzada pela própria reta é descartada. O rótulo do ponto de encontro também escolhe entre seis posições |
| `window`, `xUnit` | janela e escala |

Exporta também `eqTex([a, b, c])`, a equação em LaTeX.

## SystemAugmented

As equações escritas por extenso (cada incógnita na sua coluna) viram a
matriz aumentada: letras, sinais de mais e iguais se apagam, os números
deslizam para as colunas, surgem os colchetes, a barra laranja e o nome das
colunas. Coeficiente 0 (incógnita faltando) surge como 0. Botões “Guardar só
os números” e “Voltar para as equações” (animação ao contrário).

```mdx
<SystemAugmented rows={[[10, 5, 5, 45], [10, 20, 5, 90], [5, 5, 15, 55]]} rowNames={['proteína', 'carboidrato', 'gordura']} />
```

Props: `rows` (inteiros), `vars` (padrão x, y, z), `rowNames`, `resultName`.

## SystemRowOps

Matriz aumentada 2 × 3 (cada linha na cor da sua reta, com a equação ao
lado) e as duas retas no plano, lado a lado (empilhadas no celular).

- `mode="ops"`: botões “Trocar as linhas”, “Multiplicar a linha 2 por 3”,
  “Tirar da linha 2 duas vezes a linha 1”, “Multiplicar a linha 2 por 0” e
  “Desfazer”. Cada operação parte do sistema original; as retas são
  interpoladas pelos coeficientes, então a reta gira em volta do cruzamento.
  Multiplicar por 0 apaga a reta, marca pontos da outra reta e o par (1, 4)
  como solução criada, e não pode ser desfeita. Ao entrar na tela, faz a
  terceira operação (quadro final: y = 3 com a reta antiga tracejada).
- `mode="slider"`: L2 ← L2 + kL1 com k de −3 a 3; passeio inicial 0 → 1 → −2
  (vertical x = 2, depois horizontal y = 3). O painel confere o ponto na
  equação nova.

Props: `eqs` (padrão x + y = 5 e 2x − y = 1), `point` (o cruzamento, padrão
(2, 3)), `window`, `xUnit`, `caption`. Os textos dos botões e do painel do
modo `ops` são os do sistema padrão.

## SystemElimination

O escalonamento de uma matriz aumentada animado passo a passo, com frações
exatas (`./frac.js`). Em cada passo: a linha que muda pintada de laranja, a
linha que empresta contornada de azul (tracejado), a operação escrita à
direita, os números antigos dando lugar aos novos; numa troca, as linhas
trocam de altura e uma seta dupla liga as duas. No fim, a escada tracejada
verde passa embaixo dos pivôs (em caixas) e a região de zeros fica sombreada.
Botões: “Ver tudo de novo”, “Voltar ao início” e “Próximo passo”. O painel
mostra o texto e a conta de cada passo.

```mdx
<SystemElimination
  start={[[1, 2, 1, 7], [2, 5, 1, 13], [-1, 0, 3, 3]]}
  steps={[
    {ops: [{op: 'add', row: 2, from: 1, k: -2}], text: '...', calc: '2 - 2 \\times 1 = 0'},
    {ops: [{op: 'swap', rows: [1, 3]}], text: '...'},
    {ops: [{op: 'scale', row: 1, k: [1, 5]}], text: '...'},
  ]}
  endText="..."
/>
```

| Prop | O que faz |
|---|---|
| `start` | linhas da matriz aumentada (inteiros) |
| `steps` | `[{ops, text, calc}]`; um passo pode ter várias operações (ex.: zerar duas linhas), mas uma troca vai sozinha no passo |
| `vars` | cabeçalho das colunas (padrão x, y, z e nada sobre a coluna depois da barra) |
| `startText`, `endText` | painel antes do primeiro passo e depois do último |
| `staircase` | `false` desliga a escada final |

`SystemElimination/frac.js` (sem desenho): frações `fr`, `toFr`, `add`, `sub`,
`mul`, `div`, `neg`, `texFr`, `plainFr`, `applyOp` (operação elementar),
`opTex` (a operação em LaTeX, como `L_2 \leftarrow L_2 - 2L_1`) e `leadCol`
(coluna do primeiro número diferente de zero). Usado também por
`SystemEchelon`, `SystemLines` e `SystemPivotCount`.

## SystemEchelon

Confere se uma matriz está na forma escalonada: o primeiro número diferente
de zero de cada linha circulado, o tracejado ligando esses números. Escada
que desce sempre para a direita sai verde (“escalonada”); o degrau que volta
para a esquerda, ou a linha de zeros acima de outra, sai em laranja, e o
painel diz qual regra falhou.

```mdx
<SystemEchelon matrices={[{name: 'Escalonada', rows: [[1, 2, 1, 7], [0, 1, -1, -1], [0, 0, 6, 12]]}, {name: 'A escada volta', rows: [[1, 1, 1, 4], [0, 0, 1, 3], [0, 2, 1, 5]]}]} />
```

## SystemBackSub

Substituição de trás para a frente em quadros: cada quadro troca uma linha
(pintada), e uma seta verde sobe da linha de onde vêm os valores. O quadro
final tem a conta inteira.

```mdx
<SystemBackSub frames={[
  {lines: ['x + 2y + z = 7', '\\phantom{x + 2}y - z = -1', '\\phantom{x + 2y + {}}6z = 12'], note: '...'},
  {lines: [..., '\\phantom{x + 2y + {}}6z = 12 \\quad\\text{então}\\quad z = 2'], hl: 2, note: '...'},
  {lines: [...], hl: 1, from: [2], note: '...'},
]} />
```

Use `\phantom{...}` no começo das linhas para alinhar a escada.

## SystemFreeVariable

O deslizante escolhe o valor t da variável livre; barras horizontais mostram
x, y e z (com o zero no meio). O painel escreve as contas de trás para a
frente e confere a lista em cada equação original. Passeio inicial do t
(1 → −1 → 3 → 1).

```mdx
<SystemFreeVariable
  rows={[[1, 2, 1, 4], [2, 5, 4, 11], [3, 7, 5, 15]]}
  solution={[[-2, 3], [3, -2], [0, 1]]}
  freeIndex={2}
  steps={[{v: 'z', tex: 't'}, {v: 'y', tex: '3 - 2t'}, {v: 'x', tex: '-2 + 3t'}]}
/>
```

`solution`: cada incógnita como `[c0, c1]`, isto é, c0 + c1 t. `tRange`
(padrão −2 a 4, passo 0,5).

## SystemPivotCount

A matriz aumentada e a sua forma escalonada (eliminação automática, com
frações exatas), pivôs em caixas verdes, a linha 0 = c marcada em laranja
depois da barra. Um deslizante muda o número depois do igual de uma linha e
botões alternam um coeficiente dessa linha. O painel lista as operações, o
número de pivôs (o posto), o desfecho e a solução (única ou com parâmetro t;
no máximo uma variável livre).

```mdx
<SystemPivotCount
  rows={[[1, 2, 1, 4], [2, 5, 4, 11], [3, 7, 5, 15]]}
  vary={{row: 3, col: 2, options: [5, 6], k: [10, 20, 1]}}
/>
```

## PaintMix

A loja de tintas da lição 11.5. Três barras, uma por pigmento (ciano, magenta,
amarelo). Cada barra empilha a parte que vem de cada base (azul P, laranja Q,
verde R), com altura “litros × gramas por litro”: a altura total é uma
coordenada da combinação linear. Um deslizante por base (litros). Com
`targets`, os tracejados marcam o alvo escolhido nos botões, o painel diz
quantos gramas faltam ou sobram de cada pigmento e guarda as receitas que
acertaram. Com `pour`, despeja a receita litro a litro ao entrar na tela.

```mdx
<PaintMix
  targets={[
    {name: 'verde-musgo', at: [4, 5, 6]},
    {name: 'laranja-queimado', at: [1, 0, 1]},
  ]}
/>

<PaintMix pour={[2, 3, 0]} targets={[{name: 'verde-musgo', at: [4, 5, 6]}]} />
```

| Prop | O que faz |
|---|---|
| `names` | bases usadas, entre `P`, `Q`, `R` e `S` (padrão `['P', 'Q', 'R']`); as fórmulas estão em `PaintMix/bars.jsx` |
| `max`, `step` | limite e passo dos deslizantes, em litros (padrão 3 e 0,5) |
| `maxG` | altura do eixo, em gramas (padrão 20) |
| `initial` | litros iniciais |
| `pour` | receita despejada na entrada (também vira o estado inicial) |
| `targets` | `[{name, at: [c, m, a]}]`; com mais de um, aparecem botões |
| `caption` | troca a legenda |

`PaintMix/bars.jsx` exporta `BASES`, `PIGMENTS`, `mix`, `GramAxis`,
`StackBar` (barra empilhada; `y0` em cada pedaço força a altura de partida,
para animações) e `TotalLabel`, usados também pelo `PaintSwap`.

## PaintSwap

A dependência como “uma base sobra”. À esquerda, a lata p + q + r, parada. À
direita, a mesma lata, e a animação faz a troca em dois passos: o pedaço verde
de cada barra (1 litro de R) se divide no pigmento de 1 litro de P e 2 de Q e
muda de cor; depois os pedaços da mesma cor se juntam. Nenhuma altura muda em
nenhum quadro; no fim, a direita é 2p + 3q, com 4, 5 e 6 g como a esquerda. O
painel narra o passo e mostra a conta. Sem props além de `caption`.

```mdx
<PaintSwap />
```

## SpanCombo

Combinação linear no plano com um deslizante por vetor (2 ou 3 vetores). A
ponta é desenhada como caminho ponta com cauda (a·u em azul, b·v em laranja,
c·w em verde) e a seta da origem até a ponta (verde com dois vetores,
tracejada cinza com três; com três vetores, cada vetor aparece também em tom claro a partir da origem). Cada posição da ponta deixa um ponto de rastro. Com
dois vetores, a figura testa ao entrar uma grade de receitas de meio em meio
(`sweep`): não paralelos enchem um paralelogramo inclinado, com a malha das
receitas inteiras tracejada; paralelos caem todos na faixa verde da reta.
Desenha num plano próprio (`SpanCombo/plane.jsx`), que recorta setas e malhas
pela janela.

```mdx
<SpanCombo
  initial={[1, 1]}
  targets={[{name: 'A', at: [4, 4], label: 'A\\ (4,\\ 4)', dx: 34, dy: -14}]}
/>

<SpanCombo
  vectors={[{v: [2, 1], name: '\\vec{u}'}, {v: [1, 3], name: '\\vec{v}'}, {v: [1, -2], name: '\\vec{w}'}]}
  ranges={[[-1, 1], [-1, 1], [-1, 1]]} step={0.5} initial={[1, 0, 0]}
  zeroHunt removable={2} sweep={false}
  window={{xMin: -4.5, xMax: 4.5, yMin: -6.5, yMax: 6.5}} unit={26}
/>
```

| Prop | O que faz |
|---|---|
| `vectors` | `[{v: [x, y], name}]`, 2 ou 3 vetores; `name` em LaTeX |
| `ranges`, `step`, `initial` | limites de cada deslizante, passo (padrão 0,1) e receita inicial |
| `targets` | `[{name, at, label, dx, dy, anchor}]`: alvos com registro das receitas que acertaram |
| `zeroHunt` | o alvo é a origem, e só conta receita que não seja zero de tudo |
| `removable` | índice do vetor que um botão tira e põe de volta |
| `sweep`, `sweepStep` | varredura animada da grade de receitas (só com 2 vetores) |
| `lattice` | malha das receitas inteiras (padrão `true`; some com vetores paralelos) |
| `window`, `unit`, `ticksEvery` | janela, escala e numeração dos eixos |
| `caption` | legenda |

Cuidado: as setas são recortadas pela janela, então escolha `ranges` e
`window` de modo que o caminho mais longo caiba (a ponta vai até a soma dos
módulos dos coeficientes máximos vezes cada vetor).

## SpanRowTest

O alvo é alcançável por u e v? Plano com u e v saindo da origem e o alvo
movido por dois deslizantes inteiros (−7 a 7). O painel mostra
[u v | alvo] antes e depois de L2 ← L2 − m·L1 (m = u2/u1), separando o canto
de baixo (que só depende dos vetores) do lado direito y − m·x (que depende do
alvo). Com u = (1, 2) e v = (3, 1), todo alvo é alcançado e os tracejados
desenham a receita; com u = (1, 2) e v = (3, 6), o canto é zero, a reta
y = 2x aparece em faixa verde, e fora dela a segunda linha diz 0 = número.

```mdx
<SpanRowTest caption="..." />
```

| Prop | O que faz |
|---|---|
| `initialPair` | 0 para (1, 2) e (3, 1); 1 para (1, 2) e (3, 6) |
| `initialTarget` | alvo inicial (padrão (7, −1)) |
| `caption` | legenda |

## SpanSheet

As bases da loja no espaço (x = ciano, y = magenta, z = amarelo), sobre o
`SpaceScene`. O pedaço cinza é parte da folha de p e q. A mistura
a·p + b·q + c·r (ou c·s) é desenhada como caminho, com a seta tracejada da
origem até a ponta. Ao entrar, testa as 125 receitas de 0 a 1 litro (de 0,25
em 0,25), marca as pontas e gira a cena até a vista de perfil da folha
(θ = arcsen(−0,1) ≈ −5,74°, em que a folha vira uma linha) e volta. Controles
para os litros e para o giro; botões para a vista de perfil, para trocar R por
S = (1, 0, 1) e para apagar o rastro. O painel confere a regra da folha
(magenta = média do ciano com o amarelo). O laranja-queimado (1, 0, 1) tem um
tracejado até o pé na folha, (2/3, 2/3, 2/3).

```mdx
<SpanSheet />
<SpanSheet initialBases="S" initial={[0, 0, 1]} />
```

| Prop | O que faz |
|---|---|
| `initialBases` | `'R'` (padrão) ou `'S'` |
| `initial` | litros iniciais de p, q e da terceira base |
| `caption` | legenda |

## PivotColumns

Teste por escalonamento animado. Os vetores entram como colunas (nomes em
cima); cada operação aparece escrita no alto, a linha trocada ganha uma faixa
azul e os números novos aparecem no lugar dos velhos. No fim, cada pivô ganha
um círculo verde, a coluna sem pivô fica sombreada (“sem pivô”) e a linha de
zeros é anotada (“linha sem pivô”). O painel tira as conclusões: coluna sem
pivô = dependentes; linha sem pivô = há alvos fora do alcance. Frações saem
como `\tfrac`.

```mdx
<PivotColumns
  cases={[
    {
      label: 'Bases P, Q e R',
      names: ['\\vec{p}', '\\vec{q}', '\\vec{r}'],
      start: [[2, 0, 2], [1, 1, 3], [0, 2, 4]],
      steps: [
        {op: 'L_2 \\leftarrow L_2 - \\tfrac{1}{2}L_1', row: 1, m: [[2, 0, 2], [0, 1, 2], [0, 2, 4]]},
        {op: 'L_3 \\leftarrow L_3 - 2L_2', row: 2, m: [[2, 0, 2], [0, 1, 2], [0, 0, 0]]},
      ],
    },
  ]}
/>
```

| Prop | O que faz |
|---|---|
| `cases` | `[{label, names, start, steps: [{op, row, m}]}]`: matriz inicial e, para cada operação, o texto (LaTeX), a linha trocada (a partir de 0) e a matriz depois dela |
| `initial` | caso mostrado primeiro |
| `caption` | legenda |

## LinearGridMorph

A malha do plano se deformando aos poucos, do plano original até a
transformação (lição 11.6). A malha clara ao fundo é o plano antes; a malha
cinza é o plano no instante atual; e1 (tom 1), e2 (tom 2) e o quadrado de lado 1
(tom 3) acompanham. Os rótulos só aparecem com a figura parada, para nenhum
quadro do meio ter rótulo atravessando o desenho. O painel escreve a matriz do
instante e as duas colunas, cada uma na cor da sua seta.

O caminho do movimento depende do tipo:

- `matrix`: a matriz do meio do caminho é (1 − s)I + sA, e cada ponto anda em
  linha reta. Na reflexão, o plano fica “de lado” no meio, como uma página
  virando;
- `rotation` (graus): o ângulo cresce de 0 até θ e a malha gira sem se
  deformar (a mistura de I com a matriz encolheria a malha no meio);
- `shift`: a malha escorrega. Com `matrix` e `shift` juntos, primeiro age a
  matriz (a origem fica parada) e depois tudo escorrega: é a camada afim;
- `warp`: `'parabola'` é (x, y + x²/4) e `'square'` é (x², y), com as linhas
  amostradas, que saem curvas.

```mdx
<LinearGridMorph matrix={[[2, -1], [1, 1]]} />

<LinearGridMorph
  slider={{kind: 'rotation', label: 'Ângulo θ', min: 0, max: 360, step: 15, initial: 30, unit: '°', digits: 0}}
  showCircle showAngle window={[-2, 2, -2, 2]} unit={72}
/>

<LinearGridMorph
  presets={[
    {label: 'Escala', matrix: [[2, 0], [0, 1]]},
    {label: 'Rotação de 30°', rotation: 30},
    {label: 'Malha escorregada', shift: [3, 1], formula: 'T(\\vec{v}) = \\vec{v} + (3,\\ 1)'},
  ]}
  showOrigin
/>
```

| Prop | O que faz |
|---|---|
| `matrix`, `rotation`, `shift`, `warp` | a transformação (ver acima); `matrix` por linhas, como no papel |
| `presets` | botões `[{label, matrix?, rotation?, shift?, warp?, formula?, note?, vectors?, points?, polygon?, labels?, basisLabels?, basisOffsets?}]`; cada clique anima de novo a partir do plano original |
| `slider` | `{kind, label, min, max, step, initial, unit, digits}`; `kind` é `'rotation'` (graus), `'shear'` (o k de [[1, k], [0, 1]]), `'scaleX'`, `'uniform'` ou `'progress'` (quanto da transformação já aconteceu, de 0 a 100%) |
| `formula`, `note` | troca a matriz do painel por uma fórmula (translação, mapa que entorta) e acrescenta uma frase |
| `vectors` | `[{v, label, imageLabel, tone, offset, imageOffset, steps}]`; `imageLabel: 'auto'` escreve as coordenadas do destino; `steps` desenha a receita de v como passos de e1 (faixa azul) e de e2 (faixa laranja) na malha do instante |
| `points` | `[{at, label, imageLabel, tone, trail, offset, imageOffset}]`; `trail` liga o ponto ao lugar de onde saiu (bolinha vazada) |
| `dots`, `dotTrails` | `[x0, x1, y0, y1]`: rede de pontos inteiros que viajam juntos, com rastro opcional |
| `polygon` | `{points, tone, labels: [{at, label, imageLabel, offset, imageOffset}]}`; o contorno de antes fica tracejado |
| `trace` | `{at, label, tone, offset}`: o caminho de um ponto (arco, na rotação) e o rótulo do destino (como o “?” do motivador) |
| `labels` | rótulos fixos `[{at, math, tone, dx, dy, anchor}]`, que não se movem |
| `showGrid`, `ghost`, `showBasis`, `showSquare`, `showCircle`, `showAngle`, `showOrigin`, `readout` | liga e desliga as peças; `showOrigin` marca a origem que sai do lugar e `T(\vec{0})` |
| `basisLabels`, `basisOffsets` | rótulos do fim para e1 e e2 (padrão: as coordenadas das colunas; `false` esconde) e deslocamentos `[dx, dy, anchor]` |
| `window`, `unit`, `extent`, `duration` | janela `[xMin, xMax, yMin, yMax]`, pixels por unidade, alcance da malha, duração |
| `caption`, `label`, `replayLabel` | legenda, texto acessível e o botão de ver de novo |

## LinearColumnsDrag

As colunas da matriz são os destinos de e1 e e2 (lição 11.6). O aluno arrasta
as pontas redondas, azul (destino de e1) e laranja (destino de e2), de meia em
meia casa; a malha inteira acompanha, e o painel escreve a matriz com essas
setas como colunas. O vetor v é refeito na malha nova como x passos azuis e y
passos laranja, e a conta pelas colunas sai embaixo. Quando as duas colunas
caem na mesma reta, o painel avisa que a malha achatou. As pontas também
andam pelas setas do teclado. Ao entrar na tela, as pontas saem de e1 e e2 e
caminham até a matriz inicial.

```mdx
<LinearColumnsDrag />
```

| Prop | O que faz |
|---|---|
| `initial` | as duas colunas iniciais, `[[a, c], [b, d]]` (padrão (2, 1) e (−1, 1)) |
| `v` | o vetor da receita (padrão (1, 2); o texto do painel supõe a primeira coordenada 1) |
| `presets` | botões `[{label, cols}]` (padrão: começo, identidade, esticar, girar 90°, cisalhar, achatar) |
| `window`, `unit`, `snap` | janela, escala e passo do arrasto |
| `caption` | troca a legenda |

## LinearityCheck

As duas condições da linearidade vistas no desenho (lição 11.6). Dois painéis,
antes e depois; o de depois mostra a malha se transformando aos poucos.

- `mode="sum"`: antes, u (azul), v (laranja) e a diagonal u + v (verde) do
  paralelogramo; depois, T(u), T(v), o canto T(u) + T(v) do paralelogramo novo
  (bolinha vazada) e a seta verde T(u + v). A condição vale quando a ponta
  verde cai na bolinha.
- `mode="scale"`: antes, v e k·v na reta pela origem; depois, T(v), k·T(v)
  (bolinha vazada) e T(kv). Deslizante de k de −1 a 2.

Os botões trocam a transformação: a linear T(x, y) = (2x, x + y), a translação
v + (3, 1) e T(x, y) = (x², y). O painel faz as duas contas com números.

```mdx
<LinearityCheck mode="sum" />
<LinearityCheck mode="scale" />
```

| Prop | O que faz |
|---|---|
| `mode` | `'sum'` ou `'scale'` |
| `maps`, `initialMap` | quais transformações aparecem nos botões (`'matrix'`, `'translation'`, `'square'`) e a inicial |
| `u`, `v`, `k` | vetores e número (padrão u = (1, 1), v = (1, 0) na soma e v = (1, 1) no múltiplo, k = 2); as janelas são fixas para esses valores |
| `caption` | troca a legenda |

As três figuras da lição 11.6 dividem as peças de desenho de
`src/components/LinearGridMorph/plane.jsx` (setas, malha fixa e transformada,
polígono, rótulos) e o CSS de `LinearGridMorph/styles.module.css`.

## ProductComposeGrid

Produto de matrizes como comandos em sequência (lição 11.7). A malha do plano
passa por uma transformação de cada vez: o passo 1 inteiro, uma pausa, o passo
2 a partir de onde o passo 1 deixou, e assim por diante. Na pausa, e₁ (tom 1),
e₂ (tom 2) e os pontos ganham rótulo com o lugar onde estão; durante o
movimento, nenhum rótulo aparece. Acima de cada painel, uma fila de etiquetas
(“1. R: girar 90°”, “2. E: esticar”) acende o passo da vez. Embaixo, o painel
escreve a matriz acumulada depois de cada passo, com o nome do produto montado
da direita para a esquerda (`ER`, `EC`, e potências quando a letra se repete:
`C^2`, `C^3`).

Vários painéis (`panels`) animam ao mesmo tempo: é assim que a figura compara
ER com RE, (ER)C com E(RC) (um passo pode ser um produto já pronto, com nome
`(ER)`), ou dois comandos com a matriz única. Caminho de cada passo: rotação
(`rotation`, graus) gira sem deformar; matriz qualquer anda em linha reta,
(1 − s)I + sA, aplicada sobre o que os passos anteriores já fizeram.

O logotipo (`polygon`) fica no tom 3 com o contorno original tracejado; cada
ponto (`points`) deixa um rastro tracejado com bolinhas vazadas nas paradas.

```mdx
<ProductComposeGrid
  steps={[{name: 'R', text: 'girar 90°', rotation: 90}, {name: 'E', text: 'esticar 2 vezes', matrix: [[2, 0], [0, 1]]}]}
  progress
  window={[-2.8, 1.8, -1.2, 1.8]}
  unit={62}
/>

<ProductComposeGrid
  panels={[
    {title: 'ER', steps: [{name: 'R', rotation: 90}, {name: 'E', matrix: [[2, 0], [0, 1]]}]},
    {title: 'RE', steps: [{name: 'E', matrix: [[2, 0], [0, 1]]}, {name: 'R', rotation: 90}]},
  ]}
  polygon={{points: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]], tone: 3}}
  showSquare={false}
  window={[-4.6, 4.6, -0.6, 4.6]}
  unit={30}
/>
```

| Prop | O que faz |
|---|---|
| `steps` | um painel só: `[{name, text?, matrix? \| rotation?}]`, na ordem em que agem (o primeiro age primeiro); `matrix` por linhas |
| `panels` | vários painéis: `[{title, steps, points?, polygon?, basisLabels?, basisOffsets?, cumNames?, note?, window?, unit?}]`; `title` em LaTeX |
| `presets` | botões `[{label, steps? \| panels?, window?, unit?, note?, caption?, polygon?, points?}]`; cada clique anima de novo |
| `initialPreset` | botão escolhido no começo (padrão 0) |
| `polygon` | `{points, tone}`: o logotipo levado pelos comandos |
| `points` | `[{at, labels?, offsets?, tone?, trail?}]`; sem `labels`, o rótulo de cada parada são as coordenadas; `offsets[k]` é `[dx, dy, anchor]` da parada k (0 = começo) |
| `basisLabels` | `false` esconde os rótulos de e₁ e e₂ (o começo também); uma lista `[[l1, l2], ...]` dá os rótulos de cada parada depois do começo; sem a prop, as coordenadas |
| `basisOffsets` | `[[off1, off2], ...]` por parada, começando pelo começo |
| `cumNames` | troca o nome do produto acumulado de cada passo no painel (por exemplo, para não escrever `ER` antes de a lição definir a notação) |
| `progress` | deslizante de quanto dos comandos já aconteceu (0 a 100%) |
| `showGrid`, `showBasis`, `showSquare`, `readout` | liga e desliga as peças |
| `window`, `unit`, `extent`, `stepDuration`, `pause` | janela, escala, alcance da malha, duração de cada passo e da pausa |
| `caption`, `label`, `replayLabel` | legenda, texto acessível, botão de ver de novo |

Usa as peças de desenho de `src/components/LinearGridMorph/plane.jsx` e o CSS
de `LinearGridMorph/styles.module.css`.

## ProductRowColumn

A regra linha por coluna, entrada por entrada (lição 11.7). Arranjo clássico:
B em cima, A à esquerda, o produto AB embaixo à direita. A linha i de A fica na
altura da linha i do produto, e a coluna j de B no prumo da coluna j: a casa
(i, j) está no cruzamento das duas faixas. Na animação, cada entrada de
`order` acende a linha de A (tom 1) e a coluna de B (tom 2), pinta de verde o
par da vez (1º com 1º, 2º com 2º), escreve a conta no
painel e põe o resultado na casa (tom 3). As entradas fora de `order`
aparecem juntas no fim. Parada, a figura aceita clique (ou Enter) numa casa
do produto e mostra a conta dela.

```mdx
<ProductRowColumn A={[[2, 0], [0, 1]]} B={[[0, -1], [1, 0]]} nameA="E" nameB="R" selected={[0, 1]} />

<ProductRowColumn
  A={[[3, 2, 5, 4], [10, 0, 20, 6], [1, 5, 2, 3]]}
  B={[[4, 5], [10, 8], [2, 3], [5, 6]]}
  nameA="Q" nameB="P"
  rowNames={['Centro', 'Bairro', 'Shopping']}
  colNames={['Forn. 1', 'Forn. 2']}
  innerNames={['café', 'queijo', 'pão', 'leite']}
  order={[[0, 0], [2, 1]]}
  cell={40}
/>
```

| Prop | O que faz |
|---|---|
| `A`, `B` | as matrizes, por linhas |
| `nameA`, `nameB`, `nameAB` | nomes em LaTeX (padrão `A`, `B` e o produto dos dois) |
| `rowNames`, `colNames`, `innerNames` | nomes das linhas de A, das colunas de B e do índice do meio (colunas de A e linhas de B); texto comum |
| `order` | entradas animadas, `[[i, j], ...]` contando do 0 (padrão: todas, linha por linha) |
| `selected` | casa em destaque quando a figura está parada (o quadro final e a captura) |
| `cell`, `cellR`, `cellH`, `pairDuration` | largura das casas de A, largura das casas de B e do produto (padrão o maior entre `cell` e 50), altura, tempo de cada par |
| `caption`, `label`, `replayLabel` | legenda, texto acessível, botão |

Usa `Cell`, `Brackets`, `num` e `dotTex` de `MatrixKit`.

## ProductShapeFit

Dimensões compatíveis como peças de dominó (lição 11.7). Cada matriz é uma
peça com dois números, linhas | colunas, e embaixo o formato da matriz em
quadradinhos. As peças deslizam uma em direção à outra. Quando os números que
se encostam são iguais, as metades de dentro ficam verdes (tom 3), se apagam,
e aparece a peça do resultado com os números das pontas. Quando são
diferentes, as metades ficam tracejadas em laranja (tom 2), as peças param
separadas por “≠” e o resultado “não existe”. Aceita cadeias de três peças
(cada junção é conferida). O painel explica o veredito e, com duas peças, a
leitura de máquinas (o que B entrega e o que A recebe). A transposta entra
como peça virada: Pᵀ é a peça de P com os números trocados.

```mdx
<ProductShapeFit
  presets={[
    {label: '(2 × 3) vezes (3 × 4)', tiles: [{name: 'A', dims: [2, 3]}, {name: 'B', dims: [3, 4]}]},
    {label: 'PQS', tiles: [{name: 'P', dims: [2, 3]}, {name: 'Q', dims: [3, 3]}, {name: 'S', dims: [3, 1]}]},
  ]}
/>

<ProductShapeFit free />
```

| Prop | O que faz |
|---|---|
| `presets` | botões `[{label, tiles: [{name, dims: [linhas, colunas]}], note?}]`; `name` em LaTeX |
| `initialPreset` | botão escolhido no começo (padrão 0) |
| `free` | troca os botões por quatro deslizantes (linhas e colunas de A e de B, de 1 a 4); anima a cada mudança |
| `caption`, `label`, `replayLabel` | legenda, texto acessível, botão |

## TwoLayersCollapse

Duas camadas do tipo W x + b valem por uma; a ReLU entre elas quebra isso
(lição 11.7). À esquerda, a rede pequena (3 entradas, 2 neurônios no meio no
tom 1, 1 saída no tom 2) com os números da entrada atual; com a ReLU, o
neurônio que recebeu um negativo mostra 0 e “era −2”. À direita, o gráfico da
saída quando a entrada anda pela reta x = (t, 0, 0): a camada única
equivalente (tom 1, tracejada) é sempre uma reta; a rede (tom 2) cai em cima
dela sem a ReLU e vira uma linha dobrada com a ReLU. Na animação, t vai de
−4 a 2 traçando a curva da rede; depois, o deslizante move t. O painel faz as
duas contas e diz se as saídas são iguais.

```mdx
<TwoLayersCollapse toggle={false} />
<TwoLayersCollapse relu />
```

| Prop | O que faz |
|---|---|
| `W1`, `b1`, `W2`, `b2` | as camadas (padrão: a camada da 11.3 e a segunda camada da 11.7; saída 23 em (2, 1, 3)); o desenho supõe 3 entradas, 2 neurônios e 1 saída |
| `relu` | começa com a ReLU entre as camadas |
| `toggle` | mostra o botão que põe e tira a ReLU |
| `tRange`, `yRange`, `initialT` | alcance de t e da saída no gráfico, t inicial do deslizante |
| `caption`, `label` | legenda, texto acessível |

## InverseCipher

O código da filial da lição 11.8 (cifra de Hill pequena). Letras viram números
pela posição no alfabeto (A = 1), os números andam em pares, e cada par passa
pela matriz. Cada coluna da figura é um par. Os painéis são SVGs separados que
quebram linha no celular.

- `mode="encode"`: painel 1, a palavra `word` codificada coluna por coluna
  (letras, números, seta com o nome da matriz, par codificado); painel 2, os
  pares `received` com setas tracejadas para cima e “?” no lugar das letras.
- `mode="decode"`: os pares `received` descem pela inversa (seta azul com
  `inverseLabel`), viram números e letras; no fim, a palavra numa caixa verde.
- `mode="ambiguous"`: as duas palavras de `words` passam pela matriz e
  convergem para o mesmo par; setas tracejadas de volta com “?”.

```mdx
<InverseCipher mode="encode" word="PAGO" received={[[49, 27], [32, 18], [31, 26]]} />
<InverseCipher mode="decode" received={[[49, 27], [32, 18], [31, 26]]} />
<InverseCipher mode="ambiguous" matrix={[[2, 4], [1, 2]]} words={['AB', 'CA']} matrixLabel="B" />
```

| Prop | O que faz |
|---|---|
| `mode` | `'encode'`, `'decode'` ou `'ambiguous'` |
| `word`, `words` | palavra de exemplo (número par de letras) e as duas palavras do modo ambíguo |
| `matrix`, `inverse` | a matriz do código (padrão [[2, 1], [1, 1]]) e a inversa usada para decodificar (padrão [[1, −1], [−1, 2]]) |
| `received` | pares recebidos |
| `matrixLabel`, `inverseLabel` | nomes nas setas (padrão `A` e `A^{-1}`) |
| `exampleTitle`, `receivedTitle`, `caption`, `replayLabel` | textos |

## InverseRoundTrip

A malha do plano passando por uma sequência de transformações, uma depois da
outra. Durante a etapa k, a matriz do instante é S_k(s) vezes o acumulado das
etapas anteriores, com S_k(s) indo da identidade até a matriz da etapa (em
linha reta, ou girando, numa rotação). Há uma pausa entre as etapas; com tudo
parado, os pontos mostram as coordenadas. Os pontos deixam um rastro
tracejado pelas paradas; se o ponto não volta ao começo, a partida fica
marcada com uma bolinha vazada. Embaixo, uma etiqueta por etapa (acende na
etapa atual) e o caminho de cada ponto escrito com setas.

```mdx
<InverseRoundTrip
  presets={[
    {label: 'Código da filial', stages: [{matrix: [[2, 1], [1, 1]], tex: 'A'}, {matrix: [[1, -1], [-1, 2]], tex: 'A^{-1}'}], points: [{at: [1, 2]}], note: '...'},
    {label: 'Girar 30°', stages: [{rotation: 30, tex: '...'}, {rotation: -30, tex: '...'}], points: [{at: [2, 0]}]},
  ]}
  window={[-2, 5, -2, 4]}
/>
```

| Prop | O que faz |
|---|---|
| `presets` | botões `[{label, stages, points, note}]`; sem `presets`, use `stages`, `points` e `note` direto |
| `stages` | `[{matrix}` ou `{rotation}` (graus), `tex` (nome da etapa em LaTeX), `text` (palavra antes do nome, como “meia”)`]` |
| `points` | `[{at, tone, offset, offsets}]`; `offsets[i]` é o deslocamento do rótulo depois de i etapas, `[dx, dy, anchor]` |
| `showBasis`, `showSquare` | setas de e1 e e2 (sem rótulo) e o quadrado de lado 1 |
| `window`, `unit`, `extent`, `digits` | janela, escala, alcance da malha, casas decimais |
| `caption`, `label`, `replayLabel` | textos |

## InverseFromSystem

O sistema 2x + y = p, x + y = q resolvido com letras no lado direito (lição
11.8). A animação tem três passos, cada um com as linhas envolvidas pintadas e
o nome do passo à direita: subtrair as equações (sai x = p − q), trocar o x na
segunda (sai y = −p + 2q) e escrever os coeficientes à vista. Os quatro
coeficientes voam para dentro de uma matriz: os de p formam a primeira coluna
(tom 1), os de q, a segunda (tom 2). Os botões trocam (p, q) pelos pares
recebidos e o painel faz a conta e diz as letras. Os textos são os da matriz
[[2, 1], [1, 1]].

```mdx
<InverseFromSystem caption="..." />
```

Props: `pairs` (padrão os três pares da mensagem), `caption`.

## InverseFormula2x2

A fórmula da inversa 2 × 2 como receita animada. Em cima, A; embaixo, os
números descem: a e d (tom 1, a diagonal) fazem arcos e trocam de lugar, b e c
(tom 2) descem retos e ganham o sinal de menos (com um círculo piscando), o
fator 1/(ad − bc) aparece na frente e, por fim, a matriz já dividida, com
frações exatas (`SystemElimination/frac.js`). Com ad − bc = 0, o resultado é
“divisão por zero”. Ao lado, um plano pequeno com as colunas de A como setas
neutras, a malha transformada e o quadrado verde, que achata quando
ad − bc = 0. Botões − e + nas quatro entradas (de −5 a 5) e matrizes prontas
(que repetem a animação); o painel calcula ad − bc e confere A A⁻¹ = I.

```mdx
<InverseFormula2x2 caption="..." />
```

| Prop | O que faz |
|---|---|
| `initial` | matriz inicial (padrão [[2, 1], [1, 1]]) |
| `presets` | botões `[{label, m}]` (padrão: A do código, [[3, 5], [1, 2]], [[4, 2], [3, 2]], B da colega) |
| `caption` | legenda |

## InverseCollapse

Uma matriz sem inversa achata o plano, e dois pontos diferentes (azul e
laranja, partida vazada) caem no mesmo lugar. Depois do achatamento, duas
setas tracejadas saem da chegada para as duas partidas, com um “?”. O painel
escreve a matriz, ad − bc e as duas imagens.

Com `slider`, a matriz é `base` com a entrada de baixo, à direita, trocada
pelo k do deslizante; sem animação da malha, e ao entrar na tela o k caminha
de `tourFrom` até `initial`. Quando ad − bc = 0 as imagens coincidem.

```mdx
<InverseCollapse
  presets={[
    {label: 'B, da colega', matrix: [[2, 4], [1, 2]], imageOffset: [-12, 20, 'end'], questionOffset: [0, -14]},
    {label: 'Matriz nula', matrix: [[0, 0], [0, 0]]},
  ]}
/>
<InverseCollapse slider={{base: [[2, 4], [1, 2]], min: 0, max: 4, step: 0.25, initial: 2, tourFrom: 0, label: 'Entrada k'}} />
```

| Prop | O que faz |
|---|---|
| `presets` | botões `[{label, matrix, points, labelOffsets, imageOffset, questionOffset}]` |
| `matrix`, `points` | sem botões; `points` são os dois pontos (padrão (1, −1) e (−3, 1)) |
| `slider` | `{base, min, max, step, initial, tourFrom, label}` |
| `window`, `unit`, `extent`, `imageOffset` | janela, escala, alcance da malha, rótulo da chegada comum |
| `caption`, `label`, `replayLabel` | textos |

## InverseGaussJordan

O método de Gauss-Jordan animado, na linguagem visual do `SystemElimination`
(linha que muda em laranja, linha que empresta contornada de azul, números
antigos dando lugar aos novos, troca de linhas com seta dupla). A diferença: a
barra fica no meio, com a identidade acrescentada à direita, e a operação do
passo é escrita embaixo da matriz (cabe no celular). Os nomes dos blocos ficam
em cima: `A` e `I` no começo, `I` (verde) e `A^{-1}` (azul) no fim, com
caixas nas duas metades. Se a esquerda termina com uma linha de zeros, ela fica
marcada em laranja. Botões “Ver tudo de novo”, “Voltar ao início” e “Próximo
passo”; o painel mostra o texto e a conta de cada passo.

```mdx
<InverseGaussJordan
  start={[[2, 1], [1, 1]]}
  steps={[
    {ops: [{op: 'swap', rows: [1, 2]}], text: '...'},
    {ops: [{op: 'add', row: 2, from: 1, k: -2}], text: '...', calc: '...'},
    {ops: [{op: 'scale', row: 2, k: -1}], text: '...'},
    {ops: [{op: 'add', row: 1, from: 2, k: -1}], text: '...'},
  ]}
  endText="..."
/>
```

Props: `start` (linhas de A, inteiros; a identidade é acrescentada), `steps`
(como no `SystemElimination`), `name` (padrão `'A'`), `startText`, `endText`,
`caption`. Usa `SystemElimination/frac.js`.

## InverseSolveDrag

Com a inversa, A x = b tem uma única solução. O aluno arrasta o ponto b
(laranja, de meia em meia casa, dentro do quadrado tracejado de −2 a 2), ou o
move pelas setas do teclado. Com a matriz A = [[2, 1], [1, 1]] do código,
aparece o único x = A⁻¹b (azul) e uma seta tracejada de x até b com o nome A.
Com a matriz B = [[2, 4], [1, 2]], a reta que B alcança aparece tracejada em
laranja: b fora dela, nenhuma solução; b nela, a reta inteira de soluções
x + 2y = b₂ em azul. Ao entrar na tela, o b faz um pequeno passeio. As duas
matrizes estão fixas no componente.

```mdx
<InverseSolveDrag caption="..." />
```

Props: `window`, `unit`, `box` (região do arrasto), `snap`, `caption`.

## DetGridMorph

A malha do plano se deformando, com o determinante acompanhando (lição
11.9). Uma ou mais etapas aplicadas em sequência; cada etapa é uma matriz (a
matriz do instante é (1 − s)I + sM, cada ponto anda em linha reta) ou uma
rotação (o ângulo cresce, sem encolher a malha no meio). O painel mostra o
determinante da transformação do instante; com mais de uma etapa, a cadeia
“área do quadrado de lado 1: 1 → ×det₁ → ×det₂”, só com as etapas já
concluídas. As peças de área ficam no tom 3; e1 e e2 nos tons 1 e 2. Rótulos
só com a figura parada. Quando o determinante final é negativo ou zero, o
painel diz que o plano foi virado ou achatado.

```mdx
<DetGridMorph hideNumbers lots={[4, 3]} unit={26}
  presets={[
    {label: 'Matriz A', name: 'A', matrix: [[3, 1], [1, 2]], window: [-1, 16, -1, 11]},
    {label: 'Matriz B', name: 'B', matrix: [[2, -2], [1, -1]], window: [-7, 9, -4, 5]},
  ]}
/>

<DetGridMorph matrix={[[2, 1], [1, 2]]} window={[-1, 6, -1, 5.5]}
  presets={[{label: 'Praça em L', region: {points: [[0, 0], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2]]}}]}
/>

<DetGridMorph
  presets={[{label: 'ER', stages: [{rotation: 90, name: 'R'}, {matrix: [[2, 0], [0, 1]], name: 'E'}],
    points: [{at: [2, 1], label: '(2,\\ 1)', imageLabel: '(-2,\\ 2)'}]}]}
/>
```

| Prop | O que faz |
|---|---|
| `matrix`, `rotation`, `stages` | a transformação: uma matriz (por linhas), uma rotação em graus ou uma lista de etapas `[{matrix} ou {rotation}, name]` aplicadas em sequência; `name` (LaTeX) aparece na cadeia de fatores |
| `presets` | botões; cada um pode trazer qualquer prop de configuração (`matrix`, `stages`, `lots`, `region`, `points`, `labels`, `window`, `name`, `note`, `caption`, `showBasis`, `basisOffsets`, `lotLabelOffset`); cada clique anima de novo |
| `lots` | `[w, h]`: terreno de w × h lotes de lado 1 (o do canto mais escuro, com a área escrita nele); o painel dá a área de cada lote e do terreno |
| `region` | `{points, label, offset}`: região com contorno tracejado antes e verde depois; o painel dá as duas áreas e a razão |
| `points` | `[{at, label, imageLabel, tone, offset, imageOffset}]`: bolinha vazada no lugar de antes, cheia no destino, rastro tracejado |
| `labels` | rótulos fixos `[{at, math, tone, dx, dy, anchor}]` |
| `hideNumbers` | o painel mostra só a matriz, e o lote do canto ganha “?” (problema motivador) |
| `showBasis`, `showSquare`, `basisOffsets` | setas de e1 e e2 e o quadrado de lado 1 (este some com `lots` ou `region`); deslocamentos `[dx, dy, anchor]` dos rótulos |
| `window`, `unit`, `extent`, `stageDuration` | janela `[xMin, xMax, yMin, yMax]`, escala, alcance da malha, duração de cada etapa |
| `name`, `note`, `caption`, `label`, `replayLabel` | nome da matriz no modo `hideNumbers`, frase extra no painel, legenda, texto acessível, botão de ver de novo |

`DetGridMorph/det.js` (sem desenho) tem as contas 2 × 2 usadas pelas figuras
da 11.9: `det2`, `mul2`, `apply2`, `mix2`, `rot2`, `stageMatrix`,
`signedArea` (fórmula do cadarço) e `clean`.

## DetCutout

O recorte que mede a área do paralelogramo das colunas (a, c) e (b, d)
(lição 11.9). O paralelogramo (tom 1) fica dentro do retângulo tracejado de
(a + b) por (c + d). As seis peças de fora, quatro triângulos (tom 2) e dois
retângulos dos cantos (tom 3), saem aos pares e ficam afastadas no quadro
final, cada uma com a área escrita. Cotas embaixo e à esquerda. O painel
subtrai as áreas, uma parcela por par, até o resultado.

```mdx
<DetCutout />
<DetCutout letters />
```

| Prop | O que faz |
|---|---|
| `cols` | as duas colunas `[[a, c], [b, d]]` (padrão (3, 1) e (1, 2), o loteamento); o desenho supõe o formato do loteamento (entradas positivas, primeira coluna mais deitada) |
| `letters` | escreve as medidas e as áreas em letras, e a conta termina em ad − bc |
| `unit`, `caption` | escala e legenda |

## DetShearSlide

O escorregão que não muda a área (lição 11.9). O lado u = (3, 1) fica
parado; o lado v = (1, 2) escorrega na direção de u (v − t·u), com a ponta
andando sobre a reta tracejada paralela a u. O contorno tracejado é o
paralelogramo de antes; a altura aparece pontilhada. A animação para em
t = 1/3, com o lado em pé em (0, 5/3) e a cota 3 embaixo (área 3 × 5/3). O
deslizante escolhe t de −4/12 a 8/12; o painel faz v − t·u e o determinante
com frações exatas (`SystemElimination/frac.js`). Só `unit` e `caption`.

## DetColumnsDrag

Área e sinal do determinante juntos (lição 11.9). Duas pontas arrastáveis
(também pelo teclado, de meia em meia casa): a coluna azul (destino de e1) e
a laranja (destino de e2). A malha cinza acompanha. O paralelogramo das
colunas é verde; quando o determinante é negativo, fica hachurado (o verso
da folha). Um arco com seta mostra o giro mais curto da coluna azul até a
laranja. Embaixo, uma reta numérica de −12 a 12 marca o determinante, com a
faixa verde do zero até ele. O painel faz ad − bc, dá a área e diz se o
giro é anti-horário (não virou) ou horário (virou).

```mdx
<DetColumnsDrag path={{to: [2, -1]}} window={[-3, 5.5, -2.5, 4]} />
```

| Prop | O que faz |
|---|---|
| `initial` | colunas iniciais `[[a, c], [b, d]]` (padrão (3, 1) e (1, 2)) |
| `path` | `{to}`: a animação leva a coluna laranja de `initial[1]` até `to` em linha reta (sem `path`, as pontas saem de e1 e e2) |
| `presets` | botões `[{label, cols}]` (padrão: loteamento, colunas trocadas, reflexão no eixo y, colunas na mesma reta) |
| `window`, `unit`, `snap`, `caption` | janela, escala, passo do arrasto, legenda |

## DetBox3D

O cubo de aresta 1 virando a caixa inclinada das três colunas (lição 11.9),
desenhado com o `SpaceScene`. As duas primeiras colunas em azul, a terceira
em laranja, a caixa em verde (chão mais forte, teto claro, arestas
laterais). O painel dá o determinante 3 × 3 do instante e o volume; quando
o volume é zero, diz que a caixa achatou. O deslizante gira a cena em torno
de z (−40° a 40°); o enquadramento é fixo para todas as matrizes e vistas.

```mdx
<DetBox3D
  axesMax={[4, 5, 6]}
  presets={[
    {label: 'Bases P, Q e S', cols: [[2, 1, 0], [0, 1, 2], [1, 0, 1]], note: '...'},
    {label: 'Matriz T', cols: [[2, 0, 0], [1, 2, 0], [1, 1, 2]], floor: true, heightLabel: '\\text{altura } 2'},
  ]}
/>
```

| Prop | O que faz |
|---|---|
| `presets` | `[{label, cols, floor, heightLabel, note, caption, offsets}]`; `cols` são as **colunas** (não as linhas); `floor` destaca o chão e desenha a altura da terceira coluna até o chão; `offsets` são três `{dx, dy, anchor}` dos rótulos das colunas |
| `axesMax` | até onde vão os eixos |
| `initial`, `unit`, `caption` | botão inicial, escala, legenda |

## DetRowOps

O efeito de cada operação de linha no determinante (lição 11.9). Começa na
matriz do loteamento [[3, 1], [1, 2]], com o paralelogramo das colunas em
contorno tracejado. Cada botão faz uma operação, que é multiplicar pela
esquerda por E; as colunas novas são E vezes as antigas, então a malha
cinza (o plano passando por E) e o paralelogramo verde se movem juntos.
Botões: L2 ← L2 − ⅓L1 (cisalhamento, det continua 5, a matriz fica
triangular), L1 ↔ L2 (espelho em y = x, −5), L2 ← 2L2 (10), L2 ← −1·L2
(espelho no eixo x, −5). O painel escreve a matriz antes e depois (frações
exatas), os dois determinantes e o efeito. Só `unit` e `caption`.

## DetElimination

Cópia enxuta do `SystemElimination` (11.4) para matriz quadrada, sem a barra
da aumentada, com o determinante acompanhando (lição 11.9). Em cada passo, a
linha que muda fica laranja, a que empresta contornada de azul, e à direita
aparecem a operação e o efeito dela (“det não muda”, “det troca de sinal”,
“det × k”); na troca, seta dupla à esquerda. No fim, caixas verdes na
diagonal, zeros embaixo dela sombreados, e o painel multiplica a diagonal e
corrige pelas trocas. Botões: ver tudo de novo, voltar ao início, próximo
passo.

```mdx
<DetElimination
  start={[[0, 2, 1], [1, 1, 2], [2, 4, 1]]}
  steps={[
    {ops: [{op: 'swap', rows: [1, 2]}], text: '...'},
    {ops: [{op: 'add', row: 3, from: 1, k: -2}], text: '...'},
    {ops: [{op: 'add', row: 3, from: 2, k: -1}], text: '...'},
  ]}
  startText="..."
/>
```

| Prop | O que faz |
|---|---|
| `start` | linhas da matriz quadrada (inteiros) |
| `steps` | `[{ops, text}]`, operações como em `SystemElimination/frac.js` |
| `startText`, `caption` | painel antes do primeiro passo e legenda |

## SarrusDiagonals

A regra de Sarrus animada (lição 11.9). A matriz 3 × 3 com as duas primeiras
colunas copiadas à direita (mais claras, depois de uma linha tracejada). As
seis diagonais acendem uma de cada vez: as três que descem em azul (produto
somado), as três que sobem em laranja (produto subtraído). Cada produto
entra numa lista à direita (somados numa coluna, subtraídos na outra), e o
painel monta a soma até o resultado.

```mdx
<SarrusDiagonals letters />
<SarrusDiagonals matrix={[[1, 2, 3], [2, 5, 7], [1, 3, 5]]} />
```

| Prop | O que faz |
|---|---|
| `matrix` | a matriz 3 × 3 por linhas (padrão a matriz M da 11.9) |
| `letters` | troca os números pelas letras a até i |
| `caption` | legenda |

## RankColumnKeeper

O problema motivador da lição 11.10. Uma tabela HTML com a planilha; o
cabeçalho de cada coluna é um botão que apaga a coluna (ou a traz de volta).
Para cada coluna apagada, a figura procura, com conta exata, uma receita que a
refaça com as colunas guardadas: a última linha da tabela diz “sim” (verde) ou
“não” (laranja), e o painel escreve a receita, como t = f + o. Cada escolha de
colunas guardadas que refaz tudo vai para o registro, com o número de colunas;
o painel mostra o menor número que já funcionou. Sem props, usa a planilha da
loja (cinco colunas, posto 3).

```mdx
<RankColumnKeeper caption="..." />

<RankColumnKeeper
  columns={[{name: '\\vec{f}', header: 'Loja física'}, {name: '\\vec{o}', header: 'Online'}, {name: '\\vec{t}', header: 'Total'}]}
  rows={[[100, 20, 120], [50, 30, 80], [0, 60, 60], [80, 0, 80]]}
  initialDeleted={[]}
/>
```

| Prop | O que faz |
|---|---|
| `columns` | `[{name, header}]`: nome em LaTeX (aparece nas receitas) e título da coluna |
| `rows` | a planilha, linha a linha (inteiros ou frações `[n, d]`) |
| `rowHeader` | título da coluna das linhas (padrão “Cliente”) |
| `initialDeleted` | índices das colunas que começam apagadas (padrão `[2]`, o total) |
| `caption` | legenda |

`RankColumnKeeper/exact.js` (sem desenho), com frações exatas do
`SystemElimination/frac.js`: `rref(rows)` (forma escalonada reduzida e colunas
dos pivôs), `rank`, `nullBasis(rows)` (um vetor do núcleo por coluna livre),
`recipe(rows, kept, target)` (coeficientes que refazem uma coluna, ou `null`) e
`comboTex(coef, names)` (a combinação em LaTeX, como `2\vec{f} + \vec{o}`).
Usado também por `RankSheetEchelon` e `RankNullityTally`.

## BasisTwoGrids

Um ponto, dois endereços. O entregador vai da origem até o destino pelo mapa
da prefeitura (x para leste, y para norte, em cinza, com rótulos
`x\vec{e}_1` e `y\vec{e}_2`); a malha quadriculada apaga, entram as ruas da
base (direção de b1 tracejada no tom 1, de b2 no tom 2) e ele refaz a viagem:
a·b1 (tom 1) e depois b·b2 (tom 2). No fim, a seta verde da origem ao ponto.
Rótulos de trecho só aparecem quando o trecho termina. O painel escreve os dois
endereços; coordenadas fracionárias saem como `\tfrac` (meio quarteirão), e o
painel avisa quando há meio quarteirão ou número negativo. Desenha no plano do
`SpanCombo/plane.jsx`.

```mdx
<BasisTwoGrids caption="..." />
```

| Prop | O que faz |
|---|---|
| `basis`, `names` | os dois vetores da base (padrão (1, 1) e (1, −1)) e seus nomes em LaTeX |
| `presets`, `initial` | destinos dos botões (padrão (5, 1), (2, 2), (7, 3), (1, 5), (3, 0)) e o primeiro |
| `window`, `unit` | janela `{xMin, xMax, yMin, yMax}` e escala |
| `caption` | legenda |

## BasisAddressLoop

Duas receitas para (5, 1) com as direções b1 = (1, 1), b2 = (1, −1) e
e1 = (1, 0): receita 1 (azul) 3b1 + 2b2, receita 2 (laranja) 4e1 + b1. Depois,
a volta fechada (verde) “ir pela 1 e voltar pela 2” é percorrida e pintada, e
o painel escreve a conta da diferença, (3 − 1)b1 + (2 − 0)b2 + (0 − 4)e1 = 0.
O botão “Só avenidas e travessas” deixa só a receita 1 e explica por que não
há volta fechada com uma base. Números fixos.

```mdx
<BasisAddressLoop caption="..." />
```

| Prop | O que faz |
|---|---|
| `initialMode` | `'three'` (padrão, três direções) ou `'base'` |
| `caption` | legenda |

## SubspaceClosure

O teste do subespaço no plano. O conjunto candidato é uma faixa azul; dois
deslizantes escolhem vetores u e v dele (laranja) e um terceiro o número k. A
soma u + v (seta verde, com o paralelogramo tracejado) e o múltiplo k·u (seta
verde tracejada) ganham bolinha cheia quando caem no conjunto e vazada quando
escapam; a origem também. O painel responde às três condições da definição,
com a conta de cada teste. Botões: reta y = 2x (subespaço), reta y = 2x + 2
(começa em u = (1, 4), v = (−1, 0), soma (0, 4) fora) e os dois eixos juntos
(começa em u = (2, 0), v = (0, 3), soma fora).

```mdx
<SubspaceClosure caption="..." />
```

| Prop | O que faz |
|---|---|
| `initial` | candidato inicial (0, 1 ou 2) |
| `caption` | legenda |

## DimensionSlots

Dimensão como “quantos números”: quatro subespaços de R³ sobre o `SpaceScene`.
Só a origem (nenhum deslizante), a reta gerada por p = (2, 1, 0), o plano
x + z = 2y com a base p, q = (0, 1, 2) (começa em 0,5 e 0,5, o ponto
(1, 1, 1)) e o espaço com a base canônica (com a caixa do ponto). As setas da
base saem da origem nos tons 1, 2 e 3, e o ponto é montado como caminho, um
trecho por vetor, animado a cada troca de botão. O painel compara o endereço
na base com as três coordenadas comuns.

```mdx
<DimensionSlots caption="..." />
```

| Prop | O que faz |
|---|---|
| `initial` | caso inicial: 0 origem, 1 reta, 2 plano (padrão), 3 espaço |
| `caption` | legenda |

## RankSheetEchelon

Escalonamento de uma planilha com colunas nomeadas, sem coluna de resultados.
Cada passo aplica uma ou mais operações L_i ← L_i + k·L_j: as linhas que mudam
ganham faixa azul, a operação curta (como −2L₁) aparece à direita de cada uma
e os números novos aparecem no lugar dos velhos. No fim, pivôs circulados em
verde, cada coluna marcada “guardada” (tom 1) ou “refeita” (sombreada, tom 2),
“sem pivô” à direita das linhas de zeros, e o painel escreve o posto e a
receita de cada coluna sem pivô em termos das colunas originais com pivô
(lida da forma reduzida, conta exata). Botões: “Ver tudo de novo”, “Voltar ao
início”, “Próximo passo”.

```mdx
<RankSheetEchelon
  names={['\\vec{f}', '\\vec{o}', '\\vec{t}']}
  headers={['Loja física', 'Online', 'Total']}
  start={[[100, 20, 120], [50, 30, 80], [0, 60, 60], [80, 0, 80]]}
  steps={[
    {ops: [{row: 2, from: 1, k: [-1, 2]}, {row: 4, from: 1, k: [-4, 5]}], text: '...'},
    {ops: [{row: 3, from: 2, k: -3}, {row: 4, from: 2, k: [4, 5]}], text: '...'},
  ]}
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `names`, `headers` | nomes das colunas em LaTeX e títulos curtos (texto) acima deles |
| `start` | a matriz, linha a linha |
| `steps` | `[{ops: [{row, from, k}], text}]`; linhas contadas a partir de 1; `k` inteiro ou `[n, d]`; `text` aceita `$...$` |
| `startText` | painel antes do primeiro passo |
| `caption` | legenda |

## EchelonColumnsShift

As colunas de [[1, 2], [2, 4]] como setas, (1, 2) no tom 1 e (2, 4) no tom 2,
sobre a faixa verde y = 2x (o espaço coluna). A operação L2 ← L2 − 2L1 desce
as duas setas até o eixo x; a faixa gira junto, e a reta e as setas de antes
ficam tracejadas. O deslizante refaz a operação aos poucos (0 a 100%), e o
painel confere que a segunda coluna é o dobro da primeira em todo instante.
Rótulos só com a figura parada. Números fixos.

```mdx
<EchelonColumnsShift caption="..." />
```

## KernelCollapse

O núcleo de A = [[1, 2], [2, 4]] no desenho. A malha se deforma da identidade
até A (matriz do meio do caminho (1 − s)I + sA, inversível para s menor que
1), sobre a malha original clara. A faixa laranja (múltiplos de (−2, 1)) e a
seta (−2, 1) encolhem até a origem; a reta azul tracejada pelos pontos (1, 0),
(−1, 1) e (3, −1) encolhe até o ponto (1, 2); no fim aparece a faixa verde
y = 2x, o espaço coluna. Deslizante do progresso; o painel do fim lê as duas
conclusões e a conta 2 = 1 + 1. Números fixos.

```mdx
<KernelCollapse caption="..." />
```

## RankNullityTally

O teorema do posto como contagem. A forma escalonada no alto, com os pivôs
circulados; cada coluna vira um cartão que desce, uma de cada vez, para a
caixa “com pivô: guardadas” (tom 1) ou “sem pivô: refeitas” (tom 2), com a
contagem embaixo de cada caixa; no fim, a linha
“colunas = posto + dimensão do núcleo”. O painel escreve, para cada coluna sem
pivô, o vetor do núcleo (conta exata) e a relação que ele diz. Até 4 cartões
por caixa.

```mdx
<RankNullityTally
  initial={2}
  cases={[
    {label: 'Colunas (1, 2) e (2, 4)', names: ['\\vec{a}_1', '\\vec{a}_2'], echelon: [[1, 2], [0, 0]]},
    {label: 'A matriz B', names: ['\\vec{a}_1', '\\vec{a}_2', '\\vec{a}_3', '\\vec{a}_4'], echelon: [[1, 2, 0, 1], [0, 0, 1, 3]]},
  ]}
  caption="..."
/>
```

| Prop | O que faz |
|---|---|
| `cases` | `[{label, names, echelon}]`: a forma escalonada (o núcleo é o mesmo da matriz original) |
| `initial` | caso mostrado primeiro |
| `caption` | legenda |

## EigenDirectionSearch

A busca das direções especiais de uma matriz 2 × 2 (lição 11.11). O aluno gira
a seta v, de comprimento 1, com um deslizante de ângulo (0° a 179°, de grau em
grau). A figura mostra a reta de v (tracejada, tom 1), a seta Av (tom 2 quando
muda de reta, tom 3 quando fica nela), o círculo de raio 1 e a elipse para onde
vão todas as setas de comprimento 1. Embaixo, o gráfico do desvio: o ângulo
entre a reta de v e Av, para cada ângulo de v, com o ângulo atual marcado e os
zeros já encontrados em verde.

Uma direção especial que não cai num grau inteiro (como a de (1, −2), em
116,57°) puxa a seta quando o deslizante passa a menos de 1° dela (ímã). Ao
encaixar, a direção vai para o registro com o fator λ e o representante
inteiro (como (1, −2)). O botão “Varrer todas as direções” gira a seta de 0° a
180° e registra tudo; “Limpar o registro” recomeça.

```mdx
<EigenDirectionSearch />
<EigenDirectionSearch matrix={[[2, 1], [1, 2]]} name="S" />
```

| Prop | O que faz |
|---|---|
| `matrix`, `name` | a matriz, por linhas (padrão [[4, 1], [2, 3]]), e o nome no painel (padrão `B`) |
| `initial` | ângulo inicial em graus (padrão 0) |
| `window`, `unit` | janela e escala (padrão [−5,5; 5,5] nos dois eixos, 32 px) |
| `caption` | legenda |

## EigenGridMorph

A malha do plano se deformando da identidade até a matriz, com as retas dos
autovetores marcadas (lição 11.11). A matriz do meio do caminho é
(1 − s)I + sA, que tem os mesmos autovetores de A com autovalor 1 − s + sλ:
por isso as setas sobre as retas tracejadas só esticam (ou encolhem, ou viram)
durante todo o movimento, e a seta fora delas gira. A seta clara marca onde
cada seta estava. O painel escreve a matriz do instante e, para cada reta, o
que acontece com as setas dela (“ficam 3 vezes maiores”, “viram para o lado
oposto”, “são achatadas até a origem”). Rótulos só com a figura parada.
Desenho em `src/components/LinearGridMorph/plane.jsx`; contas 2 × 2 em
`EigenGridMorph/eigen.js` (usadas pelas outras figuras da lição).

Três usos:

```mdx
<EigenGridMorph
  presets={[
    {label: 'Matriz S', name: 'S', matrix: [[2, 1], [1, 2]], window: [-2.5, 4.5, -2.5, 4.5],
     lines: [{dir: [1, 1], lambda: 3, tone: 1}, {dir: [1, -1], lambda: 1, tone: 2}],
     vectors: [{v: [1, 1], tone: 1, label: '\\vec{v}_1', imageLabel: 'S\\vec{v}_1 = 3\\vec{v}_1'}]},
  ]}
/>

<EigenGridMorph lambdaSlider={{dirs: [[1, 1], [1, -1]], mu: 1, min: -2, max: 3, step: 0.5, initial: 3}} />

<EigenGridMorph
  presets={[{label: 'S − 3I', name: 'S - 3I', matrix: [[-1, 1], [1, -1]],
    lines: [{dir: [1, 1], lambda: 0, tone: 1}],
    lineDots: [{dir: [1, 1], from: -2.5, to: 2.5, step: 0.5, tone: 1}]}]}
/>

<EigenGridMorph gridToggle presets={[{label: 'Matriz B', name: 'B', matrix: [[4, 1], [2, 3]],
  lines: [{dir: [1, 1], lambda: 5, tone: 1}, {dir: [1, -2], lambda: 2, tone: 2}],
  vectors: [{v: [2, -1], tone: 3, ghost: false, label: '\\vec{x}', imageLabel: 'B\\vec{x}'}],
  recipe: {v: [2, -1], coords: [1, 1], eigenText: '...', squareText: '...'}}]} />
```

| Prop | O que faz |
|---|---|
| `presets` | botões `[{label, name, matrix, window, unit, lines, vectors, lineDots, labels, note, recipe, digits}]`; cada clique anima de novo. `lines`: `[{dir, lambda, tone, label}]`, o autovalor é usado no painel; `vectors`: `[{v, tone, label, imageLabel, offset, imageOffset, ghost}]`; `lineDots`: pontos de `from` a `to` (passo `step`) ao longo de `dir`, que viajam com rastro (para ver uma reta inteira ir à origem em A − λI) |
| `lambdaSlider` | `{dirs: [d1, d2], mu, min, max, step, initial, label, vectors}`: a matriz é P·diag(λ, mu)·P⁻¹ com P = [d1 d2], e o deslizante escolhe λ |
| `gridToggle` | botões “Malha quadriculada” e “Malha dos autovetores” (linhas paralelas a `lines[0].dir`, tom 1, e a `lines[1].dir`, tom 2). Com `recipe: {v, coords, eigenText, squareText}`, desenha a receita do vetor como passos na malha escolhida e mostra o texto correspondente |
| `name` | nome da matriz no painel quando o preset não tem `name` |
| `window`, `unit`, `extent`, `duration`, `showSquare` | janela padrão, escala, alcance da malha, duração, quadrado de lado 1 |
| `caption`, `label` | legenda e texto acessível |

## EigenCharSlider

Os autovalores são os λ que fazem A − λI achatar o plano (lição 11.11). O
deslizante escolhe λ de décimo em décimo. À esquerda, as colunas de A − λI
(tons 1 e 2) e o paralelogramo (tom 3) que elas formam, cuja área com sinal é
det(A − λI). À direita, a parábola det(A − λI) para todos os λ, com o ponto
atual. Quando o paralelogramo achata, o painel diz que λ é autovalor, a reta
para onde o plano foi achatado aparece tracejada, e o vetor que vai para a
origem (o autovetor, com representante inteiro) é desenhado em cinza. Os λ
encontrados ficam no registro e marcados no eixo da parábola. Botão de varrer.

```mdx
<EigenCharSlider />
```

| Prop | O que faz |
|---|---|
| `matrix`, `name` | padrão [[4, 1], [2, 3]] e `B` |
| `min`, `max`, `initial` | faixa e valor inicial de λ (padrão −1 a 7, começando em 0) |
| `window`, `unit`, `graphY` | janela do plano, escala, faixa vertical do gráfico |
| `caption` | legenda |

## EigenRing

Dez setas (claras) e as suas imagens (lição 11.11). Cada imagem sai laranja
quando mudou de reta e verde quando ficou na reta da sua seta. O painel
escreve a matriz, o traço, o determinante e o discriminante Δ da equação
característica, e uma frase sobre quantas setas ficaram. Ao entrar na tela, o
parâmetro anda de 0 até o valor inicial.

- `kind="rotation"`: rotação de θ (deslizante de 0° a 180°, de 5 em 5; padrão
  90°). Nenhuma seta fica entre 0° e 180°; em 0° e 180° todas ficam.
- `kind="shear"`: cisalhamento [[1, k], [0, 1]] (deslizante de −2 a 2, de 0,25
  em 0,25; padrão 1). Só as setas do eixo x ficam.

```mdx
<EigenRing kind="rotation" />
<EigenRing kind="shear" />
```

| Prop | O que faz |
|---|---|
| `kind` | `'rotation'` ou `'shear'` |
| `initial` | valor inicial do parâmetro |
| `caption` | legenda |

## EigenPowerWalk

Aplicar a mesma matriz muitas vezes (lição 11.11). B = [[4, 1], [2, 3]] e
x = (2, −1) = (1, 1) + (1, −2), então Bⁿx = 5ⁿ(1, 1) + 2ⁿ(1, −2). Como os
números explodem, o desenho mostra só a direção: cada Bⁿx é encolhida até o
mesmo comprimento, com as duas partes (tom 1 ao longo de (1, 1), tom 2 ao longo
de (1, −2)), e as direções anteriores ficam como pontos no círculo. A tabela
traz os números verdadeiros de cada passo: Bⁿx, 5ⁿ, 2ⁿ, a razão (2/5)ⁿ e o
ângulo até a reta de (1, 1). Anima de n = 0 a 6 ao entrar na tela; botões
“Aplicar B mais uma vez” (até n = 8), “Voltar para x” e “Ver de novo”.

```mdx
<EigenPowerWalk />
```

| Prop | O que faz |
|---|---|
| `initial` | o n do quadro final (padrão 6) |
| `caption` | legenda |

## EigenPowerBars

As potências λ⁰ a λ¹⁰ como barras (lição 11.11): o fator acumulado da parte
de um vetor que está na reta de um autovetor de autovalor λ. Barras positivas
para cima (tom 1), negativas para baixo (tom 2); a escala se ajusta à maior
barra. Deslizante de −1,5 a 1,5 e botões com os casos da lição (0,7; 1; 1,1;
−0,5; −1; −1,2). O painel dá λ¹⁰ e a frase do caso (some, fica, cresce,
alterna).

```mdx
<EigenPowerBars />
```

| Prop | O que faz |
|---|---|
| `initial` | λ inicial (padrão 0,7) |
| `caption` | legenda |

## EigenPopulation

A população entre a cidade e o campo (lição 11.11): 10% da cidade vai para o
campo e 20% do campo vai para a cidade a cada ano, total de 900 mil.

- `mode="problem"`: diagrama das duas regiões (caixas com o nível da
  população e as setas com as mudanças do ano) e gráfico ano a ano. Anima os
  anos 0 a 4; “Mais um ano” avança até o ano 30 (o eixo passa a ir até 30
  depois do ano 10). O painel faz a conta do ano.
- `mode="solved"`: gráfico com o equilíbrio tracejado (600 e 300 mil) e, ao
  lado, cada ano como um ponto (cidade, campo) em centenas de milhares, na reta
  do total 9, indo até (6, 3) na reta de (2, 1). Deslizante da população
  inicial da cidade (0 a 900, de 50 em 50); o painel escreve a fórmula
  600 ± (c − 600) × 0,7ᵏ.

```mdx
<EigenPopulation />
<EigenPopulation mode="solved" />
```

| Prop | O que faz |
|---|---|
| `mode` | `'problem'` ou `'solved'` |
| `caption` | legenda |

## FitFirstTry

O problema motivador da 11.12. Os cinco apartamentos (área em m², preço em
R\$ mil). A reta y = 8x − 80, que passa pelos apartamentos 1 e 2, cresce da
esquerda para a direita; em 60, 70 e 80 m² aparece o preço que ela prevê
(bolinha vazia), e um tracejado verde desce até o preço de verdade com o
rótulo “erra 70”, “erra 60” e “erra 120”. Botão “Ver de novo”.

```mdx
<FitFirstTry />
```

| Prop | O que faz |
|---|---|
| `caption` | troca a legenda |

## FitLineExplorer

Os apartamentos da 11.12 no `CartesianPlane` (x de 30 a 100 m², y de 160 a
520 mil) e a reta y = mx + n, com deslizantes de m (0 a 10, de 0,5 em 0,5) e
n (−250 a 400, de 5 em 5). O erro de cada apartamento é o segmento vertical
verde do ponto até a reta (recortado na janela). O número de cada apartamento
fica à esquerda do ponto nos modos com quadrados (eles crescem para a direita)
e à direita nos outros, longe da reta. Os dados e as contas moram em
`FitLineExplorer/apartamentos.js` (`AREAS`, `PRICES`, `BEST`, `errorsOf`,
`sqeOf`, `tnum`/`pnum` com espaço nos milhares, `lineTex`/`lineText`).

```mdx
<FitLineExplorer mode="residuals" initial={[5, 50]} presets={[{m: 5, n: 50}, {m: 8, n: -80, label: '...'}]} />
<FitLineExplorer mode="squares" initial={[0, 350]} sliders={false} presets={[{m: 0, n: 350}, {m: 5, n: 50}]} />
<FitLineExplorer mode="search" initial={[8, -80]} />
<FitLineExplorer mode="solved" initialArea={65} />
<FitLineExplorer mode="train" initial={[8, -80]} />
```

| Prop | O que faz |
|---|---|
| `mode` | `'residuals'`: rótulo com sinal junto de cada ponto (acima dele quando o ponto está acima da reta) e tabela apartamento, área, preço, previsão, erro. `'squares'`: sobre cada erro, um quadrado de lado igual ao erro, quadrado de verdade na tela (largura em m² = erro × yUnit ÷ xUnit), e o SQE por extenso. `'search'` (padrão): os quadrados, o SQE, “menor soma que você já viu” (atualiza sozinha) e os botões “Registrar esta tentativa” e “Limpar a tabela”, com a tabela de tentativas (menor em negrito) e o aviso de que ela não cobre o que fica entre dois testes. `'solved'`: a reta y = 5x + 50 fixa, os erros e o deslizante da área (30 a 100, de 5 em 5); a bolinha vazia é a previsão, e fora de 40 a 80 m² o painel avisa que é extrapolação. `'train'`: os quadrados, os pesos e a perda SQE ÷ 5; o botão “Treinar” anima a reta da posição atual até (5, 50), e a perda desce até 280 |
| `initial` | `[m, n]` inicial (padrão `[8, -80]`) |
| `presets` | botões `{m, n, label?}` (sem `label`, o botão escreve a reta) |
| `sliders` | `false` esconde os deslizantes de m e n (a figura fica só com os botões) |
| `initialArea` | área inicial do modo `'solved'` (padrão 65) |
| `caption` | troca a legenda |

## FitErrorStack

Somar os erros com sinal. Cada erro é uma seta verde vertical, da reta até o
ponto (para cima quando o erro é positivo). A animação leva as cinco setas, uma
de cada vez, para uma coluna à direita (“fila dos erros”), encostando cada uma
na ponta da anterior a partir do traço do zero; um tracejado fica no lugar de
onde a seta saiu. No fim, “soma = …” junto do fim da fila. O painel escreve a
soma por extenso. Botões trocam a reta e repetem a animação.

```mdx
<FitErrorStack />
```

| Prop | O que faz |
|---|---|
| `lines` | retas `{m, n}` dos botões (padrão y = 350, y = 10x − 250, y = 5x + 50 e y = 5x + 40; as três primeiras somam zero) |
| `initial` | índice da reta inicial |
| `caption` | troca a legenda |

## FitAbsVsSquare

Dois apartamentos dividem 40 mil de erro: o A erra a (deslizante de 0 a 40,
de 5 em 5) e o B erra 40 − a. Em cima, um quadrado sobre cada erro (verde e
azul), com a área escrita dentro. Embaixo, a barra da soma sem sinal (sempre
40) e a barra da soma dos quadrados, com tracejados em 800 (o menor, em
a = 20) e 1 600 (o maior).

```mdx
<FitAbsVsSquare />
```

| Prop | O que faz |
|---|---|
| `initial` | erro inicial do A (padrão 0) |
| `caption` | troca a legenda |

## FitPredictionBars

A lista de previsões A c = m a + n 1 dos apartamentos como barras, uma por
apartamento: a parte escura (laranja) tem altura m × área; a parte clara, de
borda tracejada, tem altura n (com n negativo, ela é o trecho descontado no
alto da barra, sem preenchimento). O traço laranja no topo é a previsão; o
azul, o preço observado; o segmento verde, o erro. Deslizantes de m e n (as
mesmas faixas do `FitLineExplorer`). O painel escreve m (40, …, 80) + n (1, …,
1) = previsões, o vetor b e o resto, como colunas.

```mdx
<FitPredictionBars />
```

| Prop | O que faz |
|---|---|
| `initial` | `[m, n]` inicial (padrão `[5, 50]`) |
| `caption` | troca a legenda |

## FitProjection3D

Mínimos quadrados como projeção, em três dimensões, com os pontos (0, 2),
(1, 1) e (2, 3): cada eixo (“ponto 1”, “ponto 2”, “ponto 3”) guarda o valor de
um ponto. O pedaço de plano laranja (com malha) é o conjunto gerado pelas
colunas a = (0, 1, 2) e 1 = (1, 1, 1), desenhadas como setas laranja; a seta
azul é b = (2, 1, 3). A c (ponto laranja) anda pelo plano com os deslizantes
de m (−0,5 a 1,5) e n (0 a 2,5), de 0,25 em 0,25; o segmento verde vai de A c
até b, tracejado enquanto não é perpendicular. O painel faz A c, o resto, o
SQE e os produtos escalares do resto com as duas colunas. No pé da
perpendicular (m = 0,5, n = 1,5, resto (0,5; −1; 0,5), SQE 1,5) o segmento
fica cheio e ganha a marca de ângulo reto.

A cena usa **projeção ortogonal** própria (azimute φ no deslizante, de −80° a
60°, elevação fixa de 25°), e não a perspectiva oblíqua do `SpaceScene`: assim,
na vista de perfil (φ ≈ 38,6°, em que a direção do olhar fica dentro do plano)
o plano vira uma reta e o ângulo reto aparece reto na tela. Na vista inicial
(φ = 15°), b fica do lado de quem olha, e A c, b e as pontas das colunas ficam separados na tela; o rótulo de a fica no meio da seta. A caixa da figura é calculada sobre
todas as vistas, e o tamanho não muda ao girar.

Botões: “Levar A c ao pé da perpendicular” (anima A c até o pé), “Ver o plano
de perfil” e “Vista inicial” (animam o giro).

```mdx
<FitProjection3D />
<FitProjection3D pythagoras initial={[1, 1]} caption="..." />
```

| Prop | O que faz |
|---|---|
| `initial` | `[m, n]` inicial (padrão `[1, 0.5]`) |
| `pythagoras` | marca o pé H (verde), o triângulo b, H, A c com o ângulo reto em H, o trecho H até A c (laranja tracejado) e escreve SQE = 1,5 + ‖A c − H‖² |
| `caption` | troca a legenda |

## FitNormalRows

As equações normais como contas. Para cada linha de A transposta (a coluna das
áreas deitada, depois a coluna de uns), a figura escreve as cinco entradas
(laranja), embaixo as cinco coordenadas do resto (verde) e, uma de cada vez,
os produtos; depois a soma. No fim, A transposta vezes o resto como vetor,
igual ou diferente do vetor nulo. Botões trocam a reta: y = 5x + 50 (somas 0 e
0) e y = 5x + 40 (somas 3 000 e 50).

```mdx
<FitNormalRows />
```

| Prop | O que faz |
|---|---|
| `initial` | 0 (y = 5x + 50, padrão) ou 1 (y = 5x + 40) |
| `caption` | troca a legenda |

## SvdCircleMorph

O círculo de raio 1 (tracejado) virando a sua imagem por uma matriz 2 × 2. A
matriz do instante anda em linha reta da identidade até a matriz,
(1 − s)I + sA; com `rotation` (em graus), o giro é animado pelo ângulo, sem
encolher. Oito pontos do círculo viajam junto. O painel escreve a matriz e,
com a figura parada, o que o círculo virou: elipse (semieixos σ₁ e σ₂),
círculo, segmento (meio comprimento σ₁) ou ponto. As contas moram em
`SvdCircleMorph/svd.js` (`svd2` com dica de sinal para v₁, `orthoKind` que diz
se uma ortogonal é rotação ou espelho e a reta do espelho, `svdN` pelo método
de Jacobi para matrizes m × n, `layersSum`).

```mdx
<SvdCircleMorph
  window={[-7, 7, -7, 7]}
  unit={28}
  presets={[
    {label: 'A', matrix: [[3, 0], [4, 5]]},
    {label: 'rotação de 30°', name: 'R', rotation: 30, matrixTex: '...'},
  ]}
/>
<SvdCircleMorph matrix={[[3, 0], [4, 5]]} v1={[1, 1]} singular window={[-7.5, 7.5, -7.5, 7.5]} unit={26} />
<SvdCircleMorph name="Q" orientation arrowLabels={{v1: '\\vec{e}_1', Av1: 'Q\\vec{e}_1'}} presets={[...]} />
```

| Prop | O que faz |
|---|---|
| `matrix` / `rotation` | a matriz (por linhas) ou um giro em graus |
| `presets` | botões `{label, matrix ou rotation, name?, matrixTex?, window?, unit?, v1?, ...}`; cada botão troca a matriz e repete a animação |
| `name` | letra da matriz no painel e nos rótulos (padrão `A`) |
| `matrixTex` | escreve a matriz em LaTeX exato no painel |
| `singular` | setas v₁ e v₂ viajando até Av₁ e Av₂; no fim, as de partida ficam claras e os dois ângulos retos aparecem |
| `v1` | dica de sinal para v₁ (a figura usa o sinal que o texto usa) |
| `orientation` | quarto de disco entre as setas de partida e arco de v₁ para v₂: depois de um espelho, o arco anda no sentido horário |
| `arrowLabels`, `offsets` | rótulos `{v1, v2, Av1, Av2}` e deslocamentos `[dx, dy, anchor]` |
| `dots` | liga ou desliga os oito pontos (padrão: ligados sem `singular`) |
| `note` | frase extra no painel, com a figura parada |
| `window`, `unit`, `duration`, `caption` | janela, escala, duração e legenda |

## SvdStretchSearch

A seta v (tom 1) de comprimento 1 no círculo, a seta Av (tom 2) terminando
na elipse tracejada, e embaixo o gráfico do comprimento de Av para cada
ângulo de 0° a 180°. O deslizante anda de grau em grau; a menos de 1° de um
extremo, um ímã puxa a seta para ele. O registro guarda o maior e o menor
comprimento vistos; quando são os de verdade, as direções ficam marcadas em
verde (σ₁ e σ₂ escritos) e o registro diz que as de partida estão a 90° e as
de chegada são perpendiculares. “Varrer todas as direções” gira a seta de 0° a
180° e registra tudo (com menos movimento, registra tudo de uma vez).

```mdx
<SvdStretchSearch />
<SvdStretchSearch squared />
```

| Prop | O que faz |
|---|---|
| `matrix`, `name`, `v1Hint` | a matriz (padrão `[[3, 0], [4, 5]]`), a letra e a dica de sinal de v₁ |
| `squared` | gráfico do comprimento ao quadrado, e o painel escreve ‖Av‖² = λ₁a² + λ₂b² |
| `initial` | ângulo inicial (padrão 0) |
| `window`, `unit`, `caption` | janela, escala e legenda |

## SvdThreeSteps

A = UΣVᵀ em três passos. O círculo de raio 1, as setas v₁ (tom 1) e v₂ (tom
2), o quarto de disco entre elas com o arco de orientação e a malha do plano
passam por Vᵀ, depois por Σ, depois por U. Um giro anima o ângulo; um espelho
anima o plano virando como uma página, com a reta do espelho tracejada. O
painel descreve cada passo (giro de quantos graus e em que sentido, espelho
em que reta, quanto estica cada eixo). Botões “Ver os três passos”, “Próximo
passo”, “Voltar ao começo” e os das matrizes.

```mdx
<SvdThreeSteps presets={[{label: 'A', matrix: [[3, 0], [4, 5]], v1: [1, 1]}]} />
<SvdThreeSteps showMatrices presets={[{label: 'A', matrix: [[3, 0], [4, 5]], v1: [1, 1], tex: {Vt: '...', Sigma: '...', U: '...'}}]} />
```

| Prop | O que faz |
|---|---|
| `presets` | botões `{label, matrix, v1?, matrixTex?, tex?, window?, unit?, offsets?, note?}` |
| `showMatrices` | escreve A = U Σ Vᵀ no painel (exatas quando o preset traz `tex`) |
| `offsets` | por estado (0 a 3), deslocamentos dos rótulos das duas setas |
| `window`, `unit`, `caption` | janela, escala e legenda |

## SvdTransposeCheck

Quatro deslizantes (coordenadas inteiras de v e w, de −3 a 3) e o painel com
(Av)·w, v·(Aᵀw) por extenso e a conta errada v·(Aw), sem transpor.

```mdx
<SvdTransposeCheck />
```

| Prop | O que faz |
|---|---|
| `matrix` | a matriz (padrão `[[3, 0], [4, 5]]`) |
| `initialV`, `initialW` | vetores iniciais |

## SvdSymmetrySlider

A matriz `base` com o deslizante mudando só a entrada de baixo, à esquerda
(c). As retas de autovetores tracejadas (tom 1 para o maior autovalor, tom 2
para o menor), com o autovalor escrito, e o arco verde do ângulo entre elas.
O painel escreve Δ = (a − d)² + 4bc e diz se a matriz é simétrica (90°), se
não há autovalor real (nenhuma reta) ou se há uma reta só.

```mdx
<SvdSymmetrySlider />
```

| Prop | O que faz |
|---|---|
| `base` | matriz inicial (padrão `[[4, 1], [2, 3]]`, a da lição de autovalores) |
| `min`, `max`, `step` | faixa do deslizante de c (padrão −1 a 3, de 0,25 em 0,25) |
| `window`, `unit`, `caption` | janela, escala e legenda |

## SvdWeightedMean

À esquerda, o círculo de raio 1, as retas de v₁ (tom 1) e v₂ (tom 2) e a seta
v (tom 3) decomposta em a v₁ + b v₂ (setas tracejadas formando um retângulo).
À direita, a barra dos pesos a² e b² (juntos medem 1) e a régua de 0 a λ₁
com a faixa clara entre λ₂ e λ₁ e o ponto λ₁a² + λ₂b². Deslizante do ângulo
de v, de grau em grau.

```mdx
<SvdWeightedMean />
```

| Prop | O que faz |
|---|---|
| `l1`, `l2` | os dois autovalores (padrão 45 e 5) |
| `v1Angle` | ângulo de v₁ em graus (padrão 45) |
| `name`, `initial`, `caption` | letra da matriz, ângulo inicial e legenda |

## SvdOuterProduct

Uma coluna (tom 2, à esquerda) vezes uma linha (tom 1, em cima). A tabela se
preenche uma linha por vez, cada casa pintada pelo brilho (0 preto,
`maxValue` branco) e com o número escrito; a casa da coluna que está sendo
usada acende. No fim, o painel conta: m + n números refazem m × n casas.
Botão “Ver de novo”.

```mdx
<SvdOuterProduct col={[1, 2, 3, 3, 2, 1]} row={[1, 1, 3, 3, 1, 1]} />
```

| Prop | O que faz |
|---|---|
| `col`, `row` | as duas listas |
| `maxValue` | brilho do branco (padrão 9) |
| `caption` | legenda |

## SvdImageLayers

Três quadros: a original, a soma das k primeiras camadas σuvᵀ e o erro (tom 2
onde a original é mais clara, tom 1 onde é mais escura). Deslizante de k (0
até o posto). Embaixo, barras da soma dos quadrados do erro para cada k (a de
k = 0 é cortada com seta quando passa do topo). O painel conta os números
guardados, k × (1 + m + n), contra os m × n da imagem, e a porcentagem da
soma dos quadrados guardada. A SVD é calculada no navegador (`svdN`).

```mdx
<SvdImageLayers image={miniatura} only="original" showValues highlight={[[0, 0], [0, 1]]} />
<SvdImageLayers image={[[3, 0], [4, 5]]} showValues maxValue={5} matrixWords />
<SvdImageLayers image={miniatura} showValues naive={13} />
<SvdImageLayers image="foto" initialK={4} />
```

| Prop | O que faz |
|---|---|
| `image` | matriz de brilhos, ou `"foto"` (32 × 32, céu, sol, montanha, casa e chão, em `foto.json`) |
| `showValues` | escreve o número em cada casa (casas de 40 px; sem números, 7 px) |
| `maxValue` | brilho do branco (padrão 9) |
| `initialK` | camadas no começo (padrão 1) |
| `only="original"` | mostra só a imagem, com as casas de `highlight` contornadas em verde |
| `naive` | botão que compara com guardar os `naive` pixels mais claros e zerar os outros |
| `matrixWords` | fala em “entradas” em vez de “pixels” e esconde a conta dos números guardados |
| `cell`, `caption` | tamanho da casa e legenda |

## SvdRowsLine

Cada linha da matriz é um ponto (tom 2). Uma reta pela origem, na direção da
seta x de comprimento 1 (tom 1), gira com o deslizante; cada ponto é
projetado na reta (bolinha vazia), e o segmento verde é a distância. A soma
dos quadrados das distâncias é o erro da camada de posto 1 (Ax)xᵀ. Embaixo, o
gráfico do erro para todas as direções, com o mínimo (σ₂² ou, em geral, o
total menos σ₁²) marcado. Registro do menor erro visto; na direção de v₁ (ímã
de 1°), a reta fica verde. Botões “Varrer todas as direções” e “Limpar o
registro”.

```mdx
<SvdRowsLine rows={[[3, 0], [4, 5]]} pointLabels={[{math: '(3,\\ 0)'}, {math: '(4,\\ 5)'}]} />
<SvdRowsLine mode="pca" rows={[[-3, -2], [-2, -1], [-1, -1], [1, 1], [2, 2], [3, 1]]} window={[-4, 4, -3, 3]} unit={48} initial={90} />
```

| Prop | O que faz |
|---|---|
| `rows` | as linhas da matriz (pontos do plano) |
| `mode` | `'layer'` (padrão): o painel escreve x e a camada (Ax)xᵀ e o erro como total menos ‖Ax‖². `'pca'`: o painel fala em quanto da variação a reta guarda |
| `name` | letra da matriz (padrão `A`) |
| `pointLabels` | rótulos `{math, dx?, dy?, anchor?}` para os pontos |
| `initial` | ângulo inicial da reta |
| `window`, `unit`, `caption` | janela, escala e legenda |

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

