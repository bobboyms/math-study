---
title: Combinações
---

# Combinações

## Problema motivador: uma equipe sem cargos

Há seis pessoas disponíveis: Ana, Bruno, Carla, Diego, Elisa e Fábio.
Precisamos escolher duas para uma equipe. Nenhuma terá cargo diferente:
o resultado é o grupo escolhido.

Na [lição anterior](./arranjos-e-sequencias), encontramos 30 maneiras de
distribuir responsável e suplente. Quantas equipes sem cargos existem?

Ana com Bruno e Bruno com Ana agora representam a mesma escolha.
Precisamos retirar as contagens repetidas sem perder uma equipe.

## Mapa das ideias

- **Combinação simples**: escolha de um grupo sem repetição, sem distinguir a ordem.
- **Contagem duplicada**: registrar o mesmo grupo em diferentes ordens.
- **Tamanho do grupo**: quantidade de elementos escolhidos.
- **Simetria das combinações**: escolher quem entra equivale a determinar quem fica fora.

## Para que serve

Combinações contam comissões, amostras de produtos e grupos de números num
sorteio. Também contam quais posições de uma sequência terão um determinado
tipo de resultado, como os sucessos em várias tentativas.

O critério é o que o problema distingue. Uma lista de nomes pode ser escrita
em alguma ordem mesmo quando o resultado que queremos contar é um grupo.

## Ideias anteriores que voltam aqui

Dos [arranjos](./arranjos-e-sequencias), vem contar escolhas ordenadas.
Das [permutações](./fatorial-e-permutacoes), vem contar as ordens de um grupo
fixo. Da [divisão](../numeros-e-operacoes/operacoes-basicas), vem repartir
registros em grupos do mesmo tamanho.

Reative:

1. Quantas escolhas de dois cargos entre três pessoas há?
   $A_{3,2} = 3 \times 2 = 6$.
2. Quantas ordens têm duas pessoas escolhidas? $2! = 2$: AB e BA.
3. Se seis registros se dividem em pares que representam o mesmo resultado,
   quantos resultados distintos há? $6 \div 2 = 3$.

Essa divisão não elimina grupos. Ela reúne as ordens do mesmo grupo num
único resultado.

## Intuição: agrupar os registros pelo conteúdo

Com A, B, C e D, primeiro escolha dois cargos. Há
$4 \times 3 = 12$ registros. Depois reúna os registros que contêm as mesmas
pessoas:

| Grupo sem cargos | Registros ordenados |
|---|---|
| AB | AB, BA |
| AC | AC, CA |
| AD | AD, DA |
| BC | BC, CB |
| BD | BD, DB |
| CD | CD, DC |

Cada linha contém duas ordens de um grupo. As seis linhas cobrem todos
os 12 registros. Por isso:

$$
\frac{4 \times 3}{2!} = \frac{12}{2} = 6.
$$

O denominador não vem da quantidade de pessoas disponíveis. Vem da
quantidade de ordens que cada grupo gerou.

## Modelo visual: um grupo de três pessoas

Para o grupo fixo A, B e C:

| Primeiro nome | Ordens do mesmo grupo |
|---|---|
| A | ABC, ACB |
| B | BAC, BCA |
| C | CAB, CBA |

São $3! = 6$ ordens, todas com os mesmos três integrantes. Um grupo de
três pessoas distintas sempre tem seis ordens, quaisquer que sejam os nomes.

Logo, ao contar grupos de três por escolhas ordenadas, cada grupo será
contado seis vezes. Não duas nem três.

## Da tabela à fórmula

> Uma **combinação simples de $n$ elementos tomados $k$ a $k$** é um grupo
> de $k$ elementos distintos escolhido entre $n$, sem considerar a ordem.

Escolher duas pessoas para uma equipe sem cargos é um exemplo. Escolher
responsável e suplente é um contraexemplo: as funções distinguem as ordens.
Escolher a mesma pessoa duas vezes também não é uma combinação simples.

O arranjo conta as escolhas ordenadas. Cada grupo escolhido aparece em
$k!$ ordens. Como essa quantidade é igual para todos os grupos, dividimos:

$$
C_{n,k} = \frac{A_{n,k}}{k!}.
$$

Substituir o arranjo pelo quociente de fatoriais que já estudamos dá:

$$
C_{n,k}
= \frac{n!}{k! \times (n-k)!}.
$$

A fórmula vale para inteiros $0 \le k \le n$. Também escrevemos
$\binom{n}{k}$ e lemos “$n$ escolhe $k$”. As duas notações contam a mesma
quantidade: $C_{n,k} = \binom{n}{k}$.

