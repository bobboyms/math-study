import React from 'react';
import {useLocation} from '@docusaurus/router';
import {useDocsSidebar} from '@docusaurus/plugin-content-docs/client';
import styles from './styles.module.css';

// O título da lição (o `# ...` do markdown) mostra o mesmo número que a barra
// lateral: “6.3 Decaimento e o número e”. O número vem só de `sidebars.js` —
// ninguém o escreve à mão no corpo da lição, e por isso as duas nunca
// discordam quando uma lição é inserida e o capítulo é renumerado.

const NUMERO = /^(\d+(?:\.\d+)*\.?)\s/;

function semBarraFinal(caminho) {
  return caminho.length > 1 ? caminho.replace(/\/+$/, '') : caminho;
}

function procurarRotulo(itens, caminho) {
  for (const item of itens ?? []) {
    if (item.type === 'link' && semBarraFinal(item.href) === caminho) {
      return item.label;
    }
    if (item.type === 'category') {
      const achado = procurarRotulo(item.items, caminho);
      if (achado) return achado;
    }
  }
  return null;
}

export function useNumeroDaLicao() {
  const sidebar = useDocsSidebar();
  const {pathname} = useLocation();
  const rotulo = procurarRotulo(sidebar?.items, semBarraFinal(pathname));
  const casou = rotulo && NUMERO.exec(rotulo);
  return casou ? casou[1] : null;
}

export default function TituloNumerado({Original, children, ...props}) {
  const numero = useNumeroDaLicao();
  return (
    <Original {...props}>
      {numero && <span className={styles.numero}>{numero}</span>}
      {children}
    </Original>
  );
}
