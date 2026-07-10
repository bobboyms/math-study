---
title: Produtos notaveis
---

# Produtos notaveis

Produtos notaveis sao multiplicacoes algebricas que aparecem tantas vezes que
ganham nomes proprios. Eles nao sao formulas magicas. Sao formas curtas de
registrar uma distributiva que ja conhecemos.

A ideia central e:

> Um produto notavel e uma multiplicacao com uma estrutura especial. Quando
> reconhecemos essa estrutura, conseguimos expandir ou fatorar sem perder
> partes do calculo.

Nesta pagina, vamos construir os padroes em uma ordem conectada:

1. primeiro, a distributiva;
2. depois, os produtos de grau 2;
3. por fim, os produtos de grau 3.

O objetivo nao e decorar sete formulas de uma vez. O objetivo e enxergar de
onde elas vem.

## 1. Problema motivador

Imagine um terreno quadrado.

O lado antigo mede 10 metros. A area antiga e:

$$
10^2 = 100
$$

Agora o lado aumenta 2 metros. O novo lado e:

$$
10 + 2
$$

Entao a nova area e:

$$
(10 + 2)^2
$$

Como $10 + 2 = 12$, a area nova e:

$$
12^2 = 144
$$

Mas queremos entender o que aconteceu com a area, nao apenas calcular o
resultado final. O novo quadrado nao tem apenas a area antiga e um quadradinho
de lado 2. Ele tambem ganhou duas faixas retangulares.

```text
lado 10 + 2

           10          2
      +-----------+---------+
  10  |    100    |   20    |
      |           |         |
      +-----------+---------+
   2  |    20     |    4    |
      |           |         |
      +-----------+---------+
```

Somando as partes:

$$
100 + 20 + 20 + 4 = 144
$$

Esse exemplo mostra o erro mais comum:

$$
(10 + 2)^2 \neq 10^2 + 2^2
$$

Se escrevessemos apenas $10^2 + 2^2$, obteriamos:

$$
100 + 4 = 104
$$

Faltariam as duas faixas de area 20.

Em algebra, o mesmo problema aparece quando o lado e desconhecido:

$$
(x + 2)^2
$$

Nao podemos escrever apenas:

$$
x^2 + 2^2
$$

Precisamos contar tambem as partes misturadas entre $x$ e $2$.

## 2. Uso: para que isso serve?

Produtos notaveis aparecem quando precisamos:

- multiplicar expressoes algebricas com rapidez e seguranca;
- fatorar polinomios;
- resolver equacoes;
- simplificar fracoes algebricas;
- estudar funcoes quadraticas e cubicas;
- calcular areas, volumes e variacoes de medidas;
- reconhecer padroes em fisica, economia, engenharia e programacao.

Por exemplo, a funcao:

$$
f(x) = (x + 3)^2
$$

tambem pode ser escrita como:

$$
f(x) = x^2 + 6x + 9
$$

As duas formas dizem a mesma coisa, mas destacam informacoes diferentes.

- $(x + 3)^2$ mostra a estrutura: uma soma elevada ao quadrado.
- $x^2 + 6x + 9$ mostra as partes depois da multiplicacao.

Aprender produtos notaveis e aprender a transitar entre essas formas.

## 3. A base de tudo: distributiva

Antes de qualquer formula, vem a distributiva:

$$
a(b + c) = ab + ac
$$

Ela diz:

> Se uma quantidade multiplica uma soma, ela multiplica cada parte da soma.

Quando temos dois parenteses, a ideia e a mesma. Cada termo do primeiro
parenteses multiplica cada termo do segundo:

$$
(a + b)(c + d)
$$

```text
          c       d
      +-------+-------+
  a   |  ac   |  ad   |
      +-------+-------+
  b   |  bc   |  bd   |
      +-------+-------+
```

Logo:

$$
(a + b)(c + d) = ac + ad + bc + bd
$$

