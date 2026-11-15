# Plano de implementação: vetores e álgebra linear

Este documento planeja dois blocos novos do curso:

1. **Módulo 8 — Vetores**, no fim do capítulo 7 (Geometria e trigonometria),
   lições 7.28 a 7.34;
2. **Capítulo 11 — Álgebra linear**, lições 11.1 a 11.13.

Ele não é conteúdo do site: fica fora de `docs/` e não participa do build.
Serve de roteiro para quem escreve as lições, uma a uma, seguindo a skill
`tutor-matematica`.

Data do plano: 15 de novembro de 2026.

## 1. Por que estes dois blocos

O aluno quer, depois do curso, estudar pesquisa em deep learning. A matemática
dessa área se apoia em quatro pilares: álgebra linear, cálculo de várias
variáveis, probabilidade e estatística, e otimização. O curso hoje não tem
nada de álgebra linear: a palavra “vetor” aparece só duas vezes, de passagem,
em `geometria/13-razoes-trigonometricas.mdx`.

Vetores no plano são a porta de entrada: dão a intuição geométrica (seta,
soma, ângulo, projeção) que a álgebra linear depois generaliza para listas de
qualquer tamanho. Por isso os dois blocos vêm juntos e nesta ordem.

Cálculo de várias variáveis e probabilidade ficam **fora** deste plano.

## 2. Onde cada bloco entra, e por quê

**Vetores entram como Módulo 8 do capítulo 7, depois do Módulo 7.** Não no
meio do Módulo 3 (geometria analítica), por dois motivos:

- o produto escalar precisa do cosseno de um ângulo qualquer (Módulo 5, ciclo
  trigonométrico) e da fórmula de $\cos(a - b)$ (Módulo 7, lição 7.26). Com
  essas duas peças, a fórmula $\vec{u} \cdot \vec{v} = \lVert \vec{u} \rVert
  \lVert \vec{v} \rVert \cos\theta$ sai demonstrada, sem lei dos cossenos (que
  o curso não tem);
- a decomposição de um vetor em componentes usa seno e cosseno (Módulo 4) e a
  forma $r(\cos\theta, \sen\theta)$ do ciclo (Módulo 5).

Entrar no fim também evita renumerar as lições 7.14 a 7.27.

**Álgebra linear entra como capítulo 11**, depois da análise combinatória.
Nada precisa ser renumerado. O capítulo depende do capítulo 7 inteiro
(incluindo o Módulo 8) e de equações e funções, mas **não** depende de
cálculo: o aluno pode estudá-lo logo depois do capítulo 7.

## 3. Estrutura de arquivos

```
docs/geometria/
  27-vetores.mdx                              (id: geometria/vetores)                         7.28
  28-soma-de-vetores.mdx                      (id: geometria/soma-de-vetores)                 7.29
  29-modulo-direcao-e-componentes.mdx         (id: geometria/modulo-direcao-e-componentes)    7.30
  30-produto-escalar.mdx                      (id: geometria/produto-escalar)                 7.31
  31-projecao-ortogonal.mdx                   (id: geometria/projecao-ortogonal)              7.32
  32-retas-com-vetores.mdx                    (id: geometria/retas-com-vetores)               7.33
  33-vetores-no-espaco.mdx                    (id: geometria/vetores-no-espaco)               7.34

docs/algebra-linear/
  index.md                                    (id: algebra-linear/index)                      11.1
  01-vetores-com-muitas-coordenadas.mdx       (id: algebra-linear/vetores-com-muitas-coordenadas) 11.2
  02-matrizes.mdx                             (id: algebra-linear/matrizes)                   11.3
  03-sistemas-lineares-e-escalonamento.mdx    (id: algebra-linear/sistemas-lineares-e-escalonamento) 11.4
  04-combinacao-linear-e-independencia.mdx    (id: algebra-linear/combinacao-linear-e-independencia) 11.5
  05-transformacoes-lineares.mdx              (id: algebra-linear/transformacoes-lineares)    11.6
  06-produto-de-matrizes.mdx                  (id: algebra-linear/produto-de-matrizes)        11.7
  07-matriz-inversa.mdx                       (id: algebra-linear/matriz-inversa)             11.8
  08-determinante.mdx                         (id: algebra-linear/determinante)               11.9
  09-base-dimensao-e-posto.mdx                (id: algebra-linear/base-dimensao-e-posto)      11.10
  10-autovalores-e-autovetores.mdx            (id: algebra-linear/autovalores-e-autovetores)  11.11
  11-minimos-quadrados.mdx                    (id: algebra-linear/minimos-quadrados)          11.12
  12-decomposicao-em-valores-singulares.mdx   (id: algebra-linear/decomposicao-em-valores-singulares) 11.13
```

