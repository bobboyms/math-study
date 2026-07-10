---
title: Fracoes
---

# Fracoes

## Problema motivador: quando a divisao nao termina em inteiros

Nas paginas anteriores, a divisao apareceu como uma forma de repartir uma
quantidade em partes iguais. Isso funciona bem quando o resultado e inteiro:
12 lapis divididos entre 4 pessoas dao 3 lapis para cada pessoa.

Mas nem toda divisao termina em objetos inteiros.

Imagine 3 pizzas iguais para 4 pessoas. Se cada pessoa recebesse 1 pizza
inteira, seriam necessarias 4 pizzas. Como ha apenas 3 pizzas, cada pessoa
recebera menos de 1 pizza.

A pergunta e:

> Como representar exatamente a parte que cada pessoa recebe?

Uma divisao justa precisa tratar as 4 pessoas do mesmo jeito. Por isso,
dividimos cada pizza em 4 partes iguais:

```text
pizza 1: [1/4] [1/4] [1/4] [1/4]
pizza 2: [1/4] [1/4] [1/4] [1/4]
pizza 3: [1/4] [1/4] [1/4] [1/4]
```

Agora existem 12 pedacos iguais. Repartindo esses 12 pedacos entre 4 pessoas,
cada pessoa recebe 3 pedacos:

```text
pessoa A: [1/4] [1/4] [1/4]
pessoa B: [1/4] [1/4] [1/4]
pessoa C: [1/4] [1/4] [1/4]
pessoa D: [1/4] [1/4] [1/4]
```

Cada pessoa recebe 3 partes de tamanho quarto:

$$
\frac{3}{4}
$$

Por isso, a divisao das pizzas pode ser registrada assim:

$$
3 \div 4 = \frac{3}{4}
$$

A fracao nao apareceu como uma regra nova. Ela apareceu porque a divisao em
partes iguais precisava continuar fazendo sentido mesmo quando o resultado nao
era um numero inteiro.

## Para que fracoes servem

Fracoes servem para representar, medir e comparar partes de uma unidade.

Elas aparecem em situacoes como:

- receitas: $\frac{1}{2}$ xicara de leite;
- dinheiro: $\frac{1}{4}$ de R\$ 100;
- medidas: $\frac{3}{4}$ de metro;
- tempo: $\frac{1}{2}$ hora;
- probabilidade: 2 resultados favoraveis em 6 possibilidades;
- escalas: um desenho com $\frac{1}{100}$ do tamanho real;
- algebra: expressoes e equacoes com partes de quantidades desconhecidas.

O ganho principal e este: fracoes permitem falar de quantidades que ficam entre
numeros inteiros, sem perder a ideia de quantidade exata.

## Ideias anteriores que voltam aqui

Fracoes dependem de ideias que ja apareceram.

Da pagina de operacoes basicas, vamos reutilizar:

- **divisao em partes iguais**: repartir uma quantidade de modo justo;
- **multiplicacao como grupos iguais**: contar varias partes do mesmo tamanho;
- **elemento neutro da multiplicacao**: multiplicar por 1 nao muda uma
  quantidade.

Da pagina de numeros negativos, vamos reutilizar:

- **reta numerica**: numeros sao posicoes em relacao ao zero;
- **referencia**: o significado de uma posicao depende do ponto de partida.

Em fracoes, a referencia recebe outro nome importante: **unidade** ou **todo**.
Antes de interpretar uma fracao, precisamos saber qual e o todo que esta sendo
dividido.

Por exemplo, $\frac{1}{2}$ de uma pizza grande nao tem o mesmo tamanho fisico
que $\frac{1}{2}$ de uma pizza pequena. A escrita e a mesma, mas a unidade de
referencia mudou.

## A ideia central: partes iguais de uma unidade

Uma fracao tem a forma:

$$
\frac{a}{b}
$$

O numero de baixo, $b$, chama-se **denominador**. Ele diz em quantas partes
iguais a unidade foi dividida.

O numero de cima, $a$, chama-se **numerador**. Ele diz quantas dessas partes
foram tomadas.

Exemplo:

$$
\frac{3}{5}
$$

Essa escrita significa:

