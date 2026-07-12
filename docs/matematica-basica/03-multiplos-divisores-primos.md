---
title: Múltiplos, divisores e números primos
---

# Múltiplos, divisores e números primos: MMC e MDC

## Problema motivador: ciclos e agrupamentos

Considere duas situações.

Na primeira, dois ônibus saem juntos de um terminal às 8 horas. Um completa
seu percurso e volta ao terminal a cada 12 minutos; o outro volta a cada 18
minutos. Depois de quanto tempo eles estarão juntos no terminal novamente?

Na segunda, uma escola tem 24 lápis azuis e 36 lápis vermelhos. Ela quer montar
o maior número possível de kits **iguais**, sem sobrar nenhum lápis. Quantos
kits podem ser montados?

As duas perguntas envolvem os mesmos números, mas procuram coisas diferentes:

- no problema dos ônibus, queremos o primeiro instante que pertence aos dois
  ciclos;
- no problema dos kits, queremos o maior número de grupos que divide as duas
  quantidades exatamente.

A primeira busca leva ao **mínimo múltiplo comum (MMC)**. A segunda leva ao
**máximo divisor comum (MDC)**.

Antes de aprender qualquer procedimento, precisamos entender as duas ideias
que sustentam tudo: **múltiplo** e **divisor**.

## Mapa das ideias

Antes de desenvolver cada conceito, este é o significado essencial dos termos
que estudaremos:

- **múltiplo de um número** é um resultado obtido ao multiplicar esse número
  por um número natural;
- **divisor de um número** é um número que consegue dividi-lo exatamente, sem
  deixar resto;
- **número primo** é um número natural maior que 1 que possui exatamente dois
  divisores positivos distintos: 1 e ele mesmo;
- **MMC** é o menor múltiplo positivo compartilhado por dois ou mais números;
- **MDC** é o maior divisor positivo compartilhado por dois ou mais números.

Por exemplo, 7 é primo porque seus únicos divisores positivos são 1 e 7. Já 12
não é primo, pois também pode ser dividido exatamente por 2, 3, 4 e 6. Por isso,
12 é chamado de **número composto**.

Este mapa serve como referência inicial. Nas próximas seções, cada definição
será reconstruída a partir de multiplicações, divisões, desenhos e problemas
concretos.

## Para que isso serve?

Múltiplos, divisores, MMC e MDC aparecem quando precisamos:

- sincronizar eventos que se repetem em ritmos diferentes;
- criar calendários, escalas e ciclos de manutenção;
- repartir objetos em grupos iguais, sem sobras;
- cortar peças em tamanhos iguais e tão grandes quanto possível;
- encontrar denominadores comuns para somar ou comparar frações;
- simplificar frações sem alterar seu valor;
- organizar padrões em programação e estudar criptografia.

Números primos entram nessa história porque funcionam como os blocos básicos
da multiplicação. Eles permitem enxergar de que fatores cada número foi
construído e, com isso, comparar números de maneira organizada.

## Ideias anteriores que voltam aqui

Da página de **operações básicas**, vamos reutilizar:

- **multiplicação como grupos iguais**;
- **divisão como repartição ou medida de quantos grupos cabem**;
- **operações inversas**: a divisão desfaz uma multiplicação;
- **resto da divisão**: ele indica se a separação em grupos foi exata.

Por exemplo, a igualdade

$$
4 \times 6 = 24
$$

pode ser lida em duas direções:

- 24 é formado por 4 grupos de 6; portanto, 24 é múltiplo de 4 e de 6;
- 24 pode ser dividido exatamente por 4 e por 6; portanto, 4 e 6 são
  divisores de 24.

Essa é a ponte central da página: **multiplicação e divisão descrevem a mesma
relação, vistas de lados opostos**.

## Múltiplos: resultados de uma contagem em saltos iguais

Imagine caixas com 6 garrafas cada. A quantidade total de garrafas depende da
quantidade de caixas:

