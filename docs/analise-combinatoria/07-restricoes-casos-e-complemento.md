---
title: Restrições, casos e complemento
---

# Restrições, casos e complemento

## Problema motivador: presença de uma pessoa experiente

Uma oficina tem seis pessoas disponíveis. Ana e Bruno são as duas pessoas
experientes. Precisamos escolher uma equipe de duas, sem cargos, que inclua
pelo menos uma pessoa experiente.

Quantas equipes atendem à condição? “Pelo menos uma” permite Ana, Bruno ou
ambos. É necessário contar a equipe Ana–Bruno uma vez.

## Mapa das ideias

- **Restrição**: condição que exclui parte dos resultados possíveis.
- **Divisão em casos**: separar resultados em grupos que podemos contar.
- **Complemento**: resultados do universo que não atendem à condição considerada.
- **Bloco**: tratar elementos que devem ficar juntos como uma unidade temporária.
- **União e interseção**: reunir dois grupos de resultados ou contar o que têm em comum.

## Para que serve

Essas estratégias ajudam quando uma fórmula isolada inclui resultados proibidos.
São úteis para códigos, seleção de equipes, disposição de objetos e perguntas
de probabilidade com “nenhum”, “pelo menos” e condições simultâneas.

## Ideias anteriores que voltam aqui

De [combinações](./combinacoes), vem escolher equipes sem cargos.
De [permutações](./fatorial-e-permutacoes), vem ordenar filas.
Dos [princípios de contagem](./principios-de-contagem), vêm somar casos
disjuntos e multiplicar escolhas em etapas.

Reative:

1. Quantas duplas há entre seis pessoas? $C_{6,2} = 15$.
2. Quantas duplas há entre quatro pessoas? $C_{4,2} = 6$.
3. Se 15 resultados se dividem em seis proibidos e nos restantes permitidos,
   quantos são permitidos? $15 - 6 = 9$.

A terceira conta vai resolver a abertura. Precisamos mostrar por que o grupo
proibido tem exatamente seis equipes.

## Intuição: classificar por uma quantidade que não se sobrepõe

Uma dupla pode conter zero, uma ou duas pessoas experientes. Essas categorias
não se sobrepõem: uma dupla não pode ter exatamente uma e exatamente duas
pessoas experientes ao mesmo tempo.

| Pessoas experientes na dupla | Como escolher | Equipes |
|---:|---|---:|
| Nenhuma | Duas entre as quatro restantes | $C_{4,2} = 6$ |
| Exatamente uma | Uma entre Ana e Bruno, outra entre as quatro restantes | $2 \times 4 = 8$ |
| Duas | Ana e Bruno | 1 |
| Total | Todos os casos | $6 + 8 + 1 = 15$ |

A tabela permite duas contagens para “pelo menos uma”:

- somar exatamente uma e duas: $8 + 1 = 9$;
- retirar nenhuma do total: $15 - 6 = 9$.

**Resposta ao problema motivador:** existem nove equipes.
Os caminhos concordam porque dividem as mesmas 15 equipes de maneiras compatíveis.

## O universo e o complemento

> O **universo da contagem** é o conjunto de todos os resultados considerados
> antes de aplicar a condição que queremos estudar.

Na abertura, são todas as duplas entre as seis pessoas. Filas das seis
pessoas não pertencem a esse universo: são outro tipo de resultado.

> O **complemento** de uma condição contém os resultados do universo que
> não atendem a essa condição.

O complemento de “pelo menos uma experiente” é “nenhuma experiente”.
“Exatamente uma experiente” não é o complemento: deixa de incluir a equipe
com duas experientes, que também atende à condição original.

Chame o universo de $U$, o grupo desejado de $E$ e seu complemento de $E^c$.
Escreva $n(U)$ para a quantidade de elementos de $U$; a letra $n$ aqui
indica uma contagem. Todo resultado está em exatamente um dos dois grupos:

$$
n(U) = n(E) + n(E^c).
$$

Subtrair $n(E^c)$ dos dois lados permite contar o grupo desejado:

$$
n(E) = n(U) - n(E^c).
$$

Se o grupo oposto for menor ou mais fácil de descrever, o complemento reduz
o trabalho. O universo precisa continuar sendo o mesmo nas duas contagens.

## “Exatamente”, “pelo menos” e “no máximo”

Para uma dupla, a quantidade de pessoas experientes pode ser 0, 1 ou 2.

| Condição | Quantidades aceitas | Complemento no mesmo universo |
|---|---|---|
| Exatamente uma | 1 | 0 ou 2 |
| Pelo menos uma | 1 ou 2 | 0 |
| No máximo uma | 0 ou 1 | 2 |

> **Exatamente $r$** aceita somente $r$. **Pelo menos $r$** aceita $r$ ou
> mais. **No máximo $r$** aceita $r$ ou menos.

Uma equipe com duas experientes atende a “pelo menos uma”, mas é um
contraexemplo de “exatamente uma” e de “no máximo uma”.

Escrever as quantidades aceitas antes de calcular evita trocar uma pergunta
pela outra.

## Quando dois casos compartilham resultados

