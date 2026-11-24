// Guarda cada fórmula das lições como texto e deixa o desenho para a hora em
// que a página é gerada (e para o navegador).
//
// Antes, o rehype-katex desenhava cada fórmula durante a compilação e o
// resultado (centenas de <span> por fórmula) entrava no código JavaScript da
// página. A lição de valores singulares tinha 70 KB de texto e virava 2,5 MB
// de código; o curso inteiro, 5 MB de lições, virava 113 MB, e o build
// precisava de 14 a 18 GB de memória para compilar tudo isso.
//
// Agora o plugin troca cada fórmula por <Tex math="x^2" />: o código da
// página carrega só o texto da fórmula, e o componente Tex
// (src/components/Tex) chama o KaTeX na geração do HTML e no navegador. O HTML
// final é o mesmo de antes.
//
// O plugin ainda confere cada fórmula com o KaTeX (só a leitura, sem
// desenhar). Uma fórmula que o KaTeX não consegue ler derruba o build, com o
// arquivo e a linha de cada uma: como o deploy roda o build, o site de
// produção não é atualizado enquanto a fórmula não for corrigida. Com o
// rehype-katex, ela aparecia em vermelho no site e o build passava calado.
//
// CommonJS e sem dependências ESM: o docusaurus.config.js o carrega com
// require, também no CI (node 20).

const katex = require('katex');
const macros = require('../katexMacros');

function classesOf(node) {
  const className = node.properties && node.properties.className;
  return Array.isArray(className) ? className : [];
}

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (!node.children) return '';
  return node.children.map(textOf).join('');
}

function check(math, displayMode, node, broken) {
  try {
    katex.__parse(math, {
      displayMode,
      macros: {...macros},
      throwOnError: true,
      strict: 'ignore',
    });
  } catch (error) {
    const line = node.position ? `linha ${node.position.start.line}` : 'linha desconhecida';
    broken.push(`  ${line}: ${error.message.replace(/\s+/g, ' ')}`);
  }
}

function texNode(math, display, flow) {
  const attributes = [{type: 'mdxJsxAttribute', name: 'math', value: math}];
  if (display) attributes.push({type: 'mdxJsxAttribute', name: 'display', value: null});
  if (flow) attributes.push({type: 'mdxJsxAttribute', name: 'block', value: null});
  return {
    type: flow ? 'mdxJsxFlowElement' : 'mdxJsxTextElement',
    name: 'Tex',
    attributes,
    children: [],
  };
}

module.exports = function formulasComoTexto() {
  return function transform(tree, file) {
    const broken = [];
    // Percorre a árvore à mão: os utilitários do unified são só ESM, e o
    // node 20 do CI não carrega ESM com require.
    function walk(parent) {
      if (!parent.children) return;
      for (let i = 0; i < parent.children.length; i += 1) {
        const node = parent.children[i];
        if (node.type !== 'element') {
          walk(node);
          continue;
        }

        // Bloco $$...$$: <pre><code class="language-math math-display">.
        if (node.tagName === 'pre' && node.children.length === 1) {
          const code = node.children[0];
          if (code.type === 'element' && code.tagName === 'code' && classesOf(code).includes('language-math')) {
            const math = textOf(code);
            check(math, true, code.position ? code : node, broken);
            parent.children[i] = texNode(math, true, true);
            continue;
          }
        }

        // Fórmula no meio do texto: <code class="language-math math-inline">.
        const classes = classesOf(node);
        if (classes.includes('language-math') || classes.includes('math-inline') || classes.includes('math-display')) {
          const math = textOf(node);
          const display = classes.includes('math-display');
          check(math, display, node, broken);
          parent.children[i] = texNode(math, display, false);
          continue;
        }

        walk(node);
      }
    }
    walk(tree);

    if (broken.length) {
      throw new Error(
        `[formulas-como-texto] ${broken.length === 1 ? 'Uma fórmula' : `${broken.length} fórmulas`} que o KaTeX não consegue ler em ${file.path}:\n` +
          broken.join('\n'),
      );
    }
  };
};