Rótulos da barra lateral: `'7.28 Vetores'`, `'7.29 Soma e multiplicação por
número'`, `'7.30 Módulo, direção e componentes'`, `'7.31 Produto escalar'`,
`'7.32 Projeção ortogonal'`, `'7.33 Retas com vetores'`, `'7.34 Vetores no
espaço'`, numa categoria `'Módulo 8 — Vetores'`. No capítulo 11:
`'11.1 Roteiro do capítulo'`, `'11.2 Vetores com muitas coordenadas'`,
`'11.3 Matrizes'`, `'11.4 Sistemas lineares e escalonamento'`, `'11.5
Combinação linear e independência'`, `'11.6 Transformações lineares'`,
`'11.7 Produto de matrizes'`, `'11.8 Matriz inversa'`, `'11.9 Determinante'`,
`'11.10 Base, dimensão e posto'`, `'11.11 Autovalores e autovetores'`,
`'11.12 Mínimos quadrados'`, `'11.13 Valores singulares'`.

## 4. Notação nova

Registrar na seção “Notação da casa” do `CLAUDE.md`.

| Ideia | Escreva | Observação |
|---|---|---|
| vetor | `\vec{v}`, `\vec{u}`, `\vec{w}` | em todo o curso, inclusive no capítulo 11. Uma frase no 11.2 avisa que artigos de aprendizado de máquina escrevem $\mathbf{x}$ em negrito para a mesma coisa |
| vetor entre dois pontos | `\overrightarrow{AB}` | |
| coordenadas | `\vec{v} = (3,\ 4)` | com decimal: `(0{,}6;\ 0{,}8)` — ponto e vírgula sempre que alguma coordenada tiver vírgula decimal |
| vetor coluna | `\begin{bmatrix} 3 \\ 4 \end{bmatrix}` | a partir de 11.3, quando o vetor é multiplicado por matriz. A lição diz que $(3,\ 4)$ e a coluna são o mesmo vetor escrito de dois jeitos |
| módulo (norma) | `\lVert \vec{v} \rVert` | **nunca** `\lvert \vec v \rvert` nem `\|`: o valor absoluto de número continua sendo `\lvert x \rvert` |
| vetor nulo | `\vec{0}` | |
| base canônica | `\vec{e}_1`, `\vec{e}_2`, `\vec{e}_3` | |
| produto escalar | `\vec{u} \cdot \vec{v}` | **exceção explicada** à regra do `\times`: o ponto aqui é outra operação (vetor com vetor dá número). A lição 7.31 diz isso com todas as letras. Produto de números continua `\times` |
| número vezes vetor | `3\vec{v}`, `k\vec{v}` | justaposição, como em $3x$ |
| matriz | letra maiúscula $A$, entradas $a_{ij}$; `\begin{bmatrix} ... \end{bmatrix}` | |
| matriz vezes vetor, produto de matrizes | `A\vec{v}`, `AB` | justaposição |
| transposta | `A^{\mathsf{T}}` | |
| identidade, inversa | `I`, `A^{-1}` | |
| determinante | `\det A`, `\det(A)` | não usar barras verticais para determinante |
| espaço | `\mathbb{R}^2`, `\mathbb{R}^3`, `\mathbb{R}^n` | |
| autovalor | `\lambda` | |
| ângulo entre vetores | `\theta` | |

Fica **fora**: produto vetorial (além de não servir ao objetivo do aluno, o
símbolo $\times$ colidiria com a multiplicação da casa), planos no espaço,
espaços vetoriais abstratos (polinômios e funções como vetores), forma de
Jordan.

## 5. Componentes visuais

- **`CartesianPlane`** ganhou `segments[].arrow: true` — é assim que um vetor é
  desenhado no plano. Soma (ponta com cauda), paralelogramo, decomposição,
  projeção: tudo com segmentos de seta e tracejados.
- **`LinearMap`** (novo): malha antes e depois de uma matriz $2 \times 2$, com
  $\vec{e}_1$, $\vec{e}_2$ e o quadrado unitário. Serve às lições 11.6 a 11.11
  e 11.13.
- **`Space3D`** (novo): eixos $x$, $y$, $z$ em perspectiva cavaleira, com a
  “caixa” de um ponto. Serve a 7.34 e a 11.2.
- `UnitCircle` e `GeoFigure` continuam disponíveis (ângulo entre vetores,
  triângulos de forças).
- Tabela markdown para dados (planilha de clientes, notas, preços), que é o
  modelo visual natural de vetor com muitas coordenadas e de matriz.

Documentação em `src/components/README.md`.

## 6. Módulo 8 — Vetores (capítulo 7)

