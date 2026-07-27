import React from 'react';
import styles from './styles.module.css';

// A unidade dividida em 100 partes iguais. É o desenho que liga as três
// escritas da mesma quantidade: 25 de 100, 0,25 e 25%. Preencher da esquerda
// para a direita, linha a linha, deixa a leitura por décimos visível — duas
// linhas e meia são 25 centésimos.

const CELL = 26;
const PAD = 10;

export default function PercentGrid({filled = 0, tone = 1, caption}) {
  const viewW = PAD * 2 + 10 * CELL;
  const viewH = viewW;

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${viewW}px`}}
        role="img"
        aria-label={caption || `Grade de 100 partes com ${filled} pintadas.`}
      >
        {Array.from({length: 100}, (unused, i) => {
          const linha = Math.floor(i / 10);
          const coluna = i % 10;
          return (
            <rect
              key={i}
              className={i < filled ? styles.filled : styles.empty}
              style={{'--tone': `var(--mv-tone-${tone})`}}
              x={PAD + coluna * CELL}
              y={PAD + linha * CELL}
              width={CELL}
              height={CELL}
            />
          );
        })}
        <rect
          className={styles.outline}
          style={{'--tone': `var(--mv-tone-${tone})`}}
          x={PAD}
          y={PAD}
          width={10 * CELL}
          height={10 * CELL}
        />
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
