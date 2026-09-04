---
title: Cálculo 1
---

# Cálculo 1: medir o que muda a cada instante

Os capítulos anteriores ensinaram a descrever uma relação inteira — a função —
e a desenhá-la. Mas toda pergunta sobre **ritmo** ficou pela metade. A lição
de taxa média conseguiu dizer quanto uma função subiu **num trecho**; não
conseguiu dizer quanto ela está subindo **num ponto**. A lição de polinômios
mostrou que o volume da caixa tem um máximo e mais ou menos onde ele fica; não
conseguiu dizer onde exatamente. A lição do número $e$ anunciou que $e^x$ é
igual à própria taxa de variação, e avisou que a explicação ficaria para
depois.

Este capítulo paga essas promessas. A pergunta que o organiza é:

> Como medir uma quantidade que **muda a cada instante**?

## O que vem antes

De [Taxa média de variação](../funcoes/taxa-media-de-variacao): o quociente de
diferenças $\frac{f(a+h)-f(a)}{h}$ e a figura das secantes girando na direção
da tangente. A lição terminou dizendo que faltava uma única passagem — dizer
com rigor o que significa “$h$ se aproxima de zero”. É a primeira página deste
capítulo.

De [Álgebra](../algebra/): fatoração, conjugado e soma de frações algébricas.
Elas voltam quase intactas na segunda página, porque calcular um limite é,
quase sempre, reescrever uma fração sem mudar o valor dela.

De [Funções](../funcoes/): domínio, crescimento, composição e inversa. A regra
da cadeia é a composição de funções derivada; a derivada do logaritmo sai da
inversa.

De [Exponenciais e logaritmos](../exponenciais-e-logaritmos/) e de
[Geometria e trigonometria](../geometria/): as famílias de funções que este
capítulo aprende a derivar, e os radianos, sem os quais a derivada do seno não
sai limpa.

Se algum desses blocos estiver enferrujado, a [Revisão geral](../revisao-geral)
diz o que conferir antes de começar.

## Os dois problemas que abrem e fecham o capítulo

**O velocímetro.** Um veículo tem posição $s(t) = t^2$ metros após $t$
segundos. A lição de taxa média calculou a velocidade média entre 1 s e 3 s.
Mas o painel do carro não marca média: ele marca a velocidade **agora**. Dada
a posição, como achar a velocidade num instante? A resposta é a **derivada**, e
ocupa as Partes I, II e III.

**O velocímetro ao contrário.** Agora só o painel foi registrado: a velocidade
era $v(t) = 2t$ metros por segundo. Quanto o carro andou em 3 segundos? Com
velocidade constante, seria velocidade vezes tempo. Com velocidade que muda a
cada instante, a resposta é uma **área** sob o gráfico da velocidade, e o nome
dessa área é **integral**. É a Parte IV.

Os dois problemas são inversos um do outro, e o resultado principal do
capítulo — o **Teorema Fundamental do Cálculo** — diz exatamente isso: derivar
e integrar se desfazem.

## Para que isso serve?

- velocidade e aceleração a partir da posição; posição a partir da velocidade;
- taxa de crescimento de uma população, de um investimento, de uma epidemia,
  num instante e não numa média;
- o melhor valor: o corte que maximiza o volume, a lata que gasta menos
  material, o preço que dá o maior lucro;
- custo marginal e receita marginal em economia — a derivada com outro nome;
- área e distância acumulada, consumo total a partir de uma taxa de consumo;
- e, dentro da matemática, o esboço exato de qualquer gráfico: onde sobe,
  onde desce, onde muda de concavidade.

## Roteiro das páginas

O capítulo tem quatro partes. A primeira constrói a ferramenta que faltava —
o limite. A segunda define a derivada e ensina a calculá-la. A terceira usa a
derivada para responder perguntas concretas. A quarta inverte o problema e
chega à integral.

### Parte I — Limites e continuidade

1. [Limite de uma função](./limite-de-uma-funcao) — o valor de que $f(x)$ se
   aproxima, e por que ele não depende de $f(a)$ existir.
2. [Calculando limites](./calculo-de-limites) — quando a substituição dá
   $\frac{0}{0}$, reescrever a fração sem mudar o valor dela.
3. [Limites infinitos e no infinito](./limites-infinitos-e-no-infinito) — as
   assíntotas das funções racionais com nome exato.