- a unidade foi dividida em 5 partes iguais;
- cada parte e um quinto;
- foram tomadas 3 partes desse tamanho.

Uma leitura util e:

> $\frac{3}{5}$ significa 3 partes do tipo quinto.

O denominador nao conta quantas partes temos. Ele define o tamanho de cada
parte. O numerador conta quantas partes desse tamanho foram tomadas.

## Modelo visual: barra e reta numerica

Imagine uma barra dividida em 5 partes iguais:

```text
[ ] [ ] [ ] [ ] [ ]
```

Se 3 partes ficam marcadas:

```text
[X] [X] [X] [ ] [ ]
```

a quantidade marcada e:

$$
\frac{3}{5}
$$

Essa fracao tambem pode ser vista na reta numerica. O intervalo de 0 a 1 foi
dividido em 5 passos iguais:

```text
0         1
|----|----|----|----|----|
0   1/5  2/5  3/5  4/5   1
              ^
             3/5
```

Esse desenho mostra uma ponte importante com a pagina de numeros negativos:
fracoes tambem sao numeros. Elas ocupam posicoes na reta numerica.

## Fracoes menores, iguais e maiores que 1

Quando o numerador e menor que o denominador, ainda nao completamos 1 unidade.

$$
\frac{3}{4} < 1
$$

Isso acontece porque foram tomadas 3 partes de um total de 4 partes iguais.
Falta 1 quarto para completar o inteiro.

Quando o numerador e igual ao denominador, completamos exatamente 1 unidade.

$$
\frac{4}{4} = 1
$$

Quatro quartos formam uma unidade inteira.

Quando o numerador e maior que o denominador, passamos de 1 unidade.

$$
\frac{7}{4} > 1
$$

Sete quartos significam 7 partes do tipo quarto. Como 4 quartos formam 1
inteiro, podemos separar os 7 quartos assim:

$$
\frac{7}{4} = \frac{4}{4} + \frac{3}{4}
$$

Como $\frac{4}{4}$ e 1 inteiro:

$$
\frac{7}{4} = 1 + \frac{3}{4}
$$

Essa forma tambem pode ser escrita como numero misto:

$$
1\frac{3}{4}
$$

O que mudou foi a escrita. A quantidade continua sendo 7 quartos.

## Formalizacao

Uma fracao e escrita assim:

$$
\frac{a}{b}
$$

com:

$$
b \neq 0
$$

O denominador nao pode ser zero porque o denominador diz em quantas partes
iguais a unidade foi dividida. Dividir uma unidade em zero partes iguais nao
tem significado. Pela mesma razao, a divisao por zero nao e permitida.

Toda fracao tambem pode ser lida como uma divisao:

$$
\frac{a}{b} = a \div b
$$

Exemplos:

$$
\frac{3}{4} = 3 \div 4
$$

$$
\frac{10}{2} = 10 \div 2 = 5
$$

Essa conexao explica por que algumas fracoes representam numeros inteiros:
quando a divisao termina exatamente em grupos inteiros, a fracao vira um
inteiro.

## Fracoes equivalentes: a mesma quantidade com outra divisao

Fracoes equivalentes sao escritas diferentes que representam a mesma
quantidade.

Comece com metade de uma barra:

```text
[X] [ ]
```

A parte marcada e:

$$
\frac{1}{2}
$$

Agora divida cada metade em 2 partes iguais menores:

```text
[X] [X] [ ] [ ]
```

A parte marcada continua sendo a mesma metade da barra. O que mudou foi o modo
de dividir a unidade: antes havia 2 partes; agora ha 4 partes.

A mesma quantidade passou a ser descrita como 2 partes de 4:

$$
\frac{1}{2} = \frac{2}{4}
$$

A ponte e esta:

- antes: 1 parte grande marcada de um total de 2 partes grandes;
- depois: cada parte grande foi repartida em 2 partes menores;
- a parte marcada virou 2 partes pequenas;
- o total virou 4 partes pequenas;
- a regiao marcada da barra permaneceu a mesma.

Por isso, multiplicamos o numerador e o denominador pelo mesmo numero:

$$
\frac{1}{2} = \frac{1 \times 2}{2 \times 2} = \frac{2}{4}
$$

