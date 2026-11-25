import React from 'react';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import styles from '../LinearGridMorph/styles.module.css';

// Uma coluna vezes uma linha: a camada de posto 1 (lição 11.13).
//
// A coluna c (tom 2) fica à esquerda, a linha r (tom 1) em cima. A tabela se
// preenche uma linha de cada vez: a linha i é a linha r inteira multiplicada
// pelo número c_i, que acende junto. Cada casa é pintada pelo brilho (0 preto,
// `maxValue` branco), com o número escrito. No fim, o painel conta: m + n
// números guardam m × n.

const CELL = 40;
const PRE = 0.4;
const ROW = 0.75;

export const gray = (b, maxValue = 9) => {
  const x = Math.max(0, Math.min(1, b / maxValue));
  const L = Math.round(28 + x * 222);
  return {fill: `rgb(${L}, ${L}, ${L})`, text: L > 135 ? '#111' : '#f4f4f4'};
};

const fmt = (x) => String(Math.round(x * 100) / 100).replace('.', ',');
const list = (xs) => {
  const a = xs.map(fmt);
  return `(${a.join(a.some((s) => s.includes(',')) ? '; ' : ', ')})`;
};

export default function SvdOuterProduct({col, row, maxValue = 9, caption}) {
  const m = col.length;
  const n = row.length;
  const total = PRE + m * ROW + 0.5;
  const {ref, t, play, playing} = useAnimation({duration: total});
  const x0 = CELL + 22;
  const y0 = CELL + 22;
  const W = x0 + n * CELL + 8;
  const H = y0 + m * CELL + 8;
  const shown = (i) => stage(t, PRE + i * ROW, PRE + i * ROW + ROW * 0.8);
  const active = playing ? Math.min(m - 1, Math.floor((t - PRE) / ROW)) : -1;

  return (
    <div className={shared.wrapper} data-explorer="svd-outer-product">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label="Uma coluna vezes uma linha preenchendo a tabela, linha por linha">
          {/* linha r em cima */}
          {row.map((x, j) => (
            <g key={`r${j}`}>
              <rect x={x0 + j * CELL + 3} y={6} width={CELL - 6} height={CELL - 6} rx={4} fill="none" stroke="var(--mv-tone-1)" strokeWidth={active >= 0 ? 2.6 : 1.6} />
              <text x={x0 + j * CELL + CELL / 2} y={6 + (CELL - 6) / 2 + 5} textAnchor="middle" fontSize={14} fill="var(--mv-tone-1)" fontWeight={600}>
                {fmt(x)}
              </text>
            </g>
          ))}
          {/* coluna c à esquerda */}
          {col.map((x, i) => (
            <g key={`c${i}`}>
              <rect x={6} y={y0 + i * CELL + 3} width={CELL - 6} height={CELL - 6} rx={4} fill={i === active ? 'var(--mv-tone-2)' : 'none'} fillOpacity={0.18} stroke="var(--mv-tone-2)" strokeWidth={i === active ? 2.6 : 1.6} />
              <text x={6 + (CELL - 6) / 2} y={y0 + i * CELL + CELL / 2 + 5} textAnchor="middle" fontSize={14} fill="var(--mv-tone-2)" fontWeight={600}>
                {fmt(x)}
              </text>
            </g>
          ))}
          <text x={x0 - 8} y={y0 - 8} textAnchor="middle" fontSize={15} fill="var(--ifm-color-emphasis-700)">
            ×
          </text>
          {/* a tabela */}
          {col.map((ci, i) =>
            row.map((rj, j) => {
              const v = ci * rj;
              const g = gray(v, maxValue);
              const o = shown(i);
              return (
                <g key={`${i}-${j}`} opacity={o}>
                  <rect x={x0 + j * CELL} y={y0 + i * CELL} width={CELL} height={CELL} fill={g.fill} stroke="var(--ifm-color-emphasis-400)" strokeWidth={1} />
                  <text x={x0 + j * CELL + CELL / 2} y={y0 + i * CELL + CELL / 2 + 5} textAnchor="middle" fontSize={13} fill={g.text}>
                    {fmt(v)}
                  </text>
                </g>
              );
            }),
          )}
          {col.map((_, i) => (
            <rect key={`b${i}`} x={x0} y={y0 + i * CELL} width={n * CELL} height={CELL} fill="none" stroke="var(--mv-tone-2)" strokeWidth={2.4} opacity={i === active ? 1 : 0} />
          ))}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        {active >= 0 ? (
          <p>
            Linha {active + 1} = <strong>{fmt(col[active])}</strong> × {list(row)} = {list(row.map((x) => col[active] * x))}.
          </p>
        ) : (
          <p>
            Cada linha da tabela é a mesma linha de cima, multiplicada pelo número da coluna da esquerda. Para refazer as {m * n} casas,
            são suficientes os {m} números da coluna e os {n} da linha: <strong>{m + n} números</strong>.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
