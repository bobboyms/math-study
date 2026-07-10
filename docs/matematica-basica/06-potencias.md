---
title: Potencias
---

# Potencias

## Contexto

Multiplicacao ja representa repeticao: `3 x 4` pode ser entendido como quatro
grupos de 3. Potencia aparece quando a repeticao sobe um nivel: agora nao
repetimos uma soma, repetimos o mesmo fator em uma multiplicacao.

Por isso, potencia nao e uma forma diferente de escrever qualquer
multiplicacao. Ela serve para registrar uma cadeia em que o mesmo numero
multiplica de novo, de novo e de novo.

A pergunta principal antes de qualquer regra e:

> Qual fator esta sendo repetido, e quantas vezes?

## Problema motivador

Uma bacteria se duplica a cada hora. No inicio ha 1 bacteria.

| Momento | Multiplicacao feita | Quantidade |
| --- | --- | --- |
| inicio | nenhuma multiplicacao por 2 | 1 |
| depois de 1 hora | $1 \times 2$ | 2 |
| depois de 2 horas | $1 \times 2 \times 2$ | 4 |
| depois de 3 horas | $1 \times 2 \times 2 \times 2$ | 8 |
| depois de 4 horas | $1 \times 2 \times 2 \times 2 \times 2$ | 16 |

O que cresce nao e por soma constante. A cada hora, multiplicamos por 2 mais
uma vez. Como o fator 2 se repete, podemos escrever de forma compacta:

$$
2^4 = 2 \times 2 \times 2 \times 2 = 16
$$

Aqui, o expoente 4 nao quer dizer "multiplicar por 4". Ele quer dizer:

> use o fator 2 quatro vezes.

## Uso

Potencias aparecem sempre que uma quantidade depende de repeticoes
multiplicativas ou de medidas em dimensoes:

- area de quadrados, como $4^2$;
- volume de cubos, como $3^3$;
- crescimento populacional;
- juros compostos;
- notacao cientifica, como $10^6$ e $10^{-3}$;
- computacao, memoria e potencias de 2;
- fisica, quimica, engenharia e escalas muito grandes ou muito pequenas.

## Intuicao

Uma potencia registra uma multiplicacao repetida.

$$
a^n
$$

O numero `a` e a base. Ele e o fator que se repete. O numero `n` e o expoente.
Quando `n` e inteiro positivo, ele diz quantas vezes a base aparece como fator.

Exemplo:

$$
5^4 = 5 \times 5 \times 5 \times 5 = 625
$$

Compare com uma multiplicacao comum:

$$
5 \times 4 = 20
$$

Essas duas escritas nao dizem a mesma coisa.

| Escrita | Leitura | Resultado |
| --- | --- | --- |
| $5 \times 4$ | quatro grupos de 5 | 20 |
| $5^4$ | 5 usado como fator quatro vezes | 625 |

Entao o expoente nao e um numero que "multiplica a base". Ele conta quantas
vezes a base entra na cadeia de multiplicacao.

## Modelo visual

O nome `ao quadrado` vem da area de um quadrado. Um quadrado de lado 4 pode ser
representado assim:

```text
* * * *
* * * *
* * * *
* * * *
```

Ha 4 linhas com 4 unidades em cada linha:

$$
4^2 = 4 \times 4 = 16
$$

Por isso, $4^2$ se conecta naturalmente com area.

O nome `ao cubo` vem do volume. Um cubo de lado 3 tem 3 camadas. Cada camada
tem $3 \times 3$ cubinhos. Ao todo:

$$
3^3 = 3 \times 3 \times 3 = 27
$$

Assim, a mesma ideia aparece primeiro em objetos: linhas e colunas no quadrado,
camadas no cubo, repeticoes de crescimento no exemplo da bacteria.

## Formalizacao

A definicao inicial cobre o caso mais concreto: expoente inteiro positivo.
Se `n` e um inteiro positivo, entao:

$$
a^n = \underbrace{a \times a \times \cdots \times a}_{n \text{ fatores}}
$$

Assim:

$$
a^1 = a
$$

porque ha apenas um fator. E:

$$
a^4 = a \times a \times a \times a
$$

porque ha quatro fatores iguais.

### Multiplicando potencias de mesma base

Quando multiplicamos potencias de mesma base, juntamos duas cadeias de fatores.

