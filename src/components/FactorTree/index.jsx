import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

// Árvore de fatoração. A cada nível, o menor primo se destaca à esquerda e o
// quociente continua descendo à direita, até sobrar um primo. As folhas — os
// nós destacados — são a decomposição.
//
// O desenho é calculado a partir do número, não escrito à mão: assim não há
// como a figura discordar da conta.

const PAD = 16;
const LEVEL_H = 56;
const SHIFT = 40;
const R = 17;

function decompor(n) {
  const passos = [];
  let atual = n;
  let p = 2;
  while (p * p <= atual) {
    if (atual % p === 0) {
      const q = atual / p;
      passos.push({no: atual, primo: p, quociente: q});
      atual = q;
      p = 2;
    } else {
      p += 1;
    }
  }
  return {passos, ultimo: atual};
}

export default function FactorTree({n, caption}) {
  const {passos, ultimo} = decompor(n);

  // Sem passo nenhum, o número já é primo — não há árvore para desenhar.
  if (passos.length === 0) {
    return (
      <figure className={styles.figure}>
        <figcaption className={styles.caption}>
          {caption || `${n} é primo: não se decompõe em fatores menores.`}
        </figcaption>
      </figure>
    );
  }

  const niveis = passos.length;
  const viewW = PAD * 2 + SHIFT * (niveis + 1) + R * 4;
  const viewH = PAD * 2 + LEVEL_H * niveis + R * 2;

  const xDe = (i) => PAD + R + SHIFT * i;
  const yDe = (i) => PAD + R + LEVEL_H * i;

  const primos = [...passos.map((s) => s.primo), ultimo];

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 280)}px`}}
        role="img"
        aria-label={
          caption || `${n} decomposto em ${primos.join(' vezes ')}.`
        }
      >
        {passos.map((passo, i) => {
          const xPai = xDe(i);
          const yPai = yDe(i);
          const xPrimo = xDe(i) - SHIFT * 0.55;
          const xFilho = xDe(i + 1);
          const yFilho = yDe(i + 1);
          return (
            <g key={`ramo-${i}`}>
              <line
                className={styles.branch}
                x1={xPai}
                y1={yPai + R}
                x2={xPrimo}
                y2={yFilho - R}
              />
              <line
                className={styles.branch}
                x1={xPai}
                y1={yPai + R}
                x2={xFilho}
                y2={yFilho - R}
              />
              <circle
                className={styles.leaf}
                cx={xPrimo}
                cy={yFilho}
                r={R}
              />
              <SvgMath
                x={xPrimo}
                y={yFilho}
                math={String(passo.primo)}
                fontSize={15}
                space={R * 2}
              />
            </g>
          );
        })}

        {passos.map((passo, i) => (
          <g key={`no-${i}`}>
            <circle className={styles.node} cx={xDe(i)} cy={yDe(i)} r={R} />
            <SvgMath
              x={xDe(i)}
              y={yDe(i)}
              math={String(passo.no)}
              fontSize={15}
              space={R * 2}
            />
          </g>
        ))}

        <circle className={styles.leaf} cx={xDe(niveis)} cy={yDe(niveis)} r={R} />
        <SvgMath
          x={xDe(niveis)}
          y={yDe(niveis)}
          math={String(ultimo)}
          fontSize={15}
          space={R * 2}
        />
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
