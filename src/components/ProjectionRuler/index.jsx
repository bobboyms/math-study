import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {add, clipLine, dot, kOf, norm, rightAngle, sub, times, num, pair, pairText} from '../mathviz/projection';

// O número k conta quantos u cabem na sombra (lição 7.32).
//
// A sombra de v (verde) fica sobre a reta de u. Logo abaixo da reta, cópias de
// u (azul) são encostadas uma na ponta da outra, a partir da origem, como uma
// régua: primeiro as cópias inteiras, depois o pedaço que falta (tracejado).
// Quando k é negativo, as cópias são de −u e vão para trás. O painel faz a
// conta k = (v · u) / (u · u) e lê o resultado como "tantas cópias e mais
// tanto de outra".

const PRESETS = [
  {u: [4, 3], v: [2, 9]},
  {u: [4, 2], v: [1, 4]},
  {u: [2, 1], v: [-4, 3]},
];

const off = (d, L) => {
  const n = norm(d) || 1;
  return {dx: (d[0] / n) * L, dy: (-d[1] / n) * L};
};

export default function ProjectionRuler({initial = 0, caption}) {
  const [i, setI] = useState(initial);
  const {u, v} = PRESETS[i];
  const k = kOf(v, u);
  const H = times(k, u);
  const whole = Math.floor(Math.abs(k) + 1e-9);
  const part = Math.abs(k) - whole;
  const step = times(k >= 0 ? 1 : -1, u);
  const n = whole + (part > 1e-9 ? 1 : 0);
  const duration = 0.6 + n * 0.9 + 0.6;
  const {ref, t, play, playing} = useAnimation({duration});

  const pts = [[0, 0], u, v, H, times(-0.2, step)];
  const B = [
    Math.min(...pts.map((p) => p[0])) - 1.2,
    Math.max(...pts.map((p) => p[0])) + 1.2,
    Math.min(...pts.map((p) => p[1])) - 1.2,
    Math.max(...pts.map((p) => p[1])) + 1,
  ];

  const nrm = [-u[1], u[0]];
  const vSide = dot(v, nrm) >= 0 ? 1 : -1;
  const down = times(-vSide / norm(nrm), nrm);
  const gap = times(0.32, down); // as cópias ficam logo abaixo da reta

  const line = clipLine([0, 0], u, B);
  const segments = [];
  if (line) segments.push({from: line[0], to: line[1], muted: true, dashed: true});
  segments.push({from: [0, 0], to: v, tone: 2, arrow: true});
  segments.push({from: v, to: H, tone: 2, dashed: true});
  segments.push(...rightAngle(H, times(-1, step), sub(v, H), 0.26));
  segments.push({from: [0, 0], to: H, tone: 3, arrow: true});

  const labels = [{at: v, math: '\\vec{v}', tone: 2, ...off(v, 16)}];

  for (let c = 0; c < n; c += 1) {
    const s = stage(t, 0.6 + c * 0.9, 0.6 + c * 0.9 + 0.7);
    if (s <= 0.01) break;
    const len = c < whole ? 1 : part;
    const from = add(times(c, step), gap);
    const to = add(from, times(len * s, step));
    segments.push({from, to, tone: 1, arrow: true, dashed: c >= whole});
    if (s > 0.98) {
      const mid = add(times(c + len / 2, step), gap);
      labels.push({at: mid, math: c < whole ? (k >= 0 ? '\\vec{u}' : '-\\vec{u}') : num(part, 2), tone: 1, ...off(down, 20)});
    }
  }

  return (
    <div className={shared.wrapper} data-explorer="projection-ruler">
      <div ref={ref}>
        <CartesianPlane
          xMin={B[0]}
          xMax={B[1]}
          yMin={B[2]}
          yMax={B[3]}
          xUnit={i === 0 ? 30 : 46}
          axisLabels={['x', 'y']}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'A sombra de v (verde) fica sobre a reta de u. Logo abaixo, cópias de u (azul) são encostadas uma na ponta da outra, como uma régua. O número k conta quantas cópias cabem na sombra; o pedaço tracejado é a fração que sobra.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula
            math={`k = \\frac{\\vec{v} \\cdot \\vec{u}}{\\vec{u} \\cdot \\vec{u}} = \\frac{${num(dot(v, u), 2)}}{${num(dot(u, u), 2)}} = ${num(k, 2)}, \\qquad ${num(k, 2)}\\,${pair(u, 2)} = ${pair(H, 2)}`}
          />
        </p>
        <p>
          {k >= 0 && whole === 0
            ? `A sombra é mais curta que u: nela cabe só ${num(part, 2).replace('{,}', ',')} de u.`
            : k >= 0
            ? `Na sombra ${whole === 1 ? 'cabe uma cópia inteira de u' : `cabem ${whole} cópias inteiras de u`}${part > 1e-9 ? ` e mais ${num(part, 2).replace('{,}', ',')} de outra` : ''}.`
            : `O k é negativo: as cópias são de −u e vão para trás da origem. Cabe${whole === 1 ? '' : 'm'} ${whole === 1 ? 'uma cópia inteira' : `${whole} cópias inteiras`}${part > 1e-9 ? ` e mais ${num(part, 2).replace('{,}', ',')} de outra` : ''}.`}
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver a régua de novo
        </button>
      </div>
      <div className={shared.buttons}>
        {PRESETS.map((p, j) => (
          <button
            key={j}
            type="button"
            aria-pressed={i === j}
            disabled={playing}
            onClick={() => {
              setI(j);
              play({duration: 0.6 + (Math.floor(Math.abs(kOf(p.v, p.u)) + 1e-9) + 1) * 0.9 + 0.6});
            }}
          >
            v = {pairText(p.v)}, u = {pairText(p.u)}
          </button>
        ))}
      </div>
    </div>
  );
}
