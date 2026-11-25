import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {Cell, Brackets, num, factor} from '../MatrixKit';

// Soma de matrizes e número vezes matriz, casa por casa (lição 11.3).
//
// Primeira fileira: A + B. Uma casa de cada vez, a casa de A (azul) e a casa
// de B na mesma posição (laranja) acendem, e a soma delas aparece na mesma
// posição do resultado (verde). Segunda fileira: k vezes A, também casa por
// casa. A figura deixa à vista que a posição é tudo: cada casa só conversa
// com a casa da mesma linha e da mesma coluna.

const C = 40;
const CH = 32;

export default function MatrixEntrywise({
  a = [
    [1, 4],
    [0, -2],
  ],
  b = [
    [3, 1],
    [5, 2],
  ],
  k = 3,
  caption,
}) {
  const m = a.length;
  const n = a[0].length;
  const gw = n * C;
  const gh = m * CH;
  const X_A = 20;
  const X_OP1 = X_A + gw + 22;
  const X_B = X_OP1 + 34;
  const X_EQ = X_B + gw + 22;
  const X_R = X_EQ + 34;
  const W = X_R + gw + 20;
  const Y1 = 30;
  const Y2 = Y1 + gh + 54;
  const H = Y2 + gh + 12;

  const cells = m * n;
  const STEP = 0.5;
  const sumAt = (p) => 0.3 + p * STEP;
  const S0 = sumAt(cells) + 0.3;
  const scaleAt = (p) => S0 + p * STEP;
  const duration = scaleAt(cells) + 0.3;
  const {ref, t, play, playing} = useAnimation({duration});

  const sum = a.map((row, i) => row.map((v, j) => v + b[i][j]));
  const scaled = a.map((row) => row.map((v) => k * v));

  const grid = (M, x0, y0, opts) =>
    M.map((row, i) =>
      row.map((v, j) => {
        const p = i * n + j;
        return <Cell key={`${i}-${j}`} x={x0 + j * C} y={y0 + i * CH} w={C} h={CH} math={num(v)} {...opts(p)} />;
      }),
    );

  const activeSum = (p) => t >= sumAt(p) && t < sumAt(p) + STEP;
  const activeScale = (p) => t >= scaleAt(p) && t < scaleAt(p) + STEP;

  return (
    <div className={shared.wrapper} data-explorer="matrix-entrywise">
      <figure ref={ref} className={geo.figure}>
        <svg
          className={geo.svg}
          viewBox={`0 0 ${W} ${H}`}
          style={{maxWidth: `${W + 40}px`}}
          role="img"
          aria-label="A soma de duas matrizes e o produto de um número por uma matriz, feitos casa por casa."
        >
          {/* A + B */}
          <SvgMath x={X_A + gw / 2} y={Y1 - 14} math="A" fontSize={14} tone={1} />
          <SvgMath x={X_B + gw / 2} y={Y1 - 14} math="B" fontSize={14} tone={2} />
          <SvgMath x={X_R + gw / 2} y={Y1 - 14} math="A + B" fontSize={14} tone={3} />
          {grid(a, X_A, Y1, (p) => ({fill: activeSum(p) ? 1 : 0, tone: activeSum(p) ? 1 : 0, strong: activeSum(p)}))}
          {grid(b, X_B, Y1, (p) => ({fill: activeSum(p) ? 2 : 0, tone: activeSum(p) ? 2 : 0, strong: activeSum(p)}))}
          {sum.map((row, i) =>
            row.map((v, j) => {
              const p = i * n + j;
              return (
                <g key={`s${i}-${j}`} opacity={stage(t, sumAt(p) + 0.1, sumAt(p) + STEP)}>
                  <Cell x={X_R + j * C} y={Y1 + i * CH} w={C} h={CH} math={num(v)} fill={3} tone={activeSum(p) ? 3 : 0} strong={activeSum(p)} />
                </g>
              );
            }),
          )}
          <Brackets x0={X_A - 4} y0={Y1 - 3} x1={X_A + gw + 4} y1={Y1 + gh + 3} />
          <Brackets x0={X_B - 4} y0={Y1 - 3} x1={X_B + gw + 4} y1={Y1 + gh + 3} />
          <Brackets x0={X_R - 4} y0={Y1 - 3} x1={X_R + gw + 4} y1={Y1 + gh + 3} />
          <SvgMath x={X_OP1 + 6} y={Y1 + gh / 2} math="+" fontSize={16} />
          <SvgMath x={X_EQ + 6} y={Y1 + gh / 2} math="=" fontSize={16} />

          {/* k A */}
          <SvgMath x={X_B + gw / 2} y={Y2 - 14} math="A" fontSize={14} tone={1} />
          <SvgMath x={X_R + gw / 2} y={Y2 - 14} math={`${num(k)}A`} fontSize={14} tone={3} />
          <SvgMath x={X_B - 14} y={Y2 + gh / 2} math={`${factor(k)} \\times`} fontSize={16} anchor="end" space={X_B - 12} tone={2} />
          {grid(a, X_B, Y2, (p) => ({fill: activeScale(p) ? 1 : 0, tone: activeScale(p) ? 1 : 0, strong: activeScale(p)}))}
          {scaled.map((row, i) =>
            row.map((v, j) => {
              const p = i * n + j;
              return (
                <g key={`k${i}-${j}`} opacity={stage(t, scaleAt(p) + 0.1, scaleAt(p) + STEP)}>
                  <Cell x={X_R + j * C} y={Y2 + i * CH} w={C} h={CH} math={num(v)} fill={3} tone={activeScale(p) ? 3 : 0} strong={activeScale(p)} />
                </g>
              );
            }),
          )}
          <Brackets x0={X_B - 4} y0={Y2 - 3} x1={X_B + gw + 4} y1={Y2 + gh + 3} />
          <Brackets x0={X_R - 4} y0={Y2 - 3} x1={X_R + gw + 4} y1={Y2 + gh + 3} />
          <SvgMath x={X_EQ + 6} y={Y2 + gh / 2} math="=" fontSize={16} />
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver as contas casa por casa de novo
        </button>
      </div>
    </div>
  );
}
