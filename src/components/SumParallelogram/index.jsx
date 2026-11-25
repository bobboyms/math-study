import React from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath} from '../VectorSumKit';

// A regra do paralelogramo (lição 7.29): a ordem das parcelas não muda a soma.
//
// 1. u e v saem do mesmo ponto, como dois empurrões que agem juntos.
// 2. Uma cópia de v desliza ao longo de u até a ponta de u: é o caminho
//    “u depois v”, por baixo.
// 3. Uma cópia de u desliza ao longo de v até a ponta de v: é o caminho
//    “v depois u”, por cima.
// 4. As duas cópias terminam no mesmo ponto, e a diagonal é a soma.

const DURATION = 5;

export default function SumParallelogram({u = [3, 1], v = [1, 2], caption}) {
  const {ref, t, play, playing} = useAnimation({duration: DURATION});
  const s = [u[0] + v[0], u[1] + v[1]];

  const k0 = stage(t, 0.2, 0.9);
  const k1 = stage(t, 1.1, 2.3);
  const k2 = stage(t, 2.5, 3.7);
  const k3 = stage(t, 3.9, DURATION);

  const segments = [];
  const labels = [];
  if (k0 > 0.03) {
    segments.push({from: [0, 0], to: [u[0] * k0, u[1] * k0], tone: 1, arrow: true});
    segments.push({from: [0, 0], to: [v[0] * k0, v[1] * k0], tone: 2, arrow: true});
  }
  if (k0 >= 1) {
    labels.push({at: [u[0] / 2, u[1] / 2], math: '\\vec{u}', tone: 1, dx: 8, dy: 16});
    labels.push({at: [v[0] / 2, v[1] / 2], math: '\\vec{v}', tone: 2, dx: -16, dy: -2});
  }
  if (k1 > 0.03) {
    const a = [u[0] * k1, u[1] * k1];
    segments.push({from: a, to: [a[0] + v[0], a[1] + v[1]], tone: 2, arrow: true, dashed: true});
    if (k1 >= 1) labels.push({at: [u[0] + v[0] / 2, u[1] + v[1] / 2], math: '\\vec{v}', tone: 2, dx: 16, dy: 2});
  }
  if (k2 > 0.03) {
    const b = [v[0] * k2, v[1] * k2];
    segments.push({from: b, to: [b[0] + u[0], b[1] + u[1]], tone: 1, arrow: true, dashed: true});
    if (k2 >= 1) labels.push({at: [v[0] + u[0] / 2, v[1] + u[1] / 2], math: '\\vec{u}', tone: 1, dx: -4, dy: -16});
  }
  if (k3 > 0.03) segments.push({from: [0, 0], to: [s[0] * k3, s[1] * k3], tone: 3, arrow: true});
  if (k3 >= 1) labels.push({at: [s[0] * 0.55, s[1] * 0.55], math: '\\vec{u} + \\vec{v}', tone: 3, dx: 6, dy: -4});

  const points = [];
  if (k2 >= 1) points.push({at: s, tone: 3, r: 4, label: pairMath(...s), dx: 28, dy: -10});

  return (
    <div className={shared.wrapper} data-explorer="sum-parallelogram">
      <div ref={ref}>
        <CartesianPlane
          xMin={-1}
          xMax={6}
          yMin={-1}
          yMax={4}
          xUnit={50}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'u e v saem do mesmo ponto. Uma cópia de v desliza até a ponta de u (caminho de baixo: u depois v) e uma cópia de u desliza até a ponta de v (caminho de cima: v depois u). As duas cópias terminam no mesmo ponto. A diagonal verde é a soma.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p>
          Por baixo: <Formula math={`${pairMath(...u)} + ${pairMath(...v)} = ${pairMath(...s)}`} />. Por cima:{' '}
          <Formula math={`${pairMath(...v)} + ${pairMath(...u)} = ${pairMath(...s)}`} />.
        </p>
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver os dois caminhos de novo
        </button>
      </div>
    </div>
  );
}