4. [Continuidade](./continuidade) — quando o limite é o valor da função, e o
   que isso garante.
5. [Teorema do confronto](./teorema-do-confronto) — a demonstração que a lição
   de radianos deixou pendente: $\frac{\sen x}{x}$ tende a 1.

### Parte II — A derivada

6. [A derivada](./a-derivada) — o limite do quociente de diferenças: inclinação
   da tangente e taxa instantânea ao mesmo tempo.
7. [Quando a derivada não existe](./quando-a-derivada-nao-existe) — bico,
   tangente vertical e salto.
8. [Regras de derivação](./regras-de-derivacao) — potência, constante e soma,
   deduzidas dos produtos notáveis.
9. [Regras do produto e do quociente](./regras-do-produto-e-do-quociente) — o
   desenho de área diz por que a derivada do produto não é o produto das
   derivadas.
10. [Regra da cadeia](./regra-da-cadeia) — a taxa de uma composição é o
    produto das taxas.
11. [Derivadas de seno e cosseno](./derivadas-de-seno-e-cosseno) — com a soma
    de arcos e o limite da Parte I.
12. [Derivadas de exponencial e logaritmo](./derivadas-de-exponencial-e-logaritmo)
    — por que $e$ é a base cuja exponencial é a própria derivada.
13. [Derivação implícita](./derivacao-implicita) — derivar uma relação sem
    isolar $y$.

### Parte III — Aplicações da derivada

14. [Taxas relacionadas](./taxas-relacionadas) — duas grandezas ligadas por uma
    equação têm taxas ligadas pela cadeia.
15. [O sinal da derivada](./sinal-da-derivada) — onde a função sobe e onde
    desce, pelo quadro de sinais.
16. [Máximos e mínimos](./maximos-e-minimos) — os candidatos a extremo e o
    teste que decide; a caixa de 30 cm por 20 cm, resolvida com exatidão.
17. [O teorema do valor médio](./teorema-do-valor-medio) — a justificativa de
    que o sinal da derivada decide o crescimento.
18. [Problemas de otimização](./problemas-de-otimizacao) — modelar, reduzir a
    uma variável, derivar, testar os candidatos.
19. [Segunda derivada e concavidade](./segunda-derivada-e-concavidade) — a
    derivada da derivada e a forma do gráfico.
20. [Esboço de gráficos](./esboco-de-graficos) — o roteiro que desenha qualquer
    função sem plotar pontos.
21. [Regra de L'Hôpital](./regra-de-lhopital) — limites $\frac{0}{0}$ e
    $\frac{\infty}{\infty}$ pelo quociente das derivadas.

### Parte IV — A integral

22. [A integral como área](./a-integral-como-area) — a distância é a área sob a
    velocidade, e área curva se mede com retângulos cada vez mais finos.
23. [A integral definida](./a-integral-definida) — área com sinal e as
    propriedades que vêm do desenho.
24. [O teorema fundamental do cálculo](./teorema-fundamental-do-calculo) —
    derivar e integrar se desfazem.
25. [Primitivas e substituição](./primitivas-e-substituicao) — a tabela de
    derivadas lida ao contrário, e a regra da cadeia lida ao contrário.
26. [Área entre curvas](./area-entre-curvas) — a integral da diferença, e o
    fim do curso.

## Como estudar este capítulo

As lições são mais longas que as dos capítulos anteriores, e cada uma depende
da anterior de forma mais estreita. Duas recomendações:

- **Não pule a Parte I.** É tentador ir direto para as regras de derivação, e
  elas funcionam mesmo sem limite. Mas sem o limite as regras viram receita, e
  receita é o que este curso evita desde a primeira página.
- **Confira cada derivada com um número.** O curso ensina, na primeira lição
  de derivada, como estimar a taxa instantânea numa calculadora com um $h$
  pequeno. Use isso como o gabarito que você tem na mão: se a fórmula deu
  $f'(2) = 12$ e a calculadora dá $12{,}0006$, a conta está certa.

## O que vem depois

Este capítulo termina onde um curso de Cálculo 2 começaria: técnicas de
integração além da substituição, integrais impróprias, volumes por integração,
sequências e séries. A última lição diz, em poucas linhas, o que cada uma
dessas ideias faria com as ferramentas construídas aqui.
