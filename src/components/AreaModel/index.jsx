import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import styles from './styles.module.css';

const PAD = {top: 40, right: 16, bottom: 16};
const LABEL_GAP = 22; // do colchete até o rótulo da linha
const BASE_GAP = 30; // espaço extra embaixo quando há colchete da base inteira

// Tom padrão de cada célula. Numa grade 2x2 esta conta dá 1, 2 / 2, 3 — ou
// seja, os dois produtos cruzados saem com a mesma cor, que é exatamente o que
// (a+b)^2 precisa mostrar: ab aparece duas vezes.
const defaultTone = (row, col) => ((row + col) % 3) + 1;

const normalize = (cell, row, col) => {
  if (cell === null || cell === undefined || cell === '') {
    return null;
  }
  if (typeof cell === 'object') {
    return {math: cell.math, tone: cell.tone ?? defaultTone(row, col)};
  }
  return {math: cell, tone: defaultTone(row, col)};
};

const labelSize = (width, height) => {
  if (width < 46 || height < 26) {
    return 11;
  }
  if (width < 74) {
    return 13;
  }
  return 15;
};

export default function AreaModel({
  rows,
  cols,
  cells = [],
  unit = 30,
  baseLabel,
  caption,
  labelWidth = 56,
}) {
  const colWidths = cols.map((col) => col.size * unit);
  const rowHeights = rows.map((row) => row.size * unit);
  const totalW = colWidths.reduce((sum, w) => sum + w, 0);
  const totalH = rowHeights.reduce((sum, h) => sum + h, 0);

  const padLeft = labelWidth + LABEL_GAP;
  const x0 = padLeft;
  const y0 = PAD.top;
  const viewW = padLeft + totalW + PAD.right;
  const viewH = PAD.top + totalH + PAD.bottom + (baseLabel ? BASE_GAP : 0);
  const bottomY = y0 + totalH;

  const colX = colWidths.reduce(
    (acc, w) => [...acc, acc[acc.length - 1] + w],
    [x0],
  );
  const rowY = rowHeights.reduce(
    (acc, h) => [...acc, acc[acc.length - 1] + h],
    [y0],
  );

  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${viewW} ${viewH}`}
        style={{maxWidth: `${Math.max(viewW, 320)}px`}}
        role="img"
        aria-label={
          caption ||
          `Retângulo dividido em ${rows.length} por ${cols.length} regiões.`
        }
      >
        {rows.map((row, r) =>
          cols.map((col, c) => {
            const cell = normalize(cells[r]?.[c], r, c);
            return (
              <g key={`${r}-${c}`}>
                <rect
                  className={styles.cell}
                  style={{
                    '--cell-tone': `var(--mv-tone-${cell ? cell.tone : 0})`,
                    fillOpacity: cell ? undefined : 0,
                  }}
                  x={colX[c]}
                  y={rowY[r]}
                  width={colWidths[c]}
                  height={rowHeights[r]}
                />
                {cell && (
                  <SvgMath
                    x={colX[c] + colWidths[c] / 2}
                    y={rowY[r] + rowHeights[r] / 2}
                    math={cell.math}
                    fontSize={labelSize(colWidths[c], rowHeights[r])}
                  />
                )}
              </g>
            );
          }),
        )}

        {cols.map((col, c) => (
          <g key={`col-${c}`}>
            <path
              className={styles.guide}
              d={`M ${colX[c]} ${y0 - 8} L ${colX[c]} ${y0 - 14} L ${colX[c + 1]} ${y0 - 14} L ${colX[c + 1]} ${y0 - 8}`}
            />
            <SvgMath
              x={colX[c] + colWidths[c] / 2}
              y={y0 - 26}
              math={col.label}
              fontSize={15}
            />
          </g>
        ))}

        {rows.map((row, r) => (
          <g key={`row-${r}`}>
            <path
              className={styles.guide}
              d={`M ${x0 - 8} ${rowY[r]} L ${x0 - 14} ${rowY[r]} L ${x0 - 14} ${rowY[r + 1]} L ${x0 - 8} ${rowY[r + 1]}`}
            />
            <SvgMath
              x={x0 - LABEL_GAP}
              y={rowY[r] + rowHeights[r] / 2}
              math={row.label}
              anchor="end"
              space={labelWidth}
              fontSize={15}
            />
          </g>
        ))}

        {baseLabel && (
          <g>
            <path
              className={styles.guide}
              d={`M ${x0} ${bottomY + 8} L ${x0} ${bottomY + 14} L ${x0 + totalW} ${bottomY + 14} L ${x0 + totalW} ${bottomY + 8}`}
            />
            <SvgMath
              x={x0 + totalW / 2}
              y={bottomY + 30}
              math={baseLabel}
              fontSize={15}
            />
          </g>
        )}
      </svg>

      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