| Caixas | Cálculo | Garrafas |
|---:|---:|---:|
| 0 | $0 \times 6$ | 0 |
| 1 | $1 \times 6$ | 6 |
| 2 | $2 \times 6$ | 12 |
| 3 | $3 \times 6$ | 18 |
| 4 | $4 \times 6$ | 24 |

Os totais $0, 6, 12, 18, 24, \ldots$ são **múltiplos de 6**. Cada um resulta
da multiplicação de 6 por um número natural.

Na reta numérica, isso corresponde a caminhar com saltos de tamanho 6:

```text
0------6------12------18------24------30------36 ...
```

De modo geral, um número $m$ é múltiplo de $a$ quando existe um número natural
$k$ tal que

$$
m = a \times k.
$$

Por exemplo, 35 é múltiplo de 5 porque

$$
35 = 5 \times 7.
$$

Já 37 não é múltiplo de 5: não existe número natural que, multiplicado por 5,
produza 37.

### Observações importantes sobre múltiplos

- Todo número natural é múltiplo de 1, pois $n = 1 \times n$.
- Todo número natural é múltiplo de si mesmo, pois $n = n \times 1$.
- Zero é múltiplo de todo número natural não nulo, pois $0 = n \times 0$.
- Um número não nulo tem infinitos múltiplos: basta continuar multiplicando-o
  por $0, 1, 2, 3, \ldots$

Não faz sentido procurar o “maior múltiplo” de um número natural não nulo,
porque a lista nunca termina.

## Divisores: tamanhos de grupos que não deixam sobra

Agora temos 24 garrafas e queremos separá-las em caixas iguais.

Podemos formar:

- 1 caixa com 24 garrafas;
- 2 caixas com 12 garrafas;
- 3 caixas com 8 garrafas;
- 4 caixas com 6 garrafas;
- 6 caixas com 4 garrafas;
- 8 caixas com 3 garrafas;
- 12 caixas com 2 garrafas;
- 24 caixas com 1 garrafa.

Essas possibilidades vêm dos pares de fatores:

$$
1 \times 24,\quad 2 \times 12,\quad 3 \times 8,\quad 4 \times 6.
$$

Por isso, os divisores positivos de 24 são

$$
D(24) = \{1,2,3,4,6,8,12,24\}.
$$

Um número $d$ é **divisor** de $n$ quando a divisão $n \div d$ é exata, isto
é, quando o resto é zero. Também podemos dizer que $d$ **divide** $n$ e
escrever

$$
d \mid n
$$

(lê-se: “$d$ divide $n$”). Assim,

$$
6 \mid 24
$$

porque $24 \div 6 = 4$, sem resto. Por outro lado,

$$
5 \nmid 24
$$

porque $24 \div 5$ deixa resto 4. O traço cortado em $\nmid$ significa
justamente “não divide”.

### O que muda e o que permanece igual?

Ao passar de $4 \times 6 = 24$ para $24 \div 6 = 4$, mudamos a pergunta:
antes juntávamos grupos; agora descobrimos quantos grupos cabem. A relação
entre as três quantidades, porém, permanece a mesma. É por isso que podemos
concluir ao mesmo tempo:

- 24 é múltiplo de 4 e de 6;
- 4 e 6 são divisores de 24.

### Observações importantes sobre divisores

- 1 divide todo número natural.
- Todo número natural não nulo divide a si mesmo.
- Um número positivo tem uma quantidade finita de divisores positivos.
- Zero não pode ser divisor, pois divisão por zero não é definida.

Não confunda as direções:

> 6 é divisor de 24, enquanto 24 é múltiplo de 6.

## Como encontrar todos os divisores

Para encontrar os divisores de 36 sem esquecer nenhum, procuramos pares de
fatores começando em 1:

$$
1 \times 36
$$

$$
2 \times 18
$$

$$
3 \times 12
$$

$$
4 \times 9
$$

$$
6 \times 6
$$

Depois de $6 \times 6$, os pares apenas apareceriam na ordem inversa. Logo,

