# Plano de implementação: capítulo de Cálculo 1

Este documento planeja o capítulo **9. Cálculo 1** do curso. Ele não é conteúdo
do site: fica fora de `docs/` e não participa do build. Serve como roteiro para
quem for escrever as lições, uma a uma, seguindo a skill `tutor-matematica`.

Data do plano: 3 de setembro de 2026.

## 1. Onde o capítulo entra

O curso hoje termina na **Revisão geral** (`docs/revisao-geral.md`), cuja última
seção, "Para onde isso leva", lista as quatro perguntas que ficaram em aberto:

| Pergunta deixada em aberto | Onde foi anunciada | Lição do novo capítulo que paga a promessa |
|---|---|---|
| Onde exatamente está o máximo do volume da caixa? | `funcoes/11-funcao-polinomial.mdx`, seção 8 ("o máximo verdadeiro fica em $x \approx 3{,}92$… exige derivada") | 9.17 Máximos e mínimos |
| Qual é a taxa de variação **num ponto**? | `funcoes/15-taxa-media-de-variacao.mdx`, seções 11 e 16 | 9.7 A derivada |
| Por que $e^x$ é igual à própria taxa de variação? | `exponenciais-e-logaritmos/02-decaimento-e-o-numero-e.mdx`, seção 7 | 9.13 Derivadas de exponencial e logaritmo |
| O que significa "aproximar-se sem alcançar"? | `funcoes/14-funcoes-racionais.mdx`, seções 3 e 7; `geometria/16-radianos.mdx`, "Por que o cálculo insiste em radianos" | 9.2 Limite de uma função; 9.6 Teorema do confronto |

A lição de taxa média fecha com a frase: "Falta uma única passagem — dizer com
rigor o que significa '$h$ se aproxima de zero' —, e é ela que o cálculo chama
de **limite**." O capítulo começa exatamente daí.

