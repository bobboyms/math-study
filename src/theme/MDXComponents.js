import React from 'react';
import MDXComponents from '@theme-original/MDXComponents';
import TituloNumerado from '@site/src/components/TituloNumerado';

// Acrescenta ao título de cada lição o número que ela tem na barra lateral.
export default {
  ...MDXComponents,
  h1: (props) => <TituloNumerado Original={MDXComponents.h1} {...props} />,
};
