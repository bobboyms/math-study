---
title: Princípios da adição e da multiplicação
---

# Princípios da adição e da multiplicação

## Problema motivador: configurar um computador

Uma loja oferece três modelos de computador. Cada modelo pode receber
quatro tamanhos de memória. Você deve escolher um modelo e uma memória.

Quantas configurações existem? Se a loja também vende dois computadores
prontos, diferentes de todas essas configurações, quantas opções de compra
há ao todo?

As duas perguntas usam as mesmas operações que você já estudou. O trabalho
novo é decidir o que cada operação está contando.

## Mapa das ideias

- **Princípio multiplicativo**: contar resultados formados por escolhas em etapas.
- **Princípio aditivo**: reunir contagens de casos que não compartilham resultados.
- **Casos disjuntos**: grupos de resultados sem nenhum resultado em comum.
- **Número de opções por etapa**: quantas escolhas continuam possíveis naquele ponto.

## Para que serve

Esses princípios contam configurações, trajetos, códigos e escalas. Também
sustentam as fórmulas de permutações, arranjos e combinações das próximas lições.

Em probabilidade, vão ajudar a contar sequências de resultados. Mas multiplicar
quantidades de escolhas ainda não é multiplicar probabilidades.

## Ideias anteriores que voltam aqui

Da [listagem organizada](./listagem-e-arvore-de-possibilidades), voltam os
resultados completos e os grupos definidos pela primeira escolha. Das
[operações básicas](../numeros-e-operacoes/operacoes-basicas), voltam a
adição de grupos e a multiplicação de grupos iguais.

Reative:

1. A1, A2, B1, B2 formam quantos grupos pela primeira letra? Dois, com dois
   códigos cada. O total é $2 + 2 = 4$.
2. Quanto há em três grupos de quatro? $4 + 4 + 4 = 3 \times 4 = 12$.
3. Posso somar duas listas sem verificar se um resultado aparece nas duas?
   Não. Um resultado compartilhado seria contado duas vezes.

## Intuição: uma opção inteira ou etapas de uma opção?

Na loja, escolher um modelo ainda não termina a compra: falta a memória.
Cada um dos três modelos abre quatro possibilidades de configuração.

| Modelo | Memórias possíveis | Configurações |
|---|---|---:|
| A | 8, 16, 32 ou 64 GB | 4 |
| B | 8, 16, 32 ou 64 GB | 4 |
| C | 8, 16, 32 ou 64 GB | 4 |

Os quatro resultados do modelo A não são os quatro do modelo B.
Mudar o modelo muda a configuração, mesmo que a memória seja igual.

Agora pense nos dois computadores prontos. Cada um já é uma opção completa.
Eles se juntam às configurações da tabela, em vez de criar outra etapa para
cada configuração.

## Da tabela à multiplicação

Contar linha por linha dá:

$$
4 + 4 + 4 = 3 \times 4 = 12.
$$

O 3 conta os modelos. O 4 conta as memórias disponíveis para cada modelo.
O produto conta pares “modelo e memória”, e não modelos ou memórias isolados.

> **Princípio multiplicativo:** se há $a$ escolhas na primeira etapa e,
> para cada uma, $b$ escolhas na segunda, há $a \times b$ resultados completos.

Três modelos com quatro memórias cada são um exemplo. Três modelos com
quantidades de memória diferentes não atendem à hipótese de um mesmo $b$.

Em mais etapas, o raciocínio continua. Se cada caminho tem $a$ opções na
primeira etapa, $b$ na segunda e $c$ na terceira, contamos $a \times b \times c$.
Esses números devem valer para qualquer caminho que chegue à etapa correspondente.

## Quando as quantidades variam entre caminhos

Suponha que A aceite quatro memórias, B aceite três e C aceite duas:

| Primeira escolha | Opções na segunda etapa |
|---|---:|
| A | 4 |
| B | 3 |
| C | 2 |

Agora não há três grupos do mesmo tamanho. O total é:

$$
4 + 3 + 2 = 9.
$$

Multiplicar $3 \times 4$ incluiria memórias que B e C não aceitam.
Para preservar a contagem, separamos os casos pela primeira escolha e
somamos os tamanhos reais desses grupos.

