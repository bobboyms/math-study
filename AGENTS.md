# AGENTS.md

Este projeto e usado para estudar matematica. Todo conteudo, explicacao,
exercicio, resumo ou roteiro de estudo deve priorizar entendimento profundo,
aplicacao concreta, conexao entre ideias e dominio antes de avancar.

A matematica deve ser tratada como uma construcao acumulativa: cada ideia nova
usa blocos anteriores. Nenhuma tecnica deve parecer que surgiu do nada.

## Sistema do projeto

- Use Docusaurus como sistema principal para transformar os arquivos Markdown e
  MDX em paginas web de estudo.
- Coloque o conteudo de estudo dentro da pasta `docs`.
- Use arquivos `.md` para paginas textuais simples.
- Use arquivos `.mdx` quando a pagina precisar importar componentes React,
  como graficos interativos, sliders, simuladores ou visualizacoes.
- Atualize `sidebars.js` sempre que uma nova pagina precisar aparecer na
  navegacao lateral.
- Para testar o site localmente, use `npm run start`.
- Para validar a geracao do site, use `npm run build`.

## Formulas e notacao

- Para formulas matematicas, use sintaxe LaTeX com KaTeX.
- Formula inline:

```md
$f(x) = x^2$
```

- Formula em bloco:

```md
$$
f(x) = ax^2 + bx + c
$$
```

- Quando escrever valores em reais perto de formulas, escape o cifrao para nao
  confundir com delimitador de LaTeX:

```md
R\$ 100
```

## Principios de ensino

1. Explique para que o conceito serve.
   - Mostre onde a ideia aparece em problemas reais, outras areas da matematica,
     ciencias, tecnologia, financas, engenharia, jogos, computacao ou no
     raciocinio cotidiano.
   - Evite apresentar formulas como regras soltas.

2. Reconstrua o raciocinio por tras da conclusao.
   - Explique qual problema motivou a ideia.
   - Mostre o caminho mental que poderia levar alguem a descobrir o resultado.
   - Quando houver uma formula, explique por que ela faz sentido antes de usa-la.

3. Conecte ideias novas a ideias anteriores.
   - Antes de ensinar uma tecnica nova, identifique quais conhecimentos ja
     estudados sustentam essa tecnica.
   - Nomeie explicitamente a ideia anterior antes de reutiliza-la.
   - Mostre como a ideia antiga reaparece em um novo contexto.
   - Explique o que a ideia nova acrescenta ao que ja era conhecido.

4. Ensine poucos topicos por vez.
   - Divida assuntos grandes em partes pequenas.
   - Nao avance enquanto os fundamentos anteriores ainda estiverem frageis.
   - Prefira menos conteudo com mais dominio a muitos topicos superficiais.

5. Siga a sequencia concreto -> pictorico -> abstrato.
   - Concreto: comece com exemplos manipulaveis, situacoes praticas, objetos,
     medidas, dinheiro, movimento, contagem ou problemas visualizaveis.
   - Pictorico: depois represente com desenhos, diagramas, tabelas, graficos,
     retas numericas, areas, blocos ou modelos.
   - Abstrato: so entao introduza simbolos, formulas, propriedades e
     demonstracoes formais.

6. Priorize dominio ativo.
   - Inclua perguntas que obriguem o aluno a explicar o raciocinio.
   - Use exercicios graduais: primeiro reconhecimento, depois aplicacao, depois
     variacoes e problemas mistos.
   - Peca para o aluno justificar respostas, nao apenas calcular.

## Regra de continuidade matematica

Matematica nao deve ser ensinada como uma lista de tecnicas independentes. Ao
criar ou reescrever uma explicacao, trate cada conceito como parte de uma cadeia
de ideias.

Antes de explicar um conceito novo, responda:

1. Que ideias anteriores sustentam este conceito?
2. Onde essas ideias apareceram antes no estudo?
3. Como elas reaparecem agora em uma situacao nova?
4. O que o conceito novo permite fazer que antes ainda nao era possivel?

Durante a explicacao, deixe visivel a ponte com o passado. Nao use uma ideia
anterior apenas de forma implicita.

Exemplos de conexoes esperadas:

- fracoes equivalentes devem se conectar com divisao em partes iguais,
  equivalencia e elemento neutro da multiplicacao;
- soma de fracoes deve se conectar com unidade de medida comum e partes de mesmo
  tamanho;
- equacoes devem se conectar com operacoes inversas, equilibrio e elemento
  neutro;
- fatoracao deve se conectar com a propriedade distributiva vista ao contrario;
- produtos notaveis devem se conectar com area, distributiva e multiplicacao de
  expressoes;
- potencias devem se conectar com multiplicacao repetida;
- raizes devem se conectar com a operacao inversa da potencia;
- funcoes devem se conectar com relacao entre grandezas, entrada, saida e
  padroes.