Outra tentativa para a abertura seria contar as equipes com Ana e as equipes
com Bruno. Há cinco com Ana e cinco com Bruno. Mas a equipe Ana–Bruno aparece
nas duas listas.

| Tipo de equipe | Contada na lista de Ana? | Contada na lista de Bruno? |
|---|---|---|
| Ana com uma das quatro restantes | Sim | Não |
| Bruno com uma das quatro restantes | Não | Sim |
| Ana com Bruno | Sim | Sim |

A soma $5 + 5 = 10$ registra Ana–Bruno duas vezes. Subtrair uma ocorrência
devolve a contagem correta: $5 + 5 - 1 = 9$.

> A **união** de dois conjuntos reúne os elementos que pertencem a pelo
> menos um deles. A **interseção** contém os elementos comuns aos dois.

Se uma lista contém Ana e Bruno, e outra Bruno e Carla, a união contém
Ana, Bruno e Carla. A interseção contém Bruno. Ana é um exemplo de elemento
da união e um contraexemplo de elemento da interseção.

Para conjuntos finitos $E$ e $F$, escrevemos $E \cup F$ para a união e
$E \cap F$ para a interseção. A soma conta a interseção duas vezes.
Queremos contá-la uma vez, por isso subtraímos uma de suas contagens:

$$
n(E \cup F) = n(E) + n(F) - n(E \cap F).
$$

Essa correção é chamada **princípio da inclusão e exclusão**, aqui aplicado
a dois conjuntos. As quantidades devem se referir a elementos do mesmo universo.
Se a interseção for vazia, sua quantidade é zero e voltamos ao princípio aditivo.

## Restrições de posição: preencher primeiro o lugar limitado

Suponha que Ana deva ficar na primeira posição de uma fila de cinco pessoas.
Fixe Ana. Depois ordene as quatro restantes: $4! = 24$ filas.

Não é necessário percorrer todas as $5! = 120$ filas para procurar as válidas.
Preencher a posição limitada primeiro evita incluir as proibidas.

Outra condição: formar números pares de três algarismos distintos com
0, 1, 2, 3 e 4. O último algarismo deve ser 0, 2 ou 4.

| Último algarismo | Opções do primeiro | Opções do segundo | Quantidade |
|---|---:|---:|---:|
| 0 | 4 não nulas | 3 restantes | $4 \times 3 = 12$ |
| 2 ou 4 | 3 não nulas, excluindo a última | 3 restantes, incluindo 0 | $2 \times 3 \times 3 = 18$ |

O total é $12 + 18 = 30$ números. Separar o caso “termina em 0” é
necessário porque ele muda a quantidade de primeiras posições disponíveis.

## Elementos juntos: contar um bloco e suas ordens internas

Cinco pessoas distintas vão formar uma fila. Ana e Bruno devem ficar juntos,
em qualquer ordem.

Trate o par como uma unidade temporária, um **bloco**. Agora temos quatro
unidades: o bloco e as outras três pessoas. Elas podem ser ordenadas de
$4! = 24$ maneiras. Dentro do bloco, há duas ordens: AB e BA.

$$
4! \times 2! = 24 \times 2 = 48.
$$

> Contar por **blocos** é reunir elementos que devem ocupar posições
> consecutivas, ordenar as unidades formadas e depois contar as ordens internas.

Uma fila em que Ana e Bruno estão lado a lado é um exemplo. Uma fila em que
Ana apenas deve vir antes de Bruno é um contraexemplo: eles podem estar separados.

Se a condição for “Ana e Bruno não podem ficar juntos”, use o complemento
dentro das filas das cinco pessoas:

$$
5! - 4! \times 2! = 120 - 48 = 72.
$$

O complemento retira somente as filas com os dois juntos.

## Exemplos resolvidos

### Exemplo 1: pelo menos um zero num código

Um código tem três posições, com algarismos entre 0, 1 e 2.
A repetição e o zero inicial são permitidos. Quantos códigos contêm pelo
menos um zero?

O total é $3^3 = 27$. Sem nenhum zero, cada posição permite 1 ou 2:
$2^3 = 8$. Retiramos esse complemento:

$$
3^3 - 2^3 = 27 - 8 = 19.
$$

Contar por “zero na primeira ou na segunda ou na terceira” exige corrigir
sobreposições: 000, por exemplo, pertence às três condições.

### Exemplo 2: exatamente duas pessoas de uma área

**Pause e tente.** Há cinco pessoas da área técnica e quatro da comercial.
Escolha uma equipe de três, sem cargos, com exatamente duas da técnica.

<details>
<summary>Ver a solução</summary>

Escolhemos duas entre cinco técnicas e uma entre quatro comerciais:

$$
C_{5,2} \times C_{4,1} = 10 \times 4 = 40.
$$

Uma equipe só de pessoas técnicas não atende a “exatamente duas”.
Ela atenderia a “pelo menos duas”, que é outro pedido.

</details>

### Exemplo 3: equipes com pelo menos duas pessoas técnicas

**Pause e tente.** Na situação anterior, mude a condição para pelo menos
duas pessoas técnicas. Quantas equipes há?

<details>
<summary>Dica</summary>

