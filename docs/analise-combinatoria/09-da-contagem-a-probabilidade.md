---
title: Da contagem à probabilidade
---

# Da contagem à probabilidade

## Problema motivador: uma equipe escolhida por sorteio

Entre seis pessoas, Ana e Bruno são experientes. Uma equipe de três será
sorteada, sem cargos. O procedimento dá a mesma chance a cada equipe possível.

Qual é a probabilidade de a equipe conter pelo menos uma pessoa experiente?

Na lição de [restrições](./restricoes-casos-e-complemento), contamos equipes
desse tipo. Agora precisamos comparar o grupo favorável com o total e conferir
por que essa comparação descreve uma chance.

## Mapa das ideias

- **Experimento aleatório**: procedimento cujo resultado não conhecemos de antemão.
- **Espaço amostral**: conjunto dos resultados possíveis do experimento.
- **Evento**: grupo de resultados que atende à condição considerada.
- **Resultados equiprováveis**: resultados que têm a mesma probabilidade.
- **Probabilidade por contagem**: fração entre resultados favoráveis e o total,
  quando os resultados são equiprováveis.

## Para que serve

A contagem permite calcular chances em sorteios, códigos escolhidos ao acaso
e sequências de resultados. Também ajuda a reconhecer quando um modelo não
descreve o experimento: contar nomes de categorias pode ser diferente de
contar resultados com a mesma chance.

Esta lição fecha o capítulo de combinatória. Um estudo posterior de
probabilidade vai desenvolver probabilidade condicional, independência e
modelos em que os resultados não têm chances iguais.

## Ideias anteriores que voltam aqui

De [combinações](./combinacoes), vem contar equipes sem cargos.
De [complemento](./restricoes-casos-e-complemento), vem contar “pelo menos
uma” retirando “nenhuma”. De [frações](../numeros-e-operacoes/fracoes),
vem comparar uma parte com o total. De
[porcentagens](../numeros-e-operacoes/decimais-e-porcentagem), vem escrever
a mesma razão por cem.

Reative:

1. Quantas equipes de três há entre seis? $C_{6,3} = 20$.
2. Sem Ana e Bruno, quantas pessoas sobram? Quatro, que formam
   $C_{4,3} = 4$ equipes de três.
3. Que fração corresponde a 16 resultados entre 20?
   $\frac{16}{20} = \frac{4}{5} = 0{,}8 = 80\%$.

Os números já estão prontos. Vamos explicar por que esses 20 resultados
podem servir como unidades iguais de probabilidade.

## Intuição: uma chance igual para cada equipe

Se cada uma das 20 equipes tiver a mesma chance, o total de probabilidade
fica dividido em 20 partes iguais. Uma equipe recebe $\frac{1}{20}$.

Se 16 dessas equipes atendem ao pedido, reunimos 16 partes iguais:

$$
16 \times \frac{1}{20} = \frac{16}{20}.
$$

Essa conta usa a condição da abertura: o sorteio favorece cada equipe
da mesma maneira. Se algumas equipes recebessem mais chance, 16 equipes
não representariam necessariamente 16 partes iguais.

## Modelo visual: separar as equipes pelo evento

| Pessoas experientes na equipe | Contagem | Favorável a “pelo menos uma”? |
|---:|---|---|
| Nenhuma | $C_{4,3} = 4$ | Não |
| Exatamente uma | $C_{2,1} \times C_{4,2} = 2 \times 6 = 12$ | Sim |
| Duas | $C_{2,2} \times C_{4,1} = 1 \times 4 = 4$ | Sim |
| Total | $4 + 12 + 4 = 20$ | 16 favoráveis |

Os grupos da tabela não se sobrepõem. As 16 equipes favoráveis também podem
ser contadas pelo complemento: $20 - 4 = 16$.

## Espaço amostral e evento

> Um **experimento aleatório** é um procedimento cujo resultado não
> conhecemos de antemão. Seu **espaço amostral**, escrito $\Omega$ (a letra
> grega ômega), é o
> conjunto dos resultados possíveis.

Sortear uma equipe é um exemplo. Escolher deliberadamente Ana, Bruno e Carla
não é um sorteio aleatório dessa equipe.

Para a abertura, $\Omega$ contém as 20 equipes de três pessoas.
Uma fila das seis pessoas é um contraexemplo de resultado desse espaço:
tem outro tamanho e distingue posições que o sorteio não distingue.

