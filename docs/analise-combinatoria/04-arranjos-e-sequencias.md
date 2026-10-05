---
title: Arranjos e sequências com repetição
---

# Arranjos e sequências com repetição

## Problema motivador: responsável e suplente

Uma equipe tem seis pessoas disponíveis: Ana, Bruno, Carla, Diego, Elisa e
Fábio. Precisamos escolher uma responsável e outra suplente. Uma pessoa não
pode ocupar os dois cargos.

Quantas distribuições de cargos existem? Não vamos ordenar as seis pessoas.
Vamos preencher duas posições com funções diferentes.

## Mapa das ideias

- **Arranjo simples**: escolha ordenada de alguns elementos distintos, sem repetição.
- **Sequência com repetição**: preenchimento de posições em que uma opção pode reaparecer.
- **Comprimento da sequência**: quantidade de posições que devem ser preenchidas.
- **Restrição de posição**: condição que limita as opções de um lugar específico.

## Para que serve

Arranjos contam cargos, pódios e listas de atendimento em que só uma parte das
pessoas participa. Sequências com repetição contam códigos, resultados de
tentativas sucessivas e registros que podem repetir uma opção.

Antes de calcular, compare as funções: trocar responsável e suplente muda
o resultado, mesmo que os nomes escolhidos continuem os mesmos.

## Ideias anteriores que voltam aqui

Do [princípio multiplicativo](./principios-de-contagem), volta a contagem
por posições. De [fatorial e permutações](./fatorial-e-permutacoes), voltam
o produto decrescente e a expansão de fatoriais.

Reative:

1. Ao usar uma pessoa entre seis, quantas ficam disponíveis? Cinco.
2. O que conta $6!$? Ordens das seis pessoas, todas usadas uma vez.
3. Quanto vale $\frac{6!}{4!}$? Expandir o numerador deixa
   $6 \times 5 = 30$ depois de dividir pelo fator comum $4!$.

A conta da terceira pergunta vai reaparecer com um significado: preencher
as duas posições e parar antes de ordenar as quatro pessoas que ficaram fora.

## Intuição: o produto termina na última posição pedida

Para cada responsável, há cinco suplentes possíveis:

| Responsável | Suplentes possíveis | Quantidade |
|---|---|---:|
| Ana | Bruno, Carla, Diego, Elisa, Fábio | 5 |
| Bruno | Ana, Carla, Diego, Elisa, Fábio | 5 |
| Carla | Ana, Bruno, Diego, Elisa, Fábio | 5 |
| Diego | Ana, Bruno, Carla, Elisa, Fábio | 5 |
| Elisa | Ana, Bruno, Carla, Diego, Fábio | 5 |
| Fábio | Ana, Bruno, Carla, Diego, Elisa | 5 |

Há seis grupos com cinco distribuições cada:

$$
6 \times 5 = 30.
$$

**Resposta ao problema motivador:** existem 30 distribuições de cargos.

Não multiplicamos também por 4, 3, 2 e 1. As pessoas restantes não ocupam
nenhum cargo neste problema, e sua ordem não faz parte do resultado.

## Modelo visual: comparar as regras

Pense em três posições preenchidas com letras entre A, B, C, D e E.

| Regra | 1ª posição | 2ª posição | 3ª posição | Total |
|---|---:|---:|---:|---:|
| Sem repetição | 5 | 4 | 3 | 60 |
| Repetição permitida | 5 | 5 | 5 | 125 |

Na primeira linha, cada letra usada sai das opções seguintes. Na segunda,
uma letra usada permanece disponível. Por isso, AAA só aparece na segunda
linha, enquanto ABC aparece nas duas.

Sem repetição, o total é $5 \times 4 \times 3 = 60$.
Com repetição, o total é $5 \times 5 \times 5 = 125$.

## Do produto ao arranjo simples

> Um **arranjo simples de $n$ elementos tomados $k$ a $k$** é uma escolha
> ordenada de $k$ elementos distintos dentre $n$, sem repetir elementos.

Escolher responsável e suplente entre seis pessoas é um exemplo com
$n = 6$ e $k = 2$. Escolher uma equipe sem cargos é um contraexemplo,
porque trocar os nomes de ordem não cria uma equipe diferente.

