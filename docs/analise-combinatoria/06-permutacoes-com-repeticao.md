---
title: Permutações com elementos repetidos
---

# Permutações com elementos repetidos

## Problema motivador: uma sequência de testes

Uma planilha registra cinco testes de um produto. Sabemos que houve três
aprovações (A) e duas reprovações (R), mas queremos contar as ordens possíveis.

AAARR e ARARA são registros diferentes. Porém, trocar uma aprovação por
outra aprovação não altera as letras que a planilha mostra.

Quantas sequências de cinco testes contêm exatamente três A e dois R?

## Mapa das ideias

- **Elementos indistinguíveis**: ocorrências cuja troca não altera o registro.
- **Multiplicidade**: quantidade fixa de ocorrências de um tipo de elemento.
- **Permutação com repetição**: ordenação de elementos com multiplicidades fixas.
- **Ordens internas**: trocas entre ocorrências do mesmo tipo.

## Para que serve

Essa contagem aparece em anagramas, sequências de resultados e trajetos
formados por quantidades fixas de movimentos de cada tipo.

Na probabilidade, permite contar as ordens em que podem ocorrer três sucessos
e duas falhas. Esta lição conta as ordens; as chances de cada ordem dependem
do modelo probabilístico.

## Ideias anteriores que voltam aqui

De [permutações simples](./fatorial-e-permutacoes), vem ordenar elementos
distintos. De [combinações](./combinacoes), vem retirar uma repetição uniforme
de registros por meio de uma divisão.

Reative:

1. Três objetos distintos têm quantas ordens? $3! = 6$.
2. O grupo A, B e C tem seis ordens diferentes. Se a ordem não importa,
   quantos grupos essas ordens representam? Um.
3. Quantas maneiras há de escolher duas posições entre três?
   $C_{3,2} = 3$.

Agora vamos manter a ordem da sequência, mas deixar de distinguir ocorrências
iguais de uma letra.

## Intuição: AAB não tem seis ordens visíveis

Comece com duas letras A e uma B. As sequências distintas são:

| Posição da letra B | Sequência |
|---:|---|
| 1ª | BAA |
| 2ª | ABA |
| 3ª | AAB |

Há três sequências. Por que $3! = 6$ conta mais?

Coloque temporariamente etiquetas nos A: $A_1$ e $A_2$. As seis ordens
etiquetadas se agrupam assim:

| Registro sem etiquetas | Ordens com etiquetas |
|---|---|
| AAB | $A_1A_2B$, $A_2A_1B$ |
| ABA | $A_1BA_2$, $A_2BA_1$ |
| BAA | $BA_1A_2$, $BA_2A_1$ |

Em cada linha, trocar $A_1$ e $A_2$ não muda o registro sem etiquetas.
Cada sequência visível apareceu $2! = 2$ vezes. Por isso:

$$
\frac{3!}{2!} = \frac{6}{2} = 3.
$$

O resultado passou de seis ordens etiquetadas a três registros. A divisão
retirou uma diferença que não existe no registro que queremos contar.

## Modelo visual: marcar as posições de cada tipo

Para cinco testes, uma sequência pode ser vista como cinco posições:

| Sequência | 1ª | 2ª | 3ª | 4ª | 5ª | Posições com A |
|---|---|---|---|---|---|---|
| AAARR | A | A | A | R | R | 1, 2, 3 |
| AARAR | A | A | R | A | R | 1, 2, 4 |
| AARRA | A | A | R | R | A | 1, 2, 5 |
| ARAAR | A | R | A | A | R | 1, 3, 4 |

A tabela mostra algumas sequências. Para produzir a lista completa, escolha
cada grupo de três posições entre as cinco. Preencha essas posições com A
e as duas restantes com R.

Cada grupo de posições cria uma sequência, e cada sequência permite recuperar
o grupo de posições com A. Por isso, o total é $C_{5,3} = 10$.

## Por que dividimos por dois fatoriais?

Agora etiquete as cinco ocorrências: $A_1$, $A_2$, $A_3$, $R_1$ e $R_2$.
Como todas as etiquetas são distintas, existem $5! = 120$ ordens.

Para cada sequência visível:

- os três A podem trocar suas etiquetas de $3! = 6$ maneiras;
- os dois R podem trocar suas etiquetas de $2! = 2$ maneiras;
- cada troca dos A pode acompanhar cada troca dos R.