Fio condutor: **deslocamento e força**. Todo vetor do módulo começa como “andar
tanto para leste e tanto para norte” ou “puxar com tal força numa direção”.

### 7.28 Vetores (`27-vetores.mdx`)

- **Problema motivador:** dois entregadores saem de bairros diferentes e cada
  um faz “3 quarteirões para leste e 4 para norte”. Eles terminam no mesmo
  lugar? Fizeram o mesmo deslocamento? (Não terminam no mesmo lugar; fizeram o
  mesmo deslocamento.) A lição separa **onde estou** (ponto) de **quanto me
  movi** (vetor).
- **Ideias:** grandeza que precisa só de um número (temperatura, preço) versus
  grandeza que precisa de tamanho e direção (deslocamento, velocidade, força);
  vetor como seta, com tamanho, direção e sentido; setas iguais em lugares
  diferentes representam o mesmo vetor; coordenadas de um vetor, $\vec{v} =
  (3,\ 4)$; vetor entre dois pontos, $\overrightarrow{AB} = B - A$, coordenada a
  coordenada; módulo $\lVert \vec{v} \rVert = \sqrt{a^2 + b^2}$, que é a fórmula
  da distância de 7.10 aplicada à seta; vetor nulo; vetor oposto $-\vec{v}$.
- **Contraexemplo da definição:** $\overrightarrow{AB}$ e $\overrightarrow{BA}$
  têm o mesmo tamanho e a mesma direção, mas **não** são iguais (sentidos
  opostos).
- **Erros comuns:** subtrair na ordem errada ($A - B$ em vez de $B - A$);
  confundir o ponto $(3,\ 4)$ com o vetor $(3,\ 4)$; achar que o módulo de
  $(-3,\ 4)$ é $\sqrt{-9 + 16}$.
- **Pré-requisitos a reativar:** plano cartesiano e distância (7.10), Pitágoras
  (7.5), números negativos.

### 7.29 Soma e multiplicação por número (`28-soma-de-vetores.mdx`)

- **Problema motivador:** um barco aponta para o norte a 8 km/h, e a correnteza
  o empurra para leste a 6 km/h. Para onde ele vai, e com que velocidade? (A
  resposta: $(6,\ 8)$, módulo 10 km/h.)
- **Ideias:** soma como deslocamentos encadeados (ponta com cauda); regra do
  paralelogramo e por que ela dá o mesmo resultado; soma coordenada a
  coordenada, justificada pelo desenho; subtração $\vec{u} - \vec{v} = \vec{u}
  + (-\vec{v})$ e seu desenho (a seta que vai da ponta de $\vec{v}$ à ponta de
  $\vec{u}$); multiplicação por número (esticar, encolher, inverter); vetores
  paralelos como múltiplos um do outro; **combinação linear** $a\vec{u} +
  b\vec{v}$ apresentada como “receita”; ponto médio revisitado como $A +
  \tfrac{1}{2}\overrightarrow{AB}$; propriedades (comutativa, associativa,
  distributiva) com a ponte para as propriedades dos números.
- **Erro comum central:** $\lVert \vec{u} + \vec{v} \rVert$ não é $\lVert
  \vec{u} \rVert + \lVert \vec{v} \rVert$. O barco: $8 + 6 = 14$, mas a
  velocidade real é 10. A igualdade só vale quando as setas apontam para o
  mesmo lado (desigualdade triangular, nomeada sem demonstração formal).
- **Pré-requisitos:** 7.28; ponto médio (7.10); propriedades das operações.

### 7.30 Módulo, direção e componentes (`29-modulo-direcao-e-componentes.mdx`)

- **Problema motivador:** um avião voa a 500 km/h na direção 30° acima do eixo
  leste, e o vento sopra a 60 km/h para o sul. Qual a velocidade em relação ao
  solo e em que direção? Resolvido no fim, decompondo, somando e recompondo.
- **Ideias:** vetor unitário e normalizar ($\vec{v} / \lVert \vec{v} \rVert$);
  direção como ângulo com o eixo $x$; da forma “tamanho e ângulo” para
  coordenadas: $\vec{v} = r(\cos\theta,\ \sen\theta)$, que é o ponto do ciclo
  trigonométrico esticado $r$ vezes (7.18); de coordenadas para tamanho e
  ângulo: $r$ por Pitágoras, $\theta$ por arco tangente **com correção de
  quadrante** (7.19 e 7.24); decomposição de forças (retoma o exemplo do fim de
  7.14 e a frase “decompor um vetor é aplicar seno e cosseno”); soma de várias
  forças pela soma das componentes.
- **Erro comum central:** $\arctg(4 / (-3))$ dá um ângulo do 4º quadrante, mas
  o vetor $(-3,\ 4)$ está no 2º. Desmontar com o desenho.