**Decisão de posição:** o capítulo entra **depois** da Revisão geral, como
capítulo 9. A Revisão é o portão de entrada ("Antes de avançar para o cálculo,
você deveria conseguir…"), e mantê-la antes preserva a numeração `8.` que já
existe na barra lateral e nos links. Nada precisa ser renumerado.

## 2. Escopo e o que fica de fora

O capítulo cobre o programa usual de Cálculo 1 no Brasil: limites e
continuidade, derivada e regras, aplicações da derivada, e a integral até o
Teorema Fundamental com substituição.

Fica **de fora**, para um eventual capítulo 10 (Cálculo 2): técnicas de
integração além da substituição (partes, frações parciais), integrais
impróprias, volumes por integração, séries e sequências. Também fica de fora a
definição de limite com $\varepsilon$ e $\delta$ como ferramenta de trabalho: ela
é apresentada em uma seção da lição 9.2, para que o aluno saiba que existe e
reconheça o valor absoluto que a Revisão geral prometeu, mas nenhum exercício
exige demonstrações com ela. O curso é de compreensão, não de análise.

Critério para qualquer corte adicional: o aluno é adulto autodidata sem
professor; **profundidade em menos lições vale mais que cobertura**. Se uma
lição do plano não couber em uma ideia central, divida; se duas ideias só estão
juntas por vizinhança, separe.

## 3. Estrutura de arquivos

```
docs/calculo/
  index.md                                        (id: calculo/index)
  01-limite-de-uma-funcao.mdx                     (id: calculo/limite-de-uma-funcao)
  02-calculo-de-limites.mdx
  03-limites-infinitos-e-no-infinito.mdx
  04-continuidade.mdx
  05-teorema-do-confronto.mdx
  06-a-derivada.mdx
  07-quando-a-derivada-nao-existe.mdx
  08-regras-de-derivacao.mdx
  09-regras-do-produto-e-do-quociente.mdx
  10-regra-da-cadeia.mdx
  11-derivadas-de-seno-e-cosseno.mdx
  12-derivadas-de-exponencial-e-logaritmo.mdx
  13-derivacao-implicita.mdx
  14-taxas-relacionadas.mdx
  15-sinal-da-derivada.mdx
  16-maximos-e-minimos.mdx
  17-teorema-do-valor-medio.mdx
  18-problemas-de-otimizacao.mdx
  19-segunda-derivada-e-concavidade.mdx
  20-esboco-de-graficos.mdx
  21-regra-de-lhopital.mdx
  22-a-integral-como-area.mdx
  23-a-integral-definida.mdx
  24-teorema-fundamental-do-calculo.mdx
  25-primitivas-e-substituicao.mdx
  26-area-entre-curvas.mdx
```

Lembretes técnicos que já quebraram builds antes (ver `CLAUDE.md`):

- o prefixo numérico **não** entra no id: em `sidebars.js` é
  `calculo/a-derivada`, nunca `calculo/06-a-derivada`;
- links relativos sem prefixo: `[A derivada](./a-derivada)`,
  `[Composição](../funcoes/composicao-de-funcoes)`;
- `.mdx` só onde há import de componente; a maioria das lições vai importar
  `CartesianPlane`, então `.mdx` é o padrão do capítulo; `index.md` fica `.md`;
- em `.mdx`, `{` e `<` no texto corrido precisam de escape (`\{`, `\<`); atenção
  redobrada aqui, porque "$h < 0$" e "$x \to 2^-$" aparecem muito, e o `<` só
  é seguro dentro de `$...$`;
- `R\$` nos problemas de dinheiro;
- notação da casa: `\times`, `\div`, `\lvert x \rvert`, `\ldots`, `\sen`, `\tg`.

## 4. Convenções de notação novas neste capítulo

Estas escolhas valem para o capítulo inteiro e devem ser registradas na seção
"Notação da casa" do `CLAUDE.md` quando a primeira lição for publicada:

| Ideia | Escreva | Não escreva |
|---|---|---|
| limite | `\lim_{x \to 2} f(x)` | `lim` sem barra, `x \rightarrow 2` |
| limite lateral | `x \to 2^{+}`, `x \to 2^{-}` | `x \to 2+` |
| infinito | `+\infty`, `-\infty` (já usado nos intervalos) | `\infty` sozinho no lugar de `+\infty` |
| derivada | `f'(x)` como notação principal; `\frac{dy}{dx}` apresentada em 9.7 e usada nas taxas relacionadas | `\dot{y}`, `D_x f` |
| segunda derivada | `f''(x)` | `f^{(2)}` |
| integral | `\int_a^b f(x)\,dx` (com o `\,` antes de `dx`) | `\int_a^b f(x) dx` |
| variação | `\Delta x`, já introduzido em `funcoes/15` | `dx` no lugar de `\Delta x` antes de 9.7 |

Macros: nenhuma nova é necessária. `\lim`, `\to`, `\infty`, `\int` e `\Delta`
já existem no KaTeX. Se uma lição precisar de `\dd` para o diferencial, a macro
entra em `src/katexMacros.js` e nada mais precisa mudar.

## 5. Componentes visuais

O `CartesianPlane` cobre a maior parte do capítulo: curva com buraco, secantes,
tangente, área sob a curva com `polygons`. Dois componentes novos se justificam
pelo critério da skill ("mexer no parâmetro é a ideia" ou "a figura não tem como
discordar da conta"):

### `TangentExplorer` (interativo)

Controle deslizante para $h$ que desenha a secante entre $(a, f(a))$ e
$(a+h, f(a+h))$ e mostra a inclinação calculada ao lado. Mexer em $h$ **é** a
ideia da lição 9.7. Modelo: `src/components/FunctionGraph` (usa JSXGraph, já é
dependência do projeto). Props: `f`, `a`, `hMin`, `hMax`, `expression` (LaTeX
da função para o rótulo). Usado em 9.7; opcionalmente em 9.2 com a função
$\frac{x^2-4}{x-2}$.

### `RiemannSum` (estático)

Recebe `f`, `a`, `b`, `n` e `method` (`'left'`, `'right'`, `'mid'`), desenha os
retângulos sobre o `CartesianPlane` e escreve a soma na legenda, **calculada a
partir dos parâmetros**, como o `FactorTree` faz com o número. Usado em 9.23,
9.24 e 9.27. Três tons: curva, retângulos abaixo da curva, excesso acima dela.

Ambos precisam de entrada em `src/components/README.md` (tabela "Qual usar" e
seção própria) antes de serem usados numa lição.

## 6. As lições

Cada bloco abaixo traz o que a skill exige decidir **antes** de escrever: a ideia
central única, o problema motivador de adulto, as ideias anteriores a reativar
(com a página onde estão), o modelo visual, os erros comuns a tratar de frente
e as contas que precisam ser conferidas com `python3`. Os rótulos `9.x` são os
da barra lateral.

### 9.1 Roteiro do capítulo — `index.md`

Segue o modelo de `docs/exponenciais-e-logaritmos/index.md`: a pergunta que
organiza o capítulo, "O que vem antes" com links, "Para que isso serve", roteiro
numerado das páginas e "O que vem depois".

A pergunta organizadora: **como medir uma quantidade que muda a cada instante?**
Dois problemas concretos abrem e fecham o capítulo: o velocímetro (dada a
posição, achar a velocidade num instante) e o seu inverso (dada a velocidade,
recuperar a distância percorrida). O primeiro é a derivada; o segundo é a
integral; o Teorema Fundamental diz que um desfaz o outro.

---

### Parte I — Limites e continuidade

#### 9.2 Limite de uma função — `01-limite-de-uma-funcao.mdx`

- **Ideia central:** o limite é o valor de que $f(x)$ se aproxima quando $x$ se
  aproxima de $a$, e esse valor **não depende** de $f(a)$ existir.
- **Motivador:** o quociente $\frac{(2+h)^2 - 4}{h}$ da lição de taxa média.
  Ele vale $4 + h$ para todo $h \neq 0$ e não existe em $h = 0$. Tabela com
  $h = 1$; $0{,}1$; $0{,}01$; $-0{,}01$ dando $5$; $4{,}1$; $4{,}01$; $3{,}99$.
  A pergunta: que número é esse 4, se a conta nunca chega nele?
- **Reativar:** quociente de diferenças (`funcoes/taxa-media-de-variacao`);
  buraco no gráfico de uma racional (`funcoes/funcoes-racionais`, seção 9);
  valor absoluto como distância (`numeros-e-operacoes/valor-absoluto`).
- **Visual:** `CartesianPlane` com a reta $y = x + 2$ e bola vazia em $(2, 4)$,
  para $\frac{x^2-4}{x-2}$; tabela de aproximação pelos dois lados.
- **Formalização:** notação $\lim_{x \to a} f(x) = L$; limites laterais; o limite
  existe quando os dois lados concordam. Exemplo: $\frac{x^2-4}{x-2}$ em 2.
  Contraexemplo: $\frac{\lvert x \rvert}{x}$ em 0, que dá $1$ de um lado e $-1$
  do outro.
- **Seção de honestidade:** "O que 'se aproxima' quer dizer com rigor" apresenta
  a definição com $\varepsilon$ e $\delta$ em linguagem de tolerância (a peça de
  3,5 cm com tolerância da Revisão geral), sem exercício de demonstração.
- **Erros comuns:** achar que limite é o valor da função; achar que o limite
  "nunca chega" e por isso "não existe"; substituir $x = a$ e parar quando dá
  $\frac{0}{0}$.
- **Conferir:** todas as tabelas de aproximação com `python3`.

#### 9.3 Calculando limites — `02-calculo-de-limites.mdx`

- **Ideia central:** quando a substituição direta dá $\frac{0}{0}$, a saída é
  reescrever a fração sem mudar o valor dela para $x \neq a$, e o curso já
  ensinou as três reescritas que resolvem quase todos os casos.
- **Motivador:** três limites que travam na substituição: um com fator comum,
  um com raiz, um com fração dentro de fração.
- **Reativar:** fatoração (`algebra/agrupamento-e-trinomios`), Briot-Ruffini
  (`funcoes/divisao-de-polinomios`), conjugado
  (`algebra/racionalizacao`), soma de frações algébricas
  (`algebra/operacoes-com-fracoes-algebricas`). Esta é a lição em que a
  Revisão geral disse que o conjugado "reaparece quase imediatamente".
- **Formalização:** propriedades do limite (soma, produto, quociente com
  denominador não nulo); substituição direta vale para polinômios e racionais no
  domínio; a regra anti-mágica se aplica com força ao cancelar $(x-a)$: o que
  muda na escrita, o que permanece na quantidade, e por que o cancelamento é
  legítimo justamente porque $x \neq a$.
- **Exemplos:** $\frac{x^2-4}{x-2}$; $\frac{\sqrt{4+h}-2}{h} \to \frac14$;
  $\frac{\frac{1}{a+h}-\frac{1}{a}}{h} \to -\frac{1}{a^2}$ (já apareceu no
  exercício 18 da taxa média, agora com nome).
- **Erros comuns:** "$\frac{0}{0} = 0$" ou "$= 1$"; cancelar parcelas em vez de
  fatores; esquecer de multiplicar numerador **e** denominador pelo conjugado.
- **Conferir:** cada limite numericamente com $h = 10^{-3}$ e $-10^{-3}$.

#### 9.4 Limites infinitos e no infinito — `03-limites-infinitos-e-no-infinito.mdx`

- **Ideia central:** "$\to +\infty$" descreve um comportamento, não um número; e
  as assíntotas das funções racionais são limites.
- **Motivador:** o custo médio $\frac{2400}{x} + 18$ da Revisão geral, que "nunca
  chega a 18"; agora isso se escreve $\lim_{x \to +\infty} C(x) = 18$.
- **Reativar:** assíntotas verticais e horizontais e comparação de graus
  (`funcoes/funcoes-racionais`, seções 6 e 7); crescimento da exponencial e do
  logaritmo (`exponenciais-e-logaritmos/funcao-logaritmica`).
- **Formalização:** limite infinito num ponto (assíntota vertical, com sinal de
  cada lado); limite no infinito (assíntota horizontal); técnica de dividir pelo
  maior grau; hierarquia de crescimento polinômio $<$ exponencial.
- **Erros comuns:** operar com $\infty$ como número ($\infty - \infty = 0$,
  $\frac{\infty}{\infty} = 1$); achar que a curva não pode cruzar a assíntota
  horizontal (a lição de racionais já avisa).
- **Conferir:** tabelas com $x = 10^2, 10^4, 10^6$.

#### 9.5 Continuidade — `04-continuidade.mdx`

- **Ideia central:** uma função é contínua em $a$ quando o limite existe e é
  igual a $f(a)$; e uma função contínua num intervalo não pula valores.
- **Motivador:** tarifa por faixa (função por partes com salto) contra
  temperatura de um forno (sem salto). Segundo problema: um polinômio de grau 3
  sem raiz racional — a lista de candidatos da lição de raízes racionais falha,
  e ainda assim dá para achar a raiz com a precisão que se quiser.
- **Reativar:** função por partes (`funcoes/funcao-modular-e-por-partes`);
  buraco e assíntota (`funcoes/funcoes-racionais`); raízes racionais
  (`funcoes/raizes-racionais`); intervalos (`equacoes/intervalos`).
- **Visual:** `CartesianPlane` com os três tipos de descontinuidade (buraco,
  salto, assíntota) lado a lado.
- **Formalização:** as três condições; polinômios, racionais, raízes,
  exponenciais, logaritmos e trigonométricas são contínuas no domínio;
  **Teorema do Valor Intermediário** com o método da bisseção como
  aplicação (tabela de 5 ou 6 passos).
- **Erros comuns:** "tem fórmula, logo é contínua" ($\frac{1}{x}$); achar que
  contínua significa "sem bico" (isso é derivabilidade, lição 9.8).
- **Conferir:** a bisseção inteira com `python3`, passo a passo.

#### 9.6 Teorema do confronto e o limite de $\frac{\sen x}{x}$ — `05-teorema-do-confronto.mdx`

- **Ideia central:** se uma função fica presa entre duas outras que vão para o
  mesmo valor, ela vai junto; e é assim que se prova o limite que a lição de
  radianos só tabelou.
- **Motivador:** a tabela de $\frac{\sen x}{x}$ de `geometria/radianos`, que
  tende a 1 sem justificativa. Prometeu-se que "a demonstração fica para o
  cálculo".
- **Reativar:** área do setor circular (`geometria/arco-e-setor-circular`),
  seno e tangente no ciclo (`geometria/ciclo-trigonometrico`), radianos.
- **Visual:** `UnitCircle` com o triângulo pequeno, o setor e o triângulo grande
  para $\sen x < x < \tg x$ — três tons, três regiões.
- **Formalização:** enunciado do confronto; a cadeia
  $\cos x < \frac{\sen x}{x} < 1$ e o limite; corolário
  $\lim_{x \to 0} \frac{1 - \cos x}{x} = 0$ (necessário em 9.12).
- **Erros comuns:** usar o resultado em graus; achar que
  $\frac{\sen x}{x} = \sen$ "cancelando o $x$".
- **Conferir:** tabela com $x = 0{,}5$; $0{,}1$; $0{,}01$ (valores 0,95885;
  0,99833; 0,99998).

---

### Parte II — A derivada

#### 9.7 A derivada — `06-a-derivada.mdx`

- **Ideia central:** a derivada em $a$ é o limite do quociente de diferenças, e
  ela é a inclinação da tangente e a taxa instantânea ao mesmo tempo.
- **Motivador:** o velocímetro de `funcoes/15`, resolvido agora com rigor:
  $s(t) = t^2$, $v(2) = \lim_{h \to 0} \frac{(2+h)^2 - 4}{h} = 4$.
- **Reativar:** quociente de diferenças e a figura das três secantes
  (`funcoes/taxa-media-de-variacao`, seções 9 e 11); equação da reta por um
  ponto e uma inclinação (`geometria/equacao-da-reta`).
- **Visual:** `TangentExplorer` com $f(x) = x^2$, $a = 2$. É a única figura
  interativa da Parte II, e o motivo é exatamente o critério da skill.
- **Formalização:** definição de $f'(a)$; a derivada como função $f'(x)$;
  notações $f'$ e $\frac{dy}{dx}$ (a segunda explicada como "$\Delta$ que
  encolheu"); derivadas **pela definição** de $c$, $x$, $x^2$, $x^3$,
  $\frac{1}{x}$ e $\sqrt{x}$; reta tangente.
- **Erros comuns:** esquecer o $h \to 0$ e entregar $2a + h$ como derivada;
  confundir $f'(a)$ com $f(a)$; achar que derivada é "a fórmula da tangente".
- **Conferir:** cada derivada pela definição, numericamente, com $h = 10^{-4}$.

#### 9.8 Quando a derivada não existe — `07-quando-a-derivada-nao-existe.mdx`

- **Ideia central:** derivável em $a$ exige tangente única; bico, tangente
  vertical e salto quebram isso; derivável implica contínua, mas não o
  contrário.
- **Motivador:** $\lvert x \rvert$ em 0 (o "V" de `funcoes/funcao-modular-e-por-partes`):
  o quociente dá $1$ pela direita e $-1$ pela esquerda.
- **Reativar:** função modular; $\sqrt{x}$ em 0
  (`funcoes/funcoes-potencia-e-radicais`); limites laterais (9.2).
- **Visual:** três `CartesianPlane`: bico, tangente vertical, salto.
- **Erros comuns:** "contínua, logo derivável"; achar que a derivada de
  $\lvert x \rvert$ em 0 é 0 "por simetria".
- Lição curta por natureza; não inflar.

#### 9.9 Regras de derivação: potência, constante e soma — `08-regras-de-derivacao.mdx`

- **Ideia central:** a derivada de $x^n$ é $n x^{n-1}$, e o motivo é o padrão
  de $(a+h)^n$ que os produtos notáveis já mostraram.
- **Motivador:** derivar um polinômio de grau 5 pela definição é insuportável;
  a lição deduz a regra a partir de $(a+h)^2$ e $(a+h)^3$ já expandidos em
  `algebra/produtos-notaveis`, e a estende.
- **Reativar:** quadrado e cubo da soma (`algebra/produtos-notaveis`);
  expoentes negativos e fracionários (`numeros-e-operacoes/expoentes-fracionarios`),
  para que a regra cubra $\frac{1}{x}$ e $\sqrt{x}$ e bata com 9.7.
- **Formalização:** potência, constante multiplicativa, soma e diferença;
  derivada de polinômio; comentário sobre $x^n$ com $n$ negativo e fracionário
  (aceito sem demonstração geral, verificado nos casos de 9.7).
- **Erros comuns:** derivada de constante como "1"; $(x^n)' = n x^n$;
  derivar $\sqrt{x}$ como $\frac{1}{2}\sqrt{x}$.
- **Conferir:** cada exemplo contra a derivada numérica.

#### 9.10 Regras do produto e do quociente — `09-regras-do-produto-e-do-quociente.mdx`

- **Ideia central:** a derivada de um produto **não** é o produto das
  derivadas, e o desenho de área diz o que é.
- **Motivador:** receita $= $ preço $\times$ quantidade, com os dois variando no
  tempo. Dobra o preço e dobra a quantidade: a receita quadruplica.
- **Reativar:** `AreaModel` da distributiva (`numeros-e-operacoes/operacoes-basicas`,
  `algebra/produtos-notaveis`). A variação de $f \times g$ é o "L" de área
  $f \cdot \Delta g + g \cdot \Delta f + \Delta f \cdot \Delta g$, e o cantinho
  $\Delta f \cdot \Delta g$ some no limite. É a figura de $(a+b)^2$ com outro
  significado, e o ganho didático está em dizer isso.
- **Visual:** `AreaModel` 2×2 com rótulos $f$, $\Delta f$, $g$, $\Delta g$.
- **Formalização:** regra do produto; regra do quociente deduzida do produto
  com $\frac{1}{g}$; exemplos com polinômio $\times$ raiz e com racionais.
- **Erros comuns:** $(fg)' = f'g'$; trocar a ordem no numerador do quociente.
- **Conferir:** numericamente, e a simplificação algébrica de cada quociente.

#### 9.11 Regra da cadeia — `10-regra-da-cadeia.mdx`

- **Ideia central:** a taxa de uma composição é o produto das taxas, porque
  cada camada multiplica a variação que recebe.
- **Motivador:** um balão inflando: o raio cresce 2 cm por segundo, e o volume
  cresce quanto? Ou a cadeia de unidades: reais por litro $\times$ litros por
  quilômetro $=$ reais por quilômetro.
- **Reativar:** composição de funções (`funcoes/composicao-de-funcoes`), com o
  `FunctionMachine` de duas etapas; volume da esfera
  (`geometria/volumes-e-superficies`). A Revisão geral prometeu que "a
  composição de funções… a regra da cadeia deriva".
- **Visual:** `FunctionMachine` com as taxas escritas sobre cada seta.
- **Formalização:** $(f \circ g)' = f'(g(x)) \cdot g'(x)$; forma
  $\frac{dy}{dx} = \frac{dy}{du}\frac{du}{dx}$; potência de função;
  encadeamento de três funções.
- **Erros comuns:** esquecer a derivada de dentro; derivar "de dentro para
  fora" e trocar os papéis; aplicar em $\sen(x^2)$ como se fosse $(\sen x)^2$.
- **Conferir:** numericamente cada exemplo.

#### 9.12 Derivadas de seno e cosseno — `11-derivadas-de-seno-e-cosseno.mdx`

- **Ideia central:** $(\sen x)' = \cos x$ e $(\cos x)' = -\sen x$, e a prova
  usa a soma de arcos e o limite da lição 9.6.
- **Motivador:** a maré $h(t) = 2 + 1{,}5\,\sen(\frac{\pi t}{6})$ da Revisão
  geral: em que ritmo a água sobe às 3 h?
- **Reativar:** fórmula de $\sen(a+b)$ (`geometria/soma-diferenca-e-arco-duplo`);
  os gráficos de seno e cosseno (`geometria/graficos-seno-e-cosseno`), para
  ler a derivada no desenho antes de calcular; radianos.
- **Visual:** dois `CartesianPlane` empilhados: $\sen x$ em cima, e a
  inclinação dele lida ponto a ponto embaixo, que desenha $\cos x$.
- **Formalização:** as duas derivadas com demonstração; tangente e as demais
  pelo quociente; com a cadeia, $\sen(kx)$ e o porquê do $k$ na frente.
- **Erros comuns:** sinal de $(\cos x)'$; usar graus (o resultado sai com
  $\frac{\pi}{180}$ pendurado, como `geometria/radianos` anunciou).
- **Conferir:** maré: $h'(3) = 1{,}5 \times \frac{\pi}{6} \times \cos(\frac{\pi}{2}) = 0$
  — a maré está no máximo às 3 h, o que bate com a resposta 12b da Revisão.

#### 9.13 Derivadas de exponencial e logaritmo — `12-derivadas-de-exponencial-e-logaritmo.mdx`

- **Ideia central:** $e$ é a base cuja exponencial tem derivada igual a si
  mesma, e o logaritmo natural herda $\frac{1}{x}$ por ser a inversa.
- **Motivador:** a promessa da lição do número $e$: "a segunda razão só se
  explica no cálculo". Tabela de $\frac{e^h - 1}{h}$ para $h = 0{,}1$ e
  $0{,}001$ (1,05171 e 1,0005), contra a mesma tabela com base 2 e base 3.
- **Reativar:** propriedade $a^{x+h} = a^x a^h$ (`numeros-e-operacoes/potencias`);
  função inversa e reflexão na reta $y = x$ (`funcoes/funcao-inversa`);
  mudança de base (`exponenciais-e-logaritmos/propriedades-do-logaritmo`).
- **Formalização:** $(e^x)' = e^x$; $(a^x)' = a^x \ln a$ via $a^x = e^{x \ln a}$
  e cadeia; $(\ln x)' = \frac{1}{x}$ pela inversa; $\log_b x$ por mudança de
  base; crescimento contínuo $e^{kt}$ e o significado de $k$.
- **Erros comuns:** $(e^x)' = x e^{x-1}$ (aplicar a regra da potência com a
  variável no expoente); $(\ln x)' = \ln x$.
