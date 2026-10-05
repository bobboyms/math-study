---
title: Coeficientes binomiais e binômio de Newton
---

# Coeficientes binomiais e binômio de Newton

## Problema motivador: por que aparece um 6?

Uma planilha registra quatro testes, cada um aprovado (A) ou reprovado (R).
Queremos contar as sequências com exatamente duas aprovações.

A pergunta equivale a escolher duas posições entre quatro. Mas há uma ligação
com álgebra: ao multiplicar $(a+b)$ por ele mesmo quatro vezes, o termo
$a^2b^2$ aparece seis vezes antes de reunirmos os termos semelhantes.

De onde vem esse seis? Vamos contar primeiro as posições e depois acompanhar
como a mesma escolha aparece na multiplicação algébrica.

## Mapa das ideias

- **Coeficiente binomial**: número $\binom{n}{k}$ que conta grupos de $k$ posições entre $n$.
- **Relação de Pascal**: dividir escolhas conforme um elemento esteja dentro ou fora.
- **Triângulo de Pascal**: organizar coeficientes binomiais em linhas.
- **Binômio**: expressão formada por dois termos, como $a+b$.
- **Binômio de Newton**: expansão de uma potência de um binômio usando essas contagens.

## Para que serve

Coeficientes binomiais contam posições de sucessos e falhas. Eles também
explicam os coeficientes das potências de uma soma e permitem conferir
combinações de mais de uma maneira.

Você não precisa decorar as linhas do triângulo. Precisamos entender por que
as escolhas produzem cada número.

## Ideias anteriores que voltam aqui

De [combinações](./combinacoes), vem a notação $C_{n,k} = \binom{n}{k}$.
De [elementos repetidos](./permutacoes-com-repeticao), vem escolher posições
para definir uma sequência. De [produtos notáveis](../algebra/produtos-notaveis),
voltam a distributiva e a soma de termos semelhantes.

Reative:

1. Quantos pares de posições há entre quatro?
   $C_{4,2} = \frac{4 \times 3}{2 \times 1} = 6$.
2. O que a distributiva produz em $(a+b)(a+b)$?
   $a^2 + ab + ba + b^2 = a^2 + 2ab + b^2$.
3. Por que $ab$ e $ba$ podem se reunir? A multiplicação é comutativa:
   $ab = ba$. Somar duas ocorrências dá $2ab$.

Nos produtos maiores, vamos contar quantas ocorrências iguais aparecem,
em vez de escrevê-las todas antes de somar.

## Intuição e modelo visual: escolher posições

Uma sequência de quatro testes com exatamente dois A fica determinada
quando escolhemos as duas posições com A. As outras duas recebem R.

| Posições com A | Sequência |
|---|---|
| 1 e 2 | AARR |
| 1 e 3 | ARAR |
| 1 e 4 | ARRA |
| 2 e 3 | RAAR |
| 2 e 4 | RARA |
| 3 e 4 | RRAA |

São seis sequências. Trocar a ordem em que anotamos as posições 1 e 2
não cria outra sequência. Por isso contamos combinações, não arranjos.

> O **coeficiente binomial** $\binom{n}{k}$ é a quantidade de grupos de
> $k$ posições escolhidos entre $n$, com $0 \le k \le n$.

Por exemplo, $\binom{4}{2} = 6$ conta a tabela acima. $A_{4,2} = 12$
não é essa contagem: distingue a ordem de escolha das mesmas posições.

A fórmula já foi construída na lição de combinações:

$$
\binom{n}{k} = \frac{n!}{k! \times (n-k)!}.
$$

## Construir uma contagem a partir de duas menores

Vamos contar os pares entre A, B, C e D separando pela presença de D:

| Caso | Grupos | Quantidade |
|---|---|---:|
| D fica fora | AB, AC, BC | $\binom{3}{2} = 3$ |
| D entra | AD, BD, CD | $\binom{3}{1} = 3$ |

Todo par pertence a um dos casos, e nenhum pertence aos dois. Portanto:

$$
\binom{4}{2} = \binom{3}{2} + \binom{3}{1} = 3 + 3 = 6.
$$

Para escolher $k$ elementos entre $n$, destaque um elemento:

- se ele ficar fora, escolhemos os $k$ entre os $n-1$ restantes;
- se ele entrar, falta escolher $k-1$ entre os $n-1$ restantes.

> A **relação de Pascal** expressa essa divisão em casos:
> $\binom{n}{k} = \binom{n-1}{k} + \binom{n-1}{k-1}$,
> para $n \ge 2$ e $1 \le k \le n-1$.

A contagem de pares entre quatro elementos é um exemplo. Somar duas
quantidades de grupos que ambos incluem D é um contraexemplo dessa divisão:
os casos não cobririam os grupos sem D.

## O triângulo de Pascal como tabela de contagens

Cada linha fixa $n$. Cada coluna fixa $k$. As células preenchidas são
$\binom{n}{k}$:

| $n$ / $k$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|---:|
| 0 | 1 | — | — | — | — | — |
| 1 | 1 | 1 | — | — | — | — |
| 2 | 1 | 2 | 1 | — | — | — |
| 3 | 1 | 3 | 3 | 1 | — | — |
| 4 | 1 | 4 | 6 | 4 | 1 | — |
| 5 | 1 | 5 | 10 | 10 | 5 | 1 |

> O **triângulo de Pascal** organiza os coeficientes binomiais por $n$.
> As extremidades valem 1, e cada valor interno soma as duas contagens
> correspondentes da linha anterior.

A linha de $n=4$ é 1, 4, 6, 4, 1. A sequência 1, 4, 4, 4, 1 é um
contraexemplo: o valor central deveria somar $3+3$, e não repetir o 4.

As extremidades valem 1 porque há um grupo vazio e um grupo com todos os
elementos. Os traços da tabela indicam posições com $k>n$, que não pertencem
à faixa da fórmula de fatoriais apresentada.

A linha também é simétrica: $\binom{n}{k} = \binom{n}{n-k}$.
Escolher quem entra determina quem fica fora.

### Por que a soma de uma linha é uma potência de 2?

Entre quatro posições, podemos escolher zero, uma, duas, três ou quatro.
Somar as contagens dessas categorias dá:

$$
1 + 4 + 6 + 4 + 1 = 16 = 2^4.
$$

Outro caminho: cada posição tem duas opções, “entra” ou “fica fora”.
Pelo princípio multiplicativo, quatro posições produzem $2^4$ escolhas.

Para $n$ posições, a soma das quantidades de grupos de todos os tamanhos
é $2^n$. Cada grupo aparece na categoria de seu próprio tamanho, uma vez.

## A ponte para a álgebra: uma escolha em cada fator

Um **binômio** tem dois termos. $a+b$ é um exemplo; $a+b+c$ é um
contraexemplo porque tem três termos.

Para expandir $(a+b)^3$, escrevemos três fatores:

$$
(a+b)^3 = (a+b)(a+b)(a+b).
$$

Pela distributiva, cada parcela do produto nasce escolhendo $a$ ou $b$
de cada fator e multiplicando as três escolhas. Os fatores ocupam posições
distintas, mesmo quando as expressões são iguais.

| Escolhas nos três fatores | Produto | Quantidade desse tipo |
|---|---|---:|
| aaa | $a^3$ | 1 |
| aab, aba, baa | $a^2b$ | 3 |
| abb, bab, bba | $ab^2$ | 3 |
| bbb | $b^3$ | 1 |

Os produtos aab, aba e baa são iguais a $a^2b$ pela comutatividade.
Somar suas três ocorrências produz $3a^2b$. A reunião dos outros tipos dá:

$$
(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3.
$$

Os coeficientes são as contagens da linha $n=3$ do triângulo.

## Por que o coeficiente de $a^2b^2$ é 6?

Em $(a+b)^4$, cada produto escolhe um termo de cada um dos quatro fatores.
Para produzir $a^2b^2$, devemos escolher $b$ em duas posições e $a$ nas
outras duas.

A escolha das posições com $b$ tem $\binom{4}{2} = 6$ possibilidades.
Cada uma produz o mesmo produto $a^2b^2$. Somar os seis produtos dá
$6a^2b^2$.

**Resposta ao problema motivador:** há seis sequências com duas aprovações.
O mesmo número aparece como coeficiente de $a^2b^2$ porque ambos os
problemas escolhem duas posições entre quatro.

## O binômio de Newton

Para produzir $a^{n-k}b^k$ em $(a+b)^n$, escolhemos $b$ em $k$ dos $n$
fatores. Os outros $n-k$ fornecem $a$.

Essas posições podem ser escolhidas de $\binom{n}{k}$ maneiras. Portanto,
o termo correspondente é:

$$
\binom{n}{k}a^{n-k}b^k.
$$

> O **binômio de Newton** expressa $(a+b)^n$ como a soma desses termos,
> percorrendo todos os inteiros $k$ de 0 a $n$.

Uma escrita compacta, para $n \ge 1$, é:

$$
(a+b)^n = \sum_{k=0}^{n} \binom{n}{k}a^{n-k}b^k.
$$

O símbolo $\sum$ significa “some”. Começamos com $k=0$, aumentamos
uma unidade por vez e terminamos com $k=n$. Há $n+1$ termos.
Não estamos multiplicando os valores de $k$.

Os termos das extremidades são $a^n$ e $b^n$. Neles, o outro tipo de
fator não foi escolhido. Se um valor substituído for zero, leia as
extremidades dessa maneira, sem precisar calcular $0^0$.

Para $n=4$, temos:

$$
(a+b)^4 = a^4 + 4a^3b + 6a^2b^2 + 4ab^3 + b^4.
$$

Essa expansão é um exemplo da fórmula. A expressão $a^4+b^4$ é um
contraexemplo: omite as escolhas que misturam $a$ e $b$.

## Exemplos resolvidos

### Exemplo 1: coeficiente de um termo

Qual é o coeficiente de $a^3b^2$ em $(a+b)^5$?

Precisamos escolher $b$ em duas posições entre cinco:

$$
\binom{5}{2} = \frac{5 \times 4}{2 \times 1} = 10.
$$

O termo é $10a^3b^2$. A soma dos expoentes, $3+2=5$, confere com
a quantidade de fatores do produto.

### Exemplo 2: uma potência com subtração

**Pause e tente.** Expanda $(x-2)^3$. Veja $x-2$ como $x+(-2)$.

<details>
<summary>Ver a solução</summary>

Na linha $n=3$, os coeficientes são 1, 3, 3 e 1. Em cada termo,
use $a=x$ e $b=-2$:

$$
(x-2)^3
= x^3 + 3x^2(-2) + 3x(-2)^2 + (-2)^3
= x^3 - 6x^2 + 12x - 8.
$$

As potências de $-2$ alternam o sinal conforme o expoente seja par ou ímpar.
Para conferir com $x=3$: $(3-2)^3 = 1$ e
$27 - 54 + 36 - 8 = 1$.

</details>

### Exemplo 3: posições de resultados

**Pause e tente.** Em seis testes, exatamente dois foram reprovados.
Quantas sequências de aprovações e reprovações têm essa quantidade?

<details>
<summary>Ver a solução</summary>

Escolha as duas posições com R:

$$
\binom{6}{2} = 15.
$$

É a mesma contagem de $\frac{6!}{4! \times 2!}$, da lição de elementos
repetidos. Ainda não afirmamos que as 15 sequências tenham a mesma chance.

</details>

## Erros comuns

**Contar as posições em ordem.** As posições 1 e 2 escolhidas para A
determinam a mesma sequência que 2 e 1. O coeficiente é uma combinação.

**Esquecer os coeficientes.** $(a+b)^2$ não é $a^2+b^2$.
Com $a=2$ e $b=3$, o lado esquerdo vale 25, mas $a^2+b^2$ vale 13.
As duas parcelas $ab$ somam 12, que é a diferença.

**Tratar o coeficiente como uma probabilidade.** $\binom{6}{2}=15$
conta sequências. Não é uma chance de 15. Para probabilidade, precisamos
do total de resultados e das chances atribuídas a eles.

## Perguntas de verificação

1. Por que o coeficiente de $a^{n-k}b^k$ conta posições, e não valores de $a$ e $b$?
2. Por que a relação de Pascal usa dois casos disjuntos?
3. Por que a linha de $n=4$ tem cinco coeficientes?

<details>
<summary>Respostas das verificações</summary>

1. Cada produto escolhe um termo de cada fator. Depois, os produtos com
   as mesmas quantidades de $a$ e $b$ são reunidos.
2. O elemento destacado ou entra ou fica fora. Nenhum grupo faz as duas
   coisas, e todos os grupos fazem uma delas.
3. A quantidade de escolhas de $b$ pode ser 0, 1, 2, 3 ou 4: cinco casos.

</details>

## Exercícios de domínio

### 1. Reconhecimento

1. Em $(a+b)^5$, o termo $a^2b^3$ corresponde a escolher $b$ em quantas posições?

### 2. Explicação

2. Por que a linha $n=5$ do triângulo começa e termina com 1?
3. Por que $\binom{5}{2} = \binom{5}{3}$?

### 3. Aplicação direta

4. Calcule $\binom{6}{2}$ e $\binom{6}{3}$.
5. Escreva a linha $n=6$ do triângulo de Pascal.

### 4. Variação

6. Expanda $(x+1)^4$.
7. Expanda $(x-1)^3$ e confira com $x=2$.

### 5. Problema misto

8. Sete testes têm exatamente três aprovações. Quantas sequências há?
9. Qual é o coeficiente de $x^3$ em $(x+2)^5$? Inclua a potência de 2
   na conta, não somente o coeficiente binomial.

### 6. Justificativa

10. Explique por duas contagens diferentes por que a soma da linha $n=5$
    do triângulo é $2^5$.

<details>
<summary>Dica para o exercício 9</summary>

Para obter $x^3$, escolha $x$ em três fatores e 2 nos dois restantes.
Cada escolha de posições produz $x^3$ multiplicado por dois fatores 2.

</details>

<details>
<summary>Respostas para conferência</summary>

1. Três posições entre cinco. O coeficiente é $\binom{5}{3} = 10$.
2. Há uma escolha de nenhuma posição e uma escolha de todas as cinco.
3. Escolher as duas posições que entram determina as três que ficam fora.
4. $\binom{6}{2} = 15$ e $\binom{6}{3} = 20$.
5. 1, 6, 15, 20, 15, 6, 1.
6. $x^4 + 4x^3 + 6x^2 + 4x + 1$.
7. $x^3 - 3x^2 + 3x - 1$.
   Com $x=2$, ambos valem 1: $8 - 12 + 6 - 1 = 1$.
8. $\binom{7}{3} = 35$.
9. $\binom{5}{3} \times 2^2 = 10 \times 4 = 40$.
   Se encontrou 10, contou as posições, mas esqueceu o produto dos dois fatores 2.
10. Por tamanho dos grupos: $1+5+10+10+5+1 = 32$.
    Por decisão em cada posição: cinco decisões com duas opções dão
    $2^5 = 32$. Cada grupo corresponde a uma sequência dessas decisões.

</details>

## Revisão curta

Os coeficientes binomiais contam posições. A relação de Pascal separa as
escolhas conforme um elemento entre ou fique fora. Na álgebra, as mesmas
contagens indicam quantos produtos iguais a distributiva produz.

Na [última lição](./da-contagem-a-probabilidade), vamos comparar a contagem
de resultados favoráveis com a de todos os possíveis, explicitando quando
essa comparação permite calcular uma probabilidade.
