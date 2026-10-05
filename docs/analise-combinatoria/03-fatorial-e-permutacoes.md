---
title: Fatorial e permutações
---

# Fatorial e permutações

## Problema motivador: ordem das apresentações

Uma equipe tem seis pessoas: Ana, Bruno, Carla, Diego, Elisa e Fábio.
Cada uma fará uma apresentação. Todas devem apresentar uma vez, e os seis
horários são distintos.

Quantas ordens de apresentação existem? Listar cada ordem seria um trabalho
grande. Mas podemos contar uma posição de cada vez.

## Mapa das ideias

- **Permutação simples**: uma ordenação de todos os elementos distintos.
- **Fatorial**: escrita compacta do produto dos inteiros de 1 até uma quantidade.
- **Posição**: lugar que um elemento ocupa na ordem.
- **Permutação circular**: ordenação ao redor de um círculo, identificando rotações.

## Para que serve

Permutações contam filas, ordens de atendimento e agendas em que todos participam.
O fatorial também aparecerá ao escolher alguns elementos e ao retirar ordens
duplicadas da contagem de grupos.

## Ideias anteriores que voltam aqui

Do [princípio multiplicativo](./principios-de-contagem), vem contar escolhas
por etapas. Da [listagem](./listagem-e-arvore-de-possibilidades), vem a pergunta
sobre ordem e repetição.

Reative:

1. Se há três pessoas para o primeiro cargo e duas para o segundo, quantas
   distribuições há? $3 \times 2 = 6$.
2. Depois de usar duas pessoas entre três, quantas sobram? Uma.
3. AB e BA representam a mesma fila? Não. Cada pessoa ocupa outra posição.

Uma fila de três pessoas vai repetir essa lógica, acrescentando a terceira posição.

## Intuição: cada escolha retira uma opção

Comece com três pessoas, A, B e C. Depois de escolher a primeira, ficam duas
para a segunda. Depois de escolher a segunda, sobra uma para a terceira.

| Primeiro nome | Ordens possíveis |
|---|---|
| A | ABC, ACB |
| B | BAC, BCA |
| C | CAB, CBA |

São três grupos de duas ordens. Contando as posições:

$$
3 \times 2 \times 1 = 6.
$$

O fator 1 não acrescenta alternativas, mas mostra que a última posição também
foi preenchida. Nenhuma pessoa ficou fora.

## Modelo visual: as posições disponíveis

Para as seis pessoas da abertura:

| Posição | 1ª | 2ª | 3ª | 4ª | 5ª | 6ª |
|---|---:|---:|---:|---:|---:|---:|
| Pessoas ainda disponíveis | 6 | 5 | 4 | 3 | 2 | 1 |

Cada número descreve quantas escolhas existem para aquela posição, qualquer
que tenha sido a identidade das pessoas anteriores.

Multiplicamos porque cada escolha inicial pode ser seguida por todas as
escolhas ainda disponíveis nas posições seguintes:

$$
6 \times 5 \times 4 \times 3 \times 2 \times 1 = 720.
$$

**Resposta ao problema motivador:** há 720 ordens de apresentação.

## Do produto ao fatorial

Escrever todos os fatores ocupa espaço. Vamos dar um nome a esse produto.

> Para um inteiro $n \ge 1$, o **fatorial de $n$**, escrito $n!$, é o produto
> dos inteiros positivos de 1 até $n$.

Assim, $4! = 4 \times 3 \times 2 \times 1 = 24$.
Já $4 \times 3 = 12$ não é $4!$: faltam os fatores 2 e 1.
O ponto de exclamação é parte da notação matemática.

| $n$ | Produto | $n!$ |
|---:|---|---:|
| 1 | $1$ | 1 |
| 2 | $2 \times 1$ | 2 |
| 3 | $3 \times 2 \times 1$ | 6 |
| 4 | $4 \times 3 \times 2 \times 1$ | 24 |
| 5 | $5 \times 4 \times 3 \times 2 \times 1$ | 120 |
| 6 | $6 \times 5 \times 4 \times 3 \times 2 \times 1$ | 720 |

Aumentar uma unidade no número de elementos cria um novo fator.
Por exemplo, $5! = 5 \times 4!$. Para $n \ge 1$, escrevemos:

$$
n! = n \times (n-1)!.
$$

Essa igualdade também orienta a definição de $0!$.

### Por que $0! = 1$?