$$
D(36) = \{1,2,3,4,6,9,12,18,36\}.
$$

O método funciona porque cada divisão exata produz um par. Se $36 \div 4 = 9$,
então $4 \times 9 = 36$, e tanto 4 quanto 9 são divisores.

## Critérios de divisibilidade: atalhos com justificativa

Às vezes queremos apenas saber **se** uma divisão será exata — isto é, se o
resto será zero — sem precisar do quociente. Os critérios de divisibilidade
permitem responder olhando apenas os algarismos do número, sem armar a
conta.

| Divisor | Como reconhecer | Exemplo | Contraexemplo |
|---:|---|---|---|
| 2 | o algarismo das unidades é par: 0, 2, 4, 6 ou 8 | 1 438 termina em 8 | 257 termina em 7 |
| 3 | a soma dos algarismos é múltipla de 3 | em 231, $2+3+1=6$ | em 142, $1+4+2=7$ |
| 4 | o número formado pelos **dois** últimos algarismos é múltiplo de 4 | em 1 316, 16 é múltiplo de 4 | em 1 318, 18 não é |
| 5 | termina em 0 ou 5 | 2 735 termina em 5 | 2 732 termina em 2 |
| 6 | é divisível por 2 **e** por 3 ao mesmo tempo | 234 é par e $2+3+4=9$ | 213 é ímpar, apesar de $2+1+3=6$ |
| 9 | a soma dos algarismos é múltipla de 9 | em 729, $7+2+9=18$ | em 231, a soma é 6 |
| 10 | termina em 0 | 4 120 termina em 0 | 4 125 termina em 5 |

As regras parecem soltas, mas se organizam em três estratégias:

- **olhar o final do número**: critérios de 2, 5 e 10 (último algarismo) e
  de 4 (dois últimos algarismos);
- **somar os algarismos**: critérios de 3 e 9;
- **combinar critérios já conhecidos**: critério de 6.

Nenhuma delas é mágica: todas dependem do nosso sistema decimal. Vejamos por
que cada estratégia funciona.

### Por que basta olhar o último algarismo? (2, 5 e 10)

Todo número pode ser separado em “dezenas completas + último algarismo”:

$$
1\,438 = 1\,430 + 8.
$$

A parte 1 430 termina em zero, então é múltipla de 10 — e, portanto, também
de 2 e de 5. Quem decide é só o algarismo que sobra: como 8 é par, 1 438 é
divisível por 2; como 8 não é 0 nem 5, o número não é divisível por 5 nem
por 10.

### Por que os dois últimos algarismos? (4)

Para o 4, um algarismo não basta, porque 10 **não** é múltiplo de 4. Mas 100
é ($100 = 4 \times 25$) e, por consequência, 1 000, 10 000 etc. também são.
Separamos então em “centenas completas + dois últimos algarismos”:

$$
1\,316 = 1\,300 + 16.
$$

A parte 1 300 é múltipla de 100, logo múltipla de 4. A decisão sobra para o
16, que é múltiplo de 4. Portanto, 1 316 é divisível por 4.

### Por que somar os algarismos? (3 e 9)

Aqui o truque é outro: 10 não é múltiplo de 3, mas fica a apenas 1 de
distância de um, pois $10 = 9 + 1$. O mesmo vale para $100 = 99 + 1$,
$1\,000 = 999 + 1$ e assim por diante. Veja o número 231:

$$
231 = 2 \times 100 + 3 \times 10 + 1.
$$

Trocando $100$ por $99+1$ e $10$ por $9+1$:

$$
231 = 2(99+1)+3(9+1)+1.
$$

Usando a propriedade distributiva e reagrupando:

$$
231 = \underbrace{2 \times 99 + 3 \times 9}_{\text{sempre múltiplo de 3}}
+ \underbrace{(2+3+1)}_{\text{soma dos algarismos}}.
$$