- **Pré-requisitos:** 7.14, 7.18, 7.19, 7.24.

### 7.31 Produto escalar (`30-produto-escalar.mdx`)

- **Problema motivador:** a nota de uma compra — quantidades $(3,\ 2,\ 5)$,
  preços $(4,\ 10,\ 2)$ — e o total “multiplica cada par e soma”. Depois, a
  mesma conta com uma força puxando uma caixa num ângulo: quanto da força
  realmente empurra para a frente? As duas perguntas têm a mesma conta.
  (Começar pela nota é de propósito: é exatamente a operação que um neurônio
  artificial faz, e o capítulo 11 volta a ela.)
- **Ideias:** definição algébrica $\vec{u} \cdot \vec{v} = u_1 v_1 + u_2 v_2$;
  aviso de notação (o ponto aqui não é multiplicação de números; vetor com
  vetor dá **número**); $\vec{v} \cdot \vec{v} = \lVert \vec{v} \rVert^2$;
  significado geométrico $\vec{u} \cdot \vec{v} = \lVert \vec{u} \rVert \lVert
  \vec{v} \rVert \cos\theta$, **demonstrado** escrevendo os dois vetores como
  $r(\cos\alpha,\ \sen\alpha)$ e usando $\cos(\alpha - \beta)$ de 7.26; ângulo
  entre vetores com $\arccos$ (7.24); sinal do produto (agudo, reto, obtuso);
  perpendicularidade $\Leftrightarrow$ produto zero; **ponte com 7.12**: os
  vetores $(1,\ m_1)$ e $(1,\ m_2)$ apontam ao longo das duas retas, e o produto
  zero é $1 + m_1 m_2 = 0$, ou seja, a regra $m_1 \times m_2 = -1$ reaparece
  como caso particular, agora incluindo a exceção das retas verticais;
  propriedades (comutativa, distributiva).
- **Erros comuns:** achar que o resultado é um vetor ($(1,2)\cdot(3,4) =
  (3,8)$); usar o ângulo errado (o ângulo entre os vetores, não com o eixo).
- **Pré-requisitos:** 7.24, 7.26, 7.12, 7.30.

### 7.32 Projeção ortogonal (`31-projecao-ortogonal.mdx`)

- **Problema motivador:** uma caixa de 50 kg numa rampa de 20°: quanto do peso
  puxa a caixa rampa abaixo e quanto aperta a caixa contra a rampa? Ou: a
  sombra de uma haste ao meio-dia. Escolher um e resolvê-lo inteiro.
- **Ideias:** projetar = “quanto de $\vec{v}$ aponta na direção de $\vec{u}$”;
  componente escalar $\dfrac{\vec{v} \cdot \vec{u}}{\lVert \vec{u} \rVert}$
  vinda do cosseno; vetor projeção $\dfrac{\vec{v} \cdot \vec{u}}{\vec{u} \cdot
  \vec{u}}\,\vec{u}$; decomposição $\vec{v} = \text{projeção} + \text{resto}$
  com o resto perpendicular a $\vec{u}$ (conferir pelo produto escalar); o
  ponto da reta mais perto de um ponto dado é o pé da projeção — e a distância
  é o tamanho do resto (retoma o Exemplo 5 de 7.12, “a distância de um ponto a
  uma reta”, agora sem precisar montar a perpendicular e resolver sistema).
- **Antecipar sem desenvolver:** “o mais perto possível” é a ideia que, no
  capítulo 11, vira o método dos mínimos quadrados.
- **Erro comum:** dividir por $\lVert \vec{u} \rVert$ em vez de $\lVert
  \vec{u} \rVert^2$ na fórmula do vetor projeção quando $\vec{u}$ não é
  unitário. Testar com $\vec{u} = (2,\ 0)$.
- **Pré-requisitos:** 7.31, 7.30.

### 7.33 Retas com vetores (`32-retas-com-vetores.mdx`)

- **Problema motivador:** um drone parte de $(1,\ 2)$ e se move com velocidade
  $(3,\ 1)$ por minuto; outro parte de $(10,\ 0)$ com velocidade $(-1,\ 2)$.
  As rotas se cruzam? Os drones se encontram? (As rotas se cruzam num ponto,
  mas em instantes diferentes — conferir com `python3` ao escrever.)
- **Ideias:** posição no instante $t$: $P(t) = A + t\vec{d}$ (equação vetorial
  e paramétricas $x = x_0 + at$, $y = y_0 + bt$); eliminar $t$ dá a equação
  reduzida de 7.11, e o coeficiente angular é $b/a$; vetor normal: em $ax + by +
  c = 0$, o vetor $(a,\ b)$ é perpendicular à reta (demonstração pelo produto
  escalar de dois pontos da reta); por isso a forma geral acomoda as verticais;
  fórmula da distância de ponto a reta $\dfrac{\lvert a x_0 + b y_0 + c
  \rvert}{\sqrt{a^2 + b^2}}$ deduzida pela projeção sobre a normal (7.32).
