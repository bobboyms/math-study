---
title: Numeros negativos
---

# Numeros negativos

## Problema motivador

Imagine que voce tem R\$ 20 na sua conta bancaria. Voce vai a uma loja e faz uma compra de R\$ 25 usando o cheque especial (um limite de credito que o banco empresta). 

Qual e a sua situacao financeira agora? 

Voce nao tem "zero" reais. A sua situacao e pior do que ter zero: voce agora deve dinheiro ao banco. Precisamos de uma forma de escrever essa situacao matematicamente, mostrando que a quantidade passou do "nada" e entrou no lado das dividas.

## Uso

Numeros negativos servem para representar:
- **Financas**: dividas, saldo devedor e prejuizos.
- **Temperatura**: graus abaixo de zero (muito comum em lugares frios).
- **Altitudes e profundidades**: andares de garagem no subsolo, metros abaixo do nivel do mar.
- **Fisica e graficos**: direcoes opostas (esquerda x direita, descer x subir).

Eles sao a ferramenta que nos permite medir coisas em relacao a um ponto de referencia central (o zero).

## Conhecimentos anteriores

Para entender esta secao, vamos usar ideias da pagina de **Operacoes basicas**:
- **A reta numerica**: onde representamos as quantidades ordenadas.
- **Subtracao como "retirar" ou "andar para tras"**.
- **Multiplicacao como "grupos iguais"** ($3 \times 2$ sao 3 grupos de 2).
- **Propriedade distributiva**: como distribuir uma multiplicacao por uma soma.
- **Elemento neutro e o zero**: o que acontece quando chegamos a um ponto de equilibrio.

## Intuicao: O outro lado do espelho

Ate agora, os numeros comecavam no 0 e cresciam para frente: 1, 2, 3...
Mas se o zero representa o "meio" de uma situacao (nem lucro nem prejuizo, nem acima nem abaixo do mar), deve existir algo para o outro lado.

Para cada numero "positivo", criamos o seu **oposto** "negativo". 
- O oposto de ganhar R\$ 5 (escrevemos $5$) e dever R\$ 5 (escrevemos $-5$).
- Se voce ganha 5 e depois perde 5, voce volta a estaca zero. 
Isso significa que um numero e o seu oposto se cancelam: 
$$ 
5 + (-5) = 0 
$$

## Modelo visual: A reta completa

Podemos desenhar isso estendendo a reta numerica para a esquerda do zero:

```text
-5  -4  -3  -2  -1   0   1   2   3   4   5
```

- **Andar para a direita** significa aumentar (ganhar, esquentar, subir).
- **Andar para a esquerda** significa diminuir (perder, esfriar, descer).

## Somar e subtrair: O que muda e o que fica igual

### Somando um numero negativo
O que significa somar uma divida? 
Se voce tem R\$ 10 e "ganha" uma divida de R\$ 3, a sua situacao piora. Adicionar uma divida tem o mesmo efeito final que subtrair um valor.

$$ 
10 + (-3) = 7 
$$

**A ponte:** Somar algo que tem natureza de perda (negativo) equivale a subtrair.

### Subtraindo um numero negativo (A regra que parece magia)
E o que significa subtrair (retirar) uma divida? 
Imagine que voce deve R\$ 5 para o banco (saldo de $-5$). O banco decide perdoar a sua divida, ou seja, ele "retira" o seu $-5$. 
Se alguem retira uma divida sua, a sua situacao financeira melhora! Ficar livre de uma divida de R\$ 5 tem o mesmo efeito prativo que ganhar R\$ 5.

$$ 
10 - (-5) = 15 
$$

**A ponte:** Retirar um oposto vira um acrescimo. Na reta numerica, subtrair normalmente e virar para a esquerda. Subtrair um negativo e "virar para a esquerda e andar de costas", o que te faz ir para a direita (subir).

## Multiplicacao com numeros negativos

Da pagina de operacoes basicas, sabemos que multiplicar e fazer grupos iguais. Como isso funciona aqui?

### Positivo x Negativo
Pense em $3 \times (-2)$.
Isso significa "3 grupos de $-2$".
Se $-2$ e uma divida de R\$ 2, entao voce tem 3 dividas de R\$ 2.
$$ 
(-2) + (-2) + (-2) = -6 
$$
Voce deve R\$ 6 no total. A logica de grupos iguais continua funcionando perfeitamente.

### Negativo x Negativo: Por que "menos com menos" da "mais"?

Agora o caso que mais confunde: $(-3) \times (-2) = 6$. Por que o resultado e positivo? Vamos construir isso passo a passo.

**Passo 1: O padrao numerico (Concreto/Visual)**
Vamos observar o que acontece quando diminuimos a quantidade de grupos de $-2$:

```text
 3 x (-2) = -6   (tres dividas de 2 = deve 6)
 2 x (-2) = -4   (duas dividas de 2 = deve 4)
 1 x (-2) = -2   (uma divida de 2 = deve 2)
 0 x (-2) =  0   (nenhuma divida = neutro)
```
Note o que esta acontecendo com o resultado a cada linha: ele esta subindo 2 pontos ($-6 \rightarrow -4 \rightarrow -2 \rightarrow 0$). Isso ocorre porque, a cada linha, estamos *retirando* uma divida de R\$ 2, e retirar uma divida melhora sua situacao em R\$ 2.

Se continuarmos o padrao para os numeros negativos, retirando mais dividas:
```text
-1 x (-2) =  2   (retirar uma divida de 2 melhora em 2)
-2 x (-2) =  4
-3 x (-2) =  6
```
O sinal negativo no primeiro numero (o multiplicador) significa o oposto de adicionar grupos: significa *retirar* grupos. Retirar 3 grupos de dividas tem o mesmo efeito de ganhar R\$ 6.

**Passo 2: A prova pela propriedade distributiva (Abstrato)**
Para os matematicos, o padrao acima precisa ser consistente com as regras que ja existem. Sabemos que um numero e seu oposto se cancelam:
$$ 
3 + (-3) = 0 
$$
Se multiplicarmos tudo por $(-2)$, o resultado final ainda tem que ser zero:
$$ 
(3 + (-3)) \times (-2) = 0 \times (-2) = 0 
$$
Usando a distributiva (multiplicar o $-2$ por cada parte da soma):
$$ 
[3 \times (-2)] + [(-3) \times (-2)] = 0 
$$
Ja sabemos que o primeiro pedaco da $-6$:
$$ 
-6 + [\text{algo}] = 0 
$$
Para essa conta dar zero, o "[algo]" obrigatoriamente tem que ser $6$, que e o oposto do $-6$.
Logo, $(-3) \times (-2)$ so pode ser $6$. A regra "menos com menos da mais" nao e uma magica; e a unica forma de manter a matematica funcionando sem quebrar as regras de adicao e subtracao.

## Exemplo resolvido

**Problema:** Um termometro marcava $-4$°C pela manha. A tarde, a temperatura subiu 9°C, mas a noite caiu 7°C. Qual a temperatura final?

**Passo a passo:**
1. Temperatura inicial: $-4$.
2. Subiu 9°C (andou para a direita na reta): $-4 + 9 = 5$.
3. Caiu 7°C (andou para a esquerda na reta): $5 - 7$.
4. Como 5 e menor que 7, vamos entrar na area negativa. Tirar 5 nos leva ao 0, e ainda precisamos tirar mais 2. Logo, $5 - 7 = -2$.

**Resposta final:** $-2$°C.

## Perguntas de verificacao

- Por que dizemos que o numero $-7$ e o "oposto" do $7$? O que acontece quando juntamos os dois?
- Se voce tem um saldo de R\$ 10 e o banco retira uma taxa que estava errada de $-5$, por que sua conta fica com R\$ 15 em vez de R\$ 5?
- Como voce explicaria para um amigo, usando a ideia de "retirar dividas", que $(-2) \times (-4) = 8$?

## Exercicios

1. **Reconhecimento:** Quais dessas operacoes resultam em um numero positivo?
   a) $4 - 6$
   b) $-3 + 5$
   c) $2 \times (-4)$
   d) $(-3) \times (-3)$

2. **Aplicacao:** Resolva as expressoes, pensando na reta numerica ou em saldos financeiros:
   a) $-10 + 4$
   b) $8 - 12$
   c) $5 - (-2)$
   d) $(-4) - 3$

3. **Justificativa:** Desenhe a continuacao do padrao abaixo e explique com palavras por que o resultado fica positivo.
   ```text
    2 x (-5) = -10
    1 x (-5) = -5
    0 x (-5) = 0
   -1 x (-5) = ?
   -2 x (-5) = ?
   ```

4. **Problema misto:** Uma empresa teve um prejuizo de R\$ 1000 no primeiro mes ($-1000$). Nos dois meses seguintes, o prejuizo foi a metade do primeiro mes, em cada mes. Escreva a operacao matematica que representa o prejuizo total apos os tres meses e calcule o resultado.

## Revisao curta

Numeros negativos estendem a ideia de quantidade para representar faltas, perdas e direcoes opostas.
- **Somar e subtrair**: Pense em andar na reta numerica ou em depositos e saques. Retirar uma divida (subtrair um negativo) e o mesmo que ganhar.
- **Multiplicar**: Multiplicar um negativo por um positivo e acumular dividas (negativo). Multiplicar dois negativos e *retirar* grupos de dividas, o que se traduz em um ganho (positivo). Nao e magica, e a manutencao da logica de compensacao!
