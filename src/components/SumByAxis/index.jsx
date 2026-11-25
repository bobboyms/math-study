import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath, signedMath, plainNumber} from '../VectorSumKit';

// Cada eixo soma sozinho (lição 7.29): por que a soma de vetores é feita
// coordenada a coordenada.
//
// 1. As setas u e v aparecem, ponta com cauda.
// 2. Cada seta se desmonta em um passo horizontal e um vertical (tracejados).
// 3. Os passos horizontais descem até uma faixa embaixo do desenho, e os
//    verticais vão até uma faixa à esquerda. Como no desenho o passo
//    horizontal de v já começa onde o de u terminou, eles chegam à faixa
//    encostados, um depois do outro. O mesmo acontece com os verticais.
// 4. Embaixo de cada faixa aparece o total (verde), que é a coordenada da
//    soma. Um passo horizontal nunca se junta a um vertical.

const PRESETS = [
  {u: [3, 1], v: [1, 2]},
  {u: [5, -2], v: [-1, 6]},
  {u: [4, 1], v: [-3, 2]},
];
const DURATION = 5;
const ROW = -3.5; // faixa dos passos horizontais
const COL = -2.1; // faixa dos passos verticais
const GAP = 0.3;

export default function SumByAxis({initial = 0, caption}) {
  const [index, setIndex] = useState(initial);
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const {u, v} = PRESETS[index];
  const s = [u[0] + v[0], u[1] + v[1]];

  const ka = stage(t, 0.2, 1.2);
  const kb = stage(t, 1.3, 1.9);
  const kc = stage(t, 2.1, 3.7);
  const kd = stage(t, 3.9, 4.8);

  const segments = [];
  const labels = [];

  // 1. as setas
  if (ka > 0.03) {
    const ku = Math.min(1, ka * 2);
    const kv = Math.max(0, ka * 2 - 1);
    segments.push({from: [0, 0], to: [u[0] * ku, u[1] * ku], tone: 1, arrow: true});
    if (kv > 0.03) segments.push({from: u, to: [u[0] + v[0] * kv, u[1] + v[1] * kv], tone: 2, arrow: true});
  }

  // 2 e 3. os passos: aparecem no lugar e depois deslizam até as faixas
  if (kb > 0.03) {
    const hy = (y0, target) => y0 + (target - y0) * kc;
    const vx = (x0, target) => x0 + (target - x0) * kc;
    // horizontais: o de u na altura 0, o de v na altura u2
    const yu = hy(0, ROW + GAP);
    const yv = hy(u[1], ROW + 2 * GAP);
    segments.push({from: [0, yu], to: [u[0] * kb, yu], tone: 1, dashed: kc < 0.99});
    segments.push({from: [u[0], yv], to: [u[0] + v[0] * kb, yv], tone: 2, dashed: kc < 0.99});
    // verticais: o de u em x = u1, o de v em x = u1 + v1
    const xu = vx(u[0], COL + GAP);
    const xv = vx(s[0], COL + 2 * GAP);
    segments.push({from: [xu, 0], to: [xu, u[1] * kb], tone: 1, dashed: kc < 0.99});
    segments.push({from: [xv, u[1]], to: [xv, u[1] + v[1] * kb], tone: 2, dashed: kc < 0.99});
  }

  // 4. os totais e a seta da soma
  if (kd > 0.03) {
    segments.push({from: [0, ROW], to: [s[0] * kd, ROW], tone: 3});
    segments.push({from: [COL, 0], to: [COL, s[1] * kd], tone: 3});
    segments.push({from: [0, 0], to: [s[0] * kd, s[1] * kd], tone: 3, arrow: true});
  }
  if (kd >= 1) {
    labels.push({at: [s[0] / 2, ROW], math: `${s[0]}`, tone: 3, dy: 14, fontSize: 13});
    labels.push({at: [COL, s[1] / 2], math: `${s[1]}`, tone: 3, dx: -14, fontSize: 13});
    labels.push({at: s, math: `\\vec{u} + \\vec{v}`, tone: 3, dx: s[0] >= 3 ? 34 : -34, dy: -12, fontSize: 13});
  }
  if (ka >= 1 && kd < 1) {
    labels.push({at: [u[0] / 2, u[1] / 2], math: '\\vec{u}', tone: 1, dy: u[1] >= 0 ? -14 : 14, dx: -6});
    labels.push({at: [u[0] + v[0] / 2, u[1] + v[1] / 2], math: '\\vec{v}', tone: 2, dx: 14});
  }

  const formula = `\\vec{u} + \\vec{v} = (${signedMath(u[0])} + ${signedMath(v[0])},\\ ${signedMath(u[1])} + ${signedMath(v[1])}) = ${pairMath(...s)}`;

  return (
    <div className={shared.wrapper} data-explorer="sum-by-axis">
      <div ref={ref}>
        <CartesianPlane
          xMin={-2.6}
          xMax={6.6}
          yMin={-4.2}
          yMax={5.6}
          xUnit={34}
          xTicks={[-2, -1, 1, 2, 3, 4, 5, 6].map((at) => ({at}))}
          yTicks={[-3, -2, -1, 1, 2, 3, 4, 5].map((at) => ({at}))}
          axisLabels={['x', 'y']}
          segments={segments}
          labels={labels}
          caption={
            caption ??
            'Cada seta se desmonta num passo horizontal e num vertical. Os passos horizontais descem até a faixa de baixo e os verticais vão até a faixa da esquerda. Em cada faixa, o passo de v (laranja) começa onde o de u (azul) terminou, e o total (verde) é a coordenada da soma.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={formula} />
        </p>
        <p>
          Passos horizontais: <Formula math={`${signedMath(u[0])} + ${signedMath(v[0])} = ${s[0]}`} />. Passos verticais:{' '}
          <Formula math={`${signedMath(u[1])} + ${signedMath(v[1])} = ${s[1]}`} />.
        </p>
      </div>
      <div className={shared.buttons}>
        {PRESETS.map((p, i) => (
          <button
            key={i}
            type="button"
            disabled={playing}
            aria-pressed={i === index}
            onClick={() => {
              setIndex(i);
              play();
            }}
          >
            u = ({plainNumber(p.u[0])}, {plainNumber(p.u[1])}) e v = ({plainNumber(p.v[0])}, {plainNumber(p.v[1])})
          </button>
        ))}
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
      </div>
    </div>
  );
}