Há uma maneira de ordenar um único objeto: colocá-lo na única posição.
Por isso, $1! = 1$.

Para manter $1! = 1 \times 0!$, o valor de $0!$ deve ser 1.
Na contagem, a interpretação concorda: há uma única lista sem objetos,
a lista vazia. Não existe outra ordem vazia para diferenciar dela.

> Definimos $0! = 1$. Esse valor conta uma maneira de não colocar elemento algum.

Não confunda “nenhum elemento” com “nenhuma possibilidade”. Não escolher
elementos produz o grupo vazio. Pedir uma pessoa quando não há nenhuma
disponível produz zero possibilidades.

## A fórmula das permutações simples

> Uma **permutação simples** é uma ordenação de todos os $n$ elementos
> distintos, usando cada um uma vez. Sua quantidade é $P_n = n!$.

ABC é uma permutação de A, B e C. AB não é, pois falta C.
AAB também não é: repete A e deixa C de fora.

As condições da fórmula são parte dela: todos os elementos, distintos,
sem repetir, com ordem. Se dois elementos forem indistinguíveis, a troca
entre eles exige outro cuidado, estudado na [lição de elementos repetidos](./permutacoes-com-repeticao).

## Dividir fatoriais sem calcular números grandes

O fatorial contém os produtos anteriores. Isso permite reescrever uma fração
sem calcular dois números enormes.

Pela definição, $6! = 6 \times 5 \times 4!$. Portanto:

$$
\frac{6!}{4!}
= \frac{6 \times 5 \times 4!}{4!}
= 6 \times 5
= 30.
$$

O fator $4!$ do numerador é igual ao denominador e é diferente de zero.
Dividir $4!$ por ele mesmo produz 1, como na
[simplificação de frações](../numeros-e-operacoes/fracoes).
A quantidade continua sendo 30; mudou a escrita da conta.

Não escreva $\frac{6!}{4!} = (6-4)!$. A divisão retirou fatores iguais,
não subtraiu as quantidades dentro dos fatoriais. Aqui $(6-4)! = 2$,
que é diferente de 30.

## Exemplos resolvidos

### Exemplo 1: ordenar pastas distintas

Cinco pastas distintas ocupam uma prateleira. Cada pasta aparece uma vez.
Uma ordem da esquerda para a direita é um resultado.

$$
P_5 = 5! = 5 \times 4 \times 3 \times 2 \times 1 = 120.
$$

Se alguém perguntar somente quais pastas ficam na prateleira, sem distinguir
posições, há um conjunto: as cinco pastas. A pergunta sobre ordem cria as
120 possibilidades.

### Exemplo 2: uma posição fixada

**Pause e tente.** Quatro pessoas vão apresentar. Ana deve ser a primeira.
Quantas ordens há?

<details>
<summary>Ver a solução</summary>

A primeira posição tem uma opção: Ana. As outras três pessoas podem ocupar
as posições restantes em qualquer ordem.

$$
1 \times 3 \times 2 \times 1 = 3! = 6.
$$

Contar $4!$ incluiria ordens em que Ana não está na primeira posição.

</details>

### Exemplo 3: comparação de duas quantidades

**Pause e tente.** Quanto vale $\frac{7!}{5!}$? Expanda somente o necessário.

<details>
<summary>Ver a solução</summary>

$$
\frac{7!}{5!}
= \frac{7 \times 6 \times 5!}{5!}
= 7 \times 6
= 42.
$$

Podemos conferir com $7! = 5\,040$ e $5! = 120$: a divisão também dá 42.

</details>

## Uma extensão: ordens ao redor de uma mesa

Imagine quatro pessoas ao redor de uma mesa redonda. Não há cadeira numerada,
e girar todos juntos não cria outra disposição. Mas inverter a direção da
ordem cria outra disposição.

| Registros, lidos no sentido horário | Mesma disposição? |
|---|---|
| ABCD, BCDA, CDAB, DABC | Sim: somente o ponto de início mudou |
| ABCD e ADCB | Não: os vizinhos à direita e à esquerda foram trocados |

Cada disposição circular tem quatro registros lineares, um para cada pessoa
que pode iniciar a leitura. Por isso:

$$
\frac{4!}{4} = 3! = 6.
$$

Outro caminho é fixar A como referência e ordenar B, C e D em volta dela.
Há $3! = 6$ possibilidades.

