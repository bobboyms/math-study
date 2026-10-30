# CLAUDE.md

Este repositório é um curso de matemática em português, publicado como site
Docusaurus, escrito para um adulto autodidata que estuda sozinho.

**As diretrizes didáticas — perfil do aluno, método de ensino, estrutura de
lição, exercícios e gabarito — estão na skill `tutor-matematica`**
(`.claude/skills/tutor-matematica/`). Leia o `SKILL.md` antes de escrever,
revisar ou explicar qualquer conteúdo de matemática, e o `escrever-licao.md`
antes de tocar numa página de `docs/`. Este arquivo cobre apenas o
funcionamento técnico do repositório.

## Referência rápida

- **Idioma:** português com acentuação completa. Nomes de arquivo em ASCII.
- **O prefixo numérico do arquivo não faz parte do id.** `03-fracoes.md` tem o
  id `fracoes`.
- **`npm run build` precisa passar** antes de considerar qualquer tarefa pronta.
- **Toda conta e todo gabarito precisam ser conferidos por cálculo**, nunca de
  cabeça.

## Idioma e escrita

- Todo o texto visível é em **português com acentuação e cedilha completas**:
  "Múltiplos", "Exercícios", "Revisão", "função", "razão", "não".
- **Nomes de arquivo e ids** são ASCII, minúsculos, com hífen e sem acento:
  `05-decimais-e-porcentagem.md`, `expressoes-algebricas`.
- Aspas tipográficas (`“ ”`) e travessão (`—`) são bem-vindos no texto.

Dívida técnica conhecida: as lições `01`, `02`, `04` a `14` ainda estão em ASCII
sem acento, herdadas do início do projeto. Ao revisar qualquer uma delas por
outro motivo, corrija a acentuação da parte que você tocar. Não abra uma tarefa
só de acentuação sem o usuário pedir.

## Sistema do projeto

### Estrutura

- Conteúdo de estudo em `docs/`, organizado por capítulo (`historia/`,
  `numeros-e-operacoes/`, `algebra/`, `equacoes/`, `funcoes/`,
  `exponenciais-e-logaritmos/`, `geometria/`, `calculo/`), mais
  `docs/revisao-geral.md` entre a geometria e o cálculo.
- O capítulo de cálculo é dividido em cursos, um por pasta:
  `docs/calculo/calculo-1/` hoje, e `calculo-2/`, `calculo-3/` quando vierem.
  Na barra lateral, “9. Cálculo” contém a categoria “Cálculo 1”, como os
  módulos da geometria. Os endereços antigos `/calculo/<lição>` redirecionam
  para `/calculo/calculo-1/<lição>` (`plugin-client-redirects`, em
  `docusaurus.config.js`).
- `.md` para páginas de texto. `.mdx` apenas quando a página importa um
  componente React.
- Componentes visuais em `src/components/<Nome>/index.jsx`, documentados em
  `src/components/README.md` — leia esse arquivo antes de desenhar qualquer
  coisa numa lição.
- `docs/intro.md` é a raiz do site (`slug: /`).

### Nomes de arquivo, ids e URLs

O Docusaurus **remove o prefixo numérico** ao gerar o id e a URL. Essa é a fonte
de erro mais comum neste repositório:

| Arquivo | id (usado em `sidebars.js`) | URL |
|---|---|---|
| `docs/matematica-basica/04-fracoes.md` | `matematica-basica/fracoes` | `/matematica-basica/fracoes` |

Dois pontos que decorrem disso:

- **Nunca escreva o prefixo numérico em `sidebars.js`** — o build quebra.
- **Não existe `/docs/` na URL.** O `routeBasePath` é `/`, então a página de
  frações é `http://localhost:3000/matematica-basica/fracoes`.

O prefixo numérico serve só para manter os arquivos em ordem de leitura no
diretório.

### Frontmatter

Toda página começa com, no mínimo:

```md
---
title: Múltiplos, divisores e números primos
---
```

O `title` é o `<h1>` da aba e do SEO; repita-o como `# Título` na primeira linha
do corpo, **sem número**. O rótulo curto da barra lateral fica em `sidebars.js`.

**Não use `sidebar_label` no frontmatter.** Ele tem prioridade sobre o rótulo
de `sidebars.js`, e a lição aparece sem o número na barra lateral, nos botões
Anterior/Próxima e no título — foi o defeito de sete lições do cálculo.

### Barra lateral

`sidebars.js` não é gerado automaticamente. Toda página nova precisa ser
adicionada lá, ou ela existe no site sem nenhum caminho de navegação até ela.

Os rótulos seguem a numeração do capítulo: `'2.5 Frações'`, `'2.6 Decimais e
porcentagem'`. Esses números são escritos à mão e **não** têm relação com o
prefixo do arquivo — mantê-los sincronizados é responsabilidade de quem edita.