- **Erro comum:** achar que duas rotas que se cruzam significam encontro.
- **Pré-requisitos:** 7.11, 7.12, 7.31, 7.32, sistemas (4.9).

### 7.34 Vetores no espaço (`33-vetores-no-espaco.mdx`)

- **Problema motivador:** num depósito, um drone de inventário está no canto
  $(0,\ 0,\ 0)$ e precisa chegar a uma prateleira a 3 m, 4 m e 12 m de altura
  nas três direções. Qual o comprimento do voo em linha reta? (13 m: Pitágoras
  duas vezes, 3-4-5 e 5-12-13.)
- **Ideias:** terceiro eixo e o endereço $(x,\ y,\ z)$; a “caixa” do ponto
  (`Space3D`, prop `boxes`); distância no espaço por Pitágoras duas vezes; as
  operações de 7.28 a 7.32 valem coordenada a coordenada, sem mudar nenhuma
  definição; produto escalar e ângulo no espaço (a fórmula do cosseno é
  aceita como extensão: os dois vetores estão sempre num plano, e nesse plano
  vale 7.31 — explicar essa ponte); e o salto: se a conta não depende de
  desenhar, nada impede 4, 5 ou 100 coordenadas — uma linha de planilha é um
  vetor. Fechar apontando para o capítulo 11.
- **Fim do módulo:** `## Revisão do módulo 8 {#revisao-do-modulo-8}`, com seis
  questões que misturam o módulo com os anteriores, dicas e gabarito, no mesmo
  formato da revisão do módulo 7 (`26-equacoes-trigonometricas.mdx`).
- **Pré-requisitos:** todo o módulo; Pitágoras; volumes (7.9) para a
  intuição de caixa.

## 7. Capítulo 11 — Álgebra linear

Fio condutor: **dados em tabela**. Cada lição parte de uma planilha (clientes,
lojas, preços, notas, pixels) e mostra que a operação nova é uma pergunta
natural sobre aquela tabela. O capítulo fecha mostrando que uma camada de rede
neural é $\vec{y} = W\vec{x} + \vec{b}$ e que treinar um modelo linear é
mínimos quadrados — mas o curso não ensina deep learning; aponta para ele.

Todas as contas com matrizes devem ser conferidas com `python3` (pode usar
`fractions.Fraction` para manter exatos; `numpy` só se estiver instalado —
verifique antes).

### 11.1 Roteiro do capítulo (`index.md`)

Mesmo formato de `docs/analise-combinatoria/index.md`: a pergunta do
capítulo, o que vem antes (com perguntas de resgate respondidas), um problema
que acompanha o capítulo, roteiro das páginas, como o capítulo se sustenta e
para onde ele leva (deep learning: o que ainda falta — cálculo de várias
variáveis, probabilidade — dito com honestidade).

### 11.2 Vetores com muitas coordenadas (`01-vetores-com-muitas-coordenadas.mdx`)

- **Problema motivador:** uma loja de streaming quer recomendar filmes. Cada
  cliente é uma linha com notas para 5 gêneros. Quais dois clientes têm gosto
  mais parecido? Distância e cosseno dão respostas diferentes, e a lição
  explica por quê.
- **Ideias:** $\mathbb{R}^n$; vetor como lista ordenada (a ordem importa: é o
  contraexemplo); operações e propriedades idênticas às do Módulo 8; módulo e
  distância em $n$ dimensões (a fórmula de 7.34 estendida, agora como
  definição); produto escalar; **similaridade do cosseno** $\cos\theta =
  \dfrac{\vec{u} \cdot \vec{v}}{\lVert \vec{u} \rVert \lVert \vec{v} \rVert}$ —
  o “ângulo” em 5 dimensões é definido por esta fórmula, e a lição explica por
  que essa definição é honesta (em 2 e 3 dimensões ela concorda com o ângulo
  desenhado); média de vetores; nota sobre $\mathbf{x}$ em negrito na
  literatura; imagens e palavras como vetores (um parágrafo, sem
  aprofundar).
- **Erro comum:** somar vetores de tamanhos diferentes; achar que distância
  pequena e cosseno grande sempre andam juntos (contraexemplo numérico: um
  cliente que dá notas iguais a outro, só que o dobro).

### 11.3 Matrizes (`02-matrizes.mdx`)