- **Conferir:** tabelas com `python3`, incluindo $\ln 2 \approx 0{,}693$.

#### 9.14 Derivação implícita — `13-derivacao-implicita.mdx`

- **Ideia central:** dá para derivar uma relação sem isolar $y$, tratando $y$
  como função de $x$ e usando a cadeia.
- **Motivador:** a tangente a uma circunferência num ponto: isolar $y$ dá duas
  raízes e uma conta pesada; derivar direto dá $-\frac{x}{y}$ em uma linha.
- **Reativar:** equação da circunferência (`geometria/circunferencia-e-parabola`);
  reta perpendicular ao raio (`geometria/paralelas-e-perpendiculares`) como
  verificação geométrica; regra da cadeia (9.11).
- **Formalização:** o método; derivadas de $\arcsen$ e $\arctg$ como
  aplicação (as inversas de `geometria/funcoes-trigonometricas-inversas`);
  justificativa da regra da potência com expoente racional.
- **Erros comuns:** derivar $y^2$ como $2y$ sem o $y'$; esquecer que a
  tangente depende do ponto, não só de $x$.

---

### Parte III — Aplicações da derivada

#### 9.15 Taxas relacionadas — `14-taxas-relacionadas.mdx`

- **Ideia central:** quando duas grandezas estão ligadas por uma equação, suas
  taxas no tempo também estão, e a cadeia é o que as liga.
