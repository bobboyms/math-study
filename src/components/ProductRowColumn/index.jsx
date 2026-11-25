import React, {useState} from 'react';
import Formula from '../mathviz/Formula';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {ease} from '../mathviz/useAnimation';
import {Brackets, Cell, dotTex, num} from '../MatrixKit';
import styles from './styles.module.css';

// A regra linha por coluna, entrada por entrada (lição 11.7).
//
// Arranjo clássico: B em cima, A à esquerda, o produto AB embaixo à direita.
// Assim a linha i de A fica na mesma altura da linha i do produto, e a coluna
// j de B fica no mesmo prumo da coluna j do produto: a casa (i, j) do produto
// está exatamente no cruzamento das duas faixas.
//
// Na animação, cada entrada escolhida acende a sua linha de A (tom 1) e a sua
// coluna de B (tom 2); o par da vez fica verde, um de cada vez (1º com 1º,
// 2º com 2º...), a conta cresce no painel e o resultado cai na casa (tom 3). No fim,
// o aluno clica numa casa do produto para ver a conta dela.

const sumOf = (row, col) => row.reduce((acc, a, k) => acc + a * col[k], 0);

export default function ProductRowColumn({
  A,
  B,
  nameA = 'A',
  nameB = 'B',
  nameAB,
  rowNames,
  colNames,
  innerNames,
  order,
  selected: initialSelected = null,
  cell = 44,
  cellR,
  cellH = 34,
  pairDuration = 0.5,
  caption,
  label = 'Produto de matrizes calculado entrada por entrada',
  replayLabel = 'Ver as contas de novo',
}) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const prodName = nameAB ?? `${nameA}${nameB}`;
  const C = A.map((row) => B[0].map((_, j) => sumOf(row, B.map((r) => r[j]))));
  const entries = order ?? A.flatMap((_, i) => B[0].map((__, j) => [i, j]));
  const D = 0.45 + n * pairDuration + 0.55;
  const duration = 0.2 + entries.length * D + 0.6;
  const [selected, setSelected] = useState(initialSelected);

  const {ref, t, play, playing} = useAnimation({duration});

  // Qual entrada está sendo calculada agora, e em que parte da conta.
  let cur = null;
  let phase = 0;
  let pairK = -1;
  const filled = new Set();
  if (playing) {
    const tt = t - 0.2;
    const e = Math.floor(tt / D);
    for (let q = 0; q < Math.min(e, entries.length); q += 1) filled.add(entries[q].join(','));
    if (e >= 0 && e < entries.length) {
      cur = entries[e];
      const local = tt - e * D;
      phase = local;
      pairK = local < 0.45 ? -1 : Math.min(n - 1, Math.floor((local - 0.45) / pairDuration));
      if (local >= 0.45 + n * pairDuration) {
        pairK = n;
      }
    }
    if (e >= entries.length) {
      A.forEach((_, i) => B[0].forEach((__, j) => filled.add(`${i},${j}`)));
    }
  } else {
    A.forEach((_, i) => B[0].forEach((__, j) => filled.add(`${i},${j}`)));
  }
  const focus = playing ? cur : selected;
  const shownPairs = playing ? pairK : n; // quantos pares já entraram na conta

  // ---------------------------------------------------------------------
  // Geometria
  const LW = rowNames ? 74 : 8;
  const top = colNames ? 24 : 6;
  const gapX = 22;
  const gapY = innerNames ? 30 : 18;
  const cw = cell;
  const ch = cellH;
  const cwR = cellR ?? Math.max(cell, 50);
  const X0 = LW + 10;
  const xB = X0 + n * cw + gapX;
  const yB = top + 4;
  const yR = yB + n * ch + gapY;
  const xR = xB;
  const W = xR + p * cwR + 52;
  const H = yR + m * ch + 34;
  const ax = (k) => X0 + k * cw;
  const ay = (i) => yR + i * ch;
  const bx = (j) => xB + j * cwR;
  const by = (k) => yB + k * ch;

  const fadeIn = playing && cur ? ease(phase / 0.4) : 1;
  const isRow = (i) => focus && focus[0] === i;
  const isCol = (j) => focus && focus[1] === j;

  // ---------------------------------------------------------------------
  // Painel com a conta da entrada em foco
  let panel;
  if (focus) {
    const [i, j] = focus;
    const row = A[i];
    const col = B.map((r) => r[j]);
    const k = Math.min(shownPairs, n);
    const partial = k <= 0 ? '' : dotTex(row.slice(0, k), col.slice(0, k));
    const total = k >= n ? ` = ${num(C[i][j])}` : '';
    const rowTxt = rowNames ? ` (${rowNames[i]})` : '';
    const colTxt = colNames ? ` (${colNames[j]})` : '';
    panel = (
      <>
        <p className={styles.small}>
          Casa da linha {i + 1} e coluna {j + 1} de {prodName}:{' '}
          <span className={styles.c1}>
            linha {i + 1} de {nameA}
            {rowTxt}
          </span>{' '}
          com a{' '}
          <span className={styles.c2}>
            coluna {j + 1} de {nameB}
            {colTxt}
          </span>
          .
        </p>
        <p className={shared.formula}>
          <Formula math={k <= 0 ? '\\phantom{0}' : `${partial}${total}`} />
        </p>
      </>
    );
  } else {
    panel = <p className={styles.small}>Clique numa casa do produto {prodName} para ver a conta dela.</p>;
  }

  return (
    <div className={shared.wrapper} data-explorer="product-row-column">
      <figure className={styles.figure} ref={ref}>
        <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="group" aria-label={label}>
          {/* faixas: linha de A e coluna de B em foco, com as guias até a casa */}
          {focus && (
            <g opacity={fadeIn}>
              <rect x={ax(0) - 3} y={ay(focus[0]) - 3} width={n * cw + 6} height={ch + 6} rx={6} fill="var(--mv-tone-1)" fillOpacity={0.14} stroke="var(--mv-tone-1)" strokeWidth={1.6} />
              <rect x={bx(focus[1]) - 3} y={by(0) - 3} width={cwR + 6} height={n * ch + 6} rx={6} fill="var(--mv-tone-2)" fillOpacity={0.14} stroke="var(--mv-tone-2)" strokeWidth={1.6} />
              <line x1={ax(n - 1) + cw + 3} y1={ay(focus[0]) + ch / 2} x2={bx(focus[1])} y2={ay(focus[0]) + ch / 2} stroke="var(--mv-tone-1)" strokeWidth={1.4} strokeDasharray="4 4" />
              <line x1={bx(focus[1]) + cwR / 2} y1={by(n - 1) + ch + 3} x2={bx(focus[1]) + cwR / 2} y2={ay(focus[0])} stroke="var(--mv-tone-2)" strokeWidth={1.4} strokeDasharray="4 4" />
            </g>
          )}
          {/* A */}
          {A.map((row, i) =>
            row.map((a, k) => {
              const strong = focus && isRow(i) && playing && k === pairK;
              return <Cell key={`a${i}${k}`} x={ax(k)} y={ay(i)} w={cw} h={ch} math={num(a)} tone={strong ? 3 : isRow(i) ? 1 : 0} fill={strong ? 3 : 0} strong={strong} fontSize={15} />;
            }),
          )}
          <Brackets x0={ax(0) - 6} y0={ay(0) - 5} x1={ax(n - 1) + cw + 6} y1={ay(m - 1) + ch + 5} />
          <SvgMath x={X0 + (n * cw) / 2} y={ay(m - 1) + ch + 20} math={nameA} fontSize={15} tone={1} />
          {/* B */}
          {B.map((row, k) =>
            row.map((b, j) => {
              const strong = focus && isCol(j) && playing && k === pairK;
              return <Cell key={`b${k}${j}`} x={bx(j)} y={by(k)} w={cwR} h={ch} math={num(b)} tone={strong ? 3 : isCol(j) ? 2 : 0} fill={strong ? 3 : 0} strong={strong} fontSize={15} />;
            }),
          )}
          <Brackets x0={bx(0) - 6} y0={by(0) - 5} x1={bx(p - 1) + cwR + 6} y1={by(n - 1) + ch + 5} />
          <SvgMath x={bx(p - 1) + cwR + 14} y={by(0) + (n * ch) / 2} math={nameB} fontSize={15} tone={2} anchor="start" />
          {/* AB */}
          {A.map((_, i) =>
            B[0].map((__, j) => {
              const key = `${i},${j}`;
              const isFocus = focus && focus[0] === i && focus[1] === j;
              const landing = playing && isFocus && pairK >= n;
              const show = filled.has(key) || landing;
              return (
                <g
                  key={`r${key}`}
                  className={playing ? undefined : styles.clickable}
                  role={playing ? undefined : 'button'}
                  tabIndex={playing ? undefined : 0}
                  aria-label={`Ver a conta da casa da linha ${i + 1}, coluna ${j + 1}`}
                  onClick={() => !playing && setSelected([i, j])}
                  onKeyDown={(e) => {
                    if (!playing && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      setSelected([i, j]);
                    }
                  }}
                >
                  <Cell
                    x={bx(j)}
                    y={ay(i)}
                    w={cwR}
                    h={ch}
                    math={show ? num(C[i][j]) : ''}
                    tone={isFocus ? 3 : 0}
                    fill={isFocus && show ? 3 : 0}
                    strong={isFocus}
                    dashed={!show}
                    fontSize={15}
                  />
                </g>
              );
            }),
          )}
          <Brackets x0={bx(0) - 6} y0={ay(0) - 5} x1={bx(p - 1) + cwR + 6} y1={ay(m - 1) + ch + 5} />
          <SvgMath x={bx(p - 1) + cwR + 14} y={ay(0) + (m * ch) / 2} math={prodName} fontSize={15} tone={3} anchor="start" />
          {/* nomes das linhas, das colunas e do meio */}
          {rowNames &&
            rowNames.map((r, i) => <SvgMath key={`rn${i}`} x={LW} y={ay(i) + ch / 2} math={`\\text{${r}}`} fontSize={12} anchor="end" />)}
          {colNames &&
            colNames.map((c, j) => <SvgMath key={`cn${j}`} x={bx(j) + cwR / 2} y={top - 6} math={`\\text{${c}}`} fontSize={12} />)}
          {innerNames &&
            innerNames.map((c, k) => (
              <g key={`in${k}`}>
                <SvgMath x={ax(k) + cw / 2} y={ay(0) - 14} math={`\\text{${c}}`} fontSize={11} />
                <SvgMath x={bx(0) - 10} y={by(k) + ch / 2} math={`\\text{${c}}`} fontSize={11} anchor="end" />
              </g>
            ))}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        {panel}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {replayLabel}
        </button>
      </div>
    </div>
  );
}