O conjunto das opções também pode mudar sem que a quantidade mude. Ao
escolher responsável e suplente entre três pessoas, há três opções para
responsável e duas para suplente. As duas pessoas disponíveis dependem de
quem foi escolhido primeiro, mas a quantidade é sempre dois. Por isso,
$3 \times 2 = 6$ conta as distribuições de cargos.

## Da separação em casos à adição

Retome a loja original: 12 configurações e dois computadores prontos.
Nenhum computador pronto coincide com uma das configurações, conforme a
condição da abertura.

$$
12 + 2 = 14.
$$

> **Princípio aditivo:** se casos não compartilham resultados, o total é a
> soma das quantidades de cada caso.

Esses casos são chamados **disjuntos**. Configurações e computadores prontos
distintos são um exemplo. Duas listas que contêm o mesmo computador são um
contraexemplo: a soma contaria esse computador duas vezes.

**Resposta ao problema motivador:** há 12 configurações e 14 opções de compra
ao incluir os dois computadores prontos.

## “E” e “ou” precisam de interpretação

“Um modelo **e** uma memória” indica duas etapas que constroem uma compra.
“Uma configuração **ou** um computador pronto” indica dois casos completos.

Mas as palavras, sozinhas, não escolhem a operação. “Fala português **e**
inglês” pode descrever pessoas que pertencem a duas listas ao mesmo tempo.
Nesse caso, estamos procurando o grupo compartilhado, e não multiplicando
as quantidades das listas.

Pergunte primeiro o que cada resultado contém e como você separou os casos.

## Exemplos resolvidos

### Exemplo 1: três etapas

Um pedido recebe um código: uma letra entre A e B, um algarismo entre 1, 2
e 3 e um símbolo entre + e −. Todas as combinações são permitidas.

Para cada letra há três algarismos. Para cada par há dois símbolos:

$$
2 \times 3 \times 2 = 12.
$$

Você pode conferir listando os seis pares A1, A2, A3, B1, B2 e B3.
Cada par gera duas versões, uma com + e outra com −.

### Exemplo 2: trajetos alternativos

**Pause e tente.** Há três trajetos diretos da oficina ao depósito.
Outra opção é passar pelo centro: dois trajetos até o centro e quatro do
centro ao depósito. Cada combinação gera um trajeto diferente, e nenhum
coincide com um trajeto direto. Quantos trajetos completos há?

<details>
<summary>Ver a solução</summary>

Via centro, cada um dos dois primeiros trechos pode ser seguido por quatro
segundos trechos. Há $2 \times 4 = 8$ trajetos via centro.

Diretos e via centro são casos disjuntos. O total é:

$$
3 + 2 \times 4 = 3 + 8 = 11.
$$

Somar $3 + 2 + 4$ mistura trajetos completos com trechos incompletos.
Multiplicar os três números exigiria usar um trajeto direto e ainda passar
pelo centro, que não é o pedido.

</details>

### Exemplo 3: repetição muda as opções

**Pause e tente.** Há quatro letras disponíveis para um código de duas
posições. Quantos códigos há com repetição? E sem repetição?

<details>
<summary>Ver a solução</summary>

Com repetição, qualquer letra continua disponível na segunda posição:
$4 \times 4 = 16$ códigos.

Sem repetição, a primeira letra sai das opções da segunda posição:
$4 \times 3 = 12$ códigos.

O número de posições ficou igual. A regra sobre repetir mudou o tamanho
dos grupos definidos pela primeira escolha.

</details>

## Erros comuns

**Somar escolhas que precisam ser combinadas.** Na loja, $3 + 4 = 7$ conta
modelos e tamanhos de memória isolados. Não conta computadores configurados.

**Multiplicar por uma quantidade que não vale para todos os caminhos.**
Na tabela com 4, 3 e 2 opções, $3 \times 4 = 12$ inventa três configurações.
O total correto é 9.

**Somar casos com resultados em comum.** As listas A, B, C e B, C, D têm
três nomes cada. A soma $3 + 3 = 6$ repete B e C. Juntas, contêm quatro
nomes distintos. A lição de [restrições](./restricoes-casos-e-complemento)
vai desenvolver uma maneira de corrigir essa soma.

