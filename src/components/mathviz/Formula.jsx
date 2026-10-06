import React from 'react';
import katex from 'katex';
import macros from '@site/src/katexMacros';

export const mathNumber = (value, digits = 3) => {
  const rounded = Number(value.toFixed(digits));
  return String(Object.is(rounded, -0) ? 0 : rounded).replace('.', '{,}');
};

export default function Formula({math}) {
  return <span dangerouslySetInnerHTML={{__html: katex.renderToString(math, {
    throwOnError: false,
    macros: {...macros},
  })}} />;
}
