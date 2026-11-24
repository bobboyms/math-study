import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import TituloNumerado from '@site/src/components/TituloNumerado';
import Tex from '@site/src/components/Tex';

// Acrescenta ao título de cada lição o número que ela tem na barra lateral, e
// registra o Tex, que desenha as fórmulas (src/rehype/formulas-como-texto.js).
export default {
  ...MDXComponents,
  Tex,
  h1: (props) => <TituloNumerado Original={MDXComponents.h1} {...props} />,
};
