---
title: Exponenciais e logaritmos
---

# Exponenciais e logaritmos: quando o crescimento é multiplicativo

O capítulo anterior percorreu as funções construídas a partir de somas, produtos
e quocientes de potências. Todas elas têm algo em comum: a variável aparece na
**base**, e o expoente é um número fixo.

Este capítulo troca os papéis:

> O que acontece quando a variável está **no expoente**?

A diferença não é de detalhe. Em $x^2$, dobrar a entrada quadruplica a saída. Em
$2^x$, **somar 1** à entrada dobra a saída. O primeiro é um crescimento rápido;
o segundo é de outra natureza — e ultrapassa qualquer polinômio, por maior que
seja o grau dele.

## O que vem antes

De [Potências](../numeros-e-operacoes/potencias): as três propriedades que
governam tudo aqui — $a^m \cdot a^n = a^{m+n}$, $\frac{a^m}{a^n} = a^{m-n}$ e
$(a^m)^n = a^{mn}$. Elas viram, adiante, as três propriedades dos logaritmos, e
não por coincidência.

De [Expoentes fracionários](../numeros-e-operacoes/expoentes-fracionarios): o
que significa $2^{1/2}$. É o que permite que o expoente deixe de ser inteiro e
passe a ser qualquer número — sem isso, $2^x$ não seria uma curva contínua.

De [Funções](../funcoes/): a ideia de família de funções, o vocabulário de
domínio, imagem e crescimento, e sobretudo a **função inversa**. O logaritmo não
é um conceito novo: é a inversa da exponencial, e tudo o que se sabe sobre
inversas se aplica.

De [Equações e inequações](../equacoes/): resolver, isolar e verificar. As
equações deste capítulo trazem uma armadilha nova — soluções que a álgebra
produz mas o domínio recusa.

## A pergunta que organiza o capítulo

Compare duas formas de dinheiro render.

Em uma delas, o acréscimo é **fixo**: R\$ 100 por ano, todo ano. Na outra, o
acréscimo é **proporcional ao que já existe**: 10% do saldo, todo ano.

| Ano | Acréscimo fixo | Acréscimo proporcional |
|---:|---:|---:|
| 0 | R\$ 1.000 | R\$ 1.000 |
| 5 | R\$ 1.500 | R\$ 1.610 |
| 10 | R\$ 2.000 | R\$ 2.594 |
| 20 | R\$ 3.000 | R\$ 6.728 |

No começo mal se distinguem. Em vinte anos, a diferença passa de R\$ 3.700.

A primeira coluna é uma **função afim**, e o capítulo de funções já a descreveu.
A segunda é uma **função exponencial**, e é o objeto deste capítulo — junto com
a pergunta inversa, que é tão importante quanto: **quanto tempo até dobrar?**
Essa segunda pergunta é o que dá origem ao logaritmo.

## Para que isso serve?

- juros compostos, inflação, valorização e depreciação;
- crescimento de população, de audiência ou de uma epidemia;
- decaimento radioativo, meia-vida de um medicamento, resfriamento de um corpo;
- escalas logarítmicas: Richter para terremotos, decibel para som, pH para
  acidez — todas existem porque os números envolvidos variam por fatores
  enormes;
- e, dentro da matemática, a função exponencial de base $e$ é a única que é
  igual à sua própria taxa de variação, o que a torna central em todo o cálculo.

## Roteiro das páginas

1. [Função exponencial](./funcao-exponencial) — o crescimento em que o acréscimo
   é proporcional ao que já existe.
2. [Decaimento e o número $e$](./decaimento-e-o-numero-e) — o que muda quando a
   base é menor que 1, e de onde vem a constante 2,718…
3. [O logaritmo](./logaritmo) — a pergunta invertida: qual expoente produz este
   número?
4. [Propriedades do logaritmo](./propriedades-do-logaritmo) — as três regras que
   transformam produtos em somas, e a mudança de base.
5. [Função logarítmica](./funcao-logaritmica) — o gráfico, o domínio e a
   simetria com a exponencial.
6. [Equações exponenciais e
   logarítmicas](./equacoes-exponenciais-e-logaritmicas) — resolver, e verificar
   por que algumas soluções precisam ser descartadas.

## O que vem depois

O capítulo de [Geometria e trigonometria](../geometria/) segue por outro caminho
— medir forma, posição e ângulo. Mas a estrutura que você viu aqui reaparece lá:
o seno e o cosseno também são funções que se estudam pelo gráfico, pelo domínio
e pela inversa.

Ao terminar este capítulo, o conjunto de funções que você conhece cobre
essencialmente tudo o que um curso de cálculo assume de antemão.