**Confundir princípio multiplicativo com independência probabilística.**
Responsável e suplente produzem $3 \times 2 = 6$ distribuições, embora a
primeira escolha mude quais pessoas podem ser suplentes. Ainda não
atribuímos chance a nenhuma escolha.

## Perguntas de verificação

1. Por que modelos e memórias formam um produto?
2. Posso multiplicar quando a identidade das opções muda na segunda etapa?
3. O que preciso conferir antes de somar dois casos?

<details>
<summary>Respostas das verificações</summary>

1. Cada modelo cria um grupo de quatro resultados completos, um por memória.
2. Sim, se a quantidade de opções for a mesma para toda escolha anterior.
   Nos cargos, quem sobra muda, mas sempre sobram duas pessoas.
3. Se cada resultado pertence a um único caso. Se aparece nos dois, a soma
   precisa de uma correção para não duplicá-lo.

</details>

## Exercícios de domínio

### 1. Reconhecimento

1. Uma compra exige uma das três capas e um dos dois tamanhos de embalagem.
   Você deve somar ou multiplicar? O que é um resultado completo?
2. Você escolhe uma das quatro aulas de manhã ou uma das três aulas à noite.
   As sete aulas são diferentes. Que princípio conta a escolha de uma aula?

### 2. Explicação

3. Por que não podemos contar duas posições sem repetição usando a mesma
   quantidade de opções nas duas posições?

### 3. Aplicação direta

4. Um produto tem três modelos, dois tamanhos e quatro cores. Todas as
   combinações existem. Quantas versões há?
5. Uma pessoa compra um dos cinco pacotes digitais ou um dos três pacotes
   impressos. Nenhum pacote pertence às duas listas. Quantas escolhas há?

### 4. Variação

6. O modelo A vem em duas cores, o B em três e o C em uma. Quantos produtos
   diferentes há?
7. Um código usa duas letras entre A, B, C, D e E. Conte com e sem repetição.

### 5. Problema misto

8. Há quatro trajetos diretos até um cliente. Via depósito, há três opções
   para o primeiro trecho e duas para o segundo. Os trajetos completos são
   distintos. Quantos trajetos até o cliente há?
9. Um código começa com A ou B e termina com 0, 1 ou 2. Porém, B não pode
   terminar com 0. Quantos códigos são válidos? Confira por listagem.

### 6. Justificativa

10. Dois catálogos listam os produtos A, B, C e C, D. Por que a soma dos
    tamanhos dos catálogos não dá o número de produtos distintos?

<details>
<summary>Dica para o exercício 9</summary>

Separe os códigos pela primeira letra. Conte somente as terminações válidas
para cada letra, e depois some os casos.

</details>

<details>
<summary>Respostas para conferência</summary>

1. Multiplicar. Um resultado é um par formado por capa e tamanho:
   $3 \times 2 = 6$ pares.
2. Princípio aditivo: $4 + 3 = 7$ aulas distintas, escolhendo uma delas.
3. O elemento usado na primeira posição deixa de estar disponível para
   a segunda. Com $n$ elementos, as quantidades são $n$ e $n-1$.
4. $3 \times 2 \times 4 = 24$ versões.
5. $5 + 3 = 8$ escolhas.
6. $2 + 3 + 1 = 6$ produtos. Se encontrou 9, atribuiu três cores a cada modelo.
7. Com repetição: $5 \times 5 = 25$. Sem repetição: $5 \times 4 = 20$.
8. $4 + 3 \times 2 = 4 + 6 = 10$ trajetos.
9. $3 + 2 = 5$: A0, A1, A2, B1 e B2. A contagem $2 \times 3$ incluiria B0.
10. C aparece nos dois catálogos. $3 + 2 = 5$ conta C duas vezes;
    os produtos distintos são A, B, C e D: quatro.

</details>

## Revisão curta

Multiplique quando etapas formam grupos com quantidades constantes de opções.
Some quando casos completos não compartilham resultados. Se as opções variam,
separe os caminhos em casos antes de calcular.

Na [próxima lição](./fatorial-e-permutacoes), a multiplicação vai contar
uma fila em que as opções diminuem a cada posição ocupada.
