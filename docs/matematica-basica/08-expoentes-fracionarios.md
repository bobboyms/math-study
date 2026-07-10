---
title: Expoentes fracionarios
---

# Expoentes fracionarios

Agora podemos conectar a secao de potencias com a secao de raizes.

A ideia inicial de potencia, como `5^4`, funciona bem quando o expoente e um
numero inteiro positivo: ele conta quantas vezes a base aparece como fator.
Depois vimos expoente zero e expoente negativo, sempre tentando preservar as
regras das potencias.

As raizes criam outra pergunta natural:

> Como escrever uma raiz usando a mesma linguagem das potencias?

A resposta e usar expoentes fracionarios.

Comece pela raiz quadrada:

$$
\sqrt{9}
$$

pergunta:

> Que numero, elevado ao quadrado, da 9?

A resposta e 3, porque:

$$
3^2 = 9
$$

Agora queremos escrever essa mesma pergunta usando notacao de potencia. Para
isso usamos o expoente $\frac{1}{2}$:

$$
9^{\frac{1}{2}} = \sqrt{9} = 3
$$

Por que $\frac{1}{2}$? Porque, se elevarmos isso ao quadrado, o expoente fica
inteiro:

$$
\left(9^{\frac{1}{2}}\right)^2 = 9^{\frac{1}{2} \times 2} = 9^1 = 9
$$

Entao $9^{\frac{1}{2}}$ precisa ser o numero que, ao quadrado, volta para 9.
Isso e exatamente o papel da raiz quadrada.

De modo geral:

$$
a^{\frac{1}{2}} = \sqrt{a}
$$

O mesmo raciocinio vale para outras raizes. Se queremos um numero que, elevado
a $n$, volte para $a$, usamos expoente $\frac{1}{n}$:

$$
a^{\frac{1}{n}} = \sqrt[n]{a}
$$

Exemplo:

$$
8^{\frac{1}{3}} = \sqrt[3]{8} = 2
$$

porque:

$$
2^3 = 8
$$

## Como resolver expoentes fracionarios

Para resolver uma potencia com expoente fracionario, leia a fracao como duas
instrucoes:

$$
a^{\frac{m}{n}}
$$

- o denominador `n` indica a raiz;
- o numerador `m` indica a potencia.

Ou seja:

$$
a^{\frac{m}{n}} = \left(\sqrt[n]{a}\right)^m
$$

Tambem podemos escrever:

$$
a^{\frac{m}{n}} = \sqrt[n]{a^m}
$$

As duas formas representam a mesma ideia. Em contas numericas simples, costuma
ser mais facil tirar a raiz primeiro e elevar depois, porque os numeros ficam
menores.

Exemplo:

$$
81^{\frac{3}{4}}
$$

Se tiramos a raiz primeiro:

$$
81^{\frac{3}{4}} = \left(\sqrt[4]{81}\right)^3
$$

Como:

$$
\sqrt[4]{81} = 3
$$

temos:

$$
81^{\frac{3}{4}} = 3^3 = 27
$$

Se elevamos primeiro, tambem funciona:

$$
81^{\frac{3}{4}} = \sqrt[4]{81^3}
$$

mas o numero $81^3$ e muito maior. Por isso, quando a raiz e exata, tirar a
raiz primeiro geralmente deixa a conta mais leve.

Regra pratica:

> Em problemas numericos simples, tente tirar a raiz primeiro. Se a raiz for
> exata, o calculo fica mais leve.

Erro comum:

$$
16^{\frac{1}{2}} \ne 16 \times \frac{1}{2}
$$

O lado esquerdo significa raiz quadrada de 16:

$$
16^{\frac{1}{2}} = 4
$$

O lado direito significa metade de 16:

$$
16 \times \frac{1}{2} = 8
$$

Sao operacoes diferentes.

## Mais exemplos

Exemplo 1:

$$
16^{\frac{1}{2}}
$$

O denominador e 2. Entao fazemos raiz quadrada:

$$
16^{\frac{1}{2}} = \sqrt{16} = 4
$$

Exemplo 2:

$$
27^{\frac{2}{3}}
$$

O denominador e 3, entao fazemos raiz cubica. O numerador e 2, entao elevamos
o resultado ao quadrado:

$$
27^{\frac{2}{3}} = \left(\sqrt[3]{27}\right)^2
$$

Como:

$$
\sqrt[3]{27} = 3
$$

entao:

$$
27^{\frac{2}{3}} = 3^2 = 9
$$

Exemplo 3:

$$
32^{\frac{3}{5}}
$$

O denominador e 5, entao fazemos raiz quinta. O numerador e 3, entao elevamos
o resultado ao cubo:

$$
32^{\frac{3}{5}} = \left(\sqrt[5]{32}\right)^3
$$

Como:

$$
\sqrt[5]{32} = 2
$$

pois:

$$
2^5 = 32
$$

temos:

$$
32^{\frac{3}{5}} = 2^3 = 8
$$

## Breve historia da notacao

Expoentes fracionarios surgiram da necessidade de unificar potencias e raizes.
Em vez de tratar $\sqrt{a}$ como uma linguagem separada de $a^n$, a matematica
passou a escrever as duas ideias no mesmo sistema:

$$
\sqrt{a} = a^{\frac{1}{2}}
$$

$$
\sqrt[3]{a} = a^{\frac{1}{3}}
$$

$$
\sqrt[n]{a} = a^{\frac{1}{n}}
$$

Nicole Oresme ja trabalhava com ideias ligadas a expoentes fracionarios no
seculo XIV. A notacao moderna foi se consolidando depois, especialmente com
autores do seculo XVII, como Isaac Newton.

O mais importante aqui e a conexao conceitual: expoente fracionario nao e uma
regra nova para decorar. Ele e uma forma de escrever raizes dentro da linguagem
das potencias.

## Exercicios de dominio

1. Calcule $64^{\frac{1}{3}}$ e escreva a raiz correspondente.
2. Calcule $27^{\frac{2}{3}}$ explicando o papel do numerador e do denominador.
3. Calcule $32^{\frac{3}{5}}$ tirando a raiz primeiro.
4. Explique por que $25^{\frac{1}{2}}$ nao significa $25 \times \frac{1}{2}$.

## Revisao curta

Expoentes fracionarios juntam a linguagem das potencias com a linguagem das
raizes. O denominador indica qual raiz deve ser feita; o numerador indica a
potencia aplicada ao resultado. Por isso, $a^{1/n}$ significa $\sqrt[n]{a}$, e
$a^{m/n}$ pode ser lido como $\left(\sqrt[n]{a}\right)^m$.