Uma equipe de três com pelo menos duas técnicas pode ter exatamente duas
ou exatamente três. Esses casos não compartilham equipes.

</details>

<details>
<summary>Ver a solução</summary>

Exatamente duas técnicas: 40 equipes, contadas no exemplo anterior.
Exatamente três técnicas: $C_{5,3} = 10$ equipes.

$$
40 + 10 = 50.
$$

A mudança de “exatamente” para “pelo menos” acrescentou dez equipes.

</details>

## Erros comuns

**Somar “tem Ana” e “tem Bruno” sem corrigir.** Ana–Bruno pertence aos
dois casos. A soma dá 10; a contagem correta da abertura é 9.

**Subtrair resultados de outro universo.** Se o total conta códigos com
repetição, o complemento também precisa contar códigos com repetição.
Alterar essa regra no meio da conta deixa de dividir o mesmo conjunto.

**Contar o bloco e esquecer sua ordem interna.** Nas filas com Ana e Bruno
juntos, $4!$ conta posições do bloco. Multiplicar por $2!$ distingue AB de BA.

## Perguntas de verificação

1. Por que os casos “exatamente uma” e “exatamente duas” podem ser somados?
2. Por que o complemento de “pelo menos uma” é “nenhuma”?
3. Por que subtraímos a interseção uma vez na união?

<details>
<summary>Respostas das verificações</summary>

1. Uma equipe tem uma única quantidade de pessoas experientes.
   Portanto, não pode pertencer aos dois casos ao mesmo tempo.
2. No mesmo universo, não ter uma ou mais significa ter zero.
3. A soma já a contou duas vezes. Subtrair uma ocorrência deixa uma,
   como para os elementos que pertencem somente a um dos conjuntos.

</details>

## Exercícios de domínio

### 1. Reconhecimento

1. Uma equipe tem três pessoas. Quais quantidades de pessoas experientes
   atendem a “pelo menos duas”? E a “no máximo duas”?

### 2. Explicação

2. Qual é o complemento de “um código contém pelo menos um zero”?
3. Por que “tem Ana” e “tem Bruno” não são casos disjuntos para equipes de duas?

### 3. Aplicação direta

4. Um código de quatro posições usa A ou B livremente. Quantos contêm
   pelo menos um A?
5. Entre sete pessoas, uma equipe de três deve incluir Ana. Quantas equipes há?

### 4. Variação

6. Cinco pessoas formam uma fila. Ana e Bruno devem ficar juntos. Conte as
   filas. Depois conte as filas em que eles não ficam juntos.
7. Forme números pares de três algarismos diferentes com 0, 1, 2, 3 e 4.
   Quantos existem?

### 5. Problema misto

8. Entre seis pessoas, Ana e Bruno são experientes. Conte as equipes de
   três sem cargos que incluem pelo menos uma delas.
9. Uma empresa tem 20 funcionários. Há 12 que usam a ferramenta X, nove
   que usam Y e cinco que usam ambas. Quantos usam pelo menos uma?
   Quantos não usam nenhuma?

### 6. Justificativa

10. Alguém contou as equipes do exercício 8 somando as equipes com Ana
    às equipes com Bruno. Que grupo foi contado duas vezes e como corrigi-lo?

<details>
<summary>Dica para o exercício 8</summary>

Conte todas as equipes de três. O complemento escolhe três pessoas entre
as quatro que não são Ana nem Bruno.

</details>

<details>
<summary>Respostas para conferência</summary>

1. Pelo menos duas: 2 ou 3. No máximo duas: 0, 1 ou 2.
2. O código não contém nenhum zero. Não é “contém exatamente um zero”.
3. A equipe Ana–Bruno contém ambos e pertence aos dois casos.
4. $2^4 - 1 = 16 - 1 = 15$. O único código sem A é BBBB.
5. $C_{6,2} = 15$. Ana ocupa uma vaga; escolhemos duas entre as seis restantes.
6. Juntos: $4! \times 2! = 48$. Separados: $5! - 48 = 72$.
7. $4 \times 3 + 2 \times 3 \times 3 = 12 + 18 = 30$.
   Se encontrou 36, usou quatro opções para o primeiro algarismo em todos
   os casos. Quando o último é 2 ou 4, um dos algarismos não nulos já foi usado.
8. $C_{6,3} - C_{4,3} = 20 - 4 = 16$ equipes.
9. $12 + 9 - 5 = 16$ usam pelo menos uma; $20 - 16 = 4$ não usam nenhuma.
10. Equipes com Ana e Bruno juntos. Há quatro, uma para cada terceira pessoa.
    A correção é $C_{5,2} + C_{5,2} - 4 = 10 + 10 - 4 = 16$.

</details>

## Revisão curta

Uma restrição pede uma descrição cuidadosa dos resultados válidos.
Preencha primeiro posições limitadas, conte blocos com suas ordens internas,
some casos disjuntos ou retire o complemento. Se casos se sobrepõem,
corrija a contagem dos resultados compartilhados.

Na [próxima lição](./binomio-de-newton), contar posições vai explicar os
coeficientes que aparecem ao desenvolver potências de uma soma.