O número do rótulo é a **única** fonte da numeração. O título grande da página
o repete sozinho: `src/theme/MDXComponents.js` troca o `<h1>` do markdown por
`src/components/TituloNumerado`, que lê o rótulo da página na barra lateral e
põe o número na frente. Nunca escreva o número no `# Título`.

### Inserir uma lição no meio do capítulo

É uma operação de três partes; fazer só uma delas deixa o capítulo inconsistente:

1. renomear os arquivos seguintes para abrir o número (`git mv`, para preservar
   histórico);
2. renumerar os rótulos `2.x` em `sidebars.js` e inserir a entrada nova;
3. atualizar a lista numerada e os links do roteiro em
   `docs/matematica-basica/index.md`.

### Links entre páginas

`onBrokenLinks` está em `'throw'`: um link errado **derruba o build**, não gera
apenas um aviso.

O formato é relativo e sem o prefixo numérico:

```md
[Frações](./fracoes)
[Funções](../funcoes/funcao-quadratica)
```

### Comandos

```bash
npm run start   # servidor local em http://localhost:3000
npm run build   # validação de verdade: links, MDX, sidebar
npm run clear   # limpa cache quando o start fica com conteúdo velho
npm run quadro  # quadro branco do aluno em http://localhost:4123
```

O site já não cabe no heap padrão do node: `npm run build` sozinho estoura com
`Ineffective mark-compacts near heap limit`. Rode
`NODE_OPTIONS=--max-old-space-size=10240 npm run build`, e `npm run clear`
antes se vier de outros builds na mesma sessão. O deploy usa 12288.

## Caderno do aluno

`caderno/` é onde o aluno resolve exercícios — não é conteúdo do curso e não
participa do build. `npm run quadro` sobe um quadro branco local cujo botão
"Salvar para correção" grava PNGs em `caderno/imagens/` (pasta ignorada pelo
git). A correção dessas imagens é o trabalho da skill `corrigir`: ela lê a
imagem mais recente, confere cada conta com `python3` e responde no papel de
tutor. Não edite nem apague os arquivos do caderno — são o registro do aluno.

## Fórmulas e notação

Fórmulas usam LaTeX renderizado por KaTeX (`remark-math` + `rehype-katex`).

```md
Inline: $f(x) = x^2$

Bloco:

$$
f(x) = ax^2 + bx + c
$$
```

### Escapes obrigatórios

- **Valores em reais:** `R\$ 100`. Sem a barra, o cifrão abre um delimitador de
  fórmula e o texto seguinte vira matemática até o próximo `$`.
- **Em arquivos `.mdx`**, `{` e `<` no texto corrido são sintaxe JSX e quebram a
  compilação — escreva `\{` e `\<`. Dentro de `$...$` e `$$...$$` não há
  problema: `\frac{-b}{2a}` funciona normalmente.
- **Nunca use `<` ou `>` num título (`##`), nem dentro de fórmula.** Aqui a
  exceção acima não vale: o Docusaurus copia o texto do título para o índice
  lateral **sem passar pelo KaTeX**, e o `<` cru chega ao minificador de HTML,
  que falha com um erro de parse difícil de ligar à causa. Um título como
  `## A cadeia $\sen x < x < \tg x$` derruba o build. Escreva a relação em
  palavras: "seno, arco e tangente em ordem".

### Notação da casa

Mantenha consistente entre as lições — o aluno não deve ter que decidir se dois
símbolos diferentes significam a mesma coisa:

- multiplicação: `\times` (padrão do repositório, ~275 usos), não `\cdot`;
- divisão: `\div`;
- MMC e MDC: `\operatorname{mmc}(12,18)` e `\operatorname{mdc}(48,60)`;
- continuação: `\ldots`;
- texto dentro de fórmula: `\text{área} = \text{lado} \times \text{lado}`;
- limite: `\lim_{x \to 2} f(x)`; limites laterais `x \to 2^{+}` e
  `x \to 2^{-}`; infinito sempre com sinal, `+\infty` e `-\infty`;
- derivada: `f'(x)` como notação principal, `\frac{dy}{dx}` quando a lição
  precisar dela (apresentada em `calculo/calculo-1/a-derivada`); segunda derivada
  `f''(x)`;
- integral: `\int_a^b f(x)\,dx`, com o `\,` antes de `dx`;
- variação: `\Delta x` (introduzido em `funcoes/taxa-media-de-variacao`);
- valor absoluto: `\lvert x \rvert`, **nunca** `|x|`. Com a barra crua o KaTeX
  não sabe que ela abre um delimitador e trata o sinal seguinte como operador
  binário: `$|-5|$` sai como “∣ − 5∣”, com um vão visível depois da barra.
  `\lvert`/`\rvert` produzem o espaçamento correto. A barra crua também quebra
  a célula quando a fórmula está dentro de uma tabela markdown.