Esse passo tambem se conecta ao elemento neutro da multiplicacao. Como
$\frac{2}{2}$ representa 1 inteiro, multiplicar por $\frac{2}{2}$ nao muda a
quantidade; apenas muda a forma de descreve-la.

De modo geral:

$$
\frac{a}{b} = \frac{a \times k}{b \times k}
$$

com $b \neq 0$ e $k \neq 0$.

Essa formula nao diz que a quantidade aumentou. Ela diz que cada parte antiga
foi repartida em $k$ partes menores. O numero de partes tomadas aumenta, o
numero total de partes tambem aumenta, e a proporcao marcada permanece igual.

### Verificacao concreta

Compare $\frac{1}{2}$ e $\frac{3}{6}$.

```text
metades: [X X X] [     ]
sextos:  [X] [X] [X] [ ] [ ] [ ]
```

As 3 partes marcadas em 6 ocupam a mesma metade da barra. A divisao ficou mais
fina, mas a quantidade marcada nao mudou.

## Simplificacao: equivalencia no sentido contrario

Simplificar uma fracao e escrever a mesma quantidade com numeros menores.

Exemplo:

$$
\frac{6}{8}
$$

Essa escrita significa 6 partes de um total de 8. Se os 8 pedacos podem ser
agrupados de 2 em 2, eles formam 4 grupos. Os 6 pedacos marcados tambem podem
ser agrupados de 2 em 2, formando 3 grupos marcados.

```text
oitavos: [X] [X] [X] [X] [X] [X] [ ] [ ]
grupos:  [ X X ] [ X X ] [ X X ] [     ]
```

A mesma regiao marcada pode ser vista como 3 partes de um total de 4:

$$
\frac{6}{8} = \frac{3}{4}
$$

Na escrita, isso aparece como dividir numerador e denominador pelo mesmo numero:

$$
\frac{6}{8} = \frac{6 \div 2}{8 \div 2} = \frac{3}{4}
$$

O que mudou:

- a unidade passou a ser descrita em quartos, nao em oitavos;
- os numeros da escrita ficaram menores.

O que permaneceu igual:

- a parte marcada da unidade;
- a quantidade representada.

Uma fracao esta simplificada quando numerador e denominador nao tem divisor
comum maior que 1.

## Comparacao de fracoes

Comparar fracoes significa decidir qual quantidade e maior, menor ou igual.
Antes de comparar, olhe para o tamanho das partes.

### Mesmo denominador

Com o mesmo denominador, as partes tem o mesmo tamanho.

$$
\frac{5}{8} > \frac{3}{8}
$$

As duas fracoes usam oitavos. Como 5 oitavos sao mais partes do que 3 oitavos,
$\frac{5}{8}$ e maior.

### Mesmo numerador

Com o mesmo numerador, a quantidade de partes e igual, mas o tamanho de cada
parte pode mudar.

$$
\frac{1}{3} > \frac{1}{5}
$$

Um terco e maior que um quinto porque dividir a mesma unidade em 3 partes gera
partes maiores do que dividir a mesma unidade em 5 partes.

```text
tercos:  [     ] [     ] [     ]
quintos: [  ] [  ] [  ] [  ] [  ]
```

Aqui a ideia anterior e a divisao em partes iguais: quanto mais partes iguais
fazemos na mesma unidade, menor fica cada parte.

### Denominadores diferentes e numeradores diferentes

Agora compare:

$$
\frac{2}{3} \quad \text{e} \quad \frac{3}{5}
$$

A forma atual ainda nao serve para comparar diretamente, porque tercos e
quintos sao partes de tamanhos diferentes. Queremos reescrever as duas fracoes
com uma unidade de medida comum.

O numero 15 serve porque uma unidade dividida em 15 partes pode formar tanto
tercos quanto quintos:

- 1 terco corresponde a 5 partes de 15;
- 1 quinto corresponde a 3 partes de 15.

Reescrevendo com fracoes equivalentes:

$$
\frac{2}{3} = \frac{2 \times 5}{3 \times 5} = \frac{10}{15}
$$

$$
\frac{3}{5} = \frac{3 \times 3}{5 \times 3} = \frac{9}{15}
$$

Agora as partes tem o mesmo tamanho. A comparacao fica entre 10 partes de 15 e
9 partes de 15:

$$
\frac{10}{15} > \frac{9}{15}
$$

Logo:

$$
\frac{2}{3} > \frac{3}{5}
$$

O que mudou foi a escrita. O que permaneceu igual foi a quantidade representada
por cada fracao.

## Soma e subtracao: juntar partes do mesmo tamanho

Para somar ou subtrair fracoes, precisamos que as partes tenham o mesmo
tamanho. Essa e a mesma ideia de medida: nao juntamos diretamente metros com
centimetros sem antes escolher uma unidade comum.

### Denominadores iguais

Calcule:

$$
\frac{2}{7} + \frac{3}{7}
$$

As duas fracoes estao em setimos. O tamanho da parte continua sendo setimo.
Apenas a quantidade de setimos aumenta:

$$
\frac{2}{7} + \frac{3}{7} = \frac{5}{7}
$$

Na subtracao, a ideia e parecida:

$$
\frac{6}{9} - \frac{2}{9} = \frac{4}{9}
$$

Tinhamos 6 nonos e retiramos 2 nonos. Restam 4 nonos.

### Denominadores diferentes

Calcule:

$$
\frac{1}{2} + \frac{1}{3}
$$

A forma atual ainda nao serve para somar, porque metade e terco nao sao partes
do mesmo tamanho.

```text
metades: [ 1/2 ][ 1/2 ]
tercos:  [1/3][1/3][1/3]
```

Queremos uma divisao da unidade que consiga representar metades e tercos ao
mesmo tempo. O 6 funciona porque:

- 6 partes podem ser agrupadas de 3 em 3 para formar metades;
- 6 partes podem ser agrupadas de 2 em 2 para formar tercos.

Reescrevendo cada fracao em sextos:

$$
\frac{1}{2} = \frac{3}{6}
$$

$$
\frac{1}{3} = \frac{2}{6}
$$

Agora as duas fracoes falam de partes do mesmo tamanho:

$$
\frac{3}{6} + \frac{2}{6} = \frac{5}{6}
$$

Logo:

$$
\frac{1}{2} + \frac{1}{3} = \frac{5}{6}
$$

Nao somamos denominador com denominador porque o denominador nao conta partes
tomadas; ele define o tamanho da parte. Se escrevessemos
$\frac{1}{2} + \frac{1}{3} = \frac{2}{5}$, teriamos trocado metades e tercos
por quintos sem preservar a mesma quantidade.

Uma verificacao visual mostra o erro:

```text
1/2 + 1/3 em sextos: [X] [X] [X] [X] [X] [ ]
2/5:                 [X] [X] [ ] [ ] [ ]
```

Cinco sextos ocupam quase a unidade inteira. Dois quintos ocupam menos da
metade. Portanto, essas quantidades nao sao iguais.

## Multiplicacao: parte de uma parte

Na pagina de operacoes basicas, a multiplicacao apareceu como grupos iguais.
Com fracoes, ela ganha uma leitura adicional:

> multiplicar por uma fracao pode significar tomar uma parte de uma quantidade.

Exemplo:

Uma receita usa $\frac{2}{3}$ de xicara de leite. Voce quer fazer metade da
receita. Quanto leite sera usado?

Metade de $\frac{2}{3}$ e:

$$
\frac{1}{2} \times \frac{2}{3}
$$

Como a quantidade inicial sao 2 tercos, tomar metade dessa quantidade divide os
2 tercos em 2 grupos iguais. Cada grupo fica com 1 terco:

$$
\frac{1}{2} \times \frac{2}{3} = \frac{1}{3}
$$

### Modelo de area

Para entender a regra geral, use um retangulo como unidade.

Queremos calcular:

$$
\frac{2}{3} \times \frac{4}{5}
$$

Primeiro, divida o retangulo em 5 colunas iguais e marque 4 delas. Isso
representa $\frac{4}{5}$.

Depois, divida o mesmo retangulo em 3 linhas iguais e tome 2 dessas linhas. A
parte que ficou marcada nos dois sentidos representa $\frac{2}{3}$ de
$\frac{4}{5}$.

```text
unidade dividida em 3 x 5 partes:

X X X X .
X X X X .
. . . . .
```