A primeira parte é múltipla de 3 sejam quais forem os algarismos. Logo, a
divisibilidade do número inteiro depende apenas da soma dos algarismos. Em
231, a soma é 6, múltipla de 3 — então 231 é divisível por 3. O número mudou
de escrita, mas sua quantidade permaneceu igual.

Como 9, 99, 999, … também são múltiplos de **9**, o mesmo raciocínio
justifica o critério do 9: basta exigir que a soma seja múltipla de 9.

### Por que o critério do 6 combina dois testes?

Como $6 = 2 \times 3$, um número é divisível por 6 exatamente quando carrega
o fator 2 **e** o fator 3. Passar em um único teste não basta: 213 tem soma
de algarismos 6, mas é ímpar — é divisível por 3 e não por 6.

### Cuidado com o par 3 e 9

Todo número divisível por 9 também é divisível por 3, pois uma soma múltipla
de 9 é automaticamente múltipla de 3. O contrário não vale: 231 é divisível
por 3 (soma 6), mas não por 9.

## Números primos: blocos básicos da multiplicação

Compare as possibilidades de organizar 12 e 13 pontos em retângulos:

```text
12 pontos:  1 x 12, 2 x 6 ou 3 x 4
13 pontos:  1 x 13 apenas
```

O 12 possui vários pares de fatores. O 13 só pode ser formado, com fatores
naturais, por $1 \times 13$.

Um número natural maior que 1 é **primo** quando tem exatamente dois divisores
positivos distintos: 1 e ele mesmo.

Os primeiros números primos são

$$
2,3,5,7,11,13,17,19,23,29,\ldots
$$

Um número natural maior que 1 que possui mais de dois divisores é chamado de
**composto**. Por exemplo, 12 é composto, pois é divisível por 1, 2, 3, 4, 6 e
12.

### Por que 1 não é primo?

O número 1 tem apenas um divisor positivo: ele mesmo. A definição de primo
exige exatamente dois divisores distintos.

Essa escolha também preserva uma propriedade importante: todo número natural
maior que 1 pode ser escrito de uma única forma como produto de primos, sem
considerar a ordem dos fatores. Se 1 fosse primo, poderíamos acrescentar
quantos fatores 1 quiséssemos:

$$
6 = 2 \times 3 = 1 \times 2 \times 3 = 1 \times 1 \times 2 \times 3.
$$

A escrita deixaria de ser única.

### Por que 2 é um primo especial?

O 2 é primo porque seus únicos divisores positivos são 1 e 2. Ele também é o
único primo par: qualquer outro número par é divisível por 2 e, sendo maior que
2, terá pelo menos os divisores 1, 2 e ele mesmo.

## Decomposição em fatores primos

Decompor um número em fatores primos significa descobrir quais blocos primos,
multiplicados, formam esse número.

Vamos decompor 60. Começamos pelo menor primo que o divide:

$$
60 = 2 \times 30.
$$

O 30 ainda é composto:

$$
30 = 2 \times 15.
$$

E o 15 também é composto:

$$
15 = 3 \times 5.
$$

Agora todos os fatores são primos:

$$
60 = 2 \times 2 \times 3 \times 5 = 2^2 \times 3 \times 5.
$$

Uma árvore de fatores mostra a mesma construção:

```text
          60
         /  \
        2   30
           /  \
          2   15
             /  \
            3    5
```

Outra forma de organizar o mesmo trabalho, prática para números maiores, é a
tabela de divisões sucessivas: dividimos sempre pelo menor primo possível,
até chegar a 1. Os fatores primos ficam na coluna da direita:

```text
60 | 2
30 | 2
15 | 3
 5 | 5
 1 |
```

Podemos conferir multiplicando de volta:

$$
2^2 \times 3 \times 5 = 4 \times 3 \times 5 = 60.
$$

O que mudou foi a escrita de 60. A quantidade não mudou. A nova escrita revela
quais fatores constroem o número e quantas vezes cada um aparece.

## MMC: o primeiro encontro entre múltiplos

