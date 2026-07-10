---
title: Operacoes basicas
---

# Operacoes basicas

## Contexto

Operacoes basicas sao formas organizadas de transformar quantidades. Quando
somamos, juntamos quantidades. Quando subtraimos, retiramos ou comparamos.
Quando multiplicamos, repetimos grupos iguais. Quando dividimos, repartimos em
partes iguais ou descobrimos quantos grupos cabem em uma quantidade.

Antes de serem simbolos no papel, as operacoes sao acoes: juntar objetos,
tirar objetos, formar grupos e repartir. A conta escrita apenas registra essas
acoes de um jeito mais rapido e preciso.

## Problema motivador

Voce tem 6 lapis e ganha mais 4. Depois entrega 3 a um colega.

Quantos lapis ficam?

Primeiro juntamos:

$$
6 + 4 = 10
$$

Depois retiramos:

$$
10 - 3 = 7
$$

Essa situacao simples mostra que as operacoes basicas nasceram de acoes
concretas: juntar, tirar, repetir grupos e repartir.

## Intuicao

As quatro operacoes principais respondem a perguntas diferentes:

- adicao: quanto ha ao juntar?
- subtracao: quanto sobra ou qual e a diferenca?
- multiplicacao: quanto ha em grupos iguais?
- divisao: quanto cabe em cada grupo ou quantos grupos podem ser formados?

Multiplicacao nao deve ser vista apenas como "decorar tabuada". Ela e uma
forma compacta de representar adicoes repetidas.

Por exemplo:

$$
4 \times 3 = 3 + 3 + 3 + 3 = 12
$$

Divisao desfaz uma multiplicacao. Se:

$$
4 \times 3 = 12
$$

entao:

$$
12 \div 4 = 3
$$

## Modelo visual

Veja `4 x 3` como quatro grupos com tres objetos:

```text
* * *
* * *
* * *
* * *
```

Ao todo, ha 12 objetos.

Agora veja `12 div 4` como a pergunta:

> Se 12 objetos forem separados em 4 grupos iguais, quantos ficam em cada
> grupo?

```text
* * *   * * *   * * *   * * *
```

Cada grupo fica com 3.

## Formalizacao

Em uma expressao com varias operacoes, usamos uma ordem para evitar
ambiguidade. Primeiro resolvemos parenteses, depois potencias e raizes, depois
multiplicacoes e divisoes, e por fim adicoes e subtracoes.

Exemplo:

$$
2 + 3 \times 4 = 2 + 12 = 14
$$

Se quisessemos somar primeiro, precisariamos escrever:

$$
(2 + 3) \times 4 = 5 \times 4 = 20
$$

Parenteses mudam a estrutura do calculo.

## Elemento neutro: operar sem mudar

Depois que entendemos as operacoes como acoes, aparece uma pergunta importante:

> Existe algum numero que participa da operacao sem mudar a quantidade
> original?

Esse numero e chamado de elemento neutro.

Na adicao, o elemento neutro e 0:

$$
8 + 0 = 8
$$

Isso faz sentido no concreto. Se voce tem 8 lapis e ganha 0 lapis, continua
com 8 lapis. O zero representa "nenhuma quantidade adicionada".

Na multiplicacao, o elemento neutro e 1:

$$
8 \times 1 = 8
$$

Isso tambem faz sentido. Se voce tem 1 grupo com 8 lapis, continua tendo 8
lapis. O 1 representa "uma vez a mesma quantidade".

O ponto essencial e que o elemento neutro depende da operacao. O 0 e neutro na
adicao, mas nao e neutro na multiplicacao:

$$
8 \times 0 = 0
$$

Multiplicar por 0 nao preserva o 8; elimina a quantidade. Por isso o neutro da
multiplicacao nao pode ser 0. Precisa ser 1:

$$
8 \times 1 = 8
$$

De forma geral, se uma operacao e representada por `*`, o elemento neutro `e`
obedece a esta ideia:

$$
a * e = a
$$

e tambem:

$$
e * a = a
$$

Ou seja, operar com o neutro devolve o proprio valor.

Essa ideia e importante porque aparece quando resolvemos equacoes. Veja:

$$
x + 5 = 12
$$

Queremos deixar o $x$ sozinho. Para isso, desfazemos o $+5$ somando $-5$:

$$
x + 5 - 5 = 12 - 5
$$

Como $5 - 5 = 0$, fica:

$$
x + 0 = 7
$$

E como 0 e neutro da adicao:

$$
x = 7
$$

Na multiplicacao acontece algo parecido:

$$
3x = 15
$$

Dividimos por 3 para transformar o fator 3 em 1:

$$
\frac{3x}{3} = \frac{15}{3}
$$

Como $\frac{3}{3} = 1$, fica:

$$
1x = 5
$$

E como 1 e neutro da multiplicacao:

$$
x = 5
$$

O elemento neutro tambem aparece em programacao. Para somar varios valores,
comecamos com total igual a 0, porque 0 nao altera a soma:

```js
let total = 0;

total = total + 5;
total = total + 8;
total = total + 2;
```

Para multiplicar varios valores, comecamos com produto igual a 1, porque 1 nao
altera a multiplicacao:

```js
let produto = 1;

produto = produto * 5;
produto = produto * 8;
produto = produto * 2;
```

Se o produto comecasse em 0, qualquer multiplicacao continuaria dando 0.

Nem toda operacao tem elemento neutro dos dois lados. Na subtracao:

$$
a - 0 = a
$$

mas:

$$
0 - a \neq a
$$

Por exemplo:

$$
0 - 8 = -8
$$

Entao 0 nao e elemento neutro completo da subtracao. Ele preserva o valor
apenas quando aparece do lado direito.

## Exemplo resolvido

Uma pessoa compra 3 pacotes com 5 canetas cada e depois perde 4 canetas.
Quantas sobram?

Primeiro calculamos o total comprado:

$$
3 \times 5 = 15
$$

Depois retiramos as que foram perdidas:

$$
15 - 4 = 11
$$

Sobram 11 canetas.

## Perguntas de verificacao

- Por que `3 x 5` pode ser entendido como tres grupos de cinco?
- Qual e a diferenca entre `12 div 3` e `12 div 4`?
- Por que `2 + 3 x 4` nao da o mesmo resultado que `(2 + 3) x 4`?
- Por que 0 e neutro da adicao, mas nao da multiplicacao?
- Por que 1 e o ponto de partida correto para multiplicar varios numeros?
