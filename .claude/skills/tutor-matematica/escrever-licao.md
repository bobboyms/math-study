# Escrever ou revisar uma lição

Complementa o `SKILL.md` — perfil do aluno, princípios, continuidade, regra
anti-mágica, erros comuns e estilo continuam valendo aqui. Este arquivo cobre só
o que é específico de produzir uma página em `docs/`.

## Conteúdo

- Antes de editar
- Estrutura de uma lição
- Como apresentar uma ideia
- Linguagem
- Recursos visuais
- Exercícios e gabarito
- Tamanho e escopo
- Revisão de lições existentes
- Checklist didático

## Antes de editar

A maior parte do trabalho é melhorar lições que já existem, não criar novas.

**Leia a lição anterior e a seguinte** antes de mexer numa página: é a única
forma de saber o que já foi ensinado e o que virá — e as quatro perguntas da
continuidade não têm resposta sem isso.

## Estrutura de uma lição

A ordem mental abaixo deve ser respeitada. Os títulos não precisam ser
literalmente estes — a lição-modelo usa títulos descritivos, como "Múltiplos:
resultados de uma contagem em saltos iguais", que funcionam melhor que rótulos
genéricos.

1. **Problema motivador, com figura** — uma situação concreta que torna o
   conceito necessário, antes de qualquer definição, e **desenhada**: o aluno
   precisa ver a situação, não só ler sobre ela. Quando a situação tem
   movimento (algo gira, enche, desliza), a figura mostra o movimento. A lição
   **volta e resolve este problema** assim que a ferramenta fica pronta: a
   ideia precisa pagar o que prometeu na abertura.
2. **Roteiro** — a sequência das ideias que a lição vai construir, uma frase
   cada, na ordem em que aparecem ("1 radiano é o raio colado na borda";
   "retângulos de mesma altura se juntam num só: a altura sai em evidência").
   **Não é glossário**: definição formal no topo da página quebra a ordem
   concreto → abstrato antes de a lição começar.