### Os dois denominadores têm funções diferentes

Em $\frac{n!}{k! \times (n-k)!}$:

- dividir por $(n-k)!$ retira as ordens dos elementos que ficaram fora;
- dividir por $k!$ reúne as ordens do mesmo grupo escolhido.

Você pode fazer as duas divisões em etapas. Primeiro conte os arranjos.
Depois divida pelas ordens de cada grupo.

## Volta ao problema motivador

Entre seis pessoas, há $A_{6,2} = 30$ distribuições de dois cargos.
Cada equipe sem cargos aparece em $2! = 2$ registros.

$$
C_{6,2}
= \frac{6 \times 5}{2 \times 1}
= \frac{30}{2}
= 15.
$$

**Resposta ao problema motivador:** existem 15 equipes.
O conjunto de pessoas disponíveis não mudou. A contagem caiu porque
deixamos de distinguir as funções dos dois lugares.

## Conferir pelos elementos que ficaram fora

Entre cinco pessoas, escolher duas para entrar numa equipe determina
exatamente quais três ficam fora. Cada grupo de duas está associado a um
grupo de três, e a associação funciona nos dois sentidos.

| Entram | Ficam fora |
|---|---|
| AB | CDE |
| AC | BDE |
| AD | BCE |
| AE | BCD |

A tabela mostra algumas associações. Não é uma listagem completa.
Não há duas escolhas diferentes de quem entra que deixem o mesmo grupo fora.

> A **simetria das combinações** é a igualdade
> $C_{n,k} = C_{n,n-k}$: contar quem entra ou quem fica fora dá o mesmo total.

Por exemplo, $C_{5,2} = C_{5,3} = 10$.
Essa igualdade não afirma $C_{5,2} = C_{5,1}$: os tamanhos 2 e 1 não
completam as cinco pessoas, e os totais são 10 e 5.

### Nenhum elemento e todos os elementos

Há uma forma de escolher ninguém: o grupo vazio. Por isso, $C_{n,0} = 1$.
Há uma forma de escolher todos: o grupo completo. Por isso, $C_{n,n} = 1$.

Se pedimos mais pessoas que as disponíveis, há zero grupos. A fórmula de
fatoriais acima não deve ser aplicada com $k > n$.

## Exemplos resolvidos

### Exemplo 1: três pessoas entre cinco

Para uma equipe sem cargos, contamos os arranjos e retiramos as seis ordens
de cada grupo de três:

$$
C_{5,3}
= \frac{5 \times 4 \times 3}{3 \times 2 \times 1}
= \frac{60}{6}
= 10.
$$

Dividir por 3 daria 20, que não retira todas as ordens duplicadas.
O grupo ABC, sozinho, aparece nas seis ordens da tabela anterior.

### Exemplo 2: grupos com pessoas de duas áreas

**Pause e tente.** Uma oficina tem quatro pessoas da produção e três do
atendimento. Uma comissão precisa de duas da produção e uma do atendimento.
Não há cargos. Quantas comissões há?

<details>
<summary>Ver a solução</summary>

Escolher duas da produção pode ser feito de $C_{4,2} = 6$ maneiras.
Escolher uma do atendimento pode ser feito de $C_{3,1} = 3$ maneiras.

Cada dupla da produção pode ser acompanhada por qualquer uma das três
pessoas do atendimento. Pelo princípio multiplicativo:

$$
C_{4,2} \times C_{3,1} = 6 \times 3 = 18.
$$

Escolher quaisquer três entre as sete pessoas incluiria comissões sem
a composição exigida. Separar as áreas preserva essa condição.

</details>

### Exemplo 3: escolher uma equipe e atribuir um cargo

**Pause e tente.** Entre seis pessoas, escolhemos uma equipe de três.
Uma das escolhidas será responsável, e as outras duas não têm cargos.
Quantos resultados diferentes existem?

<details>
<summary>Ver a solução</summary>

Primeiro escolhemos a equipe: $C_{6,3} = 20$.
Para cada equipe, há três opções de responsável:

$$
C_{6,3} \times 3 = 20 \times 3 = 60.
$$

Podemos conferir começando pelo cargo: há seis opções de responsável.
Depois escolhemos duas entre as cinco restantes:

$$
6 \times C_{5,2} = 6 \times 10 = 60.
$$

As etapas mudaram de ordem, mas o resultado completo continua sendo
uma responsável acompanhada de duas pessoas sem cargos.

</details>

## Erros comuns