Retomemos os ônibus que voltam ao terminal a cada 12 e 18 minutos.

Os múltiplos positivos de 12 começam assim:

$$
12,\ 24,\ \mathbf{36},\ 48,\ 60,\ \mathbf{72},\ldots
$$

Os múltiplos positivos de 18 começam assim:

$$
18,\ \mathbf{36},\ 54,\ \mathbf{72},\ 90,\ldots
$$

Os múltiplos comuns — destacados nas duas listas — incluem 36, 72 e outros. O
menor múltiplo comum positivo é 36. Escrevemos:

$$
\operatorname{mmc}(12,18)=36.
$$

Logo, os ônibus estarão juntos novamente depois de 36 minutos, às 8h36.

### Por que procuramos múltiplos?

Cada lista representa todos os instantes em que um ônibus retorna. Um encontro
só ocorre em um instante presente nas duas listas. Procuramos o menor valor
positivo porque a pergunta pede o **primeiro** novo encontro.

### MMC por fatoração prima

Para números maiores, listar múltiplos pode ficar demorado. A fatoração mostra
a estrutura de cada ciclo:

$$
12 = 2^2 \times 3
$$

$$
18 = 2 \times 3^2.
$$

Escrevendo os fatores alinhados em colunas, as exigências de cada número
ficam visíveis:

```text
12 = 2 × 2 × 3
18 = 2     × 3 × 3

mmc = 2 × 2 × 3 × 3 = 36
```

Um múltiplo comum precisa conter fatores suficientes para ser divisível por 12
e por 18 ao mesmo tempo.

- Para conter 12, precisamos de dois fatores 2 e um fator 3.
- Para conter 18, precisamos de um fator 2 e dois fatores 3.
- Para atender às duas exigências sem acrescentar fatores desnecessários,
  usamos a maior quantidade pedida de cada primo: $2^2$ e $3^2$.

Assim,

$$
\operatorname{mmc}(12,18)=2^2 \times 3^2=4 \times 9=36.
$$

Essa escolha não é uma regra arbitrária. Usamos o maior expoente porque o MMC
precisa carregar todos os fatores exigidos por cada número. Usar menos faria a
divisão por um deles falhar; usar mais produziria um múltiplo comum, mas não o
menor.

## MDC: o maior agrupamento compartilhado

Agora retomemos os 24 lápis azuis e 36 lápis vermelhos. Queremos montar o maior
número possível de kits iguais, sem sobras.

O número de kits precisa dividir 24 e 36 exatamente. Portanto, procuramos um
divisor comum.

$$
D(24)=\{1,2,3,4,6,8,12,24\}
$$

$$
D(36)=\{1,2,3,4,6,9,12,18,36\}
$$

Os divisores comuns são $1,2,3,4,6$ e 12. O maior deles é 12:

$$
\operatorname{mdc}(24,36)=12.
$$

Podemos montar 12 kits. Cada kit terá

$$
24 \div 12 = 2
$$

lápis azuis e

$$
36 \div 12 = 3
$$

lápis vermelhos.

### Por que procuramos divisores?

O número de kits deve “caber” exatamente nas duas quantidades. Procuramos o
maior divisor comum porque queremos o maior número de kits iguais possível.

Em outro tipo de problema, podemos querer o maior **tamanho** de cada pedaço.
Por exemplo, para cortar fitas de 24 cm e 36 cm em pedaços iguais, tão longos
quanto possível e sem sobras, o comprimento também será 12 cm. A interpretação
da resposta depende do que está sendo dividido, mas a estrutura é a mesma.

### MDC por fatoração prima

Fatoramos os dois números:

$$
24 = 2^3 \times 3
$$

$$
36 = 2^2 \times 3^2.
$$

Um divisor comum só pode usar fatores presentes nos dois números. No
alinhamento em colunas, sobrevivem apenas as colunas preenchidas nas duas
linhas:

```text
24 = 2 × 2 × 2 × 3
36 = 2 × 2     × 3 × 3

mdc = 2 × 2 × 3 = 12
```