3. **Uso** — onde a ideia aparece na prática e dentro da própria matemática,
   **cada uso com um caso numérico curto** ("um motor a 1 800 rpm gira a
   $\approx 188{,}5$ rad/s"; "três notas de R\$ 200, 340 e 460 com o mesmo
   imposto de 15%: $0{,}15 \times 1\,000 = 150$"). "Física" ou "planilhas"
   soltos numa lista não mostram nada.
4. **Ideias anteriores que voltam aqui** — nomeadas explicitamente, com link
   para a página onde foram estudadas, e **reativadas** com duas ou três
   perguntas rápidas de resgate, respondidas ali mesmo. Citar não basta: o
   aluno precisa trazer o bloco anterior de volta à memória antes de usá-lo —
   e descobrir agora, não no meio da lição, se precisa reler a página antiga.
5. **Uma seção por ideia** — o corpo da lição é a sequência de ideias do
   roteiro, cada uma na sua seção, e cada seção percorre por dentro o ciclo
   concreto → figura → símbolo:
   - **título que afirma a ideia** ("Um radiano: o raio colado na borda";
     "Numa fração, só se cancela fator, nunca parcela"), não um rótulo
     ("Definição", "Propriedades");
   - **intuição** em linguagem comum, sem símbolos;
   - **figura** da ideia (ver Recursos visuais);
   - **ponte e formalização** — por que a passagem para símbolos é legítima, e
     só então a fórmula. Toda definição vem com **um exemplo e um
     contraexemplo** — é o contraexemplo que delimita o conceito ("7 é primo
     porque…; 12 não é, porque…");
   - **“Confira”** — uma pergunta curta sobre a ideia que acabou de ser
     construída, com a resposta em `<details>`. É o aluno descobrindo **agora**
     se entendeu, antes de empilhar a próxima ideia em cima.

   Se uma seção está fazendo duas afirmações diferentes, ela deve virar duas
   seções.
6. **Exemplos resolvidos** — do simples ao composto. A partir do segundo,
   convide o aluno a tentar antes de ler a solução ("pause e tente"): exemplo
   lido passivamente ensina muito menos que exemplo tentado. **Exemplo aplica;
   não apresenta.** Fórmula, unidade ou conceito que aparece pela primeira vez
   dentro de um exemplo resolvido surgiu do nada — e se os exercícios cobram,
   ele precisa da sua própria seção no corpo.
7. **Perguntas de verificação** — sobre o porquê, não sobre o procedimento,
   **com respostas** em `<details>`. Para quem estuda sozinho, pergunta sem
   resposta é beco sem saída, não estímulo. Elas não substituem os “Confira”
   do corpo: aqueles conferem cada ideia isolada, estas conferem a lição
   inteira, misturando as ideias.
8. **Exercícios** com gabarito.
9. **Revisão curta** — a ideia central, quando usá-la, com o que ela se conecta.

Sempre concreto → pictórico → abstrato — e isso vale **dentro de cada seção**,
não só na página como um todo. Símbolo só depois de intuição e imagem.

## Como apresentar uma ideia

A estrutura decide a ordem das seções. Estes movimentos decidem como cada ideia
chega ao aluno. São o que separa uma lição que **mostra** a ideia de uma que
**descreve** a ideia.

**Procedimento físico vira passos numerados.** Quando a definição nasce de um
gesto — colar um barbante, dobrar uma folha, encostar dois retângulos,
distribuir peças em montes —, escreva o gesto como passos que o aluno poderia
executar com as mãos, um verbo por passo. Na álgebra o gesto também existe:
"1. desenhe um retângulo 3 por 2; 2. desenhe outro 3 por 5; 3. encoste os dois;
4. conte" é o que vem antes de $3 \times 2 + 3 \times 5 = 3(2 + 5)$.

> ❌ Pegue um barbante do tamanho do raio e assente-o sobre a borda, curvando-o.

> ✅ 1. Corte um barbante do tamanho do raio. 2. Cole o barbante na borda,
> acompanhando a curva. 3. Puxe uma linha do centro até cada ponta do
> barbante. A abertura entre as duas linhas é 1 radiano.

**Separe de frente o que se confunde.** Quando dois objetos da lição são
fáceis de trocar, diga em uma frase qual é qual: "o raio é um comprimento; o
radiano é a abertura". "Parcela é o que se soma; fator é o que se
multiplica". "$f(x)$ é um número; $f$ é a regra". "Distribuir vai do produto à
soma; fatorar vai da soma ao produto". O aluno sozinho não sabe que misturou
os dois até errar o exercício.

**Conte antes de deduzir.** Se o resultado pode ser visto contando, mostre a
contagem primeiro e a dedução depois. "Cole barbantes na borda: na meia volta
cabem 3 e um pedacinho" vem antes de "$\frac{\pi r}{r} = \pi$". "Divida as
peças de $12x + 18$ em montes iguais: dá com 1, 2, 3 e 6 montes, e o maior é
6" vem antes de "a parte numérica é o MDC". A conta confirma o que o aluno já
viu; ela não deve ser a primeira notícia.

**Raciocínio antes da fórmula.** Quando a fórmula é um atalho de um
raciocínio que o aluno já domina, ensine o raciocínio e deixe a fórmula como
resumo dele. Converter graus em radianos é "que pedaço de 180° é esse? pegue o
mesmo pedaço de $\pi$" — frações, que ele já sabe —, e só depois
$\times \frac{\pi}{180}$. Do mesmo jeito, "das letras sai a menor
potência" é o resumo de "escreva cada parcela como cartões de fatores e tire
os cartões que estão em todas as filas" — e não o ponto de partida.

**Estime antes de calcular.** Antes da conta de um exemplo, escreva a
previsão: "$\frac{\pi}{3} \approx 1{,}05$, então o arco deve dar pouco mais de
um raio"; "a tarifa sobe 12 centavos em 2 000 kWh, então a conta sobe um pouco
mais de 200 reais". Quando o resultado não é um número, preveja a **forma**
dele: "o $x$ não sai, porque o 9 não tem $x$; então o parêntese terá uma
parcela com $x$ e uma sem". Prever obriga a pensar na ideia; conferir depois
do resultado vira formalidade. A conferência no fim ("sanidade ✓") continua
valendo, mas não substitui a previsão.

**Analogia construída para a troca de representação.** Sempre que a lição
muda a unidade ou a forma de escrever a mesma coisa, ancore numa troca que o
aluno já faz na vida: "um ângulo em graus ou em radianos é como uma distância
em km ou em milhas — a distância é a mesma, só muda a régua"; "$1\,240t + 760t$
e $2\,000t$ são duas contas de luz que dão o mesmo valor: uma separada por
loja, outra com as lojas somadas". (As regras da analogia construída estão na
seção Linguagem, regra 3.)

## Linguagem

A estrutura acima decide o que a lição diz. Esta seção decide como cada frase
chega ao aluno — e ela vale em todo o texto da página: corpo, enunciados de
exercício, gabarito, dicas e legendas de figura.

O aluno lê sozinho, sem ninguém a quem perguntar o que uma frase quis dizer.
Frase que precisa ser relida cobra esforço no lugar errado: ele gasta a atenção
decifrando o português em vez de acompanhar a matemática. E quando trava, não
tem como saber se o problema é o conceito ou a redação.

**Sem travessão.** Nenhum `—` nem `–` no texto para o aluno: corpo, título,
legenda, `<summary>`, enunciado e gabarito. Numa página cheia de fórmulas, o
traço parece o sinal de menos, e o aluno já disse que se confunde com ele a
todo momento. Cada uso tem uma troca:

| Antes | Depois |
|---|---|
| a relação é simples — o cabo cresce com o giro —, e mesmo assim | a relação é simples (o cabo cresce com o giro), e mesmo assim |
| Esses números já são conhecidos — 3,14 é o $\pi$. | Esses números já são conhecidos: 3,14 é o $\pi$. |
| **Passo 1 — converter para radianos.** | **Passo 1: converter para radianos.** |
| Respostas — Reconhecimento | Respostas: Reconhecimento |

O sinal de menos dentro de fórmula (`$-2$`) continua normal; a regra vale para
o traço de pontuação.

### 1. Termo abstrato vira ação concreta

Nome de processo — "a manipulação", "a obtenção", "a aplicação da propriedade",
"o procedimento" — esconde quem faz o quê. Escreva o verbo e diga o que a mão
faz com os números.

> ❌ Após a aplicação da propriedade distributiva, a expressão assume a forma
> desenvolvida.

> ✅ Multiplique o $x$ de fora por cada parcela de dentro do parêntese:
> $x \times x$ dá $x^2$, e $x \times 3$ dá $3x$. Escrevendo os dois resultados
> somados, $x(x+3)$ vira $x^2 + 3x$.

Teste: **consigo executar isso com papel e caneta lendo só esta frase?** Se a
frase descreve o destino em vez do movimento, ela ainda é abstrata.

O mesmo vale para os verbos do jargão. "Isolar a variável", "preservar a
igualdade", "simplificar", "substituir" são nomes de destino, não instruções. Na
primeira aparição, diga o movimento junto com o nome: "isolar o $x$ é tirar,
um passo de cada vez, tudo o que está acompanhando ele do lado esquerdo, até
sobrar o $x$ sozinho". Depois de ensinado assim uma vez, o nome já pode andar
sozinho.

Palavras que parecem comuns e não são, e por isso pedem uma tradução na
primeira vez que aparecem: **expressão, termo, parcela, fator, coeficiente,
membro, satisfazer, verificar, admitir, conjunto solução, forma**.

### 2. Uma ideia por frase

Frase longa obriga o aluno a segurar três coisas na cabeça enquanto lê a
quarta. Corte em frases curtas, cada uma com uma afirmação.

> ❌ Como os dois gráficos são reflexos um do outro na reta $y = x$, um ponto
> que pertence aos dois precisa coincidir com o seu próprio reflexo — e os
> únicos pontos que coincidem com o próprio reflexo são os que estão **sobre** o
> espelho, isto é, sobre a reta $y = x$.

> ✅ Os dois gráficos são reflexos um do outro na reta $y = x$. Agora pegue um
> ponto que esteja nos dois gráficos ao mesmo tempo. Ele é o próprio reflexo
> dele. Mas um ponto só é igual ao próprio reflexo quando está em cima do
> espelho. Por isso, esse ponto está sobre a reta $y = x$.

Sinais de que a frase precisa ser quebrada: passou de 25 palavras; tem dois
travessões; tem "— e", "— ou seja", "isto é" emendados; tem uma oração
explicativa dependurada em outra ("..., que ..., que ..."). Cada emenda dessas
é um ponto final esperando para acontecer.

Uma ressalva que importa: **quebrar a frase não pode apagar a ligação entre as
partes**. O conectivo que estava implícito na vírgula precisa aparecer escrito —
"Por isso", "Mas", "Então", "Só que". Frases curtas justapostas sem conectivo
transferem para o aluno o trabalho de descobrir se a segunda é consequência,
condição ou contraste da primeira. Isso é a regra 4 sendo violada para cumprir
a 2.

### 3. Nada de linguagem figurada que exija interpretação

Cuidado para não confundir duas coisas opostas:

- **Analogia construída** é o método da casa e continua obrigatória — "não dá
  para somar metades com terços, é como somar 2 metros com 3 pés". O texto diz
  qual parte corresponde a qual, e o aluno conhece o lado concreto.
- **Figura decorativa** é o que sai. Ela carrega conteúdo técnico sem explicar
  nada, e o aluno tem que adivinhar o que ela quer dizer.

> ❌ A consequência que buscávamos sai de graça.

> ✅ A consequência que buscávamos já está pronta: o resultado do passo anterior
> já a contém, e não precisamos de nenhuma conta nova.

> ❌ A equação do jardim já nasce fatorada.

> ✅ A equação do jardim já aparece escrita como um produto: $x(x+3) = 40$. Não
> precisamos fatorar nada, porque ela já veio nessa forma.

> ❌ Essa distinção é o coração da página.

> ✅ Essa distinção é a ideia principal da página.

Regra prática: **se a metáfora não é explicada na frase seguinte, ela é
decoração** — troque pelo que ela queria dizer. Uma analogia só se sustenta
quando o texto diz (a) qual elemento corresponde a qual, e (b) onde ela deixa
de valer.

Saem pelo mesmo motivo: ironia, pergunta retórica sem resposta, "digamos",
"não é bem assim" — construções em que o sentido pretendido é diferente do
literal.

### 4. Relação subentendida vira relação escrita

Duas omissões típicas:

**O conectivo que ficou na vírgula.** Causa, condição, contraste, finalidade e
consequência precisam estar escritas, não deduzidas do contexto.

> ❌ O denominador não pode ser zero. Excluímos o $-2$ do domínio.

> ✅ O denominador não pode ser zero. **Por isso**, precisamos excluir do
> domínio todo valor que zera o denominador — e aqui esse valor é o $-2$.

**A referência solta.** "Isso", "essa forma", "ele", "aqui", "o mesmo raciocínio"
apontando para algo que ficou três parágrafos atrás. Troque o pronome pelo nome
da coisa, mesmo que soe repetitivo — repetição custa uma palavra, ambiguidade
custa a lição.

Vale também para os números: **quando um valor reaparece num passo adiante, diga
de onde ele veio.** "O 12 aqui é o mmc que calculamos há pouco" evita que o
aluno pare a leitura para caçar a origem do número.

> ❌ Como já conhecemos o gráfico da exponencial, conhecemos o do logaritmo —
> basta refletir.

> ✅ O gráfico do logaritmo é o gráfico da exponencial refletido na reta
> $y = x$. Refletir nessa reta é trocar as coordenadas de lugar: cada ponto
> $(a, b)$ da exponencial vira o ponto $(b, a)$ do logaritmo. Como já
> desenhamos a exponencial, podemos desenhar o logaritmo ponto a ponto, sem
> calcular nenhum logaritmo novo.

Teste de revisão: **para entender esta frase, o aluno precisa de alguma ligação
que o texto não escreveu?**

### 5. Dificuldade não é tratada como trivial

Corte "basta", "apenas", "é só", "simplesmente", "obviamente", "claramente",
"naturalmente", "evidentemente", "fácil", "nada mais é do que", "como todos
sabem".

O estrago é duplo. A palavra ocupa o lugar da explicação — é a regra
anti-mágica do `SKILL.md` outra vez. E, quando o aluno não acha aquilo fácil,
ele conclui que a falha é dele. Não há professor para dizer o contrário, e a
confiança é justamente o que sustenta o estudo sozinho (princípio 5).

> ❌ A imagem do logaritmo é todos os reais: qualquer altura é atingida — basta
> escolher o logaritmando adequado.

> ✅ A imagem do logaritmo é todos os reais: qualquer altura é atingida. Para
> chegar à altura $y$, use o logaritmando $b^y$. Como $\log_b(b^y) = y$, esse
> logaritmando produz exatamente a altura que queríamos — e ele existe para
> qualquer $y$.

Ao revisar, aplique o teste da omissão: **apague o advérbio e veja se a frase
ainda ensina**. Se ela perde o sentido, é porque dependia dele para pular um
passo — escreva o passo. Se não perde nada, a palavra era só ruído.

Nos casos raros em que o passo realmente já foi ensinado nesta mesma página,
prefira dizer qual: "falta só o passo do exemplo 2, aplicado aqui".

O movimento contrário é bem-vindo: **avisar que um trecho é difícil ajuda.**
"Este é o ponto que mais confunde nesta lição", "se esta passagem não fechar na
primeira leitura, isso é esperado — releia depois do exemplo 3". Reconhecer a
dificuldade protege a confiança do aluno; negá-la é o que a destrói.

### A passada de linguagem

Depois que o conteúdo estiver certo, releia a página inteira olhando **só** para
a redação — as cinco regras acima, uma varredura de cada vez. Na revisão de uma
lição existente, isso se limita ao trecho que você tocou, pelo diff mínimo do
`CLAUDE.md`; se você encontrar problemas de linguagem fora dele, aponte ao
usuário em vez de reescrever a página.

Quem escreveu o texto é a pior pessoa para revisar a linguagem dele: lê o que
quis dizer, não o que está escrito. As regras acima existem há tempo, e mesmo
assim dezenas de páginas do curso ainda têm "imediatamente", "naturalmente",
"espinha dorsal". Por isso a passada tem duas partes que não dependem da boa
vontade do autor:

1. **Varredura mecânica** das palavras da regra 5, conferindo cada ocorrência:

   ```bash
   grep -nwiE "basta|bastam|simplesmente|obviamente|claramente|naturalmente|evidentemente|imediatamente|é só|nada mais é|fácil|trivial" docs/<capitulo>/<arquivo>
   ```

   Nem toda ocorrência é erro ("fácil de confundir" avisa uma dificuldade, o
   que é bom). Mas cada uma precisa ser lida e justificada.

   Na mesma passada, procure travessão e meia-risca. Aqui não há exceção:
   toda ocorrência sai.

   ```bash
   grep -n "—\|–" docs/<capitulo>/<arquivo>
   ```
2. **Leitura por um revisor separado** quando a lição é nova ou foi
   reescrita: um agente que não escreveu o texto, com a seção Linguagem como
   instrução, apontando cada frase que viola uma das cinco regras — metáfora
   não explicada, frase com duas ideias, pronome solto, número sem origem.

## Recursos visuais

O aluno estuda sozinho, e a figura é o que ocupa o lugar do professor que
desenharia no quadro enquanto fala. Por isso a regra é **uma figura por
ideia**: toda seção do corpo tem o seu desenho, e o problema motivador também.
Uma lição com uma ou duas figuras perdidas entre muitas telas de texto está
pedindo ao aluno que imagine sozinho o que o texto descreve.

Duas lições-modelo mostram o padrão em assuntos de naturezas opostas.
Consulte a mais próxima do seu assunto antes de desenhar:

- **`geometria/radianos`** — uma ideia que **se move**: guincho no motivador,
  barbante animado, contagem de raios, mostrador de duas escalas, reta
  enrolada.
- **`algebra/fator-comum-em-evidencia`** — uma ideia **simbólica**, que parece
  não ter o que desenhar: retângulos de mesma altura que se juntam, peças
  divididas em montes iguais, cartões de fatores saindo do parêntese, tabelas
  em que o aluno troca a letra por um número.

As duas são exemplos, não moldes. O que se copia delas é a pergunta "o que o
aluno precisa ver?", não os componentes.

### Que tipo de figura

Escolha pela natureza da ideia, não pelo que é mais rápido de escrever. A
pergunta é: **o que o aluno precisa ver?**

| A ideia é… | A figura é… | Exemplos |
|---|---|---|
| um **processo**: algo acontece, se transforma, se move | **animação** que mostra o processo acontecendo, com botão “ver de novo” | colar o raio na borda; juntar retângulos de mesma altura (fatorar); cartões de fator saindo do parêntese; remontar fatias; a secante virando tangente |
| uma **relação** entre quantidades que variam | **controle deslizante** (componente interativo) que o aluno arrasta e vê as duas quantidades mudarem juntas | quanto o tambor gira × quanto a carga sobe; o valor de $x$ × o valor de duas expressões; tarifa × conta; amplitude × gráfico |
| uma **busca**: entre vários casos, quais funcionam? | **controle com registro das tentativas**: o aluno experimenta, a figura mostra se deu certo, e o painel guarda os casos que deram | em quantos montes iguais as peças se dividem (MDC); que valores zeram um produto |
| uma **forma** ou um **estado** | **SVG estático** | triângulo com medidas, área de um retângulo, os dois círculos com o mesmo ângulo |
| uma **correspondência** entre listas | **tabela markdown** | tabela de conversão, entrada → saída |
| passos de uma manipulação algébrica | **matriz KaTeX** (`\begin{array}`) alinhando os passos | |

Na dúvida entre estático e animado, pergunte se o texto usa verbos de
movimento — girar, enrolar, colar, encher, aproximar, deslizar. Se usa, uma
figura parada mostra só o começo ou o fim, e o aluno tem que montar o meio na
cabeça. Esse meio quase sempre é a ideia. A regra anti-mágica do `SKILL.md`
("mostre a ponte") pede exatamente isso: a animação é a ponte desenhada.

Uma figura pode ser as duas coisas: animar na primeira vez que aparece na tela
e depois deixar o aluno controlar pelo deslizante (é o guincho da lição de
radianos, e a conta de energia da lição de fator comum).

### Quando a ideia é simbólica

Álgebra, equações, demonstrações e contagem parecem não ter o que desenhar,
porque a ideia já chega escrita em símbolos. É justamente aí que o aluno
sozinho mais trava: ele manipula letras sem ver o que elas contam. Quatro
perguntas encontram a figura:

1. **O que essas letras contam?** Uma parcela pode ser uma área (retângulo de
   altura $a$ e largura $b$), uma pilha de peças ($12x + 18$ são 12 tiras e
   18 quadradinhos), um peso numa balança. Desenhe a coisa contada.
2. **O que a manipulação faz com essas coisas?** Fatorar é encostar
   retângulos; isolar o $x$ é tirar o mesmo peso dos dois pratos; simplificar
   uma fração é dividir os dois montes pelo mesmo número. A manipulação é um
   **processo**: anime-a.
3. **Do que a expressão é feita?** Escrever cada parcela como uma fila de
   cartões, um por fator, torna visível o que o símbolo esconde: o que se soma
   e o que se multiplica, o que é comum a todas as parcelas, o 1 que sobra.
4. **Como o aluno confere sozinho?** Uma tabela com deslizante, em que ele
   troca a letra por um número e vê as duas escritas lado a lado, mostra se
   uma transformação preservou o valor. Ela também desmonta o erro comum: a
   escrita errada coincide num valor e erra nos outros.

Se nenhuma das quatro perguntas tem resposta, a ideia talvez seja de fato só
de escrita (uma convenção de notação, por exemplo). Aí a figura certa é a
matriz KaTeX alinhando os passos, e não um desenho inventado.

### Como fazer

- **Componentes prontos** estão em `src/components/README.md`, com props e
  exemplos copiáveis. Leia a tabela “Qual usar” antes de escrever um novo.
- **Componente novo** é o caminho normal quando nada serve — é trabalho de
  meia hora, não de um dia. Use `GeoFigure`, `SvgMath` (rótulos em KaTeX) e os
  tons `--mv-tone-1..3` para ficar com a mesma cara do resto do site.
- **Animação** usa o hook `useAnimation` de `src/components/mathviz/`. Ele já
  resolve as três coisas que toda animação precisa: começar só quando a figura
  entra na tela, oferecer o botão “ver de novo” e mostrar direto o quadro final
  para quem pediu ao sistema menos movimento. Uma animação dura de 2 a 5
  segundos e **termina no quadro que ensina** — o estado final é a figura que
  fica na página.
- **Bloco ` ```text `** — quase sempre é a escolha errada: arte ASCII ao lado
  de fórmulas KaTeX parece saída de terminal colada na página. Reserve-o para
  esquema de fluxo ou alinhamento monoespaçado. Ao revisar uma lição por outro
  motivo, converta os blocos de desenho que você tocar.

A figura também não substitui o texto: cada figura vem com legenda que diz o
que olhar, e o texto ao redor continua completo para quem lê sem olhar para
ela.

Duas obrigações ao entregar qualquer desenho:

- **Olhe a página renderizada**, não só o código-fonte. Rótulo cortado,
  sobreposição e estouro no celular não aparecem no diff. Numa animação, olhe
  o quadro final **e** quadros do meio (`MOTION=play` no
  `scripts/capturar-figuras.js`): um rótulo que atravessa o desenho no meio do
  movimento não aparece no quadro final.
- **Nunca mais de três cores.** Quando um diagrama parece precisar de uma
  quarta, quase sempre duas regiões representam a mesma quantidade e devem
  dividir a mesma cor — como os dois retângulos $ab$ em $(a+b)^2$.

## Exercícios e gabarito

Exercícios desenvolvem domínio, não repetição mecânica. Use a progressão em
seções numeradas, como na lição-modelo:

1. **Reconhecimento** — identificar a ideia ou a representação.
2. **Explicação** — dizer com palavras o que está acontecendo.
3. **Aplicação direta** — um caso simples.
4. **Variação** — caso parecido, com uma mudança importante.
5. **Problema misto** — combinando com ideias de lições anteriores.
6. **Justificativa** — por que o procedimento funciona.

Perguntas de verificação úteis: que ideia anterior estamos usando aqui? o que
mudou nesta transformação? o que permaneceu igual? por que esta operação é
permitida? como você verificaria isso com um desenho ou um número simples?

**Toda lista de exercícios termina com gabarito**, no formato:

```md
<details>
<summary>Respostas para conferência</summary>

1. ...

</details>
```

O gabarito não traz só o resultado: nos itens de explicação e justificativa, traz
a razão em uma ou duas frases. O aluno estuda sozinho e não tem quem corrija.

Dois reforços para quem não tem professor:

- **Dica antes da solução**, nos problemas mais difíceis: um `<details>` com
  `<summary>Dica</summary>` antes do gabarito, contendo o empurrão mínimo —
  nunca a resposta.
- **Diagnóstico de erro** no gabarito, quando o erro é previsível: "se você
  encontrou 36, provavelmente esqueceu o dobro do produto". Ninguém vai olhar
  a conta do aluno e apontar onde ele escorregou — o gabarito faz esse papel.

## Tamanho e escopo

**Não existe alvo de número de linhas** — nem mínimo, nem máximo. A estrutura
acima — motivador resolvido, reativação do pré-requisito, uma seção com figura
e “Confira” por ideia, exemplos resolvidos, erros comuns, perguntas de
verificação com resposta e gabarito comentado — custa o que custa. Cortar para
caber num número é cortar exatamente o que o aluno que estuda sozinho não tem
como repor. E esticar a prosa não aprofunda nada: quando um parágrafo está
descrevendo o que uma figura mostraria, o certo é fazer a figura e encurtar o
parágrafo.

O critério é outro: **uma ideia central por página**. A pergunta não é "está
longa demais?", e sim:

- a página tem **uma** ideia central, ou duas que só estão juntas por vizinhança
  temática?
- se são duas, a segunda **depende** da primeira ao ponto de separá-las obrigar
  a página nova a começar reensinando a anterior? Se depende, mantenha juntas.
- alguma seção repete o que outra já disse, ou acrescenta exemplo sem
  acrescentar entendimento?

Só a segunda resposta autoriza propor uma divisão — e proponha, em vez de
continuar acrescentando. O que sempre vale cortar é redundância, não
profundidade.

## Revisão de lições existentes

- Ao aprofundar uma explicação, verifique se o resto da página ainda flui: um
  parágrafo novo no meio pode duplicar algo que já vinha depois.
- Se a lição usa uma ideia sem ter apresentado, o conserto pode estar na página
  anterior, não nesta.
- **O texto que você escreveu passa pela seção Linguagem antes de entregar** —
  inclusive o parágrafo curto que você só ajustou. Um trecho novo em linguagem
  abstrata no meio de uma página concreta destoa mais do que se a página
  inteira fosse assim.

## Checklist didático

Antes de entregar qualquer lição nova ou revisada (além do checklist técnico de
`CLAUDE.md`):

- [ ] a lição responde: para que serve · que problema resolve · em que ideias
      anteriores se apoia · que ponte justifica cada transformação · o que muda e
      o que permanece igual em cada passo;
- [ ] o problema motivador tem figura e é resolvido na própria lição;
- [ ] o roteiro do topo é uma sequência de ideias, não um glossário;
- [ ] cada ideia tem a sua seção, com título que afirma a ideia, figura e um
      “Confira” com resposta;
- [ ] o que é processo está animado; o que é relação entre quantidades tem
      controle deslizante; o estático ficou só para o que é estático — e, numa
      ideia simbólica, as quatro perguntas de “Quando a ideia é simbólica”
      foram feitas antes de concluir que não há o que desenhar;
- [ ] nenhum conceito, fórmula ou unidade aparece pela primeira vez dentro de
      um exemplo resolvido ou de um exercício;
- [ ] os exemplos têm previsão antes da conta (do número ou da forma do
      resultado);
- [ ] os pares que se confundem estão separados de frente, em uma frase;
- [ ] cada uso real tem um caso numérico;
- [ ] toda definição nova tem exemplo e contraexemplo;
- [ ] os erros comuns do conceito estão tratados no corpo da lição;
- [ ] as perguntas de verificação têm resposta;
- [ ] a passada de linguagem foi feita no texto novo ou alterado: termo
      abstrato trocado por ação concreta · nenhuma frase com duas ideias ·
      nenhuma figura de linguagem por explicar · conectivos e referências
      escritos, sem "isso" solto e sem número de origem desconhecida ·
      nenhum "basta / apenas / é só / simplesmente / obviamente / fácil";
- [ ] nenhum travessão (`—`) nem meia-risca (`–`) no texto da página;
- [ ] a varredura com `grep` foi rodada, e a lição nova ou reescrita passou por
      um revisor de linguagem que não a escreveu;
- [ ] todo desenho novo foi conferido **na página renderizada**, nos temas claro
      e escuro e numa largura de celular — animação no quadro final e em
      quadros do meio;
- [ ] releitura final na pele do aluno: que pergunta ele faria que o texto não
      responde?