Se uma pagina depender claramente de uma ideia ja ensinada em uma pagina
anterior, mencione essa ideia no texto antes de usa-la. Quando estiver editando
conteudo, consulte as paginas anteriores relevantes do mesmo capitulo para
manter a sequencia coerente.

## Regra anti-magica

Sempre que uma explicacao transformar uma coisa em outra, mostre a ponte. A
transformacao nao deve aparecer como um truque, uma troca arbitraria ou uma
regra sem motivo.

Evite escrever apenas:

- "podemos transformar...";
- "usamos...";
- "basta...";
- "pela regra...";
- "entao...";
- "claramente...".

Antes de usar uma transformacao, explique:

1. O que queremos conseguir.
2. Por que a forma atual ainda nao serve.
3. Qual ideia anterior ou propriedade permite a transformacao.
4. Por que essa ideia se aplica neste caso.
5. O que muda na escrita, no desenho ou no procedimento.
6. O que permanece igual na quantidade, relacao ou significado.
7. Como verificar a transformacao com um exemplo concreto, desenho, tabela,
   reta numerica, area, agrupamento ou calculo simples.

Use esta regra especialmente em:

- fracoes equivalentes;
- mudanca de denominador;
- simplificacao;
- fatoracao;
- produtos notaveis;
- manipulacao de equacoes;
- passagem de exemplos numericos para formulas gerais;
- uso de propriedades como distributiva, associativa, comutativa, inverso e
  elemento neutro.

## Estrutura recomendada para cada explicacao

Ao ensinar um novo conceito, siga esta ordem:

1. Problema motivador: apresente uma situacao concreta que torna o conceito
   necessario.
2. Uso: explique onde isso e usado e por que vale a pena aprender.
3. Conhecimentos anteriores: diga quais ideias ja estudadas serao reutilizadas.
4. Intuicao: desenvolva a ideia nova em linguagem comum.
5. Modelo visual: use desenho, tabela, grafico, reta numerica, area, blocos ou
   analogia espacial.
6. Ponte para a formalizacao: mostre por que a transformacao e permitida, o que
   muda na escrita e o que continua igual no significado.
7. Formalizacao: apresente simbolos, definicoes e formulas somente depois da
   intuicao e da ponte estarem claras.
8. Exemplos resolvidos: comece simples e aumente a dificuldade aos poucos.
9. Perguntas de verificacao: cheque se o aluno entendeu o motivo, nao so o
   procedimento.
10. Exercicios: poucos, bem escolhidos e com foco no dominio.
11. Revisao curta: resuma a ideia central, quando usa-la e com quais ideias
    anteriores ela se conecta.

Nem toda pagina precisa ter exatamente esses titulos, mas a ordem mental deve
ser respeitada.

## Estilo das explicacoes

- Use linguagem clara, direta e progressiva.
- Evite pular etapas de raciocinio.
- Evite excesso de topicos em uma unica resposta ou pagina.
- Prefira exemplos numericos simples antes de generalizar.
- Conecte conceitos novos a conhecimentos ja estudados sempre que houver
  dependencia conceitual.
- Se o aluno errar, identifique exatamente onde o raciocinio desviou.
- Quando houver mais de uma forma de resolver, compare as abordagens e explique
  quando cada uma e util.
- Evite frases que escondem raciocinio, como "podemos transformar", "basta",
  "aplicando a regra" ou "claramente", sem explicar o passo.
- Toda conta deve deixar claro o que mudou na escrita e o que permaneceu igual
  na quantidade, relacao ou significado.
- Quando usar uma equivalencia, mostre pelo menos uma verificacao concreta,
  visual ou numerica.
- Quando usar uma propriedade ja estudada, nomeie a propriedade antes de aplicar
  a tecnica.

## Exercicios e verificacao

Exercicios devem desenvolver dominio, nao apenas repeticao mecanica.

Use progressao:

1. Reconhecimento: identificar a ideia ou representacao.
2. Explicacao: dizer com palavras o que esta acontecendo.
3. Aplicacao direta: resolver um caso simples.
4. Variacao: resolver um caso parecido, mas com uma mudanca importante.
5. Problema misto: combinar com ideias anteriores.
6. Justificativa: explicar por que o procedimento funciona.

Inclua perguntas como:

- Que ideia anterior estamos usando aqui?
- O que mudou nesta transformacao?
- O que permaneceu igual?
- Por que esta operacao e permitida?
- Como voce verificaria isso com um desenho, exemplo ou numero simples?

## Regra central

Nenhum conceito matematico deve ser tratado apenas como uma formula para
memorizar. A explicacao deve responder:

- Em que isso e usado?
- Que problema essa ideia resolve?
- Que conhecimentos anteriores sustentam essa ideia?
- Qual raciocinio leva a essa conclusao?
- Que ponte justifica cada transformacao importante?
- O que muda e o que permanece igual em cada passo?
- Como isso aparece primeiro no concreto, depois no visual, e por fim nos
  simbolos?
