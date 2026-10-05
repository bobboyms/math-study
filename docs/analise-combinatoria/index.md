---
title: Análise combinatória
---

# Análise combinatória

Uma empresa tem pessoas disponíveis para uma equipe, códigos para identificar
pedidos e testes para verificar produtos. Antes de perguntar qual resultado
é mais provável, ela precisa saber quais resultados podem acontecer.

> Como contar todas as possibilidades sem esquecer nenhuma e sem contar a
> mesma possibilidade mais de uma vez?

Essa é a pergunta deste capítulo. **Análise combinatória** é o estudo de
maneiras de escolher, agrupar e ordenar elementos. Contar equipes é um
exemplo. Somar o preço dos integrantes de uma compra é uma conta aritmética,
mas não conta maneiras de escolher ou ordenar.

## O que vem antes

Você pode estudar este capítulo depois de [Álgebra](../algebra/). Ele não
depende de trigonometria nem de cálculo.

Estas ideias vão reaparecer:

- [Operações básicas](../numeros-e-operacoes/operacoes-basicas): multiplicar
  grupos iguais e dividir uma contagem que repetiu cada resultado;
- [Potências](../numeros-e-operacoes/potencias): escrever escolhas que se
  repetem em várias posições;
- [Frações](../numeros-e-operacoes/fracoes): comparar uma parte com o total;
- [Expressões algébricas](../algebra/expressoes-algebricas): escrever uma
  contagem que funciona para diferentes quantidades de elementos.

Reative a base: quanto há em três grupos de quatro opções? São
$3 \times 4 = 12$ opções. Se cada resultado apareceu duas vezes numa lista de
12 registros, há $12 \div 2 = 6$ resultados distintos. E três escolhas com
duas opções em cada uma produzem $2 \times 2 \times 2 = 2^3 = 8$ sequências.
As lições vão explicar por que essas contas correspondem às situações.

## Um problema que acompanha o capítulo

Há seis pessoas disponíveis: Ana, Bruno, Carla, Diego, Elisa e Fábio.

| Pedido | O que diferencia dois resultados? |
|---|---|
| Escolher responsável e suplente | Trocar os cargos muda o resultado |
| Escolher duas pessoas para uma equipe sem cargos | Trocar a ordem dos nomes não muda a equipe |
| Organizar as seis pessoas numa fila | Mudar uma posição muda a fila |

Os nomes disponíveis são os mesmos. Mas as perguntas são diferentes, e por
isso as respostas também serão diferentes. A lição de arranjos encontrará
30 distribuições de cargos. A de combinações encontrará 15 equipes. A de
permutações explicará as 720 filas.

Não escolha uma fórmula pelo número de pessoas. Primeiro descreva o que
constitui um resultado diferente.

## Roteiro das páginas

### Contar antes de usar fórmulas

1. [Listagem e árvore de possibilidades](./listagem-e-arvore-de-possibilidades)
   — escrever cada resultado uma vez e decidir se a ordem importa.
2. [Princípios da adição e da multiplicação](./principios-de-contagem)
   — contar alternativas e escolhas em etapas, com as condições de cada princípio.

### Ordenar e escolher

3. [Fatorial e permutações](./fatorial-e-permutacoes)
   — ordenar todos os elementos distintos e entender de onde vem o fatorial.
4. [Arranjos e sequências com repetição](./arranjos-e-sequencias)
   — preencher algumas posições, distinguindo o que pode ou não se repetir.
5. [Combinações](./combinacoes)
   — escolher grupos sem contar novamente as diferentes ordens do mesmo grupo.
6. [Permutações com elementos repetidos](./permutacoes-com-repeticao)
   — ordenar quando a troca de elementos iguais não cria um resultado novo.

### Escolher a contagem e preparar a probabilidade

7. [Restrições, casos e complemento](./restricoes-casos-e-complemento)
   — condições de posição, elementos juntos, sobreposição e “pelo menos um”.
8. [Coeficientes binomiais e binômio de Newton](./binomio-de-newton)
   — contar posições e entender os números de uma expansão algébrica.
9. [Da contagem à probabilidade](./da-contagem-a-probabilidade)
   — contar resultados favoráveis e possíveis no mesmo modelo, com revisão mista.

Estude na ordem. Faça uma tentativa antes de abrir as soluções. Quando errar,
confira primeiro o significado do resultado que estava contando.

## Como saber se a contagem está bem construída

Antes de calcular, escreva as respostas a estas perguntas:

1. Estou contando filas, códigos, grupos ou resultados de um sorteio?
2. Trocar a ordem muda o resultado?
3. Um elemento pode aparecer novamente? Quantas vezes?
4. Há alguma condição que muda as opções disponíveis?
5. Cada resultado foi contado uma vez? Como posso conferir num caso pequeno?

As respostas importam mais que o nome da técnica. Um código pode exigir
princípio multiplicativo, divisão em casos e complemento no mesmo problema.

## O que estará pronto para estudar depois

Ao terminar, você terá a base de contagem para probabilidades em sorteios,
equipes e sequências de tentativas. A última lição explica a condição que
permite dividir resultados favoráveis pelo total: resultados com a mesma
chance de ocorrer.

Probabilidade condicional, independência e distribuições de probabilidade
exigem estudo próprio. O capítulo prepara essas ideias sem pressupor que
contar resultados, por si só, determine suas chances.