Para $1 \le k \le n$, as opções são:

$$
A_{n,k} = n \times (n-1) \times \ldots \times (n-k+1).
$$

Há $k$ fatores. O último é $n-k+1$ porque, antes da última escolha,
já retiramos $k-1$ elementos.

Com cinco elementos e três posições, isso dá
$5 \times 4 \times 3 = 60$, como na tabela.

### Por que a fórmula tem um quociente de fatoriais?

O fatorial $n!$ continua o produto até 1. Para deixar somente os $k$
primeiros fatores, dividimos pelo produto que vem depois deles: $(n-k)!$.

No exemplo de cinco elementos e três posições:

$$
\frac{5!}{(5-3)!}
= \frac{5 \times 4 \times 3 \times 2!}{2!}
$$

Dividir o fator $2!$ do numerador pelo denominador deixa:

$$
5 \times 4 \times 3 = 60.
$$

O fator $2!$ conta ordens que não interessam: são os dois elementos que
ficaram fora das três posições. A divisão retira esse fator do cálculo.

Assim, para inteiros $0 \le k \le n$:

$$
A_{n,k} = \frac{n!}{(n-k)!}.
$$

Se $k = n$, todos entram e a conta vira $n!$, porque $0! = 1$.
Se $k = 0$, há uma sequência vazia e o quociente é $n! \div n! = 1$.
Se $k > n$, não é possível preencher as posições sem repetir. Há zero
resultados, e não aplicamos essa fórmula com um fatorial negativo.

## Quando a repetição é permitida

> Uma **sequência com repetição** de comprimento $k$ registra $k$ escolhas
> ordenadas, permitindo que uma opção reapareça.

Um código AAB é um exemplo. Uma sequência de cargos que exige pessoas
diferentes é um contraexemplo.

Se há $n \ge 1$ opções em cada posição, sem outra restrição, todas as
posições mantêm as mesmas $n$ opções:

$$
n \times n \times \ldots \times n = n^k.
$$

São $k$ fatores iguais. A igualdade vem da
[definição de potência](../numeros-e-operacoes/potencias).
Essa contagem também recebe o nome **arranjo com repetição**.

Num código de quatro posições usando os algarismos de 0 a 9:

$$
10^4 = 10\,000.
$$

O zero pode iniciar um código, e 0000 é válido. Não estamos contando
números de quatro algarismos.

## Exemplos resolvidos

### Exemplo 1: três cargos entre sete pessoas

Uma associação escolhe presidência, vice-presidência e tesouraria entre
sete pessoas. Cada pessoa ocupa no máximo um cargo.

$$
A_{7,3} = 7 \times 6 \times 5 = 210.
$$

Trocar quem ocupa a presidência com quem ocupa a tesouraria muda a
distribuição. Por isso a ordem das posições importa.

### Exemplo 2: códigos com duas regras

**Pause e tente.** Um código tem três posições, usando 0, 1, 2, 3 e 4.
Compare o total com repetição e o total sem repetição. O zero inicial é permitido.

<details>
<summary>Ver a solução</summary>

Com repetição: $5^3 = 125$.
Sem repetição: $A_{5,3} = 5 \times 4 \times 3 = 60$.

O código 001 pertence à primeira contagem, mas não à segunda.
O código 012 pertence às duas.

</details>

### Exemplo 3: números com uma condição na primeira posição

**Pause e tente.** Quantos números de três algarismos diferentes podem
ser escritos com 0, 1, 2, 3 e 4?

<details>
<summary>Ver a solução</summary>

Um número de três algarismos não pode começar com zero. A primeira posição
tem quatro opções: 1, 2, 3 e 4.

Depois dessa escolha, restam quatro algarismos, incluindo o zero. A segunda
posição tem quatro opções. Para a terceira, restam três.

$$
4 \times 4 \times 3 = 48.
$$

A conta não é $5 \times 4 \times 3$: essa contaria os códigos que começam
com zero. Também não é $4 \times 3 \times 2$: essa excluiria o zero de todas
as posições, embora ele seja permitido depois da primeira.

</details>

## Erros comuns