**Usar arranjo para um grupo sem cargos.** Para três pessoas entre cinco,
o arranjo dá 60 registros, mas há 10 grupos. Cada grupo apareceu seis vezes.

**Dividir pela quantidade escolhida em vez de seu fatorial.** Um grupo de
três tem $3! = 6$ ordens, e não três ordens.

**Apagar um cargo que o enunciado distingue.** No exemplo 3, escolher
somente $C_{6,3}$ não decide quem será responsável. Faltam três possibilidades
para cada equipe.

## Perguntas de verificação

1. Por que a divisão por $k!$ é permitida?
2. O que $C_{6,2}$ conta que $A_{6,2}$ não conta da mesma maneira?
3. Por que escolher ninguém produz uma possibilidade?

<details>
<summary>Respostas das verificações</summary>

1. Cada grupo de $k$ elementos distintos aparece exatamente $k!$ vezes.
   Dividir por essa quantidade deixa um registro por grupo.
2. A combinação conta grupos; o arranjo distingue as posições dos mesmos
   integrantes. A equipe Ana–Bruno é uma, mas as distribuições de cargos são duas.
3. O grupo vazio atende ao pedido e é único. Zero possibilidades significaria
   que não há nenhum grupo que atenda ao pedido.

</details>

## Exercícios de domínio

### 1. Reconhecimento

1. Escolher quatro pessoas entre nove para uma comissão sem cargos pede
   combinação ou arranjo? E escolher quatro cargos diferentes?

### 2. Explicação

2. Liste as ordens do grupo A, B e C. Por qual número devemos dividir uma
   contagem ordenada para contar grupos de três?
3. Por que escolher duas pessoas entre sete dá o mesmo total que escolher cinco?

### 3. Aplicação direta

4. Calcule $C_{6,2}$ e $C_{7,3}$.
5. Uma amostra contém três peças distintas dentre oito. A ordem não importa.
   Quantas amostras existem?

### 4. Variação

6. Há oito pessoas, e Ana deve pertencer a uma equipe de três sem cargos.
   Quantas equipes atendem à condição?
7. Quantas equipes de três entre oito não incluem Ana?

### 5. Problema misto

8. Escolha duas pessoas entre cinco da área técnica e duas entre quatro
   da área comercial. Não há cargos. Quantas comissões há?
9. Uma equipe de três é escolhida entre sete pessoas. Uma das três será
   coordenadora. Quantas escolhas de equipe e coordenação há?

### 6. Justificativa

10. Uma pessoa calculou $C_{5,3}$ dividindo $5 \times 4 \times 3$ por 3.
    Explique por que o divisor não retira todas as ordens do mesmo grupo.

<details>
<summary>Dica para os exercícios 6 e 7</summary>

Quando Ana é obrigatória, uma vaga já está ocupada. Quando é proibida,
retire Ana do conjunto disponível antes de escolher o grupo.

</details>

<details>
<summary>Respostas para conferência</summary>

1. Comissão sem cargos: combinação. Quatro cargos diferentes: arranjo.
2. ABC, ACB, BAC, BCA, CAB, CBA. Dividimos por $3! = 6$.
3. Cada dupla escolhida determina as cinco pessoas restantes e vice-versa.
   Assim, $C_{7,2} = C_{7,5} = 21$.
4. $C_{6,2} = 15$;
   $C_{7,3} = \frac{7 \times 6 \times 5}{3 \times 2 \times 1} = 35$.
5. $C_{8,3} = \frac{8 \times 7 \times 6}{3 \times 2 \times 1} = 56$.
6. $C_{7,2} = 21$. Ana ocupa uma vaga; escolhemos duas entre as sete restantes.
7. $C_{7,3} = 35$. Escolhemos as três pessoas entre as sete permitidas.
8. $C_{5,2} \times C_{4,2} = 10 \times 6 = 60$.
9. $C_{7,3} \times 3 = 35 \times 3 = 105$.
10. O grupo ABC tem seis ordens. Dividir por 3 ainda conta cada grupo duas
    vezes. O divisor correto é $3! = 6$, e o resultado é 10.

</details>

## Revisão curta

Quando o resultado é um grupo de elementos distintos, sem cargos e sem
repetição, contamos combinações. Dividir o arranjo por $k!$ retira as ordens
do mesmo grupo: $C_{n,k} = \frac{n!}{k! \times (n-k)!}$.

Na [próxima lição](./permutacoes-com-repeticao), outra troca deixará de criar
um resultado novo: a troca entre elementos iguais numa sequência.