- **Problema motivador:** três lojas compram quatro produtos; preços por
  produto num vetor; quanto cada loja gasta? Uma tabela de quantidades vezes um
  vetor de preços.
- **Ideias:** matriz como tabela, $m \times n$ (linhas por colunas), entrada
  $a_{ij}$; vetor coluna; **matriz vezes vetor** de dois jeitos que dão o mesmo
  resultado: (1) cada linha faz um produto escalar com o vetor; (2) o resultado
  é uma combinação linear das colunas, com os pesos do vetor; dimensões
  compatíveis (contraexemplo: $2 \times 3$ vezes vetor de 2 coordenadas não
  existe); soma de matrizes e número vezes matriz; transposta $A^{\mathsf{T}}$
  (trocar linhas por colunas: a mesma planilha vista de lado); a linha
  $\vec{y} = W\vec{x} + \vec{b}$ de uma camada de rede neural como exemplo de
  uso, com números pequenos.
- **Erro comum:** multiplicar a linha pela linha; trocar $m \times n$ por $n
  \times m$.

### 11.4 Sistemas lineares e escalonamento (`03-sistemas-lineares-e-escalonamento.mdx`)

- **Problema motivador:** uma nutricionista combina três alimentos para atingir
  metas exatas de proteína, carboidrato e gordura. Três equações, três
  incógnitas. Os métodos de 4.9 (substituição e eliminação) ficam pesados.
- **Ideias:** sistema como $A\vec{x} = \vec{b}$; matriz aumentada; as três
  operações elementares e **por que cada uma não muda o conjunto de soluções**
  (cada uma pode ser desfeita, e a ponte com “fazer a mesma coisa dos dois
  lados” das equações); eliminação de Gauss até a forma escalonada; pivô;
  substituição de trás para a frente; os três desfechos (uma, nenhuma,
  infinitas soluções) lidos na forma escalonada, com ponte para as três
  posições de duas retas em 4.9; variável livre e solução com parâmetro.
- **Erro comum:** aplicar a operação só no lado esquerdo da matriz aumentada;
  trocar linha e esquecer a coluna do resultado.

### 11.5 Combinação linear e independência (`04-combinacao-linear-e-independencia.mdx`)

- **Problema motivador:** uma loja de tintas tem três bases e quer saber quais
  cores consegue fabricar misturando-as — e se uma das bases é desperdício,
  porque já se obtém das outras duas.
- **Ideias:** combinação linear; conjunto gerado (o que se alcança misturando);
  no plano, dois vetores não paralelos geram tudo; no espaço, três vetores
  podem gerar só um plano; **dependência linear** como redundância; teste por
  escalonamento (uma linha zera); “$a\vec{u} + b\vec{v} + c\vec{w} = \vec{0}$
  só com $a = b = c = 0$” como definição de independência, com exemplo e
  contraexemplo; ligação com os desfechos de 11.4.
- **Erro comum:** achar que três vetores em $\mathbb{R}^3$ sempre geram o
  espaço; achar que nenhum vetor ser múltiplo de outro garante independência
  (contraexemplo com três vetores, dois a dois não paralelos, mas
  dependentes).

### 11.6 Transformações lineares (`05-transformacoes-lineares.mdx`)

- **Problema motivador:** num editor de imagens, “girar 30°”, “esticar na
  horizontal” e “inclinar” são aplicados a milhões de pixels. Como o programa
  sabe para onde vai cada pixel? Basta guardar 4 números.
- **Ideias:** função de vetor em vetor (ponte com função de 5.2 e composição de
  5.9); as duas exigências de linearidade (preserva soma e multiplicação por
  número) e o que elas querem dizer no desenho (malha continua malha, origem
  fica parada); contraexemplo: transladar não é linear (move a origem); toda
  transformação linear do plano é uma matriz, e **as colunas são as imagens
  de $\vec{e}_1$ e $\vec{e}_2$** — demonstrado escrevendo $\vec{v} = x\vec{e}_1
  + y\vec{e}_2$; catálogo: escala, reflexão, rotação (com $\cos$ e $\sen$,
  retomando 7.30), cisalhamento, projeção sobre um eixo. Figuras com
  `LinearMap`.
- **Erro comum:** escrever as imagens de $\vec{e}_1$ e $\vec{e}_2$ como
  **linhas** da matriz.

### 11.7 Produto de matrizes (`06-produto-de-matrizes.mdx`)

- **Problema motivador:** girar 90° e depois esticar; é o mesmo que esticar e
  depois girar? Quais 4 números fazem as duas coisas de uma vez?