Todos os produtos notaveis desta pagina nascem dessa ideia. O que muda de um
padrao para outro e o que acontece depois:

- alguns termos iguais se juntam;
- alguns termos opostos se cancelam;
- alguns sinais mudam por causa de fatores negativos.

Essa e a conexao principal.

## 4. Quadrado da soma

O primeiro produto notavel e o quadrado da soma:

$$
(a + b)^2
$$

Essa expressao significa:

$$
(a + b)(a + b)
$$

Agora usamos a distributiva:

$$
(a + b)(a + b) = a(a + b) + b(a + b)
$$

Distribuindo de novo:

$$
a(a + b) + b(a + b) = a^2 + ab + ab + b^2
$$

Como $ab + ab = 2ab$, temos:

$$
(a + b)^2 = a^2 + 2ab + b^2
$$

O termo $2ab$ e a parte que muita gente esquece. Ele aparece porque existem
duas multiplicacoes cruzadas:

$$
a \cdot b
$$

e:

$$
b \cdot a
$$

Como $a \cdot b = b \cdot a$, as duas juntas formam $2ab$.

### Modelo visual

Veja $(a + b)^2$ como a area de um quadrado de lado $a + b$.

```text
lado a + b

          a          b
      +----------+-------+
    a |   a^2    |  ab   |
      |          |       |
      +----------+-------+
    b |    ab    |  b^2  |
      |          |       |
      +----------+-------+
```

As quatro partes sao:

- um quadrado de area $a^2$;
- dois retangulos de area $ab$;
- um quadrado de area $b^2$.

Por isso:

$$
(a + b)^2 = a^2 + 2ab + b^2
$$

### Exemplo 1

Expanda:

$$
(x + 5)^2
$$

Aqui:

$$
a = x
$$

e:

$$
b = 5
$$

Aplicando o padrao:

$$
(x + 5)^2 = x^2 + 2 \cdot x \cdot 5 + 5^2
$$

Logo:

$$
(x + 5)^2 = x^2 + 10x + 25
$$

### Exemplo 2

Expanda:

$$
(2x + 3)^2
$$

Agora o primeiro termo inteiro e $2x$. Entao:

$$
a = 2x
$$

e:

$$
b = 3
$$

Aplicando o padrao:

$$
(2x + 3)^2 = (2x)^2 + 2(2x)(3) + 3^2
$$

Calculando cada parte:

$$
(2x)^2 = 4x^2
$$

$$
2(2x)(3) = 12x
$$

$$
3^2 = 9
$$

Portanto:

$$
(2x + 3)^2 = 4x^2 + 12x + 9
$$

## 5. Quadrado da diferenca

Agora mudamos apenas uma coisa: em vez de somar $b$, subtraimos $b$.

O quadrado da diferenca e:

$$
(a - b)^2
$$

Isso significa:

$$
(a - b)(a - b)
$$

Aplicando a distributiva:

$$
(a - b)(a - b) = a(a - b) - b(a - b)
$$

Distribuindo:

$$
a(a - b) - b(a - b) = a^2 - ab - ab + b^2
$$

Como:

$$
-ab - ab = -2ab
$$

temos:

$$
(a - b)^2 = a^2 - 2ab + b^2
$$

O ultimo termo e positivo porque:

$$
(-b)(-b) = b^2
$$

### Intuicao visual

Pense em um quadrado de lado $a$. Queremos ficar com um quadrado menor, de
lado $a - b$.

Ao tirar uma faixa vertical de largura $b$ e uma faixa horizontal de largura
$b$, a parte do canto foi tirada duas vezes. Por isso ela precisa voltar uma
vez.

```text
partindo de a^2:

a^2
- uma faixa ab
- outra faixa ab
+ o canto b^2 que foi retirado duas vezes
```

Entao:

$$
(a - b)^2 = a^2 - ab - ab + b^2
$$

ou:

$$
(a - b)^2 = a^2 - 2ab + b^2
$$

### Exemplo

Expanda:

$$
(x - 4)^2
$$

Aqui:

$$
a = x
$$

e:

$$
b = 4
$$

Entao:

$$
(x - 4)^2 = x^2 - 2 \cdot x \cdot 4 + 4^2
$$

Logo:

$$
(x - 4)^2 = x^2 - 8x + 16
$$

### Cuidado importante

O quadrado da diferenca nao e a diferenca de quadrados.

Estas duas expressoes sao diferentes:

$$
(a - b)^2
$$

e:

$$
a^2 - b^2
$$

No quadrado da diferenca, a subtracao esta dentro do parenteses antes de
elevar ao quadrado. Na diferenca de quadrados, os quadrados ja estao prontos e
depois sao subtraidos.

## 6. Diferenca de quadrados

Agora aparece uma estrutura diferente:

$$
(a + b)(a - b)
$$

Nao e uma soma ao quadrado nem uma diferenca ao quadrado. E uma soma
multiplicando uma diferenca com os mesmos termos.

Vamos distribuir:

$$
(a + b)(a - b) = a(a - b) + b(a - b)
$$

Entao:

$$
a(a - b) + b(a - b) = a^2 - ab + ab - b^2
$$

Os termos do meio se cancelam:

$$
-ab + ab = 0
$$

Sobra:

$$
(a + b)(a - b) = a^2 - b^2
$$

Lendo ao contrario, temos uma fatoracao:

$$
a^2 - b^2 = (a + b)(a - b)
$$

Essa leitura ao contrario e importante:

- expandir e transformar produto em soma;
- fatorar e transformar soma ou diferenca em produto.

### Exemplo numerico

Veja como isso se conecta ao exemplo do terreno:

$$
(10 + 2)(10 - 2) = 12 \cdot 8 = 96
$$

Pelo padrao:

$$
(10 + 2)(10 - 2) = 10^2 - 2^2
$$

Logo:

$$
10^2 - 2^2 = 100 - 4 = 96
$$

Aqui as partes misturadas nao somam. Elas se cancelam.

### Modelo visual

A diferenca $a^2 - b^2$ pode ser vista de forma geometrica: pegue um quadrado grande de area $a^2$ e recorte um quadrado menor de area $b^2$ de um dos cantos.

O que sobra e uma figura em formato de "L".

Se voce cortar essa figura em "L" e rearranjar as pecas, elas formam exatamente um unico retangulo. As dimensoes desse novo retangulo serao a base $(a + b)$ e a altura $(a - b)$.

Como a area total nao mudou (apenas mudamos as pecas de lugar), a area final tambem pode ser calculada multiplicando a base pela altura:

$$
(a + b)(a - b)
$$

Isso confirma visualmente a igualdade:

$$
a^2 - b^2 = (a + b)(a - b)
$$

### Exemplo 1

Fatore:

$$
x^2 - 25
$$

Reconhecemos dois quadrados:

$$
x^2 = x^2
$$

e:

$$
25 = 5^2
$$

Entao:

$$
x^2 - 25 = x^2 - 5^2
$$

Aplicando o padrao:

$$
x^2 - 25 = (x + 5)(x - 5)
$$

### Exemplo 2

Fatore:

$$
9x^2 - 16
$$

Primeiro escrevemos cada termo como quadrado:

$$
9x^2 = (3x)^2
$$

e:

$$
16 = 4^2
$$

Logo:

$$
9x^2 - 16 = (3x)^2 - 4^2
$$

Portanto:

$$
9x^2 - 16 = (3x + 4)(3x - 4)
$$

## 7. Como escolher entre os padroes de grau 2

Antes de usar uma formula, olhe para a estrutura externa da expressao.

| Expressao | O que voce deve perguntar | Padrao |
| --- | --- | --- |
| $(a + b)^2$ | Uma soma inteira esta ao quadrado? | Quadrado da soma |
| $(a - b)^2$ | Uma diferenca inteira esta ao quadrado? | Quadrado da diferenca |
| $a^2 - b^2$ | Dois quadrados estao sendo subtraidos? | Diferenca de quadrados |