O retangulo foi dividido em 15 partes pequenas, porque:

$$
3 \times 5 = 15
$$

A regiao marcada nos dois sentidos tem 8 partes pequenas, porque:

$$
2 \times 4 = 8
$$

Por isso:

$$
\frac{2}{3} \times \frac{4}{5} = \frac{8}{15}
$$

A regra fica:

$$
\frac{a}{b} \times \frac{c}{d}
= \frac{a \times c}{b \times d}
$$

com $b \neq 0$ e $d \neq 0$.

O denominador $b \times d$ aparece porque a unidade foi repartida em duas
direcoes. O numerador $a \times c$ aparece porque contamos apenas a parte que
foi escolhida nas duas direcoes.

## Divisao: quantas partes desse tamanho cabem?

Dividir por uma fracao responde a uma pergunta de agrupamento:

> Quantas partes desse tamanho cabem na quantidade que eu tenho?

Exemplo:

Voce tem 2 metros de fita. Cada laco usa $\frac{1}{2}$ metro. Quantos lacos
podem ser feitos?

A conta e:

$$
2 \div \frac{1}{2}
$$

Em 1 metro cabem duas metades. Em 2 metros cabem quatro metades:

```text
1 metro: [1/2] [1/2]
1 metro: [1/2] [1/2]
```

Logo:

$$
2 \div \frac{1}{2} = 4
$$

### Por que aparece a fracao inversa?

A regra pratica diz que dividir por uma fracao equivale a multiplicar pela
fracao inversa. Essa regra tem uma ponte.

Calcule:

$$
\frac{2}{3} \div \frac{4}{5}
$$

A forma atual ainda nao mostra quantos grupos de tamanho $\frac{4}{5}$ cabem
em $\frac{2}{3}$, porque as fracoes estao em unidades diferentes: tercos e
quintos.

Reescrevemos ambas em quinzes avos:

$$
\frac{2}{3} = \frac{10}{15}
$$

$$
\frac{4}{5} = \frac{12}{15}
$$

Agora a pergunta virou:

> Quantos grupos de 12 quinzes avos cabem em 10 quinzes avos?

Isso e:

$$
\frac{10}{15} \div \frac{12}{15} = 10 \div 12 = \frac{10}{12}
$$

Simplificando:

$$
\frac{10}{12} = \frac{5}{6}
$$

Agora compare com a regra da inversa:

$$
\frac{2}{3} \div \frac{4}{5}
= \frac{2}{3} \times \frac{5}{4}
= \frac{10}{12}
= \frac{5}{6}
$$

A inversa nao e um truque. Ela registra, em uma escrita curta, o mesmo processo
de colocar as duas fracoes em uma unidade comum e comparar quantas partes de um
tamanho cabem nas partes do outro tamanho.

De modo geral:

$$
\frac{a}{b} \div \frac{c}{d}
= \frac{a}{b} \times \frac{d}{c}
$$

com $b \neq 0$, $c \neq 0$ e $d \neq 0$.

## Exemplos resolvidos

### Exemplo 1: interpretar uma fracao

Uma barra foi dividida em 8 partes iguais. Foram marcadas 5 partes. Que fracao
representa a parte marcada?

O denominador e 8 porque a unidade foi dividida em 8 partes iguais. O numerador
e 5 porque foram tomadas 5 dessas partes.

$$
\frac{5}{8}
$$

Resposta: a parte marcada representa $\frac{5}{8}$ da barra.

### Exemplo 2: simplificar sem mudar a quantidade

Simplifique:

$$
\frac{18}{24}
$$

Queremos uma escrita menor para a mesma quantidade. O numero 6 divide tanto 18
quanto 24:

$$
\frac{18}{24}
= \frac{18 \div 6}{24 \div 6}
= \frac{3}{4}
$$

O que mudou foi a quantidade de partes usada na descricao: de 24 partes para 4
partes. O que permaneceu igual foi a proporcao marcada.

Resposta:

$$
\frac{3}{4}
$$

### Exemplo 3: comparar com denominador comum

Quem e maior?

$$
\frac{3}{4} \quad \text{ou} \quad \frac{2}{3}
$$

