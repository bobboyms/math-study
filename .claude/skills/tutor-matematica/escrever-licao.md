# Escrever ou revisar uma lição

Complementa o `SKILL.md` — perfil do aluno, princípios, continuidade, regra
anti-mágica, erros comuns e estilo continuam valendo aqui. Este arquivo cobre só
o que é específico de produzir uma página em `docs/`.

## Conteúdo

- Antes de editar
- Estrutura de uma lição
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

1. **Problema motivador** — uma situação concreta que torna o conceito
   necessário, antes de qualquer definição. A lição **volta e resolve este
   problema** assim que a ferramenta fica pronta: a ideia precisa pagar o que
   prometeu na abertura.
2. **Mapa das ideias** — glossário mínimo dos termos que a lição vai
   construir, uma linha por termo, como referência inicial.
3. **Uso** — onde a ideia aparece na prática e dentro da própria matemática.
4. **Ideias anteriores que voltam aqui** — nomeadas explicitamente, com link
   para a página onde foram estudadas, e **reativadas** com duas ou três
   perguntas rápidas de resgate, respondidas ali mesmo. Citar não basta: o
   aluno precisa trazer o bloco anterior de volta à memória antes de usá-lo —
   e descobrir agora, não no meio da lição, se precisa reler a página antiga.
5. **Intuição** — a ideia nova em linguagem comum, sem símbolos.
6. **Modelo visual** — tabela, desenho, reta numérica, área, agrupamento.
7. **Ponte para a formalização** — por que a passagem para símbolos é legítima.
8. **Formalização** — definições e fórmulas, só agora. Toda definição vem com
   **um exemplo e um contraexemplo** — é o contraexemplo que delimita o
   conceito ("7 é primo porque…; 12 não é, porque…").
9. **Exemplos resolvidos** — do simples ao composto. A partir do segundo,
   convide o aluno a tentar antes de ler a solução ("pause e tente"): exemplo
   lido passivamente ensina muito menos que exemplo tentado.
10. **Perguntas de verificação** — sobre o porquê, não sobre o procedimento,
    **com respostas** em `<details>`. Para quem estuda sozinho, pergunta sem
    resposta é beco sem saída, não estímulo. (Dívida conhecida: a lição-modelo
    ainda não traz essas respostas — neste ponto específico, siga este
    documento, não a lição-modelo.)
11. **Exercícios** com gabarito.
12. **Revisão curta** — a ideia central, quando usá-la, com o que ela se conecta.

Sempre concreto → pictórico → abstrato. Símbolo só depois de intuição e imagem.

## Linguagem

A estrutura acima decide o que a lição diz. Esta seção decide como cada frase
chega ao aluno — e ela vale em todo o texto da página: corpo, enunciados de
exercício, gabarito, dicas e legendas de figura.

O aluno lê sozinho, sem ninguém a quem perguntar o que uma frase quis dizer.
Frase que precisa ser relida cobra esforço no lugar errado: ele gasta a atenção
decifrando o português em vez de acompanhar a matemática. E quando trava, não
tem como saber se o problema é o conceito ou a redação.

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

## Recursos visuais

A etapa "modelo visual" não é opcional. Escolha a ferramenta pela natureza da
ideia, não pelo que é mais rápido de escrever:

- **Diagrama em SVG** — é o padrão para desenho: área, reta numérica, barra de
  frações. Os componentes prontos estão documentados em
  `src/components/README.md` (`AreaModel`, `NumberLine`, `FractionBar`), com
  props e exemplos copiáveis. São estáticos, custam quase o mesmo que um bloco
  de texto e usam KaTeX nos rótulos, então o desenho sai na mesma fonte das
  fórmulas ao redor. Se nenhum dos três servir, escreva um componente novo em
  `src/components/` seguindo os mesmos tons (`--mv-tone-1..3`) — é trabalho de
  meia hora, não de um dia.
- **Tabela markdown** — para padrão variando (entrada → saída, ciclos, tabuada,
  crescimento). Continua sendo o melhor recurso quando a ideia é uma
  correspondência, não uma forma.
- **Matriz KaTeX** (`\begin{array}`) — para alinhar passos de uma manipulação
  algébrica lado a lado.
- **Bloco ` ```text `** — hoje é o recurso mais frequente no repositório, por
  herança, e quase sempre é a escolha errada: arte ASCII ao lado de fórmulas
  KaTeX parece saída de terminal colada na página. Reserve-o para esquema de
  fluxo, tabela de alinhamento monoespaçado ou rascunho — nunca para um desenho
  que o `AreaModel`, a `NumberLine` ou a `FractionBar` fariam. Ao revisar uma
  lição por outro motivo, converta os blocos de desenho que você tocar.
- **Componente interativo** — React com estado e controle deslizante, em `.mdx`.
  Veja `src/components/DistributiveArea` e `src/components/FunctionGraph`. Use
  apenas quando **mexer no parâmetro é a ideia** que está sendo ensinada; uma
  figura que só ilustra deve ser SVG estático.

Duas obrigações ao entregar qualquer desenho:

- **Olhe a página renderizada**, não só o código-fonte. Rótulo cortado,
  sobreposição e estouro no celular não aparecem no diff.
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

**Não existe alvo de número de linhas.** A estrutura acima — motivador
resolvido, reativação do pré-requisito, intuição, modelo visual, formalização
com contraexemplo, exemplos resolvidos, erros comuns, perguntas de verificação
com resposta e gabarito comentado — custa o que custa. Aplicada com honestidade,
uma lição fica entre 900 e 1200 linhas, e as boas páginas do repositório estão
nessa faixa. Cortar para caber num número é cortar exatamente o que o aluno que
estuda sozinho não tem como repor.

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
- [ ] o problema motivador é resolvido na própria lição;
- [ ] toda definição nova tem exemplo e contraexemplo;
- [ ] os erros comuns do conceito estão tratados no corpo da lição;
- [ ] as perguntas de verificação têm resposta;
- [ ] a passada de linguagem foi feita no texto novo ou alterado: termo
      abstrato trocado por ação concreta · nenhuma frase com duas ideias ·
      nenhuma figura de linguagem por explicar · conectivos e referências
      escritos, sem "isso" solto e sem número de origem desconhecida ·
      nenhum "basta / apenas / é só / simplesmente / obviamente / fácil";
- [ ] todo desenho novo foi conferido **na página renderizada**, nos temas claro
      e escuro e numa largura de celular;
- [ ] releitura final na pele do aluno: que pergunta ele faria que o texto não
      responde?
