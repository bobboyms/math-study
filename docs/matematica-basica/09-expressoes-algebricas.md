---
title: Expressoes algebricas
---

# Expressoes algebricas

## Contexto

Depois de estudar operacoes, fracoes, potencias e raizes, ja sabemos calcular
com numeros conhecidos. A algebra comeca quando queremos escrever uma conta que
ainda depende de um valor.

Na aritmetica, calculamos um caso:

$$
5 + 2 \times 3 = 11
$$

Na algebra, escrevemos a regra que funciona para muitos casos:

$$
5 + 2x
$$

A letra permite guardar o lugar de um numero. Esse numero pode variar, como uma
distancia, uma quantidade comprada ou um tempo. Tambem pode ser um valor ainda
desconhecido.

Uma expressao algebrica nao diz que duas coisas sao iguais. Ela nao resolve
nada sozinha. Ela representa uma quantidade ou uma regra de calculo.

## Problema motivador

Um aplicativo de transporte cobra R$ 5 fixos mais R$ 2 por quilometro.

Vamos calcular alguns casos:

| Distancia | Calculo | Preco |
| --- | --- | --- |
| 0 km | $5 + 2 \times 0$ | R$ 5 |
| 1 km | $5 + 2 \times 1$ | R$ 7 |
| 3 km | $5 + 2 \times 3$ | R$ 11 |
| 10 km | $5 + 2 \times 10$ | R$ 25 |

O numero da distancia muda, mas a estrutura da conta nao muda:

$$
5 + 2 \times \text{distancia}
$$

Para nao escrever uma frase dentro da conta, chamamos a distancia de $x$:

$$
5 + 2x
$$

Essa e uma expressao algebrica. Ela tem duas partes:

- $5$ e a taxa fixa;
- $2x$ e a parte que muda conforme a distancia.

Se depois soubermos que $x = 8$, substituimos. 
Note que usamos os parenteses em $2(8)$ para deixar clara a multiplicacao e evitar que se leia o numero "28" por engano:

$$
5 + 2(8) = 5 + 16 = 21
$$

Entao a expressao representa uma regra antes de sabermos qual valor de $x$ sera
usado.

## Uso

Expressoes algebricas aparecem quando queremos representar uma regra geral, nao
apenas uma conta isolada:

- custo em funcao de quantidade;
- salario com parte fixa e comissao;
- perimetro de figuras;
- formulas de area e volume;
- regras de pontuacao em jogos;
- modelos em planilhas e programas.

Elas sao a ponte entre contas numericas e modelos. Em vez de calcular somente
"esta viagem de 3 km", escrevemos uma regra para qualquer viagem.

## Intuicao

Pense em uma expressao como uma receita de calculo.

Na expressao:

$$
2x + 5
$$

a letra $x$ e a entrada. A expressao diz:

> pegue o valor de $x$, multiplique por 2 e depois some 5.

Se $x = 4$:

$$
2(4) + 5 = 13
$$

Se $x = 10$:

$$
2(10) + 5 = 25
$$

A expressao e a mesma. O resultado muda porque o valor colocado no lugar de
$x$ mudou.

Tambem e importante entender a escrita curta:

$$
2x
$$

significa:

$$
2 \times x
$$

Assim, $2x + 5$ nao significa "25" nem "2 mais x mais 5". Significa "duas
vezes o valor de $x$, mais 5".

## Modelo visual

Podemos representar a expressao $2x + 5$ como uma maquina:

```text
entrada x ---> dobrar ---> somar 5 ---> resultado
```

Se `x = 4`:

```text
4 ---> 8 ---> 13
```

Logo:

$$
2(4) + 5 = 13
$$

Se a entrada muda para 7:

```text
7 ---> 14 ---> 19
```

Logo:

$$
2(7) + 5 = 19
$$

O desenho mostra a ideia central: a expressao e uma regra de transformacao.
Cada entrada gera uma saida.

## Formalizacao

Uma expressao algebrica combina numeros, variaveis e operacoes.

Exemplos:

$$
3x + 2
$$

$$
4a - 7
$$

$$
2x^2 + 5x - 1
$$

Ela pode ter:

- coeficientes, como o $3$ em $3x$;
- variaveis, como $x$ ou $a$;
- constantes, como $2$ ou $-7$;
- operacoes, como soma, subtracao, multiplicacao, potencia e raiz.

### Avaliar uma expressao

Avaliar uma expressao significa substituir a variavel por um valor e calcular o
resultado numerico.

Exemplo:

Avalie $3x + 2$ quando $x = 5$:

$$
3(5) + 2 = 15 + 2 = 17
$$

Outro exemplo:

Avalie $x^2 + 4x$ quando $x = 3$:

$$
3^2 + 4(3) = 9 + 12 = 21
$$

Veja que a algebra respeita a mesma ordem de operacoes dos numeros: primeiro resolvemos a potencia ($3^2$), depois a multiplicacao ($4 \times 3$), e so no final a soma ($9 + 12$).