O sinal sozinho nao basta. Compare:

$$
(x - 3)^2
$$

com:

$$
x^2 - 9
$$

No primeiro caso:

$$
(x - 3)^2 = x^2 - 6x + 9
$$

No segundo caso:

$$
x^2 - 9 = (x + 3)(x - 3)
$$

A estrutura e diferente, entao o padrao tambem e diferente.

## 8. Cubo da soma

Os produtos de grau 3 seguem a mesma ideia, mas agora estamos multiplicando
tres fatores.

O cubo da soma e:

$$
(a + b)^3
$$

Isso significa:

$$
(a + b)(a + b)(a + b)
$$

Podemos usar o que ja sabemos do quadrado da soma:

$$
(a + b)^3 = (a + b)^2(a + b)
$$

Como:

$$
(a + b)^2 = a^2 + 2ab + b^2
$$

temos:

$$
(a + b)^3 = (a^2 + 2ab + b^2)(a + b)
$$

Agora distribuimos:

$$
(a^2 + 2ab + b^2)(a + b)
$$

$$
= a^3 + a^2b + 2a^2b + 2ab^2 + ab^2 + b^3
$$

Agrupando termos semelhantes:

$$
(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3
$$

### Por que aparecem os numeros 3 e 3?

Eles contam quantas vezes cada mistura aparece.

Em $(a + b)(a + b)(a + b)$:

- $a^3$ aparece quando escolhemos $a$ nos tres parenteses;
- $a^2b$ aparece quando escolhemos $b$ em um dos tres parenteses;
- $ab^2$ aparece quando escolhemos $a$ em um dos tres parenteses;
- $b^3$ aparece quando escolhemos $b$ nos tres parenteses.

Por isso as quantidades sao:

$$
1,\ 3,\ 3,\ 1
$$

### Exemplo

Expanda:

$$
(x + 2)^3
$$

Aqui:

$$
a = x
$$

e:

$$
b = 2
$$

Aplicando o padrao:

$$
(x + 2)^3 = x^3 + 3x^2(2) + 3x(2^2) + 2^3
$$

Logo:

$$
(x + 2)^3 = x^3 + 6x^2 + 12x + 8
$$

## 9. Cubo da diferenca

O cubo da diferenca troca $b$ por $-b$:

$$
(a - b)^3 = (a + (-b))^3
$$

Usando o cubo da soma:

$$
(a + (-b))^3 = a^3 + 3a^2(-b) + 3a(-b)^2 + (-b)^3
$$

Agora analisamos os sinais:

$$
3a^2(-b) = -3a^2b
$$

$$
3a(-b)^2 = 3ab^2
$$

$$
(-b)^3 = -b^3
$$

Portanto:

$$
(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3
$$

Os sinais alternam porque as potencias de $-b$ alternam:

- potencia impar de $-b$ fica negativa;
- potencia par de $-b$ fica positiva.

### Exemplo

Expanda:

$$
(x - 3)^3
$$

Aqui:

$$
a = x
$$

e:

$$
b = 3
$$

Aplicando o padrao:

$$
(x - 3)^3 = x^3 - 3x^2(3) + 3x(3^2) - 3^3
$$

Logo:

$$
(x - 3)^3 = x^3 - 9x^2 + 27x - 27
$$

## 10. Soma e diferenca de cubos

Agora mudamos de novo o tipo de problema.

Compare estas expressoes:

$$
(a + b)^3
$$

e:

$$
a^3 + b^3
$$

A primeira e o cubo de uma soma. A segunda e uma soma de cubos. Elas nao sao a
mesma coisa.

Em geral:

$$
(a + b)^3 \neq a^3 + b^3
$$

O mesmo cuidado vale para:

$$
(a - b)^3
$$

e:

$$
a^3 - b^3
$$

### Soma de cubos

A soma de cubos fatorada e:

$$
a^3 + b^3 = (a + b)(a^2 - ab + b^2)
$$

Por que o segundo fator tem esses sinais? Porque eles foram escolhidos para
fazer os termos do meio se cancelarem.

Conferindo pela multiplicacao:

$$
(a + b)(a^2 - ab + b^2)
$$

Distribuindo:

$$
a(a^2 - ab + b^2) + b(a^2 - ab + b^2)
$$

$$
= a^3 - a^2b + ab^2 + a^2b - ab^2 + b^3
$$

Agora os termos do meio se anulam:

$$
-a^2b + a^2b = 0
$$

e:

$$
ab^2 - ab^2 = 0
$$

Sobra:

$$
a^3 + b^3
$$

#### Exemplo

Fatore:

$$
x^3 + 8
$$

Primeiro reconhecemos os cubos:

$$
x^3 = x^3
$$

e:

$$
8 = 2^3
$$

Entao:

$$
x^3 + 8 = x^3 + 2^3
$$

Aplicando o padrao:

$$
x^3 + 8 = (x + 2)(x^2 - 2x + 4)
$$

### Diferenca de cubos

A diferenca de cubos fatorada e:

$$
a^3 - b^3 = (a - b)(a^2 + ab + b^2)
$$

Conferindo pela multiplicacao:

$$
(a - b)(a^2 + ab + b^2)
$$

Distribuindo:

$$
a(a^2 + ab + b^2) - b(a^2 + ab + b^2)
$$

$$
= a^3 + a^2b + ab^2 - a^2b - ab^2 - b^3
$$

Os termos do meio se anulam:

$$
a^2b - a^2b = 0
$$

e:

$$
ab^2 - ab^2 = 0
$$

Sobra:

$$
a^3 - b^3
$$

#### Exemplo

Fatore:

$$
27x^3 - 64
$$

Primeiro escrevemos cada termo como cubo:

$$
27x^3 = (3x)^3
$$

e:

$$
64 = 4^3
$$

Entao:

$$
27x^3 - 64 = (3x)^3 - 4^3
$$

Aplicando o padrao:

$$
27x^3 - 64 = (3x - 4)((3x)^2 + (3x)(4) + 4^2)
$$

Simplificando:

$$
27x^3 - 64 = (3x - 4)(9x^2 + 12x + 16)
$$

## 11. Mapa dos padroes

Use esta tabela como mapa, nao como substituto do raciocinio.

| Estrutura | Resultado | Ideia que explica |
| --- | --- | --- |
| $(a + b)^2$ | $a^2 + 2ab + b^2$ | As partes cruzadas se somam |
| $(a - b)^2$ | $a^2 - 2ab + b^2$ | As partes cruzadas ficam negativas |
| $a^2 - b^2$ | $(a + b)(a - b)$ | As partes cruzadas se cancelam |
| $(a + b)^3$ | $a^3 + 3a^2b + 3ab^2 + b^3$ | Tres fatores geram misturas repetidas |
| $(a - b)^3$ | $a^3 - 3a^2b + 3ab^2 - b^3$ | Os sinais alternam por causa de $-b$ |
| $a^3 + b^3$ | $(a + b)(a^2 - ab + b^2)$ | O segundo fator cancela os termos do meio |
| $a^3 - b^3$ | $(a - b)(a^2 + ab + b^2)$ | O segundo fator cancela os termos do meio |

Uma pergunta ajuda a escolher:

> A expressao esta pedindo para expandir um produto ou para fatorar uma soma ou
> diferenca?

Se ha parenteses multiplicando, geralmente queremos expandir. Se ha uma soma ou
diferenca com potencias reconheciveis, talvez seja possivel fatorar.

## 12. Perguntas de verificacao

Responda antes de olhar a tabela.

1. Por que $(a + b)^2$ possui o termo $2ab$?
2. Por que $(a - b)^2$ termina com $+b^2$, e nao com $-b^2$?
3. Qual e a diferenca entre $(a - b)^2$ e $a^2 - b^2$?
4. No produto $(a + b)(a - b)$, por que os termos do meio desaparecem?
5. Por que $(a + b)^3$ tem coeficientes $1, 3, 3, 1$?
6. Como voce reconhece que $x^3 + 27$ e uma soma de cubos?
7. Qual e a diferenca entre expandir e fatorar?

## 13. Exercicios

### Reconhecimento

Identifique o padrao em cada expressao.

1. $(x + 7)^2$
2. $x^2 - 49$
3. $(2x - 5)^2$
4. $x^3 + 64$
5. $(x - 1)^3$
6. $8x^3 - 27$

### Aplicacao direta

Expanda ou fatore.

1. $(x + 4)^2$
2. $(x - 6)^2$
3. $x^2 - 81$
4. $(x + 1)^3$
5. $(x - 2)^3$
6. $x^3 + 125$
7. $64x^3 - 1$

### Variacoes

1. Expanda: $(3x + 2)^2$
2. Expanda: $(2x - 5)^3$
3. Fatore: $25x^2 - 36$
4. Fatore: $8x^3 + 27$
5. Fatore: $125x^3 - 64$

### Justificacao

1. Explique, com suas palavras, por que $(x + 3)^2$ nao e igual a $x^2 + 9$.
2. Mostre, distribuindo, que $(a + b)(a - b) = a^2 - b^2$.
3. Verifique, multiplicando, que:

$$
x^3 + 8 = (x + 2)(x^2 - 2x + 4)
$$

## 14. Gabarito comentado

### Reconhecimento

1. $(x + 7)^2$: quadrado da soma.
2. $x^2 - 49$: diferenca de quadrados, pois $49 = 7^2$.
3. $(2x - 5)^2$: quadrado da diferenca.
4. $x^3 + 64$: soma de cubos, pois $64 = 4^3$.
5. $(x - 1)^3$: cubo da diferenca.
6. $8x^3 - 27$: diferenca de cubos, pois $8x^3 = (2x)^3$ e $27 = 3^3$.

### Aplicacao direta

1. $(x + 4)^2 = x^2 + 8x + 16$
2. $(x - 6)^2 = x^2 - 12x + 36$
3. $x^2 - 81 = (x + 9)(x - 9)$
4. $(x + 1)^3 = x^3 + 3x^2 + 3x + 1$
5. $(x - 2)^3 = x^3 - 6x^2 + 12x - 8$
6. $x^3 + 125 = (x + 5)(x^2 - 5x + 25)$
7. $64x^3 - 1 = (4x - 1)(16x^2 + 4x + 1)$

### Variacoes

1. $(3x + 2)^2 = 9x^2 + 12x + 4$
2. $(2x - 5)^3 = 8x^3 - 60x^2 + 150x - 125$
3. $25x^2 - 36 = (5x + 6)(5x - 6)$
4. $8x^3 + 27 = (2x + 3)(4x^2 - 6x + 9)$
5. $125x^3 - 64 = (5x - 4)(25x^2 + 20x + 16)$

## 15. Revisao curta

Produtos notaveis sao padroes de multiplicacao e fatoracao. Eles funcionam
porque seguem a distributiva.

O fio condutor e este:

- no quadrado da soma, as partes cruzadas se somam;
- no quadrado da diferenca, as partes cruzadas ficam negativas;
- na diferenca de quadrados, as partes cruzadas se cancelam;
- nos cubos, as misturas aparecem mais vezes;
- na soma e na diferenca de cubos, fatoramos escolhendo um segundo fator que
  cancela os termos intermediarios.

A pergunta principal nao deve ser "qual formula decorei?". A pergunta deve
ser:

> Que estrutura esta aparecendo nesta expressao?

Quando voce reconhece a estrutura, a formula vira apenas uma forma curta de
registrar o raciocinio.