- Ambos possuem pelo menos dois fatores 2.
- Ambos possuem pelo menos um fator 3.
- Um terceiro fator 2 não cabe em 36.
- Um segundo fator 3 não cabe em 24.

Logo, usamos a menor quantidade compartilhada de cada primo:

$$
\operatorname{mdc}(24,36)=2^2 \times 3=12.
$$

Usamos o menor expoente porque o divisor precisa caber nos dois números. Um
expoente maior pediria um fator que um deles não possui.

## MMC e MDC lado a lado

| Ideia | MMC | MDC |
|---|---|---|
| O que buscamos? | menor múltiplo positivo compartilhado | maior divisor positivo compartilhado |
| Palavra-chave conceitual | encontro de ciclos | agrupamento ou medida comum |
| Na fatoração | reúne todos os fatores necessários | conserva apenas os fatores compartilhados |
| Expoentes | maior expoente de cada primo | menor expoente dos primos comuns |

Não decida apenas por palavras como “juntos”, “maior” ou “menor”. Pergunte:

1. Estou procurando um total ou instante que os números conseguem alcançar?
   Então observo múltiplos.
2. Estou repartindo as quantidades em grupos ou pedaços iguais, sem sobra?
   Então observo divisores.

## Método alternativo para o MDC: algoritmo de Euclides

Listar divisores ou fatorar funciona bem com números pequenos. Para números
maiores, existe um procedimento baseado nos restos das divisões.

Vamos calcular $\operatorname{mdc}(252,105)$.

Primeiro, dividimos o maior pelo menor:

$$
252 = 2 \times 105 + 42.
$$

Isso mostra que qualquer número que divide 252 e 105 também divide o resto 42,
pois

$$
42 = 252 - 2 \times 105.
$$

Não mudamos os divisores comuns ao trocar o par $(252,105)$ por $(105,42)$.
Continuamos:

$$
105 = 2 \times 42 + 21
$$

e depois:

$$
42 = 2 \times 21 + 0.
$$

Quando o resto chega a zero, o último resto não nulo é o MDC:

$$
\operatorname{mdc}(252,105)=21.
$$

A ponte do método é sempre a mesma: subtrair um múltiplo de um número do outro
não altera os divisores que ambos compartilham.

## Conexão com frações

Esta página prepara duas ideias importantes da próxima etapa do estudo.

### MDC e simplificação

Considere

$$
\frac{24}{36}.
$$

Como $\operatorname{mdc}(24,36)=12$, podemos dividir numerador e denominador
por 12:

$$
\frac{24}{36}=\frac{24 \div 12}{36 \div 12}=\frac{2}{3}.
$$

O valor da fração permanece igual porque dividimos as duas partes da razão pelo
mesmo fator. O MDC permite retirar de uma vez o maior fator compartilhado.

### MMC e denominador comum

Para somar

$$
\frac{1}{12}+\frac{1}{18},
$$

precisamos expressar as partes usando uma unidade de mesmo tamanho. O menor
denominador que é múltiplo de 12 e de 18 é

$$
\operatorname{mmc}(12,18)=36.
$$

Assim, ambas podem ser reescritas em trinta e seis avos:

$$
\frac{1}{12}=\frac{3}{36}
\qquad\text{e}\qquad
\frac{1}{18}=\frac{2}{36}.
$$

Agora somamos partes do mesmo tamanho:

$$
\frac{3}{36}+\frac{2}{36}=\frac{5}{36}.
$$

O MMC não é apenas um truque para trocar denominadores. Ele encontra a menor
unidade de contagem que os dois denominadores conseguem compartilhar.

## Exemplos resolvidos

### Exemplo 1: dois alarmes

Um alarme toca a cada 8 minutos e outro a cada 14 minutos. Eles tocaram juntos
agora. Quando tocarão juntos novamente?

Procuramos um instante alcançado pelos dois ciclos, portanto precisamos do
MMC.