### Trigonometria: nomes em português

O KaTeX só traz os nomes em inglês (`\sin`, `\tan`, `\arcsin`). As macros do
site, em `src/katexMacros.js`, acrescentam os equivalentes em português:

| Escreva | Sai como | Já existia no KaTeX |
|---|---|---|
| `\sen` | sen | `\cos`, `\sec` |
| `\tg` | tg | `\arccos` |
| `\cotg` | cotg | |
| `\cossec` | cossec | |
| `\arcsen` | arcsen | |
| `\arctg` | arctg | |

O arquivo é lido em **dois lugares** — `docusaurus.config.js`, para as fórmulas
do corpo do texto, e `mathviz/SvgMath.jsx`, para os rótulos dentro dos desenhos.
Se as listas divergirem, um rótulo de figura quebra sem que nenhuma fórmula do
texto quebre — erro difícil de achar. Por isso, uma lista só.

Ao acrescentar uma macro, basta editar `src/katexMacros.js`.

## Corretude numérica

Uma resposta errada no gabarito é a pior falha possível neste repositório — o
aluno não tem como saber que o erro é do material.

- **Confira toda conta calculando**, não de cabeça: fatorações, MMC, MDC,
  simplificações, potências, raízes, porcentagens e cada item do gabarito.
- Use `python3 -c "..."` para verificar. É rápido e elimina a classe inteira de
  erro.
- Confira também a **coerência interna**: se um exemplo é retomado adiante, os
  números têm que bater entre as duas passagens.

## Revisão de páginas existentes

- **Não renomeie títulos sem necessidade.** Cada `##` vira uma âncora, e outras
  páginas podem linkar para ela — com `onBrokenLinks: 'throw'`, isso quebra o
  build.
- **Diff mínimo.** Melhore a passagem problemática; não reescreva o que já está
  bom.

## Conferência das figuras

**Toda figura nova ou alterada precisa ser vista renderizada, com os olhos.**
Antes de publicar (push na `main` é deploy em produção), confira todas as
figuras das páginas que você tocou. O diff não mostra rótulo fora do lugar,
figura torta nem desenho que contradiz o texto — e o usuário já encontrou
vários desses defeitos em produção.

Como fazer:

1. Suba o site: `NODE_OPTIONS=--max-old-space-size=10240 npm run start -- --port 3300 --no-open`
   (recarrega a cada edição; sem o `NODE_OPTIONS` ele cai por falta de memória).
   Ou `npm run build` seguido de `npm run serve -- --port 3210` e `BASE=http://localhost:3210/math-study`.
2. Instale o Playwright sem tocar no `package.json` — `npm i --no-save playwright`
   — e capture as figuras, uma imagem por figura:
   `node scripts/capturar-figuras.js <pasta-fora-do-repo> geometria/angulos geometria/triangulos`.
   O `index.txt` da pasta liga cada imagem à legenda.
3. Abra **cada** imagem e confira:
   - rótulo junto do elemento a que se refere, sem cobrir linha nem outro rótulo,
     sem corte na borda;
   - lado que deveria ser horizontal ou vertical está mesmo; ângulo reto é reto;
   - números, ângulos e proporções desenhados batem com o texto e a legenda —
     confira as coordenadas com `python3` (ângulos com `atan2`), não a olho;
   - arco do ângulo do lado certo;
   - tema escuro (`THEME=dark`) quando a figura usa cor, e celular (`WIDTH=390`)
     quando ela é larga.
4. Corrija nas props da figura (`labelRadius`, `offset`, `anchor`, `padding`,
   coordenadas), capture de novo e olhe outra vez.

Armadilhas conhecidas do `GeoFigure`: num ângulo de exatamente 180° o rótulo
cai em cima do vértice — use um rótulo solto (`labels`); `padding` baixo corta
o rótulo na borda; acento combinado na legenda (como “B̂”) sai deslocado.

## Antes de concluir

Toda entrega passa por esta lista:

- [ ] `npm run build` passa sem erro;
- [ ] página nova está em `sidebars.js`, com o id **sem** prefixo numérico;
- [ ] links relativos resolvem, e a numeração `2.x` está coerente;
- [ ] fórmulas renderizam (confira no `npm run start`, não só no código-fonte);
- [ ] cada figura das páginas tocadas foi capturada com
      `scripts/capturar-figuras.js` e conferida com os olhos (seção acima);
- [ ] valores em reais escritos como `R\$`;
- [ ] todas as contas e o gabarito conferidos por cálculo;
- [ ] acentuação completa no texto que você escreveu;
- [ ] o checklist didático da skill `tutor-matematica` foi aplicado.

Mensagens de commit em português, no imperativo, descrevendo o ganho pedagógico:
`Melhora a didática da lição de múltiplos, divisores e primos`.