- **Motivador:** a escada de 5 m escorregando com a base afastando-se a
  0,5 m/s: quando a base está a 3 m, o topo desce a 0,375 m/s.
- **Reativar:** Pitágoras (`geometria/teorema-de-pitagoras`); volume do cone
  (`geometria/volumes-e-superficies`); semelhança para o tanque cônico
  (`geometria/semelhanca`).
- **Visual:** `GeoFigure` da escada com as duas cotas e as setas de
  movimento.
- **Formalização:** o roteiro de cinco passos (desenhar, nomear, relacionar,
  derivar em $t$, substituir), com ênfase em **derivar antes de substituir**.
- **Erros comuns:** substituir o valor numérico antes de derivar (a taxa some);
  errar a unidade da resposta.
- **Conferir:** escada, tanque cônico e balão com `python3`.

#### 9.16 O sinal da derivada — `15-sinal-da-derivada.mdx`

- **Ideia central:** onde $f' > 0$ a função sobe, onde $f' < 0$ ela desce, e o
  quadro de sinais das inequações é a ferramenta para descobrir onde.
- **Motivador:** o lucro da serigrafia de `funcoes/crescimento-sinal-e-simetria`,
  agora com fórmula: em que faixa de produção o lucro ainda está subindo?
- **Reativar:** crescente e decrescente pelo gráfico
  (`funcoes/crescimento-sinal-e-simetria`); quadro de sinais
  (`equacoes/inequacoes-do-segundo-grau`); fatoração de polinômio
  (`funcoes/raizes-racionais`).
