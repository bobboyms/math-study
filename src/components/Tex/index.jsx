import React from 'react';
import katex from 'katex';
import macros from '@site/src/katexMacros';

// Desenha uma fórmula do texto das lições.
//
// Não é usado à mão: o plugin src/rehype/formulas-como-texto.js troca cada
// $...$ e $$...$$ das lições por <Tex math="..." />, e o componente fica
// registrado em src/theme/MDXComponents.js. Assim o código da página carrega
// só o texto da fórmula, e o KaTeX a desenha na geração do HTML e no
// navegador. Para fórmulas dentro de figuras, use mathviz/Formula e SvgMath.
//
// `display` é o modo de exibição do KaTeX (fórmula centralizada e maior).
// `block` diz onde a fórmula está: um bloco $$ entre parágrafos fica num
// <div>; uma fórmula dentro de um parágrafo fica num <span>, mesmo quando é
// $$...$$ escrita no meio da linha.
export default function Tex({math, display = false, block = false}) {
  const html = katex.renderToString(math, {
    displayMode: display,
    macros: {...macros},
    throwOnError: false,
    strict: 'ignore',
  });
  const Tag = block ? 'div' : 'span';
  return <Tag dangerouslySetInnerHTML={{__html: html}} />;
}