> Um **evento** é um subconjunto do espaço amostral: o grupo de resultados
> que atende à condição que estamos estudando.

Chame de $E$ o evento “a equipe contém pelo menos uma pessoa experiente”.
Ana–Carla–Diego pertence a $E$. Carla–Diego–Elisa não pertence a $E$,
embora seja uma equipe possível e pertença a $\Omega$.

O evento pode conter uma, várias ou nenhuma possibilidade. “Sortear quatro
pessoas experientes” é um evento impossível neste experimento e corresponde
ao conjunto vazio.

## Quando a contagem vira uma probabilidade

> Resultados **equiprováveis** têm a mesma probabilidade de ocorrer.
> Num espaço amostral finito e não vazio, com resultados equiprováveis:
>
> $$
> P(E) = \frac{n(E)}{n(\Omega)}.
> $$

$P(E)$ se lê “probabilidade do evento $E$”. $n(E)$ é a quantidade de
resultados favoráveis, e $n(\Omega)$ é a quantidade total de resultados.
Contamos o mesmo tipo de resultado nos dois lugares.

As 20 equipes com chances iguais são um exemplo da hipótese. Uma máquina
que escolhe X em 90% das vezes e Y em 10% é um contraexemplo:
contar um nome favorável entre dois daria $\frac{1}{2}$, mas X não tem
probabilidade $\frac{1}{2}$.

Para a abertura:

$$
P(E)
= \frac{C_{6,3} - C_{4,3}}{C_{6,3}}
= \frac{20-4}{20}
= \frac{16}{20}
= \frac{4}{5}
= 80\%.
$$

**Resposta ao problema motivador:** a probabilidade é 80%.
Isso não garante que exatamente oito em cada dez sorteios produzam o evento.
A probabilidade descreve a chance de um sorteio, não uma obrigação para
uma sequência curta de sorteios.

## Conferir o modelo antes da fórmula

Um enunciado pode dizer como o sorteio é feito ou afirmar que todas as
equipes têm a mesma chance. Se essa informação não estiver disponível,
não conclua que as equipes são equiprováveis por terem o mesmo tamanho.

Uma contagem ordenada também pode servir, se for coerente nos dois lugares.
Para as equipes de três, cada grupo tem $3! = 6$ ordens. Se cada sequência
ordenada de três pessoas distintas for igualmente provável, contar essas
ordens dá:

$$
\frac{16 \times 6}{20 \times 6}
= \frac{96}{120}
= \frac{4}{5}.
$$

O fator comum desaparece porque cada equipe gerou a mesma quantidade de
ordens. Mas usar 16 equipes no numerador e 120 sequências no denominador
misturaria unidades diferentes e produziria uma razão incorreta.

## Um roteiro para resolver os problemas

1. Descreva um resultado completo, incluindo ordem e repetição.
2. Escreva a condição do evento com as próprias palavras.
3. Confira se o modelo atribui chances iguais aos resultados contados.
4. Conte o total sem a condição do evento.
5. Conte os resultados favoráveis, diretamente, por casos ou por complemento.
6. Divida e confira se o valor fica entre 0 e 1.

O último cuidado vem do fato de que o evento pertence ao espaço amostral:
ele não pode ter mais resultados que o total. Um evento impossível tem
probabilidade 0; o evento que contém todos os resultados tem probabilidade 1.

## Exemplos resolvidos

### Exemplo 1: código com pelo menos um zero

Um sistema sorteia uniformemente um código de três posições entre os
algarismos 0, 1 e 2. “Uniformemente” significa que os 27 códigos têm
a mesma chance. Repetição e zero inicial são permitidos.

Queremos a probabilidade de pelo menos um zero. Na lição de complemento,
contamos 19 códigos favoráveis: $3^3-2^3 = 19$.

$$
P(\text{pelo menos um zero}) = \frac{19}{27}.
$$

O denominador inclui todos os códigos, inclusive os sem zero. A condição
do evento limita o numerador, não o espaço amostral.

### Exemplo 2: escolher posições de sucessos

**Pause e tente.** Três testes produzem A ou R. O modelo atribui a mesma
chance a cada uma das oito sequências possíveis. Qual é a probabilidade
de exatamente duas aprovações?

<details>
<summary>Ver a solução</summary>

O total é $2^3 = 8$. Escolha duas posições para A entre três:
$\binom{3}{2} = 3$. As sequências favoráveis são AAR, ARA e RAA.

