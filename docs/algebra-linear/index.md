---
title: Álgebra linear
---

# Álgebra linear

Uma loja de streaming guarda, para cada cliente, quantos filmes ele assistiu de
cada gênero. Um banco guarda, para cada pedido de crédito, renda, dívidas e
tempo de conta. Uma câmera guarda, para cada foto, o brilho de cada pixel. Nos
três casos, o dado é uma **lista de números**, e uma coleção de dados é uma
**tabela** de números.

> Que contas fazem sentido com listas e tabelas de números, e o que essas
> contas revelam sobre os dados?

Essa é a pergunta deste capítulo. **Álgebra linear** é o estudo dessas contas.
Ela começa nas setas do plano, que você estudou no módulo de vetores da
geometria, e mostra que as mesmas contas funcionam com listas de qualquer
tamanho — 5, 1.000 ou um milhão de números.

É a matemática de base da computação gráfica, da análise de dados e do
aprendizado de máquina. Uma camada de uma rede neural, por exemplo, é uma conta
de álgebra linear: multiplicar uma lista de números por uma tabela e somar
outra lista.

## O que vem antes

Este capítulo depende do capítulo de geometria inteiro, e em especial do
[módulo 8, de vetores](../geometria/vetores). Ele **não** depende de cálculo:
você pode estudá-lo logo depois da geometria, antes ou depois do Cálculo 1.

Estas ideias vão reaparecer:

- [Vetores](../geometria/vetores) e [soma de
  vetores](../geometria/soma-de-vetores): a seta, suas coordenadas, a soma
  coordenada a coordenada e a combinação linear $a\vec{u} + b\vec{v}$;
- [Produto escalar](../geometria/produto-escalar): “multiplica cada par e
  soma”, e o que o resultado diz sobre o ângulo;
- [Projeção ortogonal](../geometria/projecao-ortogonal): o ponto mais perto
  numa reta;
- [Sistemas de duas equações](../equacoes/sistemas-de-duas-equacoes): a
  eliminação e os três desfechos possíveis;
- [Composição de funções](../funcoes/composicao-de-funcoes) e [Função
  inversa](../funcoes/funcao-inversa): aplicar uma regra depois da outra, e
  desfazer uma regra;
- [Fórmula de Bhaskara](../equacoes/formula-de-bhaskara): ela volta na lição de
  autovalores.

Reative a base com quatro perguntas rápidas. As respostas estão logo abaixo de
cada uma.

1. Quanto vale o produto escalar $(3,\ 4) \cdot (2,\ -1)$?

   Multiplique cada par e some: $3 \times 2 + 4 \times (-1) = 6 - 4 = 2$. O
   resultado é um **número**, não um vetor.

2. Qual é o módulo do vetor $(3,\ 4)$?

   É o comprimento da seta, pela fórmula da distância:
   $\lVert (3,\ 4) \rVert = \sqrt{3^2 + 4^2} = \sqrt{25} = 5$.

3. Resolva o sistema $x + y = 10$ e $x - y = 4$.

   Somando as duas equações, o $y$ desaparece: $2x = 14$, então $x = 7$.
   Voltando à primeira, $7 + y = 10$, então $y = 3$.

4. Se $f(x) = 2x$ e $g(x) = x + 3$, quanto valem $f(g(1))$ e $g(f(1))$?

   $f(g(1)) = f(4) = 8$, mas $g(f(1)) = g(2) = 5$. A ordem em que as regras
   são aplicadas muda o resultado. Essa observação volta no produto de
   matrizes.

Se alguma dessas respostas não fez sentido, releia a lição correspondente antes
de começar.

## Um problema que acompanha o capítulo

Uma planilha tem uma linha por cliente e uma coluna por informação. Cada lição
faz uma pergunta diferente sobre tabelas como essa:

| Pergunta | Lição que responde |
|---|---|
| Quais dois clientes têm o gosto mais parecido? | Vetores com muitas coordenadas |
| Quanto cada loja gasta, dados os preços? | Matrizes |
| Que quantidade de cada ingrediente atinge as metas exatas? | Sistemas lineares |
| Alguma coluna é só uma mistura das outras? | Combinação linear; Base e posto |
| Para onde vai cada ponto de uma imagem girada? | Transformações lineares |
| O que acontece se a mesma regra for aplicada muitas vezes? | Autovalores |
| Qual reta passa mais perto de pontos que não estão alinhados? | Mínimos quadrados |
| Dá para guardar uma imagem com menos números? | Valores singulares |

Não escolha a técnica pela aparência da tabela. Primeiro diga em palavras o que
a pergunta pede: medir semelhança, calcular totais, achar quantidades
desconhecidas ou descobrir redundância.

## Roteiro das páginas

### Vetores e matrizes

1. [Vetores com muitas coordenadas](./vetores-com-muitas-coordenadas) —
   as contas da seta valem para listas de qualquer tamanho; distância e
   cosseno medem semelhanças diferentes.
2. [Matrizes e o produto de matriz por vetor](./matrizes) — a tabela de
   números, e as duas leituras de $A\vec{x}$: por linhas e por colunas.

### Sistemas e redundância

3. [Sistemas lineares e escalonamento](./sistemas-lineares-e-escalonamento) —
   a eliminação organizada para muitas equações e muitas incógnitas.
4. [Combinação linear e independência](./combinacao-linear-e-independencia)
   — o que se alcança misturando vetores, e quando um deles sobra.

### Matrizes como transformações

5. [Transformações lineares](./transformacoes-lineares) — girar, esticar e
   inclinar o plano inteiro com quatro números.
6. [Produto de matrizes](./produto-de-matrizes) — fazer duas transformações em
   sequência, e por que a ordem importa.
7. [Matriz inversa](./matriz-inversa) — a transformação que desfaz outra, e
   quando ela não existe.
8. [Determinante](./determinante) — o número que diz quanto a transformação
   multiplica as áreas.

### Estrutura e aplicações

9. [Base, dimensão e posto](./base-dimensao-e-posto) — quantas colunas de uma
   tabela carregam informação de verdade.
10. [Autovalores e autovetores](./autovalores-e-autovetores) — as direções que
    uma matriz só estica, e o que acontece depois de muitas aplicações.
11. [Mínimos quadrados](./minimos-quadrados) — a reta que erra menos, e o
    primeiro modelo de aprendizado de máquina.
12. [Decomposição em valores singulares](./decomposicao-em-valores-singulares)
    — toda matriz é girar, esticar e girar; compressão de dados.

Estude na ordem. As lições 5 a 8 formam um bloco: cada uma usa a imagem da
malha transformada da anterior. A última lição é a mais difícil do capítulo e
reúne quase todas as outras.

## Como o capítulo se sustenta

- O **produto escalar** da geometria vira a conta de cada linha de uma matriz
  vezes um vetor.
- O **escalonamento** é a ferramenta de trabalho: ele resolve sistemas, testa
  independência, calcula inversas, determinantes e o posto.
- A leitura de uma matriz como **transformação do plano** dá significado ao
  produto (fazer uma depois da outra), à inversa (desfazer) e ao determinante
  (o fator de área).
- A **projeção** da geometria vira o método dos mínimos quadrados, e os
  **autovalores** explicam o que sobra quando uma matriz é aplicada muitas
  vezes.

## Para onde isso leva

Ao terminar, você terá a álgebra linear que um curso de aprendizado de máquina
assume de antemão: vetores, matrizes, sistemas, transformações, autovalores,
mínimos quadrados e valores singulares.

Para estudar deep learning ainda faltam outras partes, que este curso não
cobre por enquanto:

- **cálculo de várias variáveis** — o gradiente e a regra da cadeia com
  várias variáveis, que é o que as redes usam para aprender. O
  [Cálculo 1](../calculo/calculo-1/) já ensina a regra da cadeia com uma
  variável;
- **probabilidade e estatística** — distribuições, média, variância e
  verossimilhança. A [análise combinatória](../analise-combinatoria/) dá só a
  introdução;
- **otimização** — como achar o menor erro quando não existe uma fórmula
  pronta.