**Usar $n!$ quando só algumas posições são preenchidas.** Nos dois cargos
da abertura, $6! = 720$ ordenaria também as quatro pessoas que ficaram fora.
O resultado pedido é $6 \times 5 = 30$.

**Usar $n^k$ quando a repetição é proibida.** $6^2 = 36$ inclui uma pessoa
ocupando os dois cargos. Há seis desses registros inválidos; restam 30.

**Dividir por $k!$ quando os cargos são diferentes.** Ana responsável e
Bruno suplente não é a mesma distribuição que Bruno responsável e Ana suplente.
A divisão apagaria diferenças que o problema exige contar.

## Perguntas de verificação

1. O que os números $n$ e $k$ representam no arranjo?
2. Por que aparecem $k$ fatores no produto?
3. O que é preciso conferir antes de usar $n^k$?

<details>
<summary>Respostas das verificações</summary>

1. $n$ é a quantidade de elementos disponíveis; $k$ é a quantidade de
   posições distintas a preencher.
2. Cada fator conta as opções de uma posição, e há $k$ posições.
3. Se há $n$ opções em cada posição para todo caminho, se a repetição é
   permitida e se não há outra condição que limite as sequências.

</details>

## Exercícios de domínio

### 1. Reconhecimento

1. Há cinco pessoas e três cargos diferentes. Todos os cargos devem ser
   ocupados por pessoas diferentes. É arranjo simples ou permutação de todas?
2. Um código admite A, B e C em duas posições e aceita AA. A contagem
   corresponde a um arranjo simples ou a uma sequência com repetição?

### 2. Explicação

3. Para dois cargos entre seis pessoas, explique de onde vem o fator 5.

### 3. Aplicação direta

4. Calcule $A_{6,2}$ e $A_{6,3}$.
5. Quantos códigos de quatro posições usam A, B ou C, com repetição permitida?

### 4. Variação

6. Um código de três posições usa algarismos de 0 a 9, sem repetição.
   O zero inicial é permitido. Quantos códigos existem?
7. Quantos números de três algarismos diferentes existem usando 0 a 9?

### 5. Problema misto

8. Uma escala tem três cargos diferentes para cinco pessoas. O turno pode
   ser manhã ou noite. Ninguém ocupa dois cargos. Quantas escalas com turno há?
9. Um código começa com uma letra A, B, C ou D e termina com dois algarismos
   entre 0, 1 e 2. Os algarismos podem se repetir. Quantos códigos há?

### 6. Justificativa

10. Para sete elementos e três posições sem repetição, por que dividimos
    $7!$ por $4!$ e não por $3!$?

<details>
<summary>Dica para os exercícios 6 e 7</summary>

Compare a primeira posição. Em códigos, 0 pode entrar. Em números de três
algarismos, 0 não pode iniciar, mas continua disponível para as outras posições.

</details>

<details>
<summary>Respostas para conferência</summary>

1. Arranjo simples: escolhemos e ordenamos três das cinco pessoas.
2. Sequência com repetição: $3^2 = 9$ códigos.
3. Uma pessoa já ocupa o primeiro cargo. Restam cinco para o segundo.
4. $A_{6,2} = 6 \times 5 = 30$;
   $A_{6,3} = 6 \times 5 \times 4 = 120$.
5. $3^4 = 81$.
6. $10 \times 9 \times 8 = 720$.
7. $9 \times 9 \times 8 = 648$. Se encontrou 720, permitiu zero na
   primeira posição. Depois da primeira escolha não nula, sobram nove opções.
8. $2 \times A_{5,3} = 2 \times 60 = 120$.
9. $4 \times 3 \times 3 = 36$.
10. Os quatro elementos restantes não ocupam as posições pedidas.
    Como $7! = 7 \times 6 \times 5 \times 4!$, dividir por $4!$ deixa
    $7 \times 6 \times 5 = 210$.

</details>

## Revisão curta

Arranjos simples preenchem $k$ posições distintas sem repetir elementos:
$A_{n,k} = \frac{n!}{(n-k)!}$. Se cada posição mantém $n$ opções e repetir
é permitido, contamos $n^k$.

Na [próxima lição](./combinacoes), vamos escolher pessoas sem atribuir cargos.
As ordens do mesmo grupo passarão a representar um único resultado.