- **Ideias:** produto como composição ($AB\vec{v} = A(B\vec{v})$, primeiro $B$);
  a regra linha por coluna **deduzida** aplicando $A$ a cada coluna de $B$;
  dimensões ($m \times n$ vezes $n \times p$); não comutatividade com o
  exemplo do motivador desenhado; associatividade (aplicar três
  transformações em sequência); identidade $I$; produto com a transposta,
  $(AB)^{\mathsf{T}} = B^{\mathsf{T}} A^{\mathsf{T}}$ só enunciado e conferido
  num exemplo; **ponte com redes neurais:** duas camadas lineares sem nada
  entre elas equivalem a uma camada só (o produto das matrizes) — é por isso
  que as redes põem uma função não linear entre as camadas.
- **Erro comum:** multiplicar entrada por entrada; achar $AB = BA$.

### 11.8 Matriz inversa (`07-matriz-inversa.mdx`)

- **Problema motivador:** uma mensagem foi codificada multiplicando cada par de
  números por uma matriz $2 \times 2$. Como decodificar?
- **Ideias:** inversa como a transformação que desfaz; $AA^{-1} = A^{-1}A = I$;
  fórmula $2 \times 2$ com $ad - bc$ (deduzida resolvendo o sistema, não
  apresentada pronta); cálculo por Gauss-Jordan, $[A \mid I] \to [I \mid
  A^{-1}]$, e por que funciona; quando não existe (a transformação achata o
  plano numa reta, e informação se perde: dois pontos diferentes vão para o
  mesmo lugar); $(AB)^{-1} = B^{-1}A^{-1}$ (meia e sapato); resolver
  $A\vec{x} = \vec{b}$ com a inversa, e por que na prática se prefere
  escalonar.
- **Erro comum:** inverter entrada por entrada ($1/a_{ij}$).

### 11.9 Determinante (`08-determinante.mdx`)

- **Problema motivador:** uma transformação leva um terreno de 1 hectare
  (quadrado) num paralelogramo. Qual a área nova? E se o resultado for zero?
- **Ideias:** determinante como fator de área: o quadrado unitário vira o
  paralelogramo gerado pelas colunas, e sua área é $ad - bc$ (demonstração por
  recorte: retângulo envolvente menos triângulos e retângulos, com figura);
  sinal: orientação (a figura “vira do avesso”, reflexão); $\det = 0$
  $\Leftrightarrow$ colunas dependentes $\Leftrightarrow$ sem inversa — a ponte
  com 11.5 e 11.8; $\det(AB) = \det A \times \det B$ pela leitura de fatores de
  área em sequência; $3 \times 3$ como fator de volume, calculado por
  escalonamento (o determinante de uma triangular é o produto da diagonal; cada
  operação muda o determinante de um jeito conhecido); regra de Sarrus
  mostrada como atalho, com o aviso de que só vale para $3 \times 3$.
- **Erro comum:** $\det(A + B) = \det A + \det B$ (contraexemplo com $I + I$).

### 11.10 Base, dimensão e posto (`09-base-dimensao-e-posto.mdx`)

- **Problema motivador:** uma planilha de 6 colunas de medidas de clientes em
  que algumas colunas são combinação das outras (preço total = quantidade ×
  preço unitário é **não** linear; usar um caso linear: “total gasto” = soma
  das colunas “gasto em loja” e “gasto online”). Quantas colunas carregam
  informação de verdade?
- **Ideias:** base como conjunto mínimo que gera (independente e gerador);
  coordenadas numa base diferente da canônica (mudança de base com um exemplo
  $2 \times 2$); dimensão = número de vetores de qualquer base (enunciado, com
  a intuição de por que não depende da base escolhida); subespaço (reta e
  plano pela origem; contraexemplo: reta que não passa pela origem); **posto**
  de uma matriz = número de pivôs = número de colunas independentes; núcleo (as
  soluções de $A\vec{x} = \vec{0}$); relação posto + dimensão do núcleo =
  número de colunas, conferida em exemplos.
- **Erro comum:** achar que o posto é o número de colunas não nulas.

### 11.11 Autovalores e autovetores (`10-autovalores-e-autovetores.mdx`)

- **Problema motivador:** a cada ano, 10% dos moradores da cidade vão para o
  campo e 20% dos do campo vão para a cidade. Começando com qualquer
  distribuição, o que acontece depois de muitos anos? (Equilíbrio com 2/3 na
  cidade — conferir.)
- **Ideias:** aplicar a mesma matriz muitas vezes; direções especiais que a
  matriz só estica: $A\vec{v} = \lambda\vec{v}$; leitura no desenho
  (`LinearMap` com as direções marcadas); como achar: $(A - \lambda I)\vec{v}
  = \vec{0}$ precisa de solução não nula, logo $\det(A - \lambda I) = 0$ (ponte
  com 11.9), que em $2 \times 2$ é uma equação do 2º grau (Bhaskara, 4.5);
  autovetor de cada autovalor por escalonamento; diagonalização $A = PDP^{-1}$
  e por que $A^k = PD^kP^{-1}$ resolve o motivador (o autovalor menor que 1
  some com as potências); contraexemplo: rotação de 90° não tem autovetor real
  (discriminante negativo, ponte com números complexos de 4.7, sem
  desenvolver).