Assim, cada registro aparece $3! \times 2! = 12$ vezes na lista etiquetada.
Dividimos pelo mesmo número para todos os registros:

$$
\frac{5!}{3! \times 2!}
= \frac{120}{6 \times 2}
= \frac{120}{12}
= 10.
$$

**Resposta ao problema motivador:** existem dez sequências.
A contagem concorda com escolher as três posições das aprovações.

## A fórmula para multiplicidades fixas

> Uma **permutação com repetição** ordena $n$ elementos quando há tipos
> indistinguíveis com quantidades fixas $m_1, m_2, \ldots, m_r$.
> Essas quantidades devem somar $n$.

Ordenar três A e dois R é um exemplo. Um código de cinco posições que aceita
A ou R sem fixar quantas vezes cada letra aparece é um contraexemplo:
nesse código, as multiplicidades variam de uma sequência para outra.

Chamamos cada $m_i$ de **multiplicidade** do tipo correspondente. Para AAB,
a multiplicidade de A é 2 e a de B é 1. O comprimento da sequência é 3,
mas isso não significa que a multiplicidade de A seja 3.

Se etiquetarmos tudo, contamos $n!$ ordens. Para cada sequência sem etiquetas,
as trocas internas produzem $m_1! \times m_2! \times \ldots \times m_r!$
registros equivalentes. Logo:

$$
\text{quantidade de sequências}
= \frac{n!}{m_1! \times m_2! \times \ldots \times m_r!}.
$$

As multiplicidades são inteiros positivos para os tipos presentes. Um tipo
ausente pode ser incluído com multiplicidade zero porque $0! = 1$.
Se todos os elementos forem distintos, os denominadores são $1!$ e
a fórmula volta a $n!$.

## Duas perguntas diferentes sobre repetição

Compare:

| Pedido | O que pode variar? | Contagem |
|---|---|---|
| Código de cinco letras A ou R, sem fixar as quantidades | As posições e as quantidades de A e R | $2^5 = 32$ |
| Sequência com três A e dois R | As posições; as quantidades já estão fixadas | $\frac{5!}{3! \times 2!} = 10$ |

A sequência AAAAA pertence à primeira contagem e não à segunda.
AAARR pertence às duas.

“Repetição” não escolhe uma fórmula sozinha. Verifique se o problema fixa
a quantidade de cada tipo ou se permite escolhê-la livremente em cada posição.

## Exemplos resolvidos

### Exemplo 1: anagramas de ARARA

Um **anagrama**, nesta contagem, é qualquer sequência que usa todas as letras
da palavra com as mesmas quantidades. Não precisa formar outra palavra existente.

ARARA contém três A e dois R. Seus anagramas são justamente as dez sequências
do problema motivador. ARRAA é um exemplo; AAAAR é um contraexemplo,
porque mudou as quantidades de A e R.

### Exemplo 2: três tipos de elemento

**Pause e tente.** Quantas sequências diferentes usam todas as letras de
BANANA? Conte a quantidade de cada letra antes de escolher a fórmula.

<details>
<summary>Ver a solução</summary>

São seis letras: três A, dois N e um B. As quantidades somam seis.

$$
\frac{6!}{3! \times 2! \times 1!}
= \frac{720}{6 \times 2 \times 1}
= 60.
$$

Uma conferência por escolhas de posições: escolha três posições para A,
depois duas entre as três restantes para N. A posição que sobra recebe B.

$$
C_{6,3} \times C_{3,2} = 20 \times 3 = 60.
$$

</details>

### Exemplo 3: trajetos numa malha

**Pause e tente.** De um ponto inicial ao destino, um trajeto deve fazer
três movimentos para a direita (D) e dois para cima (C). São permitidas
todas as ordens desses movimentos, sem obstáculos. Quantos trajetos há?

<details>
<summary>Ver a solução</summary>

Cada trajeto corresponde a uma sequência com três D e dois C.
DDDCC e DCDCD são trajetos diferentes.

$$
\frac{5!}{3! \times 2!} = 10.
$$

Todos chegam ao mesmo destino porque usam os mesmos três movimentos para
a direita e dois para cima. Se houvesse um obstáculo, algumas ordens seriam
proibidas e precisaríamos recontar as sequências válidas.