$$
P(\text{exatamente dois A}) = \frac{\binom{3}{2}}{2^3} = \frac{3}{8}.
$$

Se as sequências tivessem chances diferentes, ainda contaríamos três
sequências favoráveis, mas essa razão não determinaria a probabilidade.

</details>

### Exemplo 3: a soma de dois dados

**Pause e tente.** Lançamos um dado identificado como A e outro como B.
O modelo atribui a mesma chance aos 36 pares de faces.
Qual é a probabilidade de a soma ser 7?

<details>
<summary>Dica</summary>

Um resultado é um par de faces, e não um valor da soma. Liste as faces
de B que completam 7 para cada face de A.

</details>

<details>
<summary>Ver a solução</summary>

Há $6 \times 6 = 36$ pares. Os favoráveis são:

| Face de A | Face de B |
|---:|---:|
| 1 | 6 |
| 2 | 5 |
| 3 | 4 |
| 4 | 3 |
| 5 | 2 |
| 6 | 1 |

Assim:

$$
P(\text{soma 7}) = \frac{6}{36} = \frac{1}{6}.
$$

Há 11 somas possíveis, de 2 a 12, mas elas não têm a mesma chance.
A soma 2 tem somente o par (1,1); a soma 7 tem seis pares. Por isso,
dividir um valor favorável por 11 valores de soma seria incorreto.

</details>

## Erros comuns

**Supor chances iguais sem justificativa.** Dois tipos de produto não
precisam ter a mesma chance de sair de uma máquina. É necessário conhecer
o procedimento ou a distribuição de chances.

**Misturar grupo e sequência.** Um numerador de equipes exige um total
de equipes. Você pode usar sequências nos dois lugares, se o modelo justificar
chances iguais e a multiplicidade de cada equipe for a mesma.

**Trocar “exatamente” por “pelo menos”.** Com três testes, exatamente dois A
exclui AAA. Pelo menos dois A inclui AAA e tem quatro sequências favoráveis.

**Somar probabilidades de eventos sobrepostos como se fossem disjuntos.**
Um resultado com Ana e Bruno pertence aos dois eventos “tem Ana” e “tem Bruno”.
A mesma sobreposição que afetava a contagem também afeta a probabilidade.

## Perguntas de verificação

1. O que precisa ser igual para a razão de contagens representar a probabilidade?
2. Por que a equipe Carla–Diego–Elisa entra no denominador da abertura?
3. Por que não contamos somente 11 resultados equiprováveis nos dois dados?

<details>
<summary>Respostas das verificações</summary>

1. A chance de cada resultado completo no espaço amostral escolhido.
2. É uma equipe possível, embora não atenda ao evento. O denominador conta
   todos os resultados possíveis do sorteio.
3. As somas reúnem quantidades diferentes de pares equiprováveis.
   A soma 2 tem um par; a soma 7 tem seis.

</details>

## Exercícios de revisão do capítulo

### 1. Reconhecimento

1. Entre oito pessoas, você escolhe três sem cargos. Outra pergunta escolhe
   presidência, vice-presidência e tesouraria entre as mesmas oito.
   Qual técnica serve para cada pergunta? Calcule os totais.
2. Um experimento tem dois resultados, com chances 90% e 10%. Podemos
   calcular a probabilidade do primeiro contando um resultado entre dois?

### 2. Explicação

3. Explique por que um numerador de equipes e um denominador de distribuições
   de cargos podem produzir uma probabilidade errada.

### 3. Aplicação direta

4. Um sorteio escolhe, com chances iguais, um dos dez números de 1 a 10.
   Qual é a probabilidade de sair um número par?
5. Uma dupla é sorteada entre seis pessoas, com a mesma chance para cada
   dupla. Qual é a probabilidade de incluir Ana?

### 4. Variação

6. Um código de três posições usa A, B, C e D, com repetição permitida.
   Todos os códigos têm a mesma chance. Qual é a probabilidade de todas
   as letras serem diferentes?
7. No código do exercício 6, qual é a probabilidade de pelo menos uma letra A?
8. Uma fila de quatro pessoas é sorteada com chances iguais entre todas as
   ordens. Qual é a probabilidade de Ana e Bruno ficarem juntos?

### 5. Problema misto

9. Uma equipe de três é sorteada entre sete pessoas. Ana e Bruno são
   experientes, e todas as equipes são equiprováveis. Qual é a probabilidade
   de haver pelo menos uma pessoa experiente?
