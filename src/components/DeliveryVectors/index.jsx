import React from 'react';
import CartesianPlane from '../CartesianPlane';
import shared from '../mathviz/explorer.module.css';
import useAnimation, {stage} from '../mathviz/useAnimation';

// As quatro corridas do problema motivador da lição 7.28 (Vetores).
//
// mode="routes": os quatro entregadores saem ao mesmo tempo, cada um do seu
//   ponto de saída, e a seta da corrida cresce atrás de cada um. No quadro
//   final ficam as quatro setas, todas de comprimento 5.
// mode="compare": as quatro setas, já coloridas pelo vetor, deslizam sem
//   girar até uma saída comum. As corridas 1 e 2 caem uma em cima da outra
//   (mesmo vetor); a 3 e a 4 apontam para outros lugares. Os contornos
//   cinza mostram onde cada seta estava.

const RUNS = [
  {from: [1, 1], to: [4, 5], tone: 1},
  {from: [5, 3], to: [8, 7], tone: 1},
  {from: [12, 2], to: [9, 6], tone: 2},
  {from: [1, 6], to: [5, 9], tone: 3},
];

// Rótulo de cada seta no quadro de chegada, ao lado da ponta.
const ROUTE_LABELS = [
  {dx: -14, dy: -12},
  {dx: -14, dy: -12},
  {dx: 14, dy: -12},
  {dx: -2, dy: -16},
];

const COMMON = [6, 1];

const lerp = (p, q, k) => [p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k];
const long = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.05;

export default function DeliveryVectors({mode = 'routes', caption}) {
  const duration = mode === 'routes' ? 3.2 : 3.4;
  const {ref, t, play, playing} = useAnimation({duration});

  const segments = [];
  const points = [];
  const labels = [];

  if (mode === 'routes') {
    const k = stage(t, 0.3, duration);
    RUNS.forEach((run, i) => {
      const now = lerp(run.from, run.to, k);
      points.push({at: run.from, tone: 0, r: 3.5});
      if (long(run.from, now)) segments.push({from: run.from, to: now, tone: 1, arrow: true});
      points.push({at: now, tone: 2, r: 5});
      if (k > 0.98) {
        labels.push({at: run.to, math: String(i + 1), ...ROUTE_LABELS[i], fontSize: 15});
      }
    });
  } else {
    const k = stage(t, 0.6, duration - 0.3);
    RUNS.forEach((run, i) => {
      const v = [run.to[0] - run.from[0], run.to[1] - run.from[1]];
      const tail = lerp(run.from, COMMON, k);
      const tip = [tail[0] + v[0], tail[1] + v[1]];
      if (k > 0.02) segments.push({from: run.from, to: run.to, muted: true, dashed: true});
      segments.push({from: tail, to: tip, tone: run.tone, arrow: true});
      if (k < 0.02) {
        labels.push({at: run.to, math: String(i + 1), ...ROUTE_LABELS[i], fontSize: 15, tone: run.tone});
      }
    });
    if (k > 0.98) {
      points.push({at: COMMON, tone: 0, r: 4, label: '\\text{saída comum}', dx: -58, dy: 6});
      labels.push({at: [9, 5], math: '1 \\text{ e } 2', dx: -24, dy: -16, fontSize: 15, tone: 1});
      labels.push({at: [3, 5], math: '3', dx: -4, dy: -16, fontSize: 15, tone: 2});
      labels.push({at: [10, 4], math: '4', dx: 8, dy: 22, fontSize: 15, tone: 3});
    }
  }

  const defaultCaption =
    mode === 'routes'
      ? 'Os quatro entregadores saem juntos, cada um do seu ponto de saída, e a seta de cada corrida cresce atrás dele. O eixo x aponta para o leste e o eixo y para o norte.'
      : 'As quatro setas deslizam, sem girar, até a mesma saída. As corridas 1 e 2 caem uma em cima da outra. A 3 aponta para o oeste, e a 4 fica mais deitada. O tracejado cinza mostra onde cada seta estava.';

  return (
    <div className={shared.wrapper} data-explorer={`delivery-vectors-${mode}`}>
      <div ref={ref}>
        <CartesianPlane
          xMin={0}
          xMax={13}
          yMin={0}
          yMax={10}
          xUnit={30}
          axisLabels={['x', 'y']}
          segments={segments}
          points={points}
          labels={labels}
          caption={caption ?? defaultCaption}
        />
      </div>
      <div className={shared.buttons}>
        <button type="button" onClick={() => play()} disabled={playing}>
          {mode === 'routes' ? 'Ver as corridas de novo' : 'Deslizar as setas de novo'}
        </button>
      </div>
    </div>
  );
}