Quartos e tercos tem tamanhos diferentes. Para comparar, reescrevemos as duas
fracoes em doze avos, porque 12 pode formar quartos e tercos:

$$
\frac{3}{4} = \frac{9}{12}
$$

$$
\frac{2}{3} = \frac{8}{12}
$$

Agora as partes tem o mesmo tamanho. Como 9 doze avos sao mais que 8 doze
avos:

$$
\frac{3}{4} > \frac{2}{3}
$$

### Exemplo 4: somar fracoes

Calcule:

$$
\frac{2}{5} + \frac{1}{4}
$$

Quintos e quartos nao sao partes do mesmo tamanho. Reescrevemos as duas fracoes
em vigesimos, porque 20 partes podem formar quintos e quartos:

$$
\frac{2}{5} = \frac{8}{20}
$$

$$
\frac{1}{4} = \frac{5}{20}
$$

Agora juntamos partes do mesmo tamanho:

$$
\frac{8}{20} + \frac{5}{20} = \frac{13}{20}
$$

Resposta:

$$
\frac{13}{20}
$$

### Exemplo 5: tomar uma parte de uma quantidade

Uma turma tem 30 alunos. Dois quintos da turma foram ao laboratorio. Quantos
alunos foram?

Primeiro encontramos 1 quinto da turma. Como quinto significa uma das 5 partes
iguais:

$$
30 \div 5 = 6
$$

Dois quintos sao duas partes desse tamanho:

$$
2 \times 6 = 12
$$

Resposta: 12 alunos foram ao laboratorio.

### Exemplo 6: dividir por uma fracao

Calcule:

$$
\frac{4}{5} \div \frac{2}{5}
$$

As duas fracoes ja usam quintos. A pergunta e:

> Quantos grupos de 2 quintos cabem em 4 quintos?

Cabem 2 grupos:

$$
\frac{4}{5} \div \frac{2}{5} = 2
$$

A regra da inversa confirma o mesmo resultado:

$$
\frac{4}{5} \times \frac{5}{2}
= \frac{20}{10}
= 2
$$

## Perguntas de verificacao

- Que ideia da divisao aparece quando repartimos 3 pizzas entre 4 pessoas?
- Em $\frac{3}{8}$, o que o 8 informa?
- Em $\frac{3}{8}$, o que o 3 informa?
- Por que o todo de referencia precisa estar claro?
- O que muda quando escrevemos $\frac{1}{2}$ como $\frac{2}{4}$?
- O que permanece igual quando escrevemos $\frac{1}{2}$ como $\frac{2}{4}$?
- Qual ideia anterior justifica multiplicar numerador e denominador pelo mesmo
  numero?
- Por que $\frac{1}{3}$ e maior que $\frac{1}{5}$?
- Por que $\frac{1}{2} + \frac{1}{3}$ nao pode ser calculado como
  $\frac{2}{5}$?
- Na multiplicacao $\frac{2}{3} \times \frac{4}{5}$, por que o denominador
  vira $15$?
- O que significa perguntar $2 \div \frac{1}{2}$?
- Por que a fracao inversa aparece na divisao de fracoes?

## Exercicios

### 1. Reconhecimento

1. Escreva em palavras o significado de $\frac{4}{7}$.
2. Represente $\frac{5}{6}$ com uma barra dividida em partes iguais.
3. Diga se cada fracao e menor que 1, igual a 1 ou maior que 1:

$$
\frac{3}{5}, \quad \frac{8}{8}, \quad \frac{11}{6}
$$

### 2. Explicacao

4. Explique por que $\frac{1}{2}$ de uma pizza grande pode ter tamanho fisico
   diferente de $\frac{1}{2}$ de uma pizza pequena.
5. Explique o que muda e o que permanece igual nesta equivalencia:

$$
\frac{2}{3} = \frac{4}{6}
$$

6. Explique por que $\frac{1}{4}$ e menor que $\frac{1}{3}$ quando o todo e o
   mesmo.

### 3. Aplicacao direta

7. Complete com uma fracao equivalente:

$$
\frac{2}{3} = \frac{?}{12}
$$

8. Simplifique:

$$
\frac{15}{20}
$$

9. Calcule:

$$
\frac{1}{6} + \frac{3}{6}
$$

10. Calcule:

$$
\frac{3}{5} \times \frac{10}{9}
$$

### 4. Variacoes

11. Compare usando $>$, $<$ ou $=$:

$$
\frac{3}{4} \quad ? \quad \frac{2}{3}
$$

12. Calcule:

$$
\frac{2}{3} + \frac{1}{6}
$$

13. Calcule:

$$
\frac{4}{5} \div \frac{2}{5}
$$

14. Calcule:

$$
\frac{2}{3} \div \frac{4}{5}
$$

### 5. Problemas mistos

15. Uma receita usa $\frac{3}{4}$ de xicara de acucar. Voce quer fazer metade
    da receita. Quanto acucar sera usado?
16. Uma caixa tem 24 lapis. Um terco dos lapis e azul. Quantos lapis azuis ha?
17. Voce caminhou $\frac{2}{5}$ de um percurso pela manha e $\frac{1}{4}$ a
    tarde. Que fracao do percurso foi caminhada no total?
18. Tres amigos dividiram igualmente 2 barras de chocolate. Que fracao de uma
    barra cada amigo recebeu?

### 6. Justificativa

19. Justifique com um desenho ou explicacao por que:

$$
\frac{3}{4} = \frac{6}{8}
$$

20. Explique por que, ao somar fracoes, o denominador so permanece igual quando
    as fracoes ja usam partes do mesmo tamanho.

## Gabarito comentado

1. Quatro partes quando o todo foi dividido em sete partes iguais.
2. Uma barra com 6 partes iguais e 5 marcadas.
3. $\frac{3}{5}$ e menor que 1; $\frac{8}{8}$ e igual a 1;
   $\frac{11}{6}$ e maior que 1.
4. A escrita $\frac{1}{2}$ fala de metade do todo. Se o todo muda, metade desse
   todo tambem muda de tamanho fisico.
5. A divisao da unidade mudou de tercos para sextos. A quantidade permaneceu
   igual: 2 tercos ocupam a mesma parte que 4 sextos.
6. Com o mesmo todo, dividir em 4 partes cria partes menores do que dividir em
   3 partes.
7. $\frac{8}{12}$.
8. $\frac{3}{4}$.
9. $\frac{4}{6} = \frac{2}{3}$.
10. $\frac{30}{45} = \frac{2}{3}$.
11. $\frac{3}{4} > \frac{2}{3}$, pois $\frac{3}{4} = \frac{9}{12}$ e
    $\frac{2}{3} = \frac{8}{12}$.
12. $\frac{5}{6}$.
13. $2$.
14. $\frac{5}{6}$.
15. $\frac{3}{8}$ de xicara.
16. 8 lapis azuis.
17. $\frac{13}{20}$ do percurso.
18. $\frac{2}{3}$ de uma barra para cada amigo.
19. Ao dividir cada quarto em 2 partes iguais, os 3 quartos viram 6 oitavos. A
    parte marcada permanece igual.
20. O denominador indica o tamanho da parte. Se os denominadores sao diferentes,
    as partes tem tamanhos diferentes; antes de juntar, precisamos reescrever
    tudo em uma unidade comum.

## Revisao curta

Fracao representa uma quantidade formada por partes iguais de uma unidade. O
denominador diz o tamanho das partes; o numerador diz quantas partes desse
tamanho foram tomadas.

As ideias anteriores continuam presentes:

- divisao: repartir a unidade em partes iguais;
- multiplicacao: contar grupos iguais e tomar parte de uma parte;
- elemento neutro: multiplicar por uma forma de 1, como $\frac{2}{2}$, muda a
  escrita sem mudar a quantidade;
- reta numerica: fracoes tambem sao numeros e ocupam posicoes entre inteiros.

Fracoes equivalentes preservam a mesma quantidade com outra divisao da unidade.
Soma e subtracao exigem partes do mesmo tamanho. Multiplicacao de fracoes pode
ser entendida como parte de parte. Divisao por fracao pergunta quantas partes
daquele tamanho cabem na quantidade inicial.

O objetivo nao e decorar regras isoladas. O objetivo e enxergar a mesma ideia
central reaparecendo: medir, repartir, comparar e reorganizar partes de uma
unidade sem perder o significado da quantidade.