</details>

## Erros comuns

**Contar como distintos elementos que o registro não distingue.**
Para AAB, $3! = 6$ conta as etiquetas dos A. Sem etiquetas, há três sequências.

**Dividir pelas multiplicidades sem fatorial.** Com quatro A e dois B,
as trocas internas dos A são $4!$, não quatro. A divisão correta é
$\frac{6!}{4! \times 2!} = 15$.

**Usar potência quando as quantidades estão fixadas.** $2^5 = 32$ inclui
sequências com zero, um, dois, três, quatro ou cinco A. Não conta somente
as sequências com três A.

## Perguntas de verificação

1. Por que duas aprovações podem ser tratadas como indistinguíveis?
2. Por que multiplicamos os fatoriais do denominador?
3. Como combinações podem conferir uma sequência com dois tipos?

<details>
<summary>Respostas das verificações</summary>

1. O registro contém A, sem identificar uma aprovação como diferente da outra.
   Se o registro contivesse identidades distintas, a contagem mudaria.
2. Cada ordem interna de um tipo pode acompanhar cada ordem interna dos outros.
   O princípio multiplicativo conta essas combinações de etiquetas.
3. Escolhemos as posições de um tipo. As posições restantes ficam determinadas
   para o outro tipo, produzindo uma sequência por grupo de posições escolhido.

</details>

## Exercícios de domínio

### 1. Reconhecimento

1. Quantas letras A, R e D há em RADAR? Elas são todas distintas?
2. Um código de quatro posições usa A e B livremente. Essa contagem fixa
   duas ocorrências de cada letra? Explique.

### 2. Explicação

3. Por que trocar os dois A de AAB não cria outro registro visível?

### 3. Aplicação direta

4. Liste todas as sequências de AAB e confira pela fórmula.
5. Quantos anagramas, incluindo a própria palavra, tem RADAR?

### 4. Variação

6. Quantas sequências contêm exatamente quatro A e dois B?
7. Quantas sequências contêm duas ocorrências de cada letra A, B e C?

### 5. Problema misto

8. Um trajeto sem obstáculos exige quatro movimentos para a direita e
   três para cima, em qualquer ordem. Quantos trajetos existem?
9. Uma sequência tem seis posições, exatamente duas ocupadas por R e quatro
   por A. Conte usando permutação com repetição e usando combinação de posições.

### 6. Justificativa

10. Por que $2^6$ não responde ao exercício 9? Dê uma sequência que a potência
    conta, mas o exercício não permite.

<details>
<summary>Dica para o exercício 7</summary>

Etiquete as seis ocorrências para contar todas as ordens. Depois conte
quantas trocas de etiquetas dos A, dos B e dos C deixam o registro igual.

</details>

<details>
<summary>Respostas para conferência</summary>

1. Dois A, dois R e um D. A e R têm ocorrências indistinguíveis no registro.
2. Não. O código permite de zero a quatro A. “Livremente” não fixa dois A e dois B.
3. As duas ocorrências aparecem como a mesma letra A. O conteúdo das posições não muda.
4. AAB, ABA e BAA: $\frac{3!}{2! \times 1!} = 3$.
5. $\frac{5!}{2! \times 2! \times 1!} = 30$.
6. $\frac{6!}{4! \times 2!} = 15$.
7. $\frac{6!}{2! \times 2! \times 2!} = 90$.
8. $\frac{7!}{4! \times 3!} = 35$.
9. $\frac{6!}{2! \times 4!} = 15$ e $C_{6,2} = 15$.
   Escolher as duas posições com R determina as quatro com A.
10. $2^6 = 64$ permite qualquer quantidade de A e R. AAAAAA, por exemplo,
    não contém as duas reprovações exigidas. Se encontrou 64, ignorou
    as multiplicidades fixadas.

</details>

## Revisão curta

Com multiplicidades fixas, etiquetar tudo produz $n!$ ordens. Dividir pelas
trocas internas de cada tipo deixa uma contagem dos registros distintos.
Para dois tipos, escolher as posições de um deles dá a mesma resposta.

Na [próxima lição](./restricoes-casos-e-complemento), vamos incluir condições
que impedem algumas ordens ou exigem determinados elementos.