> Na **permutação circular** de $n \ge 1$ elementos distintos, rotações
> representam o mesmo resultado. Se reflexões continuarem distintas, há
> $(n-1)!$ disposições.

A mesa sem lugares marcados é um exemplo. Uma mesa com cadeiras numeradas
é um contraexemplo: mudar de cadeira muda o resultado, e contamos $n!$.
Objetos que também identificam reflexões, como certos colares, pedem outra
análise. A fórmula acima não decide essa condição sozinha.

## Erros comuns

**Trocar fatorial por potência.** $4! = 24$, mas $4^4 = 256$.
A potência permite quatro opções em todas as posições, incluindo repetição.
O fatorial retira um elemento disponível a cada posição.

**Usar a fórmula sem conferir se todos entram.** Escolher dois cargos entre
seis pessoas não ordena as seis. A contagem para esse caso vem na próxima lição.

**Esquecer se o lugar é marcado.** Uma mesa redonda com cadeiras numeradas
não permite identificar todas as rotações como um mesmo resultado.

## Perguntas de verificação

1. De onde vem a diminuição dos fatores em $5!$?
2. Por que o último fator é 1 e não 0?
3. Por que dividir $6!$ por $4!$ não dá $2!$?

<details>
<summary>Respostas das verificações</summary>

1. Cada objeto usado deixa de estar disponível para a próxima posição.
2. Para a última posição sobra um objeto. Não há uma posição extra a preencher.
3. Expandimos $6!$ até aparecer o fator $4!$. A divisão elimina esse fator
   comum e deixa $6 \times 5$, não um fatorial da diferença.

</details>

## Exercícios de domínio

### 1. Reconhecimento

1. Para as letras A, B e C, quais registros são permutações simples:
   ABC, ACB, AB e AAC?

### 2. Explicação

2. Por que a segunda posição de uma fila de cinco pessoas tem quatro opções?
3. Explique por que $0! = 1$ não afirma que $0 = 1$.

### 3. Aplicação direta

4. Calcule $3!$, $4!$ e $5!$.
5. Quantas ordens de apresentação existem para seis pessoas distintas?

### 4. Variação

6. Cinco pessoas devem se apresentar, mas Bruno deve ser o último. Quantas
   ordens existem?
7. Calcule $\frac{8!}{6!}$ expandindo até aparecer um fator comum.

### 5. Problema misto

8. Quatro pessoas vão fazer apresentações em uma de duas salas. Todas
   apresentam na mesma sala, em sequência. Quantas escolhas de sala e ordem há?
9. Cinco pessoas se sentam numa mesa redonda sem lugares marcados. Rotações
   são iguais; reflexões são diferentes. Quantas disposições há?

### 6. Justificativa

10. Uma pessoa usou $4^4$ para ordenar quatro pastas distintas uma vez cada.
    Dê um resultado contado pela potência que não atende ao enunciado.

<details>
<summary>Dica para o exercício 9</summary>

Fixe uma pessoa como referência e conte as ordens das demais em volta dela.
Não fixe todas as cadeiras: o enunciado não distingue uma cadeira inicial.

</details>

<details>
<summary>Respostas para conferência</summary>

1. ABC e ACB. AB está incompleto; AAC repete A e omite B.
2. Uma pessoa já foi usada. Restam quatro pessoas disponíveis.
3. $0!$ é uma notação para uma contagem, e recebe o valor 1. É diferente do
   número 0 sem fatorial. Há uma lista vazia.
4. $3! = 6$, $4! = 24$, $5! = 120$.
5. $6! = 720$.
6. $4! = 24$. Bruno está fixado; as quatro pessoas restantes podem se ordenar.
7. $\frac{8!}{6!} = 8 \times 7 = 56$.
8. $2 \times 4! = 2 \times 24 = 48$ escolhas.
9. $(5-1)! = 4! = 24$ disposições. Se encontrou 120, diferenciou rotações.
10. AAAA, se A for uma das pastas. A potência permite repeti-la nas quatro
    posições e deixar outras pastas fora. A contagem válida é $4! = 24$.

</details>

## Revisão curta

Permutar é ordenar todos os elementos. Quando eles são distintos e usados
uma vez, contamos $n!$. A fórmula vem do princípio multiplicativo, com uma
opção a menos a cada posição ocupada.

Na [próxima lição](./arranjos-e-sequencias), vamos interromper esse produto
depois de preencher somente algumas posições.