- **Erro comum:** aceitar $\vec{v} = \vec{0}$ como autovetor.

### 11.12 Mínimos quadrados (`11-minimos-quadrados.mdx`)

- **Problema motivador:** cinco apartamentos com área e preço; nenhuma reta
  passa pelos cinco pontos. Qual reta erra menos? (O primeiro modelo de
  aprendizado de máquina: regressão linear.)
- **Ideias:** sistema sem solução ($A\vec{x} = \vec{b}$ com mais equações que
  incógnitas); “errar menos” medido pela soma dos quadrados dos erros, e por
  que quadrado (sinal e penalidade); a melhor aproximação é a **projeção** de
  $\vec{b}$ sobre o conjunto gerado pelas colunas (generalização de 7.32); o
  resto é perpendicular a cada coluna, e escrever isso dá as **equações
  normais** $A^{\mathsf{T}}A\vec{x} = A^{\mathsf{T}}\vec{b}$; resolver o
  motivador por completo; conferir que a soma dos erros quadráticos é menor
  que a de outra reta qualquer escolhida a olho.
- **Erro comum:** minimizar a soma dos erros com sinal (contraexemplo: erros
  $+5$ e $-5$ somam zero).

### 11.13 Valores singulares (`12-decomposicao-em-valores-singulares.mdx`)

- **Problema motivador:** uma imagem em tons de cinza de $6 \times 6$ pixels
  (36 números) pode ser guardada com bem menos números quase sem perder
  nada? Usar uma matriz pequena com estrutura (faixas), para que as contas
  caibam à mão e sejam conferidas com `python3`.
- **Ideias:** matrizes simétricas têm autovetores perpendiculares (exemplo
  $2 \times 2$ conferido pelo produto escalar); toda matriz $2 \times 2$ leva o
  círculo unitário numa elipse (figura: `CartesianPlane` com `functions` ou
  pontos amostrados), e os semieixos da elipse são os **valores singulares**;
  $A = U\Sigma V^{\mathsf{T}}$ lido como girar, esticar, girar; como achar:
  autovalores de $A^{\mathsf{T}}A$ (ponte com 11.11); aproximação de posto 1
  e compressão; PCA mencionado como a mesma ideia aplicada a dados (um
  parágrafo).
- **Fecho do capítulo:** seção “Para onde isso leva”, com o mapa do que o aluno
  agora sabe e do que falta para deep learning (gradiente, regra da cadeia em
  várias variáveis, probabilidade).
- **Erro comum:** confundir valores singulares com autovalores de $A$
  (contraexemplo com uma matriz de cisalhamento).

## 8. Arquivos que mudam além das lições

- `sidebars.js`: categoria “Módulo 8 — Vetores” dentro do capítulo 7; capítulo
  “11. Álgebra linear” depois do 10.
- `docs/geometria/index.md`: Módulo 8 no roteiro (itens 27 a 33), “sete
  módulos” vira “oito”, o percurso para cálculo diz que o Módulo 8 não é
  pré-requisito do Cálculo 1, e “Para onde isso leva” menciona a álgebra
  linear.
- `docs/geometria/26-equacoes-trigonometricas.mdx`: se houver chamada para a
  próxima etapa depois da revisão do módulo 7, acrescentar o Módulo 8.
- `docs/geometria/13-razoes-trigonometricas.mdx`: a frase “decompor um vetor é
  aplicar seno e cosseno” ganha link para 7.30 (diff mínimo).
- `docs/intro.md`: capítulo 11 na ordem de estudo e um parágrafo sobre a
  linha que leva ao aprendizado de máquina.
- `CLAUDE.md`: a estrutura (capítulo `algebra-linear/`) e a notação da seção 4.
- `src/components/README.md`: já documenta `LinearMap`, `Space3D` e as setas.

## 9. Ordem de escrita

Ondas de no máximo quatro agentes (ver a memória do projeto sobre o Cálculo 1):

1. 7.28, 7.29, 7.30, 7.31
2. 7.32, 7.33, 7.34, 11.2
3. 11.3, 11.4, 11.5, 11.6
4. 11.7, 11.8, 11.9, 11.10
5. 11.11, 11.12, 11.13, 11.1 (roteiro, escrito por último, quando as lições
   existem)

Depois de cada onda: build, captura das figuras, conferência visual. No fim:
conferência numérica independente das lições.