Avaliar responde:

> Quanto vale a expressao para este valor especifico da variavel?

### Simplificar uma expressao

Simplificar uma expressao significa escrever a mesma quantidade de um jeito mais
organizado, sem escolher um valor para a variavel.

Termos semelhantes podem ser combinados:

$$
3x + 5x = 8x
$$

Podemos pensar nisso visualmente. Imagine que $x$ seja o comprimento desconhecido de um bloco:
`[ x ] [ x ] [ x ]` (3 blocos)
mais
`[ x ] [ x ] [ x ] [ x ] [ x ]` (5 blocos)
Temos no total 8 blocos de tamanho $x$.

Alem da visao concreta, essa uniao tem base na **propriedade distributiva** que ja conhecemos:

$$
3x + 5x = (3 + 5)x = 8x
$$

Mas a expressao:

$$
3x + 5
$$

nao pode ser simplificada para $8x$. Visualmente, seriam 3 blocos de tamanho desconhecido e 5 unidades fixas (quadradinhos tamanho 1). Nao podemos misturar formas diferentes e dizer que temos "8" de alguma coisa. O termo $3x$ varia com $x$, e o $5$ e fixo.

Veja a diferenca:

| Expressao | Pode juntar? | Motivo |
| --- | --- | --- |
| $4x + 2x$ | sim: $6x$ | ambos sao grupos de $x$ |
| $4x + 2$ | nao vira $6x$ | $4x$ varia com $x$, mas $2$ e fixo |
| $3x^2 + 5x^2$ | sim: $8x^2$ | ambos sao grupos de $x^2$ |
| $3x^2 + 5x$ | nao junta | $x^2$ e $x$ sao tipos diferentes de termo |

### Expressao nao e equacao

Uma expressao pode ser:

$$
5 + 2x
$$

Isso apenas representa uma quantidade.

Uma equacao aparece quando dizemos que essa expressao e igual a algum valor:

$$
5 + 2x = 21
$$

Agora existe uma pergunta nova:

> Qual valor de $x$ torna essa igualdade verdadeira?

Essa pergunta pertence a proxima secao, sobre equacoes. Antes dela, precisamos
dominar a ideia de expressao: uma regra escrita com numeros, letras e operacoes.

## Exemplos resolvidos

### Exemplo 1: avaliar

$$
4x + 3
$$

quando $x = 6$.

Substituimos $x$ por 6:

$$
4(6) + 3
$$

Calculamos:

$$
24 + 3 = 27
$$

Entao, para $x = 6$, a expressao vale 27.

### Exemplo 2: simplificar

Simplifique:

$$
4x + 3 + 2x - 1
$$

Antes de juntar, usamos a **propriedade comutativa** da adicao para reorganizar a conta e colocar o que e semelhante lado a lado:

$$
4x + 2x + 3 - 1
$$

Agora sim, juntamos os termos com $x$:

$$
4x + 2x = 6x
$$

Juntamos os numeros fixos:

$$
3 - 1 = 2
$$

Resultado:

$$
6x + 2
$$

Nao escolhemos nenhum valor para $x$. Apenas escrevemos a mesma expressao de
forma mais organizada.

### Exemplo 3: construir uma expressao

Uma escola cobra R$ 30 de inscricao e R$ 12 por aula. Escreva uma expressao
para o custo de $a$ aulas.

A parte fixa e 30. A parte que depende da quantidade de aulas e $12a$.

Logo, a expressao e:

$$
30 + 12a
$$

Se forem 5 aulas, avaliamos:

$$
30 + 12(5) = 90
$$

## Perguntas de verificacao

- Em $5 + 2x$, o que o $x$ pode representar?
- Qual e a diferenca entre avaliar e simplificar uma expressao?
- Por que $4x + 2x = 6x$, mas $4x + 2$ nao vira $6x$?
- Qual e a diferenca entre $5 + 2x$ e $5 + 2x = 21$?
- Em $3x^2 + 4x + 7$, quais termos dependem de $x$ e qual termo e fixo?

## Exercicios de dominio

1. Avalie $2x + 9$ quando $x = 4$.
2. Avalie $x^2 + 3x$ quando $x = 5$.
3. Simplifique $7x + 2 + 3x - 5$.
4. Explique por que $6x + 4$ nao pode virar $10x$.
5. Escreva uma expressao para "R$ 20 fixos mais R$ 8 por item".

## Revisao curta

Expressao algebrica e uma regra de calculo escrita com numeros, letras e
operacoes. A letra guarda o lugar de um valor que pode variar ou ainda nao ser
conhecido. Avaliar significa substituir a letra por um numero e calcular.
Simplificar significa reorganizar a expressao sem escolher valor para a letra.
Uma expressao nao tem sinal de igualdade; quando aparece uma igualdade, entramos
no estudo das equacoes.