- **Visual:** `CartesianPlane` com $f$ e $f'$ empilhadas e as faixas de sinal
  marcadas com `NumberLine` com `spans`.
- **Formalização:** ponto crítico; intervalos de crescimento; a justificativa
  completa fica para 9.18, e o texto diz isso.
- **Erros comuns:** achar que $f'(a) = 0$ garante máximo ou mínimo ($x^3$ em
  0); esquecer os pontos onde $f'$ não existe ao montar o quadro.

#### 9.17 Máximos e mínimos — `16-maximos-e-minimos.mdx`

- **Ideia central:** os candidatos a extremo são os pontos críticos e as
  pontas do intervalo; o sinal da derivada decide quem é máximo e quem é
  mínimo.
- **Motivador:** a caixa de 30 cm por 20 cm, pela terceira vez no curso. Agora
  o corte ótimo sai com exatidão: $V'(x) = 12x^2 - 200x + 600 = 0$ dá
  $x \approx 3{,}924$ cm e $V \approx 1056{,}31$ cm³. É a promessa da lição
  de polinômios sendo paga.
- **Reativar:** o gráfico da caixa (`funcoes/funcao-polinomial`, seção 8);
  fórmula de Bhaskara (`equacoes/formula-de-bhaskara`); vértice da parábola
  (`funcoes/funcao-quadratica`), agora reobtido por derivada.
- **Formalização:** máximo e mínimo local e global; teste da primeira derivada;
  extremos num intervalo fechado (Teorema de Weierstrass enunciado, não
  provado); o vértice $x_v = -\frac{b}{2a}$ recuperado de $f'(x) = 0$.
- **Erros comuns:** esquecer as pontas do intervalo; descartar um ponto
  crítico onde $f'$ não existe; confundir "maior valor" com "ponto onde
  ocorre".