Exemplo:

$$
2^3 \times 2^2
$$

Escrevendo os fatores:

$$
(2 \times 2 \times 2)(2 \times 2)
$$

Ao todo, aparecem cinco fatores 2:

$$
2^3 \times 2^2 = 2^5
$$

Por isso:

$$
a^m \times a^n = a^{m+n}
$$

Essa regra so funciona assim quando a base e a mesma. Em $2^3 \times 5^2$,
nao podemos somar os expoentes, porque os fatores repetidos nao sao iguais.

### Potencia de potencia

Agora a repeticao e outra: nao estamos juntando duas potencias lado a lado.
Estamos repetindo uma potencia inteira como bloco.

Exemplo:

$$
(2^3)^2
$$

Primeiro, $2^3$ e:

$$
2 \times 2 \times 2
$$

Elevar esse bloco ao quadrado significa usar o bloco duas vezes:

$$
(2^3)^2 = (2 \times 2 \times 2)(2 \times 2 \times 2)
$$

Agora aparecem seis fatores 2. Entao:

$$
(2^3)^2 = 2^6
$$

Como $6 = 3 \times 2$, temos:

$$
(a^m)^n = a^{m \times n}
$$

A diferenca entre as duas regras e esta:

| Situacao | O que acontece com os fatores | Regra |
| --- | --- | --- |
| $2^3 \times 2^2$ | junta 3 fatores com mais 2 fatores | soma os expoentes |
| $(2^3)^2$ | repete um bloco de 3 fatores duas vezes | multiplica os expoentes |

Por isso:

$$
2^3 \times 2^2 = 2^{3+2} = 2^5
$$

mas:

$$
(2^3)^2 = 2^{3 \times 2} = 2^6
$$

### Dividindo potencias de mesma base

Dividir potencias de mesma base significa cancelar fatores iguais.

Exemplo:

$$
\frac{2^5}{2^3}
$$

Escrevendo os fatores:

$$
\frac{2 \times 2 \times 2 \times 2 \times 2}{2 \times 2 \times 2}
$$

Tres fatores de cima cancelam com tres fatores de baixo. Sobram dois fatores
em cima:

$$
\frac{2^5}{2^3} = 2^2
$$

Por isso, quando $m \ge n$ e $a \neq 0$:

$$
\frac{a^m}{a^n} = a^{m-n}
$$

O detalhe $a \neq 0$ existe porque dividir por zero nao e permitido.

### Expoente zero

Agora aparece uma pergunta natural: o que deve ser $2^0$?

Veja esta divisao:

$$
\frac{2^3}{2^3}
$$

Qualquer numero diferente de zero dividido por ele mesmo da 1:

$$
\frac{2^3}{2^3} = 1
$$

Mas a regra dos expoentes tambem diz:

$$
\frac{2^3}{2^3} = 2^{3-3} = 2^0
$$

Para as duas ideias concordarem, precisamos ter:

$$
2^0 = 1
$$

Isso nao e uma regra solta. Quando todos os fatores iguais se cancelam, nao
sobra nenhum fator 2. O que sobra e o elemento neutro da multiplicacao: 1.

De modo geral:

$$
a^0 = 1
$$

com $a \neq 0$.

### Expoente negativo

O expoente negativo nasce quando a divisao tem mais fatores embaixo do que em
cima.

Observe:

$$
\frac{2^3}{2^5}
$$

Escrevendo os fatores:

$$
\frac{2 \times 2 \times 2}{2 \times 2 \times 2 \times 2 \times 2}
$$

Cancelando tres fatores de cima com tres fatores de baixo, sobram dois fatores
no denominador:

$$
\frac{2^3}{2^5} = \frac{1}{2 \times 2} = \frac{1}{4}
$$

Mas, se mantivermos a regra dos expoentes, a mesma divisao seria escrita assim:

$$
\frac{2^3}{2^5} = 2^{3-5} = 2^{-2}
$$

Portanto:

$$
2^{-2} = \frac{1}{4} = \frac{1}{2^2}
$$

O expoente negativo indica o inverso multiplicativo da potencia positiva:

$$
a^{-n} = \frac{1}{a^n}
$$

com $a \neq 0$.

Isso tambem preserva o padrao da tabela. Ao diminuir o expoente em 1, dividimos
o valor por 2:

| Potencia | Valor |
| --- | --- |
| $2^3$ | 8 |
| $2^2$ | 4 |
| $2^1$ | 2 |
| $2^0$ | 1 |
| $2^{-1}$ | $\frac{1}{2}$ |
| $2^{-2}$ | $\frac{1}{4}$ |
| $2^{-3}$ | $\frac{1}{8}$ |

Assim, $2^{-3}$ nao significa $-8$. O expoente negativo nao muda o sinal do
resultado. Ele manda escrever o inverso:

$$
2^{-3} = \frac{1}{2^3} = \frac{1}{8}
$$

Tambem nao podemos usar base zero com expoente negativo:

$$
0^{-1}
$$

nao existe, porque significaria:

$$
\frac{1}{0}
$$

e divisao por zero nao e definida.

### Breve historia da notacao

A ideia de potencia e mais antiga do que a notacao moderna. Povos antigos ja
lidavam com quadrados, cubos, areas, volumes e multiplicacoes repetidas. O
problema era registrar essas repeticoes sem esconder o padrao.

Escrever:

$$
x \times x \times x \times x \times x
$$

mostra os fatores, mas ocupa espaco. Escrever:

$$
x^5
$$

mostra imediatamente duas informacoes: a base e `x`, e ela aparece cinco vezes
como fator.

A notacao foi se formando aos poucos. Nicolas Chuquet usou expoentes para
potencias da incognita no seculo XV. Rene Descartes ajudou a popularizar a
forma moderna no seculo XVII. Isaac Newton depois usou expoentes negativos e
fracionarios, ampliando a linguagem das potencias.

O ponto importante para este estudo e que a notacao nao nasceu para decorar
regras. Ela nasceu para enxergar e manipular padroes de multiplicacao repetida.

## Exemplos resolvidos

### Exemplo 1: calcular uma expressao

Calcule:

$$
2^4 + 3^2
$$

Primeiro resolvemos as potencias:

$$
2^4 = 2 \times 2 \times 2 \times 2 = 16
$$

$$
3^2 = 3 \times 3 = 9
$$

Depois somamos:

$$
16 + 9 = 25
$$

### Exemplo 2: juntar potencias de mesma base

Simplifique:

$$
5^2 \times 5^3
$$

Escrevendo os fatores:

$$
(5 \times 5)(5 \times 5 \times 5)
$$

Ao todo, ha cinco fatores 5:

$$
5^2 \times 5^3 = 5^5
$$

### Exemplo 3: interpretar expoente negativo

Calcule:

$$
10^{-3}
$$

O expoente negativo manda escrever o inverso de $10^3$:

$$
10^{-3} = \frac{1}{10^3}
$$

Como:

$$
10^3 = 1000
$$

temos:

$$
10^{-3} = \frac{1}{1000} = 0{,}001
$$

## Perguntas de verificacao

- Em $7^4$, qual e a base e qual e o expoente?
- Por que $3^4$ nao significa $3 \times 4$?
- No exemplo da bacteria, o expoente conta horas, bacterias ou repeticoes do fator 2?
- Por que $2^3 \times 2^2 = 2^5$?
- Por que $(2^3)^2 = 2^6$, e nao $2^5$?
- Por que $2^0 = 1$?
- Por que $2^{-3}$ nao e igual a $-8$?
- Por que uma potencia com base zero nao pode ter expoente negativo?

## Exercicios de dominio

1. Escreva $4^3$ como multiplicacao repetida e calcule o resultado.
2. Explique, com fatores, por que $3^2 \times 3^4 = 3^6$.
3. Explique a diferenca entre $2^3 \times 2^2$ e $(2^3)^2$.
4. Calcule $5^0$ e justifique usando a ideia de cancelamento.
5. Calcule $2^{-4}$ e explique por que o resultado nao e negativo.

## Revisao curta

Potencia e multiplicacao repetida. A base e o fator repetido; o expoente conta
quantas vezes esse fator aparece. Quando multiplicamos potencias de mesma base,
somamos expoentes porque juntamos fatores. Quando elevamos uma potencia a outra
potencia, multiplicamos expoentes porque repetimos um bloco de fatores. O
expoente zero aparece quando todos os fatores se cancelam e sobra o neutro 1.
O expoente negativo representa o inverso multiplicativo de uma potencia.