$$
8=2^3
$$

$$
14=2 \times 7
$$

O MMC precisa conter $2^3$ para ser múltiplo de 8 e o fator 7 para ser múltiplo
de 14:

$$
\operatorname{mmc}(8,14)=2^3 \times 7=56.
$$

Os alarmes tocarão juntos novamente em 56 minutos. Podemos verificar:

$$
56 \div 8=7
\qquad\text{e}\qquad
56 \div 14=4.
$$

As duas divisões são exatas.

### Exemplo 2: azulejos quadrados

Um piso retangular mede 84 cm por 60 cm. Queremos cobri-lo com azulejos
quadrados iguais, sem recortes, usando o maior lado possível. Qual deve ser o
lado de cada azulejo?

O lado do quadrado deve dividir exatamente as duas medidas. Procuramos o maior
divisor comum:

$$
84=2^2 \times 3 \times 7
$$

$$
60=2^2 \times 3 \times 5.
$$

Os fatores compartilhados são $2^2$ e 3:

$$
\operatorname{mdc}(84,60)=2^2 \times 3=12.
$$

Cada azulejo pode ter lado de 12 cm. A verificação é concreta:

$$
84 \div 12=7
\qquad\text{e}\qquad
60 \div 12=5.
$$

Cabem 7 azulejos em uma direção e 5 na outra, sem recortes.

### Exemplo 3: MMC e MDC de três números

Vamos calcular o MMC e o MDC de 12, 18 e 30:

$$
12=2^2 \times 3
$$

$$
18=2 \times 3^2
$$

$$
30=2 \times 3 \times 5.
$$

Para o MMC, reunimos todos os fatores necessários, usando o maior expoente de
cada primo:

$$
\operatorname{mmc}(12,18,30)=2^2 \times 3^2 \times 5=180.
$$

Para o MDC, mantemos somente os fatores presentes em todos, usando o menor
expoente compartilhado:

$$
\operatorname{mdc}(12,18,30)=2 \times 3=6.
$$

Verificação: 180 é divisível pelos três números, e 6 divide os três números.

## Perguntas de verificação

- Na igualdade $7 \times 8=56$, quais números são divisores e qual número é
  múltiplo dos outros?
- Por que o resto zero é a evidência de que um número é divisor de outro?
- Por que o critério de divisibilidade do 2 olha apenas o último algarismo,
  enquanto o do 3 precisa somar todos?
- Por que 1 não é primo? Por que 2 é o único primo par?
- Ao fatorar um número, o que muda na escrita e o que permanece igual?
- Por que o MMC usa os maiores expoentes da fatoração?
- Por que o MDC só pode usar fatores presentes em todos os números?
- Em um problema, que pergunta ajuda a decidir entre múltiplos e divisores?
- Como você verificaria concretamente um resultado de MMC? E um resultado de
  MDC?

## Exercícios

### 1. Reconhecimento

1. Escreva os seis primeiros múltiplos não negativos de 7.
2. Liste todos os divisores positivos de 20.
3. Diga quais números são primos: 1, 2, 9, 17, 21 e 23.
4. Sem efetuar a divisão completa, determine se 4 572 é divisível por 2, 3, 5,
   9 e 10. Justifique com os critérios estudados.

### 2. Explicação

5. Explique por que a igualdade $5 \times 9=45$ mostra ao mesmo tempo uma
   relação de múltiplo e duas relações de divisor.
6. Uma pessoa afirmou: “Todo número ímpar é primo”. Encontre um contraexemplo e
   explique por que ele invalida a afirmação.
7. Explique com suas palavras por que $2^3 \times 3^2$ é múltiplo de
   $2^2 \times 3$, mas o contrário não é verdadeiro.

### 3. Aplicação direta

8. Decomponha 72 e 90 em fatores primos.
9. Calcule $\operatorname{mmc}(15,20)$.
10. Calcule $\operatorname{mdc}(48,60)$.

### 4. Variação e problemas mistos