- **Conferir:** caixa (raízes de $V'$ e o valor de $V$) e cada exemplo.

#### 9.18 O teorema do valor médio — `17-teorema-do-valor-medio.mdx`

- **Ideia central:** entre dois pontos, sempre há um instante em que a taxa
  instantânea é igual à taxa média do trecho; é isso que autoriza "sinal da
  derivada decide o crescimento".
- **Motivador:** dois radares a 10 km de distância registram o mesmo carro com
  6 minutos de intervalo. A média foi 100 km/h. A multa por excesso é
  justa mesmo sem ninguém ter visto o velocímetro? O teorema diz que sim.
- **Reativar:** o fato da parábola em `funcoes/taxa-media-de-variacao`, seção 8
  (a média entre $a$ e $b$ é igual à instantânea no ponto médio) e o exercício
  24 da mesma lição, que mostrou que isso falha em $x^3$. O TVM diz o que
  sobrevive: o ponto existe, só não é o do meio.
- **Visual:** `CartesianPlane` com a secante e a tangente paralela a ela.
- **Formalização:** Rolle e TVM (enunciados, com a ideia da prova); corolários:
  $f' = 0$ em intervalo implica constante; $f' > 0$ implica crescente. Fecha a
  pendência declarada em 9.16.
- Lição de justificativa; pode ser mais curta.

#### 9.19 Problemas de otimização — `18-problemas-de-otimizacao.mdx`

- **Ideia central:** modelar a grandeza a otimizar como função de uma variável
  só, usando a restrição para eliminar a outra, e então aplicar 9.17.
- **Motivador:** a lata de 1 litro com menor superfície:
  $S(r) = 2\pi r^2 + \frac{2000}{r}$, mínimo em $r \approx 5{,}42$ cm e
  $h \approx 10{,}84$ cm, ou seja, altura igual ao diâmetro.
- **Reativar:** área e volume do cilindro (`geometria/volumes-e-superficies`);
  perímetro e área (`geometria/areas-de-poligonos`); sistemas de duas equações
  (`equacoes/sistemas-de-duas-equacoes`) para a restrição; domínio do problema
  aplicado (`funcoes/dominio-e-imagem`).
- **Formalização:** roteiro (desenhar, nomear, escrever a função e a restrição,
  reduzir a uma variável, domínio, derivar, testar candidatos, responder a
  pergunta feita). Exemplos: cerca com um lado no rio, lucro máximo com preço
  variável, ponto mais próximo de uma curva.
- **Erros comuns:** otimizar a função errada (área em vez de custo); esquecer o
  domínio e aceitar lado negativo; parar em $f' = 0$ sem verificar que é o
  extremo pedido.
- **Conferir:** todos os ótimos com `python3`.

#### 9.20 Segunda derivada e concavidade — `19-segunda-derivada-e-concavidade.mdx`

- **Ideia central:** a derivada da derivada diz se a inclinação está aumentando
  ou diminuindo, e isso é a concavidade do gráfico.
- **Motivador:** aceleração: o velocímetro subindo cada vez mais depressa. E os
  dois crescimentos do capítulo de exponenciais: o logaritmo "cresce sem
  limite, mas cada vez mais devagar" é uma frase sobre a segunda derivada.
- **Reativar:** concavidade da parábola pelo sinal de $a$
  (`funcoes/funcao-quadratica`); aceleração e a tabela do velocímetro
  (`funcoes/taxa-media-de-variacao`).
- **Formalização:** $f''$; concavidade para cima e para baixo; ponto de
  inflexão; teste da segunda derivada e quando ele falha ($x^4$ em 0).
- **Erros comuns:** "$f'' = 0$ implica inflexão"; confundir concavidade com
  crescimento (uma função pode subir com concavidade para baixo).

#### 9.21 Esboço de gráficos — `20-esboco-de-graficos.mdx`

- **Ideia central:** reunir domínio, assíntotas, sinal de $f'$ e sinal de
  $f''$ num roteiro que desenha qualquer função sem plotar pontos.
- **Motivador:** uma racional que o roteiro de `funcoes/funcoes-racionais`,
  seção 10, esboçava "aproximadamente"; agora o máximo local e a inflexão saem
  com exatidão.
- **Reativar:** o roteiro de esboço das racionais; transformações de gráficos
  (`funcoes/transformacoes-de-graficos`).
- **Formalização:** o roteiro em oito passos e três exemplos completos
  (polinômio de grau 3, racional com assíntota oblíqua, $x e^{-x}$).
- Lição de síntese: nada de definição nova, tudo de exercício.

#### 9.22 Regra de L'Hôpital — `21-regra-de-lhopital.mdx`

- **Ideia central:** num limite $\frac{0}{0}$ ou $\frac{\infty}{\infty}$, o
  quociente das derivadas tem o mesmo limite, e a razão é a aproximação linear
  de cada função perto do ponto.
- **Motivador:** $\lim_{x \to 0} \frac{e^x - 1}{x}$ de 9.13 e
  $\lim_{x \to +\infty} \frac{x}{e^x}$, a hierarquia de crescimento de 9.4
  finalmente demonstrada.
- **Erros comuns:** aplicar sem verificar a indeterminação; derivar o quociente
  (regra do quociente) em vez de numerador e denominador separadamente.
- **Prioridade baixa:** o capítulo fica coerente sem ela. Escrever por último
  na Parte III.

---

### Parte IV — A integral

#### 9.23 A integral como área — `22-a-integral-como-area.mdx`

- **Ideia central:** a distância percorrida é a área sob o gráfico da
  velocidade, e uma área curva se mede por retângulos cada vez mais finos.
- **Motivador:** o velocímetro ao contrário. O painel registra $v(t) = 2t$ m/s.
  Quanto o carro andou em 3 s? Com velocidade constante seria base $\times$
  altura; com velocidade variável, a área do triângulo dá 9 m, e a posição
  $s(t) = t^2$ da primeira lição do capítulo confirma. Depois, $v(t) = t^2$,
  em que não há fórmula de área pronta.
- **Reativar:** área de retângulo, triângulo e figuras compostas
  (`geometria/areas-de-poligonos`, `geometria/figuras-compostas`); taxa média
  e o velocímetro (`funcoes/taxa-media-de-variacao`); o processo de "aproximar
  sem alcançar" de 9.2.
- **Visual:** `RiemannSum` com $f(t) = t^2$ em $[0, 3]$, $n = 10$: soma pela
  esquerda 7,695, pela direita 10,395, valor exato 9. Tabela com $n = 10, 100,
  1000$.
- **Formalização:** soma de Riemann; a integral como limite das somas; a
  notação $\int_a^b f(x)\,dx$ explicada símbolo por símbolo (o $\int$ é um S
  de soma alongado, o $dx$ é o $\Delta x$ que encolheu).
- **Erros comuns:** achar que a soma pela esquerda "está errada" (ela é uma
  aproximação, com erro que se controla); esquecer de multiplicar pela largura.
- **Conferir:** todas as somas com `python3`, para vários $n$.

#### 9.24 A integral definida — `23-a-integral-definida.mdx`

- **Ideia central:** a integral é área **com sinal**, e as propriedades dela
  (soma, constante, divisão do intervalo, inversão dos limites) vêm direto do
  desenho.
- **Motivador:** a velocidade fica negativa quando o carro dá ré. A integral de
  $v$ dá o deslocamento; a integral de $\lvert v \rvert$ dá a distância. As duas
  perguntas têm respostas diferentes, e o sinal é o que as separa.
- **Reativar:** valor absoluto (`numeros-e-operacoes/valor-absoluto`); sinal de
  uma função (`funcoes/crescimento-sinal-e-simetria`); função par e ímpar, para
  as integrais simétricas.
- **Visual:** `RiemannSum` com região abaixo do eixo em outro tom.
- **Erros comuns:** somar áreas quando a pergunta é deslocamento e vice-versa;
  $\int_a^b + \int_b^c \neq \int_a^c$ quando os limites estão trocados.

#### 9.25 O teorema fundamental do cálculo — `24-teorema-fundamental-do-calculo.mdx`

- **Ideia central:** derivar e integrar se desfazem, e por isso a área sob
  $f$ se calcula achando uma função cuja derivada é $f$.
- **Motivador:** a integral de $t^2$ de 0 a 3, que 9.23 só aproximou. A
  função $\frac{t^3}{3}$ tem derivada $t^2$; $\frac{27}{3} - 0 = 9$. Uma linha
  no lugar de mil retângulos.
- **Reativar:** operação inversa (`numeros-e-operacoes/raizes`,
  `funcoes/funcao-inversa`), com o `FunctionMachine` de ida e volta; todas as
  derivadas da Parte II, lidas de trás para a frente.
- **Visual:** `CartesianPlane` com a função área $A(x) = \int_0^x f(t)\,dt$ e
  a faixa fina $A(x+h) - A(x) \approx f(x) \cdot h$, que é a ideia da prova.
- **Formalização:** primitiva; as duas partes do teorema, com a ideia da prova
  da primeira; notação $F(b) - F(a)$; a constante $C$ e por que ela some na
  integral definida.
- **Erros comuns:** esquecer o $+C$ na primitiva e depois "descobrir" que
  faltava; trocar os limites; primitiva de $\frac{1}{x}$ como $\frac{x^0}{0}$.
- **Conferir:** cada integral por primitiva e por soma de Riemann com
  $n = 10^4$, e os dois resultados têm que concordar.

#### 9.26 Primitivas e substituição — `25-primitivas-e-substituicao.mdx`

- **Ideia central:** a tabela de primitivas é a tabela de derivadas lida ao
  contrário, e a substituição é a regra da cadeia lida ao contrário.
- **Motivador:** $\int 2x\,e^{x^2}\,dx$: nenhuma linha da tabela serve, mas a
  cadeia de 9.11 reconhece $e^{u}$ com $u = x^2$ e $du = 2x\,dx$.
- **Reativar:** regra da cadeia (9.11); composição de funções; a tabela de
  derivadas da Parte II.
- **Formalização:** tabela de primitivas (potência, $\frac{1}{x}$, $e^x$,
  $\sen$, $\cos$); substituição com mudança dos limites na integral definida;
  o teste "a derivada de dentro está multiplicando?".
- **Erros comuns:** esquecer de trocar os limites ao substituir; "substituir"
  quando a derivada de dentro não está presente; primitiva de $x^{-1}$ pela
  regra da potência.
- **Conferir:** cada integral numericamente.

#### 9.27 Área entre curvas — `26-area-entre-curvas.mdx`

- **Ideia central:** a área entre duas curvas é a integral da diferença, e a
  ordem (de cima menos de baixo) e os pontos de cruzamento decidem a conta.
- **Motivador:** receita e custo como funções da produção; a área entre as
  duas curvas num intervalo é o lucro acumulado.
- **Reativar:** achar os pontos de cruzamento é resolver $f(x) = g(x)$
  (`equacoes/`), o fio que atravessa o curso inteiro; sistemas de equações.
- **Visual:** `RiemannSum` ou `CartesianPlane` com a região sombreada por
  `polygons`.
- **Erros comuns:** integrar $f - g$ sem verificar qual está em cima em cada
  trecho; esquecer um ponto de cruzamento no meio do intervalo.
- Fecha o capítulo e o curso: a Revisão curta desta lição diz o que Cálculo 2
  faria a seguir.

## 7. Barra lateral e páginas que precisam de edição

### `sidebars.js`

Nova categoria depois da entrada `revisao-geral`:

```js
{
  type: 'category',
  label: '9. Cálculo 1',
  link: {type: 'doc', id: 'calculo/index'},
  items: [
    {type: 'doc', id: 'calculo/index', label: '9.1 Roteiro do capítulo'},
    {type: 'doc', id: 'calculo/limite-de-uma-funcao', label: '9.2 Limite de uma função'},
    {type: 'doc', id: 'calculo/calculo-de-limites', label: '9.3 Calculando limites'},
    {type: 'doc', id: 'calculo/limites-infinitos-e-no-infinito', label: '9.4 Limites infinitos e no infinito'},
    {type: 'doc', id: 'calculo/continuidade', label: '9.5 Continuidade'},
    {type: 'doc', id: 'calculo/teorema-do-confronto', label: '9.6 Teorema do confronto'},
    {type: 'doc', id: 'calculo/a-derivada', label: '9.7 A derivada'},
    {type: 'doc', id: 'calculo/quando-a-derivada-nao-existe', label: '9.8 Quando a derivada não existe'},
    {type: 'doc', id: 'calculo/regras-de-derivacao', label: '9.9 Regras de derivação'},
    {type: 'doc', id: 'calculo/regras-do-produto-e-do-quociente', label: '9.10 Produto e quociente'},
    {type: 'doc', id: 'calculo/regra-da-cadeia', label: '9.11 Regra da cadeia'},
    {type: 'doc', id: 'calculo/derivadas-de-seno-e-cosseno', label: '9.12 Derivadas de seno e cosseno'},
    {type: 'doc', id: 'calculo/derivadas-de-exponencial-e-logaritmo', label: '9.13 Exponencial e logaritmo'},
    {type: 'doc', id: 'calculo/derivacao-implicita', label: '9.14 Derivação implícita'},
    {type: 'doc', id: 'calculo/taxas-relacionadas', label: '9.15 Taxas relacionadas'},
    {type: 'doc', id: 'calculo/sinal-da-derivada', label: '9.16 O sinal da derivada'},
    {type: 'doc', id: 'calculo/maximos-e-minimos', label: '9.17 Máximos e mínimos'},
    {type: 'doc', id: 'calculo/teorema-do-valor-medio', label: '9.18 Teorema do valor médio'},
    {type: 'doc', id: 'calculo/problemas-de-otimizacao', label: '9.19 Problemas de otimização'},
    {type: 'doc', id: 'calculo/segunda-derivada-e-concavidade', label: '9.20 Segunda derivada e concavidade'},
    {type: 'doc', id: 'calculo/esboco-de-graficos', label: '9.21 Esboço de gráficos'},
    {type: 'doc', id: 'calculo/regra-de-lhopital', label: "9.22 Regra de L'Hôpital"},
    {type: 'doc', id: 'calculo/a-integral-como-area', label: '9.23 A integral como área'},
    {type: 'doc', id: 'calculo/a-integral-definida', label: '9.24 A integral definida'},
    {type: 'doc', id: 'calculo/teorema-fundamental-do-calculo', label: '9.25 Teorema fundamental'},
    {type: 'doc', id: 'calculo/primitivas-e-substituicao', label: '9.26 Primitivas e substituição'},
    {type: 'doc', id: 'calculo/area-entre-curvas', label: '9.27 Área entre curvas'},
  ],
},
```

Os itens entram na barra **à medida que as lições ficam prontas**, não todos de
uma vez: uma entrada apontando para arquivo inexistente derruba o build. Os
rótulos `9.x` são escritos à mão; ao inserir ou remover uma lição, renumerar
os seguintes.

### Páginas existentes a ajustar (diff mínimo)

- `docs/intro.md`: acrescentar o item 9 na "Ordem recomendada de estudo" e
  trocar a frase final "cobre o que um curso de cálculo assume de antemão" por
  uma que diga que o capítulo 9 é esse curso.
- `docs/revisao-geral.md`, seção "Para onde isso leva": cada uma das quatro
  perguntas ganha o link para a lição que a responde.
- `docs/funcoes/15-taxa-media-de-variacao.mdx`, último parágrafo: link para
  `../calculo/limite-de-uma-funcao`.
- `docs/funcoes/11-funcao-polinomial.mdx`, seção 8: link para
  `../calculo/maximos-e-minimos` na frase "é trabalho do cálculo".
- `docs/exponenciais-e-logaritmos/02-decaimento-e-o-numero-e.mdx`, seção 7:
  link para `../calculo/derivadas-de-exponencial-e-logaritmo`.
- `docs/geometria/16-radianos.mdx`, "Por que o cálculo insiste em radianos":
  link para `../calculo/teorema-do-confronto`.
- `docs/funcoes/index.md` e `docs/exponenciais-e-logaritmos/index.md`: as
  frases "que um curso de cálculo assume de antemão" viram links para
  `../calculo/`.
- `CLAUDE.md`: a linha de estrutura (`matematica-basica/`, `funcoes/`,
  `historia/`) está desatualizada; acrescentar `calculo/` e a notação nova da
  seção 4 deste plano.

Esses links só podem ser criados **depois** que a lição-alvo existir, senão
`onBrokenLinks: 'throw'` quebra o build. Fazê-los na mesma entrega da lição.

## 8. Ordem de entrega

Cada fase termina com o build passando e o site publicável. A dependência entre
lições é linear dentro de cada parte; entre as partes, a Parte IV depende só de
9.9 a 9.13 (as derivadas que viram primitivas).

| Fase | Entrega | Lições | Componentes |
|---|---|---|---|
| 0 | infraestrutura | `index.md`, categoria na barra lateral, `TangentExplorer`, `RiemannSum`, README dos componentes, notação no `CLAUDE.md` | 2 novos |
| 1 | limites e continuidade | 9.2 a 9.6 | `CartesianPlane`, `UnitCircle` |
| 2 | a derivada e as regras | 9.7 a 9.14 | `TangentExplorer`, `AreaModel`, `FunctionMachine` |
| 3 | aplicações | 9.15 a 9.21, depois 9.22 | `GeoFigure`, `NumberLine` |
| 4 | integral | 9.23 a 9.27 | `RiemannSum` |
| 5 | costura | links de volta nas páginas antigas, item 9 do `intro.md`, "Para onde isso leva" da Revisão | — |

A fase 0 pode ser feita num único commit. Cada lição das fases 1 a 4 é um commit
próprio, com mensagem em português, no imperativo, descrevendo o ganho
pedagógico: `Ensina o limite como o valor de que a função se aproxima`.

Estimativa de tamanho: as lições-modelo do repositório têm entre 700 e 1000
linhas, e as de aplicação (9.19, 9.21) tendem ao teto. As de justificativa
(9.8, 9.18) e a de L'Hôpital ficam abaixo de 600. Não há alvo de linhas; o
critério é a estrutura da skill aplicada por inteiro.

## 9. Roteiro por lição

Sequência para cada página, na ordem, sem pular:

1. **Ler a lição anterior e a seguinte** (skill: "Antes de editar"), mais as
   páginas listadas em "Reativar" do bloco correspondente deste plano.
2. Responder as quatro perguntas da continuidade por escrito, no topo do
   rascunho, antes de escrever a lição.
3. Escrever seguindo a estrutura de doze etapas de `escrever-licao.md`, com
   títulos descritivos e numerados, como em `funcoes/15`.
4. **Conferir toda conta com `python3`.** Não há `sympy` instalado; derivadas e
   integrais se conferem numericamente:
   ```bash
   python3 -c "f=lambda x: x**3-2*x; h=1e-6; a=2; print((f(a+h)-f(a-h))/(2*h))"
   python3 -c "f=lambda x: x*x; a,b,n=0,3,10**5; w=(b-a)/n; print(sum(f(a+(i+.5)*w)*w for i in range(n)))"
   ```
   Limites se conferem com tabela de $h = 10^{-2}, 10^{-3}, 10^{-4}$ pelos dois
   lados. Se o valor "exato" do gabarito e o numérico discordarem além de
   $10^{-4}$, o gabarito está errado até prova em contrário.
5. Passada de linguagem: as cinco regras da seção "Linguagem", uma varredura
   por vez. Neste capítulo, vigiar em especial "tende a", "vai para" e
   "no limite" usados sem explicação, e o "basta derivar" que esconde a
   regra anti-mágica.
6. `npm run build` (com `NODE_OPTIONS=--max-old-space-size=6144` se estourar o
   heap depois de alguns builds seguidos).
7. Conferir cada figura **na página renderizada**, nos temas claro e escuro e a
   390 px de largura, pelo procedimento de screenshot já documentado na memória
   do projeto. O `TangentExplorer` precisa ser testado também com o mouse,
   porque o headless não arrasta o controle.
8. Adicionar a entrada em `sidebars.js` e os links de volta que dependem só
   desta lição.
9. Checklist técnico do `CLAUDE.md` e checklist didático da skill.
10. Commit.

## 10. Riscos e decisões pendentes

- **Rigor sem análise.** A definição $\varepsilon$–$\delta$ aparece como
  seção, não como ferramenta. Se o aluno pedir demonstrações formais, o lugar
  é um capítulo futuro, não inflar 9.2.
- **Tamanho da Parte II.** Oito lições de derivada é muito; o critério de
  "uma ideia central por página" foi aplicado, mas se 9.8 e 9.14 ficarem
  curtas demais para justificar uma página, a alternativa é 9.8 virar seção
  final de 9.7 e 9.14 virar seção de 9.11. Decidir ao escrever 9.7, não antes.
- **JSXGraph no `TangentExplorer`.** O `FunctionGraph` carrega a biblioteca
  por `import()` dinâmico, e o componente novo deve copiar esse padrão para
  não quebrar o build estático. Se der problema de tema escuro (o
  `FunctionGraph` usa cor fixa `#1f6feb`), resolver ali antes de replicar.
- **Aceleração e física.** As lições usam velocidade e aceleração como
  contexto, mas o curso não tem página de física. Manter tudo em "metros por
  segundo" e "metros por segundo a cada segundo", explicando a unidade
  composta como `funcoes/15` fez com m/s.
- **Onde parar.** 9.27 é o fim proposto. Volumes por integração, integração
  por partes e frações parciais são Cálculo 2 e não entram aqui, mesmo que
  pareça pouco esforço acrescentar.
