import React, {useId, useState} from 'react';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import styles from '../LinearGridMorph/styles.module.css';
import {Arrow, Axes, ClipDefs, FixedGrid, frame, num, numText} from '../LinearGridMorph/plane';
import {arcPath} from '../mathviz/useAnimation';

// Simetria e autovetores perpendiculares (lição 11.13).
//
// A matriz [[a, b], [c, d]] com o deslizante mudando só a entrada c (de baixo,
// à esquerda). Para cada c, a figura desenha as retas dos autovetores (tom 1
// para o maior autovalor, tom 2 para o menor) e o ângulo entre elas. Quando
// c = b, a matriz é simétrica, e o ângulo é 90°. O painel escreve o
// discriminante (a − d)² + 4bc, os autovalores e o ângulo. Com discriminante
// negativo, não há reta nenhuma (como na rotação de 90°).

function eig(M) {
  const [[a, b], [c, d]] = M;
  const tr = a + d;
  const det = a * d - b * c;
  const disc = (a - d) * (a - d) + 4 * b * c;
  if (disc < -1e-12) return {disc, real: false, tr, det};
  const r = Math.sqrt(Math.max(0, disc));
  const l1 = (tr + r) / 2;
  const l2 = (tr - r) / 2;
  const vec = (l) => {
    // (A − λI)v = 0: usa a linha com mais informação
    const r1 = [a - l, b];
    const r2 = [c, d - l];
    const row = Math.hypot(r1[0], r1[1]) >= Math.hypot(r2[0], r2[1]) ? r1 : r2;
    if (Math.hypot(row[0], row[1]) < 1e-12) return null;
    const v = [-row[1], row[0]];
    const L = Math.hypot(v[0], v[1]);
    const u = [v[0] / L, v[1] / L];
    return u[0] < -1e-12 || (Math.abs(u[0]) < 1e-12 && u[1] < 0) ? [-u[0], -u[1]] : u;
  };
  return {disc, real: true, l1, l2, v1: vec(l1), v2: Math.abs(disc) < 1e-12 ? null : vec(l2), tr, det};
}

export default function SvdSymmetrySlider({
  base = [
    [4, 1],
    [2, 3],
  ],
  min = -1,
  max = 3,
  step = 0.25,
  window: win = [-3, 3, -3, 3],
  unit = 52,
  caption,
}) {
  const uid = useId().replace(/:/g, '-');
  const [c, setC] = useState(base[1][0]);
  const M = [
    [base[0][0], base[0][1]],
    [c, base[1][1]],
  ];
  const e = eig(M);
  const symmetric = Math.abs(c - base[0][1]) < 1e-12;

  const f = frame(win, unit);
  const clipId = `clip${uid}`;
  const R = 10;
  const line = (v, tone, wid) => (
    <line
      x1={f.X(-R * v[0])}
      y1={f.Y(-R * v[1])}
      x2={f.X(R * v[0])}
      y2={f.Y(R * v[1])}
      stroke={`var(--mv-tone-${tone})`}
      strokeWidth={wid}
      strokeDasharray="7 5"
      clipPath={`url(#${clipId})`}
    />
  );

  // Ângulo entre as duas retas (de 0° a 90°) e o arco que o mostra.
  let ang = null;
  let arc = null;
  if (e.real && e.v1 && e.v2) {
    const a1 = Math.atan2(e.v1[1], e.v1[0]);
    let a2 = Math.atan2(e.v2[1], e.v2[0]);
    let diff = a2 - a1;
    while (diff <= -Math.PI / 2) {
      a2 += Math.PI;
      diff += Math.PI;
    }
    while (diff > Math.PI / 2) {
      a2 -= Math.PI;
      diff -= Math.PI;
    }
    ang = (Math.abs(diff) * 180) / Math.PI;
    const lo = Math.min(a1, a2);
    const hi = Math.max(a1, a2);
    arc = {lo, hi, end2: a2};
  }
  const angText = ang == null ? '' : numText(ang, 2);

  return (
    <div className={shared.wrapper} data-explorer="svd-symmetry-slider">
      <figure className={styles.figure}>
        <svg className={styles.svg} viewBox={`0 0 ${f.W} ${f.H}`} style={{maxWidth: `${f.W}px`}} role="img" aria-label="As retas dos autovetores da matriz">
          <ClipDefs f={f} id={clipId} />
          <FixedGrid f={f} clipId={clipId} />
          <Axes f={f} />
          {e.real && e.v1 && line(e.v1, 1, 2)}
          {e.real && e.v2 && line(e.v2, 2, 2)}
          {arc && (
            <path d={arcPath(f.X(0), f.Y(0), 0.7 * unit, arc.lo, arc.hi)} fill="none" stroke="var(--mv-tone-3)" strokeWidth={2.2} />
          )}
          {e.real && e.v1 && <Arrow f={f} to={[1.6 * e.v1[0], 1.6 * e.v1[1]]} tone={1} label={`\\lambda_1 = ${num(e.l1, 2)}`} offset={[e.v1[1] > 0.9 ? 10 : 8, -10, 'start']} />}
          {e.real && e.v2 && <Arrow f={f} to={[1.6 * e.v2[0], 1.6 * e.v2[1]]} tone={2} label={`\\lambda_2 = ${num(e.l2, 2)}`} offset={[8, 14, 'start']} />}
        </svg>
        {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Entrada de baixo, à esquerda: <strong>c = {numText(c, 2)}</strong>
          </span>
          <input type="range" min={min} max={max} step={step} value={c} onChange={(ev) => setC(Number(ev.target.value))} aria-label="Entrada de baixo, à esquerda" />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite">
        <p className={shared.formula}>
          <Formula
            math={`\\begin{bmatrix} ${num(M[0][0])} & ${num(M[0][1])} \\\\ ${num(c)} & ${num(M[1][1])} \\end{bmatrix}, \\qquad \\Delta = (${num(M[0][0])} - ${num(M[1][1])})^2 + 4 \\times ${num(M[0][1])} \\times ${c < 0 ? `(${num(c)})` : num(c)} = ${num(e.disc, 2)}`}
          />
        </p>
        {symmetric ? (
          <p>
            <strong>A matriz é simétrica</strong> (as duas entradas fora da diagonal são iguais). Os autovalores são reais, e as duas retas
            de autovetores fazem <strong>90°</strong>: são perpendiculares.
          </p>
        ) : !e.real ? (
          <p>
            O discriminante é negativo: nenhum autovalor real e <strong>nenhuma reta</strong> de autovetores, como na rotação de 90°.
          </p>
        ) : !e.v2 ? (
          <p>
            O discriminante é zero: um autovalor só, {numText(e.l1, 2)}, e <strong>uma reta só</strong> de autovetores.
          </p>
        ) : (
          <p>
            A matriz não é simétrica ({numText(M[0][1], 2)} em cima, {numText(c, 2)} embaixo). As retas de autovetores fazem{' '}
            <strong>{angText}°</strong>
            {Math.abs(ang - 90) < 0.005 ? '.' : ': não são perpendiculares.'}
          </p>
        )}
      </div>
    </div>
  );
}