11. Três luzes piscam a cada 6, 8 e 10 segundos. Se piscaram juntas agora,
    depois de quantos segundos isso acontecerá novamente?
12. Uma confeitaria tem 42 brigadeiros e 30 beijinhos. Ela quer montar o maior
    número possível de caixas iguais, sem sobrar doces. Quantas caixas serão
    montadas e quantos doces de cada tipo haverá em cada caixa?
13. Duas cordas, uma de 96 cm e outra de 72 cm, serão cortadas em pedaços
    iguais, com o maior comprimento possível e sem sobras. Qual será o
    comprimento de cada pedaço? Quantos pedaços serão obtidos ao todo?
14. Use o algoritmo de Euclides para calcular $\operatorname{mdc}(391,299)$.

### 5. Justificativa

15. Sem apenas aplicar uma regra, explique por que
    $\operatorname{mmc}(12,18)=36$ não pode ser 18 nem precisa ser 72.
16. Mostre como o MDC simplifica $\frac{42}{56}$ e explique por que o valor da
    fração não muda.

<details>
<summary>Respostas para conferência</summary>

1. $0,7,14,21,28,35$.
2. $1,2,4,5,10,20$.
3. Primos: 2, 17 e 23. O 1 não é primo; 9 e 21 são compostos.
4. É divisível por 2 (termina em 2), por 3 e por 9 (a soma dos algarismos é
   $4+5+7+2=18$, múltipla de 3 e de 9). Não é divisível por 5 nem por 10,
   pois não termina em 0 nem em 5.
5. $45=5\times9$; logo, 45 é múltiplo de 5 e 9, enquanto 5 e 9 dividem 45.
6. Por exemplo, 9 é ímpar e composto, pois $9=3\times3$.
7. O primeiro contém pelo menos os dois fatores 2 e o fator 3 exigidos pelo
   segundo; o segundo não contém três fatores 2 nem dois fatores 3.
8. $72=2^3\times3^2$ e $90=2\times3^2\times5$.
9. $\operatorname{mmc}(15,20)=60$.
10. $\operatorname{mdc}(48,60)=12$.
11. $\operatorname{mmc}(6,8,10)=120$ segundos.
12. 6 caixas, com 7 brigadeiros e 5 beijinhos em cada uma.
13. 24 cm; 4 pedaços da primeira corda e 3 da segunda, totalizando 7.
14. $391=1\times299+92$, $299=3\times92+23$ e
    $92=4\times23+0$; portanto, o MDC é 23.
15. 18 não é múltiplo de 12. Já 72 é múltiplo comum, mas 36 também é e aparece
    antes dele.
16. $\operatorname{mdc}(42,56)=14$ e
    $\frac{42}{56}=\frac{42\div14}{56\div14}=\frac{3}{4}$. Dividir
    numerador e denominador pelo mesmo fator apenas muda a unidade usada para
    contar a mesma razão.

</details>

## Revisão curta

- **Múltiplo** é o resultado de multiplicar um número por um natural.
- **Divisor** é um número que produz divisão exata, com resto zero.
- Multiplicação e divisão mostram a mesma relação em direções opostas.
- Os **critérios de divisibilidade** decidem se uma divisão é exata olhando o
  final do número (2, 4, 5 e 10) ou a soma dos algarismos (3 e 9).
- **Primos** têm exatamente dois divisores positivos e são os blocos da
  fatoração.
- O **MMC** encontra o primeiro valor positivo alcançado por todos os ciclos.
- O **MDC** encontra o maior fator que divide todas as quantidades sem sobra.
- Na fatoração, o MMC reúne tudo o que é necessário; o MDC conserva apenas o
  que todos compartilham.
- O MMC prepara denominadores comuns, e o MDC prepara a simplificação de
  frações.

Antes de avançar, verifique se você consegue explicar **por que** um problema
usa múltiplos ou divisores. Saber escolher a ideia é mais importante do que
memorizar um procedimento.