10. Quatro testes produzem A ou R. Cada sequência tem a mesma chance.
    Qual é a probabilidade de exatamente dois A? E de pelo menos dois A?
11. Um registro contém exatamente dois A, dois B e um C. Quantos registros
    distintos existem? Se todos forem equiprováveis, qual é a probabilidade
    de o primeiro símbolo ser C?
12. Cinco pessoas ocupam uma fila. Ana deve ficar na primeira posição.
    Quantas filas são válidas? Se todas as filas das cinco pessoas forem
    equiprováveis, qual é a probabilidade dessa condição?

### 6. Justificativa

13. Nos dois dados do exemplo 3, qual é a probabilidade de soma 2?
    Use esse resultado para explicar por que as somas não são equiprováveis.
14. Por que contar ordens em vez de grupos pode dar a mesma probabilidade
    quando a quantidade de ordens é igual para todos os grupos?

<details>
<summary>Dica para o exercício 11</summary>

O total usa todas as cinco posições. Nos registros favoráveis, C está
fixado no início. Conte as ordens das quatro letras restantes.

</details>

<details>
<summary>Dica para o exercício 10</summary>

Escolha as posições com A. “Pelo menos dois” inclui os casos com dois,
três e quatro A. Esses casos não se sobrepõem.

</details>

<details>
<summary>Respostas para conferência</summary>

1. Sem cargos: $C_{8,3} = 56$. Com cargos distintos:
   $A_{8,3} = 8 \times 7 \times 6 = 336$.
2. Não. As chances não são iguais. A probabilidade informada do primeiro
   é 90%, e não $\frac{1}{2} = 50\%$.
3. Uma equipe pode aparecer em várias distribuições de cargos. O numerador
   e o denominador deixariam de contar o mesmo tipo de resultado.
4. Cinco pares entre dez números: $\frac{5}{10} = \frac{1}{2}$.
5. Total $C_{6,2} = 15$; favoráveis $C_{5,1} = 5$.
   Probabilidade $\frac{5}{15} = \frac{1}{3}$.
6. Total $4^3 = 64$; favoráveis $A_{4,3} = 24$.
   Probabilidade $\frac{24}{64} = \frac{3}{8}$.
7. Sem A, há $3^3 = 27$ códigos. Favoráveis: $64-27 = 37$.
   Probabilidade $\frac{37}{64}$.
8. Total $4! = 24$; juntos $3! \times 2! = 12$.
   Probabilidade $\frac{12}{24} = \frac{1}{2}$.
9. Total $C_{7,3} = 35$; sem experiente $C_{5,3} = 10$.
   Favoráveis $35-10 = 25$. Probabilidade $\frac{25}{35} = \frac{5}{7}$.
10. Total $2^4 = 16$. Exatamente dois: $\binom{4}{2} = 6$,
    probabilidade $\frac{6}{16} = \frac{3}{8}$.
    Pelo menos dois: $6+4+1 = 11$, probabilidade $\frac{11}{16}$.
    Se as duas respostas ficaram iguais, faltou incluir três e quatro A.
11. Total $\frac{5!}{2! \times 2! \times 1!} = 30$.
    Começando com C: $\frac{4!}{2! \times 2!} = 6$.
    Probabilidade $\frac{6}{30} = \frac{1}{5}$.
12. $4! = 24$ filas válidas entre $5! = 120$.
    Probabilidade $\frac{24}{120} = \frac{1}{5}$.
13. Somente (1,1) tem soma 2: $\frac{1}{36}$.
    A soma 7 tem probabilidade $\frac{6}{36}$, seis vezes maior.
14. Cada grupo gera o mesmo fator multiplicativo no numerador e no
    denominador. Esse fator comum se cancela. É preciso que o modelo
    também justifique as chances iguais dos resultados contados.

</details>

## Revisão curta

A combinatória conta resultados. Para transformar uma razão de contagens
em probabilidade, precisamos de resultados equiprováveis e de contagens
coerentes para o evento e para o espaço amostral.

Antes de encerrar o capítulo, explique com suas palavras por que as mesmas
seis pessoas produzem 720 filas, 30 distribuições de dois cargos e 15 duplas
sem cargos. Se a distinção entre os resultados ainda não estiver firme,
retome [permutações](./fatorial-e-permutacoes), [arranjos](./arranjos-e-sequencias)
e [combinações](./combinacoes) antes de avançar em probabilidade.
