import React, {useState} from 'react';
import SvgMath from '../mathviz/SvgMath';
import Formula, {mathNumber} from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import geo from '../GeoFigure/styles.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {plainNumber, signedMath} from '../VectorSumKit';

// A variável livre como um botão que comanda as outras (lição 11.4).
//
// O deslizante escolhe o valor t da incógnita sem pivô. As barras mostram o
// valor de cada incógnita: a livre segue o t, e as outras são calculadas a
// partir dele, de trás para a frente. O painel faz essas contas e confere a
// lista nas equações originais: qualquer t dá uma solução. Ao entrar na
// tela, o t passeia sozinho (−1 → 3 → 1).
//
// Props:
//   rows      equações originais, como matriz aumentada
//   solution  cada incógnita como [c0, c1], isto é, c0 + c1 t
//   freeIndex índice da incógnita livre
//   steps     LaTeX de cada incógnita em função de t, na ordem em que são
//             calculadas (de trás para a frente)

const VARS = ['x', 'y', 'z'];
const W = 440;
const X0 = 250;
const U = 13;
const TOP = 34;
const RH = 38;
const INTRO = 4.2;

export default function SystemFreeVariable({rows, solution, freeIndex = 2, steps, tRange = [-2, 4, 0.5], caption}) {
  const [t, setT] = useState(1);
  const {ref, play, playing} = useAnimation({
    duration: INTRO,
    onFrame: (time) => {
      let v;
      if (time <= 1.4) v = 1 - 2 * stage(time, 0.2, 1.4);
      else if (time <= 3.0) v = -1 + 4 * stage(time, 1.4, 3.0);
      else v = 3 - 2 * stage(time, 3.0, INTRO);
      setT(Math.round(v * 10) / 10);
    },
  });

  const vals = solution.map(([c0, c1]) => c0 + c1 * t);
  const H = TOP + (VARS.length - 1) * RH + 46;
  const tones = [1, 2, 3];

  const lhs = rows.map((r) => r.slice(0, 3).reduce((s, a, j) => s + a * vals[j], 0));

  return (
    <div className={shared.wrapper} data-explorer="system-free-variable">
      <figure ref={ref} className={geo.figure}>
        <svg className={geo.svg} viewBox={`0 0 ${W} ${H}`} style={{maxWidth: `${W}px`}} role="img" aria-label={`Com t = ${plainNumber(t)}, a solução é (${vals.map((v) => plainNumber(v)).join('; ')}).`}>
          <line x1={X0} x2={X0} y1={TOP - 20} y2={TOP + 2 * RH + 18} stroke="var(--mv-guide)" strokeWidth={1.4} />
          {[-10, -5, 5, 10].map((v) => (
            <g key={v}>
              <line x1={X0 + v * U} x2={X0 + v * U} y1={TOP - 16} y2={TOP + 2 * RH + 14} stroke="var(--mv-guide)" strokeWidth={0.8} strokeDasharray="3 4" />
              <SvgMath x={X0 + v * U} y={TOP + 2 * RH + 28} math={String(v)} fontSize={11} />
            </g>
          ))}
          <SvgMath x={X0} y={TOP + 2 * RH + 28} math="0" fontSize={11} />
          {vals.map((v, i) => {
            const y = TOP + i * RH;
            const x1 = X0 + Math.min(0, v) * U;
            const w = Math.abs(v) * U;
            const end = X0 + v * U;
            return (
              <g key={i}>
                <SvgMath x={18} y={y} math={VARS[i] + (i === freeIndex ? '\\ (\\text{livre})' : '')} anchor="start" space={120} fontSize={14} tone={tones[i]} />
                <rect x={x1} y={y - 10} width={Math.max(w, 0.5)} height={20} rx={3} fill={`var(--mv-tone-${tones[i]})`} fillOpacity={0.75} />
                <SvgMath x={end + (v >= 0 ? 8 : -8)} y={y} math={mathNumber(v, 2)} anchor={v >= 0 ? 'start' : 'end'} fontSize={14} halo />
              </g>
            );
          })}
        </svg>
        {caption && <figcaption className={shared.caption}>{caption}</figcaption>}
      </figure>
      <div className={shared.controls}>
        <label className={shared.control}>
          <span>
            Valor da variável livre, t: <strong>{plainNumber(t)}</strong>
          </span>
          <input
            type="range"
            min={tRange[0]}
            max={tRange[1]}
            step={tRange[2]}
            value={t}
            disabled={playing}
            onChange={(e) => setT(Number(e.target.value))}
            aria-label="Valor da variável livre t"
            aria-valuetext={plainNumber(t)}
          />
        </label>
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>De trás para a frente, com t = {plainNumber(t)}:</p>
        <p className={shared.formula}>
          <Formula
            math={steps
              .map((s) => {
                const j = VARS.indexOf(s.v);
                const sub = s.tex.replace(/t/g, `\\,${signedMath(t)}`).replace(/(\d)\\,/g, '$1 \\times ').replace(/^\\,/, '');
                const mid = sub === mathNumber(vals[j], 2) ? '' : ` = ${sub}`;
                return `${s.v} = ${s.tex}${mid} = ${mathNumber(vals[j], 2)}`;
              })
              .join(';\\quad ')}
          />
        </p>
        <p>Conferindo nas equações originais:</p>
        {rows.map((r, i) => (
          <p key={i} className={shared.formula}>
            <Formula
              math={`${r
                .slice(0, 3)
                .map((a, j) => `${a === 1 ? '' : `${a} \\times `}${signedMath(vals[j])}`)
                .join(' + ')} = ${mathNumber(lhs[i], 2)}\\ ${Math.abs(lhs[i] - r[3]) < 1e-9 ? '\\checkmark' : ''}`}
            />
          </p>
        ))}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver o passeio do t de novo
        </button>
      </div>
    </div>
  );
}
