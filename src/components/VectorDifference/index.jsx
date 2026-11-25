import React, {useState} from 'react';
import CartesianPlane from '../CartesianPlane';
import Formula from '../mathviz/Formula';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';
import {pairMath} from '../VectorSumKit';

// A subtração de vetores (lição 7.29): u − v é o que falta andar, depois de
// v, para chegar à ponta de u.
//
// 1. u e v saem da origem.
// 2. Uma seta verde cresce da ponta de v até a ponta de u: é u − v.
// 3. (opcional, `slide`) Uma cópia tracejada dessa seta desliza até a origem
//    e termina no ponto u − v: a mesma seta, desenhada a partir da origem.
// O botão “ler como u + (−v)” acrescenta −v saindo da ponta de u: ela chega
// ao mesmo ponto que a cópia, porque u − v = u + (−v).
//
// Com `tips` (por exemplo ['B', 'A']) as pontas recebem nomes de pontos, e a
// figura mostra que AB = B − A é uma subtração de vetores.

const DURATION = 4;

export default function VectorDifference({
  u = [4, 1],
  v = [1, 3],
  uName = '\\vec{u}',
  vName = '\\vec{v}',
  diffName = '\\vec{u} - \\vec{v}',
  tips,
  slide = true,
  minusButton = true,
  window: win = {xMin: -1, xMax: 6, yMin: -3, yMax: 4},
  xUnit = 48,
  // deslocamentos (dx, dy) dos rótulos de u, v e da diferença, em pixels
  offsets = {u: [40, 18], v: [-56, 0], d: [66, -12], tipU: [14, -10], tipV: [-12, -12]},
  caption,
}) {
  const [minus, setMinus] = useState(false);
  const {ref, t, play, playing} = useAnimation({duration: slide ? DURATION : 2.8});
  const d = [u[0] - v[0], u[1] - v[1]];

  const k0 = stage(t, 0.2, 1.0);
  const k1 = stage(t, 1.2, 2.4);
  const k2 = slide ? stage(t, 2.6, 3.8) : 0;

  const segments = [];
  const labels = [];
  const points = [];

  if (k0 > 0.03) {
    segments.push({from: [0, 0], to: [u[0] * k0, u[1] * k0], tone: 1, arrow: true});
    segments.push({from: [0, 0], to: [v[0] * k0, v[1] * k0], tone: 2, arrow: true});
  }
  if (k0 >= 1) {
    labels.push({at: [u[0] / 2, u[1] / 2], math: `${uName} = ${pairMath(...u)}`, tone: 1, dx: offsets.u[0], dy: offsets.u[1]});
    labels.push({at: [v[0] / 2, v[1] / 2], math: `${vName} = ${pairMath(...v)}`, tone: 2, dx: offsets.v[0], dy: offsets.v[1]});
  }
  if (k1 > 0.03) {
    segments.push({from: v, to: [v[0] + d[0] * k1, v[1] + d[1] * k1], tone: 3, arrow: true});
  }
  if (k1 >= 1) {
    const mid = [v[0] + d[0] / 2, v[1] + d[1] / 2];
    labels.push({at: mid, math: `${diffName} = ${pairMath(...d)}`, tone: 3, dx: offsets.d[0], dy: offsets.d[1]});
  }
  if (k2 > 0.03) {
    const from = [v[0] * (1 - k2), v[1] * (1 - k2)];
    segments.push({from, to: [from[0] + d[0], from[1] + d[1]], tone: 3, arrow: true, dashed: true});
  }
  if (k2 >= 1) points.push({at: d, tone: 3, r: 4, label: pairMath(...d), dx: -30, dy: 12});

  if (minus && !playing) {
    segments.push({from: u, to: [u[0] - v[0], u[1] - v[1]], tone: 2, arrow: true, dashed: true});
    labels.push({at: [u[0] - v[0] / 2, u[1] - v[1] / 2], math: `-${vName}`, tone: 2, dx: 22, dy: 4});
  }

  if (tips) {
    points.push({at: u, tone: 0, r: 4, label: tips[0], dx: offsets.tipU[0], dy: offsets.tipU[1]});
    points.push({at: v, tone: 0, r: 4, label: tips[1], dx: offsets.tipV[0], dy: offsets.tipV[1]});
  }

  return (
    <div className={shared.wrapper} data-explorer="vector-difference">
      <div ref={ref}>
        <CartesianPlane
          {...win}
          xUnit={xUnit}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={
            caption ??
            'u (azul) e v (laranja) saem da origem. A seta verde vai da ponta de v até a ponta de u: é u − v, o que falta andar depois de v para chegar ao fim de u. A cópia tracejada é a mesma seta desenhada a partir da origem.'
          }
        />
      </div>
      <div className={shared.readout} aria-live="polite" aria-atomic="true">
        <p className={shared.formula}>
          <Formula math={`${vName} + ${tips ? diffName : `(${diffName})`} = ${pairMath(...v)} + ${pairMath(...d)} = ${pairMath(...u)} = ${uName}`} />
        </p>
        {minus && (
          <p>
            A seta tracejada laranja é <Formula math={`-${vName} = ${pairMath(-v[0], -v[1])}`} />, saindo da ponta de{' '}
            <Formula math={uName} />. Ela termina em <Formula math={pairMath(...d)} />, o mesmo ponto da cópia:{' '}
            <Formula math={`${uName} + (-${vName}) = ${pairMath(...d)}`} />.
          </p>
        )}
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          Ver de novo
        </button>
        {minusButton && (
          <button type="button" onClick={() => setMinus(!minus)} disabled={playing} aria-pressed={minus}>
            {minus ? 'Esconder −v' : 'Ler como u + (−v)'}
          </button>
        )}
      </div>
    </div>
  );
}
