import React from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// A regra de Sarrus animada (lição 11.9).
//
// A matriz 3 × 3 com as duas primeiras colunas copiadas à direita (mais
// claras, depois de uma linha tracejada). As seis diagonais acendem uma de
// cada vez: as três que descem (azul, produto somado) e as três que sobem
// (laranja, produto subtraído). Cada produto entra na lista da direita, e o
// painel vai montando a soma. No quadro final, as seis diagonais ficam
// desenhadas e a conta inteira está no painel.
//
// `letters` troca os números pelas letras a até i.

const LET = [
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
  ['g', 'h', 'i'],
];
const CW = 46;
const RH = 40;
const X0 = 30;
const TOP = 34;
const SLOT = 0.85;
const START = 0.4;

export default function SarrusDiagonals({matrix = [[1, 2, 3], [2, 5, 7], [1, 3, 5]], letters = false, caption}) {
  const total = START + 6 * SLOT + 0.6;
  const {ref, t, play, playing} = useAnimation({duration: total});
  const ent = (r, c) => (letters ? LET[r][c % 3] : String(matrix[r][c % 3]));
  const val = (r, c) => matrix[r][c % 3];

  // diagonais: 3 que descem, começando nas colunas 0, 1, 2; 3 que sobem,
  // começando embaixo nas colunas 0, 1, 2.
  const diags = [];
  for (let c = 0; c < 3; c += 1) diags.push({cells: [[0, c], [1, c + 1], [2, c + 2]], sign: 1});
  for (let c = 0; c < 3; c += 1) diags.push({cells: [[2, c], [1, c + 1], [0, c + 2]], sign: -1});
  // ordem de leitura de cima para baixo (ceg, afh, bdi), como no texto
  const readOrder = (dg) => (dg.sign > 0 ? dg.cells : [...dg.cells].reverse());

  const cx = (c) => X0 + c * CW + (c >= 3 ? 14 : 0);
  const cy = (r) => TOP + r * RH;
  const listX = cx(4) + 50;
  const W = listX + 150;
  const H = TOP + 2 * RH + 30;
  const top = TOP - RH / 2 + 4;
  const bottom = TOP + 2 * RH + RH / 2 - 4;

  const prog = diags.map((_, i) => stage(t, START + i * SLOT, START + i * SLOT + SLOT * 0.6));
  const shown = prog.filter((v) => v > 0.5).length;

  const prodTex = (dg) => (letters ? readOrder(dg).map(([r, c]) => ent(r, c)).join('') : readOrder(dg).map(([r, c]) => ent(r, c)).join(' \\times '));
  const prodVal = (dg) => dg.cells.reduce((acc, [r, c]) => acc * val(r, c), 1);

  let sum = '';
  let totalVal = 0;
  diags.forEach((dg, i) => {
    if (i >= shown) return;
    const v = letters ? prodTex(dg) : String(prodVal(dg));
    totalVal += dg.sign * prodVal(dg);
    if (i === 0) sum = v;
    else sum += ` ${dg.sign > 0 ? '+' : '-'} ${v}`;
  });
  const finished = shown === 6;
  if (finished && !letters) sum += ` = ${totalVal}`;

  const bracket = (x, dir) => `M ${x + 7 * dir} ${top} L ${x} ${top} L ${x} ${bottom} L ${x + 7 * dir} ${bottom}`;

  return (
    <div className={shared.wrapper} data-explorer="sarrus-diagonals">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label="Regra de Sarrus: as seis diagonais da matriz com as duas primeiras colunas copiadas">
          {diags.map((dg, i) => {
            const a = dg.cells[0];
            const b = dg.cells[2];
            const active = playing && prog[i] > 0 && (i === diags.length - 1 || prog[i + 1] <= 0);
            const on = prog[i];
            if (on <= 0) return null;
            const tone = dg.sign > 0 ? 1 : 2;
            const ext = 0.32;
            const ax = cx(a[1]) - (cx(b[1]) - cx(a[1])) * ext / 2;
            const ay = cy(a[0]) - (cy(b[0]) - cy(a[0])) * ext / 2;
            const bx = cx(b[1]) + (cx(b[1]) - cx(a[1])) * ext / 2;
            const by = cy(b[0]) + (cy(b[0]) - cy(a[0])) * ext / 2;
            return (
              <g key={i}>
                {active && (
                  <line x1={ax} y1={ay} x2={bx} y2={by} stroke={`var(--mv-tone-${tone})`} strokeWidth={26} strokeOpacity={0.18} strokeLinecap="round" />
                )}
                <line x1={ax} y1={ay} x2={bx} y2={by} stroke={`var(--mv-tone-${tone})`} strokeWidth={2} strokeOpacity={0.75 * on} />
              </g>
            );
          })}
          <path d={bracket(cx(0) - 22, 1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <path d={bracket(cx(2) + 22, -1)} fill="none" stroke="var(--ifm-font-color-base)" strokeWidth={1.5} />
          <line x1={cx(2) + 33} x2={cx(2) + 33} y1={top} y2={bottom} stroke="var(--ifm-color-emphasis-500)" strokeWidth={1.2} strokeDasharray="4 4" />
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3, 4].map((c) => (
              <g key={`${r}-${c}`} opacity={c >= 3 ? 0.6 : 1}>
                <SvgMath x={cx(c)} y={cy(r)} math={ent(r, c)} fontSize={16} halo />
              </g>
            )),
          )}
          {diags.map((dg, i) => {
            if (prog[i] <= 0.5) return null;
            const tone = dg.sign > 0 ? 1 : 2;
            const col = dg.sign > 0 ? 0 : 1;
            const row = i % 3;
            return (
              <SvgMath
                key={`p${i}`}
                x={listX + col * 70}
                y={cy(row)}
                math={`${dg.sign > 0 ? '+' : '-'}\\,${letters ? prodTex(dg) : prodVal(dg)}`}
                fontSize={15}
                tone={tone}
                anchor="start"
              />
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula math={`\\det = ${sum || '\\ldots'}`} />
        </p>
        {shown > 0 && !finished && (
          <p>
            {diags[shown - 1].sign > 0 ? 'Diagonal que desce: produto somado' : 'Diagonal que sobe: produto subtraído'}
            {letters ? '.' : `: ${readOrder(diags[shown - 1]).map(([r, c]) => val(r, c)).join(' × ')} = ${String(prodVal(diags[shown - 1])).replace('-', '−')}.`}
          </p>
        )}
        {finished && <p>As três diagonais que descem (azul) entram somando; as três que sobem (laranja) entram subtraindo.</p>}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver as diagonais de novo
        </button>
      </div>
    </div>
  );
}
